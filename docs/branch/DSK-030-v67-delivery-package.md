# DSK-030｜V67 交付包（草稿，2026-11-02）

> 這份是給業主的一次性審閱入口：每個 PR 的精確 SHA、證據、缺口與需要批准的事項。
> 內容全部來自本 session 的實際執行；沒跑過的不寫「通過」。

## 1. PR 清單與狀態

| PR | 分支 | 內容 | 分支 CI |
|---|---|---|---|
| #71 | `gpt/lab-ai-speed-20261030` | GPT-053 AI 市長性能（別人的分支，我沒動） | 前次 success |
| #73 | `dsk/lab-04-rail-topology` | LAB-04 鐵路拓撲唯讀診斷 | ✅ |
| #74 | `dsk/lab-03-road-delivery` | LAB-03 道路配送 | ✅ |
| #75 | `dsk/lab-05-rail-freight` | LAB-05 貨運鐵路 | ✅ |
| #76 | `dsk/lab-06-block-recovery` | LAB-06 閉塞／等待／斷軌 | ✅ |
| #77 | `dsk/lab-08-commute-od` | LAB-08 通勤 OD 唯讀 | ✅ |
| #78 | `dsk/lab-09-passenger-demand` | LAB-09 客運需求 | ✅ |
| #79 | `dsk/lab-10-shadow-visits` | LAB-10 影子到訪 | ✅ |
| #80 | `dsk/lab-12-persistence-proposal` | LAB-12 持久化提案（純文件） | 無 CI |
| #81 | `dsk/lab-07-intermodal` | LAB-07 公鐵聯運 | ✅ |
| #82 | `dsk/lab-11-acceptance` | LAB-11 同城 A–F 驗收 | ✅ |
| #83 | `dsk/ai-speed-054` | C-054 選址剪枝＋ABBA＋守門反向補丁 | ✅ success (`771bd2e`) |
| #84 | `dsk/lab-integration` | **整合候選**（五個釘死區塊）＋閉環 probe | 🔄 進行中 (`4d39fbc`) |

## 2. 已證明的東西

- **性能**：成熟城市（pop 327）5× AI 開 baseline p95 9283 ms → C-054 5324.7 ms（**−42.6%**）；等價性 hash 三版相同（`282968898`）。
- **整合**：五個釘死區塊一次驗；`fp` 零變動；A–F 六情境＋隔離檢查 PASS。
- **物流**：同一批 `batch-A`／`qty 7` 由 ledger → 公路 → 換裝 → 鐵路 → HANDOFF 結算（`revision 3`、`state HELD`、`conserved true`）。
- **性能回歸**：整合候選固定工作量 300 ticks 中位數 −11%，但範圍重疊 → 只能說「未偵測到回歸」。

## 3. 缺口（還沒做）

1. **p95 未達 −50%**：目前 −42.6%，剩餘瓶頸在 `canPlace` 本體與每 tick 重算。
2. **結算仍在 probe**：三條運送腿不會自己呼叫 `command()`；產品層 orchestrator（`logistics058`）未實作。
3. **閉塞路權未強制**：057 的鐵路段不受 055 約束。
4. **LAB-08／09／10 仍用合成資料**：沒有接真居民城市的 OD／站點／商業街。
5. **整合候選的 CI 未回**（推上去待跑）。

## 4. 需要業主批准（我不能自己合）

- **守門檔變更**：#74／#75／#76／#81／#84 的 `single-research052-source.cjs` 投影器擴充（052＋053＋054＋055＋057）；#83 的反向補丁 `perf-patch054.json`（P01）。全部是「字面釘死、baseline 不變」，但依規矩要你點頭。
- **合併順序**：#73／#77／#78／#79／#80 可獨立先合；#74→#75→#76→#81→#82 依序；**#84 已包含那五張，不要重複合**。
- **#71 是 gpt 分支**：我沒有權限也沒有動它。

## 5. 如何自己重跑（在對應分支上）

```bash
# 守衛（整合候選，五個釘死區塊）
node shadow-cargo049.test.js
node single-research052.test.js
node fp.js --check

# A–F 六情境＋隔離
node probeAcceptance11.cjs

# 物流閉環（ledger → 公路 → 換裝 → 鐵路 → HANDOFF）
node probeLogisticsLoop.cjs

# 性能：等價性（固定 ticks）與 ABBA（成熟城市）
node dsk054-equiv.cjs prune 200 5      # 在 dsk/ai-speed-054
node dsk054-abba.cjs 60 C:/RUST/abba.json
```

成熟城市 fixture 由 `populated-fixture053.cjs` 建立（pop 327、seed 87），全程在獨立 profile／slot 3，不碰業主存檔。

## 6. 下一步

1. `logistics058`：把結算與閉塞約束搬進產品層，probe 驗「無路權／斷軌必須失敗」。
2. 真居民城市接 LAB-08／09／10（pop 327 fixture 已有）。
3. 重跑 C-054 的 ABBA 與整合回歸，補上 CI 收據。
