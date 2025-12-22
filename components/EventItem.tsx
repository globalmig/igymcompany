"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    
    return (
        <section className="event-item" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
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