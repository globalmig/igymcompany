import Pagination from "@/components/Pagination";
import ProductList from "@/components/ProductList";

export default function ProductPage() {

    return (
        <article>
            <div>
                <ProductList dataPerPage={12}/>
            </div>
        </article>
    )
}
