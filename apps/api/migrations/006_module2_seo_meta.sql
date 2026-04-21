-- Module 2: Minimal SEO metadata storage

CREATE TABLE IF NOT EXISTS seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(120) NOT NULL UNIQUE,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NOT NULL,
  keywords TEXT NOT NULL DEFAULT '',
  og_image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_meta_page ON seo_meta (page);

