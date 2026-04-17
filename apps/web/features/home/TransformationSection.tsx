import { Container, SectionHeading } from '@realworkstudio/ui';

export type TransformationSectionProps = {
  title?: string;
  description?: string;
  beforeLabel?: string;
  beforeText?: string;
  afterLabel?: string;
  afterText?: string;
};

export function TransformationSection({
  title,
  description,
  beforeLabel,
  beforeText,
  afterLabel,
  afterText,
}: TransformationSectionProps) {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Outcome"
          title={title ?? 'From learning → to proof'}
          description={
            description ??
            'The goal is not more content — it is a portfolio and habits that survive interviews.'
          }
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8">
            <p className="text-sm font-semibold text-[var(--rws-muted)]">{beforeLabel ?? 'Before'}</p>
            <p className="mt-3 text-[var(--rws-fg)]">
              {beforeText ?? 'Courses completed, but little public evidence of how you work.'}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8">
            <p className="text-sm font-semibold text-[var(--rws-accent)]">{afterLabel ?? 'After'}</p>
            <p className="mt-3 text-[var(--rws-fg)]">
              {afterText ??
                'A trail of shipped slices, reviews, and artifacts you can point to in interviews.'}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
