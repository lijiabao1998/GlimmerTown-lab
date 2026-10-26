# GPT-050｜LAB-02 Warehouse Capacity & Backpressure（凍結首卡）

日期：2026-10-26；狀態：隔離研發，交付 [等業主] Draft，不 Ready／合併／部署。

## 1. 開工事實與授權

- 唯一倉庫：lijiabao1998/GlimmerTown-lab。main=020e3c096974be64680142297423de9a51d4bb8b；正式產品533d83862015dbefeb855f4ce07e68f13d27d0b1，T774／v14.67。
- 最新正式完成 smoke 40169741555、Pages 40170096579 皆 success。方向運行僅物流／鐵路隔離研究，非舊20波續建。
- 開工查92條分支、main完整tree及全部開放PR：main最高GPT-048，PR67已用GPT-049，未見GPT-050；本卡使用GPT-050，不占T775。
- PR67 gpt/lab01-shadow-cargo-049，head ff4a767a10502378b8e1bb387d2a5ed3b608ecbb，Draft未合併。不得改此PR／分支。
- 業主2026-10-26 06:40（完整工程指令已讀）原話：
  > 我批准繼續下一階段的隔離研究、施工、測試及 Draft PR。
  > PR67 尚未得到正式玩法合併批准，繼續保持 Draft。
  > 若不允許，LAB-02 先交付獨立容量核心及與 LAB-01 精確 head 的隔離整合驗收，待上游獲准後再作正式整合。
  > 我的最終決定：LAB-02 直接進行合法的隔離研發，正式發布仍守原有批准程序。
- 讀AGENTS、CLAUDE、AUTORUN、DECISIONS、不改壞標準與當前方向。AGENTS §2/§7要求最新main開分支、PR到main，沒有stacked例外。採獨立核心＋精確上游QA，不把未批准LAB01混進正式index。
- 分支gpt/lab02-warehouse-capacity-050從上述main開始，首commit只推本卡。完成Draft後與PR67共兩張待審，停止，不進LAB03。

## 2. 先量與依賴判定

LAB01的CREATE／唯一ID／有限manifest／事件／守恆已驗候選，原始來源釘死ff4a head。原reducer只允許SOURCE_READY→固定destination的單次HANDOFF；HELD不能再出庫，conservation只認source/destination owner。直接包UI或另存owner會造假；不採用。

本卡研究核心是**明示版本化的LAB01 pure reducer衍生擴充**，不是宣稱原049 API原本能轉運。保留原命令相容模式／原始來源與差異證據；配置warehouse的研究session採同一私有ledger，新增中間保管權與WH事件。沒有第二套實際owner／qty／used真相。

正常產品index保持逐byte等於main。CI-only disposable QA目錄把main原生index、精確原049 block、050研究code組合在既有native IIFE中；不把合成物當正式main／發布物。既有harness原樣複製，Chrome slot3、port8199；不改守門器，不本機跑遊戲／Chrome／smoke／fp／probe。

## 3. 本卡目標與固定序列

純研究warehouse，**不綁k169**，不碰building lifecycle／道路適配。本輪沒有貨車、火車、真實道路交付。

manifest food20；A7、B8、unissued5；warehouse research-warehouse-A容量10（研究參數，非正式平衡）：

| 明確操作 | 期待實際ledger | used/free | waiting |
|---|---|---|---|
| 建立研究A/B | A/B保留source owner、source location | 0/10 | 無 |
| A入庫 | 同一A7原子轉warehouse | 7/3 | 無 |
| B申請 | B8 owner/location/qty不變 | 7/3 | B8，空間不足 |
| A出庫 | 同一A7原子轉原manifest合法destination，仍在守恆帳 | 0/10 | B8 |
| 手動重驗隊首 | 同一B8完整入庫，不split、不mint | 8/2 | 無 |
| 結束研究 | session取消，清ledger／queue／panel，不冒稱送達 | 不存在 | 清除 |

每步獨立計算 total=unissued+active+合法terminal；queue不另算貨，used直接sum倉庫實際保管batch qty，包括FROZEN保貨。

## 4. 凍結修改範圍

**fp家族清單：無。** 首commit後不擴增。

- 新 `shadow-warehouse050.js`：獨立研究pure factory＋lazy panel/runtime，未接入正式index；明確源自049並保留相容模式。
- 新 `shadow-warehouse050.test.js`：同一實際研究core測試、獨立oracle、真source mutants、CI-only原生Chrome整合及精確PNG。
- `smoke.js`：僅在既有Node checks之後、原withGame之前追加050自檢腳本呼叫；既有斷言、順序、timeout、門檻不改。
- 新 `docs/branch/GPT-050-qa/`：精確ff4a的049 runtime block、049 test原文、SHA/來源manifest；只供隔離QA。不得包含玩家存檔或憑空production receipt。
- 本卡與同前綴證據文件。可讀既有harness、fixtures、原index供disposable QA組合，但repo原檔不改。

**protected：** index.html、049分支、save/schema、T482/T490/T488/T489/T491/T502、正式money/商品/價格/pop/jobs/traffic/labor/grace、RNG、tick/advance、renderer/Canvas/cache/atlas、200座建築、fp/style基線、CI workflow、harness/gallery、所有既有守衛判準、AGENTS/方向/DECISIONS/版本/T/日誌。新增研究檔不是拆index或效能重構。

## 5. 原子事件／容量契約

- input嚴格plain-data copy，拒getter／非有限數／未知字段／超界；輸出copy，私有ledger不外洩。
- 無warehouse config時，保留049既有命令、結果、拒絕與守恆契約。配置時manifest仍密封，warehouse是已登記的第三保管者且不是source／批次最終destination。
- 原CREATE不准直接mint進warehouse，原HANDOFF不准繞過warehouse admission。普通source→destination的原合同仍可用。
- 入庫SOURCE_READY→WAREHOUSED，owner/location改為warehouse；出庫WAREHOUSED→HELD，交原destination；batchId/qty/source/destination不變。HELD之後原COMPLETE仍有意義。
- used僅由同ledger真batch owner/location推導；沒有mutable used counter。容量不為負、不超上限。
- 同eventId＋完整canonical語義（session、batch、type、revision、payload）精確重放；不同語義衝突。過期revision／錯owner/location／錯session／非法狀態全部原子拒絕。
- 所有queue、custody、event歷史和revision在同一next-state檢查後commit；無半筆交易。等待接受可記事件／revision但不改cargo custody。
- 第一輪不做reservation，pendingOutbound明確為空；出庫request和success在一筆原子事件完成。
- warehouse失效不可再接／放貨；倉內貨凍結並仍占容量，等待請求取消，不假送達。貨物FREEZE／終態不能復活。

## 6. 有界FIFO

- 研究queue上限預設8，配置只允許更低正整數；batch32／events128沿用049上界。不調高任何既有上限。
- 同batch不可重複排隊；單batch>capacity立即拒絕，不假等待。
- 有隊列時新入庫不能繞過隊首；只能手動重驗head，沒有timer／rAF polling／逐frame掃描。
- 重試核session、revision、request、batch身份、owner/location/state；不以舊判斷直接入庫。
- 滿queue拒絕新請求，已接受request不丟失。隊首暫時放不下如實阻塞後項。
- 明確取消或貨物失效的request不可再retry；同session取消批次不自動重新排隊／復活。
- A出庫不隱式處理B，保留可驗的0/10狀態；下一明確重試才B8入庫。

## 7. 暫態runtime與UI

- default-off無session、DOM或timer；只有隔離QA明確start。逃生閥window.__noShadowWarehouse050在每個API/read/render入口先取消；明確disable/end立即取消。不setter劫持／polling。
- document-local session身份用獨立WebCrypto，不用原RNG/Math.random，不持久化。重載不autostart、不reingest。
- 包裝最終native load/newWorld，只在入口先取消050再原this/args呼叫一次，保留return/throw；失敗／部分load也取消。另查tiles array身份防切城；不綁root，故不冒稱解決倉庫Undo身份問題。
- pagehide取消；end清queue/ledger/session-owned DOM/listener；僅保留總量與取消原因摘要，不能續用舊批次。
- 可讀容量條、used/free、stored IDs、source-owner IDs、waiting原因、FIFO順序、operational、守恆；事件JSON放details，手機不占滿。
- 真按鈕觸發A入庫、B申請、A出庫、重試隊首、取消等待、結束研究；無固定數字假演示。
- 固定警示：「研究貨單；不影響正式經濟；未保存，重載即遺失。」
- UI只局部研究面板，不改Town toolbar/globalfont/color；結束後面板移除，原生zoom/selection/toolbar可用。

## 8. 驗收與真故障負控制（不得事後放寬）

| 守衛組 | 正向與拒絕／獨立oracle | 真source mutant首紅 |
|---|---|---|
| W01 lineage/compat | exact049block/test hash；原049全契約＋compat factory同測 | 改實際源碼身份／legacy transition，目標oracle先紅 |
| W02 capacity/used | 空、7/10、剛好10、超額等待、11超限拒；used獨立sum真owner | 去容量check／錯used推導 |
| W03 atomic ownership | 同ID/qty/source；A出庫0、B入庫8；錯owner／location拒絕 | 改owner或漏location或qty；目標custody oracle |
| W04 event/revision | fullsemantic replay/conflict、stale reject，拒絕前後byte相同 | 去replay/conflict/revision gate |
| W05 queue/bounds/FIFO | duplicate、max8、head blocking、無跳隊、oversized不可假等 | 去duplicate/queue bound/FIFO/oversized gate |
| W06 cancellation/invalid | cancel/invalidated/frozen/terminal不可重試或復活；保貨 | 去cancel/operational/state gate |
| W07 conservation/data | 每步獨立sum及unique IDs，unissued5；輸出修改／getter拒絕 | 造貨／改unissued或回傳alias |
| W08 lifecycle | active前置；load/partial/newWorld/pagehide/end/disable/reload清除；delegates精確 | 去取消／失敗load前清理／關閥gate，指向對應新守衛 |
| W09 native isolation | enabled及off同步native/economy/RNG/storage/frame對照，舊存檔來回、建拆UndoRedo | 故意native寫入副本被對照捕捉，不用關閥假證明 |
| W10 UI/browser | 六真狀態、buttons/scroll/details/close；desktop/mobile day/night；nativezoom | 實際UI源碼改壞容量或等待顯示／按鈕／清理，目標UI守衛首紅 |

每個新增具名守衛均記錄至少一個實際受測來源變異、首個失敗斷言及還原後綠；不能只檢查字串。獨立expected oracle不取reducer的used/conservation當唯一答案。全量原smoke3次、fp、既有fiscal/performance門檻不改；CI失敗保留，不重跑賭過。

真Chrome在CI讀組合候選，非只有mock。至少六狀態PNG：初始、A7、Bwait、Aout0、B8、end清除；desktop/mobile均有可讀證據且含day/night。原PNG/hash/精確SHA與未測（真手機/Safari）如實交付。

## 9. 回滾／審批／初始記錄

- 未接正式index，撤掉本分支研究檔及smoke新增入口即可回到main；不改玩家資料。default-off另作即時取消。
- 未完成：尚未施工／跑CI／真Chrome／看圖，沒有通過聲明。
- 功能正式接入、容量數值批准、LAB01/02合併、保存、發布仍[等業主]。本卡沒有Ready/merge/Pages授權。
- 收工按不改壞標準§8逐條補真證據；沒有已跑結果不打勾。卡面首commit的family/allowlist/驗收不改鬆，只追加施工記錄。


## 施工紀錄 C1（候選，尚未執行CI）

- 首卡獨立commit：d6825324502f316bab312552b8750f046ee53335；其後才施工。
- 正式index未改、沒有引用050檔；新增獨立source-derived factory和暫態操作面板。配置warehouse時用單ledger新增WAREHOUSED及WH_*事件；未配置時保留049相容契約。
- 不消費或遷移既有live PR67 session。QA比較同manifest/session命令下初始A/B與精確049 factory結果、貨物、事件逐值相等，再測050擴充；不能把此比較宣稱跨session續運。
- QA分開A精確049、B衍生factory compatibility、C原生main＋精確049參考＋050候選／QA observer。A/B各執行原049 test完整原文（含Chrome），C執行新整合；不將050藏入049區塊來繞原index守衛。B明示只替換pure factory作相容驗證。
- 內部靜態覆核修正：缺第三接收者配置、等待原因隨目前容量更新；public end不接收任意物件，取消摘要失敗不能攔native delegate；空隊列Retry/Cancel仍先查逃生閥；滿倉文字、實際batch qty按鈕、render失敗不改已提交命令結果。
- 新守衛含獨立數量／owner sum、真source mutants及原文還原，UI另有真Chrome來源變異；不接受語法錯誤當負控制成功，不以任意異常包裝冒稱目標首紅。
- 所有新數字是指定研究fixture／有限記憶體上界；原生計算、save、RNG、道路鐵路、美術、性能及原CI門檻未改。
- 目前只有靜態語法與來源字節檢查；遊戲／Chrome／smoke／fp／native回歸尚未跑，下一步由既有分支CI驗證。

## 施工紀錄 C2（修正新增QA控制，保留C1紅燈）

- C1 head 979b1b1cb29769c2f3dd6a79fc9f51119f18d6e0；CI run 40286067184 的 smoke 首次失敗於新 W09 normal-load 控制比較，未重跑賭過。原生 activeMobilityLoad502（index 106312）經 activeMobilityMarkDirty502（106309）每次遞增 amVersion502，故不同 load 次的此累積counter本來不相等。
- 修正僅在這個新 load 控制：完整observer每個其他欄位仍逐值嚴格相等，amVersion502改比無研究／有研究的實際增量且須正數相同；輸出差異欄位與增量。原同步 native/canvas/RNG/storage 零副作用守衛完全不放寬，原有049/native CI檢查不改。
- C1已實跑：26個pure/VM守衛與40個來源變異、W01 lineage變異、7個Chrome UI變異均首紅並還原；A精確049與B相容組合各完整原049含Chrome通過；C已走完24張desktop/mobile日夜六狀態，容量0→7→7→0→8。上述不能代稱整體CI通過。
- 內部唯讀靜態覆核另補強兩處測試：JSON必須hit-test到可見區且真滾輪後offset由0增加（不再把預先定位外層scroll誤當成功）；reload前新建的實際session須demo/open成功且active/panel/token存在，輸出實際token。
- native toolbar不只看存在：研究關閉後真Chrome滑鼠點原生目錄開啟與關閉，保留原生縮放驗證。此commit不改任何warehouse產品候選程式。
