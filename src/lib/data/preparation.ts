export type PrepGroup = 'tools' | 'medical' | 'app' | 'environment' | 'conditional';

export interface PrepLink {
  label: string;
  url: string;
}

export interface PrepSpec {
  purpose: string;
  must: string[];
  niceToHave?: string[];
  why: string;
  searchLinks?: PrepLink[];
  examples?: string[];
  avoid: string[];
  verifyBeforeBuy: string[];
  verifyAfterReceive: string[];
}

export interface PrepItem {
  id: string;
  group: PrepGroup;
  title: string;
  summary?: string;
  detail?: string;
  cost?: string;
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
    description: '商品名ではなく、満たすべき仕様を確認してから選ぶ。'
  },
  {
    id: 'medical',
    label: 'Medical',
    jp: '医療スクリーニング予約',
    description: '検査名ではなく、取得できる指標と継続性で選ぶ。'
  },
  {
    id: 'app',
    label: 'App',
    jp: '道標 3 セットアップ',
    description: 'Apple Health 連携と日次同期を自動化する。'
  },
  {
    id: 'environment',
    label: 'Environment',
    jp: '環境整備',
    description: 'WillPower を使わない物理環境を作る。'
  },
  {
    id: 'conditional',
    label: 'Conditional',
    jp: '条件付き購入',
    description: '実害化・停滞・DEXA 判定が出てから買う。prep の必須項目には含めない。'
  }
];

export const PREP_ITEMS: PrepItem[] = [
  {
    id: 'tool-bands',
    group: 'tools',
    title: 'レジスタンスバンド仕様を満たすものを選ぶ',
    summary: '208 cm パワーバンド型、最強 25-55 kg、ミニバンド不可',
    cost: '¥4,000-8,000',
    spec: {
      purpose:
        'Phase 3+ の AF+ 筋力トレで、アパート 2F 静音のまま胸・背中・肩・腕・脚へ漸進負荷をかける。',
      must: [
        '長尺パワーバンド型ループ（全周 208 cm 前後、持ち手なし）',
        '3-4 段階セット。最強バンドは目安 25-55 kg 抵抗',
        '色ではなく kg / lb の抵抗値表記で判断する',
        '幅の目安: 軽 13-21 mm / 中 21-32 mm / 強 32-45 mm',
        '天然ラテックス、または同等の高耐久ラテックス素材',
        '用途に pull-up assist / squat / row / press / deadlift / power band 等の記載',
        '返品または初期不良交換が可能'
      ],
      niceToHave: [
        '単品追加購入ができるブランド',
        '各バンドに幅・抵抗値が印字されている',
        'ドアアンカーは付属していてもよいが主目的ではない'
      ],
      why:
        'ヒップバンドや持ち手付きチューブでは胸・背中・脚の AF+ 種目を広くカバーしにくい。208 cm 前後のパワーバンドならプレス、ロー、スクワット、デッドリフト風動作、補助ストレッチに流用でき、Phase 3 の漸進負荷に必要な上限も確保しやすい。',
      searchLinks: [
        {
          label: 'Amazon: power band 208cm 32mm 45kg resistance',
          url: 'https://www.amazon.co.jp/s?k=power+band+208cm+32mm+45kg+resistance'
        },
        {
          label: 'Amazon: 懸垂補助 バンド 208cm 強度別 セット',
          url: 'https://www.amazon.co.jp/s?k=%E6%87%B8%E5%9E%82%E8%A3%9C%E5%8A%A9+%E3%83%90%E3%83%B3%E3%83%89+208cm+%E5%BC%B7%E5%BA%A6%E5%88%A5+%E3%82%BB%E3%83%83%E3%83%88'
        }
      ],
      examples: [
        'POWERBANDS 系の 208 cm パワーバンド',
        '懸垂補助用として販売される長尺ループバンド',
        '最強 30 kg 以上が明記されたラテックスパワーバンドセット'
      ],
      avoid: [
        'ミニバンド / ヒップバンド（全周 60-80 cm 前後）を主力にする',
        '持ち手付きチューブセットを主力にする',
        '強度が「弱・中・強」だけで kg / lb 表記なし',
        '最強が 20 kg 未満',
        '布製ヒップバンドだけのセット',
        '薄い平ゴムで幅・厚み・抵抗値が不明なもの'
      ],
      verifyBeforeBuy: [
        '商品ページに全周 200-210 cm 程度の長尺ループと書かれている',
        '最強バンドの抵抗が 25 kg 以上、できれば 35 kg 以上',
        '幅が 32 mm 以上の中〜強バンドを含む',
        '用途写真にローイング、スクワット、プレス、懸垂補助のいずれかがある',
        'レビューで「切れた」「粉が出る」が多くない'
      ],
      verifyAfterReceive: [
        '全周が短すぎず、足で踏んで両手で引ける',
        '中・強バンドの抵抗差が明確にある',
        '表面にひび割れ、白化、薄い箇所がない',
        '足で踏んでローイング姿勢を取っても滑らない',
        '強バンドを軽く伸ばしても異音や裂け目がない'
      ]
    }
  },
  {
    id: 'tool-yogamat',
    group: 'tools',
    title: 'ヨガマット仕様を満たすものを選ぶ',
    summary: '12 mm 厚、183 cm 以上、NBR or 高密度フォーム、防音目的',
    cost: '¥2,000-4,000',
    spec: {
      purpose: 'AF+ ヨガ・自重筋トレ・ストレッチを、110 kg 体重とアパート 2F の騒音制約下で安全に行う。',
      must: [
        '厚み 12 mm 前後（最低 10 mm、推奨 12 mm）',
        '長さ 183 cm 以上、幅 60 cm 以上',
        'NBR または高密度フォーム素材',
        '両面エンボス、または滑り止め加工',
        'キャリーストラップまたは収納バンド付き',
        '床に常設しても臭いが強すぎない素材'
      ],
      niceToHave: ['188 cm 以上', '水拭き可能', '重量 1.2 kg 以下で移動しやすい'],
      why:
        '6 mm 程度の一般的ヨガマットでは、膝・肘・足音の衝撃吸収が足りない。12 mm 厚なら関節保護と階下騒音対策を両立しやすい。',
      searchLinks: [
        {
          label: 'Amazon: ヨガマット 12mm NBR 183cm',
          url: 'https://www.amazon.co.jp/s?k=%E3%83%A8%E3%82%AC%E3%83%9E%E3%83%83%E3%83%88+12mm+NBR+183cm'
        }
      ],
      examples: ['Amazon Basics 12 mm ヨガマット', 'NBR 12 mm 厚のピラティス / トレーニングマット'],
      avoid: [
        '厚み 6 mm / 8 mm の薄手',
        '長さ 173 cm 以下',
        'PVC で化学臭が強いもの',
        '折りたたみ式の薄いストレッチマット',
        '滑り止め加工がないもの'
      ],
      verifyBeforeBuy: [
        '商品寸法が 183 cm 以上 × 60 cm 以上 × 10-12 mm と明記',
        '素材が NBR または高密度フォーム',
        'レビューで「臭いが強い」「すぐ破れる」が多くない',
        '返品可能'
      ],
      verifyAfterReceive: [
        '寝転んだとき頭と足がマット内に収まる',
        '膝立ちで床の硬さを感じない',
        '開封後 2-3 日で臭いが許容範囲になる',
        'リビング常設できるサイズ感'
      ]
    }
  },
  {
    id: 'tool-shaker',
    group: 'tools',
    title: 'プロテインシェイカー仕様を満たすものを選ぶ',
    summary: '600-800 ml、漏れない、洗いやすい、匂い移りしにくい',
    cost: '¥800-3,000',
    spec: {
      purpose: '朝 30 g + 夕 15 g のホエイプロテインを、洗浄ストレス少なく毎日飲む。',
      must: [
        '容量 600-800 ml',
        'ねじ式蓋、または確実にロックできる漏れ防止構造',
        '広口で洗いやすい',
        '食洗機対応または手洗いしやすい単純構造',
        '匂い移りしにくい素材（ステンレス推奨、プラスチックなら BPA free）'
      ],
      niceToHave: ['目盛り付き', 'パッキン交換可能', '同じものを 2 個買える価格帯'],
      why:
        '毎日使うため「安いが臭う・漏れる・洗いにくい」は継続を壊す。容量と洗いやすさが最優先。',
      searchLinks: [
        {
          label: 'Amazon: プロテインシェイカー 700ml 漏れない ステンレス',
          url: 'https://www.amazon.co.jp/s?k=%E3%83%97%E3%83%AD%E3%83%86%E3%82%A4%E3%83%B3%E3%82%B7%E3%82%A7%E3%82%A4%E3%82%AB%E3%83%BC+700ml+%E6%BC%8F%E3%82%8C%E3%81%AA%E3%81%84+%E3%82%B9%E3%83%86%E3%83%B3%E3%83%AC%E3%82%B9'
        }
      ],
      examples: ['マイプロテインのメタルシェイカー', 'ShakeSphere 700 ml', 'BPA free の 700 ml シェイカー'],
      avoid: [
        '容量 400 ml 以下',
        'ワンタッチ蓋が弱く、バッグ内で開きそうなもの',
        '複雑なボール・網パーツが多く洗いにくいもの',
        '飲み口の溝が深く汚れやすいもの'
      ],
      verifyBeforeBuy: [
        '600 ml 以上の容量表記',
        '漏れ防止をうたっておりレビューでも漏れ報告が少ない',
        '洗いやすさへの言及がある',
        '交換・返品可能'
      ],
      verifyAfterReceive: [
        '水を半分入れて 30 秒振って漏れない',
        '飲み口を閉じた状態で逆さにして漏れない',
        '手を入れて底まで洗える、またはブラシで届く',
        'プロテインを 1 回溶かしてダマが許容範囲'
      ]
    }
  },
  {
    id: 'tool-bottle',
    group: 'tools',
    title: '1 L 水筒仕様を満たすものを選ぶ',
    summary: '1L、直飲み、洗いやすい、デスク常設',
    cost: '¥3,000-5,000',
    spec: {
      purpose: '水 2 L/日を、デスク常設 + 空になったら補充で自動化する。',
      must: [
        '容量 900-1100 ml',
        '直飲みできる',
        '口径 4 cm 以上で洗いやすい',
        '真空断熱ステンレス',
        '漏れ防止ロック付き',
        'パーツが分解洗浄できる'
      ],
      niceToHave: ['全パーツ食洗機対応', 'スポーツ飲料対応', '本体重量 400 g 以下'],
      why: '500 ml では補充回数が多くなり運用摩擦が増える。1 L はデスク常設で「2 回空にする」だけになり、水分摂取が自動化しやすい。',
      searchLinks: [
        {
          label: 'Amazon: 1L 真空断熱 ケータイマグ 直飲み 食洗機対応',
          url: 'https://www.amazon.co.jp/s?k=1L+%E7%9C%9F%E7%A9%BA%E6%96%AD%E7%86%B1+%E3%82%B1%E3%83%BC%E3%82%BF%E3%82%A4%E3%83%9E%E3%82%B0+%E7%9B%B4%E9%A3%B2%E3%81%BF+%E9%A3%9F%E6%B4%97%E6%A9%9F'
        }
      ],
      examples: ['サーモス JNL-S1000 相当', '象印 1 L 直飲みステンレスボトル'],
      avoid: [
        '500 ml 以下',
        'コップ式',
        '口径が狭く洗いにくいもの',
        '保冷なしのプラスチックボトル',
        '漏れ防止ロックがないもの'
      ],
      verifyBeforeBuy: [
        '容量 900-1100 ml',
        '直飲みタイプ',
        '口径 4 cm 以上または洗いやすさの説明',
        '漏れ防止ロック付き'
      ],
      verifyAfterReceive: [
        '満水で逆さにして 30 秒漏れない',
        '片手で開閉できる',
        '机上で倒れにくい',
        '洗浄パーツを分解できる'
      ]
    }
  },
  {
    id: 'tool-bento',
    group: 'tools',
    title: '弁当・玄米コンテナ仕様を満たすものを選ぶ',
    summary: '700 ml 前後 × 20、冷凍・レンジ・食洗機、積み重ね可能',
    cost: '¥3,000-5,000',
    spec: {
      purpose: '週末バッチ調理した弁当と玄米を、冷凍・冷蔵・レンジ加熱まで同じ容器で回す。',
      must: [
        '容量 650-750 ml 前後',
        '合計 20 個',
        '冷凍対応',
        '電子レンジ対応（蓋は外す / ずらす条件でも可）',
        '食洗機対応',
        '同一形状で積み重ね可能',
        '食品用ポリプロピレン、BPA free または国内メーカー品',
        '4 個を玄米小分け用に色テープで区別できる'
      ],
      niceToHave: ['正方形または浅型長方形', '耐熱 120 ℃以上', '追加購入しやすい定番品'],
      why:
        '容器がバラバラだと冷凍庫効率と洗浄効率が落ちる。700 ml 前後なら玄米 150 g + 主菜 + 副菜が入り、20 個あれば弁当 16 + 玄米 4 を回せる。',
      searchLinks: [
        {
          label: 'Amazon: 食品保存容器 700ml 20個 冷凍 レンジ 食洗機',
          url: 'https://www.amazon.co.jp/s?k=%E9%A3%9F%E5%93%81%E4%BF%9D%E5%AD%98%E5%AE%B9%E5%99%A8+700ml+20%E5%80%8B+%E5%86%B7%E5%87%8D+%E3%83%AC%E3%83%B3%E3%82%B8+%E9%A3%9F%E6%B4%97%E6%A9%9F'
        }
      ],
      examples: ['ジップロック コンテナー正方形 700 ml 相当', '業務用 PP 700 ml ミールプレップ容器'],
      avoid: [
        '丸型（冷凍庫の空間効率が悪い）',
        '1100 ml 以上（容量過多で冷凍庫圧迫）',
        '500 ml 以下（主食 + 主菜 + 副菜が入りにくい）',
        '電子レンジ不可',
        '蓋一体型で洗いにくいもの'
      ],
      verifyBeforeBuy: [
        '容量が 650-750 ml',
        '20 個前後で同一形状が揃う',
        '冷凍・レンジ・食洗機対応',
        '冷凍庫に入る高さと形状',
        'レビューで蓋割れ・液漏れが多くない'
      ],
      verifyAfterReceive: [
        '20 個揃っている',
        '水を半分入れて傾けても大きく漏れない',
        '冷凍庫内で 4-5 段積める',
        '4 個に米用の色テープを貼る'
      ]
    }
  },
  {
    id: 'tool-bp',
    group: 'tools',
    title: '家庭血圧計仕様を満たすものを選ぶ',
    summary: '上腕式、医療機器認証、カフサイズ適合',
    cost: '¥5,000-15,000',
    spec: {
      purpose: '白衣高血圧・仮面高血圧を見逃さず、朝晩 2 回 × 1 週間の家庭血圧ベースラインを取る。',
      must: [
        '上腕式',
        '日本の医療機器認証番号あり',
        '本人の上腕周に合うカフ（目安 22-42 cm、少なくとも実測 + 余裕）',
        '測定値メモリ機能、またはアプリ連携',
        '不規則脈波検知または体動検知がある',
        '1 ボタンで測定開始できる'
      ],
      niceToHave: ['Bluetooth アプリ連携', '早朝高血圧マーク', 'バックライト液晶', 'AC アダプタ対応'],
      why:
        '家庭血圧は上腕式が基本。手首式は姿勢・高さで誤差が出やすく、医療判断のベースラインとして弱い。',
      searchLinks: [
        {
          label: 'Amazon: 上腕式 血圧計 医療機器認証 カフ 22-42cm',
          url: 'https://www.amazon.co.jp/s?k=%E4%B8%8A%E8%85%95%E5%BC%8F+%E8%A1%80%E5%9C%A7%E8%A8%88+%E5%8C%BB%E7%99%82%E6%A9%9F%E5%99%A8%E8%AA%8D%E8%A8%BC+%E3%82%AB%E3%83%95+22-42cm'
        }
      ],
      examples: ['オムロン上腕式 HEM シリーズ', 'A&D 上腕式血圧計', 'テルモ上腕式血圧計'],
      avoid: [
        '手首式',
        '医療機器認証番号が確認できないもの',
        'カフサイズが本人の腕周に合わないもの',
        '測定履歴が残らないもの',
        '無名メーカーで精度検証が不明なもの'
      ],
      verifyBeforeBuy: [
        '医療機器認証番号が商品ページにある',
        '対応腕周が本人の上腕周より広い',
        '上腕式である',
        'メモリまたはアプリ連携がある',
        '返品可能'
      ],
      verifyAfterReceive: [
        'カフが上腕に無理なく巻ける',
        '朝晩 2 回測定がストレスなくできる',
        '測定値がメモリまたはアプリに残る',
        '椅子座位 5 分後に常識的な値が出る'
      ]
    }
  },
  {
    id: 'tool-amazon-subscriptions',
    group: 'tools',
    title: '常温保存品 6 銘柄の仕様を満たして定期化',
    summary: 'プロテイン・MV・味噌汁・ナッツ・米保険・サバ缶',
    cost: '約 ¥15,000/月',
    spec: {
      purpose: 'タンパク質 125 g/日、緊急時の食事保険、選択肢ゼロ運用を常温保存品で支える。',
      must: [
        'ホエイプロテイン: 1 kg × 2 袋/月、1 食 20-25 g 以上のタンパク質',
        'マルチビタミン: 1 日 1 粒、国内流通の定番品、過剰なメガドーズでない',
        'インスタント味噌汁: 1 日 1 杯まで、常温保存、できればフリーズドライ',
        '素焼きナッツ: 食塩無添加、500 g 前後',
        '白米パック: 150 g 前後 × 20 個以上、緊急保険',
        'サバ水煮缶: 食塩不使用または減塩、190 g 前後 × 5 缶'
      ],
      niceToHave: ['定期便で配送周期を個別設定できる', 'プロテインは公式セール時にまとめ買い可能'],
      why:
        '常温保存品は買い忘れと意思決定を消す。特にプロテインとサバ缶はタンパク質不足の保険として機能する。',
      searchLinks: [
        {
          label: 'Amazon 定期おトク便',
          url: 'https://www.amazon.co.jp/auto-deliveries'
        },
        {
          label: 'マイプロテイン公式',
          url: 'https://www.myprotein.jp/'
        }
      ],
      examples: [
        'Impact ホエイ等のホエイプロテイン',
        'ネイチャーメイド等の標準的マルチビタミン',
        '食塩不使用サバ水煮缶'
      ],
      avoid: [
        '砂糖・脂質の多いウエイトゲイナー',
        '食塩入りサバ缶を主力にする',
        '味付きナッツ / 加塩ナッツ',
        '大量サプリを増やして管理項目を増やす'
      ],
      verifyBeforeBuy: [
        'プロテイン 1 食あたりタンパク質量が 20 g 以上',
        'ナッツは食塩無添加',
        'サバ缶は食塩不使用または減塩',
        '配送周期が過剰在庫にならない'
      ],
      verifyAfterReceive: [
        '賞味期限が 3 ヶ月以上ある',
        'キッチンの同じ場所に固定配置',
        '定期便の次回配送日を確認',
        'プロテイン味が継続可能'
      ]
    }
  },
  {
    id: 'tool-belx-first',
    group: 'tools',
    title: 'ベルクス初回購入の仕様で買う',
    summary: '生鮮・乳製品・パン・玄米の固定運用',
    cost: '約 ¥7,200/月',
    spec: {
      purpose: '朝食固定メニューと週末徒歩買い物ルーチンを成立させる。',
      must: [
        '卵: M サイズ以上、10 個パック',
        '納豆: 45 g × 3 パック前後、タレは使いすぎない',
        '無糖ヨーグルト: 400 g 前後、プレーン',
        '全粒または標準食パン: 6 枚切、冷凍保存可能',
        '絹豆腐: 300 g 前後',
        '玄米: 国産 5 kg 袋、銘柄不問、価格重視'
      ],
      niceToHave: ['徒歩で行ける店舗固定', '家族買い物と同時実行'],
      why:
        '朝食を固定し、週末買い物を NEAT と家族時間にする。銘柄を細かくこだわらず、仕様で選べば買い間違いが少ない。',
      searchLinks: [
        {
          label: 'Google Maps: ベルクス浦和原山店',
          url: 'https://www.google.com/maps/search/?api=1&query=%E3%83%99%E3%83%AB%E3%82%AF%E3%82%B9%E6%B5%A6%E5%92%8C%E5%8E%9F%E5%B1%B1%E5%BA%97'
        }
      ],
      examples: ['おかめ納豆 極小粒', '明治ブルガリア LB81 プレーン', 'Pasco 超熟 6 枚切'],
      avoid: [
        '砂糖入りヨーグルト',
        '菓子パン',
        'リスト外の菓子・甘い飲料',
        '高級ブランド玄米にこだわって価格を上げる'
      ],
      verifyBeforeBuy: [
        'iPhone メモにリストを固定',
        '冷凍庫にパン保存スペースがある',
        '家族用と自分用の会計・保管を混同しない'
      ],
      verifyAfterReceive: [
        'パンを冷凍保存',
        '卵・納豆・ヨーグルトの定位置を決める',
        '玄米 5 kg をバッチ調理しやすい場所へ保管'
      ]
    }
  },
  {
    id: 'tool-frozen-first',
    group: 'tools',
    title: '業務スーパー初回購入の仕様で買う',
    summary: '3 パターンローテ用の冷凍主菜・副菜',
    cost: '約 ¥8,200/月',
    spec: {
      purpose: '弁当 3 パターンローテ（サバ / 鶏胸 / 豚ヒレ）を冷凍食品で安定運用する。',
      must: [
        '冷凍ブロッコリー 500 g 前後',
        '冷凍ほうれん草、冷凍コーン、冷凍オクラ、冷凍きのこ類',
        'サバ: 食塩不使用または減塩、味付けなし',
        '鶏胸肉: 国産、皮なしまたは皮を外せる、味付けなし',
        '豚ヒレ: 赤身、味付けなし',
        '冷凍ブルーベリー: 砂糖不使用'
      ],
      niceToHave: ['500 g 袋で管理しやすい', '原材料欄が野菜・肉・魚だけに近い'],
      why:
        '味付き・タレ付きはカロリーと塩分が読めない。素材に近い冷凍品を選ぶことで 3 パターンローテの計算が崩れない。',
      searchLinks: [
        {
          label: 'Google Maps: 業務スーパー浦和花月店',
          url: 'https://www.google.com/maps/search/?api=1&query=%E6%A5%AD%E5%8B%99%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E6%B5%A6%E5%92%8C%E8%8A%B1%E6%9C%88%E5%BA%97'
        }
      ],
      examples: ['業務スーパー 冷凍ブロッコリー', '国産鶏胸肉', '塩不使用サバ切身'],
      avoid: [
        'タレ漬け肉',
        '塩サバを主力にする',
        '衣付き・揚げ済み冷凍食品',
        '砂糖入り冷凍フルーツ',
        '味付き野菜ミックス'
      ],
      verifyBeforeBuy: [
        '冷凍庫の空き容量を確認',
        '原材料欄に砂糖・タレ・衣がない',
        'サバは食塩量を確認',
        '肉は国産または信頼できる産地'
      ],
      verifyAfterReceive: [
        '冷凍庫に入り切る',
        '主菜ごとに袋を分ける',
        '次回買い物量をメモする'
      ]
    }
  },
  {
    id: 'med-sas',
    group: 'medical',
    title: 'SAS 簡易検査サービス仕様で選ぶ',
    summary: 'Type 3 相当 HSAT、AHI / ODI / SpO2、医師判定',
    cost: '保険適用なら ¥3,000-5,000、自費なら ¥5,000-15,000',
    spec: {
      purpose: '睡眠時無呼吸症候群を見逃さず、減量・血圧・代謝の阻害要因を早期に把握する。',
      must: [
        'Type 3 相当の在宅睡眠時無呼吸検査（HSAT）',
        'AHI（無呼吸低呼吸指数）が数値で出る',
        'ODI（酸素飽和度低下指数）または SpO2 最低値が出る',
        '鼻気流または気流センサーを含む',
        '医師による結果説明・判定がある',
        '中等症以上なら PSG 精密検査または CPAP へ繋がる導線がある'
      ],
      niceToHave: ['オンライン診療対応', '保険適用', '機器配送と返送が簡単', '結果 PDF 保存'],
      why:
        'いびきアプリや酸素飽和度だけでは AHI が分からない。AHI / ODI / SpO2 と医師判定が揃って初めて次の医療判断に使える。',
      searchLinks: [
        {
          label: 'Google: SAS 在宅簡易検査 AHI ODI 医師判定',
          url: 'https://www.google.com/search?q=SAS+%E5%9C%A8%E5%AE%85%E7%B0%A1%E6%98%93%E6%A4%9C%E6%9F%BB+AHI+ODI+%E5%8C%BB%E5%B8%AB%E5%88%A4%E5%AE%9A'
        }
      ],
      examples: ['呼吸器内科・睡眠外来の在宅簡易検査', 'オンライン診療対応クリニックの HSAT'],
      avoid: [
        'いびき録音アプリ単体',
        'パルスオキシメータだけ',
        'AHI が出ないサービス',
        '医師判定がない自費キット',
        '異常時の紹介・治療導線がないサービス'
      ],
      verifyBeforeBuy: [
        'AHI が数値で報告される',
        'ODI または SpO2 最低値が報告される',
        '医師の結果説明がある',
        '保険適用か自費か、総額が分かる',
        '中等症以上の次ステップが明記されている'
      ],
      verifyAfterReceive: [
        'センサー装着方法が分かる',
        '1 晩分の測定が完了する',
        '結果 PDF または紙を保存',
        'AHI 15 以上なら精密検査 / CPAP 相談へ進む'
      ]
    }
  },
  {
    id: 'med-dexa',
    group: 'medical',
    title: 'DEXA 3 回サービス仕様で選ぶ',
    summary: '全身体組成 + 骨密度、同一施設・同一機種・同一時間帯',
    cost: '自費全身 DEXA は 3 回計 ¥60,000-90,000 も想定',
    spec: {
      purpose: '体重減少の中で LBM（除脂肪量）を守れているかを、Month 6 と Month 12 で客観判定する。',
      must: [
        '全身体組成（脂肪量、体脂肪率、除脂肪量 / LBM、部位別）が出る',
        '骨密度も同時取得できる',
        '同一施設・同一機種・同一時間帯で 3 回実施できる',
        '体重 110 kg 以上に対応',
        '測定レポートを PDF または紙で保存できる',
        '測定前条件（朝食、運動、服装）を固定できる'
      ],
      niceToHave: ['GE Lunar iDXA または Hologic 全身対応機', '午前枠が取りやすい', '3 回まとめて予約可能'],
      why:
        'InBody や家庭体組成計では LBM 変化の判断に誤差が大きい。ADR-023 の二段階 LBM 判定には、同一条件の DEXA が必要。',
      searchLinks: [
        {
          label: 'Google: DEXA 全身体組成 骨密度 自費 関東',
          url: 'https://www.google.com/search?q=DEXA+%E5%85%A8%E8%BA%AB%E4%BD%93%E7%B5%84%E6%88%90+%E9%AA%A8%E5%AF%86%E5%BA%A6+%E8%87%AA%E8%B2%BB+%E9%96%A2%E6%9D%B1'
        }
      ],
      examples: ['全身体組成対応の予防医療クリニック', '全身 DEXA を明記する人間ドック施設'],
      avoid: [
        '腰椎・大腿骨だけの骨粗鬆症 DEXA',
        'InBody / BIA を DEXA 代替にする',
        '3 回を別施設で測る',
        '機種名が確認できない施設',
        '時間帯や前日条件を揃えられない運用'
      ],
      verifyBeforeBuy: [
        '全身体組成と骨密度が両方出ると確認',
        '3 回とも同一機種で予約可能',
        '体重 110 kg 以上対応',
        '午前帯で予約できる',
        'レポートの項目に LBM / lean mass がある'
      ],
      verifyAfterReceive: [
        'レポートを PDF / 紙で保存',
        '測定機種名を記録',
        '次回予約も同じ施設・同じ時間帯で押さえる',
        '道標 3 の検査入力に主要値を入れる'
      ]
    }
  },
  {
    id: 'med-blood',
    group: 'medical',
    title: '詳細血液検査 + 腹部エコーを依頼できる内科を選ぶ',
    summary: 'HbA1c / 脂質 / 肝腎 / TSH / 腹部エコー、近隣かかりつけ',
    cost: '保険適用中心、拡張は自費 ¥10,000-20,000',
    spec: {
      purpose: '糖代謝・脂質・肝腎機能・脂肪肝を初期評価し、父軌道リスクと GLP-1 保険適用可能性を把握する。',
      must: [
        '自転車圏または通院しやすい内科',
        'HbA1c、空腹時血糖',
        'LDL、HDL、中性脂肪',
        'AST、ALT、γ-GTP',
        'Cre、eGFR、尿アルブミン',
        '尿酸、TSH',
        '腹部エコー（NAFLD 評価）',
        '検査項目を事前に電話で相談できる'
      ],
      niceToHave: ['土曜診療', '検査結果を PDF / アプリで受け取れる', '生活習慣病管理に慣れている'],
      why:
        'BMI と体重だけでは代謝・肝臓・腎臓のリスクが見えない。保険診療で拾える範囲を最初に押さえる。',
      searchLinks: [
        {
          label: 'Google Maps: 本太 原山 内科 腹部エコー',
          url: 'https://www.google.com/maps/search/?api=1&query=%E6%9C%AC%E5%A4%AA+%E5%8E%9F%E5%B1%B1+%E5%86%85%E7%A7%91+%E8%85%B9%E9%83%A8%E3%82%A8%E3%82%B3%E3%83%BC'
        }
      ],
      examples: ['生活習慣病外来のある近隣内科', '腹部エコー対応クリニック'],
      avoid: [
        '健診パッケージだけで項目追加できない施設',
        '腹部エコーができない施設',
        '通院しにくい遠方',
        '結果説明が雑で継続相談しにくい施設'
      ],
      verifyBeforeBuy: [
        '電話で必須項目を読み上げ、対応可否を確認',
        '腹部エコーの予約可否',
        '朝食抜き条件と予約時刻',
        '結果説明の再来院日'
      ],
      verifyAfterReceive: [
        '検査結果を写真または PDF で保存',
        '異常値があれば再診予約',
        '道標 3 の検査入力に主要値を入れる',
        'H-2b 拡張条件に該当するか確認'
      ]
    }
  },
  {
    id: 'app-a2hs',
    group: 'app',
    title: '道標 3 をホーム画面に追加する',
    summary: 'Safari の A2HS、毎日開く導線',
    detail: 'Safari で開いて 共有 → ホーム画面に追加。',
    spec: {
      purpose: 'ドキュメントを開かず、今日やることだけを毎日 1 タップで見る。',
      must: ['Safari で本番 URL を開く', '共有 → ホーム画面に追加', 'ホーム画面のアイコンから起動できる'],
      why: 'ブラウザブックマークでは開く摩擦が高い。ホーム画面アプリ化で朝の確認を固定する。',
      searchLinks: [{ label: '道標 3 本番 URL', url: 'https://baspis.github.io/health-plan-app/' }],
      examples: ['iOS Safari A2HS'],
      avoid: ['Chrome から追加する', 'Safari のタブのまま放置する'],
      verifyBeforeBuy: ['iPhone の Safari で開いている'],
      verifyAfterReceive: ['ホーム画面にアイコンがある', 'アイコンから起動して prep が表示される']
    }
  },
  {
    id: 'app-shortcut',
    group: 'app',
    title: 'iOS Shortcuts 日次同期を作る',
    summary: 'Apple Health → 道標 3、workoutType も送る',
    detail: 'webapp/shortcuts/README.md の手順通り。',
    spec: {
      purpose: '体重・睡眠・心拍・歩数・ワークアウトを手入力なしで道標 3 に同期する。',
      must: [
        '毎朝 7:05 自動実行',
        'date / weight / sleep / rhr / hrv / steps / vo2max / workoutMin を送る',
        'workoutType を必ず送る',
        'ingest token を URL に含める'
      ],
      niceToHave: ['運動後に手動実行できるショートカットアイコン'],
      why: '道標 3 の「やったら褒める」は Apple Health 自動検出に依存する。workoutType がないと筋トレ・HIIT・ヨガの判別ができない。',
      searchLinks: [{ label: 'Shortcuts 手順書', url: 'https://github.com/baspis/health-plan-app/blob/main/shortcuts/README.md' }],
      examples: ['iOS Shortcuts 個人用オートメーション'],
      avoid: ['workoutType なし', '実行前に尋ねる ON', 'Safari 以外で PWA と別ストレージになる運用'],
      verifyBeforeBuy: ['ヘルスケア権限がショートカットに付与されている', 'token が一致している'],
      verifyAfterReceive: ['手動実行後に Today に体重が出る', '運動後に workoutType が反映される']
    }
  },
  {
    id: 'app-automation',
    group: 'app',
    title: '毎朝 7:05 自動オートメーション設定',
    summary: '実行前に尋ねるをオフ',
    detail: 'Shortcuts の個人用オートメーションで時刻トリガー。',
    spec: {
      purpose: '日次同期を本人の入力なしで走らせる。',
      must: ['時刻トリガー: 毎日 7:05', '実行前に尋ねる OFF', '通知だけ許可しても可'],
      why: '手動同期は忘れる。体重測定直後に自動で同期されるのが最も摩擦が少ない。',
      searchLinks: [{ label: 'Apple Shortcuts ユーザーガイド', url: 'https://support.apple.com/guide/shortcuts/welcome/ios' }],
      examples: ['個人用オートメーション 時刻'],
      avoid: ['実行前に尋ねる ON', '通知だけで実行しない設定'],
      verifyBeforeBuy: ['ショートカット単体で手動実行成功'],
      verifyAfterReceive: ['翌朝 7:05 以降に道標 3 にデータが入る']
    }
  },
  {
    id: 'env-sweet',
    group: 'environment',
    title: '甘い飲料・菓子を撤去する',
    summary: '視界から消す',
    detail: '家にないものは食べられない。',
    spec: {
      purpose: '意思決定と我慢を発生させない。',
      must: ['冷蔵庫・キッチン・デスク周りから甘い飲料と菓子を撤去', '家族用と自分用の保管場所を分ける'],
      why: '視界に入るだけで WillPower を消費する。買わない・置かないが最も強い。',
      avoid: ['見える場所に置く', '自分用の引き出しに非常食として甘い物を置く'],
      verifyBeforeBuy: ['撤去先を決める'],
      verifyAfterReceive: ['デスクと冷蔵庫に甘い飲料がない']
    }
  },
  {
    id: 'env-shoes',
    group: 'environment',
    title: '玄関にシューズを定位置化する',
    summary: '出る摩擦を消す',
    detail: 'Brooks Ghost MAX 継続使用。',
    spec: {
      purpose: 'ウォーキング開始の摩擦を減らす。',
      must: ['玄関の見える場所に置く', '靴下も近くに置く', '雨の日の代替も決める'],
      why: '運動前の探し物を消すと開始率が上がる。',
      avoid: ['クローゼット内にしまう', '家族靴の奥に埋もれる'],
      verifyBeforeBuy: ['現在の靴が痛んでいない'],
      verifyAfterReceive: ['玄関で 10 秒以内に履ける']
    }
  },
  {
    id: 'env-mat',
    group: 'environment',
    title: 'マットをリビング常設する',
    summary: '畳まない、広げたまま',
    detail: 'AF+ 動画開始の摩擦を消す。',
    spec: {
      purpose: 'ヨガ・筋トレ開始の物理摩擦を消す。',
      must: ['リビングに広げたまま置ける', '家族動線を塞がない', 'Apple TV / iPhone 画面が見える位置'],
      why: 'マットを出す行為自体が開始ハードルになる。',
      avoid: ['毎回丸めて収納', '家具の下に押し込む'],
      verifyBeforeBuy: ['常設位置を決める'],
      verifyAfterReceive: ['AF+ を開いてその場で開始できる']
    }
  },
  {
    id: 'env-water',
    group: 'environment',
    title: '水筒をデスク常設する',
    summary: '空になったら即補充',
    detail: '水 2 L/日。',
    spec: {
      purpose: '水分摂取を意識ではなく配置で自動化する。',
      must: ['デスク右手または左手の視界内', '空になったら補充する導線', '就寝前に洗う置き場所'],
      why: '視界内にある水は飲む。別室にある水は飲まない。',
      avoid: ['キッチンに置きっぱなし', '洗い物カゴに放置'],
      verifyBeforeBuy: ['デスク上の置き場所を空ける'],
      verifyAfterReceive: ['1 日 2 回空にできる']
    }
  },
  {
    id: 'cond-freezer',
    group: 'conditional',
    title: '条件付き: 小型冷凍庫 30-40 L 仕様',
    summary: '家族冷凍庫を弁当が圧迫したら購入',
    cost: '¥14,000-18,000',
    optional: true,
    spec: {
      purpose: '弁当 12 個運用が家族冷凍庫を圧迫した時だけ、摩擦を物理的に分離する。',
      must: ['容量 30-40 L', '静音 25 dB 前後', '幅 50 cm 以下', '霜取りしやすい', '弁当容器が 12 個以上入る棚寸法'],
      niceToHave: ['引き出し式', '年間電気代が低い', '上に物を置ける天板'],
      why: '家族調整ではなく物理分離で摩擦を減らす。ただし実害化前に買わない。',
      searchLinks: [{ label: 'Amazon: 小型冷凍庫 30L 40L 静音', url: 'https://www.amazon.co.jp/s?k=%E5%B0%8F%E5%9E%8B%E5%86%B7%E5%87%8D%E5%BA%AB+30L+40L+%E9%9D%99%E9%9F%B3' }],
      examples: ['Haier 30-40 L クラス', 'アイリスオーヤマ 1 ドア冷凍庫 30-40 L クラス'],
      avoid: ['60 L 以上（過剰）', '騒音値不明', '設置場所がないのに購入'],
      verifyBeforeBuy: ['設置場所の幅・奥行・コンセント位置を測る', '弁当容器サイズが棚に入る'],
      verifyAfterReceive: ['弁当 12 個が入る', '寝室や仕事部屋に音が響かない']
    }
  },
  {
    id: 'cond-sousvide',
    group: 'conditional',
    title: '条件付き: 低温調理器仕様',
    summary: '鶏胸 4 週連続安定後のみ',
    cost: '¥10,000-15,000',
    optional: true,
    spec: {
      purpose: '鶏胸肉パターンをパサつかず安全に量産する。',
      must: ['温度 55-90 ℃設定', '0.5 ℃単位または 1 ℃単位', 'タイマー 1-24 h', '水循環式', '国内 PSE 対応'],
      niceToHave: ['防水 IPX7', 'クリップ固定が安定', 'スマホアプリ不要でも使える'],
      why: '鶏胸を継続できない時だけ買う。最初から買うと道具が増えすぎる。',
      searchLinks: [{ label: 'Amazon: 低温調理器 PSE 防水', url: 'https://www.amazon.co.jp/s?k=%E4%BD%8E%E6%B8%A9%E8%AA%BF%E7%90%86%E5%99%A8+PSE+%E9%98%B2%E6%B0%B4' }],
      examples: ['BONIQ クラス', 'Anova クラス'],
      avoid: ['PSE 不明', '温度精度不明', 'アプリ必須で本体操作不可'],
      verifyBeforeBuy: ['鶏胸パターンを 4 週連続で実施済み', '鍋の深さと水量が対応'],
      verifyAfterReceive: ['60 ℃設定で水温が安定', 'クリップが鍋に固定できる']
    }
  },
  {
    id: 'cond-eggmaker',
    group: 'conditional',
    title: '条件付き: ゆで卵メーカー仕様',
    summary: '電気ケトル代用で困った時のみ',
    cost: '¥2,500-4,000',
    optional: true,
    spec: {
      purpose: 'ゆで卵 14 個を週末に安定生産する。',
      must: ['一度に 6 個以上', '固ゆで対応', '自動停止またはブザー', '洗いやすいトレー'],
      niceToHave: ['7 個以上', '水量カップ付き', 'PSE 対応'],
      why: '電気ケトルで代用できるなら不要。ゆで卵工程が失敗源になった時だけ買う。',
      searchLinks: [{ label: 'Amazon: ゆで卵メーカー 7個 PSE', url: 'https://www.amazon.co.jp/s?k=%E3%82%86%E3%81%A7%E5%8D%B5%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC+7%E5%80%8B+PSE' }],
      examples: ['7 個対応の蒸し式ゆで卵メーカー'],
      avoid: ['3 個以下', '洗いにくい一体型', '自動停止なし'],
      verifyBeforeBuy: ['電気ケトル代用で 2 回以上失敗した'],
      verifyAfterReceive: ['固ゆで 7 個が一度に作れる', '殻が剥きやすい']
    }
  },
  {
    id: 'cond-dumbbell',
    group: 'conditional',
    title: '条件付き: 可変式ダンベル仕様',
    summary: 'バンド plateau or DEXA 介入時のみ',
    cost: '¥15,000-35,000',
    optional: true,
    spec: {
      purpose: 'バンドの eccentric loading 不足を補い、LBM 維持・微増の負荷を確保する。',
      must: ['片手 5-12.5 kg 以上', '2 個セット', '重量変更が 10 秒以内', 'プレート固定が確実', '防振マット併用'],
      niceToHave: ['2 kg 刻み以下', '床置き時に転がらない', '拡張可能'],
      why: 'ダンベルは床への点荷重と騒音リスクがあるため最初から買わない。必要になった時に安全条件を満たして導入する。',
      searchLinks: [{ label: 'Amazon: 可変式ダンベル 2個セット 12.5kg 防振', url: 'https://www.amazon.co.jp/s?k=%E5%8F%AF%E5%A4%89%E5%BC%8F%E3%83%80%E3%83%B3%E3%83%99%E3%83%AB+2%E5%80%8B+12.5kg+%E9%98%B2%E6%8C%AF' }],
      examples: ['Flexbell クラス', 'Bowflex SelectTech クラス'],
      avoid: ['鉄プレートを床に直置き', '片手 5 kg まで', '固定が甘くプレートが落ちる構造'],
      verifyBeforeBuy: ['バンド 3 段階を使い切った、または DEXA 介入条件に該当', '防振マット設置場所がある'],
      verifyAfterReceive: ['重量変更がスムーズ', 'プレートが落ちない', '床に響かない場所で扱える']
    }
  },
  {
    id: 'cond-gym',
    group: 'conditional',
    title: '条件付き: 24h ジム仕様',
    summary: 'Phase 4 or DEXA 介入時のみ',
    cost: '¥7,000-8,000/月',
    optional: true,
    spec: {
      purpose: '家庭器具で負荷不足になった時、騒音リスクなしに高負荷トレーニングへ移行する。',
      must: ['自転車 15 分以内', '24h または早朝利用可', 'パワーラックまたはスミスマシン', 'ラットプル / ロー / レッグプレス等のマシン', '月額 ¥8,000 前後まで'],
      niceToHave: ['シャワー不要で使いやすい立地', '混雑状況がアプリで見える', '相互利用可'],
      why: 'ジムは最初から入ると固定費と移動摩擦が増える。必要条件が出た時だけ選ぶ。',
      searchLinks: [{ label: 'Google Maps: 浦和 24時間 ジム', url: 'https://www.google.com/maps/search/?api=1&query=%E6%B5%A6%E5%92%8C+24%E6%99%82%E9%96%93+%E3%82%B8%E3%83%A0' }],
      examples: ['Anytime Fitness 浦和圏', 'ファストジム 24 浦和圏'],
      avoid: ['徒歩・自転車で通いにくい遠方', 'フリーウェイトなし', '月額が高すぎる', '営業時間が短い'],
      verifyBeforeBuy: ['見学して混雑時間を確認', '使う予定のマシンがある', '解約条件を確認'],
      verifyAfterReceive: ['週 2-3 回通える時間帯がある', '初回メニューを 3 種目に固定']
    }
  },
  {
    id: 'cond-shoes',
    group: 'conditional',
    title: '条件付き: シューズ買い替え仕様',
    summary: '年 1 回 or クッション劣化時',
    cost: '¥18,000-25,000',
    optional: true,
    spec: {
      purpose: '110 kg のウォーキングで膝・足首を守る。',
      must: ['最大クッション系', '安定性が高い', 'ワイド幅が選べる', '店頭試着できる', '普段歩く靴下で試す'],
      niceToHave: ['ロッカー形状', '返品交換可能', '旧モデル値下げ'],
      why: 'クッションは消耗品。痛みが出てからでは遅いので年 1 回またはアウトソール摩耗で交換する。',
      searchLinks: [{ label: 'Google: 最大クッション ウォーキング シューズ 110kg', url: 'https://www.google.com/search?q=%E6%9C%80%E5%A4%A7%E3%82%AF%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3+%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%AD%E3%83%B3%E3%82%B0+%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA+110kg' }],
      examples: ['Brooks Ghost MAX 系', 'HOKA Bondi 系', 'ASICS GEL-NIMBUS 系'],
      avoid: ['薄底', 'レーシングシューズ', '幅が合わない靴', 'ネットだけで試着なし'],
      verifyBeforeBuy: ['店員に体重が重くクッション厚め希望と伝える', '左右 10 分歩く', 'つま先と幅に余裕'],
      verifyAfterReceive: ['初回は 15 分歩行で痛み確認', '靴擦れなし', '古い靴と交互に 1 週間慣らす']
    }
  }
];

export function isItemRequired(item: PrepItem): boolean {
  return !item.optional;
}

export function getRequiredItemIds(): string[] {
  return PREP_ITEMS.filter(isItemRequired).map((i) => i.id);
}
