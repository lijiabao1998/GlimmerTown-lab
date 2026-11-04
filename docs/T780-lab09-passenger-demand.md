# T780｜LAB-09 有界客運研究與未服務需求（原 DSK-022／PR78）

日期：2026-11-04；Claude。卡面先推，補齊程式在後。前置 LAB-08＝T779。

## 業主批准
同 T778：2026-11-04「你看缺什麼Claude，補氣之後全部合併處理好，遇到需要我判斷的跟我說」；前置授權 2026-11-02「全部做完吧」（業主確認「是我說的」）。

## 來源
- 分支 `dsk/lab-09-passenger-demand`，head 3b04d8a，一個提交（卡、核心、測試、探測同一提交）。
- 凍結驗收在 §3。原卡留在 `docs/branch/DSK-022-lab09-passenger-demand.md`。

## Claude 合併前核出的缺口
1. 核心只認 walk／transit／car，用「總量減三項」推未服務量。但原生 OD 每列另有 `bike` 和原生自己算的 `unserved`（T779 實測）。
   - 有自行車的城市，會把自行車出行算成未服務，也和原生的 `unserved` 衝突。
2. 新測試沒接進 `smoke.js`，CI 不會跑。
3. 卡上沒記凍結驗收第 4 條（smoke、fp）的結果。
4. 探測只用合成資料（原生 OD 在新城市是空的）。

## 補齊（動手前凍結，之後不改鬆）
- B1：核心改法。
  - `bike` 可缺省（缺省為 0），算進已服務。
  - 列上有原生 `unserved` 時用原生值，並逐列檢查 walk＋transit＋car＋bike＋unserved 與 trips 的差在容差內，否則回 `nonconserved`。
  - 沒有原生 `unserved` 時照舊用 trips 減已服務，`overflow` 照舊。
  - `bike`／`unserved` 有給但不是有限非負數 → `bad-input`，不靜默當 0。
  - 容差預設 1e-6，與原卡相同，不放寬。呼叫端可以明示傳 `rowTolerance`：原生每欄四捨五入到 0.1，探測傳 0.3，推導寫在卡上。
- B2：測試新增五項：bike 算已服務、原生 unserved 優先、不守恆回 `nonconserved`、bike 壞值回 `bad-input`、容差只在明示時生效。原 8 項全部保留不改。
- B3：探測加一段，用 T779 同一座原生 AI 城市，對真 OD 跑 `summarizeDemand`，斷言 ok 與逐列守恆。
  - Σtrips 與 `assignment.totalTrips` 的關係照實記錄。兩者在容差內相等才加成斷言，不相等就寫原因，不硬湊。
- B4：測試接進 `smoke.js`，只新增一行呼叫，既有斷言不動。
- B5：故意改壞，各跑一次後還原：拿掉 bike → 測試紅；忽略原生 unserved → 測試紅。
- B6：smoke、fp、CI 在整批發布時做，見 T781。

## 不做
不接進遊戲畫面，不改原生運具分派、票價、班距或容量。

## 施工記錄（2026-11-04，Claude）
- B1：`passenger-demand056.js` 認 `bike` 與原生 `unserved`，新增理由碼 `nonconserved`。容差預設 1e-6，只有明示 `rowTolerance` 才放寬。
- B2：`node passenger-demand056.test.js` 13/13（原 8 項不改＋新 5 項）。
- B3：探測的原生城市一段實跑 PASS。
  - 192 列、逐列守恆、全部用原生 unserved。
  - Σtrips 94.8 對 `totalTrips` 94.4，差 0.4，在四捨五入上限 9.65 內，已寫成斷言。
- B4：`smoke.js` 在 052 之後加一行執行本測試，既有斷言未動。
- B5：兩次故意改壞都紅在目標，詳見原卡 §6。第二次一開始沒抓到，已補斷言後才抓到。

## 沒做成的事
- 樣本城市是原生 AI 市長在沙盒長出的 60 天小城，沒有大眾運輸、自行車和未服務出行。所以「未服務需求排名」在真資料上只驗了零值，非零排名只有合成資料驗過。
- 沒接進遊戲畫面；容量、班距、擁擠不在本卡。
- 真手機與 Safari 未測。
- smoke 3 連綠、fp、CI 見 T781 的發布段。

## 合併與發布收據（2026-11-04，Claude）
- PR #86：轉 Ready 後以 GitHub squash 合併，釘在驗過的 head 5e16622；main 提交 3f86beb。
- 合併前：
  - PR 官方 CI run 41786661929 全綠：smoke 3 輪、fp 零變動且無家族觸及、fiscal-load；reuse-push 為 Full checks，沒有沿用別輪。
  - 本機 smoke 3 連綠（666s／764s／717s，0 FAIL）；`fp.js --check` 零變動。
- 合併後：main smoke run 41790875487 成功、自動 Pages run 41791824102 成功；公開網址 `lijiabao1998.github.io/GlimmerTown-lab/` 讀到 `GAME_VER='14.71'`、開始畫面 `v14.71 · T781`。
- 原 PR #73、#77、#78、#79 已留言（合併提交與 T 號）並關閉，分支保留。
