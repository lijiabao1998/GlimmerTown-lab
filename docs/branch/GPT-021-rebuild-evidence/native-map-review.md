# GPT-021 重建映射核對

2026-10-12；此份是重新建立的 metadata，沒有恢復或宣稱舊 `64d9de69…` JSON 原 bytes。原生規格以 Git `54ecba5:index.html`／v14.40／T738 為準，SHA256 `7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067`。目前 parent 正在新 worktree 整合，下面行號指此固定原生 blob，應按函式名定位。

只新增 `/workspace/GlimmerTown-lab-rebuild021/british-use-scales-native-map021.json` 與本證據檔。讀了 AGENTS、CLAUDE、AUTORUN、DECISIONS、不改壞標準和 T717／T718／T609／T610／T611；新 worktree 沒有 COLLAB 或 .agents/SKILL.md。沒有改 index、kit、五份美術、版本、存檔，也沒有 browser、伺服器、外部寫入或 commit。本輪新圖仍待重新確認，未取得合併／部署授權。

| 分組 | S／M／L 原生 k | 實際 world footprint／原生取得方式 |
|---|---|---|
| 商店 | 276／238／240 | 1×1／2×2／3×3，原生私營零售 |
| 餐飲 | 196／275／220 | 1×1／2×2／2×2；196 是既有觀光地標，M／L 是私營商業 |
| 市場 | 87／240／278 | 2×2／3×3／3×3；87 才有原農貿食物分配及 COV.market，其他兩款沿用零售 |
| 旅館 | 81／82／274 | 1×1／2×2／3×3；原8／40床，274名目60床按實際營運／企業利用率開放 |
| 辦公 | 2／2／2 | 1×1 Lv1／2×2 Lv1／3×3 Lv2；原 office 分區自然成長 |
| 作坊 | 3／3／3 | 1×1／2×1（含1×2）／2×2，起點原Lv1 |
| 輕工廠 | 3／3／3 | 1×1／2×1（含1×2）／2×2，起點原Lv2 |
| 倉庫 | 64／167／165 | 2×2／3×3／4×4；原倉儲／公路配送／貨櫃物流身份 |
| 農業 | 22／63／53 | 2×2農場／2×2溫室／5×5大農場 |
| 牛舍 | 23／23／23 | 全是2×2；原付費Lv1／Lv2／Lv3 |
| 客運站 | 17／55／139 | 1×1／3×3／5×5；L使用原station008 NS／EW |
| 貨運與配送 | 110／167／166 | 2×2／3×3／4×4；原貨運覆蓋／公路配送／聯運身份 |

JSON 的 `groups` 保持 adapter 所需36個唯一 id，每組S/M/L，以及 `id/group/scale/k/tool/sz/lv/bw/bh/mode` 十欄。另附各 carrier 的真正功能讀者、原生造價／解鎖／名目能力與來源、363筆既有 fp leaf 和16筆stationConstruction008的 namespace path／畫布尺寸／日夜CRC。每個 carrier 的 readers 獨立建立；81沒有混入farmFoodU／ranchFoodU／COV.market，87也沒有混入旅館讀者。

必須保留的原生約束：

- **工具名**：UKF021-L的原art spec寫largeFarm，原生TOOLS／doPlace只有bigFarm（74264、87942）。UKP021-L原spec寫hsrStation，它只生成v0..2；新row改用britishStationNS008並列alternateTool=britishStationEW008。五原spec／geometry bytes沒有修改。
- **共用 carrier**：UKU-L與UKM-M共用k240；UKW-M與UKT-M共用k167。以每個root的可選art021存不同id才能同城共存，單棟只選一個profile；不能全局覆寫SPR同一key，也不增加原生identity或容量。還需parent做真存讀／取消／undo／重複／兩profile相鄰證據。
- **RCI**：用原renderer的world origin／完整partition／bw/bh（95988、96009、96027、96046），按起點bld.lv/v匹配；不能用partition.maxLv替代。office所有member都須原k2＋tile.office＋一致office profile；industry所有member都須原k3＋一致industry profile。原Lv1商業深度2、工業最大2×2、其餘cap4×4保留。S/M/L只選分區profile，原需求、自然出生與等級成長決定真正形制；不固定購買、不force-grid。每格原JOBSC×1.5／JOBSI仍各自計算，不從樓層或圖片面積造jobs、配方、辦公身份。
- **牛舍**：原ranch工具始終$180初建Lv1，v=(x×7+y×5)%5（74316）；只v0牛沿用三形制，其他四畜種及Lv4..8維持舊fallback。M/L選項不能直接建Lv2/3，要原upgradeBld／upCost（87032–87049）付費。不存在新的23_2_0／23_3_0原生leaf；新圖按可選profile取得，原lv1圖兜底與所有數值不變。
- **農事**：22保持16作物；53僅原placed v0使用新形制，legacy v1/v2 leaf保持。T397原16日四階段／季節／harvest與autumnbounty強制割茬（85503–85517）照舊：成熟讀base／farmSea，割茬讀farmGrow stage2；新art stage輸入為3。63仍原全年溫室功能。動畫錨點只能屬於新圖每view/state，原farmer/tractor/sprinkler時間與舊圖fallback不動。
- **客站**：stationPlace008（91524）生成NS v3／EW v4，stationAxis008決定owned corridors與ports（91504–91507），成熟工期9；施工stage為age<2/4/7四段，16張原圖保持。age<9直接用原native s與錨點；成熟新圖按axis＋camera轉向。v0..2的舊HSR圖／玩法不覆蓋。父adapter若仍只抽十欄、只比q.tool===toolId，EW alias未因此接線；需保留nativeTools或顯式核對alias。
- **功能不足**：沒有3×3餐飲carrier；兩個3×3市場都不是農貿覆蓋的新級別；牛舍沒有三種占地。167是公路配送，110／166畫出的軌道不增加物理鐵路連接或新列車貨運調度。166原鄰近≥2真rail格的建造條件（73695）保留。

靜態核對已完成：36 spec id及原k／envelope／world dims／Lv逐項符合；十欄無缺值、12個trio與25個carrier正確；9 RCI形制、cow v0、53 v0、NS/EW v3/v4與工期9已斷言；363 leaf與16施工path／w/h／CRC逐筆對目前原fp資料，五份原art SHA全部匹配歷史釘值。這是資料／來源檢查，不是renderer、像素、自然成長、存讀或模擬驗收；未替代遺失的619／14／91 raw證據。

重建JSON SHA256：`f34aeea8c080cd2bcccb984c257deb3cf366bc8b9af4d24a15f87636f45a57a7`，278,100 bytes。每row runtimeVerified=false、rebuildVisualApproval=pending。交root提交與後續實景／日夜四向／尺寸／自然成長／存讀及獨立審查。
