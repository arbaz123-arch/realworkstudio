'use client';

import { useState } from 'react';

type SyncResult = {
  synced: number;
  items: Array<{
    id: string;
    name: string;
    githubUsername: string | null;
    commits: number;
    repos: number;
    score: number;
    rank: number | null;
  }>;
  error?: string;
};

type Mode = 'github' | 'manual';

const sampleGithubJson = JSON.stringify(
  [
    { name: 'Aarav', githubUsername: 'aarav-dev', notes: 'Top performer' },
    { name: 'Meera', githubUsername: 'meera-dev', notes: '' },
  ],
  null,
  2
);

const sampleManualJson = JSON.stringify(
  [
    { name: 'Aarav', score: 390, rank: 1, notes: 'Top performer' },
    { name: 'Meera', score: 310, rank: 2, notes: '' },
  ],
  null,
  2
);

export default function LeaderboardAdminPage() {
  const [mode, setMode] = useState<Mode>('github');
  const [entriesText, setEntriesText] = useState(sampleGithubJson);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResult | null>(null);

  function onModeChange(next: Mode) {
    setMode(next);
    setResult(null);
    setError(null);
    setEntriesText(next === 'github' ? sampleGithubJson : sampleManualJson);
  }

  async function onSync() {
    setSaving(true);
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(entriesText) as unknown;
      const res = await fetch('/api/admin/leaderboard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: parsed }),
      });
      const data = (await res.json()) as SyncResult;
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to sync leaderboard');
        return;
      }
      setResult(data);
    } catch {
      setError('Invalid JSON or network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Leaderboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sync leaderboard entries using GitHub public data or manual override.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-slate-900">Mode</p>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="leaderboard-mode"
              value="github"
              checked={mode === 'github'}
              onChange={() => onModeChange('github')}
            />
            GitHub Mode
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="leaderboard-mode"
              value="manual"
              checked={mode === 'manual'}
              onChange={() => onModeChange('manual')}
            />
            Manual Mode
          </label>
        </div>

        <p className="text-sm font-semibold text-slate-900">Entries JSON</p>
        <p className="mt-1 text-xs text-slate-600">
          {mode === 'github'
            ? 'Provide name + githubUsername. Commits/repos/score/rank are computed and stored.'
            : 'Provide name + score (and optional rank/notes).'}
        </p>
        <textarea
          value={entriesText}
          onChange={(e) => setEntriesText(e.target.value)}
          className="mt-3 min-h-56 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
        />
        <button
          type="button"
          onClick={() => void onSync()}
          disabled={saving}
          className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Syncing...' : 'Sync Leaderboard'}
        </button>
      </div>

      {error !== null ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {result !== null ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-700">Synced entries: {result.synced}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {result.items.map((item) => (
              <li key={item.id}>
                #{item.rank ?? '-'} {item.name} ({item.score})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
