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
