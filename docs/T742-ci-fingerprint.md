# T742 — CI 替所有寫入者跑像素指紋：部署前要 fp 綠，分支拿得到新基線

**輪次**：r189
**基線**：`297ebb3`（v14.41／T739）
**狀態**：完成（產品版本不變，仍是 v14.41／T739；只改 `fp.js` 與 `smoke.yml`）
**業主決定**：2026-10-14「123 美術和規則全部你決定 Claude 開始吧」，同日更正「我說的意思是 gpt 那邊能自動無限推，不是你」。這張卡是讓 GPT 能自己連續迭代的第一塊：GPT 不能在本機跑 `fp.js`，CI 要替它跑。

---

## 1. 這一輪要解決什麼

- main 的 CI 從來不跑 `fp.js`：31 個 workflow 裡會跑它的 11 個，全都只綁某一條 `gpt/*` 分支。Pages 在煙霧綠之後就部署。
- GPT 2026-10-14 起可以自己合自己的 PR，合併後的 `fp` 檢查要等 Claude／Codex「下次開工」補跑；合併到部署之間沒有像素檢查。T739 的 36 款新美術就這樣沒有守衛地上線了 19.3 小時。
- GPT 改了美術就該更新 `fp.json`，但它不能跑 `fp.js`，產不出新基線。19 個已合併的 GPT PR 裡有 15 個在分支上改了 `fp.json`，是用它自己的 CI 腳本產的，各張卡做法不同。
- 只在 PR 頭跑 `--check` 會變成拿 PR 自己的 `fp.json` 檢查自己（《迭代不改壞標準》5.2 的循環判斷）；必須同時對 base 的基線報出「這次動了哪些家族」。

## 2. 改什麼／不改什麼

- **`fp.js`** 新增兩個只讀選項，不影響紅綠判定：
  - `--report-base=<檔>`：另拿一份基線（CI 用 base 那一版的 `fp.json`）比對，印出「相對 base 新增／變更／移除幾葉、觸及哪些家族」。在 GitHub Actions 裡也寫進工作摘要。
  - `--dump=<資料夾>`：把這次烘出的 `fp.json`、`style.json` 寫到該資料夾（格式同寫入模式），不碰倉庫裡的基線。`--check` 也能用。
- **`.github/workflows/smoke.yml`** 新增 `fp` 工作，和煙霧並行：
  - 觸發同煙霧（main、各寫入者分支、PR、手動）；`claude/**` 的推送是 main 的鏡像，略過。
  - 跑 `node fp.js --check --report-base=<base 的 fp.json> --dump=fp-rebake`。base：PR 用 PR 的 base；推 main 用推送前的 main；分支用與 main 的分岔點。
  - 上傳 `fp-<sha>` 附件：`fp-run.txt` 與 `fp-rebake/`（本次烘出的新基線）。
- **部署前測試**：`fp` 是煙霧工作流的一部分，它紅了整個工作流就紅，`pages.yml`（只在煙霧工作流成功時部署）就不部署，官方站停在上一個綠的版本。`pages.yml` 不改。
- **不改**：`index.html`（產品位元組不變）、`fp.json`、`style.json`、任何判準、`pages.yml`。

## 3. 怎麼算做完（動手前寫下，之後不改鬆）

1. 本機：原樣 `node fp.js --check` 綠（166 族、3323 葉），新選項不加時行為不變。
2. 本機：`--check --report-base=<T739 的 fp.json（e91c9fe，沒有 use021）> --dump=<資料夾>` 綠；報告寫「相對 base 新增 144、觸及 use021」；dump 出的 `fp.json` 的葉子、家族、超街區與倉庫的 `fp.json` 逐項相同；dump 出的 `style.json` 165 族與倉庫的逐項相同。
3. 本機故意改壞（倉庫複本，嵌入美術改一個材質色）：`--check --dump` 紅，紅項只有 `use021`；dump 的 `fp.json` 與倉庫的差異恰好是那 4 葉。
4. CI（GitHub 跑機第一次驗 3323 葉的基線）：手動觸發 session 分支的 smoke 工作流，`fp` 工作綠，附件裡有 `fp-run.txt` 與 `fp-rebake/`。
5. CI 故意改壞：臨時分支放同一個改壞並手動觸發，`fp` 工作紅、煙霧工作綠、整個工作流紅（等於 Pages 不會部署）。驗完刪掉臨時分支。
6. 推 main 後：main 的煙霧工作流兩個工作都綠，Pages 部署成功。
7. 煙霧 3 連綠（本機；產品沒改，照流程跑）。

## 4. 回滾

revert 本卡（`fp.js` 兩個選項、`smoke.yml` 的 `fp` 工作）。CI 回到不跑 fp，部署條件回到只看煙霧。

## 5. 施工

- `fp.js`（`c1e9611`、`d42e4b0`）：
  - `--report-base=<檔>`、`--dump=<資料夾>`，見第 2 節；
  - **施工中加的一項**：`--report-base-style=<檔>`，對 base 的 `style.json` 報「哪些家族風格分下降、掉在哪幾軸」。原因：GPT 提交 CI 給的新基線時，`style.json` 會一起換，宣告家族的風格下降不會再被棘輪擋；美術第一的線上，這個下降要攤在摘要裡。只報告，不影響紅綠。
  - 有 `GITHUB_STEP_SUMMARY` 時，結果寫進 GitHub Actions 工作摘要（所有出口都補紅綠）。
  - 寫入模式改用同一份 `styleOut` 物件寫 `style.json`，格式不變。
- `smoke.yml`：新增 `fp` 工作（與煙霧並行）：取 base 的 `fp.json`、`style.json` → `node fp.js --check --report-base=… --report-base-style=… --dump=fp-rebake` → 上傳 `fp-<sha>` 附件。`claude/**` 的推送略過（main 的鏡像）；手動觸發照跑。
- `pages.yml` 沒改：它本來就只在煙霧工作流成功時部署，`fp` 進了同一個工作流，就變成部署前一定要 fp 綠。

## 6. 守衛（可斷言的事實）

| 項目 | 結果 |
|---|---|
| 驗收 1：原樣 `node fp.js --check`（本機） | 綠：166 族、3323 葉、1728 超街區零變動 |
| 驗收 2：`--check --report-base=<e91c9fe 的 fp.json> --dump=…`（本機） | 綠；「相對 base（T738 14.40）：新增 144 / 變更 0 / 移除 0 葉，觸及 use021」。dump 的 `fp.json` 葉子、家族、超街區、統計與倉庫逐項相同；dump 的 `style.json` 165 族、平均、總分與倉庫逐項相同 |
| 驗收 3：故意改壞（倉庫複本，嵌入美術 `UKD021-S` 一處 `P.woodHi`→`P.stoneD`） | 紅，只觸及 `use021`；dump 的 `fp.json` 與倉庫恰好差 `use021.UKD021-S.r0`–`r3` 4 葉的日圖 CRC；工作摘要寫「✗ 紅」與觸及家族 |
| 加測：`--report-base-style=<T734 之前的 style.json>`（本機） | 綠；報「bld 96.53% → 96.31%（葉子 836→959；hardEdge 92.62→93.79，lightDir 84.93→81.96，nightRule 98.17→98.40）」，和 T734 卡上記錄的數字逐項一致 |
| 驗收 4：CI 手動觸發 session 分支（`c1e9611`） | [run 38570335935](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38570335935)：煙霧綠、`fp` 綠（GitHub 跑機第一次驗 3323 葉的基線，烘焙 30.7 s，全程 44.7 s）；base 正確取到分岔點 `d7d58e5`；附件 `fp-<sha>` 3 個檔（`fp-run.txt`、`fp-rebake/fp.json`、`fp-rebake/style.json`） |
| 驗收 4（再一次，`d42e4b0`，含 style 報告） | [run 38571185164](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38571185164)：煙霧綠、`fp` 綠 |
| 驗收 5：CI 故意改壞（臨時分支 `claude/t742-break-test`，同一份改壞） | [run 38570340078](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38570340078)：**`fp` 紅**（「X --check：指紋有變動（未宣告）：use021」），**煙霧綠**，整個工作流紅 ⇒ Pages 不會部署。煙霧單獨擋不住這種改壞 |
| 驗收 7：煙霧（本機，`c1e9611` 的工作樹；`d42e4b0` 只動 `fp.js` 與 workflow，煙霧不讀它們） | **綠 3／紅 0**（54.8／54.5／53.8 s） |
| 驗收 6：推 main 後 | 見日誌 r189 與下方補記 |

## 7. 施工紀錄（如實，含失敗）

- 除了驗收預期的紅燈，沒有紅燈。
- 施工中加了 `--report-base-style`（第 5 節寫了原因），加完重跑本機驗證與一次 CI。
- **臨時分支刪不掉**：`git push origin --delete claude/t742-break-test` 被 GitHub 代理擋下（HTTP 403，這個 session 沒有刪分支的權限）。它只有一個故意改壞的 commit（`cd2e6da`），不在 main、`claude/**` 推送不會部署，不影響官方站；請業主方便時在 GitHub 上刪。本地分支與工作樹已清掉。（2026-10-14 補記：業主請另一個 Claude 對話代刪，已用本機 gh 以 `DELETE refs/heads/claude/t742-break-test` 刪除；刪前核對只有 `cd2e6da` 一個故意改壞的提交、落後 main 17 個、沒有任何 PR 用到。）
- 用內建 `gh` 抓工作日誌會被轉址擋下，改用 GitHub MCP 的 `get_job_logs` 讀到。

## 8. 沒做的／已知限制

- **GitHub 跑機的 Chrome 會跟著映像更新。** 哪天光柵化變了，main 的 `fp` 會紅、Pages 停在上一個綠的版本，要有人處理（重烘基線或登記環境差）。`envLeaves` 只按 `process.platform` 分，雲端容器和跑機都是 `linux`，兩邊若分歧目前沒法同時登記。今天兩邊結果一致。
- `claude/**` 推送不跑 `fp`：Claude 推 main 時同一個 commit 會在 main 上跑；要在 Claude 分支上單獨驗，就手動觸發。
- `fp.json` 的版本標記可能落後 `GAME_VER`（只是中繼欄位，不影響判定）。
- 「相對 base 觸及哪些家族」只報告，不自動比對卡上宣告的家族；比對規則寫在 T744（給 GPT 的迴圈協議）。
- 煙霧只在 CI 跑 1 次；分支寫入者要的「3 連綠」留給 T743 一起處理。

## 9. 收工自檢（《迭代不改壞標準》第 8 節）

- [x] 卡面在動手前推上去（`d7d58e5`），驗收條件沒有事後改鬆（施工中多加的 style 報告另外驗過）
- [—] 同種子前後對比、舊存檔來回、逃生閥、美術樣張：不適用（沒改遊戲、存檔與像素）
- [x] `node fp.js --check` 零變動（`fp.json`、`style.json` 沒動）
- [x] 新守衛故意改壞過，首紅落在目標（本機與 CI 各一次，紅項都是 `use021`；同一份改壞煙霧是綠的）
- [x] `node smoke.js` 連跑 3 次全綠，沒有靠重跑
- [x] 卡上沒有任何「通過」是沒跑過的
