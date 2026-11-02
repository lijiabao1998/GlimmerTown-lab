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

## 6. 施工紀錄（待補）

- （待補）probe 實測
- （待補）結論與沒做成的事
