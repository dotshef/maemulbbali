"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressInfo {
  jibunAddress: string;
  buildingName: string;
  sigunguCd: string;
  bjdongCd: string;
  bun: string;
  ji: string;
}

interface AreaResult {
  dong: string | null;
  ho: string;
  exclusiveArea: number;
  exclusiveAreaPy: number;
  commonArea: number;
  commonAreaPy: number;
  supplyArea: number;
  supplyAreaPy: number;
}

/**
 * buildingCode (25자리) 구조:
 * 시군구(5) + 법정동(5) + 대지구분(1) + 번(4) + 지(4) + 건물일련번호(6)
 */
function parseBuildingCode(buildingCode: string) {
  return {
    sigunguCd: buildingCode.substring(0, 5),
    bjdongCd: buildingCode.substring(5, 10),
    bun: buildingCode.substring(11, 15),
    ji: buildingCode.substring(15, 19),
  };
}

export default function Home() {
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState<AreaResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  /**
   * 상세주소 파싱: "101동 1310호" → dong=101, ho=1310
   * "1310호" or "1310" → dong="", ho=1310
   * "101-1310" → dong=101, ho=1310
   */
  function parseDetail(input: string) {
    const s = input.trim().replace(/\s+/g, " ");

    // "101동 1310호" or "101동 1310"
    const dongHoMatch = s.match(/^(\d+)동\s*(\d+)호?$/);
    if (dongHoMatch) return { dong: dongHoMatch[1], ho: dongHoMatch[2] };

    // "101-1310"
    const dashMatch = s.match(/^(\d+)-(\d+)$/);
    if (dashMatch) return { dong: dashMatch[1], ho: dashMatch[2] };

    // "1310호" or "1310"
    const hoOnly = s.match(/^(\d+)호?$/);
    if (hoOnly) return { dong: "", ho: hoOnly[1] };

    return null;
  }

  const handleSearch = () => {
    new daum.Postcode({
      oncomplete(data: DaumPostcodeData) {
        const { sigunguCd, bjdongCd, bun, ji } = parseBuildingCode(data.buildingCode);

        setAddress({
          jibunAddress: data.jibunAddress || data.address,
          buildingName: data.buildingName,
          sigunguCd,
          bjdongCd,
          bun,
          ji,
        });
        setResult(null);
        setError("");
      },
    }).open();
  };

  const handleQuery = async () => {
    if (!address) {
      setError("주소를 먼저 검색해주세요.");
      return;
    }
    const parsed = parseDetail(detail);
    if (!parsed || !parsed.ho) {
      setError("상세주소를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const params = new URLSearchParams({
        sigunguCd: address.sigunguCd,
        bjdongCd: address.bjdongCd,
        bun: address.bun,
        ji: address.ji,
        ho: parsed.ho,
      });
      if (parsed.dong) params.set("dong", parsed.dong);

      const res = await fetch(`/api/area?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "조회 중 오류가 발생했습니다.");
        return;
      }

      setResult(data);
    } catch {
      setError("조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyValue = async (value: number, field: string) => {
    await navigator.clipboard.writeText(String(value));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-primary text-center">
          건축물대장 면적 조회
        </h1>

        {/* 주소 검색 */}
        <Card>
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-base">주소</Label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-md border bg-muted px-3 py-2 text-base min-h-10">
                  {address ? (
                    <p>
                      {address.jibunAddress}
                      {address.buildingName && ` (${address.buildingName})`}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">주소를 검색해주세요</p>
                  )}
                </div>
                <Button onClick={handleSearch} className="text-base shrink-0 cursor-pointer rounded-md h-auto">
                  검색
                </Button>
              </div>
            </div>

            {/* 상세주소 입력 */}
            <div className="flex flex-col gap-2">
              <Label className="text-base">상세주소</Label>
              <Input
                placeholder=""
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="text-base min-h-10 py-2"
              />
            </div>

            {/* 조회 버튼 */}
            <Button
              onClick={handleQuery}
              disabled={loading}
              className="w-full text-lg py-6 cursor-pointer"
            >
              {loading ? "조회 중..." : "면적 조회"}
            </Button>
          </CardContent>
        </Card>

        {/* 에러 */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-base text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 결과 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">조회 결과</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-base">
                  <tbody>
                    {[
                      { label: "전용면적", m2: result.exclusiveArea, py: result.exclusiveAreaPy, key: "exclusive", bold: false },
                      { label: "공용면적", m2: result.commonArea, py: result.commonAreaPy, key: "common", bold: false },
                      { label: "계약면적", m2: result.supplyArea, py: result.supplyAreaPy, key: "supply", bold: true },
                    ].map((item, i, arr) => (
                      <tr key={item.key} className={i < arr.length - 1 ? "border-b" : ""}>
                        <td className={`px-4 py-3 bg-secondary ${item.bold ? "font-bold" : "font-medium"}`}>
                          {item.label}
                        </td>
                        <td className={`px-4 py-3 text-right ${item.bold ? "font-bold" : ""}`}>
                          {item.m2}㎡ ({item.py}평)
                        </td>
                        <td className="px-2 py-3 text-center w-16">
                          <button
                            onClick={() => handleCopyValue(item.m2, item.key)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {copiedField === item.key ? "복사됨" : "복사"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
