# T627 — Pages 樣張等不到 Chrome：測試骨架只給 Chrome 10 秒冷啟動

**輪次**：r74
**基線**：`bafe986`（v13.33／T626）
**狀態**：🚧 施工中（卡面先單獨提交，驗收條件寫在動手之前）

---

## 1. 這一輪要解決什麼

業主用手機看的 Pages 樣張，是 `main` 煙霧綠之後由 `pages` 工作流程自動重拍、部署的。T625（`dfec779`）那次部署失敗了：

- [pages run 36015471326](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36015471326) 在「組網站」這一步紅：`X 樣張失敗： 執行期錯誤: 等不到 Chrome 的 page target`。
- 從 `node gallery.js` 開跑（14:48:49.13）到報錯（14:48:59.29）是 **10.16 秒**，正好是 `harness.js` 的 `pageWsUrl` 上限：每 250ms 問一次 `/json/list`，最多 40 次＝10 秒。
- 結果：T625 沒有上線，業主手機上的 Pages 還停在 T624。
- 自動部署接通以後（run 5–8）4 次裡失敗 1 次；run 4 是另一個原因（當時 Pages 還沒開）。`smoke` 工作流程用同一個骨架，18 次沒出過這個錯，所以是偶發的冷啟動慢，不是每次都慢。
- 現在的骨架把 Chrome 的 stderr 丟掉（`stdio: 'ignore'`），失敗時看不出是啟動慢、當掉，還是除錯埠被占。

`smoke.js`、`fp.js`、`gallery.js` 和所有探針都走這個骨架，業主本機（Windows）也是。

## 2. 改什麼／不改什麼

**改**（只動 `harness.js`）

1. `pageWsUrl` 等 page target 的上限從 10 秒拉到 45 秒；Chrome 行程已經結束就**立刻**報錯，不再空等。
2. `launchChrome` 保留 Chrome stderr 的最後 2KB（持續讀掉，不會塞住管線）；啟動失敗的訊息附上結束碼與這段尾巴。
3. `withGame`：第一次開不起來（逾時或 Chrome 結束），關掉它、換新的 profile 目錄與下一個除錯埠，**重開一次**；第二次也失敗才報錯，訊息寫明兩次各自的原因。
4. `withGame` 回傳多一個欄位 `chromeMs`（Chrome 可連線花了多少毫秒、第幾次成功）；`gallery.js` 的成功訊息印出來，之後在 Actions 紀錄裡就看得到 runner 上的冷啟動時間。

**不改**

- 工作流程檔（`.github/workflows/*.yml`）、倉庫設定、Pages 設定。
- 遊戲本體 `index.html`（版本號不動）、煙霧的判準與時限、`fp.js` 指紋。
- 自用埠 8199 與 slot 3 的邊界。

## 3. 怎麼算做完（動手前寫下）

用 `CHROME_PATH` 指向暫存包裝腳本，在雲端容器重現三種啟動狀況（包裝腳本放暫存目錄，不進版本庫）：

1. **慢啟動**：包裝腳本先睡 15 秒再執行真的 Chromium。**修正前**的骨架（`git stash` 或舊版 `harness.js`）跑 `smoke.js` 必須重現同一句「等不到 Chrome 的 page target」；**修正後**同一條命令綠燈。
2. **一開就結束**：包裝腳本直接 `exit 3`。修正後在 5 秒內（兩次嘗試合計）報錯，訊息含「結束碼 3」與 stderr 尾巴；修正前要空等 10 秒才報「等不到」。
3. **第一次壞、第二次好**：包裝腳本第一次 `exit 3`（留記號檔）、第二次正常啟動。修正後綠燈，而且 `chromeMs` 記「第 2 次」。
4. **正常路徑不變**：不設 `CHROME_PATH`，煙霧 3 連跑綠；耗時與 T626（29.2–30.7s）同一個量級；`fp.js --check` 與 T626 相同（只有環境差 4 葉）。
5. **線上**：推上 `main` 後 GitHub Actions 煙霧綠，`pages` 自動部署成功；部署紀錄裡 `gallery.js` 印出 Chrome 冷啟動時間。這一次部署會把 T625、T626 一起帶上線。
