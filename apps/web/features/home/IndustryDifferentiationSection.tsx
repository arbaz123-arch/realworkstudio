import { Container, SectionHeading } from '@realworkstudio/ui';

export type IndustryDifferentiationSectionProps = {
  expectationTitle?: string;
  expectationDescription?: string;
  expectationPoints: string[];
  differentiationTitle?: string;
  differentiationDescription?: string;
  differentiationPoints: string[];
};

export function IndustryDifferentiationSection({
  expectationTitle,
  expectationDescription,
  expectationPoints,
  differentiationTitle,
  differentiationDescription,
  differentiationPoints,
}: IndustryDifferentiationSectionProps) {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Industry expectation"
              title={expectationTitle ?? 'What teams actually look for'}
              description={
                expectationDescription ??
                'Hiring is increasingly evidence-driven: repos, commits, and how you think through tradeoffs.'
              }
            />
            <ul className="mt-8 space-y-3 text-[var(--rws-muted)]">
              {expectationPoints.map((line) => (
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
              title={differentiationTitle ?? 'How RealWorkStudio is different'}
              description={
                differentiationDescription ??
                'We optimize for outcomes you can verify: shipped work, public activity, and repeatable habits.'
              }
            />
            <ul className="mt-8 space-y-3 text-[var(--rws-muted)]">
              {differentiationPoints.map((line) => (
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
