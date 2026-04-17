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
  programId: string;
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

export async function getPrograms(): Promise<Program[]> {
  const data = await requestJson<ProgramsResponse>('/api/programs');
  return data.items;
}

export async function getProgramBySlug(slug: string): Promise<Program> {
  return requestJson<Program>(`/api/programs/${slug}`);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await requestJson<TestimonialsResponse>('/api/testimonials');
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
