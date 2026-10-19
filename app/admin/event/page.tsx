"use client";
import Pagination from "@/components/Pagination";
import EventTable from "@/components/admin/events/EventTable";
import { CATEGORY_MAP } from "@/data/category";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";

interface EventRow {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail?: string[];
    sort_order?: number | null;
    show_on_main?: boolean;
}

const EVENT_CATEGORIES = ["event", "sports_competition"];

function AdminEventPageContent() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [category, setCategoryState] = useState<string>(() => searchParams.get("category") || "all");
    const [keyword, setKeyword] = useState<string>("");
    const [events, setEvents] = useState<EventRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;

    const fetchEvents = useCallback(async () => {
        let query = supabase
            .from("events")
            .select("*")
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: false });
        if (category !== "all") query = query.eq("category", category);

        const { data, error } = await query;
        if (!error && data) {
            setEvents(data);
            setCurrentPage(1);
        }
    }, [category]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const setCategory = useCallback((key: string) => {
        setCategoryState(key);
        const params = new URLSearchParams(searchParams.toString());
        if (key === "all") params.delete("category");
        else params.set("category", key);
        router.replace(`/admin/event${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }, [router, searchParams]);

    const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setCurrentPage(1);
    };

    const onDeleteEvent = async (id: string) => {
        if (!confirm("행사를 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "삭제 실패");
            fetchEvents();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // 검색 중이 아닐 때만 드래그를 지원한다. 검색 중에는 전체 행사 중 일부만 보이므로
    // 그 안에서의 순서가 실제 전체 순서와 어긋나 의미가 없어진다.
    const sortable = keyword.trim() === "";

    const filteredEvents = keyword.trim()
        ? events.filter(e => e.name.toLowerCase().includes(keyword.trim().toLowerCase()))
        : events;

    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    // 현재 페이지(currentItems) 안에서 재정렬된 결과를 받아, 전체 목록(events)의 해당 구간만
    // 교체한 뒤 전체 목록 기준으로 sort_order를 다시 저장한다. 페이지를 넘나드는 드래그는 지원하지 않는다.
    const onReorderEvents = useCallback(async (reorderedPage: EventRow[]) => {
        const prev = events;
        const next = [...events];
        next.splice(indexOfFirstItem, reorderedPage.length, ...reorderedPage);
        setEvents(next);
        try {
            const res = await fetch("/api/event/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: next.map((e) => e.id) }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "정렬 저장 실패");
        } catch (err) {
            alert(err instanceof Error ? err.message : "정렬 저장에 실패했습니다.");
            setEvents(prev);
        }
    }, [events, indexOfFirstItem]);

    const onMoveEventStep = useCallback(async (id: string, direction: -1 | 1) => {
        const idx = events.findIndex((e) => e.id === id);
        if (idx === -1) return;

        const target = idx + direction;
        if (target < 0 || target >= events.length) return;

        const prev = events;
        const next = [...events];
        [next[idx], next[target]] = [next[target], next[idx]];

        setEvents(next);
        setCurrentPage(Math.floor(target / dataPerPage) + 1);

        try {
            const res = await fetch("/api/event/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: next.map((e) => e.id) }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "정렬 저장 실패");
        } catch (err) {
            alert(err instanceof Error ? err.message : "정렬 저장에 실패했습니다.");
            setEvents(prev);
        }
    }, [events, dataPerPage]);

    const tabButtonClasses = "px-4 py-2 rounded-full bg-[#f2f2f2] text-admin-muted text-[0.82rem] cursor-pointer";

    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">행사관리</h2>
                <div className="flex items-center gap-2.5">
                    <input
                        type="text"
                        placeholder="행사명 검색"
                        value={keyword}
                        onChange={onChangeKeyword}
                        className="px-3 py-2.25 border border-admin-border rounded-lg text-[0.85rem] w-55 max-w-[45vw]"
                    />
                    <button type="button" className="px-4.5 py-2.5 bg-admin-dark rounded-lg cursor-pointer">
                        <Link href="/admin/event/upload" className="text-white font-bold text-[0.85rem]">행사 등록</Link>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-admin-border">
                <button
                    type="button"
                    className={`${tabButtonClasses} ${category === "all" ? "bg-admin-dark text-white" : ""}`}
                    onClick={() => setCategory("all")}
                >
                    전체
                </button>
                {EVENT_CATEGORIES.map((key) => (
                    <button
                        key={key}
                        type="button"
                        className={`${tabButtonClasses} ${category === key ? "bg-admin-dark text-white" : ""}`}
                        onClick={() => setCategory(key)}
                    >
                        {CATEGORY_MAP[key]?.title ?? key}
                    </button>
                ))}
            </div>

            {sortable && (
                <p className="text-[0.82rem] text-admin-muted mb-3.5">드래그 아이콘(⠿)을 눌러 끌면 같은 페이지 안에서 순서가 바뀌고, 놓는 즉시 자동으로 저장됩니다.<br/>
                ▲▼ 버튼을 누르면 바로 앞/뒤 순서와 자리를 바꾸며, 페이지 경계를 넘으면 해당 페이지로 자동 이동합니다.</p>
            )}

            <EventTable
                events={currentItems}
                onDelete={onDeleteEvent}
                sortable={sortable}
                onReorder={onReorderEvents}
                onMoveStep={onMoveEventStep}
                firstId={filteredEvents[0]?.id}
                lastId={filteredEvents[filteredEvents.length - 1]?.id}
            />

            <Pagination
                variant="admin"
                totalCount={filteredEvents.length}
                currentPage={currentPage}
                dataPerPage={dataPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}

export default function AdminEventPage() {
    return (
        <Suspense fallback={null}>
            <AdminEventPageContent />
        </Suspense>
    );
}
