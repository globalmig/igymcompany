"use client";
import ProductItem from "./ProductItem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Pagination from "./Pagination";

interface ProductListProps {
    preview?: string,
    dataPerPage?: number,
}

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

const MAIN_PREVIEW_LIMIT = 4;

// 메인 PRODUCT PREVIEW 섹션 노출 규칙 (카테고리별):
// 1) "화면에 노출"(show_on_main) 토글이 켜진 상품이 있으면 그 중에서 최대 4개
// 2) 하나도 켜져 있지 않다면(=노출 설정 미사용) 해당 카테고리 상품 중 최대 4개
function selectMainPreviewProducts(products: Product[], limit = MAIN_PREVIEW_LIMIT) {
    const explicitlyVisible = products.filter(p => p.show_on_main === true);
    const pool = explicitlyVisible.length > 0 ? explicitlyVisible : products;
    return pool.slice(0, limit);
}

// components/ProductList.tsx
export default function ProductList({ preview, dataPerPage=12}: ProductListProps) {

    const params = useParams();
    const category = params?.category as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let query = supabase
                    .from("products")
                    .select("*")
                    .order("sort_order", { ascending: true, nullsFirst: false })
                    .order("created_at", { ascending: false });

                if (category) {
                    query = query.eq("category", category);
                }
                else if (preview) {
                    query = query.eq("category", preview);
                }

                const { data, error } = await query;

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        fetchProducts();
    }, [category, preview]);

    const isPreview = !category && preview;
    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    
    const currentItems = isPreview ? selectMainPreviewProducts(products) : products.slice(indexOfFirstItem, indexOfLastItem);

    if (!products || products.length === 0)
        return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">상품을 불러오는 중입니다.</div>;

    return (
        <>
        <div className="flex flex-wrap justify-between xl:justify-start xl:gap-x-6.5">
                {currentItems.map(p => <ProductItem key={p.id} product={p} isPreview={!!category} />)}
            </div>
            
            {!isPreview && (
                <Pagination 
                    totalCount={products.length}
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </>
    )
}