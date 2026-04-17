export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  githubUsername: string | null;
  score: number;
  rank: number | null;
  notes: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
};

export type HomeContent = {
  payload: Record<string, unknown>;
};

export type ProgramsResponse = {
  items: Program[];
};

export type TestimonialsResponse = {
  items: Testimonial[];
};

export type LeaderboardResponse = {
  items: LeaderboardEntry[];
};
