import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactEmailTemplate } from "@/lib/email-template/contact";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  }

  if (!email || !email.trim()) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  if (!message || message.trim().length < 10) {
    return NextResponse.json(
      { error: "내용을 10자 이상 입력해주세요." },
      { status: 400 }
    );
  }

  const { error } = await resend.emails.send({
    from: "닷셰프 <contact@dotshef.com>",
    to: ["contact@dotshef.com"],
    replyTo: `${name} <${email}>`,
    subject: "[매물빨리] 새로운 문의가 접수되었습니다",
    html: contactEmailTemplate(name, email, message),
  });

  if (error) {
    return NextResponse.json({ error: "전송에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
