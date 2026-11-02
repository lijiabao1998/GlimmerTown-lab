# DSK-027｜AI 市長／全倍速：成熟城市實測與第一個負結果

- 日期：2026-11-02
- 分支：`dsk/ai-speed-054`（從 `origin/main` 01c2249 開）
- 對應：V67 §2（P0 GPT-053／PR #71）。**沒有動 `gpt/lab-ai-speed-20261030` 分支**；量測 harness 從該分支複製過來並在此標明來源。
- 邊界：`index.html` 目前**未改**（第一個候選已量測並撤回，見 §4）；不改 RNG／決策／財務／存檔。

## 1. 為什麼重做量測

PR #71 的 36 個檔、20 個 commit 裡，`index.html` 只改了 19 行（C5：`mobilityTopK053`＋`amNearestNodes502` 環狀列舉）；其餘是 harness／projection／文件。它的 paired 量測都在**合成小／中／大城**（`populationBefore/After` 都是 0）。V67 明確要求成熟城市，所以先做一次「真居民」的量測。

## 2. 方法（可重現）

- harness：`benchmark053.cjs`（`setup053`／`snapshot053`／`begin053`）、`populated-fixture053.cjs`（`connectFixture053`）、`perf-speed-split.cjs`（本卡新增的量測器）。三者前兩者從 `origin/gpt/lab-ai-speed-20261030` 取用。
- fixture：`scene=small`、`seed=87`、AI 開、5 倍速；本機 Windows Chrome、1280×800、DPR 1。
- 成熟度（實測）：**人口 327、277 棟建築、256 格道路、61 個工作、day 86→137**。
- 量測：同一座城連續三段——`5×` → `暫停（speed 0）` → `5×`，各 8 秒，量 RAF 間隔。

## 3. 結果：瓶頸在模擬／JS，不在渲染

| 階段 | 幀數 | 平均 | p50 | p95 | FPS | 遊戲日 |
|---|---|---|---|---|---|---|
| 5×（AI 開） | 20 | **390.6 ms** | 350.1 | **566.7 ms** | 2.56 | day 86 |
| **暫停 speed 0** | 126 | **62.8 ms** | 66.6 | 116.6 | 15.92 | day 88 |
| 5× 第二次（城更大） | 13 | **578.2 ms** | 500.0 | 1133.2 | 1.73 | day 135 |

- 暫停時的 62.8 ms 是「純渲染」上限；5× 多出來的 330–515 ms 全是**模擬＋AI**。
- 也就是說：成熟城市的幀時間 **80–85% 在 JS**，優化方向明確。

## 4. 第一個候選（已量測、已撤回）

**假設**：`mayorSiteScore470A` 先呼叫 `mayorNearMetrics470A` 掃一次鄰域，再呼叫 `mayorMegaSiteScore470` 用**完全相同**的邊界與順序再掃一次；合併成單次掃描可省一半。

**實作**：新增 `mayorSiteMetrics054` 單趟掃描（相同邊界、相同 tile 順序、相同累加順序，`access`／`land` 浮點加法順序不變），`mayorSiteScore470A` 與 `mayorMegaSiteScore470` 共用。

**實測（同一 fixture、同 seed）**：

| | 5× mean | 5× p95 | speed0 mean |
|---|---|---|---|
| baseline | 390.6 ms | 566.7 ms | 62.8 ms |
| 合併掃描候選 | 490.6 ms | 716.6 ms | 50.3 ms |

**沒有收益（在噪音範圍內甚至更慢）→ 撤回**。原因（依 profile 與程式結構）：`mayorFindSite470A` 對每個候選格先呼叫 `canPlace`，**只有通過的少數格才會計分**；所以計分掃描不是熱點，`canPlace` 才是。合併掃描只省到少數格，白付了 Set 查表與函式呼叫成本。

## 5. 下一步（照這個順序做）

1. 在成熟城市上量 `aiStep` 一次的 `canPlace` 呼叫次數與總時間（instrument），確認是不是 O(候選數 × 工具數)。
2. 對 `mayorFindSite470A` 做**精確剪枝**：footprint 的必要條件（全部在陸地、無建築、無不相容基建）用每 tick 的 prefix-sum／遮罩做 O(1) 否決，必須保證「被否決的格一定是 `canPlace` 會回非 null 的格」。
3. 若 `canPlace` 內部有重複子查詢（例如多工具共用同一組地形檢查），在同一個 `aiStep` 內做 generation-based memo（map 一改就整批失效）。
4. 每一項都要有「同 seed／同 checkpoint，AI 決策與放置結果全等」的證明，並用同一座成熟城市量 p95。

## 6. 沒做成的事（照實）

- **還沒有任何性能改善**：本卡只有量測方法、成熟城市基線與一個被否證的候選。
- 量測只在 Windows 本機 Chrome（軟體渲染），不是 CI Linux，也不是實體手機／Safari。
- 三段量測樣本數少（13–126 幀），5× 的變異大（城市在長），下一步要用固定工作量（fixed-work）與交錯 A/B 才能給出可信百分比。
- `dsk054-apply.cjs`（套用腳本）保留在分支上當作撤回紀錄，不再使用。
