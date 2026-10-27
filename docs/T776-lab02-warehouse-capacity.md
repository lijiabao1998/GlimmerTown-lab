# T776｜LAB-02 容量核心發布準備（原 GPT-050／PR68）
日期：2026-10-26；首卡先推，尚未施工或宣稱新版驗收。

## 業主明確批准
業主2026-10-26 09:03:28 UTC，訊息 Sentinel_bfd6bc2d37648191824dd44b68f0fef7，回覆決策 Sentinel_8516a8c43d9c8191b45de8432ad94d22：「A」。
A 原文：
> 批准PR67／68的有界合併準備，含上述基底適配、版本／日誌與完整重驗；全部通過後，依67→68正常合併到 GlimmerTown-lab 的 main，並走原本自動Pages發布。PR67會公開預設關閉的研究入口；PR68僅收納容量核心，還不會把研究倉庫接入遊戲。
> 風險是新組合仍可能測試失敗，失敗就停，不降低門檻。

本卡只處理PR68。後續「單一研究帳接線」另卡Draft，不含其合併；正式倉容／經濟／持久化仍需另批。200座／20波不動，不開21波，不做效能專案。

## 開工來源與配號
- fresh main：c0d4a039c48aebaa1f091fc6ce03d60bd0ca7992，T775／14.68／r222；PR67已正常合併，main CI40308344872與自動Pages40309228966成功。
- PR67精確公網HTTP200，12043120B／SHA256 32e3adb65370fd63cf33302c0005996978b3d97d2edd9b52dc17de35e1245e50；真網址AX有14.68/T775主選單。完整公開互動／截圖因瀏覽器timeout未完成，保留此限制，不冒稱通過。原AGENTS第7節第5步與標準6.3為「開真網址看一眼」，不新增或豁免門檻。
- PR68仍Draft，原head6d544c2fee82d92cf6cf5563db52fb241885a058；只有此一待合PR。原首卡、020 native／ff4a upstream fixtures、C1失敗／C2及最後6d驗收全部保留，不拿舊run代替新head。
- docs/T*.md、日誌與main標題最高T775，輪次標題最高r222；本次T776／14.69／r223，更新後與合前再核。**fp家族：無**。
- 不重寫歷史；以新commit把最新main接入自己分支，必要時有序雙parent，不force。

## 唯一適配範圍（動手前凍結）
1. 050核心保持獨立檔，不將其import／複製／接線到index；產品index只改三個版本metadata字串到14.69/T776，049研究區逐byte不變。
2. 保留050的source.json、ff4a runtime與test原檔；另存原6d050 test。新增獨立完整release descriptor，硬釘批准main、PR68、版本/T/輪次、業主訊息、原050核心／測試／049區／歷史native hashes。每個位置唯一、exact字串與整檔hash驗，不採寬鬆regex／新基線洗白。
3. W01來源適配：只逆投影三個發布metadata、移除唯一且hash不變的049區後，整檔仍須等於原T774 native SHA。A/B歷史QA使用該逐byte還原native＋固定ff4a區或相容factory，執行原始049 test不改；C用目前已含049的native，**只插050＋既有QA observer，不再插第二份049**。明確區分歷史契約、目前native QA與實際產品。
4. 來源／組合守衛：描述完整tuple獨立expected、三metadata、native額外字節、049區來源／唯一性、歷史archive、050核心／歷史fixtures、anchor及C唯一049／還原native composition，各新guard用真變異證明目標首紅後還原，不把語法錯當首紅。
5. main的049 test保留全部行為斷言與15負控，只精確更新目前發布tuple及確保描述破壞仍是真變異；原ff4a archive不動。smoke保留049、加入原050 hook，既有斷言／順序／門檻不減。
6. 更新T卡、原GPT050卡、AUTORUN-LOG、方向狀態欄。開關／方向原話及20波完成歷史不改。CI／harness／gallery／fp/style／規則不動；不修改T482/T490、saveSchema、RNG、正式道路鐵路／車輛／人口／美術或效能門檻。

## 完成與合併前硬驗收
- 原工作流全量：smoke三輪、fp零新增／修改／移除／觸及家族及無style下降／envLeaves差異，既有fiscal-load全套。最新head不能引用6d舊綠燈。
- 原049 contracts／行為mutants／release-source負控全保留；原050 26組純核契約、40核心負控、lineage及7UI真破壞全部保持。新增來源／組合負控需逐項first-red／restore。
- 強制20 food：A7、B8、未發5，capacity10；A入7→B整批8等待且owner保留→A出庫used0→B整批8入。禁止拆批／mint／重複、FIFO越隊、超容量、事件語義衝突漏檢／revision／冪等失效。
- 原生state／canvas／RNG／storage／ensure未變、OFF無副作用、v14.43與正常存檔往返、load部分失敗／newWorld／pagehide／reload取消、舊token拒絕；研究會話不持久化。
- 真CI Chrome六狀態×桌面／手機視口×日夜，真按鈕、JSON展開、scroll、close／native zoom與原PNG。逐檔hash與人工看圖分列，不冒稱真手機／Safari。
- 最後head全綠且源樹／§8／樣張核實後，fresh main／T／方向再查，Ready後正常expected-head squash；不force/admin，不手動Pages。
- 合後核對精確main CI、自動Pages及公開URL；公開互動／截圖若未完成，如實列未測，不以AX版本冒稱完整互動通過。
- 失敗保留、修復限本卡；不得降低門檻、偷接050產品或新增第三個等待PR。

## 回滾與初始狀態
尚未施工／新CI未跑。正式產品仍T775；050原head與全部證據保留。合前失敗則不合；合後按AGENTS既有紅燈／revert批准程序，不自行強推或改部署流程。


## C1 靜態施工記錄（尚未取得新版 CI）
首卡13ca6ed先推。產品index SHA256 459f580274773bd229f1322474f2db1d42048e31d4a7b66ad40512e1a3bfda67；對c0產品只差三個發布metadata。050 core SHA256 0f028fb31c1a7d84ec1076758e46809110a031e5f96a9a167b16cc3863e1ec5e不變；原6d test完整另存，SHA256 067de16ccca48cc08fb07d3f6ba8668ec6cbf6a04d7dc9519d4040b372fcf0ad。
W01新增31個來源／組合真變異：3 metadata、5原檔hash、5已發布049／native來源、12描述欄位、6組合故障。既有050 browser／pure／runtime／lineage測試主體逐byte不變；C僅移除重複的上游049插入。main049保留15來源mutants，原本會等於新tuple的3個破壞值改為14.99／999，確保仍為真故障而非自動放行。沒有本機執行遊戲／harness／測試；只有語法與來源靜態核對。
