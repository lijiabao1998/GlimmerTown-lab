# GPT-015 — British street details and source-level console diagnosis

## Authorization and immutable starting point

The owner requested the next wave after T727/v14.31: first classify the existing console diagnostics, then add bounded British street details such as lamps, shop signs, planters and courtyard details. GitHub main was freshly verified at `6d137b6be31a7f07867b8ebb181fb8ed3727b049`, tree `bba61383a9593867b77ec636ab70369e2dc052d3`, on 2026-10-06 UTC. No open Lab PR existed. New independent branch: `gpt/british-streetscape-015`; GPT-015 is unused in fetched history. This card precedes implementation.

Only GlimmerTown-lab is in scope. Preserve T727/v14.31 labels, protected logs/decisions/fingerprints, every old art source, all 3059 prior sprite leaves / 160 families / 1728 complete blocks, every fixed building identity through k293, gameplay, costs, save schema, old-city state and seeded RNG. No new building IDs are required. No automatic road beautification, global palette/density changes, new simulation or changed legacy services. Work uses authoring/static checks in the assistant cloud checkout and actual game/Chrome/pixel tests only in isolated GitHub Actions with slot 3 / port 8199. No user computer or saves. No main merge/deployment until this iteration's images and publication are explicitly approved.

## First: diagnose before any 404 correction

The T727 official observer passed all 63 provenance/functional gates but retained its strict console failure: 15 known PWA HTTP404 responses, 5 script404 errors without URLs, no runtime exceptions or network transport failures. Preserve those raw observations. Collect exact URL, resource type, initiator, status and browser log/request linkage in a dedicated observer on the unchanged official source. Separately classify missing manifest/icons/service-worker resources and every previously URL-less script404. A probable cause is not proof. Keep unclassified observations explicit. Do not change service-worker/network/security policy, register a new service worker or suppress messages to make a test green. Any correction is limited to a proven missing ancillary reference and must be documented with before/after request evidence; broader fixes are a separate decision.

## Bounded original design

Eight optional, separately paid native T502 walking themes, each one tile and four complete geometric views:

1. `heritageLantern`: tall fluted iron post with a single six-sided lantern, stepped plinth and ladder rest.
2. `basketLamp`: low swan-neck iron lamp with a real hanging flower basket.
3. `teaTradeSign`: freestanding two-sided iron-bracket tea-room trade sign with an original teapot motif.
4. `bookTradeSign`: freestanding burgundy/gilt bookshop trade sign with an original open-book motif.
5. `ironUrn`: low cast-iron urn planting on a stone pedestal and restrained radial paving.
6. `roseTrellis`: timber trough and narrow arched rose trellis, with open walking space.
7. `sundialCourt`: small stone sundial, radial brick inset and clipped corner planting.
8. `wicketCourt`: low brick garden wall, open timber wicket and espalier detailing.

These are new structures, not recolours/replacements of station planter/fingerpost, theatre lamp/planter, or the sixteen T727 complex themes. They remain manually placed details and ordinary footpaths, without fabricated tourism, retail, staffing, power demand or service benefits. Placement, rotation and removal use existing optional `amx502` metadata; no new save/RLE schema. Night emission belongs only to physically painted lamp glazing. Signs and non-lamp planting/court pieces do not invent illumination. Reuse the exact existing deterministic depth-buffer primitives without editing that source; no font, imported bitmap or random-source dependency.

## Acceptance written before runtime code

1. Exactly 32 original complete sprite additions in one bounded `streetscape015` family, eight named themes × four actual rotations. All 3059 prior complete records, 160 family records, 1728 blocks and old artwork stay byte/pixel exact. New geometry is opaque, aligned to native one-tile anchors, deterministic, with no clipping/floating signs or day/night surface mismatch. Boot installs exactly once and preserves canonical references.
2. Paid native T502 placement and edit/removal retain their original price/walking behavior, collision/unlock checks, undo/redo and path theme persistence. Add only bounded catalog/theme/render hooks. Escape flags disable new placement/art without preventing existing saved cities from loading. No write to a prior registry or building ID.
3. Native four-camera day/night, rain/snow and mixed-city screenshots retain established British neighbors. Real old-building construction at ordinary ages 1/3/6/8/9 is shown next to the new path details; paths themselves retain native instant completion and are never claimed to gain nine-day construction. Real depth/partial occlusion must hide lamp emission behind a genuinely placed existing foreground object without a special mask or substituted state.
4. Native paid placement, native save then actual cold Continue, normal subsequent days and exact restored theme/rotation are required. Compare old-only worlds against pinned T727 for tiles, budgets, services, mobility, households, seeded RNG and raw saves. New details must not mutate gameplay during drawing or boot. Historical checks remain intact; any new adapter is narrow, independently negative-tested and preserves original source pins.
5. Full final-head CI: three smoke passes; strict declared-additions fingerprint/style guards; all retained legacy runtime/compatibility/complex gates; new placement/save/load/pixels/occlusion checks; bounded boot/draw cost measurements. Never label unrun checks passed. Official raw console observation stays separate and strict. Static parsing is not a runtime pass.
6. Preserve all failure/retry evidence. Verify downloaded artifact digests, original PNG dimensions/source hashes/head metadata and inspect actual native pixels. Deliver a concise selection of original PNGs for owner approval; no montage, redraw, ZIP substitution or inferred image approval. No release labels, fp.json promotion, main merge or production deployment at this stage.

## Work record

| Work | Tests | Samples | Unfinished / limits |
|---|---|---|---|
| Fresh main and branch/card availability verified; card reserved before implementation. | Existing T727 evidence only. This iteration's runtime and new-art guards have not run. | None yet. | 404 source correlation, authored detail implementation, full CI and new image approval remain pending. No broader PWA/SW correction has been approved. |
