import type { Metadata } from "next";
import "./globals.css";
import "./style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "에스원이벤트 | 기업·어린이 행사 기획 및 대행 솔루션",
  description: "기업·어린이 행사 기획 및 대행 전문. 에어바운스·물놀이·체험활동·체육대회 문의 010-3546-9985",
  keywords: [
  "에스원이벤트",
  "어린이날 행사",
  "어린이날",
  "기업 행사",
  "지역축제",
  "에어바운스",
  "워터슬라이드",
  "물놀이",
  "체육대회",
  "초등학교 행사",
  "어린이 체험활동",
  "놀이기구",
  "행사 용품 렌탈",
  "대규모 행사"
],
  openGraph: {
    title: '에스원이벤트',
    description: '기업·어린이 행사 기획 및 대행 전문',
    url: 'https://s-one-event.co.kr',
    siteName: '에스원이벤트',
    images: [
      {
        url: 'https://s-one-event.co.kr/images/og_image.jpg',
        width: 1200,
        height: 630,
        alt: '(주)에스원이벤트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    other: {
      'naver-site-verification': '941ce04bd18c83544356b847ca1cbb5d60e778b6',
    }
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
