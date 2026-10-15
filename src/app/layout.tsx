import type { Metadata } from "next";
import Link from "next/link";
import { currentIdentity } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: { default:"TAKATAK Academy | Learn. Build. Grow.", template:"%s | TAKATAK Academy" },
  description:"Practical learning across SEO, online stores, AI, websites, local marketing, business tools and professional development from GROUPE TAKATAK.",
  robots:{ index:true, follow:true }
};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const identity = await currentIdentity();
  const dashboard = process.env.NEXT_PUBLIC_TAKATAK_DASHBOARD_URL || "https://takatak.ca/dashboard";
  return <html lang="en"><body>
    <div className="announcement"><span className="spark">◆</span> GROUPE TAKATAK / DIGITAL SOLUTIONS. REAL RESULTS. <span className="announcement-secondary">Learn to grow your business.</span></div>
    <header className="topbar"><div className="container nav-wrap">
      <Link href="/" className="logo" aria-label="TAKATAK Academy home">
        <span className="logo-mark">T<span>↗</span></span><span className="logo-type"><strong>TAKATAK</strong><small>ACADEMY</small></span>
      </Link>
      <nav aria-label="Main menu" className="menu">
        <Link href="/#courses">Courses</Link><Link href="/programs">Programs</Link><Link href="/pricing">Plans</Link><Link href="/resources">Resources</Link><Link href="/partners">Partners</Link>
      </nav>
      <div className="nav-actions"><a className="dashboard-link" href={dashboard}>Main dashboard ↗</a>
        <Link className="btn btn-outline nav-button" href={identity ? "/account" : "/auth/start"}>{identity ? "My learning" : "Sign in"}</Link>
      </div>
    </div></header>
    <main>{children}</main>
    <footer className="footer"><div className="container footer-grid">
      <div><div className="footer-brand">TAKATAK <span>ACADEMY</span></div><p>Skills for the real world. One account across GROUPE TAKATAK.</p><small>© 2026 GROUPE TAKATAK. All rights reserved.</small></div>
      <div><strong>Explore</strong><Link href="/#courses">All academies</Link><Link href="/programs">Learning programs</Link><Link href="/pricing">Pricing & access</Link><Link href="/resources">Resources</Link></div>
      <div><strong>Community</strong><Link href="/partners">Partners</Link><Link href="/account">My learning</Link><a href={dashboard}>TAKATAK-V1 dashboard ↗</a></div>
    </div></footer>
  </body></html>;
}
