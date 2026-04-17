'use client';

import { useEffect, useState } from 'react';

type DashboardStats = {
  totalPrograms: number;
  totalTestimonials: number;
  totalApplications: number;
};

const initialStats: DashboardStats = {
  totalPrograms: 0,
  totalTestimonials: 0,
  totalApplications: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = (await res.json()) as DashboardStats & { error?: string };
        if (!res.ok) {
          setError(typeof data.error === 'string' ? data.error : 'Failed to load dashboard');
          return;
        }
        setStats({
          totalPrograms: data.totalPrograms,
          totalTestimonials: data.totalTestimonials,
          totalApplications: data.totalApplications,
        });
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Overview of key admin metrics.</p>

      {loading ? <p className="mt-6 text-sm text-slate-500">Loading dashboard...</p> : null}
      {error !== null ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {!loading && error === null ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total programs</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalPrograms}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total testimonials</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalTestimonials}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total applications</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalApplications}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
