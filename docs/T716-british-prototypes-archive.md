# T716 — 英式建築原型歸檔（原 GPT-003）

Status: release bookkeeping prepared before changes; owner approved merging the delivered prototypes on 2026-10-04. This card tracks prototype source and test evidence, not gameplay integration.

## Scope

- Merge only gpt/british-prototypes: UKP01 2×2 Victorian terrace, UKP02 2×2 corner pub, UKP03 3×3 municipal library.
- Preserve the original acceptance and iteration history in [GPT-003](branch/GPT-003-british-prototypes.md).
- Use v14.20 / T716 release metadata and AUTORUN-LOG.md entry. Product HTML changes are restricted to version, anchor and matching first-frame version label.
- Renderer remains opt-in and separate from index.html. No catalog entries, normal building IDs, construction behavior, save-format changes or unrelated PR changes.

## Acceptance before release bookkeeping

1. Diff to main contains the existing four prototype files plus this card, the release log and the three product metadata replacements only.
2. The release candidate passes prototype guards (including actual day/night city rendering), existing smoke ×3, strict fp.js --check, and unchanged tracked-file checks in remote CI. Do not claim pending checks passed.
3. Latest main and branch are rechecked immediately before PR squash merge. No force-push, branch deletion, baseline rewriting or protection bypass.
4. After merge, wait for exact-commit main smoke and Pages deployment; verify the published version and commit provenance.

## Evidence before bookkeeping

- Original base: 9be7bc069a9f3dcb5bd71787dc4ab8e672b4f7d1; approved branch snapshot: 05d73b25613db1e2d4b0b96f45b9e872d46c1278.
- R2 implementation 0888d0b867a0381fcc2d4782e6154954be76745f: [CI 37150185803](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37150185803), 96/96 guards, smoke ×3, strict fingerprints passed. The subsequent approved snapshot changes only the GPT-003 documentation.
- New release-candidate and merge results: pending; authoritative exact-SHA results will be recorded in the PR and Actions runs.

## Unfinished / limits

The three buildings are approved visual prototypes and will not appear in the normal build menu after this merge. Four rotations, weather, seasons, mobile performance and permanent gameplay integration remain unimplemented/unverified. Source prototype card is retained to preserve evidence; this T card is the release record. No production-site deletion or migration is involved.
