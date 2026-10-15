-- Academy-owned learner exercises: apply only after DB backup and production approval.
-- Never duplicate TAKATAK-V1 customer identity or billing data here.
CREATE TABLE IF NOT EXISTS academy_activity_submission (
  master_identity_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  response_text TEXT NOT NULL CHECK (char_length(response_text) BETWEEN 1 AND 4000),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (master_identity_id,course_slug,lesson_slug)
);
CREATE INDEX IF NOT EXISTS academy_activity_submission_updated_idx
  ON academy_activity_submission(master_identity_id,updated_at DESC);
