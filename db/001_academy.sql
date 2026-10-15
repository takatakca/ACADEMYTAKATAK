-- Academy owns learning progress only. TAKATAK-V1 owns identity, entitlements and billing.
-- Apply through the approved PostgreSQL migration process; never from the web request path.
CREATE TABLE IF NOT EXISTS academy_lesson_progress (
  master_identity_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (master_identity_id, course_slug, lesson_slug)
);
CREATE INDEX IF NOT EXISTS academy_lesson_progress_course_idx
ON academy_lesson_progress (master_identity_id, course_slug, completed_at DESC);
