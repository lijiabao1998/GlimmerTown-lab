# GPT-029：第三波十座有考據的英式街鎮建築

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
