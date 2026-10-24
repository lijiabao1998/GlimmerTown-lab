# T766／v14.59 第十二波：十款原創英式鄉村服務建築（GPT-040）

狀態：C3 候選標準與完整原生 CI 全綠，發布版本尚待完整 CI／純刪臨時 workflow／合併／main 與自動 Pages／HTTPS 精確複驗。正式仍 11 波 110 座；只有 PR #49 合併且公開驗證後才計 12 波 120 座。不得把候選計作正式。

## 範圍與原始契約

首卡 8edd88e53610a4c9ab51b6feb8550ce36d5f656b 的條件、SHA 與前綴保留。唯一美術家族 bld，新添600..639共40葉；舊3823葉、其他165家族、blocks、env 不變。十款均原創，不冒稱真實古蹟。使用既有 k24／2×2／Lv1／$2000，不改任何財政、交通、供電、存檔或模擬。

- asterpost：紫菀村郵亭／Asterwick Post House；五邊退縮郵亭、折簷截角主頂、偏置低山牆與高雙煙囪；斜角成組窄窗，四方向槽 600..603。
- barleybake：麥谷烘焙坊／Barleycombe Bakehouse；兩座低蜂巢烤爐量體、短半歇山烘焙屋與長遮雨簷；圓拱店窗，四方向槽 604..607。
- honeygrocer：蜜溪街角雜貨屋／Honeybrook Corner Stores；四分圓街角店面、放射扇頂、階梯後翼與平挑店簷；弧面分格櫥窗，四方向槽 608..611。
- foxengine：狐澤消防亭／Foxmere Engine Lodge；雙高山牆車庫量體、開放方木架乾管塔與單坡側房；兩個寬半圓車庫窗，四方向槽 612..615。
- mallowsew：錦葵裁縫屋／Mallowridge Sewing Rooms；削角單量體複折四坡頂、楔形玻璃樓梯間與三小坡頂老虎窗；階梯菱格窗，四方向槽 616..619。
- dewbankwash：露岸洗衣房／Dewbank Wash House；四段低平行圓筒拱頂、窄磚脊與開放石院；四圓拱窗和洗槽展示，四方向槽 620..623。
- cloverseed：苜蓿種籽屋／Cloverfold Seed Exchange；U形開放木攤廊、後方三級山牆庫房與低棚頂；方格高窗與攤口，四方向槽 624..627。
- thistlenursery：薊谷育苗舍／Thistledene Nursery；八角高側窗育苗室、四坡分片尖頂與兩個不等半圓翼；扇形高窗，四方向槽 628..631。
- brooktools：溪坳工具借用屋／Brookhollow Tool Library；折轉狗腿三段木石量體、三層錯落單坡頂與外置矮工具罩；長短排窗，四方向槽 632..635。
- hazeldairy：榛十字乳品坊／Hazelcross Dairy Parlour；低T形乳品展示坊、平脊四坡瓦頂、兩低圓頂罐體及斜角冷室；通風圓窗，四方向槽 636..639。

## 已完成的故障修復與證據

原始首紅：40081848662，fp 宣告基線尚未採用造成指紋與 fiscal-load 來源完整性失敗。只將同次官方 fp 工作120836854998／artifact12555616917原始 fp.json、style.json逐byte採入，SHA與大小詳 GPT-040-raw-CI-baseline-adoption.json。未改財政程式、評分或容差。C3 ef426eab27b24c6a9d173e2791794e1e7aed1940：標準40092396986 smoke、fp、fiscal-load全綠；完整原生40092397004全27工作成功，包括原生付費／undo／save-load、十款四向、160供電案例、275供電PNG、完整存檔與負控制、全畫布、行人、效能、場景、舊外觀守衛。

bld七軸：palette 1→1；hardEdge 0.9537353338914052→0.9544647253272348；lightDir 0.8176833447566827→0.8132088058705804；shade 1→1；density 1→1；nightRule 0.9894837454988741→0.989761505745322；variants 1→1；total 0.9658→0.9653。依AGENTS連續第二項起授權披露，沒有手動調分或修改全局光照。

## 圖片和真實人工檢視範圍

C3官方preview12559572055含84原PNG逐byte等同C2。80精靈原圖逐張以1:1檢視，三張接觸表、十款近景與選取的完整季節／施工／邊界／遠景已實看，逐檔SHA詳 GPT-040-author-visual-review.json及 GPT-040-C3-preview-equality.json。對比舊款有不同量體／屋頂，不只換色。沒有宣稱全部113場景、275供電圖逐張人工檢視；沒有實體手機、Safari或觸控驗證。

遠景z<0.5色塊是既有T107 LOD，來源區塊逐byte等main，不能把無辨識度遠景當詳細美術驗收。夜間豎藍光是既有T359/T615地標光柱，既有k24載體繼承；不是本波新增偽造fixture，不擅改全局效果。

原始PNG可下載：完整原生run https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40092397004 ，preview artifact12559572055、scenes12559910743、各供電階段分別留存；C2原始run40081848696保留。需登入有權存取此repo的GitHub帳號下載Actions附件。

## 發布契約 v2

首卡已明列發布三標籤與日誌／方向嚴格插入例外。本次新增 checkWave040ReleaseSources.cjs、wave040-release-labels.cjs、wave040-release-metadata.cjs；原候選 checkWave040FullSources.cjs 完整保留。新契約只允許兩份文件的完整精確插入、三處固定標籤，反轉必須等C3與獨立Git BASE，不採寬鬆搜尋、模糊hash或容差。原始候選守衛於新增AUTORUN段落真實首紅已留檔；發布守衛對舊正文單byte、缺少插入、重複插入、錯版本、額外HTML、重複標籤及缺錨逐一真紅。既有1301其他來源、首卡、舊守衛及新完整原生守衛pins不變。

供電新增 probeTenPowerRelease040.cjs 保留原 probeTenPower040.cjs；BASE只換相同三個明示發布標籤後必須反向byte等原始Git。完整存檔、stats、utility、160案例、275PNG、交通相位／缺窗負控制與預算一律不變。不剔除任何存檔欄位，不冒稱Node來源檢查等於Chromium。

## 第8節檢核

- 首卡先於模型、唯一bld、原始失敗與凍結來源保留。
- C3已通過真smoke／fp／fiscal及27原生工作；發布head另跑，不沿用舊綠燈冒充。
- 全局玩法、畫風、其他倉庫未改；沒有force-push或重寫main。
- 版本14.59／T766／r213、PR49；main正式版本仍T765，未提前報發布。
- 臨時workflow完成發布head原生驗收後純刪，再核最終CI；main不留下分支專屬workflow。
- 待最後CI與合法合併、自動Pages、公開產物精確一致後才續第13波。


## C4 真實發布驗收與第8節逐條清單（2026-10-24）

發布head 78efea58bde8afa598b2588fd61754af6123585c 的完整原生40093746548全27工作成功，標準push40093746526 smoke／fp／fiscal-load皆成功。原始index11474998 bytes／SHA256 cb3bc90bcd55c9b5e65d7389d954eaebb22d21c9eba6fff5bfea72292fdba884，91preview PNG逐byte等C3。原生artifact12560061744、供電core12560445418已實下載核對producer與index SHA；160案例、275PNG，完整保存來源無排除欄位，缺夜圖與錯交通相位負控真首紅且完整還原。來源與預算判準未放寬。

- [x] 首卡先推且原始條件保留；發布三標籤與精確插入為首卡明列例外，新v2保存歷史候選契約。
- [x] 同種子31／71／103對照equal，原生費用各2000；十款付費、undo／redo、refund與舊存檔所有欄位回歸成功。normal-pairs BASE／HEAD各兩次交易穩定無差異；未改模擬規則。
- [x] fp只有首卡明列bld新增40葉，與本次採用fp／style零差；舊3823葉／165其他家族／env／blocks不變。逃生閥與完整框架對照由完整原生正常配對及場景工作通過。
- [ ] 美術各狀態全部逐張人工檢視仍未宣稱：80精靈、三接觸表、十近景、八日夜原生四向與選取季節／邊界／疊層實看；其餘圖依AGENTS第3節明列待補人工覆核。真Chrome全矩陣已綠，未測實體手機／Safari／觸控。
- [x] 新守衛實際負控：原生12項（含缺葉、錯尺寸、透天空夜光、軟邊、裁切、重複幾何、錯安裝、空圖、加收1元、redo破壞、來源越界、旋轉凍結）；來源15加版本4項；供電缺夜圖及錯交通相位；效能重烘與注入延遲均落正確首紅。
- [x] C4真smoke3與fp、財務成功；不是相同失敗盲重跑。metadata披露與圖片交付新增head仍須再核完整原生與最後CI。
- [x] 沒跑過不稱通過；尚未合併、部署或完成120座。刪workflow後最終CI／main／Pages／HTTPS另待。

公開交付：docs/assets/GPT-040保存三接觸表、honeygrocer原生日／夜PNG與原始近景，manifest記producer、artifact、SHA。檔案原封複製，不重新出圖或變更美術；完整其他PNG在官方CI附件。

作者之外的獨立來源覆核已檢查精確三標籤反轉、兩文件插入及供電完整保存判準未放寬；該覆核不替代真Chrome或未人工看過的圖片。


## C5 最後完整原生綠燈（2026-10-24）

3d0b733c6f5b9e062b3747dd6a4f33e41f5770c8 的分支專屬完整原生run40094352758全27工作成功：https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40094352758 。同head的index／美術／遊戲／完整原生判準與C4逐byte相同，僅metadata嚴格完成表披露、原圖交付與紀錄；所有新契約source、真Chromium／供電／場景／效能重新實跑。這是刪workflow前最後完整原生綠燈，不以舊head替代。

四個已提交原圖公開HTTPS逐byte下載核對200：contact-day、contact-night、contact-comparison及near-honeygrocer，來源與SHA詳docs/assets/GPT-040/manifest.json。這不代表業主已看圖，也不重新要求已授權連續波次批准。

接續僅純刪自己的.github/workflows/wave040-native.yml；刪除後每一commit保持不存在，仍須最終push／PR標準CI全綠、最新main／版本號再核、合法合併、自動Pages及公開HTTPS核實。尚未宣稱發布。

C5同head push標準40094352743的smoke、fp、fiscal-load均已成功；PR40094356500仍以GitHub實際終態為準。最後純刪workflow commit尚需自己的push／PR標準CI，不能拿本段替代。
