# 道標 2（WebApp v2）

健康人生設計プラン v7.4 の実行支援 PWA。計画本体（`../README.md`、`../docs/`、`../DECISIONS.md`）を**毎日開かなくても運用できる**ためのダッシュボード。

## 設計思想

- **完全入力ゼロ**: 日次データは Apple Health → iOS Shortcuts 経由で自動同期。手入力は Day 0 / Month 6 / Month 12 の検査結果のみ（[ADR-024](../DECISIONS.md)）
- **3 問いに 5 秒で答える**: Today（今やる）/ Journey（現在地）/ Forecast（見通し）
- **パッシブ異常検知**: 体重 2 週間上昇・睡眠連続不足・HRV 急低下・運動実施率低下を自動検知し、iOS ローカル通知で知らせる

## 技術スタック

- Svelte 5 (Runes) + Vite + TypeScript
- IndexedDB (Dexie) でローカル永続化
- vite-plugin-pwa (Workbox) で完全オフライン
- iOS Shortcuts ブリッジ（`shortcuts/README.md`）で Apple Health 同期

## 開発

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ に出力
npm run preview   # ビルド済みを確認
```

## ディレクトリ

```
webapp/
├── src/
│   ├── routes/           # Today / Journey / Forecast / Input
│   ├── lib/
│   │   ├── stores/       # phase, clock, health, tab
│   │   ├── data/         # plan.ts (timeline, milestones, AF+ リンク)
│   │   ├── db/           # Dexie スキーマ + upsert
│   │   ├── ingest/       # iOS Shortcuts からの受信
│   │   ├── judgment/     # 休むトリガー・GLP-1 判定
│   │   ├── notify/       # パッシブ異常検知 + ローカル通知
│   │   ├── components/   # TopBar, TabBar
│   │   └── utils/        # swipe
│   ├── App.svelte
│   ├── main.ts
│   └── app.css
├── shortcuts/            # iOS Shortcut セットアップ手順
├── public/               # manifest, icons
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## デプロイ

GitHub Pages または Cloudflare Pages を想定。

```bash
npm run build
# dist/ をデプロイ先にプッシュ
```

本番 URL を決めたら、以下を更新:

- `public/manifest.webmanifest` の `start_url`, `scope`
- `shortcuts/README.md` の「<道標2の本番URL>」プレースホルダ
- 上位 `../README.md` の詳細ドキュメント表

## プライバシー

- すべてのデータは**端末ローカル IndexedDB** に保存、外部送信なし
- iOS Shortcuts のトークンは端末固有、再 A2HS で再生成可能
- Apple Health → 道標 2 の通信は同一端末内のみ

## 計画本体との関係

- 本アプリは**プラン v7.4+ の実行支援 UI 層**。計画本体（`../docs/`、`../DECISIONS.md`）が正
- アプリの変更は UI のみ。プラン設計ロジックの変更は ADR で議論
- [ADR-025](../DECISIONS.md) に構築の背景、[ADR-024](../DECISIONS.md) にパッシブ異常検知の設計を記載
