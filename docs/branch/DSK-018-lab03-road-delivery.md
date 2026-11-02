# DSK-018｜LAB-03 真道路配送與合法交付

- 日期：2026-11-02
- 分支：`dsk/lab-03-road-delivery`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發待辦第 3 項 **LAB-03 真道路配送與合法交付**（前置 LAB-02 已完成：T776 容量核心＋T777 單帳研究，v14.70）。
- 業主指示：2026-11-02「全部做完吧」，依序推進 LAB-03～LAB-12；**新玩法／數值／存檔／發布仍照 `AGENTS.md`、`docs/迭代不改壞標準.md` 保留業主審批**。

## 1. 範圍（有界）

一句話：**一批貨，從一個物流建築，沿著真的道路格，送到另一個物流建築，全程只活在影子帳裡。**

- 一張卡、一條真路、一個有界任務（不是路網、不是多批、不是排程）。
- 不動正式經濟：不寫金錢、不寫商品庫存、不寫人口／工作、不寫客流、不寫存檔格式。
- 不改交通規則：車輛速度／佔用／紅綠燈／塞車模型**不在本卡**（屬 [等業主] 的玩法項），本卡只做「路徑合法性＋任務狀態機」。

## 2. 分兩階段（同一張卡）

- **階段 A（純核心，Node 可測）**：`road-delivery053.js`
  - `planDelivery(roads, origin, destination, opts)`：在真道路格上做 BFS 最短路，回傳 `{ok, path, reason}`。
  - `createDeliveryTask053(sessionId, plan, batch)`：`PENDING → MOVING → DELIVERED`／`CANCELLED` 狀態機，貨量守恆、重複 step 不可重複交付、可中途取消。
- **階段 B（執行期接線）**：把核心接進 `index.html` 的研究鏈（與 049／050／052 同一個 `window.GV` 命名空間），用真城市道路取得前接與路徑，畫面上只做「任務狀態」提示，不改模擬數值。

> 階段 B 會動 `index.html`；到時 fp 必須零變動、smoke 3 連綠、隔離（`__noXxx` 逃生閥＋載入／新世界／pagehide 取消）照 052 的既有做法。

## 3. 量到的現況（開工前）

| 事實 | 證據 |
|---|---|
| 道路是 4 鄰網格，`tiles[i].road`；`recalcMask` 每次改路就重算 | `tiles[].road`／`recalcMask(x,y)` |
| 建築的「道路前接」已有現成判定 | `mobilityFrontage462(rootIdx,'road')`、`mobilityBuildingAccess462`（回 `frontage`／`components`／`primary`／`networkSize`） |
| 影子帳已可建批次、守恆、可暫態、不可持久化 | `window.GV.singleResearch052`（`start`／`command`／`snapshot`／`end`／`disable`，049／050／052 共用一個 API） |
| 物流建築有前置條件（真前接道路） | `logisticsOperational485`：`sanRoadSeeds445(rootIdx).length` 必須 > 0 |
| 目前沒有任何「配送／貨運載具」的模擬 | `freightTrain`／`cargoTrain`／`dispatchFreight` 在 `index.html` 0 命中 |

## 4. 設計

### 4.1 路徑（純核心）

- 輸入：`roads`（`Uint8Array` 或 `{w,h,isRoad(x,y)}`）、`origin`、`destination`、`maxSteps`。
- 演算法：4 鄰 BFS；`origin`／`destination` 必須是可走的道路格；不可走 diagonal、不可穿過非道路格。
- 決定性：固定鄰居順序（上、右、下、左）＋固定 tie-break，同一輸入永遠同一條路徑。
- 拒絕理由（`reason`）：`no-origin`／`no-destination`／`origin-not-road`／`destination-not-road`／`unreachable`／`too-far`。
- 回傳：`{ok, path:[idx...], steps, reason}`；`path[0]===origin`、`path[last]===destination`。

### 4.2 任務狀態機

- 狀態：`PENDING`（已規劃未出發）→ `MOVING`（逐步前進）→ `DELIVERED`（走完）；任何時候可 `cancel(reason)` → `CANCELLED`。
- `step()`：每次前進一格；走完最後一格才 `DELIVERED`；`DELIVERED`／`CANCELLED` 之後再 `step()` 不改狀態（idempotent）。
- 守恆：`qty` 在整個生命週期不變；交付只記錄「這一批到達」，不產生第二份貨。
- 不可持久化：核心不碰 localStorage／不碰存檔格式。

## 5. 驗收條件（動手前寫死，之後不准改鬆）

1. **純核心測試**：`node road-delivery053.test.js` 全綠，至少涵蓋：
   - 直線／轉彎／繞障礙三種真路徑，逐一斷言「每一步 4 鄰相鄰、每格都是道路、首尾正確」；
   - `unreachable`（目的被水／空隔開）、`too-far`（超過 maxSteps）、起點或終點不在路上 → 各自的 `reason`；
   - 決定性：同輸入跑兩次，`path` 逐元素相同；
   - 狀態機：`PENDING→MOVING→DELIVERED`、中途 `cancel`、`DELIVERED` 後再 `step()` 不變、`qty` 全程不變。
2. **零產品改動（階段 A）**：`git diff --stat origin/main` 只有 `docs/` 與新增的兩個檔案（核心＋測試）；`index.html` bytes 不變。
3. **守衛**：`node smoke.js` 3 連綠、`node fp.js --check` 零變動（階段 A 沒動 index，仍要跑；階段 B 必跑）。
4. **階段 B**（接線後追加）：真 Chrome 場景中，兩個真物流建築之間規劃出一條真道路路徑；`__noRoadDelivery053` 閥門關閉時整幀與改前逐位相同；載入／新世界／pagehide 會取消任務；fp 零變動。
5. 卡上「沒做成的事」照實寫，不空、不美化。

## 6. 回滾

- 階段 A：只新增檔案，`git revert` 即可。
- 階段 B：`index.html` 的接線全部掛在 `window.__noRoadDelivery053` 與既有研究鏈開關之後，關閉時與 `origin/main` 逐位相同。

## 7. 施工紀錄

### 7.1 階段 A（純核心）已完成

- 新檔：`road-delivery053.js`（無 DOM、無 localStorage、雙環境 UMD：Node `module.exports`＋瀏覽器 `globalThis.roadDelivery053`）。
- API：`planDelivery({roads,w,h,origin,destination,maxSteps})`、`validatePath(path,roads,w,h)`、`createDeliveryTask053(sessionId,plan,batch)`。
- 拒絕理由：`bad-input`／`origin-not-road`／`destination-not-road`／`unreachable`／`too-far`。
- 任務狀態機：`PENDING → MOVING → DELIVERED`，任何時候 `cancel(reason) → CANCELLED`；終態冪等；`qty` 全程不變。

### 7.2 測試（`node road-delivery053.test.js`，不用 Chrome）

```
ok  直線：5×1 全道路，0→4 走 4 步
ok  轉彎：L 形道路，每一步相鄰且都在路上
ok  繞障礙：第 0 列中間有缺口，必須繞到第 2 列再回來
ok  不可達：目的地被非道路格完全隔開
ok  太遠：maxSteps 不足時回 too-far，不偷偷給路徑
ok  端點不在路上：origin-not-road／destination-not-road 分別回報
ok  決定性：多條等長路徑時，同一輸入跑兩次 path 逐元素相同
ok  狀態機：逐步前進，最後一步才 DELIVERED，qty 全程不變
ok  冪等：DELIVERED 之後再 step 不改狀態、不重複交付
ok  取消：MOVING 途中取消 → CANCELLED，之後 step 不再前進
ok  守衛：validatePath 抓對角線、非道路、空路徑
ok  端點相同：回單格路徑、0 步

ROAD_DELIVERY_053 {"checks":12,"ok":true}
```

### 7.3 守衛

- `node smoke.js` ×3／`node fp.js --check`：本卡階段 A 未改 `index.html`（bytes 與 `origin/main` 相同），守衛以分支 CI 為準（push 會跑 smoke 3 輪＋fp）；收據補在 §7.5。
- `git status`：只有 `docs/branch/DSK-018-lab03-road-delivery.md`、`road-delivery053.js`、`road-delivery053.test.js`。

### 7.4 階段 B（執行期接線）— 已施工，待守衛收據

- 新檔：`road-delivery053-runtime.js`，**原封不動**內嵌在 `index.html` 的 `/* GPT-052 SINGLE LEDGER END */` 之後（區塊標記 `DSK-018 ROAD DELIVERY 053 BEGIN/END`），與 049／050／052 同一個 `window.GV` 命名空間。
- 對外 API：`window.GV.roadDelivery053.{plan,start,step,cancel,snapshot,open,refresh,end,disable,provenance}`。
- 隔離：不寫金錢／商品／人口／客流／存檔；`__noRoadDelivery053` 一開，`start` 立刻回 `disabled`；`load`／`newWorld`／`pagehide` 都會把任務取消（沿用 052 的包裝法）。
- 面板：只在使用者 `open()` 時才建立 DOM，`end()` 立刻移除；預設不存在，所以不影響既有畫面與 fp。

### 7.5 階段 B 實測（`node probeRoadDelivery053.cjs` → PASS，exit 0）

真 Chrome、fresh 城市 N=72，鋪一條 x=10、y=10..20 的 11 格真道路：

```json
{"plan":{"ok":true,"steps":10,"head":730,"tail":1450},
 "initial":{"status":"PENDING","qty":5,"cursor":0,"pathLength":11},
 "final":{"status":"DELIVERED","cursor":10,"steps":10,"qty":5,"delivered":true},
 "panel":{"open":true,"closed":true},
 "disabled":{"ok":false,"reason":"disabled"}}
```

- 路徑 11 格、10 步，每一步都相鄰且都在真道路上（probe 逐點驗 `tile(x,y).road`）。
- `PENDING → MOVING → DELIVERED`，`qty` 全程 5，終態再 `step()` 不變。
- 逃生閥 `__noRoadDelivery053` 有效。
- 面板開／關都不留 DOM。

### 7.6 守衛變更（**需要業主／main 寫入者確認**）

階段 B 一定會動 `index.html`，而 `single-research052-source.cjs` 的 `projectCandidate052()` 把整份 `index.html` 釘死成「T776 native＋052 區塊」的逐 byte 結構。新增任何區塊都會讓它紅。

本卡的做法（**沒有放寬任何位元比較**）：

| 原本 | 現在 |
|---|---|
| `left + block052 + right`，剝掉 052 後必須逐 byte 等於 T776 baseline | `left + block052 + block053 + right`，**剝掉兩個釘死區塊**後仍必須逐 byte 等於**同一個** T776 baseline |
| 052 區塊有字面 SHA 釘死 | 053 區塊同樣有字面 SHA 釘死（`5193013e…`），且仍然唯一、位置唯一 |

- 這是「多加一個同樣釘死的附加區塊」，不是放寬判準：`baseline` 沒改、052 的 `blockHash` 沒改、負控制（missing／duplicate／modified／moved／boundary／outside）全部保留且仍然各自首紅在原本的守衛上。
- **但它仍然動到守門檔**（`single-research052-source.cjs`）。照 `AGENTS.md` 第 3 節與《迭代不改壞標準》5.4，這屬於「需要業主點頭」的變更，本 PR 不自行合併。

### 7.7 守衛收據

- `node shadow-cargo049.test.js` → `ok:true`（29 assertions，62.0s）。
- `node shadow-warehouse050.test.js` → `ALL_PASS`，`productWarehouseIntegrated:false`（70.5s）。
- `node single-research052.test.js` → `BROWSER_RESULT ok:true`（70.0s）。
- `node smoke.js` → **0 FAIL、SMOKE_OK**（119.5 KB 日誌）。
- `node fp.js --check` → **exit 0、FP_OK**，56.9s，165 族零變動、`style.json` 相同。
- `node probeRoadDelivery053.cjs` → PASS。
- **分支 CI（push `a396ea3`）全綠**：[smoke 41405495904](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/41405495904)（smoke／fp／fiscal-load 皆 success）、[reuse-push 41405501110](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/41405501110)（success）。

### 7.8 沒做成的事（照實）

1. **沒處理交通規則**：規劃器只看「是不是道路格」，**忽略單行道 `tile.oneway`、車道方向、紅綠燈、塞車權重、容量**。這些正是方向檔標 [等業主] 的「車流／交通規則」——在業主決定之前，本卡不自己定。
2. **只做 4 鄰 BFS 最短路**：沒有 A*、沒有權重、沒有多批排程；「一條真路、一個有界任務」的刻意上限。
3. **沒有車輛實體**：任務只是一批貨的狀態機，畫面上沒有車；車輛屬 LAB-05（貨運列車）與交通規則那條線。
4. **推進是命令式的**：`step()` 由面板按鈕／API 呼叫，尚未綁到每日 tick；綁 tick 等於決定「一車一天走幾格」，屬交通規則／數值，列 [等業主]。
5. **沒有接上 049／050 的影子帳批次**：目前任務自帶 `batchId`／`qty`，沒有從既有 ledger 取貨；「同批身份和帳」是 LAB-07 的範圍。
6. **內嵌副本與純核心是兩份程式**：`road-delivery053.js` 是可測參考版、`road-delivery053-runtime.js` 是內嵌版；目前靠人工同步，還沒有自動 parity 守衛（下一步要補）。
7. **改到守門檔**：`single-research052-source.cjs` 的投影器擴充（見 §7.6），需要業主／main 寫入者確認才能合。
8. **真手機／Safari 未測**。
