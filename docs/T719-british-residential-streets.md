# T719 — Sixteen playable British residential street forms (original GPT-006)

Status: release acceptance written before bookkeeping. On 2026-10-04 the owner approved the ten delivered review PNGs and explicitly requested this branch's PR, merge, launch and a subsequent separate British-building round. Main was rechecked at 0072ac19b3c33f2dda98552d8b6c6bf447ba296c (T718 / v14.22); T719 and v14.23 are available. PR #11 has been created as a draft; release-candidate checks, merge and deployment remain pending at this record's creation.

## Approved scope and immutable source

Release only GPT-006's sixteen original procedural British residential forms, IDs 246–261: four Georgian terrace forms, four Victorian suburban forms, four English village forms and four industrial-town workers' housing forms. All have actual housing and ordinary utilities, placement, construction and saved identities; the corner shop has homes and existing commercial jobs. Nominal housing is 356 residents, including the corner shop's 16 residents plus 6 commercial jobs. Prior IDs 219–221 and 238–245 are unchanged; rejected gap 222–237 stays unused. No next-round art or behavior belongs in this release.

The [original process card](branch/GPT-006-british-residential-streets.md) retains pre-code acceptance, references, design decisions and failed/revised iterations. Approved exact head: 05fa1676360eccb57589825b75b46dafc6a283f5. Approved HTML SHA256: 6cc51577dde2f346a36e7e1cadea19d21a07d880fa3659e34f58bea4f65457d0. Original native art SHA256: d55748e8422ee331482e939a9a9f22287abe45ad9da935e072c1865a67c8d9f5.

## Acceptance before release bookkeeping

1. Change only GAME_VER to 14.23, GAME_ANCHOR to T719 and the matching first-frame label in product HTML. Normalizing those exact three strings back must restore every approved byte. Add this card and one bounded r166 log insertion, retaining all previous log bytes.
2. Promote only the sixteen complete new canonical leaf records, bld aggregate and statistics from the verified R4 boot artifact into fp.json, plus generatedAt/version/anchor. All 2779 old leaves, the other 152 families, environment records and 1728 superblocks remain exact. Keep style.json and owner decisions byte-identical. Never use fingerprint write mode.
3. Retain the sixteen-additions audit against pinned main 0072ac19. Add strict equality of every complete boot leaf, family, statistic and block against the promoted baseline. Require plain node fp.js --check, without a changed-family exception.
4. Rerun all twelve exact-head integration jobs: six new and nineteen prior gameplay groups, 256 camera samples, 64 weather samples, 160 construction frames, four partial-occlusion proofs, three smoke passes, strict fingerprint/style checks and three old-city comparisons including RNG-state equality. The tests must leave product source and baseline byte-identical. The existing CI-only RNG observation is temporary and restored in finally.
5. Recheck latest main, PR head and merge eligibility. Only after all exact-candidate checks pass, mark PR #11 ready and squash merge with the expected head SHA. No force push, branch deletion, new secrets, protection changes or unrelated PR.
6. Wait for exact merged-commit main smoke and Pages. Verify public HTML/version/anchor and all deployed gallery files against the exact-main Pages artifact before reporting launch. A live-browser interaction is a separate claim and must not be inferred from byte equality.

## Approved pre-release evidence

[Full CI 37202014826](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37202014826) passed all 12 jobs at approved head 05fa1676. [Ordinary branch smoke](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37202014841) also passed. Evidence includes 1792 scoped top-level checks; 2645 new gameplay assertions, 498 prior T717 and 1687 prior T718 assertions; 256 camera, 64 weather and 160 construction samples; four actual partial-occlusion proofs; exact old-only simulation, tile and seeded RNG-state comparisons in three cities at four checkpoints. All 1244 artifact byte counts and SHA256 hashes were independently verified. Ten review PNGs contain 70 actual rendered panels; 362 full-capture/crop pairs were verified.

R4 boot fingerprint artifact SHA256: 6b4e1ea3f43d03225afe5720e7bf5d136ad1b7f13d1787e59ed2415b840212c2. Result: 2795 leaves, 153 families, 2785 day-nonempty, 1481 night-nonempty; bld 863 / CRC e252fd66; blocks 1728 / CRC 5ef6eb67. All 2779 old leaves remain exact.

## Honest limits

Release-candidate tests and launch are not yet claimed here; [PR #11](https://github.com/lijiabao1998/GlimmerTown-lab/pull/11) and exact-SHA Actions runs are authoritative. Four unchanged nested legacy atlas diagnostics remain: industry:165_1_0, industry:166_1_0, industry:174_1_0 and version-anchor. Do not describe every nested audit as green. Four camera rotations preserve fixed authored elevations, not four newly drawn elevations. Dense foreground buildings may legitimately obscure rotated views. Construction and winter use existing overlays. Real-device/mobile FPS is unmeasured. Public-site deletion or migration is outside this release.
