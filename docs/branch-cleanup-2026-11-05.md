# 遠端分支清理紀錄（2026-11-05）

業主 2026-11-05 指示「舊分支也清掉」。清單由 Claude 從 GitHub 的 93 個 PR 與遠端 111 條分支機械算出（每條分支對到它最後一個 PR，比對分支 head 是否就是 PR 關閉時的 head），由 Grok 執行。

## 保留（3 條）

| 分支 | head | 理由 |
|---|---|---|
| `ccr-e2781bc4-vlojg3` | `852ed4ca4b21` | Claude 這個 session 的工作分支 |
| `dsk/lab-persistence-058` | `d30b38dad1b2` | #85 還開著（業主決定留著） |
| `main` | `fb334851f055` | 預設分支 |

## 封存成標籤再刪（25 條：有 main 沒有的提交、沒有 PR 可以還原）

標籤名 `archive/2026-11-05/<分支名>`，指向刪除前的 head；還原：`git push origin refs/tags/archive/2026-11-05/<分支名>:refs/heads/<分支名>`。

| 分支 | head | 最後提交日 | 原因 | 最後一個提交 |
|---|---|---|---|---|
| `claude/blissful-cori-o3364f` | `f6d626c04c29` | 2026-10-04 | 沒有 PR | DECISIONS：PR #7（GROK-003／004／005，19 座英式建築）不合、已關，記下撞號、品質、範圍三個 |
| `claude/dual-agent-coordination-a24cyi` | `d23c18d8e24e` | 2026-09-24 | 沒有 PR | 日誌 r85 補上 T638 commit 094a4c3；T637、T638 卡面與日誌補上線上結果 |
| `dsk/bookshop` | `cf2e7233d359` | 2026-09-27 | 沒有 PR | DSK-016 卡面補 §6 效能實測：perf.js 六場景（zoom_near 比值 1.02／rot1 被棘輪標記 |
| `dsk/chippy` | `3080392ea0c5` | 2026-09-27 | 沒有 PR | DSK-013 炸魚薯條店近景疊層：白釉磚磚縫與藍腰線、窗內油鍋檯面與炸籃、招牌白魚補鰭眼、磚砌紋與窗台窗楣、抽風管環箍 |
| `dsk/corner-pub` | `5f3c89ea96c6` | 2026-09-27 | 沒有 PR | DSK-012 轉角酒館近景疊層：釉面磚磚縫與裝飾帶、蝕刻玻璃細格紋與反光、斜角柱式與黃銅推板、瓮形飾凹槽、瓦壟與屋脊； |
| `dsk/galleried-inn` | `9041ab3450d1` | 2026-09-27 | 沒有 PR | DSK-008 有廊客棧近景疊層：外廊牛腿與欄杆加密、柱頭柱礎、磚砌紋與層帶、格窗鉛條、瓦壟與屋脊瓦、車門拱石與門釘、桶 |
| `dsk/oval-hall` | `cb59783e896d` | 2026-09-27 | 沒有 PR | DSK-007 皇家音樂廳近景疊層：穹頂鐵肋、拱窗鉛條與拱石、赤陶飾帶嵌片、鼓頂欄杆、門廊柱頭、露臺鋪面縫、夜間燈柱 |
| `dsk/tearoom` | `e2fbc6b30072` | 2026-09-27 | 沒有 PR | DSK-014 英式茶室近景疊層：拉毛粉刷抹痕、弓形凸窗豎框與蕾絲波浪簾、檯面茶壺茶杯、條紋遮篷條紋陰影與波浪下緣、茶壺 |
| `gpt/british-central-station` | `4e54273923c1` | 2026-10-05 | PR #13 關閉後又多了提交 | test: verify released T721 public site and native UI interac |
| `gpt/british-station-street-life` | `3995f1cef012` | 2026-10-05 | 沒有 PR | docs: reserve British station street-life stage two GPT-009 |
| `gpt/british-use-scales-rebuild-021` | `0b6bde3a2f8f` | 2026-10-13 | 沒有 PR | docs(art): deliver native mobile catalogue preview; mature o |
| `gpt/british-use-scales-recovery-021` | `24a7a92d367d` | 2026-10-12 | 沒有 PR | GPT-021 recovery: retain exact source receipts and final-kit |
| `gpt/british-use-scales-release-021` | `9fa21fa14fd3` | 2026-10-12 | 沒有 PR | GPT-021 release plan: owner-approved36 forms and predeclared |
| `gpt/british-use-scales-source-022` | `8e6bc56ed8fc` | 2026-10-13 | PR #26 關閉後又多了提交 | T739: verify deployed e91c9fe6 public Pages in a disposable  |
| `gpt/complexes-public014` | `5e30df5e7896` | 2026-10-06 | 沒有 PR | test: verify published T727 exact source and native four-com |
| `gpt/gardenlife-public016` | `dcba011e1ba9` | 2026-10-07 | 沒有 PR | test(T729): verify official garden release and preserve raw  |
| `gpt/museum-cold-load-diagnostic010` | `3a58dc2095c9` | 2026-10-05 | 沒有 PR | test: measure cold reload before warm control to preserve ex |
| `gpt/pr7-game-samples` | `cbb4a896f647` | 2026-10-04 | 沒有 PR | GPT-002 add isolated Chromium day-night sample workflow for  |
| `gpt/quayside-public017` | `90995b6dc75f` | 2026-10-07 | 沒有 PR | Verify T730 public deployment with retained legacy and quays |
| `gpt/riverside-public012` | `002bc6287ec1` | 2026-10-05 | 沒有 PR | verify: observe published T725 riverside market and real col |
| `gpt/streetscape-public015` | `f6b20edf5dc8` | 2026-10-06 | 沒有 PR | test(T728): verify exact official release and eight street t |
| `gpt/theatre-public013` | `39f61db9ca25` | 2026-10-06 | 沒有 PR | test: verify deployed T726 theatre source and native cold re |
| `gpt/waterfront-edge-diagnostic-018` | `9416237a0391` | 2026-10-07 | 沒有 PR | test(lab): compare bounded map-edge sampling alternatives in |
| `gpt/waterfront-public018` | `e1613060ef8f` | 2026-10-07 | 沒有 PR | Observe native capital appends across the retained 80-record |
| `gpt/waterfront-quarter019-mobile-qa` | `04b4d1bf263e` | 2026-10-08 | 沒有 PR | GPT-019: isolate mobile legacy-control cleanup and bound ide |

## 直接刪（83 條）

- PR 已合併或已關閉，分支 head 就是 PR 關閉時的 head；GitHub 永久保留 `refs/pull/<號>/head`，還原：`git fetch origin refs/pull/<號>/head && git push origin FETCH_HEAD:refs/heads/<分支名>`。
- `claude/jolly-clarke-tf6oqm`（`3f86bebdcd9c`）沒有 PR，但內容已全部在 main 裡（是 main 的祖先），不另外封存。

| 分支 | head | PR | 狀態 |
|---|---|---|---|
| `dsk/ai-speed-054` | `1c701a6bb110` | #83 | 已關閉未合併 |
| `dsk/lab-03-road-delivery` | `6f5896896ab8` | #74 | 已關閉未合併 |
| `dsk/lab-04-rail-topology` | `0e834547e2ad` | #73 | 已關閉未合併 |
| `dsk/lab-05-rail-freight` | `6bf3ad3634af` | #75 | 已關閉未合併 |
| `dsk/lab-06-block-recovery` | `6c50019c1ba8` | #76 | 已關閉未合併 |
| `dsk/lab-07-intermodal` | `eac62fdf0827` | #81 | 已關閉未合併 |
| `dsk/lab-08-commute-od` | `e4866948e2f0` | #77 | 已關閉未合併 |
| `dsk/lab-09-passenger-demand` | `3b04d8ac59c9` | #78 | 已關閉未合併 |
| `dsk/lab-10-shadow-visits` | `7b1556ca8581` | #79 | 已關閉未合併 |
| `dsk/lab-11-acceptance` | `3c21731c61e5` | #82 | 已關閉未合併 |
| `dsk/lab-12-persistence-proposal` | `f5ca36aebc07` | #80 | 已關閉未合併 |
| `dsk/lab-integration` | `305cf15184eb` | #84 | 已關閉未合併 |
| `dsk/tree-season-climate` | `1d7b3e370181` | #4 | 已關閉未合併 |
| `dsk/uk-cathedral` | `1faba1fa2ab9` | #5 | 已關閉未合併 |
| `glm/alleys-riverside` | `6bb1aae66845` | #3 | 已關閉未合併 |
| `gpt/bld-fingerprint-capacity-032` | `d15bd9f449dc` | #40 | 已合併 |
| `gpt/british-building-integration` | `7b0c1e97b810` | #9 | 已合併 |
| `gpt/british-four-complexes-014` | `9de7e76e9d0a` | #19 | 已合併 |
| `gpt/british-garden-life-016` | `acdfb0d26ac3` | #21 | 已合併 |
| `gpt/british-heritage-fifteen-024` | `2b44f2649612` | #29 | 已關閉未合併 |
| `gpt/british-high-street` | `b95ac49b521b` | #10 | 已合併 |
| `gpt/british-natural-history-museum010` | `11617dc1d373` | #15 | 已合併 |
| `gpt/british-prototypes` | `44afade435d9` | #8 | 已合併 |
| `gpt/british-public-life` | `e64238d62231` | #12 | 已合併 |
| `gpt/british-quayside-details-017` | `1c6ebde73fe7` | #22 | 已合併 |
| `gpt/british-residential-streets` | `42290a99967c` | #11 | 已合併 |
| `gpt/british-riverside-market-012` | `4dee8938f69d` | #17 | 已合併 |
| `gpt/british-station-street-life-recovery` | `ec96a171368e` | #14 | 已合併 |
| `gpt/british-streetscape-015` | `0b05417ec602` | #20 | 已合併 |
| `gpt/british-theatre-quarter-013` | `aba1d6132b68` | #18 | 已合併 |
| `gpt/british-waterfront-heritage-018` | `ed8deedc72c5` | #23 | 已合併 |
| `gpt/british-wave01-025` | `173a36cce820` | #32 | 已合併 |
| `gpt/british-wave02-027` | `9c7d9de622bf` | #36 | 已合併 |
| `gpt/british-wave03-029` | `c36f7ac191de` | #37 | 已合併 |
| `gpt/british-wave04-030` | `31d1b87ff6b7` | #38 | 已合併 |
| `gpt/british-wave05-031` | `bb141bc17185` | #39 | 已合併 |
| `gpt/british-wave06-033` | `6a7303f5e939` | #42 | 已合併 |
| `gpt/british-wave07-035` | `05242c1bd87b` | #43 | 已合併 |
| `gpt/british-wave08-036` | `47e11a17f574` | #44 | 已合併 |
| `gpt/british-wave09-037` | `50152ac4f306` | #45 | 已合併 |
| `gpt/british-wave10-038` | `ebe67b49e563` | #46 | 已合併 |
| `gpt/british-wave11-039` | `3341a26f0b4a` | #47 | 已合併 |
| `gpt/british-wave12-040` | `b36e93e8edf7` | #49 | 已合併 |
| `gpt/british-wave13-041` | `a3703372aa32` | #51 | 已合併 |
| `gpt/british-wave14-042` | `a87fceaf7f94` | #53 | 已合併 |
| `gpt/british-wave15-043` | `9201da87df85` | #55 | 已合併 |
| `gpt/british-wave16-044` | `1f4eb6a07645` | #57 | 已合併 |
| `gpt/british-wave17-045` | `963b64c50f23` | #59 | 已合併 |
| `gpt/british-wave18-046` | `e68a30cec9c6` | #61 | 已合併 |
| `gpt/british-wave19-047` | `56c19a9a2123` | #63 | 已合併 |
| `gpt/british-wave20-048` | `ef5823b7bd24` | #64 | 已合併 |
| `gpt/ci-deduplicate-20261018` | `f0ecb26c6129` | #41 | 已合併 |
| `gpt/ci-smoke-budget-051` | `f4d88a3589d5` | #69 | 已合併 |
| `gpt/cold-load-power011` | `0e570c48944d` | #16 | 已合併 |
| `gpt/direction-british-twenty-waves-20261016` | `8bf7ff8f8481` | #31 | 已合併 |
| `gpt/direction-completed-wave01-025` | `cfe034327e0c` | #34 | 已合併 |
| `gpt/direction-heritage-fifteen-20261015` | `9e5e1cb64f77` | #27 | 已合併 |
| `gpt/direction-heritage-fifteen-review-20261015` | `cce6aabe0682` | #30 | 已合併 |
| `gpt/direction-logistics-railway-20261026` | `363429709af2` | #66 | 已合併 |
| `gpt/direction-wave12-20-20261024` | `f2f59c7710f7` | #48 | 已合併 |
| `gpt/fiscal-load-readonly-026` | `5eb97b1c383e` | #33 | 已合併 |
| `gpt/four-view-light-repair-023` | `7500eac9c579` | #28 | 已合併 |
| `gpt/lab-ai-speed-20261030` | `3b9dd61fa1f0` | #71 | 已關閉未合併 |
| `gpt/lab01-shadow-cargo-049` | `e34b2e332358` | #67 | 已合併 |
| `gpt/lab02-single-ledger-052` | `93a65c4323f9` | #70 | 已合併 |
| `gpt/lab02-warehouse-capacity-050` | `759d01cd65fb` | #68 | 已合併 |
| `gpt/policy-null-load-028` | `0611b343322f` | #35 | 已合併 |
| `gpt/touch-cancellation-020` | `0dbdd57e2151` | #25 | 已合併 |
| `gpt/visual-place-identity` | `499f196d49a8` | #6 | 已關閉未合併 |
| `gpt/waterfront-cultural-quarter-019` | `dd7b0800d372` | #24 | 已合併 |
| `gpt/wave12-published-ledger` | `38f53ec755e3` | #50 | 已合併 |
| `gpt/wave13-published-receipt` | `5cc644558e88` | #52 | 已合併 |
| `gpt/wave14-release-receipt` | `e3b54c4ba5f8` | #54 | 已合併 |
| `gpt/wave15-published-receipt` | `1306ab37c352` | #56 | 已合併 |
| `gpt/wave16-public-release-receipt` | `3d264a355399` | #58 | 已合併 |
| `gpt/wave17-release-receipt-20261024` | `17d8a63361c9` | #60 | 已合併 |
| `gpt/wave18-published-receipt-046` | `9ef5811de5cb` | #62 | 已合併 |
| `gpt/wave20-public-receipt-048` | `7019534ef2f9` | #65 | 已合併 |
| `grok/grove-mix` | `3a4b5f5016bd` | #1 | 已關閉未合併 |
| `grok/london-mews` | `c7d9d3f5cd0e` | #2 | 已關閉未合併 |
| `grok/uk-rest` | `4fa470b37961` | #7 | 已關閉未合併 |
| `owner/agent-branch-autonomy-20261031` | `58b2d84d7fd4` | #72 | 已合併 |
