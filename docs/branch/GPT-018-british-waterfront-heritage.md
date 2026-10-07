# GPT-018 — British waterfront heritage appearances

## Acceptance card written before implementation

Started 2026-10-07 UTC from authoritative `origin/main` `1400301238f7a46ab6d3c489422a48f9f90cac9d` (T730 / v14.34 / r177). Branch: `gpt/british-waterfront-heritage-018`. GPT-018 was free in the freshly fetched repository; no T number is reserved. This card must be published by itself before renderer, art, gameplay adapter or runtime QA implementation.

The owner authorized the next British art iteration after approving GPT-017. Each new round still requires review of its actual native screenshots before release. This card does not assert that GPT-018 images or publication are approved. All game, painter, Chrome, smoke and pixel execution belongs in isolated GitHub Actions with disposable slot 3 and port 8199. Source parsing, pure mock/data checks, artifact hashing and original PNG inspection may run in the assistant cloud.

## One bounded visual subject

Create two original 2×2 visitor-building appearances:

1. **海難救援史展館 / Lifeboat heritage hall**: a broad slate gable, rubble walls with brick arch details, a front round glazed opening, physically braced side shelter, broad timber exhibit doors and a distinct rear service window. Its visitor court and small exhibit fixtures belong to the authored building geometry.
2. **運河收費亭展館 / Canal tollhouse exhibit**: a two-storey octagonal painted-masonry volume, eight-sided slate roof, recessed arched faces, differently arranged entrance and rear service faces, and a modest paved visitor court. The angled faces must be geometrically modelled, not simulated by recolouring a rectangular old building.

Both are fictional architectural composites for heritage visiting. They provide no operational rescue, toll collection, tickets, boats, lock control, shipping or new transport mechanics. No global palette, lighting, vegetation or density change is included. No imported photographs, traced sprites, generated bitmap assets, third-party logos or readable facade text.

Architectural vocabulary comes from primary descriptions, read again on 2026-10-07:

- [Historic England: Old Lifeboat House, Teignmouth, 1269089](https://historicengland.org.uk/listing/the-list/list-entry/1269089?section=official-list-entry): rubble/brick construction, broad slate roof, braced side overhang, front circular glazing and a projecting rear window.
- [Historic England: Bratch locks, bridges and toll house, 1232421](https://historicengland.org.uk/listing/the-list/list-entry/1232421): a two-storey octagonal painted-brick toll house with arched recessed faces and glazing. No claim of a named-site reconstruction.

## Native integration boundary

Use the existing k287 `manorStableCourt014` visitor-court simulation through two optional manual catalog appearance choices. Preserve the original `COMPLEX014` table, original k287 art, all twelve previous complex building identities and every existing catalog choice. New choices call the existing paid native placement and retain its 2×2 footprint, $1,250 base price, rank 4 unlock, nine-day construction, five public positions, 70 nominal leisure capacity, $3 daily upkeep, power 1.2 and water 1.8. Existing policies, actual quotes, staffing, equipment, road access, supply and fiscal accounting remain authoritative.

The only new instance state is a whitelisted appearance tag on a valid k287 root. Native direction remains `v & 3`; theme IDs must not be hidden in `v`. Save currently uses explicit building tuples, so a tag cannot be assumed to persist automatically: add one sparse optional appearance channel, only when valid tagged roots exist. Every old untagged world must retain exactly the same raw save bytes. Load must validate indices, native roots, themes and duplicate records without altering ordinary root restoration, RNG, supply repair or the simulation clock. Invalid/unknown tags fall back safely to the original native appearance. Undo/redo snapshots must include appearance state inside the existing transaction.

Additive wrappers may cover catalog labels/search/unlock, native footprint/coverage/price preview, placement, inspection and the one per-instance sprite choice. Do not add a new economic registry, building ID, enterprise, public service, household or AI-planning rule. New choices are explicitly manual-only. Product labels describe the heritage visit, without exposing implementation identifiers or promising new services. The original untagged inspector remains byte-equivalent in behavior.

`window.__noWaterfront018` disables new choices; `window.__noWaterfrontArt018` restores original native rendering for tagged instances. Neither flag may erase saved appearance identity or change the simulation. Old assets must always remain available.

## Art and preservation requirements

- Author two buildings × four full geometric views in a separate `waterfront018` family: eight new leaves, using the existing 160×196 / anchor 80,194 2×2 frame. Reuse geometric primitives, not previous building meshes. Front, rear and side details must make the views distinguishable.
- Enter the normal building depth, construction, night, weather and occlusion pipeline. Emission is restricted to physically present windows or fixtures and obeys the existing native power/night rules. No luminous terrain, detached trim, clipped roofs, floating walls or hidden lights through occluders.
- Preserve all 3,139 old full leaf records, 163 old family records and 1,728 complete block records. Expected additive inventory is 3,147 leaves and 164 families; native evidence, not a hard-coded claim, must establish it.
- Preserve every old test script and all 131 GPT-017 release jobs. A declared source/data adapter may expose the additional family while retaining every old assertion, raw-save negative control, style ratchet and timing threshold. Do not replace old behavioral assertions with counters or fixture-only mocks.
- Keep `GAME_VER`, `GAME_ANCHOR`, start-screen version, `fp.json`, `AUTORUN-LOG.md` and `docs/DECISIONS.md` unchanged throughout the candidate phase.

## Required executable acceptance

1. Source/data controls prove pre-code card provenance, exact old protected files, only declared additive hooks, whitelisted tags, no painter RNG/storage/network access, separate family identity and both escape valves. Negative controls must reject bad native records, wrong source/head, missing views, altered old assets and invalid saves.
2. Native paid placement checks both new choices and the original k287 side by side: rank boundary, insufficient money, exact policy-adjusted quote/debit, all four footprint cells, each original blocker, coverage preview, native capital ledger and manual-only catalog identity. Failed placement changes no tile, cash or appearance state.
3. Construction advances through the actual native nine days with real utilities and staff; no immediate completed-building injection may stand in for construction acceptance. Verify actual public jobs, leisure, upkeep and supply readiness using the original readers.
4. Demolition/undo/redo preserves the entire footprint, old trees, cash, original building identity and exact optional appearance tag. Old placement, existing complex themes and all twenty streetscape/garden/quayside paths remain valid.
5. Two actual `Page.reload` plus native Continue cycles retain exact appearance and direction immediately, after two paused frames, and after each of three unaided ordinary days. No cold-phase fixture repair, forced draw, utility reset or hidden recomputation. Cover absent, malformed, duplicate, wrong-root and unknown-theme optional save input.
6. Four cameras × day/night show both new buildings and the original appearance under the same normal scene conditions. Include winter/wet weather, actual construction, real paid occlusion and removal, foreground/background overlap and both fallback flags. Canonical native PNG hashes must stay exact across runtime views and reloads.
7. Preserve all old full-record fingerprints and complete raw-save/world comparisons, all original timing/style thresholds and three sequential smoke runs. Full final-head CI must pass before preparing owner review images. Never hide or overwrite a failed attempt.

## Review and delivery gate

Provide actual unresized native Chrome images for both day/night scenes, distinct reverse views, weather, construction and true cold Continue. Save original files, provenance, dimensions and hashes; inspect them before delivery. Owner confirmation is required before this round's release/merge/deployment. Any final release-label/baseline promotion requires complete tests again on the exact final release head.

## Initial measurements and open diagnostics

T730 release candidate `1c6ebde` passed 131 jobs; main `1400301` has the same complete tree. Main smoke 37549273515 and Pages 37549378717 passed. Formal public-origin observer 90995b6 / run 37549893272 completed all 158 functional/provenance gates, with eleven official documents and ten cold Continue cycles. Its independent strict console gate **failed**: 33 identified PWA HTTP 404 responses, eleven unclassified URL-less script 404 errors and 53,819 warnings; zero runtime exceptions and zero transport failures. All 261 original evidence files, including 245 PNGs and both sets of 48 canonical quayside PNGs, were verified. These failures remain recorded; no PWA/network/security changes are part of this art card.

The separate public-source recorder also reported `Network.setAttachDebugStack` unavailable because its domain was not enabled at that moment. This is a diagnostic capability limitation, not proof that URL-less errors came from a particular script. Further read-only attribution work must keep raw failures and exact URL/request-ID correlation; it cannot relabel an error from timing proximity alone.

## Work log

| Stage | Result | Evidence | Not completed / failed |
|---|---|---|---|
| Pre-code card | Scope and acceptance written against fresh T730 main | This first card-only commit | New art, implementation, all runtime tests and owner review images are not yet started |

### Initial candidate source, 2026-10-07 00:39 UTC

The published pre-code card is commit `75568284a3266a6d6cb5a8346dcc5b7fd2e54b1a`. Two original geometric models and their four views each are now written, with the separate eight-leaf family, bounded native appearance adapters and conditional sparse save channel. Fifty synthetic source/data checks pass, including malformed/duplicate/wrong-root save rejection, unknown catalog values, native-field preservation and art fallback. Reversible source assembly passes; all 904 previously protected files remain exact, and every old smoke row is retained with one additional selftest.

Only initial native Chrome/fingerprint/pixel preflight is being prepared. The complete 131-job legacy retention, new paid lifecycle tests, real screenshot review and owner image approval are **not yet complete**. No new game, painter, canvas or pixel runtime has run locally. The source work caught and excluded inherited object-property names from the new alias lookup before its first push. These source checks do not claim the new art has rendered successfully.


### Complete candidate acceptance layer, 2026-10-07 01:11 UTC

The initial candidate `5d538a7283e67612a6212dab42760b9e21d5e1ea` passed isolated native preflight [37553339889](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37553339889) and smoke [37553339786](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37553339786). Its actual full native records establish 3,147 leaves / 164 families, all 3,139 prior leaves and 1,728 complete blocks unchanged. Eight full opaque, unclipped authored views and sixteen original day/emission PNGs were retained; emission stays on native opaque surfaces. These are initial measurements, not full acceptance or owner image approval.

The following push adds QA only. Product HTML, art, gameplay, release labels, `fp.json` and all 904 protected T730 source files remain unchanged. A 144-job full workflow retains the 128 original native/legacy matrix modes, complete original eight-world raw-save comparison, timing/style thresholds, three sequential smokes and frozen original source tests, and adds fourteen heritage catalog/gameplay/coldload/malformed/camera/construction/weather/occlusion modes. Every historical adapter is count-checked and reversible; no old runtime API or original assertion body is relaxed. Every old release validator receives only exact historical projected records, never current candidate source or approval.

Source/data checks pass: all twelve generated historical adapters parse, all 42 raw-save negatives remain, original 16/10/18/44/20/36/29 fingerprint and historical-release controls remain, 36 additional T730 release-native negatives and all 62 original projection negatives execute against the actual archived native evidence, twelve new fingerprint controls reject malformed additions, all five original style ratchet cases retain their thresholds, and nine workflow mutations are rejected. No game, Chrome, painter or pixel runtime was executed in the assistant cloud.

A source-only test caught a missing dependency binding in its original-projection negative harness and an invalid-CRC mutation that failed in the fixture builder before reaching the validator. Both harness issues were corrected and those controls rerun successfully; neither changed product behavior. Large evidence packets now use streaming lossless compression, retaining original byte hashes and all failure artifacts while avoiding the preceding cloud-memory pressure.

Not completed: the new full workflow and heritage lifecycle modes have not yet run. Real paid construction, services, cold Continue, weather, occlusion and owner-review scene images remain pending. This push grants no merge, release, deployment or art approval. Main remains T730 / v14.34.


### First complete runtime attempt and QA ledger correction, 2026-10-07 01:27 UTC

QA candidate `1bdb2389d3a38636977c3766fdd340e406290c4b` passed current initial native preflight `37556046790` and smoke `37556046818`. Full workflow [37556046870](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37556046870) passed strict full preflight, every frozen historical source stage, and the complete original eight-world compatibility/style/three-smoke job. The retained legacy matrix is still running; this is not a full-pass claim.

All fourteen new lifecycle modes stopped at a shared incorrect QA assumption: the unmodified outer fiscal wrapper correctly records the selected catalog tool alias, not the underlying court alias. Actual three-root native k287 placement, native prices, full footprints, undo/redo, rank3/4, insufficient funds, policy discounts and all216 obstruction/edge rejection inputs passed in the retained raw evidence. The test incorrectly demanded `manorStableCourt014` in every capital row. Product behavior and appearance code are unchanged.

The corrected pure predicate requires exactly one native six-field ledger row with the chosen tool alias, k287, exact coordinates/day and rounded native quote. Both original failed manifests pass corrected data validation without changing their bytes: gameplay SHA256 `65a81388ee941cfc97218960f9aab1a175d9b3f520b251132a3d8654be3d90b3`, catalog SHA256 `7cbfd5ed9150a953472972174744d2ce5e1df58d648f69d4de68a3a3ac29b16d`. Added37 negative ledger/provenance mutations; all94 lifecycle source/JSON controls pass.

Future full runs now place the unchanged128-mode historical matrix and compatibility job after the fourteen new lifecycle modes, so a shared new fixture failure is found before scheduling all historical jobs again. Every job remains required for complete final-head acceptance, all raw failures remain retained, and workflow controls reject bypassing the native gate.

Not completed: the corrected native lifecycle must run afresh; construction, real services, cold Continue, weather, occlusion and final owner-review images remain pending. No owner approval, release or merge is implied by archived-data validation.


### Strict native lazy-worker session guard, 2026-10-07 02:08 UTC

[Full run37557274578](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37557274578) at `7381520aa6bf2bff580af2f69d8c6f05cc467ff7` passed strict preflight and ten native modes: catalog, gameplay, malformed saves, actual cold Continue, all four cameras, weather and paid foreground day/night occlusion. Only the four construction-camera modes failed. Each completed genuine days0–9, exact15 nominal jobs/$9 upkeep, real utilities/staff/leisure and every daily canonical view, then failed its final whole-atlas equality. Historical128 and compatibility were skipped by the native acceptance dependency. The run remains failed; these are not full-green results.

All four untouched failed manifests show the same isolated difference: the original T700 renderer lazily registers its existing `worker12` construction-worker atlas. Every existing3,147 complete leaf record, every164 existing family record and every1,728 complete block remained exact; the temporary atlas inventory becomes3,148/165 with worker record `{d:f9717532,op:132,w:56,h:9,n:null}`. This renderer is already in the immutable T730 baseline, with unchanged source SHA256 `5fe5dd3cda55b9b1601cd940b1a22287c6c9abb1e9b38cb4a855bf9cc7335584`.

The correction is QA-only. It reuses the exact original `legacyWorkerProof` function from the unchanged public-life suite, checking full installed RGBA bytes against two independently built canvases from that pinned native source, zero RNG calls, exact worker metadata and CRC, full independent family/stat aggregation, and observer purity for world, storage, atlas and canonical references. All existing boot-time leaf/family/block records still require complete deep equality. Unknown additions, altered prior records, malformed worker proofs and absent-worker concealment fail. The existing final canonical PNG/hash gate is retained. No product, geometry, gameplay, release label, baseline or prior source changed.

Seventy-five new source/data negative controls and all94 earlier lifecycle/ledger negatives pass. All four original failed archives pass only the narrowly labeled data comparison, with their bytes unchanged; those archive checks explicitly do not claim a fresh native RGBA run. The complete exact-head workflow must run again for the corrected guard. New images and publication remain unapproved.


## Owner-directed repair addendum: rotated map boundary

### Acceptance written before repair implementation, 2026-10-07 03:03 UTC

The owner approved the architectural review images, then explicitly requested correction of the sawtooth exposed-soil edge visible in image10 before publication (2026-10-07 02:58 UTC). Release preparation is paused. No version, release card, `fp.json`, main or deployment change has been made. The original two heritage building appearances are not reopened for redesign; the additional visible repair will receive its own same-view before/after review.

The last fully tested pre-repair candidate is `52924698c88ec2f9cafe37828b8d966a6f962488`: full144 jobs and PR23 smoke passed. Its sole first-attempt historical theatre-camera2 timing failure remains recorded; the unchanged-head diagnostic retry measured960.633ms under the original1000ms guard. Those results do not constitute acceptance of this newly requested boundary repair.

### Bounded repair scope

Diagnose the visible external-map soil-face teeth in the actual rotated native scene, including whether they already occur in the immutable T730 renderer. Fix only the relevant native map-boundary geometry/depth/culling decision. Do not flatten or alter saved terrain, globally recolour/restyle the map, remove the soil cross-section, hide the edge with a visual overlay, change camera framing to conceal the defect, alter any building art, or postprocess review images. Terrain height variation, corners and all four camera rotations must remain meaningful. If source investigation establishes another mechanism, record that evidence and its bounded correction before editing that mechanism.

Any renderer correction must have a reversible source assembly and a named runtime escape valve restoring the previous native behavior for diagnosis. The old behavior must remain accessible only as that diagnostic fallback; it is not a replacement for fixing the requested view. Product saves, world tiles, RNG, simulation, utility/staff/cost accounting and all3147 canonical boot assets must remain unchanged.

### Executable repair acceptance

1. Pin the pre-repair product and exact relevant renderer source. Record a code-level explanation of the discontinuity, with comparison to T730 source and existing native evidence; do not infer causality from the screenshot alone.
2. Capture fresh, unmodified native Chrome PNGs before and after at the exact image10 camera (rotation1, zoom1.6, focus66.5/65), same saved world, daylight and viewport1600×1080. Also capture close day/night comparisons without cropping/resizing. Before/after generation may use the diagnostic escape valve but must not change terrain, world, storage, geometry carriers or the compositor to manufacture the result.
3. Add measurable continuity/depth/visibility assertions for the implicated boundary, all four rotations, corners and both flat and genuinely varied-height boundaries. Reject the former incorrect case and injected wrong-axis/culling/height changes. Preserve legitimate cliffs; a solid-colour cover or hidden boundary must fail.
4. Verify both real Page.reload/Continue cycles plus the original three unaided ordinary days. The new view must retain all heritage/native building identities, dimensions, directions, ages, services and canonical PNG hashes, with unchanged complete saves and unaffected old terrain/blocks. Boundary drawing may not mutate the world or depend on RNG.
5. Retain the complete144-job suite, all original historical timing/style/raw-save assertions and the strict existing lazy-worker full-RGBA guard, adding explicit boundary-repair modes and source/data negatives. All game/painter/pixel/browser execution remains in isolated GitHub Actions. Preserve every failed attempt and artifact; no threshold relaxation or state repair in cold-load acceptance.
6. Present the same-camera original before/after PNGs for this new visible correction. Resume release only after that comparison is confirmed and complete exact-final-head checks pass. Main remains T730/v14.34 until the normal release process completes.

Current repair state: diagnosis and acceptance only. Renderer implementation, fresh before/after runtime evidence and new-comparison approval have not started. The original heritage art is unchanged.


### Boundary repair implementation prepared, 2026-10-07 UTC

The pre-code repair addendum was published separately as `d33d5a5a19b44c19e55f6f24d59196581c00fdbc`. Read-only source and saved-state diagnosis proves an inherited T730 ordering defect: the ground loop remains world-y/world-x ordered after camera rotation and interleaves a two-sided `SPR.cliff` with each boundary tile. At rotation1, tile A=(71,65) is painted before B=(71,66); B's inward cliff pixel(48,30) lands at A's interior(16,14), inside its grass diamond. The saved east boundary is flat, so elevation variation is not the cause. The implicated cliff generator, w2v transform, screen anchors and old draw call are byte-identical to T730.

The correction retains the complete original cliff atlas and loop order. View-y outer cells draw only its left32 columns, view-x outer cells only its right32, and the front corner uses the full original call. `__noMapEdgeFix018` restores that exact legacy call and participates in the native ground-cache key. No terrain, elevation, mask, simulation, save, palette or architectural geometry changes. All904 protected previous files remain exact; the approved heritage art and simulation are byte-exact except one additional pure smoke assertion. Eight approved full heritage records, their family and sixteen canonical PNG hashes are now pinned against the verified5292469 evidence.

Source-only checks pass:166,134 draw-call cases,748 isolated browser/CommonJS cases and20 geometry/source mutations for the helper;165,888 mocked calls and52 native-observer data negatives; all previous94 lifecycle negatives and75 strict lazy-worker negatives. Eight additional approved-heritage mutations are rejected while the original12+29 fingerprint controls remain unchanged. No game, painter, native canvas or pixel execution has occurred locally.

The complete workflow retains all144 prior jobs and adds four boundary modes, for148 required jobs. New modes reuse the original actual two-Continue/three-ordinary-day block byte-for-byte, then capture native full-canvas old/fixed pairs, prove ground-cache flag reversibility, bounded pixel differences and outward-soil retention, and inspect all rotations/zooms/weather. Existing elevated boundary tiles are surveyed and captured without altering them. Additional canonical-sprite scratch fixtures are explicitly labeled geometry tests, not substitutes for the real game or saved-height evidence. The pass-through drawImage observer forwards unchanged calls, restores the original API in finally, and cannot modify render arguments, source images, terrain or saved state.

A local assembly install initially rejected an atomic rename across filesystem mounts; the original product remained untouched. Reassembly used a verified copy into the workspace followed by a same-filesystem atomic replacement, and the full reversible source contract then passed. This was a file-install diagnostic, not a game-runtime test.

Final observer review added eight source/data controls (60 total), per-frame unchanged terrain/elevation assertions, and guaranteed original before/after PNG retention for every rejected comparison, including scenarios not selected for review capture. All42 pair-failure negatives prove that raw retention. The strict full-canvas difference gate is unchanged; native animated layers may reveal a diagnostic mismatch, which must be preserved and investigated rather than silently excluded.

Pending: first native execution of the repair, complete148-job regression and fresh same-view before/after approval. No release or main changes are included in this candidate push.
