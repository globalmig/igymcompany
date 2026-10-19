import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 | 에스원이벤트",
  description: "다년간의 행사 경험을 바탕으로 성장해온 에스원이벤트의 연혁과 주요 실적을 소개합니다. 기업, 지자체, 공공기관 행사 기획 및 대행 전문 기업입니다.",
  keywords: ["에스원이벤트", "회사소개", "행사대행 실적", "행사기획 회사", "지자체 행사대행", "기업행사 대행", "축제 기획"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "회사소개 | 에스원이벤트",
    description: "다년간의 행사 경험을 바탕으로 성장해온 에스원이벤트의 연혁과 주요 실적을 소개합니다.",
    url: "https://www.s-one-event.co.kr/about",
    images: [
      {
        url: "https://www.s-one-event.co.kr/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "에스원이벤트 회사소개",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <article>
      <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
        <div className="text-center mb-17.5 xl:mb-25 pb-17.5 xl:pb-25 border-b border-[#aaa]">
          <h2 className="xl:text-[2.3rem]">
            에스원이벤트와 함께
            <br />
            <span className="text-[#FFA600]">‘직접 즐기는 경험’</span>을 만들어보세요.
          </h2>
          <p className="mt-5 xl:mt-7.5">
            에스원이벤트는 파트너쉽을 통한 행사기획,대행 솔루션 입니다.
            <br className="hidden xl:block" />
            다년간의 행사경험 통해 전문기업으로 성장해 왔습니다.
            <br className="hidden xl:block" />
            회사 소개 실적 고객 니즈에 최적화된 행사기획과 운영으로 파트너의 성과 창출을 지원합니다.
            <br className="hidden xl:block" />
            항상 모든 프로젝트를 성실히 임무수행 하는 ㈜에스원이벤트가 되겠습니다.
          </p>
        </div>

        <div>
          <section className="mb-17.5">
            <h2 className="text-[2rem]">2024</h2>
            <ul className="relative before:content-[''] before:absolute before:left-2 before:top-2.5 before:w-px before:h-[94%] before:bg-[#ccc]">
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">삼성 SDI 어린이날 행사기획</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">NC소프트 임직원 자녀 놀이 행사기획</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">대전목재축제페스티벌 기획</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">현대건설 장기 물놀이 페스티벌 운영</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">진천군 미래지기 축제 진행</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">충북육아종합지원센터 놀이 행사진행</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">진천군 드림페스티벌 기획</li>
            </ul>
          </section>
          <section>
            <h2 className="text-[2rem]">2025</h2>
            <ul className="relative before:content-[''] before:absolute before:left-2 before:top-2.5 before:w-px before:h-[94%] before:bg-[#ccc]">
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">진천군 어린이날 행사 운영</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">진천군 연합 방범대 체육대회 진행</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">덕산읍 어린이날 행사운영</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">고양시 육아종합지원센터 기념행사</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">충주 아모레시픽 준공식</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">충북도청 이전 기념행사</li>
              <li className="relative pl-10 xl:pl-15 my-6.25 xl:my-10 text-[#555] xl:text-[1.2rem] before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:border-4 before:border-[#FFA600] before:bg-white">덕산읍 탐방거리축제 진행</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
