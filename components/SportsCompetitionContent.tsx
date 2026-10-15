"use client";
import Aos from "aos";
import Image from "next/image";
import { useEffect } from "react";
import EventList from "./EventList";

export default function SportsCompetitionContent() {
    useEffect(() => {
                Aos.init();
                Aos.refresh();
            }, []);

    return (
        <article>
            <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
                <div>
                    <Image src="/images/체육대회/banner.jpg" alt="체육대회" width={1000} height={500} className="w-full min-h-52.5 h-auto object-cover rounded-[15px]" />
                </div>
                <div className="text-center my-12.5 pb-12.5 border-b border-[#aaa]">
                    <h2 className="w-4/5 mx-auto xl:text-[2rem]">함께 뛰고, 함께 웃는 즐거운 행사</h2>
                    <p className="mt-3.75">학교나 회사, 지역단체, 모임 등<br/>여러곳에서 즐거움과 팀워크, 도전을 한 자리에서 경험할 수 있는 종합 체육 행사입니다.</p>
                </div>
                <EventList category="sports_competition" className="xl:justify-start xl:gap-x-7.5" />
            </div>
        </article>
    )
}
