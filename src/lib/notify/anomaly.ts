import type { HealthSummary } from '../stores/health';
import { db, type NotificationLog } from '../db/db';

export interface AnomalySignal {
  kind: NotificationLog['kind'];
  severity: NotificationLog['severity'];
  message: string;
}

export function detectAnomalies(summary: HealthSummary): AnomalySignal[] {
  const signals: AnomalySignal[] = [];

  if (summary.weight14Trend === 'up') {
    signals.push({
      kind: 'weight-up',
      severity: 'warn',
      message: '体重 7 日平均が 2 週間連続で上昇しています。自由食・食行動を見直す時期かもしれません。'
    });
  }

  const sleepShort3 = summary.last7.slice(0, 3).every((s) => typeof s.sleepHours === 'number' && s.sleepHours < 6.0);
  if (sleepShort3 && summary.last7.length >= 3) {
    signals.push({
      kind: 'sleep-short',
      severity: 'warn',
      message: '睡眠 <6h が 3 日連続。今日は筋トレ・HIIT を中止し、軽運動のみに切り替えてください（ADR-021 Level 2）。'
    });
  }

  if (summary.hrvAvg7 !== null && summary.hrvAvg30 !== null && summary.hrvAvg30 - summary.hrvAvg7 >= 10) {
    signals.push({
      kind: 'hrv-drop',
      severity: 'alert',
      message: 'HRV 7 日平均が 30 日平均より 10 ms 以上低下。CNS 疲労の可能性。今日は完全休養も視野に。'
    });
  }

  const weeksData = summary.last7.length >= 7;
  if (weeksData) {
    const workoutRate = summary.weeklyWorkoutCount / 5;
    if (workoutRate < 0.5) {
      signals.push({
        kind: 'workout-low',
        severity: 'info',
        message: `運動実施率が直近 1 週間で ${Math.round(workoutRate * 100)}%。阻害要因を振り返ってみましょう。`
      });
    }
  }

  return signals;
}

export async function logAnomalies(signals: AnomalySignal[]): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  for (const sig of signals) {
    const existing = await db.notifications
      .where('dateISO')
      .equals(today)
      .and((n) => n.kind === sig.kind)
      .first();
    if (existing) continue;
    await db.notifications.add({
      dateISO: today,
      kind: sig.kind,
      severity: sig.severity,
      message: sig.message
    });
  }
}

export async function getRecentNotifications(days: number = 14): Promise<NotificationLog[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  return await db.notifications.where('dateISO').above(cutoffISO).reverse().sortBy('dateISO');
}
