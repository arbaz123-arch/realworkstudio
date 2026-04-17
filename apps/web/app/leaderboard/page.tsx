import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getLeaderboard } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Explore the RealWorkStudio public activity leaderboard.',
};

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Leaderboard</h1>
        <p className="mt-3 text-[var(--rws-muted)]">Live ranking based on tracked activity and scores.</p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--rws-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--rws-surface)] text-[var(--rws-muted)]">
              <tr>
                <th className="px-5 py-3 font-medium">Rank</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">GitHub</th>
                <th className="px-5 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rws-border)]">
              {entries.map((entry, index) => (
                <tr key={entry.id} className="bg-[var(--rws-bg)]">
                  <td className="px-5 py-3 text-[var(--rws-fg)]">{entry.rank ?? index + 1}</td>
                  <td className="px-5 py-3 text-[var(--rws-fg)]">{entry.name}</td>
                  <td className="px-5 py-3 text-[var(--rws-muted)]">
                    {entry.githubUsername ? `@${entry.githubUsername}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-[var(--rws-muted)]">{entry.score}</td>
                </tr>
              ))}
              {entries.length === 0 ? (
                <tr className="bg-[var(--rws-bg)]">
                  <td className="px-5 py-6 text-center text-[var(--rws-muted)]" colSpan={4}>
                    No leaderboard entries available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
