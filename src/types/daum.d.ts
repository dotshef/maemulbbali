interface DaumPostcodeData {
  zonecode: string;
  address: string;
  jibunAddress: string;
  roadAddress: string;
  autoJibunAddress: string;
  autoRoadAddress: string;
  bcode: string;
  buildingCode: string;
  buildingName: string;
  apartment: "Y" | "N";
}

interface DaumPostcode {
  open: () => void;
}

interface DaumPostcodeConstructor {
  new (options: {
    oncomplete: (data: DaumPostcodeData) => void;
  }): DaumPostcode;
}

interface Daum {
  Postcode: DaumPostcodeConstructor;
}

declare const daum: Daum;
