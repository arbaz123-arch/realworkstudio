import { Container, SectionHeading } from '@realworkstudio/ui';

const painPoints: ReadonlyArray<string> = [
  'Tutorials do not teach how production code is reviewed, shipped, or maintained.',
  'Bootcamps often stop at demos — not deployable work hiring managers can verify.',
  'Without real repos and cadence, interviews become harder to win.',
];

export function ProblemSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The gap"
          title="The problem most learners face"
          description="You can follow courses and still feel unprepared for real engineering expectations."
        />
        <ul className="mx-auto max-w-3xl space-y-4">
          {painPoints.map((line) => (
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
