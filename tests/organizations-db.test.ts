import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Client } from "pg";

const url = process.env.ACADEMY_TEST_DATABASE_URL;
test("organization migration enforces scoped, non-billable partnerships",{
  skip:!url?"ACADEMY_TEST_DATABASE_URL not configured":false,
  timeout:45000
},async t=>{
  const db = new Client({connectionString:url,connectionTimeoutMillis:4000});
  const schema = "academy_org_ci_" + randomUUID().replace(/-/g,"");
  await db.connect();
  try {
    await db.query(`CREATE SCHEMA "${schema}"`);
    await db.query(`SET search_path TO "${schema}"`);
    await db.query(await readFile(new URL("../db/008_organizations.sql",import.meta.url),"utf8"));
    const orgA = randomUUID();
    const orgB = randomUUID();
    await db.query("INSERT INTO academy_organization(organization_id,master_organization_ref,display_name,kind,status) VALUES($1,$2,$3,'nonprofit','approved'),($4,$5,$6,'business','approved')",
      [orgA,"v1-org-npo","Training OBNL",orgB,"v1-org-business","Training Employer"]);
    await db.query("INSERT INTO academy_org_membership(organization_id,master_identity_id,role,status) VALUES($1,'manager-one','manager','active'),($2,'manager-two','manager','active'),($1,'learner-one','learner','active')",[orgA,orgB]);

    await t.test("scoped member lookup cannot enumerate another tenant",async()=>{
      const rows=await db.query<{display_name:string}>(`SELECT o.display_name
        FROM academy_organization o JOIN academy_org_membership m ON m.organization_id=o.organization_id
        WHERE m.master_identity_id=$1 AND m.role='manager' AND m.status='active' AND o.status='approved'`,["manager-one"]);
      assert.deepEqual(rows.rows.map(r=>r.display_name),["Training OBNL"]);
    });

    await t.test("active sponsored seat requires an approved external master grant",async()=>{
      let error="";
      try{
        await db.query("INSERT INTO academy_org_program_seat(organization_id,master_identity_id,program_slug,status) VALUES($1,'learner-one','marketing-ai','active')",[orgA]);
      } catch(e){error=(e as {code?:string}).code??"";}
      assert.equal(error,"23514");
      const reserved=await db.query("INSERT INTO academy_org_program_seat(organization_id,master_identity_id,program_slug,status) VALUES($1,'learner-one','marketing-ai','reserved') RETURNING status",[orgA]);
      assert.equal(reserved.rows[0].status,"reserved");
    });

    await t.test("organization cannot add a seat for an unrelated learner",async()=>{
      let error="";
      try{
        await db.query("INSERT INTO academy_org_program_seat(organization_id,master_identity_id,program_slug,status) VALUES($1,'learner-one','digital-business','reserved')",[orgB]);
      } catch(e){error=(e as {code?:string}).code??"";}
      assert.equal(error,"23503");
    });
  } finally {
    await db.query("SET search_path TO public").catch(()=>{});
    await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`).catch(()=>{});
    await db.end();
  }
});
