export function otpEmailTemplate(code: string): string {
  return `
    <div style="max-width:480px;margin:0 auto;padding:40px 24px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background-color:#f8f9fc;">
      <div style="background-color:#ffffff;border-radius:12px;padding:48px 32px;text-align:center;border:1px solid #d1d9e6;">
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1b2a4a;">매물빨리</h1>
        <p style="margin:0 0 32px;font-size:15px;color:#64748b;">회원가입을 위해 인증코드를 입력해주세요</p>
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
          <tr>
            <td align="center" style="background-color:#ffffff;border-radius:8px;padding:16px 48px;font-size:32px;font-weight:700;letter-spacing:8px;color:#1b2a4a;">${code}</td>
          </tr>
        </table>
        <p style="margin:32px 0 0;font-size:13px;color:#64748b;">이 코드는 10분 후 만료됩니다.</p>
      </div>
    </div>
  `;
}
