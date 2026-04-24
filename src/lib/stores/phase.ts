import { writable } from 'svelte/store';

export type Stage = '0a' | '0b' | '1' | '2' | '3' | '4';

export interface PhaseState {
  stage: Stage;
  stageStartISO: string;
  planStartISO: string;
}

const KEY = 'dohyo2-phase';

function todayISO(d: Date = new Date()): string {
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function loadInitial(): PhaseState {
  const fallback: PhaseState = {
    stage: '0a',
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
    if (!parsed.stage) return fallback;
    return {
      stage: parsed.stage,
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

export function setStage(stage: Stage) {
  phase.update((cur) => ({
    stage,
    stageStartISO: todayISO(),
    planStartISO: cur.planStartISO
  }));
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

export const STAGE_META: Record<Stage, { label: string; jp: string; description: string }> = {
  '0a': { label: 'Stage 0a', jp: '着地期', description: '葬儀後の 14 日間。体重測定も運動もなし。' },
  '0b': { label: 'Stage 0b', jp: '最小ベースライン期', description: '16 日間。朝 7:00 体重測定のみ。' },
  '1': { label: 'Phase 1', jp: 'ランプアップ', description: 'Week 1-4。関節慣らし、軽い有酸素のみ。' },
  '2': { label: 'Phase 2', jp: '橋渡し', description: 'Week 5-8。頻度と時間を増やす。' },
  '3': { label: 'Phase 3', jp: '本格運用', description: 'Week 9+。4 本柱 + α の完全運用。' },
  '4': { label: 'Phase 4', jp: '強化フェーズ', description: 'Month 18+（任意）。筋力週 3、HIIT 週 2。' }
};
