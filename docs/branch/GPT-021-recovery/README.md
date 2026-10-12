# GPT-021 重啟後原碼復原紀錄

狀態：**部分原碼已精確恢復；尚不能建置批准版本、重驗或發布。** 2026-10-12 重啟後，原 release 工作樹與未推送的 Git 物件、原驗收 JSON、遊戲 PNG、ZIP 已遺失。未用重畫或早期共用 kit 代替批准原碼。

本次工作只在 `lijiabao1998/GlimmerTown-lab` 的 `gpt/british-use-scales-recovery-021` 備份復原來源。main 核對仍為 `54ecba5e186c1b2a8b258aae2be2ebe11d13efe6`，未開 PR、合併或部署。復原分支的 `index.html` 與 main 原 Git blob 都是 `5890d0bae66feb8270447e7f7371f5ee92fcfd3b`；新增來源檔尚未接入遊戲。

## 已恢復的批准形制原檔

五檔均從原完整工具輸出重播，SHA256 完全命中重啟前批准版；`node --check` 通過。五檔遠端 Git blob 也與本地原檔相同。這證明原碼字節一致，沒有證明目前遊戲驗收通過。

| 模組 | 原 SHA256 | 已恢復形制 |
| --- | --- | --- |
| british-use-scales-art021.js | 7d198526e46ac209d4cf892656bcc73fd95f8115cb1a07140518b933c6276de8 | 商店 3 |
| british-use-scales-hospitality021.js | 7270c5e8b01626e80ddd625fa22b988ed956bbcc88f9be3141f34a6c56b81cf5 | 旅館、餐飲、市場，各 3 |
| british-use-scales-workplaces021.js | 51f14212f00e214d4654d86f65af33f49df9575e53835e5f3820dba8859e4144 | 辦公、作坊、輕工廠，各 3 |
| british-use-scales-agriculture021.js | fcc80082b4732b14b29b741018e8afcc1b67a6aec55f3b4735c277a406654781 | 農業、牧場，各 3 |
| british-use-scales-infrastructure021.js | 1a682da294d788bccb953e0adef45dada8da632be8c6fae0cf76c944ca02a7bc | 倉庫、客站、貨運場，各 3 |

`restored-form-specs.json` 從這五個原檔讀出完整原 spec（平面、楼層、屋頂、入口、院落與 masses），驗得 36 個唯一 ID、12 組，每組 S/M/L。只讀 spec，沒有呼叫 build、渲染或遊戲流程。它不是遺失的 release native-map。

這些是原有用途的美術形制，不新增容量、產業鏈、調度或價格。牧場三款仍為原牛牧場 2×2 的付費 Lv1/Lv2/Lv3；貨運中款的原 distributionCenter 是公路用途，不因裝飾鐵道得到鐵路功能。原功能映射仍須在完整恢復版本上重驗。

## 已恢復的整合原碼

`program-sources.json` 記錄原來源、完整雜湊與語法核對。

- 原完整 runtime（53 非零作物變體回退修正之前）：12,880 bytes，SHA256 `d59064caa414dc258dbc2e5d0328bd6cb071bdac03a030a8b9844a5e31768cf2`，命中歷史原 SHA，保存在 `original-sources/`。
- 原早期 build：SHA256 `e898be1a829fac68f34773734dae27201045d943553aca3edc23d887414ff3e0`，命中歷史原 SHA，保存在 `original-sources/`。
- 保存的後期 build：8,155 bytes，SHA256 `f7cc3f5c7e0a3fb784446a8c73d5e5ff8568dd41bac37ff028dfae2e7bdc42c7`，命中歷史原 SHA，根目錄原檔。這個原碼的 tractor 條件仍為 `s.farmerPath`；後續最後修改的完整原檔未恢復，不能將它稱為全部最終整合狀態。
- 根目錄 runtime 是精確 d590 原檔加原對話保存的單行 `if(b.k===53&&v!==0)return base;`。現 SHA256 `abae519afda88e46e6f85358b4d5639505c78699dfb44c05efbf86f7aacbc050`；原最後 runtime 的獨立 SHA 沒有留存，不能宣稱有原最終 SHA 核對。

沒有執行 build。沒有改 index、fp.json、版本號、AUTORUN-LOG、DECISIONS 或存檔。

## 缺失與真正阻礙

1. **最終共用 `british-use-scales-kit021.js` 缺失。** 批准 SHA256 為 `5db827a1d93c4650d647cab0d7307970510d0a6fcd9fc86ed6960b29b7520696`，原 Git blob 為 `3e2c9dadf8aa78a548f3cdd844f37010187de1fe`。兩份獨立完整早期 cat 都是 5,984 bytes／SHA256 `98ca332bc1f50406ed61fd5541f3b2385f9fb0eb27793a5ed67027bbc3616102`，不符合批准版，未接入復原 repo。保留到新增 `project`／`smoke608` 之後的尾 17 行，但 `project` 定義、chimneyHeads 宣告及完整後續修改缺失。所有原代理已覆查，未持有最後全文。已請 parent 提供原 patch／完整原檔；Personal Context 回傳不可用。這是停止完整建置與发布的直接原因，不能靠重新設計替代。
2. 最後 release native-map、候選 adapter／場景、完整 Acceptance／Flows 探針、完整 native inspector 原檔未恢復。保有部分原探針文字與 reader review，標為歷史文字；不能當作原 raw 或當前通過證據。當 kit 原碼齊全後，遺失的驗收程式與映射 metadata 需從明示條件重建並重新核對，不能冒稱原字節。
3. 原 release index（最後已知 SHA256 `d0a58a16430e385df751297cad4c2c908ba419b7befdf2b1b251de86de3546fa`）與原 Git commits `d389104`／`689636a` 的完整物件未恢復。原大 index 上傳未留下可用的完整 blob；目前沒有候選版本接入遊戲。
4. 原 619／14／91 raw JSON、原實際遊戲 PNG、ZIP、fixture 存檔、性能樣本已遺失。历史摘要沒有被當作現在通過。原 36 同城共存仍有失敗的紀錄也保留為失敗，未推導發布就緒。

## 可繼續工作的條件

收到原最終 kit 的完整 bytes 或完整 patch 後，先核對上列批准 SHA；再恢復／明示重建整合資料及驗收工具。對實際候選重新取得完整遊戲驗收 raw、實際遊戲截圖、日夜／四方向／季節／相鄰布局、建造取消／重複／存讀、旧53作物回退、共享載體共存、手機與桌面流程、性能、3 次 smoke 與完整原像素守衛。只有實際最終頭通過、且符合 parent 當輪指示後，才可繼續 PR／合併／Pages／公開 URL 核對。

parent 隨後回報：另一份工作區證據共 3,926 檔、47 壓縮包內 3,353 項、三 repo 的 1,200 Git objects 也未找到最終 kit／目標 SHA／原 patch。這是 parent 的盤點，不是本工作區執行的搜索。parent 正向業主詢問保留五份原美術、補寫缺失 kit 並重新看圖的新範圍；確認尚未收到。最新指示為只完成現有核對原件備份與缺口盤點，暫停合併／部署。本次沒有重設計、補寫 kit 或要求重新核准原件備份。

## kit 已知缺口與可獨立驗收範圍

早期全文與批准階段尾 17 行之間，確知有下列介面變更；它們不構成完整差異清單，也不能證明其他原行未變。

- 新增並導出 `project(x,y,z)`：最終精確函式全文缺失；作坊／輕工廠原碼的指定煙點 (`A.project(21.0,7.4,47.8)`) 與共用煙囪煙點依賴它轉為精靈座標。runtime 的農夫／拖拉機座標另有已恢復的局部 `project`，不能拿該二維函式冒充缺失的 kit 三維原文。
- `chimneyHeads` 的宣告／初始化及其作用域原文缺失。保留尾段確定 `chimney` 會加入 `project(x,y,z+5.6)`，但不能由尾段補齊完整原碼。
- 保留尾段確定 `finish(extra)` 新增 `smoke:[]` 與 `smoke608:chimneyHeads.map(p=>p.slice())`，並在 return API 導出 `project`。這些精確行已獨立保存於 `original-fragments/`，沒有拼成假定的最終 kit。
- 缺失尾段之外任何後續改動的完整原始 patch；目標 SHA 只能核對，無法反推出原碼。

目前安全且已完成的獨立核對：五份原美術 SHA／遠端 Git blob、原 program-source SHA／明示的單行差異、語法、秘密字串模式掃描、36 個 spec 的唯一性／12×3 規模、index 與 main 原 blob 一致，以及 Git bundle 可讀性。沒有執行遊戲。

三款零售 build 本身不依賴共用 kit，可在恢復專用驗收場景後獨立做三款四方向畫面／像素驗收；這只涵蓋零售，不能代表另外33款或正式整合。原三款場景及原證據也遺失，這項新驗收尚未執行。未改的 main 可以獨立做 baseline smoke／fingerprint，但不能證明36款候選通過。33款共用 kit 的畫面、全36整合、存讀／共存、性能、正式 smoke／像素守衛及公開版本验收，須等完整 kit 與整合／驗收工具齊全後重跑。

## 耐久備份

每個形制模組已各自建立本地 commit，另逐檔保存遠端 commit；runtime/build 原碼也提交並保存遠端。`local-module-commits.json`、`remote-module-commits.json`、`remote-program-commits.json`、`remote-geometry-proof.json` 記錄真實結果。初始完整 Git bundle 與復原增量 bundle 保存在 `/workspace/recovery-gpt021/snapshots/`；另打包原始重播文字與片段，保持原檔及未驗證資料的區別。

本分支的煙霧 CI 若綠，只驗到未變的 main index，不能證明未接入的36款通過。尚無新遊戲截圖或本輪完整遊戲測試結果。
