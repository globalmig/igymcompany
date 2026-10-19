"use client"
import ProductForm from "@/components/admin/products/ProductForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function AdminProductDetailPage() {

    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/product/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("상품 조회 실패");
                return res.json();
            })
            .then(setData)
            .catch(console.error);
    }, [id]);


    if (!data) return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">상품 정보를 불러오는 중입니다...</div>;

    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6 xl:max-w-325 xl:mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">제품 상세</h2>
            </div>
            <ProductForm mode="detail" initialData={data} />
        </div>
    )
}
