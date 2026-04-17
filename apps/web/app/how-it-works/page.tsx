import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getHomeContent } from '@/lib/api';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Understand the RealWorkStudio learning and delivery process.',
};

function readSteps(payload: Record<string, unknown>): Array<{ title: string; body: string }> {
  const raw = payload['howItWorksSteps'];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      title: typeof item['title'] === 'string' ? item['title'] : '',
      body: typeof item['body'] === 'string' ? item['body'] : '',
    }))
    .filter((item) => item.title !== '' && item.body !== '');
}

export default async function HowItWorksPage() {
  const content = await getHomeContent();
  const payload = content.payload;
  const title =
    typeof payload['howItWorksPageTitle'] === 'string'
      ? payload['howItWorksPageTitle']
      : typeof payload['howItWorksTitle'] === 'string'
        ? payload['howItWorksTitle']
        : 'How It Works';
  const description =
    typeof payload['howItWorksPageDescription'] === 'string'
      ? payload['howItWorksPageDescription']
      : typeof payload['howItWorksDescription'] === 'string'
        ? payload['howItWorksDescription']
        : 'A clear process to help you learn by shipping real work.';
  const steps = readSteps(payload);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[var(--rws-fg)] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-[var(--rws-muted)]">{description}</p>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rws-accent)]">
                Step {index + 1}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--rws-fg)]">{step.title}</h2>
              <p className="mt-2 text-sm text-[var(--rws-muted)]">{step.body}</p>
            </li>
          ))}
          {steps.length === 0 ? (
            <p className="text-sm text-[var(--rws-muted)]">Detailed steps are not available yet.</p>
          ) : null}
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
