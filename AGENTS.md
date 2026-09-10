# ManaTuner — repères pour les agents

## Préférence permanente du propriétaire — branche principale uniquement

Instruction explicite du 10 septembre 2026, applicable à toutes les futures sessions de ce projet et à tous les sous-agents :

- Travailler directement sur la branche principale **`main`**. Les corrections et commits demandés doivent aboutir à `main` ; **tous les pushes doivent cibler `origin/main`**, sauf nouvelle instruction explicite contraire de l’utilisateur. Préférence reconfirmée le 10 septembre 2026.
- **Ne jamais créer de branche annexe par défaut**, y compris une branche `codex/*`, une branche de confort, de sauvegarde ou un worktree qui crée une branche. La délégation à des agents ne justifie pas une exception.
- Une exception exige une **justification majeure, concrète et clairement expliquée à l’utilisateur avant l’action**, puis son accord explicite. Présenter le risque réel, pourquoi travailler sur main ne convient pas et comment le travail reviendra dans main.
- Cette préférence remplace les anciennes consignes du projet recommandant une branche dédiée. Ne pas déduire d’un ancien document une autorisation de créer une branche.
- Préserver les changements existants ; cette règle n’autorise ni suppression de branches existantes, ni reset destructif, ni force-push. Si le checkout est sur une ancienne branche, examiner son contenu et intégrer le travail pertinent sans perte avant de poursuivre sur main.
- Le choix de main n’autorise pas à lui seul un commit, un push ou un déploiement non demandé ; respecter le périmètre de la tâche en cours et vérifier les effets automatiques d’un push demandé.

## Session du 9 septembre 2026

- Base examinée : `2ba772a`. Les références d’août dans `CLAUDE.md`, `SESSION_START.md` et les documents produit sont historiques.
- Lire `docs/engineering/SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md`, puis `docs/engineering/preuves-corrections/S002/SESSION-VERIFIEE.md` et `docs/engineering/DELIVERY-CONTRACT.md` avant de proposer des corrections.
- Le suivi historique clôt 12/13 défauts et 61/62 critères ; F12-AC5 reste soumis à une revue juridique compétente. Ces chiffres ne prouvent pas une nouvelle exécution des tests ou la publication actuelle.
- Experts mobilisés : agent-organizer (briefing, context-manager absent), product-manager et devops-engineer. Rapports datés dans `docs/engineering/EXPERT-*-2026-09-09.md`.
- Préserver les rapports de tests, worktrees et fichiers personnels préexistants. Ne pas assimiler un ancien prompt de reprise à une nouvelle autorisation de publication.
- Invariants : calculs client-side, partage `#d=`, aucune probabilité inventée hors modèle, Sentry désactivé sans décision explicite.

## Audit personas du 9 septembre 2026

- Lire `docs/session/PERSONA_AUDIT_2026-09-09.md` pour les six parcours réels et notes simulées (moyenne3,22/5). Preuves et rapports individuels : `docs/session/persona-audit-2026-09-09/`.
- Engine v2.7.9 constaté en production ne prouve pas le SHA publié. Accueil/Guide/About/Privacy conservent des promesses plus absolues que les avertissements Analyzer. Établir l’artefact servi avant de réimplémenter S002.
- Ne pas appeler les résultats non supportés une panne globale : estimations midrange/EDH fonctionnent ; mode exact et certaines vues refusent des mécaniques. Ancien problème Atraxa six couleurs non reproduit, quatre couleurs confirmées.
- Limites actuelles : viewport mobile demandé mais non appliqué, clipboard vide sous iab, exports non inspectés. Aucun test automatisé ou oracle rejoué dans cet audit ; aucun succès mobile/partage complet déduit du toast.

## Reprise organisée — 9 septembre 2026

- Entrée actuelle : `docs/handoff/HANDOFF-PERSONAS-2026-09-09.md` ; exécution suivie dans `docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md` (T00–T11).
- Prompt : `docs/handoff/PROMPT-REPRISE-PERSONAS-2026-09-09.txt`. Compare public/local/S002 avant correction ; contrat produit avant rédaction et interface. Ne pas bloquer les travaux locaux indépendants si le SHA public reste inaccessible.
- Toutes les tâches sont ouvertes ; publication T11 non autorisée. Dossiers de validation neufs et chemins absolus obligatoires pour préserver les preuves et rapports existants.

## Reprise du 10 septembre 2026 — personas

- Campagne actuelle : `docs/engineering/persona-validation-mfydqnp5/`, journal T00–T11 mis à jour. Ne pas réexécuter les anciens chemins de preuves.
  -50/50 sources S002 identiques à l'entrée. Public ne sert pas cet artefact ; statut Vercel du HEAD2ba772a en échec. Ne pas déduire SHA public du numéro moteur.
- Corrections indices/Compare/exemple exact/mulligan/éditorial/exports ; formules préservées. CSV ajoute is_sideboard/is_commander ; shares restent deck/name/tab sans paramètres du modèle.
- Gate utilise des chemins absolus et le dossier math explicite doit exister. Gate04 acquis avant correction sombre : ne pas le présenter comme vérification du candidat final.
- Branche de push `codex/persona-followup-2026-09-10` exclue des déploiements automatiques dans vercel.json ; les autres branches gardent leur comportement. Aucun push main, déploiement ou Sentry autorisé.

### Validation finale — 10 septembre 2026

Référence : `docs/engineering/persona-validation-mfydqnp5/FINAL.md`, candidat `dist-06` et manifest SHA-256. Gate complet799tests/79fichiers +16Chromium +101routes; audit33Chromium; personas12Chromium;8WebKit acquis. Firefox reste bloqué avant navigation même en installation isolée neuve. Sombre corrigé et contrôlé quantitativement. Trois rapports préexistants préservés. T09/juridique/appareils physiques/confirmation visuelle utilisateur restent distincts des validations techniques. Publication applicative non autorisée ; branche de commit/push dédiée désactivée côté auto-déploiement via vercel.json.

### Réaudit comparatif — 10 septembre 2026

- Lire `docs/session/PERSONA_REAUDIT_2026-09-10.md` : candidat dist-06 noté3,67/5 vs production auditée9septembre3,22/5. Ce n’est pas une nouvelle note de production ni une étude utilisateurs.
- Six voix distinctes ; quatre agents sans CUA reposent sur HTTP/artefacts et parcours actuels attribués au lead. Les tests799/61Chromium/8WebKit restent antérieurs, pas rejoués dans le réaudit.
- Résidus nouvellement confirmés : MyAnalyses Nothing sent to servers, Mathematics descriptions mixtes, Library Five/7, conseils Guide85%, Compare trop de décimales. Distinguer tâches précédemment vérifiées et couverture éditoriale encore incomplète.

### Mission préparée après réaudit — 10 septembre 2026

- Prochaine entrée : `docs/handoff/MISSION-CORRECTIONS-REAUDIT-TESTS-PUSH-2026-09-10.md` et prompt associé. R01–R07 ouverts ; commit/push demandé dans la mission sur la branche dédiée, déploiement toujours exclu.
- Relire le candidat après hooks ; contrôler SHA distant après push. Ne pas versionner les trois rapports préexistants par ajout global. Les documents seuls ont été préparés dans cette session.

### Destination Git corrigée par l’utilisateur — 10 septembre 2026

- Priorité sur les consignes précédentes : intégrer, commiter et pousser le travail de la mission sur **main**, aucune branche annexe. Le prompt et la mission corrections/tests/push sont actualisés.
- Intégrer les correctifs existants avant validation finale ; préserver les changements locaux. Aucun force-push. Le déploiement natif peut être déclenché par main ; l’exclusion de l’ancienne branche ne s’y applique pas.

### Mission R01–R07 exécutée — 10 septembre 2026

- Exception explicitement autorisée dans le message de reprise : uniquement `origin/codex/persona-followup-2026-09-10`, aucun main/merge/force-push/déploiement. Les mentions main de la préparation sont historiques pour cette mission. `vercel.json` garde cette branche désactivée.
- Preuves neuves : `docs/engineering/reaudit-fixes-szrp1r9w/FINAL.md`. R01–R07 : modes/FAQ, confidentialité, motifs Compare groupés et arrondis, règle85%, compteur dérivé, Blueprint99+1, recette CSV, fixture synthétique. Formules et protocole `#d=` conservés.
- Revue visuelle révèle fond CSS clair en thème sombre : GlobalStyles lie le fond réel au thème. Axe seul ne détectait pas ce gradient ; test fond/image/luminance ajouté. Un scénario regroupant8routes dépasse30s : désormais un scénario par route et largeur, sans délai augmenté.
- Ne pas attribuer les anciens résultats dist-06 au candidat actuel. Rapports utilisateur préexistants exclus du staging et vérifiés par empreintes.

## Réaudit après R01–R07 — 10 septembre 2026

- Rapport courant : `docs/session/PERSONA_REAUDIT_POST_R01_R07_2026-09-10.md`, six rapports et preuves lead dans `docs/session/persona-reaudit-r01-r07-2026-09-10/`.
- Candidat dist-04 du HEAD e14f329 :3,78/5=15,11/20 ; précédent14,67/20, initial12,89/20. Six agents sans CUA : HTTP/sources/preuves attribuées ; lead réalise les nouveaux clics exact/Blueprint/sauvegarde/Compare20vs24.
- Push vérifié sur branche dédiée, origin/main reste2ba772a ; accueil public encore ancien. Aucune nouvelle note de production, aucun nouveau gate. Résidu20sources Guide vs21 Mathematics confirmé.
- Audit uniquement : aucun code produit, changement de branche, commit/push/déploiement. Rapports utilisateur existants préservés. Priorités : cohérence20/21, pédagogie première décision, partage des réglages, participants réels et publication distincte. Service de revue http://127.0.0.1:4187/.

## Publication sur main et Vercel — 10 septembre 2026

La demande utilisateur « si non fais le » autorise désormais main et la production Vercel. Main a été avancée sans divergence vers e14f329, puis le correctif runtime e206991 a été commité et poussé. Les ajouts postréaudit et rapports utilisateur sont préservés. Le premier déploiement a échoué faute de libnspr4.so ; setup-build-browser installe les bibliothèques natives uniquement sur Vercel/Linux, erreurs bloquantes, puis npm ci. Chromium, options et gate inchangés. Six tests ciblés acquis ; CI GitHub réussie et Vercel READY pour e2069916186737fedac3ae3cb58f4e7872d728ce. Gate natif complet acquis, dont101routes et16Chromium. Vérification publique :5routes200 avec textes actualisés, route inconnue404/noindex. SHA origin/main identique. Preuves de cette publication : docs/engineering/main-publication-kyj03ixa/ (local, non versionné).
