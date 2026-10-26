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
