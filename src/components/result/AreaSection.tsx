"use client";

import { useState } from "react";
import type { AreaResult } from "@/types/building";

export function AreaSection({ data }: { data: AreaResult }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: number, field: string) => {
    await navigator.clipboard.writeText(String(value));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 border-l-4 border-primary pl-3">면적</h2>
<div className="grid grid-cols-2 gap-4">
        {/* 타입 */}
        <div className="rounded-lg border bg-muted/40 p-5">
          <p className="text-sm text-muted-foreground">타입</p>
          {data.typeName ? (
            <p className="text-2xl font-bold mt-1">{data.typeName}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              타입 정보가 지원되지 않습니다.
            </p>
          )}
        </div>

        {/* 전용면적 */}
        <div className="rounded-lg border bg-muted/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">전용면적</p>
            <button
              onClick={() => handleCopy(data.exclusiveArea, "exclusive")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer border rounded-md px-2 py-0.5"
            >
              {copiedField === "exclusive" ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="text-2xl font-bold mt-1">
            {data.exclusiveArea}㎡
            <span className="text-base font-normal text-muted-foreground ml-2">
              ({data.exclusiveAreaPy}평)
            </span>
          </p>
        </div>

        {/* 공용면적 */}
        <div className="rounded-lg border bg-muted/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">공용면적</p>
            <button
              onClick={() => handleCopy(data.commonArea, "common")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer border rounded-md px-2 py-0.5"
            >
              {copiedField === "common" ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="text-2xl font-bold mt-1">
            {data.commonArea}㎡
            <span className="text-base font-normal text-muted-foreground ml-2">
              ({data.commonAreaPy}평)
            </span>
          </p>
        </div>

        {/* 계약면적 */}
        <div className="rounded-lg border bg-muted/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">계약면적</p>
            <button
              onClick={() => handleCopy(data.supplyArea, "supply")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer border rounded-md px-2 py-0.5"
            >
              {copiedField === "supply" ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="text-2xl font-bold mt-1">
            {data.supplyArea}㎡
            <span className="text-base font-normal text-muted-foreground ml-2">
              ({data.supplyAreaPy}평)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
