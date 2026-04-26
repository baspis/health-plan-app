import type { Stage } from '../stores/phase';
import type { RestAssessment } from '../judgment/restTrigger';
import { PREP_ITEMS, type PrepItem } from './preparation';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TodoKind =
  | 'rest'
  | 'weigh'
  | 'breakfast'
  | 'walking'
  | 'strength'
  | 'cooldown'
  | 'hiit'
  | 'yoga'
  | 'bento-lunch'
  | 'bento-dinner'
  | 'protein-evening'
  | 'meditation'
  | 'grocery'
  | 'batch'
  | 'family-walk'
  | 'weekly-review'
  | 'prep-item'
  | 'prep-ready'
  | 'prep-weigh-optional';

export interface TodoItem {
  id: string;
  kind: TodoKind;
  startMin: number | null;
  endMin: number | null;
  title: string;
  detail?: string;
  cta?: { label: string; url: string };
  prepItem?: PrepItem;
  durationMin?: number;
}

const APPLE_FITNESS_URL = 'fitnessapp://';
const APPLE_HEALTH_URL = 'x-apple-health://';
const APPLE_WORKOUT_URL = 'itms-apps://apps.apple.com/app/id1208224953';

function m(hour: number, min: number = 0): number {
  return hour * 60 + min;
}

export interface BuildContext {
  stage: Stage;
  dow: DayOfWeek;
  rest: RestAssessment;
  prepCompletedIds: Set<string>;
}

export function buildTodos(ctx: BuildContext): TodoItem[] {
  if (ctx.stage === 'prep') {
    return buildPrepTodos(ctx);
  }
  return buildOperationalTodos(ctx);
}

function buildPrepTodos(ctx: BuildContext): TodoItem[] {
  const remaining = PREP_ITEMS.filter((it) => !ctx.prepCompletedIds.has(it.id));
  const items: TodoItem[] = [];

  // 気が向いたら体重計に乗る（任意、prep でも自動検出は走る）
  items.push({
    id: 'prep-weigh',
    kind: 'prep-weigh-optional',
    startMin: null,
    endMin: null,
    title: '気が向いたら体重計に乗る',
    detail: '無理しなくて OK。乗ったら自動記録される。',
    cta: { label: 'Apple Health', url: APPLE_HEALTH_URL }
  });

  if (remaining.length === 0) {
    items.push({
      id: 'prep-ready',
      kind: 'prep-ready',
      startMin: null,
      endMin: null,
      title: '準備が整いました。Phase 1 を始められます。',
      detail: '「次のフェーズへ進む」を押すと Phase 1（ランプアップ）が始まります。'
    });
    return items;
  }

  const groupOrder: Record<string, number> = { tools: 0, medical: 1, app: 2, environment: 3 };
  const sorted = [...remaining].sort(
    (a, b) => (groupOrder[a.group] ?? 9) - (groupOrder[b.group] ?? 9)
  );
  const top = sorted.slice(0, 3);
  for (const item of top) {
    items.push({
      id: `prep-${item.id}`,
      kind: 'prep-item',
      startMin: null,
      endMin: null,
      title: item.title,
      detail: item.detail,
      prepItem: item,
      cta: item.link ? { label: item.link.label, url: item.link.url } : undefined
    });
  }
  return items;
}

function buildOperationalTodos(ctx: BuildContext): TodoItem[] {
  const items: TodoItem[] = [];
  const stage = ctx.stage;
  const dow = ctx.dow;
  const isWeekday = dow >= 1 && dow <= 5;
  const isSat = dow === 6;
  const isSun = dow === 0;
  const restLevel = ctx.rest.level;

  items.push({
    id: 'weigh',
    kind: 'weigh',
    startMin: m(7, 0),
    endMin: m(7, 5),
    title: '7:00 体重計に乗る',
    detail: 'Eufy → Apple Health 自動転送（30 秒）',
    cta: { label: 'Apple Health', url: APPLE_HEALTH_URL }
  });

  items.push({
    id: 'breakfast',
    kind: 'breakfast',
    startMin: m(7, 30),
    endMin: m(7, 35),
    title: '朝食 + プロテイン 1 杯 + MV 1 粒',
    detail: '卵 2 + 納豆 + ヨーグルト + プロテイン（固定メニュー）'
  });

  if (isWeekday) {
    addWeekdayWorkout(items, stage, dow, restLevel);
    items.push({
      id: 'bento-lunch',
      kind: 'bento-lunch',
      startMin: m(12, 0),
      endMin: m(12, 10),
      title: '昼の弁当',
      detail: '3 パターンローテ（A サバ / B 鶏胸 / C 豚ヒレ）、レンジ 4:30'
    });
    items.push({
      id: 'bento-dinner',
      kind: 'bento-dinner',
      startMin: m(19, 0),
      endMin: m(19, 10),
      title: '夕の弁当',
      detail: '同じ 3 パターンローテ'
    });
    items.push({
      id: 'protein-evening',
      kind: 'protein-evening',
      startMin: m(19, 40),
      endMin: m(19, 41),
      title: '夕プロテイン半スクープ',
      detail: '+12 g、筋合成シグナル'
    });
    if (dow === 1 || dow === 3 || dow === 5) {
      items.push({
        id: 'meditation',
        kind: 'meditation',
        startMin: m(22, 30),
        endMin: m(22, 40),
        title: '任意メディテーション 10 分',
        detail: '就寝前、SAD 寛解維持',
        cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
      });
    }
  }

  if (isSat) {
    items.push({
      id: 'grocery',
      kind: 'grocery',
      startMin: m(10, 0),
      endMin: m(11, 0),
      title: 'ベルクスへ徒歩買い物',
      detail: '息子と徒歩往復、片道 15 分・歩数 5,000 相当'
    });
  }

  if (isSun) {
    items.push({
      id: 'batch',
      kind: 'batch',
      startMin: m(9, 0),
      endMin: m(11, 0),
      title: '週末バッチ調理 120 分',
      detail: '玄米 5.5 合 + ゆで卵 14 + 主菜 12 + パッキング'
    });
    items.push({
      id: 'family-walk',
      kind: 'family-walk',
      startMin: m(14, 0),
      endMin: m(14, 45),
      title: '息子との近所散策',
      detail: 'NEAT + 家族時間（Cardio 主目的ではない）'
    });
    items.push({
      id: 'weekly-review',
      kind: 'weekly-review',
      startMin: m(21, 0),
      endMin: m(21, 1),
      title: '週次レビュー 30 秒',
      detail: 'Apple Health で体重 7 日平均 + VO2max + 週運動時間を見るだけ',
      cta: { label: 'Apple Health', url: APPLE_HEALTH_URL }
    });
  }

  return items.sort((a, b) => {
    const aStart = a.startMin ?? 99999;
    const bStart = b.startMin ?? 99999;
    return aStart - bStart;
  });
}

function addWeekdayWorkout(
  items: TodoItem[],
  stage: Stage,
  dow: DayOfWeek,
  restLevel: 'normal' | 'level1' | 'level2'
) {
  const walkStart = m(9, 5);
  const walkEnd = m(9, 35);

  if (restLevel === 'level1') {
    items.push({
      id: 'rest-day',
      kind: 'rest',
      startMin: walkStart,
      endMin: walkEnd,
      title: '今日は休む（Level 1 完全休養）',
      detail: '運動はゼロ。プロテイン・MV だけ取って休む。'
    });
    return;
  }

  let walkTitle = 'ウォーキング 30 分';
  let walkDetail = '本太 4 丁目公園コース、速歩ペース（心拍 Zone 2 目安）';
  let walkDuration = 30;
  if (stage === '1') {
    walkTitle = 'ウォーキング 15-20 分';
    walkDetail = 'ランプアップ期、関節慣らし優先';
    walkDuration = 18;
  } else if (stage === '2') {
    walkTitle = 'ウォーキング 20-25 分';
    walkDetail = '徐々に時間を増やす';
    walkDuration = 22;
  }

  if (restLevel === 'level2') {
    walkTitle = 'ウォーキング 5-15 分のみ';
    walkDetail = 'Level 2 軽運動のみ。筋トレ・HIIT は中止。';
    walkDuration = 12;
  }

  items.push({
    id: 'walking',
    kind: 'walking',
    startMin: walkStart,
    endMin: walkEnd,
    title: walkTitle,
    detail: walkDetail,
    durationMin: walkDuration,
    cta: { label: 'Watch ワークアウト', url: APPLE_WORKOUT_URL }
  });

  if (restLevel === 'level2') return;

  if (stage !== '3' && stage !== '4') return;

  if (dow === 2 || dow === 4) {
    items.push({
      id: 'strength',
      kind: 'strength',
      startMin: m(9, 35),
      endMin: m(10, 5),
      title: '筋力トレーニング 25-30 分',
      detail: 'Month 6+ はバンド 3 段階、停滞時にダンベル / ジム検討',
      durationMin: 27,
      cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
    });
    items.push({
      id: 'cooldown',
      kind: 'cooldown',
      startMin: m(10, 5),
      endMin: m(10, 10),
      title: 'マインドフルクールダウン 5 分',
      detail: '副交感神経切替',
      durationMin: 5,
      cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
    });
  }
  if (dow === 3) {
    items.push({
      id: 'hiit',
      kind: 'hiit',
      startMin: m(9, 35),
      endMin: m(9, 55),
      title: 'HIIT 低強度 20 分',
      detail: 'Low Impact 必須（アパート 2F）',
      durationMin: 20,
      cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
    });
  }
  if (dow === 5) {
    items.push({
      id: 'yoga',
      kind: 'yoga',
      startMin: m(9, 35),
      endMin: m(9, 55),
      title: 'ヨガ 15-20 分',
      detail: '柔軟性・リカバリー',
      durationMin: 18,
      cta: { label: 'Apple Fitness+', url: APPLE_FITNESS_URL }
    });
  }
}

