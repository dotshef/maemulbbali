# 이메일 템플릿 "..." 문제 분석 리포트

## 현재 문제

OTP 인증코드 이메일에서 코드 아래에 `···`(말줄임/점 세개)이 표시됨.
`overflow:hidden`, `height` 고정, `line-height`, `font-size:0` 등 시도했으나 해결 안 됨.

## 원인

### 핵심 원인: `display:inline-block` + 공백 텍스트 노드

- **`display:inline-block`은 이메일 클라이언트에서 제대로 지원되지 않음**
  - Gmail(웹/모바일): 속성을 제거하거나 변형시킴
  - Outlook(2007+): Word 렌더링 엔진 사용 → `inline-block` 미지원
  - Yahoo Mail: 불안정한 동작

- **HTML 소스의 줄바꿈/공백이 텍스트 노드로 렌더링됨**
  - `</span>`과 `</div>` 사이의 공백이 보이는 문자로 렌더링
  - `letter-spacing: 8px`이 적용되어 이 공백이 점(dot)으로 확대 표시

- **`overflow:hidden`, `height` 고정이 안 먹는 이유**
  - 이메일 클라이언트(특히 Outlook)가 이 CSS 속성을 무시하거나 제거함

## 해결 방법

### `<div>` + `<span>` → `<table>` + `<td>` 구조로 변경

이메일 HTML의 업계 표준은 **테이블 기반 레이아웃**이다.
Stripe, GitHub, Google 등 모든 주요 서비스가 이 방식을 사용함.

### 변경 전 (현재 코드)

```html
<div style="display:inline-block;padding:16px 48px;background-color:#ffffff;border-radius:8px;overflow:hidden;height:64px;line-height:32px;">
  <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1b2a4a;">${code}</span>
</div>
```

### 변경 후 (수정안)

```html
<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
  <tr>
    <td align="center" style="background-color:#ffffff;border-radius:8px;padding:16px 48px;font-size:32px;font-weight:700;letter-spacing:8px;color:#1b2a4a;">${code}</td>
  </tr>
</table>
```

### 왜 이것이 해결되는가

| 문제 | div 방식 | table 방식 |
|------|----------|------------|
| `display:inline-block` 지원 | Gmail/Outlook에서 깨짐 | 불필요 |
| 공백 텍스트 노드 | `···` 렌더링됨 | `<td>`에 직접 텍스트 → 공백 없음 |
| Outlook 렌더링 | 예측 불가 | 안정적 (Word 엔진이 테이블 잘 지원) |
| 크기 조절 | overflow/height 무시됨 | `<td>`가 콘텐츠에 맞게 자동 조절 |

## 이메일 HTML 핵심 원칙

1. **`display:inline-block` 절대 사용 금지** → 테이블 사용
2. **`overflow:hidden` 의존 금지** → Outlook 등이 무시
3. **컨테이너에 `height` 고정 금지** → 콘텐츠가 높이 결정하게 할 것
4. **태그 사이 공백 제거** 또는 HTML 주석(`<!-- -->`)으로 제거
5. **인라인 스타일만 사용** → `<style>` 블록은 일부 클라이언트가 제거
6. **테이블에 `cellpadding="0" cellspacing="0" border="0"` 필수**
