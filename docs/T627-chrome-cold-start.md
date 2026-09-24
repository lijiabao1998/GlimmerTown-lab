# T627 — Pages 樣張等不到 Chrome：測試骨架只給 Chrome 10 秒冷啟動

**輪次**：r74
**基線**：`bafe986`（v13.33／T626）
**狀態**：✅ 綠燈（卡面先單獨提交 `a0452bd`，驗收條件寫在動手之前；施工中追加的 T626 自檢修正見 §6）

---

## 1. 這一輪要解決什麼

業主用手機看的 Pages 樣張，是 `main` 煙霧綠之後由 `pages` 工作流程自動重拍、部署的。T625（`dfec779`）那次部署失敗了：

- [pages run 36015471326](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36015471326) 在「組網站」這一步紅：`X 樣張失敗： 執行期錯誤: 等不到 Chrome 的 page target`。
- 從 `node gallery.js` 開跑（14:48:49.13）到報錯（14:48:59.29）是 **10.16 秒**，正好是 `harness.js` 的 `pageWsUrl` 上限：每 250ms 問一次 `/json/list`，最多 40 次＝10 秒。
- 結果：T625 沒有上線，業主手機上的 Pages 還停在 T624。
- 自動部署接通以後（run 5–8）4 次裡失敗 1 次；run 4 是另一個原因（當時 Pages 還沒開）。`smoke` 工作流程用同一個骨架，前 18 次沒出過這個錯，所以是偶發的冷啟動慢，不是每次都慢。
- **卡面提交之後又查到兩次（施工中補記）**：T626（`bafe986`）的分支煙霧 [run 36018525774](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36018525774) 紅在同一句（10.1s），Pages [run 36018671305](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36018671305) 也是（10.17s；runner 收尾時 Chrome 行程還活著，是慢、不是當掉）。同一個 commit 的 `main` 煙霧 run 20 是綠的。半小時內 runner 上 4 次新開 Chrome 有 3 次超過 10 秒，Pages 已連兩次沒上線（停在 T624）。
- 現在的骨架把 Chrome 的 stderr 丟掉（`stdio: 'ignore'`），失敗時看不出是啟動慢、當掉，還是除錯埠被占。

`smoke.js`、`fp.js`、`gallery.js` 和所有探針都走這個骨架，業主本機（Windows）也是。

## 2. 改什麼／不改什麼

**改**（只動 `harness.js`）

1. `pageWsUrl` 等 page target 的上限從 10 秒拉到 45 秒；Chrome 行程已經結束就**立刻**報錯，不再空等。
2. `launchChrome` 保留 Chrome stderr 的最後 2KB（持續讀掉，不會塞住管線）；啟動失敗的訊息附上結束碼與這段尾巴。
3. `withGame`：第一次開不起來（逾時或 Chrome 結束），關掉它、換新的 profile 目錄與下一個除錯埠，**重開一次**；第二次也失敗才報錯，訊息寫明兩次各自的原因。
4. `withGame` 回傳多一個欄位 `chromeMs`（Chrome 可連線花了多少毫秒、第幾次成功）；`gallery.js` 的成功訊息印出來，之後在 Actions 紀錄裡就看得到 runner 上的冷啟動時間。（施工中補：`smoke.js` 第一步也印，因為煙霧也踩到了。）

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

## 4. 施工

- `harness.js`
  - `pageWsUrl(devPort, proc, limitMs)`：上限 45 秒；每一輪先看 Chrome 行程還在不在，已結束就立刻報「Chrome 已結束（結束碼 …，啟動後 …ms）」；逾時訊息附實際秒數。兩種訊息都附 stderr 尾巴。
  - `launchChrome`：`stdio` 改成只接 stderr，持續讀掉、保留最後 2KB（`proc.__tail`），管線 `unref()` 不拖住工具結束；`spawn` 本身失敗（找不到執行檔等）不會有結束碼，另記 `__spawnErr`，`pageWsUrl` 一樣立刻報錯。
  - `withGame`：第一次開不起來就關掉、換新 profile（`.smoke-profile-b-<pid>`，結尾保持 `-<pid>`，`cleanProfiles` 才認得出擁有者）與下一個除錯埠重開一次；第二次也失敗才報「Chrome 兩次都開不起來｜第 1 次：…｜第 2 次：…」。回傳多 `chromeMs`（毫秒、第幾次成功、第一次的原因）。
- `gallery.js`：成功訊息多印「Chrome 冷啟動 x.xs」（第二次才成功時註明）。
- `smoke.js`：第一步那行多印「（Chrome 冷啟動 x.xs）」。
- **施工中追加**：`index.html` 的 T626 自檢 `smokeViewSelftest626` 暫種街區時比照遊戲蓋建築，先存下並清掉四格的樹、裝飾、廢墟，驗完還原（見 §6）。只動自檢，遊戲行為不變，版本號維持 v13.33／T626。

## 5. 守衛（可斷言的事實）

| 項目 | 修正前 | 修正後 |
|---|---|---|
| 慢啟動（包裝腳本睡 15 秒再開 Chromium） | **紅**，10.1s：「等不到 Chrome 的 page target」（與 pages run 8／9、smoke run 19 逐字相同） | **綠**，44.1s；紀錄印「Chrome 冷啟動 15.3s」 |
| 一開就結束（`exit 3`） | 紅，**空等 10.1s**，訊息同上，看不出是當掉 | 紅，**0.6s**：「Chrome 兩次都開不起來｜第 1 次：Chrome 已結束（結束碼 3，啟動後 306ms）；stderr：fake chrome: cannot start …｜第 2 次：…（251ms）」 |
| 找不到執行檔（`CHROME_PATH=/nonexistent/chrome`） | 紅，空等 10 秒 | 紅，**0.6s**：「…stderr：啟動失敗：spawn /nonexistent/chrome ENOENT」 |
| 第一次壞、第二次好 | （未測；舊骨架不重開） | **綠**，28.9s；紀錄：「Chrome 第 1 次開不起來，第 2 次成功：Chrome 已結束（結束碼 3 …）」、「Chrome 冷啟動 0.3s，第 2 次才成功」 |
| 正常路徑煙霧（雲端容器，最終版） | — | **綠 3／紅 0**，28.4–29.3s，0 console error；冷啟動 0.3s |
| `gallery.js` 本機實跑 | — | 8 張，30.5s，「Chrome 冷啟動 0.3s」；印完 1.6 秒行程結束（原本就有的 1.5 秒清 profile 計時器），stderr 管線沒有拖住 |
| `fp.js --check` | — | 與 T626 相同：只有環境差 4 葉 |
| **線上（`678ae82`）** | Pages run 8、9 與煙霧 run 19 紅在 10.1s | 煙霧 `main` [run 36021059865](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36021059865) 綠（**Chrome 冷啟動 0.9s**）、分支 run 36021080672 綠；**Pages [run 36021169513](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/36021169513) 部署成功**，`gallery.js` 印「**Chrome 冷啟動 9.5s**」——Pages runner 的冷啟動一直貼著舊上限 10 秒，這就是它幾乎每次都失敗、煙霧卻很少失敗的原因。T625、T626 隨這次部署上線 |
| T626 自檢在起點格有樹時 | 同一座城、同一個起點格 (4,4) 種一棵樹：「四個旋轉都攔到廠房精靈的繪製 ✗」（與煙霧紅燈逐字相同） | 起點格有樹（tree=10）照樣 7 項全過，驗完樹原樣還原 |

## 6. 施工紀錄（如實，含失敗）

- **施工中煙霧紅了一次，追出 T626 自檢的偶發紅。** 正常路徑 3 連跑第 1 次紅：`smokeView626`「四個旋轉都攔到廠房精靈的繪製 ✗」，第 2、3 次綠。沒有當偶發放過：
  - 物件繪製迴圈裡 `if(t.tree){ 畫樹; continue; }` 排在建築分支之前；遊戲蓋建築會先清樹（`t.tree=0`），所以正常遊戲不會同時有樹和建築。
  - T626 自檢暫種 2×2 工業時只設 `t.bld`，沒清樹。煙霧每次用新的 profile、沒有存檔，每跑一次就開一座新的隨機城市；自檢找到的空地起點格有樹時，整塊不畫、攔不到繪製。
  - 在同一座城的起點格種一棵樹，自檢穩定重現同一個 ✗；修正後同樣狀況 7 項全過、樹原樣還原。
  - T626 在雲端 3 連跑、GitHub Actions 的 `main` 煙霧 run 20 都綠，是因為那幾座隨機城的起點格剛好沒樹（同一個 commit 的分支 run 19 紅在 Chrome 冷啟動，沒跑到自檢）。這個錯讓煙霧（也就是 Pages 部署的閘門）有機率紅，所以跟本卡一起修。這一項的驗收是發現之後補寫的，不算「動手前寫下」；§2「不改 index.html」也因此破例（只動自檢）。
- 包裝腳本放在暫存目錄（`CHROME_PATH` 指過去），不進版本庫。
- **第一版漏了兩個邊角，提交前自己逆讀 diff 補上**：① 找不到執行檔時 `spawn` 只發 `error` 事件、`exitCode` 一直是 null，第一版會白等 45 秒×2；② stderr 改成管線後，Chrome 子行程晚退可能拖住沒有 `process.exit` 的工具（`gallery.js` 成功路徑就沒有）。補上 `__spawnErr` 與 `unref()` 後，三種重現狀況與正常 3 連跑全部用最終版重跑。
- **沒做成的：**
  1. 線上冷啟動慢的根因沒查到：同一個 commit，煙霧 runner 0.9s、Pages runner 9.5s，差在哪裡不知道。本卡只讓骨架等得夠久、失敗時留下證據（`gallery.js`、`smoke.js` 會印冷啟動時間，Chrome 的 stderr 會進錯誤訊息）。
  2. `fp.js` 與各探針沒有印冷啟動時間（`gallery.js`、`smoke.js` 有）。
  3. 其他自檢有沒有類似「暫種不清樹」的寫法，只查了 `planted.push`／`t.bld={k:` 兩種寫法（遊戲本體的放置都有清樹，自檢只有 T626 這一處），沒逐支讀。

