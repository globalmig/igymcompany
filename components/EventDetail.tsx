"use client";

import { EVENT } from "@/data/event";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function EventDetail() {
    const params = useParams();
    const { id } = params;

    const event = EVENT.find(e => String(e.id) === id);

    if (!event) {
        return <div className="loading">홈페이지를 불러오는 중입니다.</div>;
    }

    return (
        <article className="event-detail">
            <div>
                <div>
                    <div>
                        <Image
                            src={event.thumnail}
                            alt={event.name}
                            width={1000}
                            height={655}
                        />
                    </div>
                    <h2>{event.name}</h2>
                </div>
                {event.detail &&
                    <div className={event.detail.length < 6 || event.detail.length < 6  && event.detail.length % 2 !== 0 ? "event-detail-full" : "event-detail-flex"}>
                    {event.detail.map((img, idx) => (
                        <div key={idx}>
                            <Image
                                src={img}
                                alt={event.name}
                                width={1000}
                                height={619}
                            />
                        </div>
                    ))}
                </div>
                }
            </div>
        </article>
    );
}
