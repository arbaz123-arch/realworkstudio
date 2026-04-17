import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import {
  getHomeContent,
  getLeaderboard,
  getPrograms,
  getTestimonials,
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

function parseSteps(value: unknown): Array<{ title: string; body: string }> {
  return asObjectArray(value)
    .map((item) => ({
      title: asString(item['title']) ?? '',
      body: asString(item['body']) ?? '',
    }))
    .filter((item) => item.title !== '' && item.body !== '');
}

export default async function HomePage() {
  const [contentRes, programsRes, testimonialsRes, leaderboardRes] = await Promise.allSettled([
    getHomeContent(),
    getPrograms(),
    getTestimonials(),
    getLeaderboard(),
  ]);

  const contentPayload =
    contentRes.status === 'fulfilled' ? contentRes.value.payload : ({} as Record<string, unknown>);
  const featuredPrograms = programsRes.status === 'fulfilled' ? programsRes.value : [];
  const testimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.slice(0, 4) : [];
  const leaderboard = leaderboardRes.status === 'fulfilled' ? leaderboardRes.value.slice(0, 5) : [];

  const problemPoints = asStringArray(contentPayload['problemPoints']);
  const expectationPoints = asStringArray(contentPayload['industryExpectationPoints']);
  const differentiationPoints = asStringArray(contentPayload['differentiationPoints']);
  const howSteps = parseSteps(contentPayload['howItWorksSteps']);
  const aiPractices = asStringArray(contentPayload['aiTrainingPractices']);
  const exposureItems = parseSteps(contentPayload['realWorkExposureItems']);

  return (
    <>
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
