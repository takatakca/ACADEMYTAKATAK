import Link from "next/link";
import { categories, courses } from "@/lib/catalog";
import { currentIdentity } from "@/lib/session";
import { programs,getProgramCourses } from "@/lib/programs";

export default async function Home({searchParams}:{searchParams:Promise<{category?:string}>}) {
  const {category} = await searchParams;
  const active = categories.includes(category || "") ? category : "";
  const visible = active ? courses.filter((c)=>c.category===active) : courses;
  const identity = await currentIdentity();
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-content"><span className="eyebrow"><span className="pulse-dot"></span> THE LEARNING HUB FOR EVERY AMBITION</span>
        <h1>Learn the skills.<br/><span className="gradient-text">Build what&apos;s next.</span></h1>
        <p>One academy. A world of practical skills. Start with free lessons, unlock advanced learning as you grow, and connect what you learn to your TAKATAK dashboard.</p>
        <div className="hero-buttons"><a className="btn btn-primary" href="#courses">Explore courses <span aria-hidden="true">↗</span></a>
          <Link className="btn btn-soft" href={identity ? "/account" : "/auth/start"}>{identity ? "Continue learning" : "Create your free account"} →</Link></div>
        <div className="hero-points"><span>✓ Free lessons for everyone</span><span>✓ Graded exams and earned points</span><span>✓ One TAKATAK identity</span></div>
      </div>
      <div className="hero-visual" aria-label="Overview of the TAKATAK Academy learning experience">
        <div className="orb orb-one"></div><div className="orb orb-two"></div>
        <div className="learning-preview">
          <div className="preview-top"><span className="preview-dots"><b></b><b></b><b></b></span><span>SAMPLE LEARNING PREVIEW</span><span>✧</span></div>
          <div className="preview-main"><div className="preview-heading">Keep moving forward<span className="preview-spark">✦</span></div>
            <p>Explore pathways designed for the way you work.</p>
            <div className="preview-course"><span className="preview-icon">⌁</span><div><strong>SEO + AEO Academy</strong><small>Search, discovery and AI visibility</small><div className="progress-track"><i style={{width:"42%"}}></i></div></div><span>42%</span></div>
            <div className="preview-course"><span className="preview-icon purple">◈</span><div><strong>Commerce & Growth</strong><small>Build your next big idea</small><div className="progress-track"><i style={{width:"12%"}}></i></div></div><span>12%</span></div>
            <div className="preview-stats"><span><b>{courses.length}</b><small>Learning paths</small></span><span><b>{courses.reduce((n,c)=>n+c.lessons.length,0)}</b><small>Starter lessons</small></span><span><b>∞</b><small>Possibilities</small></span></div>
          </div>
        </div>
      </div>
    </div></section>
    <section className="trust-row"><div className="container trust-inner"><span>BUILT FOR REAL-WORLD GROWTH</span><span>BUSINESS</span><span>MARKETING</span><span>COMMERCE</span><span>TECHNOLOGY</span><span>CAREERS</span></div></section>
    <section className="section program-feature"><div className="container">
      <div className="section-heading"><div><span className="kicker">MULTI-COURSE UNIVERSITY PATHS</span>
        <h2>Build a skillset. <span className="gradient-text">Master a program.</span></h2>
        <p>Follow recommended training paths with lessons, exercises, five-question assessments and earned points.</p></div>
        <Link href="/programs" className="text-link">Explore all programs ↗</Link></div>
      <div className="featured-programs">{programs.slice(0,3).map(p=><Link key={p.slug} href={"/programs/"+p.slug} className="featured-program">
        <span className={"featured-program-symbol art-"+p.accent}>{p.icon}</span><small>{p.department}</small><h3>{p.title}</h3>
        <p>{p.description}</p><strong>{getProgramCourses(p).length} courses · {getProgramCourses(p).length*100} possible exam points →</strong>
      </Link>)}</div>
    </div></section>
    <section id="courses" className="section catalogue"><div className="container">
      <div className="section-heading"><div><span className="kicker">YOUR NEXT SKILL STARTS HERE</span><h2>Explore our <span className="gradient-text">academies</span></h2>
        <p>Practical, step-by-step courses—from first steps to advanced workflows.</p></div>
        <Link href="/pricing" className="text-link">Compare learning plans ↗</Link></div>
      <div className="filter-list" aria-label="Filter course categories"><Link className={!active?"filter active":"filter"} href="/#courses">All courses</Link>{categories.map(c=><Link key={c} className={active===c?"filter active":"filter"} href={"/?category="+encodeURIComponent(c)+"#courses"}>{c}</Link>)}</div>
      <div className="course-grid">{visible.map((course)=><Link href={"/courses/"+course.slug} key={course.slug} className="course-card">
        <div className={"course-art art-"+course.accent}><span className="art-icon">{course.icon}</span><span className="art-detail">TAKATAK / ACADEMY</span><span className="art-lines"></span></div>
        <div className="course-body"><div className="course-topline"><span>{course.category}</span><span className={course.access==="free"?"tag tag-free":course.access==="one_time"?"tag tag-special":"tag"}>{course.access==="free"?"100% free":course.access==="one_time"?"Specialist":"Free + Premium"}</span></div>
          <h3>{course.title}</h3><p>{course.description}</p>
          <div className="course-footer"><span>◷ {course.lessons.length} lessons · {course.estimatedHours}h</span><span className="card-arrow">↗</span></div>
        </div></Link>)}</div>
    </div></section>
    <section className="section feature-section"><div className="container">
      <div className="section-heading narrow"><div><span className="kicker">DESIGNED AROUND YOUR GROWTH</span><h2>Start free. <span className="gradient-text">Go further.</span></h2></div></div>
      <div className="feature-grid">
        <div className="feature-card"><span className="feature-icon">01</span><h3>Explore without barriers</h3><p>Many lessons are free to read, so you can discover a subject before subscribing.</p></div>
        <div className="feature-card"><span className="feature-icon">02</span><h3>Choose your learning path</h3><p>Build practical skills across marketing, tech, commerce and professional training.</p></div>
        <div className="feature-card"><span className="feature-icon">03</span><h3>Connect to TAKATAK-V1</h3><p>One master account for your dashboard, learning access and future service entitlements.</p></div>
      </div>
    </div></section>
    <section className="section cta-section"><div className="container cta-box"><div><span className="kicker">YOUR NEXT CHAPTER</span><h2>Your learning journey starts today.</h2><p>Explore the free curriculum or see the upcoming premium access options.</p></div><Link href="/pricing" className="btn btn-white">Explore plans ↗</Link></div></section>
  </>;
}
