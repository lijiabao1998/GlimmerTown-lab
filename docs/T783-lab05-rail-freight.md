# T783｜LAB-05 第一條兩站實載貨運鐵路（原 DSK-019／PR75，經整合 PR84）

日期：2026-11-04；Claude。卡面先推，補齊程式在後。隔離研究版：玩家看不到，不進正式經濟與存檔。前置 LAB-04＝T778。

## 業主批准
同 T782（2026-11-04：先合成隔離研究版、走整合版 #84、批准 052 投影器擴充）。

## 來源
- 整合分支 `dsk/lab-integration`（PR84）裡的 054 區塊與 `rail-freight054*.js`、`probeRailFreight054.cjs`。
- 原卡 `docs/branch/DSK-019-lab05-rail-freight.md`；卡面 861a010 先於程式 8844ac5。
- 原卡定義：車站＝貼著真軌的 k166。

## 原卡凍結驗收中沒做到的
- 第 3 條「真城市兩個 k166（同一條鐵軌連通分量上、貼軌）之間跑完一列」：
  - 只有一次本機實跑寫了 `bothPlaced:true`，探測在 false 時照樣 PASS；
  - 地形是隨機的（`newWorld` 的種子取自 `Math.random`）；
  - 執行期完全不檢查車站。
- 第 3 條「整幀比對」「載入／新世界／pagehide 取消」：沒有實測。

## 審查找到的缺陷
1. 不合法的容量（0、-1、'x'）被靜默改成 12。
2. 面板和 LAB-03 的疊在同一個右下角。
3. 沒有「未保存」提示。
4. 與 LAB-03 相同的安裝期問題：閥門開著仍改寫全域函式。
5. 測試只測核心那份，沒測內嵌的執行期那份。

## 補齊（動手前凍結，之後不改鬆）
- B1：執行期加 `runBetween(originHubRoot, destinationHubRoot, batch)`。
  - 兩端都必須是 k166 的根格（`not-hub`）。
  - 佔地四鄰至少有一格真軌（`hub-not-on-rail`）。
  - 兩端的貼軌格在同一個鐵軌連通分量上，沿真軌找得到路徑（`unreachable`）。
  - 路徑第一格貼起點、最後一格貼終點。
- B2：容量與數量不合法 → `bad-input`，與核心相同；超過容量 → `over-capacity`。任務進行中再開 → `busy`。
- B3：與 T782 B3 相同：安裝當下閥門已開 → 整段不安裝。
- B4：與 T782 B4 相同：讀檔、開新城、pagehide 取消並移除面板；`snapshot()` 回傳深拷貝。
- B5：面板顯示「未保存」提示，位置不與其他 LAB 面板重疊。
- B6：`vm` 跑執行期那份，與核心逐案比對；接進 `smoke.js`。
- B7：Chrome 探測（固定種子 `newWorldSeeded`，原生開發者沙盒）：
  - 鋪一條真軌，兩棟貼軌 k166 放在同一條軌上，`runBetween` 跑完 READY→RUNNING→ARRIVED→UNLOADED，數量不變；
  - 探測必須斷言兩棟都真的放成，放不成就紅；
  - 不貼軌的 k166 回 `hub-not-on-rail`；
  - 讀檔與開新城取消、安裝期關閥門。
- B8：新斷言故意改壞試過，首紅落在目標。
- 整幀比對、fp、smoke、CI、發布見 T785。

## 不做
不註冊站別（k166 仍不在 T462／T463 的站別集合，［等業主］）；不改客運統計；號誌與路權在 T784。

## 施工記錄（2026-11-04）
- 施工：與 T782 同一個代理、同一個工作樹（提交 04912c5、e2530f4、cc3854a、c518253），Claude 收進工作分支後逐項重跑；面板四格統一見 b820cde。
- B1：`runBetween(originHubRoot, destinationHubRoot, batch, capacity?)`。
  - 兩端必須是 k166 根格，否則 `not-hub`（`side` 指出哪一端）；
  - 貼軌格＝佔地四鄰的真軌（走訪順序同原生 `sanRoadSeeds445`），空的回 `hub-not-on-rail`；
  - 兩端貼軌集合沿真軌做多源 BFS，不在同一個連通分量上就 `unreachable`，超過 `maxSteps` 回 `too-far`；
  - 路徑第一格貼起點、最後一格貼終點。
- B2：`validateCargo` 執行期與核心同一份：不合法一律 `bad-input`（`detail` 指出欄位，含 `capacity`），超過容量 `over-capacity`；進行中（READY／RUNNING／ARRIVED）再開回 `busy`。
- B3、B4：同 T782（安裝期閥門整段不裝；讀檔、開新城、pagehide 中止並移除面板；快照深拷貝）。
- B5：「未保存」提示；面板在左欄第 2 格。
- B6：`rail-freight054.test.js` 26 條（另 15 個內建突變）、`rail-freight054-runtime.test.js` 17 條＋19 個內建突變；都接進 `smoke.js`。
- B7：`probeRailFreight054.cjs` PASS（P054-01…15、21…24；本機 91 秒）。
  - 固定種子、原生開發者沙盒；四棟 k166 與一棟 k165 都斷言真的放成；
  - A→B 沿真軌 5 步：READY→RUNNING×4→ARRIVED→UNLOADED，數量 12／容量 12 不變；
  - `hub-not-on-rail`、`unreachable`、`not-hub` 各自回報；容量與數量的壞輸入都回 `bad-input`；
  - pagehide、讀檔、開新城都中止（`pagehide`／`load`／`new-world`）；
  - 安裝期關閥門：呼叫鏈與 pagehide 監聽裡沒有 054。
- B8：Chrome 突變 20／20、Node 內建突變 34 個，首紅都落在目標（代理回報；Node 那份 Claude 重跑一致）。
- 整幀比對、fp、smoke、CI、發布：見 T785。

## 沒做成的事
1. 054 自己的 `step()` 不重讀地格：路線被拆了照走。T784（LAB-06）的 `advance()` 會讀真軌；LAB-07 的鐵路段由 055 判軌、054 只跟著同步。單獨用 054 時沒有這層檢查。
2. k166 仍不是站別（T462／T463 的站別集合沒動，［等業主］）。
3. 既有呼叫方式的改變同 T782 第 2 條（`start()` 必須給 `batchId`／`qty`、`commodityId` 不預設等）。
4. 真手機與 Safari 沒有測。
