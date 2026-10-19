"use client";
import Pagination from "@/components/Pagination";
import ProductTable from "@/components/admin/products/ProductTable";
import { CATEGORY_MAP } from "@/data/category";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    intro?: string;
    contents?: string[];
    size?: string;
    detail?: string[];
    sort_order?: number | null;
    show_on_main?: boolean;
}

const PRODUCT_CATEGORIES = ["truss", "sound", "airbounce", "waterslide", "rental", "amusement", "experience"];

function AdminPageContent() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [category, setCategoryState] = useState<string>(() => searchParams.get("category") || "all");
    const [keyword, setKeyword] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;

    const fetchProducts = useCallback(async () => {
        let query = supabase
            .from("products")
            .select("*")
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: false });
        if (category !== "all") query = query.eq("category", category);

        const { data, error } = await query;
        if (!error && data) {
            setProducts(data);
            setCurrentPage(1);
        }
    }, [category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const setCategory = useCallback((key: string) => {
        setCategoryState(key);
        const params = new URLSearchParams(searchParams.toString());
        if (key === "all") params.delete("category");
        else params.set("category", key);
        router.replace(`/admin${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }, [router, searchParams]);

    const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setCurrentPage(1);
    };

    const onDeleteProduct = async (id: string) => {
        if (!confirm("상품을 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "삭제 실패");
            fetchProducts();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // 검색 중이 아닐 때만 드래그를 지원한다. 검색 중에는 전체 상품 중 일부만 보이므로
    // 그 안에서의 순서가 실제 전체 순서와 어긋나 의미가 없어진다.
    const sortable = keyword.trim() === "";

    const filteredProducts = keyword.trim()
        ? products.filter(p => p.name.toLowerCase().includes(keyword.trim().toLowerCase()))
        : products;

    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // 현재 페이지(currentItems) 안에서 재정렬된 결과를 받아, 전체 목록(products)의 해당 구간만
    // 교체한 뒤 전체 목록 기준으로 sort_order를 다시 저장한다. 페이지를 넘나드는 드래그는 지원하지 않는다.
    const onReorderProducts = useCallback(async (reorderedPage: Product[]) => {
        const prev = products;
        const next = [...products];
        next.splice(indexOfFirstItem, reorderedPage.length, ...reorderedPage);
        setProducts(next);
        try {
            const res = await fetch("/api/product/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: next.map((p) => p.id) }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "정렬 저장 실패");
        } catch (err) {
            alert(err instanceof Error ? err.message : "정렬 저장에 실패했습니다.");
            setProducts(prev);
        }
    }, [products, indexOfFirstItem]);

    // 드래그는 같은 페이지 안에서만 순서를 바꿀 수 있어, 페이지 경계를 넘는 이동은
    // ▲▼ 버튼으로 전체 목록 기준 바로 앞/뒤 항목과 자리를 바꾼다. 경계를 넘으면
    // (예: 1페이지 마지막 → 2페이지 첫번째) 이동한 항목이 있는 페이지로 자동 전환한다.
    const onMoveProductStep = useCallback(async (id: string, direction: -1 | 1) => {
        const idx = products.findIndex((p) => p.id === id);
        if (idx === -1) return;

        const target = idx + direction;
        if (target < 0 || target >= products.length) return;

        const prev = products;
        const next = [...products];
        [next[idx], next[target]] = [next[target], next[idx]];

        setProducts(next);
        setCurrentPage(Math.floor(target / dataPerPage) + 1);

        try {
            const res = await fetch("/api/product/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: next.map((p) => p.id) }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "정렬 저장 실패");
        } catch (err) {
            alert(err instanceof Error ? err.message : "정렬 저장에 실패했습니다.");
            setProducts(prev);
        }
    }, [products, dataPerPage]);

    const tabButtonClasses = "px-4 py-2 rounded-full bg-[#f2f2f2] text-admin-muted text-[0.82rem] cursor-pointer";

    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">제품관리</h2>
                <div className="flex items-center gap-2.5">
                    <input
                        type="text"
                        placeholder="제품명 검색"
                        value={keyword}
                        onChange={onChangeKeyword}
                        className="px-3 py-2.25 border border-admin-border rounded-lg text-[0.85rem] w-55 max-w-[45vw]"
                    />
                    <button type="button" className="px-4.5 py-2.5 bg-admin-dark rounded-lg cursor-pointer">
                        <Link href="/admin/upload" className="text-white font-bold text-[0.85rem]">제품 등록</Link>
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
                {PRODUCT_CATEGORIES.map((key) => (
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

            <ProductTable
                products={currentItems}
                onDelete={onDeleteProduct}
                sortable={sortable}
                onReorder={onReorderProducts}
                onMoveStep={onMoveProductStep}
                firstId={filteredProducts[0]?.id}
                lastId={filteredProducts[filteredProducts.length - 1]?.id}
            />

            <Pagination
                variant="admin"
                totalCount={filteredProducts.length}
                currentPage={currentPage}
                dataPerPage={dataPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={null}>
            <AdminPageContent />
        </Suspense>
    );
}
