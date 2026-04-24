import type { HealthSummary } from '../stores/health';
import type { LabResult } from '../db/db';
import { daysSincePlanStart, type PhaseState } from '../stores/phase';

export type GLPConditionId = 'A' | 'B' | 'C' | 'D';

export interface GLPConditionResult {
  id: GLPConditionId;
  label: string;
  description: string;
  met: boolean | 'unknown';
  value?: string;
}

export interface GLPCheckResult {
  milestone: 'month3' | 'month6' | 'month12' | 'before-month3';
  daysSincePlanStart: number;
  primaryConditions: GLPConditionResult[];
  conditionsMet: number;
  adherenceOk: boolean | 'unknown';
  recommendation: string;
}

export function checkGLPStatus(
  phaseState: PhaseState,
  summary: HealthSummary,
  labs: LabResult[],
  now: Date = new Date()
): GLPCheckResult {
  const days = daysSincePlanStart(phaseState, now);

  let milestone: GLPCheckResult['milestone'] = 'before-month3';
  if (days >= 365) milestone = 'month12';
  else if (days >= 180) milestone = 'month6';
  else if (days >= 90) milestone = 'month3';

  const day0Weight = findDay0Weight(labs);
  const current7Avg = summary.weight7Avg;
  const weightLossPct =
    day0Weight && current7Avg ? ((day0Weight - current7Avg) / day0Weight) * 100 : null;

  const day0Waist = findDay0Waist(labs);
  const milestoneWaist = findMilestoneWaist(labs, milestone);
  const waistLossCm = day0Waist && milestoneWaist ? day0Waist - milestoneWaist : null;

  const day0Homa = findHomaIR(labs, 'day0');
  const milestoneHoma = findHomaIR(labs, milestone === 'before-month3' ? 'day0' : milestone);

  const metabolicPairs = computeMetabolicImprovements(labs, milestone);

  const A: GLPConditionResult = {
    id: 'A',
    label: '体重 -5% 以上',
    description: '7 日平均 vs Day 0',
    met: weightLossPct === null ? 'unknown' : weightLossPct >= 5,
    value: weightLossPct !== null ? `${weightLossPct.toFixed(1)}%` : '—'
  };

  const B: GLPConditionResult = {
    id: 'B',
    label: 'ウエスト -3 cm 以上',
    description: '3 回測定の平均',
    met: waistLossCm === null ? 'unknown' : waistLossCm >= 3,
    value: waistLossCm !== null ? `-${waistLossCm.toFixed(1)} cm` : '—'
  };

  const D: GLPConditionResult = {
    id: 'D',
    label: 'HbA1c / TG / ALT / 血圧 2 項目改善',
    description: 'Day 0 比',
    met: metabolicPairs === null ? 'unknown' : metabolicPairs >= 2,
    value: metabolicPairs !== null ? `${metabolicPairs} 項目` : '—'
  };

  const C: GLPConditionResult = {
    id: 'C',
    label: 'HOMA-IR 2.5 以上 → 2.5 未満 または 1.0 以上改善',
    description: '補助指標（単独成功ではない）',
    met:
      day0Homa === null || milestoneHoma === null
        ? 'unknown'
        : (day0Homa >= 2.5 && milestoneHoma < 2.5) || day0Homa - milestoneHoma >= 1.0,
    value:
      day0Homa !== null && milestoneHoma !== null
        ? `${day0Homa.toFixed(1)} → ${milestoneHoma.toFixed(1)}`
        : '—'
  };

  const primary = [A, B, D, C];
  const metCount = primary.filter((c) => c.met === true).length;

  const adherenceOk = evaluateAdherence(summary);

  let recommendation = '';
  if (milestone === 'before-month3') {
    recommendation = 'Month 3 までは現状維持。道標 2 の Today タブで日々を積む';
  } else if (milestone === 'month3') {
    if (adherenceOk === true) {
      recommendation = '遵守は OK（運動 70%+ かつ 体重 -3%+）。Month 6 まで継続';
    } else if (adherenceOk === false) {
      recommendation = '遵守阻害要因を修正（環境・仕事・悲嘆）。薬剤検討は Month 6 から';
    } else {
      recommendation = 'データ不足。継続して Month 6 を待つ';
    }
  } else {
    if (metCount >= 1) {
      recommendation = '生活介入継続を優先（A/B/D のいずれかが達成）';
    } else if (C.met === true) {
      recommendation = '継続（HOMA-IR 補助指標は改善、他も注視）';
    } else if (metCount === 0 && A.met === false && B.met === false && D.met === false) {
      recommendation = 'GLP-1 採用を真剣に検討。精神科医・内科医と相談';
    } else {
      recommendation = 'データ不足。検査結果を入力して再評価';
    }
  }

  return {
    milestone,
    daysSincePlanStart: days,
    primaryConditions: primary,
    conditionsMet: metCount,
    adherenceOk,
    recommendation
  };
}

function findDay0Weight(labs: LabResult[]): number | null {
  const dexa = labs.find((l) => l.kind === 'dexa' && l.milestone === 'day0');
  if (dexa && typeof dexa.payload.weightKg === 'number') return dexa.payload.weightKg;
  const waist = labs.find((l) => l.kind === 'waist' && l.milestone === 'day0');
  if (waist && typeof waist.payload.weightKg === 'number') return waist.payload.weightKg;
  return null;
}

function findDay0Waist(labs: LabResult[]): number | null {
  const entry = labs.find((l) => l.kind === 'waist' && l.milestone === 'day0');
  if (entry && typeof entry.payload.waistCm === 'number') return entry.payload.waistCm;
  return null;
}

function findMilestoneWaist(labs: LabResult[], milestone: string): number | null {
  const entry = labs.find((l) => l.kind === 'waist' && l.milestone === milestone);
  if (entry && typeof entry.payload.waistCm === 'number') return entry.payload.waistCm;
  return null;
}

function findHomaIR(labs: LabResult[], milestone: string): number | null {
  const entry = labs.find((l) => (l.kind === 'blood-ext' || l.kind === 'blood-core') && l.milestone === milestone);
  if (entry && typeof entry.payload.homaIR === 'number') return entry.payload.homaIR;
  return null;
}

function computeMetabolicImprovements(labs: LabResult[], milestone: string): number | null {
  const day0 = labs.find((l) => l.kind === 'blood-core' && l.milestone === 'day0');
  const current = labs.find((l) => l.kind === 'blood-core' && l.milestone === milestone);
  const bpDay0 = labs.find((l) => l.kind === 'bp' && l.milestone === 'day0');
  const bpCurrent = labs.find((l) => l.kind === 'bp' && l.milestone === milestone);
  if (!day0 || !current) return null;

  let improved = 0;
  const checks = [
    ['hba1c', -0.1] as const,
    ['triglyceride', -10] as const,
    ['alt', -3] as const
  ];
  for (const [key, threshold] of checks) {
    const before = day0.payload[key];
    const after = current.payload[key];
    if (typeof before === 'number' && typeof after === 'number' && after - before <= threshold) {
      improved++;
    }
  }
  if (bpDay0 && bpCurrent) {
    const bpBefore = bpDay0.payload.systolicAvg;
    const bpAfter = bpCurrent.payload.systolicAvg;
    if (typeof bpBefore === 'number' && typeof bpAfter === 'number' && bpAfter - bpBefore <= -5) {
      improved++;
    }
  }
  return improved;
}

function evaluateAdherence(summary: HealthSummary): boolean | 'unknown' {
  if (summary.weeklyWorkoutCount === 0 && summary.last7.length === 0) return 'unknown';
  const workoutRate = summary.weeklyWorkoutCount / 5;
  return workoutRate >= 0.7;
}
