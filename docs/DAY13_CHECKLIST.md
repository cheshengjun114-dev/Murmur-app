# 13일차 작업 체크리스트

## 목표

새 기능을 크게 추가하기보다 전체 기능을 점검하고, 실행 문제와 보안 설정을 정리하며, 발표/면접 대비 답변을 준비한다.

## 완료한 작업

- [x] 프론트 접속 문제 원인 분리
- [x] 백엔드 API 정상 응답 확인
- [x] 프론트 임시 정적 서버 실행 방식 정리
- [x] `frontend/scripts/serve-dist.mjs` 추가
- [x] `npm run serve:dist` 스크립트 추가
- [x] `application.yml`에서 실제 DB 비밀번호 제거
- [x] 백엔드 설정을 환경변수 기반으로 변경
- [x] `backend/.env` 자동 로딩 설정 추가
- [x] `backend/.env.example` 추가
- [x] RDS 프로필 기본 DB 이름을 `murmur_app`으로 정리
- [x] 현재 백엔드가 RDS `murmur_app` DB를 바라보도록 재기동
- [x] RDS 게시글이 프론트 화면에 표시되는지 확인
- [x] 실행 런북 문서 추가
- [x] 면접 대비 Q&A 문서 추가
- [x] 백엔드 컴파일 및 테스트 클래스 생성 확인
- [x] 프론트 정적 서버 스크립트 문법 확인
- [x] 프론트/백엔드 HTTP 응답 `200` 확인

## 실행 점검

### 현재 접속 상태

현재 프론트는 정적 서버로 복구되어 있다.

```text
프론트: http://127.0.0.1:5173
백엔드: http://localhost:8081
```

확인 결과:

```text
GET http://127.0.0.1:5173 -> 200
GET http://localhost:8081/api/categories -> 200
GET http://localhost:8081/api/posts -> RDS 게시글 응답 확인
```

### 백엔드

백엔드는 `backend/.env`를 자동으로 읽는다. 실제 값은 Git에 올리지 않고, 공유용 형식은 `backend/.env.example`을 참고한다.

```text
DB_URL=jdbc:mysql://murmur-database.ch6so6m66mra.ap-northeast-2.rds.amazonaws.com:3306/murmur_app?serverTimezone=Asia/Seoul&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true
DB_USERNAME=admin
DB_PASSWORD=본인_DB_비밀번호
JWT_SECRET=32자_이상_긴_랜덤_문자열
REDIS_HOST=127.0.0.1
SERVER_PORT=8081
```

### 프론트 개발 서버

기본 실행:

```bash
npm run dev
```

Vite dev 서버가 멈추면 임시 복구:

```bash
npm run build
npm run serve:dist
```

접속 주소:

```text
http://127.0.0.1:5173
```

## 전체 기능 점검표

- [ ] 회원가입
- [ ] 로그인
- [ ] 로그아웃
- [ ] 토큰 재발급
- [ ] 게시글 작성
- [ ] 게시글 조회
- [ ] 게시글 수정
- [ ] 게시글 삭제
- [ ] 카테고리별 게시글 조회
- [ ] 댓글 작성
- [ ] 대댓글 작성
- [ ] 댓글 수정
- [ ] 댓글 삭제
- [ ] 반응 추가/해제
- [ ] 게시글 신고
- [ ] 중복 신고 차단
- [ ] 본인 글 신고 차단
- [ ] 신고 누적 자동 블라인드
- [ ] 관리자 신고 목록 조회
- [ ] 관리자 숨김 처리
- [ ] 관리자 숨김 해제
- [ ] 관리자 삭제 처리
- [ ] 인기글 조회
- [ ] 북마크 저장/해제
- [ ] 북마크 목록
- [ ] 마이페이지 내 정보
- [ ] 마이페이지 내가 쓴 글

## 남은 이슈

- `npm run dev`가 포트는 열거나 실행 로그를 출력하기 전에 멈추는 현상이 있었다.
- `npm run build`도 오늘 환경에서는 `vite build` 시작 후 멈췄다.
- `./gradlew test`는 컴파일과 테스트 클래스 생성까지는 통과했지만 `Task :test` 단계에서 멈췄다.
- 현재 사이트 접속은 `npm run serve:dist`로 복구했다.
- 로컬 Docker MySQL과 RDS를 번갈아 쓰면 데이터가 다르게 보일 수 있으므로, 현재 API가 어떤 DB를 바라보는지 먼저 확인해야 한다.

따라서 다음 작업 전에는 Vite/Gradle 실행 환경을 먼저 다시 점검하는 것이 좋다.

## 주의점

- `frontend/.env`는 Git에 올리면 안 된다.
- `backend/.env`는 Git에 올리면 안 된다.
- `backend/src/main/resources/application.yml`에는 실제 비밀번호를 직접 쓰지 않는다.
- 백엔드 설정 변경 후에는 IntelliJ에서 서버를 재시작해야 한다.
- 새 엔티티가 추가된 뒤에는 RDS에 테이블이 생성됐는지 확인한다.
