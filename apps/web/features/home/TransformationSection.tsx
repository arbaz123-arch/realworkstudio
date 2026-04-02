import { Container, SectionHeading } from '@realworkstudio/ui';

export function TransformationSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Outcome"
          title="From learning → to proof"
          description="The goal is not more content — it is a portfolio and habits that survive interviews."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8">
            <p className="text-sm font-semibold text-[var(--rws-muted)]">Before</p>
            <p className="mt-3 text-[var(--rws-fg)]">
              Courses completed, but little public evidence of how you work.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8">
            <p className="text-sm font-semibold text-[var(--rws-accent)]">After</p>
            <p className="mt-3 text-[var(--rws-fg)]">
              A trail of shipped slices, reviews, and artifacts you can point to in interviews.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
