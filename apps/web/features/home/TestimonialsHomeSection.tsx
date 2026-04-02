import Link from 'next/link';
import { Container, SectionHeading } from '@realworkstudio/ui';

const placeholderQuotes: ReadonlyArray<{ quote: string; name: string; role: string }> = [
  {
    quote:
      'Static placeholder — testimonials will load from the API in Phase 3, with media via Firebase when enabled.',
    name: 'Coming soon',
    role: 'Learner',
  },
  {
    quote: 'This section is wired for layout only in Phase 1.',
    name: 'Coming soon',
    role: 'Learner',
  },
];

export function TestimonialsHomeSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Social proof"
          title="What learners say"
          description="Real stories will appear here once the testimonials API is connected."
        />
        <div className="mx-auto mt-4 max-w-2xl text-center">
          <Link
            href="/testimonials"
            className="text-sm font-medium text-[var(--rws-accent)] hover:underline"
          >
            View all testimonials →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {placeholderQuotes.map((item) => (
            <figure
              key={item.quote}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8"
            >
              <blockquote className="text-base leading-relaxed text-[var(--rws-muted)]">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-[var(--rws-fg)]">{item.name}</span>
                <span className="text-[var(--rws-muted)]"> · {item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
