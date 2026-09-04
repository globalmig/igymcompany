import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "상품 없음" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const {
      name,
      category,
      intro,
      size,
      contents,
      thumnail: thumnailUrl,
      existingDetail,
      detail: newDetailUrls,
    } = body as {
      name: string;
      category: string;
      intro?: string;
      size?: string;
      contents: string[];
      thumnail: string;
      existingDetail: string[];
      detail: string[];
    };

    // [기존 데이터 조회] 삭제된 파일 찾기
    const { data: currentProduct } = await supabaseServer
      .from("products")
      .select("detail, thumnail")
      .eq("id", id)
      .single();
    const oldDetailUrls: string[] = currentProduct?.detail || [];

    // 1. 썸네일: 새 이미지로 교체된 경우(클라이언트가 이미 업로드 완료) 기존 파일만 스토리지에서 정리
    const oldThumnailUrl = currentProduct?.thumnail;
    if (oldThumnailUrl && thumnailUrl && oldThumnailUrl !== thumnailUrl) {
      const oldPath = oldThumnailUrl.split("/public/products/")[1];
      if (oldPath) {
        await supabaseServer.storage.from("products").remove([oldPath]);
      }
    }

    // 2. 상세 이미지 처리 (새 파일은 클라이언트가 이미 업로드 완료, URL만 전달됨)
    // [삭제] 기존에 있었지만 existingDetail에 없는 파일은 스토리지에서 삭제
    const toDelete = oldDetailUrls.filter(url => !existingDetail.includes(url));
    for (const url of toDelete) {
      const path = url.split("/public/products/")[1];
      if (path) await supabaseServer.storage.from("products").remove([path]);
    }

    const finalDetail = [...existingDetail, ...(newDetailUrls || [])];

    // 3. DB 업데이트
    const { error: dbError } = await supabaseServer
      .from("products")
      .update({
        name,
        category,
        intro,
        size,
        contents,
        thumnail: thumnailUrl,
        detail: finalDetail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "상품이 수정되었습니다." });
  } catch (err: any) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 해당 상품의 이미지 URL 정보 조회
    const { data: product, error: fetchError } = await supabaseServer
      .from("products")
      .select("thumnail, detail")
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: "삭제할 상품을 찾을 수 없습니다." }, { status: 404 });
    }

    // 삭제할 파일 경로 리스트 생성
    const pathsToDelete: string[] = [];

    // 썸네일 경로 추출
    if (product.thumnail) {
      const thumbPath = product.thumnail.split("/public/products/")[1];
      if (thumbPath) pathsToDelete.push(thumbPath);
    }

    // 상세 이미지 경로 추출
    if (product.detail && Array.isArray(product.detail)) {
      product.detail.forEach((url: string) => {
        const detailPath = url.split("/public/products/")[1];
        if (detailPath) pathsToDelete.push(detailPath);
      });
    }

    // 3. 스토리지에서 파일 삭제 (파일이 있을 때만 실행)
    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabaseServer.storage
        .from("products")
        .remove(pathsToDelete);

      if (storageError) {
        console.error("storage file delete error:", storageError.message);
      }
    }

    // 4. DB 삭제
    const { error: dbError } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "상품이 삭제되었습니다." });

  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}