-- Module 8: Media Management - Create media table for tracking uploads
-- Run: psql "$DATABASE_URL" -f migrations/009_module8_media_table.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Media table to track uploaded files
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR(2048) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_media_type ON media (type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media (created_at);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media (uploaded_by);

-- Update applications table to add phone and answers (Module 9 enhancements)
DO $$
BEGIN
  -- Add phone column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'phone'
  ) THEN
    ALTER TABLE applications ADD COLUMN phone VARCHAR(20);
  END IF;

  -- Add answers JSON column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'answers'
  ) THEN
    ALTER TABLE applications ADD COLUMN answers JSONB DEFAULT '{}';
  END IF;
END $$;

-- Ensure status has proper constraint
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('pending', 'reviewed', 'rejected'));

-- Prevent duplicate applications (same email + program)
ALTER TABLE applications DROP CONSTRAINT IF EXISTS unique_application;
ALTER TABLE applications ADD CONSTRAINT unique_application UNIQUE (email, program_id);

-- Performance indexes for faster filtering and sorting
CREATE INDEX IF NOT EXISTS idx_applications_program ON applications(program_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_name ON applications(name);
