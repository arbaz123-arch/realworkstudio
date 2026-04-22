import type {
  LeaderboardEntryRecord,
  LeaderboardRepository,
  ReplaceLeaderboardEntry,
} from './leaderboard.repository.js';
import { githubService } from './github.service.js';

export type LeaderboardEntryDto = {
  id: string;
  name: string;
  githubUsername: string | null;
  commits: number;
  repos: number;
  score: number;
  rank: number | null;
  notes: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
};

export type LeaderboardSyncResponseDto = {
  synced: number;
  items: LeaderboardEntryDto[];
};

function toDto(record: LeaderboardEntryRecord): LeaderboardEntryDto {
  return {
    id: record.id,
    name: record.name,
    githubUsername: record.github_username,
    commits: record.commits,
    repos: record.repos,
    score: record.score,
    rank: record.rank,
    notes: record.notes,
    lastSyncedAt: record.last_synced_at?.toISOString() ?? null,
    createdAt: record.created_at.toISOString(),
  };
}

export class LeaderboardService {
  constructor(private readonly repository: LeaderboardRepository) {}

  async list(): Promise<LeaderboardEntryDto[]> {
    const rows = await this.repository.list();
    return rows.map(toDto);
  }

  async sync(entries: ReplaceLeaderboardEntry[]): Promise<LeaderboardSyncResponseDto> {
    const resolved: ReplaceLeaderboardEntry[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const username =
        typeof entry.githubUsername === 'string' && entry.githubUsername.trim() !== ''
          ? entry.githubUsername.trim()
          : null;

      if (username) {
        const stats = await githubService.fetchUserStats(username, i);
        if (stats) {
          resolved.push({
            name: entry.name,
            githubUsername: username,
            commits: stats.commits,
            repos: stats.repos,
            score: stats.score,
            notes: entry.notes,
          });
          continue;
        }
      }

      resolved.push({
        name: entry.name,
        githubUsername: username,
        commits: entry.commits ?? 0,
        repos: entry.repos ?? 0,
        score: entry.score ?? 0,
        notes: entry.notes,
      });
    }

    const ranked = githubService.computeRanks(
      resolved.map((item) => ({
        ...item,
        score: item.score,
      }))
    );

    const rows = await this.repository.replaceAll(
      ranked.map((item) => ({
        name: item.name,
        githubUsername: item.githubUsername,
        commits: item.commits ?? 0,
        repos: item.repos ?? 0,
        score: item.score,
        rank: item.rank,
        notes: item.notes,
      }))
    );
    return {
      synced: rows.length,
      items: rows.map(toDto),
    };
  }
}
