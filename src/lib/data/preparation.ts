export type PrepGroup = 'tools' | 'medical' | 'app' | 'environment';

export type PickSource = 'yodobashi' | 'amazon-direct' | 'official' | 'service';

export interface PrepLink {
  label: string;
  url: string;
}

export interface ProductPick {
  source: PickSource;
  productName: string;
  price?: string;
  url: string;
  color?: string;
  quantity?: string;
  note?: string;
}

export interface PrepSpec {
  pick?: ProductPick;
  must: string[];
  why: string;
  primaryLink?: PrepLink;
  altLinks?: PrepLink[];
  avoid: string[];
  verify: string[];
}

export interface PrepItem {
  id: string;
  group: PrepGroup;
  title: string;
  summary?: string;
  detail?: string;
  cost?: string;
  link?: PrepLink;
  spec?: PrepSpec;
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
    description: 'Phase 1 から使う必須器具を購入。Brooks Ghost MAX と Eufy P2 Pro は現保有想定。'
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
    jp: '道標 3 セットアップ',
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
  // ===== Tools (10 items) =====
  {
    id: 'tool-bands',
    group: 'tools',
    title: 'レジスタンスバンド 3 強度',
    summary: 'D&M セラバンド フォーエントリー、医療リハビリ業界標準品',
    cost: '¥3,300（¥1,100 × 3 本）',
    spec: {
      pick: {
        source: 'yodobashi',
        productName: 'D&M セラバンド フォーエントリー 1m TBE3 (赤 +1) / TBE4 (青 +2) / TBE5 (黒 +3) を 3 本まとめ買い',
        price: '¥1,100 × 3 本 = ¥3,300（ヨドバシ 10% 還元で実質 ¥2,970）',
        url: 'https://www.yodobashi.com/?word=%E3%82%BB%E3%83%A9%E3%83%90%E3%83%B3%E3%83%89+%E3%83%95%E3%82%A9%E3%83%BC%E3%82%A8%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC',
        quantity: '軽 (TBE3 赤) / 中 (TBE4 青) / 強 (TBE5 黒) を各 1 本',
        note: '医療リハビリ業界標準のセラバンド。中国系の安価ループバンドより耐久性・信頼性が圧倒的に高い。リボン状で結ぶ・握る・ループ化すべて自由。'
      },
      must: [
        'D&M ブランド（医療品質ラテックス）',
        '3 強度すべて: TBE3 (赤 +1) / TBE4 (青 +2) / TBE5 (黒 +3)',
        '各 1 m カット済',
        'フォーエントリーシリーズ（家庭用品質）'
      ],
      why: '医療リハビリ現場で使われる業界標準品。安価な中国系ループバンドは強度表記がいい加減で、すぐ切れたり臭いがきつい個体差が大きい。D&M は強度差が物性として保証されている。',
      avoid: [
        '中国系の安価ループバンドセット（強度差が表記通りでない、すぐ切れる）',
        '持ち手付きチューブ式（用途が限定される）',
        'D&M でも単品販売の TBE4 だけ購入（強度差が体感できない）',
        'ファブリック生地巻きタイプ（高価で耐久性差なし）'
      ],
      verify: [
        '3 本それぞれ手で引いて強度差が明確に体感できる',
        '梱包に「D&M」「TBE3 / TBE4 / TBE5」のラベルが正しく入っている',
        'ラテックスのにおいが許容範囲（数日陰干しで消える程度）'
      ]
    }
  },
  {
    id: 'tool-yogamat',
    group: 'tools',
    title: 'ヨガマット 12 mm 厚',
    summary: 'loopa（プラヴィダ）公式、110 kg 対応、アパート 2F 防音',
    cost: '¥3,300-3,800',
    spec: {
      pick: {
        source: 'official',
        productName: 'loopa ヨガマット 12 mm（183 × 61 cm、NBR、ストラップ付き）',
        price: '¥3,300-3,800（送料別）',
        url: 'https://puravida.co.jp/products/401100001',
        note: 'ヨドバシでは 12 mm 厚 NBR 183 cm 該当商品なし。loopa（プラヴィダ）公式が最善。在庫切れ時は次点でヨガワークス ピラティスマット 12 mm（173 × 61 cm）。'
      },
      must: [
        '厚み 12 mm（6 mm 以下は防音不足で NG）',
        'サイズ 183 cm × 61 cm（身長 182 cm 対応）',
        'NBR 素材（ニトリルブタジエンゴム）',
        '両面エンボス加工',
        'ストラップ付き（収納時に巻きやすい）'
      ],
      why: '体重 110 kg + アパート 2F の振動・騒音抑制で 12 mm 厚 NBR が必須。AF+ ヨガと AF+ 筋トレ両用、リビング常設。',
      altLinks: [
        {
          label: '次点: ヨガワークス ピラティスマット 12mm（173×61cm）',
          url: 'https://www.yogaworks.jp/products/piratesmat'
        }
      ],
      avoid: [
        '厚み 6 mm / 8 mm（騒音遮断不足）',
        'TPE 素材の薄手（耐久性不足）',
        '長さ 173 cm 以下のヨガワークス以外（身長 182 cm では足が出る）',
        'PVC 素材（化学臭がきつくリビング常設不向き）',
        '楽天市場の中国系ノーブランド（裏面の滑り止めが品質保証されていない）'
      ],
      verify: [
        '広げて 5 分置いて反り癖が取れる',
        '両面のエンボスパターンに違いがある',
        '化学臭が許容範囲（数日陰干しで消える程度）'
      ]
    }
  },
  {
    id: 'tool-shaker',
    group: 'tools',
    title: 'プロテインシェイカー 700 ml',
    summary: 'ShakeSphere タンブラーオリジナル、ボール不要のスフィア構造',
    cost: '¥4,620',
    spec: {
      pick: {
        source: 'official',
        productName: 'ShakeSphere タンブラーオリジナル 700 ml（フロステッドブラック / ホワイトロゴ）',
        price: '¥4,620',
        url: 'https://shakespherejp.com/products/shakesphere-tumbler-frosted-black-with-white-logo',
        color: 'フロステッドブラック / ホワイトロゴ',
        note: 'ボール内蔵不要のスフィア構造で、振り混ぜるだけでダマなし。漏れない設計、口径広めで洗いやすい。'
      },
      must: [
        '容量 700 ml',
        'スフィア構造（内部が球状で攪拌、ボール不要）',
        '蓋がしっかり閉まる（漏れない）',
        '口径広め（洗いやすい）',
        '食洗機対応'
      ],
      why: 'マイプロテイン Impact ホエイ 30 g + 水 400 ml がストレスなく振れる容量。ShakeSphere のスフィア構造は中にメッシュ・ボール不要で洗いやすく、ダマも残らない。',
      altLinks: [
        {
          label: 'Twins-Corp（日本総代理店）',
          url: 'https://shop.twins-corp.com/products/protein-shaker-bottle-700mls-tumbler-original'
        }
      ],
      avoid: [
        '容量 500 ml 以下（30 g + 水で容量不足）',
        '蓋がパカッと開く非ねじ式（振ると漏れる）',
        'ボール内蔵タイプの安物（洗いにくく不衛生、ボール紛失リスク）',
        'Amazon マーケットプレイスの並行輸入品（保証なし）'
      ],
      verify: [
        '水を半分入れて振って漏れがない',
        '蓋を閉めた状態で飲み口がしっかり閉じる',
        '内部に余計なボールやメッシュが入っていない（スフィア構造）'
      ]
    }
  },
  {
    id: 'tool-bottle',
    group: 'tools',
    title: '1 L 水筒',
    summary: 'サーモス JOY-1000、ヨドバシ 10% 還元',
    cost: '¥3,350',
    spec: {
      pick: {
        source: 'yodobashi',
        productName: 'サーモス 真空断熱ケータイマグ JOY-1000（チャコール）',
        price: '¥3,350（ヨドバシ 10% 還元で実質 ¥3,015）',
        url: 'https://www.yodobashi.com/product/100000001008913907/',
        color: 'チャコール推奨（汚れ目立ちにくい）。他にアッシュグリーン / ライトパープル / ネイビー',
        note: '旧 docs に書いた JNR-1000 は実在せず（v7.4.5 で訂正）。現行 1L はキャリーループ付き JOY-1000。保温 75℃以上 6h、保冷 9℃以下 6h、全パーツ食洗機対応。'
      },
      must: [
        '容量 1.0 L',
        'サーモス JOY-1000（型番固定）',
        '真空断熱ステンレス',
        'スクリュータイプ（ねじ式蓋）',
        'キャリーループ付き'
      ],
      why: 'デスク常設、空になったら即補充。500 ml だと補充頻度が高くなり摩擦増。JOY-1000 は全パーツ食洗機対応で衛生管理が楽。',
      avoid: [
        '500 ml サイズ（補充頻度が高すぎる）',
        '保温なしの樹脂タイプ',
        '直飲みでない別売コップ式（手間増）',
        'JNR-1000（旧 docs の型番、実在しない）'
      ],
      verify: [
        '型番 JOY-1000 が本体に印字されている',
        '満水で逆さにして 30 秒漏れない',
        '蓋がスクリュー式で確実に閉まる'
      ]
    }
  },
  {
    id: 'tool-bento',
    group: 'tools',
    title: '弁当コンテナ 700 ml × 20',
    summary: '旭化成 業務用ジップロック 正方形 700 ml × 2 セット',
    cost: '約 ¥4,040',
    spec: {
      pick: {
        source: 'amazon-direct',
        productName: '旭化成 業務用ジップロック コンテナー 正方形 700 ml 10 個入',
        price: '約 ¥2,020 × 2 セット = ¥4,040（Amazon 直販）',
        url: 'https://www.amazon.co.jp/s?k=%E6%97%AD%E5%8C%96%E6%88%90+%E6%A5%AD%E5%8B%99%E7%94%A8+%E3%82%B8%E3%83%83%E3%83%97%E3%83%AD%E3%83%83%E3%82%AF+%E6%AD%A3%E6%96%B9%E5%BD%A2+700ml+10%E5%80%8B%E5%85%A5&emi=AN1VRQENFRJN5',
        quantity: '10 個入 × 2 セット（合計 20 個）',
        note: 'ヨドバシでは正方形 700 ml の取扱なし、Amazon 直販で旭化成正規流通品を購入。サイズ 156 × 156 × 53 mm、耐熱 140℃ / 耐冷 -20℃、レンジ加熱 OK。'
      },
      must: [
        '旭化成 業務用ジップロック コンテナー 正方形 700 ml',
        '10 個入を 2 セット（合計 20 個）',
        '正方形（積み重ね効率）',
        'Amazon 直販（マーケットプレイス NG）'
      ],
      why: '正方形は冷凍庫・冷蔵庫で積み重ね効率が高い。週 4 食 × 3 パターン + 予備 4 個 + 週末 4 個 = 計 12 個回転（[ADR-019](DECISIONS.md)）。Amazon 直販絞り込み URL なら正規流通品が確実。',
      avoid: [
        '楕円形・長方形（積み重ね効率が悪い）',
        '容量 500 ml 以下（玄米 150 g + 主菜 + 副菜が入らない）',
        'Amazon マーケットプレイス（並行輸入や転売の可能性）',
        '無名ブランドの薄い容器（数回で割れる）'
      ],
      verify: [
        '20 個揃っている（10 個 × 2 セット）',
        '蓋に「電子レンジ可」マーク',
        '蓋を閉めて水を入れて逆さにして漏れない'
      ]
    }
  },
  {
    id: 'tool-rice',
    group: 'tools',
    title: '玄米小分けコンテナ 500 ml × 4',
    summary: '旭化成 ジップロック 正方形 500 ml × 1 セット',
    cost: '約 ¥800',
    spec: {
      pick: {
        source: 'amazon-direct',
        productName: '旭化成 ジップロック コンテナー 正方形 500 ml 4 個入',
        price: '約 ¥800（Amazon 直販）',
        url: 'https://www.amazon.co.jp/s?k=%E6%97%AD%E5%8C%96%E6%88%90+%E3%82%B8%E3%83%83%E3%83%97%E3%83%AD%E3%83%83%E3%82%AF+%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%BC+%E6%AD%A3%E6%96%B9%E5%BD%A2+500ml+4%E5%80%8B%E5%85%A5&emi=AN1VRQENFRJN5',
        quantity: '4 個入 × 1 セット',
        note: '玄米 150 g がぴったり入るサイズ。週末バッチ調理 → 平日レンジ加熱用。Amazon 直販絞り込みで購入。'
      },
      must: [
        '旭化成 ジップロック コンテナー 正方形 500 ml',
        '4 個入',
        'Amazon 直販'
      ],
      why: '玄米 150 g が 1 食ぴったり。週末バッチ → 冷凍 → 平日レンジ加熱の運用に最適サイズ。',
      avoid: [
        '700 ml と同じパッケージで混ざるもの（区別できない）',
        '丸型（冷凍庫の隅に空間が出る）',
        'Amazon マーケットプレイス'
      ],
      verify: [
        '500 ml 表記がある',
        '700 ml の弁当コンテナと積み重ね可能な正方形',
        '4 個揃っている'
      ]
    }
  },
  {
    id: 'tool-bp',
    group: 'tools',
    title: '家庭血圧計（上腕式）',
    summary: 'オムロン HCR-7308T2、フィットカフ + iPhone 連携',
    cost: '¥12,190（実質 ¥10,971）',
    spec: {
      pick: {
        source: 'yodobashi',
        productName: 'オムロン 上腕式血圧計 HCR-7308T2',
        price: '¥12,190（ヨドバシ 10% 還元で実質 ¥10,971）',
        url: 'https://www.yodobashi.com/product/100000001008139433/',
        note: '旧 docs に書いた HEM-7281T はヨドバシ取扱なし（v7.4.5 で訂正）。現行モデル HCR-7308T2 はフィットカフ搭載で片手装着可、OMRON connect で iPhone Bluetooth 連携、対象腕周 17-36 cm。'
      },
      must: [
        '上腕式（手首式は精度不安定で NG）',
        'オムロン HCR-7308T2',
        'フィットカフ搭載（片手装着可）',
        '対象腕周 17-36 cm（自分のサイズに対応）'
      ],
      why: '日本高血圧学会の家庭血圧ガイドラインは上腕式を推奨。手首式は精度がブレやすく医療判断に使えない。HCR-7308T2 は OMRON connect で iPhone 連携できるので 1 週間の家庭血圧記録が楽。',
      avoid: [
        '手首式血圧計（精度不安定、医療判断に使えない）',
        '対象腕周が 17 cm 以上から対応していないモデル',
        '無名ブランド（精度未確認）',
        'HEM-7281T（旧 docs の型番、ヨドバシ取扱なし）'
      ],
      verify: [
        '上腕にカフを巻いて 1 ボタンで測定が始まる',
        '試し測定で 110-140 / 65-90 mmHg の常識的な値が出る',
        '電池が同梱されている（単 3 × 4 本）',
        'OMRON connect アプリと Bluetooth ペアリング成功'
      ]
    }
  },
  {
    id: 'tool-amazon-subscriptions',
    group: 'tools',
    title: 'Amazon 定期便 6 銘柄を契約',
    summary: 'プロテインのみ公式、他 5 銘柄は Amazon 直販',
    cost: '初月 ¥15,144',
    spec: {
      pick: {
        source: 'amazon-direct',
        productName: 'Amazon 定期おトク便を 6 銘柄まとめて設定（プロテインのみマイプロテイン公式）',
        price: '月 ¥15,144（公式プロテイン ¥9,160 + Amazon 5 銘柄 ¥5,984）',
        url: 'https://www.amazon.co.jp/auto-deliveries',
        note: 'プロテインのみマイプロテイン公式（Amazon は並行輸入のため避ける）、他 5 銘柄は Amazon 直販絞り込みで定期便契約。下記 altLinks に各銘柄の URL。'
      },
      must: [
        'マイプロテイン Impact ホエイ ナチュラルチョコ 1 kg × 2 袋（公式）',
        'ネイチャーメイド スーパーマルチビタミン&ミネラル 120 粒（Amazon 直販）',
        '永谷園 フリーズドライあさげ 8 食 × 5 箱（Amazon 直販）',
        '共立食品 食塩無添加ミックスナッツ 500 g（Amazon 直販）',
        'アイリスオーヤマ 低温製法米 150 g × 24 個（Amazon 直販、緊急保険）',
        '伊藤食品 美味しい鯖水煮 食塩不使用 190 g × 5 缶（Amazon 直販、緊急保険）'
      ],
      why: '常温保存の固定銘柄を Amazon 定期便で自動化。プロテインのみ公式が最安（Amazon は並行輸入で割高）。Nosh 廃止（[ADR-003](DECISIONS.md)）。',
      altLinks: [
        {
          label: 'マイプロテイン Impact ホエイ 1 kg ナチュラルチョコ（公式 ¥4,580）',
          url: 'https://www.myprotein.jp/p/sports-nutrition/impact-whey-protein-powder/10530943/'
        },
        {
          label: 'Amazon 直販: ネイチャーメイド スーパーマルチビタミン 120 粒',
          url: 'https://www.amazon.co.jp/s?k=%E3%83%8D%E3%82%A4%E3%83%81%E3%83%A3%E3%83%BC%E3%83%A1%E3%82%A4%E3%83%89+%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%9E%E3%83%AB%E3%83%81%E3%83%93%E3%82%BF%E3%83%9F%E3%83%B3%26%E3%83%9F%E3%83%8D%E3%83%A9%E3%83%AB+120%E7%B2%92&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 永谷園 フリーズドライあさげ 8 食×5 箱',
          url: 'https://www.amazon.co.jp/s?k=%E6%B0%B8%E8%B0%B7%E5%9C%92+%E3%81%82%E3%81%95%E3%81%92+%E3%83%95%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%89%E3%83%A9%E3%82%A4&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 共立食品 素焼きミックスナッツ 500 g',
          url: 'https://www.amazon.co.jp/s?k=%E5%85%B1%E7%AB%8B%E9%A3%9F%E5%93%81+%E7%B4%A0%E7%84%BC%E3%81%8D%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9%E3%83%8A%E3%83%83%E3%83%84+500g&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: アイリスオーヤマ 低温製法米 150g×24',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%A2%E3%82%A4%E3%83%AA%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%A4%E3%83%9E+%E4%BD%8E%E6%B8%A9%E8%A3%BD%E6%B3%95%E7%B1%B3+150g&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 伊藤食品 鯖水煮 食塩不使用 190g',
          url: 'https://www.amazon.co.jp/s?k=%E4%BC%8A%E8%97%A4%E9%A3%9F%E5%93%81+%E7%BE%8E%E5%91%B3%E3%81%97%E3%81%84%E9%AF%96%E6%B0%B4%E7%85%AE+%E9%A3%9F%E5%A1%A9%E4%B8%8D%E4%BD%BF%E7%94%A8&emi=AN1VRQENFRJN5'
        }
      ],
      avoid: [
        'マイプロテインを Amazon で買う（並行輸入で割高、保証なし）',
        '塩入りのサバ缶（必ず「食塩不使用」表記）',
        '無印マルチビタミン（120 粒の「スーパーマルチビタミン&ミネラル」と混同しない）',
        'Amazon マーケットプレイスの転売品'
      ],
      verify: [
        '定期便の配送頻度が銘柄ごとに正しい（プロテイン毎月、他は数ヶ月）',
        '初回配送日が prep 完了想定の前後',
        'マルチビタミンは「スーパー」の方が届く',
        'サバ缶が「食塩不使用」表記'
      ]
    }
  },
  {
    id: 'tool-belx-first',
    group: 'tools',
    title: 'ベルクスで初回購入',
    summary: '生鮮・乳製品・パン（毎週土曜 10:00-11:00 起点）',
    cost: '¥7,200/月',
    spec: {
      pick: {
        source: 'service',
        productName: 'ベルクス浦和原山店（毎週土曜 10:00-11:00、息子と徒歩往復）',
        price: '初回 ¥1,800 程度（週分）',
        url: 'https://www.google.com/maps/search/?api=1&query=%E3%83%99%E3%83%AB%E3%82%AF%E3%82%B9%E6%B5%A6%E5%92%8C%E5%8E%9F%E5%B1%B1%E5%BA%97',
        note: 'iPhone メモアプリにベルクス固定リストを 1 ピン留めしておく。'
      },
      must: [
        '赤玉 M サイズ 卵 10 個パック × 1.5（週分）',
        'おかめ納豆 極小粒ミニ 3（45 g × 3） × 2.5 パック（週分）',
        '明治ブルガリア LB81 プレーン 400 g × 2 個（週分）',
        'Pasco 超熟 6 枚切 × 2 斤（冷凍保存可）',
        '絹豆腐 300 g × 2 丁',
        '玄米 5 kg 袋（店舗最安、銘柄こだわらず）'
      ],
      why: '土曜 10:00-11:00 に息子と徒歩で固定買い物（NEAT 増加 + 家族時間）。リスト以外を買わない＝甘いものを視界に入れない。',
      avoid: [
        '甘い飲料・菓子・スナック（環境設計違反）',
        'リスト外の主菜（バッチ調理を圧迫）',
        '玄米のブランド米（コストパフォーマンス重視、銘柄不問）'
      ],
      verify: [
        'iPhone メモアプリにベルクスリストを 1 ピン留め',
        '初回買い物で予算 ¥1,800 程度（週分）',
        '冷凍庫に超熟 1 斤分のスペースがある'
      ]
    }
  },
  {
    id: 'tool-frozen-first',
    group: 'tools',
    title: '業務スーパーで初回購入',
    summary: '冷凍主菜・副菜（3 パターンローテ用、隔週 or 月 1）',
    cost: '¥8,178/月',
    spec: {
      pick: {
        source: 'service',
        productName: '業務スーパー浦和花月店（隔週 or 月 1 回土曜）',
        price: '初回 約 ¥8,178',
        url: 'https://www.google.com/maps/search/?api=1&query=%E6%A5%AD%E5%8B%99%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E6%B5%A6%E5%92%8C%E8%8A%B1%E6%9C%88%E5%BA%97',
        note: '冷凍庫の空き状況を事前確認。3 パターン（A サバ / B 鶏胸 / C 豚ヒレ、[ADR-019](DECISIONS.md)）の 1 ヶ月分。'
      },
      must: [
        '冷凍ブロッコリー 500 g × 4 袋（パターン A 用）',
        '冷凍ほうれん草 500 g × 2 袋 + 冷凍コーン 500 g × 2 袋（パターン B 用）',
        '冷凍オクラ 500 g × 2 袋 + 冷凍しめじ 500 g × 2 袋（パターン C 用）',
        '塩不使用サバ切身 325 g × 4 袋（月 16 切 + 予備 4）',
        '国産鶏胸肉 1 kg（週 4 弁当 × 120 g）',
        '国産豚ヒレ赤身 800 g（週 4 弁当 × 80 g）',
        '冷凍ブルーベリー 500 g × 2 袋（朝ヨーグルト用）'
      ],
      why: '3 パターンローテの主菜・副菜を 1 ヶ月分まとめ買い。冷蔵 3 日 + 冷凍予備 4 + 週末用 4 = 計 12 個/週。',
      avoid: [
        '塩入りサバ切身（必ず「塩不使用」または「減塩」を確認）',
        '中国産鶏肉（鶏胸は国産にこだわる）',
        'タレ漬けの豚ヒレ（カロリー・塩分予測不能）',
        '味付き冷凍野菜（生に近いものを選ぶ）'
      ],
      verify: [
        '冷凍庫に全部入るか事前確認',
        'サバが「塩不使用」または「減塩」表記',
        '鶏胸が国産表記',
        '豚ヒレが赤身（脂身少なめ）'
      ]
    }
  },

  // ===== Medical (3 items) =====
  {
    id: 'med-sas',
    group: 'medical',
    title: '郵送型 SAS 検査キット',
    summary: 'NPO ヘルスケアネットワーク (OCHIS) 個人申込',
    cost: '¥8,800',
    spec: {
      pick: {
        source: 'service',
        productName: 'NPO ヘルスケアネットワーク (OCHIS) 個人申込・自費 SAS スクリーニング検査',
        price: '¥8,800（パルスオキシメータ貸与 3 日、AHI 報告付き、医師判定あり）',
        url: 'https://sas.ochis-net.jp/request_person/',
        note: 'オンラインで申込 → 銀行振込 → 機器郵送 → 自宅 1 晩装着 → 返送 → 約 2 週間で結果（AHI 数値 + 医師判定）。AHI ≥ 15（中等症以上）なら呼吸器内科紹介。'
      },
      must: [
        '個人申込・自費可',
        'AHI（無呼吸低呼吸指数）数値報告',
        '医師判定付き',
        '中等症以上の場合の次のステップ案内あり'
      ],
      why: 'Apple Watch Series 7 は SAS 検出未対応。父軌道（糖尿病・心血管）の独立リスク因子（[ADR-013](DECISIONS.md)）。OCHIS は個人がオンラインで自費申込できる数少ない窓口。',
      altLinks: [
        {
          label: '次点: 一般財団法人 運輸・交通 SAS 対策支援センター',
          url: 'https://www.sas-support.or.jp/application/form2/'
        }
      ],
      avoid: [
        'いびき録音アプリ単体（医学的閾値判定不可）',
        'AHI が報告されないキット',
        '医師判定なしの自分で読むタイプのみ'
      ],
      verify: [
        '申込確認メールが届く',
        '機器到着 → 装着方法ガイド付き',
        '結果報告書に AHI 数値と判定（正常 / 軽症 / 中等症 / 重症）が明記'
      ]
    }
  },
  {
    id: 'med-dexa',
    group: 'medical',
    title: 'DEXA スキャン 3 回予約',
    summary: 'メディカルスキャニング 大宮、同一機種固定',
    cost: '¥24,000-45,000（3 回計）',
    spec: {
      pick: {
        source: 'service',
        productName: 'メディカルスキャニング 大宮（DEXA 全身骨密度・体組成）',
        price: '¥8,000-15,000 × 3 回 = ¥24,000-45,000',
        url: 'https://www.medicalscanning.net/list/?gid=8',
        note: '電話予約時に「Day 0 / Month 6 / Month 12 の 3 回連続予約、同一機種・同一時間帯（午前固定）」を依頼。機種差で値ブレるため必ず同一施設固定（[ADR-023](DECISIONS.md)）。'
      },
      must: [
        '同一施設・同一機種・同一時間帯（午前固定）3 回',
        'DEXA 全身（骨密度 + 体組成）',
        '体重 110 kg 以上の患者対応機種',
        '3 回連続予約が可能'
      ],
      why: 'DEXA は機種差が大きく、別施設・別機種だと体組成・LBM の数値がブレる（[ADR-023](DECISIONS.md)）。3 回分を一度に押さえる。',
      altLinks: [
        {
          label: '次点候補: 浦和近隣 DEXA 検索',
          url: 'https://www.google.com/search?q=%E6%B5%A6%E5%92%8C+DEXA+%E5%85%A8%E8%BA%AB+%E4%BD%93%E7%B5%84%E6%88%90'
        }
      ],
      avoid: [
        '別施設で複数回（測定値がブレる）',
        '体組成のみ・骨密度なし機種',
        'InBody 等の生体インピーダンス（DEXA とは別物）',
        '時間帯がバラバラ（食事・水分摂取で数値ブレ）'
      ],
      verify: [
        '3 回分の予約番号 / 日時が手元にある',
        '同一機種が確約されている',
        'すべて午前帯（朝食抜き条件で統一）'
      ]
    }
  },
  {
    id: 'med-blood',
    group: 'medical',
    title: '近隣内科で血液検査 + 腹部エコー',
    summary: '本太・原山エリアでかかりつけ確立',
    cost: '保険適用',
    spec: {
      pick: {
        source: 'service',
        productName: '本太・原山エリアの内科（Google マップで検索）',
        price: '保険適用（3 割負担で約 ¥3,000-5,000）',
        url: 'https://www.google.com/maps/search/?api=1&query=%E6%9C%AC%E5%A4%AA+%E5%8E%9F%E5%B1%B1+%E5%86%85%E7%A7%91',
        note: '電話予約時に必須項目を全部読み上げて対応可能か確認。朝食抜きの指示と予約時刻を確定。結果説明の再来院日も同時予約。'
      },
      must: [
        'HbA1c / 空腹時血糖 / LDL / HDL / 中性脂肪',
        'AST / ALT / γ-GTP / 尿酸',
        'TSH / Cre / eGFR',
        '腹部エコー（NAFLD 評価）',
        '本太 / 原山エリアで通院しやすい立地と曜日'
      ],
      why: '父軌道（糖尿病 → 肝腎 → がん）の早期発見。健康診断パッケージだけだと NAFLD と HOMA-IR が不足。詳細は [docs/06-reviews.md H-2a](docs/06-reviews.md)。',
      avoid: [
        '健康診断パッケージ任せ（指定項目が抜ける）',
        '血液検査だけで腹部エコー省略（NAFLD 見逃し）',
        '通院しにくい遠方',
        '初回で詳細項目をリクエストできない医院'
      ],
      verify: [
        '電話予約時に必須項目を全部読み上げて確認',
        '朝食抜きと予約時刻が指示される',
        '結果説明の再来院日も同時予約',
        '次回以降の継続通院がしやすい雰囲気'
      ]
    }
  },

  // ===== App (4 items) =====
  {
    id: 'app-a2hs',
    group: 'app',
    title: '道標 3 を iOS ホーム画面に追加',
    summary: 'A2HS（Add to Home Screen）',
    detail: 'Safari で開いて 共有 → ホーム画面に追加。',
    link: { label: '本番 URL を開く', url: 'https://baspis.github.io/health-plan-app/' }
  },
  {
    id: 'app-notif',
    group: 'app',
    title: '（撤廃済み）通知許可',
    summary: 'v7.4.2 で撤廃、不要',
    detail: 'ADR-027 で異常検知通知を撤去したため、本項目は実質スキップ可能。'
  },
  {
    id: 'app-shortcut',
    group: 'app',
    title: 'iOS Shortcuts「道標 3 へ日次同期」を作成',
    summary: 'Apple Health → PWA 自動同期',
    detail: 'webapp/shortcuts/README.md の手順通り。',
    link: { label: '手順書', url: 'https://github.com/baspis/health-plan-app/blob/main/shortcuts/README.md' }
  },
  {
    id: 'app-automation',
    group: 'app',
    title: '毎朝 7:05 自動オートメーション設定',
    summary: 'Shortcuts の個人用オートメーションで時刻トリガー',
    detail: '実行前に尋ねるをオフ、毎朝自動同期。'
  },

  // ===== Environment (4 items) =====
  {
    id: 'env-sweet',
    group: 'environment',
    title: '冷蔵庫・キッチンから甘い飲料・菓子を撤去',
    summary: 'ビジュアルキューを消す',
    detail: '家にないものは食べられない（環境設計）。'
  },
  {
    id: 'env-shoes',
    group: 'environment',
    title: '玄関にランニングシューズを定位置設置',
    summary: 'Brooks Ghost MAX 継続使用',
    detail: '出る前の摩擦を消す。'
  },
  {
    id: 'env-mat',
    group: 'environment',
    title: 'リビングにヨガマット常設',
    summary: '畳まない、広げたまま',
    detail: 'AF+ 動画開始の摩擦を消す。'
  },
  {
    id: 'env-water',
    group: 'environment',
    title: 'デスクに 1 L 水筒を常設',
    summary: '空になったら即補充',
    detail: '水 2 L/日。'
  }
];

export function isItemRequired(item: PrepItem): boolean {
  return !item.optional;
}

export function getRequiredItemIds(): string[] {
  return PREP_ITEMS.filter(isItemRequired).map((i) => i.id);
}
