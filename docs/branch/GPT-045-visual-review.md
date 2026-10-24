# Wave 17 native visual audit: C1, with C2 changed-image review

Read-only review on 2026-10-24. No product files, tests, image pixels, or source artifacts were edited or regenerated. ZIP bytes were independently hash-verified before this visual review.

## Result

No new blocking visible building-shape defect was found in the reviewed captures. All ten authored designs are distinguishable in the near views and contact sheets. This is a scoped visual finding, not user approval, full release acceptance, phone/Safari validation, or a claim about unseen geometry or animation frames.

Actually opened with `view_image`: 148 C1 PNGs plus the nine C2 PNGs that differ from their C1 counterparts. This includes every one of the 57 C1 scene captures, 40 edge captures, 16 legacy-pair images, and 19 construction-readiness images; the exact inventory follows. The three pre-existing contact sheets were viewed with the viewer's default scaling. All remaining opened images requested original resolution. No crops, replacement renders, edited sheets, or generated images were used.

## Building findings

- Knapwell: two unequal triangular roof masses are evident. The diagonal opening exposes a pale ground strip particularly clearly in r1/r3, including both edge captures. In r0/r2 the diagonal is nearly edge-on and is not comparably legible; that projection is not evidence that the opening was capped. The low end link does not visually merge the two roof masses into one roof.
- Cloudmere: the decagonal low body, faceted dome and a bounded pale oculus center remain consistent in all four edge views. At this small raster size, the image demonstrates the ring/recess cue but cannot independently prove the full shaft depth. Separately, source inspection of `british-wave17-art045.js`, lines 478-502, establishes annular roof quads, an annular upstand/reveal and interior walls down to z=.6, with no central cap polygon. Geometry support and visible pixels are distinct evidence; no invented backside view is claimed.
- Osier: the trough profile remains concave and the brick end/side walls visibly meet its underside in near and edge views. No visible floating-canopy slit appears. The lighter roof half is a coherent material/shading face, not a missing polygon. Source lines 449-475 explicitly close the shaped ends and provide grounded long walls.
- Velvet: the roof has a flared lower edge, changing slopes and a small truncated top, rather than detached stacked hats. The near and four edge images show continuous joins at the available resolution. The precise mathematical inflection is supported separately by the successive source profiles and soffit join at lines 536-549, not by claiming every curve pixel resolves in the overview.
- Broom: three unequal, touching hipped ranges and two entrance returns are readable, strongest in r0/r1. Roof intersections remain attached; no detached bridge, courtyard finger gap, or window visibly floating beyond the roof was found. Source lines 552-568 defines contiguous ranges and complete hips.
- Adderlens, Yarrow, Elder, Coppice and Shellwick: lens, unequal-pitch clerestory rectangle, high-center/low-aisle hall, single sloped wedge and D-plan half-hip silhouettes respectively remain recognizable across the four rotations. Night glazing stays associated with their facades in the reviewed views.

## Scene, edge, and LOD findings

- All 40 season/day-night/rotation originals were viewed. All ten buildings remain present in the normal views, with seasonal foliage, bare winter and roof-snow states visibly distinct. Snow softens roof detail; night lighting and vertical light columns also reduce fine shape legibility. These are observed effects, not a claim that the light-column aesthetic has user approval.
- All 40 edge images were viewed. The buildings remain on their lots at the exposed world boundaries, with no gross sprite cropping, water overwriting the body, or detached roof visible. Ordinary scene framing can crop buildings at the image boundary in the separate preview-native images; this is not mistaken for a missing model.
- `far-day.png` and `far-night.png` (manifest z=.45) show flat lot markers, with small bright marks at night, rather than ten architectural silhouettes. They establish the captured far-LOD state only and must not be cited as detailed-design visibility at that LOD.
- The hover image visibly ghosts Yarrow and an overlapping neighbor while outlining a tile. Rain-night preserves the bodies with reduced contrast. The eight base/valve legacy pairs were opened; no gross visual difference was found by eye. Exact pixel equality remains a separate test claim, not an inference from eyeballing.

## Construction and readiness distinctions

The original early capture shows ten flat construction pads. The original middle capture shows three developed sites and seven still-flat pads; it is not an all-ten ready frame. The original late capture visibly shows all ten buildings with scaffolding/cranes.

Both readiness routes' cold first/second captures still show flat pads; the explicit-flush-before-render capture is also not a rendered all-ten endpoint. Their fixed native endpoints and day/night repeated/restored captures show all ten scaffolded bodies. The natural-route manifest records ten ready sites by observation 9 in C1 and observation 10 in C2, within the declared 12-observation window. The explicit-flush route is separately labelled a cache-flush fixture. Age 7 is a declared fixture, not seven days of natural progression. None of this proves an immediate cold-start render, a renderer/performance fix, or mobile behavior.

## C2 differences actually reviewed

All nine changed PNGs were opened, not merely inferred from hashes. The C2 construction captures retain all ten scaffolded bodies. Visible changes include crane mast/jib states, small moving scene details, and endpoint illumination/background variation; there is no visually apparent missing body or broken building silhouette. Endpoints are not byte-identical and should not be described as such. Numeric unmasked RGBA comparisons found 32,092 changed pixels in the natural endpoint, 467,548 in the explicit endpoint, 8,954 in each explicit day repeat/restored image, and 8,859 in each explicit night repeat/restored image. These counts alone do not attribute causes or certify every differing pixel as benign.

The changed edge-Knapwell-r0 image has 104 changed pixels in eight small regularly spaced patches (overall bbox x544..739, y376..451); some patches overlap the wall projection. The roof/body silhouette and ground opening projection are visually unchanged. No specific animation cause is asserted from this still image alone.

## Limits

The remaining 75 individual preview sprite PNGs were not separately opened: their 80 day/night views were inspected as embedded panels of the two original contact sheets, with five focused day sprites separately opened. The comparison sheet's old/new examples are likewise sheet-level evidence. All C2 images that are byte-identical to C1 were not redundantly reopened; cross-run equality was supplied by the coordinator, with the differing scene/construction filenames independently checked here. No live interactive browser, real phone, Safari, continuous animation, performance run, or direct user acceptance was observed. Source inspection did not rerun geometry mutation tests.

## Exact files opened

Paths below are relative to `lab-wave17-evidence/`. Each listed basename was actually loaded through `view_image`; no implied wildcards.

### c1-12574001393/files (16)

- `contact-day.png`, `contact-night.png`, `contact-comparison.png`, `knapmediation-r1-day.png`
- `cloudmereweather-r0-day.png`, `osieroral-r1-day.png`, `velvetcostume-r0-day.png`, `broomtranslations-r0-day.png`
- `native-day-r0.png`, `native-day-r1.png`, `native-day-r2.png`, `native-day-r3.png`
- `native-night-r0.png`, `native-night-r1.png`, `native-night-r2.png`, `native-night-r3.png`

### c1-12574666086/files (113)

- `autumn-day-r0.png`, `autumn-day-r1.png`, `autumn-day-r2.png`, `autumn-day-r3.png`
- `autumn-night-r0.png`, `autumn-night-r1.png`, `autumn-night-r2.png`, `autumn-night-r3.png`
- `base-legacy-day-r0.png`, `base-legacy-day-r1.png`, `base-legacy-day-r2.png`, `base-legacy-day-r3.png`
- `base-legacy-night-r0.png`, `base-legacy-night-r1.png`, `base-legacy-night-r2.png`, `base-legacy-night-r3.png`
- `construction-early.png`, `construction-late.png`, `construction-middle.png`, `edge-adderlens-r0.png`
- `edge-adderlens-r1.png`, `edge-adderlens-r2.png`, `edge-adderlens-r3.png`, `edge-broomtranslations-r0.png`
- `edge-broomtranslations-r1.png`, `edge-broomtranslations-r2.png`, `edge-broomtranslations-r3.png`, `edge-cloudmereweather-r0.png`
- `edge-cloudmereweather-r1.png`, `edge-cloudmereweather-r2.png`, `edge-cloudmereweather-r3.png`, `edge-coppicelecture-r0.png`
- `edge-coppicelecture-r1.png`, `edge-coppicelecture-r2.png`, `edge-coppicelecture-r3.png`, `edge-elderdebate-r0.png`
- `edge-elderdebate-r1.png`, `edge-elderdebate-r2.png`, `edge-elderdebate-r3.png`, `edge-knapmediation-r0.png`
- `edge-knapmediation-r1.png`, `edge-knapmediation-r2.png`, `edge-knapmediation-r3.png`, `edge-osieroral-r0.png`
- `edge-osieroral-r1.png`, `edge-osieroral-r2.png`, `edge-osieroral-r3.png`, `edge-shellwickpetitions-r0.png`
- `edge-shellwickpetitions-r1.png`, `edge-shellwickpetitions-r2.png`, `edge-shellwickpetitions-r3.png`, `edge-velvetcostume-r0.png`
- `edge-velvetcostume-r1.png`, `edge-velvetcostume-r2.png`, `edge-velvetcostume-r3.png`, `edge-yarrowbraille-r0.png`
- `edge-yarrowbraille-r1.png`, `edge-yarrowbraille-r2.png`, `edge-yarrowbraille-r3.png`, `far-day.png`
- `far-night.png`, `hover-yarrowbraille.png`, `near-adderlens.png`, `near-broomtranslations.png`
- `near-cloudmereweather.png`, `near-coppicelecture.png`, `near-elderdebate.png`, `near-knapmediation.png`
- `near-osieroral.png`, `near-shellwickpetitions.png`, `near-velvetcostume.png`, `near-yarrowbraille.png`
- `rain-night.png`, `spring-day-r0.png`, `spring-day-r1.png`, `spring-day-r2.png`
- `spring-day-r3.png`, `spring-night-r0.png`, `spring-night-r1.png`, `spring-night-r2.png`
- `spring-night-r3.png`, `summer-day-r0.png`, `summer-day-r1.png`, `summer-day-r2.png`
- `summer-day-r3.png`, `summer-night-r0.png`, `summer-night-r1.png`, `summer-night-r2.png`
- `summer-night-r3.png`, `valve-legacy-day-r0.png`, `valve-legacy-day-r1.png`, `valve-legacy-day-r2.png`
- `valve-legacy-day-r3.png`, `valve-legacy-night-r0.png`, `valve-legacy-night-r1.png`, `valve-legacy-night-r2.png`
- `valve-legacy-night-r3.png`, `winter-bare-day-r0.png`, `winter-bare-day-r1.png`, `winter-bare-day-r2.png`
- `winter-bare-day-r3.png`, `winter-bare-night-r0.png`, `winter-bare-night-r1.png`, `winter-bare-night-r2.png`
- `winter-bare-night-r3.png`, `winter-snow-day-r0.png`, `winter-snow-day-r1.png`, `winter-snow-day-r2.png`
- `winter-snow-day-r3.png`, `winter-snow-night-r0.png`, `winter-snow-night-r1.png`, `winter-snow-night-r2.png`
- `winter-snow-night-r3.png`

### c1-12574970256/files (19)

- `explicit-flush-after-explicit-flush-before-render.png`, `explicit-flush-cold-first-draw.png`, `explicit-flush-cold-second-draw.png`, `explicit-flush-day-pixel-negative-restored.png`
- `explicit-flush-day-repeat-a.png`, `explicit-flush-day-repeat-b.png`, `explicit-flush-fixed-native-endpoint.png`, `explicit-flush-night-pixel-negative-restored.png`
- `explicit-flush-night-repeat-a.png`, `explicit-flush-night-repeat-b.png`, `natural-cold-first-draw.png`, `natural-cold-second-draw.png`
- `natural-day-pixel-negative-restored.png`, `natural-day-repeat-a.png`, `natural-day-repeat-b.png`, `natural-fixed-native-endpoint.png`
- `natural-night-pixel-negative-restored.png`, `natural-night-repeat-a.png`, `natural-night-repeat-b.png`

### c2-12574731304/files (1)

- `edge-knapmediation-r0.png`

### c2-12574002540/files (8)

- `natural-fixed-native-endpoint.png`, `explicit-flush-fixed-native-endpoint.png`, `explicit-flush-day-repeat-a.png`, `explicit-flush-day-repeat-b.png`
- `explicit-flush-day-pixel-negative-restored.png`, `explicit-flush-night-repeat-a.png`, `explicit-flush-night-repeat-b.png`, `explicit-flush-night-pixel-negative-restored.png`
