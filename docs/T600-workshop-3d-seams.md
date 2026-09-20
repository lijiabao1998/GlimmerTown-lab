# T600 工坊立體量體＋縮放細線＋道路斜紋＋更多房型

**基線**：`e929fe3` T599  
**業主**：工坊像貼紙、有一側另一側沒了；特定縮放冒細線；路上斜斜一道一道；為啥不能加更多房子。

## 根因（量過，不是猜）

1. **缺側牆**：`clipLotFootprint596` 垂直棱柱的西／東邊剛好落在 1×1 街區精靈的左／右牆（`edgeWall547` 只有 1px 寬）。非整數 `z` 時 clip 邊界把整面牆排除 → 「有一側沒了」。72×112 工坊再被同一把刀裁成紙片。
2. **工坊仍是貼紙**：k=1 1×1 已走 `getBlockSprite547`（雙牆＋屋頂）。k=2／k=3 1×1 仍用 `mkBld` 72px `isoBox` 再裁切。
3. **細線／斜紋**：地面 `drawImage(sx,sy,64*z,32*z)` 各自 round 出縫；`fabricDiamond500`／`weatherDiamond499` 內縮 1z 在路上畫出一圈斜邊；`drawRoadHierarchy478` 0.9*z 的 stroke 在分數縮放變成頭髮絲。
4. **房子不夠**：`ARCHE568['1_1']` 只有 villa／bungalow／cottage 三個；`3_1` 只有一個 shed。

## 改什麼

- 1×1 工商改走 `getBlockSprite547`（雙牆＋頂＋煙囪／捲門），`s.__t547` 不再垂直裁。
- 72px 舊圖仍裁，避免又畫進鄰格。
- `1_1` 在原 3 個後面加 modern（平頂橫帶窗）與 town（更高拱窗）；`v%` 前三個不變。
- `3_1` 加 workshop／sawShed／yard。
- `isoBlit600`：相鄰格 dest 用頂點 round＋1px 重疊。
- 菱形材質改全幅（不再內縮 1z）；標線寬度至少 1px，z<0.92 不畫虛線。
- villa 判定改 `ar.n==='villa'`，避免新 v 誤開院子。

## 不改

存檔、模擬、RNG、主線、8123、8199。

## 逃生閥

- `__noMass1x1600`：工商 1×1 退回 72px＋裁切
- `__noIsoBlit600`：地面／道路 dest 退回舊式
- `__noRoadStripes600`：標線全關
- `__noLotClip596`：仍可用

## 驗收

1. 工坊 1×1 左右牆都在，不再像單面貼紙。
2. 分數縮放（如 z=0.85）草地／道路交界沒有頭髮絲。
3. 路上沒有一圈一圈的內縮斜邊。
4. 同一條街能看出 villa／terrace／modern 不是換色。
5. 煙霧綠；fp 若只動 block559 就 `--expect=block559`。

## 施工紀錄

- 煙霧綠 17.7s（8299）；workshop600 17/17；overlay596 仍綠（72px 舊圖繼續裁、不漏鄰格）。
- fp `--check --expect=block559`：SPR 0/0/0，超街區快取 `0b0f35b2 → 6a5f5684`（1×1 原型加種＋工坊改走街區精靈，如宣告）。
- after：`shots/T600_city_after.png`。
- **沒做成**：① 72px 舊圖集本身沒重畫，只是 1×1 放置改走 3D ② 大街區 k=3 合併量體仍是鋸齒廠，不是小工坊 ③ 細線在極端非整數 z 仍可能有 1px ④ 房子新種（modern/town）只加在 1×1，lv2/lv3 沒動
