"use client";
import { PRODUCT } from "@/data/product";
import ProductItem from "./ProductItem";
import { useParams } from "next/navigation";

export default function ProductList() {

    const params = useParams();
    const {category} = params
    const product = PRODUCT.filter(p => p.category === category)

    return (
        <div className="display-flex-flow">
            {product.map(p => <ProductItem key={p.id} product={p}/>)}
        </div>
    )
}