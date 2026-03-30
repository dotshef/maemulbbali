export function verificationEmailTemplate(
  code: string,
  purpose: "signup" | "reset-password" = "signup"
): string {
  const message =
    purpose === "reset-password"
      ? "비밀번호 재설정을 위해 인증코드를 입력해주세요 (5분 간 유효)"
      : "회원가입을 위해 인증코드를 입력해주세요 (5분 간 유효)";

  return `
    <div style="max-width:480px;margin:0 auto;padding:40px 24px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background-color:#f8f9fc;">
      <div style="background-color:#ffffff;border-radius:12px;padding:48px 32px;text-align:center;border:1px solid #d1d9e6;">
        <h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#1b2a4a;">매물빨리</h1>
        <p style="margin:0 0 10px;font-size:15px;color:#64748b;">${message}</p>
        <div style="padding:5px;font-size:30px;font-weight:700;letter-spacing:8px;text-align:center;">${code}</div>
      </div>
    </div>
  `;
}
