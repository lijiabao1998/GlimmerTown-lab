# GPT-025 — 第一波：十座不同形制的英式建築（20 波之 1）

## 授權與本輪邊界

業主 2026-10-16 原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」
方向已由 PR #31 合入 main：98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e。使用者另要求真實英式考據、不和現有款式重複、量體高低胖瘦、窗型與屋頂有結構差異，不准只換色。

這是第一波十座的施工卡，先單獨提交，再寫實作；卡片與盤點不算完成建築。分支：`gpt/british-wave01-025`；基底：`98545ff4e28a86a6da4e2a2cbdad5f5cb7f0637e`。第一波最後開 `[等業主][GPT-025]` PR、附真 Chrome 原始樣張與證據；12 小時從這個美術 PR 建立時算起，絕不從方向 PR #31 算起。業主否決或要求修改先處理；滿時且未否決也仍須符合 AGENTS 第 3、7 節其餘合併條件。

## 第一筆不可變的 fp 家族與葉子範圍

**要動的 fp 家族：`bld`。**
**只新增 40 葉：`bld.24_1_160` 至 `bld.24_1_199`，十座各四個真幾何視角。**
既有 3383 葉與其他 165 家族、`use021`、完整 1728 組超街區均須零變動；不能刪葉或換掉舊圖。沒有新家族，不改環境葉子。首筆家族清單永不改；需要超出此清單就標卡住另開項，不放寬。

## 開工盤點／基線

- 已讀 main 的 AGENTS、AUTORUN、CLAUDE、DECISIONS 與《迭代不改壞標準》。T750 只新增無上限方向的條件，本方向仍是明列 20 波。
- Claude 最新工作是 T750 規則更新；開工檢查沒有其他開放 PR。上一批 T748 十五座不計入本輪，也不重畫。
- main 最近真正完成的 smoke（含 fp）為 success：[38830704770](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38830704770)；Pages 為 success：[38830909594](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38830909594)，均對應 870bc47，其後 main 只改文件。
- 基線 fp：166 家族、3383 葉；bld 1019 葉、總分 0.9655。七軸：palette 1、hardEdge 0.9401793735989233、lightDir 0.8331697742885181、shade 1、density 1、nightRule 0.9849646130528745、variants 1。這是讀取已提交基線，不冒稱本機執行測試。
- 候選名稱已在現有 index、英式來源檔與 docs 搜尋，十名無命中。實作還須比對結構與實際精靈，名稱不同本身不算不重複的證明。
- Git CLI 直連 origin 仍回 CONNECT tunnel failed, response 403；使用既有雲端 GitHub 連線同步，Git 物件逐一核對 SHA。無使用者電腦、Town 或玩家存檔操作。

## 十座設計與一手考據（原創等距幾何轉譯）

| 原生 v | 原型／中文名 | 本輪必須可讀的結構差異 | 一手來源 |
|---|---|---|---|
| 160 | A la Ronde／阿拉隆德十六角屋 | 16 邊低矮環形屋體、菱形窗與分面坡屋頂；不是 Orford 多邊形高塔 | [National Trust](https://www.nationaltrust.org.uk/visit/devon/a-la-ronde/things-to-see-and-do-at-a-la-ronde-house) |
| 164 | Dunster Yarn Market／鄧斯特紗市亭 | 八角開放木柱市場、中央石柱、八個小山牆窗與中央木燈亭；非實心塔 | [Historic England 1173428](https://historicengland.org.uk/listing/the-list/list-entry/1173428) |
| 168 | Tattershall Great Tower／塔特舍爾大塔 | 高窄紅磚主塔、四角凸出塔體、石框大窗與城垛平屋頂；不複製白塔或 Orford 三塔 | [National Trust](https://www.nationaltrust.org.uk/visit/nottinghamshire-lincolnshire/tattershall-castle/the-history-of-tattershall-castle) |
| 172 | Hardwick Hall／哈德威克廳 | 寬闊三層玻璃石宅、六個突出塔樓、上層更高的大窗與平頂女兒牆；不是 Kew 三個荷蘭山牆 | [National Trust](https://www.nationaltrust.org.uk/visit/peak-district-derbyshire/hardwick/discover-hardwick-hall) |
| 176 | Stokesay Castle／斯托克賽堡 | 長石造大廳、不同高度的南北塔與獨立木構門樓；長廳屋脊與塔體有真實深度差 | [English Heritage](https://www.english-heritage.org.uk/visit/places/stokesay-castle/history-and-stories/history/) |
| 180 | Chiswick House／奇西克別墅 | 方形主體、六柱前廊、分叉外階與八角穹頂；不做成現有圓形圖書館塔 | [English Heritage](https://www.english-heritage.org.uk/visit/places/chiswick-house/history/) |
| 184 | Cragside／克拉格賽德 | 不對稱分期石造量體、交錯高低山牆、凸出塔／煙囪與嵌窗；不套一般小屋 | [National Trust](https://www.nationaltrust.org.uk/visit/north-east/cragside/history-of-cragside) |
| 188 | The Homewood／霍姆伍德現代別墅 | 白色水平樓翼架在細柱上、較小磚造底層、帶狀窗與平屋頂懸挑；不用 De La Warr 的圓弧玻璃樓梯體 | [National Trust](https://www.nationaltrust.org.uk/visit/surrey/the-homewood/explore-the-homewood) |
| 192 | Cardington Hangar 2／卡丁頓飛船棚 | 高而寬的鋼構大棚、長向屋頂與檐下扶壁、大片入口滑門；和五層 Flaxmill 的磚窗列不同 | [現場營運者 Cardington Studios（含外觀、平面與屋高資料）](https://www.cardingtonstudios.com/) |
| 196 | Willington Dovecote／威靈頓鴿舍 | 厚實低石牆、階梯山牆、屋頂百葉入口與少量小開口；不是玻璃房或穀倉換色 | [National Trust](https://www.nationaltrust.org.uk/visit/essex-bedfordshire-hertfordshire/willington-dovecote-and-stables/visiting-willington-dovecote-and-stables) |

一手資料在實作前實讀；其中 Cardington 是現場營運者資料，其餘是管理／保育機構。保留可辨形制，並非等比例精密復原；不下載、描摹照片，不以資料來源替代原創幾何。來源連結提供玩家查閱。

## 實作範圍與禁區

純美術：十座都沿用既有原生 landmark（k24、2×2）的價格、解鎖、就業／觀光、維護、水電、放置／拆除、undo／redo 與存檔欄位。不增加實際城市建築數量與密度、不改模擬公式或 RNG 消耗。成功原生放置後只指定既有 b.v 外觀欄；棚、鴿舍等是歷史建築展示，沒有新航空、飼養或生產服務。

新增獨立純幾何來源、精確內嵌工具與窄範圍 UI／安裝 adapter。共用 rasterizer／材質、fp.js、harness.js、gallery.js、既有守衛與 pins、規則檔完全不改；smoke 只能新增自檢。新效果有 `window.__noBritishWave025`，可立即回到原地標並阻止新特殊選擇。不能藉測試閥證明正常路徑沒壞。

本機只做源碼／語法與差異檢查；遊戲、Chrome、像素量測只在 GitHub 雲端 CI。專屬 workflow 只綁自己分支、contents:read、不部署或寫遠端，最後綠後移除。fp.json／style.json 只能依規約逐位元提交該次 CI 原始附件，不手改。發布時才處理 T／版本／日誌，本卡先不佔 T 號。

## 動手前固定驗收（不事後改鬆）

1. 十座、40 張實際安裝精靈，真四向世界幾何；十個去共同地坪的 alpha 結構遮罩互不相同，另檢查與既有形制的差別。窗型、屋頂、平面與高低寬瘦依上表，禁止換色／翻轉貼圖充數。新 SPR 逐位元等於獨立幾何直接烘焙。
2. 全部四向像素皆硬邊、無半透明、無裁切；夜光只在可見實體窗或燈上；原生 w／h／ax／ay／sz 正確，不越出2×2地基。光向跟相機旋轉，不綁死世界軸。
3. CI「相對 base」精確只新增 bld.24_1_160…199；既有3383葉、其他家族與完整blocks零變。bld家族總分不得下降才可按第3節合；各軸前後照實列，不另加「每軸不降」條件。下降則交業主，不暗改基線或尺。
4. 真實目錄點擊十項、原生合法有費放置、鎖定時拒絕；有限錢扣款等於原生預覽；原地標／T748目錄仍可用，選擇互不污染。三個同種子新舊配對結果相同（僅新增外觀欄值不同），RNG與模型不改。
5. 真正 save→load→save→load 保留十項外觀與原生資料；undo／redo／參照格拆除完整。既有存檔欄位不增不刪、不改兼容判準。
6. 真Chrome原始圖及接觸表：白天／夜晚、四向、冬季有雪／無雪、春夏秋、遠景、地圖邊緣，及施工／懸停／倒影／行人／煙／夜燈／招牌等疊層。沒跑或不適用要逐項說明理由，不能把單張精靈當成全場景覆蓋。逃生閥關閉時與基底原地標場景整幀逐位相同。
7. 每個新守衛有有意改壞的活體／合法源碼負控制，首紅必須落在目標；恢復後回綠，不靠放寬。普通煙霧三次及fp最後commit全綠，有明確run連結；新建築原圖必須肉眼看。
8. 第一波 `[等業主]` PR 必須附卡面第一筆、原始圖／雲端驗證／前後七軸與未跑事項；開滿12小時且業主未否決才按其他合併門檻處理。合併後才核對該版main煙霧與Pages並看真網址，絕不手動觸發Pages。

## 回滾

未合併前：只在自己的分支追加修正，不改寫已推歷史。施工失敗先保留原因；若main因本PR出紅，依AGENTS第7節暫停方向及另開純revert PR，不擅自帶紅續行。逃生閥只是即時退圖，不當作發布驗收通過。

## 收工自檢（部分完成，尚未具備合併條件）

- [x] 卡面在動手前推上去，固定驗收未改鬆（首筆5d1b17b）
- [ ] 同種子配對與存檔來回的真實結果
- [ ] fp只有宣告家族；閥關整幀等值
- [ ] 各狀態與疊層原始樣張與肉眼檢查
- [ ] 每條新守衛的首紅負控制
- [ ] smoke三次及fp最後commit全綠
- [x] 沒有未跑卻寫通過；下方逐項區分已跑、失敗與待補

## 施工紀錄／沒做成的事

2026-10-16：本次只是先推卡面與不可變家族宣告。產品、美術、守衛與樣張尚未實作；測試尚未執行；十座完成數0。Git CLI直連403，使用雲端GitHub連線。執行環境曾短暫transport disconnected，後續pwd實測成功；不把恢復請求當恢復證據。

2026-10-16施工續記：`aa28275743bc74901aaa89b372de0bc30cd7b6d1` 已加入十座純幾何作者、原生k24外觀接入、目錄、自檢與雲端探針；不等於已發布。第一輪探針在「找不到合法地塊」失敗，沒有圖片產物，未冒稱通過。原生新城只有$3000，預覽的ok同時要求有足夠資金；十次有費放置需$20000。`653ccb6f102c47c27ac529c1be807ad529a9dd8f` 改為既有QA介面設定有限$1000000、難度1、僅unlockAll，未啟用unlimitedMoney、不改任何產品價格／費用／合法地塊規則；同時在放置前保存圖片，避免後續失敗遺失證據。

### 已取得的雲端證據

- [原生驗證run 38881795344](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38881795344/job/116910033269)：native步驟成功。十個實際目錄按鈕、每項原生有限錢扣款$2000、三組seed31／71／103新舊配對相同、兩次save/load保留外觀、原地標／T748選擇互斥、undo／redo／參照格拆除均已執行。不是完整舊存檔全欄位兼容證明。
- 同run的七個活體首紅負控制均命中並恢復回綠：缺葉、錯尺寸、透明天空漏夜光、半透明像素、裁切、作者同幾何、實際SPR複製。旋轉與費用等額外負控制仍待補，不把七個說成全部。
- [最初提交煙霧run](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38880647747/job/116906289039)三次全綠；新基線提交之後仍須重新等最後head的煙霧與fp。
- 實際SPR的40葉／80張原始日夜PNG在[原生附件](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38881795344/artifacts/12037802788)。[日接觸表](../assets/GPT-025/contact-day.png)、[夜接觸表](../assets/GPT-025/contact-night.png)、[原始manifest](../assets/GPT-025/manifest.json)為該run原始位元，沒有重畫或合成替代產品精靈；夜接觸表是0.25日圖＋實體夜光的標示預覽，不冒稱遊戲整幀。
- 已肉眼看40個四向日圖及40個夜光預覽：低16角屋、開放8角市亭、高磚四角塔、六塔玻璃廳、雙塔石廳與木門樓、柱廊穹頂方宅、不對稱高低山牆、懸挑L形現代宅、鋼棚扶壁滑門、低石鴿舍形制各異。仍需完整遊戲場景和既有近似款的對照，不僅憑名稱不同認定不重複。

### CI基線來源與七軸

取自push事件、包含當時最新main98545ff的run `38881795344`，附件[`fp-653ccb6…`](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38881795344/artifacts/12038420680)。摘要：相對base新增40／變更0／移除0，只觸及`bld`，其餘165族零變動；完整1728超街區CRC `5ef6eb67` 不變；風格分相對base沒有家族下降；沒有envLeaves警告。

此run整體仍紅：fp讀到舊基線，正確拒絕新增bld與style不匹配。核對通過家族與總分門檻後，才逐位元提交同run的fp-rebake兩檔，絕不改守衛或手算基線。附件直連在雲端回CONNECT403，改從同job輸出的原檔base64取回；輸出和附件讀同一檔，長度與SHA-256均核對。

| 指標 | base | 本次CI |
|---|---:|---:|
| bld葉數 | 1019 | 1059 |
| palette | 1 | 1 |
| hardEdge | 0.9401793735989233 | 0.9418075743690124 |
| lightDir | 0.8331697742885181 | 0.8309726156751652 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9849646130528745 | 0.9855290093864981 |
| variants | 1 | 1 |
| 家族總分 | 0.9655 | 0.9655 |

lightDir單軸下降，已照實列出；家族總分不降。不把總分持平寫成所有軸改善。

原檔SHA-256：fp.json `4ca0d1b2ee431830ea57c7c404e4e67c76aeaa9900998dccf9994bb8dbf1004b`；style.json `fbdf1524dd0453426ca22c297ec50463bc3f6adebd8a2a83ba399b804665aec3`。日接觸表 `19dd0d80d2c4423456522e2b297ded7e36bfdb40f1f88d9e6a7957450f331cae`；夜接觸表 `c7cf28b9a7c2eb796781bac866cfb648c8213d5976ead02ccad723cbab5ea872`。

### 沒做成／仍待補

完整季節／有無雪／遠景／邊緣／施工／懸停等遊戲場景、整幀base／逃生閥等值、完整舊存檔全欄位往返、旋轉與費用等額外首紅負控制仍待補。分支專屬workflow尚未最後全綠及移除；最後head的smoke三次與fp尚未綠；未配T號／版本／main日誌、未合併、未部署，完成波數仍為0／20。先開附實際圖片的`[等業主]`草稿供看第一項，再完成合併條件；PR未開滿12小時不自行合併。
