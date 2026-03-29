"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BasicInfoSection } from "@/components/result/BasicInfoSection";
import { AreaSection } from "@/components/result/AreaSection";
import { FloorSection } from "@/components/result/FloorSection";
import { fetchArea, fetchBuilding } from "@/lib/api";
import { parseBuildingCode, parseDetail } from "@/lib/address";
import type { AddressInfo, AreaResult, BuildingInfo } from "@/types/building";

export default function AreaPage() {
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

      // 조회 기록 저장
      fetch("/api/user-area-request-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sigunguCd: address.sigunguCd,
          bjdongCd: address.bjdongCd,
          bun: address.bun,
          ji: address.ji,
          dong: parsed.dong || null,
          ho: parsed.ho,
        }),
      }).catch((err) => console.error("[user-area-request-log]", err));
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
          <Label className="text-xl font-semibold mb-1 block">주소</Label>
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
            <Button onClick={handleSearch} className="px-7 text-lg shrink-0 cursor-pointer rounded-md h-auto">
              검색
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-xl font-semibold mb-1 block">상세주소</Label>
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
            className="text-lg px-8 min-h-10 cursor-pointer"
          >
            {loading ? "조회 중..." : "조회"}
          </Button>
        </div>
        {/* 에러 */}
        {error && (
          <p className="text-base text-destructive">{error}</p>
        )}
      </div>

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
