import { getPool } from '../../db/pool.js';

export type DashboardCounts = {
  totalPrograms: number;
  totalTestimonials: number;
  totalApplications: number;
};

export class DashboardRepository {
  async getCounts(): Promise<DashboardCounts> {
    const pool = getPool();
    const [programs, testimonials, applications] = await Promise.all([
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM programs'),
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM testimonials'),
      pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM applications'),
    ]);

    return {
      totalPrograms: Number.parseInt(programs.rows[0]?.count ?? '0', 10),
      totalTestimonials: Number.parseInt(testimonials.rows[0]?.count ?? '0', 10),
      totalApplications: Number.parseInt(applications.rows[0]?.count ?? '0', 10),
    };
  }
}
