# GPT-021：36款英式實用形制正式整合

2026-10-12 02:23:50 UTC，業主明確說「那你直接上線吧 只有這一次，相信你的質量」（Sentinel_43ac857caee8819184427e2e018335f1）。parent授權僅本輪36款與必要發布修正：整合、適用全套測試、獨立審查、draft PR、exact-head CI、合併Pages及正式站驗證。此次免再次圖片確認，沒有授權後續美術／其他庫；Library403不繞過。

候選來源：`d389104424c96ba659b7c9c02d3f4a8a6fb49c7d`。2026-10-12重新GitHub唯讀核對：main仍 `54ecba5e186c1b2a8b258aae2be2ebe11d13efe6`，v14.40/T738，open PR0，main smoke及Pages success。shell git fetch CONNECT403；正常GitHub工具讀成功，repo權限push/admin，使用既有origin對應同一Lab repo的官方GitHub操作，不改remote／帳號／proxy。

發布分支 `gpt/british-use-scales-release-021` 從當前main建立隔離worktree；僅帶入本輪已批准來源、正式接線、驗收與發布卡，不把候選場景作正常玩法。原候選、44原圖及ZIP保持原bytes。相關COLLAB／.agents/skills未在原repo或runtime提供；已讀AGENTS、CLAUDE、AUTORUN、DECISIONS、迭代不改壞標準與正式映射覆核。當前明確授權覆蓋雲端tests/合併發布，不重問圖。

## 動手前正式方案

36是24個已有固定用途載體形制＋3個原生牛舍付費升級形制＋9個RCI自然成長形制，沿用原native k/價格／容量／供需／產業鏈／調度。正式形制選擇入口只選已有工具及可選視覺profile，沒有新的模擬身份。RCI／牛舍在UI清楚說明取得條件，不能冒稱36個直接購買身份。

共享k240的retailL／marketM、k167的warehouseM／freightM以逐棟profile共存，保留native v，不能用global group/Map getter替換整城。profile在原生doPlace與同一undo交易內寫入；RCI分區標记由實際native出生繼承，日後以真partition.w/h、起點lv/v、完整office旗標及一致profile純選圖。混合／不支持的尺寸、lv與普通商業立即回批准圖，不改分組／自然成長／災害。

保存只加可選稀疏art021欄位，缺欄位舊檔完全原義。完整原85欄、bl與RLE不改；有profile者須可反覆存讀，undo/redo、升級、剷除／重建及火災安全。農作物仍沿原crop/season/growth dispatcher，牛舍只v0，其他四種動物保留；客站139施工與axis/rail原功能保留。

只增加純sprite resolver與相關原生讀者最小接線，正式入口self-contained。批准SPR與普通存檔畫面不因新增選項整城改圖；每profile／view保留穩定sprite物件，native metadata用真k/lv/v/bw/bh，衍生snow/wet/bubble/silhouette缓存不得借旧geometry。相應煙、倒影、ghost、遮擋、施工及農事anchor均核實，不支持者如實NA。逃生閥回批准圖，保持profile資料供再啟用。

## 必須驗收（實作前寫定，不能改鬆）

1. 36款在未載候選adapter/scene的正式index有真實入口／成長／升級採用；24固定以原生付費工具建造，兩共享carrier同城不同profile；9RCI有真native spawn／age／upgrade／分組證據，不用art574指定成熟根。三cow階段為真paid升級，另外4動物及lv>3原義保留。
2. 原native costs/footprints/k/v/functions保持；取消、duplicate、undo/redo、原rank鎖與非法地圖邊界沿native。只有新增profile可選資料，原85欄／完整native世界與短視野同種子stats配對；有profile/無profile/缺欄位舊save兩次來回及非空owners1/2＋backup字節保留。
3. profile混合、未知/畸形load資料、普通C/混office、unsupported RCI dims/lv、火災改形、剷除重建、原種植日曆、原畜種與原station axis／construction均有行為守衛；無全域同k覆蓋。
4. 每款四向、日夜、冬雪有無、四季、遠景、邊緣、相鄰、hover、真煙點、可用倒影、全夜層及施工／升級來源正確。完整canvas來源採用與profile對應，整幀號誌/erase守衛不關信號，門檻沿repo。
5. 故意profile串圖、save丟profile、方向/矩形anchor、漏光、既有讀者漏接線等壞法首次報紅落在目標守衛；單純source比對不算行為驗收。
6. 新自檢接smoke；原smoke同正式source連跑3次全綠、fp --check完整葉子/超街區/165族守衛。若新增專用art庫，與批准d389來源獨立bake逐RGBA比對；既有SPR及基線未改者零差，不隱藏多改葉子，不改鬆style/fp門檻。
7. 正式工具/形制入口真mouse/keyboard、desktop1440、mobile390×844及360×800可達，不遮原介面／不溢出；首次用圖與暖畫至少30樣本交錯A/B留median/p90，以repo標準判斷實際卡頓，不拿macOS雜訊擋門。
8. 獨立source與證據覆核完成；所有report/log/截圖真實且sourceSHA同發布版本，原失敗證據保留。未量項標未量。
9. 推送前再核main/branch head；draft PR只對本Lab，所有適用CI讀exact tested head與原jobs/steps/artifacts，必需閘門全過才merge，不force。合併前再核main未前進；Pages只部署green main。
10. 正式站真網址確認部署SHA、版本及新入口、36各自取得方式/共存、保存與三種形制/螢幕實景，console乾淨；不以本地原型樣張冒充已上線。

## 基線與進展

原生fp完整check已跑：40.4秒，葉子、block559及165風格族全零差；log保留 `shotsGPT021-release/baseline-fp.log`。Browser plugin未提供；遵照repo的原生Chromium/CDP harness與8199，僅disposable slot3。候選舊235等測試只能支持原美術，不算本輪正式整合驗收。

尚未完成：正式整合、上述新runtime驗收、獨立final審查、PR/CI/合併部署及正式站檢查均待執行。Library原403保持原證據，不另改路徑繞過。

回滾：正式feature逃生閥還原批准視覺；如需撤回發佈，用GitHub正常revert回前green main（不force），保留可選資料相容讀者。本卡後續逐項追加實測結果。
