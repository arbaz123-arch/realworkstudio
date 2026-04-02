export type HealthStatusRecord = {
  status: 'ok';
};

/**
 * Phase 1: static health. Later: DB ping, etc.
 */
export class HealthRepository {
  async getStatus(): Promise<HealthStatusRecord> {
    return Promise.resolve({ status: 'ok' });
  }
}
