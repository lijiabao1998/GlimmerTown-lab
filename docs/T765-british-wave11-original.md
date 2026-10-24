# T765／v14.58 第11波：十款原創英式建築（原GPT-039）

狀態：發布準備；目前正式仍main8fd1d5e0／T764／v14.57、10波100座。只有PR47合入、main CI與既有自動Pages成功且公站精確核實後，才計第11波110座。

## 範圍與不可變驗收

原創凍結卡於7a406fda先推，唯一家族bld、新增560..599四十葉；舊照片方案取代後留作歷史。本T卡引用原創卡全部條件，不更改或放寬；生產只增加原創外觀，使用原生k24／2×2／Lv1／$2000，不改供電、價格、存檔或模擬。

- 蕨庭閱覽屋／Bracken Fold Reading House：L形低層磚木量體、兩條不等高交叉山牆、五面凸窗、內角退縮門廊、成組煙囪。
- 銅溪蕨室／Copperbrook Fern Court：兩座不等高六角玻璃館、斜向低廊、尖形分片玻璃頂、放射窗梃。
- 鴉木會館／Rookwood Lantern Hall：錯位T形會館、兩端截角山牆、短高側窗帶、背面半圓後殿與成組圓拱窗。
- 石褶交易亭／Cobblefold Exchange Pavilion：三角開放拱廊、三片折板石板屋面、偏置三角採光亭、低矮售亭。
- 苔門展亭／Mossgate Ticket Lodge：不等高石門樓、真正貫通的尖拱通道、凹脊連頂、一高一低異形塔帽。
- 果巷工藝館／Orchardcross Workshop：三條短鋸齒採光頂、低磚長屋、圓形樓梯鼓筒與扇形窗。
- 芬澤船屋展亭／Pennyfen Boathouse Pavilion：上揚倒船底曲屋頂、露木桁架與大窗、偏置石階門房、低側翼。
- 柳澤樂亭／Willowmere Music Lodge：折轉V形兩翼、內低外高蝴蝶谷頂、交錯高低簷、深色木窗屏。
- 山楂織屋／Hawthorn Loom House：兩端磚基房托起木構跨院樓、複折馬廄頂、偏置小坡頂老虎窗、菱形高窗。
- 荊井瞭望屋／Briarwell Beacon House：收分六角木瞭望室、外繞台階與護欄、雙層矮帽、低弓頂附房。

## 真實候選驗收

- C6 dae4595f原生40073360079首次21／21、push40073360142煙霧3次／fp零差／財務53＋10、PR40073363620四工作全部成功。首紅790ad112保留：public附件路徑錯誤及待基線導致財務來源完整性紅，本次均已精確修復。
- fp／style原封取同一次官方producer790ad112／run40030610173／job120677661492；舊3783葉／其他165家族／block／env不變，新增恰40宣告葉，兩原檔SHA詳GPT-039-raw-CI-baseline-adoption.json，不手改generatedAt／version／任何分數。
- bld七軸：palette 1→1；hardEdge 0.9529472614093789→0.9537353338914052；lightDir 0.8195912614517266→0.8176833447566827；shade 1→1；density 1→1；nightRule 0.9891894285953→0.9894837454988741；variants 1→1；total 0.966→0.9658。依AGENTS §7第二項起連續授權披露，不改全局光照。

## 發布來源與仍待完成

- 本次只將三處版本標籤改為T765／14.58，共4個ASCII byte，逆證回C6完整index SHA 532e4782af3a703e66428e8a1892756a2fa8a38a39fca4e7408ab06606397fd8；發布index SHA 378eba7af7c2cdff7e2cd1cb02ef0ba1ea219c921260a622be5bf35d200e9fb3。
- 保留原候選所有守衛原文；新增release來源核對只允許三標籤，以及日誌插入r212段／方向表第11波狀態及下一項。舊正文與既有遊戲碼嚴格不變；新增錯標籤、額外HTML及metadata破壞負例。
- 供電release wrapper僅將BASE也換成相同明示版本標籤，完整存檔／160案例／275PNG／全畫布比較與交通、窗光負控的主體逐byte相同，production不含fixture。
- 原PNG已放docs/assets/GPT-039，三個公開GitHub圖頁已核可讀；作者已看3接觸表／十款近景。另以CI同run附件匯出80張原生精靈及完整供電manifest，匯出不執行renderer。新head的完整驗收、80原圖實看、最後純刪workflow CI與主線／公站仍待。

## 第8節逐條核對

- [x] 7a406fda首卡在模型前推送，原條件前綴／唯一bld未改。
- [x] C6完整原生、三種子配對與舊新檔守衛工作成功；發布head仍需完整重驗。
- [x] C6 fp零差、原生全幀與負控制工作成功；發布head仍需完整重驗。
- [ ] 發布head日夜／季節／四向／遠景／邊緣／疊層驗證與實際原圖審閱。
- [ ] 發布來源標籤／日誌負控制及完整原生負控制。
- [ ] 發布head煙霧3／fp／財務、刪workflow後最後head與main／Pages綠。
- [x] 本卡未把尚未執行的發布驗收寫成通過。

限制：實體手機／Safari／觸控未測；全部275供電原圖尚未逐張人工審閱，不冒稱已獨立圖審。未合併、未部署。
