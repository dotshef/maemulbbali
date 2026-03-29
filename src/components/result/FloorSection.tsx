import type { BuildingInfo, AreaResult } from "@/types/building";

interface FloorSectionProps {
  building: BuildingInfo;
  area: AreaResult;
}

export function FloorSection({ building, area }: FloorSectionProps) {
  const totalFloors = [
    building.groundFloors != null ? `지상 ${building.groundFloors}층` : null,
    building.undergroundFloors != null ? `지하 ${building.undergroundFloors}층` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">층수</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-muted/40 p-5">
          <p className="text-base text-muted-foreground">해당 층</p>
          <p className="text-2xl font-bold mt-1">
            {area.flrNo != null ? `${area.flrNo}층` : "-"}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/40 p-5">
          <p className="text-base text-muted-foreground">전체 층</p>
          <p className="text-2xl font-bold mt-1">
            {totalFloors || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
