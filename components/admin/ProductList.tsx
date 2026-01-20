"use client";
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import Link from "next/link";

interface ProductListProps {
    products: Product[]
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

export default function ProductList({products }: ProductListProps) {
    // 상품 목록 페이지

  if (products.length === 0) return <p>상품 목록을 불러오는 중입니다...</p>;
  if (!products.length) return <p>상품이 없습니다.</p>;

    return (
        <>
        <div>
            <ul className="display-flex">
                <li className="pc">이미지</li>
                <li>상품명</li>
                <li>카테고리</li>
            </ul>
            {products.map(p => {
                const categoryTitle = CATEGORY_MAP[p.category]?.title ?? "";
                return (<div key={p.id}>
                    <Link href={`/admin/product/${p.id}`}>
                        <ul className="display-flex">
                            <li className="pc">
                                <Image src={p.thumnail} alt={p.name} width={1000} height={619} />
                            </li>
                            <li><p>{p.name}</p></li>
                            <li><p>{categoryTitle}</p></li>
                        </ul>
                    </Link>
                </div>)
            })
            }
        </div>
        </>
    )
}