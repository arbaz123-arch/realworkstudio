import { getPool } from '../../db/pool.js';

export type DashboardCounts = {
  totalPrograms: number;
  totalTestimonials: number;
  totalApplications: number;
  totalLeaderboardEntries: number;
};

export class DashboardRepository {
  async getCounts(): Promise<DashboardCounts> {
    const pool = getPool();
    const [programs, testimonials, applications, leaderboard] = await Promise.all([
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM programs'),
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM testimonials'),
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM applications'),
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM leaderboard'),
    ]);

    return {
      totalPrograms: Number.parseInt(programs.rows[0]?.count ?? '0', 10),
      totalTestimonials: Number.parseInt(testimonials.rows[0]?.count ?? '0', 10),
      totalApplications: Number.parseInt(applications.rows[0]?.count ?? '0', 10),
      totalLeaderboardEntries: Number.parseInt(leaderboard.rows[0]?.count ?? '0', 10),
    };
  }
}
