# ManaTuner — repères pour les agents

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
