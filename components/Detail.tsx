"use client";
import { PRODUCT } from "@/data/product";
import Image from "next/image";
import Link from "next/link";
import { useParams} from "next/navigation";

export default function Detail() {

    const params = useParams();
    const {id, category} = params;
    const detail = id ?
        PRODUCT.find(p => String(p.id) === id) :
        PRODUCT.find(p => String(p.category) === category);

    if (!detail) {
        return <div className="loading">홈페이지를 불러오는 중입니다.</div>;
    }

    return (
        <article className="detail">
            <div>
                <div>
                    <div>
                        <Image src={detail.thumnail} alt={detail.name} width={1000} height={619} />
                    </div>
                    <h2>{detail.name}</h2>
                    <div>
                        <p><span>SIZE</span> {detail.size}</p>
                        <button><Link href="/inquire">문의하기</Link></button>
                    </div>
                    {detail.contents &&
                    <ul>
                        {detail.contents.map((c, index) => <li key={index}>{c}</li>)}
                    </ul>
                    }
                </div>
                <div>
                    {detail.detail.map((d, index)=>
                        <div key={index}>
                            <Image src={d} alt={detail.name} width={1000} height={619} />
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}