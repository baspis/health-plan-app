import { writable } from 'svelte/store';
import { db } from '../db/db';

export type Stage = 'prep' | '1' | '2' | '3' | '4';

export interface PhaseState {
  stage: Stage;
  stageStartISO: string;
  planStartISO: string;
}

const KEY = 'dohyo2-phase';
const TOKEN_KEY = 'dohyo2-ingest-token';

function todayISO(d: Date = new Date()): string {
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function normalizeStage(raw: unknown): Stage {
  if (raw === '1' || raw === '2' || raw === '3' || raw === '4') return raw;
  // 旧 '0a' / '0b' は prep に正規化（ADR-028 マイグレーション）
  return 'prep';
}

function loadInitial(): PhaseState {
  const fallback: PhaseState = {
    stage: 'prep',
    stageStartISO: todayISO(),
    planStartISO: todayISO()
  };
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return {
      stage: normalizeStage(parsed.stage),
      stageStartISO: parsed.stageStartISO ?? todayISO(),
      planStartISO: parsed.planStartISO ?? parsed.stageStartISO ?? todayISO()
    };
  } catch {
    return fallback;
  }
}

export const phase = writable<PhaseState>(loadInitial());

phase.subscribe((v) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(v));
  }
});

const STAGE_ORDER: Stage[] = ['prep', '1', '2', '3', '4'];

export function nextStage(current: Stage): Stage | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

export function previousStage(current: Stage): Stage | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return STAGE_ORDER[idx - 1];
}

export function setStage(stage: Stage) {
  phase.update((cur) => ({
    stage,
    stageStartISO: todayISO(),
    planStartISO:
      stage === '1' && cur.stage === 'prep' ? todayISO() : cur.planStartISO
  }));
}

export function advanceStage() {
  phase.update((cur) => {
    const next = nextStage(cur.stage);
    if (!next) return cur;
    return {
      stage: next,
      stageStartISO: todayISO(),
      planStartISO: next === '1' && cur.stage === 'prep' ? todayISO() : cur.planStartISO
    };
  });
}

export function resetToPrep() {
  const today = todayISO();
  phase.set({
    stage: 'prep',
    stageStartISO: today,
    planStartISO: today
  });
}

export async function resetAll(): Promise<void> {
  try {
    await db.delete();
  } catch (e) {
    console.error('[resetAll] db.delete failed', e);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export function daysSincePlanStart(state: PhaseState, now: Date = new Date()): number {
  const start = new Date(state.planStartISO + 'T00:00:00');
  const today = new Date(todayISO(now) + 'T00:00:00');
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86_400_000));
}

export function daysSinceStageStart(state: PhaseState, now: Date = new Date()): number {
  const start = new Date(state.stageStartISO + 'T00:00:00');
  const today = new Date(todayISO(now) + 'T00:00:00');
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86_400_000));
}

export interface StageMetaEntry {
  label: string;
  jp: string;
  short: string;
  description: string;
}

export const STAGE_META: Record<Stage, StageMetaEntry> = {
  prep: {
    label: 'Prep',
    jp: '事前準備期',
    short: '準備',
    description: '道具を揃え、検査を予約する。葬儀・悲嘆・回復もここに含む。気が向いたら体重計 OK。'
  },
  '1': {
    label: 'Phase 1',
    jp: 'ランプアップ',
    short: 'ランプアップ',
    description: 'ウォーキング 15-20 分から。関節慣らし優先、曜日別運動はまだ。'
  },
  '2': {
    label: 'Phase 2',
    jp: '橋渡し',
    short: '橋渡し',
    description: 'ウォーキング 20-25 分。頻度を上げる。'
  },
  '3': {
    label: 'Phase 3',
    jp: '本格運用',
    short: '本格運用',
    description: '4 本柱（Walking / Strength / HIIT / Yoga）+ 弁当ローテ完全運用。'
  },
  '4': {
    label: 'Phase 4',
    jp: '強化',
    short: '強化',
    description: '任意。筋力週 3、HIIT 週 2。'
  }
};

export const STAGE_SEQUENCE: Stage[] = STAGE_ORDER;
