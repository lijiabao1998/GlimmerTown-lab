# T657 — 英國維多利亞街角店屋（原 GPT-001，High Street Corner Shop）

> **合併紀錄（Claude，2026-09-26）**：業主「合一下 PR」點頭。PR [#6](https://github.com/lijiabao1998/GlimmerTown-lab/pull/6)（`gpt/visual-place-identity`）在 T656 `0845f17` 上本地 squash，配 **T657**、v13.62。原卡內文照留，第 8 節是合併者本機補跑的真實數字（AGENTS.md 第 5 節第 4 條）。

**分支**：`gpt/visual-place-identity`  
**基線**：`3f0bbad`（main，v13.60 / T655）  
**狀態**：🟢 GPT-001 施工完成；CI smoke 綠  
**性質**：英倫街景新增美術；不改模擬、不改存檔、不改版本號。

---

## 1. 先量：現況與避免重複

- main 已有 `ukHighStreet`：商業 lv1 `cornerLot` 會畫英國高街店屋，lv2 `hotel` 畫旅館。
- `grok/london-mews` 已在做倫敦 mews，這張卡不碰 mews。
- `dsk/uk-cathedral`（若持續存在）是大型宗教建築方向，這張卡不碰 cathedral。
- 這張卡只把商業 lv1 的既有 `townShop` 變體改成**另一個清楚可辨的英國店屋物種**，不增加 ARCHE568 長度，避免 v→原型 modulo 身份漂移。

## 2. 真實世界取材（只取建築語彙，不取素材）

Historic England 對 19 世紀／20 世紀初傳統 shopfront 的共同構件描述：
- fascia（橫向店招板）
- cornice（上緣檐口）
- consoles / brackets（店招兩端托座）
- pilasters（店面兩側壁柱）
- stallriser（櫥窗下的實牆／護板）
- recessed doorway / lobby（內縮入口）

Historic England 的列級建築個案亦常見：紅磚上層、sash windows、gauged brick lintels、painted sills、parapet / cornice、獨立通往樓上住宅的側門；街角個案可有 canted corner / corner entrance。

參考：
- Historic England, *The Shopfronts of Lowestoft High Street*：https://historicengland.org.uk/research/results/reports/8427/
- Historic England, *Webinar on Talking Shop: An Introduction to Historic Shopfronts*：https://historicengland.org.uk/education/training-skills/training/webinars/recordings/webinar-on-talking-shop-an-introduction-to-historic-shopfronts/
- Historic England, 92 London Street（late-C19 timber shopfront）：
  https://historicengland.org.uk/listing/the-list/list-entry/1113528
- Historic England, 122–128 London Road / 2–4 Highfield Street（canted corner / glazed corner door）：
  https://historicengland.org.uk/listing/the-list/list-entry/1245131

**證據邊界**：以上只作原創像素建築的構件與比例語彙；不下載、不描摹、不嵌入任何真實建築圖片／素材。

## 3. 這一輪只做什麼

把商業 lv1 原型 `townShop` 指向新 facade：`ukCornerShopGPT001`。

新建築要有：
1. 紅／棕磚上層；
2. 明確的 timber shopfront frame：pilaster + fascia + cornice + stallriser；
3. recessed shop doorway；
4. 一扇獨立的樓上住宅入口；
5. 兩層 sash-window 語彙（窗台、楣線、中挺／橫檔）；
6. parapet / cornice 與至少一組 chimney pots；
7. 有足夠街角寬度時做 canted-corner / corner-door 視覺提示；
8. 夜光只落在白天真正存在的櫥窗／窗玻璃上。

## 4. 明確不做

- 不碰 `GAME_VER`、`GAME_ANCHOR`、開始畫面的版本字。
- 不碰 `AUTORUN-LOG.md`、`fp.json`、`docs/DECISIONS.md`。
- 不碰 mews、cathedral、樹種、岸線。
- 不增加新的模擬欄位、不消耗世界 RNG。
- 不做全城色調／光影改色；這一輪是局部建築物種，不需要替業主選 global look。

## 5. 驗收條件（動手前）

### 結構自檢（掛 smoke）
新增 `window.GV.gptCornerShopSelftest001`，至少斷言：
1. `ukCornerShopGPT001` 已登記；
2. `ARCHE568['2_1']` 的 `townShop` 名稱、box、hm 不變，只多 `fs:'ukCornerShopGPT001'`；
3. 強制畫 `ukCornerShopGPT001` 能產出非空 sprite；
4. 與關掉 GPT-001（回舊 townShop）相比 CRC 不同；
5. 新 sprite 夜圖的亮像素全部落在白天不透明像素上；
6. 不更改 `ARCHE568['2_1']` 條目數量。

### 像素守衛（GPT 不能本機跑）
新增 `probeGPT001.js`，待合併者本機跑：
- 固定建立 townShop 新／舊各一張；
- 報日圖 CRC、夜圖 CRC、非空像素數；
- 報夜光落在白天透明像素上的 bad count（要求 0）；
- 報超出畫布／負尺寸／非有限座標（要求 0）；
- 輸出近景新／舊 PNG 供人工檢查穿模、怪線、非法交疊。

### CI
- `smoke.js` 加 `gptCornerShop001`。
- GPT 端只以 GitHub Actions 結果記錄煙霧，不把未跑的 pixel probe 寫成「通過」。

## 6. 逃生閥

- `window.__noGPTCornerShop001=true`：`townShop` 走回 GPT-001 前的內建畫法。
- cache key 必須帶逃生閥狀態，避免新舊精靈共用快取。

## 7. 施工紀錄

已施工：townShop 接入 ukCornerShopGPT001；新增 facade 原始碼、逃生閥快取隔離、smoke 自檢與 probeGPT001.js。  
**煙霧測試**：GitHub Actions 綠 — https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36184420125  
**像素守衛**：未跑，待合併者跑（依 AGENTS.md §5）。  
**樣張**：本次 GPT 無本機瀏覽器；待合併者執行 probeGPT001.js 產生。  
**沒做成的事**：GPT 端無法本機跑像素 probe / fp.js；未把這兩項寫成通過。

## 8. 合併時（Claude 在雲端本機跑的，2026-09-26）

- **沒帶進 `main` 的**：`.github/workflows/gpt001-integrate.yml`（只在 `gpt/visual-place-identity` 觸發、帶 `contents: write` 往分支推的整合工作流）與 `tools/gpt001-integrate.js`（把原始碼嵌進 `index.html` 的工具）。這兩個是 GPT 分支的施工架子，進 `main` 只會留下一個永遠不觸發、但有寫入權的工作流。嵌進 `index.html` 的那段已逐字比對，跟 `variants574/facade_gpt001.js` 相同，原始碼檔留著。
- **合併時改的**：`probeGPT001.js` 樣張目錄 `shotsGPT001/` → `shots657/`（被 `.gitignore` 擋）；快取鍵與 T656 馬廄的閥門接在同一行（兩條分支都改了這行，合併衝突，兩個尾碼都留）。
- **煙霧**：綠 3／紅 0（37.5–38.5s），`gptCornerShop001 OK（7 項）`、`ukMewsGROK2 OK（16 項）`。
- **`probeGPT001.js`（原標「未跑」，本機跑過）**：新版日圖不透明 6,128 px、夜光 494 px、**浮空夜光 0**；舊版 5,786／156／0；日圖 CRC 新舊不同。精靈 160×132，樣式 `f577:ukCornerShopGPT001`。
- **`fp.js --check --expect=block559`**（原標「未量」）：葉子 0 變動；超街區 `e5cd087f → 635794cb`，`fp.json` 已更新，之後 `--check` 全綠。
- **目視**（`shots657/GPT001_{old,new}_{day,night}.png`）：沒有穿模、怪線或越出佔地；店面玻璃、店招、壁柱、側門、煙囪都在。但**比舊的 townShop 陽春**：2×2 佔地只有一層半高，屋頂一大片空的灰色平頂，樓上窗很小；舊版有退台、屋頂設備、多層窗帶。逃生閥 `window.__noGPTCornerShop001=true` 可回舊版。

