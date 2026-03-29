# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint
npx tsc --noEmit # 타입 체크
```

## Architecture

**매물빨리** — 부동산 매물의 면적 정보(전용/공용/계약면적)를 정부 건축물대장 API로 조회하는 Next.js 16 서비스.

### 인증 흐름

1. 이메일 OTP 인증 → 회원가입 → JWT access token(1일) + refresh token(30일) 발급
2. `src/proxy.ts`가 Next.js 16 proxy 컨벤션으로 모든 요청을 가로채 인증 처리 (`src/lib/auth.ts`의 `verifyAccessToken` 사용)
   - 미인증 → `/login` 리디렉션
   - 인증 + `/login`, `/signup`, `/` → `/area` 리디렉션
   - access token 만료 시 refresh token으로 자동 갱신
3. 서버 컴포넌트에서는 `getSessionUser()` (`src/lib/auth.ts`)로 세션 확인

### 핵심 데이터 흐름

`/area` 페이지 → 다음 우편번호 API(주소 검색) → buildingCode 파싱 → `/api/area` + `/api/building` 동시 호출 → 정부 건축물대장 API → 결과 표시

- 면적 단위 변환: m² → 평 (÷ 3.306)
- 건축물 코드 25자리: 시군구(5) + 법정동(5) + 대지구분(1) + 번(4) + 지(4) + 건물일련번호(6)
- `public/data/` CSV 파일로 특정 건물의 타입 정보 로컬 조회

### 주요 경로

| 경로 | 설명 |
|---|---|
| `src/proxy.ts` | 인증 미들웨어 (Next.js 16 proxy) |
| `src/lib/auth.ts` | JWT/세션 유틸리티 + 토큰 발급 (`issueTokensAndSetCookies`) |
| `src/lib/address.ts` | 건축물 코드 파싱 (`parseBuildingCode`), 상세주소 파싱 (`parseDetail`) |
| `src/lib/validation.ts` | 회원가입 유효성 검증 (서버/클라이언트 공통) |
| `src/lib/api-error.ts` | 서버 API 에러 응답 핸들러 (`handleApiError`) |
| `src/lib/supabase.ts` | Supabase 서버 클라이언트 (service role) |
| `src/app/area/page.tsx` | 메인 조회 페이지 |
| `src/app/api/area/route.ts` | 면적 조회 API (정부 API 연동) |
| `src/app/api/building/route.ts` | 건물 기본정보 API |
| `src/app/api/auth/*` | 인증 엔드포인트 (login, signup, refresh 등) |

### 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **Supabase** — DB (users, email_verifications, refresh_tokens, user_area_request_log)
- **Tailwind CSS v4** + shadcn/ui (base-nova)
- **Resend** — 이메일 발송
- **jsonwebtoken** — JWT (proxy.ts는 Node.js 런타임이므로 호환)

## 환경 변수

`JWT_SECRET`, `BUILDING_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

## DB 규칙

- 국내 전용 서비스이므로 `timestamptz` 대신 `timestamp`를 사용한다.

## API 규칙

- 모든 API route에서 `NextResponse.json()` 사용. `Response.json()` 사용 금지.
- 서버 API의 에러 처리는 `handleApiError()` (`src/lib/api-error.ts`) 사용.
- 토큰 발급은 `issueTokensAndSetCookies()` (`src/lib/auth.ts`) 사용. 각 route에서 직접 토큰 생성 금지.
- 유효성 검증은 `src/lib/validation.ts`에 정의하고 서버/클라이언트 양쪽에서 공통 사용.

## UI 규칙

- 고객 연령대가 높으므로 **text-base(16px) 이상만 사용**. text-sm, text-xs 사용 금지 (shadcn 기본 컴포넌트 제외).
- 제목/라벨은 text-xl, 본문은 text-base, 버튼은 text-lg 기준.
- 모든 UI 텍스트는 한국어.
