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


## C14 — 保留 old-only pool 的既有量化限制，補原生混合街區場景

C13 fe2bf6200a63ca452e222a272996285233d80ada／run39459181358／job118753831356 再停在同一 BASE root power 首紅；新診斷原檔30,844 bytes／SHA762ea09e3f813da2f88e93706955c633372662cb20456d78bb18ce5d5c122b20已從日誌實際取回。西側接路已生效：核電源online、available222.3、pool0、69道路全通電、night powerRate1、前8款pw=true；Willow pw=false。九負載晚峰各1.408，照明1.113，實際13.785在old-only pool被既有dispatched兩位小數記為13.78，最後剩1.403不足1.408。不是本次新美術導致，不能把8/9改算通過。官方首紅artifact12280944636／ZIP digest932d21ff4322a9a7fe3bc24fd9657a51bae8a621e272ed5df742071605a2e0c9及完整rawlog／原始程式碼保留。

核對BASE發現它本來已有兩條原生pool路徑：完全old-only沿用原捨入；含已發布BRITISH004的混合街區使用既有physicalDispatched004完整物理量。本次不改任何路徑、不抹掉已觀察限制；在同一真付費fixture遠東側正常建造一座既有edwardianLibrary，真道路接同一電網，由BASE自身選擇既有混合街區路徑。這是新增明列原生背景上下文，並非修改舊式pool、偽造供電或宣稱該量化限制已修復。來源／所有新窗光與9/9通電、真拆橋／拆電源、完整保存／stats／供電對照及負控制斷言不變；關閉建築pw或供電率一樣必須紅。

證據的結論只能是這個原生混合街區中的九款局部夜景；old-only量化限制仍列未修復，不擴張為全城市電力修復或十款／完整21驗收。若本次再在同一root guard紅，不再延伸診斷或再推修復；保留精確資料交父任務。語法／來源靜態檢查通過，真遊戲結果仍待新CI。


## C15 — 固定原生啟動時鐘，要求故障前畫面本身先穩定

C14 68ff1d880801d4d4b293d0960cb3bddc12e0a772／run39460187998 有兩個獨立首紅，原始日誌均已保留。夜景job118757330584已完成BASE供電／拆橋／拆電源／復原四phase並進HEAD，實測9/9 pw=true、night powerRate1；前三款view0通過可見窗光，最後成功Halifax真遊戲PNG已取回及實看（healthy SHA f9d3b35d6b316c40da2de695b0b167b79d38612ba8eb4cb26788b67df0e5b771，單一新night禁用 SHA b7193e4b2d545cef202a1b2023c7701cd37d4117dfd73239124cc51e0271ac8e，760窗光像素、最大RGB總差205）。其後首紅是Bishop24_1_532的單一夜圖復原整幀不等。診斷JSON1364564 bytes／SHA fdf46848351eb7e217392ad3d0175f44de425276b30a96b1a479efcbfe385839；只保留到上一成功case，不冒稱已有Bishop差異像素原因。

既有局部job118757330216也首紅在完整保存 fiscal515.lastBacklogDay 5→4。精確原局部來源、生成HTML及runtime均未改；查shared harness它建立城市後等待3秒才進測試，既有newWorld又未重置fiscal515，可能把不同次數的未請求啟動tick帶進配對。此次不刪／正規化任何財務欄位：只在兩個私有runner用既有GV.setSpeed(0)暫停原生啟動時鐘，到callback立刻移除計時器、斷言boot day恰為1，之後仍由原生step執行全部原比較。記錄BASE／HEAD bootstrap stats；shared harness、正常serialize／stats比較、$1負控制及完整十款守衛不改。

夜景方面先做最小穩定性檢查：相同原生暫停畫面須連續兩次完整PNG逐byte相等，最多8次；穩定不了直接紅並留前／後原PNG。故障前、禁用本波單一night、復原後各自取得穩定畫面，原本的整幀逐byte復原、3窗光像素／6RGB總差及斷電嚴格等值斷言完全保留，無裁圖、無容差、無只比窗區替代整幀。先把實際前／禁用／復原PNG寫入診斷再判斷，避免首紅缺圖。這是檢查量測前提，尚未確認Bishop差異來自暖機；若仍不等，保留精確圖與資料停下回報，不繼續改規則或賭重跑。

全部249張新增實際game PNG依原生phase分四個有界artifact，核心HTML／完整保存／所有hash／manifest另存core artifact。總數249由runner新增硬斷言，不刪減原圖；失敗前尚無圖片的phase只警告上傳缺檔，測試本身仍紅。日誌只送兩張整景、Halifax供電／禁用／斷電及真負控制六張原PNG，加完整manifest，避免上一輪大日誌傳輸中斷。原規範的113全波場景仍未宣稱完成；old-only量化限制及Silver缺項不變，沒有合併發布。


## C16 — 本輪真結果與停止夜景寫入（只記錄，不重跑）

最後實測程式頭 d651a01991f936a4b135cc6e15047a6c5bd4bf05。標準run39461860454已全部success：真smoke3次、fp新增／變更／移除皆0且無風格下降、財務53項＋10負控制無failures。候選及既有partial-native-nine（run39461859935，jobs118763081183／118763080728）success；84真靜態PNG已取回，全部逐byte等於已審f530，美術SHA仍7ac802076803a9538fb318760269975a744ea7628968c48e0f8f62b14769ecab。原生啟動暫停後完整保存比較仍保留全部欄位，fiscal515.lastBacklogDay差異未再出現。

新增night-power-nine job118763081383仍failure，不能把另外兩個job或標準CI當它通過。BASE已走供電／道路斷開／電源拆除／原生undo復原四phase；HEAD混合街區已實測9/9 root.pw=true及night powerRate1，前三款view0可見窗光。Bishop view0實測605個投影窗光像素，最大RGB總差205；healthy／suppressed／restored各自連續穩定樣本數2／3／2，但單一新night復原整幀仍不等，首紅 `night038 single new night key restoration exact 24_1_532`。依C15停手條件停止這項測試的後續修改及重跑，不放寬斷言、不改原生規則。

已從實際日誌取回完整診斷JSON2583477 bytes／SHA851484941d6b307d02f96080686137153e93e273867a22cad15960ec53a95c9f及三張1280×657原PNG，三張皆實際開啟：healthy640341 bytes／SHA2bcbf96d8bab5091d2abba800cd8cc90867778841ecb4090ff9fc38e4692c1ff；suppressed631890 bytes／SHAc983abdc921396e3c6ff62b951588bfd923333ae5b626b52291a8bbfe2360fd9；restored640342 bytes／SHA1cd750588bb812d3c5750bc0aeb04a711b3dbdb0398876eca745f9526accf1d9。精確RGBA比較healthy→restored共179 RGB差異像素，bbox[391,308,402,325)，單通道最大168；它們全部在本款實際day draw rectangle[480,69,320,392]外，該矩形內差異0。原圖清楚顯示路口交通號誌由黃轉紅；精確BASE的T289 sigPhase讀trafClock，draw每次執行trafClock+=dt，這個純視覺時鐘不由setSpeed(0)或setVisT固定。這定位了整幀守衛的無關動畫差異；不是藉裁圖通過，也未確認新夜圖產品缺陷。仍須保留同一完整畫布等值要求，交父任務覆核與決定後續固定原生號誌相位的做法。

官方證據：core artifact12283197335（GitHub ZIP digest adefe08febbcaf305caa26574c58ab103a14deaa95b72ad023815e028bdfb9c3）；on12284020425；road-cut12284110259；source-off12284080367；restored12283856194。名稱不代表全部HEAD phase完成：本次在HEAD phase0中途紅，四圖片分件僅是已走完的BASE16整景；HEAD後續四向／斷電／復原尚未完成，也未產生成功manifest-night-power038.json，249原圖硬門檻尚未達。HEAD三張首紅原圖在core診斷JSON中保留且已解碼原bytes。上述ZIP digest是GitHub metadata，作者沒有本地下載ZIP重算。既有局部整合artifact12283811208及靜態artifact12282183994另存，全部綁同d651頭。

C12／C13／C14所有原始首紅、失敗程式副本、新舊供電診斷和C15實際原圖／hash均另封存；沒有賭重跑、刪欄、套容差、關號誌來冒稱通過、改pw／供電率或降低十款守衛。old-only pool8/9量化限制仍未修復。Silver缺後側實照仍沒有模型；正式index、runtime／CSS、美術與完整十款守衛不改，main仍3e335233，沒有合併或發布第十波。此最後一筆只追加卡面結果，實測來源仍d651，docs-only本身不是一次新CI通過。


## C17 — CI交通動畫相位控制計畫（先凍結再實作）

父任務已獨立實核 C15 的179像素差異全屬路口交通燈黃→紅，Bishop 605/605投影夜窗變亮、九root通電；同時核實 draw(dt)推進trafClock，forceDraw呼叫draw(.016)，setVisT只改晝夜，相鄰穩定兩張不足以約束跨抑制／復原的交通相位。父任務明確要求只在測試fixture固定可重現交通動畫相位、保留嚴格全畫面等值及正負控制，先凍結驗證再改測試。本段在任何相位控制程式動手前單獨推送核實；C12～C16全部原證據保留。

1. production index／美術／runtime／CSS／wave038-nine-fixture.js及正常embed工具、原生draw／sigPhase／forceDraw／電力／交通／夜燈規則一律不改。新控制只存在新 Actions runner 組裝的CI測試頁中；正式完整compose不得含控制橋。原十款／40葉／完整守衛、3窗光像素／6RGB總差與完整PNG逐byte相等均不變，不能遮罩或加容差。
2. 新CI-only bridge在原生trafClock／sigPhase詞法作用域暴露只供fixture用的有限相位讀取及drawAt(clock)。每次drawAt先保存原trafClock、暫置明列clock、呼叫原GV.forceDraw，再讀實際post-draw時鐘與sigPhase(signalSeed)證據，finally精確還原原counter；不得覆寫draw／sigPhase／forceDraw，不關號誌，不修改SPR或保存，不寫pw／dispatch／容量／供電率。原生draw仍確實加.016，故固定輸入0時每張實際繪製相位必須精確0.016；還原counter及day／完整保存不變另驗。
3. 所有BASE／HEAD的供電、拆橋、拆電源、復原及四向／原圖／夜圖抑制控制的每一次forceDraw都經同一bridge drawAt(0)，每次斷言實際post-draw clock===0+.016且外部counter精確恢復。每張留下觀察到的原生號誌座標／實際sigPhase結果，抑制前／抑制中／復原後的交通相位證據必須相同；依父任務補充的最小修復要求，移除依相鄰畫面相等而重試的stableFrame迴圈；僅做固定次數、相同clock的原生capture一致性檢查，不能用重試／追加暖機掩蓋原因或替代相位控制及全幀等值。
4. 真負向檢查：在Bishop view0、供電保持正常且所有精靈不動時，只把CI phase輸入改為2.7，原生5.7秒號誌週期必須實際變色；用同一個完整畫布復原斷言比較clock0與2.7，第一個紅燈必須落在原night038 whole-frame restoration mismatch。保存實際錯相位原PNG、實際clock及signal phases，然後回0全幀必須逐byte復原、原counter／完整原生保存／SPR鍵與引用不變。既有本波單一night移除的真首紅／復原仍照跑，不以相位負例替代。
5. BASE測試頁＝獨立Git BASE原bytes加一個明列CI交通橋，剝此唯一橋後必須逐byte還原BASE；HEAD將同一橋放在原038 CI runtime區塊內，照舊剝三區塊及唯一fixture install尾端逐byte還原BASE。分別記錄原Git BASE、BASE測試頁、HEAD測試頁的bytes／SHA，不能把生成頁當提交的index。source-provenance在測試前就保存，失敗亦留原HTML／完整訊息／原圖。
6. 新head重跑原候選／完整欄位九款局部整合及新增夜景job，完成九款×四向供電、道路斷開、電源拆除、原生undo復原全部矩陣；BASE／HEAD正常操作、全serialize／stats／utility比較仍fieldExclusions=[]、只允許九款真b.v差。額外保留相位負例及其復原原圖，原249幅之外新增2幅相位原圖，總數251硬驗；所有原PNG、hash、完整保存和source由分件artifact保留，小量原圖／manifest從日誌傳回。最新smoke3／fp零變／財務53+10及獨立差異覆核仍必要；未全過如實報紅。

此授權只接續測試fixture，不重畫九款、不修production時鐘或old-only pool量化限制、不補Silver假模型；Silver與完整十款／21工作仍缺，禁止合併發布。


## C18 — 依已先凍結C17實作CI-only相位capture

C17 d4c10eb0eee6039c3ba48e42f0697f63f78f6976已先單獨推送並核實後才動手。新增wave038-traffic-phase-fixture.js，僅由night runner加入生成測試頁，不加入production runtime或原wave038-nine-fixture.js。bridge每次保存trafClock、暫置輸入0、呼叫原GV.forceDraw，記錄原生實際post-draw .016及signalList/sigPhase證據，finally還原counter；所有capture每次都硬驗實際post-draw clock及counter，未覆寫任何原生renderer／信號／供電函式。

移除C15依stableFrame相鄰相等而重試的8次迴圈，只用兩次固定相位capture硬驗全幀相同，未通過直接紅。正常／本波night禁用／復原的實際clock和號誌相位另外逐項相等；原嚴格整張PNG復原、3窗光像素／6RGB差、未通電時整幀逐byte等同禁用night、單一night真缺失首紅與復原均保留。BASE和HEAD全部實拍同用此bridge。

Bishop view0另以真輸入2.7擾動交通相位，不動精靈或供電；同一整幀復原guard必須先紅，實際sigPhase必須改變並保存錯相位原PNG及像素差異統計。回輸入0必須全幀逐byte恢復，原counter、SPR鍵與物件引用、完整native rawSave都要精確不變；不是用相位負例替代夜窗負例。兩張相位錯誤／復原PNG加在原249張之外，251張仍硬驗。

新增測試前即寫出的source-provenance：原獨立Git BASE SHA2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60，BASE+同一CI橋SHA4b30f61985b58d9749a4fe91f8f1430280f741d64e679eb3969ca43d6e907c13，HEAD含橋測試頁SHAe3c10dd83aafd77241fde600d1711e0a9cebd8a5f83876f44e793da04cc15a48。這些是本地純文字組裝核實，真CI仍待推送；兩種測試頁都不能冒稱提交的index。BASE只移除唯一完整橋原bytes回Git原檔；HEAD把橋放在038 CI runtime塊內，仍只剝三塊及原fixture install尾端回同一BASE。production compose明確無helper，另對把合法JS橋漏到production邊界外的有效來源實測靜態首紅／復原；原兩個source負例及全部既有共享來源、完整十款guard SHA不改。

所有saved原圖的phase witness寫入分phase檔，保留BASE四整景與HEAD每款實際捕捉證據；完整manifest及原JSON由core artifact保存，日誌以原manifest的gzip傳回並列原SHA，避免大量重複phase witness撐斷傳輸。六張明列原PNG改為供電整景、Halifax供電／禁用／物理斷電、Bishop錯相位／精確復原，其他所有原PNG照樣留分件。新job仍本分支contents:read，無部署推送。本地只做JS語法、YAML、hash及純文字組裝／剝離／compile；未跑遊戲。C12～C16資料不覆蓋，C18真結果與251矩陣待新頭CI，不先寫通過。

## C19 — C18九款原生供電夜景補驗收實績（只補紀錄，不發布）

精確實測code head為C18 `e2f197bd5a10307fd8697ededb517aa51fe89a7f`，tree `9dfd2db03d2e2ab432e5091028a94563e5613485`；本筆僅追加卡面結果，不能當成新一次遊戲CI。原生工作流[39467143071](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39467143071) attempt1 completed/success：candidates-nine118781368413、partial-native-nine118781367952、night-power-nine118781368376均success。標準[39467143006](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39467143006) attempt1 completed/success：實跑smoke3次、fp對倉庫與BASE新增0／變更0／移除0／觸及家族0、1728超街區CRC5ef6eb67與基線一致、無家族風格分下降、style165族逐族相同；fiscal-load118781368822實報checks53／negative10／failures[]。正式index仍逐byte等於main；以上標準CI測原有正式頁，不能冒稱038十款已安裝驗收。

night-power-nine完整走完九款×四方向×供電／道路斷開／電源拆除／原生undo復原，共144case；供電與復原各9/9 root.pw=true、night powerRate1，斷路9/9 false但原生全局powerRate仍1，拆電源9/9 false且powerRate0、available0。通電72case最低175個窗光像素且最大RGB總增量最低193，斷電72case可見窗光及最大RGB總增量皆精確0；每case仍硬驗完整PNG的night抑制／復原，未通電正常圖逐byte等於抑制圖。BASE／HEAD完整serialize只容許真九款b.v差，各phase完整stats／power／night／topology精確等值，fieldExclusions=[]；不是塞供電旗標或略掉財務欄位。

manifest內1804次實際capture witness已逐項核對：正常／抑制／復原輸入0、原生draw後0.016、finally counter逐值恢復，三者原生sigPhase證據精確相同，沒有stableFrame或適應重試。真正錯相位輸入2.7令原生號誌改變，原全幀guard第一紅仍是 `night038 single new night key restoration exact 24_1_532`；實際錯圖226 RGB像素差、bbox[391,308,402,332)、最大單通道差173，作者從兩張原PNG獨立重算吻合，回0原圖與正常Bishop PNG hash相同。SPR引用／counter／完整rawSave不變，前後保存SHA均6a4c8a8fdd5ab173865e0d6a30510040035863bced4ca4765a7eece186606975。原單night移除真負例仍先紅 `night038 powered window pixels visible leedsCorn view0` 並完整復原；未以號誌負例替代夜窗負例。

完整manifest1057098 bytes／SHA624b97a8198ab0b9170ade0cb76d7c833b360cde43971a8e7d2a6dde203983da，原始gzip38782 bytes／SHA5249a3e4015d4fcf3e986e419d02668b19559ffec8d58a483f665f23fd2b5ba3，從真job日誌取得並重算吻合。manifest列274檔、251原PNG；官方core12285701841（ZIP digest7cccabcafb28380a3f7ddd4a602398738503ae90c6d422257d97146f4b794cb0）、on12285736761、road-cut12285708401、source-off12286142667、restored12285567174保留全部。作者實際回收並開啟六張1280×657原圖：供電整景、Halifax供電／抑制／拆源、Bishop錯相位／復原，逐檔bytes與SHA都吻合；不能寫成作者已逐張看完或獨立下載重算251圖／五ZIP。正式production無phase bridge；原Git BASE、BASE+橋、HEAD測試頁SHA均與C18預先source綁定相符，八個實際source檔的SHA與Git blob也重算相符。

同頭static artifact12285647407的84原PNG全部從實際job日誌取回且逐byte等於已獨立實看通過的f53009d84圖（72原生、9近景、3接觸表），美術JS／完整index hash沿用原精確值；本次沒有冒稱重新獨立圖審。既有九款局部原生artifact12286360311另保留完整保存／72安裝sprite／BASE與逃生閥圖。C18相對已先凍結C17只改五個CI測試／來源檢查檔與卡面：正式runtime／CSS／美術／原nine fixture／原生renderer／共享harness／正式index／十款完整守衛均未改，沒有容差／遮罩／裁切／供電真值注入。

剩餘：最新相位fixture差異及251官方原圖尚待父任務獨立覆核；Silver後側Cank Street方亭實照仍不足，該款540..543缺項並停畫，buildAll完整十款守衛仍必須拒絕九款。原old-only pool8/9量化限制未修。完整十款／40葉／93靜態原圖／21工作與整波守衛、實體手機／Safari／觸控均不能宣稱完成。本次未刪尚待完整驗收的分支workflow、未配T／改版本／改正式日誌／基線、未開Ready／合併／觸發Pages或發布；公開仍第9波，不准發布九款。C12～C16首紅原證據及已封存ZIP db354b9d918acf996e26d2640701ab497b87473ffda7989c30ff723dcb377137保留不覆蓋。


## C20 — 新Silver後立面參照與接續計畫（原下載遭代理拒絕，待既有原檔轉移）

父任務已明確回覆先前獨立核查C18 e2f197bd的九款圖證、144案例供電矩陣及局部原生整合；本次接受這項交接，不再把C19歷史「待父任務覆核」當成施工阻擋。2026-10-21開工實核遠端仍tip1e2318d2923988cde5022b1bccf1a017d71bc193、main3e33523305401ea258e24204ea7218345a6dc268；06:26 UTC已實際執行本環境命令，沒有覆蓋他人工作。.agents/skills與本環境額外SKILL.md均未發現；已重讀倉庫指引與本卡原凍結要求。

新來源頁 https://www.britainfromabove.org.uk/en/image/EAW024239 已實際讀取，核對Class31的2015-05-04 Cank Street街景註記及2015-05-05貼圖時間；這是頁面的2015街景pin附圖，不是1949航照主圖。父任務報告已實看後側中央拱口、凸窗、灰木閣樓、開放方亭尖帽，並提供正常公開P1120514.JPG URL與600×337／42108bytes。這些像素內容與檔案尺寸目前屬父任務提供資料，本執行者尚未取得或實看原圖，不能先寫作者考據完成或判定解析度足以畫哪些細節；不推定照片有開放授權，原照僅作建築參照、不直接加入遊戲。

本容器以正常urllib HTTPS GET、原proxy與TLS驗證下載唯一指定公開URL，第一且唯一一次於HTTPS proxy CONNECT即遭403 Forbidden，urlopen未返回、原始bytes0、未寫圖片；這不是已取得的網站HTTP403，網站回應狀態未知。依本次明示邊界停止此操作，不改proxy／TLS／sandbox、不改URL／尺寸／query、不換工具重取，也未重取之前Flickr照片。完整目標及觀察到的原錯誤在GPT-038-C20-silver-reference-access.json。已請提供現成P1120514.JPG（600×337、42108bytes）的Library檔案ID或本環境實際路徑，待轉移後先重算hash與實看原圖；不是要求重新批准既有工程，也不因代理拒絕重判新照片內容不足。

接續範圍保持首卡：實看原圖後只補Silver540..543的原創世界幾何四向，不憑低解析度未見部位增加裝飾；既有九款保留原bytes。完整十款候選須交付80原生日夜＋3完整接觸表＋10近景共93原圖及新Silver／原生整合預覽，先交付可檢視的新款。完整十款／40葉、正常模型完整保存、全畫面精確等值、首紅／復原、場景／行人／效能與來源要求均不改。可獨立做的readiness稽核已完成：10個完整守衛來源逐檔SHA仍等於凍結metadata，未啟用完整workflow模板展開仍21工作，正式index SHA仍2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60；詳GPT-038-C20-readiness-audit.json。這是純文字／hash／YAML稽核，不是新遊戲CI通過；未放假模型、未放寬九款或十款守衛、未把來源頁成功等同拿到圖片。

此筆僅保存新參照與準備／失敗紀錄；Silver建模、完整十款候選、整合預覽與新驗收尚未執行。實測code head仍C18，C20 docs-only提交不冒充新CI。完整驗收前不合併或發布；main／版本／T／正式日誌／fp／style／正式index／production runtime／九款美術未改。C12～C19證據及封存包保持不動。


## C21 — 現成Library原圖交接已解析，原檔傳輸失敗（尚未實看像素）

父任務已提供現成lab-bfa-cank.jpg，600×337／42108bytes，預期原檔SHA471ea0bd86fe598e0092aa49918b581a23ea51cbd29a5483226ef0953e9824ec；Library ID已正常解析，不再等待重發ID或重找來源。已按Library技能以目前官方helper及同版companion處理唯一原檔，prepare成功返回該檔授權傳輸；本地helper實際執行一次exit1，唯一原錯誤為 `library file transfer failed: download failed`，沒有返回底層HTTP狀態，不能把它推定成403或授權拒絕，原圖目的路徑不存在。沒有改helper、proxy、TLS或sandbox，沒有重試網站／Flickr或猜下載地址。

同一現成檔的Library原生image_file讀取成功確認檔名、image/jpeg、42108bytes及600×337 image asset pointer，但工具只交付指標與產生的caption，沒有MCP圖片像素。本執行者仍未實際看到原圖、未獨立重算原檔SHA，不用caption冒充圖審或照描述虛構Silver細節。私有Library身分／版本與原結果保留本地交接證據，未把短期傳輸URL或其他敏感傳輸欄位寫進公開倉庫；公開狀態詳GPT-038-C21-library-original-transfer.json。

目前需要的是這份已取得原檔的實際bytes交到本環境、可讀本機路徑或直接原圖附件，不是再一次Library ID，也不是重試被拒網址。Silver模型、十款候選／新款整合預覽、完整十款CI尚未執行；舊九款確認、C18已核實測試與全部守衛保留。此筆僅追加交接／失敗紀錄，沒有新美術、正式index變更、合併或發布。


## C24 — 原 JPEG 已完整恢復並實看；第十款補完計畫（動手前）

十段現成原檔交接的ASCII SHA逐段全部吻合，56144字元嚴格解碼為42108bytes／600×337 JPEG，SHA256 `471ea0bd86fe598e0092aa49918b581a23ea51cbd29a5483226ef0953e9824ec`。本執行者已實際開啟原像素：Cank Street後立面中央圓拱、上凸窗、灰木閣樓、開放方亭與尖帽均可辨認。照片是BFA頁面EAW024239下Class31於2015-05-04拍攝的街景pin，不是該頁1949主航空照；僅作建築參照，沒有推定照片再利用授權。600×337廣角街景不足核細雕飾、精確窗數及隱蔽屋頂；不補猜。前立面原照55f543…與室內玻璃頂原照ced445…亦已重開；C3電腦剖面圖仍排除為照片。舊C20～C23下載／傳輸與轉錄失敗原證據完整保留，但缺後側照片的歷史阻點現已解除，不再停畫。來源明細見GPT-038-C24-silver-reference-and-plan.json。

此計畫先推再動新美術：只補原凍結Silver540..543真世界幾何四向和該款metadata，九款已獨立確認模型及共用helper原bytes不改。前側以實照的圓拱、折角凸窗、三組斷開曲線山花與方尖飾辨識，後側只畫已看見的凸窗／灰木閣樓／開放四柱方亭尖帽；中部真採光廊道與鐵廊依原照，不把室內誇稱完整外露、不貼照片。

先交完整十款純候選：80原生日夜＋3完整接觸表＋10近景＝93原PNG，保留原尺寸／硬alpha／夜光支撐／無裁切／去共同鋪地十款互異等嚴格判斷；九款81張個別PNG須等於已覆核f53009d，三接觸表因新增列可變。新Silver預覽必須交檢視。分支workflow由歷史九款限定測試轉為完整候選階段；九款歷史測試檔保留，完整21工作模板與十個full guard原SHA不改。來源檢查繼續守完整BASE剝除逐byte相同、原smoke／共享來源／首卡凍結prefix與真來源首紅，不能用舊整檔art SHA禁止合法Silver新增，改以已批准九款函式及實際PNG逐一綁定。

候選後的整合仍必須完成原十款／40葉、完整正常保存／undo／全畫布／97狀態／113 PNG／行人／效能及全部首紅門檻。既有144供電矩陣擴至十款×四向×四phase＝160案例／275 PNG，BASE與HEAD同策略、fixture相位控制只在CI，嚴格復原／未通電全幀相等及窗光／號誌真負控制保留，不改pw／dispatch／交通production語義。正式index在純候選階段維持BASE。此筆沒有模型、遊戲CI或整合通過宣稱；沒有新合併／發布授權，不配T／改版本／正式日誌／fp／style／Pages。


## C25 — Silver完整候選實作；候選CI與原生預覽待執行

依已先推C24 `231bec5d00725865489867d60aebe2e18d99fe27`新增Silver540..543的真世界幾何與照片限制metadata：中央兩端實體圓拱開口、折角窗灣、石托中央凸窗、三組有中央開口的曲線山花／方尖飾、中央玻璃頂／真中空廊道及支撐鐵廊，後側灰木閣樓與四柱開放方亭尖帽。沒有照片貼圖，也未聲稱低解析度細雕或隱蔽屋頂已考據。四向仍交原生Scene旋轉，既有context/helper和其他九款每一來源byte均由獨立C18 Git來源比對保留；局部Source修改真負控制確實首紅再恢復。

新增previewWave038FullCandidates.cjs，要求固定10款／40向、buildAll完整40且等於逐款直接烘焙、80原生日夜＋3contact＋10near＝93原圖、去鋪地後10種不同幾何；原硬alpha／夜光支撐／非空／無裁切門檻不改。另對81張已覆核九款個別PNG核原bytes長度和SHA；接觸表完整新增Silver列。歷史九款runner與所有C18供電來源未改，不能拿它們的舊pass冒充本新款pass。

新增checkWave038FullCandidates.cjs：原九款及helper以C18原Git物件精確綁定，只放行新增Silver函式／該row及registry宣告；原C1prefix、十個full guard SHA、共享來源／smoke原斷言／完整BASE三區塊剝除、phase helper不得進production、合法來源越界首紅均保持嚴格。局部靜態檢查實過（沒有執行遊戲）；正式index仍完整BASE SHA2b959e01…7cef60。

活躍分支workflow現在明確為兩個候選階段job：完整十款候選/source，以及原封未改previewWave038.cjs的十款實付費原生預覽。這不是全波21工作的替代；21工作凍結模板與既有十款守衛不改，等候選新款預覽交付後再做完整驗收。CI與圖證在本筆提交後才執行，現在均待驗，不提前打勾。未在本機跑Chrome／遊戲，未合併、未發布、未改版本／T／正式日誌／fp／style。
