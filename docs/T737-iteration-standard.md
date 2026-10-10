# T737 — 迭代不改壞標準（實驗線版）：給 GPT 與所有自主迭代的寫入者

**輪次**：接入時按實際順序編
**基線**：`adbaa8b`（T736 卡面）
**狀態**：完成
**業主決定**：2026-10-10「gpt 是自主迭代，你給 gpt 制定個標準，就是不管是迭代玩法還是美術都不要迭代壞，然後讓 gpt 照著做」；看過草稿後「草稿沒問題，就按照正式的來」「放到綫上吧也，因爲 gpt 主要是在它的 dots 迭代」。主線同一份標準已落地（主線 T631，`lijiabao1998/GlimmerTown` 的 `docs/迭代不改壞標準.md` 與根目錄 `AGENTS.md`）。

---

## 1. 這一輪要解決什麼

GPT 在實驗線走 `gpt/<主題>` 分支自主迭代（GPT-001～020），規則散在 `AGENTS.md`、`AUTORUN.md`、`CLAUDE.md`，沒有一份「怎樣算改壞、怎樣證明沒改壞」的硬標準。業主要一份玩法、美術都適用、GPT 開工就會讀到的標準。

## 2. 改什麼／不改什麼

- 新增 `docs/迭代不改壞標準.md`：主線那份的實驗線版（指令換成實驗線的 `smoke.js`、`fp.js --check`、`probe*.js`、逃生閥、`AUTORUN-LOG.md`；寫入者分工照 `AGENTS.md`）。
- `AGENTS.md`、`CLAUDE.md` 開頭加一段：開工前必讀這份標準。
- `docs/AGENT-PROMPTS.md`：六家開場白（Grok、GLM、Kimi、DeepSeek、GPT、Codex）各加一句「最先讀這份標準、收工前對第 8 節自檢」——業主說「讓 gpt 照著做」，開場白是 GPT 一開工就收到的話。
- **不改**：`index.html`、任何程式、版本號、`fp.json`、`docs/DECISIONS.md`。

## 3. 怎麼算做完（動手前寫下）

1. 三個檔在 GitHub `main` 上看得到；`AGENTS.md`／`CLAUDE.md` 的既有內容逐字保留，只在開頭加段落。
2. 只動文件：`index.html` 與 `fp.json` 與 `adbaa8b` 位元組相同；煙霧測試由 CI 跑（本機這份是只抓文件的輕量複製，不跑遊戲）。

## 4. 施工紀錄

- 2026-10-10（Claude，本機淺複製 `C:/dev/glimmer-lab-737`，只抓文件檔，不跑遊戲）：照第 2 節落地；`AGENTS.md`／`CLAUDE.md` 原內容逐字保留，只在標題下加一段必讀；開場白六家各加一句。
- 標準內容＝業主看過的草稿（主線 T631 同一份），把指令換成實驗線的 `smoke.js`、`fp.js --check`／`--expect`、`probe*.js`、`docs/branch/` 卡、分支只推自己、業主點頭才合；量測與守衛的例子引用主線 T601／T604–T625／T626。
- 同一天實驗線另一位寫入者在做 T735（開機描邊熱點：`getImageData`／`putImageData`）與 T736；本卡只動文件，不碰他們的檔。
- 沒做成的事：沒有在本機跑煙霧（只動文件，CI 會跑）；舊的 GPT 分支卡不回頭改。

**聲明**：Claude 出卡＝施工同一方，業主看過草稿並同意，未經第三方覆核。
