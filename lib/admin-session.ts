// 관리자 로그인 세션을 서명된 토큰(HttpOnly 쿠키)으로 발급/검증한다.
// Edge 미들웨어에서도 동작해야 하므로 Node 전용 crypto 대신 Web Crypto(SubtleCrypto)를 사용한다.

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2시간

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

export async function createAdminSessionToken(): Promise<{ token: string; maxAgeSeconds: number }> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payloadBytes = new TextEncoder().encode(String(expiresAt));
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);

  const token = `${toBase64Url(payloadBytes.buffer as ArrayBuffer)}.${toBase64Url(signature)}`;
  return { token, maxAgeSeconds: Math.floor(SESSION_TTL_MS / 1000) };
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  try {
    const key = await getHmacKey();
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);

    const isSignatureValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      payloadBytes.buffer as ArrayBuffer
    );
    if (!isSignatureValid) return false;

    const expiresAt = Number(new TextDecoder().decode(payloadBytes));
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}
