# T743 — CI 收斂成兩個 workflow：清掉 29 個失效 workflow，分支與 PR 在 CI 上跑滿煙霧 3 次

**輪次**：r190
**基線**：`023e7f9`（v14.41／T739；T742 之後）
**狀態**：施工中（卡面先推佔號）
**業主決定**：2026-10-14「123 美術和規則全部你決定」（第 2 項：清 workflow），同日更正「gpt 那邊能自動無限推」。GPT 要能自己連續迭代，main 的 CI 必須清楚、紅綠有意義。

---

## 1. 這一輪要解決什麼

- main 上有 31 個 workflow 檔（9,819 行），守著 main 的只有 `smoke.yml`、`pages.yml`。
  - 26 個只綁某一條 `gpt/*` 分支，其中 25 條的 PR 早已合併；
  - 3 個上線觀測（`coldload-public011`、`museum-public010`、`streetlife-public009`）綁死舊版本，每次都略過，從沒跑成功過；
  - `touch-pixels020` 還會在每個改到 `index.html` 的 PR 上觸發，近期 21 次裡 0 次成功。
- 2026-10-05～10-14 的 300 次 CI 裡，分支專屬 workflow 失敗率 53.5%，煙霧 1.5%。雜訊把真正的守衛淹沒了。
- GPT 合併時會把分支專屬 workflow 一起帶進 main，數量只會一直增加。
- `smoke.yml` 裡還有 3 個只給 `gpt/british-use-scales-source-022` 用的步驟（重建核對、第 2、3 次煙霧、附件）。
- 分支寫入者（GPT）不能在本機跑煙霧，「3 連綠」只能靠各自的分支 workflow 湊；應該由通用的 CI 給。

## 2. 改什麼／不改什麼

- **刪掉** `.github/workflows/` 裡除了 `smoke.yml`、`pages.yml` 以外的 29 個檔。
  - 歷史都在 git 裡，要重跑就從歷史拿回來；
  - 各 `gpt/*` 分支上的副本不受影響，推送那條分支時照樣用它自己的副本。
- **`smoke.yml`**：
  - 拿掉 3 個綁 GPT-022 的步驟；
  - 新增「煙霧第 2、3 次」：PR、分支寫入者的推送、非 main 的手動觸發都跑。main 與 `claude/**` 不跑：main 寫入者本機已跑 3 次，CI 在 main 上跑 1 次加 `fp`。
  - 第 2、3 次的紀錄一併上傳到附件。
- **不改**：`pages.yml`、`fp` 工作、任何遊戲檔與基線、GPT 歷次的驗收腳本（`*-workflow0xx.test.py`、`*-contract0xx.js` 等會讀已刪 workflow 的腳本照留，在第 8 節列清單）。

## 3. 怎麼算做完（動手前寫下，之後不改鬆）

1. `.github/workflows/` 只剩 `smoke.yml`、`pages.yml`；`smoke.yml` 裡不再出現 `022`。
2. 刪掉的 29 個檔，沒有任何 main 上會被 `smoke.js` 或兩個 workflow 用到的程式引用（`touch-cancellation020.test.js` 只讀 `index.html`，已查）。
3. CI 手動觸發 session 分支：煙霧工作跑滿 3 次且全綠、`fp` 綠。
4. 推 main 後：main 的煙霧工作只跑 1 次、`fp` 綠，Pages 部署成功。
5. 煙霧本機 3 連綠（產品沒改，照流程跑）。

## 4. 回滾

revert 本卡。刪掉的 workflow 從 git 歷史回來，`smoke.yml` 回到 T742 的樣子。
