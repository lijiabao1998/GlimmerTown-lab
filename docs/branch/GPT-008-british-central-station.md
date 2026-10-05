# GPT-008 — British central-station district, first stage

## Authorization and baseline

The owner explicitly requested the next implementation round at 2026-10-05 01:30:55 UTC: 「測試完了就開始做」. Scope: original British central station, integrated platforms/rails and cross-platform passage, separate station square, bus/taxi interchange, walking and cycling facilities, night and construction, transport/compatibility/pixel/performance evidence and native review images. Second-stage hotels, cafés, newsstands and commercial streets are excluded. No merge or deployment is authorized for this round; await image approval.

Verified latest main: ed49bab0b73bacfe8c7d6f6a8ca13491b01c9f5f, T720 / v14.24. Independent branch: gpt/british-central-station. Preserve all approved British buildings, source art, old-city behavior, release metadata, fp.json, style.json, AUTORUN-LOG.md and owner decisions. Runtime tests only in authorized isolated GitHub Actions, slot 3, port 8199. No credentials, protection changes, force pushes or deployment workflow changes.

## Existing-system audit before implementation

- Existing stations: k17 small railway, k55 3×3 central, k139 5×5 railway/high-speed hub; their T612 art and existing variants remain exact. Existing k207 St Pancras is a landmark reference, not a substitute for a working transport hub.
- T463/T468/T491 already own railway lines, physical rail paths, fleets, transfers, OD assignment, demand, ridership and mobility. T501 owns timetables, depots, reliability and platform/concourse/exit capacity. T502 owns real walking/cycling paths, bike parking, station entrances and transfer links. Reuse these authorities instead of adding a second transportation simulation.
- Native multi-tile railway station frontage currently looks only around the root tile. T612 explicitly disclosed that painted station tracks need not connect to external rail tiles. The new station must use physical, persisted rail cells and explicit matching entry/exit portals, restricted to this new form; old stations keep their behavior.
- Buses already have placed stops, paid fleets and real routes. Existing road vehicles include taxis, but there is no separate taxi booking/dispatch/ridership authority. The taxi curb therefore uses existing roadside stopping/parking and walking access; taxi imagery must not be presented as quantified taxi transport.
- T502 facilities use the existing optional am502/amx502 representation. Theme metadata can remain inside that representation; do not change RLE or save schema. Independently placeable square/entrance/bike/transfer facilities retain native capacities and operating conditions.

## First-stage implementation design

Use a 5×5 original red-brick booking hall and clock tower beside a high glass-and-iron train shed. Two actual track corridors align with tile centers, platforms and an elevated passenger passage form part of the station. Show booking counters through an open hall, separate platform entrances, stairs, clocks, wayfinding, platform edge lines, luggage/benches and lit physical fixtures. Both world track orientations and all four camera rotations must show coherent geometry.

Prefer new, explicitly selected k139 variants using the existing large-station authority, without replacing any existing sprite or adding a duplicate transport facility type. Owned internal rail cells belong to the new station and connect only at painted portals; construction must not enable trains before completion. Removal, undo and save/load must preserve ownership and external rails. If a source constraint prevents this approach, write the concrete revision and reason before implementing it.

Station-square paving, formal entrance, bus shelter/crossing, taxi curb, covered bicycle parking, bike access and walking transfer are separate native-backed modules. They can be arranged along different street layouts. Do not hide disconnected facilities or invent transport effects. Native roadside/active-mobility components remain separately editable. The taxi module's missing dedicated dispatch simulation stays visible in the review evidence and functional description.

Reference: [Network Rail, St Pancras history](https://www.networkrail.co.uk/who-we-are/our-history/iconic-infrastructure/the-history-of-london-st-pancras-international-station/). Read-only research confirms the distinct booking/frontage and iron/glass train-shed structures and spacious platform arrangement. Use architectural principles for an original station; no hotel or copied image belongs in this first stage.

## Acceptance written before code

1. Exact protected T720 bytes and all old sprite leaf records remain unchanged. Declare every new sprite key/family before fingerprint verification; permit additions only, no baseline rewrite. Maintain all prior British selftests and gameplay evidence.
2. Normal paid placement, unlock/rejection, whole footprint/tree/terrain checks, inspector footprint and two orientations. Genuine power/water/roads and nine actual construction days; no forced service/staff flags, speed-completion or fixture-only operational claims.
3. Actual persisted rail cells match visible tracks and ports. An ordinary line with at least two real stations and paid fleet/depot must have physical path, service and nonzero riders/entries from native demand. Break a connecting rail and demonstrate loss; repair and demonstrate recovery. Wrong-side tracks must not silently serve the station. No new duplicate OD or capacity authority.
4. Independent module placement, native bus routes, actual walking transfer and station exit/catchment capacity, bicycle parking/network effects, roadside parking behavior and honest taxi limits. Remove/disconnect facilities and observe native counterfactuals; disconnected decorations cannot pass as transport.
5. Save/load the actual serviced station district, all new identities/variants/rail ownership/module themes/route settings and the following normal simulation day. Preserve other slots and retained old roots. Compare several old-only cities against pinned main, including tiles, stats, seeded RNG and existing transport.
6. Day/night native captures at four camera rotations and useful zooms; coherent world track directions, no floating overlap, clipping, footprint leakage or lights without physical fixtures. Actual partial occlusion with independently placed old buildings. Separate native night compositor and power-loss checks.
7. Actual construction milestones and the exact completion boundary, including native nighttime work lights and geometry. Stable canonical sprite references; deterministic art generation without Math.random, world/storage/RNG mutation or renderer-time rebuilding. Bound boot/rebuild time, frame cost and dense transport/camera performance using CI measurements.
8. Three smoke passes, strict declared-additions fingerprint/style audit and full exact-head CI. Every capture and metadata file carries the checked SHA. Independently verify downloaded artifact size/digest and PNG provenance. Deliver a compact set of native review PNGs using supported Library delivery; report transfer failures promptly instead of repeated generation.

## Implementation record

| Work | Tests | Review images | Unfinished / limits |
|---|---|---|---|
| Baseline and native transport audit; design and acceptance written before code | Runtime not yet run for GPT-008 | Not generated | Taxi has no dedicated dispatch/ridership simulation; transport integration, artwork and all acceptance measurements pending. Existing four nested atlas diagnostics remain disclosed, and mobile-device/FPS certification is not claimed. |
