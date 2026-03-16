"use client";

import Link from "next/link";
import Image from "next/image";
import introImg from "./asset/image/intro.png";
import thinkingImg from "./asset/image/thinking.png";

export default function HomePage() {
  return (
    <div>
      {/* ── Section 1: キャッチコピー ── */}
      <section className="vp-story-section">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* タイトル＋サブタイトル（縦書き横並び） */}
          <div className="vp-vertical-group">
            <p className="vp-vertical" style={{ fontSize: 30, color: "#3a2b22" }}>
              花束の代わりに、
            </p>
            <p className="vp-vertical" style={{ fontSize: 30, color: "#3a2b22" }}>
              大根を。
            </p>
            <p
              className="vp-vertical"
              style={{ fontSize: 13, color: "#a08a6e", letterSpacing: "0.22em" }}
            >
              お父さんは何野菜？ 父を知る、父の日アプリ
            </p>
          </div>

          {/* イラスト（タイトルの下） */}
          <Image
            src={introImg}
            alt="大根コスプレの子ども"
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 2 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            もうすぐ、父の日。
          </p>
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
            あなたのお父さんって、
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            どんな人？
          </p>
        </div>
        
        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 4 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <Image
              src={thinkingImg}
              alt="考える子ども"
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
            />
        </div>
        
        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 5 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            もしかしたら、私たちは
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            お父さんのことを
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            よく知らないのかもしれない。
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 6 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            でもきっと、不器用に、泥臭く、
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            私たちを支えてくれた人。
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 7 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group">
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            あ、ちょっと
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            「野菜」に似てるかも？
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 3: 体験説明 ── */}
      <section className="vp-story-section">
        <div className="vp-vertical-group" style={{ marginBottom: 28 }}>
          <p className="vp-vertical" style={{ fontSize: 20, color: "#3a2b22" }}>
            お父さんを「野菜」に例えて
          </p>
          <p className="vp-vertical" style={{ fontSize: 20, color: "#3a2b22" }}>
            知っているようで知らない一面を
          </p>
          <p className="vp-vertical" style={{ fontSize: 20, color: "#3a2b22" }}>
            見つけてみませんか？
          </p>
        </div>

        <div className="vp-scroll-hint" aria-hidden>
          <div className="vp-chevron-down" />
          <div className="vp-chevron-down" />
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section className="vp-story-section">
        <div
          className="vp-vertical-group"
          style={{ marginBottom: 32 }}
        >
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            あなたのお父さんは
          </p>
          <p className="vp-vertical" style={{ fontSize: 22, color: "#3a2b22" }}>
            何野菜？
          </p>
        </div>

        <Link href="/question">
          <button
            className="vp-btn-primary"
            style={{ fontSize: 16, padding: "14px 32px" }}
          >
            野菜診断を始める
          </button>
        </Link>

        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: "#b0a090",
            textAlign: "center",
          }}
        >
          所要時間 約5〜10分
        </p>
      </section>
    </div>
  );
}
