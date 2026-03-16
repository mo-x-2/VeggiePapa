import { NextRequest, NextResponse } from "next/server";
import { runDiagnosisFromAnswers } from "../../../lib/gemini";

// Vercel Hobby: 最大60秒、Pro: 最大300秒
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const normalized = answers
      .map((item: any) => ({
        question: String(item.question ?? ""),
        answer: String(item.answer ?? ""),
      }))
      .filter((item: { question: string; answer: string }) => item.question || item.answer);

    if (!normalized.length) {
      return NextResponse.json(
        { error: "回答が空です。" },
        { status: 400 }
      );
    }

    const diagnosis = await runDiagnosisFromAnswers(normalized);
    return NextResponse.json(diagnosis);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "診断処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

