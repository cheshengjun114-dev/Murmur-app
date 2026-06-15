import { AppHeader } from './AppHeader.jsx';

export function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-8 text-stone-950">
      <section className="mx-auto w-full max-w-5xl">
        <AppHeader />
        {children}
      </section>
    </main>
  );
}
