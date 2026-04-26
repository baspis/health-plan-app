export type PrepGroup = 'tools' | 'medical' | 'app' | 'environment';

export interface PrepLink {
  label: string;
  url: string;
}

export interface PrepSpec {
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
  // ===== Tools (10 items: 8 + tool-food-initial を 3 分割) =====
  {
    id: 'tool-bands',
    group: 'tools',
    title: 'レジスタンスバンド 3 段階',
    summary: 'Phase 3+ の筋トレ用、アパート 2F 静音',
    cost: '¥5,000-6,000',
    spec: {
      must: [
        'ループ式（リング状の輪っか、持ち手付チューブ式は NG）',
        '3 段階セット: 軽 10-15 lb / 中 20-25 lb / 強 30-40 lb',
        'ナチュラルラテックス または TPE 素材',
        '幅 10 mm 以上、周長 600 mm 以上',
        '体重 110 kg 対応 の表記あり',
        '厚み 0.9 mm 以上'
      ],
      why: '体重 110 kg + アパート 2F の静音条件で、持ち手なしのループ式は背中・脚種目に使い回しが効く。Phase 3 開始時から本格使用、ADR-018 に準拠。',
      primaryLink: {
        label: 'ヨドバシ: フィットネス用ストレッチバンド カテゴリ',
        url: 'https://www.yodobashi.com/category/152022/152355/152398/152400/'
      },
      altLinks: [
        {
          label: 'Amazon 直販: resistance loop bands heavy set',
          url: 'https://www.amazon.co.jp/s?k=resistance+loop+bands+heavy+set+110kg&emi=AN1VRQENFRJN5'
        }
      ],
      avoid: [
        '軽 1-3 lb の超低負荷だけのセット（Phase 3 で鍛えられない）',
        '持ち手付きチューブ式（背中・スクワットで使いにくい）',
        '厚み 0.8 mm 以下の薄手（切れる）',
        'ファブリック生地巻きタイプ（高価で耐久性差なし）',
        '体重制限が明記されていない無名ブランド'
      ],
      verify: [
        '3 本それぞれ手で引いて強度差が明確に体感できる',
        '継ぎ目（接合部）に剥がれや薄い箇所がない',
        '強バンドを足で踏んで両手で引いても急に切れる気配がない'
      ]
    }
  },
  {
    id: 'tool-yogamat',
    group: 'tools',
    title: 'ヨガマット 12 mm 厚',
    summary: '110 kg 対応、アパート 2F 防音',
    cost: '¥2,500-3,500',
    spec: {
      must: [
        '厚み 12 mm（6 mm 以下は NG、騒音遮断不足）',
        'サイズ 183 cm × 61 cm 以上',
        'NBR 素材（ニトリルブタジエンゴム）',
        '両面エンボス加工（滑り止め）',
        '110 kg 対応の表記あり',
        '専用ストラップまたは収納ケース付属が望ましい'
      ],
      why: '体重 110 kg + アパート 2F で振動・騒音を抑えるため厚 12 mm の NBR が必須。AF+ ヨガと AF+ 筋トレ両用、リビング常設。',
      primaryLink: {
        label: 'Amazon 直販: ヨガマット 12mm NBR 183cm',
        url: 'https://www.amazon.co.jp/s?k=%E3%83%A8%E3%82%AC%E3%83%9E%E3%83%83%E3%83%88+12mm+NBR+183cm&emi=AN1VRQENFRJN5'
      },
      altLinks: [
        {
          label: 'ヨドバシ: KAWASE 鉄人倶楽部 IMC-41 NBR 10mm（防音は妥協、確実に手に入る代替）',
          url: 'https://www.yodobashi.com/product/100000001002801282/'
        },
        {
          label: 'ヨドバシ: エクササイズマット カテゴリ',
          url: 'https://www.yodobashi.com/category/152022/152355/152398/152408/'
        }
      ],
      avoid: [
        '厚み 6 mm / 8 mm（防音不足）',
        'TPE 素材の薄手（耐久性とクッション不足）',
        '長さ 173 cm 以下（身長 182 cm では足が出る）',
        'PVC 素材（化学臭が強くリビング常設不向き）'
      ],
      verify: [
        '広げて 5 分置いて反り癖が取れる',
        '両面のエンボスパターンが触って違いがある',
        '化学臭がきつくない（数日陰干しで消える程度はOK）'
      ]
    }
  },
  {
    id: 'tool-shaker',
    group: 'tools',
    title: 'プロテインシェイカー',
    summary: '朝 30 g + 夕 15 g の溶解用',
    cost: '¥800-1,500',
    spec: {
      must: [
        '容量 700 ml 以上',
        '蓋がねじ式 + パッキン入り（漏れ防止）',
        '飲み口が広め（蓋を開けて直接飲める）',
        '食洗機対応'
      ],
      why: 'マイプロテイン Impact ホエイ 30 g + 水 400 ml がストレスなく振れる容量。ねじ式パッキンは振っても漏れない。',
      primaryLink: {
        label: 'マイプロテイン公式: メタルシェイカー（直販）',
        url: 'https://www.myprotein.jp/p/sports-accessories/myprotein-metal-shaker-black/14704708/'
      },
      altLinks: [
        {
          label: 'Amazon 直販: myprotein metal shaker',
          url: 'https://www.amazon.co.jp/s?k=myprotein+metal+shaker&emi=AN1VRQENFRJN5'
        }
      ],
      avoid: [
        '容量 500 ml 以下（30 g + 水で容量不足）',
        '蓋がパカッと開く非ねじ式（振ると漏れる）',
        'ボール内蔵タイプの安物（洗いにくく不衛生）'
      ],
      verify: [
        '水を半分入れて振って漏れがない',
        '蓋を閉めた状態で飲み口がしっかり閉じる',
        'パッキンが取り外して洗える'
      ]
    }
  },
  {
    id: 'tool-bottle',
    group: 'tools',
    title: '1 L 水筒（サーモス JOY-1000）',
    summary: 'デスク常設、水 2 L/日 用',
    cost: '¥3,350',
    spec: {
      must: [
        '型番 JOY-1000（容量 1000 ml、現行モデル）',
        '真空断熱ステンレス',
        'キャリーループ付き',
        'ワンタッチ開閉式'
      ],
      why: 'デスク常設、空になったら即補充ルーチンに最適。500 ml だと補充頻度が高くなり摩擦増。JNR-1000 は旧型番のため、現行 JOY-1000 を採用。',
      primaryLink: {
        label: 'ヨドバシ: サーモス JOY-1000-ASG アッシュグリーン ¥3,350',
        url: 'https://www.yodobashi.com/product/100000001008913907/'
      },
      altLinks: [
        {
          label: 'Amazon 直販: サーモス JOY-1000',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%BC%E3%83%A2%E3%82%B9+JOY-1000&emi=AN1VRQENFRJN5'
        }
      ],
      avoid: [
        '500 ml の小型（補充頻度高すぎ）',
        '保温なしのプラスチック樹脂タイプ',
        '直飲みでない別売コップ式（手間が増える）'
      ],
      verify: [
        '型番 JNR-1000 が本体に印字されている',
        '満水で逆さにして 30 秒漏れない',
        '蓋を開けたまま机に置いても倒れにくい底面径'
      ]
    }
  },
  {
    id: 'tool-bento',
    group: 'tools',
    title: '弁当コンテナ 700 ml × 20',
    summary: '週 12 個回転、3 パターンローテ用',
    cost: '¥4,000',
    spec: {
      must: [
        'ジップロック コンテナー 正方形 700 ml',
        '10 個入り × 2 セット（合計 20 個）',
        '電子レンジ対応（蓋を外した状態で 600 W OK）',
        '食洗機対応'
      ],
      why: '正方形は冷凍庫・冷蔵庫で積み重ね効率が高い。週 4 食 × 3 パターン + 予備 4 個 + 週末 4 個 = 計 12 個回転（[ADR-019](DECISIONS.md)）。',
      primaryLink: {
        label: 'Amazon 直販: ジップロック コンテナー 正方形 700ml 10個入',
        url: 'https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%83%E3%83%97%E3%83%AD%E3%83%83%E3%82%AF+%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%BC+%E6%AD%A3%E6%96%B9%E5%BD%A2+700ml+10%E5%80%8B%E5%85%A5&emi=AN1VRQENFRJN5'
      },
      altLinks: [
        {
          label: 'ヨドバシ: ジップロック 業務用コンテナー 長方形 1900mL（参考、サイズ違い）',
          url: 'https://www.yodobashi.com/product/100000001003556425/'
        }
      ],
      avoid: [
        '楕円形・長方形（積み重ね効率が悪い）',
        '容量 500 ml 以下（玄米 150 g + 主菜 + 副菜が入らない）',
        '蓋一体型でレンジ不可（毎食加熱時に詰め替え必要）',
        '無名ブランドの薄い容器（数回で割れる）'
      ],
      verify: [
        '20 個揃っている（10 個 × 2 セット）',
        '蓋にレンジ可マーク／食洗機可マークがある',
        '蓋を閉めて 1 つ分の中身（水）を入れて逆さにして漏れない'
      ]
    }
  },
  {
    id: 'tool-rice',
    group: 'tools',
    title: '玄米小分けコンテナ 500 ml × 4',
    summary: '玄米 1 食 150 g 分の小分け',
    cost: '¥800',
    spec: {
      must: [
        'ジップロック コンテナー 正方形 500 ml',
        '4 個入り 1 セット',
        '電子レンジ対応',
        '700 ml と区別できる別パッケージ'
      ],
      why: '玄米 150 g がぴったり入るサイズ。週末バッチ調理時の小分け冷凍 → 平日レンジ加熱用。',
      primaryLink: {
        label: 'Amazon 直販: ジップロック コンテナー 正方形 500ml 4個入',
        url: 'https://www.amazon.co.jp/s?k=%E3%82%B8%E3%83%83%E3%83%97%E3%83%AD%E3%83%83%E3%82%AF+%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%BC+%E6%AD%A3%E6%96%B9%E5%BD%A2+500ml+4%E5%80%8B%E5%85%A5&emi=AN1VRQENFRJN5'
      },
      avoid: [
        '700 ml と同じ見た目で混ざるパッケージ（区別できない）',
        '丸型（冷凍庫の隅に空間が出る）'
      ],
      verify: [
        '500 ml 表記がある',
        '700 ml の弁当コンテナと積み重ね可能な正方形'
      ]
    }
  },
  {
    id: 'tool-bp',
    group: 'tools',
    title: '家庭血圧計（上腕式）',
    summary: '1 週間ベースライン測定用',
    cost: '¥4,000-6,000',
    spec: {
      must: [
        '上腕式（手首式 NG）',
        'オムロン HEM-7281T または同等機種',
        'アームカフ周径 22-32 cm 対応',
        '1 ボタン測定スタート'
      ],
      why: '日本高血圧学会の家庭血圧ガイドラインは上腕式を推奨。手首式は精度がブレやすく医療判断に使えない。HEM-7281T はヨドバシ取扱なしのため公式 or Amazon 直販。',
      primaryLink: {
        label: 'オムロン公式ストア: HEM-7281T ¥18,800',
        url: 'https://store.healthcare.omron.co.jp/item/HEM_7281T.html'
      },
      altLinks: [
        {
          label: 'Amazon 直販: オムロン HEM-7281T',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%AA%E3%83%A0%E3%83%AD%E3%83%B3+HEM-7281T&emi=AN1VRQENFRJN5'
        },
        {
          label: 'ヨドバシ: オムロン HEM-1021 上腕式（同等代替・フィットカフ付き）',
          url: 'https://www.yodobashi.com/product/100000001003243198/'
        }
      ],
      avoid: [
        '手首式血圧計（精度不安定、医療判断に使えない）',
        'アームカフが 22 cm 以上から対応していないモデル',
        'Bluetooth 連携必須モデル（運用が複雑化、不要）'
      ],
      verify: [
        '上腕にカフを巻いて 1 ボタンで測定が始まる',
        '試し測定で 110-140 / 65-90 mmHg の常識的な値が出る',
        '電池駆動（電池が同梱されている）'
      ]
    }
  },
  {
    id: 'tool-amazon-subscriptions',
    group: 'tools',
    title: '定期購入 6 銘柄をセットアップ',
    summary: 'プロテイン・MV・あさげ・ナッツ・米保険・サバ缶',
    cost: '初月 ¥15,144',
    spec: {
      must: [
        'マイプロテイン Impact ホエイ ココア 900 g × 2 袋（ヨドバシ）',
        'ネイチャーメイド スーパーマルチビタミン&ミネラル 120 粒（4 ヶ月分）',
        '永谷園 フリーズドライあさげ 8 食 × 5 箱（40 食）',
        '共立食品 食塩無添加ミックスナッツ 500 g',
        'アイリスオーヤマ 低温製法米 150 g × 24 個（緊急保険）',
        '伊藤食品 美味しい鯖水煮 食塩不使用 190 g × 5 缶'
      ],
      why: '常温保存の固定銘柄を自動化。プロテインはヨドバシで現行 900g（IMPACT ホエイ ココア）が確実、他は Amazon 直販で定期便契約。配送頻度はプロテインのみ毎月、他は数ヶ月に 1 回。Nosh は廃止（[ADR-003](DECISIONS.md)）。',
      primaryLink: {
        label: 'ヨドバシ: マイプロテイン IMPACT ホエイ ココア 900g ¥5,370',
        url: 'https://www.yodobashi.com/product/100000001009606630/'
      },
      altLinks: [
        {
          label: 'Amazon 直販: ネイチャーメイド スーパーマルチビタミン&ミネラル 120 粒',
          url: 'https://www.amazon.co.jp/s?k=%E3%83%8D%E3%82%A4%E3%83%81%E3%83%A3%E3%83%BC%E3%83%A1%E3%82%A4%E3%83%89+%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%9E%E3%83%AB%E3%83%81%E3%83%93%E3%82%BF%E3%83%9F%E3%83%B3+120%E7%B2%92&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 永谷園 あさげ フリーズドライ 8 食',
          url: 'https://www.amazon.co.jp/s?k=%E6%B0%B8%E8%B0%B7%E5%9C%92+%E3%81%82%E3%81%95%E3%81%92+%E3%83%95%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%89%E3%83%A9%E3%82%A4+8%E9%A3%9F&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 共立食品 食塩無添加ミックスナッツ 500g',
          url: 'https://www.amazon.co.jp/s?k=%E5%85%B1%E7%AB%8B%E9%A3%9F%E5%93%81+%E9%A3%9F%E5%A1%A9%E7%84%A1%E6%B7%BB%E5%8A%A0+%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9%E3%83%8A%E3%83%83%E3%83%84+500g&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: アイリスオーヤマ 低温製法米 150g × 24 個',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%A2%E3%82%A4%E3%83%AA%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%A4%E3%83%9E+%E4%BD%8E%E6%B8%A9%E8%A3%BD%E6%B3%95%E7%B1%B3+150g+24&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon 直販: 伊藤食品 鯖水煮 食塩不使用 190g',
          url: 'https://www.amazon.co.jp/s?k=%E4%BC%8A%E8%97%A4%E9%A3%9F%E5%93%81+%E9%AF%96%E6%B0%B4%E7%85%AE+%E9%A3%9F%E5%A1%A9%E4%B8%8D%E4%BD%BF%E7%94%A8+190g&emi=AN1VRQENFRJN5'
        },
        {
          label: 'Amazon: 定期おトク便管理ページ',
          url: 'https://www.amazon.co.jp/auto-deliveries'
        }
      ],
      avoid: [
        'マイプロテイン 1kg にこだわる（ヨドバシは 900g のみ、誤差は無視可）',
        'マルチビタミンを別ブランド（ネイチャーメイドは粒が大きすぎず継続しやすい）',
        '塩入りのサバ水煮缶（減塩方針に反する、必ず「食塩不使用」表記）',
        'Amazon でマーケットプレイス出品者から買う（直販フィルタ &emi=AN1VRQENFRJN5 を必ず使う）'
      ],
      verify: [
        'プロテインはヨドバシで購入（在庫・配送が安定）',
        'Amazon の他 5 銘柄は「販売元: Amazon」を確認してから定期便に入れる',
        '定期便の配送頻度がプロテイン毎月、MV は 4 ヶ月、他は 2-3 ヶ月で設定',
        'マルチビタミンは「スーパーマルチビタミン&ミネラル」の方（無印マルチビタミンと混同しない）'
      ]
    }
  },
  {
    id: 'tool-belx-first',
    group: 'tools',
    title: 'ベルクスで初回購入',
    summary: '生鮮・乳製品・パン（毎週土曜の起点）',
    cost: '¥7,200/月',
    spec: {
      must: [
        '赤玉 M サイズ 卵 10 個パック × 1.5（週分）',
        'おかめ納豆 極小粒ミニ 3（45 g × 3） × 2.5 パック（週分）',
        '明治ブルガリア LB81 プレーン 400 g × 2 個（週分）',
        'Pasco 超熟 6 枚切 × 2 斤（冷凍保存可）',
        '絹豆腐 300 g × 2 丁',
        '玄米 5 kg 袋（店舗最安、銘柄こだわらず）'
      ],
      why: '土曜 10:00-11:00 に息子と徒歩で固定買い物（NEAT 増加 + 家族時間）。リスト以外を買わない＝甘いものを視界に入れない。',
      primaryLink: {
        label: 'Google マップ: ベルクス浦和原山店',
        url: 'https://www.google.com/maps/search/?api=1&query=%E3%83%99%E3%83%AB%E3%82%AF%E3%82%B9%E6%B5%A6%E5%92%8C%E5%8E%9F%E5%B1%B1%E5%BA%97'
      },
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
    summary: '冷凍主菜・副菜（3 パターンローテ用）',
    cost: '¥8,178/月',
    spec: {
      must: [
        '冷凍ブロッコリー 500 g × 4 袋（パターン A 用）',
        '冷凍ほうれん草 500 g × 2 袋 + 冷凍コーン 500 g × 2 袋（パターン B 用）',
        '冷凍オクラ 500 g × 2 袋 + 冷凍しめじ 500 g × 2 袋（パターン C 用）',
        '塩不使用サバ切身 325 g × 4 袋（パターン A 主菜、月 16 切 + 予備 4）',
        '国産鶏胸肉 1 kg × 1（パターン B 主菜、週 4 弁当 × 120 g）',
        '国産豚ヒレ赤身 800 g × 1（パターン C 主菜、週 4 弁当 × 80 g）',
        '冷凍ブルーベリー 500 g × 2 袋（朝ヨーグルト用）'
      ],
      why: '3 パターンローテ（A サバ / B 鶏胸 / C 豚ヒレ、[ADR-019](DECISIONS.md)）の主菜と副菜を 1 ヶ月分まとめ買い。冷蔵 3 日 + 冷凍予備 4 + 週末用 4 = 計 12 個/週。',
      primaryLink: {
        label: 'Google マップ: 業務スーパー浦和花月店',
        url: 'https://www.google.com/maps/search/?api=1&query=%E6%A5%AD%E5%8B%99%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E6%B5%A6%E5%92%8C%E8%8A%B1%E6%9C%88%E5%BA%97'
      },
      avoid: [
        '塩入りサバ切身（減塩方針違反、「塩不使用」または「減塩」を必ず確認）',
        '中国産鶏肉（鶏胸は国産にこだわる、薬品残留リスク差）',
        'タレ漬けの豚ヒレ（カロリー・塩分予測不能）',
        '味付き冷凍野菜（生に近いものを選ぶ）'
      ],
      verify: [
        '冷凍庫に全部入るか事前確認（最悪は小型冷凍庫 ADR-019 発動）',
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
    title: '郵送型 SAS 検査キットを注文',
    summary: '1 晩自宅で測定、AHI 値が報告される',
    cost: '¥5,000-10,000',
    spec: {
      must: [
        '自宅 1 晩で測定するタイプ',
        'AHI（無呼吸低呼吸指数）が数値で報告される',
        '医師判定付き（中等症以上の判定基準があるもの）',
        '保険外で OK、結果が即時返却'
      ],
      why: 'Apple Watch Series 7 は SAS 検出未対応、Series 9+ の睡眠時無呼吸検出機能がない。父軌道（糖尿病・心血管）の独立リスク因子（[ADR-013](DECISIONS.md)）。SAS 検査は基本「医療機関を介した郵送キット」が AHI 報告精度の点で正解。Amazon の単体パルスオキシメーターでは医学判定不可。',
      primaryLink: {
        label: 'フクダライフテック: 自宅型 SAS 簡易検査（医療機関ルート）',
        url: 'https://www.fukuda.co.jp/public/inhome_medical/sas_kensa.html'
      },
      altLinks: [
        {
          label: '神戸きしだクリニック: 自宅 SAS 簡易検査ガイド（流れ・費用）',
          url: 'https://kobe-kishida-clinic.com/respiratory-system/sleep-apnea-syndrome/sas-home-test-kit/'
        },
        {
          label: 'Google: 浦和近隣 呼吸器内科 SAS 簡易検査',
          url: 'https://www.google.com/maps/search/?api=1&query=%E6%B5%A6%E5%92%8C+%E5%91%BC%E5%90%B8%E5%99%A8%E5%86%85%E7%A7%91+SAS+%E7%B0%A1%E6%98%93%E6%A4%9C%E6%9F%BB'
        }
      ],
      avoid: [
        'いびき録音アプリ単体（医学的閾値判定不可）',
        'AHI が報告されないキット（中等症以上の判定不可）',
        '医師判定なしの自分で読むタイプのみ（次のステップが不明確）'
      ],
      verify: [
        'AHI（無呼吸低呼吸指数）が数値で報告される明記',
        '結果到着までの日数が 2-3 週間以内',
        '中等症（AHI ≥ 15）以上の場合の次の動き（呼吸器内科紹介等）が案内される'
      ]
    }
  },
  {
    id: 'med-dexa',
    group: 'medical',
    title: 'DEXA スキャン 3 回予約',
    summary: 'Day 0 / Month 6 / Month 12、同一施設固定',
    cost: '¥24,000-45,000（3 回計）',
    spec: {
      must: [
        '同一施設・同一機種・同一時間帯（午前固定）3 回',
        'DEXA 全身スキャン（骨密度 + 体組成）対応',
        '浦和近隣で通いやすい施設',
        '予約時に「3 回連続予約」が可能',
        '体重 110 kg 以上の患者対応の機種'
      ],
      why: 'DEXA は機種差が大きく、別施設・別機種で測ると体組成・LBM の数値がブレる（[ADR-023](DECISIONS.md)）。3 回予約を一度に押さえる。',
      primaryLink: {
        label: 'メディカルスキャニング 大宮（DEXA）',
        url: 'https://www.google.com/search?q=%E3%83%A1%E3%83%87%E3%82%A3%E3%82%AB%E3%83%AB%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%8B%E3%83%B3%E3%82%B0+%E5%A4%A7%E5%AE%AE+DEXA'
      },
      altLinks: [
        {
          label: 'Google: 浦和 DEXA 全身',
          url: 'https://www.google.com/search?q=%E6%B5%A6%E5%92%8C+DEXA+%E5%85%A8%E8%BA%AB+%E4%BD%93%E7%B5%84%E6%88%90'
        }
      ],
      avoid: [
        '別施設で複数回（測定値がブレ、ADR-023 違反）',
        '体組成のみ・骨密度なし機種（DEXA 全身でない）',
        'InBody 等の生体インピーダンス（DEXA とは別物、代替不可）',
        '時間帯がバラバラ（食事・水分摂取で数値ブレ）'
      ],
      verify: [
        '3 回分の予約番号 / 日時が手元にある',
        '同一施設・同一機種が確約されている',
        'すべて午前帯（朝食抜き条件で統一）'
      ]
    }
  },
  {
    id: 'med-blood',
    group: 'medical',
    title: '近隣内科で血液検査 + 腹部エコー予約',
    summary: '本太・原山エリアでかかりつけ確立',
    cost: '保険適用',
    spec: {
      must: [
        '必須項目: HbA1c / 空腹時血糖 / LDL / HDL / 中性脂肪 / AST / ALT / γ-GTP / 尿酸 / TSH / Cre / eGFR',
        '腹部エコー（NAFLD 評価）',
        '本太 / 原山エリアの内科',
        'かかりつけ医として継続通院しやすい立地と曜日',
        '初回予約時に検査項目を電話で読み上げて確認'
      ],
      why: '父軌道（糖尿病 → 肝腎 → がん）の早期発見。健康診断の標準項目だけでは NAFLD と HOMA-IR が不足。詳細は [docs/06-reviews.md H-2a](docs/06-reviews.md)。',
      primaryLink: {
        label: 'Google マップ: 本太・原山 内科',
        url: 'https://www.google.com/maps/search/?api=1&query=%E6%9C%AC%E5%A4%AA+%E5%8E%9F%E5%B1%B1+%E5%86%85%E7%A7%91'
      },
      avoid: [
        '健康診断パッケージ任せ（指定項目が抜ける）',
        '血液検査だけで腹部エコー省略（NAFLD 見逃し）',
        '通院しにくい遠方（継続性が落ちる）',
        '初回で詳細項目をリクエストできない医院（柔軟性が低い）'
      ],
      verify: [
        '電話予約時に必須項目を全部読み上げて、対応可能か確認',
        '朝食抜き条件と予約時刻が指示される',
        '結果説明の再来院日も同時に予約',
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
