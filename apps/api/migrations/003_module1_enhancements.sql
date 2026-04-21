-- RealWorkStudio Module 1 Enhancements
-- Run: psql "$DATABASE_URL" -f migrations/003_module1_enhancements.sql

-- Programs: add skills, tools, outcomes
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS outcomes TEXT DEFAULT '';

-- Testimonials: add program_id, type, video_url, is_featured, is_approved
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video')),
  ADD COLUMN IF NOT EXISTS video_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_testimonials_program_id ON testimonials (program_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_type ON testimonials (type);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials (is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials (is_approved);

-- Applications: add phone, answers (screening questions)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}';

-- Leaderboard: add commits, repos for GitHub integration
ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS commits INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS repos INTEGER NOT NULL DEFAULT 0;
