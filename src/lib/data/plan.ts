import type { Stage } from '../stores/phase';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface PlannedAction {
  id: string;
  title: string;
  subtitle?: string;
  durationMin?: number;
  cta?: { label: string; url: string };
}

export interface TimeSlot {
  label: string;
  startMin: number;
  endMin: number;
  action: PlannedAction;
}

const APPLE_FITNESS_URL = 'fitnessapp://';
const APPLE_HEALTH_URL = 'x-apple-health://';
const APPLE_WORKOUT_URL = 'itms-apps://apps.apple.com/app/id1208224953';

export const WALKING: PlannedAction = {
  id: 'walk',
  title: 'ウォーキング 30 分',
  subtitle: '本太 4 丁目公園コース、速歩ペース（心拍 Zone 2 目安）',
  durationMin: 30,
  cta: { label: 'Watch ワークアウト', url: APPLE_WORKOUT_URL }
};

export const STRENGTH: PlannedAction = {
  id: 'strength',
  title: 'AF+ 筋力トレーニング 25-30 分',
  subtitle: 'Month 6+ はバンド 3 段階（ADR-018）、plateau 後にダンベル / ジム',
  durationMin: 27,
  cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
};

export const MINDFUL_COOLDOWN: PlannedAction = {
  id: 'cooldown',
  title: 'マインドフルクールダウン 5 分',
  subtitle: '筋トレ後、副交感神経切替',
  durationMin: 5,
  cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
};

export const HIIT: PlannedAction = {
  id: 'hiit',
  title: 'AF+ HIIT 低強度 20 分',
  subtitle: 'Low Impact 必須（アパート 2F）',
  durationMin: 20,
  cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
};

export const YOGA: PlannedAction = {
  id: 'yoga',
  title: 'AF+ ヨガ 15-20 分',
  subtitle: '柔軟性・リカバリー',
  durationMin: 18,
  cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
};

export const WEIGH: PlannedAction = {
  id: 'weigh',
  title: '体重測定 30 秒',
  subtitle: '起床直後トイレ後、Eufy → Apple Health 自動転送',
  durationMin: 1,
  cta: { label: 'Apple Health', url: APPLE_HEALTH_URL }
};

export const BREAKFAST: PlannedAction = {
  id: 'breakfast',
  title: '朝食 + プロテイン 1 杯 + MV 1 粒',
  subtitle: '3 分、固定メニュー（卵 2 + 納豆 + ヨーグルト + プロテイン）',
  durationMin: 4
};

export const BENTO: PlannedAction = {
  id: 'bento',
  title: '弁当（3 パターンローテ）',
  subtitle: 'A サバ / B 鶏胸 / C 豚ヒレ、レンジ 4:30',
  durationMin: 5
};

export const EVENING_PROTEIN: PlannedAction = {
  id: 'evening-protein',
  title: '夕プロテイン半スクープ',
  subtitle: '30 秒、+12 g P、筋合成シグナル',
  durationMin: 1
};

export const GROCERY: PlannedAction = {
  id: 'grocery',
  title: 'ベルクス往復（息子と徒歩）',
  subtitle: '片道 15 分、歩数 5,000 相当',
  durationMin: 60
};

export const BATCH_COOK: PlannedAction = {
  id: 'batch',
  title: '週末バッチ調理 120 分',
  subtitle: '玄米 5.5 合 + ゆで卵 14 + 主菜 12 + パッキング',
  durationMin: 120
};

export const FAMILY_WALK: PlannedAction = {
  id: 'family-walk',
  title: '息子との近所散策',
  subtitle: 'NEAT + 家族時間の複利化（Cardio 主目的ではない）',
  durationMin: 40
};

export const WEEKLY_REVIEW: PlannedAction = {
  id: 'weekly-review',
  title: '週次レビュー 30 秒',
  subtitle: 'Apple Health の体重 7 日平均 + VO2max トレンド + 道標 2 通知履歴を目視',
  durationMin: 1,
  cta: { label: 'Apple Health', url: APPLE_HEALTH_URL }
};

export const MEDITATION: PlannedAction = {
  id: 'meditation',
  title: 'AF+ メディテーション 10 分（任意）',
  subtitle: 'SAD 寛解維持、就寝前',
  durationMin: 10,
  cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
};

function minutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

export function getDayTimeline(dow: DayOfWeek, stage: Stage): TimeSlot[] {
  if (stage === '0a') {
    return [
      {
        label: '着地期',
        startMin: minutes(0, 0),
        endMin: minutes(23, 59),
        action: {
          id: 'rest',
          title: '今日は何もしなくていい',
          subtitle: '急性悲嘆の着地を待つ 14 日間。体重測定も運動もなし。'
        }
      }
    ];
  }

  if (stage === '0b') {
    return [
      {
        label: '朝',
        startMin: minutes(7, 0),
        endMin: minutes(7, 5),
        action: WEIGH
      },
      {
        label: '昼 or 夕',
        startMin: minutes(12, 0),
        endMin: minutes(20, 0),
        action: {
          id: 'light-walk',
          title: '無理のない散歩 15-20 分',
          subtitle: 'できた日だけ、時間帯自由',
          durationMin: 18
        }
      }
    ];
  }

  const isWeekday = dow >= 1 && dow <= 5;
  const isSat = dow === 6;
  const isSun = dow === 0;

  if (isWeekday) {
    const morning: TimeSlot[] = [
      { label: '朝', startMin: minutes(7, 0), endMin: minutes(7, 5), action: WEIGH },
      { label: '朝食', startMin: minutes(7, 30), endMin: minutes(7, 35), action: BREAKFAST },
      { label: '午前運動', startMin: minutes(9, 5), endMin: minutes(9, 35), action: WALKING }
    ];

    const midday: TimeSlot[] = [
      { label: '昼', startMin: minutes(12, 0), endMin: minutes(12, 10), action: BENTO }
    ];

    const evening: TimeSlot[] = [
      { label: '夕', startMin: minutes(19, 0), endMin: minutes(19, 10), action: BENTO },
      { label: '夕プロテイン', startMin: minutes(19, 40), endMin: minutes(19, 41), action: EVENING_PROTEIN }
    ];

    if (stage === '1') {
      morning[2] = {
        ...morning[2],
        action: {
          ...WALKING,
          title: 'ウォーキング 15-20 分',
          subtitle: 'ランプアップ期。関節慣らし優先'
        }
      };
      return [...morning, ...midday, ...evening];
    }

    if (stage === '2') {
      morning[2] = {
        ...morning[2],
        action: {
          ...WALKING,
          title: 'ウォーキング 20-25 分',
          subtitle: '徐々に時間を増やす'
        }
      };
    }

    // Phase 3 / 4: 本格運用
    if (dow === 2 || dow === 4) {
      morning.push({
        label: '午前筋力',
        startMin: minutes(9, 35),
        endMin: minutes(10, 5),
        action: STRENGTH
      });
      morning.push({
        label: 'クールダウン',
        startMin: minutes(10, 5),
        endMin: minutes(10, 10),
        action: MINDFUL_COOLDOWN
      });
    }
    if (dow === 3) {
      morning.push({
        label: '午前 HIIT',
        startMin: minutes(9, 35),
        endMin: minutes(9, 55),
        action: HIIT
      });
    }
    if (dow === 5) {
      morning.push({
        label: '午前ヨガ',
        startMin: minutes(9, 35),
        endMin: minutes(9, 55),
        action: YOGA
      });
    }
    if (dow === 1 || dow === 3 || dow === 5) {
      evening.push({
        label: '任意メディテーション',
        startMin: minutes(22, 30),
        endMin: minutes(22, 40),
        action: MEDITATION
      });
    }

    return [...morning, ...midday, ...evening];
  }

  if (isSat) {
    return [
      { label: '朝', startMin: minutes(7, 0), endMin: minutes(7, 5), action: WEIGH },
      { label: '朝食', startMin: minutes(7, 30), endMin: minutes(7, 35), action: BREAKFAST },
      { label: '買い物', startMin: minutes(10, 0), endMin: minutes(11, 0), action: GROCERY }
    ];
  }

  if (isSun) {
    return [
      { label: '朝', startMin: minutes(7, 0), endMin: minutes(7, 5), action: WEIGH },
      { label: '朝食', startMin: minutes(7, 30), endMin: minutes(7, 35), action: BREAKFAST },
      { label: 'バッチ調理', startMin: minutes(9, 0), endMin: minutes(11, 0), action: BATCH_COOK },
      { label: '午後散策', startMin: minutes(14, 0), endMin: minutes(14, 45), action: FAMILY_WALK },
      { label: '週次レビュー', startMin: minutes(21, 0), endMin: minutes(21, 1), action: WEEKLY_REVIEW }
    ];
  }

  return [];
}

export interface Milestone {
  id: string;
  label: string;
  sub: string;
  stageStart: Stage;
  daysFromPlanStart: number;
  indicators: string[];
}

export const MILESTONES: Milestone[] = [
  { id: '0a', label: '着地期', sub: 'Day 0a 14 日間', stageStart: '0a', daysFromPlanStart: 0, indicators: ['体重測定なし', '運動なし'] },
  { id: '0b', label: '最小ベースライン', sub: 'Day 14-29', stageStart: '0b', daysFromPlanStart: 14, indicators: ['7:00 体重測定', '散歩 15-20 分'] },
  { id: 'day30', label: 'Day 30 判定', sub: '段階 1 本格開始', stageStart: '1', daysFromPlanStart: 30, indicators: ['睡眠 6.0h+ 安定', '仕事復帰'] },
  { id: 'week5', label: 'Week 5', sub: 'Phase 3 本格運用', stageStart: '3', daysFromPlanStart: 65, indicators: ['4 本柱 + α'] },
  { id: 'month3', label: 'Month 3', sub: '3 ヶ月レビュー', stageStart: '3', daysFromPlanStart: 90, indicators: ['体重 -3〜5%', 'VO2max トレンド確認'] },
  { id: 'month6', label: 'Month 6', sub: 'DEXA 2 回目 + GLP-1 判定', stageStart: '3', daysFromPlanStart: 180, indicators: ['体重 -5〜10%', 'Month 6 DEXA', 'GLP-1 ADR-020 判定'] },
  { id: 'month12', label: 'Month 12', sub: '12 ヶ月レビュー', stageStart: '3', daysFromPlanStart: 365, indicators: ['体重 -10〜15%', 'BMI <28', 'DEXA 3 回目'] },
  { id: 'month18', label: 'Month 18', sub: 'Phase 4 判断', stageStart: '4', daysFromPlanStart: 540, indicators: ['86-88 kg、BF 20-22%', 'Phase 4 導入判断'] },
  { id: 'month24', label: 'Month 24', sub: '2 年目', stageStart: '4', daysFromPlanStart: 730, indicators: ['82-85 kg、BF 17-19%'] },
  { id: 'month36', label: 'Sweet Spot', sub: '36 ヶ月目標', stageStart: '4', daysFromPlanStart: 1095, indicators: ['80 kg / BF 15% / ウエスト 80 cm / LBM 68 kg'] }
];
