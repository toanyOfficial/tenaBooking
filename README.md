# TOANY Medical Stay Booking Prototype

병원 방문 고객을 위한 모바일 우선 숙소 예약 페이지 프로토타입입니다. Next.js App Router, TypeScript, CSS 기반 디자인 토큰으로 구성되어 있으며 Auto Deploy의 `nextjs_bun` runtime을 기준으로 합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- CSS Modules 및 전역 CSS 디자인 토큰
- Bun 실행 호환

## 실행 명령

```bash
bun install
bun run dev
bun run build
bun run start -H 0.0.0.0
```

Auto Deploy에서는 별도 build/start command 없이 `bun run build`, `bun run start -H 0.0.0.0`를 사용합니다.

## 환경변수

필요한 변수명은 `.env.example`을 기준으로 설정합니다. 실제 Secret, 서버 비밀번호, 토큰은 저장소에 커밋하지 않습니다.

- PayPal 미설정 시 결제 요청은 mock 모드로 동작합니다.
- 요금은 요일과 `korean_holiday` 테이블에서 `is_holiday = 1`로 등록된 날짜를 기준으로 계산합니다. DB 조회가 실패한 경우에만 공공데이터 API(`HOLIDAY_API_KEY`) 또는 내장 fallback 데이터를 사용합니다.
- MySQL 연결에는 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`이 필요합니다. 서버 코드에서 `getDatabasePool()`을 호출하면 공용 connection pool이 생성됩니다.
- 객실 목록과 운영 여부는 `client_rooms`에서 조회하고, `reservation_calendar_snapshot.room_id`를 `client_rooms.id`에 연결해 최신 `snapshot_at`의 예약 기간과 선택 일정을 비교합니다. `building_id = 1`이면서 운영 중인 객실만 표시하며 결제 직전에 가용 여부를 다시 확인합니다.
- 문의 전화번호와 카카오톡 URL이 없으면 해당 문의 버튼은 준비 중 상태로 표시됩니다.

## 현재 프로토타입 미구현 범위

- 실제 예약 저장
- PayPal 결제 승인 검증, capture, webhook 처리
- 중복 예약 방지
- 관리자 화면
- 확정 약관 및 개인정보처리방침 문서
