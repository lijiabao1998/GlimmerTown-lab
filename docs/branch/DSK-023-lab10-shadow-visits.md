# DSK-023｜LAB-10 車站與商業街影子到訪

- 日期：2026-11-02
- 分支：`dsk/lab-10-shadow-visits`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 10 項 **LAB-10 車站與商業街影子到訪**（TOWN03；前置 LAB-09＝DSK-022）。
- 範圍原文：「LAB-09；真步行連接」；審批邊界：「**不改收入／稅／價格／旅館收入**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**站在「真車站」旁邊的商業街店面，影子模型算它會有多少人到訪——只算人，不算錢。**

- 只讀幾何：車站（原生建築 k=17／21／55／139，LAB-04／08 已確認）與商業街店面（住宅／商業混合街，`highStreetCommerce005` 之類）的位置。
- 距離用真步行連接：**曼哈頓步行距離 ≤ 半徑**才連得上；沒有路徑就算 0，不猜。
- 只輸出「影子到訪次數」；**不寫收入、稅、價格、旅館收入、任何模擬數值**。
- 本卡**不改 `index.html`**（純核心＋probe）。

## 2. 設計

### 2.1 純核心 `shadow-visits057.js`

- `computeShadowVisits({stations, shops, radius, demandScale})`
  - `stations`: `[{id,x,y,demand}]`；`shops`: `[{id,x,y,attract}]`。
  - 步行距離 `d = |x1-x2| + |y1-y2|`；`d > radius` → 不連。
  - 權重 `w = 1 - d/radius`（線性衰減）；店面到訪 = `Σ 車站 demand × attract × w`，最後 `Math.round`。
  - 回 `{ok, rows, totals:{visits, connected, isolated}, truncated}`；`isolated` = 半徑內沒有任何車站的店面數。
- `rankShops(rows, n)`：依到訪量排序，同分以 `id` 升冪（決定性）。
- 上限：`maxShops`／`maxStations`（預設 2000／500），超過標 `truncated`，不無限吃記憶體。

### 2.2 probe `probeShadowVisits10.cjs`

- 真 Chrome、fresh 沙盒：掃 `GV.tile(x,y)` 找出**真的車站與商業街店面座標**（車站 k∈{17,21,55,139}；店面 k 由商業街類別判定），把真座標餵給核心。
- 新城市沒有住戶 → 需求用**合成 demand**（照實標記 `demandSource:'synthetic'`），只驗「幾何＋模型」，不假裝是真客流。
- 唯讀證明：全程不寫任何 tile、`localStorage` 不變。

## 3. 驗收條件（動手前寫死）

1. `node shadow-visits057.test.js` 全綠：距離衰減、半徑外不連、多站疊加、吸引度加權、isolated 判定、排序決定性、上限截斷、壞資料。
2. probe PASS：真座標掃描成功（可為 0 個）、核心在真座標上跑出結果、唯讀證明成立。
3. `index.html` bytes 不變。
4. `node smoke.js` 3 連綠、`node fp.js --check` 零變動。
5. 「沒做成的事」照實寫（尤其是「需求是合成的」）。

## 4. 回滾

只新增檔案，`git revert`。

## 5. 施工紀錄

### 5.1 核心與測試

- `shadow-visits057.js`（UMD）：`computeShadowVisits({stations,shops,radius,demandScale,maxShops,maxStations})`、`rankShops(rows,n)`。
- 模型：曼哈頓步行距離 `d`；`d > radius` 不連；權重 `1 − d/radius`；到訪 = `Σ station.demand × shop.attract × w`，四捨五入。
- `node shadow-visits057.test.js` → **8/8**（衰減、半徑外、多站疊加、排序決定性、無車站、壞資料、截斷、縮放）。

### 5.2 probe（`node probeShadowVisits10.cjs` → PASS，exit 0）

真 Chrome、fresh 沙盒 N=72：掃全圖 **0 個車站、0 個店面**（新城市是空地），照實記；改用合成 3 站 6 店示範模型：

```json
{"scan":{"stations":0,"shops":0},
 "synthetic":{"ok":true,"radius":10,"totals":{"visits":279,"raw":279,"isolated":2,"connected":5}},
 "readOnly":{"unchanged":true}}
```

- 合成模型：279 次影子到訪、2 家店在步行半徑外被標 `isolated`、排序第一名是最近的 A。
- 全程沒寫任何 tile、`localStorage` 不變。

### 5.3 沒做成的事（照實）

1. **真城市幾何是空的**：fresh 城市沒有車站也沒有商業街，所以 probe 只能證明「模型在真座標上跑得動」＋「合成資料算得對」，不能證明真城市的人流。
2. **需求是合成的**：車站 demand 在新城市是 0；本卡不造人口、不改收入，照邊界只算幾何。
3. **步行連接是曼哈頓距離近似**：沒有真的走 `tiles[].road` 路徑（那需要 LAB-03 的路徑規劃），所以「真步行連接」目前是保守近似，卡上如實標明。
4. **不寫任何經濟數值**：沒有收入、稅、價格、旅館收入；連 `GV` 都沒有新增介面。
5. **真手機／Safari 未測**。

## 6. Claude 合併前補齊（2026-11-04，T781）

- **真步行連接**：方向原文要求真步行連接，原核心用曼哈頓近似（§5.3 第 3 條自己也寫了）。
  - 核心新增 `walkDistance(x1,y1,x2,y2)`，參數順序同 `GV.path502`，介面名沿用 #84 的寫法。
  - 只有有限的非負數才算連得上；Infinity、null、undefined、NaN、字串一律不連；負數回 `negative`。
  - #84 那份寫成 `Number(...)`，會把 null 當成 0，等於「到不了」變成「就在旁邊」。
  - 不給 `walkDistance` 時照舊用曼哈頓，原 8 項測試不變。
- **商業街**：原探測抓所有 k=2 商業建築。改成原生 T005 高街裡 role 為 commerce 的建築，k 從 `index.html` 的 `HIGHSTREET005` 機械讀出，目前是 238、239、240。
- **真場景**：原探測在新城市掃到 0 站 0 店，真座標那段沒有執行。
  - 改成固定種子沙盒，用原生開發者沙盒（T516B）解鎖工具，擺一段主路、一小段軌、一座 k17 火車站、三家接主路的高街商店，另一家只接在不連通的小路上。
  - 距離用 `GV.path502(...,'walk')`，半徑 18，取原生車站步行集水區的門檻。
- **本機實測**（PASS）：
  - 接主路三家的步行成本 7、11.09、16.24，影子到訪 61、38、10。
  - 不連通那家原生步行到不了（isolated）；直線格距只有 5，曼哈頓近似會把它算成連得上（對照組總到訪 183，真步行 109）。
  - 讀取階段 `localStorage` 7 個鍵與場景地格都不變。需求是合成的（每站 100）。
- **測試**：原 8 項不改，新增 4 項，共 12/12；接進 `smoke.js`。
- **故意改壞**（跑完已還原）：
  - 照 #84 寫成 `Number(raw)` → 紅在「null／undefined／NaN 不會被當成距離 0」；
  - 半徑放寬成 d＞radius＋1 → 紅在半徑邊界測試。原本的 8 項抓不到這種放寬。
