# GPT-021 固定清單最終只讀覆核

2026-10-12，independent_guard_review。只讀既有來源、raw、log與PNG；未啟動Chromium/8199、未新增或重跑測試、未改repo／原證據、未commit或外寫。

production index仍 `8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed`，五原件不變。`remaining02` **556/556、75.790秒、console0**；80個reuse項按實際recipe重算與02前80項逐值完全相同，八組copy data均等於01。原01仍false（737項、34紅：33個night目的層誤判、1個tractor期望Y誤算），原raw、來源与PNG保存，沒有把原失敗說成整場綠。

| 固定項 | 完成範圍／限制 |
|---|---|
| 近景night | 36款rot0/zoom1.1：33 powered真nightLayer→NL629→main；3原生unpowered嚴格零hit（P-M/F-L/T-L），其正向點燈N/A。原座標／alpha門檻未放寬 |
| Snow | 36款mask零漏出與真snow draw；原weather QA入口後3個正常native日，day304/rainDays3 |
| native尺寸／reflection／FW | footprint直接讀P/root，__t547 dims相符；6個較大RCI嚴格原1×1 reflection引用；36 FW alpha逐byte、每組146個candidate offset/column pairs成立 |
| actors／bubble | 真farmS helper＋藍衣矩形、farmL紅拖拉機矩形、原bubble helper＋icon draw成立。冬季原gate排除farm actors的情況N/A |
| edge／hover | (0,1)1×1真付費550；3×3越界拒絕且money/metadata/undo不變。trusted hover只驗**空edge tile建造preview**；**成屋本體淡出未測，未列N/A** |
| locked | 明示synthetic rk0/cp0存檔，正常native unlock拒絕，tool/selection/money/metadata不變；不是自然經營解鎖 |
| dispatch／metadata faults | 相同具名guard各自真green→red→green；firstFailure從實際check計算，沒有手填紅燈名字 |
| singleasset | 僅P-L一款，原/新各30交錯whole-frame samples；原prebaked median70/p90166ms，新first-use98.5/210.4ms。不能聲稱36款逐款成本或零成本 |
| portrait／EW | 真付費／17日自然成長重做后8個4向actual main/body/identity-transform guards成立；另留day105完整save。不是偽造原bld |
| PNG | 01的27＋02的15，共42份bytes/SHA全部一致；**PNG hash不是全像素獨立oracle** |

兩個probe修正合理：原生T629確實先畫NL629再合成main；02增加真目的層及main composite觀測，沒有改drawing。原tractor y+6在原生ty−6被抵消，oracle redBody已是最終矩形；02移除重複+6，production未改。source插入可逐byte還原至8bb。

證據SHA：
- remaining01 raw：`2306ecffc416a00aa4ac8481c8480e548bbeb74c42c12f93178dd851808284e5`。
- remaining02 raw：`a69166fc34b850226d895d4979b2dfe1d70188c9b59d7e9f84a84daf70ebaab4`。
- 保留alternate save：`517a74678f6208fe7f171df45e3c5acbbfa7dc21b98fd4afcb794cc9a72ce328`，164606bytes；真EW v4、portrait1×2，文件hash吻合。
- 02 inspector／inspected HTML：`7506d7c1b98c23608a3247c008d578dd31bae2fc8e3509c0b6d169a0318fef28`／`d395e843899296092d4f111362108122ecb9c7dd49fb16ad270767c019f6dc57`。

已測固定項無未解紅；成屋hover淡出仍未測，依parent停止新增runner的指示不補跑、不宣稱全覆核。外部圖片tree寫入被自動審核拒絕，未重試；全部raw本機，不宣稱已發布圖片或已完成合併部署。

## 已定runner完成後附記

只讀 `fixed-final-runner021-results.json` 及五份原log；所有log的bytes/SHA逐一等於runner紀錄，未重跑。

- compat02：exit0，43/43，209.683秒；四個原main/new session來源hash正確、console0。
- smoke1/2/3：連續exit0，81.210／81.971／76.710秒，各console0。
- `fp.js --check`：exit0，71.465秒；3179葉子、1728 block559條目與165家族棘輪全部零變動。`fp.json`與`fp.js`逐byte hash仍等於原main54ec，沒有改baseline或縮小範圍。
- fp log SHA：`5eeeed38ebe905b529de195c4e34644f3ed3fdbdaa577c82de63f12ca0879142`；runner結果SHA：`6a4131729354910dd4433116bffad3842c71a8a2e7e9de6a3cef4a3efc4bbe1b`。

既定runner已完整結束；本地固定清單已測範圍可交付，保留上述hover未測與圖片／效能范围限制。

