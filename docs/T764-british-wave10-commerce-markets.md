# T764：第十波十座有考據英式商貿與市集建築（原GPT-038）

本卡為同一PR46的發布收尾；原[GPT-038首卡及全部施工／首紅歷史](branch/GPT-038-british-wave10-commerce-markets.md)原樣保留，供不可變C1prefix守衛使用。原首提95373e6與凍結十款／唯一bld40葉／完整原生門檻不重寫。業主2026-10-21 09:03 UTC接受Silver三圖，09:55 UTC明確批准完成本PR版本／最後CI、通過後合入main、由既有自動Pages發布並驗證；不涵蓋3D或其他建築。

## T764／v14.57／r211發布準備（未合併、未部署）

- 最新main3e335233（v14.56／T763／r210），T檔名、日誌與最近100個main提交標題最大T763；本PR配置T764／v14.57／r211，合前再核。現在仍正式9／20波90棟；只有本PR合入且精確公開版本成功才計10／20波100棟，不計T748歷史15棟。
- 已審完整程式head101547c；C28fd734f8補實際21／21原生、標準smoke3／fp／財務53＋10、父任務獨立覆核及圖片接受。C29d48e333只刪native workflow，新push39575059922及PR39575641479全綠，PR實際確認重用同一push，不說另跑。
- 此次生產index只把GAME_VER14.56→14.57、GAME_ANCHORT763→T764、startVersion456兩組版本字同步，恰4個ASCII byte改變；逆變換逐byte等於已審C27／C29完整HTML。新index11370954bytes／SHA256`9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852`／Git blob`5bf4c0982249d1c1a6d7c9fbd9e67204484e231d`。原62976bytes美術SHA6e31446e…dac72、runtime／CSS、smoke舊斷言、財務／fp.js、十個凍結full guards及raw fp／style全部不改。
- 新wave038-release-labels.cjs只接受上述三個唯一literal，逆變換精確C27SHA；checkWave038ReleaseSources在保留全部C27來源／firstcard／helper／基線／舊3743葉／165族／blocks／env／guardhash判準之上，另比實際C27 Git物件並做wrong-label／extraHTML／duplicate／missing真首紅與復原。原candidate source checker仍原bytes，沒有放寬它。
- probeTenPowerRelease038只把實際獨立GitBASE的三版本字按明列同策略改為14.57／T764，再逆證完整Git bytes，完整serialize比較（含gameVer）與全部原生操作／窗光／錯號誌／復原測試body逐byte保留。原power probe、nativeTenPower core與phase helper原bytes不變；不刪保存欄位、不賦值utility、不正規化結果。manifest明列原GitBASE、三label變換BASE與CIbridge頁的不同SHA，不能把它們冒充原頁。
- 已刪wave038-native及035／036／037保持缺席；新增只綁本分支、contents:read的wave038-release，沿C27完整21工作與來源原bytes傳輸，只換兩個發布入口。它無部署／推送。新head完整CI、來源／原圖重綁及最終差異核對仍待，不先填成功；最後完整綠才另作純刪release workflow提交，刪後標準smoke3／fp／財務與PR仍須綠。

## fp七軸與已完成覆核範圍

| bld軸 | BASE | 候選／發布美術 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9517610664359899 | 0.9529472614093789 |
| lightDir | 0.8201595358955766 | 0.8195912614517266 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9888712718250431 | 0.9891894285953 |
| variants | 1 | 1 |
| total | 0.9658 | 0.966 |

只有首卡bld新增520..559四十葉；原3743葉／165其他族／1728blocks與CRC5ef6eb67／env不變。總分略升但lightDir略降，如實披露，不說全軸改善。raw基線是C26真CI原bytes，fp412224bytes／SHA0ed9f5f2…52cb3，style73167bytes／SHA3fd45e3c…8ccdbb，generatedAt及舊producer metadata不手改。

C27父任務獨立覆核八官方ZIP digest、298 manifest檔／275 PNG bytes與SHA、160案例／1920相位見證、原九款72日夜圖hash及新十名四負控。實看32張新款日夜／供電／近景／邊界／contact，已審範圍無阻擋；作者實看93靜態原圖。這些只覆蓋C27明列來源與影像；發布後以本次完整來源逆變換、實際原圖SHA綁定不變部分，不冒稱新獨立跑測或全275人工圖審。

## §8與未完成項

- [x] C1首卡及C24補Silver計畫在實作之前先推，原凍結要求不改鬆；C30發布標籤／驗收計畫先推。
- [x] C27完整正常模型／舊新保存、8全畫布、12原生首紅、160供電案例、97狀態、行人／效能及三smoke實際通過，詳原卡C28；這些不冒充本發布新head通過。
- [ ] 發布新head完整21工作、真smoke3／fp／財務53＋10、來源／原圖重綁與純刪workflow後最後CI待實際結果。
- [ ] 全部狀態人工逐張審閱未完成：保留作者93靜態、父任務32選圖的明確範圍；實體手機／Safari／觸控未測。
- [x] 所有已通過聲明均指明實際head／run或實看來源，未跑／未審不假勾。

本地組裝有一次workflow標題substring計數錯把artifact前綴算入，已停下並改為完整行比對；沒有跑過新CI、改渲染門檻或放寬native判準。原錯誤保留發布來源紀錄。

沒做成／待辦：此刻尚未Ready、合併或發布。最後完整CI綠後保留精確run／原圖與來源證據，再純刪release workflow並核最新標準／PR；合前核main／T號／方向／審查與ancestry，以expected-head操作。同PR合入後追mainCI、既有自動Pages、公開HTTP與沙箱Chrome完整SHA／三版本字／第十輯十列四十葉／slot3活畫布，成功才計第十波。不手觸Pages；新平台拒絕即停該動作、報精確目標及已執行狀態。Silver600×337細雕／隱屋頂限制、Bishopgallery原生細節較弱及未全人工審閱限制照留。
