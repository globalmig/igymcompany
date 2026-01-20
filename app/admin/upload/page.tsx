import ProductForm from "@/components/admin/ProductForm";

export default function ProductUploadPage () {
    return (
        <article className="admin-product-form">
            <div>
                <div>
                    <h2>상품 등록</h2>
                </div>
                <div>
                    <ProductForm mode="upload"/>
                </div>
            </div>
        </article>
    )
}