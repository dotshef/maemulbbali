import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface SessionUser {
  id: string;
  email: string;
}

function verifyAccessToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionUser;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let user = accessToken ? verifyAccessToken(accessToken) : null;

  // access token 만료 + refresh token 존재 → 갱신 시도
  if (!user && refreshToken) {
    try {
      const res = await fetch(new URL("/api/auth/refresh", request.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        user = { id: data.id, email: data.email };

        // 새 쿠키 설정
        const response = isAuthPage
          ? NextResponse.redirect(new URL("/area", request.url))
          : NextResponse.next();

        response.cookies.set({
          name: "access_token",
          value: data.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        return response;
      }
    } catch {
      // refresh 실패 → 로그인으로
    }
  }

  // 미인증 + 보호된 페이지 → 로그인으로
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 인증 + 홈 또는 로그인/회원가입 페이지 → /area로
  if (user && (isAuthPage || pathname === "/")) {
    return NextResponse.redirect(new URL("/area", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|data/|api/).*)",
  ],
};
