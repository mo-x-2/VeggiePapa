import { NextRequest, NextResponse } from "next/server";
import { generateImageFromPrompt } from "../../../lib/gemini";

export const maxDuration = 60; // DALL-E 3 は最大60秒

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ image_url: null });

    const image_url = await generateImageFromPrompt(prompt);
    return NextResponse.json({ image_url: image_url ?? null });
  } catch (e) {
    console.error("image generation error", e);
    // 画像失敗でも 200 を返してクライアント側で graceful に扱う
    return NextResponse.json({ image_url: null });
  }
}
