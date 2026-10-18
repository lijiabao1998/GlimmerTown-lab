# GPT-034：相同樹的 PR 重用完整分支 CI 證據

- 日期：2026-10-18
- 起點：origin/main `1bf22ad7d6d533f8dfdf4480209a9a4b29c6fea6`
- 分支：`gpt/ci-deduplicate-20261018`
- 狀態：卡面先推；CI／守門改動，只開 `[等業主]` draft PR，禁止自行合併
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
- [ ] fp：交 CI 驗證；沒有宣告任何美術家族變動
- [x] 美術各狀態／逃生閥：不適用，沒有改遊戲或美術
- [ ] 新守門 helper 的正反向破壞測試
- [ ] smoke 3 次與完整財務回歸：交 CI 驗證
- [x] 未跑不記為通過
