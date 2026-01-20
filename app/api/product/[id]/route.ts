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
    const formData = await req.formData();
    const { id } = await params;

    // [기존 데이터 조회] 삭제된 파일 찾기
    const { data: currentProduct } = await supabaseServer
      .from("products")
      .select("detail, thumnail")
      .eq("id", id)
      .single();
    const oldDetailUrls: string[] = currentProduct?.detail || [];

    // 1. 썸네일 처리
    let thumnailUrl = formData.get("thumnail"); // 클라이언트가 보낸 값 (파일 혹은 기존 URL)
    const thumnailFile = formData.get("thumnail") as File | null;

    // [추가] 새 파일 추가한 경우, 기존 썸네일은 스토리지에서 삭제
    if (thumnailFile instanceof File && thumnailFile.size > 0) {

      // A. 기존 썸네일 URL: 스토리지에서 삭제
      // currentProduct: 이전의 select("thumnail")로 가져온 기존 DB
      const oldThumnailUrl = currentProduct?.thumnail;
      if (oldThumnailUrl) {
        // URL에서 스토리지 경로(path) 추출 (예: products/thumnail/...)
        const oldPath = oldThumnailUrl.split("/public/products/")[1];
        if (oldPath) {
          await supabaseServer.storage.from("products").remove([oldPath]);
        }
      }

      // B. 새 썸네일 파일 업로드
      const buffer = await thumnailFile.arrayBuffer();
      const ext = thumnailFile.name.split(".").pop();
      const newPath = `products/thumnail/${Date.now()}_${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseServer.storage
        .from("products")
        .upload(newPath, buffer, {
          contentType: thumnailFile.type,
          upsert: true
        });

      if (uploadError) {
        console.error("썸네일 업로드 에러:", uploadError);
        throw new Error("썸네일 업로드에 실패했습니다.");
      }

      // C. 새 URL 발급
      const { data: urlData } = supabaseServer.storage
        .from("products")
        .getPublicUrl(newPath);

      thumnailUrl = urlData.publicUrl;
    }

    // 2. 상세 이미지 처리
    const existingDetail: string[] = JSON.parse(formData.get("existingDetail") as string || "[]");

    // [삭제] 기존에 있었지만 existingDetail에 없는 파일은 스토리지에서 삭제
    const toDelete = oldDetailUrls.filter(url => !existingDetail.includes(url));
    for (const url of toDelete) {
      const path = url.split("/public/products/")[1];
      if (path) await supabaseServer.storage.from("products").remove([path]);
    }

    // [추가] 새로 넘어온 파일들 업로드
    const detailFiles = formData.getAll("detail").filter(f => f instanceof File) as File[];
    const newUrls: string[] = [];

    for (const file of detailFiles) {
      const path = `products/detail/${Date.now()}_${crypto.randomUUID()}`;
      const { error: err } = await supabaseServer.storage
        .from("products")
        .upload(path, await file.arrayBuffer(), { contentType: file.type });

      if (!err) {
        newUrls.push(supabaseServer.storage.from("products").getPublicUrl(path).data.publicUrl);
      } else {
        console.error("파일 업로드 오류:", err.message);
      }
    }

    const finalDetail = [...existingDetail, ...newUrls];

    // 3. DB 업데이트
    const { error: dbError } = await supabaseServer
      .from("products")
      .update({
        name: formData.get("name"),
        category: formData.get("category"),
        intro: formData.get("intro"),
        size: formData.get("size"),
        contents: JSON.parse(formData.get("contents") as string || "[]"),
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