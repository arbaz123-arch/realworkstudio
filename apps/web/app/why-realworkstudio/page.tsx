import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getHomeContent } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Why RealWorkStudio | Real Developer Training Benefits',
  description:
    'Discover why RealWorkStudio is the best choice for real developer training. Project-based learning with measurable outcomes.',
  keywords: [
    'why choose RealWorkStudio',
    'developer training benefits',
    'project-based coding',
    'job-ready developer training',
    'practical coding skills',
  ],
  openGraph: {
    title: 'Why RealWorkStudio | Real Developer Training',
    description: 'Discover why RealWorkStudio is the best choice for real developer training.',
    type: 'website',
  },
  alternates: {
    canonical: '/why-realworkstudio',
  },
};

function readPoints(payload: Record<string, unknown>, key: string): string[] {
  const raw = payload[key];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

export default async function WhyRealWorkStudioPage() {
  const content = await getHomeContent();
  const payload = content.payload;

  const title =
    typeof payload['whyPageTitle'] === 'string'
      ? payload['whyPageTitle']
      : 'Why RealWorkStudio';
  const description =
    typeof payload['whyPageDescription'] === 'string'
      ? payload['whyPageDescription']
      : 'We focus on real work, measurable outcomes, and interview-ready proof.';

  const points = [
    ...readPoints(payload, 'industryExpectationPoints'),
    ...readPoints(payload, 'differentiationPoints'),
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-[var(--rws-muted)]">{description}</p>

        <ul className="mt-10 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="rounded-xl border border-[var(--rws-border)] bg-[var(--rws-surface)] px-5 py-4 text-sm text-[var(--rws-muted)]"
            >
              {point}
            </li>
          ))}
          {points.length === 0 ? (
            <p className="text-sm text-[var(--rws-muted)]">Reasons will be published soon.</p>
          ) : null}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
