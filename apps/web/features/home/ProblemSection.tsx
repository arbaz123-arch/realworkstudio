import { Container, SectionHeading } from '@realworkstudio/ui';

export type ProblemSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  points: string[];
};

export function ProblemSection({ eyebrow, title, description, points }: ProblemSectionProps) {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={eyebrow ?? 'The gap'}
          title={title ?? 'The problem most learners face'}
          description={
            description ??
            'You can follow courses and still feel unprepared for real engineering expectations.'
          }
        />
        <ul className="mx-auto max-w-3xl space-y-4">
          {points.map((line) => (
            <li
              key={line}
              className="rounded-xl border border-[var(--rws-border)] bg-[var(--rws-surface)] px-6 py-4 text-[var(--rws-muted)]"
            >
              {line}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
