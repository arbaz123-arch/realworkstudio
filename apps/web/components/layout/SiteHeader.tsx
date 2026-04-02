import Link from 'next/link';
import { APP_NAME } from '@realworkstudio/config';
import { Container } from '@realworkstudio/ui';

const navItems: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/programs', label: 'Programs' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/why-realworkstudio', label: 'Why us' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rws-border)] bg-[var(--rws-bg)]/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--rws-fg)]">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--rws-muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--rws-fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/apply"
            className="rounded-lg bg-[var(--rws-accent)] px-4 py-2 text-sm font-semibold text-[var(--rws-bg)] transition hover:opacity-90"
          >
            Apply
          </Link>
        </div>
      </Container>
    </header>
  );
}
