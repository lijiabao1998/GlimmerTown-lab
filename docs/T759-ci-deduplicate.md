# T759：相同樹的 PR 重用完整分支 CI 證據（原 GPT-034）

- 日期：2026-10-18
- 起點：origin/main `1bf22ad7d6d533f8dfdf4480209a9a4b29c6fea6`
- 分支：`gpt/ci-deduplicate-20261018`
- 狀態：卡面先推；初始 `[等業主]` draft PR #41。2026-10-18 07:22 UTC 業主明確批准轉 Ready、合併及核驗既有 Pages；正在準備合併發布，必須先驗最後 head CI。
- 業主原話：2026-10-18「優化一下」，承接去掉 Lab 同一提交重複執行的建議。

## 目標與現況

現行 smoke workflow 同時對 writer branch push 與 PR 執行 smoke（3 次）、fp、fiscal-load。每次 push 的 fp-rebake 是既有美術流程的來源，必須完整保留。main 與 Pages 的驗證及發布條件不可改動。

只在 PR 的合併樹與 head 樹完全一致、而且有可驗證的同一 head SHA 完整 push 成功證據時，省去重複的瀏覽器測試。任何不確定都回退原本完整 PR 測試，不能樂觀跳過。

## 範圍

只改 `.github/workflows/smoke.yml`、新增 CI 證據 helper／其單元測試、此卡。fp 家族：無。禁止改玩法、美術、package、既有斷言或門檻、權限、倉庫設定、規則、版本、日誌、fp/style 基線、Pages。

## 驗收條件（施工前凍結）

1. 分支 push 保留全部原有測試與 artifacts；main／claude 的原有執行差異、workflow_dispatch 與 Pages 不變。不取消其他 run，不增加任何 token 權限。
2. 重用僅限同倉庫、有 push 觸發的非 main／非 claude writer branch PR。PR base 必須已是 head 祖先，PR merge commit 的 tree 必須逐位等於 head tree，checkout 與預期 merge SHA 必須相同。
3. source 必須是同分支、同 head SHA、同 smoke workflow ID／path／內容版本的 push run，已 completed/success；smoke、fp、fiscal-load 各自必須已成功，必需的原始測試步驟也要成功。不得使用同名假 check、其他 workflow、pending/skipped/cancelled/missing job。
4. push fp 記錄的實際 base SHA 必須與 PR base SHA 相同，避免排隊期間 main 變動造成基線錯配。
5. 決定重用前重新讀 GitHub PR 的 base/head/merge SHA、source 最新 attempt 與 jobs；每個原名工作都做輕量二次確認。任何證據缺失、API 拒絕／中斷、逾時或 base/head 改變，執行原有完整 PR 測試。
6. 等待 push 最長 25 分鐘；API 次數與每次 timeout 有界。summary 留 source run URL／SHA／tree／base／workflow 版本／job provenance；不輸出 token。
7. helper 單元測試含完整正例及負例：錯 branch/tree/workflow/version、偽成功、缺 job、跳過／取消／失敗／等待、API outage、PR 與 source attempt race、逾時。故意破壞時必須回退 full；helper tests 在 CI 也執行。
8. 不在本機跑遊戲；smoke/fp/fiscal 交 GitHub CI。最後提交的 branch 與 PR CI 結果、連結、實測重用或安全回退寫進 PR／卡面，不能把未跑寫通過。

## 回滾

由 main 寫入者 revert 本卡實作提交，恢復原本 push＋PR 全跑。此分支不合併就不影響 main。

## 施工紀錄

- 2026-10-18：讀 AGENTS、AUTORUN、CLAUDE、DECISIONS、不改壞標準；fetch 後檢查所有遠端 GPT 卡，032 已使用，033 預留給獨立美術工作，034 用於本卡。
- 基準：原 workflow 有 smoke／fp／fiscal-load，時限 15／15／25 分鐘。main 與 Pages 檔案保持原樣。未在本機執行遊戲測試。
- GitHub 官方 API 參考：https://docs.github.com/en/rest/actions/workflow-runs 、https://docs.github.com/en/rest/actions/workflow-jobs 、https://docs.github.com/en/actions/reference/workflows-and-actions/contexts 。
- 沒做成的事：實作與 CI 驗證尚未進行；本卡沒有遊戲樣張。

## 不改壞標準 §8

- [x] 驗收條件於施工前固定；卡面單獨提交並先推後施工
- [x] 同種子／舊存檔：不適用，沒有改玩法或存檔
- [x] 初版 head 6ae1f97 的 fp CI 零變；發布 metadata head 必須重新驗證，結果補 PR #41；沒有宣告任何美術家族變動
- [x] 美術各狀態／逃生閥：不適用，沒有改遊戲或美術
- [x] 新守門 helper 的正反向破壞測試：126 項通過（本機 Node v24.19.0；CI 使用 Node 22）
- [x] 初版 head 6ae1f97 的 push smoke 3 次、完整 fiscal-load 都成功；發布 metadata head 必須重新驗證，結果補 PR #41
- [x] 未跑不記為通過

### 實作驗證（2026-10-18）

- 新增 PR-only `reuse-push` 證據 gate；原 `smoke`／`fp`／`fiscal-load` check 名稱不變，逐 job 再查證據後才跳過耗時步驟。缺少輸出或 helper 出錯會全跑。
- 原 push／main／dispatch 測試命令、時限、artifacts、並發群組、既有權限保持；`pages.yml`、遊戲及所有既有守衛檔零變更。
- helper tests：`node --test .github/scripts/reuse-push-ci.test.cjs`，126 pass／0 fail／0 skipped。包含 API outage／權限拒絕、假同名成功、實際測試未跑、錯 baseline、PR／source attempt race、25 分鐘上限、真 Git tree／ancestor fixture。
- YAML 經 PyYAML 解析，`git diff --check` 通過；未執行本機遊戲測試。
- Fiscal job 的既有 token 只有 contents:read；若讀證據被拒絕，保守全跑該 job，不擴權。
- 沒做成的事：GitHub branch／PR CI 尚待實測；省下的 runner 時間尚未量，不能先宣稱重用已成功。

### 業主批准後的合併準備（2026-10-18 07:22 UTC）

- 問題：只將 Lab PR41 從 draft 轉 Ready、合併 GlimmerTown-lab/main，保留全部測試及發布門檻，核驗既有自動 Pages。業主直接回覆：「允許」。本卡不再依無須逐次詢問的自合例外，而依這次明確批准；不涉及其他倉庫／PR。
- 依 AGENTS §3 的合併程序，在同 PR 配 T759／v14.52／r206。只新增三處發布標記變更（GAME_VER、GAME_ANCHOR、開始畫面版本）、本卡搬名與 AUTORUN-LOG 一列；此合併階段範圍覆蓋前文「分支施工不改版本／日誌」，其餘凍結驗收沒有放寬。
- 首張卡於 [60e27fe](https://github.com/lijiabao1998/GlimmerTown-lab/commit/60e27fef225dc8b1aeacc7f9fac92b44cd93cd8e) 先推，首次實作為 6ae1f97193adc821635b02acf126920a1aa712ad；歷史不重寫。
- 初版 [完整 push 39106227844](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39106227844) 及 [PR 39106259799](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39106259799) 均成功；三個 consumer 真正重用，含既有 contents:read 的 fiscal job。
- 初版 fp 原文：「相對 base（T757 14.50）：新增 0 / 變更 0 / 移除 0 葉，觸及家族 0」；「風格分相對 base：沒有家族下降」；「OK --check：葉子、超街區指紋、棘輪、style.json 全部零變動」。與首卡 fp 家族「無」一致；沒有提交 fp/style 新基線。
- 初版 full jobs 合計 678 秒；PR gate 等待 444 秒，三個 consumer 13／16／18 秒，總計 491 秒。只記單次 job-seconds 對照，不稱為嚴格 A/B 或保證省費；PR 牆鐘 9分15秒未比 push 9分11秒快。
- 126 helper tests 的正例與負控制、真 Git tree／祖先測試、本機與 CI Node22 均成功；原 workflow 命令／門檻／權限未變，無本機遊戲測試。
- 沒做成的事：發布 metadata head 的 full push／PR、獨立合併前審查、main 全量驗證、自動 Pages 及公開 v14.52／T759 仍待實測；完成後用 PR41 記錄實際 SHA／連結，不為補自己 hash 另造 commit。
