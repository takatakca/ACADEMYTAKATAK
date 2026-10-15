import { courses } from "./catalog";
import { serviceExams, type AnswerKeyQuestion } from "./service-courses";

/** Exam keys stay server-side; browser clients receive only the public projection. */
const Q=(id:string,prompt:string,choices:[string,string,string,string],correctIndex:number,explanation:string):AnswerKeyQuestion=>({id,prompt,choices,correctIndex,explanation});
const original: Record<string,AnswerKeyQuestion[]> = {
  "seo-aeo":[
    Q("q1","Which action starts a trustworthy search strategy?",["Purchase links in bulk","Document real audience questions and intent","Repeat keywords in hidden text","Promise AI citation placement"],1,"Begin with real customer questions and intent."),
    Q("q2","What is a safe use of structured data?",["Describe verified, visible page facts","Add fake five-star ratings","Mark every page as a product","Claim credentials you do not hold"],0,"Schema must correspond to accurate content users can see."),
    Q("q3","Which statement about appearing in AI answers is accurate?",["Every FAQ guarantees a citation","Backlinks always create citations","Citations can be guaranteed by a plugin","Citation appearance is not guaranteed; measure reproducibly"],3,"No publisher can guarantee a model citation."),
    Q("q4","What is the responsible way to build authority?",["Buy anonymous reviews","Create many doorway pages","Publish useful original resources and earn relevant mentions","Exchange thousands of unrelated links"],2,"Earn editorial citations with genuinely useful evidence."),
    Q("q5","Which measurement supports a meaningful SEO review?",["Rank screenshot alone","Baseline Search Console trends tied to engagement and conversions","A fictional traffic forecast","An unverified AI score"],1,"Use a defined baseline and verified performance signals.")
  ],
  shopify:[
    Q("q1","What should be defined before configuring a store?",["Products, audience, margin and fulfillment","Only brand colors","A fake sales counter","Unlimited discount promises"],0,"Start with a viable operating model."),
    Q("q2","What builds customer confidence on a product page?",["Hidden stock levels","Only an AI image","Clear specifications, real images and delivery terms","Unverified five-star reviews"],2,"Accurate product details reduce customer uncertainty."),
    Q("q3","What should customers see before paying?",["Extra hidden charges","Total price, delivery and return conditions","Only a countdown timer","A requirement to call support"],1,"Transparent terms must precede authorization."),
    Q("q4","When using product schema, what must match?",["Competitors' prices","Arbitrary keyword lists","A promotional headline only","The actual product, price and inventory information"],3,"Structured data must accurately describe product facts."),
    Q("q5","Which retention plan respects customers?",["Unlimited unsolicited emails","Buying a competitor's list","Consent-aware messages with measurable outcomes","Removing unsubscribe links"],2,"Respect preferences and evaluate actual retention.")
  ],
  "local-seo":[
    Q("q1","What is a reliable local listing foundation?",["Accurate business name, address, phone and hours","A virtual address for every city","Repeated keywords inside business name","Copied reviews"],0,"Consistent real-world business information is foundational."),
    Q("q2","How should duplicate directory listings be handled?",["Ignore all duplicates","Invent new phone numbers","Pay for hundreds of links","Audit authoritative sources and request corrections"],3,"Prioritize quality and accuracy."),
    Q("q3","What is a compliant review practice?",["Pay only for positive reviews","Ask for honest feedback without prohibited incentives","Create reviews as the business","Publish private customer details"],1,"Authenticity matters."),
    Q("q4","When is a city landing page appropriate?",["For every location you can name","Only if a competitor has one","When you genuinely service it with distinct verifiable content","Whenever AI can generate text"],2,"Do not fabricate service coverage."),
    Q("q5","What should local search reporting emphasize?",["Verified calls, directions and qualified leads","Only an unverified rankings screenshot","Directory link count only","Invented conversion rates"],0,"Business outcomes are stronger than vanity signals.")
  ],
  websites:[
    Q("q1","What does DNS primarily do?",["Replace access control","Map domain records to services","Host every website image","Guarantee a secure checkout"],1,"DNS directs clients to appropriate services."),
    Q("q2","How should domain ownership be protected?",["Shared passwords","Unverified registrant data","Auto-renewal disabled by default","Verified registrar control, MFA and recovery"],3,"Protect the business-critical domain."),
    Q("q3","Which deployment practice reduces risk?",["Commit .env files","Build heavy artifacts on production only","Use CI, verified releases and a rollback path","Remove backups after deploy"],2,"Reproducible and reversible deployment matters."),
    Q("q4","Which change improves accessibility?",["Keyboard navigation and readable contrast","Auto-playing content without controls","Images without descriptions","Small low-contrast buttons"],0,"Design for real users and diverse inputs."),
    Q("q5","How do you know a backup is useful?",["A backup icon is green","You performed a successful restore test","The disk still has space","The vendor said it is automatic"],1,"Recovery must be tested.")
  ],
  social:[
    Q("q1","A campaign should start with what?",["The longest possible hashtag list","Five new accounts","A goal and audience you can serve","A claim of guaranteed growth"],2,"Set a measurable purpose."),
    Q("q2","What is necessary for sharing customer photos?",["Only a public URL","Enough relevant permission and consent","A stock caption","A request to a chatbot"],1,"Image ownership and privacy require consideration."),
    Q("q3","What is the correct publishing path?",["Draft, review, approve, publish and monitor","Generate and publish instantly without permission","Skip failed deliveries","Ignore platform permissions"],0,"Review gates protect clients."),
    Q("q4","How should advertising performance be assessed?",["By likes alone","By claims on a vendor page","By views without dates","By verified outcomes against costs"],3,"Connect campaigns to measurable goals."),
    Q("q5","If a provider refuses a post, what next?",["Mark it as published","Send it endlessly","Record the error and retry safely after checking permissions","Delete approval history"],2,"Provider status must be reflected honestly.")
  ],
  "ai-automation":[
    Q("q1","What is the first safeguard for important AI outputs?",["Human verification against reliable facts","Publishing immediately","Giving the model all company passwords","Avoiding any evidence"],0,"AI can be wrong, including when fluent."),
    Q("q2","What usually improves a prompt?",["Only adding emojis","Writing a one-word request","Ignoring examples","Clear audience, scope, constraints and output format"],3,"Better context supports useful drafts."),
    Q("q3","How should sensitive automation execute?",["With unlimited permissions","With approvals, scoped credentials and audit logs","Directly from an untrusted browser","Without a failure path"],1,"Safe workflows require controlled actions."),
    Q("q4","What is idempotency?",["An AI confidence score","A type of brand voice","Repeating the same event without duplicate side effects","Replacing all monitoring"],2,"Retry-safe operations prevent duplicate changes."),
    Q("q5","What is appropriate data governance?",["Collect only needed data, control access and retention","Store every prompt forever","Expose private data to all users","Disable vendor reviews"],0,"Limit risk by minimizing and controlling sensitive information.")
  ],
  "travel-agent":[
    Q("q1","What does Academy course completion legally grant?",["A travel counsellor permit","An agency licence","A supplier booking authorization","Educational completion only, not a government licence"],3,"Training is separate from statutory permission and accreditation."),
    Q("q2","What should a travel intake establish?",["Only the traveler’s favorite color","Destination, budget, dates, accessibility and constraints","Passport details in an open text form","An instant purchase order"],1,"Discovery protects travelers and supports suitable advice."),
    Q("q3","How should licensing requirements be checked?",["Review current rules from the applicable official regulator","Trust social media comments","Assume the rules never change","Treat an instructor certificate as a permit"],0,"Check the correct regulator and jurisdiction."),
    Q("q4","What must a quote communicate?",["Only its headline price","No cancellation rules","Total terms, fees and relevant change policies","Unconfirmed supplier availability"],2,"Quotes should be transparent."),
    Q("q5","What is a responsible disruption response?",["Abandon the client","Promise a refund not approved by supplier","Post traveler records online","Verify alternatives and document supplier communication"],3,"Protect the client with confirmed information.")
  ],
  voip:[
    Q("q1","What does an IVR commonly do?",["Route callers using menu choices","Guarantee 100% uptime","Replace consent requirements","Encrypt every stored call by itself"],0,"IVR helps route customer calls."),
    Q("q2","How should a business-hours flow behave?",["Drop every after-hours call","Announce clear options and useful fallback","Assume every call is urgent","Send calls to arbitrary phone numbers"],1,"Use a respectful and predictable experience."),
    Q("q3","What governs call recording?",["A single global rule for every country","The agent's convenience","Applicable consent, privacy and retention rules","Only the handset model"],2,"Recording rules vary by jurisdiction."),
    Q("q4","What must be protected?",["Only public greeting scripts","A marketing slogan","A pricing plan screenshot","Customer communications, access to recordings and credentials"],3,"Phone systems process sensitive communications."),
    Q("q5","Which metric reflects service quality?",["Resolved customer issues and unanswered calls","Only minutes billed","Only call volume","An invented customer score"],0,"Quality outcomes matter more than raw usage.")
  ]
};
export const PASS_PERCENT=80;
export const MAX_ATTEMPTS_PER_24H=3;
export const POINTS_PER_QUESTION=20;
export type PublicQuestion=Pick<AnswerKeyQuestion,"id"|"prompt"|"choices">;
export function getExamKey(slug:string):AnswerKeyQuestion[]|null {
  if (!courses.some((course)=>course.slug===slug)) return null;
  return original[slug] ?? serviceExams[slug] ?? null;
}
export function getPublicExam(slug:string):PublicQuestion[] {
  return (getExamKey(slug)??[]).map(({id,prompt,choices})=>({id,prompt,choices}));
}
export function gradeExam(questions:AnswerKeyQuestion[],answers:number[]) {
  if(questions.length!==5 || answers.length!==questions.length ||
     !answers.every((choice)=>Number.isInteger(choice)&&choice>=0&&choice<=3))throw new Error("Invalid exam answers");
  const correct=questions.reduce((sum,q,i)=>sum+(q.correctIndex===answers[i]?1:0),0);
  const percent=Math.round(correct/questions.length*100);
  return {correct,total:questions.length,percent,points:correct*POINTS_PER_QUESTION,passed:percent>=PASS_PERCENT};
}
