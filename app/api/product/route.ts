import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { DetailBlock, extractImageUrls, serializeDetailBlocks } from "@/lib/product/detailBlocks";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, category, intro, size, thumnail, detail, show_on_main } = body as {
      name: string;
      category: string;
      intro?: string;
      size?: string;
      thumnail: string;
      detail: DetailBlock[];
      show_on_main?: boolean;
    };

    if (!thumnail) throw new Error("썸네일 없음");
    if (!Array.isArray(detail) || extractImageUrls(detail).length === 0) {
      throw new Error("상세 이미지 없음");
    }

    /* ---------- 기존 상품들의 정렬 순서를 한 칸씩 밀기 ---------- */
    // sort_order가 null인 상품은 정렬 시 항상 맨 뒤로 밀리므로(nullsFirst:false),
    // 새 상품도 sort_order=0으로 지정해 첫 페이지 첫 순서에 노출되도록 한다.
    const { data: existing, error: fetchError } = await supabaseServer
      .from("products")
      .select("id, sort_order")
      .not("sort_order", "is", null);

    if (fetchError) throw fetchError;

    if (existing && existing.length > 0) {
      const results = await Promise.all(
        existing.map((p) =>
          supabaseServer.from("products").update({ sort_order: (p.sort_order ?? 0) + 1 }).eq("id", p.id)
        )
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    }

    /* ---------- DB 저장 ---------- */
    const { error: dbError } = await supabaseServer.from("products").insert({
      name,
      category,
      intro,
      contents: [],
      size,
      thumnail,
      detail: serializeDetailBlocks(detail),
      show_on_main: show_on_main ?? false,
      sort_order: 0,
    });

    if (dbError) throw dbError;

    return NextResponse.json({ message: "상품이 등록되었습니다." });

  } catch (err: any) {
    console.error("PRODUCT POST ERROR", err);
    return NextResponse.json(
      { error: err.message || "상품 등록 실패" },
      { status: 500 }
    );
  }
}
