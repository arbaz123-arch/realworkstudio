'use client';

import { useState } from 'react';

type UploadResponse = {
  url?: string;
  provider?: string;
  error?: string;
};

export default function MediaAdminPage() {
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setUploadedUrl(null);
    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });
      const data = (await res.json()) as UploadResponse;
      if (!res.ok || typeof data.url !== 'string') {
        setError(typeof data.error === 'string' ? data.error : 'Upload failed');
        return;
      }
      setUploadedUrl(data.url);
      setFileName('');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Media</h1>
      <p className="mt-2 text-sm text-slate-600">Upload endpoint integration (mock provider).</p>

      <form onSubmit={onUpload} className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="fileName" className="block text-sm font-medium text-slate-700">
          File Name
        </label>
        <input
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="student-video.mp4"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {uploadedUrl !== null ? (
        <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">URL: {uploadedUrl}</p>
      ) : null}
    </div>
  );
}
