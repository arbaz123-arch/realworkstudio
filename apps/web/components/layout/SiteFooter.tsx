import Link from 'next/link';
import { APP_NAME } from '@realworkstudio/config';
import { Container } from '@realworkstudio/ui';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-[var(--rws-fg)]">{APP_NAME}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--rws-muted)]">
              Industry-aligned programs, real repos, and feedback that moves your career.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--rws-fg)]">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--rws-muted)]">
              <li>
                <Link href="/programs" className="hover:text-[var(--rws-fg)]">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--rws-fg)]">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-[var(--rws-fg)]">
                  Apply
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--rws-fg)]">Community</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--rws-muted)]">
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--rws-fg)]">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-[var(--rws-fg)]">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--rws-fg)]">Legal</p>
            <p className="mt-4 text-sm text-[var(--rws-muted)]">
              Policies will be linked here in a later phase.
            </p>
          </div>
        </div>
        <p className="mt-12 border-t border-[var(--rws-border)] pt-8 text-center text-sm text-[var(--rws-muted)]">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
