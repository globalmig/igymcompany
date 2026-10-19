import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, category, thumnail, detail, show_on_main } = body as {
      name: string;
      category: string;
      thumnail: string;
      detail: string[];
      show_on_main?: boolean;
    };

    if (!name) throw new Error("행사명 없음");
    if (!category) throw new Error("카테고리 없음");
    if (!thumnail) throw new Error("썸네일 없음");

    /* ---------- 기존 행사들의 정렬 순서를 한 칸씩 밀기 ---------- */
    // sort_order가 null인 행사는 정렬 시 항상 맨 뒤로 밀리므로(nullsFirst:false),
    // 새 행사도 sort_order=0으로 지정해 첫 페이지 첫 순서에 노출되도록 한다.
    const { data: existing, error: fetchError } = await supabaseServer
      .from("events")
      .select("id, sort_order")
      .not("sort_order", "is", null);

    if (fetchError) throw fetchError;

    if (existing && existing.length > 0) {
      const results = await Promise.all(
        existing.map((e) =>
          supabaseServer.from("events").update({ sort_order: (e.sort_order ?? 0) + 1 }).eq("id", e.id)
        )
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    }

    const { error: dbError } = await supabaseServer.from("events").insert({
      name,
      category,
      thumnail,
      detail: detail ?? [],
      show_on_main: show_on_main ?? false,
      sort_order: 0,
    });

    if (dbError) throw dbError;

    return NextResponse.json({ message: "행사가 등록되었습니다." });

  } catch (err: any) {
    console.error("EVENT POST ERROR", err);
    return NextResponse.json(
      { error: err.message || "행사 등록 실패" },
      { status: 500 }
    );
  }
}
