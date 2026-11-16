import Link from "next/link";

export const metadata = {
  title: "Business & OBNL learning partnerships | TAKATAK Academy",
  description: "Training partnership information for Québec OBNL, businesses and educational organizations."
};
export default function OrganizationLearningOptions() {
  return <div className="container inner-page">
    <div className="centered-heading">
      <span className="eyebrow">TAKATAK UNIVERSITY / ORGANIZATION LEARNING</span>
      <h1>Train your team. <span className="gradient-text">Create new opportunities.</span></h1>
      <p>Designed for employers, Québec OBNL, associations and educational partners who want practical digital skills training. Seats, discounts and agreements will be administered through the existing TAKATAK billing and authorization system once approved.</p>
    </div>
    <div className="feature-grid">
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">01</span>
        <h2>Business training</h2>
        <p>Plan role-specific modules across marketing, commerce, customer service, operations, IT and AI.</p>
      </section>
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">02</span>
        <h2>Québec OBNL programs</h2>
        <p>Prepare tailored learning paths, sponsored places and bilingual resources with signed partnership terms.</p>
      </section>
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">03</span>
        <h2>Education partners</h2>
        <p>Combine structured courses with supervised projects, original instructional materials and educator feedback.</p>
      </section>
    </div>
    <div className="panel account-note">
      <h2>How organization access will work</h2>
      <p>TAKATAK-V1 verifies the organization and its approved manager. Academy stores scoped learning memberships and future program-seat records, but cannot grant paid lessons without payment-confirmed V1 entitlements. Staff are not allowed to inspect unrelated organizations or learner results.</p>
      <p>Organization enrollment, negotiated pricing, contract acceptance, sponsorship checkout and cohort reporting remain under development; this information page does not collect payment or applications.</p>
      <Link className="btn btn-outline" href="/campus">Explore the learning campus →</Link>
    </div>
  </div>;
}
