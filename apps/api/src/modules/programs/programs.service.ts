import { HttpError } from '../../middleware/error-handler.js';
import type {
  CreateProgramInput,
  ProgramRecord,
  ProgramsRepository,
  UpdateProgramInput,
} from './programs.repository.js';

export type ProgramDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  createdAt: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toDto(row: ProgramRecord): ProgramDto {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: Number.parseFloat(row.price),
    createdAt: row.created_at.toISOString(),
  };
}

export class ProgramsService {
  constructor(private readonly repository: ProgramsRepository) {}

  async listAdmin(): Promise<ProgramDto[]> {
    const rows = await this.repository.list();
    return rows.map(toDto);
  }

  async listPublic(): Promise<ProgramDto[]> {
    const rows = await this.repository.list();
    return rows.map(toDto);
  }

  async getBySlug(slug: string): Promise<ProgramDto> {
    const row = await this.repository.findBySlug(slug);
    if (row === null) {
      throw new HttpError(404, 'Program not found');
    }
    return toDto(row);
  }

  async create(input: Omit<CreateProgramInput, 'slug'> & { slug?: string }): Promise<ProgramDto> {
    const slug = slugify(input.slug ?? input.title);
    const existing = await this.repository.findBySlug(slug);
    if (existing !== null) {
      throw new HttpError(409, 'Program slug already exists');
    }

    const row = await this.repository.create({
      title: input.title,
      slug,
      description: input.description,
      price: input.price,
    });
    return toDto(row);
  }

  async update(
    id: string,
    input: Omit<UpdateProgramInput, 'slug'> & { slug?: string }
  ): Promise<ProgramDto> {
    const current = await this.repository.findById(id);
    if (current === null) {
      throw new HttpError(404, 'Program not found');
    }

    const nextSlug =
      input.slug !== undefined
        ? slugify(input.slug)
        : input.title !== undefined
          ? slugify(input.title)
          : current.slug;

    const duplicate = await this.repository.findBySlugExceptId(nextSlug, id);
    if (duplicate !== null) {
      throw new HttpError(409, 'Program slug already exists');
    }

    const updated = await this.repository.update(id, {
      title: input.title,
      slug: nextSlug,
      description: input.description,
      price: input.price,
    });
    if (updated === null) {
      throw new HttpError(404, 'Program not found');
    }
    return toDto(updated);
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repository.remove(id);
    if (!ok) {
      throw new HttpError(404, 'Program not found');
    }
  }
}
