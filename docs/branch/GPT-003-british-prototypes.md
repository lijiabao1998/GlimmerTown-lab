# GPT-003 — British architectural prototypes, first selection round

Status: R2 complete as three art candidates for owner selection. Acceptance was committed before implementation. Prototype only; no merge or deployment.
Base: main `9be7bc069a9f3dcb5bd71787dc4ab8e672b4f7d1` (verified 2026-10-03).
Product `index.html`: 9,627,011 bytes; SHA256 `5c60ef1809599419b9e456a136da2b6e9e499b6069d4b5d10f8e7b222932585a`.
User request: 按照 Claude 的標準做一輪英式建築. Samples first; owner selects before any integration.

## Scope and provisional IDs

- UKP01: 2×2 Victorian brick terrace. Connected domestic massing, repeated bay/door rhythm, slate roof and party-wall chimney stacks, modest front boundary. Residential scale.
- UKP02: 2×2 corner public house. Two street-facing elevations, working corner entrance, deep painted timber/glazed ground floor, brick upper rooms, articulated roof and chimneys. Distinct from a terrace with a sign pasted on.
- UKP03: 3×3 municipal library/reading hall. Public entrance, long reading-room volume with purposeful daylight openings, subsidiary wing/service entry and civic forecourt. No generic tower or column-ring stand-in.

All three use native Canvas-generated hard pixels and true 2:1 ground-plane projection. No permanent numeric building IDs. No new normal catalog entries. Test-only renderer is loaded after normal boot; harness temporarily substitutes matching-footprint sprites for actual city rendering then restores them.

## Method

Follow the concrete lessons of T702 (complete form, correct two-face isometry, shared geometry for day/night, iterate rendered pixels), T711 (inspect inside actual city rather than floating sprite), T699 (controlled A/B and no incidental changes). Architectural references, used for form rather than copied images:
- Historic England, Church Terrace: https://historicengland.org.uk/listing/the-list/list-entry/1235883 — joined two-storey domestic massing.
- Historic England, Blenheim Terrace: https://historicengland.org.uk/listing/the-list/list-entry/1255663 — terrace facade and roof/chimney rhythm.
- Historic England, The George (1897): https://historicengland.org.uk/listing/the-list/list-entry/1395110 — pub hierarchy and street-facing ground floor.
- Historic England, The Cricketers: https://historicengland.org.uk/listing/the-list/list-entry/1132544 — canted corner entry.
- Historic England, Knutsford Carnegie Library (1904): https://historicengland.org.uk/listing/the-list/list-entry/1388310 — broad reading-room volume, gable and subsidiary entry wing.
These are original compressed pixel interpretations, not exact replicas of the listed buildings. Existing product colors, global shadows/night look, simulation RNG, save format and normal catalog stay unchanged. Prototype generation is deterministic and opt-in.

## Acceptance before construction

1. Product HTML remains byte-identical to baseline. GAME_VER/GAME_ANCHOR, AUTORUN-LOG.md, fp.json and DECISIONS.md remain unchanged. No changes to main or rejected PR7.
2. Exactly three identifiable forms. At z1.2 and z2 in the real city each remains readable against existing neighboring buildings, with plausible street connection, grounded footprint and coherent scale. Pixel approval is a human/design judgment separate from test status.
3. Sprite dimensions/anchors: UKP01/02 136×150 (68,148), UKP03 208×220 (104,218). Solid pixels avoid canvas edges and projected ground footprint. No detached under-ground pixels. Cast shadow stays on plot; no large opaque rectangle.
4. Night pixels occur only on visible day surfaces; windows and actual fixtures light, not entire walls/roofs. Night city shots must demonstrate actual game lighting path and no light leaking through nearer surfaces.
5. Test harness verifies deterministic rebuilds, existing sprite identities restored, no unexpected storage writes during prototype build, real draw inclusion, isolated slot 3 and clean console. Existing full fingerprint check remains unchanged.
6. Remote GitHub Actions: smoke ×3, `node fp.js --check`, dedicated geometry/night/render guard. Never call an unrun test passed. Local game tests are not run by GPT per repository instructions.
7. Deliver direct sprites, city day/night samples at two practical zooms, a combined context view and an honest iteration log. Record CI URLs/SHAs, boot cost, prototype build time/bytes, failed drafts and known limitations. Original image ZIP parts ≤10 MB.

## Test isolation and rollback

Renderer only exists in separate prototype JS, not index.html. Opt-in harness owns temporary overrides and uses `window.__noBritishPrototypes003` as escape valve. CI workflow restricted to `gpt/british-prototypes` with contents: read and no deployment, no secrets/new credentials. Existing Pages workflow only listens to main smoke; branch runs do not deploy. No deletion/migration of any production site is involved.

## Construction record

- Entry: main rechecked; clean isolated checkout; HTML digest measured. Read AGENTS, AUTORUN, CLAUDE, DECISIONS, T702/T711/T699 and STYLE-THEOTOWN.
- R1 implementation: paired day/night pixel z-buffer, no renderer call into game or Math.random. Exactly 3 provisional string IDs, two joined terrace homes, two-storey hipped corner pub, broad library.
- R1 commit `8f7414393db32a043a3de6d0c68643eda0c56f83`; CI https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37149548968 . Renderer 33.7 ms first build / 11 ms repeat on that runner. 15 real city views captured (12 requested target views, 2 town views, 1 extra night-occlusion scene). 92 checks; one failed final-storage check, described below. All geometry, deterministic rebuild, escape valve, pure generation, sprite restore, direct night support and actual scene checks passed. Smoke ×3 and strict fp.js --check passed, unchanged product checksum passed. Separate default smoke also green: https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37149548916 . Overall prototype workflow is correctly RED until the final-storage issue is fixed.
- R1 storage failure: unchanged game has a 25-second autosave interval even while simulation is paused. The disposable slot-3 fixture gained `s3_bak`; pure renderer generation left storage unchanged. R2 will report per-key change hashes and restore only that fresh fixture's slot-3 primary/backup to their baseline, preserving strict whole-storage equality and failing unrelated changes. No user save is read or written.
- R1 direct sprites: solid pixels 7296/8009/13430; night pixels 210/645/754; canvas-edge pixels 0/0/0; unsupported night pixels 0/0/0; projected-lot leakage 0/0/0. The dedicated foreground-pub scene hid 1320 library light pixels and left 1696 visible, through the real depth compositor.
- R1 independent visual review of all z1.2/z2 day/night scenes: genuine two-face massing and scale read; two-house terrace and low corner pub retained. Found visibly noisy slate texture; library door/fanlight merged into an over-tall opening; intended gable roundel hidden by its plane. R2 reduces roof texture contrast into coherent slate courses, separates shorter library doors and fanlight, and aligns roundel with gable surface.
- R1 context-only problems traced to carrier semantics: k41 is D (education), so draw at index.html:74263 multiplies deep-night windows by 0.22; civic glow at 71388–71412 adds blue nodes for A/S/H/D independently of the new art. R2 switches only temporary carriers to k63/F (2×2 terrace), k91/C (2×2 pub), k47/G (3×3 library), checks exclusions against pinned source and runtime metadata, and retains global night layers. It does not brighten assets or disable city-wide effects. The same actual depth/night compositor and scene remain. These are not excused by green pixel geometry guards.
- R2 tested implementation SHA `0888d0b867a0381fcc2d4782e6154954be76745f`; full CI https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37150185803 **SUCCESS**; default smoke https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37150185715 **SUCCESS**.
- R2 prototype guard **96/96**, console errors 0. Smoke ×3 **38.0/38.8/39.2 seconds**, all green. Strict fingerprint: 153 families / 2768 leaves, added/changed/removed 0; 1728 block entries CRC `5ef6eb67` unchanged; style ratchet unchanged. Baseline files and product digest unchanged.
- R2 direct night pixels 210/645/773; unsupported night-alpha 0 each; canvas-edge and projected-lot overflow 0 each. Actual library occlusion scene: 3092 candidate light pixels, 1396 hidden by foreground, 1696 visible. Fixture retains 878 original building roots; only 77 tiles changed for controlled sample placement.
- R2 build time **37.6 ms**, deterministic repeat **12.5 ms** on CI. Normal product does not load this renderer, so no new default boot work. Prototype source 26,895 bytes; harness 32,042 bytes; workflow 3,754 bytes. Direct day+night RGBA buffers total 692,480 bytes; this is nominal pixel storage, not measured browser peak memory. Product index remains 9,627,011 bytes.
- Final independent visual review inspected all 12 target views, both town views and night occlusion. Roof texture, entrance, roundel, actual terrace lighting and removal of spurious blue civic lights pass. Approved for presentation as three candidate designs, not gameplay integration.
- Deliverables preserve unaltered pixels: three day/night sheets with z2 and z1.2, a same-city full context pair, and independent original-image ZIP parts each below 10 MB. Original Chromium/canvas/direct-layer images and per-file provenance are retained.

## Unfinished / known limits

These are visual proposals, not completed gameplay integration, construction animation or permanent catalog additions. Fixed rotation 0, day 1 and clear weather; four-rotation/season/rain/snow/mobile/user-hardware behavior is not verified. The simulation RNG is private; no direct stream-state hook was added, so evidence is zero Math.random calls plus unchanged accessible world/save/sprite state during pure generation, not a complete RNG proof. During extended capture the existing 25-second autosave writes only the fresh test profile; exact slot-3 primary/backup bytes are restored and all unrelated storage keys are checked. Timings are one GitHub runner, not a device-performance guarantee. Existing main boot remains heavy (34.8-second harness bake/ready observation); no attempt to fix that or unrelated sprites was made. Owner selection is pending. No PR, main write, merge, deployment or production-site change was made.

## T716 merge preparation — 2026-10-04

The owner approved merging these three delivered prototypes. [T716](../T716-british-prototypes-archive.md) is the release card; this original pre-implementation acceptance and iteration history is retained. Version metadata is v14.20 / T716; exactly three HTML metadata strings change, with the normal renderer/catalog unchanged. The release HTML SHA256 is `bf306be0057ca4516944a5bf5ccf4765369bf7d2c52b243dfb2a3331b48ad26e` (still 9,627,011 bytes). The prototype harness/workflow now pin that release digest; the exact candidate must pass the same 96 prototype guards, smoke ×3 and strict fingerprint check before merge. PR/Actions are the authoritative live release-status record. All earlier no-merge/pending statements above describe the original prototype delivery, before this approval. The buildings remain opt-in prototypes outside the normal build menu.

## Release-candidate CI correction

Candidate c30ca0dad0c3e043632016a3505b883fddc6d12a failed one prototype guard in [run 37172698696](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37172698696): 95/96 passed; world and sprite fingerprints were unchanged, but existing autosave wrote the disposable slot-3 save between separate CDP calls. Final key audit found only s3/s3_bak and exact cleanup passed. Both ordinary smoke runs passed. This was not accepted as a green candidate.

The harness now snapshots storage immediately before synchronous renderer evaluation and generation, and compares immediately afterward in the same JavaScript turn. It retains the full-session unexpected-key audit, original fixture storage baseline, provisional-ID check and exact final restoration. No assertion was removed or ignored, and the product/art renderer was not changed. Full CI must pass again on the corrected exact candidate before merge.
