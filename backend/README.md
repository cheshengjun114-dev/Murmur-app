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
