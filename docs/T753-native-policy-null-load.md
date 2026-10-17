# T753 — 原生載入保留明確的空政策狀態（原 GPT-028）

狀態：準備依已批准的 PR35 合入 main 並發布 T753／v14.46；合併與 Pages 成功狀態以 GitHub 實際結果為準。全部遊戲驗證由 GitHub Actions 執行。

## 目標與授權

2026-10-17 業主追問「但 native 及 normal-pairs 仍紅，這個為什麼不修」。本項是 GPT-027 全欄位驗收找到的獨立原生讀檔修補，先修產品，再回到第二波驗收；不是新增建築，也不算完成一波。

基底：遠端 main `58130eae1f5451a5f56142b5fab7b003b910155e`（T752／v14.45）。分支：`gpt/policy-null-load-028`。

**要動的 fp 家族：無。** 這份第一個 commit 的清單固定；不得提交 fp/style 基線。保留原有價格、容量、RNG、政策啟動、政策遷移及畫面規則。

## 已知證據與最小範圍

- GPT-027 head `9aa8a42ef2b26fccf0974334bd5090ae225304ed`，run `39035608277` 的 native 與 normal-pairs 都報 `pol:null` 在原生 load/save 後成為完整預設政策物件；同 head 普通 smoke 三次、fp、fiscal-load 綠。
- main 的 newWorld 使用 `pol=null`，原生 save 明確寫出 `pol:null`；沒有政策註冊資料時 `policySave504()` 回傳 null，因此省略可選 `p504`。
- 原生 load 卻把所有 `p504===undefined` 都交給舊政策遷移，`policyLoad504` 的 legacy 分支呼叫 `mayorEnsurePolicy470A()`，將 null 初始化成預設物件。這是目前存檔與舊政策遷移的分類混淆。
- 前兩次僅對探針情境做 step／開啟市長頁，沒有修到這個載入分類；三地塊的早期對照也未重現十筆交易，不把它當完整證明。
- 只調整原生載入是否進入既成政策遷移：明確 `pol:null` 且沒有 `p504` 應保持空；真正缺少 `pol` 的舊檔、非空的既成政策與現有 `p504` 解析照舊。加逃生閥恢復舊分類供診斷，正常驗收不使用逃生閥。
- 新增獨立 CI 探針、分支專屬唯讀 workflow，以及 smoke 的純分類自檢；不修改既有守衛或共用 CI 判準，不更動美術、版本、日誌、方向檔或別人的工作。

## 動手前驗收（不得放寬）

1. 在 CI 直接執行未修改 main 原生路徑，保留輸入及兩次載入後完整 JSON；明確空政策案例必須先紅在 `pol`。修後同版 normal／sandbox 各至少兩次原生 load/save，所有輸入鍵與值逐一相等；不排除欄位、不對政策物件做正規化、不把輸出當期望值。
2. 正常付費建造、undo/redo、ref 拆除後的同種子完整模型對照，保留所有欄位；載入與未載入分支的後續日結算相等。新增修補不得改價格、容量、RNG 或數值結算。
3. 原生舊檔缺少 pol、非預設既成政策、已存在 p504 的檔案，修前與修後實際遷移結果逐欄相同；非預設政策仍 grandfathered／100% 生效，不虛構 baseline，現有註冊資料仍保存。只允許事先宣告的版本欄位遷移，禁止任意正規化。
4. 對實際載入來源加活故障重現原 `pol` 差異，須由同一完整欄位斷言抓紅；移除故障恢復綠。另保留金額／政策值等負向控制，使完整欄位守衛仍能抓到資料損壞。逃生閥只能佐證根因，不能替代正常修後驗收。
5. 同版載入前後的日夜四向完整畫布相等，修前／修後相同場景逐像素相等；不得隱藏模型差異、裁掉畫面或更改其他探針容忍值。
6. 原有 fiscal-load 完整回歸、smoke 三次及 fp 必須在最後實作 head 全綠；fp 相對 base 零變動，舊守衛與財務負向控制不變。
7. 只做雲端工作；本機僅語法／來源檢查，遊戲、Chrome、像素、行為測試只在 GitHub Actions 執行。分支專屬 workflow 最後一次成功後才可按庫規移除；不合併該 workflow，不手動部署、不直接推 main。

## 交付與自檢

實際 CI、首紅與修後綠、完整 JSON 雜湊、負控制、舊政策遷移、畫布及 fp 結果見末節。此修補涉及原生讀檔，按 AGENTS 第 7 節等業主審核，不自行合併或部署；以下保留各輪實際診斷及未成功階段。

首輪診斷 `66916926d345690c57fe3a69cfd10a854e76f300`／[39037145405](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39037145405) 在測試前提失敗：新建的十筆交易／渲染設定情境，在保存參考檔前已把 pol 初始化。這不是原生讀檔首紅，也不是修補成功。保留該原始 JSON，不再假設只重做十筆交易能重現 GPT-027 先前整段 UI 歷史。

後續將另保留未修改 main 的 newWorld→save 原始 null 值，事先明列 nullable schema 案例：使用完整且已初始化的原生十筆交易存檔，只把 pol 設為該獨立原生新局寫出的 null；輸入改動全數記錄。這是明確設計的有效存檔案例，並非聲稱它是 GPT-027 原始檔。以未修改 BASE 的實際載入、對原遷移分支的前後追蹤，再比修後完整欄位，驗證 nullable 存檔能否保持。完整輸出比較不排除 pol 或任何其他欄位。

GPT-027 美術草稿 PR 曾被自動核准以超出最初 docs-only 授權拒絕，尚未建立。此卡不繞過該拒絕、不發布該美術 PR；只依業主最新要求處理讀檔紅燈。

### 2d1bb264 的實際結果與下一步

[39037388662](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39037388662)：smoke 三次、fp、原有 fiscal-load 全成功。fp 為166家族／3423葉，新增0／變更0／移除0，相對 base 觸及0；style165族一致、無下降，超街區1728項 CRC `5ef6eb67`。

[39037388686](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39037388686)：新診斷整組仍紅，10項成功、6筆負控制紀錄，不宣稱完成。修補後 nullable 案例已不改 pol；原生缺 pol、非預設既成政策、已存在 p504 的修前修後完整結果相同。來源故障與逃生閥都重現 pol 首紅。

但這個新造案例另暴露 gov513.lastAggregateDay 從1變2；首次 trace 還混到進城時的呼叫；跨原生 undo 的 BASE／HEAD 起點也因修補真的改到 undo 內部載入而出現預期 pol 差異。額外14日續跑在 inn507.talentStock／talentPipeline 有0.0001差異，完整畫布比較亦紅。所有比較、失敗與原始 JSON 保留；不把這些整組驗收寫成綠，不排除上述欄位，不修改遊戲其他子系統來湊過。

下一步用 CI 暫時讀取原美術 head9aa8a42，先以原 native／normal-pairs 斷言重現 pol 紅，再僅套入獨立2d1bb264修補候選；對照 BASE 也改為這個真實獨立修補 commit。原斷言／容忍值／欄位比較逐位元保留，只追加在斷言之前存原始輸入輸出的證據，並明列候選未合入 main。兩支工作平行執行，不部署、不推送、不改原美術分支；CI暫存檔最後還原。

### 原兩支探針的實際首紅與候選轉綠

[39038063179](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39038063179) 的兩個 original-wave027-guards 工作已 success：native job117411790989、normal-pairs job117411791145。各自先執行原9aa8a42及原BASE58130eae，exit1且首紅精確為 pol:null→預設物件；再以獨立已提交2d1bb264為原生對照、只套相同分類修補，原探針 exit0。原 native 全部負控制、兩輪全欄位往返、十款原生交易，以及 normal-pairs 三種子／三個真金額負例、兩輪十筆交易完整穩定比較均保留。這是候選整合成功，實際 main／美術分支仍未更新。

同一次 normal-pairs 在斷言前保留未修改 main 實際十筆交易及完整先前 UI 歷史的原生參考：17706 bytes，SHA256 `bd34e6f3b22b70c4a935d7244f6e9884c55a7a5a3b89c5627e2176a8350975d5`；pol=null、day2、gov513.lastAggregateDay2。獨立修補候選的 BASE 也產生逐位元相同的檔案。固定在 `fixtures/policy-null028/original-main-native.json`，來源另記 provenance；沒有改動任何輸入位元組，也不是從修後 HEAD 的輸出建立期待值。

後續嚴格原生診斷用這份真正原參考檔取代先前合成案例；先前 gov 游標／小數／畫布紅的原始附件 [12103176139](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39037388686/artifacts/12103176139) 及失敗報告保留。政策追蹤只清空量測用陣列，量測指定的那次 load；遊戲資料不改。日結算的兩臂從同一原始檔各自讀入一次作共同起點，再分別實驗0／1次額外load；原新局暫態小數差異沒有宣稱已修。BASE／HEAD 配對保留全欄位，明列 undo 內部也經原生載入，所以修前預設政策→修後明確null是本項目的完整預期差異，逐一驗證原預設值與修後null，其餘值必須相等。畫布前後採樣改在同一同步瀏覽器工作完成，避免 CDP await 之間跑進額外動畫幀；仍比較所有像素，不降低容忍值、不使用逃生閥。

上述正式參考檔與量測修正尚待其實際 CI，不能沿用候選兩支成功把新增診斷也寫成成功。

### 15299720：原生資料與續跑已綠，剩畫布

已開 [純修補草稿 PR35](https://github.com/lijiabao1998/GlimmerTown-lab/pull/35)，沒有美術改動，未合併部署。

[39038520953](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39038520953) 的原兩支候選整合再次成功。新增診斷19項成功／1項失敗、10負控制命中：真實原始檔普通與沙盒各三輪全部序列化欄位不變；missing／active／registry遷移保持；原遷移分支前後追蹤、實際來源故障與逃生閥首紅、金額與政策資料破壞／恢復、完整同種子模型與14日load/no-load續跑均成功。唯一失敗是日夜四向的八張完整PNG比較。常態 [39038520939](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39038520939) 三個工作全成功，財務53項／10負控制。

畫布仍紅，所以不刪分支專屬workflow，不把PR標可合。下一筆只增加RGBA像素數／最大通道差／差異bbox及完整模型差異診斷，將BASE／HEAD、載入前後模型、載入前後畫布分開報結果；既有完整相等斷言保留。另加平行的frames-only工作，以兩次原生開機先定位差異，不等其餘案例結束；不改產品或放寬畫布判準。

a0056133 的 [frames-only診斷39039271651／job117415255809](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039271651) 已直接量得：HEAD自身兩次讀檔，日夜四向共16張完整畫布全部0像素差，所有存檔欄位0差異；BASE／HEAD模型只差本項預期的pol，畫布每張419–987像素不同，顏色與位置對應施工機具。來源的施工進度為age+simAcc/DAYLEN，load並不重設、不序列化simAcc，兩次不同瀏覽器開機保留各自小數日。

接下來的因果驗證只在CI暫時綁定原本的clock讀值及advance函式；其餘來源逐位元不變。以真實advance跨一個模擬日界，然後原生載入同一完整參考，建立相同小數日與visT輸入；施工、機具與所有畫布層照常繪製，仍要求完整PNG／RGBA零差異。另用真實advance再推半日，要求同一全畫布判準首紅，而所有保存欄位仍相同；再跨原生日界恢復，要求全畫布GREEN。這項實際因果驗證尚未跑，不先宣稱小數時鐘已證實是唯一原因，不修改遊戲或改容忍值。

## 最終受測實作 dc8627fc：全部成功

- [分支專屬39039742391](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742391) 為 completed／success，四工作全成功；完整原生23項／11個負控制，失敗0。原兩支native／normal-pairs也各自先紅pol，再用同一產品修補於原判準下轉綠。
- [push常態39039742498](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742498) 與 [PR常態39039746667](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039746667) 均 completed／success：各有smoke三次、fp、財務53項／10負控制。相對base fp零變動，無風格下降；產品及基線來源邊界保持。
- 真實原始main參考檔在普通／sandbox各三次native load→save，所有鍵值與陣列順序等於原輸入，非作用中槽未改；missing／active／existing-registry遷移與獨立BASE相同。非預設舊政策仍grandfathered／100%，舊註冊資料保持。
- 同種子十筆實付／undo／redo／ref拆除的完整模型，只出現事先定義的原生載入pol修正；其餘欄位相同。從同一原檔的0／1次額外載入比較，1／7／14日全部序列化欄位相同。
- 原生時鐘因果驗證成功：日夜四向BASE／HEAD八張、HEAD兩次載入16張完整畫布皆0像素差，所有保存欄位0差。真advance半日使每張差10272–10921像素，被同一完整PNG守衛首紅；跨原生日界恢復後八張全0差。施工層照常繪製，沒有用施工或政策逃生閥作正向驗收，也沒有放寬容忍值。證明先前最後的跨Chrome畫布紅燈是小數時鐘輸入未同步。
- 11負控制包括獨立BASE的六輪pol首紅、來源恢復舊分類、診斷逃生閥恢復舊分類、實際少一元、真實政策落盤變更，以及實際半日時鐘偏移；恢復後GREEN。

完整原生報告與原PNG：[附件12104295044](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742391/artifacts/12104295044)，19566260 bytes，ZIP SHA256 `715e943eff4daf3845acc9db17261587c1f958823efe8c0ca3d018b3d10ab040`。報告JSON SHA256 `ecd5dfff46ace7eabdfe73fb1c0fe405b45b67e510e03c8a4df81716094e2a1c`。獨立frames-only [附件12103786433](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742391/artifacts/12103786433) 亦成功，5項／1負控制；原normal-pairs [12103188016](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742391/artifacts/12103188016)、原native [12102549981](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39039742391/artifacts/12102549981) 保留所有斷言前原始資料與原日誌。

### 收工自檢

- [x] 卡面先推，fp家族固定「無」；實作與美術分開
- [x] 同種子完整模型、真實舊檔全部欄位來回、日結算
- [x] fp／style／超街區零變動，原守衛不改判準
- [x] 每項新增守衛有真實首紅與恢復綠；10個既有財務負控制保持
- [x] smoke三次及原生23項／11負控制的實際CI全綠
- [x] 原生日夜四向完整畫布相等；施工層及原時鐘偏移負控制均有驗證
- [x] 純讀檔修補沒有新增美術；四季／遠景／邊緣美術改畫不適用
- [x] 未把已保存的早期失敗紀錄改成成功；原新局暫態小數案例沒有宣稱已修

此後只可補文件及依庫規以獨立workflow-only提交移除本分支workflow。清理後產品、probe、fixture必須逐位元等於dc8627fc；最後head常態CI仍須全綠。PR35依原生讀檔審核邊界維持草稿，沒有合併或部署，第二波計數仍未增加。

## T753／v14.46 合併準備

本次將已完成的 GPT-028 獨立讀檔修補配為 T753／v14.46、r200。版本準備只改 GAME_VER、GAME_ANCHOR、開始畫面的三個標示；將這三處精確還原成14.45／T752後，完整 index.html 逐位元等於全原生23項／11負控制受測版本 dc8627fc。smoke自檢、probe、fixture、fp/style及既有守衛逐位元保持；已刪分支workflow仍不存在。沒有以新版本文字改動任何玩法、價格、RNG或畫布判準。

原生23／11及完整畫布的實際執行版本為14.45；不把歷史run稱為14.46新跑。14.46最後head須重新通過常態smoke三次、fp，以及原財務53／10的精確宣告版本遷移／完整欄位回歸。原14.43／14.44與本次原始14.45參考檔均保持，不從待測輸出產生期望。

此修補不計建築波次，方向完成數維持1／20。第二波PR36已有十款分支實作，待本次main／Pages成功後再同步真實main並跑原完整驗收；不把同步或候選驗收當作第二波已發布。本次不合併第二波美術。
