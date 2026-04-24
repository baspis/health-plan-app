import { upsertHealthSnapshot, type HealthSnapshot } from '../db/db';
import { refreshHealth } from '../stores/health';

const INGEST_TOKEN_KEY = 'dohyo2-ingest-token';

function getOrCreateToken(): string {
  if (typeof localStorage === 'undefined') return 'local-dev';
  let t = localStorage.getItem(INGEST_TOKEN_KEY);
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem(INGEST_TOKEN_KEY, t);
  }
  return t;
}

export function getIngestToken(): string {
  return getOrCreateToken();
}

function parseNum(v: string | null): number | undefined {
  if (v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function handleIngest(search: string): Promise<boolean> {
  if (!search) return false;
  const params = new URLSearchParams(search);
  if (!params.has('ingest')) return false;

  const token = params.get('token');
  const expected = getOrCreateToken();
  if (token !== expected) {
    console.warn('[ingest] token mismatch, rejecting');
    return false;
  }

  const dateISO = params.get('date') ?? new Date().toISOString().slice(0, 10);
  const snapshot: HealthSnapshot = {
    dateISO,
    weightKg: parseNum(params.get('weight')),
    bodyFatPct: parseNum(params.get('bodyFat')),
    sleepHours: parseNum(params.get('sleep')),
    rhrBpm: parseNum(params.get('rhr')),
    hrvMs: parseNum(params.get('hrv')),
    steps: parseNum(params.get('steps')),
    vo2max: parseNum(params.get('vo2max')),
    workoutMinutes: parseNum(params.get('workoutMin')),
    workoutType: params.get('workoutType') ?? undefined,
    activeEnergyKcal: parseNum(params.get('activeKcal')),
    ingestedAt: Date.now(),
    source: 'shortcuts'
  };

  try {
    await upsertHealthSnapshot(snapshot);
    await refreshHealth();
    if (typeof window !== 'undefined' && 'history' in window) {
      const url = new URL(window.location.href);
      url.searchParams.delete('ingest');
      url.searchParams.delete('token');
      url.searchParams.delete('date');
      url.searchParams.delete('weight');
      url.searchParams.delete('bodyFat');
      url.searchParams.delete('sleep');
      url.searchParams.delete('rhr');
      url.searchParams.delete('hrv');
      url.searchParams.delete('steps');
      url.searchParams.delete('vo2max');
      url.searchParams.delete('workoutMin');
      url.searchParams.delete('workoutType');
      url.searchParams.delete('activeKcal');
      window.history.replaceState({}, '', url.toString());
    }
    return true;
  } catch (e) {
    console.error('[ingest] failed to upsert', e);
    return false;
  }
}
