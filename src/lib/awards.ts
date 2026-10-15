import "server-only";
import { randomUUID } from "node:crypto";
import { learningDb } from "./progress";
import { validAwardId } from "./award-policy";
import type { AcademyIdentity } from "./access";

export type AwardRecord={
  awardId:string;programSlug:string;courseSlugs:string[];pointsEarned:number;
  issuedAt:string;status:"active"|"revoked"
};
type AwardRow={award_id:string;program_slug:string;course_slugs:string[];
 points_earned:number;issued_at:string;status:"active"|"revoked"};
const toAward=(x:AwardRow):AwardRecord=>({
 awardId:x.award_id,programSlug:x.program_slug,courseSlugs:x.course_slugs,
 pointsEarned:x.points_earned,issuedAt:x.issued_at,status:x.status
});
const projection="award_id,program_slug,course_slugs,points_earned,issued_at::text AS issued_at,status";

export function canRevokeAwards(identity:AcademyIdentity|null):boolean {
 return !!identity && identity.exp>Date.now()/1000&&identity.entitlements.includes("academy_awards_admin");
}
export async function readMyAwards(identity:AcademyIdentity):Promise<AwardRecord[]>{
 const db=learningDb();if(!db)return [];
 const result=await db.query<AwardRow>(
  `SELECT ${projection} FROM academy_program_award WHERE master_identity_id=$1 ORDER BY issued_at DESC`,
  [identity.sub]);
 return result.rows.map(toAward);
}
export async function readPublicAward(awardId:string):Promise<AwardRecord|null>{
 if(!validAwardId(awardId))return null;
 const db=learningDb();if(!db)return null;
 const result=await db.query<AwardRow>(
  `SELECT ${projection} FROM academy_program_award WHERE award_id=$1::uuid`,[awardId]);
 return result.rows[0]?toAward(result.rows[0]):null;
}
export async function issueProgramAward(
 identity:AcademyIdentity,programSlug:string,courseSlugs:string[],pointsEarned:number
):Promise<AwardRecord>{
 if(!courseSlugs.length||courseSlugs.length>25||!Number.isInteger(pointsEarned)||
    pointsEarned<0||pointsEarned>courseSlugs.length*100)throw new Error("invalid_award_snapshot");
 const db=learningDb();if(!db)throw new Error("database_unavailable");
 const awardId=randomUUID();
 const result=await db.query<AwardRow>(
  `WITH inserted AS (
      INSERT INTO academy_program_award(award_id,master_identity_id,program_slug,course_slugs,points_earned)
      VALUES($1::uuid,$2,$3,$4::jsonb,$5)
      ON CONFLICT(master_identity_id,program_slug) DO NOTHING
      RETURNING ${projection}
    ) SELECT * FROM inserted`,
  [awardId,identity.sub,programSlug,JSON.stringify(courseSlugs),pointsEarned]);
 if(result.rows[0])return toAward(result.rows[0]);
 const existing=await db.query<AwardRow>(
   `SELECT ${projection} FROM academy_program_award WHERE master_identity_id=$1 AND program_slug=$2`,
   [identity.sub,programSlug]);
 if(!existing.rows[0])throw new Error("award_conflict_unavailable");
 return toAward(existing.rows[0]);
}
export async function revokeProgramAward(
 identity:AcademyIdentity,awardId:string,reason:string
):Promise<boolean>{
 if(!canRevokeAwards(identity)||!validAwardId(awardId)||
    reason.trim().length<15||reason.length>500)throw new Error("invalid_revocation");
 const db=learningDb();if(!db)throw new Error("database_unavailable");
 const result=await db.query(
  `UPDATE academy_program_award
      SET status='revoked',revoked_at=NOW(),revoked_by=$2,revocation_reason=$3
    WHERE award_id=$1::uuid AND status='active' RETURNING award_id`,
  [awardId,identity.sub,reason.trim()]);
 return (result.rowCount??0)===1;
}
