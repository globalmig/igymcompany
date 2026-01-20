"use client";
import AuthForm from "@/components/admin/AuthForm";
import Pagination from "@/components/Pagination";
import ProductList from "@/components/admin/ProductList";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react"
import { usePathname } from "next/navigation";

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

export default function AdminPage() {

    const pathname = usePathname();
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;

    // /admin 벗어나면 인증 해제
    useEffect(()=> {
        return() => {
            if(!window.location.pathname.startsWith('/admin')){
                sessionStorage.removeItem("isAdminAuthenticated");
            }
        }
    },[pathname])

    useEffect(() => {
        const fetchProducts = async () => {
            let query = supabase.from("products").select("*").order("created_at", { ascending: false });
            if (category !== "all") query = query.eq("category", category);

            const { data, error } = await query;
            if (!error && data) {
                setProducts(data);
                setCurrentPage(1);
            }
        };
        fetchProducts();
    }, [category]);

    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const onChangeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    }

    return (
        <>
            {!isAuth ?
                <article className="admin">
                    <div>
                        <div>
                            <h2>관리자페이지</h2>
                        </div>
                        <div>
                            <AuthForm setIsAuth={setIsAuth} />
                        </div>
                    </div>
                </article>
                :
                <article className="admin-product-list">
                    <div>
                        <div>
                            <h2>상품 목록</h2>
                        </div>
                        <div>
                            <div>
                                <select id="category" name="category" onChange={onChangeCategory} value={category}>
                                    <option value="all">전체</option>
                                    <option value="truss">트러스/조립식무대</option>
                                    <option value="sound">음향시스템</option>
                                    <option value="airbounce">에어바운스</option>
                                    <option value="waterslide">워터슬라이드</option>
                                    <option value="rental">천막/테이블/의자/행사용품</option>
                                    <option value="amusement">놀이기구</option>
                                    <option value="experience">체험놀이</option>
                                </select>
                            </div>
                            <ProductList products={currentItems}/>
                        </div>
                        <div>
                            <button>
                                <Link href="/admin/upload">상품 등록</Link>
                            </button>
                        </div>
                        <Pagination
                            totalCount={products.length}
                            currentPage={currentPage}
                            dataPerPage={10}
                            onPageChange={(page) => setCurrentPage(page)} />
                    </div>
                </article>
            }
        </>
    )
}