"use client"
import ProductForm from "@/components/admin/ProductForm";
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


    if (!data) return <div className="loading">상품 정보를 불러오는 중입니다...</div>;

    return (
        <article className="admin-product-form">
            <div>
                <div>
                    <h2>상품 상세</h2>
                </div>
                <div>
                    <ProductForm mode="detail" initialData={data} />
                </div>
            </div>
        </article>
    )
}