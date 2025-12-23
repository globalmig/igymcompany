"use client";
import Image from "next/image";
import Link from "next/link";
import ProductList from "./ProductList";

interface ProductPreviewProps {
    name: string,
    category: string,
}

export default function ProductPreview({ name, category }: ProductPreviewProps) {

    return (
        <section>
            <div className="display-flex">
                <h3>{name}</h3>
                <button className="display-flex">
                    <Link href={`/${category}`}>더보기</Link>
                    <Image src="/icons/more.png" alt="더보기" width={25} height={45} />
                </button>
            </div>
            <ProductList preview={category}/>
        </section>
    )
}