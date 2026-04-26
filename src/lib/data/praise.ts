import type { TodoKind } from './todoBuilder';

const POOL: Partial<Record<TodoKind, string[]>> = {
  weigh: [
    'いい朝',
    '今日も計れた',
    '記録は積もる',
    'ナイス習慣',
    '今日も一歩'
  ],
  'prep-weigh-optional': [
    '気が向いたんだね',
    '記録できた、嬉しい',
    'ナイス',
    'ありがとう、自分'
  ],
  walking: [
    'お疲れさま',
    '今日もいいペース',
    '歩けた、それでいい',
    '足が動いた、十分',
    '良い 30 分だった',
    '気持ちいい朝の運動'
  ],
  strength: [
    'いい筋トレ',
    'ナイス、効いてる',
    '体が応えてくれてる',
    '良いセットだった',
    '筋肉が喜んでる'
  ],
  cooldown: [
    'いい切替',
    '副交感に乗った',
    'お疲れさま',
    'リカバリー完了'
  ],
  hiit: [
    '心拍ナイス',
    '良い 20 分',
    'お疲れさま',
    'いい刺激入った'
  ],
  yoga: [
    'いいヨガ',
    '体が伸びた',
    'リセット完了',
    'いい週末前の整え'
  ],
  meditation: [
    '良い 10 分',
    '頭が静かになった',
    'ナイスルーチン'
  ],
  grocery: [
    '息子と良い時間',
    'いい歩数',
    'お疲れさま'
  ],
  'family-walk': [
    '家族時間ナイス',
    'いい散策',
    '歩いて良い 1 日'
  ]
};

const FALLBACK = 'よくやった';

export function pickPraise(kind: TodoKind, dateISO: string): string {
  const pool = POOL[kind];
  if (!pool || pool.length === 0) return FALLBACK;
  const seed = hashString(`${kind}-${dateISO}`);
  return pool[seed % pool.length];
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0);
}
