# GPT-027 — 第二波：十座英式公共與交通建築（20 波之 2）

> 2026-10-17 開工卡：本卡是動手前範圍與固定驗收。十款尚未完成，沒有把卡面或候選當成已實作建築；第一波已完成1／20，本卡未合併前不增加完成數。

## 授權與實際基底

業主2026-10-16原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」照AGENTS第7節「業主授權連續做」處理第二項；第一波已獲批准並合併。業主另要求真實英式考據、不重複既有款式、量體高低胖瘦、窗型及屋頂有結構差異，不能只換色；窗框／窗台／分格、簷口、屋脊／山牆／谷線／老虎窗、入口凹槽／門廊／階梯應有可見幾何深度。

業主並行要求原話：「能不能并行先試試看，以實際結果爲準，而不是你默認不行」。獨立的預覽、原生行為、場景／存檔、行人及量測使用獨立CI工作目錄並行實跑；以實際job結果與時間存證，不以預覽代替合前驗收，也不把長測完成設成早期預覽的前置。

- 分支：`gpt/british-wave02-027`；雲端工作目錄：`/workspace/GlimmerTown-lab-wave02`。
- 獨立main基底：`58130eae1f5451a5f56142b5fab7b003b910155e`，T752／v14.45；最後產品提交`fdc2839`，之後PR34只清理方向表。
- 開工並行查核：main運行、沒有開放PR；[main39028978677](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39028978677)及[自動Pages39029263757](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39029263757) success，財務53項／10負控制。
- 已讀main規則、方向、AUTORUN、DECISIONS、CLAUDE與《迭代不改壞標準》。已完成修補不重開；依方向待辦第2項施工。所有遊戲／Chrome／像素測試只在GitHub Actions，本機只做源碼、語法、Git及資料檢查。

## 第一筆不可變的 fp 家族與範圍

**要動的 fp 家族：`bld`。**
**只新增40葉：`bld.24_1_200`至`bld.24_1_239`，十款各四個真正幾何視角。**

原3423葉、其餘165族、環境葉子與完整1728組超街區都須零變動；不能覆蓋舊圖。首筆家族清單不改。基底bld為1059葉、家族總分0.9655；基線從已提交fp／style讀取，不冒稱本機烘焙。

## 實作範圍

純外觀，沿用既有k24、2×2地標的價格、解鎖、就業／觀光、維護、水電、原生有費放置、拆除、undo／redo與既有b.v存檔載體。交通建築是歷史／公共建築展示，不新增鐵路、航空、巴士路線、車輛、人口、城市建築密度或產業鏈；不改模型、RNG、費率、容量或存檔schema。

新增獨立純幾何來源、自己範圍的安裝／目錄adapter、CSS、嵌入工具與探針；新效果逃生閥`window.__noBritishWave027`。共用renderer／材質／調色盤、既有probe判準、fp.js、harness.js、規則、舊自檢不改；smoke只新增自己的自檢。細節於精靈一次烘焙／快取完成，常態重繪不重建幾何。

## 開工候選盤點（下表保留開工時待核狀態，確認表見後）

已對下列名稱及另七個候選做index名稱查重，均零命中；名稱不同不等於結構不同。每一款開始寫幾何前，須實讀一手頁、記錄來源圖／形制與舊款比對；來源不成立的候選先替換，不能憑摘要杜撰。首款Croydon對應v200；其餘slot在完成考據後核定，總數及葉子範圍不變。

| 候選 | 公共／交通形制與待表達結構 | 已讀／待核一手狀態 |
|---|---|---|
| Croydon Airport terminal | 中央玻璃採光廳、兩側低貨運翼、四層方形控制塔、鋼框窗及屋頂天線 | 已實讀[Historic Croydon Airport Trust建築史](https://www.historiccroydonairport.org.uk/history/building-britains-first-airport-terminal/)，不是現有Settle木造小信號室 |
| Preston Bus Station | 多層外挑混凝土邊緣、帶狀玻璃與底層柱列 | 建築師[John Puttick Associates](https://www.johnputtickassociates.com/)可讀，專案詳頁待核；HE條目未讀成，不列已驗證 |
| Arnos Grove station | 低平站翼與圓鼓形高採光售票廳 | 官方建築／圖像資料待核；須與A la Ronde斜頂十六角屋區分 |
| Chipping Campden Market Hall | 長方形石拱廊、連續小山牆與石板坡頂 | National Trust詳頁未讀成，待核；須與Dunster木造八角市亭區分 |
| Guildford Guildhall | 窄高街立面、凸出大鐘與屋頂小亭、分格窗 | 舊council網址404，待取得正確一手頁；不能複製Lavenham長條行會館 |
| Birmingham Museum／Big Brum | 角部鐘塔、寬廣公共樓翼與拱形入口 | [官方博物館頁](https://www.birminghammuseums.org.uk/birmingham-museum-and-art-gallery)可讀，建築細節頁待核 |
| Coventry Cathedral新堂 | 現代折面窗牆、低廊與獨立尖塔的差異 | 官方建築詳頁待核；不重畫現有完整古典教堂或Rievaulx遺址 |
| National Space Centre | 高而圓胖的膜結構塔與低展廳 | [官方中心](https://www.spacecentre.co.uk/)可讀，塔體材料／輪廓詳頁待核 |
| Canterbury Goods Shed | 鐵路貨棚的長低廳、裝卸口與屋頂結構 | 經營／保育機構一手頁待核；須區分Coxwell穀倉、Flaxmill及Cardington |
| Blackpool Tower | 細高格構塔、下部公共建築與穿透空間 | 官方建築史待核；須與礦井木井架及原有塔類輪廓比對 |

## 動手前固定驗收（不改鬆）

1. 最終十款、40個實際安裝精靈、真四向世界幾何。每款有實讀的一手英式原型、地點／時期、平面／窗／屋頂／入口對應及與舊款比較；不是換色、翻圖或只改名稱。去共同地坪的結構遮罩不重複，原始接觸表與實際遊戲圖作獨立視覺覆核。
2. 窗框、窗台／分格、簷口／屋脊／山牆／谷線與入口依原型加入可見幾何深度；不得為湊細節杜撰原型不存在的屋頂或開口。所有四向像素硬邊、不裁切，夜光只在可見實體窗／燈；native w/h/ax/ay/sz正確，光向隨鏡頭旋轉。
3. 最終fp相對base只新增宣告40葉，舊3423葉、其他族、超街區與env零變；倉庫基線核對零變，style逐族等於本次計算。基線只提交包含最新main的那次push CI原始附件位元組。第二項起如家族分下降，依第7節列前後七軸及方向完成表，不隱瞞或改尺。
4. 十項真目錄點擊、有費合法放置、原生鎖定拒絕、有限錢費用等於原生預覽；原地標／T748／第一波選擇互不污染。至少三組同種子BASE／HEAD正常路徑配對，完整原生資料相同，只有明確預期的b.v外觀值不同；不靠逃生閥證明正常路徑。
5. 十款真save→load→save→load、undo／redo／退款、參照格拆除／恢復。舊存檔每一欄均比對、同版本來回不變；發布版本只依已提交宣告gameVer精確遷移，不能刪欄位或排除財務history／backlog／游標。常駐財務53／10仍須全綠。
6. 真Chrome原圖覆蓋日／夜、春夏秋冬、有雪／無雪、四向、近遠、地圖邊緣及施工／懸停／行人／夜燈等疊層；不適用的倒影、煙、霓虹逐項說明原生原因。BASE／閥關完整畫布逐位相同，無裁切／遮罩／容差。不能以精靈接觸表代替完整場景。
7. 每條新守衛有合法源碼／活體故意破壞，首紅落在目標，還原後綠；保留全部既有判準。源碼剝除自己有界區塊及安裝呼叫後，除三處精確發布版本標示外，與實際main BASE全文逐位相同。
8. 預覽與獨立測試並行；早期預覽若CI工作目錄暫時嵌入未整合來源，必須記committed／preview index SHA及prototypeOnly，不能當正式整合結果。最終發布必須是已提交完整40葉的head，所有必跑job實際success，不能用skip、預覽或舊head綠燈代替。
9. 新精靈只在一次性烘焙／快取產生；真實正常重繪不重烘。記錄至少30樣本交錯比較的中位數／p90及實際樣張；異常先確認與定位，不能為雜訊改標準或新增追蹤系統。
10. 合前最新head的smoke三次、fp、財務與全部新守衛全綠；主線／方向再核對。分支專屬workflow只綁自己的分支、contents:read，最後run綠並在卡上附連結後用獨立workflow-only提交刪除，其後每筆確認仍不存在。轉正式後等新到的Codex審查完成再合併；不重演尚在審查便合併的時序。合後核main／自動Pages及真網址，不手動觸發Pages。

## 收工自檢與沒做成的事

- [x] 先推本卡，家族與固定驗收先於幾何實作。
- [ ] 同種子／完整舊檔與新外觀來回。
- [ ] 只新增bld40；完整閥關畫布等值。
- [ ] 全部必要狀態／原圖及原型對照實看，或依規明列未跑／不適用。
- [ ] 每條新守衛首紅與還原。
- [ ] 最後head smoke三次、fp、財務與新守衛全綠。
- [x] 本卡沒有把未跑測試、待核考據、候選或計畫寫成已完成。

開工時未完成：十款未定稿、幾何／目錄／新守衛尚未實作，沒有第二波測試或預覽結果；第一波完成數維持1／20。已知工具限制：HE Preston頁not accessible、Guildford舊頁404、Croydon兩個舊子頁TimeoutError；可讀的Croydon建築史另已實讀。公開Pages真網址在既有雲端網路為代理403；不轉用業主電腦。

回滾與停手：只在自己分支追加修正，不重寫歷史。工具拒絕或真正卡住先報精確動作、目標、原因及完成部分，不繞過；同項無進展／連續卡住及main／Pages紅燈按AGENTS第7節處理。圖片與程式未合併前不稱已發布；本卡只處理第二波，後續波次另開分支卡。


## 首批早期原生預覽（2026-10-17 12:14 UTC；非最終驗收）

- 實際受測來源head `3303bf923ed52ed7d3be4181a8410a5f679cbbcf`，Croydon與Preston兩款、8個安裝視角。Croydon建築史及[Preston建築師專案頁](https://www.johnputtickassociates.com/project/preston-bus-station/)已實讀；其餘八款尚未完成考據／幾何。
- [預覽39031673038／job117393201120](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39031673038/job/117393201120) success，12:13:25開始、12:14:17結束，共52秒。標準smoke、fp、財務三個獨立job也實際於12:13:25開始，沒有把長測完成設為預覽前置。
- 真目錄點擊、有費原生放置兩次：Croydon (7,4)、Preston (10,4)，各扣$2000；日夜四向實際遊戲畫布8張，另有16張sprite日／夜層與兩張接觸表。slot3、桌面Chromium1280×657。
- 正式committed index SHA-256仍為 `b4c1b9e94b02d2bbe82eff0376f2df019754047bfe8a58346ff41ea84a7b5cb8`；CI預覽暫嵌入後為 `e8e859032cf0368e7dc948521843f2106e1215fcde350a7b31f25fa8f69e4f8c`，manifest明示 `prototypeOnly:true`、`finalAcceptance:false`，測後還原。不是已提交正式整合或十款完成。
- [日景四向原圖](../assets/GPT-027/early-3303bf9/contact-day.png)／[夜景四向原圖](../assets/GPT-027/early-3303bf9/contact-night.png)／[原生遊戲日景](../assets/GPT-027/early-3303bf9/native-day-r0.png)／[manifest](../assets/GPT-027/early-3303bf9/manifest-preview027.json)。檔案大小及SHA-256均核對CI日誌原始位元組，沒有裁切、調色或重畫。
- [完整原始附件12100781393](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39031673038/artifacts/12100781393)：4,672,030 bytes，ZIP digest `sha256:306181060fd29db5d8b588a5e5867020dbc0300d3e5d1c2c7b734dc5d792d96e`。可重用file ID `file_000000008fe88230a45b0dfc3ef4d46a`，不是Library ID。

目前圖審：已實看這次日景接觸表8個視角與原生世界日景，兩款量體差異可讀。Preston層間與曲面剖面仍偏淺，需再強化實際結構間隙及曲面受光；尚未宣稱十款、全狀態、完整守衛或最終品質通過。完成波數維持1／20，第二波尚未合併部署。


## 第二批正式整合來源（2026-10-17；待CI出圖與固定驗收）

幾何來源已寫成十款、v200–239並嵌入index；仍不是驗收完成或部署。Preston根據首批原圖加入真實後退車庫核心、加深柱間空隙，取消頂層無承托柱並按曲面法向分階受光。候選Canterbury貨棚的一手結構資料不足，在寫它的幾何前替換為Penshaw；Kew Palm House查出庫內k63已有同原型，排除；John Rylands詳頁未核成，不使用。Coventry不移植相鄰舊堂尖塔。

| slot／原型 | 英格蘭地點、時期與已實讀一手來源 | 平面、窗／開口、屋頂／入口及與舊款差別 |
|---|---|---|
| 200 Croydon | Croydon，1926–28；[機場信託建築史](https://www.historiccroydonairport.org.uk/history/building-britains-first-airport-terminal/) | 雙低貨運翼、四層方控制塔與天線、鋼框玻璃穹頂採光廳；大開間貨門與深窗框。不同於Settle小木信號室及Chiswick實心古典穹頂。 |
| 204 Preston | Preston，1969；[整修建築師JPA專案](https://www.johnputtickassociates.com/project/preston-bus-station/) | 長方五層開放車庫、曲面外挑混凝土唇、退後核心及柱間開口，底層帶窗大廳；不同於De La Warr單層轉角陽台。 |
| 208 Arnos Grove | London Enfield，1932；[HE1358981官方記錄](https://historicengland.org.uk/listing/the-list/list-entry/1358981) | 方形低座上高圓鼓；直立多格金屬窗與磚帶、深挑平混凝土圓盤屋頂，南向雙入口；不同於A la Ronde斜頂住宅。 |
| 212 Campden Market Hall | Gloucestershire，1627；[HE1078442官方記錄](https://historicengland.org.uk/listing/the-list/list-entry/1078442)及[National Trust](https://www.nationaltrust.org.uk/visit/gloucestershire-cotswolds/market-hall) | 2×5長側石拱、兩端2拱、中央柱列、2×3山牆與谷形石板屋頂；封堵雙光石窗不虛構夜窗，地面可穿透。不同於Dunster八角木市亭及Rievaulx尖拱殘牆。 |
| 216 Guildford Guildhall | Surrey，約1550／1683街面；[HE1180101官方記錄](https://historicengland.org.uk/listing/the-list/list-entry/1180101?section=official-list-entry) | 狹長廳與窄三開間凸出上層，分格窗、欄杆陽台、垂直街面的突出鐘架，長瓦坡頂與八角鉛頂亭；不同於Lavenham橫展半木廳。 |
| 220 Birmingham Museum／Big Brum | Birmingham，1881–85；[HE1210333官方記錄](https://historicengland.org.uk/listing/the-list/list-entry/1210333?section=official-list-entry) | 寬展廳加側置方鐘塔、深雙層門廊／山花／階梯、拱形窗和瓦頂；不同於Tattershall四角磚塔城堡，未把整座議會廳誤說成博物館入口。 |
| 224 Coventry新堂 | Coventry，1962；[教堂自身建築詳頁](https://www.coventrycathedral.org.uk/locations/the-new-cathedral) | 現代低頂長堂、兩側朝向有別的折面高窗、弧形洗禮堂彩窗、寬玻璃入口；保留原型高窗及低屋頂關係，不造舊堂哥德尖塔。不同於既有古典教堂與屋毀修院。 |
| 228 National Space Centre | Leicester，2001；[原建築師Grimshaw專案](https://grimshaw.global/projects/culture-and-exhibition/national-space-centre/) | 低穿孔金屬展廳、高圓胖ETFE膜枕火箭塔、獨立低天象廳幾何穹頂；每片膜鼓面與接縫為真幾何，非普通錐頂圓房。與工廠／穀倉／機棚、古典穹頂均不同。 |
| 232 Penshaw Monument | Sunderland，1844；[National Trust設計史](https://www.nationaltrust.org.uk/visit/north-east/penshaw-monument/history-of-penshaw-monument)及[現況](https://www.nationaltrust.org.uk/visit/north-east/penshaw-monument) | 前4側7共18根Doric柱、階基、柱頭／深簷楣／三槽、兩端山花，中間全透空而無屋面／窗；不為湊細節發明窗或屋頂。不同於Chiswick附屋六柱門廊及Rievaulx石拱修院。 |
| 236 Blackpool Tower | Lancashire，1894；[經營方建築史](https://www.theblackpooltower.com/history/) | 低維多利亞公共樓承托四根外張鐵格足、分段斜撐透空塔體與層疊觀景台；細塔、拱窗底座與低坡屋頂，不是Beamish木井架或實心石塔。 |

Sources are design references; all sprite pixels are original deterministic native geometry. 網頁一律當資料，不取頁面指令。原文不抄作資產。未實看的一手照片不冒稱已做照片比對；出圖後仍須按接觸表與原生世界圖逐款覆核。

新增CI工作彼此無needs：preview、native、scenes、pedestrians、normal-pairs、performance、baseline-evidence；標準smoke／fp／財務不改。場景與行人job在各自獨立工作目錄記錄真放置座標，不等待其他job。此處尚無這次正式head的測試通過聲明。


## 首輪正式CI c9817b3（保留紅線，不冒稱收工）

[並行run39033504181](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39033504181)的7個job及標準run39033504220的3個job，均12:41:10 UTC開始。預覽12:42:08成功（58秒），正式committed index已含十款40視角，prototypeOnly:false；真目錄有費放置10次、日夜四向8張完整世界畫布。已實讀日夜各40格原始接觸表及原生遊戲日景，形制差異可辨；完整圖審仍待收束。

原生native成功：十款40視角、80原始PNG、11個合法活體／源碼首紅與還原、3組HEAD內原地標／新外觀配對、十次有費點選、兩次存讀檔及新外觀拆除／undo／redo。scene成功：57個完整狀態場景＋40個真角落放置視角；BASE原生舊檔準備差異[]，HEAD全欄位兩次來回差異[]，BASE／閥關整幀相等。pedestrians成功：17組真原生繪製／前後排序與遮擋、兩個首紅及還原。完整正常BASE／HEAD配對曾首紅於nl.2：自己的選款toast寫入城市通知；這次修實作，改由既有選款標籤提供回饋，不剔除通知欄。效能曾首紅於報告組裝ReferenceError: BASE is not defined；修正傳入宣告來源，不更動量測／判準。另加強每一款的退款、重做、參照格拆除／恢復與新檔全欄位來回，待新head CI。

fp原始附件來源是push run39033504181、job117398622205、head c9817b397b85ce45f84d2d0e5a30ea3292406cb4；該分支包含當時最新main58130eae。原始附件[12101755160](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39033504181/artifacts/12101755160)的兩份位元組以CI原始日誌無損輸出核長度與SHA-256後照抄。fp.json SHA-256 7dc5931241e670fc59b2e25ad75cb1490a7373276db06353e7c12ecfc552da6f；style.json SHA-256 515821012f85d866faef630946320da776eee069cb4af69188e18f2d5d2a965d。沒有改欄位／數值／日期或env。獨立JSON物件對比證實只新增bld.24_1_200–239共40葉、舊3423葉逐物件相同、其餘165族與完整blocks相同。標準fp工作亦得同一摘要；初紅包含未提交新基線，待照抄後最新head全綠。

第二項起按AGENTS第7節如實列bld風格下降；不改量尺：

| 七軸 | base | 本輪CI |
|---|---:|---:|
| palette | 1.000000000000 | 1.000000000000 |
| hardEdge | 0.941807574369 | 0.943236167835 |
| lightDir | 0.830972615675 | 0.828025477707 |
| shade | 1.000000000000 | 1.000000000000 |
| density | 1.000000000000 | 1.000000000000 |
| nightRule | 0.985529009386 | 0.986054449214 |
| variants | 1.000000000000 | 1.000000000000 |
| total | 0.9655 | 0.9653 |

此表依第二波授權公開，沒有把下降說成沒下降；完成表在真正合併時才更新為2／20。首筆家族仍只有bld。


## 負控制補足（尚待新head CI）

完整正常BASE／HEAD檢查的負例改為三組真正原生金錢API→save的一美元破壞，再以原生API還原→save核對所有欄位；不只改報告副本。效能負例另以合法活體forceDraw延遲30樣本，要求同一原判準首紅，還原後再做40組交錯A/B量測綠燈。原生來源邊界亦用合法HTML在自有區塊外插入註解驗首紅與還原。既有條件／門檻不改。完整舊檔第一個實際load亦明列：同版本差異必須[]；將來發布版本只能精確改已提交GAME_VER，其他欄位一律相同。所有工作仍須最新head的實跑結果，不以本段文字當通過。


## 2ac9a80驗收結果與尚存紅線

[分支run39034290852](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39034290852)：fp基線工作、預覽、場景、行人、效能、完整正常BASE／HEAD配對均success；[標準39034290791](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39034290791)的smoke三次與fp已success，完整財務仍待結論，不能冒稱全綠。

BASE／HEAD種子31／71／103，每組3個時間檢查點，原始完整存檔與統計只差實際指定root的b.v；fieldExclusions:[]。三次原生金錢API破壞一美元均首紅money並真實還原全欄位綠。場景舊檔BASE準備差異[]、原生首載宣告遷移差異[]、兩次全欄位差異[]；57個完整狀態與40邊界視角成功。效能正常40樣本交錯：BASE median11.275ms／p90 25.45ms，HEAD median2.625ms／p90 26.9ms；故意20ms延遲30樣本首紅，還原後另40組交錯BASE9ms／25.275ms、HEAD2.525ms／26.9ms。暖繪新幾何重烘0次。這是桌面CI參考，不能說成手機加速。

原生native新增的「十款新檔每一欄位save→load→save」第一輪首紅：`wave027 new appearances complete-field save roundtrip 0`。十款外觀值檢查先已過，但其他欄位仍有差；此筆只補精確差異輸出，判準／比較欄位完全不改。尚未定位前不合、不部署、不增加2／20完成數。


## 新檔輸入情境定位與修正（待CI證實）

699bd0e的精確首紅差異只有原生啟動欄位：pol由null補為預設政策，gov513與inn507由缺省建立。輸入是在newWorld後立即暫停、尚未跑第一個正常native更新的建構情境；沒有先對正常遊戲初始化。此次保留全欄位零差異判準：十款有費放置、逐款撤銷／重做／退款／參照格拆除恢復後，先真正GV.step(1)，才寫第一份參考存檔，接著原生load→save兩次逐欄位比，沒有寫入預設欄位或排除任何欄位。正常BASE／HEAD probe也新增原始pre-update constructor的真正load→save，完整輸入輸出都留檔、逐欄比較BASE與HEAD，只允許原來列明的root b.v差別，再核原生初始化變更欄位完全相同。這是在CI核對輸入情境，沒有更動遊戲初始化／存檔格式／模型。尚待最新head實跑；699bd0e仍紅，不冒稱收工。


## 73023fe：保留反例，改成完全相同的BASE交易情境

第一個正常native更新後，gov513與inn507已穩定，但native新檔仍首紅pol:null→原生預設政策，差異由3個頂層欄位降為1。三款一般放置的獨立constructor對照earlyFields在BASE／HEAD都是[]，沒有重現十款反覆撤銷／重做的情境；不能拿它確認先前的初始化猜測。此處如實更正。

最新測試把同樣十款有費放置→逐款undo／redo／參照格拆除undo、最後一款再次交易，完整重播在原始main BASE與HEAD。保留preUpdate、原生日結算後、原生市長方案頁唯讀檢視後、兩次load→save的完整原始資料。用原生bAI→方案→關閉資訊操作建立lazy policy，不送審或套用政策；另斷言AI啟用、money、day完全不變。各階段BASE／HEAD仍逐欄比較，只允許對應root的b.v；初始化後兩次存檔來回必須每一欄完全相等。遊戲檔與既有守衛沒改，原生舊檔全欄位工作仍保留；所有空欄位情境與差異留在附件，不能說成原始空欄位檔本來就逐字不變。仍待最新CI，不放寬任何全欄位比較或排除欄位。


## [卡住] 完整新檔pol首載不等值；停止同一門的試修

9aa8a42再次首紅native新檔pol:null→原生預設政策；正常配對工作的「相同十款交易」亦在完整存檔自比首紅pol。其BASE／HEAD各階段全文配對先已通過（只差宣告root b.v），再進入兩者各自的完整往返比較；因此這條首載差異也出現在未改動main BASE，不是可用刪欄位解掉的美術驗收。保留原始BASE／HEAD十款交易輸入／兩次輸出與逐來源首紅的JSON，最新提交只把附件寫入移至斷言之前並列出來源／輪次；判準不放寬，仍以失敗結束。

第一個native更新曾把不符頂層欄位從3降到1；再讀原生市長方案頁後pol仍紅，該門的兩次情境修正沒有取得完整等值。照《不改壞標準》第7節停止這條試修、開[卡住]草稿PR，等待原生存檔一致性的獨立處理；不將初始pol正規化成預期、不排除它，也不在bld純美術卡混改共用模型／load／save。原卡第一筆家族與全部固定驗收保留。

目前實際交付是本分支十款40視角的程式、美術來源、考據、原始圖與紅綠證據；尚未整波驗收，不是main已新增十座。標準財務當前run需另看最後結論，取消或尚在跑的不寫53／10通過。分支專屬workflow最後整組run為紅，依AGENTS第3節不能為了消除diff先刪；它只綁本分支、contents:read、無部署或推送。PR保持draft，不配T／版本／日誌、不合併部署。開關與方向原話保持main原樣，完成波數維持1／20。

收工自檢：卡面先推、家族僅bld、基線是CI原檔、舊3423葉及165族／blocks不變、沒有把候選／未跑寫成已完成；全狀態CI與已讀樣張附前文。整波完整新檔往返未過，native在此紅線後的相機源碼負例未執行，不打假勾。剩餘修復必須先把原生pol首載一致性另卡處理，之後本分支同步最新main、按原判準全部重跑。


## T753落地後同步與原判準重驗（2026-10-17，結果待CI）

PR35已於15:12:10 UTC合併為`57069b0db4c6182c95f23d0f9fa90ac78b65eb3c`（v14.46／T753，原生明確空政策讀檔修補），[main煙霧39044006838](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39044006838)的smoke、fp及財務工作全部success；[自動Pages39044396403](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39044396403)的build及deploy於15:18:46 UTC成功，部署版本明示同一57069b0。沒有手動觸發Pages。修補不算美術波次；本方向仍1／20。公開網址讀取在雲端回`URLError: <urlopen error Tunnel connection failed: 403 Forbidden>`，網頁工具亦回not accessible，故不宣稱已看見線上畫布。

在獨立工作樹合入實際main57069b0；保留原9aa8a42工作樹三個未推送檔案及其完整SHA-256備份。原生配對、場景、效能及預覽來源的BASE精確改成該實際main，全部原固定比較、負控制與欄位仍保留；normal-pairs只在斷言之前保存完整交易輸出及逐來源首紅。自己的有界美術／CSS／runtime與安裝呼叫剝除後，產品全文必須精確等於新main；不在此卡修改共用政策模型。十款幾何、選款與原生交易實作均不變。

為取得包含這次main的push CI原始基線，fp.json／style.json先取main原檔，預期只在宣告bld40葉報差；將核對當次CI家族、舊3423葉、其他165族、blocks與env及七軸，符合第7節後才照抄原始輸出。自己的7個job與標準3個job均重跑原完整驗收；此段尚不是通過聲明。PR36保持draft，第二波不配T／版本／日誌、不合併或部署。


## 同步head dfb3990的實跑與新基線（2026-10-17）

[push原完整驗收39045000304](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39045000304)的六個非基線job均實際success；BASE為修補已發布的57069b0，產品有界區塊外全文逐位相同。先前失敗的native新檔與normal-pairs已按原判準轉綠：十款完整存檔兩次往返、BASE及HEAD各兩次交易存檔自比全為差異[]，fieldExclusions:[]，沒有靠逃生閥或剔除pol。三組種子31／71／103各三個時間點正常原生配對只差宣告root b.v，三個真正金錢API一美元負例各首紅money並完整還原。

- native job117431855876：十款40視角、80原始日夜PNG、十次有限錢目錄放置、每款undo／redo／退款／參照格拆除恢復、兩次完整新檔往返及12個合法活體／源碼負控制全部成功。此前pol首紅及其原始附件保留為歷史；未再於純美術來源修存檔模型。
- scenes job117431855946：57個完整狀態場景、40個邊界放置視角、8／8日夜四向BASE／閥關完整畫布逐位相同；舊檔首載及後續兩次所有欄位差異[]，兩個真存檔／畫布首紅及還原，strict failures:0、unrun:[]。
- pedestrians job117431855774：17組真行人前後排序、實體遮擋／繪製及兩個活體首紅、還原成功。
- performance job117431855662：40組交錯原生樣本，BASE median13ms／p90 25.775ms、HEAD median2.925ms／p90 27.4ms；30樣本真延遲負例首紅、還原後另40組通過，暖繪新幾何重烘0次。僅桌面Chromium CI參考，實體手機／Safari／觸控仍未測。
- preview job117431855806：正式committed來源10款40視角、真付費放置10次、8張世界畫布，prototypeOnly:false；這項預覽本身仍不代替其他驗收。已實看本次原始日／夜四向接觸表、舊款對照、原生世界日景、完整夏景／冬雪景及Guildford近景，未裁切或重畫證據。其他狀態的自動原圖已在完整場景附件，未冒稱逐張人工覆核全部97張。

這次初始fp與baseline-evidence紅在預期的bld新40葉及尚未提交style值。新基線逐位元原樣取自[同一push run39045000304／job117431855930](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39045000304/job/117431855930)、[原始附件12104868820](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39045000304/artifacts/12104868820)，來源head dfb3990已包含最新main57069b0。CI日誌的base64原檔先核bytes與SHA-256，再原樣拷入；沒有手改欄位、日期、分數或env。

| 原始CI檔案 | bytes | SHA-256 |
|---|---:|---|
| fp.json | 378623 | 77551693eb954495c7fda294f9dac1c9375af7c99dccd94119c521e58cee3f73 |
| style.json | 73165 | edcae6ba9ca87e6d05551244f38eb89cbd210754eca5bea72963f10ba5fc8bb3 |

獨立JSON物件對比核實：只新增bld.24_1_200–239共40葉，舊3423葉逐物件相同，其他165族相同，blocks全文相同（1728／CRC5ef6eb67），env未變。bld七軸及總分精確等於前文表：palette1→1、hardEdge0.941807574369→0.943236167835、lightDir0.830972615675→0.828025477707、shade1→1、density1→1、nightRule0.985529009386→0.986054449214、variants1→1、total0.9655→0.9653。第二波按連續授權披露下降，沒有更改量尺或判準。

本提交只帶入上述CI原始基線與真實文件紀錄。全部可執行產品／美術／探針／workflow位元組與dfb3990相同；提交後仍必須等待新head的標準smoke三次、fp、財務53／10及七個專屬job實際全綠，不能把本段當成未來CI結果。最後head結果與精確run連結貼在PR36內文。專屬workflow仍只綁本分支、contents:read；本階段不刪、不配T／版本、不轉正式、不合併部署，完成波數維持1／20。


本輪PR常態run39045004126的財務job117431867307已實跑：52項正向及10個負控制成功，唯一失敗是source-integrity工作內的current-fp核對（倉庫暫取main基線，尚無新增40葉），不是pol或財務行為欄位不等值。完整報告為checks:52、negative:10、failures只有current renderer fingerprints match the committed baselines；因此這次不寫財務53／10全綠。下一個原始基線提交後必須實跑該完整工作轉為53／10，不能重跑賭綠或略過此門。
