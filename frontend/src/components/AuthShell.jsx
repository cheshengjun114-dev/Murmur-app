import { Link } from 'react-router-dom';

export function AuthShell({ title, subtitle, children, footerText, footerLinkText, footerTo }) {
  return (
    <main className="min-h-screen bg-[#fff8f3] px-4 py-8 text-[#43251d] sm:px-6">
      <nav className="mx-auto flex min-h-14 w-full max-w-5xl items-center justify-between border-b border-[#f1d8cc]">
        <Link className="text-xl font-extrabold text-[#a64f35]" to="/">Murmur</Link>
        <Link className="text-sm font-semibold text-[#826258] hover:text-[#b95f42]" to="/">홈으로</Link>
      </nav>
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-5xl items-center justify-center py-10">
        <div className="w-full max-w-lg rounded-[8px] border border-[#efd8ce] bg-[#fffdfb] px-6 py-9 shadow-[0_18px_50px_rgba(120,64,43,0.08)] sm:px-10">
          <div className="mb-8">
            <p className="text-xs font-extrabold text-[#e47758]">익명 커뮤니티</p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#3f241c]">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#87675c]">{subtitle}</p>
          </div>

          {children}

          <p className="mt-8 border-t border-[#f1ded6] pt-6 text-center text-sm text-[#87675c]">
            {footerText}{' '}
            <Link className="font-bold text-[#c45f43] hover:underline" to={footerTo}>
              {footerLinkText}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
