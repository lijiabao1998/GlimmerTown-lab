# GPT-052｜單一暫態研究帳接線（LAB-02 後續；Draft 設計首卡）

> **T777（原 GPT-052／PR #70）**：業主 2026-10-28 對 PR #70 選「合」，同日把「發布時重釘 049／050／052 測試的發布釘值」定為常設規則（`docs/DECISIONS.md` 2026-10-28 兩列）。由 main 寫入者 Claude 照 `AGENTS.md` 第 3 節辦理：T777／r224／v14.70。
> 從下一行「日期：2026-10-27」到「停止與回退」一節，是設計首卡 `690df78` 的原文，用 `git mv` 從 `docs/branch/GPT-052-single-research-ledger.md` 搬過來，每一行都沒改；施工收據在 [`branch/GPT-052-implementation.md`](branch/GPT-052-implementation.md)。文末「T777 發布」以下各節是合併時新加的。

日期：2026-10-27。此首提交僅凍結計畫，產品未施工、測試未跑；不以卡面存在代表已實作。

## 本次精確設計授權
2026-10-27 03:22:20 UTC，業主訊息 Sentinel_ac549f967518819194344213bd20f7e6 直接回覆設計卡/Draft確認「允許」。本次只建立設計首卡、候選分支與Draft PR；不施工產品、不修改正式經濟/存檔/倉容平衡、不合併、不發布。下列接線與驗收是凍結的後續設計條件，不代表本次已獲產品施工或發布批准。先前平台拒絕及中止保留，不繞過。

## 來源、方向與權限
唯一倉庫 lijiabao1998/GlimmerTown-lab；fresh main dde12ada3d72110d6a0bef3132eef86b871472ea，T776/v14.69/r223。main CI40441891872、原自動Pages40442793911成功；公開HTTP200、12043120bytes、SHA256459f580274773bd229f1322474f2db1d42048e31d4a7b66ad40512e1a3bfda67，真URL AX顯示14.69/T776。公站後續完整snapshot/screenshot逾時，不冒稱完整互動已驗。
PR68已收納獨立050核心，但index未接050。開工查無其他open PR；現有三Claude分支最後提交為2026-10-04、09-24、10-14，沒有碰它們。GPT已用號最高051，本卡052，未配發布T號。
對應main方向原話：「本次第一階段以獨立的影子物流帳研究為主。」「未經另行批准，不得將影子交易的數值灌回正式經濟。」
沿既有方向的隔離研發及Draft界線；PR68發布批准只屬PR68，**不是本卡Ready/合併/發布批准**。本卡設計先行；研究接線的實作必須保持下列界線，若需產品倉容/經濟/持久化或更改受保護守衛，停止提出有界裁決。
**首卡凍結 fp 家族：無。**

## 唯一目標
消除049研究入口與050容量候選之間的雙帳風險：一個明確、預設關閉、使用者主動開啟的研究工作階段，用同一份私有貨物/事件/保管權/FIFO帳支援已驗證的容量閉環。只有暫態研究語意，不稱真實原生商品庫存或配送。

## 明確不做
- 不綁k169或任何原生建築的正式庫存；不改容量平衡、價格、money、food流量、人口、工作、客流或RNG。
- 不新增save欄位、不遷移舊研究session、不把重載後重新生成貨物說成恢復運輸；不碰玩家槽位。
- 不做LAB03道路配送、貨車、貨列車、隱形軌、新路權或多商品。
- 不擴200座/20波美術、不改光影/全局密度/引擎/性能架構。
- 不改.github、既有smoke斷言、fp/style、harness/gallery、規則或任何測試/性能門檻。
- 不自動Ready、合併、部署或手動觸發Pages。沒有本機遊戲/harness測試。

## 接線設計限制（施工前凍結）
1. 單一ledger，單一session/token，單一authoritative owner/location/qty/event revision；不得維護049與050兩個可各自造貨的live帳再同步。
2. 已發布049行為是相容契約；保留原始來源及測試作歷史A/B，不能刪斷言或靠改expected使候選過關。050純核心保留可追溯來源，必要的接線適配獨立標示，不聲稱原API本來有容量。
3. 若使用index內研究入口，僅預設關閉的明示研究路徑；逃生閥關閉必須保持原生狀態與完整畫布。預設無研究DOM/事件處理副作用，不能注入第二份049或不相干native程式。
4. 同一研究帳顯示來源、每批owner/location/qty、used、waiting與未發數；capacity10/food20/A7/B8/餘5只作明示QA/研究manifest，不偽造原生生產收據。
5. 主動開啟不應偷重建活躍session；重複open只一面板；關閉/end、disable/kill、load入口含部分失敗、newWorld、pagehide/reload均使舊session失效，舊token不能繼續。
6. 警示必須明示「研究貨單；不影響正式經濟；未保存，重載即遺失。」；拒絕無權威production receipt。不得以城市日流量當可mint庫存。
7. 原生load/newWorld委派保留this/args/return/throw；研究清理失敗不能毒化原生流程。面板輸入不穿透原生地圖；結束後恢復原生zoom/catalog。
8. Pages現配置只發布index及shots；不得偷偷改部署清單解決資源載入。若單檔發布限制需要新的受保護workflow/tools範圍，停在設計並另提請求。

## 硬驗收（不准事後放鬆）
- [ ] 精確來源tuple、目前main、候選head/tree、原049/050核心與歷史fixture hashes；同源對照，不拿PR68綠燈代替新候選。
- [ ] 完整原049歷史A/B、050純核26守衛/原48行為lineageUI負控/31來源負控保留；接線新增真變異first-red後restore，不能把syntaxerror當語意負控。
- [ ] 單帳容量0→7→7→0→8；B滿倉等候保留原owner/location/qty、A出庫後B重驗；守恆20、未發5、無split/mint/重複計數、FIFO越隊、event語義衝突/revision/冪等漏檢。
- [ ] 049無容量相容模式、單帳新入口、舊token拒絕、資料拷貝/壞輸入與上限；多開入口不能出現兩份live ledger。
- [ ] 同源OFF原生state/full canvas相同；啟用研究原生經濟/save/RNG/storage/建拆UndoRedo不變；正常/部分失敗load、舊14.43往返、新世界、重載等生命週期。
- [ ] 原CI完整smoke三輪、fp零新增/修改/移除/觸及家族且無style下降/envLeaves漂移、原fiscal53 checks/10 negatives；不靠rerun賭過。
- [ ] 真CI Chrome桌面/行動視口×日夜×六狀態原PNG、按鈕/JSON捲動/close/native zoom與console檢查；逐檔SHA與人工看圖分開列，真手機/Safari未測即標未測。
- [ ] 獨立只讀來源/安全/差異覆核，§8逐條真實收據、原錯誤保留；僅交Draft與原圖，業主另決發布。

## 停止與回退
任一原守衛失敗先保留原證據；僅在本卡界線修復，不能放寬門檻。需要正式商品/倉容/保存/新交通、受保護workflow修改或更多fp家族，停止，不擴本卡。候選不合main，公開T776不受本卡影響。此首卡無產品差異，因此目前沒有新測試結果、圖片或發布成果。

---

## T777 發布（main 寫入者 Claude，2026-10-28）

### 1. 業主決定（2026-10-28，逐字）

業主 2026-10-28 回答 Claude 的兩個提問，選了下面兩個選項。選項原文照發問的 Claude session 對話紀錄逐字抄錄，沒有翻譯或改寫（`d026da4` 把 PR #70 那一項誤植成英文轉述，`T777` 第三個 commit 改回中文原文）：

- **PR #70：「合」**（2026-10-28 01:03 UTC；提問原文：「Lab PR70（GPT-052 單一暫態研究帳，預設關閉、明示開啟、不影響正式經濟與存檔）：要合進 Lab main 嗎？」）
  > 我照 Lab 規則先逐條核卡面驗收與 CI 原件，沒問題才在最新 main 上 squash、煙霧 3 連綠、fp.js --check、配 T 號與版本、寫日誌、推 main；有問題就停下回報
- **發布重釘：「授權並定為常設規則」**
  > 這次和以後每次發布，main 寫入者都可以重釘這些測試裡的版本字串、index 雜湊與 release 描述。只改釘值，每條斷言與負控制都保留，寫進 T 卡與 DECISIONS。PR70 改完要先跑完整 CI 3 輪綠才合

「這些測試」指 `shadow-cargo049.test.js`、`shadow-warehouse050.test.js`、`single-research052.test.js`，以及它們讀的釘值檔（`single-research052-source.cjs`、`docs/branch/GPT-049-qa/release-source.json`、`docs/branch/GPT-050-qa/release-source.json`、`docs/branch/GPT-052-qa/provenance.json`）。規則檔（`AGENTS.md`、`CLAUDE.md`）沒有改；常設規則以 `docs/DECISIONS.md` 2026-10-28 那一列為準。

### 2. 這次發出去的是什麼

- **`index.html` 多一段 052 區**：放在保留不動的 049 區（`/* GPT-049 LAB01 END */`）後面、`Object.assign(window.GV,{art574:` 前面，內容逐位元等於 `single-research052.js`（463 行，SHA-256 `038dca73a15627ad1b5a027781bd4bce1d151dcd9324965af81c49e23f777615`）。裡面是 050 純核心的逐字副本（`S01 exact050 pure factory provenance` 斷言），全城只有一份 live 研究帳；`GV.shadowCargo049`、`GV.shadowWarehouse050`、`GV.singleResearch052` 指向同一個 API。預設關閉、不加 DOM、不掛事件；只有明示 `demo()` 才開 QA 貨單（food 20、容量 10、A 7、B 8、未發 5），面板寫明「研究貨單；不影響正式經濟；未保存，重載即遺失。」原生經濟、存檔格式、RNG、模擬、美術都沒動；`shadow-warehouse050.js` 這個檔仍沒有被 index 引用。
- **測試**：新增 `single-research052.test.js`、`single-research052-source.cjs`；`smoke.js` 只多一行呼叫。`shadow-cargo049.test.js`、`shadow-warehouse050.test.js` 各加一個有界來源轉接（各 +3／−1 行）：R06 先剝掉釘死的 052 區再照原邏輯驗；050 改用驗過的「剝掉 052 區」投影當輸入，並把舊覆蓋明標為歷史輸入。既有斷言、負控制、門檻都在。受保護檔（`.github/`、`fp.js`、`harness.js`、`gallery.js`、`probe*`、`*.pins.json`、`fp.json`、`style.json`、規則檔）PR #70 一個都沒碰。
- **fp 家族：無。**
- **發布中繼資料**：三處版本字（開始畫面 `startVersion456`、`GAME_VER`、`GAME_ANCHOR`）`v14.69 · T776 → v14.70 · T777`。`index.html` 跟 PR #70 head `9753e49` 只差這 6 個 ASCII 位元組（`cmp -l` 位置 208422、208423、208431、6335292、6335293、6338130，都是數字）；T777 完整 `index.html` 為 12075561 位元組、SHA-256 `6ee59d6834e5227fe919f3ca7b301d6d72ce8a35fadaab128632677dfa9f5cf6`。

### 3. 配號

`origin/main`＝`dde12ad`（T776／v14.69／r223）。`docs/T*.md` 檔名、`AUTORUN-LOG.md`、`git log` 標題三者最大都是 T776，日誌輪次標題最大 r223 ⇒ **T777／r224／v14.70**。2026-10-28 掃過 origin 全部 96 條分支：卡檔名、日誌、提交標題、`GAME_ANCHOR`、`GAME_VER` 都沒有用過 T777、r224、14.70。照 AGENTS 第 3 節，按合併前要再核一次；`main` 若先前進，第 4 節的 `approvedMain` 與 index 雜湊要照常設規則重推，新 head 重跑 CI。

### 4. 發布適配：重釘表（常設規則第一次使用）

**新值怎麼來的**（獨立腳本：只用 `git show` 取原物件、做字串替換與 SHA-256，不載入被測程式碼）：

- T776 index（`dde12ad:index.html`，12043120 位元組）SHA-256 `459f580274773bd229f1322474f2db1d42048e31d4a7b66ad40512e1a3bfda67`；PR #70 index（`9753e49`）＝T776 index＋釘死邊界上唯一一段 052 區，逐位元相等。
- T776 index 只把三處版本字換成 v14.70／T777 ⇒ **T777 原生基準** SHA-256 `6e14078123fc3b90d885d30a4cad0b5886a58f9dd392449930f9496c566fe476`。跟 T776 index 等長，只差 6 個位元組（`cmp -l`：208422 `6→7`、208423 `9→0`、208431 `6→7` 在開始畫面字；6335292 `6→7`、6335293 `9→0` 在 `GAME_VER`；6338130 `6→7` 在 `GAME_ANCHOR`）。
- 同樣三處換在 PR #70 index 上 ⇒ T777 候選 index `6ee59d6834e5227fe919f3ca7b301d6d72ce8a35fadaab128632677dfa9f5cf6`，就是 commit A 的 `index.html`；它剝掉那一段 052 區後，逐位元等於上面的 T777 原生基準。commit A 上測試自己算出來的實際值也是 `6e140781…6fe476`（見下方首紅）。

| # | 檔案:行 | 欄位 | 舊值 | 新值 | 推導／理由 |
|---|---|---|---|---|---|
| 1 | `single-research052-source.cjs`:5 | `baseline` | `459f5802…bfda67` | `6e140781…6fe476` | T777 原生基準（上面推導）。S01 `byte-exact T776 native input` 檢查「候選剝掉 052 區」的雜湊等於它 |
| 2 | `docs/branch/GPT-052-qa/provenance.json` | `baselineIndexSha256` | 同 #1 舊值 | 同 #1 新值 | `single-research052.test.js`:15 斷言它等於 `baseline`。同檔 `baseMain` 仍是 `dde12ad`（PR #70 接上的 main），所以這個欄位現在讀作「`baseMain` 的 index＋T777 三處版本字」 |
| 3 | `shadow-cargo049.test.js`:139、`docs/branch/GPT-049-qa/release-source.json` | `release` | `{version:'14.69', anchor:'T776', round:223, pr:68}` | `{version:'14.70', anchor:'T777', round:224, pr:70}` | 本次發布：`GAME_VER`／`GAME_ANCHOR`、日誌 r224、PR #70。R06 用它在 index 找「目前」的三處版本字，再投影回 14.67／T774 驗歷史原生 |
| 4 | 同上:140 | `approvedMain` | `c0d4a039c48aebaa1f091fc6ce03d60bd0ca7992`（T775 合併，PR68 接上的 main） | `dde12ada3d72110d6a0bef3132eef86b871472ea`（T776 合併，PR70 接上的 main） | 照 T776 先例：批准的 main＝這個 PR 接上、業主同意合進去的那個 main |
| 5 | 同上:141 | `ownerApproval` | `Sentinel_bfd6bc2d37648191824dd44b68f0fef7`（業主 2026-10-26 選 A，只批 PR67／68） | `DECISIONS-2026-10-28-PR70-merge` | 舊值那則訊息不含 PR70（T776 卡：單帳接線另卡、不含其合併），留著不實。2026-10-28 的回答沒有訊息 ID 可抄，新值指向 `docs/DECISIONS.md` 2026-10-28 PR70 那一列 |
| 6 | `shadow-cargo049.test.js`:131 | 註解 | `// T776 owner-approved release projection; …` | `// T777 owner-approved release projection; …` | 只是註解，不影響執行；T776 發布時同一行也跟著改（先例） |
| 7 | `shadow-warehouse050.test.js`:25–31、`docs/branch/GPT-050-qa/release-source.json` | `release`、`approvedMain`、`ownerApproval` | 同 #3–#5 | 同 #3–#5 | 同 #3–#5；W01 `approved release descriptor` 要求檔案與測試內的預期值整個相等 |
| 8 | 同上:32 | `productRole` | `standalone-core-not-imported-by-index` | `exact-pure-factory-copy-inside-default-off-single-research052-not-native-economy; standalone-file-not-imported-by-index` | 舊字在 T777 不再是實情：index 的 052 區帶著 050 純核心逐字副本（`S01 exact050 pure factory provenance`），預設關閉、不是原生經濟（provenance `role`）；`shadow-warehouse050.js` 這個檔在 index 裡 0 處引用。程式只拿它做整個描述的 deepEqual，不解讀內容，所以斷言檢查的東西沒變；負控制 `productRole='integrated'` 仍是真故障（新值不等於它） |
| 9 | 同上:33 | `candidateIndexSha256` | 同 #1 舊值 | 同 #1 新值 | C-native-warehouse 組合的基底是 `projectCandidate052(index)`（W01 `exact QA base bytes`），就是 #1 的值。欄位名是斷言用的鍵，沿用；T777 起它的意思是「候選 index 剝掉 052 區」，不是含 052 的完整 index（`6ee59d68…`） |
| 10 | 同上:52–54 | `releaseStrings050` 每列第一個字串（目前值） | `const GAME_VER='14.69';`、`const GAME_ANCHOR='T776';`、`<span id="startVersion456">v14.69 · T776</span>` | 同字串換成 `14.70`／`T777` | index 的三處版本字。每列第二個字串（歷史 14.67／T774）與第三個（守衛名）沒動 |

**沒有重釘的（與理由）**

- `single-research052.test.js`:47 VM 沙盒裡的 `GAME_VER:'14.69'`：沙盒假值，沒有任何斷言比對（052 只把它放進 `nativeObservation().version`，沒有守衛讀）；049 的沙盒值從 T775 起一直是歷史的 `'14.67'`。不是釘值。
- `docs/branch/GPT-052-qa/baseline-t776.sha256`：記的是 T776 index 的雜湊，仍是事實；沒有任何程式讀它。檔名就叫 t776，改了反而不實。
- 預期首紅訊息與斷言訊息：`S01 byte-exact T776 native input`（052 `outside` 負控制就是等這一句）、`S23_OFF_AB T776 and …`。改了就動到斷言／負控制，不准。
- 日誌字串（不是釘值）：`validatedT776Hash`、`byte-exact T776 baseline plus observer…`、`standalone-core-not-imported-by-product`、`current-native-single049-plus-QA050-not-product`、`nativeProductUnchangedOutsideReleaseMetadata:true`、`productWarehouseIntegrated:false`——記成歷史輸入用語（第 7 節第 2、3 條）。
- `shadow-warehouse050.test.js`:18 註解 `// T776: preserve historical fixtures; …`：說的是 T776 那次加轉接，仍是實情。
- 所有歷史釘值：049 `historical`、050 `published049`／`historical`、14.67／T774 字串、052 區雜湊 `038dca73…`、050 核心雜湊、provenance 的 `baseMain`／`designHead` 與其餘欄位。
- 所有負控制與變異值（14.99、T999、999、`'wrong'`、`'integrated'`、`'unapproved-*'`，以及 S01／R06／W01 的來源變異）：一個都沒動；新值沒有一個等於它們，所以每個負控制仍是真故障。

**機械核對**：重釘 diff 只動 `.js`／`.cjs` 的 16 行與 3 個 JSON 的 15 個鍵。把每一改動行的字串、數字字面值與註解遮掉後，改前改後逐字相同（`literal-only` 檢查；同一支檢查遇到 `assert.equal`→`assert.notEqual` 會報 NON-LITERAL）。負控制清單與斷言訊息所在的行都不在改動行裡；`shadow-warehouse050.test.js` 第 52–54 行是改動行，同一列的第三個字串就是守衛名（`'W01 release GAME_VER'` 等），守衛名字面值逐字沒變，只換了第一個字串（重釘表 #10）。

**commit A（`d026da4`）上的首紅，原文照錄**：三支都在載入時紅在同一句，實際值正是上面推出的 T777 原生基準。

```
AssertionError [ERR_ASSERTION]: S01 byte-exact T776 native input
+ actual - expected

+ '6e14078123fc3b90d885d30a4cad0b5886a58f9dd392449930f9496c566fe476'
- '459f580274773bd229f1322474f2db1d42048e31d4a7b66ad40512e1a3bfda67'
```

- `node single-research052.test.js --pure`：紅在 `single-research052.test.js:7`（`projectCandidate052(html)`），之前沒有任何輸出。
- `node shadow-cargo049.test.js`：先印 7 行 `SHADOW049 PASS`（L01–L04 純帳），再紅在 `shadow-cargo049.test.js:133`。
- `node shadow-warehouse050.test.js`：紅在 `shadow-warehouse050.test.js:13`，之前沒有任何輸出。

再往下一層（只在工作樹暫時把 #1 換成新值、不提交，跑完已還原）：

- 052 `--pure`：`AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:`（`single-research052.test.js:15`，`provenance.baselineIndexSha256` 還是舊值）→ #2。
- 049：`AssertionError [ERR_ASSERTION]: R06 GAME_VER exact unique approved metadata`，`1 !== 2`（`shadow-cargo049.test.js:159`）→ #3–#5。
- 050：`AssertionError [ERR_ASSERTION]: W01 release GAME_VER`，`1 !== 2`（`shadow-warehouse050.test.js:68`）→ #7–#10。

### 5. 原 8 條硬驗收逐條對照（上方原框不改、不補勾）

證據來源：PR #70 head `9753e49` 的 [push run 40467293957](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40467293957)（smoke 3 輪、fp、fiscal-load 全綠）；本機獨立重算（`git show` 取原物件，不用被測程式碼當答案）。

| # | 原驗收（摘要） | 證據 | 狀態 |
|---|---|---|---|
| 1 | 精確來源 tuple、main、候選 head、049／050 核心與歷史雜湊；同源對照 | CI `SINGLE052 SOURCE` 行印出候選 index、052 區、050 核心、049／050 歷史測試雜湊；本機重算：T776 index `459f5802…bfda67`＋唯一一段 052 區（`038dca73…`）逐位元等於 PR index `7e8d7c39…0ab9d2` | PR head 已核；T777 head 待 CI |
| 2 | 049 歷史 A/B、050 純核 26／48／31 保留；新增真變異首紅後還原 | CI 3 輪每輪：049 29 斷言、R06 15 個來源／描述負控制各自還原、L09 3 個變異；050 GREEN 26、EXPECTED_RED 48、RELEASE_EXPECTED_RED 31、歷史 A／B 各 14 斷言；052 GREEN 21、EXPECTED_RED 36 各自 RESTORED | PR head 已核；T777 head 待 CI |
| 3 | 單帳 0→7→7→0→8；守恆 20、未發 5；不拆批、不 mint、不重複、FIFO 不越隊、事件衝突／revision／冪等 | 052 `S04_capacity`、`S21_FIFO`、`S05_compat`、`S20_bounds`；Chrome `W02 required sequence`、`SINGLE052 SEQUENCE` | PR head 已核 |
| 4 | 049 無容量相容、單帳新入口、舊 token 拒絕、拷貝／壞輸入／上限；不會有兩份 live 帳 | `S03_single`、`S05_compat`、`S06_token`、`S15_copy`、`S22_malformed` | PR head 已核 |
| 5 | 同源 OFF 原生狀態／整張畫布相同；啟用不改原生；load／部分失敗／14.43 往返／新世界／重載 | `S23_OFF_AB`、`SINGLE052 NATIVE_ISOLATION`、`LIFECYCLE`（W08／W09 全項）、`RELOAD` | PR head 已核 |
| 6 | 原 CI 完整 smoke 三輪、fp 零變動且風格分不降、fiscal 53／10；不靠重跑 | 上述 push run：smoke 3 輪綠；fp 相對 base 新增 0／變更 0／移除 0、觸及 0 族、沒有家族下降；fiscal 53 檢查／10 負控制／0 失敗；沒有重跑 | PR head 已核；**T777 head 待跑（業主條件：完整 CI 3 輪綠才合）** |
| 7 | 真 CI Chrome 桌面／手機視口×日夜×六狀態原圖、按鈕／JSON 捲動／關閉／原生縮放；逐檔 SHA 與人工看圖分列；真手機／Safari 未測要寫 | 每輪 66 張截圖回執（049 18〔含歷史 A／B 12〕、050 24、052 24），3 輪共 198 張逐檔 SHA-256 與位元組數都等於 CI 附件原圖；人工只看了 3 張（052 桌面日 B-wait、手機夜 A-in、手機日 ended），其餘未逐張看；真手機、Safari **未測** | 部分（沒有真機） |
| 8 | 獨立唯讀覆核、§8 逐條真實收據；業主另決發布 | 前一輪獨立唯讀審查（Claude 編排 session）；業主 2026-10-28「合」 | 已核 |

### 6. 《迭代不改壞標準》第 8 節自檢

- [x] **卡面在動手前推上去了，驗收條件沒有事後改鬆**：設計首卡 `690df78`（2026-10-27 11:24 +0800，只含這張卡）早於施工 `057b193`（15:20）與 `9753e49`（15:21）。本卡原文 `git mv` 過來每一行都沒改；8 條硬驗收原框保留，對照放在第 5 節，沒有回頭補勾。
- [x] **同種子前後對比；舊存檔來回不變**：這張卡不改模擬。CI `9753e49`：`S23_OFF_AB`（同一個種子 491 的頁面上，T776 基準與裝上完整 052 後的關閉狀態，原生狀態與整張畫布逐位相等）、`W09 same-seed native identical`、`W09 native load control equality []`、`W09 partial native outcome equal`、`W09 archived roundtrip equal`（v14.43 舊檔）；049 的 `same-seed native state unchanged by enabled research`、`archived save roundtrip equal to no-session native control`；fiscal-load 53／10 含舊檔遷移。T777 只多改三處版本字，版本字照歷來每次發布寫進存檔的 `gameVer`。新 head 待 CI 重跑。
- [x] **`node fp.js --check` 只有明列的家族變；逃生閥關時整幀相同**：CI `9753e49` fp：相對 base 新增 0／變更 0／移除 0、觸及 0 族；風格分沒有家族下降；`--check` 葉子、超街區、棘輪、`style.json` 全部零變動。逃生閥：`S23_OFF_AB` 整張畫布逐位相同；啟用時 `W09` 同步整張畫布也不變。T777 head 待 CI。
- [x] **美術各狀態都看過**：**不適用**——沒有改美術（fp 0 族；研究面板是 DOM，不畫進遊戲畫布，W09／S23 證明畫布逐位相同），所以冬天、四季、旋轉、遠景、地圖邊緣、疊層沒有另拍。面板本身在 CI 有桌面 1280×900、手機視口 390×844 × 日（visT 55）／夜（90）× 六狀態原圖（見第 5 節第 7 列）。真手機、Safari 沒測。
- [x] **每條新守衛都故意改壞試過，首紅落在目標**：052 純 VM 22 個語意負控制、6 個來源負控制，Chrome `S23_OFF_AB` 1 個、UI 7 個，共 36 個 EXPECTED_RED，各自 RESTORED（CI 3 輪都是 36／36）。T777 重釘沒有新增、刪除或改寫任何守衛與負控制。
- [ ] **`node smoke.js` 連跑 3 次全綠（或 CI 綠，附連結）；沒有靠重跑**：PR #70 head `9753e49`：[push run 40467293957](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40467293957) smoke 3 輪、fp、fiscal-load 全綠；[PR run 40467298485](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40467298485) 照 T759 重用同一棵樹的 push 證據。**T777 新 head 還沒有 CI**：業主條件是「完整 CI 3 輪綠才合」——綠了才合，紅了就停、照錄首紅、回報。
- [x] **卡上沒有任何「通過」是沒跑過的**：上面每一條要嘛附 CI run，要嘛寫明待跑或不適用；本機在 commit B 上跑的結果，連同新 head 的 CI 連結，合併時補記，現在不寫。

### 7. 揭露（不美化）

- `docs/branch/GPT-052-implementation.md` 第 17 行「剝掉 052 區重建 T776 index `459f5802…`」只對 PR head `9753e49` 成立；T777 的候選剝掉 052 區後是 `6e140781…6fe476`（T776 index 只換三處版本字）。施工收據是 GPT 的歷史紀錄，照原樣不改。
- `ownerApproval` 新值 `DECISIONS-2026-10-28-PR70-merge` 是 Claude 定的指標字串，不是業主訊息 ID；`docs/DECISIONS.md` 2026-10-28 PR #70 那一列已寫入同一個字串，可以用 `git grep` 機械回查。
1. **049 對完整候選的 Chrome selftest 換成了 052 的 8 項**：`GV.shadowCargo049` 現在是 052 的別名，所以 049 Chrome 階段的 `enabled native state selftest`，以及 `smoke.js` 4b 的 `shadowCargo049`，跑的是 052 的 8 項 selftest（CI `9753e49`：`shadowCargo049 OK（8 項）`；T776 main 是 20 項）。原 049 的 20 項只在 050 的歷史 A／B 組合裡跑（CI 每輪兩次、各 20 項）。語意覆蓋還在 050 純核 W02–W10 與 052 S02–S22；沒有刪任何斷言。
2. **050 有幾個日誌標籤描述的是歷史輸入，不是發出去的產品**：`ALL_PASS` 行的 `productWarehouseIntegrated:false`、`nativeProductUnchangedOutsideReleaseMetadata:true`，C 組合的 `current-native-single049-plus-QA050-not-product`，`RELEASE_SOURCE` 行的 `standalone-core-not-imported-by-product`。它們只是 `console.log` 字串、不是釘值，照常設規則「只改釘值」不改；T777 起產品其實帶著 052（內含 050 純核心副本），這幾個字要讀成「050 歷史組合」的描述。
3. **斷言訊息與日誌裡的 T776 字樣照舊**：`S01 byte-exact T776 native input`（也是 052 `outside` 負控制預期的首紅）、`S23_OFF_AB T776 and …`，日誌標籤 `validatedT776Hash`、`byte-exact T776 baseline plus observer…`。它們是預期首紅訊息或非釘值，不改；T777 起意思是「T776 的原生程式碼＋T777 的三處版本字」。
4. **PR #70 的標題、內文還寫著「設計卡」與 `[等業主]`**：這一步只在本機加 commit，不動 PR；合併時的 PR 留言要寫清楚。
5. **真手機、Safari 沒測**；CI 只有 Chrome 的手機視口模擬。
6. **052 區裡 `nativeObservation()` 寫死 `baselineSha:'020e3c09…'`、`nativeIndexBlob:'f049d7e…'`**（T774 的歷史原生基準，標 `provenanceRole:'verified-native-baseline-not-candidate-head'`）：在雜湊釘死的 052 區內、不是發布釘值，本次不動。
7. **本機沒有跑 fiscal-load**（`probeFiscalLoad026.cjs`）：它從 index 動態讀版本，由 CI 跑。
8. **`single-research052.test.js` 完整 Chrome 階段把截圖寫進 `shots/` 卻不先建目錄**：smoke 裡由先跑的 049／050 建好；單獨跑要照 049→050→052 的順序或先建 `shots/`。測試流程不在本次可改範圍，只記下。

### 8. 回滾

- 合併前任何一條紅：不合，PR #70 與分支原樣保留，紅的原文照錄。
- 合併後：照 AGENTS 既有紅燈／revert 程序；revert 這次 squash 會把 052 區、重釘與三處版本字一起退回 T776。不強推、不手動觸發 Pages。

### 9. 合併與發布收據（2026-10-28，Claude 補記）

- **合併**：GitHub squash，產生 `63c80c63d4160240773c27bb48458089de365fea`，父提交是 `dde12ad`。合併時把 head 綁定在 `93a65c4`。合併後的 tree `05f6e4d66f8e9fd636eea50b37594453047172d3` 跟 PR head 相同。
- **合併前的新 head CI（93a65c4）**：
  - push run [40639837501](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40639837501)：smoke 三輪全綠（58.4s／56.8s／56.8s），fp 綠，fiscal-load 綠。smoke artifact SHA256 `43a4ac9b87f3d30e25a7ce6ce0d32572f2b00a410ca6366a2a67dff189d9afd8`。
  - PR run [40639842682](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40639842682)：reuse-push、smoke、fp、fiscal-load 都綠。
- **本機，同一棵樹 05f6e4d6**：
  - 煙霧 3 連綠（89.1s／96.8s／97.3s），三輪都沒有 Frame interruption。
  - `fp.js --check` exit 0，耗時 72s。版本 14.70／T777，葉子、超街區指紋、棘輪、style.json 全部零變動。
- **Codex**：程式審查與安全審查，在 93a65c4 都沒有發現。
- **合併後的 main**：
  - smoke run [40643985055](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40643985055) 綠。
  - 自動 Pages run [40644947134](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40644947134) 綠。
- **公開網址**：`https://game.lijiabao.uk/GlimmerTown-lab/` 回 HTTP 200，顯示 `v14.70 · T777`，`GAME_VER='14.70'`，`GAME_ANCHOR='T777'`。整頁 SHA256 `6ee59d6834e5227fe919f3ca7b301d6d72ce8a35fadaab128632677dfa9f5cf6`，跟 63c80c6 的 `index.html` 逐位元組相同。`lijiabao1998.github.io/GlimmerTown-lab/` 會 301 轉到這裡。
- **沒做成的事**：
  - 方向檔 LAB-02 的待辦列與卡住列，照 `docs/GPT-方向.md` 的維護規則，留給 GPT 下一個 PR 更新狀態。
  - 真手機和 Safari 照舊沒測。
  - 正式倉容、經濟與存檔照舊要另外批准。
