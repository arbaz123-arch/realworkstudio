'use client';

import { useState, useEffect } from 'react';

type UploadResponse = {
  id?: string;
  url?: string;
  filename?: string;
  size?: number;
  type?: 'image' | 'video';
  provider?: 'firebase' | 'mock';
  error?: string;
};

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  type: 'image' | 'video';
  size: number;
  createdAt: string;
};

export default function MediaAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // Load media list on mount
  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const res = await fetch('/api/admin/media');
      if (!res.ok) throw new Error('Failed to load media');
      const data = await res.json();
      setMediaList(data.media || []);
    } catch {
      // Silent fail for media list
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await res.json()) as UploadResponse;
      if (!res.ok || typeof data.url !== 'string') {
        setError(typeof data.error === 'string' ? data.error : 'Upload failed');
        return;
      }
      setSuccess(`Uploaded: ${data.filename} (${data.type}, ${formatBytes(data.size || 0)})`);
      setFile(null);
      loadMedia(); // Refresh list
    } catch {
      setError('Network error');
    } finally {
      setUploading(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Media</h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload images and videos to Firebase Storage. Max size: 10MB.
      </p>

      {/* Upload Form */}
      <form onSubmit={onUpload} className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="file" className="block text-sm font-medium text-slate-700">
          Select File
        </label>
        <input
          id="file"
          type="file"
          accept="image/*,video/mp4,video/webm"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-2 w-full text-sm"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Allowed: JPEG, PNG, GIF, WebP, MP4, WebM (max 10MB)
        </p>

        {file && (
          <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
            <p><strong>Name:</strong> {file.name}</p>
            <p><strong>Size:</strong> {formatBytes(file.size)}</p>
            <p><strong>Type:</strong> {file.type}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload to Firebase'}
        </button>
      </form>

      {/* Messages */}
      {error !== null && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success !== null && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Media List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Uploaded Media</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        ) : mediaList.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No media uploaded yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaList.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="h-32 w-full rounded object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-32 w-full rounded object-cover"
                    controls
                  />
                )}
                <p className="mt-2 truncate text-xs font-medium text-slate-700">{item.filename}</p>
                <p className="text-xs text-slate-500">{formatBytes(item.size)}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(item.url)}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  Copy URL
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
