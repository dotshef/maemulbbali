import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface SessionUser {
  id: string;
  email: string;
}

// --- Access Token (1일) ---

export function signAccessToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyAccessToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

// --- Refresh Token (30일) ---

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function refreshTokenExpiresAt(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

// --- Session helper (Server Component용) ---

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

// --- Cookie options ---

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function accessTokenCookie(token: string) {
  return {
    ...cookieBase,
    name: "access_token",
    value: token,
    maxAge: 60 * 60 * 24, // 1일
  };
}

export function refreshTokenCookie(token: string) {
  return {
    ...cookieBase,
    name: "refresh_token",
    value: token,
    maxAge: 60 * 60 * 24 * 30, // 30일
  };
}

// --- 토큰 발급 + 쿠키 세팅 (login/signup 공통) ---

export async function issueTokensAndSetCookies(
  userId: string,
  email: string,
  supabase: { from: (table: string) => { insert: (data: Record<string, unknown>) => unknown } }
): Promise<{ accessToken: string; refreshToken: string; setCookies: (res: import("next/server").NextResponse) => void }> {
  const accessToken = signAccessToken({ id: userId, email });
  const refreshToken = generateRefreshToken();
  const expiresAt = refreshTokenExpiresAt();

  await supabase.from("refresh_tokens").insert({
    user_id: userId,
    token: refreshToken,
    expires_at: expiresAt.toISOString(),
  });

  return {
    accessToken,
    refreshToken,
    setCookies: (res) => {
      res.cookies.set(accessTokenCookie(accessToken));
      res.cookies.set(refreshTokenCookie(refreshToken));
    },
  };
}

export function clearCookies() {
  return [
    { ...cookieBase, name: "access_token", value: "", maxAge: 0 },
    { ...cookieBase, name: "refresh_token", value: "", maxAge: 0 },
  ];
}
