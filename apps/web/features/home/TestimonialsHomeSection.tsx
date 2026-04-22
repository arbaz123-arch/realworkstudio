import Link from 'next/link';
import { Container, SectionHeading } from '@realworkstudio/ui';
import type { Testimonial } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';

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
          {testimonials.slice(0, 6).map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8"
            >
              {/* Rating stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-[var(--rws-muted)]">
                "{item.content}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <Avatar name={item.name} photoUrl={item.photoUrl} size="md" />
                <div>
                  <span className="font-semibold text-[var(--rws-fg)]">{item.name}</span>
                  <span className="text-[var(--rws-muted)]">
                    {' '}
                    · {item.role} at {item.company}
                  </span>
                </div>
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
