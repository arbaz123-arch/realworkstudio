import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
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

/**
 * Phase 1: static landing sections in strict PRD order.
 * Data fetching + remaining routes ship in later phases.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <IndustryDifferentiationSection />
        <HowItWorksHomeSection />
        <AiTrainingSection />
        <RealWorkExposureSection />
        <TestimonialsHomeSection />
        <LeaderboardHomeSection />
        <TransformationSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
