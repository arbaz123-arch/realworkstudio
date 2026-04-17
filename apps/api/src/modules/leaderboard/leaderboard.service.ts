import type {
  LeaderboardEntryRecord,
  LeaderboardRepository,
  ReplaceLeaderboardEntry,
} from './leaderboard.repository.js';

export type LeaderboardEntryDto = {
  id: string;
  name: string;
  githubUsername: string | null;
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
    const rows = await this.repository.replaceAll(entries);
    return {
      synced: rows.length,
      items: rows.map(toDto),
    };
  }
}
