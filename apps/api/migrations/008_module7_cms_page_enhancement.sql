-- Module 7: CMS Lite Enhancement - Add page-based structure

-- Step 1: Add page column with default 'home'
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS page VARCHAR(120) NOT NULL DEFAULT 'home';

-- Step 2: Drop the old primary key constraint on key only
-- Note: This requires handling existing data carefully
-- First, create a temporary unique index to prevent duplicates during migration
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_blocks_page_key_temp
ON content_blocks (page, "key");

-- Step 3: Drop the old primary key (if possible) and create composite
-- PostgreSQL doesn't allow dropping primary key with dependent objects easily
-- Instead, we'll add a new id column as primary key
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- Step 4: Make id the primary key (only if not already primary key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'content_blocks_pkey'
    AND conrelid = 'content_blocks'::regclass
  ) THEN
    ALTER TABLE content_blocks
    ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Step 5: Ensure unique constraint on (page, key) combination
-- Drop and recreate to ensure clean state
DROP INDEX IF EXISTS idx_content_blocks_page_key_temp;

-- Create unique constraint on page + key (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'content_blocks_page_key_unique'
    AND conrelid = 'content_blocks'::regclass
  ) THEN
    ALTER TABLE content_blocks
    ADD CONSTRAINT content_blocks_page_key_unique
    UNIQUE (page, "key");
  END IF;
END $$;

-- Step 6: Create index on page for fast queries
CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks (page);

-- Step 7: Update existing records to have page = 'home' (already set by default)
-- This is just a verification step
UPDATE content_blocks
SET page = 'home'
WHERE page IS NULL OR page = '';

-- Step 8: Drop the old key-only index if it exists (replaced by composite)
DROP INDEX IF EXISTS idx_content_blocks_key;

