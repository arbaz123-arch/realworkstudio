'use client';

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-[var(--rws-max-width)] px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-[var(--rws-fg)]">Something went wrong</h2>
      <p className="mt-3 text-sm text-[var(--rws-muted)]">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-[var(--rws-accent)] px-4 py-2 text-sm font-medium text-[var(--rws-bg)]"
      >
        Try again
      </button>
    </div>
  );
}
