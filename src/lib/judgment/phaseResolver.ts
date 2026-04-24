import type { PhaseState, Stage } from '../stores/phase';
import { daysSincePlanStart, daysSinceStageStart } from '../stores/phase';

export interface StageRecommendation {
  currentStage: Stage;
  recommendedStage: Stage | null;
  reason: string;
}

export function recommendStage(state: PhaseState, now: Date = new Date()): StageRecommendation {
  const planDays = daysSincePlanStart(state, now);
  const stageDays = daysSinceStageStart(state, now);

  if (state.stage === '0a') {
    if (stageDays >= 14) {
      return {
        currentStage: '0a',
        recommendedStage: '0b',
        reason: '着地期 14 日を経過。最小ベースライン期（0b）に進める'
      };
    }
    return { currentStage: '0a', recommendedStage: null, reason: `Day ${stageDays}/14 着地期継続中` };
  }

  if (state.stage === '0b') {
    if (stageDays >= 16) {
      return {
        currentStage: '0b',
        recommendedStage: '1',
        reason: '最小ベースライン 16 日を経過。Day 30 判定で条件満たせば Phase 1 へ'
      };
    }
    return { currentStage: '0b', recommendedStage: null, reason: `Day ${stageDays}/16 最小ベースライン中` };
  }

  if (state.stage === '1') {
    if (stageDays >= 28) {
      return {
        currentStage: '1',
        recommendedStage: '2',
        reason: 'ランプアップ 4 週経過。Phase 2 橋渡しへ'
      };
    }
    return { currentStage: '1', recommendedStage: null, reason: `Week ${Math.floor(stageDays / 7) + 1} ランプアップ中` };
  }

  if (state.stage === '2') {
    if (stageDays >= 28) {
      return {
        currentStage: '2',
        recommendedStage: '3',
        reason: 'Phase 2 橋渡し 4 週経過。Phase 3 本格運用へ'
      };
    }
    return { currentStage: '2', recommendedStage: null, reason: `Week ${Math.floor(stageDays / 7) + 5} 橋渡し中` };
  }

  if (state.stage === '3') {
    if (planDays >= 540) {
      return {
        currentStage: '3',
        recommendedStage: '4',
        reason: 'Month 18 到達。Phase 4 強化フェーズ検討可（任意）'
      };
    }
    return { currentStage: '3', recommendedStage: null, reason: `Month ${Math.floor(planDays / 30) + 1} Phase 3 本格運用中` };
  }

  return { currentStage: state.stage, recommendedStage: null, reason: `Phase 4 運用中（Month ${Math.floor(planDays / 30) + 1}）` };
}
