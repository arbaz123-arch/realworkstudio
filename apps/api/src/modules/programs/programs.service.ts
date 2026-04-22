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
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  bannerUrl: string;
  price: number;
  skills: string[];
  tools: string[];
  outcomes: string;
  displayOrder: number;
  status: 'ACTIVE' | 'DRAFT';
  createdAt: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDto(row: ProgramRecord): ProgramDto {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? row.description ?? '',
    thumbnailUrl: row.thumbnail_url ?? '',
    bannerUrl: row.banner_url ?? '',
    price: Number.parseFloat(row.price),
    skills: row.skills ?? [],
    tools: row.tools ?? [],
    outcomes: row.outcomes ?? '',
    displayOrder: row.display_order ?? 0,
    status: row.status ?? 'DRAFT',
    createdAt: row.created_at.toISOString(),
  };
}

export class ProgramsService {
  constructor(private readonly repository: ProgramsRepository) {}

  private async getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = excludeId
        ? await this.repository.findBySlugExceptId(slug, excludeId)
        : await this.repository.findBySlug(slug);
      
      if (!existing) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

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
    const baseSlug = slugify(input.slug ?? input.title);
    const slug = await this.getUniqueSlug(baseSlug);

    const fullDescription =
      input.fullDescription !== undefined && input.fullDescription.trim() !== ''
        ? input.fullDescription
        : input.description;

    const row = await this.repository.create({
      title: input.title,
      slug,
      description: input.description,
      shortDescription: input.shortDescription,
      fullDescription,
      thumbnailUrl: input.thumbnailUrl,
      bannerUrl: input.bannerUrl,
      price: input.price,
      skills: input.skills,
      tools: input.tools,
      outcomes: input.outcomes,
      displayOrder: input.displayOrder,
      status: input.status,
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

    const nextBaseSlug =
      input.slug !== undefined && input.slug.trim() !== ''
        ? slugify(input.slug)
        : input.title !== undefined && input.title.trim() !== ''
          ? slugify(input.title)
          : current.slug;

    const nextSlug = await this.getUniqueSlug(nextBaseSlug, id);

    const nextDescription = input.description ?? current.description;
    const nextFullDescription =
      input.fullDescription !== undefined
        ? input.fullDescription.trim() !== ''
          ? input.fullDescription
          : nextDescription
        : current.full_description && current.full_description.trim() !== ''
          ? current.full_description
          : nextDescription;

    const updated = await this.repository.update(id, {
      title: input.title,
      slug: nextSlug,
      description: input.description,
      price: input.price,
      shortDescription: input.shortDescription,
      fullDescription: nextFullDescription,
      thumbnailUrl: input.thumbnailUrl,
      bannerUrl: input.bannerUrl,
      skills: input.skills,
      tools: input.tools,
      outcomes: input.outcomes,
      displayOrder: input.displayOrder,
      status: input.status,
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
