# T755：第三波十座有考據的英式街鎮建築（原 GPT-029）

## 動手前卡面／不可變範圍

- 分支：`gpt/british-wave03-029`，只推此分支；base 是遠端 `main` **35be6a37ebc672c90e9406c50c32e157e8701196**（v14.47／T754／r201）。卡面單獨先推，之後才施工，不重寫已推歷史。
- **第一個 commit 宣告要動的 fp 家族：`bld`，只有這一族。** 預留原生 k24 之 `bld.24_1_240` 至 `bld.24_1_279` 共 40 葉＝10 座 ×4 個結構旋轉視角。現況這 40 鍵皆未使用；其他舊葉、另外 165 家族、`block559`／blocks 與環境葉都必須零變。
- 對應業主 2026-10-16 原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」本卡只做第三波 10 座；已完成第一、二波 20 座，T748 歷史 15 座不計入。計畫與卡面都不算已實作。
- 遠端主線最近完成 smoke [39049008748](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39049008748) 三項成功（main 煙霧 1 次、fp、財務 53 項／10 負控制）；自動 Pages [39049461383](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39049461383) 成功且部署 SHA 為同一個 `35be6a37`。開卡前未有開啟的 PR；方向開關「運行」，最上待辦是第三波。公開網址雲端讀取仍為 `Tunnel connection failed: 403 Forbidden`，未宣稱實看線上。
- baseline（主線已驗證 CI 產物）：166 家族、3463 個 subs，`bld` 1099 葉／總分 0.9653，blocks 1728／CRC `5ef6eb67`。本機只讀 git／靜態來源；遊戲、指紋、像素、效能與瀏覽器一律交 GitHub Actions。

## 目標與考據（施工前）

做十種可在原生工具列付費選擇、原生放置與保存的外觀。量體有窄高、低矮、連院、跨拱、連排等差別；窗洞、屋頂、平面與深度結構不可用換色代替。不是新增十種模擬建築或提高生成密度。

以下是候選與已讀的一手依據，畫之前逐款核對結構、現有最相近模型與實物圖。若候選仍與現有結構重複，在未畫該款之前改選有一手證據的原型，記錄理由，不變更家族／總數／驗收條件；不把尚未畫的表格稱作完成品。

| 四向起始 v | 原型／一手來源 | 已核實結構與需和舊圖比較的差別 |
|---|---|---|
| 240 | [St Albans Clock Tower，官方博物館](https://www.stalbansmuseums.org.uk/visit/clock-tower) | 獨立中世紀城鎮鐘樓，1405 年前完成；窄高鐘室、石帶與頂部輪廓仍須以官方實物圖／名錄核定。與既有城堡及附屬 Big Brum 鐘樓比，不能直接挪用城堡塔。 |
| 244 | [Bessie Surtees House，English Heritage](https://www.english-heritage.org.uk/visit/places/bessie-surtees-house/) | 兩棟五層商人屋，其中一棟為逐層挑出的木構立面；1930 年大幅修復並納入他屋部件，不宣稱未改原貌。與 Lavenham、Guildford 的低長木構廳區別。 |
| 248 | [Ipswich Ancient House，HE 1037756](https://historicengland.org.uk/listing/the-list/list-entry/1037756) | 兩層加閣樓、挑層；北側四個圓凸窗、西側一個、鉛條窗、泥塑牆與山牆老虎窗，側翼／小院。與直排木架窗的老住宅比，不僅換牆色。 |
| 252 | [Pulteney Bridge，HE 1394514](https://historicengland.org.uk/listing/the-list/list-entry/1394514) | 三個等跨高扁拱、兩列橋上店屋，南北立面有實際結構差別；南面中央威尼斯窗／山花與端亭鉛圓頂。以地標外觀表現，沿用 k24，不建功能性橋梁或道路。 |
| 256 | [Piece Hall，HE 1273056](https://historicengland.org.uk/listing/the-list/list-entry/1273056)／[管理單位](https://www.thepiecehall.co.uk/heritage/) | 方院四翼，因坡地東三層西兩層，朝院分層方柱與圓柱廊、角梯、雙坡石板頂；與 Little Moreton 木構 U 院比較。 |
| 260 | [Manchester Royal Exchange，HE 1200826](https://historicengland.org.uk/listing/the-list/list-entry/1200826) | 大矩形、中央交易廳，石材古典立面、三座玻璃穹頂、孟莎閣樓與角塔；與現有單圓頂圖書館／博物館、Birmingham 廳塔比較。 |
| 264 | [Chichester Market Cross，HE 1005890](https://historicengland.org.uk/listing/the-list/list-entry/1005890) | 八角開敞拱廊、八角扶壁墩、拱頂匯聚上部尖飾及後加鐘亭；與 Dunster 木柱亭、Campden 長方市場廳及 Penshaw 長方柱廟比較。 |
| 268 | [Willis Building Ipswich，HE 1237417](https://historicengland.org.uk/listing/the-list/list-entry/1237417) | 沿街不規則曲面、三層連續懸掛玻璃皮，第四層退縮玻璃亭、草頂與退後綠籬；依名錄四層，不誤稱只有三層。與既有方盒／Preston 露台廠比較，屋頂不另增公園機制。 |
| 272 | [Castle Cary Round House，HE 1056279](https://historicengland.org.uk/listing/the-list/list-entry/1056279) | 很小的圓形石體、蜂巢形石圓頂與球飾、四級門階與屋基通氣口；與 Arnos 的高玻璃筒／平圓盤、Radcliffe 大型古典圓樓比較。 |
| 276 | [Faversham Guildhall，HE 1343844](https://historicengland.org.uk/listing/the-list/list-entry/1343844) | 開敞底層三排八角柱、上層議事廳、南圓頭窗／北威尼斯窗、兩端山花、角部四段鐘塔與八角鉛頂小亭；與 Guildford 落地廳與 Dunster 全開敞亭比較。 |

已排除重複：Birmingham Back-to-Backs（既有 UKR15／k260）、Leadenhall Market（T725 市場原型）；Kew Palm House 等現有原型不重做。名稱搜尋只作初篩，最後還要看結構與對照圖。

## 實作邊界與退路

- 沿用 k24 2×2、160×196、anchor 80／194 與 `$2000` landmark 模擬載體。只在原生付費 doPlace 完成後指定既有 `b.v` 外觀，四向不共用前視圖。沿用原價錢、解鎖、容量、旅遊、工作、上限、RNG、undo／redo、refdoze／refund、保存格式與載入 API；不新增存檔欄位。
- 新增獨立 `__noBritishWave029` 即時退回原畫；此閥只作獨立整幀閥驗證，正常狀態、配對財務與全狀態驗收都不得靠它通過。圖形邊界與安裝點有明確標記；剝除本卡區塊必須還原 actual base 原文，合併階段只容許三個既有版本字標記差異。
- 只新增自檢到 smoke，不改舊斷言、共用 harness／fp／gallery／探針判準、pins／規則；不動全局光影、天候、倒影、後製、人車／建築生成數量與密度。若真要動到這些，另依 §7 等業主，不擴本卡。
- 可逆退路：本卡純 revert；不碰別人分支、遠端設定或使用者電腦，不 force。回滾後亦須原生煙霧與指紋驗證。

## 凍結驗收條件（動手前；之後不得改鬆）

1. **10 座真結構 ×4 向 ×日夜共 80 原生 PNG**。每座四向及日夜一致，屋頂／窗洞／平面／高度結構多樣；模型幾何與單色輪廓均不得只重用一模換色。對照現有近似款；沒有透明洞、越邊裁切、夜燈漏出實際窗面。保留原始 PNG、清單、SHA 與日夜接觸表。early preview 與長測試平行，明列原型／完整整合狀態與實際 head，不能把預覽算作已交付。
2. **原生付費入口與全序列化欄位**：真 DOM 點擊十款、用原生 doPlace 逐筆扣款，十款都驗 undo／redo／refund／refdoze。每種新外觀和真實舊主線檔都完成 load → save → load → save 兩輪，全部序列化欄位一致；僅實際付費地標根的 `b.v` 為宣告美術差。含 v 超過 255 的款式，不用改存檔格式解決。
3. **真正獨立 BASE 與正常配對**：原封保留 actual base git 物件、raw 來源與原始兩端完整結果，3 seeds（31／71／103）×3 檢查點，所有正常欄位／財務／同時間線相同。合併版本號時，獨立 BASE 的三個精確版本字輸入可先置為 HEAD 宣告 release，再執行完整原生比較；保留置換前後原文並驗反向逐位元相等，不能正規化任何輸出／漏掉 `region.ver` 等欄位。真舊版本檔的 GAME_VER 遷移另用未改的 actual base 原生存檔驗；不靠重設 region／刪欄位／新閥／改 comparator 過關。
4. **每條新守衛真反例**：故意改壞原生輸入或實際像素／原生金錢 API，首紅必須在該目標守衛，修復後同判準綠；不得用永假 assert／循環答案。實際原生金額 −1 的三種子負控制必須被原欄位對比捕捉。保留完整失敗與恢復結果。
5. **必看狀態**：至少 57 原生狀態＋40 邊界截圖，涵蓋日／夜、四季、冬有雪／無雪、四向、遠景／近景、地圖邊緣、施工、懸停、人／夜燈／招牌及適用疊層。k24 ≥2 的原生倒影與煙／霓虹不適用條件照原碼記錄，不新增關層開關；固定原生測試時鐘／水動畫輸入可用，但不得裁切、遮罩、放大容差或停掉需驗圖層。
6. **獨立整幀閥與行人**：actual base 與 HEAD 只開本卡退路的全畫布日夜四向 8／8 逐位元相等；正常全狀態無閥。同時跑至少 17 個原生行人物理深度／遮擋案例、實際反例與恢復，不以測試旗標改渲染法。
7. **效能**：同環境 BASE／HEAD 40 組交錯取樣，比中位數與 p90，暖畫新烘焙數為零；真延遲負控制至少 30 筆並恢復再量。已知週期噪音依原生來源固定輸入，不為噪音另造追蹤基建。桌面 CI 不能聲稱實體手機／Safari／觸控已測。
8. **fp 範圍與來源**：相對 included-latest-main 只有 `bld` 新 40 葉，3463 舊 subs 完全相同；其餘家族、blocks、env 零變。只准逐位元提交這個最新 push CI `fp-rebake/` 原始兩檔；不可手改得分／時間／環境。列本卡前後 `bld` 七軸，若下降依第二波起連續授權披露，方向已完成表亦註明，不能藏下降。
9. **完整 CI 與審查**：分支及 PR 最後 head 原生煙霧各 3 次、fp 與既有財務 53 項／10 負控制全綠，無環境警告，不重跑賭綠。只新增 `wave029` 自己分支 workflow、`permissions: contents: read`，不部署／推送／寫其他對象；最後一次完整 run 綠並寫卡後，以「只刪自己 workflow」commit 移除，後續每個 commit 都確認沒有加回。Ready 後請新 Codex review，處理真實 findings；沒回覆／未執行不算通過。
10. **合併與數量**：最新 main 的方向／PR／CI／Pages／ancestry 再核，按三個權威來源最大號配 T／版本／日誌，卡片搬到 T 檔，更新完成表與待辦但保留 main 開關／方向。最後 CI 綠、規約允許才合自己 PR。核 merged tree、main CI 與自動 Pages 精確 SHA，開真網址；若代理仍 403，保留錯誤、未實看聲明及授權 CI 證據，不繞過。第三波 10 座只有真正合入 main 才記 3／20；之後繼續第 4 波直到 20 波或 §7 真實停手條件，普通步驟結束不算停手理由。

## §8 開工狀態與證據紀錄

- [x] 卡面單獨推送成功：[6de1bbe70e4f43fdb5807458c748839b534abebf](https://github.com/lijiabao1998/GlimmerTown-lab/commit/6de1bbe70e4f43fdb5807458c748839b534abebf)；該筆僅本卡一檔，parent 為上述主線，遠端 ref 已核；美術在該筆成功後才開始。
- [ ] 同種子對比／完整新舊檔：未跑。
- [ ] fp 與整幀閥：未跑；上述主線數字只作基準，不算本卡通過。
- [ ] 美術完整狀態與人工覆核：未畫／未跑。
- [ ] 新守衛真首紅及恢復：未跑。
- [ ] 分支／PR 最後煙霧 3 次與全 CI：未跑。
- [x] 所有尚未做的事如實標記，沒有宣稱建築已完成。

實體手機／Safari／觸控、人工逐張全部狀態在未實做前一直列未跑。遇 main／Pages 紅、連續兩項卡住、開啟兩個等業主／卡住 PR、越界／真批准不足等，按 AGENTS §7 精確記錄並停；本方向未跑守衛累積三張與普通 10 項上限不觸發停手。

## 施工來源檢查（尚未跑遊戲）

已新增十個獨立幾何作者、40 葉限定 adapter、第三輯目錄及自己的 CI 探針。純來源工具確認 89 個 inline script 都可解析，剝除本卡三段及安裝呼叫後與 `35be6a37:index.html` 逐位元相同；沒有本機遊戲／Chrome／fp／像素執行，以上不是本卡測試通過。

St Albans 已補讀 [HE 1103127](https://historicengland.org.uk/listing/the-list/list-entry/1103127)：四段逐漸收窄、燧石壁與石帶／交錯石角、四心入口／尖窗、鐘與雙聯 ogee 頂窗、城垛；博物館完工 1405 與舊名錄 1403–1412 日期記法不同，採中世紀鐘樓形制，不自行抹掉差異。其餘形制依上表名錄；來源媒體查詢亦保留為對照線索，沒有把照片貼作遊戲紋理。量體為 2×2 原生格的壓縮像素轉譯，非測繪複製。

已讀真實保存程式：`bl` 根陣列直接保存完整 `t.bld.v`，未作 byte 截斷；另有既存 `sig633` 使用低 8 位快取標記。本卡不修改它，≥256 的六款也必須通過實際付費、保存、undo／redo、旋轉與完整場景等原判準，不能只靠來源推定相容。首輪 CI／80 張原圖與所有正常守衛仍未跑，不宣稱完成第三波。

## 首輪 672c799 的真實 CI 結果與下一筆修正

[39051108621](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39051108621) 尚非綠燈。preview 實際完成十款／40 葉、十筆原生有費放置及八張場景，`prototypeOnly:false`；native 程式也已 GREEN（80 PNG、12 真負控制、三種子、十筆有費目錄點擊、兩輪全欄保存與逐款 undo／redo／退款／參照格拆除），正常獨立 BASE 配對與 40 組效能亦已 GREEN。這些 job 的 upload 階段因我把 `shots/wave029/` 誤寫成 `shots/wave039/` 而失敗，不稱整項成功。次筆只將自己的 workflow 名稱／附件目錄修正到實際輸出，原遊戲與判準不動；首輪預覽原始位元組已從 log 取回並逐 SHA 核實。

行人探針另有真正首紅：`ped029 opaque building occludes rear back stalbans/0`、`... roundhouse/0`；其餘案例及控制不能掩蓋這兩個失敗。下一筆保留原有 `overlap>0 && occludedChanged===0` 等全部判準、原位置挑選及渲染程式，只補原像素、選到的前後位置與實際 context 狀態的精確失敗輸出，先定位，不把猜測當修復。未釐清前不合併／發布。

首輪 fp 相對實際 base 新增 40／變更 0／移除 0，只有 `bld`，另外 165 族零變，七軸總分摘要沒有家族下降；倉庫基線尚未提交新圖所以指紋步驟預期紅。新基線將只取包含最新 main 的新 push 原始 CI 附件，核完全部範圍／七軸才提交。其餘尚在跑的工作不預填通過；進度仍 2／20 已發布。

## 12b928a：有數據的 fixture 定位；不改遊戲／判準

[39051426864](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39051426864) 的附件路徑已修好，preview／正常全欄配對／效能 job 已 success。行人仍在原兩例首紅，但精確輸出證明後方角色 `overlap:0`、`occludedChanged:0`，原生 draw 與 depth order 兩項均 true；根影像 alpha=1、smoothing=false、source-over、identity transform。St Albans 的角色畫在 x526.56、y375.08，窄樓主體沒有覆蓋該處；Round House 同樣沒有實際重疊。不能把這個無遮擋的採樣位置說成遊戲穿透，也不能刪掉 `overlap>0` 放它過關。

下一筆保留原八個周界位置與原候選順序，在其後追加固定 8×8、間距 0.25 原生 tile 的近距幾何點陣，仍先用原生前後深度篩選、再只依獨立直接烘焙的實體 alpha overlap 選位置；不看斷言是否通過來挑圖。原「真 draw／前後順序／非零重疊／零被遮擋像素變動」判準、17 案、兩個真負控制與恢復一字不放寬。只補測試輸入覆蓋窄小量體；渲染、模型、精靈、原角色、其他探針及原正常位置都不改。新取樣仍待 CI 證明，未寫成修好。

同筆把自己的只讀 baseline-evidence 附件命名對齊 `fp-<sha>`，內容仍為原有未改動 `fp.js` 的 `fp-rebake/` 原檔；將取這個新 push 產物，不提交任何自行重建／改寫時間的 JSON。12b928a 的原始產物目前只在庫外檢視：3463 舊葉完全不變、新 40 葉正好宣告範圍、其他 165 族及 blocks 1728／`5ef6eb67` 完全相同，統計的日夜非空數各正好 +40，無環境變動。

| bld 七軸（主線 → 此次實測） | 之前 | 之後 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.943236167834568 | 0.9446630781096588 |
| lightDir | 0.8280254777070064 | 0.8287971905179983 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.98605444921369 | 0.9865416911927687 |
| variants | 1 | 1 |

家族總分 0.9653 → 0.9657，無軸下降；這是已取得的 CI 數據，不代表行人守衛／最後 head／發布已完成。新圖來源與安裝遊戲位元組仍是 672c799 的同一份，較早預覽只作來源一致的實機預覽。

## d70f9db：行人原判準 GREEN；原始基線交付

[39051795766](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39051795766) 行人 job `117451723051` 實際 **17 案／0 失敗**，原兩例找到非零實體重疊：St Albans 後方 28 像素、Round House 16 像素，被遮擋部分改變均為 0；原 draw 與前後順序皆 true。兩個實際首紅與恢復仍成功。沒有改遊戲、遮罩、像素容差、斷言或用判準通過與否挑位置；只補近距幾何輸入。

同 head 的 native／preview／正常 BASE 配對／97 場景與效能 job 都實際 success；五個僅搬運既有場景的 data job 與常駐煙霧／財務尚未全完成時，不能稱最新整個 run 綠。本地已實看十款四向日夜接觸表、新舊對照及十款完整近景，記錄與逐檔 SHA 見 [visual-review.json](assets/GPT-029/visual-review.json)。全部 97 張未逐張人工覆核、公開頁與實體手機／Safari／觸控仍未實測。

本次將提交的新基線逐位元取自這個含最新 main 的 **push**：`d70f9db` → run **39051795766** → job **117451722824** → artifact **12107727517**，名稱 `fp-d70f9db18ed9d13eba46723f2866f5e231fb2a16`，ZIP SHA256 `27fd157008eb1a539252cab68ea714d348c2866421a7b3c65bc447d4128d8531`。它是本分支只讀 workflow 直接執行未改動 `fp.js` 的 `fp-rebake/`；摘要新 40／變 0／刪 0、只有 `bld`、其餘 165 族零變、無家族下降／env 警告，七軸如上。不是自己手算／改寫 JSON，也不把另一個 run 的時間貼進來。

- `fp.json`：382823 bytes，SHA256 `bacd8ad5970edd78bb4bc6cd51c1a4c2c1519cbac6134098d9c727d3b24ff6b8`。
- `style.json`：73168 bytes，SHA256 `f4bc84ea7c321ce05f2a4de6eef7bc3e393597dd7076ebb8064a8fd46ac4236f`。

舊 3463 葉逐物件全等，新增葉逐字正好 240–279，所有其他家族／環境／blocks 全等，統計中家族數不變、日夜非空數各 +40。來源 FP 的內部版本標籤承接既有基線，實際 ancestry 與本次程式來源以明列 git SHA 為準；完整版本字於合併步驟才配。第三波仍未合併、未部署，完成數維持 2／20。

## 提交基線前的完整結果（d70f9db）

自己的 12 個 job 已全部跑完：原生／預覽／配對／97 場景／行人／效能與五個純資料搬運 job 共 11 個 success；只剩 baseline-evidence 因舊基線不含本卡 40 葉而預期 failure，沒有重跑。常駐 push [39051795784](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39051795784) 煙霧三次成功、fp 同樣預期紅；財務結果是 **52 項 GREEN／10 個負控制**，唯一 failure 是 `scoped serialization, settlement, cadence and guard source integrity` 內「current renderer fingerprints match the committed baselines; see current-fp.txt，1 !== 0」。原探針把 `fp.js --check` 列為其中一項，因此尚未提交美術基線時它不可能報 53／10；沒有改動財務守衛或刪掉這一項，也不冒稱已 53／10。其餘金錢／完整保存／日結算／原生整幀／真正反例與恢復均已走完；原始報告 artifact `12108047929` 保留。提交上述原始基線後須等全新 head 的常駐與分支驗收，才開 PR。

## 圓頭窗的考據修正（只改本卡新圖；待新 CI）

最後逐款對回名錄時，確認本卡 `pane(...,'arch')` 沿用的近似與 `pointed` 都只有一個三角頂點；Royal Exchange、Faversham 等來源明確是 round-headed，不該畫成尖頂。此次只在自己的 029 幾何函式把 `arch` 分成「直窗梃＋12 段半圓頂」的真輪廓，`pointed` 保留原尖拱，`sash`／`mullion`／`ribbon` 與舊 027 等模組不動。不是換色，也不修改光向、全局調色或守衛。

先前 672c799／12b928a／d70f9db 的圖片、七軸與基線仍作真實歷史證據；`0bf10a9` 已原封提交那次基線，但它不是這個圓窗修正版的新基線。本次必須等自己的新 push 完整預覽／像素／保存／配對／遮擋／效能，再核相對最新 main 仍只有原宣告 40 葉，從新 CI 原附件取代基線，重新核實並覆看新原圖。十款 40 葉與首筆家族範圍、全部原驗收條件維持不變；不以舊 head 綠燈當新圖通過，也未合併或部署第三波。

## dd5d674：圓頭窗新版驗收與合法基線更新

[39076844632](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39076844632) 的原生／預覽／正常 BASE 配對／97 場景／17 行人／效能及五個純資料搬運 job 共 11 個 success；僅 baseline-evidence 預期紅。普通 push [39076844733](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39076844733) 的 fp 同紅：對已提交的舊圓窗基線有 12 葉變更，對應 `bld.24_1_` 的葉尾碼 `252,255,258,259,260,261,262,263,276,277,278,279`，只在本卡 240–279 宣告範圍，並有 `style.json` 的 `bld` 不一致。不是新增未宣告家族，不改斷言、門檻或重跑賭綠。

相對 actual main `35be6a37`，新 40／變 0／刪 0，3463 舊葉逐物件全等；其餘 165 家族、blocks 1728／`5ef6eb67` 與環境葉全等，日夜非空數各 +40。七軸：palette 1→1、hardEdge 0.943236167834568→0.9446630781096588、lightDir 0.8280254777070064→0.8287971905179983、shade 1→1、density 1→1、nightRule 0.98605444921369→0.9865421265088656、variants 1→1；總分 0.9653→0.9657，沒有下降。

此次 `fp.json`／`style.json` 逐位元來自上述含最新 main 的 dd5 **push** 原始 `fp-rebake/`，run **39076844632**、job **117525648867**、artifact **12117885317**（`fp-dd5d674000936e10e2cb4295b7d35904e68825ba`），ZIP SHA256 `ab37528f0c7c89d36a3ca35e231f6732ea00659b8c0d092f773cc3dbbd8646a6`。未手改 JSON 得分、時間或環境：

- fp：382823 bytes，SHA256 `4236cf342e39003b2674f99d529a9c164d00b7b556cd0324e20e15ac552be72d`。
- style：73168 bytes，SHA256 `e36dc20590d9fb11332b2363ff2e450c2650d60c1e2c47f5b203a4d7f4b663e4`。

已重新實看 dd5 十款完整近景、新舊比較、日夜接觸表，以及接觸表被裁到的第四視角逐款日夜原 PNG。原生 80 張各自完整；我發現自己的接觸表 canvas 寬 880、四欄卻用 260 間距，造成最後欄截短。因此同筆只把自己 `probeBritishWave029.cjs` 兩個接觸表 canvas 加寬為 1040；位置、模型、原生圖、判準都不變，等新 CI 重產完整接觸表再覆看。大場景 log 的一張 summer PNG SHA 不合已丟棄，未當原圖或聲稱實看；冬景與十款近景均 SHA 合，新版完整 97 場景附件仍保留。公開頁、實體手機／Safari／觸控與逐張全部 97 場景仍未驗，不假勾。

新版已實際通過 12 個目標首紅控制、三種子正常全欄配對、十款原生有費放置／各自 undo／redo／退款／參照格拆除、全保存兩輪；8／8 舊畫整幀閥逐位元相等，97 場景嚴格失敗 0、17 行人／兩個真負控制恢復、40 組 BASE／HEAD 交錯效能且暖畫新烘焙 0，30 筆真延遲控制首紅並恢復。這些 dd5 功能／像素證據不等於新基線提交後的最後 head 全綠，仍須等新 CI。第三波未合併、未部署，已發布仍 2／20。

## fa704ce：修復後完整全綠；開草稿 PR 前第 8 節自檢

最近實作 head `fa704ce0f03ed109ca924d94fe40935a5b5d3443`：常駐 push [39077425521](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39077425521) 三個 job 全 success（smoke 三次、fp、財務）；財務 job `117527373895` 原報告為 `{"ok":true,"checks":53,"negative":10,"failures":[]}`。自己的 [39077425528](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39077425528) 十二個 job 全 success。沒有按 rerun；前述紅燈由提交最新原始基線修復，新 head 實際再驗。

fp job `117527373823` 原摘要：「相對 base：新增 40／變更 0／移除 0，觸及家族 1」「與 fp.json 相比：新增 0／變更 0／移除 0，觸及家族 0（其餘 166 族零變動）」「風格分相對 base：沒有家族下降」「葉子、超街區指紋、棘輪、style.json 全部零變動」。沒有 envLeaves 警告；actual base git 仍為 `35be6a37`，JSON 內舊版本標籤依原始 CI 保留，不能手改。

已實看原始 1040×2400 完整四欄日／夜／新舊對照三表；來源 fa704ce、index SHA256 `03109333eee1b65859fba2eb4a409ee72cb5f23026705c4fc128effa5a97e124`，與 dd5 遊戲及新圖來源逐位元相同。第四欄現在完整。80 張與三表的[原圖附件](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39077425528/artifacts/12117546477)、[完整 97 場景附件](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39077425528/artifacts/12117911258)均已保留；逐 SHA 記錄見 [visual-review.json](assets/GPT-029/visual-review.json)。

- [x] 動手前卡面已單獨推送；首筆只有 `bld`，家族與原驗收條件未改鬆。
- [x] 三種子／三檢查點的正常獨立 BASE 全欄配對，十款真實有費交易、全部保存欄位新舊檔兩輪已驗；只容許宣告外觀 `b.v` 與精確版本遷移差，不剔除通知／region 等欄位。
- [x] fp 只新增宣告 `bld` 40 葉；其餘舊葉／165 族／環境／街區零變；8／8 日夜四向獨立整幀閥逐位元相同。
- [ ] 美術人工逐張全部 97 狀態未完成；CI 已涵蓋 57 狀態＋40 邊界且嚴格失敗 0，已人工看十款全部四向日夜、新舊比較、十款完整近景及冬雪場景。按 AGENTS §3 允許的此一人工覆核例外如實列未跑，實體手機／Safari／觸控亦未測；不假勾。
- [x] 每條本卡新守衛已用真像素／合法原生來源或金錢／保存 API 反例證明首紅，並同判準恢復；含 12 原生控制、場景及整幀控制、17 行人／兩控制、暖烘焙與 30 筆真延遲控制。
- [x] 上述最新實作 head 的原生 smoke 三次、fp、財務 53／10及自己的十二 job 全綠，不靠重跑。
- [x] 未跑、代理 403、公站未實看、未發布與剩餘 review／版本／workflow 刪除門檻均已明列，沒有把文件或預覽計入完成波次。

本筆僅把已取得的實際結果／原圖覆核記回文件，不改任何遊戲或判準。草稿 PR 開立後才依最新 main 配 T／三處版本字／日誌，版本後仍需完整原生驗收；自己的 workflow 最後一次整個 run 綠才以獨立刪除 commit 移掉，後續每一筆均確認不加回，Ready 後請新的 Codex review。第三波仍未發布，2／20不變。

## PR37 合併準備（尚未發布）

[草稿 PR37](https://github.com/lijiabao1998/GlimmerTown-lab/pull/37) 建立於實作 fa704ce 的常駐三 job 與專屬十二 job 全綠之後。配號前再次核對遠端 main `35be6a37`、方向「運行」、只有本 PR 開啟、main smoke `39049008748` 與自動 Pages `39049461383` 最新完成均 success。main 的 docs/T 檔名、AUTORUN-LOG 及 git log 標題最大號皆為 T754，真正 `## rN` 標頭最大為 r201，因此本 PR 預備 **T755／r202／v14.48**；只改三處原版本字，日誌 commit 欄固定 `#37`，卡保留原 GPT-029／首筆家族證據。方向完成列的 3／20只在本 PR 真正合入 main 時生效。

本筆不改模型、圖、判準或原始 CI 基線，先保留自己的只讀 workflow，等 v14.48／T755 新 push 的完整驗收成功後才記最後成功 run 並獨立刪除。配對探針依首卡凍結方式，只將獨立 BASE 的三處版本字輸入與宣告 release 對齊，輸出全欄仍原判準；真實舊版本存檔遷移另用未改 actual base 驗，不能剔除 region／通知或任意正規化輸出。最終 CI、review、合併、main／自動 Pages 均未預填通過。
