import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { issueTokensAndSetCookies } from "@/lib/auth";
import { signupValidation } from "@/lib/validation";

export async function POST(request: Request) {
  const { email, password, company_name } = await request.json();

  const emailErr = signupValidation.email(email);
  const pwErr = signupValidation.password(password);
  const companyErr = signupValidation.companyName(company_name);
  const validationError = emailErr || pwErr || companyErr;

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
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
    .insert({ email, password_hash: passwordHash, company_name: company_name.trim() })
    .select("id, email")
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  const { setCookies } = await issueTokensAndSetCookies(user.id, user.email, supabase);
  setCookies(response);

  return response;
}
