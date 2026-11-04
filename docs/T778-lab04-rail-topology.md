# T778｜LAB-04 k166／原生鐵路拓撲唯讀診斷（原 DSK-017／PR73）

日期：2026-11-04；Claude。卡面先推，補齊程式在後。

## 業主批准
- 2026-11-04 業主原話：「你看缺什麼Claude，補氣之後全部合併處理好，遇到需要我判斷的跟我說」。
- 範圍問答選「也包括另外 8 個」，見 `docs/DECISIONS.md` 2026-11-04 兩列。
- 前置授權：2026-11-02 業主對 DeepSeek 說「全部做完吧」。業主 2026-11-04 確認「是我說的」。

## 來源
- 分支 `dsk/lab-04-rail-topology`，head 0e83454，共三個提交。
- 卡面 807469e 先於程式 ceea8bb。
- 原卡留在 `docs/branch/DSK-017-lab04-rail-topology.md`，內文保留原號。

## Claude 合併前核出的缺口
1. 原卡 §7.6 第 5 條說 `GV` 沒有暴露 `mobilitySnapshot462`。這是錯的：main 的 `GV.t462()` 就是 `mobilitySnapshot462()`。
   - 凍結驗收第 1 條要求「`mobilitySnapshot462().rail.stations` 對該建築不增加」，探測卻改用 `mobilityAt462` 間接判。
2. 這個間接判法分不出真車站。Claude 2026-11-04 在沙盒實測：真火車站（k17）的 `mobilityAt462` 回報同樣沒有 `rail` 欄位（kind building、frontage 1）。
   - 所以「沒有 rail 欄位＝不是站」，連真車站也會判成不是站。D2 的證據是空的。
3. PR 標題存成亂碼。

## 補齊（動手前凍結，之後不改鬆）
- B1：探測直接量 D2。放 k166 前後各讀一次 `GV.t462().rail.stations`，斷言長度不變。
- B2：正對照。同一沙盒在真軌旁放一座 k17 火車站，`rail.stations` 長度必須 +1，證明這個量法抓得到車站。正對照不成立，探測就紅。
- B3：原本 `mobilityAt462` 的回報保留為事實紀錄，但 D2 的判定改由 B1＋B2 決定。原卡 §7.6 第 5 條的錯誤說法更正。
- B4：故意改壞，各跑一次後還原：
  - 把 B1 改成拿「放了車站之後」的數字比 → 探測必須紅在 D2；
  - 不放正對照車站 → 必須紅在正對照。
- B5：本機探測 PASS。smoke 3 連綠、`fp.js --check` 零變動、CI 在整批發布時做，見 T781。

## 不做
不改 `index.html` 的玩法，不註冊站別，不改放置規則。原卡 §4 的提案（真前接、站別註冊）照舊列 [等業主]。

## 施工記錄（2026-11-04，Claude）
- B1、B2：`probeRailTopology04.cjs` 加 `railStations()`（讀 `GV.t462().rail.stations`）與 k17 正對照。本機 Chromium（`/opt/pw-browsers/chromium-1243`）實跑 PASS：`d2Direct = {before:0, afterHub:0, control:{k:17, built:true, after:1, railField:false}}`。
- B3：verdict 的 `D2_not_a_station` 改由上面兩個數字決定；原卡 §7.6 第 5 條更正寫在原卡 §8。
- B4：兩次故意改壞都紅在目標（訊息原文見原卡 §8），已還原。
- 原卡的 D1、D3 判定與 index.html 都沒動。

## 沒做成的事
- 原卡 §7.6 第 1～4、6 條照舊：沒改放置規則、沒註冊站別、沒有貨運列車、營業判定只有靜態佐證、真手機與 Safari 未測。
- smoke 3 連綠、fp、CI 見 T781 的發布段。

## 合併與發布收據（2026-11-04，Claude）
- PR #86：轉 Ready 後以 GitHub squash 合併，釘在驗過的 head 5e16622；main 提交 3f86beb。
- 合併前：
  - PR 官方 CI run 41786661929 全綠：smoke 3 輪、fp 零變動且無家族觸及、fiscal-load；reuse-push 為 Full checks，沒有沿用別輪。
  - 本機 smoke 3 連綠（666s／764s／717s，0 FAIL）；`fp.js --check` 零變動。
- 合併後：main smoke run 41790875487 成功、自動 Pages run 41791824102 成功；公開網址 `lijiabao1998.github.io/GlimmerTown-lab/` 讀到 `GAME_VER='14.71'`、開始畫面 `v14.71 · T781`。
- 原 PR #73、#77、#78、#79 已留言（合併提交與 T 號）並關閉，分支保留。
