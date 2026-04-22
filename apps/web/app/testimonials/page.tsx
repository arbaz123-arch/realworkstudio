import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getPrograms, getTestimonials } from '@/lib/api';
import { TestimonialsFilters } from '@/features/testimonials/TestimonialsFilters';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { StructuredData, createReviewSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Testimonials | RealWorkStudio Student Success Stories',
  description:
    'Read success stories from RealWorkStudio graduates. See how project-based training helped them become job-ready developers.',
  keywords: [
    'coding bootcamp testimonials',
    'developer training reviews',
    'student success stories',
    'coding program outcomes',
    'job-ready developers',
  ],
  openGraph: {
    title: 'Testimonials | RealWorkStudio',
    description: 'Read success stories from RealWorkStudio graduates.',
    type: 'website',
  },
  alternates: {
    canonical: '/testimonials',
  },
};

type TestimonialsPageProps = {
  searchParams: Promise<{ programId?: string; type?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 10;

function asType(value: string | undefined): 'text' | 'video' | undefined {
  if (value === 'text' || value === 'video') return value;
  return undefined;
}

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  const sp = await searchParams;
  const selectedProgramId = typeof sp.programId === 'string' ? sp.programId : undefined;
  const selectedType = asType(typeof sp.type === 'string' ? sp.type : undefined);
  const currentPage = typeof sp.page === 'string' ? parseInt(sp.page, 10) || 1 : 1;

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [programs, testimonials] = await Promise.all([
    getPrograms(),
    getTestimonials({
      programId: selectedProgramId,
      type: selectedType,
      limit: ITEMS_PER_PAGE,
      offset,
    }),
  ]);

  // Generate structured data for all testimonials
  const reviewsStructuredData = (testimonials ?? [])
    .map((item) =>
      createReviewSchema({
        name: item.name,
        content: item.content,
        rating: item.rating,
        createdAt: item.createdAt,
      })
    )
    .filter((schema): schema is NonNullable<typeof schema> => schema !== null);

  const totalPages = Math.ceil((testimonials?.length ?? 0) / ITEMS_PER_PAGE) || 1;

  return (
    <>
      <StructuredData data={reviewsStructuredData} />
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Testimonials</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Feedback from learners who completed RealWorkStudio programs.
        </p>

        <TestimonialsFilters
          programs={(programs ?? []).map((p) => ({ id: p.id, title: p.title }))}
          selectedProgramId={selectedProgramId}
          selectedType={selectedType}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
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

              {item.programId ? (
                <p className="mt-2 text-xs text-[var(--rws-muted)]">
                  Program: {programs.find((p) => p.id === item.programId)?.title ?? 'Unknown'}
                </p>
              ) : null}
            </figure>
          ))}
          {testimonials.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-12 text-center">
              <p className="text-lg text-[var(--rws-muted)]">No testimonials available yet.</p>
              <p className="mt-2 text-sm text-[var(--rws-muted)]">
                Check back later for student success stories.
              </p>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/testimonials"
              searchParams={{
                programId: selectedProgramId,
                type: selectedType,
              }}
            />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
