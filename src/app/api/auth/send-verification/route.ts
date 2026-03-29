import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { verificationEmailTemplate } from "@/lib/email-template/verification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
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

  // 6자리 코드 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5분

  // 기존 인증 코드 삭제 후 새로 저장
  await supabase.from("email_verifications").delete().eq("email", email);
  await supabase.from("email_verifications").insert({
    email,
    code,
    expires_at: expiresAt,
  });

  // 이메일 발송
  const { error } = await resend.emails.send({
    from: "매물빨리 <contact@dotshef.com>",
    to: [email],
    subject: "[매물빨리] 회원가입 이메일 인증코드",
    html: verificationEmailTemplate(code),
  });

  if (error) {
    return NextResponse.json({ error: "인증 메일 발송에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
