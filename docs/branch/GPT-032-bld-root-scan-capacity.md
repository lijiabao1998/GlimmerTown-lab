# GPT-032：修復bld根物件超過1200鍵時整族失去指紋覆蓋

## 動手前卡面／範圍

- 分支 `gpt/bld-fingerprint-capacity-032`，從最新main `38a27743e9708517d88e251a005c3475fff1bbe7` 開；v14.49／T756／r203。先單獨推本卡，之後才寫修補，不佔T號、不改發布標籤。
- 第一個commit宣告要動的fp家族：**無**。不新增或修改美術、SPR、調色板、遊戲放置／模擬、RNG、存檔格式或網站功能；fp.json／style.json保持main原檔，不重烘。
- 問題直接擋住業主「每波10座、共20波」的第五波：[PR39](https://github.com/lijiabao1998/GlimmerTown-lab/pull/39)在[常規CI39097227274](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39097227274/job/117586078640)報「新增0／變更0／移除1179，觸及bld」；第五波SPR實際1179+40=1219鍵，但原有fp／sheet／style掃描器遇到物件超過1200鍵就整個return。不能提交那份丟失全部bld的基線。
- main現況：166家族、3543subs、bld1179、blocks1728／CRC5ef6eb67，bld總分0.9656。main [39094112934](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094112934)與[自動Pages39094482136](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39094482136)同一38a2774成功，方向運行。遠端只有自己第五波卡住PR，沒有其他工作被覆蓋。
- **明列容量界限變更**：只對真正的 `SPR.bld` 根物件、depth0且路徑為bld，將遍歷容量從1200放寬到2000；其他根物件、bld子物件仍1200，深度3和既有葉型規約不改。這是修改共用守衛的容量，必須獨立審查，不冒稱未改守衛。現在4波已發布，餘16波每波40向，1179+16×40=1819，2000為有界容量，非無限掃描。
- 只改index.html四個現有遍歷入口的容量條件，另新增一個自檢並掛smoke；不改fp.js、harness、gallery、既有smoke斷言、probe判準、規則、pins或Pages。自己的臨時workflow只綁本分支、contents:read，不部署、不推送。
- 依AGENTS第3節「不准自己合的PR」之共用守衛限制，本卡開 **[等業主]** 草稿PR；GPT不自行合併或部署。與PR39合計兩個卡住／等業主PR後停止開新題，等業主／main寫入者處理。

## 凍結驗收（本卡首推之前寫；不改鬆）

1. 本卡單檔單commit先推；修補只改四個明確的容量條件與新增自己的自檢出口。反向還原這些已宣告改動後index逐位元等於38a2774；smoke只新增一條，所有其他舊斷言與美術來源不動。
2. 真Chrome、GitHub Actions、slot3：原main1179葉下，fp／sheet／style三出口的bld葉與完整舊像素逐位元不變；新自檢不修改遊戲世界、localStorage、既有SPR物件或畫布。
3. 用PR39精確head `1f31a32bab664c2e02e825532f33dbc7d46a89c7` 的原創幾何，在隔離CI登錄真實40個精靈，得到1219鍵：原始BASE的三出口必須真實復現丟失bld／首紅；HEAD三出口必須全枚舉1219，3543個舊subs及其他族像素不變，四十向確實存在。測試改動與實際遊戲分開，測完完整還原，不將測試精靈寫入正式產品。
4. 有界容量案例：bld根1200、1201、1219、1819、2000都能完整讀；2001仍拒絕整個過大物件。其他根物件1201、bld子物件1201仍照原規約跳過；不是改字串或永假assert，必須改真實registry輸入並用相同實際出口檢查。
5. 新自檢必須有真反例首紅與同判準恢復。保留原始BASE、HEAD兩端結果、實際容量、來源SHA、全部失敗，不刪欄或修改既有比較判準。
6. 常規push與PR最後head各smoke實數3次、fp零變動且style一致、無env警告，既有財務53項／10負控制綠；不靠重跑賭過，不提交fp/style新基線。
7. 自己只讀workflow最後完整run成功並附卡後，以獨立只刪workflow的commit移除；最終.github差異零，刪後不加回。最終精確head請新的Codex程式及安全審查，處理真findings；沒有執行不稱通過。
8. 不自行合併。卡／PR如實標記「共用守衛容量1200→2000」的範圍、未跑事項與審查狀態，等業主或main寫入者處理；第五波未完成，不因這項修補文件而改已完成波數。

## §8 開工自檢與沒做成的事

- [x] 卡面單檔已先推：[b465e379fe66f13a7ecf556618b96a24077aefb9](https://github.com/lijiabao1998/GlimmerTown-lab/commit/b465e379fe66f13a7ecf556618b96a24077aefb9)，parent為38a2774；成功之後才寫本修補。
- [ ] 原生容量探針、常規CI、負控制及新審查未跑，不宣稱通過。
- [ ] 本卡不做模擬或存檔變更；但仍須實測新自檢不改世界及存儲。
- [ ] 美術狀態／整幀比較：不適用於只讀掃描邏輯，所有美術／遊戲來源須靜態逐位元未變，現有fp還須實際零差異。
- [ ] 本機只做Git與靜態語法檢查，所有遊戲／Chrome／像素執行由GitHub Actions完成。
- [ ] 不合併部署，不以計畫當已修復。


## 實作備妥（只做靜態檢查；待雲端）

四個條件分別在原生fp、原生sheet、style及後置fp／sheet共用walkSpr；只對v===SPR.bld、depth0、path===bld且鍵數≤2000給根物件容量例外。所有其他1200界限與深度原樣。新增自檢只讀世界／儲存與三實際出口；smoke只新增本卡自檢。

獨立探針先開原始38a2774，再開修補HEAD，都在CI臨時登錄PR39精確1f31a32的真實40向幾何；BASE三出口需各真首紅，HEAD讀滿1219並比所有舊指紋／風格葉和舊日夜sheet原始PNG序列。另測1200／1201／1219／1819／2000／2001、非bld根1201及子物件1201，實際API丟葉負控制與恢復。不將測試精靈或dummy帶入正式遊戲。

反向還原四個條件並移除自己的明確自檢標記後，index逐位元等於38a2774；90個inline blocks及新增JS僅做語法解析。所有實際遊戲、反例、容量、世界／儲存、CI數字未跑，不宣稱通過。不自行合併。


## 原生容量驗收已完成（最後產品來源37e9e34）

- [完整唯讀run39098124736](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39098124736)已completed/success，精確head `37e9e34c8f7ee58d016b307e675529ea17cf7db1`；[native job117588687668](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39098124736/job/117588687668)。原始完整manifest在[artifact12126010154](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39098124736/artifacts/12126010154)，本卡assets另保留原始CI console summary的JSON值，不冒稱fp基線。
- 獨立原始main在登錄PR39的40原生向後，SPR鍵數1219，fp／sheet／style皆0；三個各自首紅分別 `capacity032 fp complete bld real wave05 expected1219 actual0`、sheet及style相同目標。
- HEAD登錄同一40向後，三出口皆1219，新增路徑恰為320–359共40葉，舊完整fingerprint／style與獨立BASE相同，舊日夜sheet PNG序列的SHA256均為 `b3687abea55a39f51e252277692d653d409771d3e4ca696d3bd6bdcf0ec4e4ee`。這是容量修補的隔離試驗，不是第五波完整守衛通過或已發布。
- 真實根物件1200、1201、1219、1819、2000三出口全部完整；2001三者仍0。其他根1201及bld子物件1201仍按原界限跳過。八類容量案例實際通過。
- 真正公共sheet API刪去一葉時，新自檢第二項首紅 `capacity032 sheet covers the bounded bld registry ✗`，恢復原API後同判準綠；不是永假assert。世界及localStorage均未變，slot3，原registry物件與既有canvas參照完整還原。
- [push fp117588687699](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39098124718/job/117588687699)已success：166家族／3543葉；相對base及倉庫均新增0／變更0／移除0，blocks1728／5ef6eb67，style逐族相同，無風格下降或env警告；fp.json／style.json未提交新版本。
- 接下來只刪自己capacity032-native.yml的獨立commit；刪後最後head的常規push／PR CI及新Codex程式與安全審查尚待完成，不能提前假勾。

## §8 目前逐條自檢

- [x] 動手前單檔卡面已先推，以上八條凍結驗收原文不變。
- [x] 不改模擬／存檔；實際只讀自檢與容量探針已驗世界／儲存未變，原registry還原。
- [x] CI fp已驗166家族、3543舊葉及blocks全部零變；修補只讀掃描，不產生新遊戲畫面，整幀閥不適用。
- [x] 無美術變更；獨立BASE／HEAD的完整舊日夜原圖序列一致，所有美術來源靜態未變。
- [x] 三個原始BASE真首紅、實際sheet丟葉負控制及恢復、有界容量案例已跑。
- [ ] 最後head push／PR煙霧各3次、財務53／10與fp仍待最後CI結果。
- [x] 所有已勾項均有真CI結果；沒有本機遊戲執行，未跑項維持未跑。
- [ ] 臨時workflow刪除後的最終head新程式／安全審查尚待完成。
- [x] 本PR涉及共用守衛容量界限，保留[等業主]，GPT不自行合併或部署。


## 審查修補：把原生輸入固定在本分支

最後head398ebeb的新一輪審查指出P2：[4305790094](https://github.com/lijiabao1998/GlimmerTown-lab/pull/40#discussion_r4305790094)。原探針以git show讀未合併PR39的1f31a32，清潔checkout或該分支刪除後可能找不到物件。此finding成立，不以第一輪無findings掩蓋。

本筆將同一份42541 bytes幾何逐位元複製到fixtures/bld-capacity032，Git blob仍dfda65bf4f511052581305f4f1d728a9fae042f2，另存來源provenance；不放入index、不安裝SPR、不增加正式美術。探針改用固定fixture讀取器，硬性校驗SHA256；自己的單條smoke自檢先跑同一讀取器的損壞位元反例與恢復，再跑原先瀏覽器只讀自檢。

產品index及原生容量測試函式與綠run37e9e34完全相同，fixture位元與該run的真實幾何輸入完全相同；只修輸入取得方式，不修改容量案例或判準。原生完整run仍為39098124736／37e9e34，不冒稱在新head重跑完整原生。已刪workflow不加回、不另取名繞過；新head由既有smoke CI實測fixture讀取、實際破壞一位元首紅、恢復及瀏覽器自檢，fp與財務照常跑，另請新的審查。

條件不變：第一筆卡面的八條凍結驗收保持原文；這項檢驗fixture僅保證條件3可重現，不是新增產品美術或放寬任何像素判準。新head的實際CI及新程式／安全審查仍未完成，不宣稱通過。
