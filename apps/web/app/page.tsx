import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StructuredData, createOrganizationSchema, createWebPageSchema } from '@/components/seo/StructuredData';
import {
  getPageContent,
  getLeaderboard,
  getPrograms,
  getFeaturedTestimonials,
} from '@/lib/api';
import { AiTrainingSection } from '@/features/home/AiTrainingSection';
import { FinalCtaSection } from '@/features/home/FinalCtaSection';
import { HeroSection } from '@/features/home/HeroSection';
import { HowItWorksHomeSection } from '@/features/home/HowItWorksHomeSection';
import { IndustryDifferentiationSection } from '@/features/home/IndustryDifferentiationSection';
import { LeaderboardHomeSection } from '@/features/home/LeaderboardHomeSection';
import { ProblemSection } from '@/features/home/ProblemSection';
import { RealWorkExposureSection } from '@/features/home/RealWorkExposureSection';
import { TestimonialsHomeSection } from '@/features/home/TestimonialsHomeSection';
import { TransformationSection } from '@/features/home/TransformationSection';

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

function asObjectArray(
  value: unknown
): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === 'object' && item !== null && !Array.isArray(item)
  );
}

// ISR: Revalidate page every 60 seconds to refresh CMS content
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'RealWorkStudio | Real Developer Training with Real Projects',
  description:
    'Ship real projects. Build a portfolio employers trust. Join RealWorkStudio for project-based coding training and become a job-ready developer.',
  keywords: [
    'real developer training',
    'project-based coding training',
    'AI developer training India',
    'company-style learning',
    'coding bootcamp',
    'software development training',
    'portfolio building',
    'job-ready developers',
  ],
  openGraph: {
    title: 'RealWorkStudio | Real Developer Training with Real Projects',
    description:
      'Ship real projects. Build a portfolio employers trust. Join RealWorkStudio for project-based coding training.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'RealWorkStudio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealWorkStudio | Real Developer Training',
    description: 'Ship real projects. Build a portfolio employers trust.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

function parseSteps(value: unknown): Array<{ title: string; body: string }> {
  return asObjectArray(value)
    .map((item) => ({
      title: asString(item['title']) ?? '',
      body: asString(item['body']) ?? '',
    }))
    .filter((item) => item.title !== '' && item.body !== '');
}

export default async function HomePage() {
  const [pageContentRes, programsRes, testimonialsRes, leaderboardRes] = await Promise.allSettled([
    getPageContent('home'),
    getPrograms(),
    getFeaturedTestimonials(),
    getLeaderboard(),
  ]);

  // Extract blocks from page content response
  const pageContent = pageContentRes.status === 'fulfilled' ? pageContentRes.value.blocks : {};
  const heroValue = pageContent['hero'] ?? {};
  const ctaValue = pageContent['cta'] ?? {};
  const headingsValue = pageContent['section_headings'] ?? {};

  const contentPayload: Record<string, unknown> = {
    // Hero section mappings
    heroEyebrow: heroValue['eyebrow'],
    heroTitle: heroValue['title'],
    heroSubtitle: heroValue['subtitle'],
    heroPrimaryCtaLabel: heroValue['primaryCtaLabel'],
    heroPrimaryCtaHref: heroValue['primaryCtaHref'],
    heroSecondaryCtaLabel: heroValue['secondaryCtaLabel'],
    heroSecondaryCtaHref: heroValue['secondaryCtaHref'],
    // CTA section mappings
    finalCtaTitle: ctaValue['title'],
    finalCtaDescription: ctaValue['description'],
    finalCtaPrimaryLabel: ctaValue['primaryLabel'],
    finalCtaPrimaryHref: ctaValue['primaryHref'],
    finalCtaSecondaryLabel: ctaValue['secondaryLabel'],
    finalCtaSecondaryHref: ctaValue['secondaryHref'],
    // Section headings mappings
    ...headingsValue,
  };
  const featuredPrograms = programsRes.status === 'fulfilled' ? programsRes.value : [];
  const testimonials =
    testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.slice(0, 4) : [];
  const leaderboard = leaderboardRes.status === 'fulfilled' ? leaderboardRes.value.slice(0, 5) : [];

  const problemPoints = asStringArray(contentPayload['problemPoints']);
  const expectationPoints = asStringArray(contentPayload['industryExpectationPoints']);
  const differentiationPoints = asStringArray(contentPayload['differentiationPoints']);
  const howSteps = parseSteps(contentPayload['howItWorksSteps']);
  const aiPractices = asStringArray(contentPayload['aiTrainingPractices']);
  const exposureItems = parseSteps(contentPayload['realWorkExposureItems']);

  const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://realworkstudio.com';
  const organizationSchema = createOrganizationSchema(baseUrl);
  const webPageSchema = createWebPageSchema(
    'RealWorkStudio | Real Developer Training',
    'Ship real projects. Build a portfolio employers trust.',
    baseUrl
  );

  // Filter out null schemas to satisfy TypeScript
  const structuredData = [organizationSchema, webPageSchema].filter(
    (schema): schema is NonNullable<typeof schema> => schema !== null
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <SiteHeader />
      <main>
        <HeroSection
          eyebrow={asString(contentPayload['heroEyebrow'])}
          title={asString(contentPayload['heroTitle'])}
          subtitle={asString(contentPayload['heroSubtitle'])}
          primaryCtaLabel={asString(contentPayload['heroPrimaryCtaLabel'])}
          primaryCtaHref={asString(contentPayload['heroPrimaryCtaHref'])}
          secondaryCtaLabel={asString(contentPayload['heroSecondaryCtaLabel'])}
          secondaryCtaHref={asString(contentPayload['heroSecondaryCtaHref'])}
        />
        <ProblemSection
          eyebrow={asString(contentPayload['problemEyebrow'])}
          title={asString(contentPayload['problemTitle'])}
          description={asString(contentPayload['problemDescription'])}
          points={problemPoints}
        />
        <IndustryDifferentiationSection
          expectationTitle={asString(contentPayload['industryExpectationTitle'])}
          expectationDescription={asString(contentPayload['industryExpectationDescription'])}
          expectationPoints={expectationPoints}
          differentiationTitle={asString(contentPayload['differentiationTitle'])}
          differentiationDescription={asString(contentPayload['differentiationDescription'])}
          differentiationPoints={differentiationPoints}
        />
        <HowItWorksHomeSection
          title={asString(contentPayload['howItWorksTitle'])}
          description={asString(contentPayload['howItWorksDescription'])}
          steps={howSteps}
        />
        <AiTrainingSection
          title={asString(contentPayload['aiTrainingTitle'])}
          description={asString(contentPayload['aiTrainingDescription'])}
          practices={aiPractices}
        />
        <RealWorkExposureSection
          title={asString(contentPayload['realWorkExposureTitle'])}
          description={asString(contentPayload['realWorkExposureDescription'])}
          items={exposureItems}
        />
        <TestimonialsHomeSection testimonials={testimonials} />
        <LeaderboardHomeSection entries={leaderboard} />
        <TransformationSection
          title={asString(contentPayload['transformationTitle'])}
          description={asString(contentPayload['transformationDescription'])}
          beforeLabel={asString(contentPayload['transformationBeforeLabel'])}
          beforeText={asString(contentPayload['transformationBeforeText'])}
          afterLabel={asString(contentPayload['transformationAfterLabel'])}
          afterText={asString(contentPayload['transformationAfterText'])}
        />
        <FinalCtaSection
          title={asString(contentPayload['finalCtaTitle'])}
          description={asString(contentPayload['finalCtaDescription'])}
          primaryCtaLabel={asString(contentPayload['finalCtaPrimaryLabel'])}
          primaryCtaHref={asString(contentPayload['finalCtaPrimaryHref'])}
          secondaryCtaLabel={asString(contentPayload['finalCtaSecondaryLabel'])}
          secondaryCtaHref={asString(contentPayload['finalCtaSecondaryHref'])}
        />
        {featuredPrograms.length === 0 ? (
          <div className="mx-auto max-w-[var(--rws-max-width)] px-4 pb-12 text-sm text-[var(--rws-muted)] sm:px-6 lg:px-8">
            Programs are not available right now.
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
