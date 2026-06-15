# 6일차 작업 체크리스트

## 목표

댓글, 대댓글, 반응 시스템 백엔드 API를 구현한다.

## 완료한 작업

- [x] `Comment` 엔티티 생성
- [x] 댓글 Repository 생성
- [x] 댓글 작성 API 구현
- [x] 댓글 목록 API 구현
- [x] 댓글 수정 API 구현
- [x] 댓글 삭제 API 구현
- [x] 대댓글 작성 지원
- [x] 대댓글은 최상위 댓글에만 작성 가능하도록 제한
- [x] 댓글 작성자 본인만 수정 가능
- [x] 댓글 작성자 또는 관리자만 삭제 가능
- [x] 댓글 소프트 삭제 적용
- [x] 댓글 블라인드 콘텐츠 마스킹 처리
- [x] 게시글 단위 익명 번호 계산 구현
- [x] 게시글 작성자는 `익명1(글쓴이)`로 표시
- [x] 같은 게시글 안에서 같은 사용자는 같은 익명 번호 유지
- [x] `Reaction` 엔티티 생성
- [x] 반응 타입 enum 생성: `EMPATHY`, `FUNNY`, `CHEER`
- [x] 반응 토글 API 구현
- [x] 반응 요약 조회 API 구현
- [x] 게시글 목록/상세 응답에 실제 댓글 수, 반응 수 연결

## 댓글 API

### 댓글/대댓글 작성

```http
POST /api/posts/{postId}/comments
Authorization: Bearer {accessToken}
Content-Type: application/json
```

댓글:

```json
{
  "content": "댓글 내용입니다."
}
```

대댓글:

```json
{
  "parentCommentId": 1,
  "content": "대댓글 내용입니다."
}
```

### 댓글 목록

```http
GET /api/posts/{postId}/comments
```

### 댓글 수정

```http
PATCH /api/comments/{commentId}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "content": "수정된 댓글입니다."
}
```

### 댓글 삭제

```http
DELETE /api/comments/{commentId}
Authorization: Bearer {accessToken}
```

## 반응 API

### 반응 토글

```http
POST /api/posts/{postId}/reactions
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "reactionType": "EMPATHY"
}
```

사용 가능한 반응 타입:

```text
EMPATHY = 공감해요
FUNNY = ㅋㅋㅋ
CHEER = 힘내요
```

같은 사용자가 같은 게시글에 같은 반응을 다시 누르면 반응이 취소됩니다.

### 반응 요약 조회

```http
GET /api/posts/{postId}/reactions
```

## 남은 확인 작업

- [ ] 백엔드 재시작
- [ ] 댓글 작성 확인
- [ ] 대댓글 작성 확인
- [ ] 댓글 목록에서 익명 번호 확인
- [ ] 글쓴이 댓글이 `익명1(글쓴이)`로 표시되는지 확인
- [ ] 반응 토글 확인
- [ ] 게시글 목록/상세의 댓글 수, 반응 수 증가 확인

## 주의점

- 6일차는 백엔드 API 구현일입니다. 프론트 화면 연결은 7일차에 진행합니다.
- 새 엔티티가 추가되었으므로 백엔드를 반드시 재시작해야 합니다.
- RDS를 사용 중이면 `ddl-auto: update`에 의해 `comments`, `reactions` 테이블이 생성됩니다.
