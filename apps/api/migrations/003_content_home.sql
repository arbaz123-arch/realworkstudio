-- RealWorkStudio content home JSON storage
-- Run: psql "$DATABASE_URL" -f migrations/003_content_home.sql

CREATE TABLE IF NOT EXISTS content_home (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_home_single_row CHECK (id = TRUE)
);

INSERT INTO content_home (id, payload)
VALUES (TRUE, '{}'::JSONB)
ON CONFLICT (id) DO NOTHING;
