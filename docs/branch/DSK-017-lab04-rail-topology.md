# DSK-017｜LAB-04 原生鐵路／k166 拓撲診斷與適配設計

- 日期：2026-11-02
- 分支：`dsk/lab-04-rail-topology`
- 對應方向：`docs/GPT-方向.md` 2026-10-26 有界研發待辦第 4 項 **LAB-04 原生鐵路／k166 拓撲診斷與適配設計**（前置 LAB-00 唯讀盤點，已完成）。原文界線：「先唯讀，不補隱形軌」「實際接線／新貨站語意[等業主]」。
- 業主指示：2026-11-02「全部做完吧」（回覆本 session 的「LAB 還有什麼沒做完」清單），授權依序推進 LAB-03～LAB-12。**產品語意（新玩法／數值／存檔／發布）仍照 `AGENTS.md`、`docs/迭代不改壞標準.md` 保留業主審批**；本卡不跨過那條線。

## 1. 這張卡只做兩件事

1. **唯讀診斷**：量清楚 k166（鐵公路聯運中心）與原生鐵路拓撲之間到底接不接得上、接在哪一層。
2. **適配設計**：提出一個不新增隱形軌、不改模擬的接線方案，供 LAB-05（第一條兩站實載貨運鐵路）使用。

**不做**：不改 `index.html`、不改模擬、不改美術、不改存檔、不改放置規則、不註冊新站別、不新增貨運列車。以上任何一項要動，都是 LAB-05 之後的事，且照規則先出卡。

## 2. 開工前量到的現況（唯讀）

| 事實 | 證據（識別字，非行號） |
|---|---|
| k166 是 4×4、3 變體、`tool:'intermodalHub'` 的建築 | `{k:165, tool:'containerLogistics'}`、`{k:166, tool:'intermodalHub'}`；`placeLogisticsMulti485(x,y,166,4,…)` |
| k166 的放置條件是「半徑 6 格內 ≥2 個真軌」，**不是貼軌** | `if(toolId==='intermodalHub'){…if(countNear(x,y,6,tt=>tt.rail)<2)return '鐵公路聯運中心需鄰近鐵路（≥2格）'}`；`countNear(x,y,r,pred)` 用 `for(dy=-r..r)for(dx=-r..r)`，是方形鄰域（Chebyshev ≤6） |
| k166 不是「站」：T462 快照的站別集合沒有它 | `mobilityTrackSnapshot462('rail',MOB_RAIL_COMP462,mobRailComponents462,[17,55,139])`；tram 用 `[21]` |
| T463 的實體站表同樣不認 k166 | `railPhysicalStationTable463` 只接受 `[17,21,55,139]` |
| 畫在 k166 上的軌道是美術，不是 `tiles[i].rail` | 該建築的 `functionLimit`：「As disclosed in T611, painted rails do not connect adjacent true rail tiles; no new dispatch or throughput.」 |
| 原生軌道拓撲的三層 | `tiles[i].rail`／`railBridge` → `railMask`（`recalcRailMask`／`recalcRailMask4`）→ 連通分量 `MOB_RAIL_COMP462`（`mobRailComponents462`） |
| 車站與軌道的前接判定已有現成 API | `mobilityStationTrackFrontage462(rootIdx,kind='rail')`：對建築原點只看 `DIRV` 四鄰是否為該 kind 的軌 |
| 軌道載具目前只有客運 | `syncRailVehicles463`／`updRailVehicles463`（T469）；`freightTrain`／`cargoTrain`／`goodsTrain`／`freightDepot`／`dispatchFreight` 在 `index.html` **0 命中** |

## 3. 診斷：三個落差

- **D1｜身分與幾何脫鉤。** 放置判定用「半徑 6 內 ≥2 格軌」，而站別／前接判定用「四鄰貼軌」（`mobilityStationTrackFrontage462`）。結果：一棟聯運中心可以合法地站在離軌 6 格的位置，畫面上卻有軌道穿過它。目前沒有任何程式把這兩套判定對齊。
- **D2｜k166 沒有站的身分。** 它不在 `[17,55,139]`（rail）也不在 `[21]`（tram），所以 `mobilitySnapshot462().rail.stations` 不計它，T463 的服務線／容量／轉乘也不會看到它。它現在只是「有倉儲效果的大樓」，不是「站」。
- **D3｜畫上去的軌沒有拓撲意義。** 依 T611 的披露，k166 的美術軌不連鄰格真軌，`tiles[i].rail` 沒被設置，不進 `MOB_RAIL_COMP462`，因此沒有 dispatch、沒有 throughput，也不會被「同一條軌道」的連通性判斷看到。

> 這三條是**現況描述**，不是缺陷控訴：T611 當時就明說「painted rails do not connect」，本卡只是把它量成可引用的形式。

## 4. 適配設計（提案；本卡不實作）

- **A1｜真前接 predicate（唯讀）。** 以 `mobilityStationTrackFrontage462` 的 `DIRV` 四鄰判定為準，新增 `intermodalFrontage166(rootIdx)` 回傳貼軌格清單。放置條件要不要改成「≥1 貼軌」屬**玩法／數值**，列 [等業主]，本卡只提。
- **A2｜站別註冊（設計，不落地）。** 讓 k166 以「貨運聯運站」身分進入 T462 站別集合，是 LAB-05 的前置；影響面：`mobilityTrackSnapshot462` 的 `stations` 計數、`railStationStats463`、T463 的 line/OD。**本卡不註冊**，避免在沒有貨運列車的情況下先讓客運統計多一個站。
- **A3｜身分用 component id，不新增 tile 型別。** 貨運路線身分取 `MOB_RAIL_COMP462` 的 component id（與客運同一套連通性真相），**不補隱形軌、不加第四種 track 型別**。
- **A4｜貨運列車是 LAB-05 的新載具。** 現有 `railStock469`／`SPR.trainCar` 是客運車廂；貨運列車需要新載具與新容量語意 → 新玩法，LAB-05 開卡時列 [等業主]。

## 5. 驗收條件（動手前寫死，之後不准改鬆）

1. **probe 可重現 D1～D3**：新增 `probeRailTopology04.cjs`，在真 Chrome 載入正式 `index.html`，於可拋棄存檔格（slot 3）造出至少一個 **adjacency=0** 的 k166 實例，並斷言：
   - `countNear(x,y,6,tt=>tt.rail)>=2` 成立但 `mobilityStationTrackFrontage462(idx(x,y))` 回傳 `[]`（D1）；
   - `mobilitySnapshot462().rail.stations` 對該建築不增加（D2）；
   - 該建築周圍 `tiles[].rail` 沒有被美術軌寫入（D3）。
2. **產品零改動**：`git diff --stat origin/main` 只含 `docs/` 與新增的 `probeRailTopology04.cjs`；`index.html` bytes 不變（與 `origin/main` 逐 byte 相同）。
3. **`node smoke.js` 連跑 3 次全綠**（唯讀卡也要跑：證明沒碰壞）。
4. **`node fp.js --check` 零家族變動**（本卡不動美術；若出現變動即為環境漂移，照規則停）。
5. 卡上「沒做成的事」照實寫，不空、不美化。

## 6. 回滾

只新增檔案、不改產品：`git revert` 本卡 commit（或直接棄分支）即回到 `origin/main` 的狀態。

## 7. 施工紀錄（後補）

- （待填）probe 實作與實測數字
- （待填）smoke 3 連綠、fp 結果
- （待填）沒做成的事
