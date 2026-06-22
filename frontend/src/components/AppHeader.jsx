import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

export function AppHeader() {
  const { isAuthenticated, userRole, clearSession } = useAuth();

  return (
    <nav className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80">
      <Link className="text-xl font-extrabold text-violet-700 transition hover:text-violet-800" to="/">
        Murmur
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            {userRole === 'ADMIN' && (
              <Link className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-violet-700" to="/admin/reports">
                신고관리
              </Link>
            )}
            <Link className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-violet-700" to="/bookmarks">
              북마크
            </Link>
            <Link className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-violet-700" to="/mypage">
              마이페이지
            </Link>
            <button
              className="rounded-[8px] border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400"
              type="button"
              onClick={clearSession}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700" to="/login">
              로그인
            </Link>
            <Link className="rounded-[8px] bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700" to="/signup">
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
