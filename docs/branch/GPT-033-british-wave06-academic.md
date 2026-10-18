# GPT-033：第六波十座有考據的英式學院與學術建築

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
