"use client"
import ProductForm from "@/components/admin/products/ProductForm";
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
    show_on_main?: boolean;
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
                    show_on_main: data.show_on_main ?? false,
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

    if (loading) return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">상품 정보를 불러오는 중입니다.</div>;
    if (!initialData) return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">상품이 존재하지 않습니다.</div>;

    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6 xl:max-w-325 xl:mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">제품 수정</h2>
            </div>
            <ProductForm mode="edit" initialData={initialData} />
        </div>
    )
}
