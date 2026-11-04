# T785｜LAB-07 公鐵聯運全程交付（原 DSK-025／PR81，經整合 PR84；重新出卡）＋本批發布 v14.72

日期：2026-11-04；Claude。卡面先推，補齊程式在後。隔離研究版：玩家看不到，不進正式經濟與存檔。前置 LAB-03＝T782、LAB-06＝T784。

## 業主批准
- 同 T782（2026-11-04：先合成隔離研究版、走整合版 #84、批准 052 投影器擴充，不批准 W10）。
- 業主同日選項原文：LAB-07「原卡是事後才補驗收」，業主選的處理是「事後補驗收的那張重新出卡凍結再重驗」。

## 為什麼重新出卡
- 原卡 DSK-025 的卡面、程式與 PASS 結果在同一個提交（b346f5f），驗收不是動手前寫的。
- 本卡的驗收在補齊程式之前凍結；原卡留作紀錄，不當驗收依據。

## 原實作的問題（審查）
1. 方向要求「同批身份和帳」：
   - 原實作的鐵路段不管 LAB-06 的路權；
   - 批次是呼叫端自己宣告的，不是從 052 研究帳拿；
   - 整合版另加的 DSK-029 結算（沒有卡面）不核對批次、數量與商品，存了 sessionId 卻不比對，也不自己取得或釋放路權。
   - 業主選的處理是把 DSK-029 退回。
2. 沒有真的轉運點：道路段終點與鐵路段起點可以相隔很遠，貨等於瞬移。
3. 進行中再 `start()` 會靜默換掉舊行程，數量 10 的批次就此消失，沒有取消紀錄。
4. 開始後不再檢查地格；讀檔後還看得到上一座城的行程。

## 凍結驗收（動手前寫死，之後不改鬆）
- A1 同批身份：一趟聯運只能用 052 研究帳上的一個批次。
  - 批次必須存在、狀態 `SOURCE_READY`、持有人是起點；數量與商品取帳上的值，呼叫端不能另給。
  - 不符就拒絕，理由各自分開。
- A2 路段：道路段走 T782 的 `startBetween(起點物流建築, 轉運 k166)`；鐵路段走 T783 的 `runBetween(轉運 k166, 目的 k166)`。
  - 轉運點必須是同一棟 k166：道路段終點貼它的前接，鐵路段起點貼它的軌。
  - 不是同一棟就回 `no-interchange`，不准瞬移。
- A3 路權：鐵路段開跑前要透過 T784 取得路權，到站或中止後釋放；拿不到就在轉運點等。
- A4 帳：
  - 到站時對 052 帳下 `HANDOFF` 給目的地，持有人與位置必須照帳上的監管鏈；
  - 中途失敗或取消下 `FREEZE` 並寫原因；
  - 全程數量守恆，不新增也不消失。
  - 這是影子研究帳，不是正式經濟。
- A5 狀態：進行中再開 → `busy`。每一步重新檢查該段的路或軌，被拆就停在原地並回理由。讀檔、開新城、pagehide 取消並 `FREEZE`。
- A6 面板顯示「未保存」提示，位置不與其他 LAB 面板重疊；閥門 `__noIntermodal057` 在安裝當下已開 → 整段不安裝。
- A7 測試：
  - 純 Node 測試，用 `vm` 跑執行期那份，並以假的 053／054／055／052 介面驗 A1–A5 的每個理由；接進 `smoke.js`。
  - 每條新斷言故意改壞試過，首紅落在目標。
- A8 Chrome 探測（固定種子，原生開發者沙盒）：
  - 物流建築→道路→k166 轉運→鐵路→目的 k166 全程走完；
  - 052 帳上同一批次從 `SOURCE_READY` 變成 `HELD`，數量不變；
  - 另一棟不同的 k166 當轉運點回 `no-interchange`；
  - 途中拆軌 → 停住，鋪回 → 繼續；
  - 讀檔取消並 `FREEZE`。

## 本批發布（T782–T785，經整合 PR84 一次合入，一個版本）
- R1：只收業主批准的範圍：053／054／055／057 四個區塊與各自的核心、執行檔、測試、探測、原卡。不收的有六類：
  - #84 裡 LAB-09／10 的副本（main 已是 T780／T781 修好的版本）；
  - LAB-11 與 LAB-12 的探測與卡（另卡）；
  - AI 提速的檔（屬 #71）；
  - 一次性 `tools-*.cjs` 修補腳本；
  - 寫死 `C:/RUST` 路徑或依賴本機分支的探測；
  - V67 文件包。
- R2：052 投影器擴充（業主批准）。
  - 新增區塊的唯一性與不變檢查，移到合併邊界檢查之前，讓改壞任一區塊時首紅落在該區塊自己的斷言，不再全落在 `exact052 insertion boundary`。
  - 每條新斷言都有負控制；既有 052 斷言的判準不放寬。
- R3：整幀比對。四個閥門都在安裝前開著的候選頁，和 main 原生頁在同一固定種子、同一視角下，畫布逐位相同。預設（閥門沒開、面板沒開）也要逐位相同。
- R4：產品 `index.html` 只多四個釘死區塊、加三處版本字到 14.72／T785。照 2026-10-28 常設規則重釘 049／050／052，重釘表寫在本卡。
- R5：本機跑全部新測試、四支探測、smoke 3 連綠、`fp.js --check` 零變動。
- R6：推 `ccr-e2781bc4-vlojg3` 開 PR，完整 CI 綠才合，GitHub squash 釘在驗過的 head。
- R7：合後核對 main CI、Pages、公開網址。
  - #84 留言後關閉；#74、#75、#76、#81 註明被本發布取代後關閉。
  - #82（LAB-11）另卡重做。

## 不做
不註冊站別、不改正式經濟與存檔、不改交通規則或容量規則（都屬［等業主］）；W10 不改（業主沒批准）。

## 施工記錄（2026-11-04，Claude）

### LAB-07 本體（A1–A8）
- 介面：`GV.intermodal057.start({batchId, originCustodian, destinationCustodian, roadFrom, roadTo, railFrom, railTo, capacity?})`。
  - `advance()` 一次做一件事：道路一格、轉運、鐵路一格或交付。另有 `cancel(reason)`、`snapshot()`、`open()`、`end()`、`disable()`。
  - 理由清單在 `reasons`。
- A1 帳：
  - 批次、數量、商品取 052 帳上的值；呼叫端給 `qty`／`commodityId`／`cargo`／`batch` 回 `bad-input`（`ledger-owned`），多給別的欄位也回 `bad-input`。
  - 拒絕理由各自分開：`ledger-unavailable`、`batch-unavailable`、`batch-not-ready`（附 `state`）、`not-at-source`、`destination-mismatch`、`over-capacity`。
  - 「持有人是起點」：批次 `owner` 必須等於呼叫端宣告的起點保管人，也必須等於帳上的 `source`；終點保管人必須等於批次的 `destination`。
- A2 轉運：
  - 道路段終點建築與鐵路段起點建築不是同一棟 → `no-interchange`（`different-buildings`）；不是 k166 根格（參照格也不算）→ `not-k166`。
  - 兩段排好後，再核一次道路段最後一格屬於轉運點的道路前接、鐵路段第一格屬於轉運點的貼軌格；不對就兩段都收掉，回 `leg-endpoints`。
  - 出發時兩段都排好（道路段 053 `startBetween` 建任務、鐵路段 054 `runBetween` 建任務並保留在 READY），任一段被拒就整趟不開始。
- A3 路權：
  - 到轉運點才用 055 `spawnFor054` 登記（新加；路線、批次、數量、容量取 054 那一列，兩邊逐格相同），再 `request`。
  - `WAITING` 或名額滿（`too-many`）就在轉運點等，回 `waiting-authority`；拿到才上鐵路。
  - 到站時 055 自動讓出；取消時 055 那一列 `abort`。
  - 為什麼要 `spawnFor054`：`runBetween` 是多源 BFS，055 原本的 `spawn` 用單點重規劃；遇到並列最短路時兩邊可能走不同格，貨會在 054 的紀錄與 055 的路權之間「瞬移」。
- A4 帳：
  - 到站卸貨後對 052 帳下 `HANDOFF`：持有人與位置用出發時帳上的值，交給批次本來的 `destination`。
  - 取消與中途失敗下 `FREEZE`，原因寫 `lab057:cancel:<理由>` 或 `lab057:leg-lost:<哪一段>`。
  - 帳被別人動過（交接、凍結、會話結束或換了）→ `custody-lost`，不再寫帳（寫了也會被 052 以 `custody-conflict` 拒絕）。
  - 052 寫不進去（例如事件數滿）→ `ledger-write-failed`，照實記下 052 的回覆；批次留在原地，沒有消失。
- A5 狀態：
  - 進行中再開回 `busy`。
  - 每一步重讀真路／真軌：道路段由本卡讀 `tiles[next].road`（053 的 `step()` 不查），鐵路段由 055 `advance()` 讀真軌；被拆就停在原地，回 `road-broken`／`track-broken`。
  - 轉運點的 k166 被拆回 `no-interchange`（`hub-gone`），停在轉運點。
  - 053／054／055 的紀錄被別人推過、收掉或清掉 → `leg-lost` 並 FREEZE；某段閥門開著 → `dependency-unavailable` 停住，不算失敗。
  - 讀檔、開新城、pagehide、`end()`、面板「×」都取消並 FREEZE，再清掉這一趟與面板，結果留在 `lastEnded`。
    - 讀檔與開新城：057 的包裝在最外層，先於 052 結束會話。
    - pagehide：057 在安裝時就掛監聽，052 的監聽到 `start()`／`demo()` 才掛，所以 057 先跑（探測量到順序）。
- A6：面板有「未保存」提示，放左欄第 4 格；四個 LAB 面板統一排一欄，見 T782–T784。安裝當下閥門已開 → 整段不安裝。
- A7：`intermodal057-runtime.test.js` 24 條，已接進 `smoke.js`。
  - I00–I21：用假的 052／053／054／055 介面。假 052 的外殼是假的，帳本身是 052 的純 reducer，監管鏈、守恆、事件 id 的規則都是真的。
  - I22：在同一個 vm 裡依 index.html 的順序裝真的 052／053／054／055 執行期與本卡，在假城市跑完整一趟（含途中拆軌、鋪回），用來核對假介面沒有走樣。
  - 58 個突變首紅都落在目標。第一輪有 2 個沒抓到，改的是測試本身：
    - I03 的容量剛好等於數量 → 改成 9；
    - I16 缺「同名但沒綁 054 任務的列車」這一案 → 補上。
- A8：`probeIntermodal057.cjs` PASS（最終候選上本機 A 段 47 秒、B 段 45 秒）。
  - 固定種子 20261104、原生開發者沙盒，地圖 72×72；放真建築、鋪真路與真軌：O＝k168、H1＝轉運 k166、H2＝目的 k166、H3＝另一棟貼同一條軌的 k166；
  - 052 用原生 `demo()`（food 20；batch-A 7、batch-B 8）；
  - H1 道路＋H3 鐵路 → `no-interchange`（`different-buildings`）；k168 當轉運點 → `not-k166`；給 `qty` → `ledger-owned`；被拒的都沒建任何一段、帳沒動；
  - 全程：道路 5 步到 H1 → 轉運拿到路權 → 鐵路 8 步；055 那一列的 `run054` 就是 054 那一列，起訖格與長度相同；
  - 鐵路走到第 2 格時，用原生拆除工具拆掉前方那格軌：連續 3 次 `track-broken`，054、055、本卡的游標都停在 2；用原生鐵軌工具鋪回 → 繼續；
  - 到站：batch-A 從 `SOURCE_READY` 變 `HELD`（持有人 research-receiver），數量 7 不變，守恆 20＝未發行 5＋活躍 15，沒有多出批次；054 `UNLOADED`、055 路權釋放；
  - 四個 LAB 面板同時開，在 1280×657、390×780、360×640 下都在各自那一格、互不重疊、不出視窗，「未保存」提示在面板內；
  - batch-B 走兩格後讀檔 → 那一趟 `CANCELLED`，帳上 `FREEZE` 成功（`FROZEN`、8 件、同一會話），面板移除，052 會話以 `load-entry-research-cancelled` 結束；
  - B 段（安裝前開閥門）：介面一律 `disabled`、不建面板；包裝鏈與 pagehide 監聽裡沒有 057，其餘各層與 A 段相同。

### 本批發布（R1–R7）
- R1 範圍（b3b6a47）：只收業主批准的四塊與各自的核心、執行檔、測試、探測、原卡；六類沒收的照卡面列。DSK-029 結算退回。
- R2 投影器（c78f578，修正見下）：每塊的唯一性與不變檢查移到合併邊界之前。
  - 修正（PR #87 第一輪 CI 紅）：既有 `single-research052.test.js` 的 moved 突變把 052 區搬到檔尾，它用的原生頁是投影器剝出來的，四塊也跟著不在。
    - 只把各塊檢查移前，首紅就從 `exact052 insertion boundary` 變成 `unique053 begin`。
    - 本機漏跑了這支：它要開 Chrome，那一次被我中途停掉。
    - 改法：各塊檢查之前，先驗 052 區緊接在 049 END 之後（同一個 `exact052 insertion boundary` 斷言）；最後仍驗五塊的完整邊界。
    - 六個既有 052 來源突變的首紅全回原位；整支 052 守衛本機 150 秒綠（含 W10）。
  - `single-research052-blocks.test.js` 21 條負控制（另 2 條：052 區被搬走時，不論四塊在不在，都紅在合併邊界）：每塊改內文、多一個開頭、多一個結尾，首紅都落在該塊自己的斷言；對調順序或縫隙塞字，紅在合併邊界；執行檔被改，載入時紅在該塊的 pinned 斷言。
  - 拿舊順序（b3b6a47）跑，第一個內文突變紅在 `exact052 insertion boundary`，證明改順序有效。
  - 既有 052 斷言的判準沒動。
- R3 整幀比對：`probeLabOffAB785.cjs` PASS（最終候選上本機 108 秒）。
  - 原生頁＝候選頁剝掉四塊（就是 main 的頁面）；兩個情境都在同一固定種子、同一視角；
  - OFF：四個閥門先開、再同步安裝四塊；
  - DEFAULT：閥門不開、面板不開；
  - 兩個情境下，畫布在安裝後同步比對與強制重繪後都逐位相同，原生狀態（每一格加統計）逐字相同；亂數 0 次、storage 寫入 0 次，沒有新增 DOM 節點，console 沒有錯誤；
  - OFF 另外確認 `load`／`newWorld` 仍是原生那一支。
  - 修好之前（eb9e650 當時）OFF 是紅的：舊版四塊在閥門開著時仍改寫 `load`／`newWorld`。
  - 探測改成先等原生重繪穩定（最多 10 秒）再安裝：第一次跑時 DEFAULT 那一輪原生頁連畫兩次不一樣，只比到同步畫布。最終候選上兩個情境第一次量就穩定，強制重繪也比了，兩個情境都相同。
- R4 產品：`index.html` 相對 main 3f86beb 只多四個釘死區塊，加上三處版本字到 14.72／T785。剝掉 052 與四塊後＝main 的原生頁只換那三處，共 4 個字元，長度同為 11,133,306 位元組。重釘表見下。
- R5 本機：
  - 產品 `index.html` SHA-256 `2e6ff9bb…`，b5546b0 之後不再變。
  - 五支探測在 b5546b0 上 PASS：053 87 秒、054 81 秒、055 94 秒、057 94 秒、整幀 A/B 108 秒。
  - 0bf4e60（R2 投影器修正）上：
    - 10 支純 Node 測試綠（投影器負控制 21 條）；
    - 整支 `single-research052.test.js` 綠（150 秒，含 W10）；
    - smoke 3 連綠（687／695／709 秒，每輪 console 0 筆錯誤；`probeLightSide745 --check` 每輪印同樣 4 行光向報告，是既有的資訊輸出，不是失敗）；
    - `fp.js --check` 零變動（葉子、超街區指紋、棘輪 165 族、style.json；87 秒）。
- CI：
  - run 41808423017（ce6bb72）紅：smoke 首紅在既有 052 守衛的 moved 突變，原因與修正見 R2；fp、fiscal-load 綠。
  - run 41809617793（0bf4e60）全綠：smoke 3 輪、fp、fiscal-load；reuse-push 是完整重跑（Full checks），沒有沿用別輪。
- R6、R7：見下方「合併與發布收據」（合併後補記）。

## 發布重釘表（R4，2026-11-04）
**新值怎麼來的**：
- 用 `scratchpad/labtools/repin785.cjs` 做字串替換加 SHA-256；剝區塊用的就是投影器自己的 `stripPinned052`。
- 每一處替換都要剛好出現一次，共 23 處。腳本在本機暫存，不提交。
- 新 index＝本分支四塊補齊版只換三處版本字，SHA-256 `2e6ff9bb…`。
- 新原生基準＝新 index 剝掉 052 與四塊後的雜湊 `61f3c038cb3ab1d7ceca98cf00178ade89bfba541fe19fa87e7ad9aafe4db001`。
  - 先核：main 3f86beb 的 index 剝掉 052 正好等於舊基準 `d009cab2…`。
  - 新舊原生頁只差那三處。

| # | 檔案 | 欄位 | 舊值 | 新值 | 推導 |
|---|---|---|---|---|---|
| 1 | `single-research052-source.cjs`:5 | `baseline` | `d009cab2…1520570` | `61f3c038…4db001` | 上面的新原生基準 |
| 2 | `docs/branch/GPT-052-qa/provenance.json` | `baselineIndexSha256` | 同 #1 舊值 | 同 #1 新值 | 052 測試斷言它等於 `baseline` |
| 3 | `shadow-cargo049.test.js`、`docs/branch/GPT-049-qa/release-source.json` | `release` | `{14.71, T781, 225, 86}` | `{14.72, T785, 226, 87}` | 本次發布：GAME_VER、GAME_ANCHOR、AUTORUN-LOG 輪次、PR 號 |
| 4 | 同上 | `approvedMain` | `01c2249…` | `3f86beb…` | 本 PR 接上的 main（T778–T781 的合併） |
| 5 | 同上 | `ownerApproval` | `DECISIONS-2026-11-04-branch-PR-merge` | `DECISIONS-2026-11-04-LAB03-07-isolated` | 本次批准出處：DECISIONS 2026-11-04 第一列（四塊先合成隔離研究版、走整合版 #84、批准 052 投影器擴充）＋第二列（全部合併） |
| 6 | `shadow-cargo049.test.js` | 註解 | `// T781 owner-approved …` | `// T785 owner-approved …` | 只是註解 |
| 7 | `shadow-warehouse050.test.js`、`docs/branch/GPT-050-qa/release-source.json` | `release`、`approvedMain`、`ownerApproval`、`candidateIndexSha256` | 同 #3–#5、#1 舊值 | 同 #3–#5、#1 新值 | W01 要求檔案與這份描述逐欄相同 |
| 8 | `shadow-warehouse050.test.js` | `releaseStrings050` 每列第一個字串 | `14.71`／`T781` | `14.72`／`T785` | 每列第二個字串（T774 歷史值）不動 |

`ownerApproval` 新值 `DECISIONS-2026-11-04-LAB03-07-isolated` 是 Claude 定的指標字串，不是業主訊息 ID（比照 T777），指向 `docs/DECISIONS.md` 2026-11-04 的頭兩列。

**不屬於重釘、而是本批新增的釘值**：`blockHash053`／`054`／`055`／`057`，是業主批准的投影器擴充（b3b6a47 起）。最終值依序為：
- `979e68c1…`
- `6567cbec…`
- `c9856cc3…`
- `a63a0c8d…`

**沒有重釘的**：
- `productRole`；
- 所有 `historical.*`、`published049.*`、050 的 `provenanceSha256`；
- 052 區雜湊 `blockHash`；
- 斷言運算式、控制流程、負控制與變異清單、門檻、預期首紅。

**機械核對**：
- 三支程式檔共 15 行改動，把雜湊、版本、輪次、PR 號與批准字串遮掉後，改前改後逐字相同。
- 三個 JSON 只動上表的鍵。

## 已知風險
W10（滾輪後只等 80 毫秒）是既有的時序紅，業主沒批准改。若本批紅在 W10，不靠重跑過關：先查原因、回報業主。

## 沒做成的事
1. 保管人和建築的對應由呼叫端宣告（`originCustodian`↔`roadFrom`、`destinationCustodian`↔`railTo`）：052 帳本身不認地格，本卡只核帳上的監管鏈，核不到「這個保管人真的在那棟建築」。
2. 到站時不再檢查目的 k166 還在不在：本卡只重驗轉運點，053／054／055 只看路與軌。
3. 單獨用 053 或 054 時，`step()` 不重讀地格；本卡會替自己那一趟檢查。
4. 閥門開著時 055 的 `abort()` 也回 `disabled`：取消照樣 FREEZE 帳，但那一列的路權要等 055 的閥門關掉或 `end()`。
5. 編號撞號：`shadow-visits057`（LAB-10，T781）和 `intermodal057`（LAB-07，本卡）是兩個不同模組；檔名沿用原分支，沒有改名。
6. 只有研究介面與面板，遊戲裡沒有選保管人、選建築的操作；探測用的是原生 `demo()` 帳。
7. GPT-052 研究帳面板在右下角；手機寬度下它是全寬，會跟左欄 LAB 面板重疊。052 區塊是釘死的，這批不動它。
8. 真手機與 Safari 沒有測。

## 合併與發布收據（2026-11-04，Claude）
- PR #87：轉 Ready 後以 GitHub squash 合併，釘在驗過的 head 0ad06ca；main 提交 0401801。
- 合併前：
  - PR 官方 CI 第一輪 41808423017（ce6bb72）紅在既有 052 守衛的 moved 突變，原因與修正見 R2。
  - 第二輪 41809617793（0bf4e60）全綠。
  - 最終 head 0ad06ca 的 41813656201 全綠：smoke 3 輪、fp、fiscal-load；reuse-push 是完整重跑（Full checks）。
  - 本機 smoke 3 連綠（687／695／709 秒）；`fp.js --check` 零變動。
- 合併後：
  - main smoke run 41815457931 成功。
  - 自動 Pages run 41816384427 第一次失敗：建置成功，部署那一步 GitHub Pages API 回 502（`Failed to create deployment (status: 502)`），跟本次改動無關。
    - Claude 只重跑一次失敗的部署 job，第 2 次嘗試成功。
  - 公開網址 `lijiabao1998.github.io/GlimmerTown-lab/`（轉址到 `game.lijiabao.uk/GlimmerTown-lab/`）讀到 `GAME_VER='14.72'`、`GAME_ANCHOR='T785'`、開始畫面 `v14.72 · T785`。
  - 整頁 SHA-256 `2e6ff9bb…`，與本機和 CI 驗過的候選頁逐位元組相同。
- 原 PR 處理：
  - #84 留言並關閉；
  - #74、#75、#76、#81 留言註明被 #87 取代後關閉；
  - 分支都保留。
