import Link from 'next/link';
import { APP_TAGLINE } from '@realworkstudio/config';
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES, Container } from '@realworkstudio/ui';
import { cn } from '@realworkstudio/utils';

export type HeroSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, var(--rws-accent-dim), transparent)',
        }}
      />
      <Container className="relative text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--rws-accent)]">
          {eyebrow ?? 'RealWorkStudio'}
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[var(--rws-fg)] sm:text-5xl lg:text-6xl">
          {title ?? 'Ship real projects. Build a portfolio employers trust.'}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--rws-muted)]">
          {subtitle ?? APP_TAGLINE}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryCtaHref ?? '/apply'}
            className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES.primary)}
          >
            {primaryCtaLabel ?? 'Apply for the next cohort'}
          </Link>
          <Link
            href={secondaryCtaHref ?? '/programs'}
            className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASSES.secondary)}
          >
            {secondaryCtaLabel ?? 'View programs'}
          </Link>
        </div>
      </Container>
    </section>
  );
}
