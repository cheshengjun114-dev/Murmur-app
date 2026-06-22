import { AppHeader } from './AppHeader.jsx';

export function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 pb-16 text-slate-950 sm:px-6">
      <section className="mx-auto w-full max-w-6xl">
        <AppHeader />
        {children}
      </section>
    </main>
  );
}
