import type { BuildingInfo, AreaResult } from "@/types/building";

interface BasicInfoSectionProps {
  building: BuildingInfo;
  area: AreaResult;
}

export function BasicInfoSection({ building, area }: BasicInfoSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 border-l-4 border-primary pl-3">기본 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-muted/40 p-5">
          <p className="text-sm text-muted-foreground">건축물용도</p>
          <p className="text-2xl font-bold mt-1">
            {area.mainPurpose ?? "-"}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/40 p-5">
          <p className="text-sm text-muted-foreground">사용승인일</p>
          <p className="text-2xl font-bold mt-1">
            {building.useAprDay ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
