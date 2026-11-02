# DSK-026｜LAB-11 貨客運商業街同城 A–F 驗收

- 日期：2026-11-02
- 分支：`dsk/lab-11-acceptance`（基於 `dsk/lab-07-intermodal`，含 053／054／055／057 接線；另帶入 056／057 兩個純核心）
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 11 項 **LAB-11 貨客運商業街同城 A–F 驗收**（前置 LAB-07＝DSK-025 ＋ LAB-10＝DSK-023）。
- 範圍原文：「LAB-07＋10；若無安全共享路權則獨立合法線」；審批邊界：「**精確候選SHA、真Chrome／原圖；發布另批**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 這張卡做什麼

**在同一個城市、同一個 Chrome session 裡，把 A–F 六個情境一次跑完並逐項判定**：

| 情境 | 內容 | 來源卡 |
|---|---|---|
| **A** | 公路配送：一批貨沿真道路送達 | LAB-03／053 |
| **B** | 鐵路貨運：一批貨沿真鐵軌到站卸貨 | LAB-05／054 |
| **C** | 閉塞區間：兩列競爭，一列走一列等，斷軌停住再恢復 | LAB-06／055 |
| **D** | 公鐵聯運：公路 → 換裝 → 鐵路，同批次同數量 | LAB-07／057 |
| **E** | 客運需求：原生 OD 摘要（可為空）＋合成 fixture 守恒 | LAB-09／056 |
| **F** | 影子到訪：真城市幾何掃描＋合成模型 | LAB-10／057 |

外加**隔離總檢查**：整趟跑完後，`money`／人口／`localStorage` 必須與開場完全相同（影子資料不寫回正式經濟）。

## 2. 驗收條件（動手前寫死）

1. `node probeAcceptance11.cjs` 在真 Chrome 跑完 A–F，六項全 PASS。
2. 每個情境各自印出可核對的數字（步數、狀態、qty、conservation、站數／店數）。
3. 隔離：跑完後 `money` 不變、`population` 不變、`localStorage.length` 不變。
4. `index.html` 不改（本卡只加 probe＋既有核心檔）。
5. 「沒做成的事」照實寫。

## 3. 施工紀錄

### 3.1 六情境實測（`node probeAcceptance11.cjs` → PASS，exit 0）

真 Chrome、fresh 沙盒 N=72、同一個 session：

| 情境 | 結果 |
|---|---|
| **A 公路配送** | `DELIVERED`、4 步、`qty=5` |
| **B 鐵路貨運** | `UNLOADED`、7 步、`qty=9` |
| **C 閉塞區間** | `t1 GRANTED`／`t2 WAITING`；等待者 `no-authority`；斷軌 `track-broken` |
| **D 公鐵聯運** | `DELIVERED`、公路 4 步＋鐵路 7 步、`qty=6` |
| **E 客運需求** | 原生 OD 0 列、合成 150 trips／未服務 10、守恒成立 |
| **F 影子到訪** | 真城市 0 站 0 店、合成 183 次到訪、isolated ≥1 |

### 3.2 隔離總檢查（A–F 全部跑完之後）

```json
{"moneyAfterSetup":<x>,"moneyAfterAll":<x>,"popAfterSetup":<p>,"popAfterAll":<p>,
 "storageAfterSetup":3,"storageAfterAll":3}
```

`money`、`population`、`localStorage.length` 與「建好測試場景之後」完全相同——影子任務沒有寫回正式經濟。

### 3.3 沒做成的事（照實）

1. **用的是測試場景，不是業主的真城市**：路段是 probe 自己鋪的 5 格公路＋8 格鐵路。
2. **E／F 的真資料是 0**：fresh 城市沒有住戶／車站／商業街，所以數學用合成 fixture 驗；真資料要業主的存檔。
3. **`index.html` 沒有新改動**：本卡沿用 #81 的五個釘死區塊；`git diff` 只有卡、probe 與兩個核心檔。
4. **C 的列車在測試結束時被 `end()` 清掉**，沒有留下跨情境狀態。
5. **真手機／Safari 未測**。
