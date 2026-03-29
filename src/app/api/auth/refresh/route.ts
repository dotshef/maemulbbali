import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { signAccessToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return NextResponse.json({ error: "토큰이 없습니다." }, { status: 401 });
  }

  // DB에서 refresh token 조회
  const { data: record } = await supabase
    .from("refresh_tokens")
    .select("user_id, expires_at")
    .eq("token", refreshToken)
    .single();

  if (!record) {
    return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 });
  }

  if (new Date(record.expires_at) < new Date()) {
    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
    return NextResponse.json({ error: "토큰이 만료되었습니다." }, { status: 401 });
  }

  // 유저 정보 조회
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", record.user_id)
    .single();

  if (!user) {
    return NextResponse.json({ error: "유저를 찾을 수 없습니다." }, { status: 401 });
  }

  // 새 access token 발급
  const accessToken = signAccessToken({ id: user.id, email: user.email });

  return NextResponse.json({
    accessToken,
    id: user.id,
    email: user.email,
  });
}
