# T733 — Abort interrupted pointer gestures (original GPT-020)

## Acceptance criteria (recorded before implementation, 2026-10-09)

- Base: Lab main `44849ee7ddb2292daddf478b28978f9d0d7edf0d` (T732). Remote rechecked; no open PR or competing cancellation branch.
- `pointercancel` and `lostpointercapture` abort pending tap, road preview, rectangle, route selection and inspect/double-tap actions without a successful-release commit.
- Terminal events are tracked-pointer guarded and idempotent. Stale move/up/cancel events cannot mutate a completed or newer gesture.
- Clear shared gesture state and timers before releasing capture. Cancellation of either pinch finger abandons the entire gesture safely.
- Keep already-applied long-hold/mouse paint as one undoable transaction; never discard a nonempty undo group or undo an unrelated prior transaction.
- Verify both 390×844 and 360×800: cancellation before 430 ms; road/rectangle preview; capture loss alone; successful up then capture loss; duplicate/stale events; long-hold paint plus Undo; partial pinch; normal pan/route controls.
- Preserve approved art, version labels, save format and production saves. One `gpt/` branch and draft PR only; no merge or deployment.

## Verification boundary

Per AGENTS §5, browser game execution, smoke and pixel guards run through CI. This cloud workspace runs syntax/static checks and extracted interaction unit tests only. CI results and any unrun checks will be recorded without claiming full validation early.

## Work log

- Baseline source blob verified: `3dc0323bf1f26cc73b75cb2054f4d5f3b36d1789`.
- Separate tracked cancellation handler and capture-loss handler abort all pending gesture state before capture release. Normal pointerup alone commits.
- Unknown pointer moves still update hover, then return before they can mutate a live gesture. Duplicate pointerdown and terminal events are ignored.
- Second-touch transition closes existing paint as an undoable transaction instead of discarding its history or issuing a partial refund. Normal first-finger-up pinch settling is intentionally unchanged; later cancellation clears tap history.
- Independent review: no blocking findings. Isolated input suite passes 41/41 against the patch; original baseline fails 30/41, as expected. The suite extracts actual input, rectangle and Undo/Redo functions rather than a reimplementation.
- All 79 inline scripts and both test scripts pass syntax parsing. Browser matrix is wired into the existing smoke.js route and targets 390×844 / 360×800.
- Runtime diff: 25 inserted / 5 removed lines; no art or save schema changes. Source blob before: 3dc0323bf1f26cc73b75cb2054f4d5f3b36d1789; after: 97917dc93167735ea75862182857135fff20cfa8.
- Not done: CI browser results pending. Physical-device touch behavior and pixel/fingerprint guards have not been run in this cloud workspace, per repository restrictions. No merge/deployment performed.

- Browser fixture review caught that a valid road cell can be water, where the resulting bridge cannot hold a bus stop. Route positive-control fixtures now explicitly require land; this was a test-only fix before claiming runtime results.

- First CI (head 1f41d5c, run 37934998114) passed 53 browser assertions at each phone size and all legacy selftests, then correctly failed the strict console check on six vibration warnings: synthetic long-holds had no trusted user activation. The test setup now uses a real CDP click and asserts user activation; no error filter or runtime logic was weakened.

## Additional merge-readiness verification (2026-10-09)

- Owner asked whether Lab is ready to merge. No merge has been authorized by this question.
- The candidate already has three successful smoke executions. The remaining `fp.js --check`/pixel gate is being evaluated in CI, using the unchanged T732 command on both pinned main and the identical candidate runtime.
- The additional probe captures existing harness results without replacing assertions, compares complete sprite/style/block records, and runs the existing T732 owner-approved native-pixel verifier. It never writes `fp.json` or `style.json`.
- The raw stored-baseline check remains a distinct CI gate: if both main and candidate inherit a failure, the failure is preserved and reported rather than treated as green. No art baseline is blessed.
- New workflow is contents-read-only, persists no credentials, and is restricted to this PR branch. Comparison static tests pass (one positive and nine mutation negatives); native results are pending.

## CI findings and release-source compatibility (2026-10-09)

- Exact runtime blob `97917dc93167735ea75862182857135fff20cfa8` passed three smoke executions at ebd069d, then two more at verification-only f71fdb1. Each successful run passed 41 isolated input tests, 54 browser assertions at each phone size, existing selftests and zero console errors.
- Native pixel CI at f71fdb1 compared all 3,179 sprite records, 165 families, 1,728 blocks and complete style records with untouched T732 main: identical. The unchanged T732 approved-art verifier passed. Evidence runs: 37937101685 and 37937110026.
- The unchanged raw `fp.js --check` failed on BOTH main and candidate: stored building-style expectation 96.5%, actual 96.3%. Both strict CI jobs remain red. No fingerprint/style baseline or art was changed. The owner explicitly approved preserving this inherited discrepancy when merging PR25.
- Merge was then held because the existing 156-job release suite pins historical source bytes, including old input handlers and smoke. This is a source-contract incompatibility, separately accounted for rather than waived.
- The successor contract accepts only exact reviewed GPT-020 candidate hashes. It verifies every tracked file against actual HEAD, rejects undeclared baseline changes and extra files, and passes caller-supplied bytes through original VM readers. There are no filesystem or module-loader hooks.
- For historical source comparisons only, exact candidate input/smoke bytes map to hash-verified immutable T732 originals. Original source assertions, pixel thresholds, approval pins and baseline files remain effective. Raw candidate HTML is still parsed, served and source-hashed; CI additionally verifies the loaded browser resource bytes against that raw hash.
- The old workflow/source/VM controls run unchanged in a frozen T732 worktree and are explicitly historical evidence. The full candidate workflow differs only by this branch trigger and the source-control entry changes; the short mobile QA workflow receives those same source-control command changes and retains all its triggers and mobile runtime; all 156 runtime jobs, matrices, commands, dependencies and failure behavior remain intact.
- Local source-only successor checks passed 79 mutation negatives, and touch-handler tests remained 41/41. Independent implementation review and full candidate CI are pending; these local tests do not claim browser/runtime completion. Physical-device testing remains unrun. No merge or deployment has occurred.


## T733 publication bookkeeping

<!-- T733 release entry BEGIN -->
## r180 — T733 Interrupted touch gestures (original GPT-020)

- Version: v14.37 / T733. PR #25: https://github.com/lijiabao1998/GlimmerTown-lab/pull/25
- Owner approved this repair, merge and normal automatic deployment on 2026-10-09 at 13:33:34 UTC, preserving the inherited building-style discrepancy without changing baselines.
- Cancels pending tap, road, rectangle and route actions; stale terminal events are idempotent; applied paint stays undoable. Reviewed input implementation blob: 97917dc93167735ea75862182857135fff20cfa8. Release changes exactly three labels beyond those reviewed game bytes.
- Earlier smoke evidence: three green runs at ebd069d and two each at f71fdb1 and b660f394. Native pixel equality at b660f394: all 3,179 sprites, 165 families and 1,728 blocks unchanged, run 37940504511. Raw stored style check remains 96.5% expected versus 96.3% actual on both original and repaired code.
- Failure history: initial synthetic-input vibration warnings corrected without filtering; b660 full suite passed source controls but its added Page.getResourceContent probe failed because the no-store document was not cached. This is repaired through pre-navigation response observation, not waived.
- Not completed: exact T733 full release suite, three smokes, pixel/style evidence, merge and deployed-byte verification remain pending. Earlier-head results are not claimed as T733 results. Physical-device testing remains unrun. No artwork or fp/style baseline changes.
<!-- T733 release entry END -->

