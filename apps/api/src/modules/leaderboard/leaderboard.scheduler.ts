import { LeaderboardRepository } from './leaderboard.repository.js';
import { LeaderboardService } from './leaderboard.service.js';

function msUntilNextRun(hour: number, minute: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

async function runLeaderboardSyncOnce(): Promise<void> {
  const repository = new LeaderboardRepository();
  const service = new LeaderboardService(repository);

  const existing = await repository.list();
  if (existing.length === 0) {
    console.log('[leaderboard-cron] skip: no entries to sync');
    return;
  }

  console.log(`[leaderboard-cron] syncing ${existing.length} entries`);
  const entries = existing.map((row) => ({
    name: row.name,
    githubUsername: row.github_username,
    notes: row.notes ?? undefined,
    // score/commits/repos are computed from github when username exists
    score: row.score,
  }));

  const result = await service.sync(entries);
  console.log(`[leaderboard-cron] synced ${result.synced} entries`);
}

export function startLeaderboardDailySync(): void {
  const hour = 2;
  const minute = 0;

  const scheduleNext = () => {
    const delay = msUntilNextRun(hour, minute);
    console.log(`[leaderboard-cron] next run in ${Math.round(delay / 1000)}s`);

    setTimeout(() => {
      void runLeaderboardSyncOnce()
        .catch((err) => {
          console.error('[leaderboard-cron] sync failed', err);
        })
        .finally(() => {
          scheduleNext();
        });
    }, delay);
  };

  scheduleNext();
}

