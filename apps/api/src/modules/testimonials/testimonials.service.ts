import { HttpError } from '../../middleware/error-handler.js';
import type {
  CreateTestimonialInput,
  TestimonialRecord,
  TestimonialsRepository,
  UpdateTestimonialInput,
} from './testimonials.repository.js';

export type TestimonialDto = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: string;
};

function toDto(row: TestimonialRecord): TestimonialDto {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    content: row.content,
    rating: row.rating,
    createdAt: row.created_at.toISOString(),
  };
}

export class TestimonialsService {
  constructor(private readonly repository: TestimonialsRepository) {}

  async listAdmin(): Promise<TestimonialDto[]> {
    const rows = await this.repository.list();
    return rows.map(toDto);
  }

  async listPublic(): Promise<TestimonialDto[]> {
    const rows = await this.repository.list();
    return rows.map(toDto);
  }

  async create(input: CreateTestimonialInput): Promise<TestimonialDto> {
    const row = await this.repository.create(input);
    return toDto(row);
  }

  async update(id: string, input: UpdateTestimonialInput): Promise<TestimonialDto> {
    const row = await this.repository.update(id, input);
    if (row === null) {
      throw new HttpError(404, 'Testimonial not found');
    }
    return toDto(row);
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repository.remove(id);
    if (!ok) {
      throw new HttpError(404, 'Testimonial not found');
    }
  }
}
