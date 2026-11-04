# GPT-053 源碼路徑盤點（非性能測量）

盤點時間：2026-10-30。Lab 精確來源 `a20713a509270f8ce6e37859c1fafe330372b952:index.html`；Town 唯讀來源 `ba749a9eb5f6858e8ada03701cac354f0a857c7f:index.html`。以下是程式路徑事實與待證假說，不是已重現瓶頸、CPU 佔比或改善承諾。未啟動本地瀏覽器、未改任何產品源碼。

## 直接可確認的差異

| 路徑 | Lab | Town | 對量測的意義 |
|---|---|---|---|
| AI 日入口 | `tick` L93698 呼叫 `aiExecutiveStep470`，再呼叫既有 `aiStep` | `aiStep` 在 L15126；沒有 T470/T474 executive/fresh/invalidation 函式 | Town 與 Lab 並非同一 AI 工作量，不可只拿 FPS 相除宣稱優化收益 |
| 治理重算 | L91682–91700：正常完整自治路徑至少 pre-governance、after-closure、post-growth、final-audit 四次 fresh，閉環最多另跑 pre 3/post 2 次 | 沒有這套閉環 | CPU profile 應看 fresh 子樹與各 utility rebuild，不應先裁剪決策次數 |
| snapshot | L91518：roots/center/corridor，加 economy/commodity/cycle JSON 複製、housing/enterprise/mobility/civic 快照 | 沒有此函式 | 配置/GC 與 full scan 假說；必須先採樣確認 |
| fresh invalidation | L91619–91627 每次清五組 cache/day，mark+force power、水循環，並設 san/drain/sewer dirty | 沒有此函式 | 可能存在同日無狀態改動的重算，但不能直接假定整個快照純函式 |
| tick | L92458 起有 incident daily、housing、night-input、power dispatch、water-cycle、新英式建物 utility/coverage pass 等 | L15751 起較早的 power/district 路徑 | 先分 AI off 的日模擬成本，再量 AI on 增量 |
| 放置完成 | L89872–89900 每次成功後刷新六組英式 coverage roots，部分工具即時重建 power/water/sewer，最後 dirty ground/resilience | L13622 的 doPlace 不含上述六組新 coverage root 路徑；使用早期 power topology/lot574 邏輯 | 密集新增需計成功數、工具種類；不能以每幀少放置獲得假改善 |
| 畫面迴圈 | L106128：advance、follow588、draw、hudLoopTick598、panelLiveTick599 | L25353：advance、draw、每 .25 秒 updHud | 需保留正常 UI/效果，CPU profile 要能分 simulation/draw/DOM |

### 時間債務是既有行為，不可隱瞞

兩者 `advance` 都有 `while(simAcc>=DAYLEN&&steps<8)`，隨後 `if(steps>=8)simAcc=0`。兩者 rAF 都將 dt 限制至 2 秒，並有 lastDraw 超過 400ms 的 interval 接手。Lab L106105–106155；Town L25329 起。因此基線本來就可能少於理想 `wallSeconds * speed / DAYLEN`；測量必須報 **實際 day delta/秒**、frame/task 原件與落後現象，不只報 FPS。本卡不可新增丟日、減少 AI 決策或降低更新頻率來達標。移除此舊 cap 是獨立語義變更，不可混入無行為差的快取優化。

## 先由 profile 驗證的候選（不是施工批准）

1. **重複 utility truth rebuild**：看 `mayorInvalidateTruth474 → ensurePowerDispatch471/ensureWaterCycle472` 子樹總時長與執行次數。若確有高佔比，僅在證明無相關狀態 mutation 的相鄰讀取間共用同一計算結果；需要明確 epoch/依賴，不准單按 `day` 快取。政策、放置、SOC/水庫、分配準備都可能變動。
2. **snapshot 複製/GC**：看 JSON 序列化與 snapshot getters 的 alloc/GC 佔比。僅可逐欄保留完全相同資料語義、順序與隔離；直接改共享引用可能讓歷史/反事實試驗被回寫，不安全。
3. **重複全圖分類**：`aiCenter` 全圖掃描，`mayorRootStats470` 部分用 tick index，corridors 又掃區域。可考慮同一不可變狀態讀期間的分類/座標重用；tickBld 不保證 AI 放置後即時含新增 root，不能直接全換成舊索引。
4. **放置連鎖重建**：量實際 `doPlace` call counts、success、tools，分 coverage refresh 與 utility rebuild。批次延後重算可能改下一次 `canPlace`/site score/AI選址，因此不能先把多次放置合併後再補算。
5. **renderer/冷建築工作**：若 profile 指向 draw、construction/atlas rebuild 而非 AI，先分暖機與密集新建樣本，保留近景/遠景、日夜與實際新建施工，不能用關效果或降低密度混入本卡。

## 現成 GV 接口與量測污染警告

- `GV.newWorldSeeded(sd)` L109179；`GV.setMapSize(n)` L109521 只改下一次新圖偏好；`GV.setSpeed(s)` L109491 接受 0–5，UI 為 0/1/2/3/5。
- `GV.ai(on)` L109522 走正式 setAiMode；`GV.aiInfo()` 為輕量 on/r。`GV.place(tool,x,y)` L109182 走真 doPlace 回 bool。
- `GV.stats()` L109622 返回 day/pop/jobs/roads/zones 等，但 **buildings 含 ref 格不是 root 數**，money/happy 有 rounding。root 數應在採樣邊界從 tile 檢查 `bld && !bld.ref`。
- `GV.N()` L109119；`GV.tile(x,y)` L109188 是 JSON 拷貝，勿每幀掃完整世界。
- `GV.save()`/`GV.load()` L109180–181。slot3 存檔含 seed/day/aim/aiv470/事件/財務與各可選 state；`save` L105750 的 money 也四捨五入，不能單用保存 JSON 證明內部精確 money 全等。**seed 只是世界起始 seed，不是 R 的當前閉包狀態**：newWorld L88175 設 `R=mulberry32(sd)`；load L105922 設 `R=mulberry32(seed^d.day)`，因此存檔往返本來也不是 RNG 流原地續跑。RNG 配對須另保留原始調用序列／計數或透明插樁狀態，不可把 save.seed 相等當作 RNG 相等。
- `GV.step(n)` L109620 直接 tick（上限60），`GV.advanceN(dt,n)` L109621 固定 dt（上限6000）：適合短視野配對回歸，**不是自然 rAF 效能或 wall-time 吞吐量測**。
- `GV.t470()`/`GV.mayor470()` L109154/109164 會強制 snapshot/cognition，後者還開UI；別在採樣每幀調用。`GV.t474()` 也可能觸發 snapshot/governance。
- `GV.performanceBudget()` L109432 會遍歷 SPR canvas、讀 outerHTML；只在測量邊界呼叫，不能每幀輪詢。
- 非侵入式 CDP CPU sampling 可直接歸因具名函式；若另加 instrumentation-only closure accessor，需記錄從精確源檔派生方式、hash、產品碼差異，且不可消耗 RNG／改原函式決策。

## 目前證據邊界

本文件沒有 runtime FPS、p95、CPU 百分比、memory 峰值或 50%/70–90% 改善數字。所有效能假說等待 GitHub runner 原件。Town 僅做靜態對照，未作同環境 runtime比較；非實體手機、Safari、使用者電腦測試。
