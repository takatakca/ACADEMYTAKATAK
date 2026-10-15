import type { Course } from "./catalog";
import type { LearningProgram } from "./programs";
import { isCourseMastered, type ProgressByCourse, type GradeRecord } from "./achievements";

/** Only complete, fully assessed paths qualify for a factual Academy learning record. */
export function eligibleForProgramAward(
 program:Pick<LearningProgram,"courseSlugs">,
 courses:readonly Course[],
 progress:ProgressByCourse,
 grades:ReadonlyMap<string,GradeRecord>
):boolean{
 if(program.courseSlugs.length===0)return false;
 const bySlug=new Map(courses.map(c=>[c.slug,c]));
 return program.courseSlugs.every(slug=>{
   const course=bySlug.get(slug);
   return !!course&&isCourseMastered(course,progress,grades);
 });
}
export function validAwardId(id:unknown):id is string {
 return typeof id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
