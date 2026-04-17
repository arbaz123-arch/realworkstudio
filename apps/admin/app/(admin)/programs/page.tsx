'use client';

import { useEffect, useState } from 'react';

type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
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
  price: string;
};

const initialForm: ProgramForm = {
  title: '',
  slug: '',
  description: '',
  price: '0',
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
      price: String(item.price),
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
        price: Number(form.price),
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
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="Slug (optional, auto from title)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Description"
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
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
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
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
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
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
