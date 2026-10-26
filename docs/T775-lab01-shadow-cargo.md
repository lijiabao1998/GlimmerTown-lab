# T775｜LAB-01 暫態研究帳發布準備（原 GPT-049／PR67）
日期：2026-10-26；目前僅凍結合併準備計畫，未主張新版驗收或發布。

## 明確業主批准與邊界
業主於2026-10-26 09:03:28 UTC，訊息 Sentinel_bfd6bc2d37648191824dd44b68f0fef7，直接回覆決策問題 Sentinel_8516a8c43d9c8191b45de8432ad94d22：「A」。
該A原文：
> 批准PR67／68的有界合併準備，含上述基底適配、版本／日誌與完整重驗；全部通過後，依67→68正常合併到 GlimmerTown-lab 的 main，並走原本自動Pages發布。PR67會公開預設關閉的研究入口；PR68僅收納容量核心，還不會把研究倉庫接入遊戲。
> 風險是新組合仍可能測試失敗，失敗就停，不降低門檻。

後續單帳整合PR合併、正式經濟、正式倉容平衡、存檔變更不在本次批准。既有200座／20波不重做，不開21波，不啟動效能專案。

## 精確基準與配號
- 開工重新核對 main020e3c096974be64680142297423de9a51d4bb8b；最新main smoke40169741555、Pages40170096579均success，產品533d838／T774／14.67。
- docs/T*.md、AUTORUN-LOG、最近main標題最高T774；實際輪次標題最高r221（歷史路徑scratchpad/r706不是輪次）。本次合併準備T775／14.68／r222，更新後與按合前再核對。
- PR67仍Draft，headff4a767a10502378b8e1bb387d2a5ed3b608ecbb；原始首卡ba75cd936304c5a0f0e03965db22309e224b92df與所有歷史證據不改。
- 原研究區362行／blob內區SHA256 2f9302156212602f9ec9615da14c8aeb0b16f8987d3628181ac030c77dcb93fb，實作逐byte不變。
- 原native去研究區SHA256 debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624。**fp家族：無**，原凍結家族不擴增。

## 本次唯一差異（在動手前凍結）
1. index僅三個發布metadata位置：GAME_VER、GAME_ANCHOR、startVersion456文字。研究區與原生所有其他字節不改。
2. L06來源guard精確適配：獨立release-source.json釘定目前發布metadata；每個位置必須唯一且完全符合；只把這三個完整字串投影回14.67/T774，再移除唯一且hash不變的049區塊，整檔必須仍等於原native SHA。拒絕額外變更、重複標記、錯版本，不做任意regex忽略或自動採新hash。
3. 保留ff4a原始test完整檔與hash。既有所有行為斷言不改；新增上述來源guard實際破壞負控制（3 metadata／原生額外字節／研究區來源）要求各自在目標守衛首紅並還原。
4. T775卡、自己的原GPT049卡追加紀錄、AUTORUN-LOG與方向檔狀態欄；歷史20波／200座及方向原話不覆寫。不得改rules、CI、harness/gallery、既有性能／財政／fp判準。
5. 本次無新功能、無050產品接線、無saveSchema／T482／T490／RNG變更。舊檔版本metadata依原生既有規則獨立列出，不忽略其他序列化欄位。

## 在新head成立之前不得合併的驗收
- 原smoke三輪、fp零家族／無style下降、既有fiscal-load全套、原049contracts與真source mutants全過。
- 新來源metadata／native-byte／區塊來源guard具真變異first-red及還原綠；不把語法錯或其他異常當命中。
- 啟用及OFF完整native/state/canvas/RNG/storage對照；舊v14.43 load→save→reload與正常／部分失敗load、新城、pagehide、reload取消；原生建拆UndoRedo／zoom、桌面與手機視口日夜原PNG。
- 最後head CI全綠與原圖實看後，重新查main、方向、T號，再Ready與正常expected-head squash。禁止force/admin/manualPages。
- 合後完整main CI、自動Pages、公開HTTP／原生瀏覽器驗證都要核實；未取得的結果寫未跑，不把歷史候選綠燈當新版收據。

## 初始未完成
以上合併準備尚未施工／跑CI；只有原ff4a研究候選已驗。此卡不宣稱產品發布。

## 發布準備C1（尚未推送新版程式時的靜態覆核）
- 首卡857f139936eab6aeca9be385e4a5c13131d86e40先推；其後僅三個index metadata字串改為14.68/T775，反向投影逐byte等於ff4a，049實作不變。
- 保留原test原檔，新增7種精確metadata／block／native／archive來源故障負控制。內部唯讀覆核再收緊發布描述檔：整份必須等於獨立明列的14.68/T775/r222/PR67、精確main020、業主批准訊息與歷史SHA；另8種描述檔欄位破壞都須命中同一精確描述守衛。
- 只有靜態語法／byte proof，尚未跑新head CI。無外部reviewer、無本地遊戲執行；稍早建立但尚未掛分支的41b4ca物件未推送、未跑CI，不是驗收head。

## 發布準備 C1 真 CI 收據（2026-10-26 09:50 UTC）
這一節只對程式 head `a5e752803542c933bb1781eb78de51c895be2670`，不是舊 ff4a 收據，也不預稱本文件追加後的新 head 已驗。
- [完整 push CI 40300714048](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40300714048)：smoke 三輪、fp、fiscal-load 均 success，無重跑。每輪 LAB01 29 組契約／整合結果全過；15 個新增來源故障各真首紅後還原，合計45次；原3個冪等／owner／守恆 mutant 另各跑3次，全部保留。
- 精確發布來源：candidate SHA256 `32e3adb65370fd63cf33302c0005996978b3d97d2edd9b52dc17de35e1245e50`；只逆投影三個批准metadata後，原 native SHA、049 block SHA、ff4a archived test SHA 均不變。描述檔必等於獨立固定完整 tuple，不只是同檔自校。
- native enabled／OFF 同步狀態與完整 canvas bytes 相同，storage/RNG/ensure traps 不被呼叫；同seed、正常及部分失敗load、新城、pagehide、reload取消／過期token拒絕通過。真v14.43 fixture往返與未啟用研究的native對照一致，原生建路／Undo／Redo／拆除和滑輪zoom 1→1.4通過。三輪 Chrome errors均空。
- 財務原工作：53 checks、10 negative、failures=[]；v14.43→14.68僅原生既有writer metadata遷移，schema未變。此處不把財務負控制故意產生的diff當成產品失敗，原始報告與故障記錄全部保留。
- fp：相對 base 新增0／變更0／移除0／觸及家族0；與倉庫 fp.json 同樣零變；block 1728條CRC `5ef6eb67`一致；style 165族逐族相同，無家族下降，沒有envLeaves不同警告。未採用新fp/style基線。
- 原圖：smoke artifact共有18張LAB01 PNG（每輪6張），全部逐檔SHA與實際bytes核對。人工實看最後一輪PID4810六張：desktop-day-open、desktop-night-open、mobile-day-open、mobile-night-open、mobile-night-closed、desktop-native-after-close。研究警語／JSON／真按鈕清楚，手機面板未超出視口，結束後面板移除、原生工具及縮放可用。沒有把18張都說成人工看過，沒有真手機／Safari／觸控驗證。
- [smoke 原始附件12640239654](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40300714048/artifacts/12640239654)：8,134,074B，SHA256 `a05461f98b1a621a37c4bd5198094d224a7d74ac2c63ce5f55593d2ef3c1fca6`。
- [fp 原始附件12640901446](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40300714048/artifacts/12640901446)：79,805B，SHA256 `aca43b58ae616900bfafc36bd6c5b326543682454438690e90e806ce6e95c70d`。
- [財務原始附件12640144712](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40300714048/artifacts/12640144712)：30,030,787B，SHA256 `a758f6cd9ea5fe978ff437a66edab64683050a7133d63528fb1558e7fa432442`。三ZIP均CRC與摘要核對。
- 尚未完成：本收據追加後最後head的PR CI、Ready／合併、main CI、自動Pages及新版本公網核實。發佈前公開Chrome主選單可讀14.67/T774，後續AX／截圖API timeout，未當成已驗新版；沒有繞用本地遊戲或修改瀏覽器。沒有050產品接線、正式倉容／車輛／配送／持久保存。
- 合前最後head收據將記入PR67 Conversation（避免為寫自己的新SHA而無限產生新文件head）；仍須真CI及fresh main／T檢查，不以此C1代替。

## 迭代不改壞標準 §8（以上 C1 證據；最後 head 仍須再驗）
- [x] 049原首卡與T775準備首卡均先推後施工；原驗收／家族不改鬆。T775首卡：[857f139](https://github.com/lijiabao1998/GlimmerTown-lab/commit/857f139936eab6aeca9be385e4a5c13131d86e40)。
- [x] 同seed前後native對照、既存v14.43及同版舊存檔往返已在上述CI完成；不以「純研究」免測。
- [x] fp家族＝無；enabled及關閉同turn完整畫布bytes相同；既有門檻不變。
- [x] 無新美術，冬雪／四季／旋轉／遠景／邊緣／疊層的本次新art測試不適用；既有art及fp保持，研究面板必要桌面／手機視口日夜及關閉六張原圖已看。未聲稱真硬體/Safari或新全美術驗收。
- [x] 每條本次新來源守衛均以真source／descriptor變異證明目標首紅與還原；原行為guard及3種mutation保留。
- [x] C1原smoke三連綠，附精確run；沒有重跑smoke或fp本身失敗洗綠。文件新head待PR CI。
- [x] 未跑項目、C1／最終head／正式發布的狀態嚴格分開；沒有虛填通過。
