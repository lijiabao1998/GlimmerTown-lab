# GPT-036：第八波十座有考據的英式醫療與照護建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave08-036`，起點為最新遠端main `50d0d52b2617460670f180dbaafa0a89bc806a5b`（T761／v14.54／r208），root tree `342ceda0b04b3787550706906126ae529302f46c`。本卡須先單獨提交、遠端確認成功，才繪製新美術；第一筆相對main只新增本卡。
- **第一個commit凍結唯一fp家族：`bld`。** 只新增 `bld.24_1_440..479` 共40葉＝10款×4原生幾何向。main既有3663 subs、165其餘家族、blocks1728／CRC `5ef6eb67`、env全部零變；440..479目前無占用。既有原始fp/style不手改metadata或分數，不擴張受保護檔案、既有判準或權限。
- 對應業主2026-10-16原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」照AGENTS第7節含連續授權；第八波取最新方向待辦首項「醫療與照護」。方向／開關已在既有main，仍運行；不重建方向PR、不改排程。
- 本輪使用者範圍是第八波實作、測試、Draft PR及可供獨立程式／安全／圖審的實際原圖證據。提早交付精確head／artifact IDs，不把第七波單輪確認當第八波發布批准。本輪不轉Ready、不合併、不部署、不配T／改版本或主線日誌。
- 開工無開放PR，遠端無第八波分支；保留所有Claude／其他分支，僅寫自己的分支。現有本地第七波內容已逐tree核對等於已合入main，再恢復GitHub原簽章的精確main物件，從main建立乾淨本地第八波分支，沒有覆蓋其他寫入者。
- 最新main CI [39374964862](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39374964862)與既有自動Pages [39375586942](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39375586942)均success。公站[job118473699187](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39370841520/job/118473699187)已真核HTTP／Chrome文件200、11,183,234 bytes、SHA256 `825bc9dd04b9461eadc572f36469dacbf6178ea50b7a39a807c14f837a3eec5f`等於main，v14.54／T761、第七輯10款40葉、slot3活畫布及沙箱／7負控制。正式計數仍7／20波、70座，不計T748歷史15座；第七波[發布回執6284279231](https://github.com/lijiabao1998/GlimmerTown-lab/pull/43#issuecomment-6284279231)保留。
- 基線166家族／3663 subs，bld1299／CRC `6fe6e361`。bld七軸palette1、hardEdge0.949393389794125、lightDir0.8183217859892224、shade1、density1、nightRule0.9881813927037836、variants1、total0.9651；原始metadata仍T760／14.53，不手改。
- 所有遊戲、Chrome、像素、fp與效能只在GitHub Actions；本地僅Git／靜態來源／語法／JSON／原圖bytes與人工觀看。自用埠8199、存檔slot3，不碰業主存檔。臨時workflow僅綁自己分支、contents:read，不部署或寫入；原有wave035 workflow保持刪除，不加回。

## 十款原型與一手來源（文字初核，照片核實後才繪製）

僅以原生2×2地標作外觀展示，沿用價格、解鎖、容量、就業、觀光、維護及保存；沒有新增治療、健康、養老、患者或支持服務玩法，也不暗示Maggie's中心是住院醫院。原型為比例壓縮的原創世界幾何，非測繪複製，不嵌入來源照片。正式繪製前看可驗證原照片、排查既有款及結構比較；來源不足只可在繪製前替換原型並記理由，10款／40鍵／唯一家族／驗收不變。

| 起始v | 原型／一手來源 | 結構辨識點（定稿前核實照片） |
|---|---|---|
| 440 | [Finsbury Health Centre，HE1297993](https://historicengland.org.uk/listing/the-list/list-entry/1297993) | 斜張雙翼H形、凸出玻璃磚入口與直坡道、上層退台、後部低弧形講堂頂；不是普通白方盒或Dudley入口換色 |
| 444 | [Royal Hospital Chelsea主體，HE1226301](https://historicengland.org.uk/listing/the-list/list-entry/1226301) | 深磚三層病舍／養老院、中央Doric山花門廊、杯狀頂及開放柱廊、回折翼形成庭院；壓縮Figure Court主體，不冒稱完整校區 |
| 448 | [Hospital of St Cross，HE1095374](https://historicengland.org.uk/listing/the-list/list-entry/1095374) | 中世紀門塔、雙聯窗大廳、迴廊與高煙囪養老院、後方十字教堂大中央塔；層次不同於單座城堡或教堂 |
| 452 | [Ford's Hospital Coventry，HE1342891](https://historicengland.org.uk/listing/the-list/list-entry/1342891) | 密木骨、挑出上層、四心拱入口與狹長露天內院，非Globe圓環或一般排屋；1509捐贈／1529牆記／戰後重建不混稱同一年代 |
| 456 | [Trinity Hospital Greenwich，HE1078961](https://historicengland.org.uk/listing/the-list/list-entry/1078961) | 小尺度雙層灰白stucco前面、中央拱門鐘塔、雉堞、端部階梯山牆與實體內院；後面雜色磚，不能整棟只畫紅磚 |
| 460 | [Royal Mineral Water Hospital Bath，HE1395448](https://historicengland.org.uk/listing/the-list/list-entry/1395448) | 石灰岩雙層＋高閣、中央四巨Ionic壁柱與山花、後增西翼及跨巷連橋；入口與附屬體量依原照片取捨，非Bath普通古典排屋 |
| 464 | [Maggie's Dundee：機構建築頁](https://www.maggies.org/about-us/buildings-and-architecture/dundee/) | Gehry白色低矮小屋與起伏銀頂；有不同曲面段、連接與端部量體，不用矩形屋頂換色 |
| 468 | [Maggie's Leeds／Yorkshire：設計事務所](https://heatherwick.com/studio/news/completion-maggies-leeds/)；[機構建築頁](https://www.maggies.org/about-us/buildings-and-architecture/yorkshire/) | 三個不同高度的大花盆形木構室、交疊屋頂花園與中央連接空間；靜態種植只限本體，不改全局植被或密度 |
| 472 | [Maggie's Manchester：Foster＋Partners](https://www.fosterandpartners.com/projects/maggie-s-manchester) | 低長木構支架、開放玻璃面、抬高的中央空間與溫室；屋頂剖面以原照片／事務所資料為準 |
| 476 | [Maggie's Oxford：機構建築頁](https://www.maggies.org/about-us/buildings-and-architecture/oxford/) | 架高細柱、分岔多面木屋與折面角狀屋頂、獨立步道入口，非Leeds花盆或Manchester長溫室的換色 |

## 凍結驗收（動手前列；不准改鬆）

1. **原創四向幾何／像素**：40個原生向從同一世界幾何真旋轉，不鏡像、不拉伸照片、不單純換色。每個160×196、ax80／ay194、sz2；日圖硬像素／非空／無裁切，夜光只在日圖不透明實體上。無共同鋪地的十款幾何遮罩互異、已安裝圖等於獨立直接烘焙，全部80原PNG＋三完整接觸表＋十近景保留原bytes／SHA256，對照最接近舊款，不捏造舊款視角。
2. **真原生整合與首紅**：沿用k24／lv1／2×2／$2000；十款原生選擇、實扣費、undo／退款／redo、參照格拆除／恢復、四向旋轉皆測。至少12項真故障首紅／恢復：少葉、錯尺寸、夜漏光、軟像素、裁切、空圖、幾何克隆、安裝克隆、錯收費、redo失效、合法HTML來源越界、原生相機凍結；每項首紅須落在目標。新故障只改本波440／444等真新鍵，不誤刪第七波。
3. **來源邊界**：獨立Git BASE＝50d0d52。剝除本波明確純美術／CSS／runtime標記及唯一安裝點，只准精確還原GAME_VER／GAME_ANCHOR／startVersion456三個明列發布字後，index逐位等於BASE；本輪三版本字實際不改。原fp／style／sheet／容量／其他既有判準與模型渲染來源不變；合法越界HTML負控制必須首紅。
4. **正常模型／舊新存檔**：BASE與HEAD正常運行，不用逃生閥；seeds31／71／103×3 checkpoint，全部序列化欄位及stats比較，只准實際新外觀b.v差異，不刪欄、不正規化輸出。BASE若有發布標記對齊，須只對齊三宣告且反向還原逐字證明。十款匹配交易、首次update及市長選項惰性欄位保留；真舊檔與新外觀各兩次load→save全欄穩定，只允許明列精確gameVer遷移。少$1真保存故障首紅並恢復。
5. **57＋40原生狀態**：日／夜、春夏秋冬有無雪、四向、十款近景／遠景、地圖邊角、施工早中晚、懸停及原適用水邊／倒影／行人／煙／夜燈／招牌；97原始場景與manifest保留。2×2原地標無水面倒影、inactive煙囪無煙、neon限其他k等不適用，須按真原生路徑證明。作者至少逐張看80原PNG、三接觸表與十近景；其餘87沒有看就不寫已看，實機／Safari／觸控不冒稱測過。
6. **完整畫布等值**：`window.__noBritishWave036`即時退回舊圖。獨立BASE對HEAD閥關8張完整1280×657畫布逐位元相同，不裁圖／不容差；真畫布1px及真保存$1故障首紅／恢復。正常模型對比另跑、不借閥規避。
7. **行人／效能**：17原生繪製與深度遮擋例、真故障及恢復；同環境BASE／HEAD40組交錯median／p90，暖畫新烘焙0；30樣本真延遲負控制及恢復重測。沿原先判準，不以桌面冒稱手機、不為雜訊造基建。
8. **fp／七軸／原字節**：含最新main的push只新增明列bld40，舊3663 subs／其他165族／blocks1728／5ef6eb67／env零變，最終與本分支root基線0差且無envLeaves警告。只原封提交同次CI實際fp-rebake原始bytes，核run／head／tree／byte-count／SHA及成功artifact；不手改metadata、不重新serialize。七軸及total列前後，下降依第二項起連續授權披露於卡／PR／方向（後續發布階段），不改分或放寬。
9. **CI／獨立覆核提早交接**：最新分支真smoke三次／fp／原財務53項10負控制全綠，PR依既有T759可能重用同head／tree完整push，明寫實際模式／來源，不能把重用說成再跑。第一批實際原PNG／場景artifact成功產生就交精確head、run、artifact IDs及取回方式供獨立審稿安排；繼續驗收與作者看圖。獨立程式／安全／視覺報告須有精確head／範圍／findings／實際看圖數／雜湊及限制，CI與作者自審不可替代；後續head改動須明列差異和原圖綁定供重新確認，不擅自沿用舊head結論。
10. **workflow及最終發布流程保留**：臨時wave036 workflow只綁此分支、contents:read，不部署／推送／改PR或排程。未來發布前須最後完整run真綠且記卡，再另作只刪自己的workflow提交，後續每commit核未加回；刪後最後push／PR仍綠。原wave035保持缺席。受保護檔案、既有斷言／判準／規則／權限均不變。
11. **本輪Draft邊界**：先完成原型、實作、全部驗收、草稿PR與原圖交接。Ready／合併／T／版本／日誌／公開站新版本留後續發布階段，不用第七波單輪確認代替。未來如發布，仍須合前核最新main／Pages／方向／ancestry、三權威最大T／輪次配號，同PR版本／日誌／方向與workflow收尾，最新head驗收及獨立覆核成立後才Ready／合併；main CI、既有自動Pages與真公站內容SHA／版本／新輯10／40／活畫布分開核實後才計8／20、80座，不手動Pages、不把本地／commit／合併／部署混稱。

## §8 開工狀態／沒做成的事

- [x] 本卡首提交21b91a4已在美術動手前推成功；動手前驗收不改鬆。
- [ ] 第八波原生圖、交易、正常配對、保存、像素、場景、行人、效能、故障控制與fp均尚未執行，沒有本波通過結果。
- [ ] 尚無第八波PR或獨立覆核；第一次artifact與精確head出現就提早交接，不等收尾才安排。
- [x] 正式計數仍7／20、70座；第七波原圖、獨立覆核、主線／Pages／公站證據均保留。另87場景及實機／Safari／觸控未測的限制不轉寫成通過。
- [x] 沒有新增批准／方向卡、沒有改排程、沒有把本輪範圍擴張成發布、沒有動其他寫入者分支或擴張守門權限。

回滾：未合前停止並保留全部證據；閥關退既有圖。main／Pages紅或同問題停手條件成立，照原規則回報，不重跑賭過、不強推、不逕自revert他人內容。

## 施工紀錄（首卡後追加；原門檻不改鬆）


- 首卡已在新美術前單獨推送[21b91a4](https://github.com/lijiabao1998/GlimmerTown-lab/commit/21b91a4ef8d74b5ce5f072a2ad2fb1a393e9139d)，root tree b8df6869a630c098bbe85c599750516a1fa12d50；相對main只新增本卡，唯一凍結家族仍bld。遠端分支從精確main50d0d52建立並以head lease快進，沒有重寫歷史。
- 本地原簽章物件首次重建少了尾端gpgsig續行而SHA不符，assert在寫入前停止；之後switch因物件未入庫失敗，原檔未覆蓋。讀取已核父物件確認真實序列化後，唯一一次修正重建得到精確50d0d52，從該物件開乾淨分支。錯誤保留scratchpad/wave036/opening-local-import-error.txt。
- 容器對十個考據頁的CONNECT均被proxy403阻擋，沒有取得原站回覆／照片，完整可得錯誤逐項存scratchpad/wave036/references；未改proxy／憑證／TLS或擴張權限。依既有唯讀分支CI讀已由網頁工具核對的公開一手照片，沒有本地遊戲測試；取得與人工看圖之前不繪製。HE／機構文字已初核，來源日期不混稱現況；Bath舊院址2019已遷出，畫歷史建築外觀，不宣稱仍在舊址提供醫療。

- 考據CI來源head ac72f1437afab21984dca278ec5c947d9ac7486f／[run39377941318](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39377941318)：parts0／1／3／4成功，part2對Trinity的HE頁遇Cloudflare403，完整5,571 bytes HTML、headers、SHA256e70073413f94fddeef684f45c20b902d6cf31304b13be1467001bb5178a41645保存在原始附件；探針因Trinity照片0張如實紅，沒有改門檻或重跑舊run。其餘來源取得影像不是本波原生遊戲驗收；13張被選作建築參考的原照片已取回逐byte-count／SHA核實，排除會議室／標誌／箭頭等非外部幾何依據。
- Trinity改用已核實的獨立原攝影[N Chadwick／Geograph8136282](https://www.geograph.org.uk/photo/8136282)，2024-07-22實拍、作者頁標CC BY-SA2.0；只看原照片作建築考據，不嵌入遊戲，不把照片頁附述當建築主史料，建築細節仍以HE1078961為準。沒有重試／解挑戰／偽造UA存取被擋HE照片。新提交只讓CI補part2兩款，其他已取資料保留；Mineral明選BPT實際正立面照片，圖示不列建築依據。
- 人工看原照片發現首張Leeds為室內，不以它臆測外牆；同一未推修正加入part3，從Maggie's Yorkshire原頁的實際exterior1連結補外觀照片，Dundee同part的照片保留核對。Trinity原失敗附件12243833613／digest f0f49ed79d0b4a4a5751cf4a1f853391a5b05c1b8631785de6761f8e9b94f5a1、完整job118480205097 log均保留；來源head ac72標準smoke工作流39377941224已success。
