#!/usr/bin/env node
// Provision only new Academy resources. Never deploy, migrate, alter billing, change domains
// or modify existing apps. Requires an authorized operator-supplied Coolify API token.
import { pathToFileURL } from "node:url";

export const REPO = "https://github.com/takatakca/ACADEMYTAKATAK";
export const PROJECT = "GROUPE TAKATAK";
export const APP_NAME = "academy-takatak";
export const DB_NAME = "academy-takatak-db";
const UUID = /^[a-zA-Z0-9_-]{8,128}$/;
const SHA = /^[0-9a-f]{40}$/;

export function configFrom(env) {
  const host = String(env.COOLIFY_BASE_URL || "").trim().replace(/\/+$/, "");
  let url;
  try { url = new URL(host); } catch { throw Error("COOLIFY_BASE_URL must be an HTTPS URL"); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      !url.hostname || ["localhost", "127.0.0.1"].includes(url.hostname) ||
      url.pathname !== "/" ) {
    throw Error("COOLIFY_BASE_URL must be the HTTPS Coolify host only (no paths or credentials)");
  }
  const token = String(env.COOLIFY_API_TOKEN || "");
  if (token.length < 20 || /[\s\r\n]/.test(token)) throw Error("COOLIFY_API_TOKEN not supplied securely");
  const projectUuid = String(env.COOLIFY_PROJECT_UUID || "");
  const serverUuid = String(env.COOLIFY_SERVER_UUID || "");
  if (!UUID.test(projectUuid) || !UUID.test(serverUuid)) {
    throw Error("COOLIFY_PROJECT_UUID and COOLIFY_SERVER_UUID must be explicit resource identifiers");
  }
  const destinationUuid = String(env.COOLIFY_DESTINATION_UUID || "");
  if (destinationUuid && !UUID.test(destinationUuid)) throw Error("Invalid COOLIFY_DESTINATION_UUID");
  const sha = String(env.ACADEMY_SOURCE_SHA || "");
  if (!SHA.test(sha)) throw Error("ACADEMY_SOURCE_SHA must be the verified full 40-character main SHA");
  if (env.COOLIFY_ENVIRONMENT_NAME && env.COOLIFY_ENVIRONMENT_NAME !== "production") {
    throw Error("This tool is restricted to the named production environment");
  }
  return { baseUrl: url.origin, token, projectUuid, serverUuid,
    destinationUuid, environmentName:"production", sha };
}

function requireList(value, field) {
  if (!Array.isArray(value)) throw Error("Unexpected Coolify response for " + field + "; no writes performed");
  return value;
}
export function appPayload(cfg) {
  return {
    name: APP_NAME,
    description: "TAKATAK Academy independent teaching service; no public domain until readiness approved",
    project_uuid: cfg.projectUuid, server_uuid: cfg.serverUuid,
    environment_name: "production",
    ...(cfg.destinationUuid ? {destination_uuid:cfg.destinationUuid} : {}),
    git_repository: REPO, git_branch: "main", git_commit_sha: cfg.sha,
    build_pack: "dockerfile", dockerfile_location: "/Dockerfile",
    ports_exposes: "3000", instant_deploy: false,
    autogenerate_domain: false, domains: "",
    is_pr_deployments_public_enabled: false,
    tags: ["takatak-academy", "provisioning"]
  };
}
export function databasePayload(cfg) {
  return {
    name: DB_NAME, description: "Dedicated Academy PostgreSQL — no shared tenant databases",
    project_uuid: cfg.projectUuid, server_uuid: cfg.serverUuid,
    environment_name:"production",
    ...(cfg.destinationUuid ? {destination_uuid:cfg.destinationUuid} : {}),
    postgres_db: "academy",
    image: "postgres:16-alpine",
    is_public: false, instant_deploy: false,
    tags: ["takatak-academy", "provisioning"]
  };
}
export function findResources(apps, dbs) {
  const normalized = repo => String(repo || "").toLowerCase()
    .replace(/^https?:\/\//,"").replace(/\.git$/,"").replace(/\/$/,"");
  const appMatches = requireList(apps,"applications").filter(app =>
    String(app?.name || "").toLowerCase()===APP_NAME ||
    normalized(app?.git_repository)===normalized(REPO));
  const dbMatches = requireList(dbs,"databases").filter(db =>
    String(db?.name || "").toLowerCase()===DB_NAME);
  if (appMatches.length > 1 || dbMatches.length > 1) {
    throw Error("Ambiguous Academy resources found; stop and inspect manually");
  }
  const app = appMatches[0] || null, db = dbMatches[0] || null;
  if (app && (normalized(app.git_repository) !== normalized(REPO) ||
      String(app.git_branch)!=="main" || String(app.build_pack)!=="dockerfile" ||
      String(app.ports_exposes || "") !== "3000")) {
    throw Error("Conflicting Academy application settings; existing resource must not be overwritten");
  }
  if (db && db.is_public === true) throw Error("Named Academy database is publicly exposed; inspect before proceeding");
  return { app, db };
}
function uuidOf(body) {
  const id=body?.uuid || body?.data?.uuid;
  if (typeof id!=="string" || !UUID.test(id)) throw Error("Coolify response missing valid resource UUID; inspect server before retry");
  return id;
}
export async function run(config, mode="plan", fetchImpl=fetch) {
  if (!["plan","apply"].includes(mode)) throw Error("Expected plan or apply");
  const api=async (method,path,payload) => {
    const result=await fetchImpl(config.baseUrl + "/api/v1" + path, {
      method, headers:{ Authorization:"Bearer "+config.token,
        Accept:"application/json",...(payload?{"Content-Type":"application/json"}:{}) },
      ...(payload?{body:JSON.stringify(payload)}:{}),
      signal:AbortSignal.timeout(20000)
    });
    // Never print server bodies: Coolify may include credentials and configuration.
    if (!result.ok) throw Error("Coolify "+method+" "+path.replace(/\/[a-zA-Z0-9_-]{18,}/g,"/:id")+" returned HTTP "+result.status);
    try { return await result.json(); }
    catch { throw Error("Coolify returned non-JSON response; inspect server before retry"); }
  };
  const [projects,servers,apps,dbs]=await Promise.all([
    api("GET","/projects"),api("GET","/servers"),
    api("GET","/applications"),api("GET","/databases")
  ]);
  if (!requireList(projects,"projects").some(p => p?.uuid===config.projectUuid &&
      String(p.name||"").trim().toUpperCase()===PROJECT)) {
    throw Error("The supplied project UUID is not the exact GROUPE TAKATAK project in this API team");
  }
  if (!requireList(servers,"servers").some(s => s?.uuid===config.serverUuid)) {
    throw Error("Specified deployment server is not available to this API token");
  }
  const matches=findResources(apps,dbs);
  const result={
    mode, project:PROJECT, environment:"production", sha:config.sha,
    application:matches.app?{action:"existing",uuid:String(matches.app.uuid)}:{action:"create"},
    database:matches.db?{action:"existing",uuid:String(matches.db.uuid)}:{action:"create"},
    deployment:"not_requested", migrations:"not_applied", payments:"not_activated"
  };
  if (mode==="plan") return result;
  // Operation-level acknowledgement is deliberately separate from the command.
  if (process.env.ACADEMY_CREATE_RESOURCES_APPROVED!=="yes") {
    throw Error("Refusing writes: ACADEMY_CREATE_RESOURCES_APPROVED=yes is required");
  }
  if (!matches.db) {
    const db=await api("POST","/databases/postgresql",databasePayload(config));
    result.database={action:"created",uuid:uuidOf(db)};
  }
  if (!matches.app) {
    const app=await api("POST","/applications/public",appPayload(config));
    result.application={action:"created",uuid:uuidOf(app)};
  }
  return result;
}
async function main() {
  const mode=process.argv.length===2 || process.argv[2]==="--plan" ? "plan" :
    process.argv[2]==="--apply"?"apply":null;
  if (!mode) throw Error("Usage: node scripts/coolify-provision-academy.mjs [--plan | --apply]");
  const cfg=configFrom(process.env);
  const result=await run(cfg,mode);
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  main().catch(e=>{ process.stderr.write("Academy provisioning stopped: "+e.message+"\n"); process.exitCode=1; });
}
