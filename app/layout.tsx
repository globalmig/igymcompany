import type { Metadata } from "next";
import "./globals.css";
import "./style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "(주)에스원이벤트",
  description: "파트너쉽을 통한 행사기획,대행 솔루션 입니다. 다년간의 행사경험 통해 전문기업으로 성장하고 있습니다.",
  openGraph: {
    title: '(주)에스원이벤트',
    description: '전문적인 기업, 어린이 행사 기획 및 운영 솔루션',
    url: 'https://www..com',
    siteName: '(주)에스원이벤트',
    images: [
      {
        url: 'https://www..com/images/og_image.png',
        width: 1200,
        height: 630,
        alt: '(주)에스원이벤트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  other: {
    'naver-site-verification': '',
  }
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
