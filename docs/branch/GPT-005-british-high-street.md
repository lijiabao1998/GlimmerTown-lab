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
