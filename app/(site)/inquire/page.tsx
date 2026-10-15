import type { Metadata } from "next";
import InquireForm from "@/components/InquireForm";

export const metadata: Metadata = {
  title: "문의하기 | 에스원이벤트",
  description: "에어바운스, 워터슬라이드, 놀이기구 대여, 트러스 무대, 음향시스템, 행사기획 등 상담 및 견적 문의를 남겨주세요.",
  keywords: ["에스원이벤트", "문의하기", "행사 견적", "행사대행 문의", "에어바운스 대여 문의", "행사기획 상담"],
  alternates: {
    canonical: "/inquire",
  },
  openGraph: {
    title: "문의하기 | 에스원이벤트",
    description: "에어바운스, 워터슬라이드, 놀이기구 대여, 트러스 무대, 음향시스템, 행사기획 등 상담 및 견적 문의를 남겨주세요.",
    url: "https://www.s-one-event.co.kr/inquire",
    images: [
      {
        url: "https://www.s-one-event.co.kr/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "에스원이벤트 문의하기",
      },
    ],
  },
  robots: { index: false, follow: true },
};

export default function InquirePage() {
    return (
        <article>
            <div className="px-[5%] py-20 xl:w-200 xl:mx-auto xl:px-0 xl:py-37.5">
                <InquireForm/>
            </div>
        </article>
    )
}