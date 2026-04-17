import { HttpError } from '../../middleware/error-handler.js';
import type { ApplyRepository, CreateApplicationInput } from './apply.repository.js';

export type ApplyResponseDto = {
  id: string;
  name: string;
  email: string;
  programId: string;
  status: string;
  createdAt: string;
};

export class ApplyService {
  constructor(private readonly repository: ApplyRepository) {}

  async submit(input: CreateApplicationInput): Promise<ApplyResponseDto> {
    const exists = await this.repository.programExists(input.programId);
    if (!exists) {
      throw new HttpError(400, 'Invalid program selected');
    }

    const row = await this.repository.createApplication(input);
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      programId: row.program_id,
      status: row.status,
      createdAt: row.created_at.toISOString(),
    };
  }
}
