import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, code, purpose = "signup" } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "이메일과 인증코드를 입력해주세요." }, { status: 400 });
  }

  const { data: record } = await supabase
    .from("email_verifications")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("purpose", purpose)
    .single();

  if (!record) {
    return NextResponse.json({ error: "인증코드가 올바르지 않습니다." }, { status: 400 });
  }

  if (new Date(record.expires_at) < new Date()) {
    await supabase.from("email_verifications").delete().eq("email", email).eq("purpose", purpose);
    return NextResponse.json({ error: "인증코드가 만료되었습니다. 다시 발송해주세요." }, { status: 400 });
  }

  // 인증 성공 → verified 표시
  await supabase
    .from("email_verifications")
    .update({ verified: true })
    .eq("email", email)
    .eq("purpose", purpose);

  return NextResponse.json({ success: true });
}
