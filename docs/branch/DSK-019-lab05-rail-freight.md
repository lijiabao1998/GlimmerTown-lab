# DSK-019｜LAB-05 第一條兩站實載貨運鐵路

- 日期：2026-11-02
- 分支：`dsk/lab-05-rail-freight`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發待辦第 5 項 **LAB-05 第一條兩站實載貨運鐵路**（前置 LAB-01 影子帳＝T775 已完成、LAB-04 拓撲診斷＝DSK-017 已完成）。
- 範圍原文：「LAB-01＋04成立；一列、有限容量」；審批邊界：「**新貨列車玩法[等業主]**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**一列貨運列車，在真的鐵軌格上，把一批貨從 A 站送到 B 站。**

- 一列、兩站、一條路徑、一批貨；不做多列排程、不做號誌、不做時刻表。
- 車站＝貼著真軌的 k166（鐵公路聯運中心）；**不新增站別註冊、不改 T462／T463 的客運統計**（那是 DSK-017 診斷列 [等業主] 的項目）。
- 不改正式經濟：不動金錢／商品庫存／人口／客流／存檔格式。
- 不改模擬數值：列車速度、班距、容量屬新玩法，實作時以「可調常數＋[等業主] 預設值」處理，並在卡上列出。

## 2. 分兩階段

- **階段 A（純核心，Node 可測）**：`rail-freight054.js`
  - `planRailRoute({rail, w, h, from, to, maxSteps})`：在真鐵軌格上做 4 鄰 BFS（與 LAB-03 的道路版同構，但吃的是 `tile.rail` 視圖）。
  - `createFreightRun054(sessionId, route, cargo, capacity)`：`READY → RUNNING → ARRIVED → UNLOADED`，容量上限、貨量守恆、終態冪等、可中途 `abort`。
- **階段 B（執行期接線）**：`GV.railFreight054`，用真城市的鐵軌與兩個 k166 前接站，面板只顯示任務狀態，逃生閥 `__noRailFreight054`，載入／新世界／pagehide 取消。

## 3. 量到的現況（開工前）

| 事實 | 證據 |
|---|---|
| 真鐵軌是 `tiles[i].rail`，拓撲靠 `recalcRailMask4` → `railMask` → `MOB_RAIL_COMP462` 連通分量 | index.html 的 T462／T469 區 |
| k166 的放置只要求「半徑 6 內 ≥2 真軌」，**不是貼軌**；且不在站別集合 `[17,55,139]`（LAB-04 已量） | DSK-017 §7.2 |
| 客運載具走 `railStock469`／`SPR.trainCar`，**沒有任何貨運列車**（`freightTrain`／`cargoTrain` 0 命中） | LAB-04 §3 |
| 影子帳已有可用的批次／守恆／暫態模型 | `GV.singleResearch052`（049／050／052 共用） |

## 4. 設計

### 4.1 路線（純核心）

- 輸入：`rail`（`Uint8Array` 或 `{isRail(x,y)}`）、`w`、`h`、`from`、`to`、`maxSteps`。
- 與 LAB-03 的差別：走的是**鐵軌**，不是道路；拒絕理由同構（`from-not-rail`／`to-not-rail`／`unreachable`／`too-far`）。
- 決定性：鄰居順序固定（上、右、下、左）。

### 4.2 列車任務

- 容量：`capacity`（預設 12 件；這是新玩法常數，卡上列為 [等業主] 可調）。
- 裝載：`cargo.qty` 必須 `<= capacity`，否則回 `over-capacity`（不偷偷截斷）。
- 狀態：`READY`（已裝載未發車）→ `RUNNING`（每步前進一格）→ `ARRIVED`（到終點站）→ `UNLOADED`（卸貨完成）。
- 守恆：裝載量在整段執行中不變；`UNLOADED` 只記錄「已交付」，不憑空產生第二批貨。
- 終態冪等；`abort(reason)` 可中途取消。

## 5. 驗收條件（動手前寫死，之後不准改鬆）

1. **純核心測試** `node rail-freight054.test.js` 全綠，至少涵蓋：
   - 直線鐵軌、轉彎鐵軌、繞障礙鐵軌的路線合法性（每步 4 鄰、每格都是鐵軌、首尾正確）；
   - `unreachable`／`too-far`／端點不在鐵軌上各自的 `reason`；
   - 決定性（同輸入兩次 path 逐元素相同）；
   - 容量：`qty > capacity` → `over-capacity`；`qty == capacity` 可用；
   - 狀態機：`READY→RUNNING→ARRIVED→UNLOADED`、中途 `abort`、終態冪等、`qty` 全程不變。
2. **階段 A 零產品改動**：只新增核心＋測試檔，`index.html` bytes 不變。
3. **階段 B**：真城市兩個 k166（同一條鐵軌連通分量上、貼軌）之間跑完一列；`__noRailFreight054` 閥門關閉時整幀與改前逐位相同；載入／新世界／pagehide 取消；**fp 零變動**、**smoke 3 連綠**。
4. **守衛**：階段 B 會新增一個釘死區塊，`single-research052-source.cjs` 的投影器要同步擴充（比照 DSK-018 的做法：仍是逐 byte、baseline 不變），並在卡上標明需要業主確認。
5. 卡上「沒做成的事」照實寫。

## 6. 回滾

- 階段 A：只新增檔案，`git revert`。
- 階段 B：接線全在 `__noRailFreight054` 之後，關閉時與 `origin/main` 逐位相同。

## 7. 施工紀錄

### 7.1 階段 A（純核心）已完成

- 新檔 `rail-freight054.js`（UMD：Node `module.exports`＋瀏覽器 `globalThis.railFreight054`）。
- API：`planRailRoute({rail,w,h,from,to,maxSteps})`、`validateRoute(path,rail,w,h)`、`createFreightRun054(sessionId,route,cargo,capacity)`。
- 常數：`DEFAULT_CAPACITY = 12`（新玩法常數，列 [等業主] 可調）。
- 狀態機：`READY → RUNNING → ARRIVED → UNLOADED`；`unload()` 只能在 `ARRIVED`；任何時候 `abort(reason) → ABORTED`；終態冪等；`qty` 全程不變；`qty > capacity` 直接 `over-capacity`（不偷偷截斷）。

### 7.2 測試（`node rail-freight054.test.js`）

```
ok  直線鐵軌：6×1，0→5 走 5 步
ok  轉彎鐵軌：L 形，每步相鄰且都在軌上
ok  繞障礙鐵軌：第 0 列缺口，必須繞第 2 列
ok  不可達：終點被非鐵軌隔開
ok  太遠：maxSteps 不足回 too-far
ok  端點不在鐵軌上：from-not-rail／to-not-rail
ok  決定性：棋盤式多條等長路線，兩次規劃逐元素相同
ok  容量：qty==capacity 可用，qty>capacity 回 over-capacity
ok  狀態機：READY→RUNNING→ARRIVED→UNLOADED，qty 全程不變
ok  未到站不能卸貨
ok  中途 abort：ABORTED，之後 step／unload 都不再前進
ok  終態冪等：UNLOADED 之後 step／abort 不變
ok  守衛：validateRoute 抓對角線、非鐵軌、空路線

RAIL_FREIGHT_054 {"checks":13,"ok":true}
```

### 7.3 沒做成的事（照實）

1. **階段 B 還沒接線**：`index.html` 尚未裝上 `GV.railFreight054`；那一步會新增一個釘死區塊，需要同步擴充 `single-research052-source.cjs`（比照 DSK-018），並在卡上標明需要業主確認。
2. **沒有站別語意**：兩站目前只是兩個貼軌的 k166；k166 不在 T462／T463 的站別集合，本卡不註冊（DSK-017 已列 [等業主]）。
3. **沒有號誌／路權**：單列獨占整條路線；會車、佔軌、斷軌恢復是 LAB-06 的範圍。
4. **容量 12 是新玩法常數**：不是正式經濟數值，列 [等業主] 可調。
5. **真手機／Safari 未測**。
