import { AppHeader } from './AppHeader.jsx';

export function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-[#fff8f3] px-4 pb-16 text-[#43251d] sm:px-6">
      <section className="mx-auto w-full max-w-6xl">
        <AppHeader />
        {children}
      </section>
    </main>
  );
}
