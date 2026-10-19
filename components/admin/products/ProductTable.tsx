"use client";
import { CATEGORY_MAP } from "@/data/category";
import Link from "next/link";
import { DragEvent, useRef } from "react";
import ImageWithSkeleton from "@/components/admin/common/ImageWithSkeleton";

interface Product {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    intro?: string;
    contents?: string[];
    size?: string;
    detail?: string[];
    show_on_main?: boolean;
}

interface ProductTableProps {
    products: Product[];
    onDelete: (id: string) => void;
    sortable?: boolean;
    onReorder?: (products: Product[]) => void;
    onMoveStep?: (id: string, direction: -1 | 1) => void;
    firstId?: string;
    lastId?: string;
}

export default function ProductTable({ products, onDelete, sortable = false, onReorder, onMoveStep, firstId, lastId }: ProductTableProps) {

    const dragIndexRef = useRef<number | null>(null);

    if (!products.length) {
        return <p className="text-center py-15 text-admin-muted">등록된 상품이 없습니다.</p>;
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
        const next = [...products];
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
                        <th className={thClasses}>제품명</th>
                        <th className={thClasses}>카테고리</th>
                        <th className={thClasses}>화면에 노출</th>
                        {sortable && <th className={`${thClasses} whitespace-nowrap`}>순서 이동</th>}
                        <th className={`${thClasses} whitespace-nowrap`}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, index) => {
                        const categoryTitle = CATEGORY_MAP[p.category]?.title ?? "-";
                        return (
                            <tr
                                key={p.id}
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
                                    <Link href={`/admin/product/${p.id}`}>
                                        <ImageWithSkeleton src={p.thumnail} alt={p.name} width={120} height={74} className="w-22.5 h-14 mx-auto rounded-md" />
                                    </Link>
                                </td>
                                <td className={tdClasses}>
                                    <Link href={`/admin/product/${p.id}`}>{p.name}</Link>
                                </td>
                                <td className={tdClasses}>{categoryTitle}</td>
                                <td className={tdClasses}>{p.show_on_main ? <span className="text-[#58C133] font-bold">ON</span> : "OFF"}</td>
                                {sortable && (
                                    <td className={`${tdClasses} whitespace-nowrap`}>
                                        <button
                                            type="button"
                                            onClick={() => onMoveStep?.(p.id, -1)}
                                            disabled={p.id === firstId}
                                            title="위로 이동 (이전 페이지 마지막 순서로 이동 가능)"
                                            className="px-2.5 py-1 mr-1.5 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onMoveStep?.(p.id, 1)}
                                            disabled={p.id === lastId}
                                            title="아래로 이동 (다음 페이지 첫 순서로 이동 가능)"
                                            className="px-2.5 py-1 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default"
                                        >
                                            ▼
                                        </button>
                                    </td>
                                )}
                                <td className={`${tdClasses} whitespace-nowrap`}>
                                    <Link href={`/admin/product/${p.id}/edit`} className="text-admin-dark font-bold mr-3">수정</Link>
                                    <button type="button" onClick={() => onDelete(p.id)} className="text-admin-muted text-[0.85rem] underline cursor-pointer">삭제</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
