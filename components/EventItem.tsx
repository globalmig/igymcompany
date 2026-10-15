"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Aos from "aos";

interface EventItemProps {
    event : {
        id: string,
        name: string,
        category: string,
        thumnail: string,
        detail?: string[],
    }
}

export default function EventItem({event} : EventItemProps) {

    const [isHover, setIsHover] = useState<boolean>(false);

    useEffect(() => {
                Aos.init();
                Aos.refresh();
            }, []);

    return (
        <section className="relative my-3 w-[48%] overflow-hidden rounded-lg xl:my-5 xl:w-95 xl:rounded-[15px]" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} data-aos="fade-up"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000"
                    data-aos-once="true">
            <Link href={`/${event.category}/${event.id}`}>
            <div>
                <Image src={event.thumnail} alt={event.name} width={700} height={500} className="h-auto min-h-27 max-h-125 w-full rounded-[10px] object-cover xl:h-57.5 xl:rounded-[15px]"/>
            </div>
            </Link>
            <div className={`absolute left-0 w-full h-11.25 rounded-b-[10px] bg-black/70 text-center text-white transition-[bottom] duration-800 md:h-15 xl:rounded-b-[15px] ${isHover ? "bottom-0" : "-bottom-25"}`}>
                <p className="absolute top-1/2 left-1/2 w-[97%] -translate-x-1/2 -translate-y-1/2 text-[0.7rem] md:text-base xl:w-[85%]">{event.name}</p>
            </div>
        </section>
    )
}
