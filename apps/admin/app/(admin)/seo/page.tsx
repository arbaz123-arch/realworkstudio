'use client';

import { useEffect, useState } from 'react';

type HomeContentResponse = {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  error?: string;
};

type SeoForm = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
};

export default function SeoAdminPage() {
  const [form, setForm] = useState<SeoForm>({
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/seo?page=home');
        const data = (await res.json()) as HomeContentResponse;
        if (!res.ok) {
          if (res.status === 404) {
            setForm({ title: '', description: '', keywords: '', ogImage: '' });
            return;
          }
          setError(typeof data.error === 'string' ? data.error : 'Failed to load SEO data');
          return;
        }
        setForm({
          title: data.metaTitle ?? '',
          description: data.metaDescription ?? '',
          keywords: data.keywords ?? '',
          ogImage: data.ogImage ?? '',
        });
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'home',
          metaTitle: form.title,
          metaDescription: form.description,
          keywords: form.keywords,
          ogImage: form.ogImage,
        }),
      });
      const data = (await res.json()) as HomeContentResponse;
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to save SEO data');
        return;
      }
      setForm({
        title: data.metaTitle ?? form.title,
        description: data.metaDescription ?? form.description,
        keywords: data.keywords ?? form.keywords,
        ogImage: data.ogImage ?? form.ogImage,
      });
      setSuccess('SEO fields saved.');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">SEO</h1>
      <p className="mt-2 text-sm text-slate-600">Manage homepage SEO fields.</p>

      {loading ? <p className="mt-6 text-sm text-slate-500">Loading SEO...</p> : null}
      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {success !== null ? <p className="mt-4 text-sm text-green-700">{success}</p> : null}

      {!loading ? (
        <form
          onSubmit={onSave}
          className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Meta title"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Meta description"
            className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <input
            value={form.keywords}
            onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
            placeholder="Keywords"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={form.ogImage}
            onChange={(e) => setForm((prev) => ({ ...prev, ogImage: e.target.value }))}
            placeholder="OG image URL"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save SEO'}
          </button>
        </form>
      ) : null}
    </div>
  );
}
