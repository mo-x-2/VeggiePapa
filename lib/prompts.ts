import type { DiagnosisResult } from "../types/diagnosis";

export const DIAGNOSIS_SYSTEM_PROMPT = `
あなたは「VeggiePapa」という父の日向けWeb体験のためのライター兼栄養士です。

与えられた「お父さんに関する回答」から、
- お父さんを1種類の野菜にたとえた診断
- その理由
- お父さんの本音のナレーション
- その野菜を使った簡単で温かみのあるレシピ
- 子どもから父に送るための、やさしくて少しユーモラスな招待メッセージ
を日本語で生成してください。

出力は必ず JSON 形式のみで返してください。余計な文章や説明は書かないでください。
`.trim();

export const DIAGNOSIS_USER_PROMPT_TEMPLATE = (qaText: string) => `
以下は、子どもが「自分のお父さん」について答えた内容です。この情報をもとに、VeggiePapa の診断結果を JSON 形式だけで返してください。

回答一覧:
${qaText}

必ず以下のキーを含む JSON オブジェクトとして出力してください:
- vegetable_type: 例）"大根", "キャベツ", "ブロッコリー" など1種類の野菜名
- nickname: 野菜を使った愛称（例："どっしり大根パパ"）
- traits: 2〜4個の性格・雰囲気を表すキーワード配列（例：["どっしり", "不器用だけど優しい"]）
- reason_text: なぜその野菜なのかを説明するテキスト（100〜200文字程度）
- father_inner_voice: お父さんの本音を想像したモノローグ（40〜80文字程度）
- recipe_title: その野菜を使った、日本の家庭料理寄りのレシピ名
- recipe_body: 材料・手順・健康面のひとことを含むテキスト（100〜200文字程度）
- invite_message: 子どもから父への父の日の食事会への招待メッセージで、野菜の特徴とお父さんの性格・エピソードを絡めながら、お父さんに似た野菜を使った料理を作るから、一緒に食事をしようと誘う内容にすること。優しさと愛情を込めた自然な語り口で、40〜80文字程度
- image_prompt: 画像生成用の英語プロンプト。以下の要素をすべて盛り込んだ1〜2段落の英文で記述してください：
  - 父は <vegetable_type> のコスチューム／着ぐるみを着た human father であること。体や顔は人間であり、野菜そのものの擬人化キャラクターにはしないこと（例："a father wearing a big daikon radish costume"）
  - 父の表情・ポーズ・雰囲気にユーザーが語った性格・特徴を反映させること（例：頑固そうだが真顔でどっしり立っている、不器用だが優しそうな目をしている、など）
  - シーンはユーザーが語った親子のエピソードをもとに再現すること（例：一緒に絵本を読む、夜遅く迎えに来る、など）
  - 子供の性別やエピソード当時の親子の年齢も文脈から自然に表現すること。（例：娘が小学生で、父が30代の頃）
  - 絵柄は 暖かくて優しい絵本風イラスト、柔らかいパステルカラー。
  - 2:3 の縦長構図（portrait orientation）になるように指定すること
`.trim();

export function parseDiagnosisJson(jsonText: string): DiagnosisResult {
  // Gemini がマークダウンのコードブロック（```json ... ```）で返すケースを除去する
  const cleaned = jsonText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const raw = JSON.parse(cleaned);
  const result: DiagnosisResult = {
    vegetable_type: raw.vegetable_type ?? "",
    nickname: raw.nickname ?? "",
    traits: Array.isArray(raw.traits) ? raw.traits.map(String) : [],
    reason_text: raw.reason_text ?? "",
    father_inner_voice: raw.father_inner_voice ?? "",
    recipe_title: raw.recipe_title ?? "",
    recipe_body: raw.recipe_body ?? "",
    invite_message: raw.invite_message ?? "",
    image_prompt: raw.image_prompt ?? undefined,
    image_url: raw.image_url ?? undefined,
  };
  return result;
}

