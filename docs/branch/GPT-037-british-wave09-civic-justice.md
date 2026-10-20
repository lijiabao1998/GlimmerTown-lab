# GPT-037：第九波十座有考據的英式市政與司法建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave09-037`，唯一BASE為最新遠端main `e195002da691b33acc1f3a2c426aba4c87c8c42d`（v14.55／T762／r209），root tree `cd061a63a36f56ff5ebce7f6a8a0f0945116f0b0`。本卡先單獨提交、遠端核實成功，才開始新美術；第一筆相對main只新增本卡。
- **首提交凍結唯一fp家族：`bld`。** 恰好新增 `bld.24_1_480..519` 共40葉＝10款×4原生幾何向。現有3703 subs、165其他家族、blocks1728／CRC `5ef6eb67`、env全部零變；480..519現未占用。不改既有款式、共享rasterizer／色盤／全局光影／人口密度／規則／守門或原判準。
- 對應main方向待辦首項「第九波十座英式市政與司法建築」，方向原話（2026-10-16）：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」依AGENTS§3、§7含連續工程授權執行；不重建方向PR、不改開關或排程，不挪用別輪單次批准。
- 開工時沒有開放PR、沒有第九波遠端分支。Claude三條分支最新紀錄分別停在2026-10-04、2026-09-24、2026-10-14，沒有本題新提交；不碰它們。已核對八波、T748及較早原型；排除已畫Lavenham、Guildford、Faversham、Appleby及泛型市政／法庭的重複設計，近似款須用真舊圖對照。
- 正式計數仍 **8／20波、80座**，不計T748歷史15座。第八波[PR44發布回執](https://github.com/lijiabao1998/GlimmerTown-lab/pull/44#issuecomment-6286785577)保留；精確main [CI39391579412](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39391579412)及[既有自動Pages39392366175](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39392366175)均success。真公開HTTP／Chrome為11,237,126 bytes、SHA256 `dcf504d8530751e1f77e0be4145b26c4ab2d3d3c43fb55865ce939900d984aed`、Git blob `493758b7165174db2592a2113a9f9baa9f0d5b1a`，v14.55／T762、第八輯10款40葉、slot3活畫布與沙箱／7負控制已核。這些只是開工基準，不冒稱第九波測試。
- root166家族／3703葉；bld1339葉／CRC `50494dfd`。bld七軸palette1、hardEdge0.9505050520005902、lightDir0.8192681105302465、shade1、density1、nightRule0.9885339952207213、variants1，total0.9655。原fp.json403824 bytes／SHA256 `295fe5fe33aa20d862a64760de86ce138d025f35ca544595e3aef43ec7c0bc07`，style.json73171 bytes／SHA256 `000031074c01957a788e75aeed5ff5a3a73579d9585c1c2fc2299219348be203`；producer metadata仍14.54／T761，不手改。
- 所有遊戲、Chrome、像素、fp及效能只在GitHub Actions；本地只做Git／靜態來源／語法／JSON／原始bytes核實與人工看圖。自用埠8199、存檔slot3，不碰業主存檔。原035／036臨時workflow保持不存在；新037若需使用，僅綁本分支、contents:read，完成後依規則純刪。

## 十款原型與一手來源（文字初核；原照片核實後才畫）

全部為原生k24／lv1／2×2／$2000的外觀選擇，沿用解鎖、觀光、就業、維護、undo／redo及保存。沒有新增司法、議會、行政、犯罪、預算、服務覆蓋或價格／容量玩法。用原創世界幾何壓縮轉譯，不嵌入照片、不當測繪複製，不宣稱所有歷史建築仍作原用途。若照片不足，可在繪製前更換候選並記原因；10款／40新鍵／唯一家族／原驗收不變。

| 起始v | 原型／一手來源 | 結構辨識點與排重 |
|---|---|---|
| 480 | [Belfast City Hall，市議會建築史](https://www.belfastcity.gov.uk/things-to-do/city-hall/history-of-belfast-city-hall) | Portland石巴洛克主體、中央銅穹頂、角部塔亭與庭院翼；不能把Alexandra長展廳或Chelsea杯頂廊換色 |
| 484 | [Manchester Town Hall，市議會建築頁](https://www.manchester.gov.uk/the-council-and-democracy/town-hall-complex/town-hall/the-building) | Waterhouse新哥德式議政建築、三角基地院落與高鐘塔、尖拱窗及陡頂；不複製Glasgow大學或Rushton小三角樓，畫歷史主體，不宣稱修復開放現況 |
| 488 | [Leeds Civic Hall，HE1255781](https://historicengland.org.uk/listing/the-list/list-entry/1255781) | V形回翼、巨柱山花門廊、雙Renaissance塔及金梟尖頂；不是Leeds Town Hall，也不是原Birmingham Museum／Big Brum |
| 492 | [Newcastle Civic Centre，市府HER9059](https://sitelines.newcastle.gov.uk/SMR/9059) | 高辦公板樓與西端鐘樂塔、低翼／庭院、橢圓議事廳架柱；海馬頂飾依原照取捨，非Preston車站或York單獨多角廳 |
| 496 | [London City Hall（2002南岸建築），Foster＋Partners](https://www.fosterandpartners.com/projects/city-hall) | 向一側傾移的球形／卵形玻璃量體、逐層退台與三角玻璃格；與Willis三葉平面不同。按2002項目歷史外觀，不宣稱仍是現任GLA總部 |
| 500 | [Scottish Parliament，議會原設計展](https://www.parliament.scot/visit/events-and-exhibitions/enric-miralles) | 倒船形委員會塔屋頂、半圓議事廳與不同高度連接量體；依原照片選取建築組特徵，不把室內展覽模型當已核完整外觀、不畫成西敏宮 |
| 504 | [Thaxted Guildhall，HE1112905](https://historicengland.org.uk/listing/the-list/list-entry/1112905) | 開放柱架底層、兩層懸挑木構與雙列四坡瓦頂；與Lavenham落地長廳、Guildford街面凸鐘、Faversham石柱上層的結構不同 |
| 508 | [Abingdon County Hall，HE1199601](https://historicengland.org.uk/listing/the-list/list-entry/1199601) | 四乘二開間石造開放底層拱廊、樓上Sessions Hall、巨壁柱、老虎窗／頂亭及南側樓梯塔；不複製Lynn Custom House或Dunster市場亭 |
| 512 | [Middlesex Guildhall，Supreme Court建築頁](https://supremecourt.uk/about-the-building/architecture) | Portland石、Flemish／Burgundian neo-Gothic量體、女兒牆／老虎窗及入口雕帶；不借用舊泛型磚哥德法庭，不畫成Westminster教堂 |
| 516 | [Royal Courts of Justice，HE1264258](https://historicengland.org.uk/listing/the-list/list-entry/1264258) | Street的Strand哥德法院主體：中央高廳門面、尖拱／玫瑰窗、側鐘塔與屋頂層次；不挪用Queen's Court或West Green後期樓，不複製StCross中世紀院落 |

## 凍結驗收（施工前列；之後不准改鬆）

1. **原創四向／原像素**：40原生向由同一世界幾何真旋轉，不鏡像、照片拉伸或單純換色。每張160×196、ax80／ay194、sz2；硬像素、非空、無裁切，夜光只落在日圖不透明實體。十款去共同鋪地的幾何遮罩互異，已安裝圖逐像素等於獨立直接烘焙。保留80日夜原PNG、三完整contact、十near的原bytes／SHA256，對照最接近真舊款，不捏造舊視角。
2. **真原生整合／至少12首紅**：十款原生catalog選擇、實扣$2000、undo／退款／redo、參照格拆除／恢復、四向旋轉與舊輯切換都驗。少葉、錯尺寸、夜漏光、軟像素、裁切、空圖、幾何克隆、安裝克隆、錯收費、redo失效、合法HTML來源越界、相機凍結等至少12真故障，首紅落目標並恢復；故障只改本波新鍵，不誤刪舊波。
3. **來源邊界**：獨立Git BASE=e195002。只剝新037純美術／CSS／runtime標記及唯一install點，原index逐byte相同；後續正式發布僅允許明列GAME_VER／GAME_ANCHOR／startVersion456三個唯一字串對齊，反向還原必須完整相同。草稿不改三版本字／主線日誌／T號。原共享fp／style／sheet／容量／既有自檢／模型來源與判準不動，合法越界HTML負控制必須真首紅。
4. **正常模型／完整舊新保存**：BASE與HEAD正常運行，不用本波閥；seeds31／71／103各3checkpoint，全部序列化欄位及stats比較，fieldExclusions=[]，只允許實際新外觀b.v差，不刪欄、不正規化。十款匹配交易、首次update及市長options惰性欄位保留；真舊檔／新外觀各兩輪load→save全欄穩定。若發布版本不同，只許明列精確gameVer遷移且反向證明；真保存少$1首紅並恢復。
5. **完整場景／誠實圖審**：保留原57＋40狀態：日夜、春夏秋冬雪有無、四向、十款近遠景、地圖邊角、施工早中晚、hover及真適用倒影／行人／煙／夜燈／招牌。97狀態加16 BASE／閥關守衛畫布，整包實有113 PNG；按真原生路徑證明不適用項。作者至少逐張看80單圖＋3完整contact＋10near，其餘103場景／守衛畫布未審就明說；實機手機／Safari／觸控不冒稱測過。
6. **完整畫布等值**：即時閥 `window.__noBritishWave037` 能退回舊圖；獨立BASE對HEAD閥關8張完整1280×657畫布逐byte相同，不裁圖、不設容差。真畫布1px及真保存$1故障首紅／恢復；正常模擬另跑，不以閥證明正常玩法。
7. **行人／效能不改門檻**：沿main的probePedestrians036.cjs／probePerformance036.cjs既有數值及first-RED判準，17原生日夜／四向深度遮擋例與兩真故障恢復；40組交錯BASE／HEAD median／p90，暖畫新烘焙0，30真延遲負樣本首紅並恢復。私有037副本只換新鍵、ID與精確BASE，不修改舊探針或放寬任何原數值；僅桌面Ubuntu Chrome，不推論實機手機。
8. **fp／七軸／原字節**：含最新main的push只新增本卡bld40，舊3703葉／165其他族／blocks1728／5ef6eb67／env零變。列bld七軸與total前後，下降按第二項起連續授權於卡／PR／方向如實披露，不改分或降低門檻。只採同次成功CI附件fp-rebake的fp.json／style.json原始bytes，核run／head／tree／bytes／SHA與官方artifact，不重新serialize、不手改metadata；採後root零差、無envLeaves警告。
9. **全新CI／來源實物／獨立覆核**：最新分支真smoke3／fp及原財務53項10負控制全綠。PR若T759重用，明列同head／tree完整push來源，不能說成又跑三次。原13個原生／場景／配對／行人／效能／圖像／公開工作完整保留，另8項有界唯讀工作傳輸實際index原bytes；producer實際對HEAD:index.html逐byte且核canonical Git blob，接收端恢復完整原檔重算SHA256／Git blob，獨立對遠端tree及native manifest的indexSHA。產物首批成功即交精確head／run／artifact IDs與原圖取回方式，不等收尾才交。獨立程式／安全／圖審須有精確head、範圍、findings、實際看圖數、雜湊和限制；CI／作者自審不替代。後續改動須列差異、實際原圖與完整index綁定供重新確認，不挪用第八波結論。
10. **workflow／發布全部分步實核**：新037 workflow只綁本分支、contents:read，不部署／推送／改其他PR或排程，035／036保持缺席。最後完整21項真綠先記卡，再另作只刪037 workflow提交，刪後每commit核缺席、最後標準push／PR仍綠。先完成實作／驗收／原圖交接／Draft PR，必要獨立覆核全部成立才續發布階段；同PR合前配最新三權威T號、版本／日誌／方向，核最新main／CI／Pages／方向與ancestry，全部門檻齊才Ready／合併。再核精確合併main CI、既有自動Pages及真公開HTTP／Chrome全文SHA／版本／第九輯10列40葉／slot3活畫布，全部成功才計9／20波90座。不手動Pages、不用本地或已提交冒充合併／部署。新平台拒絕保存完整回應並停該動作，不改路徑繞過。

## §8 開工狀態／沒做成的事

- [x] 本卡首筆遠端提交0dcafb7已確認，且相對BASE只新增本卡；確認之前沒有繪製。
- [ ] 第九波正常模型、保存、整幀、場景、行人、效能、首紅、fp、smoke及財務均未跑；第八波結果只作BASE，不算本波通過。
- [x] 十款原型已有原照／文字考據並實看16張參考檔，照片覆蓋限制詳施工紀錄；初稿實作已寫，遊戲原圖及獨立圖審仍未完成。
- [ ] 必要獨立程式／安全／視覺覆核待本波精確產物；另103場景及實機手機／Safari／觸控不提前勾選。
- [x] 本地已用GitHub原簽章payload及signature精確恢復e195002物件、SHA相符，從該main建立乾淨GPT-037分支；第八波歷史分支／原圖／發布回執都保留，沒有覆蓋他人未提交檔。
- [x] 正式仍8／20、80座；目前完成的是基準核對／排重與卡面，沒有把計畫記成實作。

回滾：未合前保留分支與證據；本波閥能即時退舊圖。main／Pages紅或原停手條件成立照規則回報，不重跑賭過、不強推、不自行revert其他寫入者。遇來源403／登入／平台拒絕，保留完整回應，不解挑戰、不改proxy／TLS／沙箱或權限。

## 施工紀錄（首卡後追加；原驗收不改鬆）

- 首卡[0dcafb7](https://github.com/lijiabao1998/GlimmerTown-lab/commit/0dcafb7cc8c3a23614dbc6d2cc9188837d46fbd3)／tree681061e5dd066736b93a5767e58ddb30bc97de0e已在新遠端gpt/british-wave09-037核實。其唯一父提交是main e195002，diff只新增本卡，bld40範圍不變，尚未新美術。
- 建新ref時誤用update_ref，GitHub校驗回422 Reference does not exist，未執行；完整回應保存scratchpad/wave037/first-new-ref-update-422.json，該更新未重試。改用連接器正式create_branch建立已授權的新分支成功，再以遠端ref／commit／compare核實。本項是缺少分支的API校驗錯誤，沒有強推、修改權限或繞過批准拒絕。
- C1無簽章GitHub JSON的單一UTC候選未核出相同raw commit SHA，計算即停，沒有導入錯誤物件或移動本地ref。本地HEAD仍精確main e195002，檔案／index tree681061e等於遠端C1；後續以遠端提交、實際tree與CI為準，不重複提交已上傳卡片。完整計算回執保留first-card-local-serialization-check.json。
- 本次只新增純唯讀參考照片collector與分支專屬037 workflow（五個parts、每part兩原型、最多每款兩張候選照片），沒有遊戲執行／新美術或修改index／三版本字／fp/style。照片必須實際取得、核bytes／SHA並由作者看清外觀後才畫，內景、標誌或錯主體不當幾何依據。Leeds原照使用HE原頁實際圖片連結，Middlesex使用法院原頁實際外觀圖；Holyrood照片另取[原建築師項目頁](https://www.mirallestagliabue.com/project/scottish-parliament-building/)，不是把議會室內設計展當外景。所有URL均來自已讀公開頁面，不猜Library或下載網址。
- 五個參考工作僅取得資料，不等於第九波原生／圖像驗收。結果尚待本提交後實際執行；若有HTTP錯誤，保留原回應，原目標不重跑賭過。新完整原生21項及標準CI待真正美術完成後再執行。

- C2參考專用head9ea887f／run39396972995 attempt1實際五工作：part0/1/2/3失敗、part4成功；官方原ZIP artifacts依part為12251554877、12252785097、12252301375、12251678494、12252276865。10張原bytes共4,323,187 bytes已按原log逐檔還原並核bytes／SHA，沒有重製。標準push39396972967的smoke3／fp／財務成功只驗證未改的第八波BASE，不能算第九波原生通過。
- C2首失敗保留：Manchester議會展示頁403（6007 bytes，SHA256 afc37f9889269e51db08afd07ca45c5b34e1a9e9524d9d88590f6cb08591419c）、Leeds HE照片403（6126 bytes，b1531c6c1b8c56e43185d54ebfcd823c7925200549f9a7c5b88c42397912c441）、Foster CityHall項目頁403（5502 bytes，855d87d198a09d4af604d8df8d7084b55e8c368b57e9c4ccfb3d5b5ec0cc7b43），以及Thaxted頁面相對路徑誤解造成兩個404，完整headers／body保留原artifact；上述目標停止重試，沒有解挑戰或改UA／proxy／TLS。Web對Geograph7966252、3812167及未確認的Thaxted/the-guildhall頁回Internal Error也保留原工具回應，不重試這些目標。
- 作者本次實看C2五張原檔：abingdon-0（四乘二拱廊、巨壁柱、老虎窗及頂亭）與middlesex-0（入口雕帶、石立面、女兒牆及老虎窗）可作外形依據；belfast-0是抽象背景，holyrood-0是室內議事廳，排除兩者作外觀依據；rcj-0確有清楚Strand正立面、中央玫瑰窗／入口及右側高頂，但海報遮住左上部分，不宣稱完整屋頂可見。未實看的徽章、內景與podcast icon依來源標題排除，不冒稱已看。沒有繪製未有外景的候選。
- C3只補七個未滿足外觀證據的原型，重用C2 Abingdon／Middlesex／RCJ既有bytes，不重跑它們。已實際點開原作者頁圖片連結：[Belfast Eric Jones](https://www.geograph.org.uk/photo/3896040)、[Manchester Gerald England](https://www.geograph.org.uk/photo/4184035)、[Leeds David Dixon](https://www.geograph.org.uk/photo/3485351)、[London Oxyman](https://www.geograph.org.uk/photo/569516)、[Thaxted Richard Croft](https://www.geograph.org.uk/photo/845293)，均為獨立攝影者公開原照，不是重取被403擋的原站資源；保留原官方文字考據，London採2007歷史照片、不採其已過時的總部現況敘述。Newcastle用原頁實際存在的Civic Centre 2外景連結；Holyrood只取原建築師頁已點開的五張其他實照。純照片collector增明列subject過濾及最多六張明列direct候選，沒有改任何遊戲測試或原判準。C3取得且作者實看前，仍不算十款照片已核齊。

- C3 [fd20754](https://github.com/lijiabao1998/GlimmerTown-lab/commit/fd20754b5f8eb86c6045669503bf2b40ac7d763b) 的純參考run [39398627988](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39398627988) attempt1五工作全success；part4是明列不重取已完成subject的空manifest，不能說又抓兩款。parts0/1/2/3實有11張新原照、共3,638,651 bytes，原logs完整還原後逐檔核bytes／SHA256。原ZIP artifacts按part為12254305967、12254671128、12254790755、12254970863、12253526403。C2既有三款與C3補七款合計十個原型各有外景證據；作者實看總共16張參考原檔，並非16張建築遊戲原圖。
- 參考範圍限制保留給獨立審稿者：Belfast照片只看清門廊／鼓座細節，四合院／中央穹頂／四角塔亭依市議會文字，未宣稱照片涵蓋全貌；Manchester照片是後側翼與次塔，主鐘塔／三角院落另依市議會建築說明，未把照片次塔當主鐘塔。Leeds完整正立面、Newcastle橢圓議事廳架柱及辦公翼、London完整歷史南岸卵形外觀、Thaxted完整現況均已實看。Holyrood五張補照只有DUCCIO-MALAGAMBA-29是庭院外景，其餘四張內景排除；本稿選取該外景可辨的委員會塔／弧形塔頂／斜折飾板／玻璃天窗，不聲稱已畫未由本外景核實的半圓議事廳。RCJ海報遮擋仍披露，鐘塔右置與雙面突出鐘、中央五扇窗依HE1264258文字核對。十款原型／40新鍵／唯一bld／原驗收門檻不變；這些限制待獨立圖審判定，作者不自行把來源不足算通過。
- 本容器曾嘗試純唯讀直取十一個已確認公開原照URL，全部在連線代理返回完整可見`URLError(OSError('Tunnel connection failed: 403 Forbidden'))`，零圖片bytes；每個URL及原錯誤保存在scratchpad/wave037/references-supplement-local-read/manifest-local-read.json與reference-local-network-stop.json。該本地下載行動已停止，未改代理／TLS／沙箱／權限、未重試；HTTP代理body／headers未由urllib曝露，不能聲稱已取得。上述C3早已提交且排隊於本地拒絕之前，本次只讀其既有CI工作產物，沒有為繞過此拒絕另外觸發取照。
- 已完成十款新私有世界幾何的**初稿實作**、40原生向的037 runtime／CSS及原生目錄、037私有驗收副本；不是只有卡片。Belfast院落穹頂、Manchester三角院落高塔、Leeds雙塔山花、Newcastle架柱橢圓廳與辦公板樓、London傾移玻璃樓板、Holyrood塔群及船形天窗、Thaxted雙懸挑四坡頂、Abingdon拱廊頂亭、Middlesex入口凸窗與雕帶、RCJ中央高廳玫瑰窗與右側鐘各有獨立新幾何，未複製舊款模型函式或只換色。
- 來源／語法核對實際通過：95 inline blocks parse，037 source/CSS/runtime embedding逐byte對齊；只剝本波三段及唯一install尾端即等於獨立main e195002完整index。index 11,294,100 bytes／SHA256 7c4297e4f1cdc4b979e86c50b886b5fa5e62d39207ba22e4ea9baddf513950fc。三版本字仍v14.55／T762；未改root fp/style、主線日誌或方向。smoke.js只加本波selftest一列，既有斷言完整保留；共享守衛、035／036原檔及各原判準不變。未在本地跑遊戲、瀏覽器、fp或效能。
- 下一筆實作提交將實際跑完整21工作（原13＋8個實際index原bytes來源傳輸），不再重取照片。來源helper從首個完整原生run就包括，供獨立審稿者核完整原檔／Git blob／遠端tree／native indexSHA，避免收尾才加而缺覆核。舊／新對照起始v明列480→444（Chelsea）、484→388（Glasgow）、488→220（Birmingham）、492→396（RogerStevens）、496→268（Willis）、500→368（Falmer）、504→104（Moreton）、508→344（LynnCustoms）、512→448（StCross）、516→388（Glasgow），均取真舊圖0／2向。原像素、原生86checks／首紅、正常完整模型、保存、整幀、場景、行人、效能與fp七軸此刻仍待本波CI，尚未通過、尚無建築遊戲原圖可交獨立審稿。

- C4實作 [84044d3](https://github.com/lijiabao1998/GlimmerTown-lab/commit/84044d32e89b6260e0590bd147838389008c8ee1) 的19個blob、tree3b141f8及commit物件先逐一成功，起初尚未移動ref；核清無同目標待決更新後，正常fast-forward已確認，沒有重建物件或強推。[原生run39404065252](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39404065252) attempt1完整21工作全success。未知manager卡ID未在工具回應出現，沒有把它當作新批准或自動套用。
- C4實際通過：原生86 checks、12個真first-RED／還原、十款實扣$2000／undo／redo／ref拆除及新外觀兩輪保存；seeds31／71／103各3checkpoint與十款交易的正常完整序列化／stats、原生首次update與市長options惰性欄位均比較，fieldExclusions=[]；舊檔兩輪完整相同；8張完整BASE／閥關1280×657逐byte相同、真$1與真1px故障首紅還原；57場景＋40邊緣＋16守衛畫布共113 PNG；17原生日夜／四向行人例＋2故障還原。40組交錯效能BASE median15.4／p90 25.9 ms，HEAD2.725／27.55 ms；還原40組12.025／28.8 vs3.6／28.7，暖畫新烘焙0，30真延遲樣本首紅並恢復，原門檻未改。只是Ubuntu桌面Chrome，不冒稱實機手機／Safari／觸控。
- C4來源實物已從8個成功source工作完整還原11,294,100 bytes，SHA256 7c4297e4f1cdc4b979e86c50b886b5fa5e62d39207ba22e4ea9baddf513950fc、canonical Git blob d7f8bb34024e6388d63f744de0e0033bacb9ab2c，逐一綁遠端tree及native manifest indexSHA。另已還原80原生日夜PNG＋3完整contact＋10個原生near，93檔逐一bytes／SHA核符native及scene原manifest，非假設舊環境留檔。正式原ZIP native12255588247、scenes12256543649、fp12255233293；其餘官方artifact與首回應保留scratchpad/wave037/evidence-84044d3。未說已人工看完93檔。
- C4標準push [39404065163](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39404065163)：smoke實際3次成功；fp只新增本波40葉，165其他族／舊3703葉／blocks1728與CRC5ef6eb67／env零變，因root仍是舊基線而紅。原財務有52／53項成功、10負控制完成，唯一失敗是「current renderer fingerprints match the committed baselines」，完整首紅與artifact12256409220（ZIP SHA bf33b77e5634ee52c42ac329f448834cb165d819a119a0a83b55a32bae8951f8）保留。不能寫財務全綠，待新基線採入後原53項仍須真跑。
- C4七軸實測（歷史初稿，非最終數）：palette1→1、hardEdge0.9505050520005902→0.9517731893402437、lightDir0.8192681105302465→0.8187092095721538（此軸下降如實披露）、shade1→1、density1→1、nightRule0.9885339952207213→0.9888708275173209、variants1→1，total0.9655→0.9656。C4成功CI的fp原bytes408024／SHA8a1de255fa65d75f6d99f2deec558d93e4e1e1c17365f386f68bf23d3a4431d7、style73171／SHAf27254540c1e760bb1302d5a21d11ad80d36b93bacdba27c32eb6c7243c26e28已核，但**尚未採入**：作者近景發現需修圖，不能拿舊初稿基線假配新幾何。
- 作者實看C4必需組中的6個原檔（24_1_504／508／488／500四張day及near-Thaxted／Abingdon兩張），另早期day contact實看但不冒充最終3張contact。發現開放底層可讀性不足、Holyrood塔頂過平，London窗格過密；此head標「需修改」，沒有人工或獨立圖審通過。C5只修本波私有幾何：Thaxted真樓板底面／中央木柱、Abingdon較高真拱洞／內側面與實體頂底材質；沒有黑矩形假洞。Holyrood改連續立體船殼屋頂及真凸窗；London保留十傾移樓板，減少周向窗格並明確樓層邊。私有archWall內側陰面只作用於本波，原共享raster／色盤／全局光影不動；無任何測試斷言或數值更改。
- C5新來源／語法核對已過，95 inline blocks parse，剝本波仍完整等於main e195002；當前index11,295,343 bytes／SHA d5c088f3990769da052c7f3ef5d1c56af95a2a406b9deadf75dff26c6c731165。此刻新圖尚未由CI烘出，未把本地修稿記成新驗收通過。C4全部原圖／完整index／首紅保留；新基線、93檔作者觀看、獨立程式／安全／視覺報告、Draft／Ready／合併／部署均仍待完成。正式計數仍8／20波80座。

- C5 [a62ccf4](https://github.com/lijiabao1998/GlimmerTown-lab/commit/a62ccf4b0723e7b1a91c10d1e707d2b8c40c4d27)／tree9c408d0的[完整run39406012975](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39406012975) attempt1又實際21項全success；原生86 checks／12故障、配對、保存、整幀／場景、行人、40組效能＋30負樣本與8份完整來源傳輸都保留。標準39406013460實際smoke3成功，fp與財務仍只卡尚未採入新基線：財務52／53、10負控制，完整回應保留；沒有修改財務或fp守衛來消掉紅燈。
- C5已完整取回原生80PNG＋3contact及實際CI index11,295,343 bytes／d5c088f3990769da052c7f3ef5d1c56af95a2a406b9deadf75dff26c6c731165，綁native manifest與遠端Git blob3bf2cf20c386cfb606725992443fe53a3565d768。作者實看C5四張day原檔（496／500／504／508），另按真SHA比C4有22張原PNG改變：Holyrood船殼／凸窗、London較清楚樓板、Abingdon拱廊可見改善；Thaxted四向日夜全未改變，所以該處不能說已修好。沒有宣稱C5已看完93檔或獨立通過。
- C6只再改Thaxted真底層地坪的頂面原生材質StoneHi→StoneD：等角視線穿過真空柱架後看見的是實體地面，先前新增樓板陰面在該視線不可見。不是黑矩形假洞、不新增透明度或畫面後製，不改世界幾何投影、全局陰影、玩法或驗收。其餘本波結構、全部舊圖與守衛不動。修圖是有原圖依據的進展；fp紅是明列等待新幾何定稿後的一次原始CI基線採入，不是在同一fp故障上重跑賭過或兩次改斷言。
- C5官方原生artifact12257750745、scenes12256981882、fp12257570889（ZIP digest6e38420e41fc7e68e6afc581ce1b2389b56f23488487f6d95577bf616fb0a8d7）保留；該次raw fp408024 bytes／c7b55463e1bf469e6ddbfd855e2b3635b4a7bcecece6111f94808ae44eae50ce、style73171 bytes／9ba793535ed01e1d99e5604f84b458924f055e55a3b13da3a4dc85a9418dfc30已核但仍未採入，因C6還有一處可見像素需重烘。C5七軸palette1、hardEdge0.9517733748712199、lightDir0.8187092095721538、shade1、density1、nightRule0.9888710360778061、variants1、total0.9656；正式前後表待最終成功CI。C6新烘焙、完整93檔作者觀看與獨立程式／安全／視覺仍待，正式仍8／20。
