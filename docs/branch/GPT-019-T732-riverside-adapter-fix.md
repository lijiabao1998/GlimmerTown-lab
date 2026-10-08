# GPT-019 — T732 riverside release-adapter correction

## Acceptance card written before implementation

Scope: repair the retained riverside comparison's source-only label adapter for
the existing image-approved T732 / v14.36 product. The release candidate tree is
`48bd92b54746539d7ae2183bead13b881dc1cfbf` (remote `b9d19727a84f3535d6a46bcbcb12ac7027768113`).

Acceptance:
- The actual `waterfront-quarter-compatibility019.riversideRuntimeSource018`
  entry point accepts only the exact T731 / v14.35 and T732 / v14.36 pairs.
- The source transformation changes only the unique leading label predicate;
  every other historical runtime byte, save validation and numerical threshold
  remains exact. All older source files remain unchanged.
- Source-only controls test the actual exported entry point, both admitted
  pairs, crossed, older, future, missing and malformed labels, and the source
  transformation's unique-span and reversal requirements.
- The existing eight-world candidate-zero and release-66 normalization controls
  remain intact, including all original raw-save and timing negatives.
- The changed adapter's release pin and the pin manifest's enclosing hash are
  updated without changing approved product, image or native-evidence identities.
- `index.html`, artwork, `fp.json`, release labels, release card and release log
  remain byte-identical to the input release tree.
- No local native game, browser, smoke, pixel, fingerprint or CI execution.
  Native acceptance requires a new complete exact-head 156-job CI run.

## Evidence and limits before implementation

The release compatibility job `113401267025` in run `37801223501` exited 1 after
its three smokes, style and strict native fingerprint checks. Its stdout report
is truncated and the official artifact transfer was blocked, so its complete
error tail has not been read. This correction does not claim that it is the
run's only failure.

Pure label-predicate evaluation reproduces a definite gap: the inherited 018
riverside runtime accepts 14.34/T730 and 14.35/T731 but rejects 14.36/T732 before
executing the historical world. The adapted 019 comparison passes 14.36/T732 for
the release candidate. Existing 019 source controls pass because their runtime
binding still checks the 018 pair; the 019 normalizer itself correctly preserves
zero candidate fields and normalizes exactly 66 release fields.

## Work record

- Implemented the current riverside gate as one exact, reversible substitution
  of the inherited runtime predicate. Explicitly overrode the historical API
  name used by the retained comparison; every other runtime byte is unchanged.
- Added current source-only runtime coverage without removing historical
  controls: 288 label cases, four accepted across two runtimes, 284 rejected,
  and three invalid source-span cases. Restoring the old inherited export in
  memory makes the new test fail, confirming the original omission is detected.
- Existing eight-world normalization controls passed: 224 candidate cases with
  zero changed fields; 1,109 release cases (five positive and 1,104 negative)
  with exactly 60 enterprise and six raw-save labels normalized. All original
  42 raw-save negatives are retained for both candidate and release.
- Passed the current contract, release envelope, logic, inert native-source,
  legacy-source, compatibility-source, adapter, full-workflow, mobile-workflow,
  and lossless-package source/data tests; all 019 JavaScript parsed successfully.
  The workflow source test still requires all 148 historical plus eight new jobs.
- Release-envelope negatives still reject a fourth product edit, incorrect
  labels, changed native records, false approval, and changed release history.
  Product, artwork, fingerprint baseline, release card and log are unchanged.
- The first draft of the new source-test prefix assertion had an extra closing
  parenthesis and failed immediately; that test typo was corrected before the
  complete source/data regression. No product change was involved.
- Independent source review found no blocking defect. The adapter manifest and
  its enclosing hash were updated; approved image, product and native-evidence
  identities remain unchanged.

Not completed: no native game, browser or CI run was performed, and this local
repair was not pushed. A new complete exact-head 156-job run is still required.
The original failed run and unread error-tail limitation above remain on record.
