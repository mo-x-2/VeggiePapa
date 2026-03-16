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

// テキスト診断のみ（画像生成なし）
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

  if (process.env.MOCK_GEMINI === "1") {
    return {
      vegetable_type: "大根",
      nickname: "どっしり大根パパ",
      traits: ["どっしり", "不器用だけど優しい"],
      reason_text:
        "口数は多くないけれど、気づけばいつも家族の生活を下から支えてくれている、そんな存在です。",
      father_inner_voice: "ほんとはさ、もっと一緒にご飯を食べたいんだ。",
      recipe_title: "ほっとする豚バラ大根",
      recipe_body: "材料：大根 1/3本、豚バラ 150g。やさしい味に仕上げます。",
      invite_message: "どっしり大根みたいなパパと、一緒にご飯を食べたいな。",
      image_prompt:
        "picture book style, a father wearing a daikon radish costume with a child, soft pastel colors, portrait 2:3",
      image_url: undefined,
    };
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: DIAGNOSIS_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(DIAGNOSIS_USER_PROMPT_TEMPLATE(qaText));
  const text = (await result.response).text();
  return parseDiagnosisJson(text);
}

// 画像生成のみ（DALL-E 3）
export async function generateImageFromPrompt(
  prompt: string
): Promise<string | undefined> {
  if (process.env.MOCK_GEMINI === "1") return undefined;

  const oai = getOpenAIClient();
  const imageResponse = await oai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1792",
    quality: "standard",
    response_format: "b64_json",
    n: 1,
  });

  const b64 = imageResponse.data?.[0]?.b64_json;
  if (!b64) return undefined;

  // ログ保存
  try {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(logsDir, `veggiepapa-${timestamp}.png`);
    fs.writeFileSync(filePath, Buffer.from(b64, "base64"));
  } catch (logErr) {
    console.error("failed to write image log", logErr);
  }

  return `data:image/png;base64,${b64}`;
}
