# T760：第六波十座有考據的英式學院與學術建築（原GPT-033）

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave06-033`；起點為遠端 main **1bf22ad7d6d533f8dfdf4480209a9a4b29c6fea6**（v14.51／T758／r205）。先單獨推此卡，成功後才開始本波美術；只推自己的分支，不重寫歷史。
- **第一個 commit 宣告要動的 fp 家族：`bld`，只有這一族。** 新鍵 `bld.24_1_360` 至 `bld.24_1_399`，40葉＝10座×4結構視角。3583個既有subs、其餘165家族、blocks／block559、環境葉必須零變，不放寬任何既有守衛。
- 對應業主2026-10-16原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」本卡只做第六波10座；前五波已實際發布50座，T748歷史15座不計入。卡面、來源與預覽不算已完成或發布。
- 開卡前main [39104791421](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39104791421)三工作成功（main原配置smoke實際1次、fp、財務53／10），同SHA[自動Pages39105049020](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39105049020)成功；無開放PR，方向為「運行」，最上待辦是第六波。
- 第五波正式URL已由[117609395633](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39102665167/job/117609395633)真實核實HTTP及Chrome文件200、11068695 bytes、SHA256 `0407552d1eb280975e069791b19c39d7736a1d0d9c7ebfecf5f86a193c1505e1`等於main1bf22ad，v14.51／T758、slot3、1280×657活畫布、第五輯10款40向、runtimeErrors[]；三張原始公站圖已核SHA並人工看過。probe head94d135f與正式manifest base1bf22ad分開記錄。
- 基線：166家族、3583 subs、bld1219；blocks1728／CRC `5ef6eb67`。bld七軸palette1、hardEdge0.9472259747892049、lightDir0.8236259228876128、shade1、density1、nightRule0.9874138870772997、variants1、total0.9655。fp／style原始metadata仍T757／14.50，禁止手改。
- 所有遊戲、Chrome、指紋、像素、場景與效能執行只在GitHub Actions；本機只做Git、來源／語法、原圖位元與人工查看。不改用使用者電腦。
- CI優化另有獨立工作；本卡不改共用CI。只可加自己分支的暫用 `.github/workflows/wave033-native.yml`，只綁此分支、`contents: read`、不部署不推送；最後完整綠後記卡，再以獨立只刪workflow的commit移除，後續不加回。

## 目標與一手來源（已讀名錄，尚未繪製）

各款均沿用既有原生2×2地標載體；真實大樓／校園作比例壓縮，不新增學校功能。不是同一盒子換色。施工前若來源不足或與舊圖形制重複，可先換有一手來源的原型並記理由；10座／40鍵／家族與以下凍結驗收不變。

| 起始v | 原型與一手來源 | 須保留的結構差異與舊款比較 |
|---|---|---|
| 360 | [Leicester Engineering Building，HE1074756](https://historicengland.org.uk/listing/the-list/list-entry/1074756)；[大學原頁](https://le.ac.uk/engineering/about/building) | 兩座高低不同塔樓、斜底講堂、45°玻璃屋脊工場及八角煙囪；不同於007技術學院（實際原生鍵266_1_0） |
| 364 | [UEA Norfolk Terrace，HE1390647](https://historicengland.org.uk/listing/the-list/list-entry/1390647) | 90°相接的退臺宿舍、連續橫窗、凹角及凸出廚房、後方高架步道與服務塔；不同於014普通住宿翼 |
| 368 | [Sussex Falmer House，HE1381044](https://historicengland.org.uk/listing/the-list/list-entry/1381044) | 三層紅磚／深混凝土帶、開放拱廊、食堂節段桶拱、北梯V頂、院落；不同於014石砌修道院 |
| 372 | [York Central Hall，HE1456551](https://historicengland.org.uk/listing/the-list/list-entry/1456551) | 不規則六角上層懸挑、較小玻璃基層、外梯與鋼管支承金屬頂；不同於既有圓館或普通劇院 |
| 376 | [Oxford St Catherine's College，HE1229934](https://historicengland.org.uk/listing/the-list/list-entry/1229934) | 矮平頂餐廳／圖書館圍院、玻璃步道、三層豎梃住宿翼、雙混凝土片鐘塔；不重做Radcliffe或King's Chapel |
| 380 | [Royal College of Physicians，HE1246159](https://historicengland.org.uk/listing/the-list/list-entry/1246159) | T形白色懸挑圖書館、成對窄豎窗、磚砌曲面講堂與淺錐頂、服務雙塔；不同於UEA退臺及一般白盒 |
| 384 | [Cambridge Senate House，HE1322818](https://historicengland.org.uk/listing/the-list/list-entry/1322818) | 九開間長廳、中央三開間柱式與山花、窗上直／曲山花交替、東端三開間；不同於圓頂圖書館、四柱小神廟 |
| 388 | [Glasgow Gilbert Scott Building，HES LB32913](https://portal.historicenvironment.scot/apex/f?p=1505:300:::::VIEWTYPE,VIEWREF:designation,LB32913) | 雙院落、中央六段塔身與鏤空尖塔、角亭小圓錐塔、階梯山牆與灰板岩頂；與014普通學院、既有教堂／車站逐款對照 |
| 392 | [Durham Dunelm House，HE1477064](https://historicengland.org.uk/listing/the-list/list-entry/1477064) | 分散向坡下錯層的盒體、中央直通階梯、鋸齒簷及平／斜頂混合、凸出廳與窄豎梃；不是UEA規則逐層後退 |
| 396 | [Leeds Roger Stevens Building，HE1393836](https://historicengland.org.uk/listing/the-list/list-entry/1393836) | 四段不同高低講堂、半圓通風竪井與凸梯、架空層／穿越坡道、東側玻璃梯樓；不是Dunelm坡岸散盒或普通廠房 |

## 動手前凍結驗收（不得放寬）

1. **10座／40原生向／80原始PNG**：十款各有獨立world-space結構、真實屋頂／窗型／量體差異，一手來源在卡與目錄可查；保持既有畫素光柵器、調色板、地基與全局觀感，不嵌入來源照片，不只換色。十款排除公共鋪地後輪廓各異，與最接近舊款接觸表實際比圖。
2. **原生整合與交易**：只新增bld360–399，原生k24／lv1／2×2、價格$2000、解鎖／容量／維護／工期／RNG／存檔格式不動。十款各DOM選擇、真扣費放置、undo／退款／redo、參照格拆除／恢復及旋轉皆驗。少葉、尺寸、夜光漏天、軟像素、裁切、空圖、重複輪廓、安裝克隆、真扣費錯誤、redo錯誤、來源越界與真旋轉凍結至少12負控制，目標首紅後恢復。
3. **完整來源邊界**：以獨立Git物件BASE1bf22ad為準；剝除本卡明確標記的純美術／CSS／runtime與單一安裝點，並只精確還原GAME_VER、GAME_ANCHOR、startVersion456三個發布字，index須逐位元等於BASE。真合法HTML越界變更須首紅，不放寬原有fp／style／sheet／容量自檢。
4. **正常模型與新舊檔**：獨立BASE及HEAD正常運行，不靠逃生閥，seeds31／71／103×3短視野檢查點比較所有序列化欄位與stats，只允許實際已知新外觀b.v。BASE只可對齊精確三個發布字並反向證明來源位元相同；不正規化輸出、不刪欄位。真金錢少$1首紅／恢復。十款匹配交易、首次update與市長選項惰性欄位兩端均實際保留；原舊檔和新外觀各兩輪load→save完整欄位穩定，僅精確gameVer遷移可明列。
5. **57狀態＋40邊緣**：日／夜、四季、冬有雪／無雪、四向、近遠景、四邊／角、施工進度、懸停／淡出、倒影／水邊、行人、煙、夜燈與招牌均走原生渲染。保留97原始場景與manifest；人未逐張看過不得寫已人工全審。至少看80PNG接觸表、十款近景、最接近舊款；實體手機／Safari／觸控如未測如實寫。
6. **逃生閥與8整幀**：`window.__noBritishWave033`可退回原圖；獨立BASE與HEAD閥關的8個完整1280×657畫布逐位元一致，包含完整所有層，不裁圖或加容差。實際畫布1px錯誤與保存欄位少$1的負控制首紅後恢復。
7. **行人與效能**：至少17原生深度／遮擋例與真負控制／恢復；同環境BASE／HEAD40組交錯效能、median／p90、暖畫新烘焙0；真延遲負控制至少30實測樣本與恢復重測。既有週期噪音按已知原因處理，不另造追蹤基建，不以桌面結果冒充手機。
8. **fp與七軸**：含最新main的push相對BASE只新增bld40葉；3583舊subs、165其他族、blocks1728／5ef6eb67及env零變。fp.json／style.json只逐位元取同次push的原始fp-rebake，禁止手改metadata、分數或環境。披露前後七軸，下降按第二波起連續授權在卡、PR、方向已完成表註明。
9. **最後CI與獨立新審查**：最後head分支／PR各實際smoke3次、fp與原財務53／10全綠，無env警告，不靠重跑。自己唯讀workflow最後完整綠且記卡才另以只刪workflow的commit移除，後續不加回。Ready後取得最新精確head的獨立程式及安全審查，findings處理完；無回應不算完成。
10. **合併／發布／數量**：合前重核main綠、Pages綠、方向運行、PR與ancestry；三權威最大號+1配T／版本／日誌#PR、搬卡與更新待辦，開關／方向原文不改。最後CI／審查與實際授權允許才合；核merged tree、main CI、既有自動Pages精確SHA，真公開URL核版本／第六輯與畫布。完成合入及發布核實才計6／20；文件或CI成功不等於建築已發布，之後續第七至二十波或規約真停手條件。

## §8 開工狀態／沒做成的事

- [x] 此卡已單獨先推：[a75de8758c59336127ea17870ff0292996f5cdf9](https://github.com/lijiabao1998/GlimmerTown-lab/commit/a75de8758c59336127ea17870ff0292996f5cdf9)，僅本卡一檔；尚無本波美術。
- [ ] 本波10款／原圖／正常配對／存檔／fp／場景／行人／負控制／效能尚未實測。
- [ ] 最後CI與精確head的新程式／安全審查尚未執行；尚無本波PR、合併或發布。
- [ ] 全97圖人工逐張覆核與實體手機／Safari／觸控未測。
- [x] 前五波正式URL及原圖已有真實證據；本波尚未完成，不計入50座。
- [x] 第三／四波Library原失敗保持：`hosted apps tools/list request failed: network`；prepare／upload／finalize未重試，Library已存0檔。GitHub原始artifact檔案另存，不冒稱Library已存。

原文與候選記錄不能當已實作。後續每筆施工與驗收只追加真實結果，不改鬆上述首卡條件。

## 原始來源照片前置讀取（不是美術驗收）

名錄十款文字已核實；York金屬屋頂、Roger Stevens外部豎井與St Catherine雙片鐘塔另取Historic England原始圖片觀察。選定雲端直接讀取三個官方圖URL均報 `URLError: <urlopen error Tunnel connection failed: 403 Forbidden>`，未取得圖、不改用使用者電腦。本筆只在自己的分支暫用唯讀workflow讀取相同三張官方圖及保存長度／SHA／URL；沒有啟動遊戲、沒有本波繪圖，也不算原生驗收。必要原圖核實後才開始相應幾何。


[來源前置run39106151107](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39106151107)在698f6eb失敗，job117612300387的實際首紅為 `AssertionError [ERR_ASSERTION]: source033 HTTP 200 york-central-hall.webp`，`403 !== 200`，沒有圖片附件，不能寫已看。保留此結果，不重跑賭過。這筆修正改讀已由Commons原頁核實的五張原始實景JPEG（York、Roger Stevens兩面、St Catherine舊實景、Senate House），不改驗收門檻、不重新編碼圖片；只作外觀觀察，文字建築事實仍依前表HE／HES一手名錄。七款幾何及新探針目前只在本分支本地編寫，未推任何美術、未執行遊戲；三款等待所需原圖再畫。


[第二來源run39106631854](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39106631854)在100e3af仍為failure：第三張額外東面圖 `source033 HTTP 200 roger-stevens-east.jpg` 首紅，實際 `429 !== 200`。但前兩張原始JPEG實際已取得：York63739 bytes／SHA256 `11e032eccb507c10de1eaee81a5e9d806803421d0d5f580a06713be1c3890b9d`；Roger Stevens74000 bytes／SHA256 `b65bc515002366bb593bfdf7b624aa15cbb813694d244ed16540c26777eebd36`，兩張傳回原檔位元驗證相符後已人工看過。York確為低金屬帳篷頂及露出鋼管尖頂；Leeds東面可見盲盒體、玻璃梯樓、架空凹口與池側。整個run未成功，不拿部分成功冒充全綠。

這筆只讀取尚未取得的St Catherine與Senate兩張原件，不重讀已取得兩圖、不再請求額外東面圖；兩次請求間隔10秒、提供真實研究User-Agent並記HTTP及Retry-After。這是新來源工作，不是重跑失敗的遊戲守衛；沒有更改十條凍結驗收或共用CI。St Catherine在所需照片真正看過前仍不畫。


[剩餘來源run39106925595](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39106925595)的來源工作成功，job117614695408、head709a453。Senate67510 bytes／SHA256 `d0522f6385ad6c2884dc9ecbbb153dab883222dfd9cc44a5ca634fdaacc681be`與舊StCatz73453 bytes／SHA256 `6a2fa28018397483f4bdb3193209e43cd05a883a0f25bda388c991839a138e59`均逐位元核對後實際看過。但人工發現 `Old_stcatz.jpg`是舊址的坡頂樓，不能拿它當Jacobsen現址平頂院落的證據；不按錯照片畫。改取Commons已核實、用於Arne Jacobsen條目的 `Catz_Moat.jpg`原件，這次僅一個來源請求，不重試先前429圖片。Senate實景已修正上層圓拱窗、中央雙層高門、欄杆女兒牆及中央三開間兩側各一根通高柱；原十條驗收不變，尚無遊戲或像素實測。


### 一手文字與必要實景已核實，開始完整原生美術

[Jacobsen來源run39107165254](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107165254)在243940f成功，job117615431692；現址 `Catz_Moat.jpg`原件103528 bytes／SHA256 `6a4329a5bbf37f2713dc5f349aee983dc01c337ee2ac285d22fb2afae4e0a2f2`已位元核對並實際看過，確認平頂、強豎梃玻璃面及低矮淺黃磚牆，與舊址照片不同。鐘塔的雙片混凝土、頂部相連及豎向銅葉片依HE1229934原文，不冒稱這張照片拍到了鐘塔。四張可用實景、拒用舊址圖與403／429前置失敗均記在[source provenance](assets/GPT-033/source-provenance.json)，來源原照不放進遊戲。

本筆加入十款獨立世界座標幾何、四十個原生向與第六輯目錄；玻璃45°工場屋脊／兩段90°階梯宿舍／食堂桶拱和V形梯頂／六角懸挑與露出鋼管尖頂／低平學院及雙片鐘塔／白色懸挑T形醫師學院／直曲窗山花的古典議事廳／雙院落及鏤空尖塔／坡岸錯層鋸齒簷／半圓豎井階梯講堂，分別建模。只用原有光柵器和調色板，不改全局觀感、模擬、價格、RNG、解鎖或存檔格式。舊smoke逐位元保留，只加本卡一條自檢。

十款幾何尚無CI像素或圖審結果；本機只做靜態來源／語法檢查。來源前置腳本在完成必要照片觀察後移除，自己的同一暫用workflow進入完整13工作原生驗收；來源讀取成功不是美術驗收成功。fp／style保持main原件，等待含最新main的本次push實際計算；全部凍結驗收與第一個commit相同。第六波仍未完成，累計維持5／20波、50座。


## 首輪完整原生結果（精確282ca39；尚未接納基線／發布）

[原生run39107472000](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000)仍為failure，只有baseline-evidence因尚未接納本波新指紋／style而紅；其餘12個工作實際success。不能稱完整workflow已綠。

- [native117616342176](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342176)：86項自檢、12真首紅／恢復、十款DOM扣費放置、undo／redo／退款／參照格拆除、新外觀兩輪load/save完整欄位穩定；四十向／八十原始PNG，semi／leak／crop／empty／mismatch全0。[原始manifest](assets/GPT-033/native-initial-282ca39.json)。
- [normal-pairs117616342183](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342183)：獨立BASE1bf22ad與HEAD正常模型，seeds31／71／103×3檢查點全欄只差明列的實際b.v，真少$1首紅／恢復；BASE與HEAD各十款匹配交易、首次update／市長選項及兩輪保存差異[]，fieldExclusions=[]。[原始console值](assets/GPT-033/normal-pairs-initial-282ca39.json)。
- [scenes117616342185](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342185)：57狀態＋40邊緣，8／8完整1280×657 BASE／閥關逐位元相同，failures=[]、unrun=[]；真正舊檔兩輪全欄、實際畫布1px與真保存少$1首紅／恢復。[原始manifest](assets/GPT-033/scenes-initial-282ca39.json)。
- [pedestrians117616342232](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342232)：17原生深度／遮擋例及兩真負控制／恢復成功。[performance117616342198](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342198)：40組交錯median BASE11.925／HEAD2.600ms、p90 24.850／26.850ms，暖畫新烘焙0，30真延遲樣本及恢復成功。[原始console值](assets/GPT-033/performance-initial-282ca39.json)。僅Ubuntu桌面Chromium參考，不冒充手機。
- 原始80PNG／三接觸表／manifest與十張near全景共95個檔案已傳回並逐檔bytes／SHA驗證；日夜四十向接觸表、新舊比較、十張near全景均人工看過。全部97圖仍未逐張人工覆核、實體手機／Safari／觸控未測。

[常規push39107472052](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472052)的fp及[baseline job117616342226](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472000/job/117616342226)核實只新增360–399四十葉，3583舊subs、其餘165個fp家族、blocks1728／5ef6eb67逐位元不變，沒有env警告；164個非bld的style家族原值不變。本筆沒有提交初輪raw基線，先修人工圖審觀察並等待專項批准PR41發布，再同步真正最新main後重新取同次push的raw基線。

| 初輪軸（282ca39，之後仍重測） | main前 | 首輪後 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9472259747892049 | 0.9483916279248801 |
| lightDir | 0.8236259228876128 | 0.8212867355043686 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9874138870772997 | 0.9878124942475206 |
| variants | 1 | 1 |
| total | 0.9655 | 0.9654 |

初輪bld總分與lightDir下降如上；依第二項起連續授權如實披露，不改分數或判準。正式PR／方向完成列仍須寫最終同次raw結果。

### 人工圖審修正與合併協調

補UEA兩折逃生梯的中間支柱、上方連接平台及承柱，確保通往既有後廊；加清楚York實景的開放鋼管頂架，保持真正透空。新舊比較接觸表改四欄各384、每列360，所有精靈仍1:1原始複製：舊014學院實際304×320、4×4地基，原260×240小格會溢出；新格完整容納，不裁圖、不縮圖、不改原始PNG。這些是新幾何／證據排版的修正，原全部驗收不放寬，修正後仍須新CI及圖審。

業主07:22已另批准CI去重PR41，工作者正在準備T759／v14.52／r206；本波不占T759、不合main、不修改共用CI。待該項實際合併、發布後同步main，再取當時最大號與重跑本波驗收；文件與初輪測試不當第六波已發布。


初輪[smoke117616480201](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472052/job/117616480201)實際三次成功（57.3／49.9／49.0秒），86項本卡自檢及T757不可變fixture首紅／恢復各跑三次。[財務117616480226](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39107472052/job/117616480226)實際52項／10負控制，唯一failure為 `current renderer fingerprints match the committed baselines`；因初輪尚未接納bld四十新葉，沒有把52寫成53，也沒有重跑失敗守衛。圖審修正以新commit完整重測，先不占T號或接納舊raw，仍等PR41實際發布後同步main。


## 圖審修正後原生結果與分支基線（精確a6e406e；未配T／未發布）

[修正run39108241441](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441)的12個原生／傳回工作實際success，只有尚未接納新基線的baseline-evidence仍failure，不把overall寫綠。[native117618629823](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629823)仍86項／12首紅及完整新檔交易；[scenes117618629793](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629793)57＋40／8整幀相同、failures與unrun皆[]；[行人117618629815](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629815)17例與真負控制成功；[normal-pairs117618629885](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629885)正常三種子／全欄新舊檔與十款交易穩定；[performance117618629896](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629896)40組交錯、30真延遲控制與恢復成功。原始[native](assets/GPT-033/native-fix-a6e406e.json)、[scenes](assets/GPT-033/scenes-fix-a6e406e.json)、[normal pairs](assets/GPT-033/normal-pairs-fix-a6e406e.json)、[performance](assets/GPT-033/performance-fix-a6e406e.json)逐位元保留。

修正後80原始PNG、三張接觸表與兩份manifest已逐檔驗bytes／SHA。與初輪相比只有UEA／York共8個向、10張日夜PNG實際變動，另70張PNG逐位元相同；新的40向日／夜接觸表與完整舊款比較表已實際看過，確認平台連接、鋼架及大尺寸舊圖完整容納。新十張near全景人工覆核仍待傳回；不把初輪十近景稱為修正後十圖。全97圖人工與實體手機／Safari／觸控未測仍保留。

本筆前再讀遠端main仍1bf22ad、CI／Pages成功；PR41尚未合併。只在自己的分支逐位元接納這次含當時最新main的push a6e406e之[baseline117618629698](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108241441/job/117618629698)兩份raw原件，3583舊subs／165其餘fp族／blocks／env及164其餘style族均相同。沒有配T號、合main或宣稱第六波發布；PR41完成後仍須再次同步真正最新main與新驗收，不以本次接納跳過該流程。

| 軸（a6e406e） | main前 | 修正後 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9472259747892049 | 0.9483921112714824 |
| lightDir | 0.8236259228876128 | 0.8212867355043686 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9874138870772997 | 0.9878124606474332 |
| variants | 1 | 1 |
| total | 0.9655 | 0.9654 |

lightDir及總分下降依第二項起連續授權披露，沒有改分數或判準；兩檔保留CI原始generatedAt／T758／14.51等metadata，未手改。接納後完整新run、常規CI與新獨立審查都仍待實測。自己的workflow仍在，須真正最後完整綠並記卡後才獨立刪除。

## 分支基線接納後完整綠（精確1f15592；仍未發布）

[原生run39108933867](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108933867)在`1f1559294aa4d22ba936e3214d654a76d7dec0c6`全部13個工作實際success，包含baseline-evidence與5個原始場景傳回工作。[native117620675619](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108933867/job/117620675619)原始[manifest](assets/GPT-033/native-baseline-1f15592.json)核實86項／12首紅控制、80張PNG的bytes／SHA與已圖審a6原件逐一相同；不是宣稱重新人工看了80張。修正後十張near原始全景也已完成圖審覆蓋：七張變更原件逐張重新看過，Glasgow／Dunelm／Roger Stevens三張與初輪已看原件逐位元相同而沿用；全部97場景逐張人工、實體手機／Safari／觸控仍未測。

[常規push39108933870](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39108933870)全部success：smoke117620675830實際三次、本卡86項各跑三次；fp117620675850與本分支基線相比零變，對BASE只新增bld40、舊葉／其他家族／blocks／env不變；財務117620675688為`ok:true, checks:53, negative:10, failures:[]`。沒有靠重跑把首輪紅改寫成成功。最終發布仍須接最新main、最後head驗收及獨立程式／安全審查。

PR41已於2026-10-18 07:55:36 UTC實際合入main `95689b5c8db4008952d7a15aab60724ae60d9ed0`（T759／v14.52／r206）；已讀入並逐位元核對該main的共用CI、helper／test、卡及日誌，遊戲只變三個發布字。main的CI／既有自動Pages與正式URL仍待該工作者核實，本波不搶先合併。自己的分支同步會完整保留這些業主批准的上游檔，不改共用CI。上游PR41改為在同一精確head／同樹證據齊備時由PR重用push三次smoke／fp／財務結果；本卡原凍結驗收文字保留，實際最終紀錄會明列「PR重用」或「PR實跑」，不能把重用冒稱另啟動三次瀏覽器。

### PR42明確批准與最新main同步

首次建立本波草稿PR被自動核准審查拒絕，理由為美術／程式超出它當時承認的docs-only範圍；確定未執行，沒有換路徑。業主2026-10-18 08:15 UTC訊息`Sentinel_aa9f25f1b2b0819185c281f15582b107`直接答覆08:11的精確確認「三項都允許」，其中第1項為「Lab第6波：允許把gpt/british-wave06-033的10棟學院建築及相關程式，在GlimmerTown-lab建立草稿PR」。收到可信頂層授權後，先核實現有PR為空，再將原呼叫原樣重試一次，實際建立[草稿PR42](https://github.com/lijiabao1998/GlimmerTown-lab/pull/42)。本次明確批准只涵蓋建立草稿PR，不轉Ready、不合併或發布。

PR41的main [CI39109491116](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39109491116)與既有自動[Pages39109881451](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39109881451)均已實際success；公站v14.52／T759由該工作者核實。此同步以main95689b5作第二父提交保留歷史，共用CI／helper／測試／上游卡與日誌均逐位元保留；自己的索引只對齊三個上游發布字，不占T759、不配新T、不添加本波發布日誌、不改方向檔。含該main的新push／PR須重新驗收並取其raw基線，舊1f全綠不冒充同步後head結果。自己的唯讀workflow仍保留，待後續正式發布準備及最後完整綠後才按原規則另筆獨立刪除；第六波仍未發布，正式計數5／20、50座。

### 最新main同次push的raw基線（精確b0d3442）

同步已實際推為`b0d3442019a720e4115dfe4659de9342b077c236`，第二父正是最新main95689b5；[baseline-evidence117628231190](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39111435123/job/117628231190)實際success，該次[push fp117628231476](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39111435124/job/117628231476)也success。這筆只原封接納同次push的兩份raw原件：fp.json395423 bytes／SHA256 `08f86533d6d8fa8c8e2fe5da14e77c46d2be4e003956758b98d1aaa012ffba6e`，style.json73168 bytes／SHA256 `ee72b475fe901c10e097e75fc8288368eb8a9a77673833b9e3d07e70451f7d1d`。保留CI原生generatedAt、v14.52／T759／version_fp，沒有手改metadata或分數。

與main95689b5比，新增恰為`bld.24_1_360..399`四十葉，3583舊subs、165其餘fp家族、blocks1728／5ef6eb67與164其餘style家族逐位元相同。與前次a6原件相比，所有非metadata值完全一致；main95689b5的fp／style又與1bf完全相同，因此前表七軸數值仍全部適用：bld總分0.9655→0.9654、lightDir0.8236259228876128→0.8212867355043686，照第二項起連續授權明列下降。單一baseline工作與fp成功不冒充完整13工作或PR成功；這筆基線提交的全部新head驗收仍待實際完成，PR保持草稿。

## 2026-10-18 09:42 UTC：精確修正與發布批准（施工前追加）

業主訊息 `Sentinel_bba89515ccc88191a2553646b644bf6c` 直接回覆助手同時刻 `Sentinel_6913b3d2d8cc8191bd3c10bea0d5013f` 的精確確認「允許」。確認內容為：「待批准仍只有Lab PR42：在GlimmerTown-lab修復公開探針sandbox、移除臨時workflow及完成發布準備；最後驗收全綠後轉Ready、合入main並核驗Pages，發布第6波10棟。允許嗎？3D已批准項目不需再答覆。」這是先前只准草稿之後的新授權，不回寫舊紀錄。僅操作本PR及自己的分支，不改既有判準或共用CI；不手動觸發Pages。

動手前核對遠端main仍95689b5，main CI39109491116與Pages39109881451成功，只有草稿PR42開著。docs/T檔名、main提交標題與AUTORUN-LOG三權威最大T759，最大輪次r206；預備T760／v14.53／r207，合前仍須再核。雲端git fetch實報 `fatal: unable to access 'https://github.com/lijiabao1998/GlimmerTown-lab.git/': CONNECT tunnel failed, response 403`；使用仍正常的已連接GitHub工具核對及更新同一雲端分支，不改用業主電腦。

追加驗收（原十條與所有舊門檻保持）：

1. P2 r4306407766只改本卡新`probePublicSite033.cjs`：以既有findChrome及探針內spawn啟動Chrome，不加任何停用sandbox旗標；啟動不支援就回報原錯誤，不改OS安全設定、不改受保護harness.js、不做不安全fallback。導航公站前留下真實啟動參數／sandbox證據，故意停用時須首紅並恢復。既有HTTP／URL／SHA／版本／錨點五真負控制、slot3、原生UI、完整畫布與runtimeErrors檢查全保留。
2. 新T／版本／日誌／方向待辦與已完成列一併準備，開關與方向原話不改；卡搬成T760並保留原GPT-033及首commit家族證據。重新取得含最新main的新完整原生run與push／PR驗收；既有raw基線不手改metadata。80原PNG及10近景與已獨立圖審原件做bytes／SHA核對，變更圖像須重新實看。
3. 最後完整run真綠、原始證據記卡後，另筆只刪自己的workflow；刪除之後每筆提交確認未加回。最後head分支smoke3／fp／財務53／10與PR實際重用模式須成功，取得精確head獨立程式／安全覆核並處理findings。原圖審環境0張回執不充作通過；新獨立審稿者於01a已實看80單圖＋3接觸表＋10近景、核84原檔及10近景SHA，無已確認視覺finding，見PR42交付留言6248182200；87其餘場景與實體裝置限制保留。
4. 精確最後head通過才Ready及合PR42，追同SHA main CI與既有自動Pages，再用已恢復sandbox的公開探針核真URL／HTML SHA／v14.53／T760／第六輯10款40葉及畫布。合入與公開核實完成之前仍僅5／20波50座，不把本施工計畫當發布。


## 2026-10-20 接替執行：恢復遠端原件及最小修正

本任務經業主明確批准替代長期斷線舊任務，接續同PR42，不重畫。遠端PR仍Draft，head5f149b6、main95689b5；已連線GitHub工具核對main CI39109491116／Pages39109881451及head的PR CI39116765642皆success，僅此PR開放。容器初始為乾淨main，沒有舊任務本地原圖或未提交檔；標準及升權唯讀git fetch各遇代理CONNECT403，gh token無效，不登入、不變更憑證或遠端。經GitHub工具取得完整差異，恢復後1154個檔案逐一核對遠端blob SHA，零不符；本地恢復快照不等於已commit或發布。倉庫及workspace無可用.agents/skills，AGENTS／CLAUDE／AUTORUN／DECISIONS／不改壞標準已讀。

先前獨立圖審與Security Review按留言6248182200保留範圍與限制，不冒稱本容器已有原檔。尚未更改任何033美術、runtime、CSS、既有基線、smoke或共用CI／harness。僅修probePublicSite033：findChrome＋本檔spawn，禁止停用sandbox的啟動參數；先在同一Chrome實讀chrome://sandbox的PID／Network namespace及Seccomp-BPF為Yes，再導航公站。沙箱啟動／狀態失敗會保留原錯誤並失敗，無降級或OS安全設定變更。新增禁用參數及失效狀態兩項首紅／恢復，原HTTP／URL／SHA／版本／錨點五負控制和slot3／畫布／目錄／runtimeErrors全部保留。語法與92段index內嵌來源精確核對已完成；沒有在本機啟動遊戲或Chrome。

三權威main最大T759、日誌r206，沿已預留T760／v14.53／r207；只改三個發布字，方向開關與原話逐位元保留。日誌及方向列明須待真合併與公開核實生效。workflow仍保留，等待本次完整原生run成功，記卡後才獨立只刪。後續任何新結果均追加，不將舊證據或施工計畫當成執行完成。
