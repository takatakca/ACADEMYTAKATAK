import type { Course } from "./catalog";

export const studioCourse:Course={
 slug:"takatakstudio",title:"TAKATAKSTUDIO — From idea to production",category:"AI & Automation",icon:"✦",accent:"blue",level:"Beginner",access:"free",estimatedHours:2,certification:"none",dashboardPath:"/dashboard/studio",
 description:"Create a production, shape scenes, work with TAK-TAK and prepare content for your existing social accounts.",
 outcome:"Build a creative workflow with a clear audience, consistent characters, a bounded agent plan and traceable social review.",
 disclaimer:"This course documents a Studio review candidate. Availability depends on the deployed revision and enabled connections. A scene plan is not a rendered video; a scheduled draft task is not a published social post.",
 lessons:[
 {slug:"first-production",title:"Start with one clear idea",duration:10,access:"free",content:[
 "Open TAKATAK V1, select your business workspace, then AI Studio → TAKATAKSTUDIO. Create is your starting area; Productions holds saved briefs; Your Agent holds draft schedules. The workspace selected in V1 owns the records.",
 "Choose Video, Book, Music or Social. Describe the result you want, choose its audience and output language, then select Start creating. Saving a creative brief uses no AI credits. Add an optional title and up to three character profiles under Add a title & characters.",
 "Use concrete details: who the audience is, what they should feel or understand, and which claims are confirmed. For a campaign, include only approved offers and facts. Each customer's characters belong to that customer's workspace; Triple M's cast is not a universal client template."
 ],activity:"Save one original production with a clear audience and two confirmed creative details."},
 {slug:"scenes",title:"Build a story scene by scene",duration:15,access:"free",content:[
 "Open a production and choose Video. The storyboard is a scene layout, not generated footage. Click a scene to inspect it, then Edit this scene to change its title, visual direction, narration and timing.",
 "A plan supports up to eight scenes, two to thirty seconds per scene and 180 seconds in total. Add or remove scenes to improve the story. Save scene plan persists one versioned record in the same V1 workspace. A conflict means another save changed the plan; reload before continuing.",
 "A useful scene has one visual action and a short narration cue. Connect opening, discovery and takeaway. Generated video scripts remain separate text drafts in this candidate; they do not automatically replace manually edited scenes. Rendering and video-file export require a separate verified media worker."
 ],activity:"Plan three scenes: an opening, a discovery and a takeaway. Add narration and check total duration."},
 {slug:"characters-and-formats",title:"Keep a consistent creative world",duration:12,access:"free",content:[
 "Record only confirmed character names and profiles. Decide appearance, voice direction, personality and relationship deliberately. A name alone does not define these details or authorize cloning a real person's voice or likeness.",
 "Use the Video tab for a scene-directed script; Book for an outline and opening spread; Music for lyrics and a composition brief; Social for a short caption. Each button uses the same TAK-TAK account and central credit ledger, while the outputs remain distinguishable by production and format.",
 "Review names, chronology, originality and suitability for the intended audience before proceeding. A music text draft is not a generated recording, and a book outline is not a typeset Amazon-ready book. Commercial licenses, layout, audio generation and output proofs need their own checks."
 ],activity:"Write a short character profile and identify which details must remain consistent across three formats."},
 {slug:"agent-and-ollama",title:"Give your agent a useful, bounded plan",duration:15,access:"free",content:[
 "Choose Your Agent, select a saved production and the formats you want prepared. Choose today, three daily runs or seven daily runs. The displayed credit ceiling is formats × days × the existing TAK-TAK write-request cost; there is no automatic top-up.",
 "Auto uses TAK-TAK's connected engines. Ollama is offered when the existing provider store reports its key configured; no second Ollama key is stored in Studio. Trial workspaces retain TAK-TAK's existing economy-engine policy, which can override an engine preference. Configuration is not evidence of a successful provider call.",
 "Save agent plan creates durable tasks. An enabled authenticated worker processes due tasks even when your browser is closed. If the interface says runner needs setup, saving a plan does not start a worker. The platform operator must enable and schedule the reviewed runner.",
 "The worker rechecks the requesting person's current membership and content permission before each task. It checks the approved per-draft price before spending. An uncertain result is held for reconciliation instead of automatically replayed. A failed or old running task needs operator review, not repeated Generate clicks."
 ],activity:"Calculate a three-day plan for two formats using the displayed per-draft credit price. Record your maximum authorized spend."},
 {slug:"social-review",title:"Use your existing social connections",duration:15,access:"free",content:[
 "Connect and select accounts in TAKATAK Social once. Studio reads the same account records; it does not ask you to create another account directory or copy OAuth tokens. Only the active workspace's connected accounts appear.",
 "Generate a Social caption, review the text, choose the exact connected account, then select Send to Social review. This creates one existing SocialPost and Approval pair for that output/account. Repeating the action reuses the same post rather than creating another copy. Workspace Social-plan rules still apply.",
 "Pending approval means a draft awaits review. It does not mean scheduled or published. The inspected native connections support authorization/account discovery/analytics; a complete automatic publishing worker was not present. This candidate therefore does not label Facebook, Instagram or YouTube delivery as live.",
 "Instagram needs suitable media, not just a caption. Videos require rendered files and platform validation. Before enabling automatic publication, the operator must verify the exact account, permissions, adapter, media access, schedule, publication receipt and handling of ambiguous responses. Never choose another tenant's account or infer permission from a connected status."
 ],activity:"Identify the exact account for a caption and explain how you would verify publication independently of review status."},
 {slug:"ownership-and-recovery",title:"Keep one source of truth and recover safely",duration:12,access:"free",content:[
 "V1 owns identity, permissions, billing, briefs, scene plans, tasks and saved AI outputs. TAK-TAK owns provider routing and metering. KnowledgeAI is the governed retrieval layer; its private integration is not active in this candidate. Academy stores learning content and progress rather than customer campaign copies.",
 "A Studio creative-brief JSON file is an explicit portable copy. Import it only into the intended workspace and review it before saving. Imported workspace IDs, approval status and publication claims are ignored. File exchange is not continuous synchronization.",
 "If a generated draft cannot be linked, keep the recovery text and check Saved AI Outputs. Do not regenerate simply to repair a link. Normal successful output is stored once; a worker retains recovery text only when the central saved record could not be created.",
 "No confidential client brief belongs in the public KnowledgeAI search API or a public repository. Use private production storage and approved client sharing. Course completion does not activate provider connections or change anyone's permissions."
 ],activity:"Draw the path from V1 brief to TAK-TAK draft to a selected Social approval record, and name where recovery would happen."}
 ]
};
