# GPT-038：第十波十座有考據的英式商貿與市集建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave10-038`；唯一開工 BASE 是最新遠端 main `3e33523305401ea258e24204ea7218345a6dc268`（v14.56／T763／r210），tree `2e5b1cc10b677c210a5ed7b25a276b766b53e10f`。本卡先單獨提交並核對遠端，第一筆相對 BASE 只新增本卡，成功之前不開始新美術。原第九波目錄、分支、原圖及發布證據保留，不覆蓋 Claude 或其他寫入者。
- **首提交凍結唯一 fp 家族：`bld`。** 恰好新增 `bld.24_1_520..559` 共 40 葉＝10 款×4 原生幾何向。這 40 鍵在 BASE 均空缺。原 3743 葉、165 個其他家族、blocks1728／CRC `5ef6eb67`、env 全部零變；bld1379→1419、總葉3743→3783。共享 rasterizer／色盤／全局光影／人口密度／規則／既有守門及判準不變。
- 對應 main 方向最上方待辦「第十波十座英式商貿與市集建築」。方向原話（2026-10-16）：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」本輪依 AGENTS §3、§7 的原連續方向施工，不重建方向 PR、不改開關、排程或 GitHub 設定。PR45 的具體發布批准只屬第九波，不當成新一輪的平台批准；遇新平台拒絕保存完整回應、停止該動作，不改路徑繞過。
- 開工核對：main 仍為上述 SHA，方向「運行」，沒有開放中的 PR，遠端沒有本分支；GPT 最新卡號037。既有 Claude 等分支保留，不改它們。本容器 `/workspace/.agents`、`/workspace/.codex` 為空，倉庫沒有 `.agents/skills`；已讀 AGENTS、AUTORUN、CLAUDE、DECISIONS、《迭代不改壞標準》及方向檔。
- **正式計數仍9／20波、90棟**，不計 T748 歷史15棟。開工 BASE 的主線 [CI39420684419](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39420684419) 與既有自動 [Pages39421524540](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39421524540) 成功，版本 v14.56／T763。BASE index 為11,296,190 bytes／SHA256 `2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60`／Git blob `69a3851fb58fab4aa66616941d92492220b17a33`；原證據獨立保存。這些只定義本輪開工基準，不是第十波測試結果。
- BASE root166家族／3743葉；bld1379葉／CRC `04c1b03b`。七軸 palette1、hardEdge0.9517610664359899、lightDir0.8201595358955766、shade1、density1、nightRule0.9888712718250431、variants1，total0.9658。原 fp.json408024 bytes／SHA256 `71ba078a6ad781ece3575fb9172e0e92e966d7fb4af1d6ebbac9f0994a6ef5e7`；style.json73171 bytes／SHA256 `008429d332b3c2fd1ec9a56a7dd3801f8146f93e955c2386a5947f314341db13`。兩份 metadata 仍14.55／T762，是原 CI 產物，不手改。
- 遊戲、Chrome、像素、fp、保存及效能只在 GitHub Actions；本地僅 Git／靜態來源與語法／JSON／原 bytes／雜湊／人工看原圖。自用埠8199、存檔slot3，不碰業主存檔。035／036／037臨時 workflow 均保持缺席；本輪若需038，只綁本分支、`contents: read`，依規則在最後完整成功之後純刪。

## 十款候選與一手文字考據（原照片核實後才畫）

全部沿用原生 k24／lv1／2×2／$2000 的外觀載體與既有解鎖、觀光、就業、維護、undo／redo、保存，不創造市集交易額、金融／購物服務、產業鏈、價格或容量玩法。量體為有史料依據的原創像素轉譯，不嵌入照片，不宣稱測繪複製、室內可進入或現況營業。照片未取得或未實看不能標「考據完成」；繪製前可因證據不足調整候選，須記具體原因，10款／40新鍵／唯一家族及下列驗收均不減少。

| 起始v | 原型與已讀一手頁 | 結構辨識點、排重及照片待核範圍 |
|---|---|---|
| 520 | [Leeds Corn Exchange，HE1255771](https://historicengland.org.uk/listing/the-list/list-entry/1255771) | 橢圓平面、雙層密排圓拱石窗、半圓柱廊入口、灰板岩橢圓穹頂與單側採光帶。不同於 Manchester Royal Exchange 的矩形三穹頂、Castle Cary 小圓屋及 A la Ronde 多邊形住宅；照片需核整體橢圓與屋頂。 |
| 524 | [Darlington Market Building，HE1322944](https://historicengland.org.uk/listing/the-list/list-entry/1322944)／[Clock Tower，HE1121224](https://historicengland.org.uk/listing/the-list/list-entry/1121224) | Waterhouse市場五開間、各自屋脊及升高玻璃／百葉頂、鑄鐵圓拱玻璃樓層，北側相鄰七段義式哥德鐘塔、角尖塔與高板岩尖頂。選取市場與鐘塔組，不挪用 Old Town Hall；不同於 Manchester 三角庭院高塔及 St Albans 獨塔。 |
| 528 | [Halifax Borough Market，HE1281516](https://historicengland.org.uk/listing/the-list/list-entry/1281516) | 三側店屋圍合的有蓋市場、北向細長玻璃拱廊、交叉屋面中央八角玻璃燈亭；石立面山牆老虎窗及不同高低外翼。與同城 Piece Hall 開放大院、Burslem單一玻璃廳、Leadenhall開放院落區分；照片需核外立面及可辨屋頂。 |
| 532 | [Chester Bishop Lloyd's House，HE1376439](https://historicengland.org.uk/listing/the-list/list-entry/1376439) | 兩個並列臨街山牆、街層店面／樓上 Rows 開放廊道、雕木欄板與上層凸窗、板岩雙坡頂。不是整座主教宮；層層街廊與窄高雙宅須和 Lavenham 落地長廳、Bessie Surtees 住宅、Thaxted 雙懸挑柱架不同。 |
| 536 | [London Burlington Arcade，HE1066338](https://historicengland.org.uk/listing/the-list/list-entry/1066338) | 狹長店鋪雙列與有天窗的帳篷形頂、連續跨拱；Piccadilly石造上層開敞柱廊及後改大扁拱入口，兩端入口不同。非圓筒穹頂假設，不複製 Leadenhall 院落或 Campden 開放石拱廳；照片需核正入口和頂部。 |
| 540 | [Leicester Silver Arcade，HE1074775](https://historicengland.org.uk/listing/the-list/list-entry/1074775) | 1891多層商店廊道、中央採光井與玻璃頂；Silver Street石造正面大圓拱、兩側折角凸窗、上部小方尖飾，Cank Street後面有方亭。不同於低長 Burlington、Arnos Grove 單圓廳；不把室內三層鐵廊誇稱全外觀可見。 |
| 544 | [Harrods，HE1294346](https://historicengland.org.uk/listing/the-list/list-entry/1294346) | 粉米色赤陶、低層大展示窗／上部巨柱式多層長立面、中央八角肋穹頂與頂亭、角部孟莎頂／銅覆魚鱗面和老虎窗。不同於 Belfast 公共院落或 Alexandra 展廳；不借用商標招牌、不到處添無載體夜光。 |
| 548 | [Liberty Tudor Building，HE1357064](https://historicengland.org.uk/listing/the-list/list-entry/1357064) | 1922–24四層木構百貨與山牆閣樓、密木框格／凸窗、多個採光井與陡瓦頂、群煙囪及局部石樓梯塔；不是 Little Marlborough 倉庫。與 Little Moreton、Ipswich Ancient House 的低住宅輪廓不同；只畫有外景支持的主店建築組。 |
| 552 | [Doncaster Co-operative Emporium／Danum House，HE1031509](https://historicengland.org.uk/listing/the-list/list-entry/1031509) | 1938–40鋼框五層中部／較低側翼、黃磚與淡藍Vitriolite面、中央圓弧玻璃樓梯塔、橫向窗帶與連續店面雨棚。不是泛型辦公樓、Hoover 低工廠或 Marine Court 長住宅；照片核曲角與退階。 |
| 556 | [Glasgow Willow Tea Rooms，HES LB33173](https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CLB33173) | 217 Sauchiehall Street窄三開間四層白灰泥立面、上層不等距開窗、首層弧凸鉛格窗與方格裝飾、深水平檐；背部低附屋有局部玻璃四坡頂。不是泛型單層茶館；不把先前既有英式茶室重畫或把室內家具當外景。 |

開工排重已讀 T748 與本方向九波105個具名原型，以及較早高街／河畔市場。排除已畫 Burslem、Leadenhall、Dunster、Campden、Manchester Royal Exchange、Chichester、Lavenham、Guildford、Faversham、Thaxted、Abingdon、Hoover 等原型；相似類型仍要提供真舊圖對照。名字搜尋只作初篩，不冒稱幾何排重已通過。預定比較：520→Royal Exchange260、524→Manchester484、528→PieceHall256、532→Lavenham100、536→Campden212、540→ArnosGrove208、544→Belfast480、548→Moreton104、552→Hoover316、556→Finsbury440；後續如發現比較名稱／真視角不符，修正並保留原因，不捏造舊四向。

## 凍結驗收（首提後不准改鬆）

1. **原創四向／原像素**：40向由同一世界幾何真旋轉，非鏡像、照片拉伸或只換色。每張160×196、ax80／ay194、sz2，硬像素、非空、無裁切；夜光只在日圖不透明實體。去共同鋪地後十款幾何遮罩互異，安裝圖逐像素等於獨立直接烘焙。保留80日夜原PNG、三完整contact、十near原bytes與SHA256，對照真舊款及其實際存在的視角。
2. **原生整合／至少12真首紅**：十款catalog選擇、實扣$2000、undo／退款／redo、參照格拆除／恢復、四向與舊輯切換均驗。少葉、錯尺寸、夜漏光、軟像素、裁切、空圖、幾何克隆、安裝克隆、錯收費、redo失效、合法HTML來源越界及相機凍結等至少12個真故障，第一個紅燈落目標並恢復；故障只改本波新鍵。
3. **來源邊界**：獨立Git BASE為3e335233。只剝本輪038純美術／CSS／runtime標記及唯一install點，原index逐byte相同。草稿不改三版本字／主線日誌／T號；發布階段只有GAME_VER／GAME_ANCHOR／startVersion456三個唯一字串允許改，反向還原須完整相同。共享fp／style／sheet／容量／既有模型和自檢來源及判準不改；合法越界HTML真首紅。
4. **正常模型／完整舊新保存**：BASE與HEAD正常運行，不用本波閥。seeds31／71／103各3checkpoint，全部serialize欄位及stats比較，fieldExclusions=[]，只允許實際新外觀b.v差，不刪欄／正規化。十款匹配付費操作、首次update與市長options惰性欄位保留；舊檔／新外觀各兩輪load→save全欄穩定。若發布版本改變，只准明列精確gameVer遷移且反向證明；真保存少$1首紅並恢復。
5. **完整場景／誠實圖審**：沿用57＋40狀態：日夜、四季、冬雪有無、四向、十款近遠景、地圖邊角、施工早中晚、hover及真適用倒影／行人／煙／夜燈／招牌。97狀態加16 BASE／閥關守衛畫布共113 PNG，不適用項依真原生路徑說明。作者逐張看80單圖＋3完整contact＋10near，另103張場景／守衛畫布未審就明說；實機手機／Safari／觸控不冒稱測過。
6. **完整畫布等值**：即時閥 `window.__noBritishWave038` 退回舊圖。獨立BASE對HEAD閥關8張完整1280×657畫布逐byte相同，不裁圖、不加容差。真畫布1px及保存$1故障首紅／恢復；正常模型另跑，不用閥代證正常玩法。
7. **行人／效能原門檻**：以main的probePedestrians037.cjs／probePerformance037.cjs為準，保留17原生日夜／四向遮擋例與兩真故障恢復、40組交錯BASE／HEAD median／p90、暖畫新烘焙0、30真延遲負樣本首紅並恢復。私有038副本只換新鍵／ID／精確BASE，原數值和首紅判準不改；不改舊探針、不為噪聲新增追蹤或放寬門檻。桌面Ubuntu Chrome不推論實機。
8. **fp／七軸／原bytes**：含最新main的push只新增本卡bld40，舊3743葉／165其他族／blocks1728／5ef6eb67／env零變。列bld七軸與total前後；若下降，依第二項起連續授權在卡／PR／方向如實披露，不改分或降門檻。僅採同次成功CI附件fp-rebake的fp.json／style.json原bytes，核run／head／tree／bytes／SHA及官方artifact，不重serialize、不手改metadata；採後root零差、無envLeaves警告。
9. **本輪新CI／來源實物／獨立覆核**：最新分支真smoke3／fp與原財務53項10負控制全綠。PR若重用T759同head／tree完整push，列確切來源，不當新跑三次。保留原13個原生／場景／配對／行人／效能／圖像／公開工作，另8個有界只讀工作傳輸實際index原bytes；producer逐byte核HEAD:index.html及canonical Git blob，接收端恢復完整來源重算SHA256／Git blob，獨立綁遠端tree和native manifest indexSHA。首批成功即交精確head／run／artifact IDs／原圖取回方式。獨立程式／安全／圖審須有精確head、範圍、findings、實看圖數、雜湊與限制；CI及作者自審不替代。後續改動另列差異與新來源／原圖綁定，不挪用第九波結論。
10. **workflow與發布分步**：038僅綁本分支、contents:read，無部署／推送／排程；035／036／037保持缺席。最後完整21項真綠先記卡，再另作只刪038 workflow提交，之後每commit核缺席，最後標準push／PR仍綠。先完成實作、驗收、來源／原圖交接及Draft PR，必要獨立覆核全部成立後才進發布階段；同PR配最新三權威T號／版本／日誌／方向，合前再核main／CI／Pages／方向與ancestry。Ready、合併及既有自動Pages須分別取得實際成功回應，公開HTTP／Chrome全文SHA／版本／第十輯10列40葉／slot3活畫布全成功才計10／20波100棟。不手動Pages；PR45批准不延伸，若遇新平台邊界則停並報精確目標／原錯誤／已完成與待辦。

## §8 開工狀態／沒做成的事

- [ ] 卡面首提遠端尚未核實，未繪製，尚無第十波CI或遊戲原圖。
- [ ] 十款原照待取得／逐張實看；現僅一手文字初核與來源／排重計畫，不冒稱考據完成。
- [ ] 原生、保存、整幀、場景、行人、效能、首紅、fp、smoke、財務與獨立覆核均待本波精確head證據；第九波只當BASE。
- [x] 已核最新main／方向／開放PR／分支，精確恢復簽章main物件並建立乾淨隔離工作樹；沒有刪除或提交他人的草稿。
- [x] 上一輪原始證據已獨立保存；本卡只記本輪開工基準與驗收計畫，不代替上一輪額外對外動作。
- [x] 正式仍9／20波90棟，第十波只到卡面準備；實機手機／Safari／觸控仍未測。

收工依《迭代不改壞標準》§8逐條補真結果；同種子／保存、像素與閥關整幀、新守衛首紅、三煙霧及原圖狀態不假勾。回滾保持本分支與原證據，閥能退舊圖；main／Pages紅及原停手條件照規則回報，不強推、不自行revert他人。來源403／登入／平台拒絕保留完整回應，不解挑戰、不改proxy／TLS／sandbox／權限，不把來源不足算通過。

## 施工紀錄（首卡後追加，原範圍與門檻保留）

- 尚未開始新美術。待先核首卡的實際遠端commit／tree及唯一差異，再完成原照考據。

- C1首卡[95373e6](https://github.com/lijiabao1998/GlimmerTown-lab/commit/95373e6e6222cfa54830323adc8e9b0fba24120f)／tree4b33ea78c865f41ca2be804c38ac4a27fcbb1155已在新遠端分支核實，唯一父main3e335233；compare唯一差異為新增本卡，沒有先繪製。環境斷線通知後已用真exec讀取確認工作樹／卡檔與原SHA完整，沒有把通知當已恢復或丟檔。
- 一手文字核實後逐一點開九個HE頁實際photo link、Leeds營運者頁照片，以及Richard Sutcliffe在Geograph7360104的217 Sauchiehall Street外景。四個NTS imgix圖片在web工具Internal Error、Geograph architect tag頁not accessible，完整回應本地保存，不重試這些URL；沒有把錯誤猜成403或登入。Geograph2264810文字指向Buchanan Street，是別處的Willow Tea Rooms，排除而不作本原型依據。十款原照仍未實看、未開始新美術。
- C2只新增有界038參考collector、只讀且僅綁本分支的五個參考工作與此施工紀錄；不改index或任何遊戲／判準。collector只讀已在來源頁點開的明列公開圖片，保留原bytes／headers錯誤／SHA與官方artifact；不取上一輪已失敗目標、不改proxy／TLS／sandbox／權限、不登入。圖片是否真外觀及證據涵蓋程度仍待實際取回、實看；成功前不宣稱考據完成。

- C2 [512d3d5](https://github.com/lijiabao1998/GlimmerTown-lab/commit/512d3d5b51cbf0bf3efd0e7f57288185a1cf502e) 的參考run39427226725五工作全部失敗於九個HE /etl/圖片HTTP403／Cloudflare challenge，原HTML錯誤body／headers由五官方artifacts保存，完整rawlogs／bodySHA與被拒URL清單已保存；所有九個目標停止、不重跑、不改URL或headers取同一資源。標準39427226056真smoke3／fp零變／財務53＋10全成功，但index未變，只驗BASE，不當成本波美術完成。
- C2成功取回兩張真原bytes並核SHA／實看：Willow7360104為217Sauchiehall完整窄高白立面，樹遮部分下層，背部／全屋頂未見；Leeds營運者ABG09421是室內，排除作外景完成，不能代替橢圓屋身與穹頂照片。正式仍9／20波90棟，未開始新美術。
- C3依新的接續指示保留相同十款及原外景要求，僅改用不同攝影者的獨立公開照片、建築師項目與現場新聞照片，逐張URL均在其原發布頁實際點開，不是重取被擋HE資源。九個缺外景subject明列讀取，Willow已保存的不重取；原出處／作者／許可已知範圍與照片用途保存GPT-038-reference-provenance.json，未核bytes或實看前仍不算補齊。Leeds6918607頁工具not-accessible、兩個Calderdale頁404、Boden項目頁Internal Error等亦不重試，原回應保存。所有原凍結條件、模型來源、原判準不變，十一份私有038守衛僅本地草稿／語法核實，未提交或跑遊戲。

- C3 [2b2c281](https://github.com/lijiabao1998/GlimmerTown-lab/commit/2b2c28128513f90a35eaa188403dafae6038a3c1) 參考run39430090998五工作成功，15原檔逐檔SHA核對並全部實看：14真照片＋1建築師剖視渲染；Silver2895_N8不是照片，明確排除真照片與屋頂證據計數。Halifax兩張都是室內，仍缺外立面與外部屋頂；Harrods是整體夜景，日間材質與屋頂細節未補。Burlington兩端入口辨識及帳篷形採光頂可見，上層loggia未完整入鏡。逐圖出處／作者／許可／SHA／實際涵蓋與限制記reference-inspection-C3，不把取得或實看等同本波獨立圖審。標準run39430090981真smoke3／root及BASE fp零變／財務53＋10全成功；遊戲未變，仍只驗BASE。
- C4仍固定相同十款與全部首卡條件，只取七個新URL：Chris Allen的Halifax Market Street外景、Council項目頁實際連結的兩張屋頂空拍、Make Architects發布的Harrods日景、Maber實際發布的三張新室內／屋頂候選；原15張已取原檔不重讀，Willow不重取，任何渲染均不得補真照片門檻。這些不是被擋HE檔案的鏡像或改參數重試。照片不足款式暫停繪製，沒有開始新美術或降低驗收。

- C4 [ef6227e](https://github.com/lijiabao1998/GlimmerTown-lab/commit/ef6227eb72781d30e5211d688493953cc9ee6270) 參考run39431957051成功；三個有明列目標的parts取七張新原bytes，另兩part無目標只保存空manifest。七張逐SHA核對並實看：Halifax的Chris Allen街景與Council兩空拍清楚顯示石店屋外立面／多坡交叉玻璃屋面／中央八角燈亭；Harrods的Make日景補米粉赤陶與肋穹頂細節；Silver2895_N4是真玻璃頂／多層鐵廊照，另兩張只拍辦公室，不作外景補齊。現在24原檔實看＝23真照片＋1排除渲染，十款均有外景，仍不等於全部外部辨識點齊備。
- C5只新增Stephen Richards於2018拍攝的Burlington Piccadilly外景一個明列URL，以核上層loggia，不重取已保存的其他23照片或渲染；Silver後側Cank Street方亭尚無足夠實看外照，不繪製該不足款式、不改原建築或要求。Commons猜定類別頁not-accessible不重試；Leicester Civic舊campaign連結實際轉新News列表，沒有假稱已讀舊圖。原錯誤／發現頁保留，七原圖出處與可見限制記inspection-C4。尚未開始本波美術。

- C6依本次接續指示先完成有充分考據的九款候選，Silver540..543仍無模型，build(silver)與完整buildAll必須因其證據不足而拒絕；不偷補替代圖、不刪首卡第十款或40向門檻。新美術只在british-wave10-art038.js，以既有原生kit／rasterizer的世界幾何真旋轉，九款36向；index、遊戲registry、玩法、保存及標準守門全部不動。25原檔及逐圖實看紀錄完整保存C2-C5合併ledger與既有不可變ZIP。
- 候選驗證獨立於完整21工作：新增previewWave038Candidates.cjs，只在Actions真Chrome直接烘焙九款，預定72日夜原PNG＋3完整contact＋9近景；檢查原生尺寸／anchor、硬像素、非空、不裁切、夜光實體覆蓋、去鋪地九款輪廓互異及舊SPR／世界stats未變。沒有catalog付費安裝，不冒稱完整玩法／保存／場景／效能或全波驗收。原full038守衛草稿門檻與首卡均保留，最後仍須十款40向／93原圖／全部21工作與獨立覆核。
- 本地只做語法及來源／雜湊核對；依AGENTS§5不在本地執行遊戲／Chrome／smoke／fp，實際渲染由Actions。workflow仍只綁038分支、contents:read；候選階段停止重取已保存參考照，待新合法Silver來源確定再另補。候選成功並實看後交獨立圖審，未達整波門檻不發布。

- C6 [65e7e62](https://github.com/lijiabao1998/GlimmerTown-lab/commit/65e7e62c01532374de6c6dcb1639302949d67668)／tree5c4b5e5e0d11c0de6813535139e39a46b7d8ca7e 實際候選[run39436939287](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39436939287)／job118676316714成功，官方artifact12272381639（ZIP digest b0ebac37fedb5cec381a29769df82ac24ad6309ed0801c8edbe7b293369762e4）。由實際CI日誌恢復72單圖＋3完整contact＋9近景＝84原PNG，逐檔bytes／SHA／IHDR尺寸全核對；未假稱下載過官方ZIP。完整索引與逐圖SHA存GPT-038-C6-candidate-index.json，source SHA9e08ececa93c3e654c5274d42d8cb7d590bd86f1727252681ffbf6373f947222／Git blob46790a26f756e544038ae3e8724ac22b409501f5；GitHub commit／tree／blob與原manifest相符，index仍main原bytes。
- C6標準[run39436938868](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39436938868)完成success，實際smoke三次、fp相對root／BASE零變與無風格下降、財政53項＋10負例無failures。這只涵蓋未安裝候選的BASE遊戲及候選專項，不冒稱整波十款／保存／場景／效能驗收。
- C6獨立審稿者已實看84／84候選PNG及17張真照片，結論revise：Willow順時針弧窗法線把玻璃畫在隱藏閉合面；Bishop Rows廊道讀成褐實板；Harrods角頂僅單斜帽，缺真mansard與dormer層次；Liberty木構被石色窗框蓋過，且body整片頂蓋遮住三採光井底。C6原圖與來源不覆蓋，舊結論不挪給改圖。
- C7針對以上問題修改同一純美術檔：Willow逆時針弧面與鉛格；Bishop實際深退後壁／soffit／低欄／柱撐與深色木窗；Harrods雙斜mansard／實體dormer／退後屋面及欄杆；Liberty深色柱樑／窗框、只對本款取消實心body頂蓋並建真井壁與底。其他五款模型、kit／rasterizer／候選判準／完整守衛均不改。只做本地node --check，C7原圖與再次獨立覆核待新CI，不寫已通過。
- Silver新找到Helen Wells（FieryFred）2008 Cank Street Flickr原發布頁與CC BY2.0署名頁；實際發布的圖片URL回403 Forbidden，沒有取得或實看原圖，停止該目標，不藉CI／鏡像／尺寸／參數／UA重取。BLB照片頁web抽取只有標題，另一次普通urllib HTML讀取遇Tunnel connection failed:403 Forbidden，屬代理隧道錯誤，不冒稱站點HTTP403，亦停止該目標。ULAS頁市場南段屬Cank Street另一側，不代替凍結Silver Street-to-Cank Street後側方亭。後亭外照仍待補，Silver540..543沒有模型，未減少十款／40向／93原圖及21工作門檻。

- C7 [a04e6bf](https://github.com/lijiabao1998/GlimmerTown-lab/commit/a04e6bf2d9bd0c2891aca836d43ab385ad24ce02)／tree519a0785bc17ef29672c07a4fa7562c61d85137f 的候選[run39440068190](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39440068190)／job118687243907成功，artifact12273204614 ZIPdigest01b4aad7bc73ea820227aaa92edfd3c698a72bcaa6f5d6e9bf19200e98bb8332。84原PNG逐檔bytes／SHA／尺寸通過，47與C6逐byte相同（含未改五款全部45圖），37有差異。完整清單／雜湊與C6差異列GPT-038-C7-candidate-index.json；C7 art SHA a6ed7fe8a64afd19bff375ccef10ab4c8b2cf6edc10a92224cb095042d1edf56／blob820e9101c573cca278b5178bf23038388786af2d。
- C7標準[run39440068080](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39440068080)真smoke3／fp零變無風格下降／財政53＋10均成功。作者實看四款新near（未冒稱全84）；獨立審稿者實看37變更圖、逐檔核84，47相同圖重綁已實看C6 ledger，另重開四款5真照片：Willow弧窗、Harrods屋頂與中央高窗分格已解，Liberty木框改善到medium候選建議；Bishop廊口、Liberty井口兩個high仍未解，C7結論仍revise，不因幾何metadata或CI綠放行。
- C8繼續只修兩項可見缺陷：Bishop把原生投影會覆滿廊口的7world深地板改為真3world走廊、暗地板及可見後窗；Liberty井頂仍真開口，改暗內壁及較淺可見井底，後部平面仍標文字推導、未冒稱照片測繪。C7原圖／source完整保留；C8圖審與結果待新CI，不挪用C7已解項為整波通過。
- C8新增一個明列Silver參考工作，僅取Boxpod/Andrew & Ashwell公開刊登131066實際連結的四張不同新照及NotFromUtrecht於2009-02-07自攝的Commons原圖。五個URL都從各原發布頁實際點開；不是已拒HE／Helen Wells Flickr資源、鏡像、尺寸或參數重試。每檔只讀一次，保留bytes／SHA／headers錯誤及出處；真外景／後側方亭是否可見須取回並實看，未核前仍無Silver模型。既有25檔原照與紀錄不覆蓋，候選與整波完整判準不變。

- C8 f53009d460c62777c7160b0920bb7303c87a11f7最終新獨立圖審結論已收到並保存：官方artifact12273467473 ZIP SHA f4e9b6fe5ae8aab1e2706d445a47fd3730e7960158cfed611ee64d14d6f7b4ae獨立實核；84原PNG逐張開啟且逐SHA吻合（72原生／9放大近景／3完整contact），相較C6初版37圖改變。JS SHA7ac802076803a9538fb318760269975a744ea7628968c48e0f8f62b14769ecab／blob4a25b20b5ea7d23c83e180c988e987c8683b32bc及完整index SHA2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60／blob69a3851fb58fab4aa66616941d92492220b17a33均獨立相符。結論只限九款靜態；Bishop Rows原生細節偏弱為非阻擋限制。near是放大候選、night原PNG是燈光overlay，不是街區或實際遊戲夜測；沒有藉此宣稱整合／保存／undo／觸控／效能或發布。作者另逐張重開本head84原圖，獨立紀錄與作者紀錄分開保存。
- C8新參考run39441702256／job118692949888／artifact12275430597五檔原bytes逐SHA取回並全部實看：Boxpod/Andrew & Ashwell刊登131066的一張Silver Street正面、兩張辦公室、一張幾乎全灰且不可用；NotFromUtrecht自攝／CC BY-SA3.0的Commons照片為三層鐵廊室內。五檔均沒有Cank Street後側凸窗／木閣樓／方cupola，故Silver540..543仍無模型。原25檔全部保留；新增五檔只作來源紀錄，不把正面或室內當缺角度通過，不推定地產照開放授權，也不把原照片嵌入遊戲。依最新指示停止擴大查找，既有拒絕URL不重試。
- C9依新增的接續授權完成可獨立的目錄runtime／CSS、安裝及逃生閥、來源隔離及完整十款守衛準備；先前「固定head」的圖審工作已完成，現在新增整合來源提交，但美術JS與正式index都保持f530原bytes。沒有改模型、造價、保存格式、共享rasterizer／色盤／指紋基線、T／版本／主線日誌或發布狀態。
- 正式installBritishWave038仍呼叫原buildAll並要求凍結十列／40鍵，完成完整cache後才一次寫入SPR；冷缺Silver與暖36-key cache均必須原子拒絕。正式selftest仍要求十款40葉。目錄保留十列，缺圖列沒有img或假模型、不可選也不扣款；ready狀態不等於補全考據。__noBritishWave038維持舊地標外觀、拒新選擇／扣款，普通及舊輯、load／newWorld生命周期沿原生路徑。
- C9局部測試明確分開：wave038-nine-fixture.js僅供Actions生成臨時測試頁，只安裝現有九款36真葉，不覆寫buildAll或正式十款判準，不為Silver放占位。正式embed-wave038.cjs絕不包括該fixture。CI記錄正式HEAD index與生成測試頁的不同SHA；只剝038三塊及唯一測試install尾端可逐byte還原BASE。完整實際生成HTML及gzip原bytes、來源SHA／Git blob／head與全部圖像hash由artifact保留，不能把生成頁說成HEAD:index.html。
- 局部原生驗收預定：十列九啟用、Silver真缺席；九款72安裝原PNG逐byte等於已審f530；實際目錄click／每款$2000、undo退款／redo／參照格拆除恢復／四向／舊輯與普通切換／load重設；正常BASE與局部HEAD在seeds31／71／103三checkpoint全serialize與stats，僅實際root b.v明列差異、fieldExclusions=[]；九款匹配交易與正常首次update／市長options惰性欄位、舊檔／新檔兩輪保存；8張完整BASE／閥關canvas byte等值；真像素／夜漏光／克隆／私有旋轉／$1／redo及source越界負控制復原；桌面及390px響應式目錄、8張實際原生四向日夜／9張實景近景。這些是九款局部證據，絕不當完整十款、93原圖、113場景或21工作通過；實機手機／Safari／觸控未測。
- 完整十款10份既有私有guard／preview來源與先前封存SHA逐byte相同，原十款／40葉／至少12首紅、全部欄位、17行人、40組交錯效能及30延遲負例門檻未動；embed只重整成可證明三塊來源隔離的純文字compose。smoke僅追加038自檢註冊：實際HTML有038塊時必須API自檢成功，局部36葉仍失敗；刪掉這個新增註冊後整份舊smoke與BASE逐byte相同。完整21工作模板在docs以.yml.txt保存，未啟用；Silver與真正完整安裝前不跑出假綠。現有workflow移除已完成參考重抓工作，僅候選靜態及九款局部原生兩工作，仍本分支／contents:read／無部署推送。
- 本地僅19份JS／CJS語法、JSON／SHA與來源組裝／剝離、既有source byte核對及兩個source首紅／復原，未開遊戲／Chrome／smoke／fp。首次來源核對因本地沒有遠端C1 Git物件而失敗；本地改用明確傳入原C1檔並硬核e59c1317…934eb7，CI仍必須直接讀C1 Git物件，不准走本地檔替代。C9實際遊戲與標準CI結果待推送後核實，不先填通過。Silver依賴的繪製與整波合併發布仍暫停。


## C10 — 原生 API 呼叫修正，保留 C9 失敗證據

C9 `30ee6a320cdc5f2fa6684d7826f5f12ad68a8754` 的來源隔離檢查及九款靜態圖 job 通過，但原生局部 job 118729301511／run 39452099195 在 BASE session 首次呼叫時失敗：`TypeError: GV.dev556B is not a function`。因此 C9 並未取得九款玩法驗收。已保留完整原始失敗日誌及官方 artifact 12278323115（ZIP digest `bb4eed9dec9c3dc1115f66f9435d1a9aa0b10dbd9d5f92559bcbd659b7ce5aab`）；沒有盲重跑。

查閱精確 BASE 原始碼及已通過的 wave037 探針後，確認既有 developer API 固定為 `516B`、sandbox 存檔尾碼固定為 `.sandbox516b`。修正九款局部程式及預備完整守衛中錯誤遷移為 556 的這些原生 API／key 字串；完整十款計數、判斷式、負控制及門檻不變。來源靜態檢查新增對獨立 BASE 中 API 名稱與原生 sandbox key 的核對，完整守衛 metadata 保留 C9 草稿 SHA 並明記本次原生呼叫修正。

美術、runtime、CSS、正式 index、凍結卡原文、版本／T／日誌、fp/style 及共用骨架均不改。Silver 仍缺後側實照且沒有模型；新 CI 仍只准證明九款局部，完整十款、完整21 jobs、實機與發布均未取得通過。


## C11 — 通電夜景補證計畫（實作前凍結）

父任務已交付 C10 精確 head61db8277a33abf1eef0ab3a68ef93b5fcbb5d6c2 的新獨立覆核：官方 artifact12278738941 真下載成功；113 manifest 檔、84靜態圖、72安裝 sprite、8組BASE／valve完整畫布、來源組裝／剝離及完整守衛雜湊已核；已實看17遊戲場景和2目錄圖。原場景未明確建立供電，只能說「通電夜景整合尚未證明」，不是已確認產品 bug。原作者環境仍未取得該ZIP，不能把審稿者下載實核改寫成作者已下載。完整首紅及 C10 原始證據不覆蓋。

依明確接續指示，在原九款局部驗證中新增有界原生供電／斷電及窗光實際可見的證據；以下條件先凍結，不降低原首卡十款／40向／21工作及任何完整守衛。

1. 僅新增 Actions 測試與本分支只讀 job。正式 index、美術、runtime／CSS、原生夜燈與電力規則、共享骨架、完整十款守衛、版本／T／主線日誌／fp/style 一概不改。正式安裝及自檢仍因 Silver 缺席拒絕，沒有假模型或假供電。
2. 在 slot3 的相同有界可拋棄世界，以既有原生 GV.placePreview459／GV.place／placeUndo／undo 實際建造九款地標、道路及核電源；只用既有成熟度測試出口固定施工期。不可寫 bd.pw、容量、dispatch 結果或 nightGlobalPowerRate487，不使用 nightPowerTest698 或改電力／夜燈規則。正常 simulation step 產生 bd.pw、T471 dispatch 及 T487 夜間供電真值。
3. 同一布局比較四個真狀態：供電完整、實際拆掉唯一道路橋接（地標斷電而電源側仍有電）、實際拆除電源（全局供電率0）、用原生 undo 復原。保留獨立只讀道路 BFS 見證、電源／負載／pool／T487 snapshot、九款 root/ref 及完整保存。BASE 與 HEAD 各自跑同樣原生操作及 phase，完整 serialize／stats／utility 比較只允許九款實際 b.v 差異，fieldExclusions=[]。
4. 九款×四向，真 native game canvas 取得供電／道路切斷／電源斷電／復原夜景。攔截只讀 Canvas drawImage 記錄實際 day sprite 的螢幕座標，以原始夜圖 alpha 投影窗光 mask；不憑手寫相機座標猜測。供電及復原各向都必須出現可量的窗光（至少3個投影像素、最大亮度總差至少6），斷電狀態逐位等於該單一夜圖禁用時的實際原生畫面。此故障僅暫改該本波新 key 的 night，不改共用規則／舊鍵。
5. 實際移除首款本波 night 作負控制，同一可見性斷言第一紅必須落在 powered-window visibility；還原 canonical sprite 後畫布必須逐byte恢復。全程檢查無 console error、slot3／其他 slot 不變；正式生成頁仍只剝三塊與唯一 fixture tail 可回到獨立 BASE。全部 actual PNG、原 HTML、來源 SHA／Git blob、保存原檔及 manifest 由 artifact 保存；小量明列原圖與完整 manifest 另經日誌傳回，避免上一輪過大日誌中斷。未實看圖明說，Ubuntu Chrome不推論手機／Safari／觸控。

此卡只補九款局部夜景供電證據；Silver 仍無足夠後側照片且暫停繪製，完整十款與合併／發布維持禁止。


## C12 — 原生通電夜景補證實作

依已先推的 C11 計畫（f89665c6c70bc08db14a540fbe44d8f4587bf829）新增 partialNinePower038.cjs／probeNightPower038.cjs 和本分支第三個只讀 night-power-nine job。測試以真付費填土／道路／九地標／核電源建設；獨立 BFS 留道路見證，原生 step 結算供電與夜間 dispatch，實際拆橋／拆電源／原生undo復原。沒有夜間供電 hook、直接 pw／容量／供電率賦值。BASE／HEAD 同操作、完整保存／stats／供電 snapshot 比較，僅九款 b.v 差；新鍵夜圖真故障的首紅與精確復原、九款四向 actual canvas 投影窗光守衛保留 C11 的3像素／6 RGB總差門檻。

來源檢查只把兩個新測試檔加入既有 BASE API 名稱核對；未修改原守衛斷言。全部已審美術／runtime／CSS／正式index／完整十款守衛來源與雜湊不動。語法與純文字 source strip 檢查通過；本地未跑遊戲，夜景驗證仍待本提交真 CI，不能先寫成功。完整原圖與保存放 artifact，明列小量原PNG和 manifest 從日誌送回；原 C9 首紅與 C10 產物／新獨立覆核分開保留，不覆蓋。


## C13 — 修正 BASE 供電 fixture 的電源 frontage，保留首紅

C12 head0b7f407540ec64bd31a73c2894266f2e3ab8faf2／run39458137778／job118750257418 首紅在 BASE 階段 `night038 real root power state phase0`，尚未測到新候選夜窗。完整原始日誌已保留；官方失敗 artifact12281597767（GitHub ZIP digest e921fb096d2dcc776749e256dde4b6a7b895e185dab60adfcf12050bd323ca9a）保留實際生成頁、BASE setup 及錯誤，沒有盲重跑。

核對精確 BASE 的 computePower／powerFrontageRoads450 及 preparePowerDispatch471／powerCandidateDistricts450 後，發現 fixture 只在3×3核電源的底側接路：T450完整footprint可傳電，但既有T471 source pool仍讀 root radius2，底側y+3超出其範圍；主幹亦在 root x+4，因而沒有合格的 source pool 道路。本次只在同一電源西側新增真付費道路，再連原西側底部支路，使原生 root radius2 與 footprint frontage 都能接同一電網；唯一橋接及拆橋／拆電源／undo復原照舊。不改原T471供電語義，不直接寫 pw／容量／供電率，不提高容量或放寬任何窗光、通電或完整十款門檻。

另外把新fixture在各phase的實際原生供電／夜間／root資料於守衛前存為只讀診斷；若再失敗，原數據隨artifact及小量日誌保存，不只留籠統錯誤。先前失敗證據不覆蓋。語法與靜態來源核對通過；修正後效果仍待新頭CI，不先宣稱供電成功。
