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
