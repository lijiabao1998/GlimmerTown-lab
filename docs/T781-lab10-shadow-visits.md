# T781｜LAB-10 車站與商業街影子到訪（原 DSK-023／PR79）＋本批發布 v14.71

日期：2026-11-04；Claude。卡面先推，補齊程式在後。前置 LAB-09＝T780。

## 業主批准
同 T778：2026-11-04「你看缺什麼Claude，補氣之後全部合併處理好，遇到需要我判斷的跟我說」；前置授權 2026-11-02「全部做完吧」（業主確認「是我說的」）。

## 來源
- 分支 `dsk/lab-10-shadow-visits`，head 7b1556c，一個提交。
- 凍結驗收在 §3。原卡留在 `docs/branch/DSK-023-lab10-shadow-visits.md`。

## Claude 合併前核出的缺口
1. 方向原文要求「真步行連接」，核心用的是曼哈頓距離近似。
2. 凍結驗收第 2 條「核心在真座標上跑出結果」沒有執行到：新城市 0 站 0 店，那段程式不會跑。
3. 「商業街店面」實際抓的是所有 k=2 商業建築。原生的商業街是 T005 高街：`HIGHSTREET005` 裡角色為 commerce 的建築（k238 合作社商店、k239 石造麵包店、k240 有蓋市場）。
4. 半徑邊界測試偏弱：把判斷放寬 1 或 2 格，8 項測試仍全綠。
5. 施工紀錄標題還寫「待補」，沒記 smoke／fp；新測試沒接進 `smoke.js`。

## 補齊（動手前凍結，之後不改鬆）
- B1：核心加 `walkDistance(x1,y1,x2,y2)`。參數順序與 `GV.path502` 相同，介面名沿用 DeepSeek 在 #84 的寫法。
  - 回傳有限的非負數才算連得上；Infinity、null、undefined、NaN 一律算不連（原卡原則「沒有路徑就算 0，不猜」）；負數回 `bad-input`。
  - 不給 `walkDistance` 時照舊用曼哈頓，原 8 項測試不變。結果標 `distanceSource`。
- B2：測試新增四項：自訂步行距離覆蓋曼哈頓（繞路變遠就不連）、到不了算 isolated、null 與 NaN 不會被當成 0、半徑邊界（d＝radius 連，d＝radius＋0.01 不連）。
- B3：探測改成真場景。
  - 固定種子新城，進遊戲原生的開發者沙盒（T516B：`enterSandbox516B`、`setGod516B`、`setOverride516B('unlockAll')`，只解鎖工具，不改模擬）。
  - 擺一段主路、一小段軌、一座 k17 火車站、三家接在主路上的高街商店（k238、k239、k240），另一家 k239 只接在一段和主路不連通的小路上。
  - 掃描地圖找車站（k∈17、21、55、139）與高街商店。commerce 角色的 k 從 `index.html` 的 `HIGHSTREET005` 機械讀出，不寫死。
  - 距離用 `GV.path502(...,'walk')`（原生 T502 步行網）。半徑取原生車站步行集水區的門檻 18（`amStationCatchment502` 的 `wd<=18`）。
- B4：探測斷言：
  - 掃到至少 1 站、4 店；
  - 接主路的三家連得上；
  - 不連通那家，原生步行判到不了（isolated），而曼哈頓距離 ≤ 18，證明真步行和近似的差別；
  - 掃描與計算階段不寫地格，`localStorage` 逐鍵不變。
  - 需求仍是合成的，照實標 `demandSource:'synthetic'`。
- B5：測試接進 `smoke.js`。
- B6：故意改壞，各跑一次後還原：walkDistance 回 null 被當成 0 → 測試紅；半徑判斷改成 d＞radius＋1 → 測試紅。

## 施工記錄（2026-11-04，Claude）
- B1、B2：`shadow-visits057.js` 加 `walkDistance`；`node shadow-visits057.test.js` 12/12（原 8 項不改＋新 4 項）。
- B3、B4：`probeShadowVisits10.cjs` 改成真場景，本機 Chromium 實跑 PASS。
  - 接主路三家：步行 7、11.09、16.24，連得上。
  - 不連通那家：原生步行到不了，曼哈頓 5 會被近似算成連得上。
  - 讀取階段 `localStorage` 與場景地格不變。
- B5：`smoke.js` 加一行執行本測試。
- B6：兩次故意改壞都紅在目標，已還原（訊息見原卡 §6）。

## 本批發布（T778–T781 一次 squash、一個版本，比照 T690–T691「一次 squash」的先例）
- R1：產品 `index.html` 只改三處版本字串到 14.71／T781（`GAME_VER`、`GAME_ANCHOR`、開始畫面版本字）。四個 PR 都不動 `index.html` 的其他任何位元組。
- R2：照 `docs/DECISIONS.md` 2026-10-28 常設規則，重釘 049／050／052 三支測試與四個釘值檔裡描述這次發布的字面值。
  - 重釘表寫在本卡。
  - 斷言運算式、控制流程、負控制、門檻、預期首紅、歷史釘值一律不動。
- R3：`AUTORUN-LOG.md` 記 r225；方向檔待辦表 LAB-04／08／09／10 的備註欄更新。
- R4：本機跑四支單元測試、四支探測、smoke 3 連綠、`fp.js --check` 零變動。
- R5：推 `ccr-e2781bc4-vlojg3`，開 PR 到 main。
  - 重釘後的新 head 完整 CI（smoke 3 輪、fp、fiscal-load）綠才合。
  - 合併用 GitHub squash，釘在驗過的 head；不 force、不 admin、不手動觸發 Pages。
- R6：合後核對 main CI、自動 Pages、公開網址版本；在 #73、#77、#78、#79 留言寫合併提交與 T 號，然後關閉。

## 發布重釘表（R2，2026-11-04）
**新值怎麼來的**：只用檔案字串替換與 SHA-256，不載入被測程式碼；推導程式在本機暫存，不提交。
- 新 index＝main 01c2249 的 index 只換三處版本字串，共 6 個 ASCII 位元組，SHA-256 `bd8a7515…eb8181`。
- 新原生基準＝新 index 用 `single-research052-source.cjs` 的 `stripPinned052` 剝掉 052 區後的雜湊。
  - 先核：舊 index 剝完正好等於舊基準 `6e140781…6fe476`。
  - 新舊兩份原生頁只差那三處（長度同為 11,133,306 位元組）。

| # | 檔案 | 欄位 | 舊值 | 新值 | 推導 |
|---|---|---|---|---|---|
| 1 | `single-research052-source.cjs`:5 | `baseline` | `6e140781…6fe476` | `d009cab2…1520570` | 上面的新原生基準；S01 `byte-exact T776 native input` 比的就是它 |
| 2 | `docs/branch/GPT-052-qa/provenance.json` | `baselineIndexSha256` | 同 #1 舊值 | 同 #1 新值 | 052 測試斷言它等於 `baseline`；`baseMain` 是 PR70 接上的 main，屬歷史，不動 |
| 3 | `shadow-cargo049.test.js`:139、`docs/branch/GPT-049-qa/release-source.json` | `release` | `{14.70, T777, 224, 70}` | `{14.71, T781, 225, 86}` | 本次發布：GAME_VER、GAME_ANCHOR、AUTORUN-LOG 輪次、PR 號 |
| 4 | 同上:140 | `approvedMain` | `dde12ad…`（T776 合併） | `01c2249…`（本 PR 接上的 main） | 照 T777 先例：批准的 main＝這次發布接上的 main |
| 5 | 同上:141 | `ownerApproval` | `DECISIONS-2026-10-28-PR70-merge` | `DECISIONS-2026-11-04-branch-PR-merge` | 本次批准出處：DECISIONS 2026-11-04 那兩列 |
| 6 | `shadow-cargo049.test.js`:131 | 註解 | `// T777 owner-approved …` | `// T781 owner-approved …` | 只是註解；T776、T777 發布時同一行也跟著改 |
| 7 | `shadow-warehouse050.test.js`:25–33、`docs/branch/GPT-050-qa/release-source.json` | `release`、`approvedMain`、`ownerApproval`、`candidateIndexSha256` | 同 #3–#5、#1 舊值 | 同 #3–#5、#1 新值 | W01 要求檔案與這份描述逐欄相同 |
| 8 | `shadow-warehouse050.test.js`:52–54 | `releaseStrings050` 每列第一個字串（目前值） | `14.70`／`T777` | `14.71`／`T781` | 本次三處版本字；每列第二個字串（T774 歷史值）不動 |

**沒有重釘的**：
- `productRole`：T777 起的描述仍是實情。
- 所有 `historical.*`、`published049.*`，以及 050 的 `provenanceSha256`（它釘的是 `GPT-050-qa/source.json`，不是 052 的 provenance.json）。
- 052 區雜湊 `blockHash`、各測試的斷言運算式、控制流程、負控制與變異清單、門檻、預期首紅訊息。

**機械核對**：
- 三支程式檔共 15 行改動，把字串、數字與註解遮掉後，改前改後逐字相同。
- 三個 JSON 只動上表的鍵。
- 新 index 用 `projectCandidate052` 驗過，得到 `d009cab2…`。

## 已知風險
既有 052 測試 W10（滾輪後只等 80 毫秒）在別的分支 CI 出現過時序紅。本批若紅在 W10，不靠重跑過關，先查原因、回報業主。

## 沒做成的事
尚未施工。
