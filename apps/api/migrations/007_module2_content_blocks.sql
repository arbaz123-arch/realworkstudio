-- Module 2: CMS lite content blocks

CREATE TABLE IF NOT EXISTS content_blocks (
  "key" VARCHAR(120) PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_key ON content_blocks ("key");

