'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ProgramOption = {
  id: string;
  title: string;
};

type TestimonialsFiltersProps = {
  programs: ProgramOption[];
  selectedProgramId?: string;
  selectedType?: 'text' | 'video';
};

export function TestimonialsFilters({
  programs,
  selectedProgramId,
  selectedType,
}: TestimonialsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const baseParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(baseParams.toString());
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-[var(--rws-fg)]">Program</label>
        <select
          value={selectedProgramId ?? ''}
          onChange={(e) => setParam('programId', e.target.value || undefined)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
        >
          <option value="">All programs</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--rws-fg)]">Type</label>
        <select
          value={selectedType ?? ''}
          onChange={(e) => setParam('type', e.target.value || undefined)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
        >
          <option value="">All</option>
          <option value="text">Text</option>
          <option value="video">Video</option>
        </select>
      </div>
    </div>
  );
}

