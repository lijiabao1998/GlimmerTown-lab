# T765／v14.58 第11波：十款原創英式建築（原GPT-039）

狀態：C7發布驗收全部成功，待純刪workflow後最後CI／合併／公站；目前正式仍main8fd1d5e0／T764／v14.57、10波100座。只有PR47合入、main CI與既有自動Pages成功且公站精確核實後，才計第11波110座。

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
- 原PNG已放docs/assets/GPT-039，三個公開GitHub圖頁已核可讀；作者已看3接觸表／十款近景。另以CI同run附件匯出80張原生精靈及完整供電manifest，匯出不執行renderer。C7 fb8cd7be的完整原生27工作、push及PR煙霧3／fp／財務全部成功；80張原圖已逐張實看。最後純刪workflow CI與主線／公站仍待。

## 第8節逐條核對

- [x] 7a406fda首卡在模型前推送，原條件前綴／唯一bld未改。
- [x] C7完整原生付費建造／選取／undo／redo／存讀與首紅控制成功；三種子BASE／HEAD配對、兩次舊存檔全欄位完全相同。
- [x] C7 fp與提交基線零差，僅宣告bld新增40葉；8組BASE／valve全畫布逐位相同，單像素破壞負例確實首紅。
- [ ] 人工尚未全看每張日夜／四季／遠景／邊緣／疊層，按AGENTS §3保留這一人工例外。CI已通過57場景、40邊緣及17行人案例；作者實看80四向日夜、3接觸表、10近景、街景、夏景、雪景，細表見GPT-039-author-visual-review.json。
- [x] C7原始守衛未變，發布來源4個標籤負例＋11來源／metadata／基線負例、財務10負例、真實交通相位與窗光移除負例全部首紅並精確恢復。
- [x] C7發布head煙霧3／fp／財務53＋10全綠（push40077064402、PR40077067128），無重跑賭綠。刪workflow後最後head及main／Pages尚待，並未宣稱發布。
- [x] 本卡未把尚未執行的發布驗收寫成通過。

限制：實體手機／Safari／觸控未測；全部275供電原圖尚未逐張人工審閱（160案例／1920相位見證及完整manifest已另行解析核實），不冒稱已獨立圖審。未合併、未部署。

## C7精確證據（2026-10-24 UTC）

- [原生27／27](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077064339)、[push](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077064402)、[PR](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40077067128)，完整artifact ID／digest見GPT-039-release-acceptance.json。
- 供電on／road-cut／source-off／restored各40＝160案例；正常／移燈／恢復共1920相位見證。供電及恢復可見窗光38..952像素，兩斷電態全0；交通擾動負例226像素變化、恢復精確相等。未指派供電真值、不排除存檔欄位、fixture未進production。這項是完整整波驗收中的供電補驗，不冒稱它單獨代表整波。
- 效能：同runner交錯各40樣本，BASE median15.6ms／p90 26.55ms；HEAD median2.9ms／p90 27.275ms，保暖繪圖新增幾何0。30樣本74ms注入確實首紅，移除後恢復綠。不外推真機效能。
- 公站驗收工作仍刻意核實正式T764／14.57及完整舊index SHA，證明候選尚未提前上線；合入後必須另核T765與發布index，不能將此工作誤報新版本已發布。
