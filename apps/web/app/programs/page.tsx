import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getPrograms } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Programs | RealWorkStudio - Project-Based Coding Training',
  description:
    'Explore our project-based coding programs. Learn AI development, full-stack engineering, and build real-world projects that employers trust.',
  keywords: [
    'coding programs',
    'AI developer training',
    'full-stack training',
    'project-based learning',
    'software development courses',
    'coding bootcamp India',
    'developer training programs',
  ],
  openGraph: {
    title: 'Programs | RealWorkStudio',
    description: 'Explore our project-based coding programs and build real-world projects.',
    type: 'website',
  },
  alternates: {
    canonical: '/programs',
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Programs</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Explore all available programs and open each program for detailed information.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.id}
              className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6"
            >
              <h2 className="text-xl font-semibold text-[var(--rws-fg)]">{program.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--rws-muted)]">
                {program.description}
              </p>
              {program.skills.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-medium text-[var(--rws-fg)]">Skills covered</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {program.skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-1 text-xs text-[var(--rws-fg)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="mt-4 text-sm font-medium text-[var(--rws-fg)]">
                Price: ₹{program.price.toFixed(2)}
              </p>
              <Link
                href={`/programs/${program.slug}`}
                className="mt-5 inline-block text-sm font-medium text-[var(--rws-accent)] hover:underline"
              >
                View details →
              </Link>
            </article>
          ))}
          {programs.length === 0 ? (
            <p className="text-sm text-[var(--rws-muted)]">No programs available right now.</p>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
