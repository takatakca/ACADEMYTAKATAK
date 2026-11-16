import test from "node:test";
import assert from "node:assert/strict";
// @ts-ignore Node .mjs operator utility intentionally has no TypeScript declaration.
import {
  APP_NAME, DB_NAME, REPO, appPayload, databasePayload,
  configFrom, findResources, run
} from "../scripts/coolify-provision-academy.mjs";

const sha="2ef80385bceb224254ca00e7d5e902df26204880";
const env={
  COOLIFY_BASE_URL:"https://coolify.example.test",
  COOLIFY_API_TOKEN:"a".repeat(44),
  COOLIFY_PROJECT_UUID:"group-takatak-123",
  COOLIFY_SERVER_UUID:"server-production-123",
  ACADEMY_SOURCE_SHA:sha
};
const cfg=configFrom(env);
const project=[{uuid:cfg.projectUuid,name:"GROUPE TAKATAK"}];
const server=[{uuid:cfg.serverUuid,name:"TAKATAK VPS"}];
const response=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{"Content-Type":"application/json"}});
function mockApi(apps=[],dbs=[]){
  const requests: {method:string;path:string;data:unknown;authorization:string}[]=[];
  const fake=async(input: string|URL|Request,init?: RequestInit)=>{
    const path=new URL(String(input)).pathname;
    const method=init?.method||"GET";
    const data=init?.body?JSON.parse(String(init.body)):null;
    requests.push({method,path,data,authorization:String((init?.headers as Record<string,string>)?.Authorization || "")});
    if(method==="GET"){
      if(path.endsWith("/projects"))return response(project);
      if(path.endsWith("/servers"))return response(server);
      if(path.endsWith("/applications"))return response(apps);
      if(path.endsWith("/databases"))return response(dbs);
    }
    if(method==="POST"&&path.endsWith("/databases/postgresql"))return response({uuid:"database-new-123"},201);
    if(method==="POST"&&path.endsWith("/applications/public"))return response({uuid:"academy-app-new-123"},201);
    return response({message:"unexpected route"},404);
  };
  return {requests, fake:fake as typeof fetch};
}

test("rejects untrusted configuration and invalid target",()=>{
  assert.throws(()=>configFrom({...env,COOLIFY_BASE_URL:"http://coolify.example.test"}),/HTTPS/);
  assert.throws(()=>configFrom({...env,COOLIFY_BASE_URL:"https://coolify.example.test/api/v1"}),/host only/);
  assert.throws(()=>configFrom({...env,COOLIFY_API_TOKEN:"short"}),/securely/);
  assert.throws(()=>configFrom({...env,COOLIFY_SERVER_UUID:"?"}),/identifiers/);
  assert.throws(()=>configFrom({...env,COOLIFY_ENVIRONMENT_NAME:"staging"}),/production/);
});

test("creates only independent, private and non-running resources",()=>{
  const app=appPayload(cfg),db=databasePayload(cfg);
  assert.equal(app.git_repository,REPO);
  assert.equal(app.git_commit_sha,sha);
  assert.equal(app.build_pack,"dockerfile");
  assert.equal(app.ports_exposes,"3000");
  assert.equal(app.instant_deploy,false);
  assert.equal(app.autogenerate_domain,false);
  assert.equal(app.domains,"");
  assert.equal(db.is_public,false);
  assert.equal(db.instant_deploy,false);
  assert.equal(db.image,"postgres:16-alpine");
  assert.equal(app.project_uuid,db.project_uuid);
  assert.equal(app.server_uuid,db.server_uuid);
  assert.equal(db.postgres_db,"academy");
});

test("plan reads scoped Coolify resources but never creates or exposes credentials",async()=>{
  const {fake,requests}=mockApi();
  const result=await run(cfg,"plan",fake);
  assert.equal(result.application.action,"create");
  assert.equal(result.database.action,"create");
  assert.equal(result.deployment,"not_requested");
  assert.equal(requests.length,4);
  assert.ok(requests.every(x=>x.method==="GET"));
  assert.ok(!JSON.stringify(result).includes(cfg.token));
});

test("apply requires independent approval and creates DB first, app second",async()=>{
  const {fake,requests}=mockApi();
  const previous=process.env.ACADEMY_CREATE_RESOURCES_APPROVED;
  delete process.env.ACADEMY_CREATE_RESOURCES_APPROVED;
  try{
    await assert.rejects(run(cfg,"apply",fake),/Refusing writes/);
    assert.ok(requests.every(x=>x.method==="GET"));
    process.env.ACADEMY_CREATE_RESOURCES_APPROVED="yes";
    const result=await run(cfg,"apply",fake);
    assert.equal(result.application.action,"created");
    assert.equal(result.database.action,"created");
    assert.deepEqual(requests.filter(x=>x.method==="POST").map(x=>x.path),[
      "/api/v1/databases/postgresql","/api/v1/applications/public"]);
    assert.equal(result.migrations,"not_applied");
    assert.equal(result.payments,"not_activated");
  }finally{
    if(previous===undefined)delete process.env.ACADEMY_CREATE_RESOURCES_APPROVED;
    else process.env.ACADEMY_CREATE_RESOURCES_APPROVED=previous;
  }
});

test("existing verified Academy resources are reused; unrelated resources cannot be changed",async()=>{
  const existingApp={name:APP_NAME,uuid:"existing-app-123",
    git_repository:REPO,git_branch:"main",build_pack:"dockerfile",ports_exposes:"3000"};
  const existingDb={name:DB_NAME,uuid:"existing-db-123",is_public:false};
  assert.ok(findResources([existingApp],[existingDb]).app);
  const {fake,requests}=mockApi([existingApp],[existingDb]);
  const previous=process.env.ACADEMY_CREATE_RESOURCES_APPROVED;
  process.env.ACADEMY_CREATE_RESOURCES_APPROVED="yes";
  try{
    const result=await run(cfg,"apply",fake);
    assert.equal(result.application.action,"existing");
    assert.equal(result.database.action,"existing");
    assert.ok(requests.every(x=>x.method==="GET"));
  }finally{
    if(previous===undefined)delete process.env.ACADEMY_CREATE_RESOURCES_APPROVED;
    else process.env.ACADEMY_CREATE_RESOURCES_APPROVED=previous;
  }
  assert.throws(()=>findResources([{...existingApp,git_branch:"bad"}],[]),/Conflicting/);
  assert.throws(()=>findResources([],[{...existingDb,is_public:true}]),/publicly exposed/);
  assert.throws(()=>findResources([existingApp,existingApp],[]),/Ambiguous/);
});

test("refuses unverified project names before writes",async()=>{
  const {fake,requests}=mockApi();
  const wrongProjectFetch=async (url:string|URL|Request, init?:RequestInit)=>{
    if(String(url).endsWith("/projects"))return response([{uuid:cfg.projectUuid,name:"Other Team"}]);
    return fake(url,init);
  };
  await assert.rejects(run(cfg,"plan",wrongProjectFetch as typeof fetch),/exact GROUPE TAKATAK/);
  assert.ok(requests.every(x=>x.method==="GET"));
});
