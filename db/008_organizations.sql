-- Academy training affiliations only; TAKATAK-V1 remains authoritative for
-- corporate/OBNL identity, master membership, billed seats and entitlements.
-- Apply after migrations 001-007 using an approved, backed-up Academy database.
-- No public endpoint creates memberships, organization records or paid access.
CREATE TABLE IF NOT EXISTS academy_organization (
 organization_id UUID PRIMARY KEY,
 master_organization_ref TEXT NOT NULL UNIQUE,
 display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 160),
 kind TEXT NOT NULL CHECK (kind IN ('business','nonprofit','education')),
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 approved_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS academy_org_membership (
 organization_id UUID NOT NULL REFERENCES academy_organization(organization_id),
 master_identity_id TEXT NOT NULL,
 role TEXT NOT NULL CHECK (role IN ('learner','instructor','manager')),
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','revoked')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (organization_id,master_identity_id)
);
CREATE INDEX IF NOT EXISTS academy_org_membership_user_idx
 ON academy_org_membership (master_identity_id,role,status,organization_id);
CREATE TABLE IF NOT EXISTS academy_org_program_seat (
 organization_id UUID NOT NULL,
 master_identity_id TEXT NOT NULL,
 program_slug TEXT NOT NULL CHECK (program_slug ~ '^[a-z0-9-]{2,80}$'),
 status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved','active','revoked')),
 approved_master_grant_ref TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (organization_id,master_identity_id,program_slug),
 FOREIGN KEY (organization_id,master_identity_id)
 REFERENCES academy_org_membership(organization_id,master_identity_id),
 CHECK (status <> 'active' OR approved_master_grant_ref IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS academy_org_seat_status_idx
 ON academy_org_program_seat(organization_id, status);
-- These records do NOT grant access to Plus or purchased course content.
-- Lesson access must continue to use verified TAKATAK-V1 session entitlements.
