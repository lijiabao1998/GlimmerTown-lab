# DSK-028｜LAB 整合候選（053＋054＋055＋057 一份產品）

- 日期：2026-11-02
- 分支：`dsk/lab-integration`（由最深的 `dsk/lab-11-acceptance` 開出，內容＝LAB-03／05／06／07／11 的聯集）
- 對應：V67 §3.1「建立隔離的整合候選，按真實依賴關係整理，而不是直接把十個 PR 無差別逐一合併」、§3.3「守門檔完整整合」。

## 1. 這份候選是什麼

一份 `index.html`，裡面依序釘死五個區塊：

| 順序 | 區塊 | 來源卡／分支 | 原始 commit |
|---|---|---|---|
| 1 | `GPT-052 SINGLE LEDGER`（既有） | main（T777） | `63c80c6` |
| 2 | `DSK-018 ROAD DELIVERY 053` | LAB-03／`dsk/lab-03-road-delivery` | `55d79a1` |
| 3 | `DSK-019 RAIL FREIGHT 054` | LAB-05／`dsk/lab-05-rail-freight` | `6bf3ad3` |
| 4 | `DSK-020 RAIL BLOCK 055` | LAB-06／`dsk/lab-06-block-recovery` | `b478128` |
| 5 | `DSK-025 INTERMODAL 057` | LAB-07／`dsk/lab-07-intermodal` | `b346f5f` |

- 052 以外四個區塊都是**字面釘死**（各自有自己的 SHA-256），順序固定；投影器 `single-research052-source.cjs` 一次驗五塊。
- 剝掉這五塊之後，整份 `index.html` 必須**逐 byte 等於同一個 T776 baseline**（`6e140781…`）。
- 各卡的核心檔（`road-delivery053.js`、`rail-freight054.js`、`rail-block055.js`、`passenger-demand056.js`、`shadow-visits057.js`）與測試都在同一條分支上，**blob 與原卡一致**（見 §4 核對）。

## 2. 為什麼是這條分支

十個 PR 的依賴關係是：

```
LAB-04（唯讀）        #73
LAB-03（053）          #74 ─┐
LAB-05（054）          #75  ├─ LAB-06（055）#76 ─ LAB-07（057）#81 ─ LAB-11（驗收）#82
LAB-08（唯讀）        #77  │
LAB-09（唯讀）        #78  │
LAB-10（唯讀）        #79  │
LAB-12（提案）        #80  │
```

`dsk/lab-11-acceptance` 已經是最深的聯集（含 053／054／055／057 與兩個唯讀核心），所以整合候選直接由它開出，**不重寫歷史、不動別人的分支**。

## 3. 驗證（本整合候選的 head 為準）

| 項目 | 結果 |
|---|---|
| `node shadow-cargo049.test.js` | 見 §5 |
| `node single-research052.test.js` | 見 §5 |
| `node fp.js --check` | 見 §5 |
| `node smoke.js`（3 連綠以 CI 為準） | 見 §5 |
| `node probeAcceptance11.cjs`（A–F 六情境＋隔離） | 見 §5 |
| 分支 CI | 見 §5 |

## 4. 檔案一致性核對（實跑）

`git hash-object` 與來源分支 `git rev-parse <branch>:<file>` 逐檔比對，全部相同：

| 檔案 | 來源分支 | 一致 |
|---|---|---|
| `road-delivery053.js` | `dsk/lab-03-road-delivery` | ✅ |
| `rail-freight054.js` | `dsk/lab-05-rail-freight` | ✅ |
| `rail-block055.js` | `dsk/lab-06-block-recovery` | ✅ |
| `intermodal057-runtime.js` | `dsk/lab-07-intermodal` | ✅ |
| `passenger-demand056.js` | `dsk/lab-09-passenger-demand` | ✅ |
| `shadow-visits057.js` | `dsk/lab-10-shadow-visits` | ✅ |

## 5. 施工紀錄（本整合候選 head 實測）

| 項目 | 結果 |
|---|---|
| `node shadow-cargo049.test.js` | **exit 0** |
| `node single-research052.test.js` | **exit 0**（五個釘死區塊一次驗） |
| `node fp.js --check` | **exit 0**、66.2 s、165 族零變動 |
| `node smoke.js` | **exit 0**（`INT_SMOKE:0`；3 連綠以分支 CI 為準） |
| `node probeAcceptance11.cjs` | **PASS**（A–F 六情境＋隔離檢查） |
| 分支 CI | 推上去後補 |

## 6. 性能回歸（V67 §7）

### 6.1 固定工作量（同步 `GV.step`，不受 real-time 窗口漂移影響）

同一座成熟城市、同一個起始狀態（`sameStart:true`）、同步推進 **300 ticks**，交錯三輪：

| 輪 | baseline (main) | candidate (整合) |
|---|---|---|
| 0 | 8795.4 ms | 7029.2 ms |
| 1 | 7903.3 ms | 8000.8 ms |
| 2 | 7898.6 ms | 6606.4 ms |
| **中位數** | **7903.3 ms** | **7029.2 ms** |

- 中位數差 **−11.06%**，但兩組範圍**完全重疊**（baseline 7898.6–8795.4、candidate 6606.4–8000.8），n=3。
- 結論：**沒有偵測到回歸**；這個 −11% 不能當成整合候選的功勞（它只是多掛了幾個未使用的函式）。
- 300 ticks 後兩邊都是 `day=61`、`buildings=212`，工作量一致。

### 6.2 Real-time ABBA（30 s × 4 臂，供對照）

| 臂 | 版本 | mean | p95 | frames |
|---|---|---|---|---|
| 0 | baseline | 606.7 ms | 1400.0 | 47 |
| 1 | candidate | 664.3 ms | 1616.6 | 43 |
| 2 | candidate | 474.9 ms | 1050.0 | 63 |
| 3 | baseline | 1443.3 ms | 2250.0 | 20 |
| 平均 | baseline | 1025.0 ms | 1825.0 ms | 67 |
| 平均 | candidate | 569.6 ms | **1333.3 ms** | 106 |

- 表上「mean −44.4%、p95 −26.9%」**不能當成整合候選的功勞**：兩個 baseline 臂差了 2.4 倍，變異完全主導。
- 可以說的只有一句：**沒有偵測到回歸**（p99 2041.5 → 2058.35 ms，−0.8%）。

## 7. 沒做成的事

- 這份候選**只整合到「研究／影子」層**：物流仍是影子任務，不寫正式經濟、不改存檔。
- 尚未把 LAB-08／09／10 的唯讀核心接進同一份 `index.html`（它們目前是獨立檔案＋probe，屬研究層）。
- 性能回歸目前只有 real-time ABBA，變異太大；固定工作量版本還沒做。
- 尚未做「整合後的性能回歸」（V67 §7）；下一步用同一座成熟城市跑 main vs 整合候選。
