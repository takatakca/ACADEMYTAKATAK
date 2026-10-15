-- Academy-private reviewed item bank. Apply after db/001, 002 and 003 with a backup.
-- Do NOT publish this table through a public PostgREST / GraphQL endpoint.
-- Read and write access is restricted to the Academy backend database role.
CREATE TABLE IF NOT EXISTS academy_exam_version (
  course_slug TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','retired')),
  questions JSONB NOT NULL CHECK (jsonb_typeof(questions) = 'array' AND jsonb_array_length(questions) BETWEEN 10 AND 60),
  created_by TEXT NOT NULL,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  PRIMARY KEY (course_slug, version),
  CHECK (status <> 'published' OR (reviewed_by IS NOT NULL AND published_at IS NOT NULL)),
  CHECK (reviewed_by IS NULL OR reviewed_by <> created_by)
);
CREATE UNIQUE INDEX IF NOT EXISTS academy_one_published_exam_per_course
  ON academy_exam_version(course_slug) WHERE status='published';
CREATE INDEX IF NOT EXISTS academy_exam_version_review_queue
  ON academy_exam_version(status, created_at DESC);
ALTER TABLE academy_exam_attempt
  ADD COLUMN IF NOT EXISTS assessment_source TEXT NOT NULL DEFAULT 'public_practice'
  CHECK (assessment_source IN ('public_practice', 'private_reviewed'));
ALTER TABLE academy_exam_attempt
  ADD COLUMN IF NOT EXISTS assessment_version INTEGER;
CREATE INDEX IF NOT EXISTS academy_exam_attempt_source_version
  ON academy_exam_attempt(course_slug, assessment_source, assessment_version);
