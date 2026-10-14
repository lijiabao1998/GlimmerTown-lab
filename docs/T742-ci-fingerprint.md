# T742 — CI 替所有寫入者跑像素指紋：部署前要 fp 綠，分支拿得到新基線

**輪次**：r189
**基線**：`297ebb3`（v14.41／T739）
**狀態**：施工中（卡面先推佔號）
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
