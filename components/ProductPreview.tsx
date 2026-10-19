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
            <div className="flex justify-between mb-4 xl:mb-5">
                <h3 className="xl:text-[1.5rem]">{name}</h3>
                <button className="flex justify-between">
                    <Link href={`/${category}`} className="my-auto mr-2.5 ml-0 xl:text-[1rem]">더보기</Link>
                    <Image src="/icons/more.png" alt={`${name} 자세히 보기`} width={25} height={45} className="w-2 h-auto" />
                </button>
            </div>
            <ProductList preview={category}/>
        </section>
    )
}