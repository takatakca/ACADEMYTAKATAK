import "server-only";
import type { AcademyIdentity } from "./access";
import { learningDb } from "./progress";
import { hasSignedOrganizationManagerGrant, organizationKindLabel, type OrganizationKind } from "./organization-policy";

type OrgRow = { organization_id: string; display_name: string; kind: OrganizationKind };

export type OrganizationSummary = {
  organizationId: string;
  name: string;
  category: string;
};

/** Lists only approved organizations with an active manager membership for
 * the signed TAKATAK master identity. No org ID comes from a query parameter.
 * No student names, emails, exam grades, billing or member lists are returned.
 */
export async function listAuthorizedOrganizations(
  identity: AcademyIdentity | null
): Promise<OrganizationSummary[]> {
  if (!hasSignedOrganizationManagerGrant(identity) || !identity) return [];
  const db = learningDb();
  if (!db) throw new Error("organization_storage_unavailable");
  const result = await db.query<OrgRow>(
    `SELECT o.organization_id,o.display_name,o.kind
     FROM academy_organization o
     INNER JOIN academy_org_membership m ON m.organization_id=o.organization_id
     WHERE m.master_identity_id=$1
       AND m.role='manager' AND m.status='active'
       AND o.status='approved'
     ORDER BY o.display_name ASC
     LIMIT 100`,
    [identity.sub]
  );
  return result.rows.map(row => ({
    organizationId: row.organization_id,
    name: row.display_name,
    category: organizationKindLabel(row.kind)
  }));
}
