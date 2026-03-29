export interface AddressInfo {
  jibunAddress: string;
  roadAddress: string;
  buildingName: string;
  sigunguCd: string;
  bjdongCd: string;
  bun: string;
  ji: string;
}

export interface Bookmark {
  id: string;
  jibunAddress: string;
  roadAddress: string;
  buildingName: string | null;
  sigunguCd: string;
  bjdongCd: string;
  bun: string;
  ji: string;
}

export interface AreaResult {
  dong: string | null;
  ho: string;
  flrNo: number | null;
  mainPurpose: string | null;
  exclusiveArea: number;
  exclusiveAreaPy: number;
  commonArea: number;
  commonAreaPy: number;
  supplyArea: number;
  supplyAreaPy: number;
  typeName: string | null;
}

export interface BuildingInfo {
  useAprDay: string | null;
  groundFloors: number | null;
  undergroundFloors: number | null;
}
