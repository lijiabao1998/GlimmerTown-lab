# T661 — 灣城自然岸線（原 GLM-001）

> 原卡標題：GLM-001 — 灣城自然岸線語彙（Bay Bank Grammar）

**分支**：`glm/alleys-riverside`（自 `3f0bbad` r102/T655 v13.60 開出）
**狀態**：完工（本卡含施工紀錄）
**主題**：美術 — 水岸。碼頭（T498/T505 系）有完整語彙，**自然岸線**（草地/街區直接臨水）只有裸崖邊——實測 shots/GLM001_seam_0.png 證實。

## 查證（業主規則：不懂的聯網檢索）

真實港灣岸壁語彙（2026-09-25 檢索）：
- 愛爾蘭 EPA 港區遺產評估：「original **mooring-rings set into the quay walls** are retained, and the elegantly-cut **stone steps**」——繫船環嵌在岸壁裡、精切石階下水
- Glasgow 規劃文件：「**collector drains fixed to quay walls** to collect discharges」——岸壁排水收集管入水
- Thames 碼頭影像：石階、繫船柱、木樁、磚倉庫、潮痕
出處：epawebapp.epa.ie、docs.planning.org.uk、dreamstime.com（Thames Quay）

## 改什麼（僅地面烘焙層 draw-side；streetHash 決定性；零 R()；不入 save）

`drawBayBankGLM1(gc,x,y,sx,sy,z)`：陸地格 `waterNeighborMask479≠0` 時，沿**朝水邊緣**在陸地菱形**內側**畫灣城岸壁帶——

- **都市岸**（2 格內有建築）：石砌護岸帶（方塊接縫 tick、外緣壓頂亮線、內側陰影線）、**潮痕暗帶＋藻點**（外緣 1.5px）、岸壁**繫船環**（20%）、**排水涵管口＋瀝痕**（15%）、**石階下水**（10%，三級踏步）
- **野岸**（2 格內無建築）：土岸唇、**木樁**（8%）、草簾垂緣
- 幾何鐵律：全部圖元內縮在陸地菱形內（edge→center 內縮 ≤7px），**零越格**＝不會在水面格留下像素（不穿模、不出怪線）
- 逃生閥 `window.__noBayBankGLM1`；計數 `__tGLM1BankCount`（掛烘焙清零區）

## 不改什麼

`GAME_VER`/`GAME_ANCHOR`/開場版本字、`AUTORUN-LOG.md`、`fp.json`、`docs/DECISIONS.md`（AGENTS.md §2 第 5 條）；水面格、碼頭元件（T498 既有）、模擬/save。

## 驗收條件（動手前寫死）

1. 同 run A/B（閥 on/off 各 forceDraw toDataURL）畫面必須有差異，且計數 ≥1。
2. `node fp.js --check` 零變動（烘焙層非 sprite）。
3. `node smoke.js` 綠。
4. 近景樣張：岸線可辨識石砌帶＋潮痕；**水面格零污染**（內縮幾何保證＋樣張目視）。
5. 幾何守衛：probe 內對水面格取樣——閥 on/off 的水面區域像素必須逐位相同（證明零越格）。

## §施工紀錄

- 守衛 v2 全綠：全畫布 A/B diffPx 大範圍分布（bbox 1119×699）、取樣色 rgb(123,120,104)/
  rgb(142,140,121)＝石砌色系命中、深水窗 waterDiff=0（零越格證明）、cnt=53 格命中。
- 途中兩失誤已修：①`t.rail` 用了不存在的參數 t（函式內自取 tile）；②探針取樣順序
  （兩次 getImageData 同狀態＝空洞比較）與未強制重烘（快取命中＝假 diff:false）。
- 埠 8199 被 dsk 佔用 ⇒ 本 worktree 全套工具改 8198 並聯。
- 沒做成的事：①岸帶在全畫面縮圖下偏細（4-8px），要不要加寬屬觀感，出對照圖給業主；
  ②小船靜態剪影未做（留 GLM-002 候選）；③僅種子城驗證，實機業主城市待看。

## 合併時（Claude 在雲端本機跑的，2026-09-26）

業主「合一下 PR」點頭。PR [#3](https://github.com/lijiabao1998/GlimmerTown-lab/pull/3)（`glm/alleys-riverside`）只取 GLM-001／002／003 四個 commit（`9c3ccd9`、`483c46d`、`282de5a`、`b16c394`）在 T660 `2f6e5fc` 上合成一個 commit，配 **T661（岸線）／T662（舊牆廣告）／T663（退役 591／593）**，v13.68（13.66、13.67 沒有單獨的版）。

- **沒帶進 `main` 的**：①GLM 把 `smoke.js`、`fp.js`、`probe-look.js` 的預設埠改成 8198（為了跟同一台機器上的 DSK 並聯）——`AUTORUN.md` 邊界是自用埠一律 8199，照舊；要並聯請用 `--port=8198` 參數，不改預設。②GLM-004（繫岸小舟）：分支上自己退回了，卡上寫「A/B diffPx=0 與計數 +2 矛盾未解」，沒做完，不合。
- **合併時修的（都是 GLM 程式裡的錯，修完照卡意）**：
  1. T662 `paintGhost606`：字跡殘影的透明度寫成 `(.34-t*.12)`，`t` 是精靈物件 → NaN → 顏色字串無效、沿用上一筆底色，**三行字跡殘影一直畫不出來**；改成年歲 `tt`。
  2. T661 `drawBayBankGLM1`：排水涵管口與瀝痕把 `[x,y,w,h]` 當點列傳給 `R()`，`moveTo` 拿到 undefined，**管口與瀝痕一直沒畫**；改成四個角點。
  3. T661 計數 `__tGLM1BankCount=0` 原本接在 `// T447-R12…` 那行註解裡、從來沒執行，搬到註解前（同一行的 `__t592LotCount=0` 也在註解裡，是 T592 原本的缺口，沒動）。
  4. T661 地面快取鍵加 `__noBayBankGLM1`（`_bb0`），不然遊戲中關閥門要等下次重烘才生效（探針有呼叫 `testRebake592` 所以沒踩到）。
  5. 兩支探針埠 8198 → 8199。
- **煙霧**：綠 3／紅 0（37.4–39.7s）。**GLM 沒有把自檢掛進 `smoke.js`**（`AGENTS.md` 第 2 節第 4 條要求），守衛只有探針。
- **探針（修完後重跑）**：`probeGLM1.js` 綠（石砌色取樣 rgb(123,120,104) 等、深水窗 waterDiff 0）；`probeGLM2.js` 綠（diff true、31 棟）。
- **`fp.js --check`**：零變動（都畫在地面層、牆面快取，不動精靈）。
- **目視**（`probeGLM1` 同鏡頭）：效果很淡、零散——部分岸格出現一小塊灰色護岸帶加一個黑色繫船環，看起來比較像一塊灰斑。程式註解寫「都市岸 78% 鋪護岸」，實際條件 `hE>.22` 跳過＝只有 22% 鋪。GLM 自己也在卡上說「岸帶偏細、要不要加寬屬觀感」。逃生閥 `__noBayBankGLM1`。
