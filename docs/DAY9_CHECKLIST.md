# 9일차 작업 체크리스트

## 목표

관리자가 신고된 게시글을 조회하고, 숨김 처리/숨김 해제/삭제 처리를 할 수 있는 운영 흐름을 만든다.

## 완료한 작업

- [x] 관리자 신고 게시글 목록 API 구현
- [x] 관리자 신고 사유 상세 조회 API 구현
- [x] 관리자 게시글 숨김 처리 API 구현
- [x] 관리자 게시글 숨김 해제 API 구현
- [x] 관리자 신고 게시글 삭제 API 구현
- [x] 관리자 권한 검사 추가
- [x] 숨김 해제 시 현재 신고 수를 검토 기준으로 저장
- [x] 같은 누적 신고 수만으로 즉시 다시 자동 숨김 처리되지 않도록 보완
- [x] 관리자 신고 관리 화면 구현
- [x] ADMIN 토큰일 때 헤더에 신고관리 링크 표시
- [x] Gradle 9 테스트 실행을 위한 JUnit Platform launcher 의존성 추가

## 관리자 API

### 신고 게시글 목록

```http
GET /api/admin/reports/posts?blindedOnly=false&page=0&size=10
Authorization: Bearer {adminAccessToken}
```

### 신고 사유 상세

```http
GET /api/admin/reports/posts/{postId}
Authorization: Bearer {adminAccessToken}
```

### 게시글 숨김 처리

```http
PATCH /api/admin/reports/posts/{postId}/blind
Authorization: Bearer {adminAccessToken}
```

### 게시글 숨김 해제

```http
PATCH /api/admin/reports/posts/{postId}/unblind
Authorization: Bearer {adminAccessToken}
```

### 신고 게시글 삭제

```http
DELETE /api/admin/reports/posts/{postId}
Authorization: Bearer {adminAccessToken}
```

## 관리자 계정 준비

회원가입으로 생성되는 계정은 기본 `USER` 권한입니다.
관리자 화면을 테스트하려면 DB에서 테스트 계정의 권한을 `ADMIN`으로 바꿔야 합니다.

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = '관리자로_쓸_이메일@example.com';
```

권한을 바꾼 뒤에는 JWT에 role이 다시 들어가야 하므로 로그아웃 후 다시 로그인해야 합니다.

## 확인한 것

- [x] `npm run build`
- [x] `./gradlew test`

## 주의점

- 관리자 API는 일반 사용자가 호출하면 `403 Forbidden`으로 차단됩니다.
- 관리자 화면에서 작성자 내부 ID, 이메일, 닉네임이 보입니다. 이는 운영 제재를 위한 관리자 전용 정보입니다.
- 일반 게시글/댓글 화면에는 사용자 식별 정보가 노출되지 않습니다.
