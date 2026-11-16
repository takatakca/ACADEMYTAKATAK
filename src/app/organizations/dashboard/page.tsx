import Link from "next/link";
import { notFound } from "next/navigation";
import { currentIdentity } from "@/lib/session";
import { hasSignedOrganizationManagerGrant } from "@/lib/organization-policy";
import { listAuthorizedOrganizations } from "@/lib/organizations";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Organization portal | TAKATAK Academy",
  robots: { index: false, follow: false }
};
export default async function OrganizationDashboard() {
  const identity = await currentIdentity();
  if (!hasSignedOrganizationManagerGrant(identity)) notFound();

  let organizations: Awaited<ReturnType<typeof listAuthorizedOrganizations>> = [];
  let storageError = false;
  try { organizations = await listAuthorizedOrganizations(identity); }
  catch { storageError = true; }
  return <div className="container inner-page">
    <div className="breadcrumbs"><Link href="/campus">University campus</Link><span>/</span><span>Organizations</span></div>
    <span className="eyebrow">RESTRICTED / TAKATAK-VERIFIED ORGANIZATION MANAGER</span>
    <h1>My organization workspace</h1>
    <p>Only active, approved organizations linked to your verified TAKATAK identity are listed. No other organization&apos;s students, grades, invoices or content are exposed.</p>
    {storageError && <div className="important-note" role="alert">
      <strong>Organization registry unavailable.</strong>
      <p>No organization data was loaded. An approved Academy database migration and live TAKATAK organization permissions are required.</p>
    </div>}
    {!storageError && (organizations.length ? <div className="resource-grid">
      {organizations.map(org => <section key={org.organizationId} className="panel">
        <span className="kicker">{org.category}</span>
        <h2>{org.name}</h2>
        <p>Verified organization membership. Group seats, instructor assignment and cohort reporting need the approved V1 grant integration before activation.</p>
      </section>)}
    </div> : <div className="notice">No approved organization memberships are currently available for this identity.</div>)}
    <div className="notice account-note">This read-only view never assigns seats or unlocks courses. The master TAKATAK billing service must confirm any paid organization grant.</div>
  </div>;
}
