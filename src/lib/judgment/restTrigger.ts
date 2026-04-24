import type { HealthSummary } from '../stores/health';

export type RestLevel = 'normal' | 'level2' | 'level1';

export interface RestAssessment {
  level: RestLevel;
  reasons: string[];
  badge: string;
  description: string;
}

export function assessRest(summary: HealthSummary): RestAssessment {
  const reasons: string[] = [];
  const latest = summary.latest;

  const jointPain24h = false;
  const familyEmergency = false;
  const rhrAbnormal = rhrIsElevated(summary);
  const hrvAbnormal = hrvIsDropped(summary);

  if (jointPain24h || familyEmergency || (rhrAbnormal && hrvAbnormal)) {
    return {
      level: 'level1',
      reasons: [rhrAbnormal && hrvAbnormal ? 'RHR+HRV 両方異常' : '関節痛 or 家族緊急'],
      badge: 'Level 1 完全休養',
      description: '今日は運動ゼロ。プロテイン・ビタミンだけは飲む。'
    };
  }

  const sleepShort = typeof latest?.sleepHours === 'number' && latest.sleepHours < 6.0;
  const morningIllness = false;

  if (sleepShort) reasons.push('前夜の睡眠 < 6.0h');
  if (rhrAbnormal) reasons.push('RHR +5 bpm 以上');
  if (hrvAbnormal) reasons.push('HRV 7 日平均が 30 日平均より >10 ms 低下');
  if (morningIllness) reasons.push('朝のだるさ・喉の違和感');

  if (reasons.length > 0) {
    return {
      level: 'level2',
      reasons,
      badge: 'Level 2 軽運動のみ',
      description: '筋トレ・HIIT は中止。ウォーキング 5-15 分のみ OK。'
    };
  }

  return {
    level: 'normal',
    reasons: [],
    badge: '通常運用 OK',
    description: '予定通り進めて大丈夫。'
  };
}

function rhrIsElevated(summary: HealthSummary): boolean {
  if (!summary.latest || typeof summary.latest.rhrBpm !== 'number') return false;
  if (!summary.rhrAvg14) return false;
  return summary.latest.rhrBpm - summary.rhrAvg14 >= 5;
}

function hrvIsDropped(summary: HealthSummary): boolean {
  if (!summary.hrvAvg7 || !summary.hrvAvg30) return false;
  return summary.hrvAvg30 - summary.hrvAvg7 >= 10;
}
