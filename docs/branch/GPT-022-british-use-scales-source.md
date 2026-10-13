# GPT-022 — 完整36款英式三規模候選源碼與唯讀 CI

本卡於移植實作前建立；從最新 main
`01e581eb19bbb7efebc50fd893483f3cb1859388` 分出
`gpt/british-use-scales-source-022`。Claude 新提交只改
`docs/AGENT-PROMPTS.md` 與 `docs/DECISIONS.md`；保留其完整內容。
已依序讀《迭代不改壞標準》、AGENTS（含第5節）、AUTORUN及DECISIONS。
COLLAB.md／.agents/skills 在此 workspace 不存在，未假稱讀過。

## 一件事與精確差異方案

移植已確認的36款候選完整來源：12種既有用途各小中大，保留五份原美術
及重建kit，不開新美術。商店、市場、餐飲、旅館、辦公、作坊、輕工廠、
倉庫、農場、牧場、客運站、貨運站。這是同用途型制差異，不是新容量、
產業鏈、費用、調度或新建築編號。原 native 不支援的組合仍 fallback。

允許移植的檔案：五份 `british-use-scales-*021.js` 美術、kit、native-map、
runtime、`build-use-scales-release021.js`，相關 probe/test/harness 及
smoke 的 useScales021 自檢。保留021內部名稱以避免改動批准來源與存檔 metadata。
新增一份僅建置及輸出核對的源碼包 manifest／candidate-build022.js。
既有 smoke workflow 僅在此分支／此分支PR，先生成候選 index，再實際
跑 smoke 並上傳完整候選 index 與真實樣張為 artifact；不寫回 Git。

不帶入舊發布準備：v14.41/T739 三個版本標籤、AUTORUN-LOG、fp.json、
style.json、DECISIONS 修改，或 materialize-release021.js／臨時
contents:write workflow。本卡只標 GPT-022，不佔 T 號。

完整 index 大檔此前工具傳輸逾時。此卡採用完整可重現源碼提交：Git 中
index 保持最新 main；唯讀 CI 在 runner 產生可獨立開啟的完整 index。
這不等於生成 index 已推入分支；合併者必須先生成、驗證 index，再按
AGENTS第3節測試及配版本。不可直接把源碼包 PR 合併當作美術已上線。
既有 smoke CI 使用既有權限，不提升 GitHub 設定／token／倉庫權限，
沒有自動 commit/push/ref/merge/deploy 步驟。

## 移植前鎖定的驗收條件（不得事後放寬）

1. 本卡先推成功，才移植來源；只推自己的 gpt 分支，禁force，禁main推送及自行merge。
2. 新分支相對最新main，所有受保護檔案及三個版本標籤零變動；Claude兩份文件逐位保留。
3. 五份批准美術逐位相同，全部完整源碼讀回SHA相符；不只提交報告或縮圖。
4. 初始index SHA256 為 `7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067`。
5. CI生成index必須完整符合已確認候選
   `8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed`，
   仍v14.40/T738，不改其批准形制與本輪授權以外內容。最新main若改到程式，先停下核對。
6. smoke必須測到候選實際renderer的useScales021 API；不能把舊main smoke綠冒充新候選綠。
7. CI三次smoke全綠、console乾淨，artifact包含完整index及實際樣張；真實完成後才填結果與連結。
8. 像素守衛及fp本機未跑，標「未跑，待合併者跑」。合併者須驗證日夜/雪季節/四向/大小螢幕/
   近遠/邊界/疊層、存讀、取消重複、native功能配對及閥關整幀，不改fp基線來過關。
9. 新建workflow／既有workflow差異不得新增contents:write。CI綠後才開PR，附卡與artifact。
10. 推送前重新讀最新main及自分支head；遇衝突、審核拒絕或測試紅線，按規則處理而不繞過。

## 現況與樣張

已確認圖是舊完整候選的原生day88同幀36款 PNG，原檔保存在
`/workspace/GlimmerTown-lab-rebuild021/docs/branch/GPT-021-rebuild-preview/native-city-attempt-06-rot0.png`，
主對話已看過並確認。它不是本卡新CI樣張，不用來宣稱本卡已測通過。
舊成果與全部拒絕收據保留在原工作目錄及bundle，新卡不覆蓋任何GPT-021卡。

## 施工紀錄與沒做成的事

卡面先推成功，遠端commit `1f5aff4a622a071eb9f23ff30ca3a0b54c872468`，
全文與blob `1b47f2756f34a665e6af42c48b021604da6dbbdf` 已讀回相符。
完整來源已移植；深層守衛只移植檔案路徑與不可變baseline讀法，使其不依賴
旧 `/workspace` 工作目錄。獨立oracle／day88成熟城／初始QA場景逐位複製
至 GPT-022-guard-inputs；不改守衛判準或批准美術。守衛首次跑不得使用
`--reuse-contracts`／其他舊驗收重用選項；新结果必須来自本卡實跑。
23:43雲端狀態查詢成功，當時未提交來源已另存WIP tar與恢復收據。
來源尚未推送，CI未跑，PR未開。
本卡沒有本機遊戲執行；像素守衛／fp：**未跑，待合併者跑**。
沿用必須披露的已知限制：全家族cold增加243.75ms；成熟建築hover fade
NOTTESTED；真機效能未量。舊測試結果不能冒充本卡的新結果。

## 第8節收工自檢

- [ ] 卡面先推，验收未放寬。
- [ ] 同種子功能／舊存檔比較：未跑，待合併者跑。
- [ ] fp／閥關整幀：未跑，待合併者跑。
- [ ] 本卡完整狀態與疊層：未跑，待合併者跑；成熟hover仍未測。
- [ ] 本卡守衛故意改壞／首紅：未跑，待合併者跑。
- [ ] CI煙霧三連綠：待CI。
- [ ] 所有「通過」均有本卡真實CI證據。
