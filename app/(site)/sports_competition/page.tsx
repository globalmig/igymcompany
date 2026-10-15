import type { Metadata } from "next";
import SportsCompetitionContent from "@/components/SportsCompetitionContent";

export const metadata: Metadata = {
  title: "체육대회 기획/진행 | 에스원이벤트",
  description: "학교, 회사, 지역단체, 모임을 위한 종합 체육대회를 기획하고 진행합니다. 즐거움과 팀워크, 도전을 함께 경험할 수 있는 행사를 만들어드립니다.",
  keywords: ["에스원이벤트", "체육대회", "체육대회 기획", "회사 체육대회", "학교 체육대회", "단체 행사", "레크리에이션"],
  alternates: {
    canonical: "/sports_competition",
  },
  openGraph: {
    title: "체육대회 기획/진행 | 에스원이벤트",
    description: "학교, 회사, 지역단체, 모임을 위한 종합 체육대회를 기획하고 진행합니다.",
    url: "https://www.s-one-event.co.kr/sports_competition",
    images: [
      {
        url: "https://www.s-one-event.co.kr/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "에스원이벤트 체육대회",
      },
    ],
  },
};

export default function SportsPage() {
    return <SportsCompetitionContent />;
}
