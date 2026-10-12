# GPT-021 固定清單最終 save/compat 只讀覆核

**結論：固定 compat attempt02 已完成且 43/43 通過；本次離線重算支持其兩組完整原生存檔／15 stats 配對與全部 protected raw 保留。** Production 仍為 `8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed`。未發現本固定清單的 save/compat regression，前次缺少的 53/v1、139/v0/v1 實際原生載入證據及 slot after raw 已補足。

本覆核只讀 source、JSON、log，執行純 Node/Python 比較，唯一新增檔案為本報告；未啟動 Chrome／8199、未新增測試矩陣、未重新執行 save02／16 live cars／83 metadata 循環測試、未外寫或轉傳 raw/gzip。此結論只涵蓋固定 save/compat 清單，不是合併／部署授權，也不替代父線另行進行的既定 smoke／fp／CI 驗收。

## 證據身份

| 證據 | SHA-256 |
| --- | --- |
| compat-remaining-attempt-02.json（13,195,813 bytes） | 4561291df4ddc2849f475533c032f7e8ca8e3e6fd8346f3e2fc1791b1d9e2503 |
| compat-remaining-attempt-02.log | 94bdf2b59281a0a854facab7c5a852c30fb72e7636a48a2d0adb1e8c8a416d4f |
| 失敗 compat-remaining-attempt-01.json（保留） | e1e2f0d48e9aa68b58020e52be5f875c02d01e175a8e96ed53994fbce70e279a |
| reviewed production index.html | 8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed |
| immutable main54ec index.html | 7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067 |
| paired-save-oracle021.js | 488a21f91c79182133681ed5665986a9f7a7bbbdc3aeddabb2bbb6a2e0a821b2 |
| probeUseScalesCompatRemaining021.js | fc0fbfd0b1eceff5fa79ddcbc59402db4aadc8a72bdf219b9b1f69a76c407315 |
| use-scales-test-harness021.js | c44590692af85d3653cad0e0e8f81b2cb1e66881bc4d87bebb4c8dba2a9c4dd3 |
| original day88 native-city-mature36-021.json | c286ff084fa9f50454180067f95dc719514a693589051036a9af65e697edb492 |

已從現存 test harness literal 重新產生 inspector string，核對四個 arm 的 inspector SHA `7506d7c1b98c23608a3247c008d578dd31bae2fc8e3509c0b6d169a0318fef28` 與 reversible insertion 後的 inspected source SHA 全部吻合；原 harness SHA 仍為 `3e86ecaa828fe32a61ffe88a89f420868a6911dc194c6e6a627efdcb1ac28cf6`。沒有將 candidate helper 偽裝成 main 原生實作。

fixed-final-runner 的 compat 子命令 exit0、209.683 秒，log 最終明記 `{"ok":true,"checks":43}`。runner 後續 smoke/fp 還會更新其彙總檔，因此本報告不把該可變彙總的中途 SHA 當定稿證據。

## 真實執行協定與失敗保留

attempt01 的 main 兩個 session 均因測試呼叫 `use021NativeBase` 而報 `ReferenceError`，接著因缺 main checkpoint 而無法比較；rebuilt 的兩個 session reader/storage 通過。該失敗 JSON、log、當時 sources/receipt 原樣保留，未改成綠。

attempt02 的四個 fresh Chromium session 順序為 main/rebuilt fixture0、main/rebuilt fixture1，各自 isolated profile。main 端只讀 `SPR.bld[k_lv_v]`；rebuilt 才使用 candidate resolver/nativeBase，比對其返回 exact original base。四個 session 都 browser clean、無 errors。

四個 bootBeforeFreeze 實際為 day93，**不把 boot 階段 incidental ticks 當待比較輸入**。callback 先 `N021.running(false)`／speed0，再把該 fixture 原始字串重新寫入 slot3，透過真 `GV.load()` 重建世界，保持 frozen，再繪四視角並 native save。四個 checkpoint 都回到 fixture day88、visT55、runningfalse、speed0。此為 **fresh cold boot 後 frozen native re-load protocol**，不是「boot 首次自動載入從未推日」。

simAcc 等未序列化 runtime 仍可保留不同 boot 剩餘值；本協定在停止 advance 的時點比較全部 save/stats，沒有宣稱所有未序列化 runtime bytes 相同或隨後任意相同真實時長的模擬已被比較。

## 合成 fixture，非自然建造舊變體

| Fixture | 完整輸入 SHA-256 | 原生根 |
| --- | --- | --- |
| farm53v1-station139v0 | 520a6939cc4dbf004d566bb7f403b7cecde74610724c833d7ea6b0fe26233c90 | root964 k53 Lv1 v1；root976 k139 Lv1 v0 |
| farm53v1-station139v1 | 163f83eb6a03b83d4b671fefb98f7be92a5a7826b5b9a9989e7225772cdb9c60 | root964 k53 Lv1 v1；root976 k139 Lv1 v1 |

已獨立從原 day88 save 只改這兩個 BL.v 並 `JSON.stringify`，所得 hashes 與 report 相符。原 native kind、Lv、age72、5×5 footprint、utilities、其他 BL/RLE/存檔欄位及既有 83 visual metadata 不變。這是**明標 synthetic legacy variant fixture 的真瀏覽器 loader 測試**；不是歷史玩家存檔，也不是這三種舊外觀經自然建造所得。未增加建築功能、容量或模擬規格。

每 arm 兩根×四視角，共8 reader checks；四 arm 共32。每筆 baseExists=true、hasCandidate=false、k/v/age 正確。rebuilt 的 legacy reader 與它自己的原生 selected base 是同一物件，即使 fixture 留有原 UKF021-L／UKP021-L metadata 也沒有接管舊 v。存檔中兩個目標根 tuple 與其 fixture 完全相同。

本固定清單覆蓋 53/v1、139/v0/v1，沒有把 v2 或其他未列變體聲稱為本批冷載入通過；沒有新增試驗要求或矩陣。

## 全欄位精確重算

對兩個 fixture 分別呼叫 `PairedSaveOracle021.compareCheckpointPair(rebuilt, main, {requireNonemptyVehicles:false, requireArtMetadata:false})`；重算的完整結果物件與 report 最後兩項 `data` 深度完全相等：

| Fixture | 全 schema | 實際 native 欄位／雙 absent sparse | 完整 BL 根 | encoded／decoded RLE | 核心 stats |
| --- | --- | --- | --- | --- | --- |
| 53v1 + 139v0 | 101 | 83／18 | 121 | 38／38，精確 | 15，容差0 |
| 53v1 + 139v1 | 101 | 83／18 | 121 | 38／38，精確 | 15，容差0 |

再用不引用原 oracle 的 Python 比較器：解析兩側 full raw、只區分 top art021，全部剩餘 native JSON 包括 z/encoded RLE 一致；从 immutable main 的 RLE_F 取38字段，全部 decoded 為5184格且逐字相同；完整 BL 的順序、長度、v、tail 及全部 native supplied 欄位都相同。全部15 stats（dem 的1/2/3分量在內）及 checkpoint phase 也一致。沒有刪 BL.v、做 numeric tolerance、忽略未知 native 欄位或掩蓋 native migration。

art021 的83條只由 rebuilt 保存，main 忽略這個可選 visual field，故 native pair 豁免它有明確理由；其餘 native 不豁免。101 是完整 schema 審查，18 sparse 系統雙方 absent，不能宣稱這18個欄位有各自非空輸入演練。

兩個 fixture 的四 snapshots 全部 stats 一致：money99844402、pop0、jobs312、day88、buildings425、poweredBld118、roads326、zones28、happy0.43、dem{1:0.3387605225957592,2:-0.04953968253968264,3:0.3325}、cars0、fires0、ruins0、weather0、buses0。此批是 load compatibility，零 actors 不替代先前的16 live cars證據。

## 原槽位完整 raw 及原生控制保留

四 arm 各有九個非空 protected before/after 真字串，均完整留在 `checkpoints[*].storage`。用 oracle 重新比較，結果與四個 storage check data 完全相同；另用 Python 逐字比較所有 **36 組 before/after 字串**，全部相同，非 null==null 或 length-only 判定。每 arm 的 legacy key、slot1/2 normal/sandbox及各 backup 都齊全，selectorBefore/After 都為3。

每 arm 的 set/remove/clear audit 均是空陣列。source wrapper 三者都已記錄，直接 delegate 原生 API；這是零寫入企圖與 byte preservation 證據，沒有稱為阻擋式 guard。disposable profile 與 synthetic owner sentinels 沒有接觸真業主存檔。

四個 checkpoint 的 sandboxfalse、Godfalse、所有 boolean overridesfalse、freezeClockfalse、disastersOntrue、diff1、editorfalse；沒有關閉原生 hazards 或設定假需求。timePhase="noon" 未啟用 freezeClock。原始 screenshots 留在本地，其 actual Chromium 宣告及四個 PNG 的 name/SHA 存於 attempt02 `photos`；不是合成渲染示意，也没有在本報告聲稱整城 main/rebuilt screenshots 相同（其他36款新圖會改變畫面）。

## 既有驗收保留與剩餘事項

[final-save-mapping-review.md](final-save-mapping-review.md) 的 save02 三輪、83 art 保存、13 malformed 及正常 advance 16 cars 證據只被引用，沒有重跑或改寫。save02 的既有 native 重讀 jobs282→283→284等行為限制仍成立；本 compat 批不改成整檔 input-byte-idempotence 宣告。

原先「尚缺53/v1、139/v0/v1實際原生 load」與「未留 slot after raw」兩點，對本固定 compat 清單現在已補足。這兩份 fixture 仍是 synthetic 且本次 cold pair 只有 frozen reload/save 一輪，沒有聲稱自然建造、歷史玩家檔來源或此批另做多輪往返。固定清單未發現未解的 save/compat 問題；沒有排入新測試。原 raw/gzip 拒絕外傳限制保持有效。
