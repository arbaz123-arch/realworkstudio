'use client';

import { useState } from 'react';

type ProgramOption = {
  id: string;
  title: string;
};

type ApplyFormProps = {
  programs: ProgramOption[];
};

export function ApplyForm({ programs }: ApplyFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.trim().length < 2) {
      setError('Please enter a valid name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (programId === '') {
      setError('Please select a program.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, programId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to submit application');
        return;
      }
      setSuccess('Application submitted successfully.');
      setName('');
      setEmail('');
      setProgramId('');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--rws-fg)]">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--rws-fg)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        />
      </div>

      <div>
        <label htmlFor="program" className="block text-sm font-medium text-[var(--rws-fg)]">
          Program
        </label>
        <select
          id="program"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        >
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-[var(--rws-accent)] px-4 py-2 text-sm font-medium text-[var(--rws-bg)] disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Submit application'}
      </button>

      {error !== null ? <p className="text-sm text-red-500">{error}</p> : null}
      {success !== null ? <p className="text-sm text-green-400">{success}</p> : null}
    </form>
  );
}
