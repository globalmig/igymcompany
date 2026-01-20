"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductDetail {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    size?: string;
    contents?: string[];
    detail?: string[];
}

export default function Detail() {

    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState<ProductDetail | null>(null);

    useEffect(()=> {
        if(!id) return;

        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/product/${id}`);
                if (!res.ok) throw new Error("상품을 불러올 수 없습니다.");
                
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Detail Fetch Error:", err);
            }
        };
        fetchDetail();
    }, [id]);

    if (!product) {
        return <div className="loading">상품 정보를 불러오는 중입니다.</div>;
    }

    return (
        <article className="detail">
            <div>
                <div>
                    <div>
                        <Image src={product.thumnail} alt={product.name} width={1000} height={619} />
                    </div>
                    <h2>{product.name}</h2>
                    {product.category !== "sound" && product.category !== "rental" ?
                        <div>
                            <p><span>SIZE</span> {product.size}</p>
                            <button><Link href="/inquire">문의하기</Link></button>
                        </div> :
                        <div style={{ display: "none" }}></div>
                    }
                    {product.contents &&
                        <ul>
                            {product.contents.map((c, index) => <li key={index}>{c}</li>)}
                        </ul>
                    }
                </div>
                <div>
                    {product.detail?.map((d, index) =>
                        <div key={index}>
                            <Image src={d} alt={product.name} width={1000} height={619} />
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}