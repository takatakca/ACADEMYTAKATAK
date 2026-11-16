import test from "node:test";
import assert from "node:assert/strict";
import { canManageOrganization, hasSignedOrganizationManagerGrant, organizationKindLabel } from "../src/lib/organization-policy";
import type { AcademyIdentity } from "../src/lib/access";

const identity = (entitlements: string[], exp = Math.floor(Date.now() / 1000) + 600): AcademyIdentity => ({
  sub: "person-1", name: "Test learner", entitlements, exp
});
const member = {
  organizationId: "f3be0e20-b572-4acc-90b5-2f2b4597cbfe",
  role: "manager" as const,
  membershipStatus: "active" as const,
  organizationStatus: "approved" as const
};

test("organization dashboard requires an unexpired signed V1 entitlement", () => {
  assert.equal(hasSignedOrganizationManagerGrant(null), false);
  assert.equal(hasSignedOrganizationManagerGrant(identity(["academy_free"])), false);
  assert.equal(hasSignedOrganizationManagerGrant(identity(["academy_org_manager"], 1)), false);
  assert.equal(hasSignedOrganizationManagerGrant(identity(["academy_org_manager"])), true);
  assert.equal(hasSignedOrganizationManagerGrant(identity(["academy_org_admin"])), true);
});

test("V1 manager grant alone never authorizes an unapproved or unrelated organization membership", () => {
  const manager = identity(["academy_org_manager"]);
  assert.equal(canManageOrganization(manager, member), true);
  assert.equal(canManageOrganization(manager, null), false);
  assert.equal(canManageOrganization(identity(["academy_free"]), member), false);
  assert.equal(canManageOrganization(manager, {...member, role:"learner"}), false);
  assert.equal(canManageOrganization(manager, {...member, membershipStatus:"revoked"}), false);
  assert.equal(canManageOrganization(manager, {...member, organizationStatus:"suspended"}), false);
});

test("organization classification includes Quebec OBNL partnerships", () => {
  assert.equal(organizationKindLabel("nonprofit"), "OBNL / Non-profit");
  assert.equal(organizationKindLabel("education"), "Educational organization");
  assert.equal(organizationKindLabel("business"), "Business / Employer");
});
