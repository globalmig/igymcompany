import type { Metadata } from "next";
import EventList from "@/components/EventList";
import Image from "next/image";

export const metadata: Metadata = {
  title: "공식행사/지역축제 대행 | 에스원이벤트",
  description: "기념식, 준공식, 착공식, 제막식, 문화예술행사, 국제회의포럼, 시상식, 워크샵 등 정부·지자체·공공단체의 공식 행사를 기획하고 대행합니다.",
  keywords: ["에스원이벤트", "공식행사", "지역축제", "기념식", "준공식", "착공식", "제막식", "시상식", "지자체 행사대행", "축제 기획"],
  alternates: {
    canonical: "/event",
  },
  openGraph: {
    title: "공식행사/지역축제 대행 | 에스원이벤트",
    description: "정부·지자체·공공단체가 주최하거나 참여하는 다양한 공식 행사를 기획하고 대행합니다.",
    url: "https://www.s-one-event.co.kr/event",
    images: [
      {
        url: "https://www.s-one-event.co.kr/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "에스원이벤트 공식행사/지역축제",
      },
    ],
  },
};

export default function EventPage() {
    return (
        <article>
            <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
                <div>
                    <Image
                        src="/images/행사/banner.jpg"
                        alt="공식행사"
                        width={1000}
                        height={619}
                        className="w-full h-auto min-h-52.5 object-cover rounded-[15px]"
                    />
                </div>
                <div className="text-center my-12.5 pb-12.5 border-b border-[#aaa] xl:my-17.5 xl:pb-17.5">
                    <h2 className="xl:text-[2rem]">사회적 가치를 담은 공식 행사</h2>
                    <p className="mt-3.75 mb-7.5 xl:mt-5 xl:mb-12.5">사회적 문화적 교육적인 목적을 가지고<br />정부 지자체 공공단체 등이 주최하거나 참여하는 다양한 행사입니다.</p>
                    <ul className="flex flex-wrap justify-center gap-2.5 xl:mx-auto xl:w-175 xl:gap-5">
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">기념식</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">준공식</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">착공식</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">제막식</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">문화 및 예술행사</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">국제회의포럼</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">시상식</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">워크샵</li>
                        <li className="py-0.75 px-3.75 bg-[#e7e7e7] text-[#555] rounded-full xl:px-6.25">재난 대비 행사</li>
                    </ul>
                </div>
                <EventList category="event" className="xl:justify-start xl:gap-x-7.5" />
            </div>
        </article>
    )
}