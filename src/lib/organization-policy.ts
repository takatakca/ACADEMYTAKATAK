import type { AcademyIdentity } from "./access";

export type OrganizationKind = "business" | "nonprofit" | "education";
export type OrganizationRole = "learner" | "instructor" | "manager";
export type OrgMembership = {
  organizationId: string;
  role: OrganizationRole;
  membershipStatus: "pending" | "active" | "revoked";
  organizationStatus: "pending" | "approved" | "suspended";
};

export function hasSignedOrganizationManagerGrant(identity: AcademyIdentity | null): boolean {
  return Boolean(identity && identity.exp > Math.floor(Date.now() / 1000) &&
    identity.entitlements.some(entitlement =>
      entitlement === "academy_org_manager" || entitlement === "academy_org_admin"));
}

/**
 * An entitlement alone is insufficient: the caller must ALSO be a manager of
 * this exact, active organization in Academy's private organization registry.
 * Neither a browser-supplied role nor a seat purchase grants organization control.
 */
export function canManageOrganization(
  identity: AcademyIdentity | null,
  membership: OrgMembership | null
): boolean {
  return hasSignedOrganizationManagerGrant(identity) &&
    membership?.role === "manager" &&
    membership.membershipStatus === "active" &&
    membership.organizationStatus === "approved";
}

export function organizationKindLabel(kind: OrganizationKind): string {
  switch (kind) {
    case "nonprofit": return "OBNL / Non-profit";
    case "education": return "Educational organization";
    default: return "Business / Employer";
  }
}
