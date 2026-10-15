-- Migration 002: exam history and capped, non-farmable course points.
-- Academy owns learning attempts only, not master identities or TAKATAK billing.
-- Apply after approval, backup and controlled production maintenance window.
CREATE TABLE IF NOT EXISTS academy_exam_attempt (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  master_identity_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  correct_answers SMALLINT NOT NULL CHECK (correct_answers BETWEEN 0 AND 5),
  question_count SMALLINT NOT NULL CHECK (question_count = 5),
  points SMALLINT NOT NULL CHECK (points BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS academy_exam_attempt_learner_course_idx
  ON academy_exam_attempt(master_identity_id, course_slug, submitted_at DESC);
CREATE INDEX IF NOT EXISTS academy_exam_attempt_recent_idx
  ON academy_exam_attempt(master_identity_id, submitted_at DESC);
-- Students earn the best score ONCE per course, not points on every retry.
-- SELECT course_slug, MAX(points) FROM academy_exam_attempt
-- WHERE master_identity_id = $1 GROUP BY course_slug;
