-- Module 2: Programs required fields (backward compatible)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_status') THEN
    CREATE TYPE program_status AS ENUM ('ACTIVE', 'DRAFT');
  END IF;
END $$;

ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS full_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS banner_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status program_status NOT NULL DEFAULT 'DRAFT';

-- Backfill full_description from existing description when empty
UPDATE programs
SET full_description = description
WHERE (full_description IS NULL OR full_description = '') AND description IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_programs_display_order ON programs (display_order);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs (status);

