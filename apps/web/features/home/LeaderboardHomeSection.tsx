import Link from 'next/link';
import { Container, SectionHeading } from '@realworkstudio/ui';

const mockRows: ReadonlyArray<{ rank: number; name: string; username: string; score: string }> = [
  { rank: 1, name: 'Example Learner', username: 'example-dev', score: '—' },
  { rank: 2, name: 'Example Learner', username: 'example-dev-2', score: '—' },
  { rank: 3, name: 'Example Learner', username: 'example-dev-3', score: '—' },
];

export function LeaderboardHomeSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Activity"
          title="GitHub leaderboard"
          description="A lightweight snapshot of public activity — full GitHub integration lands in Phase 3."
        />
        <div className="mx-auto mt-4 max-w-2xl text-center">
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-[var(--rws-accent)] hover:underline"
          >
            Open full leaderboard →
          </Link>
        </div>
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-[var(--rws-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--rws-surface)] text-[var(--rws-muted)]">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Activity score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rws-border)]">
              {mockRows.map((row) => (
                <tr key={row.rank} className="bg-[var(--rws-bg)]">
                  <td className="px-6 py-4 text-[var(--rws-fg)]">{row.rank}</td>
                  <td className="px-6 py-4 text-[var(--rws-fg)]">{row.name}</td>
                  <td className="px-6 py-4 text-[var(--rws-muted)]">@{row.username}</td>
                  <td className="px-6 py-4 text-[var(--rws-muted)]">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
