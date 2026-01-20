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
                    .order("created_at", { ascending: false });

                if (category) {
                    query = query.eq("category", category);
                }
                else if (preview) {
                    query = query.eq("category", preview).limit(4);
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
    
    const currentItems = isPreview ? products.slice(0, 4) : products.slice(indexOfFirstItem, indexOfLastItem);

    if (!products || products.length === 0)
        return <div className="loading">상품을 불러오는 중입니다.</div>;

    return (
        <>
        <div className="list">
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