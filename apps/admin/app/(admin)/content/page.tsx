'use client';

import { useEffect, useState, useCallback } from 'react';

type ContentBlockResponse = {
  key: string;
  value: Record<string, unknown>;
  page?: string;
  error?: string;
};

type BlockKey = 'hero' | 'cta' | 'section_headings';

type ValidationError = {
  key: BlockKey;
  message: string;
};

export default function ContentAdminPage() {
  const [page, setPage] = useState('home');
  const [heroText, setHeroText] = useState('{}');
  const [ctaText, setCtaText] = useState('{}');
  const [headingsText, setHeadingsText] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Validate JSON format
  const validateJson = useCallback((text: string, key: BlockKey): string | null => {
    try {
      JSON.parse(text);
      return null;
    } catch (e) {
      return `Invalid JSON in ${key}: ${e instanceof Error ? e.message : 'Unknown error'}`;
    }
  }, []);

  // Check all blocks for valid JSON
  const validateAll = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    const heroError = validateJson(heroText, 'hero');
    if (heroError) errors.push({ key: 'hero', message: heroError });
    const ctaError = validateJson(ctaText, 'cta');
    if (ctaError) errors.push({ key: 'cta', message: ctaError });
    const headingsError = validateJson(headingsText, 'section_headings');
    if (headingsError) errors.push({ key: 'section_headings', message: headingsError });
    return errors;
  }, [heroText, ctaText, headingsText, validateJson]);

  // Update validation errors when text changes
  useEffect(() => {
    setValidationErrors(validateAll());
    setHasChanges(true);
  }, [heroText, ctaText, headingsText, validateAll]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setHasChanges(false);
      try {
        const keys: BlockKey[] = ['hero', 'cta', 'section_headings'];
        const responses = await Promise.all(
          keys.map(async (key) => {
            const res = await fetch(`/api/content/${key}?page=${encodeURIComponent(page)}`);
            if (res.status === 404) {
              return { key, value: {}, page } as ContentBlockResponse;
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
  }, [page]);

  async function saveBlock(key: BlockKey, text: string) {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const res = await fetch(`/api/admin/content/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: parsed, page }),
    });
    const data = (await res.json()) as ContentBlockResponse;
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Failed to save content');
    }
    return data;
  }

  async function triggerRevalidation() {
    try {
      const res = await fetch(`/api/admin/content/revalidate/${page}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        console.warn('Revalidation trigger failed');
      }
    } catch {
      console.warn('Revalidation trigger error');
    }
  }

  async function onSaveAll() {
    // Pre-validate before attempting save
    const errors = validateAll();
    if (errors.length > 0) {
      setError(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
      return;
    }

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
      setHasChanges(false);

      // Trigger cache revalidation
      await triggerRevalidation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON or network error');
    } finally {
      setSaving(false);
    }
  }

  const hasValidationErrors = validationErrors.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Content</h1>
      <p className="mt-2 text-sm text-slate-600">
        Manage CMS Lite blocks: hero, CTA, and section headings.
      </p>

      {/* Page selector */}
      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="page-select" className="text-sm font-medium text-slate-700">Page:</label>
        <select
          id="page-select"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          disabled={loading || saving}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          <option value="home">Home</option>
          <option value="programs">Programs</option>
          <option value="about">About</option>
        </select>
        {hasChanges && !loading && (
          <span className="text-xs text-amber-600">Unsaved changes</span>
        )}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading content...
        </div>
      )}

      {/* Error message */}
      {error !== null && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Success message */}
      {success !== null && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          <span className="font-semibold">Success:</span> {success}
        </div>
      )}

      {/* Validation errors */}
      {hasValidationErrors && (
        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
          <span className="font-semibold">Validation errors:</span>
          <ul className="mt-1 list-disc pl-4">
            {validationErrors.map((err) => (
              <li key={err.key}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

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
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void onSaveAll()}
              disabled={saving || hasValidationErrors || loading}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Content Blocks'
              )}
            </button>
            {hasValidationErrors && (
              <span className="text-xs text-red-600">Fix validation errors before saving</span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
