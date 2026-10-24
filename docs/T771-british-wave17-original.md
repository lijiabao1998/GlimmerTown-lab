# T771：第十七波原創英式公共館舍與專門工房

原 GPT-045，PR #59；本檔是發布準備，不是已發布證明。

# GPT-045：第17波十款原創英式公共館舍與專門工房

## 動手前範圍（首commit凍結，不改鬆）

- 分支 `gpt/british-wave17-045`，最新main `3d2220d26ec0e132491280932edb13fdbae5852a`。這是第16波方向回執；正式產品T770／14.63／r217，16／20波160座。產品main64c78c9a的CI40125688839、自動Pages40126187059及公開Chrome40123355347 attempt2/job120968827141已成功。真HTTP／browser完整11705418bytes，SHA256 6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723；25負控、sandbox啟用、零runtime/network error，公開menu／city／第16波目錄原圖已實看。
- 第一個commit宣告要動的fp家族：**bld**。只新增原生24_1_800..839共40葉。既有4023葉（bld1659）、其他165家族、block1728／5ef6eb67與env不得變。原生k24／Lv1／2×2／$2000維持，不改容量、價格、存檔、RNG、模擬、密度與全局觀感。
- 本波全部原創英式外觀，不冒稱真實古蹟復刻或新增遊戲服務。前16波及更早歷史家族完整保留；十款需有真正不同的量體、屋頂、門窗和用途，不以名稱或換色湊數。材質沿用現行磚、石、板岩／鉛頂及木格窗，避免抽象漂浮雕塑；每個開口、接縫、承托及四向輪廓須真幾何和真Chrome證據。
- 已fetch確認乾淨獨立自有雲端工作樹、目前0個open PR、方向運行、main及Pages成功；不使用業主電腦或saved Codex環境。不覆蓋其他分支、工作樹或未提交資料。先單獨推本卡才開始模型與新守衛施工。
- 全部原始歷史來源、守衛與證據保持。新045契約綁定上述獨立Git BASE。候選與發布的三個精確版本label及兩文件精確插入建立另外版本化契約，保留原候選契約與真負控，不排除比較欄位或放寬舊判準。
- 歷史描述勘誤：044 scope的firstCard與old140文字曾沿用043，但實際044獨立來源守衛正確釘住73e6e412首卡及1488舊檔。凍結044原檔保持不變；本045 scope須使用本首卡真commit/path，source守衛對這些metadata也建立負控，不能繼承錯標。

## 十款凍結身份、世界幾何與差異

| id | 名稱（原創） | v（四向） | 必須實作的結構 | 最近既有結構的不同點 |
|---|---|---:|---|---|
| knapmediation | 矢車菊公共調解館／Knapwell Civic Mediation Rooms | 800..803 | 兩個不等高的低三角磚調解室分置近方形地塊兩側，中間保留真斜向露天靜院，只在一端以更低的實入口廊相連；各有三片可讀板岩坡面及不同高頂點，外側成對上下拉窗、院側高窄窗與木門，表達分開的安靜會談空間。 | Teaselhat是單一窄高三層實三角楔，Sorrelglove是封閉領結腰，Harecase是直角矩形工房加曲玻璃廊；本款是低雙三角、完整斜向真空院及一端低實連接，無中央實腰、玻璃彎橋、塔或整圈內院。 |
| adderlens | 蛇舌蕨光學工房／Adderwick Optical Works | 804..807 | 單一細長雙凸透鏡形磚工房，兩端真收尖而兩側向外鼓出，沒有凹口或附塔；直線長屋脊配向兩側及尖端落下的分面板岩坡頂，長側寬橫分格工作窗、尖端兩側窄豎窗、側面小凹木門；用途為鏡片研磨與光學器具工藝展示。 | LeedsCorn是橢圓鈍端大廳加圓拱穹頂，Rookspiano是深凹腎形加高音室，Teaselhat是三面窄高楔；本款低長雙凸、兩個清楚尖端及直脊分坡屋頂，不能退化成橢圓鼓樓、單三角盒或改色腎形。 |
| yarrowbraille | 蓍草點字工房／Yarrowfen Braille House | 808..811 | 低前室與較高後工作室沿全長相貼成一個長矩形封閉館，兩個相向但不同標高的板岩坡面在中線留下連續直立採光窗帶；前排低寬木格窗、後室高窄成對窗、側面一大一小實木材料門，無外院或附塔；用途為點字轉錄與觸讀材料製作。 | Orchardcraft為三段鋸齒和圓樓梯鼓，Flintchart為放射三鋸齒，Willowmusic為分開V翼蝴蝶谷，Sedgephoto為單陡玻璃坡加低橢圓；本款只有一條完整直線採光高差及低前高後兩級實牆，不做鋸齒串、V平面或玻璃楔頂。 |
| elderdebate | 接骨木辯論會堂／Elderwick Debating Hall | 812..815 | 高窄長中央辯論廳兩側各接一條明顯較矮的連續側廊，中央陡板岩山牆頂與兩側向外落低的單坡頂形成真正三級剖面；中央兩側有高成排窄窗，低廊有小圓頭雙窗，正面深石框木門和三聯高窗；無後殿、鐘塔或宗教符號。 | Crossness是三個平行近同高山牆跨，Rookhall是錯T截角山牆加後殿，Larkprint是前寬後窄倒T，RCJ有哥德式側塔與複合翼；本款是一條高中央空間夾兩條連續低側廊的清楚剖面，不是普通三山牆排屋或教堂換名。 |
| osieroral | 柳溪口述歷史館／Osierbrook Oral History Hall | 816..819 | 低矩形口述歷史錄音館，兩道完整長磚側牆承托一片淺單向下凹鉛曲頂，屋面只橫向下垂、縱向等截面；正面寬木格玻璃工作窗上緣隨曲頂下降，側牆高窄窗、兩端實木門與石門框，端部明確收水簷；無架空、無附塔。 | Willowmusic為兩翼平面V形蝴蝶谷頂，Pondbadminton為對角高低鞍面，Wrenumbrella為一端高拱一端低直的凸conoid；本款平行落地實側牆間一片單向凹曲屋面，不能改成兩塊平斜板、鞍面或凸桶拱。 |
| cloudmereweather | 雲澤氣象學舍／Cloudmere Weather School | 820..823 | 低寬十邊磚氣象學舍，淺分面板岩穹頂中央留真開放觀天孔，孔緣厚鉛翻邊及低環梁，孔下只有相應小型露天觀測空間；外牆交替寬平頂雙窗與實牆、單一石框凹入口；開孔有真內側厚度與可見深度，不用黑色圓貼片，無儀器動畫或氣象模擬。 | Alaronde為十六邊住宅及分面尖頂菱窗，Roundhouse為實心蜂巢石穹，Fennelhoney為大露天院的厚環形工房，Thistlenursery有高採光亭和雙後殿；本款是低薄穹頂上的小真觀天孔，無塔、中央高亭、外伸翼或大院。 |
| coppicelecture | 萌林自然講習館／Coppicefield Nature Lecture Rooms | 824..827 | 單一落地磚講堂，側影由低前端直升高後端，連續板岩大坡頂下容納同寬高後廳，沒有另外加高盒；厚石基及轉角石框、兩側沿斜剖面上升的三組短豎窗、低前端一組寬窗和偏置木門，表達階梯式自然講習室；無架空步道或附塔。 | Leicester及Rogerstevens為多塊階梯講堂、塔和架空連廊組合，Sedgephoto是陡玻璃楔加低橢圓接待室，Brooktools是折轉三段單坡；本款僅一個落地、實板岩頂、無凹轉與附樓的長斜楔，不以小坡屋頂普通方盒代替整體斜剖面。 |
| shellwickpetitions | 貝原市民陳情室／Shellwick Civic Petition Rooms | 828..831 | 實心低D形市民陳情館，筆直後牆與寬半圓前牆合成一間完整房體，單一半扇形板岩屋面由直背中央高點向弧簷落下；弧面五組窄長平頂木格窗、直背偏置石門，後端不另加塔或接待翼，沒有內院或開放車棚。 | Bramblewheel是高直後工房加低半圓開放車棚及真院，LeedsCorn為完整橢圓穹頂，Honeygrocer為四分圓角店加階梯後翼；本款是低寬實心半圓室與直背、無附樓的放射平面坡頂，不能複製空D院、整橢圓或只把角店屋面放大。 |
| velvetcostume | 絨谷戲服修護亭／Velvetcombe Costume Pavilion | 832..835 | 低方形石基戲服修護亭，屋頂占整體高度過半，四面真正連續反曲板岩主頂由下部外張簷收至上部短截脊；四角不加塔，兩側成對高橢圓窗、正面三聯矩形工窗及偏置木門，曲面以有厚度的分段屋面表達，無塔身或上下疊帽。 | Asterpost為長身折簷截角頂加五邊郵亭，Brassbell為高方鑄房雙層四坡帽，Guildford和Lynncustoms僅在高塔頂有小曲帽；本款整座低寬工作亭以單一四面反曲主屋頂構成，不能把普通金字塔畫曲線或放大既有塔帽充數。 |
| broomtranslations | 金雀翻譯事務所／Broomfield Translation Rooms | 836..839 | 三條沿同一軸相貼的低磚工作室，街面逐間前後錯開並形成兩個真凹角，中間較高而兩側低，三個各自完整的四坡板岩頂清楚分離；前窗分別為寬三聯平窗、成對高上下拉窗和短橫窗，兩凹角內設石框門；沒有院落、指狀空隙、架空或外部連橋，用途為市民文件翻譯。 | Netshops是分離窄高尖山牆網屋，Crossness為齊平三跨山牆，Alderjoinery為真院E形指廊，Brooktools為Z形逐級單坡，Woldswitch為雙錯位方塊配寬設備連接和不同頂類；本款低、相貼、中央高的三段折退街面，真凹門與三個完整四坡頂共同辨識，不能只多複製一個Wold方盒或把Brook換頂。 |

## 凍結驗收（保留前波全部適用門檻與真反例）

1. 本卡單檔先推；同一原始main Git物件作獨立BASE。新增三個明確art／CSS／runtime區塊與原生安裝尾；剝除後完整index逐byte回BASE。舊smoke只新增自己的自檢，舊斷言、fp.js、harness、gallery、probe既有判準、pins、規則與其他已發布來源都保持原文。發布時僅明列三版本標籤與日誌／方向紀錄的嚴格插入例外；每個例外均須真破壞首紅。
2. 十款各四向＝40日／40night原生160×196／ax80／ay194／sz2精靈，無缺項、半透明軟邊、裁切或光漏；夜光只在白天可見實體窗及燈具。去共用鋪地後十個結構剪影必須不同，四向是世界幾何旋轉，實際安裝像素等於獨立建模；不得用換名或換色填數。保留缺葉、重複幾何、錯尺寸、裁切、天空夜光、軟像素、空圖與錯安裝等首紅及精確恢復。
3. CI真Chrome、原生目錄與付費建造，十款選取／40向、完整root與ref、扣款、undo／redo／拆除及refund、slot3存讀與歷史完整欄位不變。三種子31／71／103、九checkpoint的正常BASE／HEAD決定性比較；至少86原生斷言與12類真首紅。失鎖／缺項時不可選，逃生閥保留，不改既有儲存語義。
4. 原生供電on／斷道路／關電源／恢復四態，各十款四向＝160案例、275遊戲PNG、1920固定交通相位見證。保留全畫布嚴格相等、窗光移除與交通相位擾動負控、未通電精確相等與供電恢復；不遮罩、不裁切比較、不改容忍、不賦pw／capacity／dispatch／nightPowerRate真值，不把fixture帶進production，不排除存檔欄位。
5. 日夜、四季含冬雪／無雪、四向、遠景、邊緣、施工、懸停與疊層，保留57場景與40實際邊緣案例、至少113場景PNG、8組BASE／valve整幀逐位相等、兩次完整舊檔roundtrip及實際一元／單像素破壞負控。保留17行人深度遮擋案例及兩負控，不能拿靜態圖代遊戲驗收。
6. 同runner、同視窗、交錯BASE／HEAD各40組原生效能樣本；保暖draw新增幾何0，原門檻不變。保留30樣本實際延遲注入負控與恢復，列median／p90，不宣稱真機手機效能。
7. 常規push／PR最後head smoke3連綠、fp零差、財務53項／10負控全綠。首次預期美術fp紅保留完整結果；僅採同一精確CI的原始fp／style附件，核恰bld新增40且舊葉／其他族／block／env不變。任何分數下降列前後七軸及total，在卡／PR／方向表依連續授權披露；不手改分數、基線metadata或門檻，不重跑賭綠。
8. 留80單圖、3接觸表、10近景、真實遊戲預覽與manifest／SHA／producer head／artifact；作者與獨立看圖、實際檢視與產物存在分開。原PNG用已核可訪問專案連結交付，不無限重試Library。沒有實看不能說看過；實機手機／Safari／觸控沒有測就保持未測。適用圖片審閱沿用方向與AGENTS，不逐波重問同一製作授權。
9. 臨時workflow僅本分支、contents:read，無部署或遠端寫入；最後run全綠後只刪workflow的獨立commit，之後它保持不存在。最新head所有必要CI及第8節自檢如實記錄；T／版本／r取當時main最大+1。符合規則才合併，核main CI、既有自動Pages、實際公開完整HTML SHA／版本與瀏覽器；不手動觸發Pages。正式發布才計本波170座，然後依序第18～20波。


10. 額外施工就緒不是替換原57場景：保留原冷draw兩次，另真原生付費建十款age7，固定12個自然rAF，不flush／加速／提前挑幀，終點pending、shell／LayerA miss均0且十棟量體可見。另開全新瀏覽器明示單次既有flush fixture及固定66自然幀；不可冒稱正常冷啟效能。兩路日夜整畫布RGBA嚴格重畫相等及單像素破壞／恢復，原X13G與8ms idle／3ms fallback／2shell／6個6ms LayerA預算逐byte保持，不失敗後延長時間賭綠。
11. Broomfield必須具備三個相貼錯退的低房體、中央高、兩個真凹門及三個完整四坡頂。如果讀起來只是Wold多一盒或Brook換頂，不能以名稱或色彩接受。Cloudmere的觀天孔與Knapwell的斜院是真開口，Velvet主頂是真反曲，不以暗貼片或輪廓線假造。不得為新奇而損失英式地面承重感與窗牆細節。

## 初始狀態與第8節自檢

- [x] 最新main／Pages與第16波真公開驗證已綠；方向運行，首卡宣告單一bld家族及十個獨立身份結構。
- [ ] 本卡尚未首推；本波模型0／10、實際渲染0／40、遊戲／CI未執行，不把方案或前波結果當本波完成。
- [ ] 同種子、存讀、原生操作、fp、完整畫布、美術狀態、真負控、smoke3、財務、效能與真公開網站均待新實作後CI驗證。
- [x] 沒有放寬舊門檻、覆蓋其他作者、改寫歷史或把候選算正式成果；本機不執行遊戲／Chrome／fp／像素。

## 沒做成的事

只有施工前範圍與驗收凍結，沒有本波程式、圖片、CI、PR或正式發布。第17波須真正發布後才計170座，接續18～20波。

## C1 actual implementation and source preparation · 2026-10-24 UTC

- Implemented ten original bodies and forty native world rotations, unchanged art634 material/depth/projection helpers, canonical 800..839 native landmark registration, paid placement/undo/save integration and catalog. No simulation rule, carrier cost or old art changed.
- Authored art SHA256: `28a1757e08e5a07bad76cab5b394c8b75c34cdcd33c0dab14db6194738b51e25`. Source-only recording audit exercised forty paths, thirty deliberate structural first-red/recovery cases and three invalid-input controls. This is not raster or browser acceptance.
- Independently pinned published BASE `3d2220d26ec0e132491280932edb13fdbae5852a`; all 1,547 non-declared published files remain byte-exact. Three new product blocks strip back to the complete BASE index; prior smoke assertions unchanged. New source contract includes nine negative controls, including stale first-card metadata and false provenance.
- Fifteen new candidate native guards retain full strict scenarios and independent BASE comparisons. New construction guard uses the first-card-fixed natural12 endpoint and separate fixed66 single-flush fixture; no product budget change or adaptive waiting. Historical guards, original first card, main workflows and repository rules remain unchanged.
- Dedicated branch-only read-only workflow now requests real Chromium preview, native/financial/power/state/scene/pedestrian/performance/construction and raw fingerprint evidence. No local game, Chrome, fingerprint or raster execution. `fp.json` and `style.json` still exactly match published BASE until official CI evidence is available.
- Unfinished: all official CI runs, actual PNG inspection, raw fingerprint declaration, release-contract validation, final head CI, PR integration and public release verification. No wave17 building is counted as published.

## C1 first RED and targeted repair · 2026-10-24 UTC

- C1 remote head: `5f34786879b2941186bbb08448ced3a46b4d74d9`. Standard run [40128726135](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40128726135), native run [40128726164](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40128726164).
- A real new045 self-test selector defect retained the previous wave's regex760..799. It selected forty old sprites but indexed new800..839 rows, producing `Cannot read properties of undefined (reading 'id')`. The same new selftest exception caused smoke job120975651302 and native job120975651028 to fail. Power did not execute; its missing-artifact failure is downstream, not a power pass. C1 scene, pedestrian, state-pair, performance and both fixed construction-readiness routes passed independently.
- Repair changes only the new045 selector to exactly800..839. A new source-level regression checks every synthetic slot0..999 against the precise forty expected slots, deliberately restores the old regex to prove first RED, then restores correct source. All previous wave assertions and artwork remain unchanged; no acceptance is removed or weakened.
- Separate fp job120975651080 reported exactly40 added bld leaves with no other family decline. Adopted only its raw artifact12574725468 bytes after ZIP SHA256 validation,4023 old leaves exact,165 other families exact, old block count1728/CRC5ef6eb67 exact. Both old/new raw files omit envLeaves, with no environment-registration warning; no invented registration data added. Full provenance is `GPT-045-raw-CI-baseline-adoption.json`.
- bld total96.45%→96.49%; seven axes: palette1→1, hardEdge0.9572489734902542→0.9578807244340685, lightDir0.8034960819770947→0.8057680988816951, shade1→1, density1→1, nightRule0.9907380909650112→0.9909531159365403, variants1→1. No score edited or threshold lowered.
- Actually inspected original day/night contact sheets: ten distinct bodies and four rotations, localized night windows, no obvious cropping at contact scale. Detailed near/scenes/edge inspection is still in progress. New CI must confirm the selftest fix, complete native power and fiscal behavior; old success does not substitute final head verification.

## C2 complete candidate verification and release preparation

C2 `c57157c6991aa48325e07bc807f6cfb244eaf8a9`: [standard40129322396](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40129322396) smoke三次／fp／fiscal-load均成功；財務53項、10負控制、零失敗。[native40129322522](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40129322522)全部28工作成功。86原生檢查、12負控制，160供電情境／275PNG／1920相位證據，57完整場景＋40邊緣＋8歷史整幀對拍均成功。沒有刪減財務、存讀或像素欄位。

同種子對比及完整舊檔回歸見原生normal-pairs/scenes附件與 `GPT-045-candidate-verification.json`。40交錯效能樣本：BASE median11.4ms／p9026.525ms，HEAD median2.675ms／p9026.8ms；既有預算不變，暖快取不重烘，30延遲負控制保留。自然12幀與獨立一次flush66幀建造路徑均成功，冷兩次draw畫面仍如實保留，不冒稱瞬間全部完成。

原始接觸表與全部十款近景永久交付於 [docs/assets/GPT-045](../assets/GPT-045/manifest.json)。圖片逐byte複製原生CI產物，producer/head/artifact/SHA完整保存。實際人工檢視157張原圖：148張C1及9張有差異的C2，含全部57場景、40邊緣、16歷史對拍與19建造圖；精確清單及差異解釋見 `GPT-045-visual-review.md`。C2接觸表／單精靈91張全部與C1逐byte相同；場景112/113相同，建造11/19相同，差異原圖已覆核。遠景為既有LOD方塊，不當近景美術通過；不是275供電PNG全數人工逐看，也不冒稱業主圖審、實體手機或Safari。

### 不改壞標準§8，候選證據逐項自檢
- [x] 第一張卡在施工前凍結，完整原文保持前綴；沒有放寬驗收。
- [x] 同種子逐欄比較及舊存檔回歸成功；發布版將另驗精確gameVer14.63→14.64遷移，不排除其他欄位。
- [x] fp僅首卡bld家族增加40葉，4023舊葉／165其他家族不變；逃生閥8整幀對拍成功。
- [x] 原生全部日夜、四季、有無雪、四向、邊緣、遠景、疊層與施工圖已實看，原圖及對照圖可核；LOD限制如上。
- [x] 新守衛保留實際破壞的首紅與恢復：33幾何／來源範圍／原生12／供電／行人2／延遲30及像素、舊檔負控制。新增045錯selector回歸不改歷史判準。
- [x] C2 smoke連跑三次成功，附上同headCI，不靠重跑賭綠。
- [x] 沒有把source-only當Chrome；沒有把候選、已授權或CI成功當正式發布。

### T771／v14.64／r218 發布準備

Draft [PR59](https://github.com/lijiabao1998/GlimmerTown-lab/pull/59)。新增版本化發布契約只改三個精確版本字，反向必須完整還原C2 index SHA256 `89c3551256b31d3635170fa486d5298496aef0a5681d656a6b267349d433ae70`；獨立BASE也只同樣三字變更。舊045候選契約與所有舊檔原封不動。`AUTORUN-LOG.md`與方向檔僅准明列的新紀錄插入，業主開關與方向原話不變。

未完成：發布版完整原生／標準CI；原生最後全綠後純刪分支workflow、最終push與PR CI、合法合併、mainCI、自動Pages與正式HTTPS＋Chromium逐byte核實。正式仍16波160座，不能提前計入170。

## C3發布版完整驗收追加

發布版 `59052963165fe70463329c3adc5edd48f2208faf` 的 [native40130557188](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130557188) 全28工作成功；[push40130557220](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130557220) 與 [PR40130560903](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40130560903) 均綠。原生86檢查／12負控制，財務53項／10負控制，160供電情境／275PNG／1920相位見證及舊檔僅明列gameVer14.63→14.64遷移均通過。候選原始契約與歷史條件未修改，完整結果見 `GPT-045-release-verification.json`。

發布版91預覽PNG完全等於C2；113場景中112完全相同，冷施工晚期僅差1像素。19施工圖中17完全相同，兩固定終點受既有環境動畫影響；三張差異原圖及其C2對照均實際打開檢視，固定自然12幀及單次flush66幀均可見十棟完整量體。原冷兩draw仍有最後一棟pending，保留此限制，不把它冒稱完整建造就緒。效能BASE median8.10ms／p9014.00ms、HEAD median1.65ms／p9013.425ms；同runner40交錯樣本，暖draw零新幾何，原延遲負控制與預算不變。

本追加只保存真實證據，不計作正式170座。專屬workflow最後完整run已綠，下一步獨立純刪該workflow，最終head標準CI／合併／mainCI／自動Pages／發布後真公網Chrome仍須逐項完成。
