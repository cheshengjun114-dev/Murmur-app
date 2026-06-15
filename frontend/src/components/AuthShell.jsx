import { Link } from 'react-router-dom';

export function AuthShell({ title, subtitle, children, footerText, footerLinkText, footerTo }) {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-10 text-stone-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[8px] border border-stone-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="hidden bg-[#17443f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-emerald-100">MURMUR</p>
              <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-tight">
                부담 없이 쓰고, 조용히 공감받는 공간
              </h1>
            </div>
            <div className="space-y-4 text-sm leading-6 text-emerald-50">
              <p>익명 번호는 게시글마다 새로 부여되고, 작성자 정보는 공개되지 않습니다.</p>
              <p>신고와 제재 흐름은 운영자가 관리할 수 있도록 설계됩니다.</p>
            </div>
          </aside>

          <div className="px-6 py-9 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-bold text-[#c15d35]">Murmur</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{subtitle}</p>
              </div>

              {children}

              <p className="mt-8 text-center text-sm text-stone-600">
                {footerText}{' '}
                <Link className="font-semibold text-[#17443f] underline-offset-4 hover:underline" to={footerTo}>
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
