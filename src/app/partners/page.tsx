import Link from "next/link";
export const metadata={title:"Academy partners"};
export default function Partners(){return <div className="container inner-page">
<div className="centered-heading"><span className="kicker">TAKATAK ACADEMY PARTNERS</span><h1>Grow with knowledge.</h1><p>Introduce learners and businesses to practical education across the TAKATAK ecosystem.</p></div>
<div className="feature-grid"><div className="feature-card"><span className="feature-icon">01</span><h3>Share useful training</h3><p>Recommend relevant free lessons and responsible professional learning pathways.</p></div><div className="feature-card"><span className="feature-icon">02</span><h3>Help learners succeed</h3><p>Guide students toward the skills and TAKATAK tools suited to their goals.</p></div><div className="feature-card"><span className="feature-icon">03</span><h3>Earn when a program launches</h3><p>Partner commissions and tracking terms require approval before they can be offered.</p></div></div>
<div className="notice">The affiliate program is in planning. No commission percentages, cookie windows, payout guarantees or enrollment approval are currently offered by TAKATAK Academy.</div>
<div className="centered-page"><Link href="/" className="btn btn-primary">Discover Academy courses →</Link></div>
</div>}
