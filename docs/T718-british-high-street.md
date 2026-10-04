# T718 — Eight playable British high-street buildings (original GPT-005)

Status: release acceptance written before bookkeeping. On 2026-10-04 the owner approved all eight delivered images and explicitly requested merge of PR #10 and deployment verification. Latest main rechecked as f6d626c04c2979e8b2855f0f4a9e9ab1eef35654 (v14.21 / T717); T718 and v14.22 are available.

## Scope

Release only the approved GPT-005 integration: k238 co-operative stores, k239 stone bakehouse, k240 covered market, k241 board school, k242 cottage surgery, k243 high-street post office, k244 municipal baths and k245 village hall. The original [GPT-005 card](branch/GPT-005-british-high-street.md) retains pre-code acceptance, references, balance and all failed/revised iterations. IDs219–221 and the reserved222–237 gap remain unchanged. Rejected PR #7 is not included.

Approved candidate: 5f91c338aad4ae43224cd9d20855a7f5b1c68783. Product source must remain byte-identical after normalizing exactly three version/anchor/first-frame replacements back to14.21/T717. Approved HTML SHA256: eb6ff6eedabd78c117215d61a5c9f80dbd26ee29eefe7603d7a5fdb73c4a73bf. Native art SHA256: 66bec7f6d6ceca1efa860357e662217993bfdf8995e86530d457815479685832.

## Acceptance before release bookkeeping

1. Set GAME_VER14.22, GAME_ANCHORT718 and the matching first-frame label; add r165 release log and this card. Preserve all prior log content.
2. Promote only the eight declared full leaf records, bld aggregate and statistics from the independently verified R4 boot artifact into fp.json, plus generatedAt/version/anchor. All2771 old leaves,152 other families,environment records and1728 superblocks remain exact. Keep style.json byte-identical. Never use fingerprint write mode.
3. Retain the original eight-additions audit against pinned main f6d626c04. Add exact complete boot equality against the promoted release baseline. Require plain node fp.js --check, with no changed-family exception.
4. Rerun all six integration shards, all10 new and9 prior gameplay groups,128 camera samples,32 weather samples,80 construction frames,3 occlusion scenes,three smoke runs,strict fingerprints/style and two old-city simulations on the exact release candidate in isolated least-privilege branch CI. Approved canonical pixels must remain exact; no source or baseline rewrites by tests.
5. Recheck latest main, PR head and merge eligibility. Mark PR #10 ready only after its exact candidate passes; squash merge with expected head SHA. No force push, branch deletion, protection bypass, new secrets or unrelated PR.
6. Wait for exact merged-commit main smoke and Pages deployment. Verify published HTML hash/version/anchor, eight catalog entries and actual runtime/menu image provenance before reporting launch complete.

## Approved pre-release evidence

[Full R4 CI](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37193328431), [branch smoke](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37193328433) and [PR smoke](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37193465141) all succeeded at approved5f91c338. There are779 scoped evidence checks,1687 new gameplay assertions,498 prior gameplay assertions and100 new/26 prior resident smoke facts. All530 artifacts were independently hash-verified; the eight final review PNGs contain102 verified panels, with zero placeholders.

R4 boot fingerprint:2779 leaves,153 families,2769 day-nonempty,1465 night-nonempty; bld847/CRC7c6e911a; blocks1728/CRC5ef6eb67. All2771 old leaves are exact. Boot artifact SHA25667d8f9fdb7901a0f4f17ec32347324a5d48e9d3f3c1d824a22b5aa1609993405.

## Honest limits and pending release

Release-candidate tests, merge and deployment are pending at card creation; this card does not claim those stages have passed. PR #10 and its exact-SHA Actions runs remain authoritative.

The scoped acceptance passes, while the seeded fixture's nested legacy audit still reports four unchanged diagnostics: industry165_1_0,166_1_0,174_1_0 and version-anchor. Do not describe every nested legacy diagnostic as green. Four camera views retain fixed authored elevations. Construction and winter use existing overlays.289 physically connected old neighbors were served after genuine save/load and an ordinary day;11 disconnected background roots are not claimed served. Bakery/market use the existing commerce economy, not a new bread production chain. Actual-device/mobile FPS and mixed-HV storage/control are not certified.

Final R4 native bake90.5ms; HTML9,813,797bytes (+1.21% overT717), no raster payloads or aliases. Nine heavy software-CI forced draws measured median2645ms with eight roots versus2563ms after ordinary demolition; this is not device FPS certification. No production website deletion or migration is involved.
