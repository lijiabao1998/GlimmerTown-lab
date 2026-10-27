# GPT 方向檔：業主給方向，GPT 照這份一直做下去

> 業主 2026-10-14：「gpt 那邊能自動無限推」「我指一個方向之後它也能無限迭代」。
> 怎麼做、什麼時候停，寫在 `AGENTS.md` 第 7 節；這份檔只放「現在往哪裡做、做到哪裡」。
>
> - **以 `origin/main` 上這一份為準。**
> - **開關**和**方向**兩節只照業主的話改：業主自己改，或在對話裡告訴 GPT／Claude 代寫，原話逐字照抄、寫日期。GPT 改這兩節要開「只改本檔」的 PR，內文逐字引用業主原話（`AGENTS.md` 第 7 節）。Claude／Codex 補跑 GPT 卡的守衛跑出紅時，可以把開關改成「暫停」並寫原因。
> - **待辦**以下由 GPT 維護（Claude／Codex 可以加「修補」項）；狀態更新跟著下一個要合的 PR，或用只改本檔的 PR。
> - 這份檔不能蓋過 `AGENTS.md`、《迭代不改壞標準》、`CLAUDE.md` 的規則（例如美術第一、全局觀感先給業主看圖）。

## 開關

**運行**

### 2026-10-26 當前運行範圍：有終點的物流／鐵路隔離研發

本次「運行」只承接下方2026-10-26業主新方向。原定20波／200座已完成，歷史原話、收據及下方完成清單全部保留；不重做200座、不開第21波、不恢復大型美術擴充，不啟動效能專案。

業主原話（2026-10-26，逐字）：

> 請先完成原生盤點，再依這份規劃進入合法的獨立研發及驗收流程。不要重做已發布的 200 座建築，也不要把尚未獲批的經濟變更提前推進正式產品。

> 效能優化暫緩，美術大規模擴充暫緩，優先完成功能閉環。

本段不撤銷原有治理；新玩法、數值、容量、交通規則、存檔或發布仍保留業主審批，不能沿用歷史美術自動合併例外。

業主 2026-10-16 在對話給出下方方向：每波 10 座、共 20 波，合計 200 座；照 `AGENTS.md` 第 7 節「業主授權連續做」執行。

四種：
- **運行**：照方向一項接一項做下去。
- **暫停**：做完手上這一項就停，不開新卡。
- **停止**：手上的 PR 不合，立刻停。
- **等方向**：還沒有方向，不開新卡。

## 方向

### 2026-10-26 當前新方向：真正的工業物流城市與英式鐵路城鎮

來源：本日完整業主工程指令（LAB-00～LAB-12；先盤點，後合法隔離研發）。下方2026-10-16及2026-10-24英式建築方向與20波完成紀錄保留作歷史，不重新施工。

業主原話（2026-10-26，逐字）：

> 方向二：真正的工業與物流城市

> 方向三：真正的英式鐵路城鎮

> 「效能先不動」。

> 請依照既有倉庫規則，盡量自主完成合法範圍內的盤點、設計、隔離研發、測試及 Draft PR。涉及業主審批的玩法、數值、存檔與發布事項，保留正式審批節點，不得自行擴大權限。

> 本次第一階段以獨立的影子物流帳研究為主。

> 未經另行批准，不得將影子交易的數值灌回正式經濟。

> 第一輪沒有獲准新增持久化欄位前：
> 
> - 影子批次只存在明確的暫態工作階段。
> - 重新載入不得假稱恢復舊運輸。
> - 不能重新生成相同來源批次而宣稱是原運輸繼續。
> - 讀取另一個城市時，不能把上一座城市的貨物帶進新城市。
> - 不能把 QA 測試存檔注入玩家槽位。
> - UI 必須清楚提示未保存的貨運工作狀態。

執行界線：唯一倉庫GlimmerTown-lab；一種原生商品、一批可追蹤貨物、一條完整路線及阻塞恢復先做對。LAB-00已於2026-10-26完成唯讀原生盤點：main bfe11911、正式產品533d838／T774／v14.67；k165–174為城市聚合物流效果、k166不在原生rail stationKs、food為日流量無正式庫存；T721原生接線與T491/T502集合客流可複用。完整工程表已交付，不能把這些靜態結論當新功能已通過。

先做可分離shadow身份／事件／守恆，與研究manifest／QA來源明確區分；read-only production receipt沒有權威就拒絕，不偽造某農場已產出。原生money／商品／人口／工作／客流／RNG／保存字段不寫回。新車／新規則只在隔離候選，正式語意標[等業主]；保留所有原有CI與性能門檻，不拆index、不重寫Canvas/cache/atlas、不開美術第21波。12張卡是規劃代號，實卡從最新main查號，第一commit凍結，最多兩個等業主／卡住PR，不越過未批准產品依賴。只有本方向檔的單檔例外PR可依法自合，功能Draft不得自行合併或部署。


業主原話（2026-10-16，逐字）：

> lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。

原先執行解讀（歷史保留；2026-10-24起的新範圍以下方補充為準）：這是新的 20 波英式建築方向，每波 10 座、共 200 座；上一批 T748 的 15 座留作歷史紀錄，不重複計入。後續美術須有真實英式建築考據，不與現有款式或本方向已完成款式重複；量體高低胖瘦有變化，窗型和屋頂須有結構差異，不准只換色。先做規約已登記的修補，再逐波施工；新圖沿用既有模擬載體，不另創價格、容量、產業鏈。第一波與後續各波的看圖、施工、驗收、合併與停手條件，依 `AGENTS.md` 第 3、7 節（含「業主授權連續做」）執行。



### 2026-10-24 本輪業主補充（逐字；原創方案與20波交付）

> **本次業主明確要求：先完成第 11 波所有阻塞的修復、驗收、合併與發布，然後繼續施工第 12～20 波，直到原定 20 波、200 座英式建築全部完成。不要只修好 CI、補一張卡或完成一波就停工。**

> 建築不可以只換色充數，要有真正不同的量體、屋頂、門窗、立面和建築用途；若使用原創設計，明確標示原創，不冒稱真實古蹟復刻。

> 本次方向已經明確，不必每做完一波就重新向業主請示要不要繼續。依照現有連續迭代授權自主推進，直到第 20 波完成，或遇到既有規則明確要求停手的阻塞。

目前執行解讀：第11波已改為原創英式十款；第12～20波同樣可以採原創設計，須明示原創，不能冒稱真實地標復刻。原先真實建築考據要求保留作歷史，對原創設計不設外部照片傳入門檻。每波仍須十個真正不同的量體／屋頂／門窗／立面／用途，全部原有幾何、像素、財務、供電、存檔、全幀、效能與負控制不變；上一波精確發布核實後才開下一波。原連續施工與適用看圖／停手規則不變，不逐波重問同一製作或發布批准。只計本方向正式發布的20波200座，舊15座不重複計入。

### 第十二波正式發布確認（T766／PR #49；2026-10-24）

第十二波已正式合併發布，累計12／20波、120座。PR #49 squash為 `cfe03d8a54c50ffccb65a8e9cabee9d92c3da8b6`，T766／v14.59／r213。最後純刪臨時workflow的b36e93e8：push40094948187及PR40094952462全部必要CI成功；main40095436706及自動Pages40095825161成功。完整原生40094352758首次27／27成功；發布後只重驗公開站的attempt2／job120878708877成功，實際HTTP200與sandbox Chromium取得的完整HTML均為11,474,998bytes、SHA256 `cb3bc90bcd55c9b5e65d7389d954eaebb22d21c9eba6fff5bfea72292fdba884`，T766／14.59、7負控制、無runtime error，實際公開menu／city PNG已看。原始首紅40081848662保留，僅採同次官方原始fp／style檔，不改財務模擬或畫圖。接續第13波，不重做已發布12波。
bld七軸：palette 1→1；hardEdge 0.9537353338914052→0.9544647253272348；lightDir 0.8176833447566827→0.8132088058705804；shade 1→1；density 1→1；nightRule 0.9894837454988741→0.989761505745322；variants 1→1；total 0.9658→0.9653。依第二項起連續授權披露；不稱全數供電圖人工圖審或實體手機測試。

### 第十三波正式發布確認（T767／PR #51；2026-10-24）

第13波已正式發布，累計13／20波、130／200座。十款原創英式專門職人建築／40向，bld640..679；原生價格、存檔、供電、模擬及歷史模型不變。PR #51 squash為 `2422e951f1c964ae433693a75d2224c91bd247eb`，T767／v14.60／r214。最後a3703372的push40100365245與PR40100368049全綠；最後完整native40099783601首次27／27，獨立純刪workflow後無.github變更。main40101009240及既有自動Pages40101499998成功。發布後經業主允許的唯讀public-site attempt2／job120896715118成功：實際HTTP200與sandbox Chromium完整HTML均11,534,663bytes、SHA256 `d572c96289a67889ec09e2845675717f58d8e84ca78218623fca34f41fde1064`，T767／14.60；公網第11～13波各10款40sprite、最新第13波目錄原圖已實看，16負控、零runtime error、未用本地server。原PNG artifact12563735446。接續第14波，不重做已發布13波。

原始首紅40097825233：40新增bld葉未採baseline，財務52成功／10負控，唯一來源指紋失敗。未改財務模擬；僅採同次常規fp artifact12561701696原檔。首輪完整native40097825319成功；發布head完整native40099783601及最終CI已核。C3/C4各91原始預覽PNG逐byte等於已看C1原圖。

bld七軸完整披露：palette 1→1；hardEdge 0.9544647253272348→0.9552323566926975；lightDir 0.8132088058705804→0.8076673164392463；shade 1→1；density 1→1；nightRule 0.989761505745322→0.9900276945969144；variants 1→1；total0.9653→0.9647。依第二項起連續授權處理，不手改分數或放寬門檻。作者實看3接觸表、10原生近景及部分四向原圖；獨立看圖範圍詳manifest，不冒稱業主批准或全部圖片人工審閱。

### 第十四波正式發布確認（T768／PR #53；2026-10-24）

第14波已正式發布，累計14／20波、140／200座。十款原創英式鎮務與工坊建築／40向，bld680..719；原生價格、存檔、供電、模擬及歷史模型不變。PR #53 squash為 `574cc36d48ab52c79372dd939b31110f3c2b4b9c`，T768／v14.61／r215。最後a87fceaf只修正卡面證據連結；完整PR40106548894在原有證據等待門結束後真正執行smoke3／fp／財務53項10負控，全部成功，沒有重用不同SHA。此前純刪臨時workflow的85561348 push40106192452亦成功；正式main不留臨時workflow。

發布版完整native40105444391首次27／27成功，91預覽PNG與已看C1逐byte相同；113場景110相同，另外三組實看並披露原有施工烘焙時間預算差異，8組守門完整畫布仍嚴格全等。原始首紅40104078292及C2遺漏artSourceSHA256真失敗保留；C3補精確pin，沒有改財務模擬、舊契約或門檻，只採官方artifact12564141656同次原始fp／style。

main40109306236與既有自動Pages40109993003成功。發布後經業主允許只重跑唯讀public-site，attempt2／job120923223936成功，artifact12566617936。真HTTP200與sandbox Chromium完整HTML均11,593,556bytes，SHA256 `2da67e4b29c7ffcab10523b0897637a276adb28de5ce40816ba43ccfd0c329ea`，T768／14.61；第11～14波各10款40sprite、最新第14波公開目錄與menu／city原PNG已實看，19負控制，零runtime error，未用本地server。接續第15波，不重做已發布14波。

bld七軸：palette1→1；hardEdge0.9552323566926975→0.9559013242882268；lightDir0.8076673164392463→0.8074730842305257；shade1→1；density1→1；nightRule0.9900276945969144→0.9902756873333572；variants1→1；total0.9647→0.9648。下降子軸依連續授權披露。作者及獨立57圖review詳卡與manifest，不冒稱全113場景／275供電圖人工逐看、業主圖審或實機手機／Safari／觸控測試。遠景既有2～4px LOD色塊未改，不算近景辨識驗收。

### 第十五波正式發布確認（T769／PR #55；2026-10-24）

第15波十款原創英式工藝與社區會舍／40向，bld720..759；原生價格、存檔、供電、模擬及歷史模型不變。已正式發布，累計15／20波、150／200座。PR #55 squash為 `9869b268ec7d93c4782d067d61ebd8123d36f07e`，T769／v14.62／r216；最後9201da87獨立純刪workflow，push40115938673及PR40115943392全部必要工作成功。main40117098924及既有自動Pages40117952664成功。發布後唯讀public-site40115105323 attempt2／job120944856361成功，artifact12569518122；實際HTTP200與sandbox Chromium完整HTML均11,648,384bytes、SHA256 `cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8`，T769／14.62，第11～15波各10款40sprite，22負控、零runtime／network error，未用本地server；真公開menu／city／第15波目錄PNG已實看。

原始首紅40113569032：40新增bld葉未採baseline，財務52成功／10負控，唯一來源指紋失敗。未改財務模擬；僅採同次常規fp artifact12567542422原檔。首輪完整native40113569099成功。發布head87cca4fd完整native40115105323首次27／27成功；86原生斷言／12負控、160供電例／275PNG／1920相位、8完整畫布嚴格全等、2舊檔全欄位往返、三種子九checkpoint及效能延遲負控已核。91預覽逐byte等於已看C1；113場景111同，另32像素地塊細節與2466像素施工階段差異已成對實看並保留，未改容差或既有LOD。獨立實看145原PNG，hash核對與人工看圖分開。

bld七軸完整披露：palette 1→1；hardEdge 0.9559013242882268→0.956575675398324；lightDir 0.8074730842305257→0.8029647930821495；shade 1→1；density 1→1；nightRule 0.9902756873333572→0.9905118397397248；variants 1→1；total0.9648→0.9643。依第二項起連續授權處理，不手改分數或放寬門檻。作者實看日夜接觸表、十張近景與部分完整場景，獨立review另列真實範圍，不冒稱業主批准或全部圖片人工審閱。遠景既有LOD不算建築細節驗收。

### 第十六波正式發布核實（T770／PR #57；2026-10-24）

第16波十款原創英式專門工房與服務建築／40向，bld760..799；原生價格、容量、供電、模擬、存檔結構及歷史模型不變。已正式發布，累計16／20波、160／200座。PR #57 squash為 `64c78c9a2bad16fd191430525f4abaf4f7226717`，T770／v14.63／r217；最後head1f4eb6a0的push40124782625與PR40124785577全綠。main40125688839、自動Pages40126187059成功。發布後唯讀public-site40123355347 attempt2／job120968827141成功，artifact12573522220；實際HTTP200及sandbox Chromium均11,705,418bytes、SHA256 `6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723`，T770／14.63，第11～16波各10款40sprite，25負控、零runtime／network error。公開menu／city／第16波目錄原PNG已實看，未用本地server。

C1標準40121228689首紅：40新增bld葉尚未宣告；財務52項與10負控制成功，唯一失敗是來源指紋。只採同次官方fp artifact12571366394的原始fp.json／style.json，保留metadata，不改財務模擬或門檻。C1原生40121228711的baseline-evidence因本波臨時workflow誤用720標記失敗，C2只把標記修為760；C1不是27／27全綠。

C2 ef9efc5292584aa62e15e5a7f899946fb753d1d0：原生40121953495全部27工作成功；標準40121953536的smoke三次、fp及財務全部成功。這是候選證據，不代替發布版最後head或公開驗證。

bld七軸完整披露：palette 1→1；hardEdge 0.956575675398324→0.9572489734902542；lightDir 0.8029647930821495→0.8034960819770947；shade 1→1；density 1→1；nightRule 0.9905118397397248→0.9907380909650112；variants 1→1；total 0.9643→0.9645。七軸及total均無下降，不需要下降例外；不手改原始分數或放寬門檻。

發布版C3 e6c8c59d完整native40123355347全28成功，86原生檢查／12負控、160供電案例、全部欄位對照、八組歷史全畫布及效能守衛均通過。91預覽、113場景與19新增施工PNG已逐張實看及核SHA；施工自然固定12幀終點十棟可見且pending0，原冷兩draw及獨立flush診斷保留，沒有提高產品預算。Linden跨run96個地面像素差異如實保存，不冒稱全部跨run相等。275供電PNG未宣稱全數人工逐看；不冒稱業主圖審批准、實體手機／Safari／觸控測試。遠景既有LOD不算近景建築細節驗收。

### 第十七波正式發布確認（T771／PR #59；2026-10-24）

第17波十款原創英式公共館舍與專門工房／40向，bld800..839；價格、容量、供電、財務、模擬、存檔結構及舊160座不變。已正式發布，累計17／20波、170／200座。PR #59 squash為 `3b123dbe0cb2f635a1051b398604f8b49c9b0a25`，T771／v14.64／r218；最後純刪workflow head963b64c5的push40131342921、PR40131345691全綠，main40131928075與自動Pages40132432643成功。發布後唯讀公網Chrome run40130557188 attempt2／job120987555334成功，artifact12575163694；HTTP200及Chrome均11,761,122bytes、SHA256 `c4797f3f1898af5dc51080f2a19eae072e21cbd8e8b03d6ffd54a0759bb7d6ff`，T771／14.64，第11～17波各10款40sprite，28負控、零runtime／network錯誤。公開menu／city／第17波目錄原圖已實看，不使用本地server。

C2 c57157c6991aa48325e07bc807f6cfb244eaf8a9：標準40129322396的smoke3、fp與財務53+10全綠，原生40129322522全部28工作成功。C1新045自檢誤選舊760..799導致undefined-id，已精確修為800..839並新增回歸；財務52+10通過，唯一來源指紋未宣告。只用官方原始fp artifact12574725468，不改財務或舊守衛。

bld七軸：palette1→1；hardEdge0.9572489734902542→0.9578807244340685；lightDir0.8034960819770947→0.8057680988816951；shade1→1；density1→1；nightRule0.9907380909650112→0.9909531159365403；variants1→1；total0.9645→0.9649，無軸下降。

157張原圖已實看，完整清單與原PNG／SHA見T771；遠景LOD不當近景細節，275供電PNG未全數人工逐看，不冒稱業主批准、實體手機或Safari。

### 第十八波發布準備（T772／PR #61；2026-10-24）

第18波十款原創英式社區館舍／40向，bld840..879；價格、容量、供電、財務、模擬、存檔結構及舊170座不變。發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍17波170座。

C5 b5e1fcf4：標準40139356236與原生40139356199全綠。只用C4官方標準push40138059294 artifact12577738028原始fp/style；C1首紅、C2綠但圖審不合格、C3失敗與C4來源未宣告均保留。

palette1→1；hardEdge0.9578807244340685→0.9584876538355126；lightDir0.8057680988816951→0.80448533640023；shade1→1；density1→1；nightRule0.9909531159365403→0.991157775364051；variants1→1；total0.9649→0.9649。相對未發布C2總分0.9652→0.9649。受光軸下降明確披露，採用同次官方原始檔案，不調權重或門檻。

實看原始PNG的逐檔清單、原圖SHA及限制見GPT-046-visual-review.md。C2雖CI綠但廚房倒錐頂外觀未達首卡，C3仍歧義，C4僅修該四向真實搭接／排水標記及內向受光；原始四坡面座標、另九款與全部歷史guard不動。遠景LOD不當近景細節，未冒稱275供電圖全部人工看過、業主圖審、手機硬體或Safari。

### 第十九波發布準備（T773／PR #63；2026-10-25）

第19波十款原創英式村鎮結構／40向，bld880..919。既有180座、價格、供電、財務、模擬、RNG、存檔結構和全局密度完全保留。

原半球 C1–C7 的可見深腔不足與所有首紅保留；業主03:34明確選B，僅 Vervain 改較高較淺的真半橢球，保持2×2、低台、用途與其他九款。B1原生40159313479全28工作成功，B2採用標準push40159313379/artifact12586045331的逐byte官方fp/style。最新B2完整結果另附，不用舊頭冒充。原圖／SHA／實看範圍見docs/assets/GPT-047/manifest.json及GPT-047-visual-review.md；未宣稱全275張人工檢視、真手機或Safari。

palette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。

發布準備，待發布版完整 CI、最後全綠後刪自有分支 workflow、最終 head CI、合法合併、main CI、自動 Pages 與真實公網 Chromium；正式仍18波180座，尚不能計190。 [PR63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63)。

### 第19波正式收據與第20波發布準備（2026-10-25）

第19波已於2026-10-25正式發布190座：PR63合併4346a96543b01ffd47ac3696480661b5de8638ae；[main CI40162795551](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40162795551)及[自動Pages40163187956](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40163187956)成功。原[公網Chromium40160465127](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127)第二次job121079351468成功；HTTP／Chrome均200，11933765bytes、SHA256 3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63與正式build逐byte相同。T773／14.66、11–19波各10款40向、34負控制、零runtime/network錯誤。此前發布準備記錄保留為歷史，不再當待辦。

第20波十款原創工藝公共建築／40向 bld920..959，既有190座及舊4143葉完全保留；價格、地塊、財務、供電、存檔結構、RNG、全局密度不變。C1原生[40164900539](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40164900539)全29工作成功，含9份source運輸而非29種產品驗收。C2從官方標準artifact12587668760採用逐byte原始fp/style，未製造分數。詳細首紅、86原生檢查、160供電案例、57場景、40邊緣與40組效能A/B見[原始驗收](branch/GPT-048-C2-CI-evidence.md)。

palette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光軸微降依連續方向第二項起例外如實披露，未改光照／權重／門檻。

本節是T774／14.67發布準備，尚未計200：須發布版全套原生CI、獨立刪分支workflow、最後head標準CI、合法合併、main CI、自動Pages及公網真Chromium均完成。原圖人工審閱範圍據實記錄，真手機／Safari／觸控未驗證。不擅開第21波。

### 第20波正式發布收據：原定20波／200座完成（2026-10-25）

第20波已正式發布；本方向累計 **20／20波、200／200座、800個方向精靈**，T748較早15座不重複計入。上方各「發布準備」為歷史施工紀錄，以下已核實收據取代其待辦狀態。固定20波方向已完成，**不擅自開第21波**；保留業主原開關與方向原話，不把完成固定數量擴大成無限新增。

PR64正常squash合併為 `533d83862015dbefeb855f4ce07e68f13d27d0b1`，T774／v14.67／r221。最終 `ef5823b7bd24c2543162c46cb25f9a73d4c54119` 的[push40169211738](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169211738)與[PR40169214826](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169214826)全部必要工作成功；smoke三次、fp零差、財務53項／10負控。此前C3 `5fc1718` [完整原生40166524238](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238)首次29／29工作成功。先追加純文件證據dbdf823，再獨立只刪分支專屬workflow；main無該臨時workflow，共用CI／Pages／規則／原守衛不變。

產品main的[CI40169741555](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169741555)及既有[自動Pages40170096579](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40170096579)全綠。發布後只重跑原唯讀public-site工作：[run40166524238 attempt2／job121099344819](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238/job/121099344819)，未手動觸發Pages。HTTP200與實際sandbox Chromium均取得完整 **12,017,651bytes**，SHA256 `debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`，逐byte等於main533d838的正式index。T774／14.67、11～20波各10個原生目錄身份／40sprite，37負控制、零runtime／network錯誤、slot3沙盒且無本地server。

原公網[artifact12589682789](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238/artifacts/12589682789) ZIP1,665,484bytes／SHA256 `28cc11ae4e9e23abb27f9dff85d8535392f71cac63e738cbb40a3b742b496bfc`；menu、city page、city canvas及第20波原生目錄PNG全部核原始bytes／SHA，menu／city page／目錄已實看。既有近景／接觸圖及人工範圍見[T774卡](T774-british-wave20-original.md)、[C3完整證據](branch/GPT-048-C3-final-evidence.md)，不把275供電圖存在冒稱全部人工圖審。

第20波十款：毛地黃鄉約館、銀葉委陵菜高山植物屋、茜草分科學舍、芒柄花道鹽庫、水蘇木偶工藝館、地榆露臺講習所、玄參水彩工房、香花芥三山牆工藝館、琉璃繁縷交巷閱覽館、紫堇馬力棚穀舍。皆明示原創，既有190座、價格／容量／財務／供電／存檔與原模擬不變。

C3：86原生檢查／12負控、52幾何負控、160供電案例／275PNG／1920相位、57場景／40邊緣／8關閥整幀、兩輪完整舊檔成功，原生writer僅gameVer14.66→14.67。91預覽逐byte等C1；113場景112同，construction-late原生非同步瞬間差異成對實看並保留；固定12自然幀終點十棟完整可見，不改預算或延長既定觀測。40組交錯A/B median9.55→2.125ms、p90 20.05→19.775ms；恢復組p90 19→19.2ms如實保留。本次61ms／30樣本延遲負控精確紅後恢復，C1歷史59ms不改寫。

七軸仍為palette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光微降依連續方向第二項起例外披露；不手改官方raw基線metadata、權重或門檻。保留全部首紅、失敗模型／實驗與歷史限制。實體手機／Safari／觸控仍未驗證；第1～2波歷史首發公網代理403亦不冒稱當時成功，其原來源完整保留在目前正式HTML。

## 待辦（「修補」排最前面，其餘依方向排；每輪做最上面一項）

| 序 | 項目 | 對應方向的哪一句 | 美術／玩法 | 要動的 fp 家族 | 備註 |
|---|---|---|---|---|---|

原定20波、200座已正式完成；沒有新增第21波待辦。

### 2026-10-26 有界研發待辦（規劃代號非T／GPT號）

| 序 | 項目 | 對應業主規劃 | 範圍與前置 | 要動的 fp 家族 | 審批邊界 |
|---|---|---|---|---|---|
| 1 | LAB-01 影子貨物身份、事件與守恆 | F01 | T775／14.68，PR67已正常合併c0d4a039 | 無 | 最終CI40302937460、main40308344872、Pages40309228966成功；公網HTTP精確bytes＋AX主選單已核，完整公開互動／截圖timeout未完成 |
| 2 | LAB-02 影子倉庫容量與滿載背壓 | F02 | 原GPT-050／PR68；T776／14.69有界發布準備，獨立核心不接index | 無 | 業主A已批全驗後正常合併；正式倉容／單帳產品接線仍另卡另批 |
| 3 | LAB-03 真道路配送與合法交付 | F03 | LAB-02；一條真路、一個有界任務 | 無（候選卡凍結） | 車流／交通規則[等業主] |
| 4 | LAB-04 原生鐵路／k166拓撲診斷與適配設計 | R01 | LAB-00；先唯讀，不補隱形軌 | 無 | 實際接線／新貨站語意[等業主] |
| 5 | LAB-05 第一條兩站實載貨運鐵路 | R02 | LAB-01＋04成立；一列、有限容量 | 依首卡實際範圍凍結 | 新貨列車玩法[等業主] |
| 6 | LAB-06 占軌、等待與斷軌恢復 | R03 | LAB-05；至多兩貨列車 | 依首卡實際範圍凍結 | 路權／容量[等業主] |
| 7 | LAB-07 公鐵聯運全程交付 | R04 | LAB-03＋06；同批身份和帳 | 依首卡實際範圍凍結 | 新玩法[等業主]；仍不入正式帳 |
| 8 | LAB-08 原生通勤OD來源研究 | TOWN01 | LAB-00；可先唯讀，不造人口／工作 | 無 | 只讀已結算資料，不強制原生重算 |
| 9 | LAB-09 有界客運研究與未服務需求 | TOWN02 | LAB-08；深化施工在物流兩站閉環後 | 依首卡實際範圍凍結 | 不取代原生客運，正式語意[等業主] |
| 10 | LAB-10 車站與商業街影子到訪 | TOWN03 | LAB-09；真步行連接 | 無（候選卡凍結） | 不改收入／稅／價格／旅館收入 |
| 11 | LAB-11 貨客運商業街同城A–F驗收 | TOWN04／完整場景 | LAB-07＋10；若無安全共享路權則獨立合法線 | 依首卡實際範圍凍結 | 精確候選SHA、真Chrome／原圖；發布另批 |
| 12 | LAB-12 T482／持久化整合提案 | 後續審批 | 只有LAB-11成立後提出 | 無（設計卡） | 只提案；正式經濟／save／發布明確另批 |

上述有明確終點，不追加無限路線、多商品或美術工程。04及08可先做不依賴未批准產品改動的唯讀研究，其餘不得跳過前置。


## 卡住／等業主看圖

| 項目 | 狀態 | 原因 | 卡／PR |
|---|---|---|---|
| LAB-02 | PR67已發布；PR68仍待最後發布head驗收 | 2026-10-26 09:03業主A，順序67→68；68始終core-only，後續單帳接線另卡Draft、不自動合；完整公網互動未驗限制保留 | [T776](T776-lab02-warehouse-capacity.md)／GPT-050／#68 |
| 方向「加入 15個英式建築」 | 方向做完，等新方向 | 15 座已由 T748 合進 main（業主 2026-10-16 裁決 A）；固定 15 座的交付，不擴成無限新增 | [T748](T748-british-heritage-fifteen.md)／#29 |

## 已完成（最新在上）

| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |
|---|---|---|---|---|
| 第20波10款原創工藝建築（GPT-048，正式20／20波200座） | [T774](T774-british-wave20-original.md) | [#64](https://github.com/lijiabao1998/GlimmerTown-lab/pull/64) | 2026-10-25 | 產品main533d838／CI40169741555／自動Pages40170096579／公網Chromium40166524238 attempt2 job121099344819全成功，完整12017651bytes及SHA逐byte核實；37負控、零runtime/network錯誤。真手機／Safari／觸控未測；完整收據見上方。palette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光軸微降依連續方向第二項起例外如實披露，未改光照／權重／門檻。 |
| 第十九波10座原創英式村鎮結構（GPT-047，已正式190） | [T773](T773-british-wave19-original.md) | [#63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63) | 2026-10-25 | main CI40162795551／Pages40163187956／公網Chromium40160465127 job121079351468均成功，正式4346a965來源逐byte核實；真手機／Safari未驗證。 palette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。 |
| 第十八波10座原創英式社區館舍（GPT-046；18／20波180座，已發布） | [T772](T772-british-wave18-original.md) | [#61](https://github.com/lijiabao1998/GlimmerTown-lab/pull/61) | 2026-10-25 | PR61正常squash為 `a2718a7a3ee17445d4a23ea40d22398fb4e12295`，T772／v14.65／r219；最後純刪workflow head e68a30c 的push40148605227及PR40148608072全綠，main40149354922與既有自動Pages40149830935成功。發布後唯讀真HTTPS／Chromium run40148042386 attempt2／job121039349056成功，artifact12582083285；HTTP200及瀏覽器均11831402bytes、SHA256 `0ec9f7cbe03139dd93d607e7b343911dce4024028b40a16a4c88439dca23390c`，T772／14.65，第11～18波各10款40sprite，31負控、零runtime／network錯誤；公開menu／city／第18波目錄原PNG已實看，無本地server。C6完整28原生工作成功，86項／12負控、供電160案例／275PNG／1920相位、57場景／40邊緣／8整幀，詳卡。原始cold兩次draw的施工末圖仍有Chamomile與Myrtle兩裸墊，保留非同步烘焙限制；預定12自然幀與66明確flush另驗，不替換首圖。C2／C3屋頂視覺失敗保留，C4真實搭接排水幾何修正；bld total0.9649→0.9649，lightDir0.8057680988816951→0.80448533640023下降，全部七軸與官方原始基線詳PR／卡。不冒稱275供電圖全數人工、業主圖審、實體手機或Safari。 |
| 第十七波10座原創英式公共館舍與專門工房（GPT-045；17／20波170座，已發布） | [T771](T771-british-wave17-original.md) | [#59](https://github.com/lijiabao1998/GlimmerTown-lab/pull/59) | 2026-10-24 | 已正式發布，累計17／20波、170／200座。PR #59 squash為 `3b123dbe0cb2f635a1051b398604f8b49c9b0a25`，T771／v14.64／r218；最後純刪workflow head963b64c5的push40131342921、PR40131345691全綠，main40131928075與自動Pages40132432643成功。發布後唯讀公網Chrome run40130557188 attempt2／job120987555334成功，artifact12575163694；HTTP200及Chrome均11,761,122bytes、SHA256 `c4797f3f1898af5dc51080f2a19eae072e21cbd8e8b03d6ffd54a0759bb7d6ff`，T771／14.64，第11～17波各10款40sprite，28負控、零runtime／network錯誤。公開menu／city／第17波目錄原圖已實看，不使用本地server。 C2全驗收成功；157張原圖已實看，完整清單與原PNG／SHA見T771；遠景LOD不當近景細節，275供電PNG未全數人工逐看，不冒稱業主批准、實體手機或Safari。 bld total0.9645→0.9649，七軸無下降。 |
| 第十六波10座原創英式專門工房與服務建築（GPT-044；16／20波160座，已發布） | [T770](T770-british-wave16-original.md) | [#57](https://github.com/lijiabao1998/GlimmerTown-lab/pull/57) | 2026-10-24 | 已正式發布，累計16／20波、160／200座。PR #57 squash為 `64c78c9a2bad16fd191430525f4abaf4f7226717`，T770／v14.63／r217；最後head1f4eb6a0的push40124782625與PR40124785577全綠。main40125688839、自動Pages40126187059成功。發布後唯讀public-site40123355347 attempt2／job120968827141成功，artifact12573522220；實際HTTP200及sandbox Chromium均11,705,418bytes、SHA256 `6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723`，T770／14.63，第11～16波各10款40sprite，25負控、零runtime／network error。公開menu／city／第16波目錄原PNG已實看，未用本地server。 完整native28成功，bld七軸詳T770，無軸下降；91預覽／113場景／19施工圖已實看，不稱275供電圖全人工或實體手機／Safari／觸控測試。 |
| 第十五波10座原創英式工藝與社區會舍（GPT-043；15／20波，累計150座，已發布） | [T769](T769-british-wave15-original.md) | #55 | 2026-10-24 | 已正式發布，累計15／20波、150／200座。PR #55 squash為 `9869b268ec7d93c4782d067d61ebd8123d36f07e`，T769／v14.62／r216；最後9201da87獨立純刪workflow，push40115938673及PR40115943392全部必要工作成功。main40117098924及既有自動Pages40117952664成功。發布後唯讀public-site40115105323 attempt2／job120944856361成功，artifact12569518122；實際HTTP200與sandbox Chromium完整HTML均11,648,384bytes、SHA256 `cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8`，T769／14.62，第11～15波各10款40sprite，22負控、零runtime／network error，未用本地server；真公開menu／city／第15波目錄PNG已實看。 bld七軸詳T769，total0.9648→0.9643及lightDir下降已依連續授權披露；未實體手機／Safari／觸控，非全部113場景／275供電圖人工逐看。 |
| 第十四波10座原創英式鎮務與工坊建築（GPT-042；14／20波，累計140座，已發布） | [T768](T768-british-wave14-original.md) | #53 | 2026-10-24 | 最後a87fceaf的PR40106548894全測全綠；發布native40105444391首次27／27。main574cc36d的40109306236、自動Pages40109993003成功；公開attempt2／job120923223936真HTTP與Chrome逐byte匹配T768／14.61，第14波10款40葉及目錄原PNG、19負控、sandbox及零runtime error已核。七軸上方完整披露，total0.9647→0.9648、lightDir微降依連續授權；未全113場景／275供電圖人工逐看，未實機手機／Safari／觸控。 |
| 第十三波10座原創英式專門職人建築（GPT-041；13／20波，累計130座，已發布） | [T767](T767-british-wave13-original.md) | #51 | 2026-10-24 | 最後native40099783601首次27／27；最終a3703372的push40100365245及PR40100368049全綠。main2422e951的40101009240、自動Pages40101499998成功；公開attempt2／job120896715118真HTTP與Chrome逐byte匹配T767／14.60，最新第13波10款40葉與原生目錄、16負控、sandbox與零runtime error已核。bld七軸詳T767，上方完整披露，total0.9653→0.9647、lightDir下降依連續授權處理。未全113場景／275供電圖人工逐看，未測實體手機／Safari／觸控；不得把產物全存在當全部人工看過。 |
| 第十二波10座原創英式鄉村服務建築（GPT-040；12／20波，累計120座，已發布） | [T766](T766-british-wave12-original.md) | #49 | 2026-10-24 | C5完整原生40094352758首次27／27；最後b36e93e8的push40094948187／PR40094952462全綠。main cfe03d8a的40095436706、自動Pages40095825161成功；公開attempt2／job120878708877真HTTP與Chromium逐byte匹配T766／14.59，7負控制、sandbox啟用、無runtime error；原PNG已看。bld七軸詳T766，total0.9658→0.9653、lightDir0.8176833447566827→0.8132088058705804，依連續第二項起授權披露。80日夜精靈、十款近景及選取場景人工看過，非全部113場景／275供電圖；未測實體手機／Safari／觸控。 |
| 第十一波10座原創英式建築（原GPT-039；本方向11／20波，累計110座，已發布） | [T765](T765-british-wave11-original.md) | #47 | 2026-10-24 | C7 fb8cd7be原生27／27；最終3341a26f純刪workflow後push40078436852／PR40078439833全綠。main08311d9a的40078958810及自動Pages40079298098成功；公開探針40077064339 attempt2／job120829685445真HTTP200與瀏覽器皆逐byte匹配11425465B／SHA378eba7a…0e9fb3，T765／14.58、7負控制、sandbox啟用且無runtime error，公開menu／canvas原PNG已實看。作者80日夜原圖＋3contact＋10near＋街景／夏／雪已看；另275供電圖、57場景及40邊緣未全逐張人工，實機手機／Safari／觸控未測。bld七軸詳T765，total0.966→0.9658、lightDir下降已依連續授權披露。 |
| 第十波10座有考據英式商貿與市集建築（原GPT-038；發布準備，僅隨PR46合入且公開核實後才計10／20波，此前仍9／20） | [T764](T764-british-wave10-commerce-markets.md) | #46 | 2026-10-21 | 候選C27完整39568705215首次21／21及C29push／PR皆綠，Silver日／通電／熄燈三圖已接受並獲本PR發布批准。T764／v14.57只改三處版本label的4ASCII byte，逆證完整C27來源；發布5a619e00完整39588718300首次21／21，push39588718155真smoke3／fp／財務53＋10、PR39588724152真核重用；8段完整source11370954bytes／SHA9583cb38…201852及91preview PNG等C27已核。兩施工PNG不同未做人看、本次core原ZIP本地proxy403已停，未冒稱275圖重新獨立審。最後純刪workflow後CI／main自動Pages公站另核。作者93靜態、獨立32選圖與275PNG逐SHA不冒稱全人工；實機手機／Safari／觸控未測，Silver低解析度／Bishop細節限制保留；bld total0.9658→0.966但lightDir略降，七軸詳T764，raw基線不改。 |
| 第九波10座有考據英式市政與司法建築（原GPT-037；發布準備，僅隨PR45合入且公開核實後才計9／20波，此前仍8／20） | [T763](T763-british-wave09-civic-justice.md) | #45 | 2026-10-20 | 發布0420b21完整39414702723首次21／21，push39414702730真smoke3／fp零差／財務53＋10，PR39414707924逐job核實重用同次push；93原圖逐byte等於兩位獨立reviewer已審C8，八段完整index11296190 bytes／SHA2b959e01…7cef60／Git blob69a3851f與producer／native／remote tree實核。workflow純刪後最後CI與最終新增差異覆核仍待；main／Pages／公站以PR45回執為準，未提前記發布。另103場景、實機手機／Safari／觸控未人工測；London夜玻璃偏亮、Middlesex／Thaxted細節偏弱、Holyrood選取塔群及照片限制保留。bld七軸詳T763，total0.9655→0.9658，無下降。 |
| 第八波10座有考據英式醫療與照護建築（原GPT-036；發布準備，僅隨PR44合入且公開核實後才計8／20波，此前仍7／20） | [T762](T762-british-wave08-care.md) | #44 | 2026-10-20 | 發布252b2ce完整39387488865原13＋8工作皆綠，push39387488820真smoke3／fp零差／財務53＋10，PR39387497977明確重用同次push；93新原圖逐byte等於已審651adf1、實際index原bytes／SHA／Git blob與遠端tree綁定。只刪workflow後最後CI／獨立新差異覆核、main／既有Pages及真正公開版本待實核。獨立程式為來源／日誌審查，非獨立跑測；獨立實看80原PNG＋10near＋3contact，90個圖SHA尺寸／3contact官方ZIP綁定。場景ZIP113張只看10、另103未審，實機手機／Safari／觸控未測；圖審未獨立重算大檔index。本波bld七軸及原基線bytes詳卡，total0.9651→0.9655無下降。 |
| 第七波10座有考據英式休閒與遊樂建築（原GPT-035；僅隨PR43合入且公開核實後才計本方向7／20波，此前仍6／20） | [T761](T761-british-wave07-leisure.md) | #43 | 2026-10-20 | T761／14.54的20c731a完整39370841520為13／13、十二首紅／原生新舊檔／三種子九checkpoint／97場景／8整幀／17行人／40組效能已跑，push39370841371真smoke3／fp零差／財務53＋10綠；PR39370845283實際重用該完整push。workflow只刪後最終CI／獨立程式安全與視覺／主線Pages及公開站仍須實核。七軸palette1→1、hardEdge0.9483921112714824→0.949393389794125、lightDir0.8212867355043686→0.8183217859892224、shade1→1、density1→1、nightRule0.9878124606474332→0.9881813927037836、variants1→1，total0.9654→0.9651，依第二波起連續授權披露下降；作者已實看80單圖／3接觸表／10近景並綁SHA，尚無獨立圖審；另87場景及實體手機／Safari／觸控未人工測 |
| 第六波10座有考據英式學院與學術建築（原GPT-033；僅隨PR42合入且公開核實後才計本方向6／20波；此前仍5／20） | [T760](T760-british-wave06-academic.md) | #42 | 2026-10-20 | 7fa新完整39359542415為13／13，原生86項／12首紅、3種子9檢查點／十款新舊檔、57＋40場景／8整幀、17行人／40組效能詳卡；push39359542451真smoke3／fp／財務53＋10綠，刪workflow後最後CI／獨立覆核及公站仍以PR42實際回執為準；bld總分0.9655→0.9654、lightDir0.8236259228876128→0.8212867355043686，依第二波起連續授權披露；80單圖＋3接觸表＋10近景已有獨立實看／SHA證據，其餘87場景與實體手機／Safari／觸控未人工測 |
| 第五波10座有考據英式海岸與港口建築（原GPT-031；本方向5／20波，僅隨PR39合入main並完成發布核實生效） | [T758](T758-british-wave05-coastal-ports.md) | #39 | 2026-10-18 | 0b原生86項／12首紅、三種子9檢查點／十款新舊檔、57＋40場景／8整幀、17行人、40組效能及原80PNG／10近景詳卡；bld七軸公開，總分0.9656→0.9655、lightDir下降，按第二項起連續授權披露；T758新完整run／最後CI／程式安全新審查及正式第五輯以PR39實際回執為準，尚未當已發布；全部97圖未逐張人工覆核、實體手機／Safari／觸控未測 |
| T757 bld根物件掃描容量修補（原GPT-032；業主專項批准PR40，非建築波次） | [T757](T757-bld-root-scan-capacity.md) | #40 | 2026-10-18 | main f723a90的39100942592三工作與自動Pages39101323074成功；真公開站117598418237實核v14.50／T757、HTML逐位元匹配及原始畫布已看；原完整容量run仍39098124736／37e9e34，不冒稱發布head重跑；本修補新增建築0座 |
| 第四波10座有考據英式鄉村與工業遺產建築（原GPT-030；本方向4／20波，僅隨PR38合入main生效，部署另核） | [T756](T756-british-wave04-country-industry.md) | #38 | 2026-10-18 | 原生新舊檔／三種子、8／8整幀、97場景邊界、17行人、真首紅與效能詳卡及PR38最新CI；bld七軸公開，總分0.9657→0.9656、lightDir下降，依第二波起連續授權披露；全部97圖未逐張人工覆核、實體手機／Safari／觸控未測 |
| 第三波10座有考據英式街鎮建築（原GPT-029；本方向3／20波，僅隨PR37合入main生效） | [T755](T755-british-wave03-townscape.md) | #37 | 2026-10-18 | CI完整新舊檔／三種子、8／8整幀、97場景邊界、17行人與首紅已跑；bld七軸見卡，總分0.9653→0.9657無下降；全部97圖未逐張人工覆核、實體手機／Safari／觸控未測；其後39087737240已從CI實際HTTP200及瀏覽器核實v14.48／T755公開站，畫布已看，證據見T756 |
| 第二波10座有考據英式公共與交通建築（原GPT-027；本方向2／20波，隨PR36合入main生效） | [T754](T754-british-wave02-public-transport.md) | #36 | 2026-10-17 | CI完整新舊檔、8／8整幀、97場景／邊界、17行人與首紅已跑；bld七軸見T754卡，總分0.9655→0.9653，按第二波連續授權披露下降；人工全97圖未逐張覆核、實體手機／Safari／觸控未測，公開站代理403 |
| T753 明確空政策存檔讀檔修補（原GPT-028；非建築波次） | [T753](T753-native-policy-null-load.md) | #35 | 2026-10-17 | 原生23項／11負控制及完整畫布在修補head已成功；v14.46／T753的main 39044006838三項全綠、財務53／10，自動Pages 39044396403成功；公開網址雲端代理403且網頁工具無法讀取，未宣稱線上圖審 |
| 第一波10座有考據英式建築（原GPT-025；本方向1／20波） | T752 | #32 | 2026-10-17 | 無新增未跑守衛：桌面CI已驗完整舊檔、整幀8／8、97場景／邊界及17行人；實體手機／Safari／觸控未測，不列已跑 |
| T751 財務載入紀錄修補（原GPT-026；非建築波次） | [T751](T751-fiscal-load-readonly.md) | #33 | 2026-10-17 | 無新增未跑守衛：main 39028978677 已驗財務53項／10負控制；原始六案例見T751卡 |
| 15 座英式歷史建築（原 GPT-024） | T748 | #29 | 2026-10-16 | 整幀閥等值；完整季節／有無雪／遠景／邊緣／施工／懸停（已跑四向 120 原生日夜圖，非全場景） |
| T745 四向英式建築牆面受光 | T747 | #28 | 2026-10-15 | 整幀閥等值；完整日夜冬／四季／四向／遠景／邊緣／疊層（已跑四向 320 原生日夜圖，非全場景） |

## 20-wave completion inventory

完整20波／200座完成清單；每波十座名稱、T號、PR、精確產品合併SHA、CI、圖片及正式發布證據如下。這是已完成固定數量方向的最終交付，不是新增施工卡。

核對：2026-10-25T06:55:05.480428+00:00。**20波、200座、800個旋轉外觀全部完成正式發布**。每波十座；T748舊15座不重複計入。不開第21波。

[正式遊戲](https://lijiabao1998.github.io/GlimmerTown-lab/) · [第20波產品合併](https://github.com/lijiabao1998/GlimmerTown-lab/commit/533d83862015dbefeb855f4ce07e68f13d27d0b1) · [正式公網Chromium收據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238/job/121099344819)

### 最終發布與證據邊界

- 第20波：PR64／`533d83862015dbefeb855f4ce07e68f13d27d0b1`，T774／v14.67／r221；最後head `ef5823b7bd24c2543162c46cb25f9a73d4c54119`。最後push40169211738、PR40169214826、main40169741555、自動Pages40170096579均成功。
- 正式HTTP200與Chromium完整HTML均12,017,651bytes；SHA256 `debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`。37負控、runtime/network零錯誤；20波來源／800葉均保留；第3–20波有本次直接runtime目錄證據。
- 第1–2波歷史首次公網讀取曾受代理403阻擋；不補稱當時已做精確瀏覽器驗證。兩波來源逐byte保留於最終正式HTML。
- 第1–18波完整歷史證據沿用已驗證清冊；第19–20波重新核對遠端PR/main/Pages/最後head/首次完整原生工作及公開報告、原PNG雜湊。發布後attempt2只重跑唯讀public-site，不冒稱整套重跑。
- 官方artifact可能需登入且有到期日。產物存在／同雜湊不代表全圖人工審閱；無實體手機、Safari或硬體觸控成功宣稱。發布負責者已實看第20波menu／city-page／catalog原圖；本次清冊另核四張原PNG位元組。
- 後續方向檔的文件回執與產品發布證據分開；不因文件回執尚在收尾而把已驗證200座寫成待發布。

- 本次另逐筆讀取GitHub API核對全部20波的main／自動Pages共40個run，40／40完成成功且head SHA精確等於各波合併SHA（2026-10-25T06:54:24.930Z）；完整核對記錄：`all20-main-pages-exact-head-audit.json`。第1波run39028978677為T752／PR32，非T751自身發布run；方向檔T751行引用的是既有財務回歸證據。

### 第1波 · T752 · v14.45 · 正式發布

[PR #32](https://github.com/lijiabao1998/GlimmerTown-lab/pull/32) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T752-british-wave01-ten.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave01-art025.js)

合併SHA：[`fdc2839f4a2cb643a4f35513bbdcdd220fba2d49`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/fdc2839f4a2cb643a4f35513bbdcdd220fba2d49)

1. **阿拉隆德十六角屋**（A la Ronde）— `wave01/alaronde`；bld.24_1_160–163
2. **鄧斯特紗市亭**（Dunster Yarn Market）— `wave01/dunster`；bld.24_1_164–167
3. **塔特舍爾大塔**（Tattershall Great Tower）— `wave01/tattershall`；bld.24_1_168–171
4. **哈德威克廳**（Hardwick Hall）— `wave01/hardwick`；bld.24_1_172–175
5. **斯托克賽堡**（Stokesay Castle）— `wave01/stokesay`；bld.24_1_176–179
6. **奇西克別墅**（Chiswick House）— `wave01/chiswick`；bld.24_1_180–183
7. **克拉格賽德**（Cragside）— `wave01/cragside`；bld.24_1_184–187
8. **霍姆伍德現代別墅**（The Homewood）— `wave01/homewood`；bld.24_1_188–191
9. **卡丁頓飛船棚**（Cardington Hangar 2）— `wave01/cardington`；bld.24_1_192–195
10. **威靈頓鴿舍**（Willington Dovecote）— `wave01/willington`；bld.24_1_196–199

- 最後head CI：[pull_request 39028380206 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39028380206)；[push 39028376437 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39028376437)
- 完整原生：[39027768427；首次 33/33 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39027768427).
- 正式發布：[main CI 39028978677](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39028978677)；[自動Pages 39029263757](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39029263757)，精確合併SHA均成功。
- 公網核驗：歷史首發讀站受限，未宣稱當時精確HTTP／瀏覽器驗證；來源逐byte保留於最終正式第20波HTML。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-025/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-025/contact-night.png)
- 保留限制：首發時公開 HTML 與畫布讀取被雲端代理 403 阻擋；main CI 與自動 Pages 的同一合併 SHA 已確認成功，不倒填當時的瀏覽器驗證。
- 保留限制：完整原圖曾經批准，但本次編表沒有重新人工檢視全部圖片。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第2波 · T754 · v14.47 · 正式發布

[PR #36](https://github.com/lijiabao1998/GlimmerTown-lab/pull/36) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T754-british-wave02-public-transport.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave02-art027.js)

合併SHA：[`35be6a37ebc672c90e9406c50c32e157e8701196`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/35be6a37ebc672c90e9406c50c32e157e8701196)

1. **克羅伊登航站樓**（Croydon Airport Terminal）— `wave02/croydon`；bld.24_1_200–203
2. **普雷斯頓巴士站**（Preston Bus Station）— `wave02/preston`；bld.24_1_204–207
3. **阿諾斯格羅夫站**（Arnos Grove Station）— `wave02/arnos`；bld.24_1_208–211
4. **坎普登石拱市集**（Chipping Campden Market Hall）— `wave02/campden`；bld.24_1_212–215
5. **吉爾福德行會廳**（Guildford Guildhall）— `wave02/guildford`；bld.24_1_216–219
6. **伯明翰博物館鐘樓**（Birmingham Museum and Big Brum）— `wave02/birmingham`；bld.24_1_220–223
7. **考文垂現代新堂**（Coventry New Cathedral）— `wave02/coventry`；bld.24_1_224–227
8. **萊斯特太空中心**（National Space Centre）— `wave02/spacecentre`；bld.24_1_228–231
9. **彭肖紀念柱廊**（Penshaw Monument）— `wave02/penshaw`；bld.24_1_232–235
10. **黑池鐵塔**（Blackpool Tower）— `wave02/blackpool`；bld.24_1_236–239

- 最後head CI：[pull_request 39048184572 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39048184572)；[push 39048179749 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39048179749)
- 完整原生：[39047184620；首次 12/12 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39047184620).
- 正式發布：[main CI 39049008748](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39049008748)；[自動Pages 39049461383](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39049461383)，精確合併SHA均成功。
- 公網核驗：歷史首發讀站受限，未宣稱當時精確HTTP／瀏覽器驗證；來源逐byte保留於最終正式第20波HTML。
- 圖片：[完整官方原圖artifact12106247563](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39047184620/artifacts/12106247563)
- 保留限制：首發時公開 HTML 與畫布讀取被雲端代理 403 阻擋；依當時已記錄的例外，以精確合併 SHA 的自動建置及部署回執確認發布。
- 保留限制：全部 97 張場景未逐張人工覆核。早期兩款預覽不當成完整十款發布圖。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第3波 · T755 · v14.48 · 正式發布

[PR #37](https://github.com/lijiabao1998/GlimmerTown-lab/pull/37) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T755-british-wave03-townscape.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave03-art029.js)

合併SHA：[`9335b08f47ab184ebb5fa7f46b776c1049cd5cc9`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/9335b08f47ab184ebb5fa7f46b776c1049cd5cc9)

1. **聖奧爾本斯鐘樓**（St Albans Clock Tower）— `wave03/stalbans`；bld.24_1_240–243
2. **紐卡素商人屋**（Bessie Surtees House）— `wave03/bessie`；bld.24_1_244–247
3. **伊普斯威奇泥塑屋**（Ipswich Ancient House）— `wave03/ancient`；bld.24_1_248–251
4. **巴斯普爾特尼橋屋**（Pulteney Bridge）— `wave03/pulteney`；bld.24_1_252–255
5. **哈利法克斯布廳**（Halifax Piece Hall）— `wave03/piecehall`；bld.24_1_256–259
6. **曼徹斯特交易廳**（Manchester Royal Exchange）— `wave03/exchange`；bld.24_1_260–263
7. **奇切斯特市集十字亭**（Chichester Market Cross）— `wave03/chichester`；bld.24_1_264–267
8. **伊普斯威奇威利斯樓**（Willis Building Ipswich）— `wave03/willis`；bld.24_1_268–271
9. **卡斯爾卡里圓屋**（Castle Cary Round House）— `wave03/roundhouse`；bld.24_1_272–275
10. **法弗舍姆架空行會廳**（Faversham Guildhall）— `wave03/faversham`；bld.24_1_276–279

- 最後head CI：[pull_request 39085043250 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39085043250)；[push 39084788640 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39084788640)
- 完整原生：[39084192598；首次 12/12 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39084192598).
- 正式發布：[main CI 39085350900](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39085350900)；[自動Pages 39085740893](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39085740893)，精確合併SHA均成功。
- 公網核驗：[39087737240 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087737240/artifacts/12121047997)；HTML SHA256 `77c51c5171c95f3d272999276b71ec9e94233b5f2bd0de0ca785d09745f73c3e`。
- 圖片：[完整官方原圖artifact12120460070](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39084192598/artifacts/12120460070)
- 保留限制：首發後代理讀站失敗，其後在第 4 波開工時以 CI 對仍然正式發布的 T755 完整 HTML 與真瀏覽器補驗成功。
- 保留限制：全部 97 張場景未逐張人工覆核；原始 canvas 的一次日誌搬運不完整，未當成原圖，完整原件仍在官方 artifact。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第4波 · T756 · v14.49 · 正式發布

[PR #38](https://github.com/lijiabao1998/GlimmerTown-lab/pull/38) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T756-british-wave04-country-industry.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave04-art030.js)

合併SHA：[`38a27743e9708517d88e251a005c3475fff1bbe7`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/38a27743e9708517d88e251a005c3475fff1bbe7)

1. **克萊風磨**（Cley Windmill）— `wave04/cley`；bld.24_1_280–283
2. **克羅斯尼斯泵站**（Crossness Pumping Station）— `wave04/crossness`；bld.24_1_284–287
3. **查塔姆繩廠**（Chatham Ropery）— `wave04/chatham`；bld.24_1_288–291
4. **聖島石灰窯**（Holy Island Lime Kilns）— `wave04/limekilns`；bld.24_1_292–295
5. **格拉德斯通陶窯**（Gladstone Pottery）— `wave04/gladstone`；bld.24_1_296–299
6. **托溫羅斯引擎房遺構**（Towanroath Engine House）— `wave04/towanroath`；bld.24_1_300–303
7. **錫辛赫斯特烘乾窯**（Sissinghurst Oast House）— `wave04/sissinghurst`；bld.24_1_304–307
8. **阿比代爾水力鍛造廠**（Abbeydale Works）— `wave04/abbeydale`；bld.24_1_308–311
9. **里茲坦普爾亞麻廠**（Temple Mill Leeds）— `wave04/temple`；bld.24_1_312–315
10. **佩里韋爾胡佛廠**（Hoover Factory Perivale）— `wave04/hoover`；bld.24_1_316–319

- 最後head CI：[pull_request 39093076794 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39093076794)；[push 39093074163 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39093074163)
- 完整原生：[39092129437；首次 13/13 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39092129437).
- 正式發布：[main CI 39094112934](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094112934)；[自動Pages 39094482136](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094482136)，精確合併SHA均成功。
- 公網核驗：[39092129437 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39092129437/artifacts/12124266250)；HTML SHA256 `c82b281c94090f497d7638398efe6b369b437d6c9a30249bc6809b30a30db276`。
- 圖片：[完整官方原圖artifact12123327062](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39092129437/artifacts/12123327062)
- 保留限制：全部 97 張場景未逐張人工覆核。
- 保留限制：公開探針的程式 head 與它獨立驗證的正式 main SHA 不同，兩者分別記錄。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第5波 · T758 · v14.51 · 正式發布

[PR #39](https://github.com/lijiabao1998/GlimmerTown-lab/pull/39) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T758-british-wave05-coastal-ports.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave05-art031.js)

合併SHA：[`1bf22ad7d6d533f8dfdf4480209a9a4b29c6fea6`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/1bf22ad7d6d533f8dfdf4480209a9a4b29c6fea6)

1. **黑斯廷斯漁網木鋪**（Hastings Net Shops）— `wave05/netshops`；bld.24_1_320–323
2. **伯納姆低燈塔**（Burnham Low Lighthouse）— `wave05/burnham`；bld.24_1_324–327
3. **索爾特迪恩海濱泳場**（Saltdean Lido）— `wave05/saltdean`；bld.24_1_328–331
4. **聖倫納茲郵輪公寓**（Marine Court）— `wave05/marinecourt`；bld.24_1_332–335
5. **朴茨茅斯圓炮塔**（Portsmouth Round Tower）— `wave05/roundtower`；bld.24_1_336–339
6. **朴茨茅斯風帆塔**（Spinnaker Tower）— `wave05/spinnaker`；bld.24_1_340–343
7. **金斯林海關**（Kings Lynn Custom House）— `wave05/lynncustoms`；bld.24_1_344–347
8. **喬治碼頭通風塔**（Georges Dock Ventilation Station）— `wave05/georgesdock`；bld.24_1_348–351
9. **波特蘭比爾燈塔**（Portland Bill Lighthouse）— `wave05/portlandbill`；bld.24_1_352–355
10. **克羅默碼頭救生艇庫**（Cromer Lifeboat Station）— `wave05/cromer`；bld.24_1_356–359

- 最後head CI：[pull_request 39103364750 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39103364750)；[push 39103361966 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39103361966)
- 完整原生：[39102665167；首次 13/13 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39102665167).
- 正式發布：[main CI 39104791421](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39104791421)；[自動Pages 39105049020](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39105049020)，精確合併SHA均成功。
- 公網核驗：[39102665167 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39102665167/artifacts/12128476025)；HTML SHA256 `0407552d1eb280975e069791b19c39d7736a1d0d9c7ebfecf5f86a193c1505e1`。
- 圖片：[完整官方原圖artifact12127630792](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39102665167/artifacts/12127630792)
- 保留限制：全部 97 張場景未逐張人工覆核；一張施工場景跨 run 不同，沒有聲稱所有場景跨 run 相同。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第6波 · T760 · v14.53 · 正式發布

[PR #42](https://github.com/lijiabao1998/GlimmerTown-lab/pull/42) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T760-british-wave06-academic.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave06-art033.js)

合併SHA：[`d5a357e0105502c62bf2fdc42d4a8c9c1b7c77b5`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/d5a357e0105502c62bf2fdc42d4a8c9c1b7c77b5)

1. **萊斯特工程學院**（Leicester Engineering Building）— `wave06/leicester`；bld.24_1_360–363
2. **東英吉利亞階梯宿舍**（UEA Norfolk Terrace）— `wave06/norfolk`；bld.24_1_364–367
3. **薩塞克斯法爾默樓**（Sussex Falmer House）— `wave06/falmer`；bld.24_1_368–371
4. **約克大學中央講堂**（York Central Hall）— `wave06/yorkhall`；bld.24_1_372–375
5. **牛津聖凱瑟琳學院**（Oxford St Catherine's College）— `wave06/stcatherines`；bld.24_1_376–379
6. **皇家內科醫師學院**（Royal College of Physicians）— `wave06/physicians`；bld.24_1_380–383
7. **劍橋議事廳**（Cambridge Senate House）— `wave06/senate`；bld.24_1_384–387
8. **格拉斯哥吉爾伯特史考特樓**（Glasgow Gilbert Scott Building）— `wave06/glasgow`；bld.24_1_388–391
9. **杜倫鄧納姆樓**（Durham Dunelm House）— `wave06/dunelm`；bld.24_1_392–395
10. **里茲羅傑史蒂文斯講堂**（Leeds Roger Stevens Building）— `wave06/rogerstevens`；bld.24_1_396–399

- 最後head CI：[pull_request 39360720640 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39360720640)；[push 39360714586 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39360714586)
- 完整原生：[39359542415；首次 13/13 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39359542415).
- 正式發布：[main CI 39363318570](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39363318570)；[自動Pages 39363879284](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39363879284)，精確合併SHA均成功。
- 公網核驗：[39359542415 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39359542415/artifacts/12238113965)；HTML SHA256 `535318c1eb7891d8b714ab7ddebdb0e4e6fdad0b75be97f147048a5bba050458`。
- 圖片：[完整官方原圖artifact12237190960](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39359542415/artifacts/12237190960)
- 保留限制：另 87 張場景未逐張人工覆核；獨立靜態安全覆核不等於重跑全部測試。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第7波 · T761 · v14.54 · 正式發布

[PR #43](https://github.com/lijiabao1998/GlimmerTown-lab/pull/43) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T761-british-wave07-leisure.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave07-art035.js)

合併SHA：[`50d0d52b2617460670f180dbaafa0a89bc806a5b`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/50d0d52b2617460670f180dbaafa0a89bc806a5b)

1. **伊爾弗勒科姆地標劇院**（Ilfracombe Landmark Theatre）— `wave07/landmarktheatre`；bld.24_1_400–403
2. **馬蓋特夢境電影院**（Dreamland Cinema Margate）— `wave07/dreamland`；bld.24_1_404–407
3. **伊斯特本音樂台**（Eastbourne Bandstand）— `wave07/eastbourne`；bld.24_1_408–411
4. **亞歷山德拉宮**（Alexandra Palace）— `wave07/alexandra`；bld.24_1_412–415
5. **彭贊斯銀禧海水池**（Penzance Jubilee Pool）— `wave07/jubilee`；bld.24_1_416–419
6. **達德利動物園入口**（Dudley Zoo Entrance）— `wave07/dudley`；bld.24_1_420–423
7. **倫敦動物園企鵝池**（London Zoo Penguin Pool）— `wave07/penguin`；bld.24_1_424–427
8. **莎士比亞環球劇場**（Shakespeare's Globe）— `wave07/globe`；bld.24_1_428–431
9. **皇家莎士比亞劇院**（Royal Shakespeare Theatre）— `wave07/royalshakespeare`；bld.24_1_432–435
10. **黑池冬季花園**（Blackpool Winter Gardens）— `wave07/wintergardens`；bld.24_1_436–439

- 最後head CI：[pull_request 39371636476 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39371636476)；[push 39371630377 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39371630377)
- 完整原生：[39370841520；首次 13/13 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39370841520).
- 正式發布：[main CI 39374964862](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39374964862)；[自動Pages 39375586942](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39375586942)，精確合併SHA均成功。
- 公網核驗：[39370841520 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39370841520/artifacts/12243690910)；HTML SHA256 `825bc9dd04b9461eadc572f36469dacbf6178ea50b7a39a807c14f837a3eec5f`。
- 圖片：[完整官方原圖artifact12241093652](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39370841520/artifacts/12241093652)
- 保留限制：93 張限定範圍的原圖覆核不等於所有場景都已人工查看；另 87 張場景未逐張人工覆核。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第8波 · T762 · v14.55 · 正式發布

[PR #44](https://github.com/lijiabao1998/GlimmerTown-lab/pull/44) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T762-british-wave08-care.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave08-art036.js)

合併SHA：[`e195002da691b33acc1f3a2c426aba4c87c8c42d`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/e195002da691b33acc1f3a2c426aba4c87c8c42d)

1. **芬斯伯里健康中心**（Finsbury Health Centre）— `wave08/finsbury`；bld.24_1_440–443
2. **切爾西皇家醫院**（Royal Hospital Chelsea）— `wave08/chelsea`；bld.24_1_444–447
3. **溫徹斯特聖十字醫院**（Hospital of St Cross Winchester）— `wave08/stcross`；bld.24_1_448–451
4. **考文垂福特醫院**（Fords Hospital Coventry）— `wave08/fords`；bld.24_1_452–455
5. **格林威治三一醫院**（Trinity Hospital Greenwich）— `wave08/trinity`；bld.24_1_456–459
6. **巴斯皇家礦泉醫院**（Royal Mineral Water Hospital Bath）— `wave08/mineral`；bld.24_1_460–463
7. **鄧迪瑪姬關懷中心**（Maggies Dundee）— `wave08/dundee`；bld.24_1_464–467
8. **里茲瑪姬關懷中心**（Maggies Leeds Yorkshire）— `wave08/leeds`；bld.24_1_468–471
9. **曼徹斯特瑪姬關懷中心**（Maggies Manchester）— `wave08/manchester`；bld.24_1_472–475
10. **牛津瑪姬關懷中心**（Maggies Oxford）— `wave08/oxford`；bld.24_1_476–479

- 最後head CI：[pull_request 39389227926 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39389227926)；[push 39389223616 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39389223616)
- 完整原生：[39387488865；首次 21/21 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39387488865).
- 正式發布：[main CI 39391579412](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39391579412)；[自動Pages 39392366175](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39392366175)，精確合併SHA均成功。
- 公網核驗：[39387488865 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39387488865/artifacts/12249753920)；HTML SHA256 `dcf504d8530751e1f77e0be4145b26c4ab2d3d3c43fb55865ce939900d984aed`。
- 圖片：[完整官方原圖artifact12248525034](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39387488865/artifacts/12248525034)
- 保留限制：另 103 張場景未逐張人工覆核；公開目錄截圖只有首屏，十列及 40 sprite 由 DOM 與精靈資料核驗，不冒稱已人工看遍捲動列。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第9波 · T763 · v14.56 · 正式發布

[PR #45](https://github.com/lijiabao1998/GlimmerTown-lab/pull/45) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T763-british-wave09-civic-justice.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave09-art037.js)

合併SHA：[`3e33523305401ea258e24204ea7218345a6dc268`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/3e33523305401ea258e24204ea7218345a6dc268)

1. **貝爾法斯特市政廳**（Belfast City Hall）— `wave09/belfast`；bld.24_1_480–483
2. **曼徹斯特市政廳**（Manchester Town Hall）— `wave09/manchester`；bld.24_1_484–487
3. **里茲市民會堂**（Leeds Civic Hall）— `wave09/leeds`；bld.24_1_488–491
4. **紐卡索市政中心**（Newcastle Civic Centre）— `wave09/newcastle`；bld.24_1_492–495
5. **倫敦南岸市政廳（2002）**（London City Hall South Bank 2002）— `wave09/london`；bld.24_1_496–499
6. **蘇格蘭議會大樓**（Scottish Parliament Holyrood）— `wave09/holyrood`；bld.24_1_500–503
7. **薩克斯特德行會廳**（Thaxted Guildhall）— `wave09/thaxted`；bld.24_1_504–507
8. **阿賓登郡會堂**（Abingdon County Hall）— `wave09/abingdon`；bld.24_1_508–511
9. **米德塞克斯行會廳**（Middlesex Guildhall）— `wave09/middlesex`；bld.24_1_512–515
10. **皇家司法院**（Royal Courts of Justice）— `wave09/rcj`；bld.24_1_516–519

- 最後head CI：[pull_request 39416337857 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39416337857)；[push 39416331454 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39416331454)
- 完整原生：[39414702723；首次 21/21 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39414702723).
- 正式發布：[main CI 39420684419](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39420684419)；[自動Pages 39421524540](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39421524540)，精確合併SHA均成功。
- 公網核驗：[39414702723 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39414702723/artifacts/12264470592)；HTML SHA256 `2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60`。
- 圖片：[完整官方原圖artifact12260459914](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39414702723/artifacts/12260459914)
- 保留限制：另 103 張場景未逐張人工覆核。London 夜玻璃偏亮、Middlesex 雕塑及 Thaxted 木構細節在原生尺寸偏弱；Holyrood 僅選 committee towers。
- 保留限制：建築參考照片各有取景及解析度限制，詳原 T 卡與 provenance。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第10波 · T764 · v14.57 · 正式發布

[PR #46](https://github.com/lijiabao1998/GlimmerTown-lab/pull/46) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T764-british-wave10-commerce-markets.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave10-art038.js)

合併SHA：[`8fd1d5e0ec98c729369bebffdd329e93cead93ba`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/8fd1d5e0ec98c729369bebffdd329e93cead93ba)

1. **里茲穀物交易所**（Leeds Corn Exchange）— `wave10/leedsCorn`；bld.24_1_520–523
2. **達靈頓市場與鐘塔**（Darlington Market and Clock Tower）— `wave10/darlington`；bld.24_1_524–527
3. **哈利法克斯自治市集**（Halifax Borough Market）— `wave10/halifax`；bld.24_1_528–531
4. **切斯特主教萊德雙宅**（Bishop Lloyd's House Chester）— `wave10/bishoplloyd`；bld.24_1_532–535
5. **伯靈頓拱廊街**（Burlington Arcade）— `wave10/burlington`；bld.24_1_536–539
6. **萊斯特銀拱廊**（Silver Arcade Leicester）— `wave10/silver`；bld.24_1_540–543
7. **騎士橋百貨大樓**（Harrods historic department store）— `wave10/harrods`；bld.24_1_544–547
8. **倫敦都鐸百貨大樓**（Liberty Tudor Building）— `wave10/liberty`；bld.24_1_548–551
9. **唐卡斯特合作社百貨**（Doncaster Co-operative Emporium Danum House）— `wave10/danum`；bld.24_1_552–555
10. **格拉斯哥柳樹茶室**（Willow Tea Rooms 217 Sauchiehall Street）— `wave10/willow`；bld.24_1_556–559

- 最後head CI：[pull_request 39591643212 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39591643212)；[push 39591636699 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39591636699)
- 完整原生：[39588718300；首次 21/21 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39588718300).
- 正式發布：[main CI 39593334331](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39593334331)；[自動Pages 39594173226](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39594173226)，精確合併SHA均成功。
- 公網核驗：[39588718300 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39588718300/artifacts/12342842832)；HTML SHA256 `9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852`。
- 圖片：[完整官方原圖artifact12339574216](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39588718300/artifacts/12339574216)
- 保留限制：Silver 後立面照片只有 600×337，細雕、精確後窗數及被遮屋頂未解；Bishop 等細節仍有原生解析度限制。
- 保留限制：沒有把 275 張供電 PNG 的雜湊核對說成人工逐圖審閱；兩張施工 PNG 跨 run 不同的限制保留。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第11波 · T765 · v14.58 · 正式發布

[PR #47](https://github.com/lijiabao1998/GlimmerTown-lab/pull/47) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T765-british-wave11-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave11-art039.js)

合併SHA：[`08311d9a87f4bcd76de26a28fbac4a584f663bd0`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/08311d9a87f4bcd76de26a28fbac4a584f663bd0)

1. **蕨庭閱覽屋**（Bracken Fold Reading House）— `wave11/brackenread`；bld.24_1_560–563
2. **銅溪蕨室**（Copperbrook Fern Court）— `wave11/ferncourt`；bld.24_1_564–567
3. **鴉木會館**（Rookwood Lantern Hall）— `wave11/rookhall`；bld.24_1_568–571
4. **石褶交易亭**（Cobblefold Exchange Pavilion）— `wave11/cobblefold`；bld.24_1_572–575
5. **苔門展亭**（Mossgate Ticket Lodge）— `wave11/mossgate`；bld.24_1_576–579
6. **果巷工藝館**（Orchardcross Workshop）— `wave11/orchardcraft`；bld.24_1_580–583
7. **芬澤船屋展亭**（Pennyfen Boathouse Pavilion）— `wave11/pennyfen`；bld.24_1_584–587
8. **柳澤樂亭**（Willowmere Music Lodge）— `wave11/willowmusic`；bld.24_1_588–591
9. **山楂織屋**（Hawthorn Loom House）— `wave11/hawthornloom`；bld.24_1_592–595
10. **荊井瞭望屋**（Briarwell Beacon House）— `wave11/briarwatch`；bld.24_1_596–599

- 最後head CI：[pull_request 40078439833 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40078439833)；[push 40078436852 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40078436852)
- 完整原生：[40077064339；首次 27/27 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077064339).
- 正式發布：[main CI 40078958810](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40078958810)；[自動Pages 40079298098](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40079298098)，精確合併SHA均成功。
- 公網核驗：[40077064339 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077064339/artifacts/12554776889)；HTML SHA256 `378eba7af7c2cdff7e2cd1cb02ef0ba1ea219c921260a622be5bf35d200e9fb3`。
- 圖片：[完整官方原圖artifact12553277627](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077064339/artifacts/12553277627)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：作者所看 80 日夜原圖、3 接觸表、10 近景及選取場景不等於 275 張供電圖、全部場景和 40 邊界圖逐張人工審閱。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第12波 · T766 · v14.59 · 正式發布

[PR #49](https://github.com/lijiabao1998/GlimmerTown-lab/pull/49) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T766-british-wave12-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave12-art040.js)

合併SHA：[`cfe03d8a54c50ffccb65a8e9cabee9d92c3da8b6`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/cfe03d8a54c50ffccb65a8e9cabee9d92c3da8b6)

1. **紫菀村郵亭**（Asterwick Post House）— `wave12/asterpost`；bld.24_1_600–603
2. **麥谷烘焙坊**（Barleycombe Bakehouse）— `wave12/barleybake`；bld.24_1_604–607
3. **蜜溪街角雜貨屋**（Honeybrook Corner Stores）— `wave12/honeygrocer`；bld.24_1_608–611
4. **狐澤消防亭**（Foxmere Engine Lodge）— `wave12/foxengine`；bld.24_1_612–615
5. **錦葵裁縫屋**（Mallowridge Sewing Rooms）— `wave12/mallowsew`；bld.24_1_616–619
6. **露岸洗衣房**（Dewbank Wash House）— `wave12/dewbankwash`；bld.24_1_620–623
7. **苜蓿種籽屋**（Cloverfold Seed Exchange）— `wave12/cloverseed`；bld.24_1_624–627
8. **薊谷育苗舍**（Thistledene Nursery）— `wave12/thistlenursery`；bld.24_1_628–631
9. **溪坳工具借用屋**（Brookhollow Tool Library）— `wave12/brooktools`；bld.24_1_632–635
10. **榛十字乳品坊**（Hazelcross Dairy Parlour）— `wave12/hazeldairy`；bld.24_1_636–639

- 最後head CI：[pull_request 40094952462 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094952462)；[push 40094948187 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094948187)
- 完整原生：[40094352758；首次 27/27 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094352758).
- 正式發布：[main CI 40095436706](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40095436706)；[自動Pages 40095825161](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40095825161)，精確合併SHA均成功。
- 公網核驗：[40094352758 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094352758/artifacts/12560159293)；HTML SHA256 `cb3bc90bcd55c9b5e65d7389d954eaebb22d21c9eba6fff5bfea72292fdba884`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-040/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-040/contact-night.png) · [完整官方原圖artifact12560575610](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094352758/artifacts/12560575610)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：未逐張人工審閱全部 113 場景及 275 供電圖；風格 lightDir 與總分下降已按連續授權披露。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第13波 · T767 · v14.60 · 正式發布

[PR #51](https://github.com/lijiabao1998/GlimmerTown-lab/pull/51) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T767-british-wave13-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave13-art041.js)

合併SHA：[`2422e951f1c964ae433693a75d2224c91bd247eb`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/2422e951f1c964ae433693a75d2224c91bd247eb)

1. **樺庭裝訂所**（Birchfold Bindery）— `wave13/birchbind`；bld.24_1_640–643
2. **燧灣測繪所**（Flintbay Survey Rooms）— `wave13/flintchart`；bld.24_1_644–647
3. **花楸鐘錶工房**（Rowanwick Clock House）— `wave13/rowanclock`；bld.24_1_648–651
4. **莎草攝影室**（Sedgewick Photographic Rooms）— `wave13/sedgephoto`；bld.24_1_652–655
5. **榆岬彩窗工坊**（Elmreach Glass Atelier）— `wave13/elmglass`；bld.24_1_656–659
6. **黑莓輪匠院**（Bramblewick Wheelwright）— `wave13/bramblewheel`；bld.24_1_660–663
7. **石楠染整屋**（Heatherfold Dye House）— `wave13/heatherdye`；bld.24_1_664–667
8. **冬青檔案館**（Hollymere Record Office）— `wave13/hollyrecords`；bld.24_1_668–671
9. **白蠟獸醫舍**（Ashcombe Veterinary House）— `wave13/ashveterinary`；bld.24_1_672–675
10. **白屈菜電報局**（Celandine Telegraph Exchange）— `wave13/celandinewire`；bld.24_1_676–679

- 最後head CI：[pull_request 40100368049 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40100368049)；[push 40100365245 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40100365245)
- 完整原生：[40099783601；首次 27/27 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40099783601).
- 正式發布：[main CI 40101009240](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40101009240)；[自動Pages 40101499998](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40101499998)，精確合併SHA均成功。
- 公網核驗：[40099783601 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40099783601/artifacts/12563735446)；HTML SHA256 `d572c96289a67889ec09e2845675717f58d8e84ca78218623fca34f41fde1064`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-041/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-041/contact-night.png) · [完整官方原圖artifact12561969225](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40099783601/artifacts/12561969225)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：產物存在或雜湊一致不等於全部人工審閱；未全看 113 場景及 275 供電圖，lightDir 與總分下降已披露。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第14波 · T768 · v14.61 · 正式發布

[PR #53](https://github.com/lijiabao1998/GlimmerTown-lab/pull/53) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T768-british-wave14-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave14-art042.js)

合併SHA：[`574cc36d48ab52c79372dd939b31110f3c2b4b9c`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/574cc36d48ab52c79372dd939b31110f3c2b4b9c)

1. **榿溪木作院**（Alderbrook Joinery Court）— `wave14/alderjoinery`；bld.24_1_680–683
2. **米爾稱量所**（Mereford Weigh House）— `wave14/mereweigh`；bld.24_1_684–687
3. **蘆橋公共盥洗亭**（Rushford Public Conveniences）— `wave14/rushfordlav`；bld.24_1_688–691
4. **溪石閥房**（Beckstone Valve House）— `wave14/beckvalve`；bld.24_1_692–695
5. **原丘配電小站**（Woldwick Electricity House）— `wave14/woldswitch`；bld.24_1_696–699
6. **榆原石匠棚**（Elmfield Mason’s Lodge）— `wave14/elmstone`；bld.24_1_700–703
7. **芬溝箍桶坊**（Fenditch Cooperage）— `wave14/fencooper`；bld.24_1_704–707
8. **雲雀印刷所**（Larkfield Printing Rooms）— `wave14/larkprint`；bld.24_1_708–711
9. **羅登鎮殮房**（Rowden Mortuary Lodge）— `wave14/rowdenmortuary`；bld.24_1_712–715
10. **水芥儲冰舍**（Cresswick Ice Store）— `wave14/cressice`；bld.24_1_716–719

- 最後head CI：[pull_request 40106548894 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40106548894)
- 完整原生：[40105444391；首次 27/27 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40105444391).
- 正式發布：[main CI 40109306236](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40109306236)；[自動Pages 40109993003](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40109993003)，精確合併SHA均成功。
- 公網核驗：[40105444391 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40105444391/artifacts/12566617936)；HTML SHA256 `2da67e4b29c7ffcab10523b0897637a276adb28de5ce40816ba43ccfd0c329ea`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-042/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-042/contact-night.png) · [完整官方原圖artifact12564576379](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40105444391/artifacts/12564576379)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：113 場景中的 3 組施工時間差異已實看及披露；8 組守門完整畫布仍嚴格全等，未放寬門檻。未全看 113 場景及 275 供電圖。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第15波 · T769 · v14.62 · 正式發布

[PR #55](https://github.com/lijiabao1998/GlimmerTown-lab/pull/55) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/T769-british-wave15-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/british-wave15-art043.js)

合併SHA：[`9869b268ec7d93c4782d067d61ebd8123d36f07e`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/9869b268ec7d93c4782d067d61ebd8123d36f07e)

1. **蘆谷果酒壓榨屋**（Reedcombe Cider House）— `wave15/reedcider`；bld.24_1_720–723
2. **池原羽球會館**（Pondwick Badminton Hall）— `wave15/pondbadminton`；bld.24_1_724–727
3. **林丘童軍會舍**（Holtbank Scout Lodge）— `wave15/holtscout`；bld.24_1_728–731
4. **茴庭蜂蜜工房**（Fennelfold Honey House）— `wave15/fennelhoney`；bld.24_1_732–735
5. **白蠟手球院**（Ashwick Fives Court）— `wave15/ashfives`；bld.24_1_736–739
6. **銅原鑄鐘坊**（Brassfield Bell Foundry）— `wave15/brassbell`；bld.24_1_740–743
7. **川續斷製帽樓**（Teaselwick Hatters’ House）— `wave15/teaselhat`；bld.24_1_744–747
8. **柳條編籃工房**（Withebrook Basket House）— `wave15/withebasket`；bld.24_1_748–751
9. **荊原射藝會舍**（Gorsewick Archery Lodge）— `wave15/gorsearchery`；bld.24_1_752–755
10. **溪環健行客舍**（Rillmere Ramblers’ Lodge）— `wave15/rillramblers`；bld.24_1_756–759

- 最後head CI：[pull_request 40115943392 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40115943392)；[push 40115938673 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40115938673)
- 完整原生：[40115105323；首次 27/27 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40115105323).
- 正式發布：[main CI 40117098924](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40117098924)；[自動Pages 40117952664](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40117952664)，精確合併SHA均成功。
- 公網核驗：[40115105323 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40115105323/artifacts/12569518122)；HTML SHA256 `cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-043/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/6284b854e18b12188d193652e9aa69cb7022dfea/docs/assets/GPT-043/contact-night.png) · [完整官方原圖artifact12567579997](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40115105323/artifacts/12567579997)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：113 場景有 32 像素地塊細節及 2466 像素施工階段差異已成對實看及保留；32 像素差異的精確時間原因未獨立定位。
- 保留限制：未全看 275 供電圖，不把 145 張獨立原圖覆核當成全部圖片或業主批准；lightDir 與總分下降已披露。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第16波 · T770 · v14.63 · 正式發布

[PR #57](https://github.com/lijiabao1998/GlimmerTown-lab/pull/57) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/3d2220d26ec0e132491280932edb13fdbae5852a/docs/T770-british-wave16-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/3d2220d26ec0e132491280932edb13fdbae5852a/british-wave16-art044.js)

合併SHA：[`64c78c9a2bad16fd191430525f4abaf4f7226717`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/64c78c9a2bad16fd191430525f4abaf4f7226717)

1. **椴木地圖修護館**（Lindenwick Map Conservation House）— `wave16/lindenmaps`；bld.24_1_760–763
2. **鷦鷯修傘工房**（Wrenfold Umbrella Works）— `wave16/wrenumbrella`；bld.24_1_764–767
3. **繡線菊植物標本館**（Meadowsweet Herbarium）— `wave16/meadowsweetherb`；bld.24_1_768–771
4. **酸模製手套館**（Sorrelwick Glovers’ Hall）— `wave16/sorrelglove`；bld.24_1_772–775
5. **塔瑪水位量測屋**（Tamar Water-Gauge House）— `wave16/tamargauge`；bld.24_1_776–779
6. **鴉井鋼琴工房**（Rookswell Piano Workshop）— `wave16/rookspiano`；bld.24_1_780–783
7. **鹿谷皮革整飾樓**（Hartcombe Currier’s Loft）— `wave16/hartcurrier`；bld.24_1_784–787
8. **紅豆草製蠟屋**（Sainfoin Wax House）— `wave16/sainwax`；bld.24_1_788–791
9. **蕨橋鞋楦工房**（Brackenbridge Lastmakers’ House）— `wave16/brackenlast`；bld.24_1_792–795
10. **兔林樂器箱工房**（Harewood Instrument-Case Works）— `wave16/harecase`；bld.24_1_796–799

- 最後head CI：[pull_request 40124785577 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40124785577)；[push 40124782625 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40124782625)
- 完整原生：[40123355347；首次 28/28 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40123355347).
- 正式發布：[main CI 40125688839](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40125688839)；[自動Pages 40126187059](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40126187059)，精確合併SHA均成功。
- 公網核驗：[40123355347 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40123355347/artifacts/12573522220)；HTML SHA256 `6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/3d2220d26ec0e132491280932edb13fdbae5852a/docs/assets/GPT-044/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/3d2220d26ec0e132491280932edb13fdbae5852a/docs/assets/GPT-044/contact-night.png) · [完整官方原圖artifact12572552121](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40123355347/artifacts/12572552121)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：C1 標準來源指紋與原生 workflow 標記的首次失敗已保留；C1 不是全綠，後續驗收不抹除這些紀錄。
- 保留限制：原 113 場景跨 run 有施工快取與 Linden 邊緣 96 個小地面像素差異，不宣稱全部跨 run 相等；8 組歷史 BASE／HEAD 整幀仍相等。新增自然固定 12 幀施工證據已驗十棟，第 8 幀起 pending 為 0；冷兩 draw 與單次 flush 診斷分開保留，不以後者替代正常路徑。
- 保留限制：已記錄的 91 預覽、113 場景及 19 施工原圖檢視不等於全部 275 供電 PNG 逐張人工審閱，也不等於業主批准。七軸及總分無下降。
- 保留限制：實體手機、Safari、行動 GPU 與觸控未測；桌面 Chromium 結果不外推實體裝置。

### 第17波 · T771 · v14.64 · 正式發布

[PR #59](https://github.com/lijiabao1998/GlimmerTown-lab/pull/59) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a5154857887ecf1c6e21b049da6c6d19fe117c4e/docs/T771-british-wave17-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a5154857887ecf1c6e21b049da6c6d19fe117c4e/british-wave17-art045.js)

合併SHA：[`3b123dbe0cb2f635a1051b398604f8b49c9b0a25`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/3b123dbe0cb2f635a1051b398604f8b49c9b0a25)

1. **矢車菊公共調解館**（Knapwell Civic Mediation Rooms）— `wave17/knapmediation`；bld.24_1_800–803
2. **蛇舌蕨光學工房**（Adderwick Optical Works）— `wave17/adderlens`；bld.24_1_804–807
3. **蓍草點字工房**（Yarrowfen Braille House）— `wave17/yarrowbraille`；bld.24_1_808–811
4. **接骨木辯論會堂**（Elderwick Debating Hall）— `wave17/elderdebate`；bld.24_1_812–815
5. **柳溪口述歷史館**（Osierbrook Oral History Hall）— `wave17/osieroral`；bld.24_1_816–819
6. **雲澤氣象學舍**（Cloudmere Weather School）— `wave17/cloudmereweather`；bld.24_1_820–823
7. **萌林自然講習館**（Coppicefield Nature Lecture Rooms）— `wave17/coppicelecture`；bld.24_1_824–827
8. **貝原市民陳情室**（Shellwick Civic Petition Rooms）— `wave17/shellwickpetitions`；bld.24_1_828–831
9. **絨谷戲服修護亭**（Velvetcombe Costume Pavilion）— `wave17/velvetcostume`；bld.24_1_832–835
10. **金雀翻譯事務所**（Broomfield Translation Rooms）— `wave17/broomtranslations`；bld.24_1_836–839

- 最後head CI：[pull_request 40131345691 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40131345691)；[push 40131342921 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40131342921)
- 完整原生：[40130557188；首次 28/28 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130557188).
- 正式發布：[main CI 40131928075](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40131928075)；[自動Pages 40132432643](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40132432643)，精確合併SHA均成功。
- 公網核驗：[40130557188 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130557188/artifacts/12575163694)；HTML SHA256 `c4797f3f1898af5dc51080f2a19eae072e21cbd8e8b03d6ffd54a0759bb7d6ff`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a5154857887ecf1c6e21b049da6c6d19fe117c4e/docs/assets/GPT-045/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a5154857887ecf1c6e21b049da6c6d19fe117c4e/docs/assets/GPT-045/contact-night.png) · [完整官方原圖artifact12574139398](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130557188/artifacts/12574139398)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：C1 新 045 自檢誤選舊 760..799，造成 undefined-id；供電未執行，不能算通過。後續只修新選取器為 800..839 並加回歸。另有未宣告 40 指紋葉的首紅，僅採官方原始 fp 產物；後續 C2/C3 全綠不抹除 C1 紀錄。
- 保留限制：發布版 C3 的 91 預覽全與 C2 相同；113 場景中 112 相同，冷施工晚期有 1 像素差異；19 施工圖中 17 相同，兩固定終點含既有環境動畫差異。三組差異原圖已有記錄的成對檢視，不宣稱全部跨 run 相等。
- 保留限制：自然固定 12 幀與獨立單次 flush 66 幀終點均可見十棟；原冷兩 draw 最後一棟仍 pending，不是完整建造就緒，也不以 flush 取代自然路徑。
- 保留限制：歷史圖審記錄為 148 張 C1 與 9 張有差異 C2 原圖，C3 另核三張差異及其對照。本次清冊只核來源、位元組與雜湊，沒有重新人工審圖。275 供電 PNG 未全數人工逐看；遠景既有 LOD 不是近景細節驗收。
- 保留限制：Knapwell 斜院在 r0/r2 接近側視，不與 r1/r3 同等清楚；Cloudmere 小尺寸圖只能支持孔緣／凹入視覺，完整孔深另由幾何來源支持。不可把這些像素限制改稱每個細節皆可見。
- 保留限制：未宣稱業主圖審批准；實體手機、Safari、行動 GPU 與觸控未測，桌面 Chromium 結果不外推實體裝置。

### 第18波 · T772 · v14.65 · 正式發布

[PR #61](https://github.com/lijiabao1998/GlimmerTown-lab/pull/61) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a2718a7a3ee17445d4a23ea40d22398fb4e12295/docs/T772-british-wave18-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a2718a7a3ee17445d4a23ea40d22398fb4e12295/british-wave18-art046.js)

合併SHA：[`a2718a7a3ee17445d4a23ea40d22398fb4e12295`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/a2718a7a3ee17445d4a23ea40d22398fb4e12295)

1. **澤花追思館**（Merebloom Memorial Hall）— `wave18/merememorial`；bld.24_1_840–843
2. **莢蒾蕾絲學舍**（Guelderfield Lace School）— `wave18/guelderlace`；bld.24_1_844–847
3. **金雀溪映畫館**（Gorsebrook Picture House）— `wave18/gorsepicture`；bld.24_1_848–851
4. **聚合草救護車舍**（Comfreyford Ambulance House）— `wave18/comfreyambulance`；bld.24_1_852–855
5. **馬鬱蘭社區廚房**（Marjoram Community Kitchen）— `wave18/marjoramkitchen`；bld.24_1_856–859
6. **琉璃苣牙科診所**（Borage Dental Rooms）— `wave18/boragedental`；bld.24_1_860–863
7. **牛膝草軟墊工房**（Hyssop Upholstery Works）— `wave18/hyssopupholstery`；bld.24_1_864–867
8. **白鮮地質會舍**（Dittany Geological Society Rooms）— `wave18/dittanygeology`；bld.24_1_868–871
9. **洋甘菊故事小屋**（Chamomile Story Cottage）— `wave18/chamomilestory`；bld.24_1_872–875
10. **香桃木無線電會舍**（Myrtlefield Wireless Club）— `wave18/myrtlewireless`；bld.24_1_876–879

- 最後head CI：[pull_request 40148608072 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40148608072)；[push 40148605227 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40148605227)
- 完整原生：[40148042386；首次 28/28 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40148042386).
- 正式發布：[main CI 40149354922](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40149354922)；[自動Pages 40149830935](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40149830935)，精確合併SHA均成功。
- 公網核驗：[40148042386 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40148042386/artifacts/12582083285)；HTML SHA256 `0ec9f7cbe03139dd93d607e7b343911dce4024028b40a16a4c88439dca23390c`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a2718a7a3ee17445d4a23ea40d22398fb4e12295/docs/assets/GPT-046/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/a2718a7a3ee17445d4a23ea40d22398fb4e12295/docs/assets/GPT-046/contact-night.png) · [完整官方原圖artifact12581660256](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40148042386/artifacts/12581660256)
- 保留限制：原創英式設計，不宣稱真實地標復刻。
- 保留限制：C1 未宣告四十指紋葉的首紅、C2 機器全綠但 Marjoram 屋頂視覺失敗、C3 修屋頂仍視覺失敗均保留。C4 才修復屋頂；僅採實際標準官方 CI 的原始 fp/style 檔，不自行製造分數或放寬守門。
- 保留限制：C6 的 91 預覽與 C5 全相同；113 場景中 111 相同，edge-merememorial-r0 與 construction-late 有差異。19 施工圖中 14 張有差異。新增實看為 14 施工原圖及 2 場景原圖，兩張 C5 場景對照不重算新圖。
- 保留限制：C6 原冷兩 draw construction-late 有 Chamomile、Myrtle 兩個裸空地塊。自然固定 12 幀與獨立單次 flush 66 幀終點均可見十個施工主體，但不替代該原圖、不代表立即冷快取就緒；原生灰色施工主體和吊車仍分開披露。
- 保留限制：275 供電 PNG 未全數人工逐看；遠景既有 LOD 地塊標記不能作近景建築細節驗收。此清冊沒有重新人工審閱全圖；發布後 menu、city、catalog 三張原圖實看由發布負責者另有回報，四張公開 PNG 在此僅核位元組與 SHA256。
- 保留限制：不冒稱業主圖審批准、實體手機、Safari、行動 GPU 或觸控驗證；CI Ubuntu 桌面 Chromium 效能不得外推硬體。倒金字塔屋頂只是可讀封閉幾何，不宣稱物理排水認證。
- 保留限制：提交的 release-verification.notPublishedYet=true 與卡片中的待發布字樣是歷史候選狀態；最新精確合併、main CI、Pages 及正式公網原報告另行建立已發布事實。

### 第19波 · T773 · v14.66 · 正式發布

[PR #63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/4346a96543b01ffd47ac3696480661b5de8638ae/docs/T773-british-wave19-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/4346a96543b01ffd47ac3696480661b5de8638ae/british-wave19-art047.js)

合併SHA：[`4346a96543b01ffd47ac3696480661b5de8638ae`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/4346a96543b01ffd47ac3696480661b5de8638ae)

1. **衛矛果牆工舍**（Spindle Fruit-Wall Workshop）— `wave19/spindlefruit`；bld.24_1_880–883
2. **龍芽草樣式廊館**（Agrimony Pattern Gallery）— `wave19/agrimonypattern`；bld.24_1_884–887
3. **啤酒花乾燥館**（Hopsedge Drying House）— `wave19/hopdrying`；bld.24_1_888–891
4. **艾菊柱式風車屋**（Tansy Post-Mill House）— `wave19/tansymill`；bld.24_1_892–895
5. **馬鞭草演奏亭**（Vervain Recital Shell）— `wave19/vervainrecital`；bld.24_1_896–899
6. **紅花坡穀倉**（Redcamp Bank Barn）— `wave19/campionbarn`；bld.24_1_900–903
7. **車葉草石墩糧倉**（Woodruff Staddle Granary）— `wave19/woodruffgrain`；bld.24_1_904–907
8. **貓薄荷廊橋**（Catmint Covered Footbridge）— `wave19/catmintbridge`；bld.24_1_908–911
9. **長春花練鐘室**（Periwinkle Bell Practice Room）— `wave19/periwinklebell`；bld.24_1_912–915
10. **婆婆納木料風乾棚**（Speedwell Timber-Seasoning Loft）— `wave19/speedwellseasoning`；bld.24_1_916–919

- 最後head CI：[push 40161023304 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40161023304)；[pull_request 40161026731 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40161026731)
- 完整原生：[40160465127；首次 28/28 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127).
- 正式發布：[main CI 40162795551](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40162795551)；[自動Pages 40163187956](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40163187956)，精確合併SHA均成功。
- 公網核驗：[40160465127 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127/artifacts/12587227279)；HTML SHA256 `3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/4346a96543b01ffd47ac3696480661b5de8638ae/docs/assets/GPT-047/contact-day.png) · [完整官方原圖artifact12586705739](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127/artifacts/12586705739)
- 保留限制：No physical-phone, Safari or hardware touch validation claimed.
- 保留限制：Not all 275 power-state PNGs were individually reviewed by humans; exact review scope is retained in the linked visual review.
- 保留限制：Vervain僅依業主B批准 Sentinel_652d4a1b964c8191a3072e1de7366997（2026-10-25 03:34 UTC）改成較高、較淺真半橢球；T773完整保留原首卡及C1–C7失敗，不用批准替代工程驗收。

### 第20波 · T774 · v14.67 · 正式發布

[PR #64](https://github.com/lijiabao1998/GlimmerTown-lab/pull/64) · [完整T卡](https://github.com/lijiabao1998/GlimmerTown-lab/blob/5fc1718845a97b74fea3c325bb5343ed904c2db5/docs/T774-british-wave20-original.md) · [原始美術來源](https://github.com/lijiabao1998/GlimmerTown-lab/blob/5fc1718845a97b74fea3c325bb5343ed904c2db5/british-wave20-art048.js)

合併SHA：[`533d83862015dbefeb855f4ce07e68f13d27d0b1`](https://github.com/lijiabao1998/GlimmerTown-lab/commit/533d83862015dbefeb855f4ce07e68f13d27d0b1)

1. **毛地黃鄉約館**（Foxglove Charter House）— `wave20/foxglovecharter`；bld.24_1_920–923
2. **銀葉委陵菜高山植物屋**（Silverweed Alpine House）— `wave20/silverweedalpine`；bld.24_1_924–927
3. **茜草分科學舍**（Madder Tutors' Rooms）— `wave20/maddartutors`；bld.24_1_928–931
4. **芒柄花道鹽庫**（Restharrow Road-Salt Store）— `wave20/restharrowsalt`；bld.24_1_932–935
5. **水蘇木偶工藝館**（Betony Marionette Rooms）— `wave20/betonymarionette`；bld.24_1_936–939
6. **地榆露臺講習所**（Burnet Terrace Teaching House）— `wave20/burnetterrace`；bld.24_1_940–943
7. **玄參水彩工房**（Figwort Watercolour Rooms）— `wave20/figwortcolour`；bld.24_1_944–947
8. **香花芥三山牆工藝館**（Damewort Three-Gable Cruck Hall）— `wave20/damewortcruck`；bld.24_1_948–951
9. **琉璃繁縷交巷閱覽館**（Pimpernel Cross-Lane Reading Rooms）— `wave20/pimpernelcross`；bld.24_1_952–955
10. **紫堇馬力棚穀舍**（Fumitory Horse-Gin Barn）— `wave20/fumitorygin`；bld.24_1_956–959

- 最後head CI：[push 40169211738 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169211738)；[pull_request 40169214826 success](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169214826)
- 完整原生：[40166524238；首次 29/29 成功](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238).
- 正式發布：[main CI 40169741555](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40169741555)；[自動Pages 40170096579](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40170096579)，精確合併SHA均成功。
- 公網核驗：[40166524238 原始瀏覽器／HTTP證據](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238/artifacts/12589682789)；HTML SHA256 `debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`。
- 圖片：[contact-day.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/5fc1718845a97b74fea3c325bb5343ed904c2db5/docs/assets/GPT-048/contact-day.png) · [contact-night.png](https://github.com/lijiabao1998/GlimmerTown-lab/blob/5fc1718845a97b74fea3c325bb5343ed904c2db5/docs/assets/GPT-048/contact-night.png)
- 保留限制：No physical-phone, Safari or hardware touch validation claimed.
- 保留限制：Not all 275 power-state PNGs were individually reviewed by humans; exact review scope is retained in the linked visual review.
- 保留限制：Stop after wave20; wave21 is not authorized.
- 保留限制：原卡及06:07 checkpoint的待發布文字是歷史記錄；正式狀態以本次精確合併、mainCI、自動Pages及公開Chromium收據為準。
