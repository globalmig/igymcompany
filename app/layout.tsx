import type { Metadata } from "next";
import "./globals.css";
import "./style.css";
import "./admin.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "에스원이벤트 | 기업·어린이 행사 기획 및 대행 솔루션",
  description: "에어바운스, 워터슬라이드, 놀이기구 대여 및 설치 전문 에스원이벤트입니다.",
  keywords: ["에스원", "에스원이벤트", "어린이날", "에어바운스", "워터슬라이드", "워터파크", "물놀이", "체육대회", "초등학교 행사", "어린이 체험활동", "놀이기구", "렌탈"],
  metadataBase: new URL("https://www.s-one-event.co.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "에스원이벤트",
    description: "기업·어린이 행사 기획 및 대행 전문",
    url: "https://www.s-one-event.co.kr",
    siteName: "에스원이벤트",
    images: [
      {
        url: "https://www.s-one-event.co.kr/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "에스원이벤트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    other: {
      "naver-site-verification": "d965245f4c3cad21285f640deea1c8583c82b4b5",
    },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
