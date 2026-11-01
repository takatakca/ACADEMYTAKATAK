# Faire marcher le site takatak.ca — guide pas à pas

*Guide pour le propriétaire, l'équipe et les agents. Le code est dans le dépôt `takatakca/takatak-v1`, branche
`claude/upbeat-einstein-zqkf58`, PR https://github.com/takatakca/takatak-v1/pull/233. Aucun secret ici : seulement des
noms de clés et des étapes.*

English summary at the bottom.

---

## 1. Mettre le site en ligne

1. Ouvrir la PR #233 sur GitHub, regarder l'aperçu, puis **fusionner** (seul le propriétaire fusionne).
2. Dans **Coolify**, application takatak.ca : **Deploy**. Attendre la fin, puis ouvrir takatak.ca et vérifier
   `/api/health`.
3. Rien ne part en ligne sans ces deux gestes.

## 2. Les clés à mettre dans Coolify (une seule fois)

Coolify → takatak.ca → Environment Variables. Noms seulement ; les valeurs restent chez le propriétaire.

| Pour | Clés |
| --- | --- |
| Formulaires, infolettre, alertes (déjà en place) | `WEBSITE_LEADS_ENABLED=true`, `WEBSITE_LEADS_CLIENT_ID` |
| Infolettre | `NEWSLETTER_SENDER_ADDRESS` (adresse postale publique de Groupe TAKATAK, obligatoire selon la loi anti-pourriel), `NEWSLETTER_TOKEN_SECRET` (32 caractères ou plus, ne jamais le changer ensuite) |
| Courriel de confirmation | `SENDGRID_API_KEY` + `SENDER_EMAIL`, ou le Gmail SMTP du site |
| Alertes sur l'appareil (push) | `PUSH_VAPID_PUBLIC_KEY`, `PUSH_VAPID_PRIVATE_KEY` (une paire VAPID, créée une fois avec `npx web-push generate-vapid-keys`, ne jamais la changer) |
| TAK bot (IA) | Clés des fournisseurs dans le tableau de bord : Admin › AI provider keys (`/dashboard/admin/ai-providers`), puis **Test the key** ; `AI_CREDITS_CHECKOUT_ENABLED` pour vendre les crédits |

Tant qu'une clé manque, la partie concernée reste fermée et le dit (« Les inscriptions ouvrent très bientôt »).
Rien ne plante.

## 3. Lancer une promotion (Black Friday, Cyber Monday, Boxing Day…)

1. Décider : le **code**, le **pourcentage**, les **services visés**, la **date et l'heure de fin**. Le rabais se calcule
   seulement sur les prix réguliers du catalogue.
2. Dans `src/lib/promotions/catalog.ts`, ajouter une ligne (un exemple est déjà dans le fichier) :
   `BF2026: { code: "BF2026", percentOff: 15, endsAt: "2026-11-27T23:59:59-05:00", title: { fr: "Black Friday", en: "Black Friday" } },`
   (le 15 % ici est un exemple, pas une décision).
3. PR, fusion, Deploy. Ensuite, tout seul :
   - la page **`takatak.ca/offres/BF2026`** existe, avec le vrai compte à rebours ;
   - l'accueil, le panier et `/commander` affichent le compte à rebours ;
   - le code suit le client de la page d'offre jusqu'à l'inscription.
4. À l'heure de fin, le serveur refuse le code et la page affiche « Cette offre n'est pas en cours ». **Jamais de
   faux compte à rebours** : il vient toujours du serveur.
5. Lien à mettre dans les publicités et les réseaux sociaux : `https://takatak.ca/offres/BF2026`.

## 4. Envoyer l'alerte « une promotion commence » sur les appareils

Seulement quand la promotion est en ligne (étape 3), et seulement par un administrateur de la plateforme :

1. Se connecter à takatak.ca avec un compte administrateur.
2. Ouvrir la console du navigateur (F12 → Console) sur takatak.ca et coller :
   `fetch('/api/admin/push/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:'BF2026'})}).then(r=>r.json()).then(console.log)`
3. La réponse donne le nombre d'appareils joints. Le serveur refuse tout code qui n'est pas une promotion en cours.
4. La notification affiche toujours l'offre réellement en cours, lue sur le serveur.

## 5. L'infolettre

- Inscriptions : bloc sur l'accueil, page **`/infolettre`**, et « Alertes promo » sur chaque page d'offre.
- Chaque inscription est une fiche dans **`/dashboard/leads`**, source **« takatak.ca newsletter »**. La preuve du
  consentement est gardée sur la fiche : le texte exact, la date, la page.
- Envoyer **seulement aux abonnés confirmés**, seulement sur les sujets qu'ils ont choisis.
- Chaque courriel doit avoir :
  - le pied de page avec le nom, l'adresse postale et le lien de désabonnement ;
  - les en-têtes `List-Unsubscribe`.
  Détails pour l'agent qui envoie (TWILO) : `docs/NEWSLETTER.md` du dépôt takatak-v1.
- Un désabonnement s'applique tout de suite ; relire le statut juste avant chaque envoi.

## 6. Commandes et demandes des clients

- **`/commander`** : le client choisit son type d'entreprise, puis un service à la fois (site, hébergement, réseaux
  sociaux, marketing, avis, téléphonie, crédits IA), voit le total, puis crée son compte. **Aucun paiement à cette
  étape.**
- Les demandes envoyées par les formulaires arrivent dans **`/dashboard/leads/inbox`**.
- Lien de devis partagé : bouton « Enregistrer le devis » dans `/commander`, à envoyer au client.

## 7. Modifier le contenu de l'accueil

| Quoi | Où (dépôt takatak-v1) |
| --- | --- |
| Textes de l'accueil (FR / EN) | `src/lib/website/home-funnel.ts` |
| Photos et vidéos par service | `src/lib/website/home-media.ts`, `public/photos/`, `public/media/` |
| Prix | les catalogues existants (ne jamais écrire un prix à la main dans une page) |
| Questions fréquentes | `HOME_FAQ` dans `src/lib/website/home-funnel.ts` |

Photos : seulement des photos sous licence ou nos propres photos. Jamais une photo libre présentée comme un client ou
un employé (`public/photos/CREDITS.md`).

## 8. Vidéos et YouTube

- **Boucles du site** : `public/media/videos/<service>.mp4` (6 s, 1280×720). Les remplacer par de vraies vidéos garde le
  même nom de fichier.
- **Clips verticaux** : `public/media/social/<service>-fr.mp4` et `-en.mp4`. Ce sont des Shorts / Reels de 7 s.
- **Runway** : `npm run media:videos -- --run`. Il faut la clé `RUNWAYML_API_SECRET` sur l'ordinateur du propriétaire.
- **YouTube** : les 18 vidéos sont prêtes avec titre, description, mots-clés et liste de lecture dans
  `docs/media/youtube-uploads.json` ; plan de la chaîne dans `docs/media/YOUTUBE_PLAN.md`. Téléverser depuis YouTube
  Studio avec takatak.ca@gmail.com.
- **Témoignages** : seulement de vrais clients, avec leur accord écrit.

## 9. L'essai TAK bot et l'assistant ventes (ajouté le 1er novembre)

**Essai TAK bot sur l'accueil** (section « TAK bot ») :

1. Le visiteur clique **Continuer avec Google** (ou son courriel). Son compte TAKATAK et sa **fiche client** sont créés.
2. Il reçoit **50 crédits d'essai**, une seule fois, sur un moteur économique (Groq, Gemini, DeepSeek ou OpenAI mini).
3. Chaque réponse est gardée dans sa fiche (`/dashboard/ai-studio/saved`). Chaque nouvel essai crée une fiche dans le CRM
   (`/dashboard/leads`, source « takatak.ca TAK bot trial »), sans consentement marketing.
4. Quand il achète un forfait de crédits, les moteurs premium s'ouvrent (Claude, GPT, Perplexity…).

À faire une fois par le propriétaire : Supabase → Authentication → Providers → **Google** ; Dashboard → Admin › AI
provider keys → une clé **Groq** (la moins chère), puis **Test the key**. Réglages facultatifs dans Coolify :
`TAKBOT_TRIAL_CREDITS` (50 par défaut), `TAKBOT_TRIAL_ENGINE`, `TAKBOT_TRIAL_MODEL`, `TAKBOT_TRIAL_ENABLED=false` pour
fermer l'essai. Détails : `docs/TAKBOT_TRIAL.md` (dépôt takatak-v1).

**Assistant ventes IA** (bande des offres, FAQ, fin de page) :

- Trois façons : **Écrire**, **Parler** (dictée du navigateur, réponses lues à voix haute), **Un humain** (clavardage).
- Il parle seulement de vente : services, prix du catalogue, délais. Un problème avec un service existant → bouton
  **Contacter le soutien**.
- « Préparer ma demande » : il pose une question à la fois (nom, entreprise, courriel, téléphone), remplit la fiche à
  côté, demande « Tout est bon ? », puis l'envoie dans **`/dashboard/leads/inbox`** (catégorie `sales-assistant`).
- Prochaines étapes (paiement Stripe, téléphone, clé d'accès, contrat signé) et règles du Québec :
  `docs/SALES_FLOW_PLAN.md` (dépôt takatak-v1).

**MIMT sur l'accueil** : 3 forfaits (Essentiel, Affaires, Affaires Pro). Les prix viennent du dépôt MIMT
(`mimtcaapp/packages/shared/src/plans.ts`). Si un prix change là, le copier dans `src/lib/website/mimt-plans.ts`.

**Connecteurs** : le total affiché (bande « Écosystème ») est compté à partir des catalogues, jamais tapé à la main.
Ajouter un connecteur dans son catalogue l'ajoute au compte.

## 10. Avant chaque envoi de code (agents)

Dans takatak-v1, avec `NODE_OPTIONS=--max-old-space-size=6144` :

- `npm run typecheck`
- `npm run lint` (0 erreur)
- `npm run qa:newsletter`, `qa:push`, `qa:order-funnel`, `qa:concierge`, `qa:takbot`, `qa:promotions`
- `npx next build --webpack`

Ensuite : une ligne signée dans `WORKLOG.md`, sur le tableau https://github.com/takatakca/foodhubca/issues/105 et dans
Drive « 00 — Opérations TAKATAK ».

## 11. Les règles qui ne bougent pas

- Pas de faux rabais, pas de faux compte à rebours, pas de garantie sans texte écrit, pas de faux témoignage.
- Infolettre, alertes sur l'appareil et textos ont **chacun leur propre consentement**, jamais coché d'avance et jamais
  mêlé à l'inscription. Le désabonnement est dans chaque message. La preuve est gardée (LCAP, Loi 25).
- Chaque plateforme de livraison n'entend parler que d'elle-même.
- Personne ne pousse sur `main` ; le propriétaire fusionne et déploie.

---

## English summary

How to run takatak.ca:

1. **Go live:** the owner merges PR #233, then presses Deploy in Coolify.
2. **Keys:** set once in Coolify (names in the table above). Each feature stays off until its keys are set.
3. **Promotion:** add one line to `src/lib/promotions/catalog.ts` with the code, percentage and end time. That creates
   `/offres/<CODE>` with a real countdown, and the code stops at the end time.
4. **Device alerts:** a platform admin calls `POST /api/admin/push/send {code}`, for live campaigns only.
5. **Newsletter:** subscribers are leads under "takatak.ca newsletter". Send only to confirmed subscribers, with the
   footer and the unsubscribe headers.
6. **Orders and requests:** `/commander` is the order funnel; requests arrive in `/dashboard/leads/inbox`.
7. **Content:** homepage texts are in `src/lib/website/home-funnel.ts`. Prices come only from the catalogs.
8. **Videos and YouTube:** see `docs/media/`.
9. **TAK bot trial and AI sales assistant:** Google sign-in, 50 trial credits, answers saved in the client file; the
   assistant fills the request form and sends it to the leads inbox (section 9).
10. **Before each push:** the checks in section 10.
11. **Fixed rules:** see section 11.

— signé : Claude (cloud session upbeat-einstein) @ Claude Code cloud · 2026-11-01 (mis à jour 11 h UTC)
