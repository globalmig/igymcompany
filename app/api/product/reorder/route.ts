import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const { ids } = await req.json() as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("정렬할 상품 목록이 없습니다.");
    }

    const results = await Promise.all(
      ids.map((id, index) =>
        supabaseServer.from("products").update({ sort_order: index }).eq("id", id)
      )
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;

    return NextResponse.json({ message: "정렬 순서가 저장되었습니다." });
  } catch (err) {
    console.error("PRODUCT REORDER ERROR", err);
    const message = err instanceof Error ? err.message : "정렬 저장 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
