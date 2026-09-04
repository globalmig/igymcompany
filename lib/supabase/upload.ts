import { supabase } from "@/lib/supabase/client";

type UploadFolder = "thumnail" | "detail";

// 이미지 파일을 Vercel 서버리스 함수를 거치지 않고 Supabase Storage로 "직접" 업로드한다.
// (서명된 업로드 URL을 발급받아 브라우저 -> Supabase로 바로 전송)
export async function uploadProductImages(
  files: File[],
  folder: UploadFolder
): Promise<string[]> {
  if (files.length === 0) return [];

  const res = await fetch("/api/product/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: files.map((file) => ({ fileName: file.name, folder })),
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "업로드 URL 발급 실패");

  const { results } = result as { results: { path: string; token: string }[] };

  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { path, token } = results[i];

    const { error } = await supabase.storage
      .from("products")
      .uploadToSignedUrl(path, token, file, { contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from("products").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
