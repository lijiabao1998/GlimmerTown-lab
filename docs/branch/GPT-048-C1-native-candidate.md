# GPT-048 C1: complete ten-model candidate, not a release

Independent base: `4346a96543b01ffd47ac3696480661b5de8638ae` (published 190, T773/v14.66). Frozen single-file first card: `002f14fcdc966289e5dc5681e1a0f1cddf5f93dd`. The first card is unchanged.

## Actual work

Ten independent model bodies now exist in `wave048-models-a.js` and `wave048-models-b.js`, composed into `british-wave20-art048.js` and three removable native index blocks. New bld variants are 920..959. No published model body, renderer, global light, simulation, price, utility, density, or save schema was edited. Production labels remain T773/v14.66 until the separately tested release commit.

The 60-degree crossing uses clipped maximum-height roof planes, not intersecting complete gable roofs. Independent tests check exact union area, all facet vertices and centroids, pairwise overlap, atomic subdivided seams, matching undersides, closed outer fascia, and empty internal crossing. Real geometry mutations remove a roof patch, duplicate one, lift a valley vertex, restore an internal wall, open the fascia, rotate to 90 degrees, or shorten an arm. The pyramid entry is cut at its exact roof intersection; restoring the uncut plane must fail.

Source-only recording stubs built all 40 world-view paths with identical world geometry across the four callers. Ten models are structurally distinct, coordinates finite, opaque palette paired night materials recorded, and analytical sprite bounds include beam widths. The new source guard has 52 negative controls: 32 actual-surface sabotage controls, three model-source mutations, and 17 invalid inputs. These are NOT pixel, visual, gameplay, or hardware results.

## Preparation failures and corrections retained

- Initial full-source test ran before the new smoke hook existed and correctly rejected it. Added only the new selftest block; all old assertions are byte-exact.
- The next full-source test correctly rejected a missing new prepared-guard manifest. Added the exact source-pin manifest, without removing that check.
- A newly authored glazing test initially demanded one single wall polygon behind the entire two-storey Foxglove pane. It rejected the correctly joined lower and upper wall at z9. The test now checks projected pane corners against the union of actual backing surfaces at the same exact authored offset; it does not alter any published guard or increase any tolerance. No visual acceptance is inferred from this source check.
- Silverweed's authored glazing offset now follows the true roof plane normal, using 24.6 rise and 11.5 run, before the first product push.
- Figwort's high gallery front was replaced by explicit upper-wall segments above the three joined rooms, rather than leaving a concealed full wall through them.
- Current-wave native negative targets explicitly use 24_1_920/924, not historical 880/884. Existing 160 powered-night cases and their physical slot ordering are retained. The full native probe additionally checks wave18/19 historical selftests and wave19-to-wave20 selection clearing.
- Original index is now over 12 MB. Source evidence transport is nine bounded 1.5 MB parts, rather than eight. This affects transport only, not an acceptance budget.

## Remaining mandatory evidence

Official Chromium day/night/four-view images, 160 powered/off/restored cases, original native selftests and negatives, 57 scenes/40 edges/eight exact fallback pairs, 17 pedestrian checks, financial and save controls, 40 same-condition performance pairs and deliberate 81 ms delay failures, seven style axes, and unchanged 4143 published leaves are all still unverified for this candidate. The read-only branch-only workflow will produce them; it must be removed in a standalone commit only after its last complete run is green. No official fingerprint baseline is adopted in C1.

Public-site job currently reuses immutable `probePublicWave047.cjs` to verify the still-published 190 version; it is not a claim that wave20 is live. Before release the new public receipt will verify all 20 waves. Hardware phones remain unverified.

No local game, Chrome, Canvas, rasterizer or fingerprint calculation was executed. No merge or deployment has occurred. Formal delivery remains 190/200. Stop after the authorized twentieth wave; no wave21.
