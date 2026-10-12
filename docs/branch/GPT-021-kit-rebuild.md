# GPT-021 缺失 kit 重建與36款重新驗收

動手前卡面，2026-10-12。業主 10:17 明說「批准」保留五份美術原件、補寫缺失核心 kit、重新查看實際遊戲畫面後再上線。parent 轉交新範圍：獨立分支重建，不稱精確恢復原最終 SHA；必須先交新畫面確認，再合併部署。

## 來源與範圍

遠端 main 核對為 `54ecba5e186c1b2a8b258aae2be2ebe11d13efe6`（v14.40/T738），沒有 open PR。新分支 `gpt/british-use-scales-rebuild-021` 以復原分支 `24a7a92d367d78f153033e8df431af4f64fb7eb7` 的同一 source tree 起步。本地起點 `68de7a12ffc1a7fc692df4b792b0558150f01164`，tree `f04715c10058117acb9c975927aeab1f108b3a17`。

只補寫缺失的共用 kit、明示重建 native mapping／驗收工具與必要美術整合。五份36款形制源碼不變：art 7d198526、hospitality7270c5e8、workplaces51f14212、agriculturefcc80082、infrastructure1a682da2（完整 SHA 見 recovery 收據）。原最終 kit SHA5db827a1 尚未找回；新 kit 有自己的 SHA 和重建標記，不能宣稱命中原版。保留原 rasterizer、palette、既有藝術、模擬、價格、容量、配方及調度，不新增建築 k。版本號、fp.json、AUTORUN-LOG、DECISIONS 不改。

## 先量現況

原 main index blob5890d0ba 已釘住；在修改前執行最新環境的 `node fp.js --check`，raw log 保存至 `/workspace/rebuild-gpt021/baseline/`。復原時只做的 SHA／語法證據與歷史619／14／91摘要不能當作現在遊戲通過。原 raw/PNG/ZIP 遺失，新的全部重新取得。Browser plugin 不可用，使用 repo 既有 Chromium/CDP harness（實際 Chrome、8199、一次只有一個 browser harness），不安裝新瀏覽器依賴。

## 動手前固定驗收條件

1. 五份原美術 SHA 全部不變；kit 正確呼叫原 pixel Scene、四方向世界座標投影及真煙囪煙點，無新全局色調、無額外光暈；36唯一id／12×3；144方向資產可建且不裁切、不浮空、夜光只落在真窗／燈。
2. 實際原生工具放置24款，牛牧場3款由原付費升級，office/crafts/lightfactory9款由原分區自然出生／成長；不能用直接偽造 bld 的場景冒充建造或自然增長。支援同 carrier 的兩款在同城穩定共存，單款確定36款皆接入。
3. 價格、容量、配方與鎖定維持原生；建造取消、重複、失敗、undo/redo沒有額外扣費或標錯資料。RCI 必须完整原partition、起點原LV、所有成員同profile；錯誤／混合／C／unsupported回原圖。矩形2×1／1×2與native車站axis／9天施工不錯。
4. 舊新存檔「讀→存→讀」配對完整native欄位/tiles/stats；新增美術資料僅可選，舊BL/RLE不變，不碰非空業主slot1/2及backups。k53非零crop變體仍為原圖，k22所有原作物、時序、季節與5動物維持native輸入。
5. 白天／夜裡／春夏秋冬／雪有無、旋轉四向、遠景、地圖邊緣、相鄰布局、施工、hover、倒影、行人、煙與燈都在真遊戲中檢查；提供實際遊戲 PNG，不以contact-sheet純資產渲染冒充。
6. 新守衛的期望從獨立原Git檔／native規格與幾何oracle取得，不讀被測sprite的ax當期望。故意改壞asset/anchor/dispatch/metadata各一處，第一個紅燈落在目標守衛；保留原始失敗輸出。
7. 390/360手機與1440桌面的真mouse/keyboardcatalog、取消與建造可用。新舊warm及first-asset交錯至少30樣本，列median/p90與實際影響；不為單次雜訊放寬判準。
8. 原fp其他家族零變動、逃生閥關整幀等同main、原smoke連續3次綠；新的runtime/compatibility/visual raw對當前SHA。獨立覆核實際最後源碼、raw與PNG SHA；不得沿用失去raw的歷史pass。
9. 分支增量提交與遠端小步備份。先交當前重建版實際遊戲畫面與結果給業主確認；收到該畫面確認才進行後續PR／合併／部署。此次重建批准不省略新畫面確認。

## 回滾

新美術提供 `window.__noUseScalesRelease021` 原圖回退；資料可保留但效果關閉時原生邏輯與整幀不變。候選只在獨立分支，main未變；回退使用最後已提交綠點，不清理他人的檔案或存檔。

## 施工紀錄

基線 fp69.7秒完成：葉子、block559、165家族棘輪零變動。kit重建SHA7ccbe0a5、資產層154/154（144方向光柵）及project故意錯位首紅通過；五原美術未變。mapping原tool名bigFarm、station008 NS/EW已校正並接回，當前local index8bb22b69、85 inline script語法與idempotent build通過。真Chrome進城、36目錄與144資產selftest、零consoleerror；尚未宣稱原生36流程通過。

原生流程attempt01在測試出口 `hover=null` 違反原生const hover物件時拋 `Assignment to constant variable`（80.289s），在新款建造之前中止，raw/log保留。測試出口改為清原物件x/y，沒有改production renderer。ordinary-state判準另明確只檢查Boolean override是否為true；原生預設enum timePhase='noon'在God關閉時不是已啟用的override，原值仍完整記錄。沒有關power/water/demand/skyline或改自然成長gate。

沿用原007合法背景來源，初始terrain/age/money/rank是明示QA setup（非自然經營排名）；背景存slot3後經原生continue載入確認正常diff1、非editor、sandbox/God/Boolean overrides全部關閉。新的24直接／3cow付費／9空lot自然出生與成長另取實測證據，未用預種新bld或直接改lv/pw/wa/dem/RNG代替。尚無新樣張確認、PR、合併或部署。
