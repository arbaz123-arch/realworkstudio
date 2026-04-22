'use client';

import { useEffect, useState } from 'react';

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  programId: string;
  programName: string | null;
  status: 'pending' | 'reviewed' | 'rejected';
  answers: Record<string, unknown>;
  createdAt: string;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApplicationListResponse = {
  data: Application[];
  meta: PaginationMeta;
};

type StatusOption = {
  value: 'pending' | 'reviewed' | 'rejected';
  label: string;
  color: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

type Program = {
  id: string;
  title: string;
};

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

  // Load programs for filter dropdown
  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch('/api/admin/programs');
        if (res.ok) {
          const data = (await res.json()) as { items: Program[] };
          console.log('Programs loaded:', data.items);
          setPrograms(data.items ?? []);
        } else {
          console.error('Failed to load programs:', res.status);
        }
      } catch (err) {
        console.error('Error loading programs:', err);
      }
    }
    loadPrograms();
  }, []);

  useEffect(() => {
    loadApplications(1);
  }, [filterStatus, searchQuery, selectedProgramIds]);

  async function loadApplications(page: number = 1) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '10');
      if (filterStatus) params.append('status', filterStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedProgramIds.length > 0) params.append('programIds', selectedProgramIds.join(','));

      const res = await fetch(`/api/admin/applications?${params}`);
      if (!res.ok) throw new Error('Failed to load applications');
      const data = (await res.json()) as ApplicationListResponse;
      setApplications(data.data);
      setMeta(data.meta);
    } catch {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: 'pending' | 'reviewed' | 'rejected') {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      setSuccess('Status updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update status');
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusClass(status: string): string {
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    return option?.color ?? 'bg-slate-100 text-slate-800';
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
      <p className="mt-2 text-sm text-slate-600">
        View and manage program applications. Total: {meta.total} | Page {meta.page} of {meta.totalPages}
      </p>

      {/* Filters Bar - Single Row Layout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        {/* LEFT: Programs Filter Dropdown */}
        <div className="relative flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Programs:</span>
          <button
            onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            {selectedProgramIds.length === 0
              ? 'All Programs'
              : `${selectedProgramIds.length} selected`}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProgramDropdownOpen && (
            <>
              {/* Backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProgramDropdownOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {/* All Programs */}
                <label className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedProgramIds.length === 0}
                    onChange={() => setSelectedProgramIds([])}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  All Programs
                </label>
                <div className="my-1 border-t border-slate-200" />
                {/* Program List */}
                {programs.length === 0 ? (
                  <span className="block px-2 py-1.5 text-sm text-slate-400">No programs</span>
                ) : (
                  programs.map((program) => (
                    <label
                      key={program.id}
                      className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProgramIds.includes(program.id)}
                        onChange={() => {
                          setSelectedProgramIds((prev) =>
                            prev.includes(program.id)
                              ? prev.filter((id) => id !== program.id)
                              : [...prev, program.id]
                          );
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      {program.title}
                    </label>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* CENTER: Search */}
        <div className="flex items-center gap-2">
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search by name and email"
            className="w-55 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        {/* RIGHT: Status + Clear + Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
              Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setFilterStatus('');
              setSearchQuery('');
              setSelectedProgramIds([]);
            }}
            className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap"
          >
            Clear filters
          </button>

          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (filterStatus) params.append('status', filterStatus);
              if (searchQuery.trim()) params.append('search', searchQuery.trim());
              if (selectedProgramIds.length > 0) params.append('programIds', selectedProgramIds.join(','));
              window.open(`/api/admin/applications/export?${params}`, '_blank');
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Messages */}
      {error !== null && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}
      {success !== null && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading applications...
        </div>
      )}

      {/* Table */}
      {!loading && applications.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No applications found.</p>
      ) : (
        <>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Applied</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{app.name}</td>
                  <td className="px-4 py-3 text-slate-600">{app.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {app.programName ?? app.programId}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value as 'pending' | 'reviewed' | 'rejected')
                        }
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => loadApplications(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum = i + 1;
                if (meta.totalPages > 5) {
                  if (meta.page > 3) {
                    pageNum = meta.page - 2 + i;
                  }
                  if (pageNum > meta.totalPages) {
                    pageNum = meta.totalPages - (4 - i);
                  }
                }
                const isActive = pageNum === meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => loadApplications(pageNum)}
                    disabled={loading}
                    className={`min-w-[32px] rounded-md px-2 py-1.5 text-sm ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => loadApplications(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || loading}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
        </>
      )}

      {/* Detail Modal */}
      {selectedApp !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">Name</label>
                  <p className="text-sm text-slate-900">{selectedApp.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Email</label>
                  <p className="text-sm text-slate-900">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Phone</label>
                  <p className="text-sm text-slate-900">{selectedApp.phone ?? 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Program</label>
                  <p className="text-sm text-slate-900">
                    {selectedApp.programName ?? selectedApp.programId}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Status</label>
                  <p className="text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(selectedApp.status)}`}>
                      {selectedApp.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Applied At</label>
                  <p className="text-sm text-slate-900">{formatDate(selectedApp.createdAt)}</p>
                </div>
              </div>

              {Object.keys(selectedApp.answers).length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500">Answers</label>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-slate-50 p-3 text-xs text-slate-700">
                    {JSON.stringify(selectedApp.answers, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
