"use client";
import Image from "next/image";
import Link from "next/link";
import Aos from "aos";
import { useEffect } from "react";

interface ProductItemProps {
    product: {
        id: number,
        name: string,
        category: string,
        thumnail: string,
        contents?: string[],
        intro?: string[],
        size: string,
        detail: string[]
    },
    isPreview: boolean
}

export default function ProductItem({ product, isPreview }: ProductItemProps) {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <section className="product-item" data-aos="fade-up"
            data-aos-easing="ease-out"
            data-aos-duration="1000">
            <div>
                <div>
                    <Link href={`/${product.category}/${product.id}`}>
                        <Image src={product.thumnail} alt={product.name} width={1000} height={619} />
                    </Link>
                </div>
                <div>
                    <h4>{product.name}</h4>
                    <ul>
                        {product.size !== "별도 문의" && <li>{product.size}</li>}
                        {product.intro && product.intro.map(i =>
                            <li key={i}>{i}</li>
                        )}
                    </ul>
                </div>
            </div>
            {isPreview &&
                <button>
                    <Link href={`/${product.category}/${product.id}`}>자세히 보기</Link>
                </button>
            }
        </section>
    )
}