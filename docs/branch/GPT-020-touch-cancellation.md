# GPT-020 — Abort interrupted pointer gestures

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
