# T782｜LAB-03 真道路配送與合法交付（原 DSK-018／PR74，經整合 PR84）

日期：2026-11-04；Claude。卡面先推，補齊程式在後。隔離研究版：玩家看不到，不進正式經濟與存檔。

## 業主批准
- 2026-11-04 原話：「你看缺什麼Claude，補氣之後全部合併處理好，遇到需要我判斷的跟我說」。
- 同日選項：
  - LAB-03／05／06／07 選「先合成隔離研究版」：玩家看不到，正式玩法另批；Claude 修缺陷、補完沒做到的驗收，然後一次發布。
  - 合併路線選「整合版 #84」。
  - 守衛變更只批准「052 投影器擴充」，W10 不批准。
- 見 `docs/DECISIONS.md` 2026-11-04。

## 來源
- 整合分支 `dsk/lab-integration`（PR84，head 305cf15）裡的 053 區塊與 `road-delivery053*.js`、`probeRoadDelivery053.cjs`。
- 原卡 `docs/branch/DSK-018-lab03-road-delivery.md`；卡面 505bfbb 先於程式 55d79a1。

## 原卡凍結驗收中沒做到的
- 第 4 條「兩個真物流建築之間規劃出一條真道路路徑」：探測只鋪一段空路，沒有放任何建築；執行期也不認得建築或前接。
- 第 4 條「閥門關閉時整幀與改前逐位相同」：沒有整幀比對。
- 第 4 條「載入／新世界／pagehide 會取消任務」：PR 沒有實測。

## 審查找到的缺陷
1. 面板沒有「未保存」提示，方向檔要求要有。
2. 執行期把不合法的數量（0、-3、2.5、'5'、null）靜默改成 1，純核心卻會拒絕；12 項測試只測核心那份。
3. 任務進行中再 `start()`，會用同一個批次號靜默換掉舊任務。
4. 閥門在安裝時就開著，仍照樣改寫全域 `load`／`newWorld` 並掛 `pagehide`。
5. 讀檔時面板不會移除；`snapshot()` 回傳共用的 `provenance` 物件。

## 補齊（動手前凍結，之後不改鬆）
- B1：執行期加 `startBetween(originRoot, destinationRoot, batch)`。
  - 兩端都必須是物流建築的根格：k 在原生 `LOGISTICS_META485` 裡，目前是 165–174。
  - 起點集合與終點集合各用原生 `sanRoadSeeds445(rootIdx)` 取前接道路格，做多源 BFS（鄰居順序固定）。
  - 回傳的路徑第一格屬於起點的前接、最後一格屬於終點的前接。
  - 錯誤理由各自分開：`not-logistics`、`no-frontage`、`unreachable`。
- B2：執行期與核心對不合法輸入給相同的理由（`bad-input`），不再靜默改值。任務進行中再開始 → `busy`，不換掉舊任務。
- B3：安裝當下 `__noRoadDelivery053` 已經開著 → 整段不安裝（不改寫 `load`／`newWorld`、不掛 `pagehide`），API 一律回 `disabled`。
- B4：讀檔、開新城、pagehide 都會取消任務並移除面板；`snapshot()` 回傳深拷貝。
- B5：面板顯示「未保存：重新整理或讀檔就會消失」；四個 LAB 面板的位置互不重疊。
- B6：新增 Node 測試，用 `vm` 跑「執行期那份」檔案，與核心逐案比對，包括相同的不合法輸入理由與 BFS 路徑。接進 `smoke.js`。
- B7：Chrome 探測（固定種子沙盒，原生開發者沙盒解鎖工具）：
  - 放兩棟有前接的物流建築，用真道路連通，`startBetween` 成功；
  - 路徑兩端分別貼兩棟建築的前接；逐步走到 `DELIVERED`，數量全程不變；
  - 沒有前接的建築回 `no-frontage`；
  - 實測讀檔與開新城會取消任務；
  - 安裝時就關閥門 → 全域 `load` 仍是原生那一支。
- B8：每條新斷言都故意改壞試過，首紅落在目標，跑完還原。
- 整幀比對、fp、smoke、CI、發布見 T785。

## 不做
不改正式經濟、存檔、交通規則（單行道、車流、號誌屬［等業主］）、放置規則；不註冊新站別。

## 施工記錄（2026-11-04）
- 施工：Claude 派代理在獨立工作樹做 B1–B8（提交 04912c5、e2530f4、0ae73a0、c518253），Claude 收進工作分支後逐項重跑；
  面板位置在整合時改成四格統一（b820cde）。
- B1：`startBetween(originRoot, destinationRoot, batch)`。
  - 兩端必須是 `LOGISTICS_META485` 裡的根格，否則 `not-logistics`（`side` 指出哪一端）；
  - 前接一律用原生 `sanRoadSeeds445`，空的回 `no-frontage`；
  - 多源 BFS（上、右、下、左），找不到 `unreachable`，超過 `maxSteps` 回 `too-far`；
  - 回傳的路徑第一格屬於起點前接、最後一格屬於終點前接。
- B2：執行期與核心用同一份 `validateBatch`，不合法一律 `bad-input`（`detail` 指出哪一欄），不再靜默改值；進行中再開回 `busy`。
  - 代理的突變測試抓到一個真 bug：沒給 `commodityId` 時存成 `null`，再驗一次就被拒（`start()` 會丟例外）。已修，`null`＝未指定（e2530f4）。
- B3：安裝當下閥門已開 → 只裝一律回 `disabled` 的介面，不改寫 `load`／`newWorld`、不掛 `pagehide`。
- B4：讀檔、開新城、pagehide 取消任務並移除面板；`snapshot()` 深拷貝。
- B5：「未保存」提示；面板放左欄第 1 格（LAB-03＝0、LAB-05＝1、LAB-06＝2、LAB-07＝3），格高 `(100vh-120px)/4`、間隔 8px。
  - 原本兩個代理各排各的：這張是固定 200px 高，LAB-06 在右上，手機寬度下會疊在一起，所以整合時統一。
- B6：
  - `road-delivery053.test.js` 24 條（另 14 個內建突變）；
  - `road-delivery053-runtime.test.js` 用 `vm` 跑內嵌那份，17 條、18 個內建突變，原生 `sanRoadSeeds445` 從 index.html 取出來用；
  - 兩支都接進 `smoke.js`。
- B7：`probeRoadDelivery053.cjs` PASS（P053-01…15、21…24；本機 86 秒）。
  - 固定種子 20261104、原生開發者沙盒，地圖 72×72；放真建築、鋪真路；
  - `startBetween` 走 7 步到 `DELIVERED`，數量不變；
  - `no-frontage`、`unreachable`、`not-logistics` 各自回報；
  - pagehide、讀檔、開新城都取消（理由 `pagehide`／`load`／`new-world`）；
  - 安裝期關閥門那一段：`load`／`newWorld` 呼叫鏈裡沒有 053、沒有 053 的 pagehide 監聽。
- B8：Chrome 突變 20／20、Node 內建突變 32 個，首紅都落在目標（代理回報，Claude 抽查 Node 那份重跑一致）。
- 整幀比對、fp、smoke、CI、發布：見 T785。

## 沒做成的事
1. 053 自己的 `step()` 不重讀地格：任務被別的程式推進時，路被拆了也照走。T785（LAB-07）在呼叫 `step()` 之前自己檢查下一格；單獨用 053 時沒有這層檢查。
2. 這次改了既有呼叫方式：`start()` 必須給 `batchId` 與 `qty`；`commodityId` 不再預設 `'food'`；`plan()`／`open()` 在裝好後才開的閥門下也回 `disabled`；`refresh()` 改回物件。main 上沒有其他呼叫端，但記在這裡。
3. 手機版面在 Chrome 的手機尺寸模擬下核過，沒有在真手機與 Safari 上測。
4. 面板高度在 1280×657 只有約 134px，內容超過時要捲動。

## 合併收據（2026-11-04，Claude）
- 經 PR #87（squash 提交 0401801）合進 main，v14.72；CI、Pages、公開網址見 T785 卡的收據。
- 原 PR #74 留言註明被 #87 取代後關閉，分支保留。
