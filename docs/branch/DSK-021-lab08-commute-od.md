# DSK-021｜LAB-08 原生通勤 OD 來源研究（唯讀）

- 日期：2026-11-02
- 分支：`dsk/lab-08-commute-od`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發第 8 項 **LAB-08 原生通勤 OD 來源研究**（TOWN01；前置 LAB-00 已完成）。
- 範圍原文：「LAB-00；可先唯讀，不造人口／工作」；審批邊界：「**只讀已結算資料，不強制原生重算**」。
- 業主指示：2026-11-02「全部做完吧」。

## 1. 範圍（有界）

一句話：**搞清楚原生遊戲到底把「誰從哪裡去哪裡上班」算成什麼形狀，而且只讀、不重算。**

- 只讀已結算的資料：`GV.t468()`（T468 運具分派）、`GV.t491()`（T491 移動性／勞動）、`GV.commuteLoad()`、`GV.commuteAt(x,y)`。
- **不重算**：不呼叫 `recomputeCommute`、不改 RNG、不寫存檔、不動人口／工作。
- 本卡**不改 `index.html`**（純診斷＋probe）。

## 2. 要回答的三個問題

1. 原生有沒有「明確的 OD 矩陣」（origin→destination 的配對）？
2. 如果沒有，它實際暴露的是什麼（聚合運具分派？每格通勤負載？）？
3. 影子客運研究（LAB-09）可以只靠這些唯讀資料活，還是必須逼原生重算？

## 3. 量到的現況（開工前靜態確認）

| 介面 | 形狀 | 證據 |
|---|---|---|
| `GV.t468()` | `{version, assignment, busOps, accessMax, audit}`，`assignment` 由 `emptyTransit468()` 起：`{day,totalTrips,transitTrips,walkTrips,carTrips,unservedTrips,modeShare:{bus,tram,metro,rail,multimodal,car,unserved}}` | `emptyTransit468()`、`t468:` getter |
| `GV.t491()` | `{version, anchor, mobility, audit, invariants:{modeConservation,…}}`；`audit` 走 `transitAudit468()` | `t491:` getter |
| `GV.commuteLoad()` | `{clusters, unreachable}`（通勤場彙總） | `commuteLoad:` getter |
| `GV.commuteAt(x,y)` | 該格由通勤 trip 貢獻的衰減式移動平均 load（4 位小數） | `commuteAt:` getter |
| 重算入口 | `recomputeCommute`（**本卡不呼叫**） | GV 清單 |

初步判斷（待 probe 證實）：**原生沒有公開的 OD 配對矩陣**；它暴露的是「聚合運具分派＋每格通勤負載＋勞動媒合統計」。要拿到真正的 OD 配對，只能重算或改產品——兩者都超出本卡邊界。

## 4. 驗收條件（動手前寫死）

1. **probe 可重現**（`probeCommuteOd08.cjs`，真 Chrome、fresh 沙盒）：
   - 讀出 `t468`／`t491`／`commuteLoad`／`commuteAt` 的實際形狀與數字，寫進 `facts`；
   - **唯讀證明**：同一份快照連讀兩次 `deepEqual`；讀前後 `localStorage.length` 不變；不呼叫 `recomputeCommute`（probe 內不出現該字串）；
   - 讓城市自然跑幾個模擬日後 `t468().assignment.totalTrips > 0`（證明資料不是空的），但**不手動重算**。
2. **零產品改動**：`index.html` bytes 不變（`git diff --name-only origin/main` 只有卡與 probe）。
3. `node smoke.js` 3 連綠、`node fp.js --check` 零變動（本卡沒動產品，仍要證明沒碰壞）。
4. 卡上「沒做成的事」照實寫（尤其是「沒有 OD 矩陣」這個結論）。

## 5. 回滾

只新增檔案，`git revert`。

## 6. 施工紀錄

### 6.1 probe 實測（`node probeCommuteOd08.cjs` → PASS，exit 0）

```json
{"t468Keys":["version","assignment","busOps","accessMax","audit"],
 "odShape":{"present":true,"type":"array","length":0},
 "topODShape":{"type":"array","length":0},
 "hasExplicitOdMatrix":true,
 "odFieldsInAssignment":["modeShare","od","topOD"],
 "stable":{"t468":true,"t491":true},
 "storage":{"before":3,"after":3,"unchanged":true},
 "afterRun":{"day":4,"totalTrips":0,"auditOk":true}}
```

- **唯讀成立**：連讀兩次 `t468`／`t491` 完全一致；讀取前後 `localStorage` 長度都是 3；probe 原始碼沒有任何 `recomputeCommute()` 呼叫（probe 自己會掃字串）。
- **新城市 0 運量**：fresh 城市沒有住戶／工作，`totalTrips:0` 是預期；本卡依邊界**不造人口**，所以不硬把數字做出來。

### 6.2 結論：原生 OD 是「區塊級」不是「格級」

從 `index.html` 的實際建構與 UI 讀法可確認（`transitOD468(blocks)`、`mobility491` 的 `odRows`／`topOD`）：

- OD 列的形狀是 **`{origin, destination, purpose, trips, walk, transit, car}`**，`origin`／`destination` 是**街區（block）編號**，不是單格。
- 另有 `odMeta:{latent, generated, represented, dropped}`（T491）記錄需求生成／代表的落差。
- 對外可讀：`GV.t468().assignment.{od,topOD,modeShare,purpose}`、`GV.t491().mobility`、`GV.commuteLoad()`、`GV.commuteAt(x,y)`（該格衰減式通勤負載）。
- **沒有**格級 OD 公開介面。

對 LAB-09 的意義：影子客運可以直接吃「區塊級 OD ＋每格通勤負載」，不需要逼原生重算；細到格級的配對則要另開設計、且属 [等業主]。

### 6.3 沒做成的事（照實）

1. **看不到非零 OD 的執行期樣本**：fresh 城市沒有住戶／工作；要看真資料需要業主的存檔（本卡不動業主存檔），所以 OD 元素的欄位是從程式碼與 UI 讀出來的，不是 runtime 抽樣。
2. **沒有自己做 OD 生成模型**：`transitOD468` 的生成邏輯只讀不寫；重建一套生成器會踩「不強制原生重算」的邊界。
3. **格級 OD 不存在**：結論就是「原生只到區塊級」，本卡不改產品去補。
4. **真手機／Safari 未測**。

## 7. Claude 合併前補齊（2026-11-04，T779）

- **凍結驗收第 1 條原本沒達成**：條件要「讓城市自然跑幾個模擬日後 `totalTrips > 0`」，原探測量到 0，卻沒有檢查這條。
  - 原探測讓城市跑的方法，是在頁面裡空轉 4 秒等畫面迴圈。空轉佔住主執行緒，畫面迴圈不會跑，城市其實沒有前進。
- **改法**：探測先用固定種子 `GV.newWorldSeeded(20261104)` 開新城，只打開遊戲原生的 AI 市長（`GV.ai(true)`），用 `GV.step` 推進 60 天。
  - 城市與人口全由原生 AI 與原生模擬長出，探測不寫地格、居民、工作或資料欄位。
  - 讀取階段再做唯讀證明，`localStorage` 從只比長度改成逐鍵逐值比對。
- **本機實測**（PASS）：
  - 第 61 天，人口 680、工作 163，`totalTrips` 94.4，OD 192 列。
  - 連讀兩次 `t468`／`t491` 相同；`localStorage` 3 個鍵逐值不變。
- **更正 §6.2 的 OD 列欄位**：執行期每列實際是 `{purpose, origin, destination, trips, walk, transit, car, unserved, distance, bike}`。原卡少了 `unserved`、`distance`、`bike` 三欄。
  - `origin`／`destination` 是「x,y」形式的街區座標字串，例如 `"1,4"`。
- **故意改壞**：不推進天數（`GROW_DAYS = 0`）→ 探測紅在「凍結驗收 1：城市自然跑 0 天後 totalTrips 必須 > 0，實際 0」。已還原。
- **§6.3 第 1 條「看不到非零 OD 的執行期樣本」已補上**；其餘照舊。
