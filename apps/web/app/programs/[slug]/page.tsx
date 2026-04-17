import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ApiError, getProgramBySlug } from '@/lib/api';

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

    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">{program.title}</h1>
          <p className="mt-4 max-w-3xl text-[var(--rws-muted)]">{program.description}</p>
          <p className="mt-6 text-lg font-semibold text-[var(--rws-fg)]">
            Program fee: ${program.price.toFixed(2)}
          </p>
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
