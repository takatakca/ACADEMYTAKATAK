import Link from "next/link";
import { currentIdentity } from "@/lib/session";
import { canAuthorExams, canReviewExams } from "@/lib/assessment-policy";
import { canWriteLessons, canPublishLessons } from "@/lib/lesson-policy";
import { hasSignedOrganizationManagerGrant } from "@/lib/organization-policy";

export const dynamic = "force-dynamic";
export const metadata = { title: "University campus | TAKATAK Academy" };

export default async function UniversityCampus() {
  const identity = await currentIdentity();
  const educator = canAuthorExams(identity) || canReviewExams(identity) ||
    canWriteLessons(identity) || canPublishLessons(identity);
  const orgManager = hasSignedOrganizationManagerGrant(identity);
  return <div className="container inner-page">
    <div className="centered-heading">
      <span className="eyebrow">TAKATAK UNIVERSITY · YOUR CAMPUS</span>
      <h1>One Academy. <span className="gradient-text">Different ways to grow.</span></h1>
      <p>Real courses and learning progress share your TAKATAK identity. Teacher and organization privileges require verified master access; this page never grants them.</p>
    </div>
    <div className="feature-grid">
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">01</span>
        <h2>Student</h2>
        <p>Choose programs, read lessons, complete exercises and take approved Academy practice assessments.</p>
        <Link className="text-link" href={identity ? "/account" : "/auth/start"}>{identity ? "Go to my learning →" : "Sign in through TAKATAK →"}</Link>
      </section>
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">02</span>
        <h2>Teacher & reviewer</h2>
        <p>Draft, inspect and approve curriculum through existing access-controlled Academy editorial tools.</p>
        {educator ? <div>
          <Link className="text-link" href="/instructor/lessons">Lesson editorial desk →</Link>
          <p><Link className="text-link" href="/instructor/exams">Exam review desk →</Link></p>
        </div> : <p>Staff roles are provisioned by TAKATAK-V1. No self-service teacher promotion.</p>}
      </section>
      <section className="feature-card">
        <span className="feature-icon" aria-hidden="true">03</span>
        <h2>Organization & OBNL</h2>
        <p>Prepare cohort sponsorship, training programs, seats and accountable reporting for approved partners.</p>
        <Link className="text-link" href={orgManager ? "/organizations/dashboard" : "/organizations"}>
          {orgManager ? "My organization portal →" : "Organization learning options →"}
        </Link>
      </section>
    </div>
    <div className="notice account-note">
      AI-led conversations, multimedia generation, live cohort management and group checkout are not yet live. Educator publishing and learner progress depend on signed entitlements, configured PostgreSQL and source-to-production verification.
    </div>
  </div>;
}
