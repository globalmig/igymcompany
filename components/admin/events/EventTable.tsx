"use client";
import { CATEGORY_MAP } from "@/data/category";
import Link from "next/link";
import { DragEvent, useRef } from "react";
import ImageWithSkeleton from "@/components/admin/common/ImageWithSkeleton";

interface EventRow {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail?: string[];
    show_on_main?: boolean;
}

interface EventTableProps {
    events: EventRow[];
    onDelete: (id: string) => void;
    sortable?: boolean;
    onReorder?: (events: EventRow[]) => void;
    onMoveStep?: (id: string, direction: -1 | 1) => void;
    firstId?: string;
    lastId?: string;
}

export default function EventTable({ events, onDelete, sortable = false, onReorder, onMoveStep, firstId, lastId }: EventTableProps) {

    const dragIndexRef = useRef<number | null>(null);

    if (!events.length) {
        return <p className="text-center py-15 text-admin-muted">등록된 행사가 없습니다.</p>;
    }

    const thClasses = "px-2.5 py-3 text-[0.82rem] text-center font-bold";
    const tdClasses = "px-2.5 py-3 text-center text-[0.85rem] border-b border-admin-border text-admin-text";

    const onDragStartRow = (index: number) => {
        dragIndexRef.current = index;
    };

    const onDragOverRow = (e: DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    };

    const onDropRow = (index: number) => {
        const from = dragIndexRef.current;
        dragIndexRef.current = null;
        if (from === null || from === index || !onReorder) return;
        const next = [...events];
        const [moved] = next.splice(from, 1);
        next.splice(index, 0, moved);
        onReorder(next);
    };

    return (
        <div className="overflow-x-auto">
            <table className={`w-full min-w-140 border-collapse ${sortable ? "[&_tbody_tr]:cursor-grab [&_tbody_tr]:active:cursor-grabbing" : ""}`}>
                <thead>
                    <tr className="bg-admin-dark text-white">
                        {sortable && <th className="w-9" aria-hidden="true" />}
                        <th className={`${thClasses} w-27.5`}>대표이미지</th>
                        <th className={thClasses}>행사명</th>
                        <th className={thClasses}>카테고리</th>
                        <th className={thClasses}>화면에 노출</th>
                        {sortable && <th className={`${thClasses} whitespace-nowrap`}>순서 이동</th>}
                        <th className={`${thClasses} whitespace-nowrap`}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((e, index) => {
                        const categoryTitle = CATEGORY_MAP[e.category]?.title ?? "-";
                        return (
                            <tr
                                key={e.id}
                                draggable={sortable}
                                onDragStart={sortable ? () => onDragStartRow(index) : undefined}
                                onDragOver={sortable ? onDragOverRow : undefined}
                                onDrop={sortable ? () => onDropRow(index) : undefined}
                            >
                                {sortable && (
                                    <td className={`${tdClasses} w-9`} title="드래그하여 순서 변경">
                                        <span className="inline-flex items-center justify-center w-6 h-6 text-admin-muted" aria-label="드래그하여 순서 변경">
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="5" cy="3" r="1.3" fill="currentColor" />
                                                <circle cx="11" cy="3" r="1.3" fill="currentColor" />
                                                <circle cx="5" cy="8" r="1.3" fill="currentColor" />
                                                <circle cx="11" cy="8" r="1.3" fill="currentColor" />
                                                <circle cx="5" cy="13" r="1.3" fill="currentColor" />
                                                <circle cx="11" cy="13" r="1.3" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </td>
                                )}
                                <td className={`${tdClasses} w-27.5`}>
                                    <Link href={`/admin/event/${e.id}`}>
                                        <ImageWithSkeleton src={e.thumnail} alt={e.name} width={120} height={74} className="w-22.5 h-14 mx-auto rounded-md" />
                                    </Link>
                                </td>
                                <td className={tdClasses}>
                                    <Link href={`/admin/event/${e.id}`}>{e.name}</Link>
                                </td>
                                <td className={tdClasses}>{categoryTitle}</td>
                                <td className={tdClasses}>{e.show_on_main ? <span className="text-[#58C133] font-bold">ON</span> : "OFF"}</td>
                                {sortable && (
                                    <td className={`${tdClasses} whitespace-nowrap`}>
                                        <button
                                            type="button"
                                            onClick={() => onMoveStep?.(e.id, -1)}
                                            disabled={e.id === firstId}
                                            title="위로 이동 (이전 페이지 마지막 순서로 이동 가능)"
                                            className="px-2.5 py-1 mr-1.5 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onMoveStep?.(e.id, 1)}
                                            disabled={e.id === lastId}
                                            title="아래로 이동 (다음 페이지 첫 순서로 이동 가능)"
                                            className="px-2.5 py-1 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default"
                                        >
                                            ▼
                                        </button>
                                    </td>
                                )}
                                <td className={`${tdClasses} whitespace-nowrap`}>
                                    <Link href={`/admin/event/${e.id}/edit`} className="text-admin-dark font-bold mr-3">수정</Link>
                                    <button type="button" onClick={() => onDelete(e.id)} className="text-admin-muted text-[0.85rem] underline cursor-pointer">삭제</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
