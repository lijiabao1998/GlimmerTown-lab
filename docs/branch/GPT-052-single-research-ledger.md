# GPT-052｜單一暫態研究帳接線（LAB-02 後續；Draft 設計首卡）

日期：2026-10-27。此首提交僅凍結計畫，產品未施工、測試未跑；不以卡面存在代表已實作。

## 本次精確設計授權
2026-10-27 03:22:20 UTC，業主訊息 Sentinel_ac549f967518819194344213bd20f7e6 直接回覆設計卡/Draft確認「允許」。本次只建立設計首卡、候選分支與Draft PR；不施工產品、不修改正式經濟/存檔/倉容平衡、不合併、不發布。下列接線與驗收是凍結的後續設計條件，不代表本次已獲產品施工或發布批准。先前平台拒絕及中止保留，不繞過。

## 來源、方向與權限
唯一倉庫 lijiabao1998/GlimmerTown-lab；fresh main dde12ada3d72110d6a0bef3132eef86b871472ea，T776/v14.69/r223。main CI40441891872、原自動Pages40442793911成功；公開HTTP200、12043120bytes、SHA256459f580274773bd229f1322474f2db1d42048e31d4a7b66ad40512e1a3bfda67，真URL AX顯示14.69/T776。公站後續完整snapshot/screenshot逾時，不冒稱完整互動已驗。
PR68已收納獨立050核心，但index未接050。開工查無其他open PR；現有三Claude分支最後提交為2026-10-04、09-24、10-14，沒有碰它們。GPT已用號最高051，本卡052，未配發布T號。
對應main方向原話：「本次第一階段以獨立的影子物流帳研究為主。」「未經另行批准，不得將影子交易的數值灌回正式經濟。」
沿既有方向的隔離研發及Draft界線；PR68發布批准只屬PR68，**不是本卡Ready/合併/發布批准**。本卡設計先行；研究接線的實作必須保持下列界線，若需產品倉容/經濟/持久化或更改受保護守衛，停止提出有界裁決。
**首卡凍結 fp 家族：無。**

## 唯一目標
消除049研究入口與050容量候選之間的雙帳風險：一個明確、預設關閉、使用者主動開啟的研究工作階段，用同一份私有貨物/事件/保管權/FIFO帳支援已驗證的容量閉環。只有暫態研究語意，不稱真實原生商品庫存或配送。

## 明確不做
- 不綁k169或任何原生建築的正式庫存；不改容量平衡、價格、money、food流量、人口、工作、客流或RNG。
- 不新增save欄位、不遷移舊研究session、不把重載後重新生成貨物說成恢復運輸；不碰玩家槽位。
- 不做LAB03道路配送、貨車、貨列車、隱形軌、新路權或多商品。
- 不擴200座/20波美術、不改光影/全局密度/引擎/性能架構。
- 不改.github、既有smoke斷言、fp/style、harness/gallery、規則或任何測試/性能門檻。
- 不自動Ready、合併、部署或手動觸發Pages。沒有本機遊戲/harness測試。

## 接線設計限制（施工前凍結）
1. 單一ledger，單一session/token，單一authoritative owner/location/qty/event revision；不得維護049與050兩個可各自造貨的live帳再同步。
2. 已發布049行為是相容契約；保留原始來源及測試作歷史A/B，不能刪斷言或靠改expected使候選過關。050純核心保留可追溯來源，必要的接線適配獨立標示，不聲稱原API本來有容量。
3. 若使用index內研究入口，僅預設關閉的明示研究路徑；逃生閥關閉必須保持原生狀態與完整畫布。預設無研究DOM/事件處理副作用，不能注入第二份049或不相干native程式。
4. 同一研究帳顯示來源、每批owner/location/qty、used、waiting與未發數；capacity10/food20/A7/B8/餘5只作明示QA/研究manifest，不偽造原生生產收據。
5. 主動開啟不應偷重建活躍session；重複open只一面板；關閉/end、disable/kill、load入口含部分失敗、newWorld、pagehide/reload均使舊session失效，舊token不能繼續。
6. 警示必須明示「研究貨單；不影響正式經濟；未保存，重載即遺失。」；拒絕無權威production receipt。不得以城市日流量當可mint庫存。
7. 原生load/newWorld委派保留this/args/return/throw；研究清理失敗不能毒化原生流程。面板輸入不穿透原生地圖；結束後恢復原生zoom/catalog。
8. Pages現配置只發布index及shots；不得偷偷改部署清單解決資源載入。若單檔發布限制需要新的受保護workflow/tools範圍，停在設計並另提請求。

## 硬驗收（不准事後放鬆）
- [ ] 精確來源tuple、目前main、候選head/tree、原049/050核心與歷史fixture hashes；同源對照，不拿PR68綠燈代替新候選。
- [ ] 完整原049歷史A/B、050純核26守衛/原48行為lineageUI負控/31來源負控保留；接線新增真變異first-red後restore，不能把syntaxerror當語意負控。
- [ ] 單帳容量0→7→7→0→8；B滿倉等候保留原owner/location/qty、A出庫後B重驗；守恆20、未發5、無split/mint/重複計數、FIFO越隊、event語義衝突/revision/冪等漏檢。
- [ ] 049無容量相容模式、單帳新入口、舊token拒絕、資料拷貝/壞輸入與上限；多開入口不能出現兩份live ledger。
- [ ] 同源OFF原生state/full canvas相同；啟用研究原生經濟/save/RNG/storage/建拆UndoRedo不變；正常/部分失敗load、舊14.43往返、新世界、重載等生命週期。
- [ ] 原CI完整smoke三輪、fp零新增/修改/移除/觸及家族且無style下降/envLeaves漂移、原fiscal53 checks/10 negatives；不靠rerun賭過。
- [ ] 真CI Chrome桌面/行動視口×日夜×六狀態原PNG、按鈕/JSON捲動/close/native zoom與console檢查；逐檔SHA與人工看圖分開列，真手機/Safari未測即標未測。
- [ ] 獨立只讀來源/安全/差異覆核，§8逐條真實收據、原錯誤保留；僅交Draft與原圖，業主另決發布。

## 停止與回退
任一原守衛失敗先保留原證據；僅在本卡界線修復，不能放寬門檻。需要正式商品/倉容/保存/新交通、受保護workflow修改或更多fp家族，停止，不擴本卡。候選不合main，公開T776不受本卡影響。此首卡無產品差異，因此目前沒有新測試結果、圖片或發布成果。
