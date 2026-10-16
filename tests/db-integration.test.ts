import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

const url=process.env.ACADEMY_TEST_DATABASE_URL;

test("Academy migrations and security invariants on disposable PostgreSQL schema",
  {skip:!url?"ACADEMY_TEST_DATABASE_URL not configured":false,timeout:45000},
  async t=>{
 const client=new Client({connectionString:url,connectionTimeoutMillis:4000});
 const schema="academy_ci_"+randomUUID().replace(/-/g,"");
 await client.connect();
 try {
   await client.query(`CREATE SCHEMA "${schema}"`);
   await client.query(`SET search_path TO "${schema}"`);
   for(let i=1;i<=6;i++){
     const files=["001_academy.sql","002_exam_attempt.sql","003_lesson_workbook.sql",
       "004_private_exam_bank.sql","005_program_awards.sql","006_exam_ticket_once.sql"];
     const sql=await readFile(new URL("../db/"+files[i-1],import.meta.url),"utf8");
     await client.query(sql);
   }
   await client.query("BEGIN");
   await t.test("all expected Academy tables and the one-use ticket index exist",async()=>{
     const tables=await client.query<{name:string}>(
       "SELECT tablename AS name FROM pg_tables WHERE schemaname=$1",[schema]);
     for(const table of ["academy_lesson_progress","academy_exam_attempt","academy_activity_submission",
       "academy_exam_version","academy_program_award"])
       assert.ok(tables.rows.some(r=>r.name===table),table);
     const indexes=await client.query<{indexname:string}>(
       "SELECT indexname FROM pg_indexes WHERE schemaname=$1",[schema]);
     assert.ok(indexes.rows.some(r=>r.indexname==="academy_exam_attempt_ticket_once_idx"));
   });
   await t.test("signed ticket nonce can only be consumed once even across students",async()=>{
     const ticket=randomUUID();
     const args=["master-123","seo-aeo",5,5,100,true,"private_reviewed",1,ticket];
     await client.query(`INSERT INTO academy_exam_attempt(master_identity_id,course_slug,correct_answers,
       question_count,points,passed,assessment_source,assessment_version,ticket_nonce)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::uuid)`,args);
     await client.query("SAVEPOINT anti_replay");
     let failure="";
     try{
       await client.query(`INSERT INTO academy_exam_attempt(master_identity_id,course_slug,correct_answers,
         question_count,points,passed,assessment_source,assessment_version,ticket_nonce)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::uuid)`,
         ["another-student","seo-aeo",3,5,60,false,"private_reviewed",1,ticket]);
     }catch(e){failure=(e as {code?:string}).code??"";}
     assert.equal(failure,"23505");
     await client.query("ROLLBACK TO SAVEPOINT anti_replay");
     await client.query("RELEASE SAVEPOINT anti_replay");
   });
   await t.test("reviewed banks cannot publish two versions of the same course",async()=>{
     const q=Array.from({length:10},(_,i)=>({id:"q"+i,prompt:"A question "+i,choices:["a","b","c","d"],correctIndex:0,explanation:"A reason"}));
     await client.query(`INSERT INTO academy_exam_version(course_slug,version,status,questions,
       created_by,reviewed_by,published_at) VALUES($1,1,'published',$2::jsonb,'author','reviewer',now())`,
       ["seo-aeo",JSON.stringify(q)]);
     await client.query("SAVEPOINT publication");
     let failure="";
     try{
       await client.query(`INSERT INTO academy_exam_version(course_slug,version,status,questions,
          created_by,reviewed_by,published_at) VALUES($1,2,'published',$2::jsonb,'author','reviewer',now())`,
          ["seo-aeo",JSON.stringify(q)]);
     }catch(e){failure=(e as {code?:string}).code??"";}
     assert.equal(failure,"23505");
     await client.query("ROLLBACK TO SAVEPOINT publication");
     await client.query("RELEASE SAVEPOINT publication");
     const rows=await client.query<{version:number}>(
       "SELECT version FROM academy_exam_version WHERE course_slug='seo-aeo' AND status='published'");
     assert.equal(rows.rowCount,1);
   });
   await t.test("a draft author cannot be their own reviewer",async()=>{
     const q=Array.from({length:10},(_,i)=>({id:"sep"+i,prompt:"Review separation question "+i,
       choices:["Document","Invent","Ignore","Guess"],correctIndex:0,explanation:"Only evidence-based editorial review."}));
     await client.query("SAVEPOINT author_review");
     let error="";
     try{
       await client.query(`INSERT INTO academy_exam_version(course_slug,version,status,questions,
          created_by,reviewed_by,published_at)
         VALUES('shopify',1,'published',$1::jsonb,'same-master','same-master',now())`,[JSON.stringify(q)]);
     }catch(e){error=(e as {code?:string}).code??"";}
     assert.equal(error,"23514");
     await client.query("ROLLBACK TO SAVEPOINT author_review");
     await client.query("RELEASE SAVEPOINT author_review");
   });
   await t.test("workbook entries are unique and private to a master identity",async()=>{
     await client.query(`INSERT INTO academy_activity_submission(master_identity_id,course_slug,lesson_slug,response_text)
       VALUES('master-1','seo-aeo','lesson-1','Practice notes')`);
     await client.query(`INSERT INTO academy_activity_submission(master_identity_id,course_slug,lesson_slug,response_text)
       VALUES('master-2','seo-aeo','lesson-1','Other notes')`);
     const a=await client.query<{response_text:string}>(
       "SELECT response_text FROM academy_activity_submission WHERE master_identity_id=$1",["master-1"]);
     assert.deepEqual(a.rows.map(x=>x.response_text),["Practice notes"]);
     const other=await client.query<{response_text:string}>(
       "SELECT response_text FROM academy_activity_submission WHERE master_identity_id=$1",["master-2"]);
     assert.deepEqual(other.rows.map(x=>x.response_text),["Other notes"]);
   });
   await t.test("award issuance unique to learner+program and revocation auditable",async()=>{
     const id=randomUUID();
     await client.query(`INSERT INTO academy_program_award
       (award_id,master_identity_id,program_slug,course_slugs,points_earned)
       VALUES($1,'master-1','learning-program','["seo-aeo"]'::jsonb,80)`,[id]);
     const revoked=await client.query<{status:string;revoked_by:string}>(
       `UPDATE academy_program_award SET status='revoked',revoked_at=now(),
         revoked_by='master-reviewer',revocation_reason='Verified administrative correction'
         WHERE award_id=$1 RETURNING status,revoked_by`,[id]);
     assert.equal(revoked.rows[0].status,"revoked");
     assert.equal(revoked.rows[0].revoked_by,"master-reviewer");
     await client.query("SAVEPOINT award_duplicate");
     let failure="";
     try{await client.query(`INSERT INTO academy_program_award
         (award_id,master_identity_id,program_slug,course_slugs,points_earned)
         VALUES($1,'master-1','learning-program','["seo-aeo"]'::jsonb,80)`,[randomUUID()]);}
     catch(e){failure=(e as {code?:string}).code??"";}
     assert.equal(failure,"23505");
     await client.query("ROLLBACK TO SAVEPOINT award_duplicate");
     await client.query("RELEASE SAVEPOINT award_duplicate");
   });
   // Commit migrations, discard transactional test fixtures, then verify
   // unique nonce enforcement with two truly independent database connections.
   await client.query("ROLLBACK");
   await t.test("concurrent submissions using one ticket yield exactly one persisted grade",async()=>{
     const first=new Client({connectionString:url,connectionTimeoutMillis:4000});
     const second=new Client({connectionString:url,connectionTimeoutMillis:4000});
     try{
       await Promise.all([first.connect(),second.connect()]);
       await Promise.all([first.query(`SET search_path TO "${schema}"`),
         second.query(`SET search_path TO "${schema}"`)]);
       const nonce=randomUUID();
       const insert=`INSERT INTO academy_exam_attempt(master_identity_id,course_slug,
         correct_answers,question_count,points,passed,assessment_source,assessment_version,ticket_nonce)
         VALUES($1,'seo-aeo',5,5,100,true,'private_reviewed',1,$2::uuid)`;
       const outcome=await Promise.allSettled([
         first.query(insert,["concurrent-one",nonce]),
         second.query(insert,["concurrent-two",nonce])
       ]);
       assert.equal(outcome.filter(x=>x.status==="fulfilled").length,1);
       const loser=outcome.find(x=>x.status==="rejected");
       assert.ok(loser&&loser.status==="rejected");
       assert.equal((loser.reason as {code?:string}).code,"23505");
       const matches=await client.query<{n:string}>(
         "SELECT COUNT(*)::text AS n FROM academy_exam_attempt WHERE ticket_nonce=$1::uuid",[nonce]);
       assert.equal(matches.rows[0].n,"1");
     }finally{
       await Promise.allSettled([first.end(),second.end()]);
     }
   });
 } finally {
   await client.query("ROLLBACK").catch(()=>{});
   await client.query("RESET search_path").catch(()=>{});
   await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`).catch(()=>{});
   await client.end();
 }
});
