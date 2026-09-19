# T584 — 幀率基線台（Perf Baseline Bench）

**輪次**：r33　**基線**：T583 v13.16　**狀態**：施工前

## 1. 進場探針（量到的事實）

- `smoke.js` 只斷言「rAF 有遞增」（65 frames/1.2s 印在 log 裡，不落地、不比對、沒有場景變化）。
- 遊戲內部已有現成測試鉤子（全部只動渲染、不寫存檔、不消耗模擬 R()）：
  `GV.setVisT(v)`（T149，設日夜相位）、`GV.setZoom(z)`（T149）、
  `GV.lookAt(x,y)`（T183）、`GV.setViewRot(r)`（T367）、
  `GV.forceDraw()`（T149，同步觸發一幀 draw()）、`GV.daylightDbg()`。
- `daylight()`：`ph=(visT%110)/110`，0.25 日出／0.75 日落；正午 ph≈0.5（b=1）、深夜 ph=0 或 1（b=.34）。
- 相機狀態：`cam={x,y,z}`（模組內 `let`）；旋轉 `setViewRot` 會存 `localStorage SAVEKEY+'.viewRot'`——**採樣結束必須還原 rot/zoom/visT**，否則污染本機偏好。
- r32 未盡事項明寫「量體分割增加 sprite 建構成本，**未實測**」——目前全專案沒有任何幀率數字。
- `fp.js` 的 meta 取 `GV.build534()`，該物件是**寫死的歷史錨**（12.89/T534），不跟 GAME_VER 走 ⇒ fp.json 的 version 欄位是化石，本卡順手補 `GV.buildCurrent()`，fp.js 優先使用、build534 為回退（向後相容）。

## 2. 驗收條件（動手前寫死）

1. `node perf.js` 跑完產生 `perf.json`，內含 6 個場景各自的 `{frames, seconds, fps, visT, zoom, rot}`：
   `day_noon`（ph=.5）／`night`（ph=.0）／`rot1_day`／`rot3_day`／`zoom_far_day`（z=.68）／`zoom_near_day`（z=2）。
   每場景採樣前用 `forceDraw()` 暖機 3 幀丟棄，採樣 2.4s。
2. 每場景結束後**狀態還原**（rot→0、z→1、visT→進場值），下一場景起始條件一致。
3. `smoke.js` 結尾追加 perf 快採（正午 1.2s 單場景），納入煙霧輸出；**不新增紅燈條件**（基線建立前沒有可比的數字）。
4. `node fp.js --check` 維持 0/0/0（本卡零像素變更，只動測試鉤子層與工具腳本）。
5. 煙霧綠；`git commit`；perf.json 入庫當「施工前基線」。

## 3. 不改什麼

- 不改任何 draw()／sprite／模擬碼（零像素、零 RNG 影響）。
- 不改 harness.js 的進城流程。
- 不對 fps 設門檻（本輪只量，下輪起才棘輪）。

## 4. 施工紀錄（如實記，含失敗）

1. **旋轉鉤子名猜錯**：探針時把 T367 的出口記成 `GV.setViewRot`，實際是 `GV.setRot`（index.html 49146 行）。首跑 `TypeError: GV.setViewRot is not a function`，改正後通過。
2. **perf.js 被 PowerShell 毀檔一次**：`Get-Content -Raw | Set-Content -Encoding UTF8` 置換把檔首加 BOM、Big5 雙位元組字元吃掉字串裡的 ASCII 引號位元（`'深夜（夜圖全合成）'` 的 `）'` 變亂碼），整檔報廢重寫。**教訓寫進 perf.js 檔頭**：文字檔編輯禁用 PowerShell 重導向，一律 editor 工具或 node 顯式 UTF8。
3. **版本號改從 DOM 讀**：原案想加 `GV.buildCurrent()`，發現 `startVersion456` 元素文字就是 `v13.16 · T583`，直接讀 DOM 達成**零 index.html 變更**（純工具輪，版本錨不 bump）。
4. **基線數字（無頭軟算，相對值，非玩家實機）**：day_noon 40.4／night 28.4／rot1 33.9／rot3 40.1／zoom_far 46.9／zoom_near 44.9 fps。兩個立刻有用的發現：**夜景比日景慢 30%**（夜圖 screen 合成代價，之後夜圖輪要盯）、**rot1 比 rot0/rot3 慢 16%**（旋轉快取不對稱，T585 一併看）。
5. smoke.js 新增階段 4e：正午 1.2s 快採，只記不判（對照 perf.json day_noon）。
