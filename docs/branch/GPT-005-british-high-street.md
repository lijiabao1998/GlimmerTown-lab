# GPT-005 — A working British high street and community quarter

Status: pre-code acceptance card. Architecture references and catalog collision audit underway; no product changes yet.
Base: current origin/main 7da1b6985e6ddab6cdb036c66c165930d71107fb (v14.21 / T717), fetched and verified 2026-10-04.
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

Catalog audited on T717. Numeric IDs222–229 have no building metadata, tool, sprite or placement registrations; incidental 225/226 values occur outside building IDs. Fixed lv1/v0; eight canonical sprites, no aliases.

| ID / tool | Original form / authoritative reference | Footprint | Gameplay / balance |
|---|---|---|---|
|222 coOpStores|Sheffield faience-front 3-storey co-operative shop; [Page Hall](https://historicengland.org.uk/listing/the-list/list-entry/1246876)|2×2|Commerce12 jobs; $2000, rank4; power2.4/water3|
|223 stoneBakehouse|Corfe rubble-stone one-and-attic shop, stone-slate roof/dormers and rear bakehouse wing; [Corfe](https://historicengland.org.uk/listing/the-list/list-entry/1120972)|2×2|Commerce8 jobs; $1500, rank3; power2.6/water3.4|
|224 coveredMarket|Perpendicular shop cross-range plus long glazed cast-iron hall, distinct from k87's brick gable/lantern; [Burslem](https://historicengland.org.uk/listing/the-list/list-entry/1483420)|3×3|Commerce24 jobs; $3500, rank6; power4.5/water5|
|225 boardSchool|Sandstone single-storey H-plan classroom halls and bellcote; [Alnmouth](https://historicengland.org.uk/listing/the-list/list-entry/1494938)|3×3|10 public jobs,120 seats,school coverage; $2200,rank4,upkeep4; power2.8/water2|
|226 cottageSurgery|White roughcast Arts-and-Crafts low wings, veranda and garden; [Winsford](https://www.landmarktrust.org.uk/properties/winsford-cottage-hospital/)|2×2|6 public jobs,6 clinic beds,100 service capacity; $1600,rank3,upkeep3.5; power2.2/water3|
|227 highStreetPost|Neo-Georgian T-plan, stone lower/rendered upper, pitched slate between parapets and rear sorting hall; [Cullompton](https://historicengland.org.uk/listing/the-list/list-entry/1481957)|2×2|6 public jobs,85 service capacity,post coverage; $1400,rank3,upkeep3; power1.8/water1.3|
|228 municipalBaths|Terracotta/redbrick entrance, paired low vent cupolas, rooflit enclosed pool halls and boiler chimney; [Moseley](https://historicengland.org.uk/listing/the-list/list-entry/1076274)|3×3|10 public jobs,140 leisure capacity,pool coverage; $3000,rank5,upkeep5; power4/water7|
|229 villageHall|Single-storey weatherboards/corrugated-iron pitched roof, veranda and lower cross-wing; [Colony Hall](https://historicengland.org.uk/listing/the-list/list-entry/1454581)|2×2|5 public jobs,70 service and85 leisure capacity,community coverage; $1200,rank3,upkeep2; power1.6/water1.4|

All numbers are game-design values compared with existing pub10jobs/library16jobs160seats, school8jobs90seats and clinic4beds. They are not factual staffing claims about the references. Commerce is normal employment/shopping/supply/tax; bakehouse does not claim a new grain/bread production chain and covered market does not inherit k87's unrelated food/export side effects. Public capacities use existing workforce and budget authority; all new service coverage is completion/power/water/road gated. Paid construction and running costs discourage the new group from replacing every established civic option. Parent must check these intended values against actual guards after implementation.

## R1 integration before runtime verification

Eight independently authored native builders are integrated with fixed IDs222–229, normal catalog/placement/undo/save, real utilities, staffed commerce, school/clinic/post/pool/community services and declared public upkeep. Only new roots age before their daily authority pass and skip the later legacy increment, giving literal ninth-day functionality. A new-only employed/14 contribution enters actual retail goods demand; true zero staffing remains zero in school/clinic capabilities. These three issues were caught and corrected by independent static review before CI.

New buildings are player-buildable and manual-only for the AI mayor, preserving its old construction choices. Legacy power/water diagnostic rollback conservatively leaves the new IDs unserved. New commerce uses the normal staffed tax path, without the older aggregate-only nightlife bonus. Bakery/market do not claim a new food production chain.

Initial HTML:9,808,796 bytes (+112,613,1.16%). Native art source:59,526 bytes. All64 inline scripts parse without execution. Gameplay probe has ten bounded groups plus guarded cleanup; every scheduled group must actually run. All runtime/pixel/compatibility/performance acceptance remains pending, with no local game/Chrome execution.

During the source-upload approval wait, the cloud workspace was replaced. After explicit owner permission to retry recovery, the uploaded HTML was downloaded and verified exactly:SHA256 78bd03e984650899019e9fd485099fe70069488ca646267b139146f164bc34ca; generator3473fd26085cdd18e82111e8b98cd34020ef9d1204e862ef6c9ce626b91c5b73; gameplay probe69fa28a796e97958af13ba6e6c0b7457ba9ad527bd4316c3480e30368fcbbab5. Original artwork/probes were extracted unchanged; no redraw or stale reconstruction. External CI wrapper was restored from recorded commands and pinned T717 helper source and re-parsed. The new checkout is in the persistent conversation workspace. No main write, deployment or production migration occurred.
