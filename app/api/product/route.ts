import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, category, intro, size, contents, thumnail, detail } = body as {
      name: string;
      category: string;
      intro?: string;
      size?: string;
      contents: string[];
      thumnail: string;
      detail: string[];
    };

    if (!thumnail) throw new Error("썸네일 없음");
    if (!Array.isArray(detail) || detail.length === 0) throw new Error("상세 이미지 없음");

    /* ---------- DB 저장 ---------- */
    const { error: dbError } = await supabaseServer.from("products").insert({
      name,
      category,
      intro,
      contents,
      size,
      thumnail,
      detail,
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
