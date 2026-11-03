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
| #83 | `dsk/ai-speed-054` | C-054 選址剪枝＋canPlace memo＋守門反向補丁 | ✅ success (`9aa78de`) |
| #84 | `dsk/lab-integration` | **整合候選**（五個釘死區塊）＋閉環＋真城市 probe | ✅ success (`45fda6c`) |

## 2. 已證明的東西

- **性能（誠實拆解，2026-11-03 最終版）**：
  - 總模擬工作量：**−6.02%**（15 輪配對、14/15 輪較快、符號檢定 **p ≈ 0.001**）——這是目前唯一通過統計檢定的效能結論。
  - 幀時間 p95：**量不到效果**（5 輪配對 3 快 2 慢、**p = 1.0**；未配對雜訊 52%）。先前報過的 −33~43% 來自未配對窗口，**已撤回**。
  - **−50% 門檻未達**；等價性 hash 與 main 相同（`282968898`）。
- **整合**：五個釘死區塊一次驗；`fp` 零變動；A–F 六情境＋隔離檢查 PASS。
- **物流（產品層）**：`intermodal057` 到站**自動** HANDOFF；同一批 `batch-A`／`qty 7` 走完 ledger → 公路 → 換裝 → 鐵路 → 結算（`revision 3`、`HELD`、`conserved true`）。
- **閉塞強制（產品層）**：鐵路段讀 055 `snapshot()`；無路權 → `authority:no-authority`、斷軌 → `authority:track-broken`，兩者都實測擋住。
- **真城市客運**：117 列原生 OD、51.7 trips → 模型 51.0 trips、unserved 0、conserved true（容納原生 0.1 捨入與 `bike`）。
- **真步行可達**：道路 BFS 取代曼哈頓；一間座標 9 格的店因不可達被判 0 到訪（isolated 1）。
- **性能回歸**：整合候選固定工作量 300 ticks 中位數 −11%，但範圍重疊 → 只能說「未偵測到回歸」。

## 3. 缺口（還沒做）

> 更新於 2026-11-03（`193f945`）：A–F 真城市、持久化四段閉環都已補上。

1. **p95 未達 −50%，而且目前量不出來**：固定工作量 −6.02%（p≈0.001）是唯一通過檢定的數字；p95 配對檢定 p=1.0。要驗 p95 需要受控環境（CI Linux、固定負載、≥15 輪）。
2. ~~**結算仍在 probe**~~ → **已補**：`intermodal057` 到站自動對 ledger 下 HANDOFF（`revision 3`、`state HELD`、`conserved true`）。
3. ~~**閉塞路權未強制**~~ → **已補**：聯運鐵路段讀 `railBlock055.snapshot()`，`holder` 不是自己就 `authority:no-authority`、斷軌就 `authority:track-broken`（實測都擋住；第二台車是**排隊**不是被拒）。
4. ~~**LAB-08／09／10 仍用合成資料**~~ → **已補**：真城市 118 列 OD、51.4 trips、conserved（逐列判定）、真道路 BFS 到訪（52 次、1 間孤立）。
5. ~~**A–F 只在測試場景**~~ → **已補**：`probeAcceptanceCity036.cjs` 在 pop 327 的真城市上 A–F 六情境全過。
6. ~~**持久化只有提案**~~ → **已補**：`persistence058.js` 信封／校驗／原子還原＋`captureShadow058`（12 項自檢），並在真狀態上完成抓取→封裝→驗證→還原四段閉環。
7. **仍缺**：店家級真實客流（原生只到街區 OD）、正式存檔接線（需業主批准）、真手機／Safari。
6. **整合候選 CI**：`45269c5` 排隊中（前一個 `e233191` 被新 push 取消）。
7. **還缺的**：店家級真實客流（原生只到街區 OD）、站點語意（k166 未進 T462 站別集合）、真手機／Safari。

## 3.1 真城市實測（V67 §5）

| 項目 | 數值 |
|---|---|
| 城市 | pop 327、jobs 61、buildings 226、roads 210、day 68 |
| 原生 OD | 117 列、51.7 trips（walk 36.4／car 15.3／unserved 0） |
| 客運需求模型 | 51.0 trips（36.1 walk + 14.9 car）、unserved 0、conserved true、依目的 work 23.3／education 11.3／leisure 8.9／services 7.5 |
| 通勤場 | 10 叢集、75 格非零、平均 0.757、最大 2.837 |
| 影子到訪（真道路 BFS） | 3 店：31／26／**0（不可達）**，isolated 1 |

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
