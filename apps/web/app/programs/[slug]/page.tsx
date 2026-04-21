import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ApiError, getProgramBySlug, getTestimonials } from '@/lib/api';

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const program = await getProgramBySlug(slug);
    return {
      title: program.title,
      description: program.description,
      openGraph: {
        title: program.title,
        description: program.description,
      },
    };
  } catch {
    return {
      title: 'Program',
      description: 'Program details',
    };
  }
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;

  try {
    const program = await getProgramBySlug(slug);
    const testimonials = await getTestimonials({ programId: program.id });

    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">{program.title}</h1>
          <p className="mt-4 max-w-3xl text-[var(--rws-muted)]">{program.description}</p>
          <p className="mt-6 text-lg font-semibold text-[var(--rws-fg)]">
            Program fee: ₹{program.price.toFixed(2)}
          </p>

          {program.skills && program.skills.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[var(--rws-fg)]">Skills Covered</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {program.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--rws-border)] bg-[var(--rws-surface)] px-3 py-1 text-sm text-[var(--rws-fg)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {program.tools && program.tools.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[var(--rws-fg)]">Tools</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {program.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-[var(--rws-border)] bg-[var(--rws-surface)] px-3 py-1 text-sm text-[var(--rws-fg)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {program.outcomes ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[var(--rws-fg)]">Outcomes</h2>
              <p className="mt-3 text-[var(--rws-muted)]">{program.outcomes}</p>
            </div>
          ) : null}

          {testimonials.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-[var(--rws-fg)]">Testimonials</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {testimonials.map((item) => (
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
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
        </main>
        <SiteFooter />
      </>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
