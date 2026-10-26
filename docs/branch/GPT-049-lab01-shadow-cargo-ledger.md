# GPT-049：LAB-01 暫態影子貨物身份、事件與守恆

> 狀態：動手前首卡；本commit只新增此卡，功能尚未施工。先推卡面並確認精確commit後才實作。產品與所有功能驗收仍是未跑，不把首卡或Draft當發布。

## 1. 首commit要凍結的範圍

- 唯一repo：`lijiabao1998/GlimmerTown-lab`。
- 最新查核main：`020e3c096974be64680142297423de9a51d4bb8b`（PR66只登記新方向，產品未變）；產品`533d83862015dbefeb855f4ce07e68f13d27d0b1`／T774／v14.67；index blob `f049d7e5724e7567cc73e1af0d8fcda0a4a3b64b`，SHA256 `debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`。
- 開卡前main最高GPT-048、T774，現存分支及開放PR未見049；本分支`gpt/lab01-shadow-cargo-049`。**不預占T775、不改版本／開始字／AUTORUN-LOG。**
- 首commit只能新增本卡；原生程式及新測試均在首卡已推並核實後才動手。
- 凍結fp家族：**無**。既有全部精靈、block、環境、style及200座建築須不變。不提交新fp/style，不把任何新視覺族偷偷併入。
- 本卡是自主獲准的隔離研發與測試，交付`[等業主][GPT-049] LAB-01 shadow cargo identity / events / conservation` **Draft PR**。不合併、不部署、不將研究數值寫回正式經濟。

## 2. 業主依據（2026-10-26，逐字）

> 請依照既有倉庫規則，盡量自主完成合法範圍內的盤點、設計、隔離研發、測試及 Draft PR。涉及業主審批的玩法、數值、存檔與發布事項，保留正式審批節點，不得自行擴大權限。

> 本次第一階段以獨立的影子物流帳研究為主。

> 未經另行批准，不得將影子交易的數值灌回正式經濟。

> 研究用初始貨單不能冒稱正式農場真的已生產該貨物，也不能把它記入城市財政。

> 不能重新生成相同來源批次而宣稱是原運輸繼續。

> 效能優化暫緩，美術大規模擴充暫緩，優先完成功能閉環。

完整來源：業主工程指令`Sentinel_0cbc3e652b4c8191b32a029594f02dcc`，LAB-00已完成唯讀原碼盤點。`food`原生為日流量，無單站food inventory；k169只增全城係數；k166不是native rail station。不得把研究manifest說成正式產量或實載運輸。

## 3. 唯一成果與非目標

**成果**：玩家的原生城市保持不變，可明確開啟一次暫態研究session，從有限、密封且明示來源的研究初始manifest發出一批food，經合法的研究保管權交接，查看唯一身份、事件順序、當前owner/location及守恆結果；明確結束研究／關閉功能／切城／讀檔即不再可用。這不是貨車／鐵路配送，不是正式城市供貨。

只接納`research-manifest`或`qa-fixture`；`production-receipt`在本卡一律返回unsupported，因原生沒有能驗真的逐產地receipt。允許讀當日T482 food**城市級已四捨五入觀測值**，但標`eligibleForMint:false`、不得因此建立貨物。

非目標：真倉容／背壓（LAB02）、道路物流（03）、貨站接線（04）、列車（05）、占軌（06）、完整交付（07）、正式或影子OD（08–10）、經濟與save整合（12）。不添新建築ID、道路、鐵軌、人口、人力、服務覆蓋、金錢、正式商品或正式客流。

## 4. 原碼allowlist（以bfe11911 index行號定位；不可任意擴大）

| 檔／區域 | 允許的唯一改動 |
|---|---|
| `index.html`，`/* GPT-048 RUNTIME END */`後，原119464、既有`Object.assign(window.GV,{art574:…})`前 | 新增一個完整標記`GPT-049 LAB01 BEGIN/END`的隔離區：私有session/reducer、narrow read adapter、lazy只讀面板、lifecycle wrappers、新selftest、`GV.shadowCargo049`狹窄API。不得改舊區塊字節。 |
| 同一新增區內，捕捉最終`load/newWorld`綁定（既有最後wrapper原119395–96） | 包裝只做shadow失效，再以原this/arguments呼叫原函式**一次**；原回傳／拋錯不變。原load/newWorld本體零改動。 |
| `smoke.js`，原51起selftests陣列 | 只追加一條新`shadowCargo049`selftest；另允許在既有Node checks之後、withGame之前追加一次`shadow-cargo049.test.js`呼叫。不改舊斷言／相對順序／timeout／allow-failure。 |
| 新`shadow-cargo049.test.js`（若需要） | 對同一標記區的契約／負控制；不複製第二套model。附加到CI的方式只能加新檢查，不改任何舊守衛。 |
| `docs/branch/GPT-049-lab01-shadow-cargo-ledger.md`及同前綴證據文件 | 首卡、源碼比較、失敗歷史、驗收收據、精確head SHA、原圖／未跑清單；不得改鬆首卡。 |

禁止：`save`、存檔schema/localStorage/sessionStorage/IndexedDB、`tick`、`advance`、建造/拆除/Undo/Redo本體、T482/T490、T488/489/491/502、正式traffic/ridership/labor/grace、原RNG、renderer／Canvas/cache/atlas、200座art、所有rules/CI/guard／性能閾值、版本／T／日誌。禁止掛原生timer或每frame polling；不新增toolbar入口或全站UI改造。

若需要超出allowlist：停止此候選並明確說明，不能在首卡後偷擴fp家族或改鬆驗收。

## 5. Session／來源與容量邊界

- 預設沒有session、manifest、貨物、面板、timer；逃生閥`window.__noShadowCargo049`為true時，**下一次shadow API/read/render入口**先清除既有shadow狀態並拒絕start/command；不宣稱任意global賦值會同步被偵測。另提供明確disable/end API即時失效與清理，不setter劫持、不polling。
- 明確start建立document-local session token與有限manifest，初量固定。token不得依賴原生R()或Math.random()；document識別只用與原城市RNG隔離的來源或測試注入，不持久化。重載後沒有auto-start／re-ingest／resume；同個顯示名稱不代表同一session。
- manifest封存後不能增量或改商品。發batch會減unissued；來源耗盡必須拒絕，不能用API傳入qty任意mint。
- source/destination在本卡為明示`research-custodian`身份，不冒稱某native farm/shop已生產／收貨；native facility binding留LAB02/03。每批仍保留source/destination欄及來源類型。
- 不拆批、不併批、不按時間自動交貨。研究記憶體上限只能拒絕新admission，不丟棄已有未完成批次或event；這不是倉庫／列車的正式容量。
- panel固定提示：**研究貨單；不影響正式經濟；未保存，重載即遺失。** 顯示session/manifest/commodity/初量/unissued、每batch owner/location/state、事件結果和conservation。
- 面板只在明確open時lazy建立，只讀並手動refresh；不改camera/選取/toolbar，面板的退出按鈕明確標「結束研究（未保存）」而非含糊的關閉；動作結束session、清理自己的DOM/listener並留下只含總量/理由的終止摘要，不保留可續用ledger。未完成量在摘要標為研究工作階段取消，不假稱完成交付。面板未打開時不得有遮罩或輸入捕捉。

## 6. Reducer契約與事件身份

每批具備`batchId, commodityId, qty, source, destination, creationEvent, owner, location, state, eventSeq, terminalStatus, provenance`；qty為正safe integer，拒NaN/Infinity/小數/負數/不安全整數。

每事件具備`eventId, sessionId, batchId, type, expectedRevision, payload`；對輸入先驗證、拷貝，再原子提交；不保留外部可變引用。

- 同eventId＋同canonical完整語意命令（sessionId/batchId/type/expectedRevision/payload全部納入）：返回已記錄結果，不再搬移、不推序號。
- 同eventId＋任一不同語意欄（含type、batchId或revision，不只payload）：conflict，不影響原帳。
- 錯owner/location、重複batch、未知destination、過期revision/session、非法態轉移：原子拒絕；eventSeq/balance/current owner均不變。
- 只有一個owner/location；合法handoff是一筆完整舊owner交出／新owner接收，不會同時兩份。
- 未交付貨物不能消失；freeze/failed必保留原qty與位置／理由，或明確記terminal處置。terminal禁止再領取或復活。
- 最小LAB01操作是CREATE、明示研究HANDOFF、FREEZE及明示研究完成；不呈現LOADING/IN_TRANSIT動畫，因本卡沒有實際運輸。預留完整狀態名稱不等於已有運輸。

守恆：`sealed manifest total = unissued source + live batch quantities + terminal/delivered quantities`，每個batch只落一項。完成是研究保管流程終態，不是T482消費或城市市場入帳。

## 7. 原生唯讀適配與生命周期

原生reader只複製`day, seed, N, version`與直接讀取`economy482.ready/day/commodities.food`；附`sourceSha, ready, stale, granularity:'city-rounded-daily-flow', eligibleForMint:false`。沒當日結算就返回unavailable/stale，不能tick、ensure或強迫原生重算。

禁止呼叫`railOpsSnapshot463`、`transitOpsSnapshot501`、`stationEvidence008`及可能ensure的水／active accessors；LAB00證明這些能觸發native OD/labor/grace寫入。也不呼叫`save()`取snapshot，因save會寫storage。

必在原生`load`或`newWorld`**入口前**invalidateshadow，而非成功後才清：原load在105921–23已能改N/RNG/tiles，106095才catch返回false。失敗／部分load同樣不能保留上一城貨物。wrapper不可改原error/return行為。

每個API另檢查捕捉的`tiles`物件身份；nativegen/load會換array（88179、105923），不一致則先失效再拒絕。`pagehide` listener只在session start註冊，session end時移除；事件發生結束session，BFCache返回不宣稱原運輸連續。常駐的是兩個必要lifecycle wrapper，不將它們誤寫為session listener殘留。`setSlot`不是切城，不掛該函式；真正load/newWorld負責生命周期。無root attachments故本卡不改Undo/Redo；原生建拆仍必須回歸。

## 8. 預先驗收條件（不改鬆）

| 組 | 必過的正向與負控制 | 證據要求 |
|---|---|---|
| L01 身份／來源 | 已知有限manifest→batch→一次handoff；空/耗盡source、錯commodity、非法qty、缺destination、production-receipt拒絕 | 每一步完整帳／守恆；拒絕前後ledger逐byte相等 |
| L02 事件 | 重複event無重放；同ID更改type/batch/revision/payload各自拒絕；重複batch/stale revision/錯owner/location拒絕 | eventSeq、owner及qty精確比較，非只看ok:true |
| L03 終態／原子性 | freeze保貨；terminal不再領取／復活；故意半途非法轉移不能留下半筆帳 | 所有live/terminal/unissued總和恆等 |
| L04 封裝 | 改傳入manifest/payload、改回傳snapshot不改內部 | 深拷貝／無可變外洩證據 |
| L05 lifecycle | 成功load、失敗/部分load、newWorld、reload、pagehide清楚失效；過期命令拒絕；無自動重新入貨 | 原生wrapper只delegate一次，回傳相等；UI不假續跑；切城後沒有舊貨 |
| L06 原生零寫入 | shadow-only操作在Default-off以及**真的enabled session/API/panel**時都比對native tiles/economy/fin/pop/jobs/transport/labor/grace/dirty flags/storage；load/newWorld則與同初態的未包裝native操作結果比較，不要求城市不變 | 同一接受sim-time及同步操作前後對照；不靠只關閥證明enabled安全；不為比較而save寫storage |
| L07 RNG | 新區不使用R()/Math.random，不改原RNG；同seed原生對照不變 | CI專用instrumentation或配對，不消耗live RNG後假裝還原 |
| L08 閥與面板 | start/end/repeatedopen、面板「結束研究」與disable、關閥下次API/read/render失效、空資料、不ready/stale；結束無面板DOM／session-owned listener／timer殘留（必要常駐lifecycle wrapper另列） | 原生game桌面及mobile viewport日夜圖，close/scroll/select/zoom/toolbar不被遮擋；沒有測真硬體/Safari如實未測 |
| L09 守衛有效 | 在測試副本故意破壞冪等／owner／守恆，各新guard首紅落正確目標 | 原始失敗記錄，不把guard自己先改鬆 |
| L10 原CI／回歸 | smoke×3、fp/style/block/env零變、既有守衛/性能門檻不變、舊檔正常往返／建拆UndoRedo | 精確head CI連結、完整原始結果；不重跑smoke/fp本身失敗洗綠 |

GPT不得本機跑遊戲、smoke、fp或pixel probes；依repo交CI。新負控制應與標準CI串接，只新增而不修改既有判準。若完整native/圖片／同seed/save證據需要額外受限workflow或受權執行環境，先明列未跑及具體缺口，不冒稱默認CI涵蓋所有項目，不私改CI。

## 9. 施工紀錄（預留，不填假成果）

- 首卡commit：本commit；精確SHA以GitHub本卡第一個commit為準，後續實作前另核。
- 實作commit／Draft PR：未建立。
- 正向／負控／守恆／native零寫入／保存與舊城：未跑。
- CI：未跑；產品當前smoke40169741555／Pages40170096579是基準歷史，不是本卡驗收。
- 原圖與真Chrome操作：未跑。
- 沒做成的事：尚未施工；本卡不提供倉庫容量、貨車、貨列車、真配送或持久保存。方向PR66初始Ready/merge審批拒絕保留；重新逐字讀業主明確沿用方向檔例外與AGENTS §3/7後，單次普通Ready成功，再獨立fresh check與expected-head squash合併為020e3c096974be64680142297423de9a51d4bb8b。無admin/force/直推/替代路徑。此狹窄文件例外不授權本功能合併。
- 發布：沒有；新玩法、容量、規則、正式經濟、存檔及release依repo等待業主，不以CI綠替代批准。

## 10. 迭代不改壞標準§8

- [ ] 首卡先推並核實後才實作；本commit是凍結卡面，後續核對連結記入施工紀錄。
- [ ] 同seed與舊存檔往返實證（未跑，不寫不適用）。
- [ ] fp只有宣告家族＝無，閥關整幀相同（未跑）。
- [ ] 面板必要日夜／mobile viewport及操作（未跑；沒有新art，既有art零變另驗）。
- [ ] 每新guard首紅正確（未跑）。
- [ ] smoke×3真CI全綠（未跑）。
- [x] 沒有把未跑／設計／Draft／shadow寫成已通過／已發布／正式經濟。

## 11. 2026-10-26 隔離候選施工紀錄（不改動首卡驗收）

- 首卡已先推並核實：`ba75cd936304c5a0f0e03965db22309e224b92df`；Draft PR67，`[等業主]`，尚未Ready／合併／發布。
- 候選新增一段362行LAB01區塊、`shadow-cargo049.test.js`與smoke兩個附加入口。移除整段新增區後，原index SHA256仍逐byte等於`debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`。沒有改原生函式本體、save、T482/T490、RNG、art、CI或性能閾值。
- Runtime只做研究保管權帳，沒有物理運輸。native observation標示`verified-native-baseline-not-candidate-head`，`eligibleForMint:false`；不拿基準SHA冒充候選驗收SHA。所有production-receipt建立請求拒絕。
- 內部靜態review修正：輸入4096-node上限與最大帳快照上限分開，避免合法滿帳無法讀；完整command簽名先查重複事件；day截圖相位改為55／night90；newWorld補this/args/throw契約；持久化及ensure traps計數；舊檔另使用repo已存`fixtures/fiscal-load026/legacy.json`（v14.43），不把剛產生的檔冒稱歷史檔。
- 附加CI測試包括真factory契約、三種源碼副本負控制、完整wrapper代理、enabled native state同步前後比較、計數RNG／storage／ensure traps、session取消／關閥／pagehide／reload、native建拆UndoRedo、當前及既存v14.43讀存對照、真Chrome桌面及mobile viewport日夜圖。這是**待執行測試內容，不是通過收據**。
- 原圖預期由既有smoke artifact的`shots/smoke-shadow049-*.png`收集，既有workflow完全不改；精確候選SHA、CI結果及任何首次失敗後續補列。沒有本機跑game／smoke／fp／probe。
- 本機git push因無HTTPS認證失敗，沒有提取憑證；後續分支fetch遇shared shallow parent缺物件。改用已連接Primary的正常blob/tree/commit/expected-ref操作，整個index單一blob返回`de9c5e1331295fdc8a9127ffff2c45c44b33bd5f`與本機Git物件hash一致；不force、不改main、不拆錯Git blob。
- 沒做成／未驗：目前CI及圖片尚未取得；真硬體觸控／Safari未測。無真倉容、背壓、道路配送、貨列車、旅客OD、商店補貨或持久保存。容量／正式玩法數值／存檔／發布仍待業主。
