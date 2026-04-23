-- Application form enhancement migration
-- Adds new fields for structured application data

-- Add new columns to applications table
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS college_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS applicant_status VARCHAR(50), -- 'STUDENT' or 'GRADUATE'
  ADD COLUMN IF NOT EXISTS current_year_or_experience VARCHAR(50), -- e.g., '1st Year', 'Fresher', '0-1 yr'
  ADD COLUMN IF NOT EXISTS motivation TEXT;

-- Add comments for documentation
COMMENT ON COLUMN applications.phone IS 'Applicant phone number (now required)';
COMMENT ON COLUMN applications.college_name IS 'College or institution name';
COMMENT ON COLUMN applications.applicant_status IS 'STUDENT or GRADUATE';
COMMENT ON COLUMN applications.current_year_or_experience IS 'Year for students (1st-4th) or experience for graduates';
COMMENT ON COLUMN applications.motivation IS 'Why they want to join (optional)';

-- Note: answers column is retained for backward compatibility but will no longer be populated
