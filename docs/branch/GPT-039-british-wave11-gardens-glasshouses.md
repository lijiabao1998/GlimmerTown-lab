# GPT-039：第十一波十座有考據英式園林與溫室建築

## C1 凍結卡（動手前；2026-10-21）

本輪從實際遠端 main `8fd1d5e0ec98c729369bebffdd329e93cead93ba`／tree `60cc34a20b6fb420b70bc107ecb993fa471d7e19` 起步。第十波 PR46 已完成，不重做、不再問圖片或發布批准。現正式 v14.57／T764／r211，10／20 波、100 棟；本輪尚未建模、整合、測試或發布。主線方向為第11波園林與溫室；本卡只開發這十款，不更改方向原話或開關。本輪先提交、驗證與交付預覽；沒有把新開工訊息當成安全設定變更或額外發布授權。

本卡先單獨推送，再寫本輪程式／美術。卡面與下列十款／40葉／驗收底線之後不可改鬆；缺照片就是未完成，不換成九款、不塞假模型。照片只能作考據，不能嵌入或假設可再利用。

## 固定十款與不同結構

| 原型ID | 名稱 | 新原生v起點 | 量體／窗型／屋頂必須有的差異 | 一手來源 |
|---|---|---:|---|---|
| temperate | 邱園溫帶植物館（Kew Temperate House） | 560 | 高中央山形玻璃長廳、兩座八角連接亭與兩端低矩形館；大拱窗、層疊坡頂 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1262590) |
| syon | 賽昂大溫室（Syon Great Conservatory） | 564 | 中央拋物穹頂、弧曲連廊與端部山花館；石構門面與鑄鐵玻璃架 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1358328) |
| bicton | 比克頓棕櫚館（Bicton Palm House） | 568 | 圓端前凸高曲面玻璃主館、低四分圓側翼與背後實牆；重疊小片玻璃、通風百葉 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1097548) |
| sefton | 塞夫頓公園棕櫚館（Sefton Park Palm House） | 572 | 八角平面、三層收進圓拱玻璃屋頂、天窗鼓層與球頂燈亭；拱形窗組 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1292339) |
| sheffield | 雪菲爾冬季花園（Sheffield Winter Garden） | 576 | 高低遞變落葉松拋物拱列、外傾入口雨棚與細玻璃骨架；不把木拱畫成石拱 | [來源](https://www.prsarchitects.com/projects/arts-civic/sheffield-winter-garden) |
| hestercombe | 赫斯特科姆橘園館（Hestercombe Orangery） | 580 | 低長單室石館、三組大圓拱窗與兩門、兩端斷山花和陶瓦坡頂；不誤作平頂 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1175994) |
| wrest | 瑞斯特阿徹園亭（Wrest Park Archer Pavilion） | 584 | 圓形中央穹頂體、三個矩形翼與三個半圓翼交替、圓眼窗、入口山花與頂部燈亭 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1113807) |
| stowegothic | 斯托哥德園亭（Stowe Gothic Temple） | 588 | 三角平面、單座高角塔與兩座石穹頂角亭、不等高城垛；尖拱與四葉窗 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1211945) |
| apollo | 斯托海德阿波羅亭（Stourhead Temple of Apollo） | 592 | 圓形柱廊與高台階、十二科林斯柱、窗鼓與穹頂；不複製矩形Penshaw柱廊 | [來源](https://historicengland.org.uk/listing/the-list/list-entry/1131100) |
| pagoda | 邱園大寶塔（Kew Great Pagoda） | 596 | 十層逐層收分的八角磚塔、多重挑簷與龍飾輪廓；英國園林中的中國風建築，非宣稱英國原生樣式 | [來源](https://www.kew.org/kew-gardens/whats-in-the-gardens/the-great-pagoda) |

這十款尚只是已核實一手文字的凍結範圍，不等於已看過照片或建模完成。英式指本輪真實英國園林建築考據；Pagoda 明示十八世紀中國風來源，不抹去其文化來源。精確雕飾、不可辨窗數、看不到的後立面或隱屋頂不憑空補猜；每款實際照片與可見限制進來源表，足夠才開畫。

## 已做的去重與基準

- 對 main 的十波 ROWS 靜態抽取，恰100個已發布條目；另核歷史15款與既有 k47／k63 溫室、其他英式素材。Kew Palm House 已用於 T702 的 k63 溫室，Dunmore Pineapple 已在 T748／GPT-024，本輪排除；Kew Temperate House、Great Pagoda 與既有 Kew Palace 是不同真實建築，仍須用原生舊新對照證明不是換色。
- 開工時0個開啟PR；15條其他作者分支逐頭比較：3條Claude都是main祖先，其餘DSK／GLM／Grok有舊書店、客棧、餐館、座堂、樹／岸線等差異，未見本輪園林／溫室新主題。不改、不合、不刪這些分支。
- 主線HTML完整11370954 bytes／SHA-256 `9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852`；Git blob `5bf4c0982249d1c1a6d7c9fbd9e67204484e231d`。基線166族、3783葉；bld1419葉，既有100棟與歷史15款全部保留。只准首卡家族 **bld** 新增 `24_1_560..599` 共40葉；其他舊葉／165其他族／1728 blocks（CRC5ef6eb67）／env 不動。
- 生產版三處版本字、T號、主線日誌、fp.js／harness.js、既有smoke斷言、共用kit／原有十波守衛／供電交通語義／照片來源安全設定都不改。fp／style後續只准採同一CI原附件bytes並核相對BASE僅首卡bld；不手烘、不改generatedAt。
- 新圖沿原生 k24、Lv1、2×2、$2000 與原生適價／解鎖／維護／觀光／就業載體；不另創人口、作物、暖房供熱、氣候、生態或園藝產業機制。靜態玻璃植物剪影不改全局樹種／數量／密度。新圖共享原調色與受光規則，十款各有獨立世界座標幾何，不用同模型換色充數。

## 驗收（實作前凍結；不以資料檢查代替原生行為）

1. 十名完整、40個獨立四向幾何，80張原生日／夜原圖、10張近景、3接觸表，原圖bytes／SHA及來源HEAD／tree綁定；必有每款與最接近舊模型的真原生對照。夜PNG是overlay，不冒充通電夜間遊戲。
2. 每款需先有合法公開出處、真正可讀照片原檔／SHA及實際像素檢視紀錄，外形參照足夠才繪製。僅文字、ImageDisplayed字串或搜尋摘要不算照片實看。完整原圖人工覆核範圍逐檔如實記；全季節／近遠景／四向／有無雪／地圖邊緣與施工、懸停淡出、倒影、行人、煙、夜燈、招牌須實際驗證。實機手機／Safari／觸控未測就照實標未測。
3. 原生真付費、有限金錢、解鎖與原載體、選取、undo／redo、拆除／復原、舊新保存兩循環均檢；所有serialize欄位嚴格比較，fieldExclusions=[]，不賦值utility／不造保存欄位通過。至少12個真故障首紅命中目標、修復後原判準過。
4. 三種子31／71／103、九checkpoint、十款配對／舊新檔、8組完整原生BASE／閥關全畫布逐byte相同；$1與真1px負控制及恢復。source strip後完整等於獨立Git BASE，不拿HEAD當BASE或用manifest自證。
5. 保留前波十款供電矩陣160案例、275 PNG、1920相位見證與全幀嚴格相等：正常供電／拆路／斷源／undo復原、四向與真窗光正負控制；只CI fixture固定未存檔traffic動畫相位並finally還原，BASE／HEAD同策略。禁止動pw、capacity、dispatch、nightPowerRate或原生交通；不關號誌、不遮罩、不裁切、不提高容忍度，不靠多次stableFrame賭相位。
6. 完整97場景狀態及113 PNG（含40edge）、17行人／2真負例、40組交錯BASE／HEAD效能、30延遲負例、暖重畫幾何新建=0。保留原median<=BASE*1.5+2、p90<=BASE*1.5+3，CI計時不冒充實機改善。完整21工作須覆蓋來源、原生、供電、保存、場景、行人、效能、baseline及原bytes回收，不縮成局部套件。
7. 最終head標準CI真smoke3次／fp對已提交基線零差／財務53項＋10負控制；相對BASE只bld40新葉，七軸／總分如實列，下降不說全軸上升。所有既有守衛與負控制保留，不改規則或安全設定。
8. 新圖 `__noBritishWave039` 可即時退回舊圖且全幀與BASE相同；完整十款守衛不得為部分候選讓路。只綁本分支contents:read的臨時workflow如需啟用，不准部署或寫入；最後綠後另作純刪提交，最終每個commit驗其缺席及標準／PR再綠。開PR前按標準§8逐條實核。
9. 本輪先交可審查PR與實景預覽；提交、CI、合併、Pages、公開真HTML／Chrome證據分開記。保留新款圖片交付與適用的批准門檻，不把本輪開工當成發布完成；不手動觸發Pages、不推main、不force、不碰別人分支。

## 開工實際結果與阻點

2026-10-21已實際執行並隔離於scratchpad/wave039/worktree，從本地既存完整tree60cc34a逐檔核對遠端main tree；完整HTML雜湊符合上列。AGENTS／AUTORUN／CLAUDE／DECISIONS／迭代不改壞標準及方向已讀；此main沒有.agents/skills或其他SKILL.md。

- 終端讀取 `git fetch --no-tags origin main:refs/remotes/origin/main` 一次失敗：`fatal: unable to access 'https://github.com/lijiabao1998/GlimmerTown-lab.git/': CONNECT tunnel failed, response 403`，exit128。該終端傳輸已停，不重試、不改proxy／TLS；GitHub官方工具的main／tree／分支唯讀成功，保存實際結果，不把它冒充終端fetch成功。
- 照片原檔 `https://www.kew.org/sites/default/files/styles/header_style/public/2019-02/Inside%20TH_0.jpg.webp?itok=dQ5LbV_t` 正常GET一次得到 `URLError: Tunnel connection failed:403 Forbidden`，bytesWritten=0，已停止該下載。未透過CI、代理、其他帳號或傳輸路徑重取被拒原圖。
- 網頁工具可讀一手史料／圖片URL，但圖片open僅回文字ImageDisplayed與引文，沒有可供本任務實看的像素或原檔；一次MCP PDF screenshot得到「content type is not application/pdf and web screenshot is not enabled」，標為技術解析錯誤；另一已解析PDFref仍只回文字，未假稱實看。這不是照片驗收通過，也不是GitHub寫入卡片。
- 最初ROWS非貪婪regex抽到後段函式而SyntaxError，已保留原結果並改用純資料括號掃描，十個ROWS恰100條成功；這是靜態資料抽取修正，不是遊戲測試或繪圖紅綠。
- 截至C1：實際照片檢視0／10；新模型0／10；新增生產精靈0／40；原生／供電／煙霧／fp／財務／新預覽尚未執行，不記成功。本卡先推；可獨立準備來源／範圍／完整性守衛，依賴真照片的繪製仍受原門檻約束。缺少的是這十款可讀原照片附件及出處，不是第十波批准。

## §8 現況

- [x] 動手前卡面先推；凍結條件不改鬆（以遠端C1提交回執為準）。
- [ ] 同種子／舊檔／全欄位原生回歸未跑。
- [ ] fp／閥關全幀未跑；資料pins不冒充像素。
- [ ] 本輪93原圖／97狀態／113場景尚未生成或實看。
- [ ] 新行為守衛首紅／恢復未跑；來源準備的負控制另列，不充作原生12項。
- [ ] 真smoke3／fp／財務53＋10與完整21工作待實作後CI。
- [x] 未執行、失敗、技術錯誤、正式拒絕、待卡片、未知結果分開記，沒有假勾。

沒做成：照片原像素尚不可得，十款模型與全部原生驗收／預覽都未完成。本卡不是完成提交或上線聲明。
