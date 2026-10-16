import type { AcademyIdentity } from "./access";

export type LessonRevisionDraft = {
 title:string;
 paragraphs:string[];
 activity:string;
};
export function validLessonRevision(input:unknown):input is LessonRevisionDraft {
 if(!input||typeof input!=="object"||Array.isArray(input))return false;
 const o=input as Record<string,unknown>;
 if(typeof o.title!=="string"||o.title.trim().length<8||o.title.length>140)return false;
 if(!Array.isArray(o.paragraphs)||o.paragraphs.length<2||o.paragraphs.length>15||
    !o.paragraphs.every(p=>typeof p==="string"&&p.trim().length>=30&&p.length<=2000))return false;
 if(typeof o.activity!=="string"||o.activity.trim().length<15||o.activity.length>2000)return false;
 return true;
}
export function canWriteLessons(identity:AcademyIdentity|null):boolean {
 return !!identity && identity.exp>Math.floor(Date.now()/1000)&&identity.entitlements.includes("academy_editor");
}
export function canPublishLessons(identity:AcademyIdentity|null):boolean {
 return !!identity && identity.exp>Math.floor(Date.now()/1000)&&identity.entitlements.includes("academy_reviewer");
}
