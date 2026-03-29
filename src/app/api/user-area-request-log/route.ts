import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sigunguCd, bjdongCd, bun, ji, dong, ho } = body;

  if (!sigunguCd || !bjdongCd || !bun || !ji || !ho) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await supabase.from("user_area_request_log").insert({
    user_id: user.id,
    sigungu_cd: sigunguCd,
    bjdong_cd: bjdongCd,
    bun,
    ji,
    dong: dong || null,
    ho,
  });

  if (error) {
    console.error("[user-area-request-log] insert error:", error);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
