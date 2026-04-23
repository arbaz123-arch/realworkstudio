'use client';

import { useState } from 'react';
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--rws-fg)] transition hover:bg-[var(--rws-border)] md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          <Link
            href="/apply"
            className="hidden rounded-lg bg-[var(--rws-accent)] px-4 py-2 text-sm font-semibold text-[var(--rws-bg)] transition hover:opacity-90 sm:inline-block"
          >
            Apply
          </Link>
        </div>
      </Container>

      <div
        className={`overflow-hidden border-t border-[var(--rws-border)] bg-[var(--rws-bg)] transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Container className="py-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--rws-muted)] transition hover:bg-[var(--rws-border)] hover:text-[var(--rws-fg)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={closeMobileMenu}
              className="mt-2 rounded-lg bg-[var(--rws-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--rws-bg)] transition hover:opacity-90 sm:hidden"
            >
              Apply
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
