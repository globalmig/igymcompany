import ProductForm from "@/components/admin/products/ProductForm";

export default function ProductUploadPage () {
    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6 xl:max-w-325 xl:mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">제품 등록</h2>
            </div>
            <ProductForm mode="upload"/>
        </div>
    )
}
