"use client";
import { EVENT } from "@/data/event";
import EventItem from "./EventItem";
import { usePathname } from "next/navigation";

export default function EventList() {

    const pathname = usePathname();
    const isMain = pathname === "/";

    const event = isMain ? EVENT.slice(0,6) : EVENT

    return (
        <div className="display-flex-flow">
            {event.map(e => 
                <EventItem key={e.id} event={e}/>
            )}
        </div>
    )
}