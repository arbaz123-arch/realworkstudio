'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { APP_NAME } from '@realworkstudio/config';
import { cn } from '@realworkstudio/utils';
import type { ReactNode } from 'react';

const nav: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/programs', label: 'Programs' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/applications', label: 'Applications' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/seo', label: 'SEO' },
  { href: '/content', label: 'Content' },
  { href: '/media', label: 'Media' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col bg-[var(--admin-sidebar)] text-white">
        <div className="border-b border-slate-700 px-4 py-4">
          <p className="text-sm font-semibold">{APP_NAME}</p>
          <p className="text-xs text-[var(--admin-sidebar-muted)]">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition',
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? 'bg-slate-700 text-white'
                  : 'text-[var(--admin-sidebar-muted)] hover:bg-slate-800 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-700 p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--admin-sidebar-muted)] hover:bg-slate-800 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
