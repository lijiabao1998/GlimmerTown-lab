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
- [ ] 同種子與完整舊檔來回
- [ ] fp 零變動及逃生閥整幀等值
- [ ] 每個新守衛的 first RED／還原 GREEN
- [ ] 最後提交 smoke 三次、fp 及專屬檢查
- [x] 美術新狀態不適用：本卡不修改繪圖；仍須驗畫面沒有因載入變壞
- [x] 未執行的測試不寫通過

卡面階段：尚未修改產品、尚未執行新測試，未合併部署。未完成項就是以上未勾項；後續把實際 commit／run、成功與失敗據實補入本節。
