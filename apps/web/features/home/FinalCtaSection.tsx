import Link from 'next/link';
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES, Container } from '@realworkstudio/ui';
import { cn } from '@realworkstudio/utils';

export function FinalCtaSection() {
  return (
    <section className="border-t border-[var(--rws-border)] bg-[var(--rws-bg)] py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--rws-border)] bg-gradient-to-b from-[var(--rws-accent-dim)] to-transparent px-8 py-16 text-center sm:px-12">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--rws-fg)] sm:text-4xl">
            Ready to build proof, not just notes?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--rws-muted)]">
            Apply for the next cohort. We will ask a few screening questions to match you to the
            right track.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/apply" className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES.primary)}>
              Start your application
            </Link>
            <Link
              href="/programs"
              className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES.secondary)}
            >
              Browse programs
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
