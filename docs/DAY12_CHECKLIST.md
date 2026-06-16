# 12일차 작업 체크리스트

## 목표

마이페이지에서 로그인한 사용자의 기본 정보와 활동 통계를 보여주고, 내가 작성한 글을 관리할 수 있게 만든다.

## 완료한 작업

- [x] 내 프로필 조회 API 구현
- [x] 내 작성 글 목록 API 구현
- [x] 작성 글 수, 댓글 수, 북마크 수 통계 추가
- [x] 마이페이지 화면 구현
- [x] 마이페이지에서 북마크 화면으로 이동하는 링크 추가
- [x] 내가 쓴 글 목록에서 게시글 상세로 이동 가능하도록 연결
- [x] 마이페이지 서비스 테스트 추가

## API

### 내 프로필 조회

```http
GET /api/me
Authorization: Bearer {accessToken}
```

응답:

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "nickname": "익명사용자",
    "role": "USER",
    "postCount": 2,
    "commentCount": 4,
    "bookmarkCount": 3,
    "createdAt": "2026-06-16T12:00:00"
  }
}
```

### 내가 쓴 글 목록

```http
GET /api/me/posts?page=0&size=10
Authorization: Bearer {accessToken}
```

## 정책

- 로그인한 사용자만 마이페이지를 볼 수 있습니다.
- 일반 사용자는 다른 사용자의 마이페이지를 볼 수 없습니다.
- 내가 쓴 글 목록은 JWT의 사용자 ID 기준으로 조회합니다.
- 삭제된 글은 내가 쓴 글 목록에 표시하지 않습니다.
- 게시글 상세 화면으로 이동하면 작성자 본인에게만 수정/삭제 버튼이 보입니다.

## 확인할 것

- [x] `npm run build`
- [x] `./gradlew test`
- [ ] 백엔드 서버 재시작
- [ ] `/mypage`에서 내 정보와 통계가 보이는지 확인
- [ ] 내가 작성한 글만 목록에 나오는지 확인
- [ ] 내 글 상세 화면에서 수정/삭제 버튼이 보이는지 확인
- [ ] 다른 사람 글 상세 화면에서는 신고/저장 버튼만 보이는지 확인
