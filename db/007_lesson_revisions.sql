-- Academy-owned course editorial revisions (never identity, merchant CRM or billing).
-- Apply ONLY after approved 001..006 backup/migration. No automatic startup migrations.
-- Revision authors and reviewers are opaque TAKATAK-V1 master IDs.
CREATE TABLE IF NOT EXISTS academy_lesson_revision (
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK(revision > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','retired')),
  title TEXT NOT NULL CHECK(length(btrim(title)) BETWEEN 8 AND 140),
  paragraphs JSONB NOT NULL CHECK(
    jsonb_typeof(paragraphs) = 'array' AND jsonb_array_length(paragraphs) BETWEEN 2 AND 15
  ),
  activity TEXT NOT NULL CHECK(length(btrim(activity)) BETWEEN 15 AND 2000),
  created_by TEXT NOT NULL,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  PRIMARY KEY(course_slug,lesson_slug,revision),
  CHECK(status <> 'published' OR (reviewed_by IS NOT NULL AND published_at IS NOT NULL)),
  CHECK(reviewed_by IS NULL OR reviewed_by <> created_by)
);
CREATE UNIQUE INDEX IF NOT EXISTS academy_one_published_lesson_revision
  ON academy_lesson_revision(course_slug,lesson_slug) WHERE status='published';
CREATE INDEX IF NOT EXISTS academy_lesson_revision_status
  ON academy_lesson_revision(course_slug,lesson_slug,status,revision DESC);
