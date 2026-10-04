# GPT-004 — Three British buildings: playable integration

Status: acceptance recorded before implementation. Awaiting implementation and evidence.
Base: latest origin/main `8b8ff01c1f157acf8baed0e1d4e305dabef049be` (v14.20 / T716), verified 2026-10-04.
Branch: `gpt/british-building-integration`.
Scope: integrate exactly the three owner-selected GPT-003 designs, retaining their approved architecture.

## Goal and boundaries

UKP01: 2×2 Victorian red-brick terrace, a residential building.
UKP02: 2×2 Fox & Finch corner public house, a neighborhood commercial employer.
UKP03: 3×3 Edwardian public library, an education service with a reading-hall form.

Keep the joined terrace bays/doors, slate roof and party-wall chimney rhythm; the canted pub entrance, painted timber/glazed ground floor and hipped roof; and the library's broad reading hall, entrance gable, subsidiary wing and forecourt. These are original English architectural interpretations, grounded in the Historic England references on GPT-003, not generic European towers.

Exactly three new immutable, unused IDs will be selected after auditing the current registries. PR #7 is rejected and is neither merged nor used as an implementation base. No existing IDs are reassigned. No global art, existing economy, simulation RNG algorithm or save schema changes. No production deletion or migration. No main write, merge or deployment until this completed round receives the owner's confirmation.

## Acceptance before code

1. Normal build menu: three named, searchable entries with correct categories, costs, unlock ranks, descriptions and 2×2/2×2/3×3 footprints. Costs and capacities are justified against current counterparts, with real residential population, pub jobs/income/maintenance and library service behavior rather than ornamental labels.
2. Real normal placement rejects off-map, water, blocked, road and occupied cells without spending; successful placement spends the advertised cost, makes one root plus the correct references, and enters the existing nine-day construction pipeline. Construction completes without changing the approved silhouette. Demolition from any footprint cell and undo/refunds follow the game's existing rules.
3. Power, road access, service coverage and economic contribution behave consistently with comparable existing buildings. Effects that depend on completion must not accrue during construction. Existing city outcomes without the new buildings stay unchanged.
4. Save/load round-trip retains all three IDs, footprints, state and counters; baseline saves without them remain loadable. Tests use only a fresh profile with slot 3. Never inspect or modify a user's live save.
5. Approved view-0 geometry/day/night must retain the selected art unless a documented integration defect requires a small correction. All four camera rotations must select aligned visible day/night geometry and correct footprint anchoring; no floating pixels, light through opaque foregrounds, detached sprites or culling loss. Exercise rain, snow, near/far zoom and existing neighbors in the real city compositor.
6. Deterministic art generation consumes no shared simulation RNG and leaves existing sprite fingerprints unchanged. New assets live in a separately attributable family or declared new keys. Full legacy fingerprint, block fingerprint and style ratchet must remain unchanged when the new assets are excluded/disabled; a dedicated guard proves the exact expected additions and nothing else. Do not edit fp.json or style.json.
7. Add focused smoke selftests and a dedicated assertion-based integration/pixel probe. Remote isolated GitHub Actions must run smoke three times, full fingerprint checks and the new probe on the final exact source commit. Record every failed iteration and unrun limitation; no fabricated passes.
8. Real city evidence: same-view day/night A/B with approved art, both practical zooms (1.2 and 2), all four rotations, adjacent existing buildings, build-menu/placement/construction and save/load proof. Deliver review images; no user ZIP archive requested.
9. Measure boot/build cost, deterministic repeat and representative draw overhead. No unrelated regressions or expensive per-frame geometry rebuilding. Review pixels independently; green guards do not establish aesthetic quality.

## Execution and test isolation

Use the dot's cloud workspace only, never the owner's Zenbook. Browser game tests on this cloud/authorized CI are permitted by the current explicit request. The older GPT local-test ban does not authorize user-computer access.
Before coding: inspect AGENTS, AUTORUN, CLAUDE, DECISIONS, STYLE-THEOTOWN and relevant T702/T711/T699 precedents. One writer owns production files; independent audits are read-only.
Add a branch-only least-privilege evidence workflow (contents: read, no secrets, no Pages jobs, no security-setting changes). Existing Pages workflow listens to main only.
Escape valve: new-build availability/art has a documented diagnostic gate, while saved new buildings must never silently disappear.
Protected files/fields: GAME_VER, GAME_ANCHOR, start-version text, AUTORUN-LOG.md, fp.json, style.json and docs/DECISIONS.md remain unchanged on this branch. Release T number is assigned only after approval.

## Construction log and honest limitations

- Entry: fresh cloud checkout; main rechecked; old local checkouts absent; current approved renderer and harness recovered from main. Gameplay and rotation read-only audits started before implementation.
- Not yet implemented or tested. All acceptance checks are pending. User hardware/mobile performance is not yet measured. No merge/deployment authorization for this round has been received.
