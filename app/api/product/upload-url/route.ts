import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// 클라이언트가 Supabase Storage에 "직접" 업로드할 수 있도록 서명된 업로드 URL을 발급한다.
// Vercel 서버리스 함수는 요청 본문 크기(4.5MB)에 제한이 있어, 큰 이미지 파일을
// API 라우트를 거쳐 업로드하면 413(Request Entity Too Large)이 발생한다.
// 파일 바이너리는 Supabase로 직접 전송하고, 이 라우트는 짧은 JSON만 주고받는다.
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
        const path = `products/${folder}/${Date.now()}_${crypto.randomUUID()}.${ext}`;

        const { data, error } = await supabaseServer.storage
          .from("products")
          .createSignedUploadUrl(path);

        if (error) throw error;

        return { path, token: data.token };
      })
    );

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("UPLOAD URL ERROR", err);
    return NextResponse.json(
      { error: err.message || "업로드 URL 발급 실패" },
      { status: 500 }
    );
  }
}
