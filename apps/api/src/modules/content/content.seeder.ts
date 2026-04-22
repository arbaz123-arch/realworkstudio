// Content seeder for first-load experience
// Automatically inserts default content if database is empty

import type { ContentRepository } from './content.repository.js';

export const DEFAULT_HOME_CONTENT = {
  hero: {
    eyebrow: 'RealWorkStudio',
    title: 'Learn Like a Real Developer',
    subtitle: 'Ship real projects. Build a portfolio employers trust. Join RealWorkStudio for project-based coding training.',
    primaryCtaLabel: 'Apply for the next cohort',
    primaryCtaHref: '/apply',
    secondaryCtaLabel: 'View programs',
    secondaryCtaHref: '/programs',
  },
  cta: {
    title: 'Ready to build proof, not just notes?',
    description: 'Apply for the next cohort. We will ask a few screening questions to match you to the right track.',
    primaryLabel: 'Start your application',
    primaryHref: '/apply',
    secondaryLabel: 'Browse programs',
    secondaryHref: '/programs',
  },
  section_headings: {
    problemEyebrow: 'The gap',
    problemTitle: 'The problem most learners face',
    problemDescription: 'You can follow courses and still feel unprepared for real engineering expectations.',
    problemPoints: [
      'Courses teach syntax, not production systems',
      'Portfolio projects look like tutorials',
      'No code review or real feedback loops',
      'Missing collaboration and shipping experience',
    ],
    industryExpectationTitle: 'Industry expectations',
    industryExpectationDescription: 'Employers look for evidence of real-world capability.',
    industryExpectationPoints: [
      'Ship production-grade features',
      'Collaborate with senior engineers',
      'Handle code reviews and feedback',
      'Work with real constraints and deadlines',
    ],
    differentiationTitle: 'How we are different',
    differentiationDescription: 'We simulate a real company environment from day one.',
    differentiationPoints: [
      'Real projects with real constraints',
      'Senior engineer mentorship',
      'Production-like workflows',
      'Portfolio that proves capability',
    ],
    howItWorksTitle: 'How it works',
    howItWorksDescription: 'A simple loop designed to turn learning into visible outcomes.',
    howItWorksSteps: [
      { title: 'Apply', body: 'Submit your application with background and goals' },
      { title: 'Build', body: 'Work on real projects with mentorship and feedback' },
      { title: 'Ship', body: 'Deploy to production and build your portfolio' },
    ],
    aiTrainingTitle: 'AI-Native Training',
    aiTrainingDescription: 'Learn to work with AI tools as a multiplier, not a replacement.',
    aiTrainingPractices: [
      'Use AI for rapid prototyping',
      'Understand AI limitations',
      'Maintain code quality with AI assistance',
      'Leverage AI for learning acceleration',
    ],
    realWorkExposureTitle: 'Real Work Exposure',
    realWorkExposureDescription: 'Experience what it is like to work in a real engineering team.',
    realWorkExposureItems: [
      { title: 'Code Reviews', body: 'Regular feedback from senior engineers' },
      { title: 'Sprint Planning', body: 'Estimate and commit to deliverables' },
      { title: 'Production Deploys', body: 'Ship to real users with monitoring' },
    ],
    transformationTitle: 'The transformation',
    transformationDescription: 'From learner to builder in a structured environment.',
    transformationBeforeLabel: 'Before',
    transformationBeforeText: 'Following tutorials, building toy projects, unsure of readiness',
    transformationAfterLabel: 'After',
    transformationAfterText: 'Shipping production code, confident in real-world engineering',
  },
};

export class ContentSeeder {
  constructor(private readonly repository: ContentRepository) {}

  async seedIfEmpty(): Promise<void> {
    // Check if content already exists
    const existingBlocks = await this.repository.getBlocksByPage('home');
    const hasExistingContent = Object.keys(existingBlocks).length > 0;

    if (hasExistingContent) {
      console.log('[ContentSeeder] Content already exists, skipping seed');
      return;
    }

    console.log('[ContentSeeder] Seeding default content...');

    // Seed each content block
    for (const [key, value] of Object.entries(DEFAULT_HOME_CONTENT)) {
      try {
        await this.repository.upsertBlock(key, value as Record<string, unknown>, 'home');
        console.log(`[ContentSeeder] Seeded: ${key}`);
      } catch (err) {
        console.error(`[ContentSeeder] Failed to seed ${key}:`, err);
      }
    }

    console.log('[ContentSeeder] Default content seeded successfully');
  }
}
