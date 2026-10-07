# GPT-019 — Waterfront cultural quarter

## Acceptance card written before implementation

Started 2026-10-07 UTC from authoritative main `b101348278b71f133b5f4347bc6e63237c9942a1` (T731 / v14.35 / r178), tree `27d5dd2675cc552d5741ac1bdbe5531ff107b7f4`. Product SHA256 `74d5616c283a561bd9655a6788e48308941e5d009be4200b0642d05b1285a68c`. Branch `gpt/waterfront-cultural-quarter-019`; no release T number is reserved. Publish this card before implementation.

The owner requested a larger iteration: plan the heritage buildings, plaza, walking routes, street details and people activity as one coherent waterfront district, then present the complete result together. Cloud engineering, candidate pushes, CI and draft PR work are authorized; the new visual package still requires owner approval before release. Work only in GlimmerTown-lab and the assistant's cloud. All actual game/browser/painter execution remains in isolated Actions, disposable slot 3.

T731 is released. Its full release acceptance passed148/148; actual official-origin functional/provenance checks passed235/235, with13 exact documents,12 Continue cycles,36 boundary pairs and335 native PNGs verified. Large final report serialization/packaging failed after those passes. At the owner's direction, a report-only rerun is not a completion condition. Existing strict console diagnostics remain separately red (39 PWA404 responses,13 unclassified404 errors,67360 warnings in that run; zero runtime exceptions/transport failures). No test threshold was waived. GPT019 will retain concise counts, necessary failures and original images instead of duplicating enormous world snapshots.

## Verified starting point and scope

- `gameplay018.js` exposes two optional k287 appearances. The original5 jobs/70 leisure/$3 daily upkeep, road/power/water/staff requirements, nine-day construction and sparse appearance save tags remain authoritative. Both original building silhouettes, surfaces and sixteen canonical day/emission PNG bytes must stay unchanged.
- `gameplay014.js` and `gameplay015.js` through `gameplay017.js` already provide paid1x1 path themes, native inspection, neighboring-road light authority and saved placement direction. The six existing quayside props are retained and composed into the district.
- Native T502 in `index.html` provides real walking-network nodes at base cost0.72, $12 base path construction with native modifiers, `am502`/`amx502` save data, and `amVersion502` invalidation. Use that authority; do not create an alternative movement/economy network.
- Native T295 `citizenPath`/`updateCitizensMove` samples home/work commutes along roads. It does not provide individual museum visits on these paths. T522 crowd rendering is a deterministic visual layer. Any new visitors below are explicitly service-informed visual activity, not new simulated tourists, ticket revenue, demand or transport.
- Actual T731 official day/night frames show the two halls as separate objects on broad paved approaches. The existing017 modules select individual direction sprites without a coherent district paving/edge arrangement. A connected entrance-to-plaza-to-waterfront composition is the target. Phone-specific failures are not yet claimed; baseline touch/viewport behavior must be measured before fixes.

## One complete player-buildable package

Deliver a coherent approximately12x10-tile demonstration district using actual player purchases, not pre-stamped world tiles. Players can build the same elements around their existing halls or in a new site. The new collection groups the existing two halls, eight new path components and six existing quayside details in one discoverable workflow. Each construction remains an explicit native paid action with the original undo/redo behavior; no unverified global batch-transaction semantics are introduced.

Eight new manual-only1x1 T502 themes, each with four authored views, have distinct roles:

| Theme | Role in the district |
|---|---|
| `arrivalCourt019` | Open entrance court, clear threshold and shared stone paving; keep the walking center unobstructed. |
| `brickPromenade019` | Main red-brick/stone walking spine with aligned neighboring junctions and turns. |
| `quayEdgeWalk019` | Linear waterside coping/low railing, leaving the native land path open. |
| `quayCorner019` | Terminal/corner lookout joining the edge walk to the plaza, with a clear turning space. |
| `heritageDisplay019` | Low maritime interpretation board/display court using original small structures, without rebuilding or copying either hall's pixels. |
| `watersideBench019` | Resting bay with bench and restrained planting set beside the through-route. |
| `harbourLantern019` | A visible day lamp and warm physical emission driven only by the existing adjacent-road power authority. |
| `timberShelter019` | One-bay timber/slate shelter with a walkable center and properly ordered roof/pole occlusion. |

All eight keep native base path cost/modifiers, rank4 behavior consistent with the preceding optional district themes, and native walk cost0.72. They add no jobs, capacity, income, service, fishing, rescue, toll or vessel mechanics. Native obstruction rules plus the established protective theme rules reject occupied buildings, trees, zoning, other amenities, conflicting infrastructure and water; no silent clearing or replacement. Each piece is independently inspectable and removable. Underground utilities remain governed by native compatibility.

Use one consistent stone/red-brick/slate/timber palette and physically grounded street furniture. Adjacent new pieces must form continuous paving and sensible junctions rather than eight isolated display tiles. New adjacency rendering must use bounded private caches and explicit native topology invalidation; no per-frame atlas rebuild, global terrain reorder, old-sprite repaint or uncontrolled family expansion. The planned canonical addition is32 views in one new family; if that inventory changes, document and test the exact declaration before its candidate is published.

## Activity, lighting and interaction

1. Associate nearby tagged heritage halls with connected native walking nodes. Decorative visitors may walk, pause at an interpretation point or look toward the water only on validated land-path segments. Avoid blocked cells, walls, water, railings and unconnected components. This is a visual presentation of existing operational/leisure state, not a new individual trip simulation.
2. Read native completion, road/power/water and actual staffing/leisure state. No visitors at unfinished/offline halls; activity contracts with night/rain/winter and is culled at far zoom. Use deterministic geometry/time and existing pedestrian assets where suitable. Consume zero simulation RNG, mutate no fiscal/demand/dispatch/household/save state and add no persistent actor state. Existing citizen agents and canonical sprites stay untouched.
3. Lamp emission requires a physical lamp in day art and the existing adjacent powered-road signal. Power loss removes new emission; furniture without a lamp emits nothing. Day/night/weather/four-direction scenes must preserve building and foreground occlusion.
4. Add a focused waterfront collection/entry workflow and an optional placement-time entrance/connection preview. Show genuine native price, obstruction and connection status. Clear UI wording distinguishes visual visitors from native leisure capacity. Existing tools and generic catalogs retain their behavior.
5. Verify the collection, selection, placement, pan/pinch, rotation, cancel, inspect and undo on desktop plus390x844 and844x390 phone viewports. A new entry must not become an accidental purchase while panning or opening/closing its panel. Do not claim real-device performance from emulation.
6. The two halls retain native nine-day construction; paths retain native instant completion. Present real construction-day scenes and keep visitors/lighting consistent with those actual states. Do not invent a new construction schedule.

## Acceptance before implementation

- Preserve every old complete3147 leaf record,164 family record,1728 block record, original building PNG and prior product source except the explicitly declared reversible integration points. Keep T731 labels, `fp.json`, historical logs and decisions unchanged on the candidate branch.
- New assets: exactly declared themes/views, opaque unclipped geometry, correct placement/camera orientation and anchor, visible day fixtures before emission, stable canonical identity, deterministic rebuilds, no render/asset RNG and no state/storage changes. Test disconnected/straight/elbow/T/cross arrangements and both shoreline orientations. Reused original assets remain byte/identity exact.
- Native purchases: all eight aliases, actual discounted quotes/debits, rank and poverty rejection, edge/footprint/obstruction cases, exact stored metadata, protected overlap, underground compatibility, demolition and full tile/cash undo/redo. Do not fabricate money, availability or paid placements in acceptance scenes.
- Walking/activity: compare native network costs/reachability before/after placement and demolition; invalidate correctly after undo/redo/load. Verify actual completion/power/water/staff loss and recovery, no visual visits off valid paths, no simulated economic changes, stable paused state and bounded draw/cache cost. Preserve the full original capital-window assertions when observing native building purchases.
- Save/load: old untagged saves unchanged; new data uses the existing sparse native path metadata channel with strict theme/direction validation and harmless fallback for unknown/malformed data. Real native save/load and cold Continue preserve all roots/references, directions, trees, paths, water, other slots and first/three ordinary days. Temporary visitor/cache state reconstructs without repairing native service/topology.
- Visual scenes: one complete genuinely purchased district, before/after composition, day/night, all four rotations, native construction days0/3/6/9, rain/winter, foreground occlusion, far/near zoom, disconnected/without-power controls, phone portrait/landscape and reload/Continue. Original screenshots remain unedited and tied to the tested head/source.
- Retain all148 previous checks and their original assertion bodies/thresholds. Integrate eight new runtime modes (planning, lifecycle, camera0..3, coldload, mobile) into one combined workflow sharing preflight/evidence setup, rather than repeatedly running separate148-job rounds for isolated small changes. Final expected matrix is156 jobs unless a justified source-pinned equivalent is established before publication. Every failure remains visible; no timing/console gate is reclassified to force green.
- Keep reports compact: pass/fail counts, exact version/head/source, bounded necessary failed-case details and unmodified PNGs. Avoid repeated full-world snapshots in every check. Complete required tests still run; reporting size is not a substitute for validation.

## Implementation sequence and release gate

Publish this card alone. Then implement connected paving and district art; service-informed visitor geometry/occlusion; focused catalog and measured mobile corrections; finally integrate source/data negatives, all retained runtime assertions and the complete review scene. Internal stages may be developed separately, but present the district as one visual package.

The owner reviews this new package once complete. Only after that approval and all exact-final-head tests pass may release labels/fingerprint promotion, PR readiness, merge and Pages occur. Main remains T731 until then. Never merge a test-only public observer branch.

Not yet achieved: GPT019 product, native runtime, mobile behavior, actual district PNGs and new package image approval are all pending. No new usability defect or performance improvement has yet been demonstrated on a phone. T731's existing strict PWA/console issue and same-origin storage risks are recorded separately, not silently incorporated into this district-art scope.
