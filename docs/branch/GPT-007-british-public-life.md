# GPT-007 — Twelve British public-life buildings

Status: pre-implementation card. No new product code or runtime claim yet.
Base: `36632c0e98c3e9daf7a1fa7adfe03a866cb4fbb7` (T719 / v14.23), verified deployed on 2026-10-04.
Branch: `gpt/british-public-life`.

## Direction and catalogue audit before code

After approving all ten residential review images, the owner requested that round's merge and the next British-building wave. This separate round is twelve public-life forms: four municipal/safety buildings, four learning/parish buildings, four recreation buildings. It complements the completed residential and high-street streets rather than adding more near-identical houses or shops. This card must be pushed before implementation. Next image approval is required before any merge or deployment.

Existing overlap checked in current source: T717 library and pub; T718 H-plan sandstone board school, white Arts-and-Crafts surgery, baths, post office and timber village hall; T719 all sixteen homes; generic k42 municipal hall, k43 court, k6/30/61 fire facilities, k11/52 police, k32/108 education, k66 faith centre, k99 wedding chapel, k74 pavilion and k9 sports variants. The new art must not reuse those sprites. The existing k74 variants are Chinese double-eaved and pergola pavilions; the new bandstand is open cast iron with a shallow octagonal canopy. k99 includes a small New England wedding chapel and a stone wedding chapel; the new parish church has a broad flint nave, square battlemented tower, lower chancel and separate porch. No second generic market, library, baths, clinic, village hall or landmark replica.

IDs 262–273 are provisional permanent IDs verified unused in this base. Recheck main and the catalogue before the first product push. Preserve 219–221, 238–261 and all earlier IDs; rejected gap 222–237 remains unused. Do not import PR #7.

## Locked forms, materials and existing mechanics

Original procedural 2:1 Canvas art, fixed lv1/v0, nine-day construction; no image-generated sprites or photo tracing. Footprints and figures are game balances, not historic claims. Public staff, commute, budget, incident response, service/education/leisure capacities and coverage must use the existing authorities. No new government, religion, sport or justice simulation is introduced.

| ID / tool | Form and distinct geometry | Footprint | Existing role / base kind | Jobs | Capacity | Cost / rank | Power / water / upkeep |
|---|---|---|---|---|---|---|---|
| 262 historicTownHall | Cotswold civic hall: irregular stone range, projecting council chamber, small ogee belfry and low side pentice | 3×3 | civic services / 115; civic coverage | 12 | services 120 | 2600 / 5 | 3.2 / 2.4 / 7 |
| 263 magistratesCourt | Asymmetric redbrick Gothic court: tall courtroom cross-gable, lower waiting wing, raised public doorway | 3×3 | court / 43; court coverage | 12 | services 100 | 2200 / 5 | 3 / 2.2 / 6 |
| 264 boroughPolice | Compact redbrick police yard: two projecting gables, side public entrance, visible enclosed charge-yard wing | 2×2 | police / 11; police coverage and staffing | 12 | services 90 | 1600 / 4 | 2.5 / 2 / 5.5 |
| 265 edwardianFireStation | Appliance hall with two deep bays, crew rooms, tall side drill tower and open forecourt | 3×3 | fire / 30; fire2 coverage and staffed response | 14 | services 100 | 2200 / 5 | 3.4 / 3 / 7 |
| 266 technicalInstitute | Edwardian technical school: broad workshop windows, corner stair tower and lower practical-teaching wing | 3×3 | education / 32; university coverage | 16 | education 180 | 2800 / 6 | 3.8 / 2.8 / 7.5 |
| 267 grammarSchool | Redbrick grammar school: tall central hall and roof cupola, paired projecting gables, low connecting classrooms | 3×3 | education / 108; highsch coverage | 14 | education 180 | 2400 / 5 | 3.3 / 2.5 / 6 |
| 268 flintParishChurch | Flint-and-stone church: square battlemented tower, buttressed nave, lower tiled chancel and south porch | 3×3 | community/faith leisure / 66 | 6 | leisure 100 | 1800 / 4 | 2 / 1.4 / 4 |
| 269 nonconformistChapel | Brick gallery chapel: compact rectangular hall, broken central pediment, paired arched doors and tall round-headed windows | 2×2 | community/faith leisure / 66 | 5 | leisure 90 | 1000 / 3 | 1.7 / 1.2 / 3 |
| 270 cricketPavilion | Brick and half-timber club pavilion: raised long veranda, gabled viewing room, stair flights and stepped spectator terrace | 3×3 | sports leisure / 9; stadium coverage | 12 | leisure 140 | 1800 / 4 | 2.6 / 2.2 / 6 |
| 271 bowlsClub | Low timber bowls pavilion: three open segmental arcade bays, weatherboard rear, monopitch slate roof and green-edge seating | 2×2 | park leisure / 74; park coverage | 5 | leisure 75 | 950 / 3 | 1.3 / 1 / 2.5 |
| 272 ironBandstand | Open octagonal bandstand: raised stone plinth, slim iron columns, decorative brackets, shallow metal canopy and visible stage | 2×2 | park leisure / 74; park coverage | 4 | leisure 80 | 850 / 3 | 1.5 / 0.8 / 2.5 |
| 273 seasideConcertHall | Seaside assembly pavilion: substantial hall, low vaulted roof, domed entrance bay and lateral colonnaded promenade | 3×3 | theatre leisure / 36; theatre coverage | 12 | leisure 170 | 2800 / 6 | 3.8 / 3 / 7 |

Fire/police/education budgets follow the corresponding native budget. Other upkeep is fixed. The town hall provides truthful local civic services; it does not silently introduce the old k42 global tax multiplier. Cricket/bowls are leisure venues through existing capacity and trips, not new match simulations. The chapel is a community/faith venue, not a renamed wedding service. The concert hall is land-buildable and does not pretend to build a functioning pier or new coastline system.

## Architectural sources before drawing

Primary references supply material, plan and section distinctions only. New sprites are original compositions, not replicas of source photographs. Full-detail drawing and actual-city review must retain these differences.

- [Chipping Campden Town Hall](https://historicengland.org.uk/listing/the-list/list-entry/1078401): stone civic range, irregular openings, small belfry and shelter pentice.
- [Lambeth Magistrates' Court](https://historicengland.org.uk/listing/the-list/list-entry/1251239): redbrick Gothic court, irregular height and fenestration. Chosen instead of Devizes' columned classical facade to avoid the existing generic court silhouette.
- [Former police station 1480422](https://historicengland.org.uk/listing/the-list/list-entry/1480422): red brick, terracotta, projecting gables and rear court; [Rosslyn Hill 1130397](https://historicengland.org.uk/listing/the-list/list-entry/1130397) confirms the separation of public rooms, rear cells and yard.
- [Euston Fire Station](https://historicengland.org.uk/listing/the-list/list-entry/1342074) and [Brixton Fire Station](https://historicengland.org.uk/listing/the-list/list-entry/1251337): brick civic frontage, stone detailing, vehicle forecourt and crew accommodation. A functional drill tower is a separate original mass, not a copied residence.
- [Beaufoy Institute](https://historicengland.org.uk/listing/the-list/list-entry/1358193): early twentieth-century technical-school form and substantial teaching frontage.
- [Handsworth Grammar School](https://historicengland.org.uk/listing/the-list/list-entry/1493391): redbrick central hall, cupola, projecting gables and flanking classroom ranges, distinct from T718's sandstone H-plan primary school.
- [St Peter, Freston](https://historicengland.org.uk/listing/the-list/list-entry/1036973): flint walls, square tower, buttresses, separate porch and lower subsidiary volumes.
- [Conisbrough Wesleyan Chapel](https://historicengland.org.uk/listing/the-list/list-entry/1424608): compact brick gallery chapel with arched openings and a pedimented front.
- [Liverpool Cricket Pavilion](https://historicengland.org.uk/listing/the-list/list-entry/1485071): substantial viewing pavilion with veranda and stepped spectator terrace.
- [Lewes Bowling Green Pavilion](https://historicengland.org.uk/listing/the-list/list-entry/1043899): low timber arcade and monopitch roof; deliberately different from the taller cricket pavilion.
- [South Park Bandstand](https://historicengland.org.uk/listing/the-list/list-entry/1121246) and [Historic England bandstand overview](https://heritagecalling.com/2018/07/06/a-brief-introduction-to-bandstands/): open iron-frame public music structure.
- [Eastbourne Winter Garden](https://historicengland.org.uk/listing/the-list/list-entry/1270271): entertainment hall with substantial entrance volume and contrasting roof structure. Use the assembly-hall/entrance massing; do not duplicate T702 greenhouse plants or its palm-house silhouette.

## Acceptance before implementation

1. Twelve distinguishable forms in three coherent public-life streets/precincts, with normal road-facing entrances, readable massing and visible courts/forecourts/arcades. No palette swaps, isolated trophy grid, clipped towers, floating features or tiny underfilled lots.
2. Native public staffing, commute, maintenance, budgets and applicable service/education/leisure opportunities. Police and fire must join actual native response authorities as well as coverage; education must supply seats; no label-only role or under-construction services. Loss of road, power, water or building availability must shut down new capacities appropriately.
3. Complete footprint collision and root/reference placement; every-cell boundaries, terrain, transport and crater rejection; correct tree clearing, charges, refund, demolition, undo/redo, ordinary save/load and first-loaded-day operation. All permanent IDs and footprints remain exact.
4. Old-only worlds retain every simulation/tile/RNG checkpoint and approved sprite. New builders consume no simulation RNG, mutate no world/storage and register only one fixed canonical sprite each. A new bounded registry must not expand or relabel BRITISH004, HIGHSTREET005 or RESIDENTIAL006.
5. Day/night share true opaque surface visibility, correct 2:1 projection, materials, eaves and masonry. Four existing fixed-elevation camera rotations remain the documented policy. Test authored lighting, actual foreground occlusion, winter/rain and all existing construction stages; no forced power flags as gameplay evidence.
6. Preflight the actual loaded city first. Then exact-head least-privilege branch CI for full gameplay, four cameras/two zooms/day-night, weather, bounded sharded construction, partial occlusion, three smoke runs, strict declared twelve-leaf fingerprint delta/style and old-city compatibility. Reuse stable helpers without weakening load/utility/RNG invariants. Treat fixture corrections separately from product changes.
7. Preserve T719 release strings, fp.json, style.json, AUTORUN-LOG.md and owner decisions until this new round's image approval. Exactly twelve new leaves may be declared; no old-baseline rewrite, skipped failed guard or blanket all-green claim hiding the four known nested diagnostics.
8. Iterate on actual city pixels and independently review source/guards/pixels when a reviewer is available. Record build/draw timings without claiming device FPS. Deliver roughly six group day/night boards plus mixed-city and construction proof, at most ten PNGs, native attachments, no ZIP.
9. Update this card truthfully with failed attempts, corrections, exact CI SHAs and limits. Stop ready for this round's image confirmation; do not reuse T719 approval for this batch's publication.

## Environment and initial status

New persistent dot-cloud checkout on the current deployed base. Existing native browser/socket limits remain; no local game/browser runs or security bypass. Runtime checks use the authorized repository's isolated GitHub CI with read-only contents, no secrets or deployment job. No new credentials, force push, branch deletion or production-site migration. Source and test writes remain confined to this branch.

2026-10-04: current main and deployment verified, catalogue/source audit and primary-reference research completed. No implementation or runtime evidence exists for this round yet. Parallel-worker capacity is currently exhausted, so initial work is serial; independent review remains a release gate when capacity becomes available. Not completed: art, gameplay integration, all tests, image review and owner approval. These are not reported as passed.
