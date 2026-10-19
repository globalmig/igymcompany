import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "행사 없음" }, { status: 404 });
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
      thumnail: thumnailUrl,
      existingDetail,
      detail: newDetailUrls,
      show_on_main,
    } = body as {
      name: string;
      category: string;
      thumnail: string;
      existingDetail: string[];
      detail: string[];
      show_on_main?: boolean;
    };

    // [기존 데이터 조회] 삭제된 파일 찾기 (Supabase Storage 업로드 이미지만 정리 대상)
    const { data: currentEvent } = await supabaseServer
      .from("events")
      .select("detail, thumnail")
      .eq("id", id)
      .single();
    const oldDetailUrls: string[] = currentEvent?.detail || [];

    const oldThumnailUrl = currentEvent?.thumnail;
    if (oldThumnailUrl && thumnailUrl && oldThumnailUrl !== thumnailUrl) {
      const oldPath = oldThumnailUrl.split("/public/products/")[1];
      if (oldPath) {
        await supabaseServer.storage.from("products").remove([oldPath]);
      }
    }

    const toDelete = (oldDetailUrls || []).filter(url => !(existingDetail ?? []).includes(url));
    for (const url of toDelete) {
      const path = url.split("/public/products/")[1];
      if (path) await supabaseServer.storage.from("products").remove([path]);
    }

    const finalDetail = [...(existingDetail ?? []), ...(newDetailUrls || [])];

    const { error: dbError } = await supabaseServer
      .from("events")
      .update({
        name,
        category,
        thumnail: thumnailUrl,
        detail: finalDetail,
        show_on_main: show_on_main ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "행사가 수정되었습니다." });
  } catch (err: any) {
    console.error("EVENT PATCH ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: event, error: fetchError } = await supabaseServer
      .from("events")
      .select("thumnail, detail")
      .eq("id", id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: "삭제할 행사를 찾을 수 없습니다." }, { status: 404 });
    }

    const pathsToDelete: string[] = [];

    if (event.thumnail) {
      const thumbPath = event.thumnail.split("/public/products/")[1];
      if (thumbPath) pathsToDelete.push(thumbPath);
    }

    if (event.detail && Array.isArray(event.detail)) {
      event.detail.forEach((url: string) => {
        const detailPath = url.split("/public/products/")[1];
        if (detailPath) pathsToDelete.push(detailPath);
      });
    }

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabaseServer.storage
        .from("products")
        .remove(pathsToDelete);

      if (storageError) {
        console.error("storage file delete error:", storageError.message);
      }
    }

    const { error: dbError } = await supabaseServer
      .from("events")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "행사가 삭제되었습니다." });

  } catch (err: any) {
    console.error("EVENT DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
