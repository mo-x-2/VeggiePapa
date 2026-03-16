"use client";

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";
import receipImg from "../app/asset/image/receip.png";
import type { DiagnosisResult } from "../types/diagnosis";

type Props = {
  diagnosis: DiagnosisResult;
  onBack: () => void;
};

function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", marginLeft: 32 }}>
      <div
        style={{
          border: "2px solid #ffffff",
          borderRadius: 16,
          background: "rgba(68, 158, 32, 0.16)",
          padding: "28px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      {/* SVG tail — left side pointing left */}
      <svg
        width="32"
        height="44"
        viewBox="0 0 32 44"
        style={{ position: "absolute", left: -32, bottom: 48, overflow: "visible" }}
        aria-hidden
      >
        <polygon points="0,22 32,0 32,44" fill="rgba(68, 158, 32, 0.16)" stroke="#ffffff" strokeWidth="2" />
        {/* bubble の左ボーダーを白線で塗りつぶしてシームレスに繋げる */}
        <line x1="32" y1="1" x2="32" y2="43" stroke="#ffffff" strokeWidth="3" />
      </svg>
    </div>
  );
}

export function Result({ diagnosis, onBack }: Props) {
  const {
    vegetable_type,
    nickname,
    reason_text,
    father_inner_voice,
    recipe_title,
    recipe_body,
    invite_message,
  } = diagnosis;

  const [displayed, setDisplayed] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(diagnosis.image_url);
  const [imageLoading, setImageLoading] = useState(!diagnosis.image_url && !!diagnosis.image_prompt);
  const cardRef = useRef<HTMLDivElement>(null);

  // 画像をブラウザ側から非同期取得（Safari タイムアウト回避）
  useEffect(() => {
    if (diagnosis.image_url || !diagnosis.image_prompt) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: diagnosis.image_prompt }),
        });
        if (!cancelled && res.ok) {
          const { image_url } = await res.json();
          if (image_url) setImageUrl(image_url);
        }
      } catch (e) {
        console.error("image fetch failed", e);
      } finally {
        if (!cancelled) setImageLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [diagnosis.image_url, diagnosis.image_prompt]);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "fathers-day-invitation.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "父の日食事会招待状" });
      } else {
        // fallback: ダウンロード
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "fathers-day-invitation.png";
        a.click();
      }
    } catch (e) {
      console.error("share failed", e);
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    setDisplayed("");
    if (!father_inner_voice) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setDisplayed(father_inner_voice.slice(0, idx));
      if (idx >= father_inner_voice.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [father_inner_voice]);

  const handleCopy = async () => {
    const text = `今年のあなたのお父さんは、「${nickname || `${vegetable_type}パパ`}」でした。\n\n▼招待メッセージ案\n${invite_message}\n\n▼一緒に食べたいレシピ\n${recipe_title}\n${recipe_body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100%" }}>

      {/* ── Section 1: 野菜診断 + 生成画像 ── */}
      <section id="result-s1" className="vp-story-section">
        <div style={{ width: "100%", maxWidth: 480, padding: "0 24px" }}>
          <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "flex-start", gap: 16, marginBottom: 30 }}>
            <p
              style={{
                fontSize: 13,
                color: "#a08a6e",
                letterSpacing: "0.18em",
                margin: 0,
                fontFamily: "var(--font-klee)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              あなたのお父さんは…
            </p>
            <h2
              style={{
                fontSize: 28,
                margin: 0,
                fontFamily: "var(--font-klee)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "0.18em",
                lineHeight: 1.7,
              }}
            >
              {nickname || `${vegetable_type}パパ`}
            </h2>
            {imageLoading && (
              <div style={{ flexGrow: 1, minWidth: 0, aspectRatio: "2 / 3", background: "#f5f0ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: "#a08a6e" }}>生成中…</span>
              </div>
            )}
            {!imageLoading && imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`${nickname} のイラスト`}
                style={{
                  flexGrow: 1,
                  minWidth: 0,
                  aspectRatio: "2 / 3",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {reason_text}
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 2: お父さんの本音 ── */}
      <section id="result-s2" className="vp-story-section">
        <div style={{ width: "100%", maxWidth: 480, padding: "0 24px" }}>
          <p style={{ fontSize: 13, color: "#8d7762", marginBottom: 16, textAlign: "center" }}>
            もしかしたらこんなことを思っているのかもしれません。
          </p>
          <SpeechBubble>
            <p
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontFamily: "var(--font-klee)",
                fontSize: 16,
                lineHeight: 1.9,
                letterSpacing: "0.12em",
                margin: 0,
                height: "min(400px, calc(100dvh - 400px))",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {displayed || "・・・・・・"}
            </p>
          </SpeechBubble>
        </div>
        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>
      
      {/* ── Section 3 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            さて、今年の父の日は
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            そんなお父さんと
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            {vegetable_type}を使った料理を
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            一緒に楽しみませんか。
          </p>
          <p className="vp-vertical" style={{ fontSize: 13, color: "#a08a6e" }}>
            例えばこんなレシピはいかがでしょうっ
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>


      {/* ── Section 4: レシピ提案 ── */}
      <section id="result-s4" className="vp-story-section">
        <div style={{ width: "100%", maxWidth: 480, padding: "0 24px" }}>
          <h2 style={{ fontSize: 18, lineHeight: 1.7, margin: "0 0 18px", fontWeight: 500 }}>
            {recipe_title}
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: "0 0 16px" }}>
            {recipe_body}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={receipImg}
              alt="チャーハンの写真（サンプル）"
              style={{ width: "100%", height: "auto" }}
              width={400}
              height={300}
            />
          </div>
          <p style={{ fontSize: 13, color: "#8d7762", marginBottom: 8 }}>この画像はサンプルです。</p>
        </div>
        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 5: 招待状ハガキ ── */}
      <section id="result-s5" className="vp-story-section">
        <div style={{ width: "100%", maxWidth: 480, padding: "0 20px" }}>

          <p style={{ fontSize: 13, color: "#8d7762", marginBottom: 12, textAlign: "center" }}>
            お父さんを「父の日お食事会」に招待しましょう
          </p>

          {/* ── 招待状カード ── */}
          <div
            ref={cardRef}
            style={{
              background: "#ffffff",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
              padding: "32px 24px 28px",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* タイトル */}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "#888",
                margin: "0 0 4px",
                textTransform: "uppercase",
              }}
            >
              Father&apos;s Day
            </p>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 18,
                fontWeight: "normal",
                fontStyle: "italic",
                color: "#008000",
                margin: "0 0 4px",
                letterSpacing: "0.04em",
              }}
            >
              Dinner Invitation
            </h3>
            <p
              style={{
                fontFamily: "var(--font-klee)",
                fontSize: 11,
                color: "#888",
                letterSpacing: "0.2em",
                margin: "0 0 20px",
              }}
            >
              父の日お食事会招待状
            </p>

            {/* 区切り線 */}
            <div style={{ width: "40%", height: 1, background: "#ddd", marginBottom: 20 }} />

            {/* 画像 */}
            {imageLoading && (
              <div style={{ width: "60%", aspectRatio: "2 / 3", background: "#f5f0ea", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 11, color: "#a08a6e" }}>生成中…</span>
              </div>
            )}
            {!imageLoading && imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`${nickname} のイラスト`}
                style={{
                  width: "60%",
                  aspectRatio: "2 / 3",
                  objectFit: "cover",
                  marginBottom: 20,
                }}
              />
            )}

            {/* 区切り線 */}
            <div style={{ width: "40%", height: 1, background: "#ddd", marginBottom: 20 }} />

            {/* メッセージ */}
            <p
              style={{
                fontFamily: "var(--font-klee)",
                fontSize: 13,
                lineHeight: 2.1,
                letterSpacing: "0.08em",
                color: "#2a2a2a",
                margin: 0,
                whiteSpace: "pre-wrap",
                textAlign: "left",
                width: "100%",
              }}
            >
              {`${nickname || `${vegetable_type}パパ`}みたいなお父さんへ。\n父の日おめでとう。\n${invite_message}`}
            </p>
          </div>
          {/* ── /招待状カード ── */}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="vp-btn-primary"
              onClick={handleShare}
              disabled={sharing}
              style={{ fontWeight: 400 }}
            >
              {sharing ? "準備中..." : "招待状を送る"}
            </button>
            <p style={{ fontSize: 11, color: "#a08a6e", margin: 0, textAlign: "center" }}>
              LINEやメールのアプリを選んで、そのまま送れます。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
