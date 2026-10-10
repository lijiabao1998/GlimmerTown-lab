# T734 — 紅燈 CI 收拾①：waterfront-quarter019 不再在 main 觸發；風格基線重寫

**輪次**：r181
**基線**：`1a7008d`（v14.37／T733 之後只多 DECISIONS 一筆）
**狀態**：完成（產品版本不變，仍是 v14.37／T733；本卡只改 CI、工具與基線）
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

## 4. 施工

- `waterfront-quarter019.yml`：push 分支只剩 `gpt/waterfront-cultural-quarter-019`、`gpt/touch-cancellation-020`，留一行註解說明拿掉 main 的原因。現在推 main 會觸發的 workflow 只剩 `smoke`（`pages` 接在 smoke 之後）。
- `fp.js`：新增 `--accept-style=<家族,…>`（檔頭用法說明一併補上）。
  - 開機前就擋掉「跟 `--check` 並用」。
  - 棘輪比對時，列出的家族下降改記為「接受」，其餘家族下降照舊判紅。
  - 列了卻沒下降就在寫 `style.json` 前紅。
  - 被接受的家族印出總分、葉子數、有變動的軸。
- 跑 `node fp.js --accept-style=bld` 重寫基線。

## 5. 守衛（可斷言的事實）

| 項目 | 結果 |
|---|---|
| 修前原樣 `node fp.js --check` | **紅**（exit 1）：葉子零變動、超街區一致，棘輪 `bld 96.5% → 96.3%` |
| 負面測試 1：`--check --accept-style=bld` | 紅，開機前就擋：「只能用在寫入模式」 |
| 負面測試 2：`--accept-style=farmGrow`（沒下降的家族） | 紅：「列了但沒有下降」 |
| 負面測試 3：不加參數的寫入模式 | 紅，照舊報 `bld 96.5% → 96.3%` 棘輪下降 |
| `node fp.js --accept-style=bld` | 綠。bld 總分 96.53% → 96.31%，葉子 836 → 959。變動的軸只有三個：硬邊 92.62% → 93.79%、**受光方向 84.93% → 81.96%**、夜圖規約 98.17% → 98.40% |
| 修後原樣 `node fp.js --check` | **綠**（exit 0）：葉子、超街區指紋、棘輪全部零變動，比對 165 族 |
| `fp.json` | 葉子（subs）與超街區（blocks）逐項相同；只有 `version`／`anchor`（14.36／T732 → 14.37／T733，T733 當時沒更新 fp.json）與 `generatedAt` 不同 |
| `style.json` | 13 族不同：bld，加上 T715 之後才出現、舊基線裡沒有的 12 族（stationDistrict008 … waterfrontQuarter019）；全域總分 65.41% → 66.33% |
| 煙霧（雲端） | **綠 3／紅 0**，59.6／59.2／61.1s（開機烘焙 30.5／28.9／30.7s） |

## 6. 施工紀錄（如實，含失敗）

- 沒有紅燈。負面測試每跑一次都把 `fp.json`、`style.json` 還原成修前版本，再跑下一個。

## 7. 沒做的／已知限制

- **bld 掉分來自「受光方向」**：bld 從 836 張增加到 959 張（多 123 張，大多是 T717 以後的英式建築）。新增後「受光方向」這一軸掉了近 3 個百分點，表示新圖的明暗分布跟「左上受光」的規約比較不吻合；究竟是哪幾張、偏多少，沒有逐張查。本卡只把基線改成現況，沒查是哪幾張、也沒修圖。這是美術訊號，業主要看再開卡。
- **GPT 舊合約在新基線上重跑會不相符**：7 支 `*-style0xx.js`／`*-style-adapter0xx.js`、`probe-touch-pixels020.js` 會比對 `style.json` 是否等於當年基線。它們只在各自的 `gpt/*` 分支觸發，不影響 main；GPT 之後從新 main 分出時要用新基線。
- `waterfront-quarter019` 的手動觸發仍保留；在 main 上手動跑仍會因合約只認 v14.37 而紅。
- `touch-pixels020` 只在 GPT 的分支觸發，本卡沒有在 main 上重跑它；它紅的唯一原因就是原樣 `fp.js --check`，現在已綠。
- 產品沒改，版本號不動；效能沒上實機。
