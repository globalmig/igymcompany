"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface EventDetailData {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail?: string[];
}

export default function EventDetail() {
    const params = useParams();
    const { id } = params;
    const [event, setEvent] = useState<EventDetailData | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/event/${id}`);
                if (!res.ok) throw new Error("행사를 불러올 수 없습니다.");

                const data = await res.json();
                setEvent(data);
            } catch (err) {
                console.error("Event Detail Fetch Error:", err);
            }
        };
        fetchDetail();
    }, [id]);

    if (!event) {
        return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">행사 정보를 불러오는 중입니다.</div>;
    }

    const isFull = event.detail && (event.detail.length < 6 || (event.detail.length < 6 && event.detail.length % 2 !== 0));

    return (
        <article>
            <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
                <div>
                    <div>
                        <Image
                            src={event.thumnail}
                            alt={event.name}
                            width={1000}
                            height={655}
                            className="w-full h-auto object-cover rounded-[10px] xl:w-200 xl:m-auto"
                        />
                    </div>
                    <h2 className="my-12.5 pb-5 border-b border-[#aaa] text-center xl:mt-20 xl:mb-12.5 xl:text-[2.5rem]">{event.name}</h2>
                </div>
                {event.detail && event.detail.length > 0 &&
                    <div className="md:flex md:justify-between md:flex-wrap">
                    {event.detail.map((img, idx) => (
                        <div key={idx} className={`my-5 ${isFull ? "md:w-full" : "md:w-[48%]"}`}>
                            <Image
                                src={img}
                                alt={event.name}
                                width={1000}
                                height={619}
                                className={`w-full h-auto rounded-[10px] xl:w-250 xl:m-auto ${isFull ? "" : "md:max-w-145"}`}
                            />
                        </div>
                    ))}
                </div>
                }
            </div>
        </article>
    );
}
