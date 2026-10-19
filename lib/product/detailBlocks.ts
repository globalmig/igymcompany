// 상품 상세페이지 콘텐츠(텍스트/이미지)를 자유로운 순서로 저장하기 위한 유틸.
// DB 스키마 변경 없이, 기존 `detail` 컬럼(text[])에 블록을 JSON 문자열로 직렬화해 저장한다.
// 과거 데이터(순수 이미지 URL 배열 + `contents` 텍스트 배열)는 읽을 때 자동으로 블록 형태로 변환한다.

export type DetailBlock =
  | { type: "text"; text: string }
  | { type: "image"; url: string };

function tryParseBlock(entry: string): DetailBlock | null {
  if (!entry || entry[0] !== "{") return null;
  try {
    const parsed = JSON.parse(entry);
    if (parsed && parsed.type === "text" && typeof parsed.text === "string") {
      return { type: "text", text: parsed.text };
    }
    if (parsed && parsed.type === "image" && typeof parsed.url === "string") {
      return { type: "image", url: parsed.url };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * `detail`(신규 포맷이면 JSON 블록 문자열, 과거 포맷이면 순수 이미지 URL)과
 * 과거 `contents`(텍스트 배열)를 하나의 순서 있는 블록 배열로 합친다.
 * 이미 신규 포맷으로 저장된 데이터는 `contents`를 무시한다.
 */
export function parseDetailBlocks(
  rawDetail: string[] | null | undefined,
  legacyContents?: string[] | null
): DetailBlock[] {
  const detail = rawDetail ?? [];
  const blocks: DetailBlock[] = [];
  let hasLegacyEntry = false;

  for (const entry of detail) {
    const parsed = tryParseBlock(entry);
    if (parsed) {
      blocks.push(parsed);
    } else if (entry) {
      hasLegacyEntry = true;
      blocks.push({ type: "image", url: entry });
    }
  }

  if (hasLegacyEntry && legacyContents && legacyContents.length > 0) {
    const textBlocks: DetailBlock[] = legacyContents
      .filter((t) => t && t.trim())
      .map((t) => ({ type: "text", text: t }));
    return [...textBlocks, ...blocks];
  }

  return blocks;
}

export function serializeDetailBlocks(blocks: DetailBlock[]): string[] {
  return blocks.map((b) => JSON.stringify(b));
}

export function extractImageUrls(blocks: DetailBlock[]): string[] {
  return blocks
    .filter((b): b is Extract<DetailBlock, { type: "image" }> => b.type === "image")
    .map((b) => b.url);
}
