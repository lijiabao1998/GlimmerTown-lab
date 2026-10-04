# GPT-006 — Four coherent British residential street groups

Status: pre-implementation card. Image approval and release are pending.
Base: `0072ac19b3c33f2dda98552d8b6c6bf447ba296c` (T718 / v14.22).
Branch: `gpt/british-residential-streets`.

## Scope before code

The owner approved all four proposed residential groups, provisionally sixteen meaningful buildings: Georgian terraces, Victorian suburbs, English village cottages and industrial-town workers' housing. Each family must work as a street, with adjoining row/end/corner modules or appropriate garden spacing and road-facing entrances. This is not sixteen color swaps or sixteen isolated landmarks.

Audit the live catalog before locking forms. Existing T717 Victorian terrace (k219), T718 high-street buildings (k238–245), ukTerrace/ukSemi/ukVictorian/mews and cottages stay unchanged. Reserve only IDs actually free from k246 onward. Rejected PR7's k222–237 stay unused; no art/code from that rejected branch enters this batch.

Record authoritative architectural references, original massing distinctions, dimensions, footprints and gameplay balances before implementation. Native procedural 2:1 Canvas pixels only, no image-generated sprites or imported art. Reuse established geometry primitives and game authorities; do not change the global look or architecture.

## Acceptance written before implementation

1. Sixteen independently recognizable original forms across four groups, with deliberate connected-street composition, visible entrances and usable gardens/courtyards. Each has a distinct plan, roofline or building section rather than cosmetic variation.
2. Searchable normal catalog entries with truthful names, footprint, cost, unlock and inspection. All houses provide real completed, serviced housing capacity/citizens through existing authorities. Any corner shop with accommodation must have both real housing and normal jobs/shopping; no decorative-only claim.
3. Full-footprint collision checks at every root/reference cell, boundaries, water, transport, occupied plots and craters; correct tree clearing, funds, undo/redo, demolition/refund from every cell, and nine-day construction. No premature residents/jobs/services or industrial fallback.
4. Real road/power/water topology across every footprint edge, without preview power flags. Save/load followed by an ordinary day retains identities, capacities, occupancy, utilities and original buildings. Test disconnected, under-construction and removed-utility states.
5. All prior IDs, art, saves, RNG and old-only city simulation remain exact. New mature identities stay fixed; no random upgrades/merges. Existing four-camera fixed-elevation policy is retained and disclosed.
6. Day/night share opaque z-buffer visibility. No floating geometry, clipped roof/chimney, base spill, or emission on transparent/opaque foreground pixels. Use deterministic hashes, no shared simulation RNG or per-frame asset generation.
7. Review actual gameplay PNGs in coherent streets and a mixed city at near/far zoom, day/night, four cameras, rain/snow, occlusion and staged construction. Iterate on real pixels, not just passing assertions. Images must label camera, zoom and time honestly.
8. Preserve immutable `fp.json`, `style.json`, release version fields, `AUTORUN-LOG.md` and `docs/DECISIONS.md` until explicit owner image/release approval. Strictly allow only the declared new sprite families and prove every legacy record unchanged.
9. Resident smoke checks, isolated assertion-based gameplay probes, exact-SHA branch CI, smoke three times, bounded critical visual matrices and two old-city compatibility comparisons. Use fast preflight first, parallelize costly construction captures sensibly, and record failed/unrun tests without disguising them. Four existing legacy seeded-atlas diagnostics remain disclosed separately.
10. Measure asset-build and representative-render costs without inventing a hardware/FPS pass. Independently review gameplay integration, QA strength and actual pixels before delivery.
11. Deliver a draft PR plus verified PNG approval boards and exact source/test provenance. No ZIP delivery. Stop ready for owner image approval; no merge or production deployment in this task.

## Environment and boundaries

Persistent dot-cloud checkout, plus authorized GitHub branch CI only. Do not use the owner's Zenbook. Respect the known cloud browser/CLI socket failures, with no security workaround, credentials or new authorization. GitHub connector writes only this batch's branch, no force push, no unrelated PR comments, no official-site deletion or migration. Check each tool outcome; stop dependent mutations immediately after denial/cancellation and report the exact blocker.

## Construction record

- 2026-10-04: fetched and verified main `0072ac19`; read AGENTS/AUTORUN/CLAUDE/DECISIONS and T702/T711/T699/T718. New persistent branch created locally. Independent catalog/reference audit started. No product implementation yet.

## Not completed / limitations

Catalog/reference balance lock, implementation, all runtime checks, pixel review and image approval remain pending. Real-device/mobile performance is not certified. No site release authorized for this round yet.
