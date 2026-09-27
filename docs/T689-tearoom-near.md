# T689 — 英式茶室近景疊層（k196，z≥1.22）（原 DSK-014）

> 原卡標題：DSK-014 英式茶室近景疊層（k196 的 z≥1.22 細節層）— 分支 `dsk/tearoom`

> **合併（2026-09-27）**：原 **DSK-014**（DeepSeek 分支 `dsk/tearoom`，分支卡 `docs/branch/DSK-014-英式茶室近景.md`）。業主「dsk 的 PR 你能合嘛」→ 雲端 Claude 在最新 `main` 上本地 squash，配 **T689**。下文保留分支卡原文（含「不配 T 號」「不動版本號」等當時的說明）。


> 分支寫入者卡。**不配 T 號**。業主長期自走令：英倫建築、美術第一、不穿模／不出怪線／不非法交疊、做完一段先查重再決定下一段。
> 開卡時間：2026-09-27（`origin/main` = `d172e97`；DSK-010 k196 已在本分支 `b2e13c8`；同一套手法已套用於 k193／k194／k197／k195，最近一次 DSK-013 `3080392`）。
> 本輪不動 `GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md`。

## 1. 為什麼做這一段

DSK-010 卡第 6 節第 1 條＝「沒有近景疊層」。本輪補 k196，把「高街三間店面」的近距細節補齊（k195 於 DSK-013 完成）。

## 2. 規格（動手前實測）

- 掛載點三處（同 DSK-013）：近距層註冊表 `['187',…]` 之後加 `['196',…]`；`draw()` 內 `drawNearZoomCathedralDSK1(…)` 那行之後；函式插在 `drawNearZoomCathedralDSK1` 之前。
- 簽名：`drawNearZoomTearoomDSK14(g,o,bd,s,bx,by,z,drawA,nightDepth)`；閘門 `window.__noNearTea196||z<1.22||!bd||bd.ref||(bd.age|0)<9||bd.k!==196` ＋ `detailPermit432(o.x,o.y,599,z,.62)`。
- 座標：`R2` 精靈座標直算；k196 常數：`W=72 H=112 ax=36 ay=110`、`S=G(13,13,0)=[36,104]`、`NL=NR=13`、`WT=38`；奶油拉毛牆＋鼠尾草綠勒腳 0–4、弓形凸窗（L 面 d 2–11，豎框在 d 2／6／11）、**條紋遮篷**（同 d 2–11，篷簷桿 y-25）、大門（R 面 d 9–12）、招牌板 27–21（含茶壺）、樓上推拉窗（L d∈{4,9}／R d∈{4,10}）＋窗台花箱（葉 y-27–25、花 y-26）、屋面 `ov=[9,-5]`＋老虎窗（rL+4）＋煙囪（`gxR(6)`）、圓桌兩椅（`gxR(4)`）、黑板（`gxL(7)`）。
- 逃生閥：`__noNearTea196`。
- **錨要取本分支最新狀態**（DSK-013 的教訓）：匯出清單用 `tearoomSelftestDSK10,batterseaSelftestDSK4`、smoke 用 `['tearoomDSK10',`。

## 3. 驗收條件（動手前寫定）

1. 函式存在，含 `z<1.22`、`bd.k!==196`、`__noNearTea196` 三道閘門，且用 `detailPermit432` 與 `R2`。
2. `draw()` 內真的有呼叫（含 `nightDepth`）。
3. **near>0／far=0**（z=1.3 有像素；z=1.0 與 1.2 為 0）；量測座標用 `x=60..67,y=60`。
4. **夜層與日層不同**。
5. 只給 k196：`bd.k=195`／`age<9`／`bd.ref` 皆回 0。
6. 逃生閥 `__noNearTea196=true` → 0。
7. **疊層自身不越台基菱形**（z=1.3 下量最低點 vs `rim`，容差 2px）——沿用 DSK-013 新加的斷言。
8. **指紋零變動**：`fp --check --expect=bld` → 新增恰為 `bld.196_1_0`，本輪不得新增任何葉子。
9. `node smoke.js` 連跑 3 次全綠、0 console error；自檢 `tearoomNearSelftestDSK14` 掛進 `smoke.js`（套用前先 `git checkout -- smoke.js`）。
10. 樣張：近景日／夜入庫 `shotsDSK10/`，肉眼確認無穿模、無怪線。
11. **不動清單**：`GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md` 一律不動。

## 4. 施工紀錄

- **2026-09-27 施工**：由 DSK-013 的補丁腳本改寫（函式名／k 值／逃生閥／錨點全換）⇒ 一輪完成；套用前先 `git checkout -- smoke.js` ✓。
- **踩雷 1**：兩個替換沒命中（前序替換已改動文字）⇒ 註冊表的 `['195',` 與 GV 匯出清單的錨要改成**本分支的實際文字**（`tearoomSelftestDSK10,batterseaSelftestDSK4`）。**教訓同 DSK-013：連續施工時錨要取本分支最新狀態。**
- **踩雷 2**：`probeDSK9.js` 是**已提交在 `dsk/chippy` 的檔案**，切到本分支後就不存在了 ✗ ⇒ 現有探針 `probeDSK10.js` 沒有 near 模式。解法：`git show dsk/chippy:probeDSK9.js` 取出後把 near 區塊轉成 k196 版本插入 ✓（並注意 Windows 的 python 讀不到 Git Bash 的 `/tmp` ⇒ 改用 `scratchpad/` 中轉 ✓）。
- **疊層內容**：拉毛粉刷顆粒與橫向抹痕、弓形凸窗豎框立體＋**蕾絲波浪簾**＋檯面**茶壺與茶杯**、**條紋遮篷的條紋陰影與波浪下緣（valance）**、**茶壺招牌的壺蓋壺嘴壺把與金邊**、招牌板雙線與字塊、窗台花箱花叢與垂葉、推拉窗格條與窗台、屋面瓦壟與脊瓦、老虎窗頰面與小尖飾、煙囪帽與管口、圓桌桌面與椅背、黑板粉筆線；夜間另有篷下暖光、窗內暖暈與地面燈池。
- **2026-09-27 驗收結果**：
  - 自檢 `tearoomNearSelftestDSK14` **8 項全綠**：三道閘門、T599 預算槽＋R2、`draw` 內有呼叫、**near>0（z=1.3 畫 877px）／far=0（z=1.0 與 z=1.2 皆 0）**、夜層不同（1405px）、只給 k196（195→0／age4→0／ref→0）、逃生閥關得掉、**疊層自身不越台基菱形（越界欄 0）**。
  - `node smoke.js` **連跑 3 次全綠**（72.0s／62.7s／57.7s），0 筆 console error。
  - `node fp.js --check --expect=bld`：新增恰為 `bld.196_1_0`（DSK-010 帶來的）、觸及僅 `bld`、指紋差 == 宣告清單、棘輪 OK ⇒ **本輪零指紋變動**。
  - 樣張：`shotsDSK10/`（`near_day_zoom`、`near_night_zoom` 入庫）；近景日拍可見抹痕、條紋遮篷波浪下緣、蕾絲與花箱，無穿模、無怪線。
- **沒動清單**：`GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md` 全部未動 ✓。

## 5. 沒做成的事（如實，不美化）

1. **只做表面細節**：沒有新增幾何（茶壺與茶杯都是貼圖級）。
2. **沒有近景動態**：遮篷不飄、沒有喝茶的人、沒有蒸氣。
3. **字樣仍只是色塊**：招牌上的店名做不出來。
4. **五棟建築的近景層到本輪才補齊**（k193／k194／k197／k195／k196），但**都沒有在真實城市長時間目視檢查**（只有探針截圖）。
5. **夜間只有一處燈池**：茶室篷下的光應該灑在人行道上更多。
6. **沒有量效能**：近距層每格約 900–1400 次 fillRect 級繪製，**沒跑 `perf.js`，沒量就是沒量**。
7. **PR 沒有自己開**：`gh` 帳號非協作者，照舊由業主開或指名分支。
