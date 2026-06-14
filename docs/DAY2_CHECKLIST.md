# 2일차 작업 체크리스트

## 목표

JWT 기반 회원가입/로그인 API를 구현하고, Access Token과 Refresh Token 발급/검증 흐름을 만든다.

## 완료한 작업

- [x] `User` 엔티티 생성
- [x] `UserRole` enum 생성
- [x] `UserRepository` 생성
- [x] 회원가입 요청 DTO 생성
- [x] 로그인 요청 DTO 생성
- [x] 토큰 재발급/로그아웃 요청 DTO 생성
- [x] 토큰 응답 DTO 생성
- [x] BCrypt `PasswordEncoder` Bean 등록
- [x] JWT 생성/검증용 `JwtTokenProvider` 생성
- [x] JWT 설정값 바인딩용 `JwtProperties` 생성
- [x] Refresh Token Redis 저장 서비스 생성
- [x] `CustomUserDetailsService` 생성
- [x] `JwtAuthenticationFilter` 생성
- [x] Spring Security Stateless 설정
- [x] 회원가입 API 구현: `POST /api/auth/signup`
- [x] 로그인 API 구현: `POST /api/auth/login`
- [x] 토큰 재발급 API 구현: `POST /api/auth/refresh`
- [x] 로그아웃 API 구현: `POST /api/auth/logout`
- [x] 공통 예외 처리 구조 생성
- [x] 테스트용 H2 설정 생성
- [x] AuthService 단위 흐름 테스트 작성

## API 명세 초안

### 회원가입

```http
POST /api/auth/signup
Content-Type: application/json
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
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

응답:

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "accessTokenExpirationMs": 1800000
  }
}
```

### 토큰 재발급

```http
POST /api/auth/refresh
Content-Type: application/json
```

```json
{
  "refreshToken": "..."
}
```

### 로그아웃

```http
POST /api/auth/logout
Content-Type: application/json
```

```json
{
  "refreshToken": "..."
}
```

## 남은 확인 작업

- [ ] Gradle Wrapper 추가
- [ ] `./gradlew test` 또는 IntelliJ 테스트 실행
- [ ] MySQL 로컬 DB 연결 확인
- [ ] Redis 로컬 실행 후 Refresh Token 저장 확인
- [ ] Postman으로 회원가입/로그인 API 호출 확인

## 실행 오류가 날 때 먼저 볼 것

### MySQL 연결 오류

아래와 비슷한 오류가 나면 MySQL이 실행 중이 아니거나 `murmur` 데이터베이스/계정이 없는 상태입니다.

```text
Communications link failure
Access denied for user
Unknown database 'murmur'
```

이 경우 2가지 중 하나를 선택합니다.

1. IntelliJ Active profiles에 `dev`를 넣고 H2 DB로 먼저 실행합니다.
2. MySQL에서 `murmur` DB와 계정을 생성한 뒤 기본 프로필로 실행합니다.

### Gradle Wrapper 오류

아래 파일이 없으면 Windows에서 `gradlew.bat` 실행이 불가능합니다.

```text
backend/gradlew.bat
backend/gradle/wrapper/gradle-wrapper.jar
```

IntelliJ에서 Gradle Wrapper를 생성하거나 로컬 Gradle 설치 후 `gradle wrapper`를 실행해야 합니다.

## Windows 기준 실행 명령어

```powershell
cd backend
gradlew.bat test
gradlew.bat bootRun
```

현재 저장소에는 Gradle Wrapper가 아직 없으므로, IntelliJ에서 Gradle 프로젝트로 열어 Wrapper를 생성하거나 로컬 Gradle 설치 후 아래 명령을 실행해야 합니다.

```powershell
gradle wrapper
```

## 면접 답변 포인트

- 비밀번호는 평문 저장하지 않고 BCrypt로 단방향 암호화합니다.
- Access Token은 짧게, Refresh Token은 길게 유지합니다.
- Refresh Token은 Redis에 저장해 로그아웃과 강제 만료를 제어합니다.
- 서버는 JWT의 `userId`를 이용해 현재 로그인 사용자를 식별합니다.
- 익명 서비스여도 서버에는 작성자 ID가 저장되어야 수정/삭제/신고/제재가 가능합니다.
