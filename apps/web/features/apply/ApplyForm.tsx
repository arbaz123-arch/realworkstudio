'use client';

import { useState } from 'react';

type ProgramOption = {
  id: string;
  title: string;
};

type ApplyQuestion = {
  id: string;
  label: string;
};

type ApplyFormProps = {
  programs: ProgramOption[];
  questions: ApplyQuestion[];
};

export function ApplyForm({ programs, questions }: ApplyFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programId, setProgramId] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          programId,
          answers,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to submit application');
        return;
      }
      setSuccess('Application submitted successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setProgramId('');
      setAnswers({});
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
        <label htmlFor="phone" className="block text-sm font-medium text-[var(--rws-fg)]">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          placeholder="Optional"
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

      {questions.length > 0 ? (
        <div className="rounded-xl border border-[var(--rws-border)] bg-[var(--rws-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--rws-fg)]">Screening questions</p>
          <div className="mt-4 grid gap-4">
            {questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-[var(--rws-fg)]">{q.label}</label>
                <textarea
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className="mt-2 min-h-20 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-surface)] px-3 py-2 text-sm text-[var(--rws-fg)]"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
