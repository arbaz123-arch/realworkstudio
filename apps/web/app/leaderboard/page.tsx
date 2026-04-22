import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getLeaderboard } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Developer Leaderboard | RealWorkStudio GitHub Activity',
  description:
    'See top contributors on RealWorkStudio. Track GitHub commits, repos, and coding activity.',
  keywords: [
    'developer leaderboard',
    'GitHub activity ranking',
    'coding contributions',
    'developer achievements',
    'GitHub commits tracking',
  ],
  openGraph: {
    title: 'Developer Leaderboard | RealWorkStudio',
    description: 'See top contributors and GitHub activity ranking.',
    type: 'website',
  },
  alternates: {
    canonical: '/leaderboard',
  },
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
                <th className="px-5 py-3 font-medium">Commits</th>
                <th className="px-5 py-3 font-medium">Repos</th>
                <th className="px-5 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rws-border)]">
              {entries.map((entry, index) => {
                const rank = entry.rank ?? index + 1;
                const isTop3 = rank <= 3;
                const rankBadge =
                  rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

                return (
                  <tr
                    key={entry.id}
                    className={`bg-[var(--rws-bg)] ${
                      isTop3 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                    }`}
                  >
                    <td className="px-5 py-3 text-[var(--rws-fg)]">
                      <span className="flex items-center gap-2">
                        {rankBadge && <span className="text-lg">{rankBadge}</span>}
                        <span className={isTop3 ? 'font-semibold' : ''}>{rank}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--rws-fg)]">
                      <span className={isTop3 ? 'font-semibold' : ''}>{entry.name}</span>
                    </td>
                    <td className="px-5 py-3 text-[var(--rws-muted)]">
                      {entry.githubUsername ? (
                        <a
                          href={`https://github.com/${entry.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--rws-accent)] hover:underline"
                        >
                          @{entry.githubUsername}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-3 text-[var(--rws-muted)]">{entry.commits}</td>
                    <td className="px-5 py-3 text-[var(--rws-muted)]">{entry.repos}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`${
                          isTop3 ? 'font-semibold text-[var(--rws-fg)]' : 'text-[var(--rws-muted)]'
                        }`}
                      >
                        {entry.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 ? (
                <tr className="bg-[var(--rws-bg)]">
                  <td className="px-5 py-6 text-center text-[var(--rws-muted)]" colSpan={6}>
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
