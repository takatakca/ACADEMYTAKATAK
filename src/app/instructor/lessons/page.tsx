import Link from "next/link";
import {notFound} from "next/navigation";
import {currentIdentity} from "@/lib/session";
import {canWriteLessons,canPublishLessons} from "@/lib/lesson-policy";
import {courses} from "@/lib/catalog";
import InstructorLessonEditor from "@/components/instructor-lesson-editor";

export const dynamic="force-dynamic";
export const metadata={title:"Lesson editorial desk | TAKATAK Academy",robots:{index:false,follow:false}};
export default async function InstructorLessonsPage(){
 const identity=await currentIdentity();
 const author=canWriteLessons(identity),reviewer=canPublishLessons(identity);
 if(!author&&!reviewer)notFound();
 const options=courses.map(c=>({slug:c.slug,title:c.title,
  lessons:c.lessons.map(l=>({slug:l.slug,title:l.title,content:l.content,activity:l.activity}))}));
 return <div className="container inner-page">
   <div className="breadcrumbs"><Link href="/account">My learning</Link><span>/</span><span>Lesson editorial desk</span></div>
   <div className="assessment-head"><span className="eyebrow">TAKATAK ACADEMY · RESTRICTED STAFF WORKSPACE</span>
     <h1>Improve the <span className="gradient-text">curriculum.</span></h1>
     <p>Author in private, review independently and publish a versioned lesson. Students only receive the latest approved copy when their TAKATAK entitlements allow them to read that lesson.</p>
     <div className="assessment-stat-row"><span>{author?"Author access":"Reviewer access only"}</span>
       <span>{reviewer?"Publication review enabled":"Publication requires reviewer"}</span>
       <span>Course access unchanged</span></div>
   </div>
   <InstructorLessonEditor courses={options} canAuthor={author} canReview={reviewer}/>
   <div className="notice account-note">TAKATAK-V1 remains the authority for staff permissions and student purchases. Do not publish unverified safety, regulatory or credential claims.</div>
 </div>;
}
