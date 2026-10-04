# T717 — Three playable British buildings (original GPT-004)

Status: release acceptance written before bookkeeping. The owner approved the delivered PR #9 images and requested launch on 2026-10-04. Latest main was rechecked as `8b8ff01c1f157acf8baed0e1d4e305dabef049be` (v14.20 / T716); T717 and v14.21 are available.

## Scope

Release only the approved GPT-004 integration: k219 Victorian terrace, k220 Fox & Finch corner pub, k221 Edwardian public library. Preserve the complete pre-code acceptance, implementation decisions and failed-iteration record in [GPT-004](branch/GPT-004-british-building-integration.md). Rejected PR #7 is not part of this release.

The approved candidate is `95f7d430787173389646da22c3e37b0694beda91`. Its product/art and behavior must remain byte-identical except three version/anchor/first-frame metadata replacements. No redesign, new feature, save migration or production deletion is authorized by this release record.

## Acceptance before release bookkeeping

1. Set GAME_VER to14.21, GAME_ANCHOR toT717 and the matching first-frame label. Add the r164 release-log entry and this release card; retain the original GPT-004 card and evidence.
2. Promote only the three new approved building leaves, their bld aggregate and exact counts into fp.json from the validated R4 boot artifact. Preserve every existing leaf/family, block CRC and any environment records. Keep style.json untouched; do not use wholesale fingerprint write mode.
3. Keep the integration harness's original exactly-three-additions audit against the pinned pre-integration main fingerprint. Additionally require exact equality to the promoted release baseline. Change the ordinary release fingerprint gate to strict `node fp.js --check`, without a declared changed-family exception.
4. Run the complete integration/visual suite, normal smoke three times, strict fingerprint/style guard and both pinned legacy-city comparisons on the exact release candidate in isolated branch-only CI. Metadata-only similarity is not accepted instead of rerunning. Tests must not rewrite tracked source/baselines.
5. Recheck main, PR head and merge eligibility immediately before squash merging PR #9 with its expected head SHA. No force push, branch deletion or protection bypass. The owner has explicitly approved this PR's images and launch; do not merge any other PR.
6. Wait for the exact merged-commit main smoke and Pages deployment. Verify the published HTML hash/version/anchor, three catalog entries and gallery commit provenance before reporting launch complete.

## Evidence approved before bookkeeping

- [Full R4 run37180809675](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37180809675): SUCCESS;274 integration/pixel checks,498 gameplay assertions, smoke×3, legacy fingerprint/style and both old-city simulations.
- [PR9](https://github.com/lijiabao1998/GlimmerTown-lab/pull/9): source and final release-status record. Approved PNGs came from95f7d430; all178 source-artifact hashes independently verified.
- Product HTML SHA256 `de52f6354fd6924e0f81b0fd2cb15d300a312d21c117c61cfca21f254574a896`.
- New leaves: bld.219_1_0, bld.220_1_0, bld.221_1_0; zero changed/removed old leaves,152 other families unchanged,1728 block entries retain CRC5ef6eb67.
- Actual utility/save proof: all three new buildings and170 physically connected old neighbors served after normal load and one ordinary day; no power/water flags injected. A38-pub shortage used51.989 of actual52.65 dispatch and shed11 loads without creating energy.

## Release status and limits

The release candidate, merge SHA and deployment results are pending. PR #9 and its exact-SHA Actions runs are authoritative; this pre-merge card does not claim those pending stages passed.

Four camera views retain the existing fixed-elevation rule, not four newly authored facades. Construction uses generic scaffolding and winter uses existing soft roof layers. The large screenshot city contains some dense old roots beyond normal utility reach and is not a whole-city economy certification. Mobile/touch and owner-device performance remain unmeasured. Multi-district HV storage/control paths were source-reviewed, not separately runtime-certified. No production-site deletion or migration is involved.
