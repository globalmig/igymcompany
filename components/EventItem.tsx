"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Aos from "aos";

interface EventItemProps {
    event : {
        id: number,
        name: string,
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
        <section className="event-item" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} data-aos="fade-up"
                    data-aos-easing="ease-out"
                    data-aos-duration="1000">
            <Link href={`/event/${event.id}`}>
            <div>
                <Image src={event.thumnail} alt={event.name} width={700} height={500}/>
            </div>
            </Link>
            <div className={isHover ? "event-hover" : ""}>
                <p>{event.name}</p>
            </div>
        </section>
    )
}