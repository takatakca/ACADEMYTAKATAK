-- Academy educational (NOT externally accredited) completion records.
-- Apply after db/001 through db/004, authorized DB backup and migration review.
CREATE TABLE IF NOT EXISTS academy_program_award (
  award_id UUID PRIMARY KEY,
  master_identity_id TEXT NOT NULL,
  program_slug TEXT NOT NULL,
  course_slugs JSONB NOT NULL CHECK(jsonb_typeof(course_slugs)='array' AND jsonb_array_length(course_slugs)>0),
  points_earned INTEGER NOT NULL CHECK(points_earned BETWEEN 0 AND 10000),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','revoked')),
  revoked_at TIMESTAMPTZ,
  revoked_by TEXT,
  revocation_reason TEXT,
  UNIQUE(master_identity_id,program_slug),
  CHECK(status <> 'revoked' OR (revoked_at IS NOT NULL AND revoked_by IS NOT NULL AND revocation_reason IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS academy_program_award_by_student
  ON academy_program_award(master_identity_id,issued_at DESC);
CREATE INDEX IF NOT EXISTS academy_program_award_by_status
  ON academy_program_award(status,issued_at DESC);
