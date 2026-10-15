"use client";
import { SOLUTION } from "@/data/solution";
import 'aos/dist/aos.css';
import Aos from "aos";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventSolution() {

    const [isHover, setIsHover] = useState<number | null>(null);
    const [linkHover, setLinkHover] = useState<number | null>(null);
    const [isFocus, setIsFocus] = useState<string | null>(null);

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className="flex flex-wrap justify-between xl:overflow-hidden">
            {SOLUTION.map((s, i) =>
                <div
                    key={s.id}
                    className={`w-[48%] my-2.5 md:my-5 md:mb-0 xl:w-70 ${
                        i % 2 === 1 ? "xl:mt-15!" : ""
                    }`}
                >
                    <section
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsHover(s.id)}
                    onMouseLeave={() => setIsHover(null)}
                    data-aos="fade-up"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000"
                    data-aos-once="true"
                    >
                    <div>
                        <Image src={s.img} alt={s.name} width={316} height={412} className="w-full h-auto" />
                    </div>
                    <div
                        className={`absolute left-0 w-full h-full bg-black/70 text-white p-2.5 md:p-3.75 transition-all duration-500 ${
                            isHover === s.id
                                ? "bottom-[-32%] md:bottom-[-55%] xl:bottom-[-50%]"
                                : "bottom-[-58%] md:bottom-[-75%] xl:bottom-[-70%]"
                        }`}
                    >
                        <h3 className="text-[0.8rem] md:text-[1.2rem]">{s.name}</h3>
                        <p className="text-[0.7rem] md:text-[0.9rem] mt-1.25 mb-5 md:mb-10">{s.eng}</p>
                        <button
                            className={isHover === s.id ? "block" : "hidden"}
                            onMouseEnter={() => setLinkHover(s.id)}
                            onMouseLeave={() => setLinkHover(null)}
                        >
                            <Link href={s.url} className="flex justify-between" onFocus={() => setIsFocus(s.name)}>
                                <p className="text-white text-[0.8rem] md:text-[0.9rem] xl:text-[1rem] my-auto mr-5 md:mr-7.5 ml-0">More View</p>
                                <div className="relative">
                                    <div
                                        className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                                            linkHover === s.id ? "animate-line-hover" : ""
                                        }`}
                                    >
                                        <Image src="/icons/solution_arrow.png" alt={`${s.name} 자세히 보기`} width={26} height={13} className="w-5 md:w-6.25 h-auto m-auto" />
                                    </div>
                                    <div>
                                        <Image src="/icons/solution_more.png" alt={`${s.name} 자세히 보기`} width={32} height={34} className="w-5.75 md:w-7.5 h-auto m-auto" />
                                    </div>
                                </div>
                            </Link>
                        </button>
                    </div>
                </section>
                </div>
            )}
        </div>
    )
}
