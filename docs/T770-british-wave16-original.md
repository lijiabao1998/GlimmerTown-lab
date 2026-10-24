# T770／GPT-044：第十六波十款原創英式專門工房與服務建築

第16波十款原創英式專門工房與服務建築／40向，bld760..799；原生價格、容量、供電、模擬、存檔結構及歷史模型不變。

發布準備，仍待發布版最後head完整驗收、全綠後純刪臨時workflow、最終push／PR CI、合法合併及main CI／既有自動Pages／實際公開網站核實；此前正式15／20波150座，不把候選算160座。

## 範圍與版本證據

- PR：[#57](https://github.com/lijiabao1998/GlimmerTown-lab/pull/57)。原創身份、量體及凍結驗收見[首卡](branch/GPT-044-original-specialist-workshops-wave16.md)；不冒稱真實古蹟復刻。
- 首卡：73e6e412b4be622dcdf9d068068ec529324db8b3；C1：662373713ea635b1819f2d7c38dd38961758bfac；C2：ef9efc5292584aa62e15e5a7f899946fb753d1d0。
- 準備時遠端main仍為6284b854e18b12188d193652e9aa69cb7022dfea；docs/T檔名、AUTORUN-LOG及git標題的最大T號均769，已宣告日誌輪次最大r216，因此本PR提出T770／v14.63／r217。合併前必須再核，不預先宣稱正式發行。
- index只改GAME_VER、GAME_ANCHOR及開始畫面三個精確版本標籤。發布HTML SHA256：6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723；逆轉三標籤必須逐byte回到C2的f7ffd7e91fc7c94f36441fbe72ea9b12a2efb28139bbda603e53386290f2dd5c。
- 獨立BASE完整HTML SHA256：cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8。發布版剝除044三區塊及安裝尾後，只許保留同三標籤差異，再逆轉即逐byte回BASE。原始044候選契約、舊波守衛、規則與門檻不動。
- 歷史舊檔只明列gameVer 14.62→14.63一個writer欄位遷移；原始BASE與同標籤declared BASE分別實際執行，HEAD對declared BASE比較全部欄位，沒有欄位排除或財務正規化。這項發布契約仍待發布head原生CI執行。
- AUTORUN-LOG只插入新r217段；方向檔只插入本波狀態段及明示待發行表列。wave044-release-metadata.cjs對兩個獨立BASE完整檔案釘SHA並驗證精確插入，舊文、開關及業主原話全保留。

## 候選CI與真首紅

C1標準40121228689首紅：40新增bld葉尚未宣告；財務52項與10負控制成功，唯一失敗是來源指紋。只採同次官方fp artifact12571366394的原始fp.json／style.json，保留metadata，不改財務模擬或門檻。C1原生40121228711的baseline-evidence因本波臨時workflow誤用720標記失敗，C2只把標記修為760；C1不是27／27全綠。

- [C1標準首紅40121228689](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40121228689)
- [C1原生40121228711](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40121228711)
- [原始CI基線宣告](branch/GPT-044-raw-CI-baseline-adoption.json)：保留artifact12571366394內原檔全部metadata。原3983葉完全相同，只新增760..799共40個bld葉；其他165家族、block1728／5ef6eb67及環境註冊不變。

C2 ef9efc5292584aa62e15e5a7f899946fb753d1d0：原生40121953495全部27工作成功；標準40121953536的smoke三次、fp及財務全部成功。這是候選證據，不代替發布版最後head或公開驗證。

- [C2原生40121953495](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40121953495)
- [C2標準40121953536](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40121953536)

## 七軸與人工圖審

bld七軸：palette 1→1；hardEdge 0.956575675398324→0.9572489734902542；lightDir 0.8029647930821495→0.8034960819770947；shade 1→1；density 1→1；nightRule 0.9905118397397248→0.9907380909650112；variants 1→1；total 0.9643→0.9645。七軸及total均無下降；沒有改分數、原始基線metadata或容忍度。

本次圖審進度：80張日／夜單精靈已完成人工檢視；113場景已完成逐張檢視，施工快取就緒另待新診斷，原PNG與producer／SHA清單由獨立證據步驟補入，不把產物存在當全部人工看過。275供電PNG未宣稱全數人工逐看；不冒稱業主圖審批准、實體手機／Safari／觸控測試。

本發布準備已逐位保存C2原生CI的3張接觸表及10張近景：[日間](assets/GPT-044/contact-day.png)、[夜間](assets/GPT-044/contact-night.png)、[新舊對照](assets/GPT-044/contact-comparison.png)、[原圖producer及SHA](assets/GPT-044/manifest.json)。完整圖審結果由獨立紀錄如實補充。官方Actions桌機Chromium資料不是實體手機效能證明。

## 第8節自檢與待完成事項

- [x] 首卡在施工前凍結；本次不改鬆原驗收條件、不改原始候選與歷史守衛。
- [x] C2完整原生及標準CI已成功；同種子、全欄位存讀、供電、場景、行人與效能候選證據在同head原生run，並非本機執行。
- [x] C1原始fp／財務來源指紋首紅及原生workflow標記失敗保留，沒有靠重跑賭綠；基線採同次官方原始附件。
- [ ] 發布版最後head的完整原生、全部必要push／PR CI、發布writer遷移及新增負控制仍待執行；C2成功不代替此項。
- [x] 原91預覽及113場景逐張檢視並驗SHA，另看C2施工晚期；[精確檢視範圍與限制](branch/GPT-044-visual-review.json)。施工快取自然就緒尚待額外CI，不冒稱已完全驗收。
- [ ] 臨時workflow最後全綠後，獨立純刪workflow、再次核main／T號、合法合併、main CI、自動Pages及真公開網站完整HTML／瀏覽器驗證仍待。
- [x] 本地僅來源組合、語法、位元組與明列負控檢查；未在本機執行遊戲、Chrome、smoke或fp，不假稱已跑。

沒做成的事：本波尚未正式合併或發布，不計入已完成160座；未完成項與平台限制照上列保留，不以候選證據代替發布核實。
