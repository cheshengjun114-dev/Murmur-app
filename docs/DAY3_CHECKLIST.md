# 3일차 작업 체크리스트

## 목표

로그인/회원가입 화면을 구현하고, JWT 저장 및 API 요청 자동 인증 헤더 첨부 흐름을 만든다.

## 완료한 작업

- [x] 로그인 화면 구현
- [x] 회원가입 화면 구현
- [x] 클라이언트 유효성 검사 구현
- [x] React Query `useMutation`으로 인증 API 호출
- [x] Access Token / Refresh Token localStorage 저장
- [x] Axios 요청 인터셉터로 Authorization 헤더 자동 첨부
- [x] Axios 응답 인터셉터로 401 발생 시 Refresh Token 재발급 시도
- [x] 인증 상태 전역 Context 구현
- [x] PrivateRoute 구현
- [x] 글쓰기, 수정, 마이페이지, 북마크, 관리자 신고 화면 보호 라우트 적용
- [x] 홈 화면에 로그인/로그아웃 상태 반영

## API 연결 기준

프론트엔드는 아래 환경 변수를 기준으로 백엔드 API에 접근합니다.

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## Windows 기준 실행 명령어

```powershell
cd frontend
npm install
npm run dev
```

## 확인할 것

- [ ] 백엔드 서버 실행
- [ ] Redis 실행
- [ ] 회원가입 성공 후 로그인 화면 이동 확인
- [ ] 로그인 성공 후 Access Token 저장 확인
- [ ] 로그인 후 `/posts/new` 접근 가능 확인
- [ ] 로그아웃 후 보호 라우트 접근 시 `/login` 이동 확인
