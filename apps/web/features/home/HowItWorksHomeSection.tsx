import Link from 'next/link';
import { Container, SectionHeading } from '@realworkstudio/ui';

const steps: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'Pick a track',
    body: 'Choose a program aligned to the role you want to grow into.',
  },
  {
    title: 'Ship in milestones',
    body: 'Build in small, reviewable slices — similar to real team cadence.',
  },
  {
    title: 'Publish proof',
    body: 'Turn work into portfolio artifacts recruiters can click through.',
  },
];

export function HowItWorksHomeSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Process"
          title="How it works"
          description="A simple loop designed to turn learning into visible outcomes."
        />
        <div className="mx-auto mt-4 max-w-2xl text-center">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--rws-accent)] hover:underline"
          >
            Read the full breakdown →
          </Link>
        </div>
        <ol className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--rws-accent)]">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--rws-fg)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--rws-muted)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
