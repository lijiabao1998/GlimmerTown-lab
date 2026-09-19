# T581 — bridge476 夜圖 ＋ railStock469 夜圖盤點

**輪次**：r31　**基線**：T580 v13.14　**選題**：記分卡佇列 bridge476（64 葉、零夜圖）＋ railStock469 盤點

## 1. 探針結果
- `bridge476`：4 族 × 16 mask = 64 片裸 canvas（`arr.push(c)`，無 night）
- 消費端：`gc.drawImage(im, sx, sy-10*z, 64*z, 42*z)`（31741 行附近）
- `railStock469`：`{loco:{A,B,NA,NB}, car:{A,B,NA,NB}}` × 11 組 = 132 葉
  —— **NA/NB 已正確配對**（T579 walk 修正後 fp.js 正確計入），不需改動

## 2. 驗收條件（動手前寫定）
1. bridge476 每片有夜圖：路緣燈柱暖光（沿 rm mask 路徑）
2. 日層不動（只加 night 層）；夜圖在 `__nd550>0.25` 時合成
3. railStock469 盤點確認 NA/NB 配對正確（不改）
4. 指紋差 == `bridge476`；棘輪不退步；煙霧綠；A/B 接觸表

## 3. 施工
（完成後填）

## 4. 守衛
（完成後填）
