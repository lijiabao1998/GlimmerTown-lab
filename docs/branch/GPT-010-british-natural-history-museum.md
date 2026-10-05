# GPT-010 — British regional natural-history museum and formal forecourt

## Authorization and immutable baseline
Owner approved the proposed British natural-history museum plus forecourt garden on 2026-10-05 08:50:45 UTC: 「這個好，固定流程（全部做完，最大程度包含細節），看截圖，我說沒問題，然後上線」. Implementation and isolated branch CI are authorized. Native screenshot approval is REQUIRED before merge, release or deployment. This branch preserves release metadata and existing museums; it is not a release approval.

Baseline: main d9dfe87689fa841edb8775d0f95db77d9f2deb5b, T722/v14.26. Work only in gpt/british-natural-history-museum010. No owner PC, local game runtime, credentials, force push, baseline changes or prior-registry changes. Runtime and pixel guards run solely in isolated GitHub Actions, disposable slot3 and port8199.

## Prior-system audit and design
Existing k35 is the ordinary 2×2 museum (12 public jobs, 120 leisure, +15 native tourism; no education seats). Existing k206 is the separate London Natural History Museum landmark. Neither identity or model is replaced. New permanent k277 is a distinct 4×4 British regional natural-history museum. Use the current T495 public staffing, T491 leisure/commuting, physical power/water, public upkeep and native tourism authority exactly once; no second staffing, tourism, education or visitor engine. Museum outreach is represented by native cultural leisure, not invented school qualifications/seats. Forecourt garden, gate and bench modules are independently paid T502 walking paths; decorative lawns/ironwork do not add a second park/tourism reward.

Original coherent late-Victorian Romanesque massing: red-brick and pale-stone central hall/entrance with lower wings, repeated round arches, steep slate gables, deep porch and stair, glazed iron-ribbed hall roof, ammonite/nature ornament. Main building includes a small formal apron; optional paid adjoining paths provide iron gates/stone piers, lawns, benches and walking circulation. Four geometric views, physical night fixtures and opaque depth-resolved emission.

References: London NHM architectural language and top-lit galleries (https://www.nhm.ac.uk/discover/alfred-waterhouse-museum-building-cathedral-to-nature.html ; https://historicengland.org.uk/listing/the-list/list-entry/1080675); Oxford glass/iron daylight roof (https://www.oumnh.ox.ac.uk/learn-architecture); Tring red brick, stone details and raised porch steps (https://historicengland.org.uk/listing/the-list/list-entry/1078005). London is terracotta-faced, so this is an original regional interpretation, not a claimed red-brick replica. Formal forecourt reference: https://www.nhm.ac.uk/about-us/a-history-of-the-museum-grounds-and-wildlife-garden.html .

## Acceptance criteria recorded before implementation
1. New k277 permanent ID, paid 4×4 placement and retained root/ref footprint, ordinary nine-day construction; rank/cost/description/inspector consistent. Kill switch prevents new placement without erasing saved buildings.
2. All four actual camera views of the built museum and day/night are native screenshots, showing complete geometry and garden, no synthetic compositing. Construction days1/5/8 and day9 completion use normal daily simulation. Screen clipping, footprint alignment, opaque emission and foreground night occlusion are measured.
3. Physical road, allocated power and delivered water are required. Actually remove infrastructure and verify jobs/capacity/tourism stop, restore infrastructure and verify recovery. No test-fabricated staff, visitors or utility arrays. Public jobs, upkeep and tourism count once.
4. Paid path modules retain T502 walking cost, independent placement/removal/undo and optional metadata through native save/load. Actual museum save/load retains k277, size, orientation and refs; other save slots unchanged.
5. Confirm existing k35/k206 and prior British assets remain distinct and exact, all legacy sprite leaves/stats/seeded worlds compatible. Three smoke passes, fingerprint style/strict complete records, applicable prior suites. Protected release files and prior registries remain unchanged.
6. Art building cache is deterministic, rendering does not mutate world/storage/RNG, isolated-CI timing is reported honestly. New source has syntax/static checks. All CI stages tied to exact commit and real artifacts with sha256/dimensions/source hash. Transfer native PNGs through Library before requesting user approval.
7. No merge/deployment until the user approves this round's finished images. New code fixes must rerun affected full checks before that review.

## Construction record
Pending implementation. Runtime tests: not run. Screenshots: not produced. Unfinished: all acceptance checks await exact-head isolated CI and image review. No success claimed.
