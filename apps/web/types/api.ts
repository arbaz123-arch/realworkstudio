export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  skills: string[];
  tools: string[];
  outcomes: string;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  photoUrl: string;
  content: string;
  rating: number;
  programId: string | null;
  type: 'text' | 'video';
  videoUrl: string | null;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  githubUsername: string | null;
  commits: number;
  repos: number;
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
