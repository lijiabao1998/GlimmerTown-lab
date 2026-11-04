# DSK-025｜LAB-07 公鐵聯運全程交付

- 日期：2026-11-02
- 分支：`dsk/lab-07-intermodal`（**合併了 LAB-03 的道路配送**，並基於 LAB-05／06 的鐵路與閉塞）
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 7 項 **LAB-07 公鐵聯運全程交付**（前置 LAB-03＝DSK-018 ＋ LAB-06＝DSK-020）。
- 範圍原文：「LAB-03＋06；同批身份和帳」；審批邊界：「**新玩法[等業主]；仍不入正式帳**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**同一批貨，先走公路到聯運站，換裝上鐵路，再送到目的地——批次身分與數量從頭到尾是同一個。**

- 兩個階段：公路段（`GV.roadDelivery053.plan` 規劃）→ 換裝 → 鐵路段（`GV.railFreight054.plan` 規劃）。
- 一個批次：`batchId`、`qty` 全程不變；換裝不改變數量、不產生第二批。
- 不進正式帳：不動金錢／商品庫存／人口／客流／存檔。
- 本卡**會動 `index.html`**（第五個釘死區塊）。

## 2. 設計

### 2.1 執行期 `GV.intermodal057`

- `start({roadFrom, roadTo, railFrom, railTo, cargo, capacity})`
  - 公路段用 `roadDelivery053.plan`、鐵路段用 `railFreight054.plan`；任一失敗就整趟不開始（不半途）。
  - 狀態機：`ROAD → TRANSFER → RAIL → DELIVERED`。
- `advance()`：公路段逐步前進；公路走完才進 `TRANSFER`；`transfer()` 後進 `RAIL`；鐵路走完 → `DELIVERED`。
- `cancel(reason)`：任何時候取消；已走的段不回滾（影子任務）。
- 守恒：`qty` 不變；`DELIVERED` 只記「已交付」，不生成第二批。
- 逃生閥 `__noIntermodal057`；`load`／`newWorld`／`pagehide` 取消。

### 2.2 probe

真 Chrome、fresh 城市：鋪一條公路與一條鐵路（各自在可用陸地上），跑完整一趟，斷言：
- 公路段步數＝曼哈頓距離、鐵路段步數正確；
- `ROAD → TRANSFER → RAIL → DELIVERED` 的順序；
- `qty` 全程不變；
- 未完成公路段不能 `transfer`（回 `road-not-done`）；
- 逃生閥有效。

## 3. 驗收條件（動手前寫死）

1. probe PASS（真 Chrome），上述斷言全過。
2. 守衛：`shadow-cargo049`／`single-research052` exit 0（新增第五個釘死區塊後）。
3. `node smoke.js` 0 FAIL；`node fp.js --check` 零變動。
4. `index.html` 只多出 053＋054＋055＋057 四個釘死區塊（本分支已包含前三個）。
5. 「沒做成的事」照實寫。

## 4. 回滾

整個接線在 `__noIntermodal057` 之後；關閉時與 `origin/main` 逐位相同（扣掉已合併的卡片）。

## 5. 施工紀錄

### 5.1 分支組成

`dsk/lab-07-intermodal` 由 `dsk/lab-06-block-recovery`（052＋054＋055）開始，再把 LAB-03 的 053 區塊與檔案**以程式化方式插入**（合併 `dsk/lab-03-road-delivery` 會在 11 MB 單檔產生大量衝突，改用「在 052 END 後、054 BEGIN 前插入 053 區塊」的等價做法）。最終 `index.html` 的釘死順序是 **052 → 053 → 054 → 055 → 057**。

### 5.2 實測（`node probeIntermodal057.cjs` → PASS，exit 0）

真 Chrome、fresh 沙盒 N=72：公路 5 格（步數 4）、鐵路 6 格（步數 5）。

```json
{"start":{"ok":true,"roadSteps":4,"railSteps":5,"status":"ROAD"},
 "earlyTransfer":{"ok":false,"reason":"road-not-done"},
 "atTransfer":{"status":"TRANSFER","qty":10},
 "transfer":{"ok":true,"status":"RAIL"},
 "done":{"status":"DELIVERED","qty":10,"capacity":12,"batchId":"qa-057"},
 "panel":{"open":true,"closed":true},
 "disabled":{"ok":false,"reason":"disabled"}}
```

- `ROAD → TRANSFER → RAIL → DELIVERED` 順序正確；公路沒走完不能換裝。
- 同一批次 `qa-057`、`qty=10` 全程不變；容量 12 沒被超過。
- 逃生閥與面板都有效。

### 5.3 守衛收據

- `node single-research052.test.js` → exit 0（五個釘死區塊）。
- `node shadow-cargo049.test.js` → exit 0。
- `node smoke.js` → **0 FAIL、SMOKE_OK**（119.5 KB）。
- `node fp.js --check` → **exit 0、FP_OK**，57.2s，165 族零變動。

### 5.4 沒做成的事（照實）

1. **換裝只是狀態轉換**：沒有真實的裝卸時間、月台佔用、吊車動畫；換裝＝公路段結束後一個明確動作。
2. **沒有接閉塞權（055）**：鐵路段目前不受 `railBlock055` 的單線閉塞約束；兩者要一起用是下一張整合卡的事。
3. **沒有接影子帳（049／052）**：批次自帶 `batchId`／`qty`，仍不是從 ledger 取貨。
4. **堆疊很深**：本分支含 #74（053）＋#75（054）＋#76（055）＋本卡（057）；合併要照這個順序，main 上把五個釘死區塊接好。
5. **真手機／Safari 未測**。
