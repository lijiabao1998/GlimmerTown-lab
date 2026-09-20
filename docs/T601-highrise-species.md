# T601 高層物種：遠距用輪廓分開，不是換色

**基線**：`709ed61` T600  
**業主**：繼續。上一刀承諾把高層切開，不再全城同一種玻璃盒子。

## 根因

`ARCHE568` 的 lv2／lv3 各只有 3 個（工業 lv2／lv3 各 1 個）。商業高層 `podTower`／`setback`／`slabC` 全是平頂＋橫帶窗＋冷藍調色，z=0.68 讀成同一片玻璃林。T600 的 modern／town 只加在 1×1。

## 改什麼

在**原有條目後面追加**（v=0,1,2 身份不變）：

- `1_2`：modernWalk（平頂橫帶）、townWalk（石材拱窗）
- `1_3`：modernPoint（更瘦更高）、townSlab（暖石＋非平頂）、stepTwin（雙塔縫更大）
- `2_2`：modernOffice、stoneHotel
- `2_3`：stoneTower（拱窗石材，不是玻璃帷幕）、modernNeedle（針）、courtC（凹院）
- `3_2`：mill／warehouse／stack
- `3_3`：mill3／tankfarm／chimneyHall

`speciesPal601`：modern 走白灰冷牆，town／stone 走暖石＋磚紅頂，mill 磚廠。工業大街廓無第二量體時，分割門檻 6→4 格。

## 不改

存檔、模擬、RNG、1_1／3_1 既有順序、主線、8123。

## 逃生閥

`window.__noSpecies601`：調色與現代／石材線腳退回舊 pal；原型表仍在（要整段退用 git）。

## 驗收

1. `1_3`／`2_3` 前三個名字不變。
2. 同尺寸 v=0 與 v=3 的 CRC 不同（slab≠modernPoint，podTower≠stoneTower）。
3. 3_2 至少 4 種，warehouse 牆高明顯低於 stack。
4. 煙霧綠；fp `--expect=block559`。

## 施工紀錄

- 煙霧綠 13.8s；species601 15/15。發現針塔 `hm=2.4` 以前畫布仍按 hm=1 開，樓頂被裁掉——改成先乘 hm 再開畫布，point／podTower 也跟著長高。
- fp `--expect=block559`：`6a5f5684 → 165e5de4`。SPR 0/0/0。
- after：`shots/T601_city_after.png`。
- **沒做成**：① 1×1 圖集 mkBld 72px 沒對齊這本詞典 ② 玻璃帷幕 pal 對舊 podTower v=0 沒改（有意保留身份）③ 工業合併仍可能大塊，只是無 ex 的 4 格起切

