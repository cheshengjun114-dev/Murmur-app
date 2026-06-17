# Murmur 실행 런북

## 현재 개발 기준

- 프론트엔드: `http://127.0.0.1:5173`
- 백엔드: `http://localhost:8081`
- API 기본 주소: `http://localhost:8081/api`
- 현재 백엔드는 `backend/.env`의 `DB_URL`을 읽어 RDS `murmur_app` DB에 연결한다.

## 프론트엔드 실행

```bash
cd frontend
npm run dev
```

Vite 개발 서버가 멈추거나 화면 접속이 안 되면 정적 서버로 임시 복구한다.

```bash
cd frontend
npm run build
npm run serve:dist
```

프론트 `.env`에는 백엔드 API 주소만 둔다.

```text
VITE_API_BASE_URL=http://localhost:8081/api
```

## 백엔드 실행

백엔드는 `application.yml`에서 `backend/.env`를 자동으로 읽는다.
실제 값은 Git에 올리지 않는 `backend/.env`에 넣고, 공유용 예시는 `backend/.env.example`을 사용한다.

```text
DB_URL=jdbc:mysql://RDS_ENDPOINT:3306/murmur_app?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=admin
DB_PASSWORD=본인_DB_비밀번호
JWT_SECRET=32자_이상_긴_랜덤_문자열
REDIS_HOST=127.0.0.1
SERVER_PORT=8081
```

IntelliJ에서 실행할 때는 별도 환경변수를 직접 넣지 않아도, 프로젝트 루트 기준으로 실행하면 `backend/.env`를 읽는다.
만약 IntelliJ 작업 디렉터리가 `backend`로 잡혀 있으면 `.env`도 읽을 수 있도록 `application.yml`에 `optional:file:.env`와 `optional:file:backend/.env`가 모두 등록되어 있다.

터미널 실행:

```bash
cd backend
./gradlew bootRun
```

## Redis 실행 확인

로그인 시 Refresh Token을 Redis에 저장하므로 Redis가 켜져 있어야 한다.

```bash
docker ps
```

`murmur-redis` 컨테이너가 보이지 않으면 Redis를 먼저 실행한다.

## DB 혼동 방지

DBeaver에서 RDS를 보고 있는데 사이트에는 글이 안 보이면, 백엔드가 다른 DB를 보고 있을 가능성이 높다.

확인 기준:

```bash
curl http://localhost:8081/api/posts
```

이 응답이 사이트 화면의 기준이다. DBeaver에서 보이는 DB와 이 API가 보는 DB가 같아야 같은 글이 표시된다.

## 빠른 상태 점검

```bash
curl http://localhost:8081/api/categories
curl http://localhost:8081/api/posts
```

둘 다 `success: true`가 나오면 백엔드와 DB 연결은 정상이다.

프론트 화면은 브라우저에서 아래 주소로 확인한다.

```text
http://127.0.0.1:5173
```
