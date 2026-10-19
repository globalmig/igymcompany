import type { Metadata } from "next";
import Pagination from "@/components/Pagination";
import ProductList from "@/components/ProductList";
import { CATEGORY_MAP } from "@/data/category";

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_MAP[category];

  if (!info) {
    return {
      title: "에스원이벤트",
    };
  }

  const title = `${info.title} | 에스원이벤트`;
  const description = `에스원이벤트의 ${info.title} 상품을 확인해보세요. 행사 규모와 목적에 맞는 최적의 상품을 대여 및 설치해드립니다.`;

  return {
    title,
    description,
    keywords: [info.title, "에스원이벤트", "행사대여", "행사기획", "행사대행"],
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.s-one-event.co.kr/${category}`,
      images: [
        {
          url: "https://www.s-one-event.co.kr/images/og_image.jpg",
          width: 1200,
          height: 630,
          alt: info.title,
        },
      ],
    },
  };
}

export default function ProductPage() {

    return (
        <article>
            <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
                <ProductList dataPerPage={12}/>
            </div>
        </article>
    )
}
