import { Container, SectionHeading } from '@realworkstudio/ui';

export function RealWorkExposureSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Real work exposure"
          title="Practice the habits of shipping teams"
          description="Reviews, branching, small PRs, and iteration — so your GitHub tells a credible story."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {['Scope', 'Ship', 'Reflect'].map((title) => (
            <div
              key={title}
              className="rounded-2xl border border-dashed border-[var(--rws-border)] bg-[var(--rws-surface)] p-6 text-center"
            >
              <p className="text-lg font-semibold text-[var(--rws-fg)]">{title}</p>
              <p className="mt-2 text-sm text-[var(--rws-muted)]">
                Placeholder for workflow detail — will connect to program content in later phases.
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
