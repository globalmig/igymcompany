import type { Metadata } from "next";
import Detail from "@/components/Detail";
import { supabaseServer } from "@/lib/supabase/server";
import { CATEGORY_MAP } from "@/data/category";

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; id: string }> }
): Promise<Metadata> {
  const { category, id } = await params;

  const { data: product } = await supabaseServer
    .from("products")
    .select("name, intro")
    .eq("id", id)
    .maybeSingle();

  const categoryTitle = CATEGORY_MAP[category]?.title ?? "";

  if (!product) {
    return {
      title: `${categoryTitle ? categoryTitle + " | " : ""}에스원이벤트`,
    };
  }

  const title = `${product.name} | ${categoryTitle} - 에스원이벤트`;
  const description = product.intro || `에스원이벤트가 제공하는 ${categoryTitle} 상품, ${product.name}을(를) 소개합니다.`;

  return {
    title,
    description,
    keywords: [product.name, categoryTitle, "에스원이벤트", "행사대여", "행사기획"],
    alternates: {
      canonical: `/${category}/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.s-one-event.co.kr/${category}/${id}`,
      images: [
        {
          url: "https://www.s-one-event.co.kr/images/og_image.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default function DetailPage() {
    return (
            <Detail />
    )
}
