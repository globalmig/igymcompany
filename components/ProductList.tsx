"use client";
import { PRODUCT } from "@/data/product";
import ProductItem from "./ProductItem";
import { useParams } from "next/navigation";

interface ProductListProps {
    preview? : string,
}

export default function ProductList({ preview }: ProductListProps) {

    const params = useParams();
    const {category} = params
    const product = category ?
        PRODUCT.filter(p => p.category === category) :
        PRODUCT.filter(p => p.category === preview).slice(0,4);
    const isPreview = category ? true : false;

    return (
        <div className="display-flex-flow">
            {product.map(p => <ProductItem key={p.id} product={p} isPreview={isPreview}/>)}
        </div>
    )
}