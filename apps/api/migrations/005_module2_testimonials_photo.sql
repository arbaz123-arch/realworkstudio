-- Module 2: Testimonials required fields (backward compatible)

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_testimonials_photo_url ON testimonials (photo_url);

