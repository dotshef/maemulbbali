import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  // 이메일 인증 확인
  const { data: verification } = await supabase
    .from("email_verifications")
    .select("verified")
    .eq("email", email)
    .single();

  if (!verification?.verified) {
    return NextResponse.json({ error: "이메일 인증을 먼저 완료해주세요." }, { status: 400 });
  }

  // 이미 가입된 이메일 확인
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
  }

  // 유저 생성
  const passwordHash = await bcrypt.hash(password, 12);
  const { data: user, error } = await supabase
    .from("users")
    .insert({ email, password_hash: passwordHash })
    .select("id, email")
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }

  // 인증 기록 삭제
  await supabase.from("email_verifications").delete().eq("email", email);

  // 세션 쿠키 설정
  const token = signToken({ id: user.id, email: user.email });
  const cookie = sessionCookieOptions(token);
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookie);

  return response;
}
