"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionStep } from "./QuestionStep";
import { LoadingOverlay } from "./LoadingOverlay";
import type { DiagnosisResult } from "../types/diagnosis";

export const QUESTIONS = [
  {
    question: "あなたのお父さんの性格を一言で表すと？",
    placeholder: "例：「頑固、優しい、穏やか、無口」",
  },
  {
    question: "子どもの頃、お父さんと一緒にしたことで覚えていることは？",
    placeholder: "例：「夜寝る前に絵本を読んでくれた、一緒にサッカーをしてくれた」",
  },
  {
    question: "お父さんのちょっと困ったところ、でも嫌いになれないところは？",
    placeholder: "例：「怒りっぽいところ、感情表現が少ないところ、だらしがないところ」",
  },
  {
    question: "お父さんの愛情を感じたエピソードは？",
    placeholder:
      "例：「いつも「ちゃんと食べろよ」って言ってくる、子供の時にあげた手紙をまだ持ってる」",
  },
  {
    question: "お父さんにどう過ごしてほしい？",
    placeholder: "例：「いつまでも元気でいてほしい、笑顔で過ごしてほしい」",
  },
] as const;

export function QuestionFlow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(() =>
    QUESTIONS.map(() => "")
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false); // 二重送信防止ロック

  const progress = (currentIndex / QUESTIONS.length) * 100;

  const handleAnswer = useCallback(
    async (value: string) => {
      if (submittingRef.current) return; // 二重送信をブロック
      submittingRef.current = true;

      setError(null);
      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      const nextIndex = currentIndex + 1;
      if (nextIndex < QUESTIONS.length) {
        setCurrentIndex(nextIndex);
        submittingRef.current = false;
        return;
      }

      setLoading(true);
      try {
        // Step 1: テキスト診断（～10秒）
        const diagRes = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: QUESTIONS.map((item, idx) => ({
              question: item.question,
              answer: nextAnswers[idx],
            })),
          }),
        });

        if (!diagRes.ok)
          throw new Error("診断に失敗しました。時間をおいて再度お試しください。");

        const data: DiagnosisResult = await diagRes.json();

        // テキスト結果をすぐに保存してリダイレクト（画像は結果ページで非同期取得）
        sessionStorage.setItem("vp_diagnosis", JSON.stringify(data));
        router.push("/result");
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error
            ? e.message
            : "診断に失敗しました。もう一度お試しください。"
        );
        setLoading(false);
        submittingRef.current = false;
      }
    },
    [answers, currentIndex, router]
  );

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div className="vp-pill">
          <span className="vp-pill-dot" />
          <span>お父さん野菜診断</span>
        </div>
        <span style={{ fontSize: 12, color: "#8d7762" }}>
          {currentIndex + 1} / {QUESTIONS.length}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 4,
          borderRadius: 999,
          background: "#f1e2d0",
          marginBottom: 20,
          overflow: "hidden",
        }}
        aria-hidden
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transform: `scaleX(${Math.min(progress / 100 + 1 / QUESTIONS.length, 1)})`,
            background:
              "linear-gradient(90deg, #8bc34a 0%, #cddc39 45%, #ffc107 100%)",
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      <QuestionStep
        index={currentIndex}
        total={QUESTIONS.length}
        question={QUESTIONS[currentIndex].question}
        placeholder={QUESTIONS[currentIndex].placeholder}
        value={answers[currentIndex]}
        onSubmit={handleAnswer}
      />

      {error && (
        <p style={{ marginTop: 16, fontSize: 13, color: "#b24534" }}>{error}</p>
      )}

      {loading && <LoadingOverlay />}
    </div>
  );
}
