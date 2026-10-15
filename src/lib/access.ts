import type { Course, LessonAccess } from "./catalog";

export type AcademyIdentity = { sub: string; name: string; entitlements: string[]; exp: number };

export function canReadLesson(
  course: Pick<Course,"slug" | "access">,
  lesson: { access: LessonAccess },
  identity: AcademyIdentity | null
): boolean {
  if (course.access === "free" || lesson.access === "free") return true;
  if (!identity || identity.exp <= Math.floor(Date.now() / 1000)) return false;
  if (identity.entitlements.includes("academy_all_access")) return true;
  if (identity.entitlements.includes("academy_course:" + course.slug)) return true;
  if (course.access === "one_time") return false;
  return lesson.access === "plus" && identity.entitlements.includes("academy_plus");
}

export function accessLabel(access: LessonAccess): string {
  return access === "free" ? "Free" : access === "plus" ? "Academy Plus" : "Course purchase";
}

export function courseProgress(completed: string[], lessonCount: number): number {
  if (lessonCount <= 0) return 0;
  return Math.round((Math.min(new Set(completed).size, lessonCount) / lessonCount) * 100);
}
