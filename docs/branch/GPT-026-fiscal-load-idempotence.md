# GPT-026 — 財務載入只重建快取，保留存檔紀錄與結算節奏

## 問題與範圍

基底：`98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e`；分支：`gpt/fiscal-load-readonly-026`。

原生 load 的 T514 觀測台刷新會在財務尚未 ready 時呼叫 `fiscalStep515(true,false)`。force 同時觸發歷史聚合；settle=false 只跳過金流，沒有阻止 history 追加。重複讀取同一份存檔因此追加相同日期的紀錄。過期資產／backlog 游標也須覆蓋，不能只移除 history.push。

本卡只修載入期間的財務派生快取重建。預定修改 index.html 的載入作用域、fiscalStep515、fiscalAssetScan515、fiscalCity515，另加唯讀狀態自檢、新增探針及 smoke 自檢入口。價格、稅率、成本、容量、RNG、schema、fiscalSave515／fiscalLoad515、日結算公式及既有斷言保持。美術及 PR32 的產品程式不在本卡。

**第一筆不可變 fp 家族：無。** 相對 base 全部家族、既有葉、style、完整超街區必須零變動；不提交新 fp.json／style.json。

## 開工基線

- main 最近完成 smoke 38830704770、Pages 38830909594 均 success；之後為文件提交。
- 現有 PR32 獨立保留，受測 head30de519：標準 smoke／fp 綠；專屬舊檔全欄位兩次來回紅。沒有其他開放 PR 或同主題已合併工作。
- 固定回歸 fixture 是原生 slot3 測試存檔，11995 bytes，SHA-256 `168d851165e275f3960483eadde80d2eb865f9502f3bd6ae728841519de6be12`。day=1、history=4；部分游標=4 是原值，不能為通過比較而正規化。來源為 run38891386460 的原始附件12042510466，內部路徑 scenes/legacy-base.json。
- 遊戲及像素測試僅在 GitHub Actions 執行；本地只做原始碼、語法、差異及檔案雜湊檢查。

## 動手前固定驗收

1. **原生完整存檔恆等**：固定舊檔經真正 GV.load→GV.save 連續兩次，所有序列化欄位、陣列內容與順序均等於輸入；不刪欄位、不遮罩 history、不修改期待值遷就實作。正常 slot3 與 sandbox slot3 各驗；非作用中存檔不變。
2. **歷史與游標**：空歷史、既有歷史、滿180筆、零／過期／未來游標及非零 backlog／ledger／revenue 均覆蓋。讀檔不追加／裁掉既有有效歷史，不推進五個持久化游標，不增加結算或改錢；派生 city、infrastructure、assets 仍建立且 ready。
3. **正常語義保留**：不用載入的同種子 BASE／branch 短視野配對，金錢、人口、基礎設施及 fiscal 序列化結果相同。非零 recurring／completion 場景覆蓋正常日結算、重複同日呼叫防重、7日聚合及14日資產掃描；載入後不漏掉或重複下一次應有更新。正常明示 force／政策路徑不被永久禁用。
4. **例外清理與重入**：正常返回、false、拋例外及巢狀載入都以 finally 還原原作用域深度；後續載入、手動刷新、正常日更恢復。合法來源負例必須能抓到洩漏作用域，不把 ReferenceError 當目標紅燈。
5. **舊格式**：fiscal515 缺欄位／null 不虛構過往歷史或金流。既有格式正規化的完整差異另列，穩定後再次來回完整欄位恆等；發現其他子系統問題先記錄，不擴大財務修補或刪差異。
6. **活體負控制**：真正落盤少$1、追加／刪除歷史、改游標分別命中完整狀態守衛；還原原檔後 GREEN。來源負例恢復載入寫歷史、故意漏 finally 清理等，首紅必須落在對應守衛。BASE 舊缺陷須被相同嚴格判準抓到。正向一律用正常路徑，不靠逃生閥假綠。
7. **變更邊界**：fiscalSave515、fiscalLoad515、fiscalDailySettlement515、fiscalCompletionSettlement515 與財務參數逐位元保持；既有守衛及基線不變。新增逃生閥僅用於回退及獨立 BASE 對照，不能取代正常路徑驗收。
8. **CI 與整合**：最後 head 的 smoke 三次與 fp 綠；專屬驗證綠並保留可重現報告。修復獨立驗證後，PR32 必須以獨立修復合入的 main 為正確對照，再跑原完整欄位、原生幾何、行人、整幀等值及負控制；不得以固定舊 BASE 的已知缺陷作為修復後期待值，也不得降低原判準。

## 回滾與合併邊界

作用域只在同步 load 呼叫期間有效，例外安全；逃生閥 `window.__noFiscalLoad026` 回復舊行為。回退以追加修正／正常 revert 進行，不重寫已推歷史，不直推 main。

分支專屬 workflow 僅綁本分支、permissions: contents: read、不部署、不推送。是否可合依 AGENTS 第3／7節核實；在獨立修補落地前，不把未合併財務實作混入美術 PR。

## 收工自檢與施工紀錄

- [x] 卡面在實作前獨立提交；家族宣告固定為無
- [x] 同種子與完整舊檔來回
- [x] fp 零變動及逃生閥整幀等值
- [x] 每個新守衛的 first RED／還原 GREEN
- [x] smoke 三次、fp 及專屬檢查已有以下實作提交的實際存證；最後整理 head 仍必須通過 PR checks
- [x] 美術新狀態不適用：本卡不修改繪圖；仍須驗畫面沒有因載入變壞
- [x] 未執行的測試不寫通過

### 實際修改

產品實作為 `0c43f4e8d7a5d04500d34c2127f587133b4c89d5`，之後三筆提交只修正新增探針的 fixture 與診斷，沒有再改產品程式。

- 同步 native load 進入／離開時保存並還原深度，涵蓋內層觀測台與外層財務刷新；finally 處理正常、false、例外及重入。
- 載入期間仍重建 city、infrastructure、assets，跳過歷史聚合、資產掃描游標、維護 backlog／游標與日結算寫入。一般 force、政策與日更走原有路徑。
- fiscalSave515、fiscalLoad515、fiscalDailySettlement515、fiscalCompletionSettlement515 及 FISCAL_CADENCE515 逐位元相同；既有斷言、fp／style 基線與共享測試骨架沒有變動。smoke 只新增自檢入口。
- 新增 `probeFiscalLoad026.cjs` 及原始 fixture；所有遊戲／像素執行均在 GitHub Actions，來源語法／雜湊／差異檢查另行完成。

### 實際回歸與探針診斷

| 實作／探針提交 | 原生回歸 run | 通過／失敗 | 結論 |
|---|---|---:|---|
| 0c43f4e8 | [38914220612](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38914220612) | 30／8 | 原始舊檔與12組歷史／游標場景已通過；新增探針的舊格式判讀及配對初始化有錯 |
| 48886cda | [38914993379](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38914993379) | 32／6 | 原生序列化原本省略空 optional fiscal515；missing／null 經完整比較穩定，其餘逐欄差異指向前例殘留 |
| 439876ed | [38915647150](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38915647150) | 35／3 | 重設獨立 fixture 並固定天氣輸入後，正常 BASE／HEAD 配對恢復；剩餘差異只有初始化第一筆 history 的文字 |
| 28e5c5a9 | [38916398951](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38916398951) | **38／0** | **7個負控制，全部 first RED／恢復 GREEN；未刪任何比較欄位或放寬完整狀態判準** |

精確原因：newWorldSeeded 不重設 T515；fin.net 也可能留有上一例的 -12。獨立正常配對現在先用原有 QA 入口固定財務輸入，再重設財務、建立本例歷史。舊 schema 不序列化 wxT，因此兩條續跑使用相同原生天氣輸入。上述修改只控制 fixture 的起點／外部輸入；歷史第一筆仍參與完整比較，原始11995-byte舊檔未變動，所有完整狀態與正常結算斷言保留。

最終原生結果：一般／sandbox 各6組，兩次 load→save 的所有序列化欄位與輸入相同，非作用中鍵未動；0／4／180筆歷史、零／過期／未來游標、非零 backlog／ledger／revenue 通過。missing 舊格式首輪差異為空；null 舊格式只省略原本 optional 的 fiscal515，未虛構歷史或金流，後兩輪全欄位恆等。

同種子31、1／7／14日正常結果與獨立 BASE 相同；非零 recurring／completion、同日防重、載入後下一日、7／14日節奏、force／政策、false／throw／重入與後續正常運行通過。四種真實落盤負例為 money -1、追加／刪除 history、改游標；另有原 BASE 缺陷、HEAD 逃生閥恢復載入寫歷史，以及合法來源漏 finally 清理，目標首紅及還原均通過。HEAD 與逃生閥各8個日夜四向完整畫布均等於 BASE。

實作提交28e5c5a9的 [smoke三次／fp 38916398949](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38916398949) 兩工作均 success；fp 相對 base 新增0／變更0／移除0、觸及家族0，風格分沒有家族下降，165族 style 相同，超街區零變動，符合首筆家族宣告「無」。最後整理提交不更改實作或判準，仍須核對該 head 的 smoke／fp 綠燈，以 [PR33 checks](https://github.com/lijiabao1998/GlimmerTown-lab/pull/33/checks) 為準。

原生報告與16張完整畫布：[附件12052582643](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38916398951/artifacts/12052582643)，8,863,290 bytes，ZIP SHA-256 `0d0340d20636750bb7e97acd084806f088d25e658dd1aa4c1a8071f40594ac6a`，保留至2026-10-30。分支專屬 workflow 最後一次 run38916398951 已綠，後續只以獨立 workflow-only commit 移除。

### 未完成與合併邊界

未合併部署。按 AGENTS 第3節及第7節第1步，涉及舊檔來回與正常模擬驗收的修補保留 [等業主] PR33，交由業主／main 寫入者審閱。尚未配合併用 T 號、版本及主線日誌。

PR32 尚未同步修復，也未進行修復後完整重驗。需先獨立合入修復，再以該 main SHA 更新其原有 BASE 引用並完整重跑原守衛；不將未合併的財務實作混入美術 PR。第一波尚未合併，方向完成仍為0／20波。
