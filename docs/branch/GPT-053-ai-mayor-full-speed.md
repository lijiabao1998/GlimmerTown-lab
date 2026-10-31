# GPT-053 — AI 市長自動建城／全倍速：實測後才優化

- 分支：`gpt/lab-ai-speed-20261030`
- 基線：`a20713a509270f8ce6e37859c1fafe330372b952`（Lab main／T777／v14.70）
- 指令：業主 2026-10-30 明示本次工程優先於 2026-10-26「效能暫緩」；針對 AI 市長自動建城與全倍速卡頓。這是獨立有界工程，不恢復舊無限美術迭代。
- fp 家族（本卡第一 commit 凍結）：**無**。不改美術、密度、LOD、像素基線、產品數值或存檔格式。
- 只建立／推送自己的測試分支與 Draft PR；不合併、不部署、不觸發 Pages。

## 驗收條件（動手前凍結，不放寬）

1. 在實際瀏覽器同一環境、固定 viewport／DPR／種子／城市快照，覆蓋小、中、大城及密集新增；UI 倍速 `{1,2,3,5}` 各測 AI 關／開，保留實際城市人口、roots、道路、遊戲日與 RNG 起終點。城市大小不得僅以地圖邊長冒稱；密集新增必須有實際放置成功數。
2. 報告 FPS、幀時間 p50/p95/p99、>50ms long tasks 次數與累積阻塞時間、實際遊戲日/秒、AI 放置數、CPU profile、memory 與 GC 可觀測限制。原始逐幀/事件數據、profile、trace、環境與 commit 身份都留底。沒有 API 的量不填 0、不冒稱測過。
3. 新舊交錯、每組至少 30 個有效樣本；同 seed/場景/速度比較。性能收益不得靠少跑 tick、少做 AI 決策、降低更新頻率、減建築、關原有效果、丟遊戲日或亂數消耗變更達成。
4. 用實測 profile 選瓶頸，分階段窄改。核心受影響場景的 p95 幀時間與卡頓指標至少改善 **50%**，理想 **70–90%**；未達如實報數值／瓶頸／限制，不更改門檻。
5. 同種子短視野逐 checkpoint 配對：RNG、財務、人口、事件順序、AI 決策與放置結果全等；舊存檔 load→save→load 全欄位不變；保留第一個實際失敗／反例。新守衛需故障注入首紅命中目標。
6. `node smoke.js` 三連綠、`node fp.js --check` 非目標家族零變更，加相關既有回歸。未跑不能打勾；一般 smoke 不等於效能或真機驗收。
7. Town 比較必須固定其精確 main commit；源碼差異與同環境實測分開，不將 Town/Lab 不同人口或不同工作量的 FPS 直接當優化幅度。

## 邊界與退路

- `index.html` 與既有守衛未改之前先完成實測；若平台／瀏覽器拒絕，不換旗標、瀏覽器或隱藏執行路徑繞過。
- slot 3、獨立測試 profile、伺服器 8199；不碰業主存檔。
- 不改 RNG、事件／決策次序、日曆語義、財務公式、存檔契約、版本字、AUTORUN-LOG、DECISIONS、fp/style。
- 每個真實候選保留獨立 commit／精確基線；退路為保留 Draft、不合併，必要時以新 revert commit 撤回自己的產品改動，不重寫歷史。

## 施工紀錄

### 2026-10-30 21:21 UTC — 首個基線嘗試（未進入遊戲）

`node fp.js --check` 透過未修改的原生 `harness.js` 起 Chrome。harness 內建兩次啟動都 SIGABRT；第一個關鍵錯誤為 `socket() failed: Operation not permitted (1)`，另有 crashpad database 錯誤。原件：`evidence/ai-speed-053/baseline-fp.log`。

這是**環境首紅**，不是遊戲效能回歸，也不是目標守衛負控制。FPS、p50/p95/p99、long tasks、吞吐、放置數、CPU profile、memory 全部 **未量**。不會拿源碼掃描猜測熱點當已重現或宣稱任何改善。

目前只完成規則／源碼入口盤點、固定基線與此卡面；產品未改。後續只使用明確許可的原有測試流程；若推送或 CI 被平台拒絕，記具體拒絕，停止相依工作，不繞過。

## 沒做成的事

基線瀏覽器被平台 socket 限制阻斷；尚無真實 AI／倍速重現、效能 profile、優化候選、收益或回歸通過證據。實體手機／Safari／使用者電腦均未測。

## §8 收工自檢（保持真實；Draft 不代表完成）

- [x] 卡面在動手前推上去了，驗收條件沒有事後改鬆（遠端 first commit `a5366e73b9dd01ddc9f4fc81b7e7028f929822f3`；Draft #71）
- [ ] 同種子前後對比／舊存檔來回（未跑；產品未改）
- [ ] fp 與逃生閥整幀（基線啟動失敗；產品未改）
- [ ] 各美術狀態實看（未跑；無美術改動）
- [ ] 新守衛故意改壞首紅（尚無新守衛）
- [ ] smoke 三連綠（未跑）
- [x] 卡上沒有任何未跑的「通過」

### 2026-10-30 21:24 UTC — GitHub 測試路徑明示授權

業主在得知 Chrome socket 阻礙後明示：**「你使用GitHub來驗」**。因此僅在本分支新增 `permissions: contents: read`、不可部署的專項 workflow，先實際驗證 small/5×/AI on-off 的原生執行流程，再擴展原凍結矩陣。不得把此先導 run 當完整驗收，也不把 Linux headless 結果稱為真機。

Git CLI 推送因沒有 HTTPS credential 未執行（`could not read Username`），正式已連接 GitHub connector 已建立 first commit／分支／[Draft #71](https://github.com/lijiabao1998/GlimmerTown-lab/pull/71)。沒有登入或規避權限拒絕。

量測工具依據：[Chrome DevTools CPU Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/)、[Tracing](https://chromedevtools.github.io/devtools-protocol/tot/Tracing/)、[W3C Long Tasks API 工作草案](https://w3c.github.io/longtasks/)。CPU/trace 另窗，不把 profiler 額外成本混進主 FPS 窗。Long Tasks 不支援時回報 null；阻塞時間是各 task 超過 50ms 的部分，原 duration 另留。

純統計 helper 六項單元檢查已本地通過，涵蓋獨立手算分位數／實際吞吐／缺量拒絕／故意錯算首紅；這**只證明統計算術，不是遊戲/效能通過**。

### 首輪測量界線

先導只量原始 `index.html`、小型新建受控 fixture、5×、AI on/off，各30秒，另接10秒診斷 profile/trace。不是自然成熟城市、不是完整32格矩陣、不是候選收益驗收。`index.html` SHA-256 `6ee59d6834e5227fe919f3ca7b301d6d72ce8a35fadaab128632677dfa9f5cf6`；產品與既有 harness/guard 逐byte未變。

獨立審查找出 artifact 路徑不一致與重複統計實作，已在首次 CI 前修正；採樣外明示保存slot3快照，完整AI放置／RNG狀態尚無現成介面時輸出null。fixture、frame原件、memory、CPU、trace、PNG、console、第一失敗均收附件。不能以六項算術綠燈取代真瀏覽器量測。

### 2026-10-30 21:30 UTC — 專項 CI 提交遭平台拒絕，停止相依工作

建立第二個 GitHub commit 被 auto-review 明確拒絕、未執行。理由原文：「建立 GitHub commit 會修改遠端儲存庫；目前排程明確要求施工暫停且僅限只讀回報，故未授權此寫入操作。」完整請求身份與回執在 `evidence/ai-speed-053/remote-write-blocker.json`。

已知業主21:23「你使用GitHub來驗」早於此拒絕，不能重複引用它當新證據而無限重試。**沒有重試、沒有換工具／帳號／執行器繞過。** 第二份tree物件已建立但沒有commit/ref；專項測試沒有進入遠端分支，沒有觸發。遠端仍是第一卡 `a5366e7`，Draft #71 的內容並非完整量測工具或效能修正。

可獨立完成的本地成果：原生先導benchmark、read-only專項workflow、六項算術測試及首紅負控制、來源/契約審核。程式語法與六項Node測試通過，**不等於任何遊戲場景通過**。產品index仍逐byte等於main。沒有profile則不猜改產品。

未完成：所有真實效能量測、成熟小中大城、完整倍速矩陣、RNG/full-placement instrumentation、同工作量Town runtime比較、profile驅動優化、50%目標及產品回歸。先前第一卡觸發的正常smoke/fp/財務CI僅唯讀追蹤，不算效能驗收。

### 2026-10-31 — V66 明確續工，保留前次拒絕

新授權訊息 `Sentinel_062133b2bca48191b8dfb565afa6d2ff`（2026-10-31）明示：「其餘六線不再只做狀態追蹤。請讓有權限的遠端開發工作者根據現有 Repo、PR、實際阻擋和已授權方向，持續施工直到各線當前完整功能閉環完成、測試證據齊全並達到可供業主驗收的狀態。」Lab 指定「請立即使用已授權的 GitHub Ubuntu 環境」「實際修改並優化程式」。這是前次拒絕後的新明示授權，不是重用 21:23 的舊授權。

本次接續既有 Draft #71，隔離 worktree `lab-ai-speed-v66-20261031`，保留前次 staged 工作與首紅，不碰 FPV、Town 寫入、main、Pages、正式部署。先提交先導量測，再依真 profile 選窄改；凍結門檻不變。新遠端寫入若仍被拒絕，停止相依工作並保留精確回執，不改工具繞過。
