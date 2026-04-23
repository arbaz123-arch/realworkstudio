'use client';

import { useState } from 'react';

type ProgramOption = {
  id: string;
  title: string;
};

type ApplicantStatus = 'STUDENT' | 'GRADUATE';

type ApplyFormProps = {
  programs: ProgramOption[];
};

const STUDENT_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const GRADUATE_EXPERIENCE = ['Fresher', '0-1 yr', '1-3 yrs', '3+ yrs'];

export function ApplyForm({ programs }: ApplyFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programId, setProgramId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [status, setStatus] = useState<ApplicantStatus>('STUDENT');
  const [currentYearOrExperience, setCurrentYearOrExperience] = useState('');
  const [motivation, setMotivation] = useState('');
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
    if (phone.trim().length < 5) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (programId === '') {
      setError('Please select a program.');
      return;
    }
    if (collegeName.trim().length < 2) {
      setError('Please enter a valid college name.');
      return;
    }
    if (currentYearOrExperience === '') {
      setError(`Please select your ${status === 'STUDENT' ? 'current year' : 'experience level'}.`);
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
          phone,
          programId,
          collegeName,
          status,
          currentYearOrExperience,
          motivation: motivation.trim() || undefined,
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
      setCollegeName('');
      setStatus('STUDENT');
      setCurrentYearOrExperience('');
      setMotivation('');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const yearOrExpOptions = status === 'STUDENT' ? STUDENT_YEARS : GRADUATE_EXPERIENCE;

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-[var(--rws-border)] bg-[var(--rws-surface)] p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--rws-fg)]">
          Name <span className="text-red-500">*</span>
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
          Email <span className="text-red-500">*</span>
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
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        />
      </div>

      <div>
        <label htmlFor="college" className="block text-sm font-medium text-[var(--rws-fg)]">
          College Name <span className="text-red-500">*</span>
        </label>
        <input
          id="college"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="Enter your college or institution name"
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        />
      </div>

      <div>
        <label htmlFor="program" className="block text-sm font-medium text-[var(--rws-fg)]">
          Program <span className="text-red-500">*</span>
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

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-[var(--rws-fg)]">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => {
            const newStatus = e.target.value as ApplicantStatus;
            setStatus(newStatus);
            setCurrentYearOrExperience(''); // Reset when status changes
          }}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        >
          <option value="STUDENT">Student</option>
          <option value="GRADUATE">Graduate</option>
        </select>
      </div>

      <div>
        <label htmlFor="yearOrExp" className="block text-sm font-medium text-[var(--rws-fg)]">
          {status === 'STUDENT' ? 'Current Year' : 'Experience Level'} <span className="text-red-500">*</span>
        </label>
        <select
          id="yearOrExp"
          value={currentYearOrExperience}
          onChange={(e) => setCurrentYearOrExperience(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
          required
        >
          <option value="">Select {status === 'STUDENT' ? 'year' : 'experience'}</option>
          {yearOrExpOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="motivation" className="block text-sm font-medium text-[var(--rws-fg)]">
          Why do you want to join this program? <span className="text-slate-400">(Optional)</span>
        </label>
        <textarea
          id="motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Tell us what motivates you to apply..."
          rows={3}
          className="mt-2 w-full rounded-md border border-[var(--rws-border)] bg-[var(--rws-bg)] px-3 py-2 text-sm text-[var(--rws-fg)]"
        />
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
