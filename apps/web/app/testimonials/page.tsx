import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getPrograms, getTestimonials } from '@/lib/api';
import { TestimonialsFilters } from '@/features/testimonials/TestimonialsFilters';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read learner testimonials from RealWorkStudio programs.',
};

type TestimonialsPageProps = {
  searchParams: Promise<{ programId?: string; type?: string }>;
};

function asType(value: string | undefined): 'text' | 'video' | undefined {
  if (value === 'text' || value === 'video') return value;
  return undefined;
}

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  const sp = await searchParams;
  const selectedProgramId = typeof sp.programId === 'string' ? sp.programId : undefined;
  const selectedType = asType(typeof sp.type === 'string' ? sp.type : undefined);

  const [programs, testimonials] = await Promise.all([
    getPrograms(),
    getTestimonials({ programId: selectedProgramId, type: selectedType }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Testimonials</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Feedback from learners who completed RealWorkStudio programs.
        </p>

        <TestimonialsFilters
          programs={programs.map((p) => ({ id: p.id, title: p.title }))}
          selectedProgramId={selectedProgramId}
          selectedType={selectedType}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials
            .filter((item) => item.isApproved)
            .map((item) => (
              <figure
                key={item.id}
                className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6"
              >
                {item.type === 'video' && item.videoUrl ? (
                  <div className="mb-4 aspect-video">
                    <video
                      src={item.videoUrl}
                      controls
                      preload="none"
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                ) : null}
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
                {item.programId ? (
                  <p className="mt-2 text-xs text-[var(--rws-muted)]">
                    Program: {programs.find((p) => p.id === item.programId)?.title ?? 'Unknown'}
                  </p>
                ) : null}
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
