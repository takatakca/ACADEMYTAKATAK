import Link from "next/link";
import { notFound } from "next/navigation";
import { currentIdentity } from "@/lib/session";
import { canAuthorExams,canReviewExams } from "@/lib/assessment-policy";
import { courses } from "@/lib/catalog";
import InstructorExamEditor from "@/components/instructor-exam-editor";

export const dynamic="force-dynamic";
export const metadata={title:"Instructor exam review | TAKATAK Academy",robots:{index:false,follow:false}};
export default async function InstructorExams(){
 const identity=await currentIdentity();
 const author=canAuthorExams(identity),reviewer=canReviewExams(identity);
 if(!identity||(!author&&!reviewer))notFound();
 return <div className="container inner-page">
   <div className="breadcrumbs"><Link href="/account">My learning</Link><span>/</span><span>Staff exam desk</span></div>
   <header className="assessment-head"><span className="eyebrow">TAKATAK ACADEMY · PRIVATE STAFF WORKSPACE</span>
     <h1>Exam editorial <span className="gradient-text">desk.</span></h1>
     <p>Prepare original private question banks and publish only after review by a separate authorized TAKATAK staff identity. Live student quizzes use published versions; draft answers never appear on public course pages.</p>
     <div className="assessment-stat-row">
       <span>{author?"Author permissions":"Read-only for authors"}</span>
       <span>{reviewer?"Reviewer permissions":"Publication restricted"}</span>
       <span>10–60 questions per private bank</span>
       <span>Five randomly selected per sitting</span>
     </div>
   </header>
   <InstructorExamEditor courses={courses.map(c=>({slug:c.slug,title:c.title}))} canAuthor={author} canReview={reviewer}/>
   <div className="notice account-note">Training questions require subject-matter review. This tool does not award external licences or academic accreditation. Author and reviewer rights must originate from TAKATAK-V1.</div>
 </div>;
}
