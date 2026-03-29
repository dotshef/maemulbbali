import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { clearCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // DB에서 해당 refresh token 삭제
  if (refreshToken) {
    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
  }

  const response = NextResponse.json({ success: true });
  for (const cookie of clearCookies()) {
    response.cookies.set(cookie);
  }

  return response;
}
