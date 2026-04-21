'use client';

import { useEffect, useState } from 'react';

type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  bannerUrl: string;
  price: number;
  skills: string[];
  tools: string[];
  outcomes: string;
  displayOrder: number;
  status: 'ACTIVE' | 'DRAFT';
  createdAt: string;
};

type ProgramsResponse = {
  items: Program[];
  error?: string;
};

type ProgramForm = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  bannerUrl: string;
  price: string;
  skills: string;
  tools: string;
  outcomes: string;
  displayOrder: string;
  status: 'ACTIVE' | 'DRAFT';
};

const initialForm: ProgramForm = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  fullDescription: '',
  thumbnailUrl: '',
  bannerUrl: '',
  price: '0',
  skills: '',
  tools: '',
  outcomes: '',
  displayOrder: '0',
  status: 'DRAFT',
};

export default function ProgramsAdminPage() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(initialForm);

  async function loadPrograms() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/programs');
      const data = (await res.json()) as ProgramsResponse;
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load programs');
        return;
      }
      setItems(data.items);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPrograms();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: Program) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription ?? '',
      fullDescription: item.fullDescription ?? '',
      thumbnailUrl: item.thumbnailUrl ?? '',
      bannerUrl: item.bannerUrl ?? '',
      price: String(item.price),
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : '',
      tools: Array.isArray(item.tools) ? item.tools.join(', ') : '',
      outcomes: item.outcomes ?? '',
      displayOrder: String(item.displayOrder ?? 0),
      status: item.status ?? 'DRAFT',
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        thumbnailUrl: form.thumbnailUrl || null,
        bannerUrl: form.bannerUrl || null,
        price: Number(form.price),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        tools: form.tools.split(',').map(s => s.trim()).filter(Boolean),
        outcomes: form.outcomes,
        displayOrder: Number(form.displayOrder),
        status: form.status,
      };
      const endpoint =
        editingId === null ? '/api/admin/programs' : `/api/admin/programs/${editingId}`;
      const method = editingId === null ? 'POST' : 'PATCH';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to save program');
        return;
      }
      resetForm();
      await loadPrograms();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to delete program');
        return;
      }
      if (editingId === id) {
        resetForm();
      }
      await loadPrograms();
    } catch {
      setError('Network error');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Programs</h1>
      <p className="mt-2 text-sm text-slate-600">Create, update and manage program entries.</p>

      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <p className="text-sm font-semibold text-slate-900">
          {editingId === null ? 'Create Program' : 'Edit Program'}
        </p>
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Program title"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="auto-generated-from-title"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
          <p className="mt-1 text-xs text-slate-500">Use lowercase letters, numbers, and hyphens only (e.g., ai-ml-foundation)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Short Description</label>
          <input
            value={form.shortDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
            placeholder="Brief summary for cards and previews"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Description</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
            placeholder="Detailed program description"
            className="mt-1 min-h-28 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Thumbnail URL</label>
          <input
            value={form.thumbnailUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
            placeholder="https://example.com/thumbnail.jpg"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Banner URL</label>
          <input
            value={form.bannerUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, bannerUrl: e.target.value }))}
            placeholder="https://example.com/banner.jpg"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Price (INR)</label>
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="e.g. 4999"
            type="number"
            min="0"
            step="0.01"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
            required
          />
          <p className="mt-1 text-xs text-slate-500">Enter program price in INR</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Display Order</label>
            <input
              value={form.displayOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
              placeholder="e.g. 1 (lower number = higher priority)"
              type="number"
              min="0"
              step="1"
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
            />
            <p className="mt-1 text-xs text-slate-500">Controls display priority (lower appears first)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value as 'ACTIVE' | 'DRAFT' }))
              }
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Skills</label>
          <input
            value={form.skills}
            onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
            placeholder="React, Node.js, TypeScript (comma-separated)"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tools</label>
          <input
            value={form.tools}
            onChange={(e) => setForm((prev) => ({ ...prev, tools: e.target.value }))}
            placeholder="Git, Docker, VS Code (comma-separated)"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Outcomes</label>
          <textarea
            value={form.outcomes}
            onChange={(e) => setForm((prev) => ({ ...prev, outcomes: e.target.value }))}
            placeholder="What students will learn..."
            className="mt-1 min-h-20 rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          />
          <p className="mt-1 text-xs text-slate-500">Enter learning outcomes (one per line or comma separated)</p>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId === null ? 'Create Program' : 'Update Program'}
          </button>
          {editingId !== null ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading ? <p className="p-4 text-sm text-slate-500">Loading programs...</p> : null}
        {!loading ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{item.status}</td>
                  <td className="px-4 py-3 text-slate-600">{item.displayOrder}</td>
                  <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(item.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                    No programs found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
