import type { ReactNode } from 'react';

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`mb-10 max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rws-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--rws-fg)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-[var(--rws-muted)]">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
