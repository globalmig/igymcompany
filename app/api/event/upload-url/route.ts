import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// 행사 이미지도 상품 이미지와 동일하게 Supabase Storage의 "products" 버킷을 사용하되,
// "events/" 하위 폴더에 저장해 상품 이미지와 구분한다.
// (클라이언트 -> Supabase 직접 업로드로 Vercel 함수의 요청 본문 크기 제한을 회피)
export async function POST(req: NextRequest) {
  try {
    const { files } = (await req.json()) as {
      files: { fileName: string; folder: "thumnail" | "detail" }[];
    };

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("업로드할 파일 정보가 없습니다.");
    }

    const results = await Promise.all(
      files.map(async ({ fileName, folder }) => {
        const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
        const path = `events/${folder}/${Date.now()}_${crypto.randomUUID()}.${ext}`;

        const { data, error } = await supabaseServer.storage
          .from("products")
          .createSignedUploadUrl(path);

        if (error) throw error;

        return { path, token: data.token };
      })
    );

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("EVENT UPLOAD URL ERROR", err);
    return NextResponse.json(
      { error: err.message || "업로드 URL 발급 실패" },
      { status: 500 }
    );
  }
}
