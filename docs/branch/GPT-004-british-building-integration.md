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

## Integration R1 — implementation and first boot evidence

- Permanent unused IDs: k219 / britishTerrace, k220 / foxFinchPub, k221 / edwardianLibrary. Current main ends at k218; rejected PR7 was not used.
- Conservative gameplay defaults: terrace $1100 / rank3 / 32 mid-market residents; pub $1800 / rank3 / 10 commercial jobs; library $2400 / rank6 / 16 public jobs / 160 nominal education seats / $8 daily municipal upkeep. Library capacity matches existing k41, with a larger authored footprint and operational gates; the two private buildings have no extra municipal upkeep.
- Full-footprint placement, normal tree clearing/technology price modifiers, root/ref demolition, undo/redo, fixed-type save restoration, utility loads, residential/enterprise/civic authorities and explicit inspector text are wired. New buildings do not enter random RCI upgrades or merge into towers. Library coverage is removed symmetrically when not operational; pub shopping and employment respect completion and closed frontage.
- Approved generator geometry is embedded in the single HTML product under a separate namespace and installed after the old silhouette post-process. Canonical square building sprites retain the existing camera-rotation policy: four camera views, not four invented rear elevations.
- All 63 inline scripts and test scripts parse; protected version strings/baselines/log/decisions and archived art source remain unchanged.
- Exact R1 candidate `96f27cf8f13abf8003bd2ad84c770cf064e81ff9`. Ordinary smoke passed, 49.6 seconds, including British selftest 26/26: https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37177239453 . Main-loop and console checks passed.
- Full evidence run https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37177239486 remained inside its combined browser evaluation/capture step for more than ten minutes without a stage result. This is not accepted as a pass. Review found the harness lacked per-CDP deadlines and early persisted stage reports; R2 adds those diagnostics and splits independent gameplay groups. Cause of the original delay is not yet established.
- Draft PR: https://github.com/lijiabao1998/GlimmerTown-lab/pull/9 . Merge and deployment remain blocked on the owner's final image confirmation.
- Still unverified: full gameplay, save/load, exact legacy fingerprint, scene/occlusion/weather/construction and old-city simulation comparisons must complete on the final candidate. User hardware/mobile performance is not measured.

## R1 final diagnosis and R2 corrections

- R1 completed normally in 850.3 seconds; there was no confirmed stalled loop. Gameplay itself took 2.09 seconds. The combined capture produced 48 camera/day-night, 12 rain/snow and 30 construction frames, with zero console errors. The added stage logs/deadlines remain useful diagnostic hardening.
- R1 gameplay: 443 assertions; 435 passed, eight failed. All eight are the pub's four minimal one-road power checks and power-coupled b.wa checks. Its actual water network was Stable (code4). Root/ref placement, every-cell collision/crater rejection, price/undo/redo/demolition, construction gates, civic capacity/budget, four-age saves and 44 old-ID records passed.
- Exact failure: pub evening load 1.842 + tower1.600 + lighting0.011 = physical dispatch3.453. The existing power dispatcher rounds the UI total to3.45, then reuses it as physical capacity, leaving1.839 for the pub's1.842 request. Existing k2/lv2 has the same pre-existing shortfall. The original single-frontage test stays intact.
- R2 retains raw measured physical dispatch for an entire connected power pool containing a new British load and uses unrounded district shares in that coupled pool. No epsilon, added supply, arbitrary load rebalance or larger test grid is used. Entirely old-only pools keep their previous return shape/arithmetic. New assertions check physical conservation, and a separate actual k2/lv2 control verifies unchanged legacy behavior. Independent arithmetic review confirms orphan HV demand can leave capacity unused but cannot create energy under the proportional-share formula.
- R1 initial asset guard passed: exactly bld.219_1_0, bld.220_1_0, bld.221_1_0 added; zero legacy leaf changes/removals; 1,728 block entries retain CRC5ef6eb67. All three canonical day/night canvases match the approved source exactly. Geometry, alignment and actual foreground occlusion passed; library lights: 1,396 hidden, 1,696 visible.
- The three nighttime P8.999→P9 differences are the existing activation of completed window/flood lighting, not changed geometry (day convergence was already exact). R2 proves this with four renders: unpowered geometry must converge exactly, pre-completion power must change no pixels, and the completion delta must equal only completed power-on lighting. It does not broadly allow pixel differences.
- The final whole-object fingerprint changed because T700 lazily creates its pre-existing worker12 sprite. R2 writes all final leaf diagnostics, requires every boot-time pixel/family unchanged, permits only that named worker atlas, and compares its complete pixels to an independently evaluated, source-pinned legacy generator. Final British pixels are compared to the approved source again.
- R1 smoke ×3 passed; full fp.js --check --expect=bld passed; both old-city simulations matched pinned main at every checkpoint. These checks must pass again on R2's exact commit.
- Independent visual inspection found no further geometry/alignment defect. Generic snow is lighter/thinner than some neighboring broad roof caps; construction uses the existing staged frame before the authored roof finish. No bespoke snow or four rear elevations are claimed.
