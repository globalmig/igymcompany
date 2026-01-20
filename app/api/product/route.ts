import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const intro = formData.get("intro") as string;
    const size = formData.get("size") as string;

    const contentsRaw = formData.get("contents");
    if (!contentsRaw) throw new Error("contents 없음");
    const contents = JSON.parse(contentsRaw as string);

    const thumnail = formData.get("thumnail") as File | null;
    if (!thumnail) throw new Error("썸네일 없음");

    const detailFiles = formData.getAll("detail") as File[];
    if (detailFiles.length === 0) throw new Error("상세 이미지 없음");

    /* ---------- 썸네일 업로드 ---------- */
    function safeFileName(originalName: string) {
      const ext = originalName.split(".").pop();
      return `${Date.now()}_${crypto.randomUUID()}.${ext}`;
    }

    const thumnailBuffer = await thumnail.arrayBuffer();
    const safeName = safeFileName(thumnail.name);
    const thumnailPath = `products/thumnail/${safeName}`;

    const { error: thumError } = await supabaseServer.storage
      .from("products")
      .upload(thumnailPath, thumnailBuffer, {
        contentType: thumnail.type,
      });

    if (thumError) throw thumError;

    const { data: thumUrl } = supabaseServer.storage
      .from("products")
      .getPublicUrl(thumnailPath);

    /* ---------- 상세 이미지 업로드 ---------- */
    const detailUrls: string[] = [];

    for (const file of detailFiles) {
      const buffer = await file.arrayBuffer();
      const safeName = safeFileName(file.name);
      const path = `products/detail/${safeName}`;

      const { error } = await supabaseServer.storage
        .from("products")
        .upload(path, buffer, { contentType: file.type });

      if (error) throw error;

      const { data } = supabaseServer.storage
        .from("products")
        .getPublicUrl(path);

      detailUrls.push(data.publicUrl);
    }

    /* ---------- DB 저장 ---------- */
    const { error: dbError } = await supabaseServer.from("products").insert({
      name,
      category,
      intro,
      contents,
      size,
      thumnail: thumUrl.publicUrl,
      detail: detailUrls,
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
