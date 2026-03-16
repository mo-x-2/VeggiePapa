import type { Metadata } from "next";
import { Klee_One, Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css";

const kleeOne = Klee_One({
  weight: "600",
  preload: false,
  variable: "--font-klee",
});

const zenKaku = Zen_Kaku_Gothic_Antique({
  weight: ["300", "400", "500", "700"],
  preload: false,
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  title: "VeggiePapa",
  description: "花束の代わりに大根を。パパって何野菜？",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${kleeOne.variable} ${zenKaku.variable}`}>
      <body>
        <div className="vp-root">
          <header className="vp-header">
            <a href="/" className="vp-logo" style={{ textDecoration: "none" }}>VeggiePapa</a>
          </header>
          <main className="vp-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
