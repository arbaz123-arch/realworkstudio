'use client';

import { useEffect, useState } from 'react';

type ContentBlockResponse = {
  key: string;
  value: Record<string, unknown>;
  error?: string;
};

type BlockKey = 'hero' | 'cta' | 'section_headings';

export default function ContentAdminPage() {
  const [heroText, setHeroText] = useState('{}');
  const [ctaText, setCtaText] = useState('{}');
  const [headingsText, setHeadingsText] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const keys: BlockKey[] = ['hero', 'cta', 'section_headings'];
        const responses = await Promise.all(
          keys.map(async (key) => {
            const res = await fetch(`/api/content/${key}`);
            if (res.status === 404) {
              return { key, value: {} } as ContentBlockResponse;
            }
            const data = (await res.json()) as ContentBlockResponse;
            if (!res.ok) {
              throw new Error(
                typeof data.error === 'string' ? data.error : `Failed to load content block: ${key}`
              );
            }
            return data;
          })
        );

        for (const item of responses) {
          const asText = JSON.stringify(item.value, null, 2);
          if (item.key === 'hero') {
            setHeroText(asText);
          } else if (item.key === 'cta') {
            setCtaText(asText);
          } else if (item.key === 'section_headings') {
            setHeadingsText(asText);
          }
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function saveBlock(key: BlockKey, text: string) {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const res = await fetch(`/api/admin/content/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: parsed }),
    });
    const data = (await res.json()) as ContentBlockResponse;
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save content');
    }
    return data;
  }

  async function onSaveAll() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const [hero, cta, sectionHeadings] = await Promise.all([
        saveBlock('hero', heroText),
        saveBlock('cta', ctaText),
        saveBlock('section_headings', headingsText),
      ]);

      setHeroText(JSON.stringify(hero.value, null, 2));
      setCtaText(JSON.stringify(cta.value, null, 2));
      setHeadingsText(JSON.stringify(sectionHeadings.value, null, 2));
      setSuccess('Content blocks updated successfully.');
    } catch {
      setError('Invalid JSON or network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Content</h1>
      <p className="mt-2 text-sm text-slate-600">
        Manage CMS Lite blocks: hero, CTA, and section headings.
      </p>

      {loading ? <p className="mt-6 text-sm text-slate-500">Loading content...</p> : null}
      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {success !== null ? <p className="mt-4 text-sm text-green-700">{success}</p> : null}

      {!loading ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Hero</p>
          <textarea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="mt-2 min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
          />

          <p className="mt-5 text-sm font-semibold text-slate-900">CTA</p>
          <textarea
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="mt-2 min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
          />

          <p className="mt-5 text-sm font-semibold text-slate-900">Section Headings</p>
          <textarea
            value={headingsText}
            onChange={(e) => setHeadingsText(e.target.value)}
            className="mt-2 min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
          />
          <button
            type="button"
            onClick={() => void onSaveAll()}
            disabled={saving}
            className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Content Blocks'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
