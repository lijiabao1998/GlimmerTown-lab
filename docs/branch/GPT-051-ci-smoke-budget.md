# GPT-051：同 runner 完整 smoke 的有界 CI 時間例外（Draft，等業主）

- 日期：2026-10-26。
- 唯一倉庫：lijiabao1998/GlimmerTown-lab。
- 起點：最新 main `c0d4a039c48aebaa1f091fc6ce03d60bd0ca7992`，tree `300166f59b54d52630419a93ef97d1c49c6e2e24`；正式產品 T775／14.68。
- 分支：`gpt/ci-smoke-budget-051`。卡面單獨先推；本卡不佔 T 號，不改版本或 AUTORUN-LOG。
- fp 家族：**無**（第一 commit 凍結，不變）。
- 狀態：僅獲實作、驗收及 Draft 授權；**不得 Ready、合併或部署**。CI／守衛變更不適用 GPT 自合例外。PR68 仍獨立 blocked Draft，不把本卡成功寫成 PR68 成功。

## 本次明確授權及理由

2026-10-26 12:53 UTC 原問題（僅摘錄 Lab 那一項，逐字）：

> 1. Lab：尚未答覆的 CI 例外。是否允許在 GlimmerTown-lab 新分支／Draft PR，把 smoke 上限15→30分鐘，並更新 reuse-push-ci.test.cjs 的精確斷言？三輪、其他上限及遊戲測試不變，不含合併發布。

業主 2026-10-26 15:42:34 UTC 直接回覆該問題：

> 允許

這是放寬 **CI smoke 工作總 wall-clock 時限** 15→30 分鐘（多 15 分鐘、2 倍），不是遊戲效能門檻改動，也不是原 PR67／68 A 授權的隱含延伸。新上限仍涵蓋該 job 安裝／測試／附件整體；同一 job 在 main 的原一輪執行也適用30分鐘，但本卡不合併 main。

PR68 c32 的 push40313006243、PR40313012748 均 cancelled，取消約落於15分鐘，原始訊息只有 “The operation was canceled.”：因果為相關性推論，不宣稱已證實 timeout。保留全部失敗，不重跑賭過、不拼兩輪證據製造成功。

## 範圍（施工前凍結）

只改兩個工程檔及本卡／本卡證據：

1. `.github/workflows/smoke.yml`：只將 `jobs.smoke.timeout-minutes` 的15改30。
2. `.github/scripts/reuse-push-ci.test.cjs`：原「15恰有2份／25恰有1份」斷言改為獨立期望的精確 job→上限檢查，並補真實 workflow 來源變異的首紅＋恢復。
3. `docs/branch/GPT-051-*`：凍結卡及真實驗收證據。

不改 `reuse-push-ci.cjs` 本體、25分鐘等待、27分鐘 reuse job、15分鐘 fp、25分鐘 fiscal；不拆 runner、不改 rounds／commands／job名／artifacts／permissions／concurrency／triggers／Pages／reuse 成功與回退判定。遊戲 index、049／050核心與測試、smoke.js、harness、fp.js、所有 probe、存檔／經濟／RNG／版本、fp/style 基線、規則與方向檔皆不動。無第三張功能 PR；本卡加 PR68 恰為兩張等待 PR，上限滿即停。

## 驗收條件（動手前固定，之後不准改鬆）

1. 首張卡先推；從上述 fresh main 起分支，無歷史改寫，無 main 寫入。
2. 最終遠端 tree 對 main 僅上述允許檔變動。workflow diff 恰一個15→30 literal；其餘 bytes 相同。helper 本體及全部遊戲來源與基線 Git blob 完全不變。
3. 斷言的獨立 expected map 固定為 `reuse-push:27, smoke:30, fp:15, fiscal-load:25`。錯值、缺失、重複或錯層級的 timeout 不可被當成合法；不能只數全檔數量、不能使用被測值生成 expected。
4. 對實際讀入的 workflow 文本逐一故意破壞四個 job 上限、移除／重複／錯層級上限及重複 job。各首紅必須來自目標 timeout 守衛；每次恢復來源都重新通過。此為 CI 配置守衛，不冒稱新增遊戲覆蓋。
5. 原有126項 helper 決策／Git tree／祖先／workflow bytes／baseline／run attempt race／失敗／pending／API拒絕／25分鐘等待／failclosed回退測試全保留；既有其他 workflow 命令、權限、附件與觸發斷言不刪不鬆。
6. 本卡可在本機跑純 Node CI-helper 測試（不執行遊戲／Chrome／smoke／fp／probe）；遊戲完整流程交原生 GitHub Actions。
7. 最終精確 head 的原 full push CI 成功：同一 runner 原命令 smoke 三輪全完成，fp 全綠且相對 base 零家族／零葉變動、無風格下降或 envLeaves 漂移，完整 fiscal 成功。PR CI 必須成功且如實記錄同 tree 重用或完整回退。cancelled／skipped／partial 不算綠。
8. CI-only fresh-main 結果只覆蓋目前已合併049；**不含未批准／未合併的050或其 A/B/C**。本卡日後若獲合併，PR68 仍須重新基底適配、查 T／版本、精確 head 全量驗收，不能沿用本卡或舊6d收據。
9. 不自合、不手動 Pages、不修改遠端設定；結束保持 `[等業主]` Draft，交明確 head／tree／全部 run 及首紅原始紀錄。

## 基準與風險

- 最新 main smoke40308344872／Pages40309228966 success；讀取時 main 未變。
- 原 workflow smoke15／fp15／fiscal25／reuse27；helper MAX_WAIT_MS25分鐘是等待而非 source runtime 判準。source未完成超過等待期限仍 full fallback，不改 helper。
- 原同 runner 三輪保留，所以跨輪同機殘留壓力不被拆 job 消除。允許更長 CI 佔用，可能費時更多；不能保證 PR68 原取消原因因此被修好。
- 無美術或產品功能改動，不新增遊戲樣張；保留所有既有 CI 產出。

## 回滾與停手

未合併不影響 main；若未來另獲批准合併後需要回滾，由有權 main 寫入者正常 revert，不強推。本次任何 gate 未過如實保留、按紅線修且不降低標準；需超出兩工程檔範圍即停並報告。未獲合併批准到此為止。

## §8 自檢／施工紀錄（初始）

- [ ] 卡面先推（本 commit 被遠端確認後補收據；驗收先固定）。
- [x] 同種子／舊存檔：不適用，遊戲與存檔零變；既有 native fiscal 仍完整跑。
- [ ] fp：待最終 CI；逃生閥整幀不適用，無遊戲新效果。
- [x] 美術各狀態：不適用，無美術或產品 UI 改動。
- [ ] 新 timeout 守衛真首紅＋恢復：待實作驗證。
- [ ] 同 runner smoke 三連綠與最終 PR CI：待驗證。
- [x] 未跑未寫通過；沒做成的事：目前只有凍結卡，尚未實作、未驗收、未合併。

### 2026-10-26 15:48 UTC 實作／純 helper 驗收

- 首卡 [a0b60118](https://github.com/lijiabao1998/GlimmerTown-lab/commit/a0b60118cb9f74142b43197d7e5bb2f8f5379e82) 已在分支可讀，然後才改工程檔。最初誤用 update_ref 建立不存在 ref 收到 GitHub422（未建立），改用正式 create_branch 成功；非權限拒絕、未繞過限制、無歷史重寫。
- 兩工程檔施工完成；workflow 逐 bytes 反向替換唯一 smoke30→15 後等於 main。helper 本體完全相同；其餘產品及遊戲測試不在變更集合。
- 純 Node helper 基準126 pass／0 fail；候選137 pass／0 fail／0 skipped（原126＋新父測試1＋10個負控子測試）。本機未跑遊戲／Chrome／smoke／fp／probe。Git fixture 為原有臨時測試資料，結束清除。
- 十項 actual workflow 來源變異：四 job 各錯值、smoke缺限／重複限／step層級、重複job／缺job、隱藏額外timeout。每一項先由目標 `GPT-051 approved job timeout map` 斷言拒絕，再對未變原始候選重驗成功；不把 assertion 例外當正常產品通過。
- 精確 expected map 寫在測試函式常數，與讀取的 YAML 分離；保留原 helper 決策及其他 workflow 結構斷言。保留25分鐘等待及27分鐘 gate，不需要變更helper。
- §8 更新：卡面先推、新守衛真首紅＋恢復已完成；fp及完整三輪／PR CI仍 **未跑完，待 GitHub 最終 head**。尚未獨立覆核；內部 reviewer 未能啟動（並發上限），不冒稱審查通過。
- 沒做成的事：本機純 helper 不是完整 CI；遠端候選、full push／PR最終收據待取得。本卡未包含050，不代表PR68通過，未合併部署。
