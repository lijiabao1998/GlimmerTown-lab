# T751 — 財務載入只重建快取，保留存檔紀錄與結算節奏（原 GPT-026）

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

1. **原生完整存檔恆等與精確版本遷移**：固定舊檔經真正 GV.load→GV.save 連續兩次；同版本輸入的所有序列化欄位、陣列內容與順序均等於輸入。跨版本僅准明確的 gameVer 14.43→14.44，完整輸出須等於事先固定的完整 release 期待檔；其所有非版本欄位、鍵集合及陣列順序必須逐項等於原始舊檔。不刪欄位、不遮罩 history、不以待測輸出產生期待值。正常 slot3 與 sandbox slot3 各驗，非作用中存檔不變；第二次保存須完整等於第一次。
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

財務邏輯實作保持 `0c43f4e8d7a5d04500d34c2127f587133b4c89d5`；後續產品變更只包含合併用版本字 v14.44／T751，財務公式、價格、容量、RNG 與原始舊檔維持。

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

### 常態 CI 與精確來源一致性

分支專屬 workflow 刪除是 AGENTS 第3節的規定，並不是原生驗收通過的理由。00d7bd84 與原生受測28e5c5a9的完整樹差異只有本卡及移除該 workflow；index.html、smoke.js、probeFiscalLoad026.cjs、fixture 與其他程式檔逐位元相同。

但00d7bd84的常態 smoke／fp只有新增的作用域自檢，沒有完整原生回歸，不能稱為已持續保護38項。本次另在既有 `.github/workflows/smoke.yml` **只追加** `fiscal-load` 獨立 job，原 smoke／fp 工作、觸發範圍、判準與 Pages 設定均保留。新 job 在同一常態 workflow 的 main、各寫入者分支及 PR 程式變更事件執行相同探針、原始fixture與全部負控制，contents: read，無部署／推送權限；失敗使整個 smoke workflow 失敗，不能成為 Pages 自動部署的成功前置。

新 job 使用 fetch-depth:0、Node22、同字型、同一 `node probeFiscalLoad026.cjs`，失敗仍保留 JSON／畫布14天。這筆常態CI接入尚待當次實際run，不能沿用舊head綠燈宣稱通過；最後head的執行與附件另在PR33記錄。探針、fixture、產品與原有斷言沒有再改動。本PR因此包含常態CI變更，明確屬於AGENTS第3節不准GPT自行合併的範圍。

### P1：歷史存檔與當次變更基底分工

審查 discussion_r4296182098 成立：先前 staticChecks 把 fp.json、style.json 與守衛固定比對98545ff4，會阻擋之後合法美術重烘。本次修正不變更存檔欄位比較或負控制：歷史98545ff4僅保留原始缺陷／舊檔證據；當次來源檢查與正常配對由 `fiscalChangeBase026.cjs` 取PR事件base.sha、main push的before，分支則用merge-base origin/main。缺少PR基底即失敗，不退回歷史SHA。

fp.json／style.json不再要求等於歷史檔案，而由未修改的 `fp.js --check` 對當前真正烘焙結果完整核對，並以當次變更基底報差異；守衛來源仍須等於當次基底。這是替換錯誤的永久檔案凍結判準，不是移除指紋／風格驗證。原始11995-byte fixture、stateCheck、roundtrip026、金額／history／游標負控制均保留。

`probeFiscalArtCompat026.cjs` 與僅綁本分支的唯讀臨時workflow驗證：真實PR32美術與其有效重烘檔確實不同於財務分支；舊staticChecks須首紅於fp.json unchanged；新版須在獨立當次基底（另含無行為差異的守衛註解）通過完整38項／7負控制。額外修改守衛、錯誤新葉CRC及偽造風格分仍須命中各自既有守衛，還原有效基線GREEN。所有暫存輸入最後逐位元還原，不推送或部署。這筆相容性接入尚待當次CI，不沿用舊head綠燈。

### P1 首次相容性執行的精確結果與修正

提交6d3b22b6的run39007135385已實際驗證合法PR32美術／重烘基線可通過完整38項／7負控制，舊凍結規則與額外守衛變更兩個首紅亦正確；其後單獨破壞新葉CRC的負例失敗於預期exit1、實際exit0。原fp.js只用家族CRC差異決定退出，葉子資料差異只記錄；這次只改subs中的d、家族CRC未變，故暴露逐葉資料一致性缺口。沒有把負例改成接受exit0，也沒有改原fp.js。

新增checkFiscalFingerprint026.cjs：先跑原fp.js --check與當次dump，再對 committed／rendered 的所有葉子鍵集合及d／n／w／h／op逐項核對；僅保留既有、逐項精確匹配的本平台envLeaves例外。這層限定在本次自有相容性驗證，補強單葉資料與家族摘要不一致時的拒絕；常態財務探針保留已提交的fp.js檢查。修正已於ad77b62d發布；[push39008444100](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008444100)／[PR39008447373](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008447373)的六個常態job均成功，兩組完整原生回歸各42項／8負控制，過期writer只首紅於gameVer。當時相容性job仍執行中，不能把合法案例通過當成整個相容性job通過。

永久探針亦不能把目前14.44／T751寫成所有未來版本的固定判準。保留14.44完整期望檔與其精確SHA，T751仍固定要求14.44；後續版本只從程式宣告的GAME_VER／GAME_ANCHOR建立期望中唯一可變的gameVer，再完整比較實際保存輸出，不從待測輸出推導期望、不排除任何欄位。實際版本字與過期writer首紅同樣要匹配宣告。自有相容性測試另在CI暫時套用14.45／T752三個版本文字，先證明前一版探針在固定版本判準首紅，再要求新版完整42項／8負控制通過，最後逐位元還原。產品仍是14.44／T751，未把未來版本提交或部署。

### v14.44／T751 精確遷移驗收

本卡第1項保留同版本完整恆等，跨版本只新增明確的 gameVer 14.43→14.44。原始 fixture 11995 bytes、SHA-256 `168d851165e275f3960483eadde80d2eb865f9502f3bd6ae728841519de6be12` 未改；獨立 `fixtures/fiscal-load026/legacy-v14_44.expected.json` 同為11995 bytes、SHA-256 `a309a1c546ef6989b73065f9aaec79e2e3e97b6e89ab3117aa5b78da473d2276`。完整物件機械比較證明唯一差異為 gameVer，並額外嚴格核對 GAME_VER=14.44、GAME_ANCHOR=T751、開始版本字 v14.44 · T751。期待值不取自實際輸出，實際輸出不被正規化。

stateCheck、roundtrip026 與原始檔保留；跨版本完整比較改用獨立 release 期待值，同版本案例仍直接比輸入全物件。原歷史 BASE 維持14.43，其缺陷負例仍先紅於 history。跨 writer 的逃生閥對照只套用明確的14.44版本期待，其他完整欄位仍逐項等於獨立歷史輸出。金額／追加刪除 history／游標負例逐一驗首紅路徑，確保不是因版本差異先紅。

在原38項／7負控制外，新增一般／sandbox同版本完整來回、精確實際版本字及錯誤writer版本負例，共42項／8負控制。錯誤來源只將serializer的gameVer改回14.43，應精確首紅於gameVer且沒有其他資料差異；恢復原serializer後完整GREEN。原有舊格式null optional欄位省略規則保留，首輪完整差異另記，之後完整穩定。這筆版本遷移與T751合併紀錄的當次CI尚未完成，結果以PR33最後head及附件為準。

### 未完成與合併邊界

尚未合併部署。合併前仍須最新head的原生、相容性負控制、smoke三次與fp全綠，以及最新審查無未處理阻斷。分支專屬相容workflow須最後一次綠後另以workflow-only提交移除；完整財務回歸仍留在常態smoke流程，原smoke／fp工作保留。T751／r198與v14.44合併紀錄在同一PR，commit欄為#33。

### 最新完整驗證：2747933b

[push39008834073](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008834073)／[PR39008837614](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008837614)六個常態job全綠：兩組smoke各三次、fp相對base新增0／變更0／移除0、家族0、風格無下降、style165族相同；兩組原生回歸各42項／8負控制／0失敗。PR測試合併提交a3bc538b的tree與本提交相同，均為c9f76c6c3c3a71361470f5d501387246b4f305c6。

分支專屬workflow最後一次[run39008834071](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008834071)已成功。真實PR32美術重烘與CI暫時14.45／T752案例分別通過完整42項／8負控制。五個相容性負例分別首紅於舊fp凍結、額外守衛修改、舊固定版本判準、新葉CRC及偽造風格分；還原有效基線GREEN，restored=true、failures=[]、ok=true。原fp.js及正式產品14.44／T751不變。

[完整相容性證據12092770331](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39008834071/artifacts/12092770331)：18428342 bytes，ZIP SHA-256 f78a037c068fb00d7b4ffa0af78f83fbb5fc10926783e9d07f42332cbacdfbf8，保留至2026-10-31。包含目前／未來版本兩組原生報告與完整畫布、全部負例日誌及還原證明。

本段記錄已驗證的程式提交；接下來僅補此卡，再以workflow-only提交刪除本分支臨時workflow。刪除後仍須最終smoke／fp／完整財務回歸全綠，不把刪除本身當成測試通過。既有P1已有實作與相容性證據；沒有宣稱取得新一輪外部機器人複審。

PR32尚未同步修復，也未進行修復後完整重驗。需先獨立合入修復，再以該main SHA更新其原有BASE引用並完整重跑原守衛；不將未合併財務實作混入美術PR。第一波尚未合併，方向完成仍為0／20波。
