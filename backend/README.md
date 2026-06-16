# Murmur Backend

Spring Boot 기반 Murmur 백엔드 프로젝트입니다.

## 예정 기술 스택

- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- QueryDSL
- MySQL
- Redis

## 폴더 구조

```text
src/main/java/com/murmur/backend/
  auth/       # 회원가입, 로그인, JWT 인증
  user/       # 사용자
  post/       # 게시글
  comment/    # 댓글, 대댓글
  reaction/   # 공감, ㅋㅋㅋ, 힘내요
  report/     # 신고, 블라인드
  bookmark/   # 북마크
  admin/      # 관리자 기능
  common/     # 공통 응답, 예외, 설정
```

## 2일차 인증 API

### 회원가입

```http
POST /api/auth/signup
```

```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "익명러"
}
```

### 로그인

```http
POST /api/auth/login
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 토큰 재발급

```http
POST /api/auth/refresh
```

```json
{
  "refreshToken": "..."
}
```

### 로그아웃

```http
POST /api/auth/logout
```

```json
{
  "refreshToken": "..."
}
```

## 로컬 실행 전 준비

현재 저장소에는 Gradle Wrapper가 아직 없습니다. IntelliJ에서 Gradle 프로젝트로 연 뒤 Wrapper를 생성하거나, 로컬 Gradle 설치 후 아래 명령을 실행하세요.

```powershell
gradle wrapper
```

이후 Windows 기준 실행 명령어는 다음과 같습니다.

```powershell
cd backend
gradlew.bat bootRun
```

MySQL 없이 먼저 백엔드 실행만 확인하고 싶다면 IntelliJ 실행 설정의 Active profiles에 `dev`를 입력하세요.

`dev` 프로필은 H2 인메모리 DB를 사용하므로 MySQL을 켜지 않아도 서버가 실행됩니다.

```text
Active profiles: dev
```

H2 콘솔:

```text
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:murmur-dev
User Name: sa
Password: 비워두기
```

RDS MySQL에 연결하려면 IntelliJ 실행 설정에서 Active profiles에 `rds`를 입력하고 환경 변수를 추가하세요.

```text
Active profiles: rds
```

필수 환경 변수:

```text
DB_PASSWORD=RDS에서_설정한_비밀번호
JWT_SECRET=최소_32자_이상의_긴_랜덤_문자열
```

선택 환경 변수:

```text
DB_NAME=murmur
DB_USERNAME=admin
```

RDS에 `murmur` 데이터베이스가 없다면 먼저 생성해야 합니다.

```sql
CREATE DATABASE murmur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4일차 게시글 API

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

상세 조회 시 조회수가 1 증가합니다.

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

## 6일차 댓글 API

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

## 6일차 반응 API

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

반응 타입:

```text
EMPATHY = 공감해요
FUNNY = ㅋㅋㅋ
CHEER = 힘내요
```

### 반응 요약

```http
GET /api/posts/{postId}/reactions
```

## 8일차 익명 번호 / 신고 API

댓글 작성자는 게시글 단위로 익명 번호가 저장됩니다.

```text
게시글 작성자 = 익명1(글쓴이)
첫 번째 댓글 작성자 = 익명2
두 번째 댓글 작성자 = 익명3
```

같은 사용자는 같은 게시글 안에서 항상 같은 익명 번호를 유지합니다.

### 게시글 신고

```http
POST /api/posts/{postId}/report
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "reason": "신고 사유입니다."
}
```

정책:

```text
본인 게시글 신고 불가
같은 사용자의 같은 게시글 중복 신고 불가
신고 5회 이상 누적 시 자동 블라인드 처리
```
