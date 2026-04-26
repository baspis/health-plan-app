# iOS Shortcuts「道標 3 へ日次同期」セットアップ手順

本ドキュメントは、iPhone / Apple Watch の Apple Health データを **道標 3 PWA** へ自動同期する iOS Shortcuts の作成手順です。Day 0 セットアップ（[docs/06-reviews.md Section A](../../docs/06-reviews.md)）の一部として実施してください。

所要時間: 約 10 分（初回のみ）。以後は毎朝 7:05 に自動実行されます。

---

## 前提

- iPhone iOS 16 以上（PWA Push を使うなら 16.4+）
- 道標 3 PWA を Safari で開き（**本番 URL: <https://baspis.github.io/health-plan-app/>**）、ホーム画面に追加済み（A2HS 済み）
- ingest トークンは **PWA 起動時に localStorage に自動生成**されます。Safari の Web インスペクタで `dohyo2-ingest-token` キーの値を確認するか、初回起動後に Shortcut のテスト実行で URL を完成させて送信し、PWA 側でデータが反映されるか確認することで照合します
  - URL 形式: `https://baspis.github.io/health-plan-app/?ingest=1&token=<UUID>&date=YYYY-MM-DD&weight=...&workoutType=...`

## 手順

### 1. Shortcuts アプリで新規ショートカット作成

1. iPhone で「ショートカット」アプリを開く
2. 右上の **+** をタップ → 新規ショートカット
3. 名前を **「道標 3 へ日次同期」** に設定

### 2. アクション追加

以下のアクションを順に追加します。各アクションは右下の「+アクションを追加」から検索します。

#### 2-A. 日付を取得
- **日付** アクション → 現在の日付を取得
- 変数名（任意）: `今日`

#### 2-B. Apple Health からデータ取得（5 項目）

以下 5 つの「ヘルスケアサンプル取得」アクションを順に追加:

| 項目 | 設定 |
|---|---|
| 体重 | 種類: 体重、範囲: 今日、並べ替え: 新しい順、上限: 1 |
| 睡眠時間 | 種類: 睡眠分析、範囲: 今日、上限: 1（合計時間） |
| 安静時心拍数 | 種類: 安静時心拍数、範囲: 今日、上限: 1 |
| 心拍変動 (HRV) | 種類: 心拍変動の標準偏差、範囲: 今日、上限: 1 |
| 歩数 | 種類: 歩数、範囲: 今日、合計値 |

各アクションの出力を変数名で保存: `weight`, `sleep`, `rhr`, `hrv`, `steps`

#### 2-C. VO2max と ワークアウト（必須・自動検出に使う）

道標 3 は「歩いた／筋トレした／HIIT した」を **ワークアウトの種類（workoutType）** で自動判定します。**workoutType を必ず送ってください**:

| 項目 | 設定 |
|---|---|
| VO2max | 種類: VO2max、範囲: 今日、上限: 1 → 変数 `vo2max` |
| ワークアウト時間 | 種類: ワークアウト、範囲: 今日、最新 1 件の **継続時間（分）** → 変数 `workoutMin` |
| **ワークアウト種類** | **同じワークアウトの「ワークアウトタイプ」プロパティを取得** → 変数 `workoutType`（例: `Walking`, `FunctionalStrength`, `HighIntensityInterval`, `Yoga`） |

**workoutType の取得手順**: 「ワークアウトを取得」アクションで最新 1 件 → 「**詳細を取得**」アクションを追加 → プロパティに「**ワークアウトタイプ**」を選択 → 出力を `workoutType` 変数に保存。文字列のまま URL クエリに乗せます。

道標 3 が認識する主な値（ケース不問・部分一致）:

| Apple Health 文字列 | 道標 3 検出 |
|---|---|
| `Walking` / `Hiking` | walking |
| `FunctionalStrengthTraining` / `TraditionalStrengthTraining` / `Core` | strength |
| `HighIntensityIntervalTraining` | hiit |
| `Yoga` | yoga |
| `MindAndBody` / `Cooldown` / `Flexibility` | cooldown |
| `Mindfulness` | meditation |

### 3. URL 組み立て

**テキスト** アクションで以下のフォーマットで URL を作成:

```
https://baspis.github.io/health-plan-app/?ingest=1&token=<あなたのトークン>&date=[今日のISO形式]&weight=[weight]&sleep=[sleep時間]&rhr=[rhr]&hrv=[hrv]&steps=[steps]&vo2max=[vo2max]&workoutMin=[ワークアウト分]&workoutType=[workoutType]
```

- `<あなたのトークン>` は Input タブで確認した値を貼る
- 変数は **マジック変数**（Shortcuts の機能）で埋め込む
- 睡眠は分単位 → 時間に変換する式を挟む（`[sleep] / 60` のような計算アクションを追加）

### 4. URL を開く

**Safari で URL を開く** アクションを追加し、前のステップで組み立てた URL を指定。

これで Shortcut は道標 2 を開き、クエリパラメータを ingest エンドポイントが受け取ってローカルストレージに保存します。

### 5. オートメーション設定（毎朝 7:05 自動実行）

1. Shortcuts アプリ下部 **オートメーション** タブ → 右上 + → 個人用オートメーション
2. **時刻** → 毎日 7:05 → 次へ
3. アクション: 「**道標 3 へ日次同期**」を実行
4. **実行前に尋ねる** を **オフ**（自動実行）

### 6. 運動後の手動トリガー（任意）

Apple Watch のワークアウトリング達成後に手動で Shortcut を起動すれば、ワークアウト時間と VO2max を最新値に更新できます。

- ホーム画面やウィジェットから Shortcut アイコンをタップ
- Siri: 「Hey Siri、道標 3 へ日次同期」

---

## セキュリティ

- **トークンは本端末固有**、外部と共有しないでください
- URL クエリは iOS Safari のオープンダイアログに一瞬表示されますが、ingest 後は PWA が自動でクエリを削除します
- 道標 3 のデータは **すべてローカル IndexedDB** に保存され、外部サーバには送信されません
- トークンを紛失・漏洩した場合は、道標 3 を一度削除して再 A2HS するとトークンが再生成されます

---

## トラブルシュート

- **Shortcut が失敗する**: Apple Health の読み取り権限が Shortcut に付与されているか確認（設定 → ショートカット → 詳細 → ヘルスケア）
- **PWA が起動しない**: Safari で URL を直接開いて動作確認。ホーム画面アプリと Safari で保存場所が分離することがあります
- **トークン不一致**: PWA の DevTools で `localStorage.getItem('dohyo2-ingest-token')` を確認し、Shortcut の URL を更新
- **筋トレを「歩いた」と判定される / 検出が走らない**: workoutType を URL に含めていない可能性。Shortcuts の「ワークアウトの詳細を取得」で **ワークアウトタイプ** を取得し `workoutType=` に乗せているか確認

---

## 同期項目まとめ

| Apple Health サンプル | 道標 3 側フィールド | 頻度 | 自動検出への寄与 |
|---|---|---|---|
| 体重 | `weight` | 毎朝 | weigh |
| 体脂肪率 | `bodyFat` | 毎朝（Eufy があれば） | — |
| 睡眠時間（時間単位） | `sleep` | 毎朝（前夜分） | restTrigger |
| 安静時心拍数 | `rhr` | 毎朝 | restTrigger |
| 心拍変動 (HRV) | `hrv` | 毎朝 | restTrigger |
| 歩数 | `steps` | 毎朝（前日合計） | grocery / family-walk |
| VO2max | `vo2max` | Workout 後 | — |
| ワークアウト時間 | `workoutMin` | Workout 後 | walking / strength / hiit / yoga |
| **ワークアウトタイプ** | **`workoutType`** | **Workout 後（必須）** | **walking / strength / hiit / yoga / cooldown / meditation の振り分け** |
| アクティブエネルギー | `activeKcal` | 毎朝 | — |

以上で Apple Health → 道標 3 の自動同期が完成します。日次運用で本人が触るのは **朝の体重計と Workout 開始のみ**、入力は一切不要です。やった行動は道標 3 が自動検出して短い褒め文と共に Today に並びます。
