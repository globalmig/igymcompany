"use client"
import ProductForm from "@/components/admin/ProductForm";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface InitialDataProps {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    intro?: string;
    contents: string[];
    size?: string;
    detail: string[];
}

export default function ProductEditPage() {
    const { id } = useParams();
    const [initialData, setInitialData] = useState<InitialDataProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        if (!id) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("상품을 찾을 수 없습니다.");

                // Form 초기 데이터 타입에 맞게 변환
                const formattedData: InitialDataProps = {
                    id: String(data.id),
                    name: data.name,
                    category: data.category,
                    thumnail: data.thumnail,
                    intro: data.intro ?? "",
                    contents: data.contents ?? [],
                    size: data.size ?? "별도 문의",
                    detail: data.detail ?? [],
                };

                setInitialData(formattedData);
            } catch (err: any) {
                console.error("상품 조회 실패:", err);
                alert("상품 조회 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    
    if (loading) return <div className="loading">상품 정보를 불러오는 중입니다.</div>;
    if (!initialData) return <div className="loading">상품이 존재하지 않습니다.</div>;

    return (
        <article className="admin-product-form">
            <div>
                <div>
                    <h2>상품 수정</h2>
                </div>
                <div>
                    <ProductForm mode="edit" initialData={initialData} />
                </div>
            </div>
        </article>
    )
}