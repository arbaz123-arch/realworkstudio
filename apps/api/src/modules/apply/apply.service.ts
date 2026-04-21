import { HttpError } from '../../middleware/error-handler.js';
import type { ApplyRepository, CreateApplicationInput } from './apply.repository.js';
import type { ContentRepository } from '../content/content.repository.js';

export type ApplyResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  programId: string;
  status: string;
  answers: Record<string, unknown>;
  createdAt: string;
};

export class ApplyService {
  constructor(
    private readonly repository: ApplyRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async submit(input: CreateApplicationInput): Promise<ApplyResponseDto> {
    const exists = await this.repository.programExists(input.programId);
    if (!exists) {
      throw new HttpError(400, 'Invalid program selected');
    }

    await this.validateAnswersAgainstQuestions(input.answers ?? {});

    const row = await this.repository.createApplication(input);
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      programId: row.program_id,
      status: row.status,
      answers: row.answers,
      createdAt: row.created_at.toISOString(),
    };
  }

  private async validateAnswersAgainstQuestions(answers: Record<string, unknown>): Promise<void> {
    const payload = await this.contentRepository.getHomePayload();
    const rawQuestions = payload['applyQuestions'];
    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      return;
    }

    const questionIds = rawQuestions
      .filter((q): q is Record<string, unknown> => typeof q === 'object' && q !== null)
      .map((q) => (typeof q['id'] === 'string' ? q['id'].trim() : ''))
      .filter((id) => id !== '');

    if (questionIds.length === 0) {
      return;
    }

    const answerKeys = Object.keys(answers);
    if (answerKeys.length !== questionIds.length) {
      throw new HttpError(400, 'Answers must match screening questions');
    }

    for (const id of questionIds) {
      if (!(id in answers)) {
        throw new HttpError(400, 'Answers must match screening questions');
      }
    }
  }
}
