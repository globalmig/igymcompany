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
        <div className="display-flex-flow">
            {SOLUTION.map(s =>
                <div key={s.id}>
                    <section
                    onMouseEnter={() => setIsHover(s.id)}
                    onMouseLeave={() => setIsHover(null)}
                    data-aos="fade-up"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000"
                    data-aos-once="true"
                    >
                    <div>
                        <Image src={s.img} alt={s.name} width={316} height={412} />
                    </div>
                    <div className={isHover === s.id ? "solution-hover" : ""}>
                        <h3>{s.name}</h3>
                        <p>{s.eng}</p>
                        <button onMouseEnter={() => setLinkHover(s.id)}
                                onMouseLeave={() => setLinkHover(null)}>
                            <Link href={s.url} className={`display-flex ${linkHover === s.id ? "link-hover" : ""}`} onFocus={() => setIsFocus(s.name)}>
                                <p>More View</p>
                                <div>
                                    <div>
                                        <Image src="/icons/solution_arrow.png" alt={`${s.name} 자세히 보기`} width={26} height={13} />
                                    </div>
                                    <div>
                                        <Image src="/icons/solution_more.png" alt={`${s.name} 자세히 보기`} width={32} height={34} />
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