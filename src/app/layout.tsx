import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "매물 면적 정보 조회 | 매물빨리",
  description: "건축물대장 기준 타입·전용·공용·공급면적을 즉시 조회하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col font-[Pretendard,sans-serif]">
        <header className="border-b bg-card">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
            <span className="text-lg font-bold text-primary">매물 면적 정보 조회</span>
            <a
              href="mailto:support@maemul.ok"
              className="text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/80 transition-colors rounded-md px-5 py-2"
            >
              문의하기
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
