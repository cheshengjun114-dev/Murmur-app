import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

export function HomePage() {
  const { isAuthenticated, clearSession } = useAuth();

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-8 text-stone-950">
      <section className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between border-b border-stone-200 pb-5">
          <Link className="text-2xl font-bold text-[#17443f]" to="/">
            Murmur
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link className="rounded-[8px] px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white" to="/mypage">
                  마이페이지
                </Link>
                <button
                  className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-500"
                  type="button"
                  onClick={clearSession}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-[8px] px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white" to="/login">
                  로그인
                </Link>
                <Link className="rounded-[8px] bg-[#17443f] px-4 py-2 text-sm font-semibold text-white" to="/signup">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="grid gap-6 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <section>
            <p className="text-sm font-bold text-[#c15d35]">익명 커뮤니티</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-950">오늘의 고민과 일상을 편하게 남겨보세요.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              로그인하면 글 작성, 댓글, 반응, 북마크를 사용할 수 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="rounded-[8px] bg-[#17443f] px-5 py-3 text-sm font-semibold text-white" to="/posts/new">
                글쓰기
              </Link>
              <Link className="rounded-[8px] border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800" to="/categories/company">
                회사 글 보기
              </Link>
            </div>
          </section>

          <aside className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">3일차 진행 상태</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              <li>로그인 화면 구현</li>
              <li>회원가입 화면 구현</li>
              <li>토큰 저장 및 자동 헤더 첨부</li>
              <li>비로그인 보호 라우트 연결</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
