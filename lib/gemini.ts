import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import type { DiagnosisResult } from "../types/diagnosis";
import {
  DIAGNOSIS_SYSTEM_PROMPT,
  DIAGNOSIS_USER_PROMPT_TEMPLATE,
  parseDiagnosisJson,
} from "./prompts";

const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

let geminiClient: GoogleGenerativeAI | null = null;
let openaiClient: OpenAI | null = null;

function getGeminiClient() {
  if (!geminiApiKey) throw new Error("Gemini API キーが設定されていません。");
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(geminiApiKey);
  return geminiClient;
}

function getOpenAIClient() {
  if (!openaiApiKey) throw new Error("OpenAI API キーが設定されていません。");
  if (!openaiClient) openaiClient = new OpenAI({ apiKey: openaiApiKey });
  return openaiClient;
}

export async function runDiagnosisFromAnswers(
  qa: { question: string; answer: string }[]
): Promise<DiagnosisResult> {
  const qaText =
    qa
      .map(
        (item, idx) =>
          `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer || "（未回答）"}`
      )
      .join("\n\n") || "回答は空です。";

  // 環境変数でモック動作を切り替えられるようにしておく
  if (process.env.MOCK_GEMINI === "1") {
    return {
      vegetable_type: "大根",
      nickname: "どっしり大根パパ",
      traits: ["どっしり", "不器用だけど優しい"],
      reason_text:
        "口数は多くないけれど、気づけばいつも家族の生活を下から支えてくれている、そんな存在です。表には出さないけれど、芯の強さと根っこのやさしさがあるところが、大地の中でじっくり育つ大根みたい。怒った顔も多いけれど、本当は不器用なだけで、あなたのことをずっと気にかけている人なのかもしれません。",
      father_inner_voice:
        "ほんとはさ、もっと一緒にご飯を食べたり、くだらない話をしたりしたいんだ。でも、どう誘えばいいか分からなくて、つい「忙しい」とか言ってごまかしちゃう。君が元気でいてくれたらそれで十分なんだけど、たまには一緒に同じものを食べて、『うまいな』って笑い合えたら、それだけで一週間くらい頑張れそうなんだよな。",
      recipe_title: "ほっとする豚バラ大根",
      recipe_body:
        "【材料】大根 1/3本、豚バラ薄切り 150g、しょうゆ・みりん 各大さじ2、砂糖 小さじ2、水 200ml。お好みでしょうが少々。\n1. 大根は1cmの半月切りにし、下ゆでしておくと味がしみやすくなります。\n2. 鍋で豚バラを軽く炒め、脂が出てきたら大根を加えます。\n3. 調味料と水を加え、落としぶたをして弱めの中火で15〜20分コトコト煮込みます。\n4. 煮汁が少なくなってきたら火を止めて少し冷ますと、さらに味がしみ込みます。\n大根には消化を助ける酵素があり、飲みすぎ・食べすぎが気になるお父さんにもやさしい一品です。",
      invite_message:
        "どっしり大根みたいなパパが、わたしはけっこう好きです。飲みすぎないで長生きしてほしいから、今度この「豚バラ大根」を一緒に食べない？ ゆっくりごはんしながら、ちょっとだけ話そう。",
      image_prompt:
        "watercolor illustration, japanese middle-aged father and adult child wearing daikon radish costume, warm kitchen, soft pastel colors, picture book style",
      image_url: undefined,
    };
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: DIAGNOSIS_SYSTEM_PROMPT,
  });

  const prompt = DIAGNOSIS_USER_PROMPT_TEMPLATE(qaText);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const diagnosis = parseDiagnosisJson(text);

  // 画像生成 — OpenAI gpt-image-1（オプション）
  if (diagnosis.image_prompt) {
    try {
      const oai = getOpenAIClient();
      const imageResponse = await oai.images.generate({
        model: "gpt-image-1",
        prompt: diagnosis.image_prompt,
        size: "1024x1536", // 2:3 portrait
        quality: "medium",
        n: 1,
      });

      const item = imageResponse.data?.[0];
      // gpt-image-1 は b64_json で返す
      const b64 = item?.b64_json;
      if (b64) {
        diagnosis.image_url = `data:image/png;base64,${b64}`;

        // ログ保存
        try {
          const logsDir = path.join(process.cwd(), "logs");
          if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const safeVeg = diagnosis.vegetable_type || "unknown";
          const filePath = path.join(logsDir, `veggiepapa-${safeVeg}-${timestamp}.png`);
          fs.writeFileSync(filePath, Buffer.from(b64, "base64"));
        } catch (logErr) {
          console.error("failed to write image log", logErr);
        }
      }
    } catch (e) {
      // 画像生成に失敗してもテキスト診断は返す
      console.error("image generation failed", e);
    }
  }

  return diagnosis;
}

