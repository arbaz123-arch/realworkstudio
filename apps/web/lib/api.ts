import type {
  HomeContent,
  LeaderboardResponse,
  Program,
  ProgramsResponse,
  Testimonial,
  TestimonialsResponse,
} from '@/types/api';

const API_URL = process.env['API_URL'] ?? 'http://localhost:4000';

type ApplyBody = {
  name: string;
  email: string;
  phone?: string;
  programId: string;
  answers?: Record<string, unknown>;
};

export type ContentBlock = {
  key: string;
  value: Record<string, unknown>;
  page?: string;
};

export type PageContent = {
  page: string;
  blocks: Record<string, Record<string, unknown>>;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new ApiError(res.status, typeof data.error === 'string' ? data.error : 'Request failed');
  }
  return data;
}

export async function getHomeContent(): Promise<HomeContent> {
  return requestJson<HomeContent>('/api/content/home');
}

export async function getContentBlock(key: string, page = 'home'): Promise<ContentBlock> {
  return requestJson<ContentBlock>(`/api/content/${key}?page=${encodeURIComponent(page)}`);
}

export async function getPageContent(page: string): Promise<PageContent> {
  return requestJson<PageContent>(`/api/content/page/${encodeURIComponent(page)}`);
}

export async function getPrograms(): Promise<Program[]> {
  const data = await requestJson<ProgramsResponse>('/api/programs');
  return data.items;
}

export async function getProgramBySlug(slug: string): Promise<Program> {
  return requestJson<Program>(`/api/programs/${slug}`);
}

type TestimonialsQuery = {
  programId?: string;
  type?: 'text' | 'video';
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
};

export async function getTestimonials(query?: TestimonialsQuery): Promise<Testimonial[]> {
  const params = new URLSearchParams();
  if (query?.programId) params.set('programId', query.programId);
  if (query?.type) params.set('type', query.type);
  if (query?.isFeatured === true) params.set('isFeatured', 'true');
  if (query?.limit !== undefined) params.set('limit', String(query.limit));
  if (query?.offset !== undefined) params.set('offset', String(query.offset));
  const suffix = params.toString() ? `?${params.toString()}` : '';
  const data = await requestJson<TestimonialsResponse>(`/api/testimonials${suffix}`);
  return data.items;
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const data = await requestJson<TestimonialsResponse>(`/api/testimonials?isFeatured=true&limit=${limit}`);
  return data.items;
}

export async function getLeaderboard(): Promise<LeaderboardResponse['items']> {
  const data = await requestJson<LeaderboardResponse>('/api/leaderboard');
  return data.items;
}

export async function submitApplication(input: ApplyBody): Promise<void> {
  await requestJson('/api/apply', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
