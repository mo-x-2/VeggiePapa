# VeggiePapa プロトタイプ（Next.js / app router）

花束の代わりに大根を。  
「お父さんを野菜に例えて、父の日に一緒に食べるきっかけをつくる」体験のプロト版です。

Scene1〜5 まで、要件定義に記載の一連のフローを Next.js（app router）で実装しています。

## 前提

- Node.js 18 以上を推奨
- パッケージマネージャー：`npm` もしくは `yarn` / `pnpm`
- Google Gemini API キー（本番接続時）

## セットアップ

プロジェクトルート（`veggiepapa` ディレクトリ）で実行します。

```bash
# 依存インストール
npm install

# まだ入れていない場合は Gemini SDK を追加
npm install @google/generative-ai
```

### 環境変数の設定

開発用に `.env.local` を作成します（既存の `.env` があればそれに合わせてください）。

```bash
cp .env.local.example .env.local  # 例。なければ新規作成
```

中身の最低限の例：

```bash
# 本番接続する場合（実際の Gemini を叩きたいとき）
GOOGLE_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# プロト確認用（LLM を叩かずモックレスポンスを使う場合）
MOCK_GEMINI=1
```

- **LLM を使わず UI フローだけ確認したい場合**  
  - `MOCK_GEMINI=1` を設定し、`GOOGLE_GEMINI_API_KEY` は未設定でも OK です。
- **実際に Gemini を叩きたい場合**  
  - `GOOGLE_GEMINI_API_KEY` に有効なキーを設定し、`MOCK_GEMINI` 行は削除 or `0` にします。

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

- `/` … Scene1：タイトル／導入ページ  
  - 「はじめる」ボタンで `/flow` へ遷移
- `/flow` … Scene2〜5 のウィザード
  - 質問 5 個に答える → `/api/diagnose` に POST → 診断結果〜本音〜招待状まで表示

## プロトで確認できること

- **体験の流れ**
  1. サービスの趣旨を直感的に理解（タイトル＋導入コピー）
  2. チャット風 UI でお父さんのことを思い出しながら 5 つの質問に回答
  3. 「お父さん＝○○野菜」診断と理由テキスト ＋ イラスト枠
  4. 「お父さんの本音」テキスト（タイピング風アニメーション）
  5. レシピと、父に送る招待メッセージ案をコピーして利用

- **バックエンド連携**
  - `POST /api/diagnose` が回答一覧を受け取り、Gemini（またはモック）から診断結果 JSON を受け取ってフロントに返します。

## コードの主な場所

- `app/layout.tsx` / `app/globals.css` … 共通レイアウト・絵本風スタイル
- `app/page.tsx` … Scene1（タイトル／導入）
- `app/flow/page.tsx` … Scene2〜5 のコンテナ
- `components/FlowWizard.tsx` … フロー全体のステート管理
- `components/QuestionStep.tsx` … 質問入力 UI（Scene2）
- `components/ResultVeggieCard.tsx` … 野菜診断結果表示（Scene3）
- `components/InnerVoiceView.tsx` … 父の本音表示（Scene4）
- `components/InvitationView.tsx` … レシピ＆招待状（Scene5）
- `components/LoadingOverlay.tsx` … LLM 待ちローディング
- `app/api/diagnose/route.ts` … 診断 API
- `lib/gemini.ts` / `lib/prompts.ts` … Gemini 呼び出しとプロンプト
- `types/diagnosis.ts` … 診断結果 JSON の型定義

## メモ

- 画像生成（野菜コスプレのお父さん＋子ども）は、`DiagnosisResult.image_prompt` にプロンプトを用意してあり、今後 Gemini 画像 API をつなぎ込めるようにしてあります（現在はダミー枠表示のみ）。
- 体験観察用にコンソールログ等を追加したい場合は、`FlowWizard` 内のステップ遷移・API 成功／失敗箇所に仕込むと分かりやすいです。

