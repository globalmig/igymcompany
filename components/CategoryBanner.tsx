'use client';
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CategoryBanner() {
    const pathname = usePathname(); // ex: /about
    const pathnameSplit = pathname.split('/').filter(Boolean);
    const category = CATEGORY_MAP[pathnameSplit[0]];

    return (
        <main>
            <div>
                <div>
                    <Image src={category.banner} alt={`${category.title} 이미지`} width={2560} height={600} priority quality={100}/>
                </div>
                <div>
                    <h1>{category.title}</h1>
                    {category.title === "문의하기" &&
                        <p>(주)에스원이벤트 문의사항은<br />아래의 폼을 작성해주세요.<br />최종 확정 문자를 받으셔야 예약 완료되십니다.</p>
                    }
                </div>
            </div>
        </main>
    )
}