import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_bookmarks")
    .select("id, jibun_address, road_address, building_name, sigungu_cd, bjdong_cd, bun, ji")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[bookmarks] select error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }

  const bookmarks = data.map((row) => ({
    id: row.id,
    jibunAddress: row.jibun_address,
    roadAddress: row.road_address,
    buildingName: row.building_name,
    sigunguCd: row.sigungu_cd,
    bjdongCd: row.bjdong_cd,
    bun: row.bun,
    ji: row.ji,
  }));

  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { jibunAddress, roadAddress, buildingName, sigunguCd, bjdongCd, bun, ji } = body;

  if (!jibunAddress || !roadAddress || !sigunguCd || !bjdongCd || !bun || !ji) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_bookmarks")
    .insert({
      user_id: user.id,
      jibun_address: jibunAddress,
      road_address: roadAddress,
      building_name: buildingName || null,
      sigungu_cd: sigunguCd,
      bjdong_cd: bjdongCd,
      bun,
      ji,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "이미 북마크에 추가된 주소입니다." }, { status: 409 });
    }
    console.error("[bookmarks] insert error:", error);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, bookmark: { id: data.id } });
}
