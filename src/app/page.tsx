"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BasicInfoSection } from "@/components/result/BasicInfoSection";
import { AreaSection } from "@/components/result/AreaSection";
import { FloorSection } from "@/components/result/FloorSection";
import { fetchArea, fetchBuilding } from "@/lib/api";
import type { AddressInfo, AreaResult, BuildingInfo } from "@/types/building";

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

function parseDetail(input: string) {
  const s = input.trim().replace(/\s+/g, " ");

  const dongHoMatch = s.match(/^(\d+)동\s*(\d+)호?$/);
  if (dongHoMatch) return { dong: dongHoMatch[1], ho: dongHoMatch[2] };

  const dashMatch = s.match(/^(\d+)-(\d+)$/);
  if (dashMatch) return { dong: dashMatch[1], ho: dashMatch[2] };

  const hoOnly = s.match(/^(\d+)호?$/);
  if (hoOnly) return { dong: "", ho: hoOnly[1] };

  return null;
}

export default function Home() {
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [detail, setDetail] = useState("");
  const [areaResult, setAreaResult] = useState<AreaResult | null>(null);
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    new daum.Postcode({
      oncomplete(data: DaumPostcodeData) {
        const { sigunguCd, bjdongCd, bun, ji } = parseBuildingCode(data.buildingCode);
        console.log("[address] buildingCode:", data.buildingCode, { sigunguCd, bjdongCd, bun, ji });

        setAddress({
          jibunAddress: data.jibunAddress || data.address,
          buildingName: data.buildingName,
          sigunguCd,
          bjdongCd,
          bun,
          ji,
        });
        setAreaResult(null);
        setBuildingInfo(null);
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
    setAreaResult(null);
    setBuildingInfo(null);

    try {
      const baseParams = {
        sigunguCd: address.sigunguCd,
        bjdongCd: address.bjdongCd,
        bun: address.bun,
        ji: address.ji,
      };

      const [area, building] = await Promise.all([
        fetchArea({ ...baseParams, ho: parsed.ho, dong: parsed.dong || undefined }),
        fetchBuilding(baseParams),
      ]);

      setAreaResult(area);
      setBuildingInfo(building);
    } catch (err) {
      setError(err instanceof Error ? err.message : "조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      {/* 검색 폼 */}
      <div className="w-full max-w-2xl mx-auto rounded-lg border bg-card p-6 space-y-4">
        <div>
          <Label className="text-lg font-semibold mb-1 block">주소</Label>
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
            <Button onClick={handleSearch} className="px-5 text-base shrink-0 cursor-pointer rounded-md h-auto">
              검색
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-lg font-semibold mb-1 block">상세주소</Label>
          <Input
            placeholder=""
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="!text-base min-h-10 py-2"
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleQuery}
            disabled={loading}
            className="text-base px-8 min-h-10 cursor-pointer"
          >
            {loading ? "조회 중..." : "조회"}
          </Button>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className="w-full max-w-5xl mx-auto mt-4">
          <p className="text-base text-destructive">{error}</p>
        </div>
      )}

      {/* 결과 */}
      {areaResult && (
        <div className="w-full max-w-2xl mx-auto mt-6 rounded-lg border bg-card p-6 space-y-6">
          {/* 1. 기본 정보 */}
          {buildingInfo && <BasicInfoSection building={buildingInfo} area={areaResult} />}

          {/* 2. 면적 */}
          <AreaSection data={areaResult} />

          {/* 3. 층수 */}
          {buildingInfo && <FloorSection building={buildingInfo} area={areaResult} />}
        </div>
      )}
    </main>
  );
}
