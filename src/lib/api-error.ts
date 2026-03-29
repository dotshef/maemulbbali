import { NextResponse } from "next/server";

export function handleApiError(err: unknown) {
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
