import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.maemulbbali.site"),
  title: {
    default: "매물 면적 정보 조회 | 매물빨리",
    template: "%s | 매물빨리",
  },
  description: "등록하려는 매물의 타입·전용·공용·공급면적을 즉시 조회하세요",
  openGraph: {
    title: "매물빨리 — 매물 면적 즉시 조회",
    description:
      "건축물대장 기반 전용·공용·공급면적을 즉시 조회하는 부동산 서비스",
    type: "website",
    locale: "ko_KR",
    url: "https://www.maemulbbali.site",
    siteName: "매물빨리",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="min-h-full flex flex-col font-[var(--font-pretendard),sans-serif]">
        <Script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="afterInteractive"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
