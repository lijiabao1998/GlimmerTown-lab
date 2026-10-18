# GPT-031：第五波十座有考據的英式海岸與港口建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave05-031`，只推此分支；起點為遠端 main **38a27743e9708517d88e251a005c3475fff1bbe7**（v14.49／T756／r203）。卡面單獨先推，成功後才開始本波美術，不重寫已推歷史。
- **第一個 commit 宣告要動的 fp 家族：`bld`，只有這一族。** 預留 `bld.24_1_320` 至 `bld.24_1_359`，40 葉＝10 座×4 結構視角。起點未使用這些鍵；3543 個既有 subs、其餘165家族、blocks／block559、環境葉必須零變。
- 對應業主2026-10-16原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」本卡只做第五波10座；前四波已實際發布40座，T748歷史15座不計入。文件、來源、候選與預覽不算已實作或發布。
- 開卡前 main [39094112934](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094112934)三工作成功（main原配置煙霧1次、fp、財務53項／10負控制），[自動Pages39094482136](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094482136)同一SHA成功，無開啟PR，方向仍「運行」，最上待辦為第五波。
- 第四波真正公開URL已由[117578386686](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39092129437/job/117578386686)於2026-10-18 03:44 UTC核實：HTTP及Chrome文件200、11014291 bytes、SHA256 `c82b281c94090f497d7638398efe6b369b437d6c9a30249bc6809b30a30db276`，等於獨立main38a2774；v14.49／T756、slot3、第四輯10款40向、runtimeErrors[]。原始公開menu／city／第四輯catalog均已人工看過。該探針head是6a91671，manifest的base才是正式main38a2774，不混寫來源。
- baseline：166家族、3543 subs、bld1179葉／總分0.9656；七軸palette1、hardEdge0.9459846379810595、lightDir0.8261238337574215、shade1、density1、nightRule0.986992585347136、variants1；blocks1728／CRC `5ef6eb67`。fp／style原始metadata仍T755／14.48，保留CI原值，不手改。
- 本機只讀Git、靜態來源及原始圖檔位元；所有遊戲、Chrome、指紋、像素、場景與效能執行交GitHub Actions。選定雲端一般HTTPS仍可能報代理CONNECT403，不改用使用者電腦。

## 目標與一手來源（施工前候選）

十款包含窄高木鋪、九柱架空方燈室、低曲翼泳場、高長郵輪式公寓、矮厚海防塔、開放式帆形觀景塔、古典海關、通風塔、帶住宿的高燈塔及碼頭救生艇庫。先核實原文與必要的官方實物照片，再畫各款；下表是候選與研究要求，尚未繪製。若某款查明與既有形制重複或來源不足，可在畫該款前換有一手來源的原型並記理由，10座／40鍵／家族與以下凍結驗收不變。

| 四向起始v | 原型／一手來源 | 結構與繪製前核實要求 |
|---|---|---|
| 320 | [Hastings Net Shops保存調查](https://hastingstrust.hastingsvoluntaryaction.org.uk/sites/hastingstrust.hastingsvoluntaryaction.org.uk/files/910000%20Fishermen%27s%20Net%20Shops.pdf)；[保存者地方史](https://hastingshistory.net/hastings-net-shops) | 窄地塊上向上發展的黑色木製漁具儲藏鋪群，選取高低不同的具體組合；畫前核實層門、屋脊、木板與梯道，不畫成只換黑色的普通住宅，不捏造整排歷史總數。 |
| 324 | [Burnham Low Lighthouse，HE1262771](https://historicengland.org.uk/listing/the-list/list-entry/1262771) | 正方木板燈室、9木柱、金屬四坡頂與頂部長方突起、海向雙扇窗、後方兩段開放木梯；條紋記載與現況照片須再比，不憑舊名錄誤植色帶方向。 |
| 328 | [Saltdean Lido，HE1380905](https://historicengland.org.uk/listing/the-list/list-entry/1380905) | 半圓中央兩層樓、曲翼與開放日光露臺、五根細柱支撐的罩棚、中央上部solarium，主池一側橢圓收邊；壓縮平面並說明選取的歷史構件，不添加泳池玩法，不重做De La Warr。 |
| 332 | [Marine Court，HE1379435](https://historicengland.org.uk/listing/the-list/list-entry/1379435) | 名錄明列14層、兩層podium、海向陽臺與圓弧兩端，背部四座封閉樓梯間及外梯；平頂長高量體、層帶與玻璃有真結構，不套Hoover雙樓梯塔或普通高樓換白。 |
| 336 | [Portsmouth Round Tower，HE1386901](https://historicengland.org.uk/listing/the-list/list-entry/1386901) | 名錄為3層圓柱、凸出下層、石帶、瀝青平平台；港向北／西3個砲孔為平節段拱，另有封堵孔。不能誤畫成兩層或Windsor雉堞塔，不新增戰鬥機制。 |
| 340 | [Spinnaker Tower工程核算者原始案例](https://www.lusas.com/case/civil/spinnaker_tower.html) | 兩根傾斜六角混凝土井道合併、兩條交叉鋼弓及翼形肋、3個不同尺寸梯形觀景平台、針狀頂；依170m原設計壓縮，不能把帆輪廓畫成實心三角盒。 |
| 344 | [King’s Lynn Custom House，HE1195414](https://historicengland.org.uk/listing/the-list/list-entry/1195414) | 近方平面、南北5開間／東西4開間、封閉拱廊及Doric／Ionic壁柱、不同面老虎窗；四坡瓦頂中部平臺、希臘十字四拱燈亭再接六角ogee帽。縮放轉譯，不把所有面複製同一窗列。 |
| 348 | [George’s Dock Ventilation Station，HE1187177](https://historicengland.org.uk/listing/the-list/list-entry/1187177) | 真實通風塔與基部辦公翼的Art Deco量體；畫前再核名錄的屋面、通風口、窗帶及裝飾位置，不以功能名稱猜一個方箱，也不新增隧道通風或交通數值。 |
| 352 | [Portland Bill Lighthouse，HE1280498](https://historicengland.org.uk/listing/the-list/list-entry/1280498) | 漸縮燈塔身、圓頂燈室與12段鑄鐵圍欄、五段深窗，低連廊接兩層4×3開間平頂住宿樓及4大煙囪、低圍牆；35m塔身與全高不同，明列比例壓縮，不能只替舊燈塔換條紋。 |
| 356 | [Cromer Lifeboat Station官方實景](https://rnli.org/find-my-nearest/lifeboat-stations/cromer-lifeboat-station)；[RNLI站史](https://rnli.org/find-my-nearest/lifeboat-stations/cromer-lifeboat-station/station-history-cromer) | 官方記1998年10月新ALB艇庫／slipway完成、2007年適配Tamar；屋面、支承、門窗與下水道須先看官方原圖再定幾何。既有018艇庫是石牆拱窗虛構展館，不沿用其量體；本站僅作地標外觀，不新增救援或船舶玩法。 |

來源提供真實形制依據；不能把有連結或名稱不同當成已證明不重複。仍要看單色輪廓、新舊接觸表與完整近景。Cromer官方照片的一般HTTPS讀取目前報 `Tunnel connection failed: 403 Forbidden`；可用本分支唯讀CI取回原圖再看，未看前不畫這一款。候選照片僅研究參照，不嵌入正式遊戲。

## 實作邊界與退路

- 沿用k24的2×2、160×196、anchor80／194、$2000原生landmark。僅在原生有費放置成功後變更根b.v；價格、解鎖、容量、工作、觀光、上限、RNG、存檔格式、undo／redo、拆除／退款與載入API均不改。
- 四向各自投影完整幾何，不能以正面圖鏡像冒充。自己的 `__noBritishWave031` 關閉後回退actual base；只有整幀閥測試可開此退路，正常配對、保存、付費及效能不靠閥。
- 剝除本卡明確標記的新增來源及安裝點，必須逐位元還原38a2774；發布準備僅另容許GAME_VER、GAME_ANCHOR、開始畫面三個精確版本標記。既有函式只做最小可逆外觀包裝，不動舊分支自檢或判準。
- 不改全局觀感、密度、街區、道路與模擬；既有smoke只加一條新自檢，不動原斷言、fp／harness／gallery、舊probe、pins或規則。
- 只有自己的分支專用workflow，`permissions: contents: read`，不推送、不部署、不寫其他對象；不能加回027／029／030專用workflow。最後完整run成功、記卡後，以獨立只刪自己workflow的commit移除，之後每筆確認沒有加回。
- 退路為本卡純revert並過原守衛；不動他人工作區或分支、不force、不手動觸發pages.yml。

## 凍結驗收條件（動手前；之後不得改鬆）

1. **10座×4向×日夜80原圖**：逐款有可追溯一手依據、不同平面／屋頂／門窗與高低胖瘦，不重複既有或本批其他款。保留原PNG、SHA、日夜及最接近舊圖的比較接觸表、十款完整近景；單色輪廓也有差，不只換色。未核實的來源／照片不得寫成已看。
2. **精靈物理邊界**：40向尺寸／錨點／sz正確，日夜不空、實心硬像素、無邊緣裁切；夜光只在實際有日圖支承的窗／燈面，不做外飄光。直接建模與已安裝原生精靈逐像素一致，四向由真正幾何生成。
3. **原生有費與保存**：真DOM點十款、每筆原生doPlace扣款，逐款undo／redo／退款／參照格拆除。十款新外觀與真正base原生舊檔都load→save→load→save兩輪，全部序列化欄位一致；只准宣告的根b.v外觀差及精確發布gameVer遷移，不能因v≥320改存檔處理。
4. **獨立BASE正常配對**：保留actual base38a2774原始git來源、全部兩端結果，seeds31／71／103×3檢查點；正常所有欄位、財務與同時間線相同。發布時只可先置換獨立BASE的三個精確版本字，保留原文並驗反向逐位元還原；不正規化輸出、不刪region.ver等欄。真正舊檔遷移另驗未改actual base。
5. **新守衛真反例**：每條本卡新守衛必須有改壞實際輸入／像素／原生API的首紅與同判準恢復；原生金錢−1由原全欄comparator捕捉三種子，不用永假assert或循環答案。
6. **完整狀態與全幀**：至少57狀態＋40真邊界，含日夜、四季、冬雪有無、四向、遠近、地圖邊緣、施工、懸停、人、窗燈、招牌與適用疊層；不適用的原生倒影／煙等依原碼說明。只開本卡閥時actual BASE／HEAD的日夜四向1280×657全畫布8／8逐位元相等，不能裁切、遮罩、關其他層或加容差。
7. **行人與效能**：至少17原生深度／遮擋例、實際負控制與恢復；同環境BASE／HEAD40組交錯效能，比median／p90，暖畫新烘焙0；真延遲負控制至少30實際樣本、恢復再量。處理已知原生週期噪音，不另造追蹤基建，不以桌面CI冒充手機／Safari／觸控。
8. **fp限定與七軸**：相對含最新main的push只新增bld40葉，3543舊subs、165其他家族、blocks1728／5ef6eb67、env全部不變。fp／style只逐位元原封取本次CI原始fp-rebake兩檔，禁止手改時間／版本／分數／環境。披露bld前後七軸；下降依第二波起連續授權在卡、PR與方向已完成表註明。
9. **最後CI與新審查**：最後head分支／PR各smoke實數三次、fp、既有財務53／10全綠、無env警告，不靠重跑。自己的唯讀workflow最後完整run綠並附卡，才以只刪該檔的commit移除，後續每筆確認沒有加回。Ready後請新的Codex程式與安全審查，處理真實findings；沒回覆或未執行不稱通過。
10. **合併、發布、進度**：再核main、方向、PR、CI／Pages、ancestry，按三權威最大號配T／版本／日誌，搬卡、更新待辦及條件式完成列，main的開關／方向原文不動。最後綠且規約／實際授權允許才合；核merged tree、main CI、既有自動Pages精確SHA，開真正公開URL看版本／第五輯目錄與畫布，不能以部署或CI綠代替。只有真正合入並完成發布核驗才計5／20；未跑事項如實記錄，續第六至二十波或真實停手條件。

## §8 開工狀態／沒做成的事

- [x] 卡面已單獨先推：[ac1df245ff94f78b4cf7680789e322b63d69b809](https://github.com/lijiabao1998/GlimmerTown-lab/commit/ac1df245ff94f78b4cf7680789e322b63d69b809)，只有本卡一檔，parent為上述main；本波美術尚未開始。
- [ ] 本波10款尚未繪製，尚無原生樣張、正常配對／新舊檔、fp、全幀／完整狀態、行人、負控制或效能結果。
- [ ] 最後head常規CI、專用CI與新審查尚未執行。
- [ ] 全部美術狀態／實體手機／Safari／觸控尚未人工測試，不假勾。
- [x] 現有第四波正式URL核驗已有真實回應與原圖，前四波4／20、40座；這不是第五波完成證據。
- [x] 第三及第四波原生日夜圖與完整80PNG包保留，GitHub原始ZIP可用；Library唯讀診斷仍 `hosted apps tools/list request failed: network`，prepare／upload／finalize均未重試，Library已存0檔，不以本機路徑當交付。

本卡尚未實作或發布。所有遊戲與像素守衛只在GitHub Actions執行；原始素材研究、流程文件與候選不列為已完成建築。


## 只讀考據前置工作（已核對原件）

本筆只加自己分支專用、contents:read的暫用workflow及原始來源讀取程式，取得RNLI官方Cromer照片與Hastings保存調查PDF，核對SHA並保留第一頁及原文。這個前置工作不啟動遊戲、不繪第五波，也不是原生美術驗收。看過必要原圖後才畫各款；來源照片不嵌入正式遊戲。完整美術階段仍需本卡凍結的全部原生守衛。


### 第一輪來源原件已看（不代表本波完成）

- [唯讀來源run39095336484](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39095336484)成功，head fc35db83ffacc10171d2238d688f2371f8f97651；官方RNLI原圖與Hastings保存調查PDF皆HTTP200，四份傳回檔長度與SHA全部相符。已人工看照片、PDF封面與原文。
- Hastings採羽邊水平木板、兩至三層、逐層裝卸外門；內部梯道不畫成外梯。RNLI的Cromer為分段淺弧金屬頂、木板牆與高窗帶、黑鋼柱支承、混凝土下水斜道，與018既有石拱窗／山牆艇庫不同。
- 本筆追加唯讀來源照片：由Somerset官方頁取得Burnham實景核對色帶方向，由Wikipedia原始照片連結取得George’s Dock實物圖（照片只作觀察，建築文字事實仍依Historic England原名錄；不引用Wikipedia矛盾樓層數）。兩款在看過圖前不開始繪製；其餘模型可依已核實的一手資料進行。
- head fc35db8原有常規CI三工作success；該head尚無第五波遊戲圖，不能算本波驗收。


追加來源run39096003546首輪失敗：Somerset官方圖片檔名含©，urllib發請求時報 `UnicodeEncodeError: 'ascii' codec can't encode character '\xa9' in position 58: ordinal not in range(128)`，未進入遊戲。修正為對來源原始URL做標準UTF-8百分號編碼，保留來源實物位元；修正後的新commit重新跑，不以重跑賭過。


修正後[run39096150097](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39096150097)成功，四張來源照片及manifest五檔已核長度／SHA並實際看過。George’s Dock照片確認高石塔、頂部細長格柵、中央直紋浮雕與兩側深凹窗組，塔不畫成住宅窗層。Somerset三張Burnham照片都為後側，確認九柱、黑色下部後牆、外梯、金屬四坡頂，仍沒有看見海向紅帶，故追加2021原攝影者海向照片再畫該款，不將後視照片當正面證據。
