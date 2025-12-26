"use client";
import Aos from "aos";
import Image from "next/image";
import { useEffect } from "react";

const sportsImage = [
    "/images/체육대회/체육대회1.jpg",
    "/images/체육대회/체육대회2.jpg",
    "/images/체육대회/체육대회3.jpg",
    "/images/체육대회/체육대회4.jpg",
    "/images/체육대회/체육대회5.jpg",
    "/images/체육대회/체육대회6.jpg",
    "/images/체육대회/체육대회7.jpg",
    "/images/체육대회/체육대회8.jpg",
    "/images/체육대회/체육대회9.jpg",
    "/images/체육대회/체육대회10.jpg",
]

export default function SportsPage() {
    useEffect(() => {
                Aos.init();
                Aos.refresh();
            }, []);

    return (
        <article className="sports">
            <div>
                <div>
                    <Image src="/images/체육대회/banner.jpg" alt="체육대회" width={1000} height={500} />
                </div>
                <div>
                    <h2>함께 뛰고, 함께 웃는 즐거운 행사</h2>
                    <p>학교나 회사, 지역단체, 모임 등<br/>여러곳에서 즐거움과 팀워크, 도전을 한 자리에서 경험할 수 있는 종합 체육 행사입니다.</p>
                </div>
                <div className="display-flex-flow">
                    {sportsImage.map(s => 
                        <div key={s} data-aos="fade-up"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000"
                    data-aos-once="true">
                            <Image src={s} alt="체육대회" width={700} height={500}/>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}