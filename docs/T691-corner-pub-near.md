# T691 — 轉角酒館近景疊層（k197，z≥1.22）（原 DSK-012）

> 原卡標題：DSK-012 轉角酒館近景疊層（k197 的 z≥1.22 細節層）— 分支 `dsk/corner-pub`

> **合併（2026-09-27）**：原 **DSK-012**（DeepSeek 分支 `dsk/corner-pub`，分支卡 `docs/branch/DSK-012-轉角酒館近景.md`）。業主「dsk 的 PR 你能合嘛」→ 雲端 Claude 在最新 `main` 上本地 squash，配 **T691**。下文保留分支卡原文（含「不配 T 號」「不動版本號」等當時的說明）。


> 分支寫入者卡。**不配 T 號**。業主長期自走令：英倫建築、美術第一、不穿模／不出怪線／不非法交疊、做完一段先查重再決定下一段。
> 開卡時間：2026-09-27（`origin/main` = `d172e97`；DSK-011 k197 已在本分支 `6807668`；DSK-007 已在 `dsk/oval-hall`、DSK-008 已在 `dsk/galleried-inn` 做過同一套手法）。
> 本輪不動 `GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md`。

## 1. 為什麼做這一段

DSK-011 卡第 6 節第 1 條＝「沒有近景疊層」。這套手法已在 k193（DSK-007）與 k194（DSK-008）驗證：**只在 z≥1.22 疊加、不動 SPR 精靈 ⇒ 遠距剪影與指紋完全不變**。本輪補 k197，並挑最有料的一棟（酒館的釉面磚、蝕刻玻璃、斜角柱式、瓮形飾在放大時才看得出來）。

## 2. 規格（動手前實測，沿用 DSK-007／008 已驗證的三個掛載點）

- 掛載點：① 近距層註冊表（`['187',…]` 那張表的尾端，加 `['197',…]`）② `draw()` 內顯式呼叫（`drawNearZoomCathedralDSK1(…)` 那行之後）③ 新增函式（插在 `drawNearZoomCathedralDSK1` 之前）。
- 簽名：`drawNearZoomCornerPubDSK12(g,o,bd,s,bx,by,z,drawA,nightDepth)`；閘門 `window.__noNearPub197||z<1.22||!bd||bd.ref||(bd.age|0)<9||bd.k!==197` ＋ `detailPermit432(o.x,o.y,599,z,.62)`。
- 座標：**R2＝精靈座標直算**（`bx+lx*z`／`by+ly*z`）。k197 常數：`CX=68 CY=118`、量體 `S=[96,158]`、`NL=26 NR=12`、`WT=56`；一樓釉面磚 0–22、招牌板 24–30、樓上兩層窗 38／50（高 7／6）、女兒牆 56–58、瓮形飾在 d∈{6,14,22}、斜角門斗在 S、吊招在 `S+7`、桶桌 `gxL(19)`、長凳 `gxR(7)`、花籃 `gxL(27)`。
- 逃生閥：`__noNearPub197`。

## 3. 驗收條件（動手前寫定）

1. 函式存在，原始碼含 `z<1.22`、`bd.k!==197`、`__noNearPub197` 三道閘門，且用 `detailPermit432` 與 `R2`。
2. `draw()` 內真的有呼叫（`String(draw)` 或 `__draw_501` 查得到，且傳 `nightDepth`）。
3. **near>0／far=0**：自檢內用 scratch canvas 量 **z=1.3 有像素**、**z=1.0 與 z=1.2 必須為 0**（量測座標用樣板可通行組 `x=60..67,y=60`，DSK-007 的教訓）。
4. **夜層與日層不同**（像素數不同）。
5. 只給 k197：`bd.k=194` → 0、`age<9` → 0、`bd.ref` → 0。
6. 逃生閥：`__noNearPub197=true` → 0。
7. **指紋零變動**：`node fp.js --check --expect=bld` → 新增恰為 `bld.197_1_0`（DSK-011 帶來的），**本輪不得新增任何葉子**、棘輪 OK。
8. `node smoke.js` 連跑 3 次全綠、0 console error；自檢 `cornerPubNearSelftestDSK12` 掛進 `smoke.js`（**插入前先 `git checkout -- smoke.js` 還原，避免 DSK-011 那次的工作區累積**）。
9. 樣張：近景日／夜入庫 `shotsDSK12/`，肉眼確認無穿模、無怪線。
10. **不動清單**：`GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md` 一律不動。

## 4. 施工紀錄

- **2026-09-27 施工**：`scratchpad/dsk12-apply.js` 5 步（近距層函式插 `drawNearZoomCathedralDSK1` 前、註冊表 `['197',…]`、`draw()` 內呼叫、自檢函式、GV 匯出）＋54 script 語法閘門；smoke.js 條目插在 `['cornerPubDSK11',` 之後。**套用前先 `git checkout -- smoke.js`**（DSK-011 的教訓：切分支會把未提交改動帶走），並先確認殘留條目數為 1 ✓。
- **疊層內容**：釉面磚磚縫與裝飾帶（綠框＋奶油帶）、蝕刻玻璃細格紋與斜反光、斜角柱式凹槽＋柱頭卷渦＋拱心石＋黃銅推板、吊招卷飾與吊鏈、女兒牆瓮形飾凹槽與頂尖、磚牆砌紋與窗台窗楣、瓦壟與屋脊、桶箍／凳面／花籃枝葉／門側黑板；夜間另有字塊透光、燈籠暈與地面燈池。
- **2026-09-27 驗收結果**：
  - 自檢 `cornerPubNearSelftestDSK12` **7 項全綠**：三道閘門、T599 預算槽＋R2、`draw` 內有呼叫、**near>0（z=1.3 畫 1702px）／far=0（z=1.0 與 z=1.2 皆 0）**、夜層不同（1964px）、只給 k197（194→0／age4→0／ref→0）、逃生閥關得掉。
  - `node smoke.js` **連跑 3 次全綠**（57.5s／60.3s／59.6s），0 筆 console error。
  - `node fp.js --check --expect=bld`：新增恰為 `bld.197_1_0`（DSK-011 帶來的）、觸及僅 `bld`、指紋差 == 宣告清單、棘輪 OK ⇒ **本輪零指紋變動**。
  - 樣張：`shotsDSK11/`（`near_day`、`near_day_zoom`、`near_night`、`near_night_zoom` 入庫）；近景夜拍可見釉面磚與蝕刻玻璃字塊透光、角燈燈池對位，無穿模、無怪線。
- **沒動清單**：`GAME_VER`／`GAME_ANCHOR`／版本字／`AUTORUN-LOG.md`／`fp.json`／`docs/DECISIONS.md` 全部未動 ✓。

## 5. 沒做成的事（如實，不美化）

1. **只做表面細節**：沒有新增幾何（沒有立體柱式、沒有真的瓮形飾模型）。
2. **沒有近景動態**：吊招不搖、玻璃不反光流動、沒有酒客。
3. **字樣仍做不出來**：招牌與蝕刻玻璃的字仍只是色塊。
4. **k195／k196 的近景層還沒做**（本輪只補 k197）。
5. **夜間只有一處燈池**：真實酒館的窗光會灑滿人行道，這裡只做一圈。
6. **沒有量效能**：近距層每格約 1700–2000 次 fillRect 級繪製，**沒跑 `perf.js`，沒量就是沒量**。
7. **PR 沒有自己開**：`gh` 帳號非協作者，照舊由業主開或指名分支。
