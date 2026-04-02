import { Container, SectionHeading } from '@realworkstudio/ui';

export function AiTrainingSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-surface)] py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="AI-assisted learning"
            title="Use AI like a senior engineer"
            description="Learn prompting for code review, test ideas, and documentation — while keeping ownership of design decisions and shipping."
          />
          <div className="rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-8">
            <p className="text-sm font-semibold text-[var(--rws-fg)]">What you practice</p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--rws-muted)]">
              <li>Turning vague requirements into a plan and milestones.</li>
              <li>Reviewing AI output critically (security, edge cases, maintainability).</li>
              <li>Writing prompts that save time without replacing thinking.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
