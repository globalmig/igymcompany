import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminSessionToken(token);

  // 상품/행사 등록/수정/삭제/업로드-URL 발급: 로그인된 세션 없이는 호출 불가
  if (pathname.startsWith("/api/product") || pathname.startsWith("/api/event")) {
    if (req.method === "GET" || req.method === "HEAD") {
      return NextResponse.next();
    }
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "인증이 필요합니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 관리자 페이지: 로그인 화면(/admin) 자체는 항상 노출, 나머지는 세션 검증
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/product/:path*", "/api/event/:path*"],
};
