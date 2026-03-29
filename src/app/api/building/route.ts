import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";

const API_KEY = process.env.BUILDING_API_KEY ?? "";
const API_URL =
  "http://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sigunguCd = searchParams.get("sigunguCd");
  const bjdongCd = searchParams.get("bjdongCd");
  const bun = searchParams.get("bun");
  const ji = searchParams.get("ji");

  if (!sigunguCd || !bjdongCd || !bun || !ji) {
    return NextResponse.json(
      { error: "필수 파라미터가 누락되었습니다." },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const qs = new URLSearchParams({
      ServiceKey: API_KEY,
      sigunguCd,
      bjdongCd,
      bun,
      ji,
      _type: "json",
      numOfRows: "1",
      pageNo: "1",
    });

    const res = await fetch(`${API_URL}?${qs.toString()}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const text = await res.text();
    const data = JSON.parse(text);
    const items = data?.response?.body?.items?.item;
    const row = Array.isArray(items) ? items[0] : items;

    if (!row) {
      return NextResponse.json(
        { error: "건물 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const formatDate = (raw: string | undefined) => {
      if (!raw || raw.length !== 8) return null;
      return `${raw.substring(0, 4)}.${raw.substring(4, 6)}.${raw.substring(6, 8)}`;
    };

    return NextResponse.json({
      useAprDay: formatDate(row.useAprDay),
      groundFloors: row.grndFlrCnt ? Number(row.grndFlrCnt) : null,
      undergroundFloors: row.ugrndFlrCnt ? Number(row.ugrndFlrCnt) : null,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
