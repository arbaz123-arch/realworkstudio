import { Container, SectionHeading } from '@realworkstudio/ui';

const expectations: ReadonlyArray<string> = [
  'Clear communication, PR hygiene, and iteration under feedback.',
  'Comfort with tools used in real teams: Git, reviews, CI basics, and shipping small slices.',
  'Evidence of ownership — not just certificates.',
];

const differentiation: ReadonlyArray<string> = [
  'Work on structured “real work” tracks with milestones you can show.',
  'Practice like a product team: scope, ship, reflect, improve.',
  'A leaderboard and portfolio signals that are easy for recruiters to understand.',
];

export function IndustryDifferentiationSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Industry expectation"
              title="What teams actually look for"
              description="Hiring is increasingly evidence-driven: repos, commits, and how you think through tradeoffs."
            />
            <ul className="mt-8 space-y-3 text-[var(--rws-muted)]">
              {expectations.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rws-accent)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Differentiation"
              title="How RealWorkStudio is different"
              description="We optimize for outcomes you can verify: shipped work, public activity, and repeatable habits."
            />
            <ul className="mt-8 space-y-3 text-[var(--rws-muted)]">
              {differentiation.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rws-accent)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
