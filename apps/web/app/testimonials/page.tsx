import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getTestimonials } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read learner testimonials from RealWorkStudio programs.',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Testimonials</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Feedback from learners who completed RealWorkStudio programs.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6"
            >
              <blockquote className="text-sm leading-relaxed text-[var(--rws-muted)]">
                “{item.content}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
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
      </main>
      <SiteFooter />
    </>
  );
}
