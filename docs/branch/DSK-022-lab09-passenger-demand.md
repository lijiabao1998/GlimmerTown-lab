# DSK-022｜LAB-09 有界客運研究與未服務需求

- 日期：2026-11-02
- 分支：`dsk/lab-09-passenger-demand`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 9 項 **LAB-09 有界客運研究與未服務需求**（TOWN02；前置 LAB-08 已完成＝DSK-021）。
- 範圍原文：「LAB-08；深化施工在物流兩站閉環後」；審批邊界：「**不取代原生客運，正式語意[等業主]**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**拿原生已經算好的 OD，算出「哪些出行沒有被現有客運服務到」，只讀、只報告、不改產品。**

- 輸入只來自 LAB-08 確認過的唯讀面：`GV.t468().assignment.{od,topOD,modeShare,purpose}`。
- 輸出是**研究報表**：各目的的總量、已服務（walk／transit／car）、未服務、最大缺口排序。
- **不取代原生客運**：不寫回任何運具分派、不改 `transit468`、不改票價／班距／容量。
- 本卡**不改 `index.html`**（純核心＋probe＋報表）。

## 2. 設計

### 2.1 純核心 `passenger-demand056.js`

- `summarizeDemand(od, opts)`：
  - 逐列檢查 `trips >= 0`、四個欄位都是有限數；壞資料回 `{ok:false, reason}`，不猜。
  - 聚合：`total`、`walk`、`transit`、`car`、`unserved`（= `trips - walk - transit - car`，不得為負）。
  - 守恒：`walk + transit + car + unserved === total`（容差 1e-6，浮點）。
- `rankUnserved(rows, n)`：依未服務量排序，回前 n 名（同分時以 `origin`、`destination` 升冪決定，保證決定性）。
- `boundedStudy(od, {maxRows})`：超過上限就截斷並在結果標記 `truncated:true`（研究用途不能無限吃記憶體）。

### 2.2 probe `probePassengerDemand09.cjs`

- 真 Chrome、fresh 沙盒：讀原生 `t468().assignment.od`（預期空陣列）並跑 `summarizeDemand`，回報 0 也照實寫。
- 另外用**合成 fixture**（3 個街區、4 列 OD）在頁面內跑同一套核心，證明數學正確（守恒、排序、截斷）。
- 唯讀證明：讀前後 `localStorage.length` 不變、連續兩次 `t468` 快照相同。

## 3. 驗收條件（動手前寫死）

1. `node passenger-demand056.test.js` 全綠，至少涵蓋：守恒、四種欄位壞資料、負數、排序決定性、截斷、空輸入。
2. probe PASS：原生 OD 讀取成功（可為 0）、合成 fixture 的守恒與排序正確、唯讀證明成立。
3. `index.html` bytes 不變（`git diff --name-only origin/main` 只有卡＋核心＋測試＋probe）。
4. `node smoke.js` 3 連綠、`node fp.js --check` 零變動（本卡沒動產品，仍要證明沒碰壞）。
5. 「沒做成的事」照實寫。

## 4. 回滾

只新增檔案，`git revert`。

## 5. 施工紀錄

### 5.1 核心與測試

- `passenger-demand056.js`（UMD）：`summarizeDemand(od,opts)`、`rankUnserved(rows,n)`、`boundedStudy(od,opts)`。
- 驗證規則：四個數值欄位必須是有限非負；`walk+transit+car > trips` 回 `overflow`（不默默截斷）；`maxRows` 超過上限標 `truncated`。
- `node passenger-demand056.test.js` → **8/8 全綠**（守恒、逐列 unserved、overflow、壞資料三種、排序決定性、截斷、空輸入、byPurpose）。

### 5.2 probe（`node probePassengerDemand09.cjs` → PASS，exit 0）

真 Chrome、fresh 沙盒 N=72：

```json
{"nativeOd":{"present":true,"length":0,"sameTwice":true,"storage":{"before":3,"after":3,"unchanged":true}},
 "synthetic":{"ok":true,"conserved":true,
   "totals":{"trips":220,"walk":15,"transit":115,"car":60,"served":190,"unserved":30}}}
```

- 原生 OD 在 fresh 城市是空陣列（0 列），照實記；**唯讀成立**（連讀一致、storage 不變）。
- 合成 fixture（4 列、220 trips）守恒：190 已服務 + 30 未服務 = 220；排序第一名是 `B03→E01`（20 未服務）。
- 這證明「核心數學正確」，不代表原生城市有需求可算——那需要業主的存檔。

### 5.3 沒做成的事（照實）

1. **原生 OD 是空的**：fresh 城市沒有人口／工作，`od.length === 0`；本卡依邊界不造人口，所以只用合成 fixture 驗數學。
2. **只是研究報表，沒有接進遊戲**：`GV` 沒有新 API、`index.html` 沒改；要變成遊戲內面板是 [等業主] 的產品決定。
3. **不算容量／班距**：本卡只做「已服務 vs 未服務」的守恆與排序；真正的服務水準（擁擠、候車）需要路線資料，屬 LAB-10／11。
4. **真手機／Safari 未測**。

## 6. Claude 合併前補齊（2026-11-04，T780）

- **核心原本漏了兩欄**：原生 OD 每列實際有 `bike` 和原生自己算的 `unserved`（T779 實測），核心只認 walk／transit／car。
  - 有自行車的城市，自行車出行會被算成未服務。
  - 改法：`bike` 算已服務；有原生 `unserved` 時照用，並逐列檢查五項加總等於 trips，不等回 `nonconserved`；`bike`／`unserved` 給了壞值回 `bad-input`／`negative`，不靜默當 0。
- **容差**：預設仍是原卡的 1e-6。只有呼叫端明示 `rowTolerance` 才放寬，探測傳 0.3。
  - 推導：trips 與五個分項共 6 個數，各自四捨五入到 0.1，每個最多偏 0.05。
- **測試**：原 8 項不改，新增 5 項，共 13/13。新測試接進 `smoke.js`，CI 會跑。
- **故意改壞**（跑完已還原）：
  - 已服務不算 bike → 紅在「T780 bike 算已服務」（實際 80）；
  - 忽略原生 unserved → 紅在容差那項（實際 0.0999…，應為 0.2）。
  - 第二項第一次沒抓到：守恆檢查本身就逼兩者相等，所以補了一條只有容差內才會分出差別的斷言。
- **探測加原生城市一段**：固定種子、只開原生 AI 市長、推進 60 天（與 T779 同一座城）。
  - 第 61 天、人口 680、OD 192 列；摘要 ok、逐列守恆，192 列都用原生 unserved。
  - Σtrips 94.8 與 `totalTrips` 94.4 相差 0.4，在四捨五入上限 0.05×(192+1)＝9.65 內，已寫成斷言。
  - 這座城沒有未服務出行，所以排名前 3 都是 0。
