import type { DashboardRepository } from './dashboard.repository.js';

export type DashboardResponseDto = {
  totalPrograms: number;
  totalTestimonials: number;
  totalApplications: number;
  totalLeaderboardEntries: number;
};

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const counts = await this.repository.getCounts();
    return {
      totalPrograms: counts.totalPrograms,
      totalTestimonials: counts.totalTestimonials,
      totalApplications: counts.totalApplications,
      totalLeaderboardEntries: counts.totalLeaderboardEntries,
    };
  }
}
