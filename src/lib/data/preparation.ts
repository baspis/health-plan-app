export type PrepGroup = 'tools' | 'medical' | 'app' | 'environment';

export interface PrepItem {
  id: string;
  group: PrepGroup;
  title: string;
  detail?: string;
  cost?: string;
  link?: { label: string; url: string };
  optional?: boolean;
}

export interface PrepGroupMeta {
  id: PrepGroup;
  label: string;
  jp: string;
  description: string;
}

export const PREP_GROUPS: PrepGroupMeta[] = [
  {
    id: 'tools',
    label: 'Tools',
    jp: '道具を揃える',
    description: 'Day 0 から使う必須器具を購入。Brooks Ghost MAX と Eufy 体組成計は現保有想定。'
  },
  {
    id: 'medical',
    label: 'Medical',
    jp: '医療スクリーニング予約',
    description: '父軌道回避のためのベースライン検査。受診前に予約だけ済ませる。'
  },
  {
    id: 'app',
    label: 'App',
    jp: '道標 2 セットアップ',
    description: '本アプリと iOS Shortcuts で Apple Health 自動同期を有効化する。'
  },
  {
    id: 'environment',
    label: 'Environment',
    jp: '環境整備',
    description: 'WillPower を使わない物理環境を作る。'
  }
];

export const PREP_ITEMS: PrepItem[] = [
  // ===== Tools (8 items) =====
  {
    id: 'tool-bands',
    group: 'tools',
    title: 'レジスタンスバンド 3 段階セット',
    detail: '軽・中・強の 3 本構成、Month 6+ から使用。アパート 2F 静音。',
    cost: '¥5,000-6,000',
    link: { label: 'Amazon で検索', url: 'https://www.amazon.co.jp/s?k=resistance+bands+3+set' }
  },
  {
    id: 'tool-yogamat',
    group: 'tools',
    title: 'ヨガマット 12mm 厚 NBR 両面エンボス',
    detail: '180-183cm、110kg 対応、アパート 2F 防音。',
    cost: '¥2,500-3,500'
  },
  {
    id: 'tool-shaker',
    group: 'tools',
    title: 'プロテインシェイカー',
    detail: 'マイプロテイン Metal Shaker など。',
    cost: '¥800-1,500'
  },
  {
    id: 'tool-bottle',
    group: 'tools',
    title: '1L 水筒 サーモス JNR-1000',
    detail: '真空断熱ケータイマグ。デスク常設用。',
    cost: '¥3,000'
  },
  {
    id: 'tool-bento',
    group: 'tools',
    title: '弁当コンテナ 700ml × 20',
    detail: 'ジップロック 10 個入 × 2 セット、週 12 個回転。',
    cost: '¥4,000'
  },
  {
    id: 'tool-rice',
    group: 'tools',
    title: '玄米小分けコンテナ 500ml × 4',
    detail: 'ジップロック 4 個入。',
    cost: '¥800'
  },
  {
    id: 'tool-bp',
    group: 'tools',
    title: '家庭血圧計（上腕式）',
    detail: 'オムロン HEM-7281T など。1 週間測定で家庭血圧ベースライン取得。',
    cost: '¥4,000-6,000'
  },
  {
    id: 'tool-food-initial',
    group: 'tools',
    title: '初回食材購入 + Amazon 定期便契約',
    detail: 'プロテイン 2 袋・MV・あさげ・ナッツ・白米パック・サバ缶（11-A）+ ベルクスで生鮮 + 業スーで冷凍（11-B）。',
    cost: '初月 ¥34,212'
  },

  // ===== Medical (3 items) =====
  {
    id: 'med-sas',
    group: 'medical',
    title: '郵送型 SAS 検査キット注文',
    detail: 'Day 0〜Month 1 で実施。中等症以上なら CPAP 検討（ADR-013）。',
    cost: '¥5,000-10,000',
    link: { label: '郵送 SAS キット検索', url: 'https://www.google.com/search?q=%E9%83%B5%E9%80%81+SAS+%E6%A4%9C%E6%9F%BB%E3%82%AD%E3%83%83%E3%83%88' }
  },
  {
    id: 'med-dexa',
    group: 'medical',
    title: 'DEXA スキャン 3 回予約（Day 0 / Month 6 / Month 12）',
    detail: 'メディカルスキャニング等、同一施設・同一機種・同一時間帯（午前）固定（ADR-023）。',
    cost: '¥24,000-45,000（3 回計）'
  },
  {
    id: 'med-blood',
    group: 'medical',
    title: '近隣内科で詳細血液検査 H-2a + 腹部エコー予約',
    detail: '本太・原山エリアでかかりつけ確立。HbA1c / LDL / 肝腎 / TSH / NAFLD（docs/06 H-2a）。',
    cost: '保険適用'
  },

  // ===== App (4 items) =====
  {
    id: 'app-a2hs',
    group: 'app',
    title: '道標 2 を iOS ホーム画面に追加（A2HS）',
    detail: 'Safari で開いて 共有 → ホーム画面に追加。',
    link: { label: '本番 URL を開く', url: 'https://baspis.github.io/health-plan-app/' }
  },
  {
    id: 'app-notif',
    group: 'app',
    title: '通知許可（パッシブ異常検知用）',
    detail: 'Today タブの通知許可ダイアログで許可。iOS 16.4+ で PWA Push 対応。'
  },
  {
    id: 'app-shortcut',
    group: 'app',
    title: 'iOS Shortcuts「道標 2 へ日次同期」を作成',
    detail: 'Apple Health → PWA 自動同期。webapp/shortcuts/README.md の手順通り。',
    link: { label: '手順書', url: 'https://github.com/baspis/health-plan-app/blob/main/shortcuts/README.md' }
  },
  {
    id: 'app-automation',
    group: 'app',
    title: '毎朝 7:05 自動オートメーション設定',
    detail: 'Shortcuts の「個人用オートメーション」で時刻トリガー、実行前に尋ねるをオフ。'
  },

  // ===== Environment (4 items) =====
  {
    id: 'env-sweet',
    group: 'environment',
    title: '冷蔵庫・キッチンから甘い飲料・菓子を撤去',
    detail: 'ビジュアルキューを消す。家にないものは食べられない（環境設計）。'
  },
  {
    id: 'env-shoes',
    group: 'environment',
    title: '玄関にランニングシューズを定位置設置',
    detail: 'Brooks Ghost MAX 継続使用。出る前の摩擦を消す。'
  },
  {
    id: 'env-mat',
    group: 'environment',
    title: 'リビングにヨガマット常設',
    detail: '畳まない。広げたまま。AF+ 動画開始の摩擦を消す。'
  },
  {
    id: 'env-water',
    group: 'environment',
    title: 'デスクに 1L 水筒を常設',
    detail: '水 2L/日。空になったら即補充。'
  }
];

export function isItemRequired(item: PrepItem): boolean {
  return !item.optional;
}

export function getRequiredItemIds(): string[] {
  return PREP_ITEMS.filter(isItemRequired).map((i) => i.id);
}
