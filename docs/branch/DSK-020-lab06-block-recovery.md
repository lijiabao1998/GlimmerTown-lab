# DSK-020｜LAB-06 占軌、等待與斷軌恢復

- 日期：2026-11-02
- 分支：`dsk/lab-06-block-recovery`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 6 項 **LAB-06 占軌、等待與斷軌恢復**（前置 LAB-05＝DSK-019 已完成）。
- 範圍原文：「LAB-05；至多兩貨列車」；審批邊界：「**路權／容量[等業主]**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**一條單線區間，最多兩列貨運列車；一列先走，另一列等；軌斷了就停，修好了再走。**

- 只做「單一閉塞區間」（single block）：整條路線同一時間只准一列占用。
- 最多兩列（`maxTrains=2`）；第三列直接拒絕（`too-many`）。
- 斷軌＝路線上某格 `tile.rail` 消失；恢復＝該格重新有軌。
- **不做**：號誌燈、時刻表、多區間閉塞、會車側線、正式路權規則（那是 [等業主] 的玩法）。

## 2. 分兩階段

- **階段 A（純核心，Node 可測）**：`rail-block055.js`
  - `createBlockAuthority055({maxTrains})`：
    - `request(id)` → `GRANTED`／`WAITING`／`too-many`／`duplicate`
    - `release(id)` → 下一個等待者（FIFO）取得路權
    - `breakTile(i)`／`repairTile(i)`／`isBroken(i)`
    - `canAdvance(id, tile)` → 有路權且該格沒斷軌才准前進
    - `snapshot()`
- **階段 B（執行期接線）**：`GV.railBlock055`，把 LAB-05 的兩列貨運任務掛在同一個閉塞區間上；斷軌用真實 `tiles[i].rail` 判定；逃生閥 `__noRailBlock055`。

## 3. 量到的現況（開工前）

| 事實 | 證據 |
|---|---|
| LAB-05 已有單列貨運任務狀態機與真鐵軌路線 | `rail-freight054.js`、`GV.railFreight054`（DSK-019） |
| 真鐵軌是 `tiles[i].rail`；改軌會 `recalcRailMask4` 重算拓撲 | index.html T462／T469 區 |
| 目前沒有任何「佔軌／等待／斷軌」的模型 | `freightTrain`／`occupy`／`block`（號誌語意）在 index.html 無對應實作 |

## 4. 設計

### 4.1 閉塞權（authority）

- 狀態：`holder`（目前持有路權的列車 id）、`waiting`（FIFO 佇列，最多 `maxTrains-1`）。
- `request(id)`：
  - id 重複 → `duplicate`
  - 已有 holder → 進 `waiting`，回 `WAITING`
  - 沒有 holder → `holder=id`，回 `GRANTED`
  - `holder + waiting` 已達 `maxTrains` → `too-many`
- `release(id)`：只有 holder 可以釋放；釋放後把佇列最前面的升為 holder（並回傳 `granted`）。
- 同一時間最多一列在區間內——這是單線的本質。

### 4.2 斷軌

- `breakTile(i)` 記錄斷軌格；`repairTile(i)` 移除。
- `canAdvance(id, tile)`：`id !== holder` → `no-authority`；`isBroken(tile)` → `track-broken`；否則 ok。
- 斷軌時列車停在原地（不是消失、不是瞬移）；修好後可繼續。

## 5. 驗收條件（動手前寫死，之後不准改鬆）

1. **純核心測試** `node rail-block055.test.js` 全綠，至少涵蓋：
   - 第一列 `GRANTED`、第二列 `WAITING`、第三列 `too-many`（`maxTrains=2`）；
   - 重複 `request` 回 `duplicate`；
   - `release(holder)` 後，等待者依 FIFO 取得路權；
   - 非 holder `release` 被拒（`not-holder`）；
   - `breakTile` 後 `canAdvance` 回 `track-broken`；`repairTile` 後恢復；
   - 沒有路權時 `canAdvance` 回 `no-authority`；
   - `snapshot()` 形狀穩定（holder／waiting／broken 排序固定）。
2. **階段 A 零產品改動**：只新增核心＋測試，`index.html` bytes 不變。
3. **階段 B**：真 Chrome 兩列貨運任務在同一區間上「一列走、一列等」；中途斷軌→停在原地→修好→可繼續；`__noRailBlock055` 有效；fp 零變動、smoke 3 連綠。
4. **守衛**：階段 B 會新增第三個釘死區塊，投影器同步擴充（逐 byte、baseline 不變），卡上標明需業主確認。
5. 「沒做成的事」照實寫。

## 6. 回滾

- 階段 A：只新增檔案，`git revert`。
- 階段 B：全在 `__noRailBlock055` 之後，關閉時與 `origin/main` 逐位相同。

## 7. 施工紀錄

### 7.1 階段 A（純核心）已完成

- 新檔 `rail-block055.js`（UMD：Node `module.exports`＋瀏覽器 `globalThis.railBlock055`）。
- API：`createBlockAuthority055({maxTrains})` → `{request, release, breakTile, repairTile, isBroken, canAdvance, snapshot}`。
- 預設 `DEFAULT_MAX_TRAINS = 2`；`request` 回 `GRANTED`／`WAITING`／`too-many`／`duplicate`；`release` 只有 holder 能放，放完 FIFO 遞補。

### 7.2 測試（`node rail-block055.test.js`）

```
ok  第一列 GRANTED、第二列 WAITING、第三列 too-many
ok  重複 request 回 duplicate（holder 與等待中都算）
ok  release 後等待者依 FIFO 取得路權
ok  非 holder release 被拒（not-holder）
ok  canAdvance：有路權才准，斷軌格拒絕
ok  斷軌對其他格沒有影響
ok  snapshot 形狀穩定：broken 排序、waiting 依 FIFO
ok  全部釋放後 holder 為 null，可再接受新列
ok  壞輸入：空 id／負 tile

RAIL_BLOCK_055 {"checks":9,"ok":true}
```

### 7.3 沒做成的事（照實）

1. **階段 B 還沒接線**：`GV.railBlock055` 尚未裝上；那一步要接 LAB-05 的兩列任務、新增第三個釘死區塊並擴充投影器（需業主確認）。
2. **只有單一閉塞區間**：整條路線同一時間一列；多區間閉塞、側線會車都不在本卡。
3. **沒有號誌／時刻表**：等待只是 FIFO，不是真實班表或路權優先序。
4. **斷軌是「格不見了」**：用 `tile.rail` 判定；沒有模擬施工中的軌道修復時間。
5. **真手機／Safari 未測**。
