# GPT-005 — A working British high street and community quarter

Status: all six R3 full-matrix jobs passed; R4 moves this unreleased batch to238–245 following the new upstream ID rule and requires fresh exact-SHA certification. Owner image approval is pending.
Initial base:7da1b6985e6ddab6cdb036c66c165930d71107fb (v14.21 / T717). Current R4 base:f6d626c04c2979e8b2855f0f4a9e9ab1eef35654, whose only upstream change is the owner decision recorded2026-10-04. Product bytes remain exact T717.
Branch: gpt/british-high-street.

## Scope before implementation

Eight original, independently recognizable British buildings: co-operative grocery, bakehouse, covered market hall, Victorian board school, cottage surgery, neo-Georgian high-street post office, municipal swimming baths, and timber village hall. Community-scaled architecture, not another landmark set. Final names, references, footprints and balance will be recorded before gameplay/art code; any scope change must explain the catalog collision or functional reason.

The existing terrace, Fox & Finch pub and Edwardian public library remain exactly unchanged. Existing tea room, bookshop, fish-and-chip shop, galleried inn, corner pubs, mews and named British monuments are not repeated. Generic civic counterparts may inform simulation roles, but a new asset must have a distinct plan, massing, roof structure, entrance and materials rather than a relabeled or recolored box.

Use original native procedural 2:1 Canvas pixel geometry. Research authoritative British architectural references; do not import or trace third-party artwork. Reuse the stable T717 integration path where appropriate, with bounded data registration rather than unrelated engine rewriting. Audit new permanent IDs before reservation. Rejected PR7 remains untouched.

## Acceptance written before code

1. Eight normal, searchable catalog entries with exact names, role, cost, unlock, footprint and useful inspection. At least three commerce forms, education, health, postal and leisure roles. All gameplay comes from existing authorities, with documented meaningful capacities/jobs/upkeep and no decorative-only service claims.
2. Every root/reference footprint uses normal placement, collisions, off-map/water/road/occupied/crater rejection, tree charges, funds, nine-day construction, demolition from any cell and undo. No effect, tax or jobs before completion. Fixed mature identity does not randomly upgrade or merge.
3. Road/power/water readiness uses real topology across every footprint edge, including after save/load. Disconnected, unpowered, waterless and construction states have correct disabled capacities. Services stamp and unstamp symmetrically; budgets, workforce, supply, postal coverage and mobility use the same declared roles.
4. Fresh slot-3-only save/load preserves new IDs, roots, references, ages and fixed lv/v. Existing saves, IDs219–221, old-only simulation and RNG semantics remain unchanged. No live user saves are read or touched.
5. Each building has distinct massing, roofline and materials rooted in the recorded reference. Day/night opaque z-buffer pixels agree; no night light on transparent pixels or through opaque fronts. Art uses no shared RNG; no per-frame geometry generation. Existing square-building four-camera fixed-elevation policy is retained and described honestly.
6. Examine actual PNG pixels in normal city rendering at near/far zoom, day/night, all four cameras, rain/snow, neighboring buildings/occlusion and nine-day construction. Compare against the approved T717 buildings. Green assertions alone are not art approval: revise deficient pixels and recapture.
7. Every legacy sprite leaf, superblock and environment baseline remains exact. Assert the exact expected new keys and no others. Preserve approved British art source/pixels. Do not modify fp.json, style.json, version fields, AUTORUN-LOG.md or DECISIONS on this review branch.
8. Add small resident smoke selftests and a dedicated assertion-based integration/gameplay probe. First run a fast preflight before the costly matrix; use isolated GitHub Actions with contents:read, no secrets, no deploy and no tracked baseline rewrites. Final exact-SHA required smoke, three smoke runs, strict declared-delta/fingerprint/style checks, old-city simulation compatibility and new runtime guards must pass.
9. Measure art boot/build time and representative rendering overhead. Keep source growth bounded; no redundant sprite aliases or raster payloads. Record measured numbers rather than inventing a performance pass.
10. Deliver a draft PR, exact source/test evidence and PNG contact sheets, focused individual views, actual-town scenes and gameplay proof for user approval. No ZIP delivery. Stop before merge/deploy until this batch receives explicit image approval.

## Environment and release boundary

Only the dot cloud checkout and authorized isolated CI. Never the owner's Zenbook. The cloud browser's known Chrome failure and blocked CLI sockets are not retried or bypassed. Parent receives significant progress and blockers.

The existing public site is not deleted or migrated. No global visual changes, authentication/security settings, external PR comments, force pushes or edits to another writer's branch. Before every source upload, recheck main; if authorization is denied or canceled, stop that write chain immediately.

Release metadata and the next T number will be staged only after image approval, respecting repository requirements. This branch remains an integrated, playable review candidate, not a prototype archive.

## Construction record and honest limitations

- 2026-10-04: fetched main, read AGENTS/AUTORUN/CLAUDE/DECISIONS/STYLE-THEOTOWN and T702/T711/T699 plus T717 integration records. Independent reference/catalog and gameplay integration audits started before coding.
- Catalog collision review: removed proposed Art Deco cinema and English fire station because k40v0 and k6v0 already have those precise forms. Replacements are a neo-Georgian post office and timber/corrugated-iron village hall. Board school will use a single-storey sandstone H-plan, distinct from existing k7 two-storey brick L-plan.
- No implementation, runtime result or visual approval yet. Actual-device/mobile performance remains unmeasured. Eight types above are the proposed bounded scope; source and balance table still pending research.


## Locked reference and balance table (before implementation)

Catalog audited on T717. The initial pre-code audit reserved222–229, before the later main decision. R4 uses permanent IDs238–245 after auditing the latest main registry;222–237 remain unregistered. Fixed lv1/v0; eight canonical sprites, no aliases.

| ID / tool | Original form / authoritative reference | Footprint | Gameplay / balance |
|---|---|---|---|
|238 coOpStores|Sheffield faience-front 3-storey co-operative shop; [Page Hall](https://historicengland.org.uk/listing/the-list/list-entry/1246876)|2×2|Commerce12 jobs; $2000, rank4; power2.4/water3|
|239 stoneBakehouse|Corfe rubble-stone one-and-attic shop, stone-slate roof/dormers and rear bakehouse wing; [Corfe](https://historicengland.org.uk/listing/the-list/list-entry/1120972)|2×2|Commerce8 jobs; $1500, rank3; power2.6/water3.4|
|240 coveredMarket|Perpendicular shop cross-range plus long glazed cast-iron hall, distinct from k87's brick gable/lantern; [Burslem](https://historicengland.org.uk/listing/the-list/list-entry/1483420)|3×3|Commerce24 jobs; $3500, rank6; power4.5/water5|
|241 boardSchool|Sandstone single-storey H-plan classroom halls and bellcote; [Alnmouth](https://historicengland.org.uk/listing/the-list/list-entry/1494938)|3×3|10 public jobs,120 seats,school coverage; $2200,rank4,upkeep4; power2.8/water2|
|242 cottageSurgery|White roughcast Arts-and-Crafts low wings, veranda and garden; [Winsford](https://www.landmarktrust.org.uk/properties/winsford-cottage-hospital/)|2×2|6 public jobs,6 clinic beds,100 service capacity; $1600,rank3,upkeep3.5; power2.2/water3|
|243 highStreetPost|Neo-Georgian T-plan, stone lower/rendered upper, pitched slate between parapets and rear sorting hall; [Cullompton](https://historicengland.org.uk/listing/the-list/list-entry/1481957)|2×2|6 public jobs,85 service capacity,post coverage; $1400,rank3,upkeep3; power1.8/water1.3|
|244 municipalBaths|Terracotta/redbrick entrance, paired low vent cupolas, rooflit enclosed pool halls and boiler chimney; [Moseley](https://historicengland.org.uk/listing/the-list/list-entry/1076274)|3×3|10 public jobs,140 leisure capacity,pool coverage; $3000,rank5,upkeep5; power4/water7|
|245 villageHall|Single-storey weatherboards/corrugated-iron pitched roof, veranda and lower cross-wing; [Colony Hall](https://historicengland.org.uk/listing/the-list/list-entry/1454581)|2×2|5 public jobs,70 service and85 leisure capacity,community coverage; $1200,rank3,upkeep2; power1.6/water1.4|

All numbers are game-design values compared with existing pub10jobs/library16jobs160seats, school8jobs90seats and clinic4beds. They are not factual staffing claims about the references. Commerce is normal employment/shopping/supply/tax; bakehouse does not claim a new grain/bread production chain and covered market does not inherit k87's unrelated food/export side effects. Public capacities use existing workforce and budget authority; all new service coverage is completion/power/water/road gated. Paid construction and running costs discourage the new group from replacing every established civic option. Parent must check these intended values against actual guards after implementation.

## R1 integration before runtime verification

Eight independently authored native builders are integrated with fixed IDs222–229, normal catalog/placement/undo/save, real utilities, staffed commerce, school/clinic/post/pool/community services and declared public upkeep. Only new roots age before their daily authority pass and skip the later legacy increment, giving literal ninth-day functionality. A new-only employed/14 contribution enters actual retail goods demand; true zero staffing remains zero in school/clinic capabilities. These three issues were caught and corrected by independent static review before CI.

New buildings are player-buildable and manual-only for the AI mayor, preserving its old construction choices. Legacy power/water diagnostic rollback conservatively leaves the new IDs unserved. New commerce uses the normal staffed tax path, without the older aggregate-only nightlife bonus. Bakery/market do not claim a new food production chain.

Initial HTML:9,808,796 bytes (+112,613,1.16%). Native art source:59,526 bytes. All64 inline scripts parse without execution. Gameplay probe has ten bounded groups plus guarded cleanup; every scheduled group must actually run. All runtime/pixel/compatibility/performance acceptance remains pending, with no local game/Chrome execution.

During the source-upload approval wait, the cloud workspace was replaced. After explicit owner permission to retry recovery, the uploaded HTML was downloaded and verified exactly:SHA256 78bd03e984650899019e9fd485099fe70069488ca646267b139146f164bc34ca; generator3473fd26085cdd18e82111e8b98cd34020ef9d1204e862ef6c9ce626b91c5b73; gameplay probe69fa28a796e97958af13ba6e6c0b7457ba9ad527bd4316c3480e30368fcbbab5. Original artwork/probes were extracted unchanged; no redraw or stale reconstruction. External CI wrapper was restored from recorded commands and pinned T717 helper source and re-parsed. The new checkout is in the persistent conversation workspace. No main write, deployment or production migration occurred.

## R1 actual CI and R2 correction

Commit2d06306cd1dd7de069e45d23d73e5bddd56d6c44 passed [ordinary smoke](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37190654182), including81 new and26 prior British selfchecks. Eight sprites baked in70.8ms in the isolated preflight runner; this is asset build time, not whole-game startup. [Strict preflight](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37190654221) failed the map-edge placement probe before art captures: an old fiscal wrapper called placeCost before canPlace, and negative-y dereferenced an absent anchor tile. R2 adds a bounds-only quote guard for new high-street tools, leaving normal rejection and legacy paths unchanged. Guards were not relaxed. Independent review also moved console/uncaught-error acceptance into every evidence mode and added it to the old-city comparison. Runtime, visual matrix, compatibility and owner approval are still pending.

## R2 actual pixel review and R3 full-matrix candidate

[Preflight396fc71](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37190929206) passed107 checks, plus657 catalog/edge assertions and200 placement/inspection/undo assertions. All2771 prior leaves remain unchanged; only the eight declared canonical leaves were added. All1728 superblock sprites preserveCRC5ef6eb67. Eight normal saves/loads retain IDs and real utilities after an ordinary day, with289 physically connected old neighbors retaining power. Eleven disconnected background neighbors remain visible and are not claimed as served. Normal smoke also passed.

Actual PNG inspection, independently reviewed and compared with approved T717 images, found four visual deficiencies that guards alone could not judge: co-op upper glazing looked too blank, the market glass roof had distracting isolated emission squares, and surgery/hall opaque veranda roofs hid too much of their entrances/windows. R3 strengthens only co-op mullions/floor divisions, removes only market roof emission, and raises/shortens the two verandas with structurally aligned posts/steps/drains. Bakery, post, school and baths forms remain unchanged. Recapture must validate these revisions; no owner image approval has occurred.

Runtime-guard review also added detached end-of-tick physical-power snapshots before any diagnostic repair, alongside immediately-after-dispatch evidence. Used/served energy must not exceed physical dispatch; indivisible-load slack is allowed and nominal capacity is never mistaken for energy dispatched. Disposable QA fresh worlds explicitly reset existing in-memory fiscal/observatory state. These changes do not alter normal game resets.

R2 software-rendered full-town forced-draw medians were2628.7ms with the eight roots and2557.0ms after their normal removal (nine warm draws each; +71.7ms). This is a heavy isolated CI renderer comparison, not real-device FPS certification. R2 native-generator rebuilds took42.5/27.4ms. R3 will record fresh values. Full gameplay, four cameras, weather,80 construction frames, occlusion, smoke×3 and two old-city comparisons remain pending.

## R3 complete evidence and R4 upstream reconciliation

[Full R3 CI](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37191639236), exact commitd815ca32f1d1a4bc39c07a7373371226f5e8378c: all six jobs passed. Counts:107 preflight checks;10 new gameplay groups/1658 assertions;9 prior groups/498 assertions;128 camera samples across four rotations/two zooms/day-night;32 rain/snow samples;80 construction frames and3 foreground-occlusion scenes;three smoke passes; declared-delta fingerprints/style; and two old cities exactly equal at days1/2/6/21. Construction contributed168 checks. Actual revised pixels were reviewed independently: co-op mullions/floors, market roof, surgery/hall entries were acceptable. Dense foreground towers legitimately obscure some rotated city views; those are placement/occlusion evidence, not four unobstructed elevations. Full native sprites and clear R0 captures show complete forms.

At09:34:45 main advanced to f6d626c04. Its single upstream docs/DECISIONS line rejects PR7 and directs new building IDs to begin at238. This different eight-building batch had already reserved222–229 before that change, but has never been released or placed in an owner save. We therefore adopt238–245 before approval. Eight exact production registry-prefix replacements change16 integer identity tokens; all production authorities derive their keys from the registry. Old IDs1–221 and the reserved gap222–237 are unchanged. No PR7 code, art or commit is included. The upstream decision is imported byte-for-byte, not rewritten.

All guard/fixture references are migrated explicitly, not by global numeric replacement. Resident selftest now checks100 facts, including16 absent gap IDs and3 exact prior British definitions. Save tests add10 gap/approved-record checks across the five ages. R4 pins the reviewed R3 art source SHA25666bec7f6d6ceca1efa860357e662217993bfdf8995e86530d457815479685832 and every target day/night pixel fingerprint, requiring the identity move to preserve art exactly. Full latest-base/head CI will be repeated before the final PR/image packet.

While synchronizing CI, regression failure reporting is corrected with controlled errexit disabled, separate command/tee exit records, and strict aggregate status. This fixes diagnostic collection on a failing pipeline without changing any successful test criterion. No game test has run on the local cloud computer.
