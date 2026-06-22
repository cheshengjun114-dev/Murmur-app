import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

export function AppHeader() {
  const { isAuthenticated, userRole, clearSession } = useAuth();

  return (
    <nav className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#f1d8cc]">
      <Link className="text-xl font-extrabold text-[#a64f35] transition hover:text-[#843b27]" to="/">
        Murmur
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            {userRole === 'ADMIN' && (
              <Link className="px-3 py-2 text-sm font-semibold text-[#76584e] hover:text-[#b95f42]" to="/admin/reports">
                신고관리
              </Link>
            )}
            <Link className="px-3 py-2 text-sm font-semibold text-[#76584e] hover:text-[#b95f42]" to="/bookmarks">
              북마크
            </Link>
            <Link className="px-3 py-2 text-sm font-semibold text-[#76584e] hover:text-[#b95f42]" to="/mypage">
              마이페이지
            </Link>
            <button
              className="rounded-[8px] border border-[#e8c9bc] bg-white px-4 py-2 text-sm font-semibold text-[#a64f35] transition hover:border-[#d98b70]"
              type="button"
              onClick={clearSession}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link className="rounded-[8px] border border-[#e7d6cf] bg-white px-4 py-2 text-sm font-semibold text-[#5d4037] transition hover:border-[#d98b70]" to="/login">
              로그인
            </Link>
            <Link className="rounded-[8px] border border-[#e7d6cf] bg-white px-4 py-2 text-sm font-semibold text-[#5d4037] transition hover:border-[#d98b70]" to="/signup">
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
