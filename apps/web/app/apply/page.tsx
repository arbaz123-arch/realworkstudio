import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ApplyForm } from '@/features/apply/ApplyForm';
import { getHomeContent, getPrograms } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Apply',
  description: 'Submit your application for RealWorkStudio programs.',
};

export default async function ApplyPage() {
  const [programs, content] = await Promise.all([getPrograms(), getHomeContent()]);
  const payload = content.payload;
  const rawQuestions = payload['applyQuestions'];
  const questions: Array<{ id: string; label: string }> = Array.isArray(rawQuestions)
    ? rawQuestions
        .filter((q): q is Record<string, unknown> => typeof q === 'object' && q !== null)
        .map((q) => ({
          id: typeof q['id'] === 'string' && q['id'].trim() !== '' ? q['id'] : '',
          label: typeof q['label'] === 'string' && q['label'].trim() !== '' ? q['label'] : '',
        }))
        .filter((q) => q.id !== '' && q.label !== '')
    : [
        { id: 'q1', label: 'Question 1' },
        { id: 'q2', label: 'Question 2' },
        { id: 'q3', label: 'Question 3' },
      ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">Apply</h1>
        <p className="mt-3 text-[var(--rws-muted)]">
          Fill in your details and choose the program you want to apply for.
        </p>
        <ApplyForm
          programs={programs.map((program) => ({ id: program.id, title: program.title }))}
          questions={questions}
        />
      </main>
      <SiteFooter />
    </>
  );
}
