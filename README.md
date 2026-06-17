# Murmur

20~30대가 익명으로 고민, 일상, 썰을 공유하고 공감할 수 있는 커뮤니티 플랫폼입니다.

## 프로젝트 구조

```text
Murmur-app/
  frontend/   # React + TailwindCSS + Axios + React Query
  backend/    # Spring Boot + Spring Security + JWT + JPA + QueryDSL
  docs/       # 프로젝트 기획서와 설계 문서
```

## 개발 도구

- 프론트엔드: VS Code
- 백엔드: IntelliJ IDEA
- 데이터베이스: MySQL
- 캐시/세션 보조: Redis
- 배포: Docker, AWS EC2, RDS, CloudFront, S3

## 실행 주소

- 프론트엔드: `http://127.0.0.1:5173`
- 백엔드 API: `http://localhost:8081/api`

자세한 실행 방법과 DB 연결 기준은 [Murmur 실행 런북](docs/RUNBOOK.md)을 참고합니다.

## 제외 범위

- 소셜 로그인
- 실시간 채팅
- 알림 기능
- 팔로우 기능
- DM 기능
- 영상 업로드
- AI 추천 시스템
- 모바일 앱 버전
- MSA 구조
