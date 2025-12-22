import Image from "next/image";
import Link from "next/link";

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
}

export default function ProductItem({ product }: ProductItemProps) {
    return (
        <section className="product-item">
            <div>
                <div>
                    <Image src={product.thumnail} alt={product.name} width={500} height={411} />
                </div>
                <div>
                    <h4 className="text-stroke">{product.name}</h4>
                    <ul>
                        {product.size !== "별도 문의" &&  <li>{product.size}</li>}
                        {product.intro && product.intro.map(i => 
                            <li key={i}>{i}</li>
                        )}
                    </ul>
                </div>
            </div>
            <button>
                <Link href={`/${product.category}/${product.id}`}>자세히 보기</Link>
            </button>
        </section>
    )
}