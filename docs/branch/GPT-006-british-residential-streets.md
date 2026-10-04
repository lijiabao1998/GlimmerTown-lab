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

## Locked forms and balance before implementation

All sixteen use2×2 plots, fixedlv1/v0 andwealth1. Figures below are game balance, not historical staffing claims. Low/mid occupancy and all utilities use existing game authorities.

| ID | Form | Housing / band | Cost / rank | Power / water |
|---|---|---|---|---|
|246 georgianRow|Georgian continuous row|36 / mid|$1300 / 3|2.62 / 2.04|
|247 georgianCorner|Georgian L-corner terrace|40 / mid|$1600 / 4|2.8 / 2.2|
|248 georgianEnd|Georgian end pavilion|28 / mid|$1200 / 3|2.26 / 1.72|
|249 georgianArea|Georgian raised-basement terrace|32 / mid|$1400 / 4|2.44 / 1.88|
|250 victorianGabledSemi|Victorian cross-gabled semi pair|20 / low|$950 / 3|1.9 / 1.4|
|251 victorianBayVilla|Victorian canted-bay villa|12 / low|$1100 / 4|1.54 / 1.08|
|252 victorianGardenVilla|Victorian double-fronted garden villa|12 / low|$1200 / 4|1.54 / 1.08|
|253 victorianGothicVilla|Victorian Gothic cross-wing villa|16 / low|$1250 / 4|1.72 / 1.24|
|254 stoneCottagePair|English stone cottage pair|12 / low|$600 / 2|1.54 / 1.08|
|255 brickCatslideCottage|English brick catslide cottage|10 / low|$550 / 2|1.45 / 1.0|
|256 courtyardCottages|English courtyard cottages|18 / low|$800 / 2|1.81 / 1.32|
|257 thatchedLongCottage|English thatched long cottage|8 / low|$500 / 2|1.36 / 0.92|
|258 workersNarrowRow|British narrow workers row|32 / mid|$850 / 2|2.44 / 1.88|
|259 workersYardTerrace|British through-terrace with yards|28 / mid|$900 / 2|2.26 / 1.72|
|260 workersCourt|British back-to-back court|36 / mid|$1000 / 3|2.62 / 2.04|
|261 workersCornerShop|British corner shop and homes|16 / mid +6commercialjobs|$1200 / 3|2.72 / 2.04|

Distinct geometry: Georgian straight row/L-corner/end pavilion plus rear wing/raised-basement area; Victorian cross-gabled semi/asymmetric canted-bay villa/double-fronted garden villa/Gothic cross-wing; village stone pair/brick catslide/L-courtyard/low cob-thatched longhouse; workers narrow row/through-terrace backyards/back-to-back court/mixed-use corner shop. Existing1930s hip-roof semis, stucco terrace blocks, k219 bay terraces andk239 bakehouse are protected.

## Reference audit before drawing

All references describe building form/material only; sprites are original geometry. Authoritative references were read during the catalog audit on the pinned base.

- Georgian: [York Road1282037](https://historicengland.org.uk/listing/the-list/list-entry/1282037), [Dowry Square1202208](https://historicengland.org.uk/listing/the-list/list-entry/1202208), [Sion Hill1293317](https://historicengland.org.uk/listing/the-list/list-entry/1293317), [Sion Hill1208177](https://historicengland.org.uk/listing/the-list/list-entry/1208177).
- Victorian: [Cross-gabled semi pair1187578](https://historicengland.org.uk/listing/the-list/list-entry/1187578), [Oakhurst1404507](https://historicengland.org.uk/listing/the-list/list-entry/1404507), [Priory Road1386341](https://historicengland.org.uk/listing/the-list/list-entry/1386341), [Red House1064203](https://historicengland.org.uk/listing/the-list/list-entry/1064203).
- Village: [Arlington Row1155677](https://historicengland.org.uk/listing/the-list/list-entry/1155677), [Hope Cottage1486407](https://historicengland.org.uk/listing/the-list/list-entry/1486407), [Court Cottages1319628](https://historicengland.org.uk/listing/the-list/list-entry/1319628), [Faith Cottage1273686](https://historicengland.org.uk/listing/the-list/list-entry/1273686).
- Workers' houses: [Elsecar Old Row1151094](https://historicengland.org.uk/listing/the-list/list-entry/1151094), [National Trust Birmingham Back to Backs](https://www.nationaltrust.org.uk/visit/birmingham-west-midlands/birmingham-back-to-backs/history-of-birmingham-back-to-backs).

Catalog collisions explicitly avoided: ukVictorian already has tall stucco Georgian-like rows/basements/balconies; ukSemi uses1930s hips; ukTerrace/k219 already supply bay-fronted redbrick rows; ukMews has carriage openings; k81 is jettied Tudor B&B; k242 is a white Arts-and-Crafts surgery. New plans and sections, rather than renamed colors, supply each distinction.

- Pre-code remote card commit: `c336b7e90957fe058799e7e68449c48fb3ff1fe9`. Locked forms/balance and reference audit recorded before the drawing/integration workers started implementation.

## R1 integrated candidate, before runtime evidence

All sixteen original builders and their normal catalog/placement/housing authorities are assembled. k261 carries16 nominal residents and6 commercial jobs through the existing housing and enterprise systems. Total nominal housing is356:108low-density and248mid-density. All65 inline scripts parse without executing the game. The candidate adds about1.2% to the HTML; no external raster payloads or shared simulation RNG are used.

Independent static review caught and corrected a fixture road crossing its own plant, a stale external group list, an occupancy-rounding assumption and a compatibility-world metadata type assumption. These were QA corrections, not accepted failures hidden by weaker thresholds. Actual CI/runtime, rendered pixels, performance results and owner approval remain pending.

Verification design: fast preflight; six substantive gameplay groups plus every existing T717/T718 gameplay group; four single-camera shards; rain/snow; four construction shards (40frames each); smoke three times; strict declared-delta fingerprints; exact simulation comparison of two seeded sandbox showcases plus a normal-difficulty approved-British city. The compatibility harness additionally exposes the seeded PRNG's integer closure state without advancing it, after proving the original update/return sequence unchanged on1280 controlled draws. Temporary CI observation edits are restored, never published as product code.

## R1 exact CI and actual pixel review

Exact candidate `ed1d089099b0550f590b047e2715bf52a8881a6f`: [smoke37198787475](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37198787475) passed; new resident smoke163 plus T71726 and T718100 checks passed with no console errors. [Preflight37198787524](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37198787524) passed189 scoped checks, including1286 catalog/placement and342 ordinary nine-day-construction assertions. All132 exported artifact hashes verified. Exactly16 new canonical leaves appeared;2779 prior leaves and1728 superblock sprites were unchanged. All16 loaded homes had real power/water after the first normal day;287 previously connected old neighbors retained served power. Other background roots are not claimed as served.

Actual day/night sprites, individual game crops and four complete streets were inspected. Fourteen forms are retained. UKR14 rear yards and UKR15 internal court are geometrically present but visually hidden behind the tall street range, making the distinction too weak. R2 shortens their foreground range into deliberate row ends with a genuine visible service alley/court entrance; it does not make walls transparent or alter the other14 forms.

The external demonstration layout also moves its3×3 prior-library benchmark away from a newly introduced frontage road and adds an explicit authored-footprint/road-crossing guard. This is a QA scene correction, not a change to the approved library. The broad matrix and remaining four new gameplay groups remain unrun at this point.

Measurements: sixteen native builders78.3ms/rebuild43.8ms. Heavy software-rendered town medians2734.7ms with/2822.1ms without the new roots are noisy and do not establish an optimization or real-device FPS pass. Four unchanged nested atlas diagnostics remain: `industry:165_1_0`, `industry:166_1_0`, `industry:174_1_0`, `version-anchor`. They are not represented as passing nested audits.
