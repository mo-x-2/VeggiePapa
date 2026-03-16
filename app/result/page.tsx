"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DiagnosisResult } from "../../types/diagnosis";
import { Result } from "../../components/Result";

export default function ResultPage() {
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("vp_diagnosis");
    if (!stored) {
      router.replace("/question");
      return;
    }
    try {
      setDiagnosis(JSON.parse(stored));
    } catch {
      router.replace("/question");
    }
  }, [router]);

  if (!diagnosis) {
    return (
      <div
        className="vp-page-card"
        style={{ alignItems: "center", justifyContent: "center", background: "#ffffff", minHeight: "100%" }}
      >
        <p style={{ color: "#8d7762", fontSize: 14 }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <Result
      diagnosis={diagnosis}
      onBack={() => {
        sessionStorage.removeItem("vp_diagnosis");
        router.push("/");
      }}
    />
  );
}
