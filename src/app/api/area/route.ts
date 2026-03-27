import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.BUILDING_API_KEY ?? "";
const API_URL =
  "http://apis.data.go.kr/1613000/BldRgstHubService/getBrExposPubuseAreaInfo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawRow = Record<string, any>;

async function fetchRows(
  params: Record<string, string>
): Promise<RawRow[]> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${API_URL}?${qs.toString()}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const text = await res.text();
  const data = JSON.parse(text);
  const items = data?.response?.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sigunguCd = searchParams.get("sigunguCd");
  const bjdongCd = searchParams.get("bjdongCd");
  const bun = searchParams.get("bun");
  const ji = searchParams.get("ji");
  const dongRaw = searchParams.get("dong") ?? "";
  const dong = dongRaw.replace(/동$/, "").trim();
  const ho = searchParams.get("ho") ?? "";

  if (!sigunguCd || !bjdongCd || !bun || !ji || !ho) {
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
    const base: Record<string, string> = {
      ServiceKey: API_KEY,
      sigunguCd,
      bjdongCd,
      bun,
      ji,
      _type: "json",
      numOfRows: "100",
      pageNo: "1",
    };

    // hoNm 저장 형식이 건물마다 다르므로 순차적으로 시도
    // 예: "408호", "408", "102동720호" 등
    const attempts: Record<string, string>[] = [];

    // 1차: 표준 분리형 (dongNm=101, hoNm=408호)
    attempts.push({
      ...base,
      ...(dong ? { dongNm: dong } : {}),
      hoNm: `${ho}호`,
    });

    // 2차: "호" 없이 숫자만 (hoNm=408)
    attempts.push({
      ...base,
      ...(dong ? { dongNm: dong } : {}),
      hoNm: ho,
    });

    // 3차: 동+호 합쳐진 형태 (hoNm=102동720호)
    if (dong) {
      attempts.push({
        ...base,
        hoNm: `${dong}동${ho}호`,
      });

      // 4차: 동+호 합쳐진 형태, "호" 없이 (hoNm=102동720)
      attempts.push({
        ...base,
        hoNm: `${dong}동${ho}`,
      });
    }

    let rows: RawRow[] = [];
    for (const params of attempts) {
      rows = await fetchRows(params);
      if (rows.length > 0) break;
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "해당 동/호를 찾을 수 없습니다. 입력값을 확인해주세요." },
        { status: 404 }
      );
    }

    // 면적 합산 — exposPubuseGbCdNm: "전유" / "공용"
    let exclusiveArea = 0;
    let commonArea = 0;

    for (const row of rows) {
      const area = Number(row.area ?? 0);
      const kind = String(row.exposPubuseGbCdNm ?? "");

      if (kind.includes("전유")) {
        exclusiveArea += area;
      } else if (kind.includes("공용")) {
        commonArea += area;
      }
    }

    const supplyArea = exclusiveArea + commonArea;
    const toPyeong = (m2: number) =>
      Math.round((m2 / 3.306) * 100) / 100;

    console.log("[area] 매칭된 rows:", rows.map(r => ({
      hoNm: r.hoNm,
      dongNm: r.dongNm,
      exposPubuseGbCdNm: r.exposPubuseGbCdNm,
      area: r.area,
      regstrKindCdNm: r.regstrKindCdNm,
      mainPurpsCdNm: r.mainPurpsCdNm,
      etcPurps: r.etcPurps,
    })));
    console.log("[area] 면적 결과:", { exclusiveArea, commonArea, supplyArea });

    return NextResponse.json({
      dong: dong || null,
      ho,
      exclusiveArea: Math.round(exclusiveArea * 100) / 100,
      exclusiveAreaPy: toPyeong(exclusiveArea),
      commonArea: Math.round(commonArea * 100) / 100,
      commonAreaPy: toPyeong(commonArea),
      supplyArea: Math.round(supplyArea * 100) / 100,
      supplyAreaPy: toPyeong(supplyArea),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return NextResponse.json(
        { error: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
