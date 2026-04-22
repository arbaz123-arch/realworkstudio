import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StructuredData, createCourseSchema, createReviewSchema } from '@/components/seo/StructuredData';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { Avatar } from '@/components/ui/Avatar';
import { ApiError, getProgramBySlug, getTestimonials } from '@/lib/api';

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const program = await getProgramBySlug(slug);
    return {
      title: `${program.title} | RealWorkStudio Program`,
      description: `${program.description}. Learn ${program.skills.slice(0, 3).join(', ')} and more.`,
      keywords: [
        ...program.skills,
        'coding training',
        'developer course',
        'project-based learning',
        ...(program.title ? [program.title.toLowerCase()] : []),
      ],
      openGraph: {
        title: program.title,
        description: program.description,
        type: 'article',
      },
      alternates: {
        canonical: `/programs/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Program | RealWorkStudio',
      description: 'Program details',
    };
  }
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;

  try {
    const program = await getProgramBySlug(slug);
    const testimonials = await getTestimonials({ programId: program.id });

    const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://realworkstudio.com';
    const courseSchema = createCourseSchema(program, baseUrl);

    return (
      <>
        <StructuredData data={courseSchema} />
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

          {(testimonials ?? []).length > 0 ? (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-[var(--rws-fg)]">Testimonials</h2>
              {/* Review structured data for testimonials */}
              {(testimonials ?? []).map((item) => (
                <StructuredData
                  key={`schema-${item.id}`}
                  data={createReviewSchema({
                    name: item.name,
                    content: item.content,
                    rating: item.rating,
                    createdAt: item.createdAt,
                  })}
                />
              ))}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(testimonials ?? []).map((item) => (
                  <figure
                    key={item.id}
                    className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6"
                  >
                    {item.type === 'video' && item.videoUrl ? (
                      <div className="mb-4">
                        <VideoPlayer videoUrl={item.videoUrl} className="aspect-video" />
                      </div>
                    ) : null}

                    {/* Rating stars */}
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <blockquote className="text-sm leading-relaxed text-[var(--rws-muted)]">
                      "{item.content}"
                    </blockquote>

                    <figcaption className="mt-4 flex items-center gap-3 text-sm">
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
