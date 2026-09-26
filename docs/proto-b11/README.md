# 第十一批決策單的原型碼（不是遊戲本體）

決策單：https://claude.ai/artifact/XnLnfJqwcqE3FCu7biWeYA（業主 2026-09-26 選 1D、2B、3B、4C、5B → T677–T681 施工；`docs/DECISIONS.md`）。
這些是拍對照圖用的**臨時實驗碼**，拍完已 `git checkout -- index.html` 還原；放在這裡是讓之後施工的人（不管哪個 session、哪個寫入者）能重現決策單上的圖，施工後要跟決策單的圖逐像素比對。

| 檔 | 內容 | 怎麼開 |
|---|---|---|
| `bigben.js` | k190 大笨鐘 1×1、k191 西敏宮 2×2（題 11-1） | `patch11.js` 插在 b07 模組 `@@NEXT@@` 前；逃生閥 `__noBigBen190`／`__noBigBenNight190` |
| `batt2.js` | k192 巴特西 2×2（題 11-2） | `patch11c.js` ①；逃生閥 `__noBattersea192`／`__noBatterseaNight192` |
| `patch11c.js` ② | 白塔 v0 打磨（題 11-3） | 開機旗標 `window.__x11Keep=true`（harness `preScript`） |
| `patch11c.js` ③＋`mewsB.js` | 街角店屋加高（題 11-4，`__x11Shop`＝1 或 2）、馬廄兩層開間（題 11-5，`__x11Mews`） | 執行期旗標；切換後 `GV.block559.cache().clear()` 再重烘 |

用法（雲端路徑寫死 `/home/user/GlimmerTown-lab/index.html`）：`node docs/proto-b11/patch11.js`、`node docs/proto-b11/patch11c.js`，拍完 `git checkout -- index.html`。兩支互不依賴，可以只跑一支。

拍法：種子城 5162026；地標種在 (48,24)（`GV.art574.plant574`，2×2 帶 `sz:2`）鏡頭 `lookAt(48,22)`；店屋種在 (13,2)（`{k:2,lv:1,v:4,grid:[2,1]}`）鏡頭 (12,5)；馬廄鏡頭 (4,9)；縮放 2（近）、1.2（中），正午 `cycle574()*.5`、午夜 `*.02`，`__noSignal=true`。
