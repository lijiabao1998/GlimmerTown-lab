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
