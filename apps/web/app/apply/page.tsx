import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ApplyForm } from '@/features/apply/ApplyForm';
import { getPrograms } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Apply Now | Join RealWorkStudio Developer Program',
  description:
    'Apply to join RealWorkStudio and start your journey to becoming a job-ready developer. Project-based training with real work exposure.',
  keywords: [
    'apply coding bootcamp',
    'join developer program',
    'coding training application',
    'developer training enrollment',
    'project-based learning signup',
  ],
  openGraph: {
    title: 'Apply Now | Join RealWorkStudio',
    description: 'Apply to join RealWorkStudio and become a job-ready developer.',
    type: 'website',
  },
  alternates: {
    canonical: '/apply',
  },
};

export default async function ApplyPage() {
  let programs: Awaited<ReturnType<typeof getPrograms>> = [];
  try {
    programs = await getPrograms();
  } catch (error) {
    console.error('[ApplyPage] Failed to fetch programs:', error);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Apply</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Fill in your details and choose the program you want to apply for.
        </p>
        {programs.length === 0 ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p>Unable to load programs. Please try again later.</p>
          </div>
        ) : (
          <ApplyForm
            programs={programs.map((program) => ({ id: program.id, title: program.title }))}
          />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
