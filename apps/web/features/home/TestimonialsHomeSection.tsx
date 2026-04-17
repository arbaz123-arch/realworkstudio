import Link from 'next/link';
import { Container, SectionHeading } from '@realworkstudio/ui';
import type { Testimonial } from '@/types/api';

export type TestimonialsHomeSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsHomeSection({ testimonials }: TestimonialsHomeSectionProps) {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Social proof"
          title="What learners say"
          description="Stories from learners who have shipped real work."
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
          {testimonials.map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8"
            >
              <blockquote className="text-base leading-relaxed text-[var(--rws-muted)]">
                “{item.content}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-[var(--rws-fg)]">{item.name}</span>
                <span className="text-[var(--rws-muted)]">
                  {' '}
                  · {item.role} at {item.company}
                </span>
              </figcaption>
            </figure>
          ))}
          {testimonials.length === 0 ? (
            <p className="text-sm text-[var(--rws-muted)]">No testimonials available yet.</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
