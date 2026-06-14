# 1일차 작업 체크리스트

## 목표

백엔드와 프론트엔드 프로젝트 기본 환경을 구성하고, 강사 피드백으로 나온 익명/신고/Redis 정책을 문서에 반영합니다.

## 완료한 작업

- [x] 모노레포 구조 생성: `frontend`, `backend`, `docs`
- [x] 프론트엔드 Vite + React 기본 파일 생성
- [x] 프론트엔드 TailwindCSS 설정 파일 생성
- [x] 프론트엔드 Axios 인스턴스 생성
- [x] 프론트엔드 React Query Provider 설정
- [x] 프론트엔드 기본 라우팅 구조 생성
- [x] 백엔드 Spring Boot Gradle 기본 파일 생성
- [x] 백엔드 도메인형 패키지 구조 생성
- [x] 백엔드 SecurityConfig 기본 파일 생성
- [x] 백엔드 공통 API 응답 구조 생성
- [x] 백엔드 `application-example.yml` 생성
- [x] Redis 사용 이유 문서화
- [x] 익명 번호 정책 문서화
- [x] 관리자 작성자 식별 범위 문서화
- [x] 신고/블라인드 정책 문서화
- [x] 익명 서비스에서 회원가입이 필요한 이유 문서화

## 남은 작업

- [ ] Gradle Wrapper 생성 또는 IntelliJ Gradle 동기화 확인
- [ ] 로컬 MySQL DB 생성
- [ ] Redis 로컬 실행 확인
- [ ] Spring Boot 앱 포트 8080 기동 확인
- [ ] React 앱 포트 5173 기동 확인
- [ ] GitHub 원격 저장소 연결
- [ ] GitHub push

## Windows 기준 실행 명령어

프론트엔드 실행:

```powershell
cd frontend
npm install
npm run dev
```

백엔드 실행:

```powershell
cd backend
gradlew.bat bootRun
```

MySQL DB 생성:

```sql
CREATE DATABASE murmur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Redis 확인:

```powershell
redis-cli ping
```

정상이라면 아래처럼 응답합니다.

```text
PONG
```

## 1일차 기준 면접 답변 포인트

- Murmur는 사용자 간 익명 서비스이며, 관리자는 운영상 필요한 최소 범위에서 작성자 ID를 확인할 수 있습니다.
- 익명 번호는 게시글 상세 화면 단위로 유지하며, 글쓴이는 항상 `익명1(글쓴이)`입니다.
- 신고는 중복 신고와 자기 글 신고를 막고, 일정 횟수 이상 누적되면 자동 숨김 처리합니다.
- Redis는 Refresh Token 저장, TTL 기반 만료 처리, 로그아웃/강제 로그아웃 처리를 위해 사용합니다.
