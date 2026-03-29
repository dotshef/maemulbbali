/**
 * buildingCode (25자리) 구조:
 * 시군구(5) + 법정동(5) + 대지구분(1) + 번(4) + 지(4) + 건물일련번호(6)
 */
export function parseBuildingCode(buildingCode: string) {
  return {
    sigunguCd: buildingCode.substring(0, 5),
    bjdongCd: buildingCode.substring(5, 10),
    bun: buildingCode.substring(11, 15),
    ji: buildingCode.substring(15, 19),
  };
}

export function parseDetail(input: string) {
  const s = input.trim().replace(/\s+/g, " ");

  const dongHoMatch = s.match(/^(\d+)동\s*(\d+)호?$/);
  if (dongHoMatch) return { dong: dongHoMatch[1], ho: dongHoMatch[2] };

  const dashMatch = s.match(/^(\d+)-(\d+)$/);
  if (dashMatch) return { dong: dashMatch[1], ho: dashMatch[2] };

  const hoOnly = s.match(/^(\d+)호?$/);
  if (hoOnly) return { dong: "", ho: hoOnly[1] };

  return null;
}
