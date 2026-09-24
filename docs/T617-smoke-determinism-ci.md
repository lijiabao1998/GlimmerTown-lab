# T617 — 煙霧測試去隨機、跨平台，接上 GitHub Actions

**輪次**：r65（第一輪雲端施工）
**基線**：`cae80f1`（index.html 同 T615 v13.25，7,823,875 bytes／74,092 行）
**狀態**：✅ 綠燈，已 commit（`ed4e6cb`）並推 `main`

---

## 1. 這一輪要解決什麼

業主 2026-09-24 改序「美術第一」。美術每一輪都靠煙霧測試判紅綠，而紅線規則是「紅了就退版」——
一支會**看地圖運氣**亂紅的測試，會把好好的美術冤枉退掉。所以先修它，再開美術。

進場探針（雲端容器，Chromium 1194 無頭，2026-09-24）：

- 3 連跑：**紅 1／綠 2**。紅的那次唯一失敗是 `finish604`：「找不到 4×4 陸地 ✗」。
- 根因：`finishArtSelftest604` 只在 `x,y∈[10,18)` 這個固定小窗找 4×4 陸地（`index.html` 71591 行起）。
  煙霧測試每次開新的隨機地圖，那一帶剛好是水就判紅。本機歷來是綠的只是運氣。
- 第二個隱性條件：`rciBlockOrigin547` 在左鄰或上鄰是同級工業時回 `null`，舊版找地時沒排除。
- 跨平台問題：
  1. `harness.js` 只認 Windows 的 Chrome／Edge 路徑；Linux 以 root 跑時 Chrome 沒有 `--no-sandbox` 起不來（「等不到 Chrome 的 page target」）。
  2. `smoke.js` 72 行把自檢 JSON 寫到 `%LOCALAPPDATA%\Temp\…`；Linux 沒有這個變數，就寫進了倉庫裡的 `Temp/`。

## 2. 改什麼／不改什麼

**改**

1. `finishArtSelftest604`：找地改成**全圖掃描**，條件加上「左鄰、上鄰不是同級工業」；判準（工業 4×4 收到 2×2、關閥門可大於 2）一字不改。
2. `harness.js`：Linux 自動找 Chromium／Chrome（`/opt/pw-browsers/chromium-*`、`google-chrome`、`chromium`），Linux 上加 `--no-sandbox`。Windows 路徑與旗標不變。
3. `smoke.js`：沒有 `LOCALAPPDATA` 時，自檢 JSON 改寫到系統暫存目錄（`os.tmpdir()`）。`GOAL_SCRATCH` 覆寫與 Windows 路徑不變。
4. 新增 `.github/workflows/smoke.yml`：推到 `main`、`claude/**` 或開 PR 時，在 GitHub 的 Ubuntu 機器上跑 `smoke.js`，樣張上傳成該次執行的附件。
5. 版本 v13.26／T617（三處同步：`GAME_VER`、`GAME_ANCHOR`、主選單頁尾）。
6. 守衛（見 §5）：原訂獨立腳本 `probe617.js`，施工時改成遊戲內自檢 `mapScanSelftest617` 掛進煙霧測試（理由見 §6）。

**不改**

- 不動任何繪製、模擬、存檔、亂數流；指紋應零變動（`fp.js --check` 驗）。
- 不改煙霧測試的判準本身，也不把 `finish604` 移出清單或放寬。
- 幀率快採照舊「只記不判」；雲端機器沒有 GPU，數字不跟 `perf.json` 基線比。

## 3. 怎麼算做完（動手前寫下）

1. **守衛**：把地圖 `x,y∈[8,22)` 全部改成水，再呼叫 `finishArtSelftest604`：新版綠；關掉新版（舊的固定小窗）同條件紅。跑完地圖原樣還回去。
2. **容器 5 連跑全綠**，0 筆 console error。
3. **GitHub Actions 在推送的 commit 上跑綠一次**，樣張附件下載得到。
4. `fp.js --check` 零差異（若容器本身重現不了本機基線，如實記錄，不改 `fp.json`）。
5. `git status` 乾淨：跑完測試不留 `Temp/`、`.smoke-profile-*`。

Windows 本機無法在雲端實測：改動只在「Linux」或「沒有 `LOCALAPPDATA`」時生效，靠程式結構保證 Windows 行為不變，下次本機自走時順便看一眼。

## 4. 施工

- `index.html`
  - `finishArtSelftest604`：找地迴圈改成全圖（`0..N-4`），並跳過左鄰或上鄰是工業的位置；逃生閥 `window.__noMapScan617` 退回舊的 `[10,18)` 小窗。判準沒動。
  - 新增 `mapScanSelftest617`，掛上 `window.GV`。
  - 版本 v13.26／T617（`GAME_VER`、`GAME_ANCHOR`、主選單頁尾）。
- `harness.js`：Linux 候選路徑（`/opt/pw-browsers/chromium-*` 執行時列目錄、`google-chrome`、`chromium`）；Linux 加 `--no-sandbox`。
- `smoke.js`：沒有 `LOCALAPPDATA` 時用 `os.tmpdir()`；自檢清單加 `mapScan617`。
- `.github/workflows/smoke.yml`：Ubuntu＋Node 22＋系統 Chrome，裝 `fonts-wqy-zenhei`（與雲端容器同字型）；只改 `*.md`／`docs/` 的推送不觸發；樣張與紀錄上傳成附件，保留 14 天。

## 5. 守衛（可斷言的事實）

| 項目 | 結果 |
|---|---|
| 修前 3 連跑 | 綠 2／紅 1（紅的唯一失敗：`finish604` 找不到 4×4 陸地） |
| `mapScan617`（淹掉 x,y∈[8,22)，14×14） | 4 項全過（煙霧 5 跑每跑都跑）：舊小窗紅 ✓、全圖掃描綠 ✓、地圖還原 ✓ |
| 修後 5 連跑（不設 `CHROME_PATH`，harness 自己找到 Chromium） | **綠 5／紅 0**，33.9–35.1s，0 筆 console error |
| 幀率快採（只記不判，無 GPU） | 29.7–46.2 fps，雜訊大 |
| `fp.js --check` 修前 | 與 `fp.json`（本機 T615）差 4 葉：`bld.175_1_0`～`bld.178_1_0` |
| `fp.js --check` 修後 | **同樣 4 葉**，其餘 150 族零變動 ⇒ 本輪零繪製變動 |
| `git status` | 跑完乾淨（不再產生 `Temp/`） |
| GitHub Actions（`ed4e6cb`，`main`） | **綠**，煙霧 37.1s、全部自檢 OK（含 `mapScan617`）、0 console error、56.1 fps；樣張＋紀錄附件 481 KB（[run 35983892286](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/35983892286)） |

## 6. 施工紀錄（如實，含失敗）

- **r65-a 改道**：原訂獨立腳本 `probe617.js` 直接改 `tiles`，第一跑就紅「tiles is not defined」——主程式包在 IIFE 裡，外面拿不到地圖。改成遊戲內自檢 `mapScanSelftest617`（本線慣例：自檢自帶關閥門對照），順便變成煙霧測試的常駐項。`probe617.js` 已刪。
- **r65-b 自己抓到**：`finish604` 的註解還寫著已刪的 `probe617.js`，改成 `mapScanSelftest617`（純註解；5 連跑的第 1 跑在這之前，第 2～5 跑在這之後）。
- **發現，未解**：雲端容器重現不了本機指紋的 4 葉（`bld.175`～`178` 的 v1：公車車庫、輕軌車庫、鐵路車輛基地、地鐵機廠，皆為 `v574` 批次）。改動前就存在，推測是 Chrome 版本或平台造成的畫邊差異，**沒有查證**。`fp.json` 不改。之後在雲端做美術輪，指紋基線要用「同一容器、改動前」自己跑一份，不直接對本機 `fp.json`。
- **自己踩到的坑**：`node fp.js --inventory` 不只印盤點，也會**寫回 `fp.json`、`style.json`**（跟不帶參數一樣）。美術探針跑它時把容器的 4 葉寫進了基線，發現後立刻 `git checkout -- fp.json style.json` 還原，沒有進 commit。雲端只准用 `--check`；要盤點就跑完立刻還原。
- **小尾巴**：Actions 警告 `checkout／setup-node／upload-artifact@v4` 用的 Node 20 已淘汰（目前被強制跑在 Node 24，不影響結果）。沒有查證 v5 各版號，先不動。
- **沒驗到的**：Windows 本機。改動只在 Linux 或沒有 `LOCALAPPDATA` 時生效，靠程式結構保證；下次本機自走時順便跑一次煙霧。
