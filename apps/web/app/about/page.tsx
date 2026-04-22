import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getHomeContent } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About RealWorkStudio | Our Mission & Vision',
  description:
    'Learn about RealWorkStudio\'s mission to make developers job-ready through real project experience.',
  keywords: [
    'about RealWorkStudio',
    'coding training mission',
    'developer education vision',
    'project-based learning company',
  ],
  openGraph: {
    title: 'About RealWorkStudio',
    description: 'Learn about our mission to make developers job-ready.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default async function AboutPage() {
  const content = await getHomeContent();
  const payload = content.payload;
  const title = typeof payload['aboutPageTitle'] === 'string' ? payload['aboutPageTitle'] : 'About RealWorkStudio';
  const description =
    typeof payload['aboutPageDescription'] === 'string'
      ? payload['aboutPageDescription']
      : 'RealWorkStudio helps learners become industry-ready by shipping real work and measurable outcomes.';

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-[var(--rws-muted)]">{description}</p>
      </main>
      <SiteFooter />
    </>
  );
}
