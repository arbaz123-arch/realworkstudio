import { Container, SectionHeading } from '@realworkstudio/ui';

type ExposureItem = {
  title: string;
  body: string;
};

export type RealWorkExposureSectionProps = {
  title?: string;
  description?: string;
  items: ExposureItem[];
};

export function RealWorkExposureSection({
  title,
  description,
  items,
}: RealWorkExposureSectionProps) {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Real work exposure"
          title={title ?? 'Practice the habits of shipping teams'}
          description={
            description ??
            'Reviews, branching, small PRs, and iteration — so your GitHub tells a credible story.'
          }
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-dashed border-[var(--rws-border)] bg-[var(--rws-surface)] p-6 text-center"
            >
              <p className="text-lg font-semibold text-[var(--rws-fg)]">{item.title}</p>
              <p className="mt-2 text-sm text-[var(--rws-muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
