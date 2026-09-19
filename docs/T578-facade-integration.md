# T578 — 英式美式立面風格正式整合（點燃 T577 的登記表）

**輪次**：r28
**基線**：`778e857…` 系列；實際 HEAD 為 T577 之後的 `18c7ed1` 線（v13.12 自報 T577）
**狀態**：施工中
**業主指令**：「英式美式的街道和建築的融合」「素材種類、密度、分類完全超越」

---

## 1. 進場探針（量到的事實）

1. `ARCHE568` **已把英美風格分配給各住宅原型**：`fs:'ukSemi'`／`ukTerrace`／`ukMansion`／
   `ukVictorian`／`usBrownstone`／`usPrewar`（`index.html` 12881 行起）。
2. **5 個風格 snippet 已寫好**（`variants574/facade_uk1.js`…`facade_usmain.js`，共 12.2KB），
   註冊 **8 種風格**：ukSemi／ukTerrace／ukMansion／ukVictorian／ukHighStreet／
   usBrownstone／usPrewar／usMainStreet。
3. **但 `window.__facade577` 在 index.html 裡只有 1 處讀取（`facadeFor577`）、0 處賦值**
   ⇒ **正式遊戲裡這 8 種風格全部關閉**，RCI 一律走核心後備路徑。
4. `probe-facade.js`（T577 建的測試工具）用 `--snippet` 把 snippet 以 `preScript` 注入測試——
   即這些風格**只在測試裡亮過**（shots577/ 有 173 張驗證圖），從未進正式版。

**結論**：業主要的「英式美式融合」**已經寫好了九成，只差把註冊腳本放進正式檔**。
這是純整合輪：零新像素、零新邏輯，把已驗證的資產接上。

## 2. 驗收條件（動手前寫定）

1. index.html 內新增一個 `<script>` 區塊，**原樣內嵌** 5 個 facade snippet（不加改動，
   逐字保留；以 `<!-- T578 -->` 標記），在 `runVariants574()` 同層級執行。
2. 整合後 `Object.keys(window.__facade577)` **必須含 8 個風格鍵**。
3. 進入城市後 `block559.cache().clear()` 再取一棟 `k=1,lv=2`（原型 walkup，`fs:'usBrownstone'`）
   的 sprite，其 `__t547.sty` 必須是 `'f577:usBrownstone'` ⇒ 證明風格真的接手。
4. 每種風格至少一張**日夜接觸表**（沿用 T577 測試時的 shots577 圖為歷史對照，本輪出正式 shots/ 圖）。
5. 指紋差 == 宣告清單（預期 `bld`；若 walkup/villa 重建路徑連帶共用 canvas 則照實宣告）。
6. 棘輪不退步；煙霧綠；**幀率檢查**（8 種風格都是 draw 時即時繪製，須確認超街區快取沒被擊穿）。
7. 逃生閥：`window.__noFacade577`（既有）保持有效——關掉後全數回退核心繪製。

## 3. 不改什麼

- **snippet 本體一字不改**（它們已在 shots577 驗證過；動了就要重驗）。
- 不動 `facadeFor577` 消費端、不動 ARCHE568 分配、不動模擬／存檔／RNG。
- 不動 T547 超街區合併與分條遮擋。

## 4. 已知風險（先講）

1. **繪製成本**：8 種風格都是 draw 時即時多邊形繪製。超街區快取（`BLOCK_SPR547`）會把結果
   快取成 sprite ⇒ 只在首次繪製付費。但 `cache().clear()` 之後（例如換地圖）會重付。須量幀率。
2. **snippet 間的執行順序**：各檔 IIFE 互不依賴，理論上任意順序；整合時照 uk1→uk2→ukhigh→us1→usmain。
3. **`ar.fs` 的覆蓋率**：ARCHE568 只分配了部分原型；沒有 `fs` 的原型走核心後備——**這是現狀，不是退步**。

## 5. 施工紀錄

（完成後填）

## 6. 守衛

（完成後填）
