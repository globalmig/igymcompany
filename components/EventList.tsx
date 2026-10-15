"use client";
import EventItem from "./EventItem";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface EventListProps {
    category: string;
    className?: string;
}

interface Event {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail?: string[];
    show_on_main?: boolean;
}

const MAIN_PORTFOLIO_LIMIT = 9;

// 메인 포트폴리오 섹션 노출 규칙:
// 1) "화면에 노출"(show_on_main) 토글이 켜진 행사가 있으면 그 중에서 최신 등록순으로 최대 9개
// 2) 하나도 켜져 있지 않다면(=노출 설정 미사용) 전체 행사 중 최신 등록순으로 9개
function selectMainPortfolioEvents(events: Event[], limit = MAIN_PORTFOLIO_LIMIT) {
    const explicitlyVisible = events.filter(event => event.show_on_main === true);
    const pool = explicitlyVisible.length > 0 ? explicitlyVisible : events;
    return pool.slice(0, limit);
}

export default function EventList({ category, className }: EventListProps) {

    const pathname = usePathname();
    const isMain = pathname === "/";

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("category", category)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setEvents(data || []);
            } catch (error) {
                console.error("행사 데이터 로드 실패:", error);
            }
        };

        fetchEvents();
    }, [category]);

    const visibleEvents = isMain ? selectMainPortfolioEvents(events) : events;

    if (!visibleEvents.length) {
        return <p className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">등록된 행사가 없습니다.</p>;
    }

    return (
        <div className={`flex flex-wrap justify-between${className ? ` ${className}` : ""}`}>
            {visibleEvents.map(e =>
                <EventItem key={e.id} event={e}/>
            )}
        </div>
    )
}
