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
    title: 'レジスタンスバンド: プリマソーレ 強度別 3 本',
    summary: 'Phase 3+ の筋トレ用、布製ラテックス複合・ヒップスラスト対応',
    cost: '¥3,000-4,000',
    spec: {
      must: [
        'プリマソーレ（primasole）エクササイズバンド 3 本セット',
        'ライト 約 11 kg / ミディアム 約 16 kg / ヘビー 約 23 kg（≒ 50 lb）',
        '布製ラテックス複合（生地巻き、滑り止め）',
        'ループ式（持ち手なし）',
        '収納袋付き'
      ],
      why: '体重 110 kg + アパート 2F の静音条件で、ループ式・布製ラテックス複合は滑り止めが効きヒップスラスト・スクワット・背中種目で安定。ヘビー 23 kg は当面の漸進負荷上限を満たす。Phase 3 開始時から本格使用、[ADR-018](DECISIONS.md) 準拠。',
      primaryLink: {
        label: 'Amazon: primasole エクササイズバンド 3 本セット',
        url: 'https://www.amazon.co.jp/s?k=primasole+%E3%82%A8%E3%82%AF%E3%82%B5%E3%82%B5%E3%82%A4%E3%82%BA%E3%83%90%E3%83%B3%E3%83%89+3%E6%9C%AC%E3%82%BB%E3%83%83%E3%83%88'
      },
      altLinks: [
        {
          label: 'Amazon: ループバンド 3 本セット（強度別、フォールバック）',
          url: 'https://www.amazon.co.jp/dp/B088BQTWFJ'
        }
      ],
      avoid: [
        '持ち手付きチューブ式（背中・スクワットで使いにくい）',
        '軽 1-3 lb の超低負荷だけのセット（Phase 3 で鍛えられない）',
        'ハンドル + ドアアンカー型の総合トレーニングセット（ループ単体じゃないと足挟みでズレる）',
        '無名ブランドの薄ゴム純粋ループ（厚み 0.5 mm 以下、すぐ切れる）'
      ],
      verify: [
        '届いた 3 本の色 / 強度ラベルが明確に区別できる',
        'ヘビーバンドを両足で踏んで両手で引っ張っても伸びすぎず切れる気配がない',
        '生地カバーの縫い目がほつれていない',
        '滑り止めゴム面が太もも・尻の上で滑らない'
      ]
    }
  },
  {
    id: 'tool-yogamat',
    group: 'tools',
    title: 'ヨガマット: Amazon Basics 12 mm 厚',
    summary: '188 × 61 cm NBR、楽天 4.7 / 68,000 レビュー実績',
    cost: '¥2,088',
    spec: {
      must: [
        'Amazon Basics ヨガマット 厚め 12mm',
        'ASIN: B01LP0VI3G',
        '寸法 188 × 61 × 1.2 cm',
        'NBR（ニトリルブタジエンゴム）素材',
        '両面エンボス加工（滑り止め）',
        'キャリーストラップ付'
      ],
      why: '楽天 4.7 / 68,000 レビュー以上の定番、12 mm 厚は体重 110 kg + アパート 2F の振動・騒音を抑える。身長 182 cm に対し 188 cm 長で足が出ない。リビング常設前提で値段重視。',
      primaryLink: {
        label: 'Amazon: Amazon Basics ヨガマット 12mm（B01LP0VI3G）',
        url: 'https://www.amazon.co.jp/dp/B01LP0VI3G'
      },
      avoid: [
        '厚み 6 mm / 8 mm（防音不足、110 kg で底突き）',
        'TPE 素材の薄手（耐久性とクッション不足）',
        '長さ 173 cm 以下（身長 182 cm では足が出る）',
        'PVC 素材（化学臭が強くリビング常設不向き）'
      ],
      verify: [
        '到着時、開けて 5 分でカール癖が取れる',
        '両面のエンボスパターンが触って違いがある',
        '化学臭がきつくない（数日陰干しで消える程度は許容）',
        'ストラップで丸めて立てて自立する'
      ]
    }
  },
  {
    id: 'tool-shaker',
    group: 'tools',
    title: 'シェイカー: マイプロテイン メタルシェイカー',
    summary: '朝 30 g + 夕 15 g の溶解用、公式 ¥1,450',
    cost: '¥1,450',
    spec: {
      must: [
        'マイプロテイン メタルシェイカー（ブラック）',
        '公式マイプロテインで購入',
        'ステンレス製（プラスチックより匂い移りなし）',
        'ねじ式蓋 + パッキン'
      ],
      why: 'マイプロテイン Impact ホエイ 30 g + 水 350 ml に対応する容量。ステンレス製で匂い移りせず、Amazon の海外無名ブランドより耐久性が確実。プロテインの定期便と同じサイトで完結。',
      primaryLink: {
        label: 'マイプロテイン公式: メタルシェイカー ブラック',
        url: 'https://www.myprotein.jp/p/sports-accessories/myprotein-metal-shaker-black/14704708/'
      },
      altLinks: [
        {
          label: 'マイプロテイン公式: ShakeSphere 700ml（高機能版）',
          url: 'https://www.myprotein.jp/p/protein-accessories/pro-shakesphere-shaker-black-700ml/12364404/'
        }
      ],
      avoid: [
        'プラスチック製の安物（プロテイン臭が定着して取れない）',
        '容量 400 ml 以下（30 g + 水で容量不足）',
        '蓋がパカッと開く非ねじ式（振ると漏れる）',
        'ボール内蔵タイプの安物（洗いにくく不衛生）'
      ],
      verify: [
        '水を半分入れて振って漏れがない',
        '蓋を閉めた状態で飲み口がしっかり閉じる',
        'パッキンが取り外して洗える',
        'プロテイン定期便注文時に同梱して送料節約'
      ]
    }
  },
  {
    id: 'tool-bottle',
    group: 'tools',
    title: '1 L 水筒: サーモス JNL-S1000',
    summary: 'デスク常設、水 2 L/日',
    cost: '¥3,500-4,400',
    spec: {
      must: [
        'サーモス 真空断熱ケータイマグ 1L',
        '型番 JNL-S1000（現行型番）',
        '容量 1000 ml',
        '口径 約 4.9 cm（広口で洗いやすい）',
        'ワンタッチ開閉、全パーツ食洗機対応'
      ],
      why: 'デスク常設、空になったら即補充ルーチンに最適。500 ml だと補充頻度が高くなり摩擦増。広口は氷を入れやすく洗いやすい。',
      primaryLink: {
        label: 'サーモス公式: 真空断熱ケータイマグ JNL-S1000',
        url: 'https://www.shopthermos.jp/shop/g/g300067461BE0/'
      },
      altLinks: [
        {
          label: 'Amazon: サーモス JNL-S1000 1L',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%B5%E3%83%BC%E3%83%A2%E3%82%B9+JNL-S1000+1L'
        }
      ],
      avoid: [
        '500 ml 以下の小型（補充頻度高すぎる）',
        '保温なしのプラスチック樹脂タイプ',
        '別売コップ式（直飲みでない、手間増）',
        '旧型番 JNR-1000（生産終了の可能性、現行は JNL-S1000）'
      ],
      verify: [
        '型番 JNL-S1000 が本体または箱に印字',
        '満水で逆さにして 30 秒漏れない',
        '蓋を開けたまま机に置いても倒れにくい底面径'
      ]
    }
  },
  {
    id: 'tool-bento',
    group: 'tools',
    title: '弁当 + 玄米小分けコンテナ: ジップロック 正方形 700 ml × 20',
    summary: '弁当 16 個 + 玄米 4 個に振り分け（[ADR-019](DECISIONS.md)）',
    cost: '¥4,000',
    spec: {
      must: [
        'ジップロック コンテナー 正方形 700 ml（旭化成ホームプロダクツ）',
        'ASIN: B01F8L922W（10 個入り）',
        '10 個入り × 2 セット = 合計 20 個',
        '寸法 156 × 156 × 53 mm、ポリプロピレン製',
        '耐熱 140 ℃ / 耐冷 -20 ℃、電子レンジ + 食洗機 + 冷凍 対応',
        '20 個中 16 個を弁当用、4 個を玄米小分け用としてマスキングテープで区別'
      ],
      why: '正方形 700 ml は冷凍庫・冷蔵庫で積み重ね効率が高く、玄米 150 g + 主菜 + 副菜がしっかり入る。500 ml × 4 個入は実在製品にないため、20 個を兼用にして購入を 1 本化。週 4 食 × 3 パターン + 予備 4 個 + 玄米 4 個 = 計 16 + 4 個（[ADR-019](DECISIONS.md)）。',
      primaryLink: {
        label: 'Amazon: ジップロック コンテナー 正方形 700ml 10個入（B01F8L922W）',
        url: 'https://www.amazon.co.jp/dp/B01F8L922W'
      },
      altLinks: [
        {
          label: '楽天: 同上（最安比較用）',
          url: 'https://search.rakuten.co.jp/search/mall/%E3%82%B8%E3%83%83%E3%83%97%E3%83%AD%E3%83%83%E3%82%AF+%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%BC+%E6%AD%A3%E6%96%B9%E5%BD%A2+700ml+10%E5%80%8B/'
        }
      ],
      avoid: [
        '楕円形・長方形（積み重ね効率が悪い）',
        '容量 500 ml 以下（玄米 150 g + 主菜 + 副菜が入らない）',
        '蓋一体型でレンジ不可（毎食加熱時に詰め替え必要）',
        '無名ブランドの薄い容器（数回で割れる）',
        '正方形 1100 ml（容量過多、冷凍庫を圧迫）'
      ],
      verify: [
        '20 個揃っている（10 個入 × 2 セット）',
        '蓋に 140℃ 耐熱マーク + レンジ + 食洗機マークがある',
        '蓋を閉めて水を半分入れて逆さにして漏れない',
        '4 個に「米」または色テープで弁当用と区別マーキング'
      ]
    }
  },
  {
    id: 'tool-bp',
    group: 'tools',
    title: '家庭血圧計: オムロン HEM-7281T',
    summary: '上腕式、Bluetooth、フィットカフ',
    cost: '¥12,980-13,610',
    spec: {
      must: [
        'オムロン 上腕式血圧計 HEM-7281T',
        'バックライト付き液晶（暗い部屋でも読める）',
        '対象腕周 17-36 cm（フィットカフ）',
        '早朝高血圧マーク機能（朝 1 週間平均 ≧ 135/85 で点灯）',
        'Bluetooth 対応（OMRON connect でログ自動化）',
        '電源: 単 3 アルカリ × 4 または専用 AC アダプタ'
      ],
      why: '日本高血圧学会の家庭血圧ガイドラインは上腕式を推奨。手首式は精度がブレ医療判断に使えない。HEM-7281T は腕周 17-36 cm 対応で確実に巻ける + 早朝高血圧マークが Phase 1 開始時の 1 週間ベースライン取得に最適。',
      primaryLink: {
        label: 'オムロン公式: HEM-7281T',
        url: 'https://store.healthcare.omron.co.jp/category/1/HEM_7281T.html'
      },
      altLinks: [
        {
          label: '価格.com: HEM-7281T 最安比較',
          url: 'https://kakaku.com/item/K0000917560/'
        },
        {
          label: 'Amazon: オムロン HEM-7281T',
          url: 'https://www.amazon.co.jp/s?k=%E3%82%AA%E3%83%A0%E3%83%AD%E3%83%B3+HEM-7281T'
        }
      ],
      avoid: [
        '手首式血圧計（精度不安定、医療判断に使えない）',
        'アームカフが 22 cm 以上から対応していないモデル',
        '早朝高血圧マーク非対応の旧モデル',
        '無名メーカー（ガイドライン推奨機種ではない）'
      ],
      verify: [
        '上腕にカフを巻いて 1 ボタンで測定が始まる',
        '試し測定で 110-140 / 65-90 mmHg の常識的な値が出る',
        '単 3 電池 × 4 が同梱（または別途用意）',
        'OMRON connect アプリと Bluetooth ペアリング成功'
      ]
    }
  },
  {
    id: 'tool-amazon-subscriptions',
    group: 'tools',
    title: 'Amazon 定期便 6 銘柄を契約',
    summary: 'プロテイン・MV・あさげ・ナッツ・米保険・サバ缶',
    cost: '初月 ¥15,144',
    spec: {
      must: [
        'マイプロテイン Impact ホエイ ナチュラルチョコ 1 kg × 2 袋',
        'ネイチャーメイド スーパーマルチビタミン&ミネラル 120 粒（4 ヶ月分）',
        '永谷園 フリーズドライあさげ 8 食 × 5 箱（40 食）',
        '共立食品 食塩無添加ミックスナッツ 500 g',
        'アイリスオーヤマ 低温製法米 150 g × 24 個（緊急保険）',
        '伊藤食品 美味しい鯖水煮 食塩不使用 190 g × 5 缶'
      ],
      why: '常温保存の固定銘柄を Amazon 定期便で自動化。配送頻度はプロテインのみ毎月、他は数ヶ月に 1 回。Nosh は廃止（[ADR-003](DECISIONS.md)）。',
      primaryLink: {
        label: 'Amazon 定期おトク便ページ',
        url: 'https://www.amazon.co.jp/auto-deliveries'
      },
      altLinks: [
        {
          label: 'マイプロテイン Impact ホエイ（公式、Amazon より安い場合あり）',
          url: 'https://www.myprotein.jp/p/sports-nutrition/impact-whey-protein-powder/10530943/'
        },
        {
          label: 'Amazon: ネイチャーメイド マルチビタミン 120 粒',
          url: 'https://www.amazon.co.jp/dp/B00516RULK'
        },
        {
          label: 'Amazon: アイリスオーヤマ 低温製法米 150g×24',
          url: 'https://www.amazon.co.jp/dp/B0C23XQWZJ'
        },
        {
          label: 'Amazon: 永谷園 あさげ',
          url: 'https://www.amazon.co.jp/s?k=%E6%B0%B8%E8%B0%B7%E5%9C%92+%E3%81%82%E3%81%95%E3%81%92+%E3%83%95%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%89%E3%83%A9%E3%82%A4'
        },
        {
          label: 'Amazon: 共立食品 素焼きミックスナッツ 500g',
          url: 'https://www.amazon.co.jp/s?k=%E5%85%B1%E7%AB%8B%E9%A3%9F%E5%93%81+%E7%B4%A0%E7%84%BC%E3%81%8D%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9%E3%83%8A%E3%83%83%E3%83%84+500g'
        },
        {
          label: 'Amazon: 伊藤食品 鯖水煮 食塩不使用',
          url: 'https://www.amazon.co.jp/s?k=%E4%BC%8A%E8%97%A4%E9%A3%9F%E5%93%81+%E9%AF%96%E6%B0%B4%E7%85%AE+%E9%A3%9F%E5%A1%A9%E4%B8%8D%E4%BD%BF%E7%94%A8'
        }
      ],
      avoid: [
        'マイプロテインを Amazon 経由のみで買う（公式の方が安い時期あり、両方比較）',
        'マルチビタミンを別ブランド（ネイチャーメイドは粒が大きすぎず継続しやすい）',
        '塩入りのサバ水煮缶（減塩方針に反する、必ず「食塩不使用」表記）',
        '加塩あさげ（永谷園のフリーズドライ通常版は塩分そこそこあるが代替難、味噌汁は 1 日 1 杯ルール）'
      ],
      verify: [
        '定期便の配送頻度が銘柄ごとに正しい（プロテイン毎月、他は数ヶ月）',
        '初回配送日が prep 完了想定の前後に入っている',
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
    title: 'SAS 簡易検査: 川越ひさいクリニック オンライン診療',
    summary: '保険適用、自宅キット配送 + オンライン結果説明',
    cost: '¥3,000-5,000（3 割負担想定）',
    spec: {
      must: [
        '川越ひさいクリニック オンライン診療',
        '住所: 埼玉県川越市川鶴 1-8-8（東武東上線 鶴ヶ島駅）',
        '保険適用での自宅簡易検査（自己負担 3 割で約 ¥3,000-5,000）',
        '担当者が機器を訪問配送 + 使用方法を説明',
        'オンライン診察で AHI（無呼吸低呼吸指数）の結果を報告',
        '中等症以上（AHI ≥ 15）の場合 CPAP 治療連携可能',
        '年中無休・年末年始対応'
      ],
      why: 'Apple Watch Series 7 は SAS 検出未対応のため父軌道リスク評価で必須（[ADR-013](DECISIONS.md)）。**保険適用 + オンライン完結**で来院ハードル最低。AHI 値が数値で必ず返却され、CPAP 連携も同クリニック内で完結。',
      primaryLink: {
        label: '川越ひさいクリニック SAS オンライン診療',
        url: 'https://www.hisai-clinic.com/cpap_online'
      },
      altLinks: [
        {
          label: '三井クリニック（川越駅東口デッキ直結、対面診療）',
          url: 'https://mitsuiclinic.com/sas/'
        },
        {
          label: '西新宿サテライトクリニック（新宿区、対面診療）',
          url: 'https://ns-scl.com/1466/'
        }
      ],
      avoid: [
        'いびき録音アプリ単体（医学的閾値判定不可）',
        'AHI が報告されない自費キット（重症度判定不可）',
        '医師判定なしの自分で読むタイプのみ（次のステップが不明確）',
        '保険適用外の高額自費キット（同等機能で保険適用が利くため不要）'
      ],
      verify: [
        '初回オンライン予約が取れる',
        '機器配送日と返却方法が案内される',
        '結果説明日（オンライン）の予約が取れる',
        'AHI 値が数値で返却される明確な説明がある',
        '中等症以上の場合の CPAP 治療開始フローを聞いておく'
      ]
    }
  },
  {
    id: 'med-dexa',
    group: 'medical',
    title: 'DEXA 3 回予約: 健康院クリニック（東京・日本橋）',
    summary: 'GE Lunar iDXA、全身体組成 + 骨密度、3 回計 ≈ ¥81,500',
    cost: '¥81,500（3 回計、自費）',
    spec: {
      must: [
        '健康院クリニック（東京・日本橋）',
        '機種: GE Lunar iDXA（最新型）',
        '全身体組成（脂肪量・体脂肪率・筋肉量・LBM・部位別）+ 骨密度を 1 回で測定',
        '料金: DXA 単体 ¥16,500 + 初診 ¥22,000（2-3 回目は再診 ¥5,500）',
        '3 回計: ¥38,500（初回）+ ¥21,500 × 2（再診）= ¥81,500',
        '予約時に Day 0 / Month 6 / Month 12 の 3 回連続予約',
        'すべて午前帯（朝食抜き条件で統一）'
      ],
      why: '[ADR-023](DECISIONS.md) が要求する「同一施設・同一機種・同一時間帯固定」を実勢で満たす最も確実な選択肢。GE Lunar iDXA は全身体組成 + 骨密度を 1 回で測定可能で再現性が高い。**当初想定 ¥24,000-45,000 は整形外科の保険適用ケース、実勢の自費全身 DEXA は ¥81,500 規模**（CHANGELOG v7.4.5）。',
      primaryLink: {
        label: '健康院クリニック DXA ページ',
        url: 'https://www.kenkoin.jp/dxa/'
      },
      altLinks: [
        {
          label: '加藤整形外科・内科（さいたま市、GE 製 DEXA、自費価格は要電話確認）',
          url: 'https://www.katoseikei.com/dxa/'
        },
        {
          label: 'ささき整形外科（浦和区、骨粗鬆症診断中心、全身体組成は要確認）',
          url: 'https://www.sasaki-seikeigeka.com/osteoporosis/'
        }
      ],
      avoid: [
        '別施設で複数回（測定値がブレ、[ADR-023](DECISIONS.md) 違反）',
        '体組成のみ・骨密度なし機種（DEXA 全身ではない）',
        'InBody / 体組成計（DEXA とは別物、代替不可）',
        '時間帯がバラバラ（食事・水分摂取で数値ブレ）',
        '腰椎・大腿骨だけの DEXA（全身体組成が取れない）'
      ],
      verify: [
        '3 回分の予約番号 / 日時が手元にある',
        '機種が GE Lunar iDXA と確認できている',
        'すべて午前帯（朝食抜き条件で統一）',
        '初回受診時に 2 回目以降の予約も同時に押さえる'
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
