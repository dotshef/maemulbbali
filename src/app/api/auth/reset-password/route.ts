import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { resetPasswordValidation } from "@/lib/validation";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const { email, password, confirmPassword } = await request.json();

    const validationError =
      resetPasswordValidation.email(email) ||
      resetPasswordValidation.password(password) ||
      resetPasswordValidation.confirmPassword(password, confirmPassword);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // 이메일 인증 확인 (purpose = reset-password)
    const { data: verification } = await supabase
      .from("email_verifications")
      .select("verified")
      .eq("email", email)
      .eq("purpose", "reset-password")
      .single();

    if (!verification?.verified) {
      return NextResponse.json(
        { error: "이메일 인증을 먼저 완료해주세요." },
        { status: 400 }
      );
    }

    // 비밀번호 업데이트
    const passwordHash = await bcrypt.hash(password, 12);
    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        { error: "비밀번호 변경에 실패했습니다." },
        { status: 500 }
      );
    }

    // 기존 세션 무효화 (모든 refresh token 삭제)
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (user) {
      await supabase
        .from("refresh_tokens")
        .delete()
        .eq("user_id", user.id);
    }

    // 인증 레코드 정리
    await supabase
      .from("email_verifications")
      .delete()
      .eq("email", email)
      .eq("purpose", "reset-password");

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
