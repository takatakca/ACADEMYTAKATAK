import Link from "next/link";
import { programs,getProgramCourses } from "@/lib/programs";
export const metadata={title:"Learning Programs | TAKATAK Academy",description:"Explore structured multi-course learning paths across the GROUPE TAKATAK ecosystem."};
export default function Programs(){
 return <div className="container inner-page">
   <div className="centered-heading"><span className="eyebrow">TAKATAK UNIVERSITY · PROGRAM DIRECTORY</span>
   <h1>Choose a learning <span className="gradient-text">program.</span></h1>
   <p>Follow curated courses from foundations to advanced knowledge, complete exams and accumulate points across your entire learning journey.</p></div>
   <div className="program-grid">{programs.map(program=>{
     const paths=getProgramCourses(program);
     return <Link href={`/programs/${program.slug}`} key={program.slug} className="program-card">
       <div className={`program-art art-${program.accent}`}><span>{program.icon}</span><small>{program.department}</small></div>
       <div className="program-body"><span className="kicker">{paths.length} COURSES · {paths.reduce((n,c)=>n+c.lessons.length,0)} LESSONS</span>
       <h2>{program.title}</h2><p>{program.description}</p><span className="text-link">Explore program →</span></div>
     </Link>;
   })}</div>
   <div className="notice account-note">Programs organize training in a recommended order. Paid lessons remain subject to validated TAKATAK-V1 entitlements. Programs do not grant statutory licences or external academic accreditation.</div>
 </div>;
}
