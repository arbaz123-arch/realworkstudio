import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export const BUTTON_BASE_CLASS =
  'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition';

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--rws-accent)] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--rws-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rws-bg)]',
  secondary:
    'border border-[var(--rws-border)] bg-transparent text-[var(--rws-fg)] hover:bg-[var(--rws-surface)]',
  ghost: 'text-[var(--rws-muted)] hover:text-[var(--rws-fg)] underline-offset-4 hover:underline',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BUTTON_BASE_CLASS} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
