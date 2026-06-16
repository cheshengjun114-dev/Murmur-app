import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

export function AppHeader() {
  const { isAuthenticated, userRole, clearSession } = useAuth();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
      <Link className="text-2xl font-bold text-[#17443f]" to="/">
        Murmur
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            {userRole === 'ADMIN' && (
              <Link className="rounded-[8px] px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white" to="/admin/reports">
                신고관리
              </Link>
            )}
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
  );
}
