import type { Course } from "./catalog";
import type { LearningProgram } from "./programs";

/** A transcript entry is mastered only after all of its lessons and a passing exam. */
export type GradeRecord={courseSlug:string;bestPoints:number;passed:boolean};
export type ProgressByCourse=ReadonlyMap<string,readonly string[]>;

export function isCourseMastered(course: Pick<Course,"slug"|"lessons">,progress:ProgressByCourse,grades:ReadonlyMap<string,GradeRecord>):boolean {
  const lessons=new Set(progress.get(course.slug)??[]);
  return course.lessons.every(lesson=>lessons.has(lesson.slug)) && grades.get(course.slug)?.passed===true;
}
export function masteredProgramCount(
  programs:readonly Pick<LearningProgram,"courseSlugs">[],
  courses:readonly Course[],
  progress:ProgressByCourse,
  grades:ReadonlyMap<string,GradeRecord>
):number {
  const bySlug=new Map(courses.map(course=>[course.slug,course]));
  return programs.filter(program=>program.courseSlugs.length>0 &&
    program.courseSlugs.every(slug=>{
      const course=bySlug.get(slug);
      return !!course && isCourseMastered(course,progress,grades);
    })).length;
}
export function totalEarnedPoints(grades:readonly GradeRecord[]):number {
  return grades.reduce((total,grade)=>total+Math.max(0,Math.min(100,grade.bestPoints)),0);
}
