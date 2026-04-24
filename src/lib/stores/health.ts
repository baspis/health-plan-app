import { writable } from 'svelte/store';
import { db, type HealthSnapshot } from '../db/db';

export interface HealthSummary {
  latest: HealthSnapshot | null;
  last7: HealthSnapshot[];
  last30: HealthSnapshot[];
  last90: HealthSnapshot[];
  weeklyWorkoutCount: number;
  avgSleepHours7: number | null;
  rhrAvg14: number | null;
  hrvAvg7: number | null;
  hrvAvg30: number | null;
  vo2maxTrend90: 'up' | 'flat' | 'down' | 'unknown';
  weight7Avg: number | null;
  weight14Trend: 'up' | 'flat' | 'down' | 'unknown';
}

const EMPTY: HealthSummary = {
  latest: null,
  last7: [],
  last30: [],
  last90: [],
  weeklyWorkoutCount: 0,
  avgSleepHours7: null,
  rhrAvg14: null,
  hrvAvg7: null,
  hrvAvg30: null,
  vo2maxTrend90: 'unknown',
  weight7Avg: null,
  weight14Trend: 'unknown'
};

export const health = writable<HealthSummary>(EMPTY);

function avg(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => typeof v === 'number' && isFinite(v));
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function trend(values: number[]): 'up' | 'flat' | 'down' | 'unknown' {
  if (values.length < 2) return 'unknown';
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const f = avg(firstHalf);
  const s = avg(secondHalf);
  if (f === null || s === null) return 'unknown';
  const diff = s - f;
  const threshold = Math.abs(f) * 0.005;
  if (Math.abs(diff) < threshold) return 'flat';
  return diff > 0 ? 'up' : 'down';
}

export async function refreshHealth(): Promise<void> {
  try {
    const all = await db.healthSnapshots.orderBy('dateISO').reverse().toArray();
    if (all.length === 0) {
      health.set(EMPTY);
      return;
    }
    const last7 = all.slice(0, 7);
    const last30 = all.slice(0, 30);
    const last90 = all.slice(0, 90);

    const weeklyWorkoutCount = last7.reduce(
      (sum, s) => sum + (s.workoutMinutes && s.workoutMinutes > 0 ? 1 : 0),
      0
    );
    const avgSleepHours7 = avg(last7.map((s) => s.sleepHours));
    const rhrAvg14 = avg(last30.slice(0, 14).map((s) => s.rhrBpm));
    const hrvAvg7 = avg(last7.map((s) => s.hrvMs));
    const hrvAvg30 = avg(last30.map((s) => s.hrvMs));
    const vo2maxValues = last90.map((s) => s.vo2max).filter((v): v is number => typeof v === 'number');
    const vo2maxTrend90 = trend(vo2maxValues.slice().reverse());
    const weight14 = last30.slice(0, 14).map((s) => s.weightKg).filter((v): v is number => typeof v === 'number');
    const weight7Avg = avg(last7.map((s) => s.weightKg));
    const weight14Trend = trend(weight14.slice().reverse());

    health.set({
      latest: all[0],
      last7,
      last30,
      last90,
      weeklyWorkoutCount,
      avgSleepHours7,
      rhrAvg14,
      hrvAvg7,
      hrvAvg30,
      vo2maxTrend90,
      weight7Avg,
      weight14Trend
    });
  } catch (e) {
    console.error('[health] refresh failed', e);
    health.set(EMPTY);
  }
}
