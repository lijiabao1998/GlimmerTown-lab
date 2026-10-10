# T734 — 紅燈 CI 收拾①：waterfront-quarter019 不再在 main 觸發；風格基線重寫

**輪次**：接入時按實際順序編
**基線**：`1a7008d`（v14.37／T733 之後只多 DECISIONS 一筆）
**狀態**：卡面先推，施工中
**業主決定**：2026-10-10 業主看過唯讀稽核後說「還是美術第一，你把你列出來的這些做完，我們再說」。清單第 1、2 項就是本卡；第 2 項要改基線檔 `style.json`，業主同句一併同意（記進 `docs/DECISIONS.md`）。

---

## 1. 這一輪要解決什麼

1. **`waterfront-quarter019` 會讓下一次 main 推送變紅。** 它在 push main 時觸發；它的合約（`waterfront-quarter-contract019.js` 第 11–16 行）只接受 `GAME_VER='14.37'` 的發版內容，或保留 T731 標籤的候選版。下一張改版本號的卡推上 main，156 個 job 會在 preflight 就紅。Codex 在 PR #24 提過這點（P1），沒處理。
2. **原樣的 `node fp.js --check` 在 main 上從 T725 起一直紅**：bld 家族風格分 96.5% → 96.3%，棘輪破裂。原因是 `style.json` 停在 T715（3341f16，bld 836 葉），之後新增的建築精靈（現在 959 葉）把家族平均拉低；既有葉子零變動。T731、T732 的 CI 用 `--expect=bld` 繞過，T733 的 `touch-pixels020` 因此兩次都紅。
   - `fp.js` 目前沒有正當路徑重寫風格基線：寫入模式遇到棘輪下降會在寫 `style.json` 前退出；加 `--expect=bld` 又會因為 bld 葉子相對 `fp.json` 沒變而判「宣告了但沒動」。

## 2. 改什麼／不改什麼

- `.github/workflows/waterfront-quarter019.yml`：push 觸發分支拿掉 `main`，保留 GPT 自己的兩條分支與手動觸發。
- `fp.js`：新增 `--accept-style=<家族,…>`，只在寫入模式有效。它允許列出的家族分數下降、照常寫 `style.json`，並把每個被接受的下降（前後總分與七軸）印出來留紀錄。
  - 列了但其實沒下降就紅。
  - 跟 `--check` 一起用就紅。
  - 不影響葉子差與超街區的判定。
- 用 `node fp.js --accept-style=bld` 重寫 `style.json` 基線。

**不改**：`index.html`（產品位元組不變、版本號不動）、`fp.json` 的葉子內容、任何美術與玩法、其他 workflow。

## 3. 怎麼算做完（動手前寫下）

1. `waterfront-quarter019.yml` 的 push 分支不含 `main`；推 main 時觸發的 workflow 只剩 `smoke`（另有 `pages`）。
2. 重寫前，原樣 `node fp.js --check` 紅（bld 96.5%→96.3%）；重寫後，原樣 `node fp.js --check` **exit 0**：葉子、超街區、棘輪全部零變動。
3. `--accept-style` 的負面測試：
   - 列一個沒下降的家族 → 紅；
   - 跟 `--check` 並用 → 紅；
   - 不加參數的寫入模式 → 仍照舊在棘輪下降時紅。
4. `fp.json` 的葉子與超街區內容不變（只允許時間戳一類的中繼欄位不同）。
5. 煙霧 3 連綠（產品沒改，仍照流程跑）。
6. 卡上寫明 bld 下降來自哪些軸，以及 GPT 舊合約（`*-style0xx.js` 等 7 支）會因 `style.json` 改變而在各自分支重跑時不再相符。這些只在 `gpt/*` 分支觸發，不影響 main。
