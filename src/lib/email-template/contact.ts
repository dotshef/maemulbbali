export function contactEmailTemplate(name: string, email: string, message: string): string {
  const escapedMessage = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");

  return `
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background-color:#f8f9fc;">
      <div style="background-color:#ffffff;border-radius:12px;padding:48px 32px;border:1px solid #d1d9e6;">
        <h1 style="margin:0 0 32px;font-size:20px;font-weight:700;color:#1b2a4a;text-align:center;">새로운 문의가 접수되었습니다</h1>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:80px;vertical-align:top;border-bottom:1px solid #e8ecf4;">이름</td>
            <td style="padding:12px 16px;font-size:15px;color:#1a1a2e;border-bottom:1px solid #e8ecf4;">${name}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:80px;vertical-align:top;border-bottom:1px solid #e8ecf4;">이메일</td>
            <td style="padding:12px 16px;font-size:15px;color:#1a1a2e;border-bottom:1px solid #e8ecf4;">${email}</td>
          </tr>
        </table>
        <div style="background-color:#f8f9fc;border-radius:8px;padding:20px 24px;border:1px solid #e8ecf4;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;">문의 내용</p>
          <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.7;">${escapedMessage}</p>
        </div>
      </div>
    </div>
  `;
}
