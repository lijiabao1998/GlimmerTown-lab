# T739 — 36款英式三規模正式整合（原 GPT-022）

當前階段：業主已於2026-10-13 06:59 UTC指定GPT合併PR26；來源階段已完成雙CI九項全綠。
本卡保留原GPT-022動手前條件及完整失敗歷史；下文source-only段落是當時的範圍，
不表示本次只合來源包。正式index已在PR；目前準備v14.41/T739合併元資料與最終發布驗收。
還未合併或部署，最終雲端結果待補。

本卡於移植實作前建立；從最新 main
`01e581eb19bbb7efebc50fd893483f3cb1859388` 分出
`gpt/british-use-scales-source-022`。Claude 新提交只改
`docs/AGENT-PROMPTS.md` 與 `docs/DECISIONS.md`；保留其完整內容。
已依序讀《迭代不改壞標準》、AGENTS（含第5節）、AUTORUN及DECISIONS。
COLLAB.md／.agents/skills 在此 workspace 不存在，未假稱讀過。

## 一件事與精確差異方案

移植已確認的36款候選完整來源：12種既有用途各小中大，保留五份原美術
及重建kit，不開新美術。商店、市場、餐飲、旅館、辦公、作坊、輕工廠、
倉庫、農場、牧場、客運站、貨運站。這是同用途型制差異，不是新容量、
產業鏈、費用、調度或新建築編號。原 native 不支援的組合仍 fallback。

允許移植的檔案：五份 `british-use-scales-*021.js` 美術、kit、native-map、
runtime、`build-use-scales-release021.js`，相關 probe/test/harness 及
smoke 的 useScales021 自檢。保留021內部名稱以避免改動批准來源與存檔 metadata。
新增一份僅建置及輸出核對的源碼包 manifest／candidate-build022.js。
既有 smoke workflow 僅在此分支／此分支PR，先生成候選 index，再實際
跑 smoke 並上傳完整候選 index 與真實樣張為 artifact；不寫回 Git。

不帶入舊發布準備：v14.41/T739 三個版本標籤、AUTORUN-LOG、fp.json、
style.json、DECISIONS 修改，或 materialize-release021.js／臨時
contents:write workflow。本卡只標 GPT-022，不佔 T 號。

完整 index 大檔此前工具傳輸逾時。此卡採用完整可重現源碼提交：Git 中
index 保持最新 main；唯讀 CI 在 runner 產生可獨立開啟的完整 index。
這不等於生成 index 已推入分支；合併者必須先生成、驗證 index，再按
AGENTS第3節測試及配版本。不可直接把源碼包 PR 合併當作美術已上線。
既有 smoke CI 使用既有權限，不提升 GitHub 設定／token／倉庫權限，
沒有自動 commit/push/ref/merge/deploy 步驟。

## 移植前鎖定的驗收條件（不得事後放寬）

1. 本卡先推成功，才移植來源；只推自己的 gpt 分支，禁force，禁main推送及自行merge。
2. 新分支相對最新main，所有受保護檔案及三個版本標籤零變動；Claude兩份文件逐位保留。
3. 五份批准美術逐位相同，全部完整源碼讀回SHA相符；不只提交報告或縮圖。
4. 初始index SHA256 為 `7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067`。
5. CI生成index必須完整符合已確認候選
   `8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed`，
   仍v14.40/T738，不改其批准形制與本輪授權以外內容。最新main若改到程式，先停下核對。
6. smoke必須測到候選實際renderer的useScales021 API；不能把舊main smoke綠冒充新候選綠。
7. CI三次smoke全綠、console乾淨，artifact包含完整index及實際樣張；真實完成後才填結果與連結。
8. 像素守衛及fp本機未跑，標「未跑，待合併者跑」。合併者須驗證日夜/雪季節/四向/大小螢幕/
   近遠/邊界/疊層、存讀、取消重複、native功能配對及閥關整幀，不改fp基線來過關。
9. 新建workflow／既有workflow差異不得新增contents:write。CI綠後才開PR，附卡與artifact。
10. 推送前重新讀最新main及自分支head；遇衝突、審核拒絕或測試紅線，按規則處理而不繞過。

## 現況與樣張

已確認圖是舊完整候選的原生day88同幀36款 PNG，原檔保存在
`/workspace/GlimmerTown-lab-rebuild021/docs/branch/GPT-021-rebuild-preview/native-city-attempt-06-rot0.png`，
主對話已看過並確認。它不是本卡新CI樣張，不用來宣稱本卡已測通過。
舊成果與全部拒絕收據保留在原工作目錄及bundle，新卡不覆蓋任何GPT-021卡。

## 施工紀錄與沒做成的事

卡面先推成功，遠端commit `1f5aff4a622a071eb9f23ff30ca3a0b54c872468`，
全文與blob `1b47f2756f34a665e6af42c48b021604da6dbbdf` 已讀回相符。
完整來源已移植；深層守衛只移植檔案路徑與不可變baseline讀法，使其不依賴
旧 `/workspace` 工作目錄。獨立oracle／day88成熟城／初始QA場景逐位複製
至 GPT-022-guard-inputs；不改守衛判準或批准美術。守衛首次跑不得使用
`--reuse-contracts`／其他舊驗收重用選項；新结果必須来自本卡實跑。
23:43雲端狀態查詢成功，當時未提交來源已另存WIP tar與恢復收據。
來源尚未推送，CI未跑，PR未開。
本卡沒有本機遊戲執行；像素守衛／fp：**未跑，待合併者跑**。
沿用必須披露的已知限制：全家族cold增加243.75ms；成熟建築hover fade
NOTTESTED；真機效能未量。舊測試結果不能冒充本卡的新結果。

## 第8節收工自檢

- [ ] 卡面先推，验收未放寬。
- [ ] 同種子功能／舊存檔比較：未跑，待合併者跑。
- [ ] fp／閥關整幀：未跑，待合併者跑。
- [ ] 本卡完整狀態與疊層：未跑，待合併者跑；成熟hover仍未測。
- [ ] 本卡守衛故意改壞／首紅：未跑，待合併者跑。
- [ ] CI煙霧三連綠：待CI。
- [ ] 所有「通過」均有本卡真實CI證據。


## 2026-10-13 純雲端合併授權與補驗收階段（動手前）

業主主對話 2026-10-13 06:59 UTC 指定：「lab 你合 就行了 gpt」。
此段僅授權本 PR 的整合與合併收尾；不授權強推、刪分支、改 GitHub 設定／權限或其他作者分支。
全程只用已選純雲端容器及 GitHub Actions runner，不用業主電腦，不在此容器跑遊戲。

原 source-only 階段已完成：source head c5c39d0adb5ed7e9fc27aaf5cd74e97d57716ca6；
push CI 38325425204 與 PR CI 38325866448 均 attempt 1 成功，各三次 smoke 綠、console 0。
27檔完整 blob／29個 manifest pins 讀回相符；完整候選收據為 10,816,659 bytes／85 scripts，
SHA256 8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed。
以上來源／CI階段證據不等於下面新增合併驗收通過；前文「尚未推／待CI」保留為歷史紀錄，由此段更正現況。

核實整合問題：repo index 仍 main，而 smoke 已要求 useScales021 API。
來源建置只在本分支／PR執行，直接合併會漏上線並可能使 main smoke 紅。
本階段須將完整生成 index 寫進同一 PR，分開「pinned main重建驗證」与「正式materialized index測試」；
保留批准美術與內容 pins，不放寬驗收，不以來源包／CI artifact 代替發布內容。

施工前鎖定的本階段驗收與執行路徑：
1. 最新 main 相容、Claude工作逐位保留；只有本 gpt 分支可修正／推送，無force。
2. 可發布完整 index 必須在 PR 內；來源重建仍驗證原 pinned main／批准候選 SHA，
   如版本收尾產生新 SHA，僅准已明列的三個版本標籤轉換，另外 pin 最終發布檔，不鬆原內容 pin。
3. GitHub Actions checkout 必須取得 01e581eb19bbb7efebc50fd893483f3cb1859388 供 git show baseline；
   同一精確 PR head 在雲端執行七支 probe、成熟建築 hover fade、fp.js --check、三次 smoke。
4. 七支 probe 首輪不使用任何 --reuse-*；新報告／實際截圖來自本階段 runner。
5. 完整驗收覆蓋閥關整幀、full save與保護槽、同種子/native功能、36款成長、
   四向日夜四季/雪/近遠/尺寸/邊界/相鄰及疊層、真實取消重複undo/redo、故意改壞首紅。
6. 成熟 hover fade 須新行為守衛；舊 cold +243.75ms 仍只是舊結果，新的效能數字來自新CI。
7. 必要 guard 失敗／沒有合法路徑就不合，寫精確失敗及修復；不可因業主合併授權跳過不改壞標準。
8. 合併流程所需下一T號／版本／AUTORUN-LOG只在真實驗收後按AGENTS第3節收尾；
   fp／DECISIONS若無實際需要不改。merge前核對main與最終head，merge後追同SHA smoke／Pages／公開網址。

目前本階段未執行七支 probe／hover／fp／新smoke、未 materialize 推入 PR、未合併／部署。
結果會在實際完成後追加；未跑一律照實保留，不勾成通過。


### 雲端靜態整合紀錄（遊戲驗收仍未跑）

完整 index 已靜態生成，10,816,659 bytes／85 scripts，與批准 SHA 8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed 相符。
`candidate-build022.js --verify-materialized` 從 pinned main 在暫存目錄重建，精確比對 PR 的完整 index，不改 runner 的被測 index。
smoke checkout 改取完整歷史以讀 pinned main；沒有變更 workflow 權限。
新增唯讀雲端 acceptance workflow：七支原驗收＋成熟 hover＋fp，所有首輪無 reuse。
成熟 hover 守衛要求36款×四向×日夜×desktop/mobile共576個情境，以可信指標移動觀察原生 alpha=.35、移開回1、金錢／metadata不變，並注入原生 alpha 錯誤驗證目標首紅。
以上新增守衛只寫完與語法檢查，尚未跑遊戲；後續只接受真實 runner 報告。
本次沒有在容器啟動遊戲、Chrome、fp 或 probe；版本／AUTORUN-LOG／fp／DECISIONS暫未改。


### 首輪雲端驗收紅燈與清理修正

整合 head d267dc99f8da88c12e63ad8d34e6011e68b18ac8，acceptance push 38361765986／PR 38361770915。
首輪 kit 與 fp 通過；其餘七項 red，尚不能合併。多個報告在 withGame 請求 Chrome 結束後，
立即清除自己 mkdtemp 的 profile 時遇 ENOTEMPTY；finally 的清理錯誤遮住了部分原始結果。
只對自己 harness 的 temp root 增加有界 fs.rmSync retries，不抑制錯誤、不放寬任何行為守衛。
helper 新 byte pin 登記於 sources，原 source-only pin 保留於 sourceStagePins；批准美術與 candidate SHA不變。
workflow 在 always 步驟印出原始報告的失敗 checks/items，以免只看到清理異常；所有 JSON／PNG照存 artifact。
下輪必須重新實跑 fresh checks；首輪紅燈收據保留，不以 retry 代替修正。尚未合併或部署。


### 第二輪具體問題與第二次清理修正

head dcd88fe196f8985ea6960970ed5673502bcd9dc9，push acceptance 38362327666／PR 38362331358。
同步清理仍 ENOTEMPTY；改為 await async disposal，先讓既有 withGame 的1500ms清理計時與Chrome退出完成，再有界刪除自己的 temp root。
七支 browser probes 各自 await cleanup；沒有忽略清理或行為錯誤。
Remaining 首紅包含 UKC021-M、UKP021-L 的pose/snow：id相同的另一朝向／variant地塊也被納入trace。
觀察器只包原生 resolver、保留原return值，記錄實際 x/y root；body/snow只取該 native地塊，night另外比native尺寸／variant，不按期望像素座標篩資料。
hover 首紅已有實測 alpha .35，但自算滑鼠座標對不到預期 tile；指標移動改用原生point转换，alpha=.35／恢復=1的判準不變。
Visual第二輪32幀／8769 checks已記錄但被清理阻斷，仍不得宣稱完整通過；interaction304 checks同樣。
第二輪新量測僅此runner：warm原生 median37.2/p90 41ms、候選29.1/42.9；whole-family cold原生60.75/66.3、候選215.95/267.2，每臂30交錯樣本。整份守衛仍紅，這些部分數字不充當驗收。
批准五份美術、原kit與正式候選index SHA未動。首兩輪完整報告／紅燈均保留。


### 第三輪雲端結果（清理已解決，未全綠）

head d2cc3ef2be4830addb81fd399ebc3f11d747aad6，push 38363205584／PR 38363209843。
kit、fp、visual、saves、compatibility 已完成成功；async cleanup不再ENOTEMPTY。
仍紅：native 581checks，36款成熟共存只有35、缺UKC021-L；interaction306checks的閥關整幀SHA不一致；
Remaining night取樣在bubble/helper trace沒有meta時讀bw出TypeError；hover完成72情境後r1指標tile不符（alpha已.35）。
修正：night先限定layer再讀可選meta，body/snow仍以真root辨識；hover照原生toTile「先view格中心、後反轉整格」公式給四向指標。
整幀A/B既有測法main只畫1次、候選off畫2次；T289 trafClock是不入存檔的visual clock，兩臂原來boot時鐘也不同。
現在兩臂給相同trafClock=0、visT=55，最後都畫兩次.016；沒有關任何畫面層、沒有放寬逐位一致。
保留兩臂實際input／clock供審查；尚未證明這是全部原因，若仍不同照實紅燈。
native的36共存判準不改，下一報告追加缺項的實際native根／level／犯罪消防覆蓋／首次成熟日，查明原因前不改模擬或強制放置。
本轮沒有合併、版本或baseline更新，所有失敗artifacts保留。


### 第四輪：PR全綠、push的native QA地塊通路仍不足

head c74a75c4b6ac5588b50e9fba0a488f3ee7a22982：PR acceptance38364580881九項均成功、push38364574692八成功一失敗；兩個smoke38364580803／38364574683成功。
成熟hover的576情境與故意改壞首紅、閥關整幀、night/snow取樣的修正均有真實CI綠燈，沒有鬆判準。
push native仍581checks但最後35/36；缺UKC021-L。明細證明它曾在day49從原生分區自然成熟（lv1、v8、age30、2x2），後來day382四格均無建築。
此測試地塊消防coverage>0，但emergency actual frontage=0、reachable=false；只有外側road在更南方，北方通路不足。
修正QA施工：在劃區前透過既有pay/preview/placeUndo逐格付費，補39..42／10..13的原生道路＋水管，接到既有39主幹。
不改native容量／价格／模拟／美術；不关災害、不用god／需求override、不把共存改成「曾各自出現」；仍要求同一成熟幀36款。
保留首四輪失敗報告與PR綠燈，待本修正的push及PR新報告；尚未合併／部署或配版本。


## 合併收尾（v14.41／T739，最終驗收待CI）

來源階段a63dbda：push38365203669／PR38365212020的九支工作全部成功、首輪無reuse。
kit154、native609（兩事件同day86共存36款）、visual8771/32幀、save38、compat43、interaction306、remaining845、hover1729/576情境、fp零變動。
藉原生付款补道路解决北方工坊地塊真实通路不足；未关闭災害或改价/容量/模拟。
跨runner启动的visT/simAcc/微量money仍有时钟差，36共存不是拿长终点数值冒充同种子等价。
因此保存守卫追加独立main/candidate两臂：同完整save、native advance(.05,360)预备，
再逐步advance(.05,18)+真实draw(.016)六次；每次比较全部native save字段、15stats、非空cars、保护slot。
候选这组默认启用，无逃生阀/需求/god开关；比较结果必须本轮CI绿后才勾。

只修改合併流程要求的三個版本標籤：v14.40→v14.41、T738→T739。
原批准完整内容SHA仍8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed，
最終發布SHA 4798d3358a5255d212de7a90235adc0dd2317ee21b91b73a3dbb56af076c2655，大小10,816,659 bytes。
静态builder先从不可变main重建并锁原批准SHA，再逐项改三处literal labels、锁最终SHA；不存在放松原内容pin。
为使旧renderer保存对照也使用本轮批准的gameVer，QA只对已验真原main输入镜像同三处标签，
保留originalInputSHA256及controlSHA256证明；不排除任何其他save字段、native算法或画面层。
fp.json、style.json、DECISIONS、AGENT-PROMPTS和原harness.js仍main原样；没有为过关重写基线。

### 本次收工自检（最终发布CI待完成）

- [x] 原卡先推，源阶段验收没有事后改松；所有失败保留。
- [ ] 同种子六步main/candidate全字段配对与旧save来回：最终发布CI待跑。
- [ ] fp所有叶子/超街区/棘轮零变；阀关整帧：最终发布CI待跑。
- [ ] 36自然成长、四向日夜/四季/雪/近远/屏幕/边缘/疊层/成熟hover：最终发布CI待跑。
- [ ] 新guard故意改坏首红：最终发布CI待跑。
- [ ] 最终smoke三连绿且console0：待CI。
- [x] 所有未跑项照实写，未宣称合并或部署。

合併后还须同SHA的main smoke／既有Pages自动部署／真实公开地址验证。


## 2026-10-13 08:14 UTC 直接明確批准後續

業主原話：「本輪允許 GPT 合併 PR #26 到 main，並讓既有流程自動部署。」
訊息 Sentinel_4b70e80a05588191a6918609234f4900，範圍僅GlimmerTown-lab本輪PR26。
先前父線兩次合併交接被安全審查拒絕時已停止，未嘗試main合併／推送／部署或換路徑。
此後依新直接批准恢復；本地已備好發布檔，必須先推同PR並跑最終雲端驗收才可合併。
有確切操作仍被拒則保存action/target/reason停手，不改途徑。


### 最終版本首輪新同種子守衛紅燈（未合併）

head ef59c05793427dc1941dfc0b5f88c3e079541cad，push38368624819：其餘八項成功，新增前向配對step0紅。
第一個差為企業cash 221.52/221.53，native共128差、jobs707/706、住宅demand差0.00063，BL無差、phase整日相同、cars16/16。
沒有把0.01當容忍度放過。查原生load只還原整日資料，不重設未序列化的simAcc；兩個browser的boot殘留subday phase可能不同。
新配對在原生load之後，記錄原before state，再明確把兩臂這個輸入phase都設0，繼續完全相同的native advance；不改算法、開關或存檔字段，不排除輸出差。
保留matchedInputPhase供審查，所有原字段和15stats仍要求零差；若仍紅則不能宣稱已解決。
這只改QA測試輸入，最終發布index SHA4798d3358a5255d212de7a90235adc0dd2317ee21b91b73a3dbb56af076c2655未動。
