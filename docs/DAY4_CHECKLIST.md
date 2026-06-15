# 4일차 작업 체크리스트

## 목표

게시글 작성, 수정, 삭제, 목록 조회, 상세 조회 API를 구현하고 페이지네이션과 조회수 증가 흐름을 만든다.

## 완료한 작업

- [x] `BaseTimeEntity` 생성
- [x] `Category` 엔티티 생성
- [x] `Post` 엔티티 생성
- [x] 카테고리 초기 데이터 `data.sql` 생성
- [x] 카테고리 목록 API 구현: `GET /api/categories`
- [x] 게시글 작성 API 구현: `POST /api/posts`
- [x] 게시글 목록 API 구현: `GET /api/posts`
- [x] 카테고리별 게시글 목록 필터 구현: `GET /api/posts?categoryId=1`
- [x] 게시글 상세 API 구현: `GET /api/posts/{postId}`
- [x] 상세 조회 시 조회수 1 증가 구현
- [x] 게시글 수정 API 구현: `PATCH /api/posts/{postId}`
- [x] 게시글 삭제 API 구현: `DELETE /api/posts/{postId}`
- [x] 본인 게시글만 수정 가능하도록 권한 검증
- [x] 본인 또는 관리자만 삭제 가능하도록 권한 검증
- [x] 블라인드 게시글 상세 내용 마스킹 처리
- [x] 삭제 게시글은 목록/상세에서 제외하는 소프트 삭제 적용

## API 명세 초안

### 카테고리 목록

```http
GET /api/categories
```

### 게시글 작성

```http
POST /api/posts
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "categoryId": 1,
  "title": "오늘 회사에서 있었던 일",
  "content": "본문 내용입니다."
}
```

### 게시글 목록

```http
GET /api/posts?page=0&size=10
GET /api/posts?categoryId=1&page=0&size=10
```

### 게시글 상세

```http
GET /api/posts/{postId}
```

### 게시글 수정

```http
PATCH /api/posts/{postId}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "categoryId": 1,
  "title": "수정된 제목",
  "content": "수정된 본문입니다."
}
```

### 게시글 삭제

```http
DELETE /api/posts/{postId}
Authorization: Bearer {accessToken}
```

## 남은 확인 작업

- [ ] Gradle Wrapper 생성
- [ ] 백엔드 테스트 실행
- [ ] Postman으로 게시글 작성 확인
- [ ] 목록 조회 페이지네이션 확인
- [ ] 상세 조회 시 조회수 증가 확인
- [ ] 다른 사용자 토큰으로 수정/삭제 시 403 확인

## 주의점

- 댓글 수와 반응 수는 6일차 이후 기능이므로 현재는 `0`으로 응답합니다.
- 조회수 증가는 현재 JPA 엔티티 값 증가 방식입니다. 트래픽이 늘어나면 Redis `INCR` 후 배치 반영 방식으로 개선할 수 있습니다.
- 카테고리 ID는 환경에 따라 달라질 수 있으므로 프론트엔드는 `GET /api/categories`로 받은 ID를 사용해야 합니다.
