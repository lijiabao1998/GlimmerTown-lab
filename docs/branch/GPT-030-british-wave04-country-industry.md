# GPT-030：第四波十座有考據的英式鄉村與工業遺產建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave04-030`，只推此分支；起點為遠端 `main` **9335b08f47ab184ebb5fa7f46b776c1049cd5cc9**（v14.48／T755／r202）。卡面單獨先推，成功後才施工，不重寫已推歷史。
- **第一個 commit 宣告要動的 fp 家族：`bld`，只有這一族。** 預留 `bld.24_1_280` 至 `bld.24_1_319`，40 葉＝10 座×4 結構視角。這 40 鍵在起點未使用；3503 個既有 subs、其餘 165 家族、blocks／`block559`、環境葉都必須零變。
- 對應業主 2026-10-16 原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」本卡只做第四波 10 座；前三波已發布 30 座，T748 歷史 15 座不計入。卡面、考據與計畫不算已實作。
- 起點 main 最近完成 smoke [39085350900](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39085350900) 全部三項成功，財務 53 項／10 負控制；自動 Pages [39085740893](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39085740893) 成功，部署同一 SHA。開卡前無開啟中的 PR，方向開關「運行」，最上待辦為第四波。
- baseline：166 家族、3503 subs，bld 1139 葉／總分 0.9657；blocks 1728／CRC `5ef6eb67`。本機只讀 git、靜態來源及原圖位元，所有遊戲、瀏覽器、指紋、像素及效能執行交 GitHub Actions。
- 第三波實際公開站畫布仍未看過：選定雲端 urllib 讀取報 `Tunnel connection failed: 403 Forbidden`（代理 CONNECT，非網站 HTTP 403），網頁工具也無法存取。先用本卡唯讀分支 CI 向真正公開 URL 發送請求，核對回應 SHA256、版本、真實頁面載入與截圖；不得以部署成功取代這一步，不部署、不改遠端設定、不使用使用者電腦。

## 目標與一手考據（施工前）

十種真實英格蘭建築的像素轉譯，有高瘦風磨、矮厚窯體、長條繩廠、石造水力廠、無屋頂引擎房與現代工廠。獨立平面、屋頂、窗洞及量體，不以同一盒子換色。下面是施工前候選；個別候選若在實物圖或舊圖比較中仍重複，可以在畫該款前改選有一手依據的原型並記理由，總數、家族、驗收不改。

| 四向起始 v | 原型／一手來源 | 已核實結構與獨立輪廓要求 |
|---|---|---|
| 280 | [Cley Mill，HE 1049823](https://historicengland.org.uk/listing/the-list/list-entry/1049823) | 五層磚塔、白木帽與四翼帆、尾向裝置、二層環廊，附屬燧石／磚及木板小翼。名錄與經營者年代記法不同，不捏造單一建造年；不得挪用既有風力機。 |
| 284 | [Crossness Pumping Station，HE 1064241](https://historicengland.org.uk/listing/the-list/list-entry/1064241) | 1865 啟用，黃磚兩層主體，三聯圓頭羅曼式窗、墩帶與檐口，背側三條垂直主體的單層平行山牆翼。只畫已證實構件，不憑想像補現存煙囪。 |
| 288 | [Chatham Ropery，HE 1268250](https://historicengland.org.uk/listing/the-list/list-entry/1268250) | 1785–1791 長條三層加地庫閣樓、紅磚灰磚頭、平行谷頂／山牆、頂部交替通風與老虎窗；端部機房方煙囪。真實超長廠房在 2×2 壓縮，明列尺度轉譯，不宣稱測繪還原。 |
| 292 | [Holy Island Lime Kilns，HE 1006434](https://historicengland.org.uk/listing/the-list/list-entry/1006434) | 砂岩低厚電池式窯，六個窯口、中央通道及內部出料拱；不得改畫成雙高煙囪或一般住宅。 |
| 296 | [Gladstone Pottery，HE 1195854](https://historicengland.org.uk/listing/the-list/list-entry/1195854) | 多座圓形 bottle-oven hovel、窄頸鼓肚窯、階梯式 flue 與互連紅磚作坊，街面三層車道拱。名錄跨 Gladstone／Roslyn 範圍，不杜撰「現館總窯數」；明列選取構件與壓縮。 |
| 300 | [Wheal Coates Towanroath Engine House，HE 1141501](https://historicengland.org.uk/listing/the-list/list-entry/1141501) | 三層加地庫的石砌長方引擎房、磚圓拱洞、後左角圓煙囪、前方高 bob wall；現存無屋頂、木樓層與機械，不能補完整住宅屋頂。 |
| 304 | [Sissinghurst Oast，National Trust](https://www.nationaltrust.org.uk/visit/kent/sissinghurst-castle-garden/exploring-the-buildings-at-sissinghurst-castle-garden) | 官方記載六個早期方形烘乾窯與兩個後期較大方窯；依官方實物圖核對方錐頂及白色 cowl，不拿常見圓塔 oast 的泛稱套用本建築。與既有石倉／鴿舍及未合併 grok 原型分清。 |
| 308 | [Abbeydale Works Museum，HE 1246418](https://historicengland.org.uk/listing/the-list/list-entry/1246418) | 石板頂、石砌多翼、Venetian 形山牆窗、外階、明露水輪及多煙道鍛爐；選取可辨的原廠構件，不能直接複用 Coxwell 大倉或舊一般磨坊。 |
| 312 | [Temple Mill Leeds，HE 1375162](https://historicengland.org.uk/listing/the-list/list-entry/1375162) | 高單層覆地庫的大水平廠房，埃及復興傾斜牆、紙莎草柱頭、凹曲檐、圓錐玻璃天窗；北側凸出兩層辦公翼。與既有 Shrewsbury 多層磚廠區別，不新增草頂模擬。 |
| 316 | [Hoover Factory Main Front Block，HE 1079353](https://historicengland.org.uk/listing/the-list/list-entry/1079353) | 1932–1935 兩主層加退台頂層、兩端高樓梯塔、連續大玻璃與彩磚裝飾，中央 Egyptian Art Deco 門楣。與 Preston Bus Station 的懸挑停車層及 Arnos 玻璃圓筒結構區別。 |

初步名稱搜尋未見上述原型已在合併款式中出現；名稱不同不是不重複的證據，仍須檢視單色輪廓、新舊接觸表及細節。排除現有 Coxwell 石倉、Shrewsbury Flaxmill、Beamish 井架、Cardington 棚、Willington 鴿舍及 Kew 溫室的直接重做。

## 實作邊界與退路

- 沿用 k24 2×2、160×196、anchor 80／194、$2000 原生 landmark 模擬載體。只在原生有費 doPlace 成功後選既有 b.v；保留原價格、解鎖、容量、工作、旅遊、上限、RNG、undo／redo、拆除／退款、保存格式與載入 API。四向各自生成，不拿前視圖鏡像替代。
- 新圖有獨立 `__noBritishWave030` 逃生閥，關閉時退回 actual base。獨立整幀閥驗證可用，正常狀態、三種子配對、付費、保存與效能不靠閥通過。剝除本卡有標記的來源與安裝點必須逐位元還原 actual base；合併準備只另容許三個精確版本標記變更。
- 只新增自檢，不改既有 smoke 斷言、harness／fp／gallery、舊 probe 判準、pins 或規則。不動全局觀感、生成數量密度、道路、產業鏈或遊戲機制。若確實需要越界，按第 7 節另行處理，不擴本卡。
- 自己分支專用 workflow 僅 `permissions: contents: read`，不推送、不部署、不寫 PR 或其他對象，不加回已刪的 027／029 workflow。最後一次完整 run 成功、記卡後，專用 workflow 以獨立只刪檔提交移除，不能合進 main。
- 可逆退路為本卡純 revert，仍須原煙霧與 fp；不動他人分支或工作區、不 force、不手動觸發 pages.yml。

## 凍結驗收條件（動手前；之後不得改鬆）

1. **先核第三波實際公開網址**：CI 對 `https://lijiabao1998.github.io/GlimmerTown-lab/` 取得真實 HTTP 回應，記 status、最終 URL、版本／錨點、SHA256，與獨立 base `9335b08f` 的 index 原位元相同；真瀏覽器正常載入原站，保存畫布及整頁截圖與錯誤。實際失敗如實記錄，不拿部署紀錄或本地 served HTML 當線上核實，不改正式網站。
2. **10 座×4 向×日夜 80 張原生 PNG**：窗洞、屋頂、平面、比例與單色輪廓各有結構差異；對照最相近舊圖，沒有越界裁切、透明洞或窗外夜光。保留原 PNG、清單、SHA、日夜與新舊接觸表；預覽 head／整合狀態準確，不把預覽或表格當完成。
3. **原生付費與完整保存**：真 DOM 點十款、逐筆 doPlace 扣款；逐款 undo／redo、退款、參照格拆除；十種新外觀及真正舊 main 原生檔都完整 load→save→load→save 兩輪，全部序列化欄位一致。只准地標根 b.v 的宣告美術差，不改格式處理 v≥256。
4. **獨立 BASE 正常配對**：actual base 原始 git 來源及完整兩端結果留存；3 seeds（31／71／103）×3 檢查點，所有正常欄位、財務、同時間線相同。release 階段僅可先置換獨立 BASE 的三個精確版本字，保留原文並驗反向逐位元相等，不正規化輸出、不刪 region.ver 等欄位；真舊檔遷移另驗未改 actual base。
5. **每條新守衛都有真反例**：故意改壞實際輸入、像素或原生金錢 API，首紅在目標；同判準恢復綠。原生金額 −1 三種子負控制由原全欄 comparator 捕捉，保留失敗與恢復；不循環答案、不用永假 assert。
6. **完整場景與整幀／行人**：至少 57 狀態＋40 邊界圖，日夜、四季、冬雪有無、四向、遠近、地圖邊緣、施工、懸停、人、窗燈、招牌及適用疊層。k24≥2 原生倒影與煙／霓虹不適用時依原碼記，不另加關層開關、遮罩、裁切或容差。actual BASE 與 HEAD 只開本卡退路時日夜四向全畫布 8／8 逐位元相等；正常無閥。至少 17 個原生行人深度遮擋例、實際負控制與恢復，判準不放寬。
7. **效能**：同環境 BASE／HEAD 40 組交錯樣本，比 median／p90，暖畫新烘焙零；真延遲負控制至少 30 實際樣本並恢復再量。已知週期噪音按原生輸入處理，不另造追蹤基建，不把桌面 CI 當手機／Safari／觸控實測。
8. **fp 限定與七軸**：相對 included-latest-main 只新增 bld 40 葉，3503 舊 subs、另外 165 家族、blocks 1728／5ef6eb67、env 全部不變。基線只逐位元取最新、含 main 的 push CI `fp-rebake/` 原始兩檔，不手改時間、得分或環境。披露 bld 前後七軸；下降依第二波起連續授權記卡、PR、方向已完成表，不隱藏。
9. **CI 與審查**：最後 head 原生煙霧 3 次、fp、既有財務 53 項／10 負控制全綠，無環境警告，不靠重跑。自己的唯讀 workflow 最後完整 run 必須綠並附卡，才以只刪它的 commit 移除；後續每筆不得加回。Ready 後請新的 Codex review，處理真實 findings；未執行或未回覆不稱通過。
10. **合併、發布、進度**：再核最新 main／方向／PR／CI／Pages／ancestry，按三個權威最大號配 T、版本與日誌，卡搬 T 檔；更新完成表與待辦，main 的開關／方向原文不動。最後 CI 綠且規約允許才合。核 merged tree、main CI、自動 Pages 的精確 SHA，開真網址看實際版本；失敗寫精確錯誤。只有合入 main 的十座才記 4／20，然後續第五波至二十波或真實停手條件。

## §8 開工狀態／沒做成的事

- [x] 卡面單獨先推：[b0782e997fb870762efce882a5adf893396888a0](https://github.com/lijiabao1998/GlimmerTown-lab/commit/b0782e997fb870762efce882a5adf893396888a0)，只有本卡一檔，parent 為上述 main；在它成功前沒有美術施工。
- [x] 公開第三波版本／真實畫布：[39087737240](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087737240) 已實際 HTTP／瀏覽器核實並人工看過原始城市頁面與第三輯目錄，詳見下方。
- [ ] 第四波原生樣張、完整舊檔及三種子：尚未施工／未跑。
- [ ] fp 與整幀、完整狀態、行人、負控制及效能：尚未跑。
- [ ] 最後 head 煙霧三次／完整 CI／審查：尚未跑。
- [x] 沒有假勾測試、沒有把圖表與考據當完成建築。

人工逐張完整狀態、實體手機／Safari／觸控，未實做前持續標未跑。main／Pages 紅、連續兩項卡住、兩個等業主／卡住 PR、越界或授權不足時按 AGENTS 第 7 節停；本方向未跑守衛累積與普通十項上限不構成停手。

## 公開站只讀前置核驗（尚未執行）

先推自己的 `probePublicSite030.cjs` 與唯讀分支 workflow，直接向真正 Pages URL 取得 HTTP，並以獨立 git base 的完整 index 位元核對；再讓隔離、空白瀏覽器只用 slot 3，經原生 UI 建立測試城，擷取實際主選單、城市、畫布與第三輯目錄。沒有啟動本地伺服器，不改正式網站、來源遊戲或其他檔案；所有正常頁面錯誤原樣留存。HTTP 比較器另用真回應的副本故意改 status／URL／一個位元，以及錯誤版本／錨點期望，保留首紅與原判準恢復。本機只做來源語法檢查，不執行探針或瀏覽器。

這些尚未跑的程式不算線上核實；第四波十座建築仍未開始畫。

## 首輪公開站核驗：HTTP 已核實，探針作用域錯誤尚待修復

[39087289579](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087289579)，head `0efdafdc0e9ee14ad4e9261d7cb06e6866cf0232`，job `117556416553`：01:40:00 UTC 真正公開 URL 回應 HTTP 200，10968593 bytes，SHA256 `77c51c5171c95f3d272999276b71ec9e94233b5f2bd0de0ca785d09745f73c3e`，逐位元符合獨立 main `9335b08f`。隔離 Chrome 實際主文件亦 HTTP 200、相同位元與 SHA，主選單烘焙閘門已到，五個 HTTP 比較器反例與恢復完成、頁面錯誤陣列空。這是實際網站回應，非部署紀錄。

隨後我自己探針的 metadata eval 發生 `ReferenceError: GAME_VER is not defined`：遊戲常數在既有封閉作用域中，不能直接由外部 CDP 名稱讀取。未產生城市截圖，所以不稱完整線上驗證通過。次筆只將自己探針的版本讀取改為既有公開 `GV.ver()`，錨點讀實際 DOM 的版本頁腳；HTTP SHA、原生 UI、畫布、數量及錯誤判準不變，不改正式遊戲。

次筆 `ba76206ee6488fe8e325eada15b6ecb578d79a10` 的 [39087506385](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087506385) 尚在跑時，純來源核對又發現探針對原生 UI 的前提錯誤：`bStartNew456` 呼叫 `begin(true)`，它建立 tiles 並隱藏主選單，沒有再次呼叫 `bootstrap453()`，所以不能要求烘焙序號增加。下筆將這個錯誤前提改為「同一個已完成的 bootstrap／素材存在＋原生主選單已隱藏＋真實 tile 已初始化」，仍須後續原畫布不空、版本、四十葉／十款目錄與錯誤檢查全部成立；不是關掉進城檢查，也不改正式遊戲。該 run 若被新 push 取消，只記取消，不記通過。

## 第三波真實公開站已核實；第四波美術尚待施工

`505c019e1207672a5336a6b4f158c77a80e79ab9` 的 [39087737240](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087737240)，job `117557747174` 全部成功。01:47:44 UTC 真公開 URL 與 Chrome 主文件均 HTTP 200、10968593 bytes、SHA256 `77c51c5171c95f3d272999276b71ec9e94233b5f2bd0de0ca785d09745f73c3e`，與獨立 git main `9335b08f` 相同。實際公開 API 版本 14.48、DOM 頁腳 T755、隔離槽 3、十款目錄／40 葉；原生 UI 建城後畫布 1280×657、840960 非透明像素／2297 取樣色，五個 HTTP 反例與原判準恢復成功，瀏覽器錯誤陣列空。未啟動本地伺服器，沒有用部署成功代替實際讀站。

原始證據 [artifact 12121047997](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39087737240/artifacts/12121047997)，GitHub ZIP digest `5050702d1df132e541ab034906dfec9453774999b2a8653f80655880cf96da54`。未改寫的原 manifest 存於 [public-site-verification.json](../assets/GPT-030/public-site-verification.json)。人工看過從 log 取回、長度及 SHA 均相符的完整城市頁面與第三輯目錄 PNG；這是正式站實際擷取，不是本地預覽。raw canvas 的大 log 搬運少 3072 bytes，該份搬運資料已拒收，沒有拿它當原圖；原始 CI ZIP 內仍保留其原檔及 SHA。之後 log 只搬較小的完整頁面／目錄／主選單，raw canvas 留在原 artifact，不改驗證判準或圖檔。

先前 `39087506385` 最終狀態為 cancelled，未列通過。雲端直接代理仍 403 是該通道限制；現在已有真正 CI 公開 HTTP／瀏覽器與人工看圖證據，不能再寫成「完全未核線上」。實體手機／Safari／觸控及第三波全 97 張逐張人工覆核仍未做。進度仍 3／20，第四波尚未新增美術。

## 第四波施工來源檢查（遊戲與樣張仍未跑）

十個獨立幾何作者及 40 葉 adapter／第四輯目錄已寫入並嵌入；本機只做來源解析，90 個 inline script 可解析。剝除本卡的 art／CSS／runtime 與唯一 install 呼叫後，完整 index 與獨立 `9335b08f:index.html` 逐位元相等（SHA256 `77c51c5171c95f3d272999276b71ec9e94233b5f2bd0de0ca785d09745f73c3e`）；smoke 只加本卡自檢一行，所有舊斷言、共用守衛及規則未改。版本仍 14.48／T755，未提前配 T 或宣稱發布。

本卡自己的原生、完整狀態、正常全欄配對、行人、效能與 5 個僅搬原圖的工作，沿用前三波已修正的嚴格判準，換成獨立新 base、280–319、新十款及新舊結構對照。另補第三輯目錄切換清除此輯選擇的原生檢查。自己的 workflow 現含公開站與上述完整驗收，總 13 jobs；預覽與長測試同輪並行。這些全部仍待 CI，來源語法成功不是遊戲通過。

選取構件／比例：Gladstone 畫三種已列入名錄的瓶形窯構件及階梯煙道，不宣稱全館總窯數；Temple 繪 18 個前柱、選取 12 個圓錐頂光，不宣稱原廠實際天窗總數；超長 Chatham 依宣告壓縮長度。石灰窯的六個下陷窯口與五個實際透空拱口、Wheal Coates 的無屋頂／無木樓層均由幾何構成，不能用換色代替。各向目視與像素檢查仍待原生圖，未把程式碼當交付。

## 50243f9：首輪完整原生結果與實際看圖修正

實作提交 `50243f9125f2e69865c5cbfd57036327878af201`，[39089619040](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39089619040)：公開站、preview、native、完整場景、行人、獨立 BASE 正常配對、效能七個工作及五個純原圖搬運工作皆 success；baseline-evidence 因尚未提交新增圖的基線而紅，不把整個 run 寫成綠。ordinary [39089619004](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39089619004) 的 fp 也紅在新 40 葉與新 style 尚未提交，沒有重跑賭綠。

preview 原 manifest、日夜接觸表與一張完整城市圖已逐長度／SHA 核實。`prototypeOnly:false`、10 種原生有費放置、40 四向精靈，committed index SHA256 `8d5b39d3cc5e46381c6bb8357ed63d3308104778dceb73fbec03c8190c331675`。實際看過 40 向白天與夜晚接觸表；屬分支原生預覽，未發布。首輪 raw fp／style 從本次 push 的 job `117563373202` 原封取回：fp SHA256 `55bac5e2fa2929bfa8e858674dcd150154c022153888dc730dcfe4a3184761fb`；style `5e62f58d63c2951bff875454ba804b78a9e81856a31d5def511400aff67d651e`。3503 舊 subs、其餘 165 家族、blocks 全部相同；新葉精確 280–319 共 40。摘要的 base 標籤 T754／14.47 來自 main 已提交的舊 raw 基線；本次新 dump 的原始版本欄是 T755／14.48。兩者都按原值保留，不手改任何 metadata。

首輪 bld 七軸有受光方向下降，總分 0.9657→0.9656，依第二波起連續授權如實披露；沒有提交或手改這份基線，因下述真實看圖問題先修圖。

| 軸 | main 9335b08f | 50243f9 實測 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9446630781096588 | 0.9459787373154694 |
| lightDir | 0.8287971905179983 | 0.8261238337574215 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9865421265088656 | 0.9869919565431439 |
| variants | 1 | 1 |

看圖及純來源定位：Crossness 主體三聯小窗的厚窗框蓋住部分窗面，黃磚紋理也誤讀 world y 為高度；Sissinghurst 白風帽在原生尺寸太細小；Towanroath 的開口尚缺考據中的磚拱圈。本次只改自己新圖：小窗改細框真圓頭玻璃、黃磚按真實 z 排磚並按牆法向受光；提高方錐頂的原生辨識度、放大白木風帽；石造遺構補有深度磚拱圈、內側拱牆改用內法向受光。沒有改夜光範圍規則、渲染器、判準、四十葉範圍、窗／窯／柱的宣告形制數量或遊戲。

修改後又通過純來源嵌入與 90 script 解析，剝除本卡來源仍精確還原 `9335b08f`；新圖仍須新 CI 重驗，舊 50243f9 結果不能冒充修改後通過。首輪兩份基線只留作歷史證據，修改後需取新的最新 push 原始基線。

## 522f9f1：修圖後原生驗收、看圖與本次原始基線

`522f9f1fd63eb2d3f12ac40634a414dc43161684` 的 [39090161665](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39090161665) 七個原生／正常配對／完整場景／行人／效能／公開站／預覽工作及五個原圖搬運工作皆 success；只有未換基線的 baseline-evidence 預期紅。native job `117565022020` 實際 80 PNG、12 個真首紅與恢復、三種子配對、十款有費目錄點擊、兩輪完整新檔、原生 undo／redo／參照格拆除均成功。場景 job `117565022032` 57 狀態＋40 真邊界、失敗 0；八個整幀閥逐位元相等，原舊檔兩輪完整比較成功。行人 job `117565021771` 17 案及兩個實際反例／恢復成功。

原 native 84 檔（80 PNG、三張接觸表與 manifest）及十款完整近景、原場景 manifest 全部逐長度／SHA 核實，人工看過 40 向日圖、40 向夜圖、新舊比較與十款完整近景；泵站真窗面、磚拱圈及白風帽已可辨。原圖不裁切、不重畫。詳細來源與逐檔雜湊見 [visual-review.json](../assets/GPT-030/visual-review.json)。所有 97 狀態尚未逐張人工覆核，實體手機／Safari／觸控未做，照實保留。

效能 job `117565021995` 正常 40 組交錯 BASE／HEAD：median 10.125／2.325 ms、p90 21.150／20.825 ms，暖畫新烘焙 0。真延遲 63 ms、30 實際樣本，原守衛首紅 median 65.3／p90 95.9 ms；恢復 40 組 median 8.175／2.250 ms、p90 20.650／19.875 ms，原判準綠。這些僅桌面 CI，不稱手機效能已測。

ordinary 首輪財務 job `117563372977` 的結果是 52 checks／10 negatives，唯一失敗為最後 source-integrity 組的「current renderer fingerprints match the committed baselines」；日結算等 diff 是各真負控制被捕捉的紀錄，不是額外未修財務錯誤。新圖在提交新基線前因此也會讓這組紅，未修改共用財務程式／判準、不重跑賭綠；換基線後仍須完整 53／10 成功。

**本次只原封提交最新 push 522f9f1 的 [fp artifact 12122258416](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39090161665/artifacts/12122258416)**，來自未改 `fp.js` 的 job `117565022137`，GitHub ZIP digest `fc58f0a6e8754d243e9aad55f7d6f85183e368614d6e74a4c2f105c86e577f7e`：`fp.json` 387023 bytes／SHA256 `b79a06a20a35e1bb60e15fca40448e90a570110172feae9dcdcd307252b795cc`；`style.json` 73166 bytes／`40220d5897969af38878d53c12ccb6cbfccdca936ae0a7800d64332d87286e0f`。原版本 T755／14.48、時間、統計及環境欄均未重寫。included main 仍 `9335b08f`；3503 舊 subs、165 其他家族、blocks 完全不變，唯一新增精確 `bld.24_1_280..319`。

| bld 七軸 | main 9335b08f | 522f9f1 實測 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9446630781096588 | 0.9459846379810595 |
| lightDir | 0.8287971905179983 | 0.8261238337574215 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9865421265088656 | 0.986992585347136 |
| variants | 1 | 1 |

總分仍 0.9657→0.9656，受光方向下降，不寫成無下降；依第二波起連續授權在 PR 與方向已完成表同步披露。新基線提交後的 CI 尚待，不稱最後 head 已綠。

公開站檢查另改成只讀 fetch 當時的 origin/main，獨立讀取該 git 物件再核真正 URL／HTML／API／畫布；發布後也核第四輯十款與 40 葉。依 [GitHub 官方單獨工作執行機制](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)，待 main 與自動 Pages 成功後，僅對新的正式站輸入再執行 public-site 工作，不重跑煙霧／fp，不新增或加回已刪 workflow，不手動觸發 pages.yml。該執行仍用原探針 GITHUB_SHA，實際遊戲來源另以 manifest 的 base／HTML SHA 證明；附件名附 run_attempt 保留前次原證據。這是新發布頁面的唯讀核驗，不是拿失敗守衛重跑賭過。
