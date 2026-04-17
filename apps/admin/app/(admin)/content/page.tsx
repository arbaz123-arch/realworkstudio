'use client';

import { useEffect, useState } from 'react';

type HomeContentResponse = {
  payload: Record<string, unknown>;
  error?: string;
};

export default function ContentAdminPage() {
  const [payloadText, setPayloadText] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/content/home');
        const data = (await res.json()) as HomeContentResponse;
        if (!res.ok) {
          setError(typeof data.error === 'string' ? data.error : 'Failed to load content');
          return;
        }
        setPayloadText(JSON.stringify(data.payload, null, 2));
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function onSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const parsed = JSON.parse(payloadText) as Record<string, unknown>;
      const res = await fetch('/api/admin/content/home', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsed }),
      });
      const data = (await res.json()) as HomeContentResponse;
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to save content');
        return;
      }
      setPayloadText(JSON.stringify(data.payload, null, 2));
      setSuccess('Content updated successfully.');
    } catch {
      setError('Invalid JSON or network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Content</h1>
      <p className="mt-2 text-sm text-slate-600">Manage homepage content payload.</p>

      {loading ? <p className="mt-6 text-sm text-slate-500">Loading content...</p> : null}
      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {success !== null ? <p className="mt-4 text-sm text-green-700">{success}</p> : null}

      {!loading ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="min-h-80 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
          />
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={saving}
            className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
