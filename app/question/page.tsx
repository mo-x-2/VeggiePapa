"use client";

import { QuestionFlow } from "../../components/QuestionFlow";

export default function QuestionPage() {
  return (
    <div
      className="vp-page-card"
      style={{ background: "#ffffff", minHeight: "100%" }}
    >
      <div
        className="vp-card"
        style={{ background: "#ffffff", boxShadow: "none", border: "none" }}
      >
        <QuestionFlow />
      </div>
    </div>
  );
}
