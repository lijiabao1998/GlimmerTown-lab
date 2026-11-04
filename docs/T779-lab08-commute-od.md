# T779｜LAB-08 原生通勤 OD 來源研究（原 DSK-021／PR77）

日期：2026-11-04；Claude。卡面先推，補齊程式在後。

## 業主批准
同 T778：2026-11-04「你看缺什麼Claude，補氣之後全部合併處理好，遇到需要我判斷的跟我說」；前置授權 2026-11-02「全部做完吧」（業主確認「是我說的」）。

## 來源
- 分支 `dsk/lab-08-commute-od`，head e486694，共兩個提交。
- 卡面 9efcb55 先於程式 e486694。
- 原卡留在 `docs/branch/DSK-021-lab08-commute-od.md`。

## Claude 合併前核出的缺口
1. 凍結驗收第 1 條要求「讓城市自然跑幾個模擬日後 `t468().assignment.totalTrips > 0`」，實測是 0（新城市沒有人）。探測沒有檢查這條，照樣報 PASS。
2. 原卡說 OD 列是 `{origin, destination, purpose, trips, walk, transit, car}`，這是讀程式碼得出的。
   - Claude 2026-11-04 用原生 AI 市長養的沙盒城市實測，每列還有 `unserved`、`distance`、`bike` 三欄。

## 補齊（動手前凍結，之後不改鬆）
- B1：探測先用固定種子開新城（`GV.newWorldSeeded(20261104)`），只打開遊戲原生的 AI 市長（`GV.ai(true)`），用 `GV.step` 推進 60 天。
  - 城市與人口全由原生 AI 與原生模擬產生；探測不寫任何地格、居民、工作或資料欄位。
  - 這是落實原卡「讓城市自然跑」；「不造人口／工作」的界線照舊，探測本身不造。
- B2：斷言 `totalTrips > 0` 與 `od.length > 0`（凍結驗收第 1 條原文），並記下第一列的實際欄位集合。
- B3：唯讀證明放在讀取階段：讀取前後 `localStorage` 逐鍵逐值相同（原本只比長度），連讀兩次 `t468`／`t491` 深度相等。探測原始碼仍不准出現重算呼叫。
- B4：卡上更正 OD 列欄位。
- B5：故意改壞一次後還原：不推進天數 → 探測必須紅在 `totalTrips > 0`。
- B6：smoke、fp、CI 在整批發布時做，見 T781。

## 不做
不呼叫 `recomputeCommute`，不改產品，不寫業主的存檔。

## 施工記錄（2026-11-04，Claude）
- B1–B3：`probeCommuteOd08.cjs` 先用原生 AI 市長養城 60 天，再在讀取階段做唯讀證明（`localStorage` 逐鍵逐值）。
  - 原本的空轉等待拿掉：它佔住主執行緒，城市根本不會前進。
- 本機 Chromium 實跑 PASS：第 61 天、人口 680、`totalTrips` 94.4、OD 192 列。
  - 連讀兩次相同；`localStorage` 3 個鍵逐值不變。
  - 人口與我早先另一次實驗逐位相同，固定種子可重現。
- B4：原卡新增 §7，更正 OD 列欄位（多 `unserved`、`distance`、`bike`）。
- B5：不推進天數 → 紅在「凍結驗收 1：城市自然跑 0 天後 totalTrips 必須 > 0，實際 0」，已還原。

## 沒做成的事
- 沒有格級 OD：原生只到街區級，照原卡結論不改產品去補。
- 樣本城市由原生 AI 市長在沙盒長出，不是業主的真存檔；60 天的城市沒有大眾運輸與自行車設施，所以 `transit`、`bike`、`unserved` 都是 0。
- 真手機與 Safari 未測。
- smoke 3 連綠、fp、CI 見 T781 的發布段。

## 合併與發布收據（2026-11-04，Claude）
- PR #86：轉 Ready 後以 GitHub squash 合併，釘在驗過的 head 5e16622；main 提交 3f86beb。
- 合併前：
  - PR 官方 CI run 41786661929 全綠：smoke 3 輪、fp 零變動且無家族觸及、fiscal-load；reuse-push 為 Full checks，沒有沿用別輪。
  - 本機 smoke 3 連綠（666s／764s／717s，0 FAIL）；`fp.js --check` 零變動。
- 合併後：main smoke run 41790875487 成功、自動 Pages run 41791824102 成功；公開網址 `lijiabao1998.github.io/GlimmerTown-lab/` 讀到 `GAME_VER='14.71'`、開始畫面 `v14.71 · T781`。
- 原 PR #73、#77、#78、#79 已留言（合併提交與 T 號）並關閉，分支保留。
