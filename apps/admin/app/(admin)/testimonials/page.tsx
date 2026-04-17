'use client';

import { useEffect, useState } from 'react';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: string;
};

type TestimonialsResponse = {
  items: Testimonial[];
  error?: string;
};

type TestimonialForm = {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: string;
};

const initialForm: TestimonialForm = {
  name: '',
  role: '',
  company: '',
  content: '',
  rating: '5',
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(initialForm);

  async function loadTestimonials() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = (await res.json()) as TestimonialsResponse;
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load testimonials');
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
    void loadTestimonials();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: Testimonial) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      rating: String(item.rating),
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: form.name,
        role: form.role,
        company: form.company,
        content: form.content,
        rating: Number(form.rating),
      };
      const endpoint =
        editingId === null ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingId}`;
      const method = editingId === null ? 'POST' : 'PATCH';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to save testimonial');
        return;
      }
      resetForm();
      await loadTestimonials();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to delete testimonial');
        return;
      }
      if (editingId === id) {
        resetForm();
      }
      await loadTestimonials();
    } catch {
      setError('Network error');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Testimonials</h1>
      <p className="mt-2 text-sm text-slate-600">Create and manage learner testimonials.</p>

      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <p className="text-sm font-semibold text-slate-900">
          {editingId === null ? 'Create Testimonial' : 'Edit Testimonial'}
        </p>
        <input
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Name"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.role}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          placeholder="Role"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          placeholder="Company"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Content"
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.rating}
          onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
          placeholder="Rating (1-5)"
          type="number"
          min="1"
          max="5"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : editingId === null
                ? 'Create Testimonial'
                : 'Update Testimonial'}
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
        {loading ? <p className="p-4 text-sm text-slate-500">Loading testimonials...</p> : null}
        {!loading ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.role}</td>
                  <td className="px-4 py-3">{item.company}</td>
                  <td className="px-4 py-3">{item.rating}</td>
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
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                    No testimonials found.
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
