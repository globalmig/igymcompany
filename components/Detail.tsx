"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseDetailBlocks } from "@/lib/product/detailBlocks";

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
        return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">상품 정보를 불러오는 중입니다.</div>;
    }

    const detailDivClasses = "my-5 md:my-10 xl:mx-auto xl:w-250";
    const blocks = parseDetailBlocks(product.detail, product.contents);

    return (
        <article className="relative">
            <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
                <div>
                    <div>
                        <Image src={product.thumnail} alt={product.name} width={1000} height={619} className="w-full h-43.5 object-cover rounded-[10px] md:h-108.75 xl:w-200 xl:h-125 xl:m-auto" />
                    </div>
                    <h2 className="mt-12.5 text-center pb-5 border-b border-[#aaa] xl:mt-20 xl:text-[2.5rem]">{product.name}</h2>
                    {product.category !== "sound" && product.category !== "rental" ?
                        <div className="text-center py-2 border-b border-[#aaa] mb-10 md:relative md:py-5 xl:py-7.5 xl:mb-17.5">
                            <p><span className="font-bold mr-2.5 xl:mr-3.75">SIZE</span> {product.size}</p>
                            <button className="fixed z-3 right-0 bottom-0 bg-black w-full p-5 rounded-t-[15px] md:absolute md:top-1/2 md:-translate-y-1/2 md:w-[15%] md:py-1.25 md:px-5 md:rounded-[50px]"><Link href="/inquire" className="text-white text-base">문의하기</Link></button>
                        </div> :
                        <div style={{ display: "none" }}></div>
                    }
                </div>
                <div>
                    {blocks.map((block, index) =>
                        block.type === "text" ? (
                            <p
                                key={index}
                                className={`text-center whitespace-pre-line ${detailDivClasses} ${index === 0 ? "mt-10 xl:mt-17.5" : ""}`}
                            >
                                {block.text}
                            </p>
                        ) : (
                            <div key={index} className={`${detailDivClasses} ${index === 0 ? "mt-10 xl:mt-17.5" : ""}`}>
                                <Image src={block.url} alt={product.name} width={1000} height={619} className="w-full h-43.5 object-cover rounded-[10px] md:h-108.75 xl:w-250 xl:h-154.75 xl:m-auto" />
                            </div>
                        )
                    )}
                </div>
            </div>
        </article>
    )
}