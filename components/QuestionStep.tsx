"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import img1 from "../app/asset/image/1.png";
import img2 from "../app/asset/image/2.png";
import img3 from "../app/asset/image/3.png";
import img4 from "../app/asset/image/4.png";
import img5 from "../app/asset/image/5.png";

const QUESTION_IMAGES = [img1, img2, img3, img4, img5];

type Props = {
  index: number;
  total: number;
  question: string;
  placeholder: string;
  value: string;
  onSubmit: (value: string) => void;
};

export function QuestionStep({
  index,
  total,
  question,
  placeholder,
  value,
  onSubmit,
}: Props) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // モバイルでキーボードが再展開しないよう auto-focus は行わない
    setLocalValue("");
  }, [index]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = localValue.trim();
    if (!trimmed) return;
    // iOS キーボードを閉じてから遷移
    inputRef.current?.blur();
    onSubmit(trimmed);
  };

  const currentImg = QUESTION_IMAGES[index] ?? img1;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: "24px 20px 28px",
      }}
    >
      {/* 質問番号 */}
      <p
        style={{
          fontSize: 12,
          color: "#a08a6e",
          marginBottom: 4,
          letterSpacing: "0.06em",
        }}
      >
        質問 {index + 1} / {total}
      </p>

      {/* 質問タイトル */}
      <h2
        style={{
          fontSize: 18,
          lineHeight: 1.7,
          margin: "0 0 18px",
          fontWeight: 500,
        }}
      >
        {question}
      </h2>

      {/* 質問ごとのイラスト */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Image
          src={currentImg}
          alt={`質問 ${index + 1} のイラスト`}
          width={400}
          height={300}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          rows={4}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            resize: "vertical",
            borderRadius: 16,
            border: "1px solid #e0cdbc",
            padding: "10px 12px",
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "inherit",
            outline: "none",
            background: "#fafafa",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <button type="submit" className="vp-btn-primary">
            {index + 1 === total ? "結果を見る" : "つぎの質問へ"}
          </button>
        </div>
      </form>
    </div>
  );
}
