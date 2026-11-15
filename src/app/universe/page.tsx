import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/lib/catalog";
import { programs } from "@/lib/programs";
import styles from "./universe.module.css";

export const metadata: Metadata = {
  title: "AI Learning Universe | TAKATAK Academy",
  description: "Explore an original AI-first vision for TAKATAK Academy, and start real courses and learning programs already available in the TAKATAK ecosystem.",
};

const pathways = [
  { id: "01", label: "GROWTH INTELLIGENCE", title: "Marketing & AI", description: "From discoverability and creative strategy to measurable campaigns and responsible automation.", href: "/programs/marketing-ai", accent: "violet" },
  { id: "02", label: "BUILD WITH DATA", title: "Business Intelligence", description: "Learn reporting, trustworthy analysis, practical AI workflows and automation controls.", href: "/programs/business-intelligence", accent: "blue" },
  { id: "03", label: "BUILD A BUSINESS", title: "Digital Business", description: "Learn the real workflows behind websites, customer accounts, secure teams and operations.", href: "/programs/digital-business", accent: "cyan" },
  { id: "04", label: "CONNECT WITH CUSTOMERS", title: "Sales & Success", description: "Strengthen customer journeys, support, reputation and the sales-to-service process.", href: "/programs/sales-success", accent: "pink" },
] as const;

const learningLoop = [
  { number: "01", title: "Choose your mission", copy: "Start with a real Academy course or a structured program matched to a business goal." },
  { number: "02", title: "Learn and practice", copy: "Use the existing lessons, exercises and assessments to build foundational skills." },
  { number: "03", title: "Build something real", copy: "Apply learning in the TAKATAK tools and keep the resulting work in your own workspace." },
  { number: "04", title: "Grow your portfolio", copy: "Track progress and educational outcomes without claiming external academic accreditation." },
] as const;

const futureCapabilities = [
  { icon: "✧", title: "Personal AI mentor", copy: "A consent-based tutor that explains, questions and adapts using approved lesson material." },
  { icon: "◉", title: "Voice & visual instruction", copy: "Optional narrated lessons and original on-screen teaching characters with clear AI disclosure." },
  { icon: "⌘", title: "Hands-on AI labs", copy: "Scenario-driven challenges, governed tools and feedback tied to actual work products." },
  { icon: "◎", title: "Learning community", copy: "Moderated cohorts, peer feedback and expert-led events when operations are approved." },
] as const;

export default function LearningUniverse() {
  return <div className={styles.world}>
    <section className={styles.hero} aria-labelledby="universe-title">
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span className={styles.signal} /> TAKATAK ACADEMY / NEXT GENERATION LEARNING</span>
            <h1 id="universe-title">Your future is <em>not a lecture.</em> It&apos;s a universe to build.</h1>
            <p className={styles.lead}>An ambitious new direction for practical business education. Learn in the real TAKATAK ecosystem today—and discover the AI-led learning experiences we&apos;re designing for tomorrow.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/programs">Explore real programs <span aria-hidden="true">↗</span></Link>
              <Link className={styles.secondary} href="/auth/start">Continue with TAKATAK <span aria-hidden="true">→</span></Link>
            </div>
            <p className={styles.credibility}>Existing curriculum · One TAKATAK identity · AI teaching features in development</p>
          </div>
          <div className={styles.visual} aria-label="Illustrative concept of a future AI-led learning interface">
            <div className={styles.ringOne} aria-hidden="true" /><div className={styles.ringTwo} aria-hidden="true" /><div className={styles.centerLight} aria-hidden="true" />
            <div className={styles.mentorFrame}>
              <div className={styles.frameHeader}><span><span className={styles.frameDot} /> TAKATAK / LEARNING STUDIO</span><span>CONCEPT PREVIEW</span></div>
              <div className={styles.mentorPresence} aria-hidden="true"><div className={styles.core}><span>✧</span></div></div>
              <div className={styles.mentorContent}>
                <span className={styles.frameLabel}>FUTURE AI MENTOR EXPERIENCE</span>
                <h2>What do you want to master?</h2>
                <p>Picture an AI guide that teaches you through conversation, examples, demonstrations and practice.</p>
                <div className={styles.mockPrompts} aria-hidden="true"><span>Build a marketing plan</span><span>Understand analytics</span><span>Launch a website</span></div>
              </div>
              <div className={styles.frameFooter}>Illustration only — no live AI conversation on this page</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className={styles.statBand}><div className={styles.wrap}><div className={styles.stats}>
      <div><strong>{courses.length}</strong><span>existing learning paths</span></div>
      <div><strong>{courses.reduce((total, course) => total + course.lessons.length, 0)}</strong><span>starter lessons in source</span></div>
      <div><strong>{programs.length}</strong><span>structured programs</span></div>
      <div><strong>01</strong><span>TAKATAK learning identity</span></div>
    </div></div></div>

    <section className={styles.section} aria-labelledby="pathways-title">
      <div className={styles.wrap}>
        <div className={styles.sectionTop}><div><span className={styles.kicker}>START WITH WHAT ALREADY EXISTS</span><h2 id="pathways-title">Choose a direction.<br/><em>Build your own future.</em></h2></div><p>These are real learning programs in the Academy catalog. Explore their current courses and requirements.</p></div>
        <div className={styles.pathGrid}>{pathways.map((path) => <Link className={styles.pathCard} href={path.href} key={path.id}>
          <div className={styles.pathTop}><span>{path.label}</span><span aria-hidden="true">↗</span></div>
          <div className={`${styles.pathSymbol} ${styles[path.accent]}`} aria-hidden="true">{path.id}</div>
          <h3>{path.title}</h3><p>{path.description}</p><span className={styles.pathAction}>Explore program <span aria-hidden="true">→</span></span>
        </Link>)}</div>
        <p className={styles.allPaths}><Link href="/programs">View all {programs.length} Academy programs <span aria-hidden="true">↗</span></Link></p>
      </div>
    </section>

    <section className={`${styles.section} ${styles.workflow}`} aria-labelledby="workflow-title"><div className={styles.wrap}>
      <span className={styles.kicker}>THE PRACTICAL LEARNING LOOP</span><h2 id="workflow-title">Don&apos;t just watch.<br/><em>Make progress.</em></h2>
      <div className={styles.steps}>{learningLoop.map(step => <div className={styles.step} key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></div>)}</div>
    </div></section>

    <section className={styles.section} aria-labelledby="future-title"><div className={styles.wrap}>
      <div className={styles.sectionTop}><div><span className={styles.kicker}>THE NEXT CHAPTER / PRODUCT ROADMAP</span><h2 id="future-title">A learning universe that<br/><em>can eventually talk back.</em></h2></div><p>Our planned AI experience goes beyond traditional video courses. The capabilities below are design goals, not live product features.</p></div>
      <div className={styles.futureGrid}>{futureCapabilities.map(feature => <div className={styles.futureCard} key={feature.title}>
        <span className={styles.futureIcon} aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.copy}</p><span className={styles.futureStatus}>PLANNED / NOT YET ACTIVE</span>
      </div>)}</div>
      <div className={styles.principle}><span aria-hidden="true">✦</span><div><strong>AI-led, human-accountable.</strong><p>All tutoring, generated voice, avatars and assessments require licensed or original assets, user consent, safety evaluation, cost limits and clearly disclosed AI output before activation.</p></div></div>
    </div></section>

    <section className={styles.finalSection}><div className={styles.wrap}><div className={styles.finalBox}>
      <span className={styles.kicker}>START LEARNING NOW</span>
      <h2>The new universe begins<br/>with one real skill.</h2>
      <p>Explore current courses while we develop immersive, personalized AI instruction. Your Academy learning remains connected to your TAKATAK account.</p>
      <div className={styles.actions}><Link className={styles.primary} href="/#courses">Browse current courses <span aria-hidden="true">↗</span></Link><Link className={styles.secondary} href="/account">My learning <span aria-hidden="true">→</span></Link></div>
      <small>Academy completion records are educational and are not academic degrees or official professional licences. No paid checkout or autonomous AI tutor is implied by this preview.</small>
    </div></div></section>
  </div>;
}
