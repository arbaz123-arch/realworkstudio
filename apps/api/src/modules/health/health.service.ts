import type { HealthRepository } from './health.repository.js';

export type HealthResponseDto = {
  status: 'ok';
  service: 'realworkstudio-api';
};

export class HealthService {
  constructor(private readonly repository: HealthRepository) {}

  async getHealth(): Promise<HealthResponseDto> {
    const record = await this.repository.getStatus();
    return {
      status: record.status,
      service: 'realworkstudio-api',
    };
  }
}
