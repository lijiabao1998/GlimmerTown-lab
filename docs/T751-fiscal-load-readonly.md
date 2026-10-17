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

### 2026-10-17 新畫布P1：施工前範圍與正反例

最新dd8b222b重審指出永久跨版本畫布比較會擋住合法可見美術。以下契約先於本次實作提交；未跑的新驗證不能寫通過。原存檔11995 bytes、完整stateCheck、roundtrip026、結算／cadence與全部既有負控制保留，產品index.html、版本14.44／T751、fp.js、harness.js、gallery.js、正式fp/style及兩份fixture不改。

1. **本修補歷史範圍**：當次變更基底尚未包含本卡財務載入作用域及finally還原（目前為歷史BASE98545ff4）時，原HEAD／逃生閥與獨立基底日夜四向八張完整畫布逐位元相同的驗收繼續執行。本卡家族仍為「無」，不以新條件豁免本修補的像素回歸；即使先有無關文件提交改變base SHA，也不跳過這項驗收。
2. **永久同HEAD範圍**：每次完整比較目前HEAD與同一HEAD財務逃生閥的八張完整畫布；另從目前writer產生同版本完整存檔，捕捉讀檔前畫布，再原生讀檔／保存兩次。兩次保存的全部欄位均須等於輸入，兩輪日夜四向完整畫布均須等於讀檔前。比較不裁切、不遮罩、不改色、不對齊、不容許誤差。
3. **真正可見的合法美術案例**：CI仍使用PR32既有批准資產與其原封不動重烘基線；在暫存source的原生vdraw574選圖入口，讓QA原存檔的k24／v2地標顯示塔特舍爾大塔v168+相機方向。保留原生2×2錨點與四向資產，保存的k／v及所有資料不變，不增濾鏡或覆蓋畫布。必須實證至少一張HEAD完整畫布異於獨立基底；dd8b222b舊永久探針須只因完整畫布凍結而RED，新探針的全部保存／財務／畫布正例與負控制須GREEN，並保留基底、HEAD、讀檔前後原始PNG與雜湊。
4. **會改壞讀檔畫面的來源反例**：僅CI暫存source在原生load成功且反例已啟用時切換一個測試旗標，使原生vdraw574將QA的k24／v2錯選為另一既有外觀v0。讀檔前正確、讀檔後錯誤；必須先證明全部保存欄位仍完整恆等，再由同一個完整畫布斷言首紅，不可因資料變動、開機或基建錯誤冒充。恢復原source後，同版本完整保存與畫布驗收必須GREEN。
5. **既有證據與CI**：14.44歷史期望檔仍固定，當前writer仍由HEAD宣告取得；既有14.45／T752完整42項／8負控制證據用於澄清版本誤指摘，不為此刪除歷史期望。既有真實美術重烘、下一版版本案例與五個相容性負例保留。預期每個新完整原生執行保留原42項／8負控制，新增同版本全欄位、八視圖讀檔等價及壞讀檔畫面反例，共52項／9負控制；以實際報告核實。

本次只動自有probeFiscalLoad026.cjs、probeFiscalArtCompat026.cjs、本卡及僅綁本分支的臨時相容workflow。臨時workflow只有contents: read，將重烘、下一版、可見美術三種輸入放入獨立runner；沒有部署或推送。最後一次相容run全綠後仍須workflow-only刪除，再以最後head的常態smoke／fp／完整原生回歸與最新重審作合併門檻。以上為待實作驗收，尚無本次新增案例通過宣稱。

首次e77d8696常態CI的原有完整保存／結算／cadence與八個負控制仍通過，新增八張正常讀檔畫布亦通過；實際49項成功／8個負控制，新增保存判準、畫面反例與恢復判準三處先紅於完整欄位。原因是取景fixture本身呼叫britishWeather004(1,0,0)把day1改成101但治理／觀測游標仍為1，且取景zoom1.5會被原生load按T106離散縮放檔位落到1.4。不是刪去cam或gov／obs欄位：歷史八張完整畫布仍用原1.5／夏季輸入；新增同版本保存案例改用原存檔春季day1與原生檔位zoom1.4，先斷言準備沒有推進日數且保存的是可原樣讀回的縮放，再完整比較讀檔輸出與所有原始欄位。輸出不正規化、不排除欄位、不放寬像素斷言；新結果仍待實際CI。

### 0be8c4f9：新52項／9負控制與可見美術實證

[push39013156009](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013156009)／[PR39013158432](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013158432)六個常態job全綠，兩組完整原生各52項／9負控制／0失敗；同版本全欄位、兩輪八視圖、讀檔後錯外觀首紅及來源還原GREEN均實際執行。PR測試合併ae9a0104的tree與本提交同為eb95ea619c4c83f65542930946361732753c5d5a。

臨時workflow最後[run39013155866](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013155866)已completed／success，三個獨立案例均完整52項／9負控制：

- 重烘：14.44／T751，四個相容性負例正確首紅，restored=true、failures=[]。
- 下一版：14.45／T752，五個相容性負例正確首紅，restored=true、failures=[]。固定14.44檔只是歷史期望，沒有凍結目前HEAD；版本P1已回覆當次完整證據。
- 可見美術：QA的k24／v2由原生選圖入口顯示已批准塔特舍爾四向168–171，完整保存資料不變。實測八張HEAD畫布皆異於基底；精確舊dd8探針只在這八張有意變動的完整畫布RED，新完整探針全部GREEN。五個相容性負例含舊畫布凍結均命中；原生讀檔後錯選v0的反例先證明保存欄位全同，再首紅於same-version full frame day-r0 pass1，恢復來源GREEN。所有暫存檔逐位元還原，沒有把不同畫面裁成相同。

完整證據均保留至2026-10-31：

- [可見美術12093921680](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013155866/artifacts/12093921680)：30192474 bytes，SHA-256 95db5ffb674896373d279356866331efcee6a6b8e44e99adb3690c8613f44a83。
- [下一版12094355882](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013155866/artifacts/12094355882)：30428318 bytes，SHA-256 bbc9cd089dee03dcf16b3aa35fa2e3e91b0522d5d8422ed8fc8503ad62cf6011。
- [重烘12093268698](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39013155866/artifacts/12093268698)：30427705 bytes，SHA-256 0060e9afe3f3d3fd0fe75dd524ccc221641e49401443de447cde4ffef006b5e5。

原42項／8負控制及原始存檔不動，新增的是更強的同版本保存／整幀與真實壞讀檔反例。相容性GREEN只證明此讀檔守衛不誤擋已批准美術，不替代fp／風格／首卡家族或業主圖片批准。兩個新P1討論已依來源與執行證據標為解決；最後head的外部重審尚待執行，不宣稱已取得。

接下來僅補本卡與本輪日誌的52項實測記錄，再以workflow-only提交移除自有相容workflow。其後仍須最後head的smoke／fp／完整原生全綠及最新外部重審無阻斷，才依既有批准合併。本段不代表已合併、已部署或已重驗PR32。


### 2026-10-17 來源範圍P1：施工前契約與正反例

新審查5556939910／discussion_r4301985265成立：永久工作每次把指定財務函式與fp.js／harness.js／gallery.js凍結到當次base，會拒絕後續合法的已提交來源修改。此問題獨立於已完成的畫布相容性；原T751的來源不變驗收不降低。

1. **本修補仍嚴格**：當次base尚無財務載入修復時，五項財務宣告及三個共用守衛仍逐字等於當次base；真正PR33的base98545ff4仍走原判準。原fp.js、harness.js、gallery.js、產品index.html、兩份fixture及正式fp/style不修改。
2. **後續來源完整性**：base已含修復時，指定財務宣告與三個共用守衛須逐字等於真正Git HEAD的已提交來源，而非永久禁止相對base的合法修改。額外未提交來源修改仍精確首紅於來源完整性；實際renderer的fp/style驗證無條件保留。
3. **真實正例先舊RED再新GREEN**：新增CI暫存、具真實父子關係的獨立base與後續HEAD；後續HEAD只對指定財務宣告及三個守衛加無行為差異註解，並沿用既有真實美術與原封不動基線。精確8da82b8f舊探針須因來源凍結RED，新探針須在該真正HEAD通過全部52項／9負控制。
4. **原負例與修補邊界**：既有額外守衛修改負例保留，後續工作中的額外未提交修改亦須首紅；另在T751範圍驗財務來源及守衛修改，仍由原base逐字恆等首紅。全部保存欄位、原stateCheck／roundtrip／結算／cadence、9個原生負控制、歷史及同HEAD／同版本完整畫布判準均不變；不修改原fp.js。
5. **驗證與收尾**：原rebake／future-release／visible-art三案例不刪，新增source-scope獨立runner。所有CI暫存來源與工作樹逐位元還原，不推送或部署暫存HEAD。新分支專屬唯讀workflow最後全綠後寫卡、再workflow-only刪除；其後最後head常態CI與最新外部審查仍須全部完成。以上是動手前驗收，尚未宣稱新來源案例通過。


### 75e42cf9：來源範圍與四案例完整實證

[push39017125987](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125987)／[PR39017130368](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017130368)六個常態job全成功：兩組smoke各三次，fp相對base新增0／變更0／移除0、家族0、風格無下降、style165族相同；原生回歸各52項／9負控制／0失敗。PR測試合併d67f3ff7的tree與本提交同為1acf578138bb0c8557a806c6b1998e8b3027e68a。

新來源案例以真正CI暫存父子提交驗證：base9faac235、後續HEAD2474cba2。五項財務宣告與三個共用守衛在後續HEAD只加無行為差異註解；精確8da82b8f舊探針分別首紅於財務來源與守衛凍結，新探針完整52項／9負控制GREEN。T751範圍財務／守衛修改仍精確首紅於原base恆等；未提交的財務／守衛修改亦精確首紅於已提交HEAD完整性。來源案例另含既有重烘／CRC／風格反例，共10個相容性負例；restored=true、futureWorktreeRemoved=true、failures=[]。

[來源附件12095317913](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125971/artifacts/12095317913)：37682572 bytes，SHA-256 26896f2c7a32f6a4f36def738c6092efe357a2a19428b97b9cbf29170ecc0401，保存base／HEAD完整來源、原始commit內容、原生完整保存／畫布與全部首紅。暫存提交只在CI存在，不是產品提交或部署。

新分支專屬workflow最後[run39017125971](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125971)已completed／success。重烘、14.45／T752、可見美術、來源四案例各完整52項／9原生負控制，額外相容性負例分別4／5／5／10；真正可見美術實際改變8張完整畫布，舊探針只因這8張畫布RED，新版完整GREEN。所有暫存輸入逐位元還原。

- [重烘12095761111](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125971/artifacts/12095761111)：30427934 bytes，SHA-256 6c679396b6d0be2d80ef1550a7e5260de45f3389e759fc7be4e887487d76a1c3。
- [下一版12095019234](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125971/artifacts/12095019234)：30428563 bytes，SHA-256 edb9990d434740e64686ce9ed8f546698b019710eda159b29228920a63ea8798。
- [可見美術12095268820](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39017125971/artifacts/12095268820)：30192713 bytes，SHA-256 25ed846a2cf4ee7fe399237460530b243663a6121c41ff06b917e10ffdb943cc。

來源P1已據此回覆discussion_r4302050944並標解決；不拿已完成畫布案例替代這項來源驗證，也不宣稱最新外部機器人重審已完成。四案例已全綠並在本卡記錄；接下來須workflow-only刪除新source-compat workflow，並取得最後head常態CI及新外部重審，才依先前獨立批准合併。原產品、fp.js／harness.js／gallery.js、完整保存／正常模擬／結算／cadence／負控制／畫布判準保持；PR32尚待本修補獨立合入main後同步重驗。


### 2026-10-17 新範圍審查：施工前穩定歷史與模擬契約

審查5557051249兩項成立，分別為discussion_r4302079986（以程式拼字辨識修補會在格式重構後誤判）與discussion_r4302079989（永久base／HEAD模擬恆等會擋後續正式玩法變更）。不重開已解決的來源、版本或畫布討論；以下先於本次施工記錄。

1. **穩定修補範圍**：以Git變更base的祖先歷史查找精確commit trailer「Glimmer-Fiscal-Load-Repair: GPT-026」，並核實標記commit確為祖先，不再以函式或finally的拼字判斷。標記只隨已含本修補的實作提交及最後squash合併commit發布；真正PR33 base98545ff4仍無標記，繼續原T751來源、獨立base整幀及模擬恆等驗收。格式／命名重構不會抹掉既有Git歷史標記。合併訊息必須保留該trailer。
2. **原T751模擬不降低**：本修補仍完整比較同種子獨立base與HEAD的正常世界及所有財務欄位。base已含修補的後續工作，永久比較同一HEAD有讀檔／無讀檔的完整正常模擬結果，包含原points以外的初始化、完工與force欄位；原loaded.points守衛保留並加強全結果恆等。產品數值、公式、cadence、RNG及原normal026函式不改。
3. **新增活體反例**：CI暫存來源只在正常世界原生load之後，讓後續日結算多一元；原生新世界重設故障旗標。原生有／無load兩條序列須由同一完整正常模擬守衛精確首紅，還原來源後完整GREEN。原52項／9原生負控制全保留，新增此反例後預期53項／10負控制，以實跑為準。
4. **格式重構正例**：CI的真實已修補base只改fiscalLoading026宣告的空白，另以既有批准資產讓QA畫布確實可見變動。精確c175bddf舊探針應因錯誤歷史範圍拒絕8張畫布，新探針須全53項／10負控制GREEN；不改任何保存欄位或畫布比較判準。
5. **玩法變更正例**：僅CI真實後續子HEAD把日結算的recurring收入加1，base保留原公式。精確c175bddf舊探針須只在正常base／HEAD數值恆等首紅；新版須實證base／HEAD正常結果不同、同HEAD有／無讀檔全結果相同，並通過全部53項／10負控制。此數值變更只作測試輸入，不提交產品index.html或部署。
6. **原驗證與收尾**：原重烘、下一版、可見美術、來源四案例及其負控制不刪，另加refactor-scope／model-scope兩個獨立runner。原fp.js／harness.js／gallery.js、兩份fixture、正式fp/style及產品index.html不改；所有CI暫存輸入還原。新唯讀分支workflow最後六案例全綠後寫卡，再workflow-only刪除；最後head常態CI與新審查仍是合併門檻。以上為施工前契約，尚未宣稱新案例通過。


### ac5c208c：六案例及53項／10負控制完整實證

[push39019054802](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054802)／[PR39019059026](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019059026)六個常態job全成功，兩組smoke各三次、fp相對base新增0／變更0／移除0、家族0、風格無下降、style165族相同；兩組完整原生回歸各53項／10負控制／0失敗。原52項／9負控制保留，新增真實load後日結算副作用首紅及還原。PR測試合併bdf6fe70的tree與本提交同為d0b386ea238cf81d71cf984c2056e45ca545fa4f。

新lineage分支workflow最後[run39019054850](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850)已completed／success，六案例各53項／10原生負控制、failures=[]、restored=true：

| 案例 | 額外相容性負例 | 原始附件／bytes／ZIP SHA-256 |
|---|---:|---|
| 重烘 | 4 | [12095933457](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12095933457)／30442391／8b4b12f904362a947883c042a056448c575ffdbc510b8037267d3f951a11b3cc |
| 14.45／T752 | 5 | [12096360567](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12096360567)／30443003／1a9fcaab956e6e3c9269dcf3f6861d97f278a43a0e0fd3d51c3e12358be5efde |
| 可見美術 | 5 | [12096053182](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12096053182)／30207189／e11910006260d8e0ab5e6bd4f84411bc40d1bdfacc3d14a6c0d95aea6944d51e |
| 來源完整性 | 10 | [12095857376](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12095857376)／37697048／b6b4c7a429e730ce05de32b13b7229ee31d55795a67b7d6cbbc998f0924ee3ee |
| 格式重構 | 5 | [12096227684](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12096227684)／50967595／757486959002649933caec79705ad3a108874468dcdc478e077a4a9fc989acdc |
| 玩法變更 | 5 | [12096591373](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39019054850/artifacts/12096591373)／67687400／6853ee12a5fc8e81413fc60d80514b1b00e83425288a232e69e012ad496a8f5d |

格式重構的真實base只改函式宣告空白，修補標記ac5c208c仍是祖先；精確c175舊探針只拒絕8張完整畫布，新版全53項／10負控制GREEN。玩法子HEAD只在CI將日結算recurring加1，精確c175舊探針只紅正常base／HEAD數值恆等（51成功、9負控制、1目標失敗）；新版base／HEAD正常結果確實不同，第一日money10975／10977，仍完整保持同HEAD有／無load結果相同。

新增真實來源反例只在原生load後讓後續日結算多一元，兩組常態原生與六案例均由same-HEAD normal load/no-load equality首紅、還原GREEN。舊T751獨立base模擬／來源／整幀判準不降低；產品index.html、公式、參數、原共用守衛、兩份fixture、正式fp/style及原normal026／cadence等函式不改。

新兩項P1已分別據實證回覆discussion_r4302156598／discussion_r4302157008並標解決。接下來只記錄自身r198單列、workflow-only刪除lineage分支workflow，再核最後head常態CI及新外部重審；尚未合併部署或重驗PR32。最後squash合併訊息必須逐字保留獨立footer：Glimmer-Fiscal-Load-Repair: GPT-026；合後核實該marker與main祖先解析。
