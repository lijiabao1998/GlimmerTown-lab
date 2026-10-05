# T720 — Twelve playable British public-life buildings (original GPT-007)

Status: release acceptance written before bookkeeping. At 2026-10-05 00:42:55 UTC the owner confirmed the ten delivered review PNGs and explicitly authorized creating this branch's PR, merging and verifying launch: 「沒問題，合併吧」. The preceding question named PR creation, merge and launch, and stated that the live site remained v14.23. Main was rechecked at 36632c0e98c3e9daf7a1fa7adfe03a866cb4fbb7 (T719 / v14.23); T720 and v14.24 are available. [PR #12](https://github.com/lijiabao1998/GlimmerTown-lab/pull/12) is a draft. Release-candidate checks, merge and deployment remain pending at this record's creation.

## Approved scope and immutable source

Release only GPT-007's twelve original procedural British public-life forms, IDs 262–273: historic town hall, magistrates' court, borough police station, Edwardian fire station, technical institute, grammar school, flint parish church, nonconformist chapel, cricket pavilion, bowls club, iron bandstand and seaside concert hall. These use existing municipal staffing, emergency response, education, faith and leisure authorities, ordinary utilities, placement, nine-day construction and saved identities. Retain all approved T717–T719 buildings, existing gameplay and old-neighbor invariants. Rejected gap 222–237 remains unused.

The [original process card](branch/GPT-007-british-public-life.md) retains its acceptance, references, R2 source and failed/revised fixture history. Approved exact head: 7f527c6d7ec5e2117e98db1541c2d89510b36b64. Approved HTML SHA256: 2b39152638bc85f0ddf0eba479fad9d6eadc808d58eb1bea00a697d466182068. Original R2 native art SHA256: a707f22485f0a449e19b77a3c397fc31bb2e4c4675a92910278cb2b03e9b855e.

## Acceptance before release bookkeeping

1. Change only GAME_VER to 14.24, GAME_ANCHOR to T720 and the matching first-frame label in product HTML. Normalizing those exact three strings back must restore every approved byte. Add this card and one bounded r167 log insertion, retaining all previous log bytes.
2. Promote only the twelve complete new canonical leaf records, bld aggregate and statistics from the verified approved-head boot artifact into fp.json, plus generatedAt/version/anchor. All 2795 old leaves, the other 152 families, environment records and 1728 superblocks remain exact. Keep style.json and owner decisions byte-identical. Never use fingerprint write mode.
3. Retain the twelve-additions audit against pinned main 36632c0e. Add strict equality of every complete boot leaf, family, statistic and block against the promoted baseline. Require plain node fp.js --check, without a changed-family exception.
4. Rerun all eleven exact-head integration jobs: ten new and twenty-five prior gameplay groups, 192 camera samples, 48 weather samples, 120 construction frames, three actual partial-occlusion proofs, three smoke passes, strict fingerprint/style checks and three old-city comparisons including seeded RNG-state equality. Preserve the actual saved/loaded native-staffing and retained-root checks. Tests must leave product source and baseline byte-identical. Temporary diagnostic observers must be restored.
5. Recheck latest main, PR head and merge eligibility. Only after all exact-candidate checks pass, mark PR #12 ready and squash merge with the expected head SHA. No force push, branch deletion, new secrets, protection changes or unrelated PR.
6. Wait for exact merged-commit main smoke and the existing Pages workflow. Verify public HTML/version/anchor and all deployed gallery files against the exact-main Pages artifact before reporting launch. Live-browser interaction is a separate claim and must not be inferred from byte equality.

## Approved pre-release evidence

[Full CI 37221431440](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37221431440) passed all eleven jobs at approved head 7f527c6. [Ordinary branch smoke 37221431463](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37221431463) also passed. The native loaded showcase had all thirty normally placed k127 homes, real utilities and construction age, police crew 3.59 >= 3 and fire crew 4.19 >= 4 after save/load; the following restored day retained readiness. The fixed 203-root old-neighbor cohort and 730 original roots remain intact. All thirty-five gameplay groups and three old-city baseline/candidate comparisons passed. The ten previously delivered native review PNGs were approved and will be reused without regeneration.

Verified regression artifact: [11310930953](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37221431440/artifacts/11310930953), archive SHA256 12e5fe937e3b4d91cf2ea165c2b9392064b7fd8f355991e843e0512f7acb91d7. Its declared-twelve boot fingerprint is pinned to approved head 7f527c6. Result: 2807 leaves, 153 families, 2797 day-nonempty, 1493 night-nonempty; bld 875 / CRC 97b2a95d; blocks 1728 / CRC 5ef6eb67. All 2795 old leaf records remain exact.

## Honest limits

Release-candidate checks and launch are not claimed here; PR #12 and its exact-SHA Actions runs are authoritative. Four unchanged nested legacy atlas diagnostics remain: industry:165_1_0, industry:166_1_0, industry:174_1_0 and version-anchor. Do not describe every nested audit as green. Four camera rotations preserve fixed authored elevations, not four newly drawn elevations. Dense foreground buildings can legitimately obscure rotated views. Construction and winter use existing overlays. Real-device/mobile FPS is unmeasured. Public-site deletion or migration is outside this release.
