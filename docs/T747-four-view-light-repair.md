# T747（原 GPT-023）— 先修 T745：20 座英式建築四向受光

## 授權、claim、第一筆不可變家族清單

業主 2026-10-15 指示加入 15 座不重複且有考據的英式建築並依規約交付 Lab main。AGENTS §7 修補優先、DECISIONS 2026-10-14 ⑥ 已裁定 T745 必須修，故先獨立閉合本卡，不把舊缺陷混入新增建築。施工 Codex／GPT；分支 `gpt/four-view-light-repair-023`，base `c62c67ebb2a4d15efb75c3bd77b58f7736596d0e`。

**要動的 fp 家族：`bld`。第一筆清單不可改。** 只准 `bld.<274–293>_1_1`、`bld.<274–293>_1_3` 變動；不增／刪葉，不動 k139、0／2 視角、步道素材、use021、block559 或其他家族。

## 定位與方案

完整讀遠端 AGENTS、AUTORUN、CLAUDE、DECISIONS、迭代不改壞標準與 T745。T745 已有独立兩把材質尺與 120 筆形狀／全像素釘；不是重寫判準。

原幾何會旋轉，但牆面亮暗仍綁原世界軸。只為 20 座建築選用新增的 scene 受光適配器：只在視角 1／3 的垂直／斜向面按面軸選既有明暗材質，地面、橫向屋頂與幾何／深度／窗燈來源不改。私人 Scene 本體不改；共用 primitives014 只新增 helper。普通步道、k139、use021 繼續用原 Scene。

## 允許觸碰／禁區

允許新增 helper、六份目標美術源的建築 Scene 呼叫、逐字嵌入 index、機械嵌入工具、新負控制與分支唯讀 CI。探針綠後僅向 smoke.js 新增 T745 呼叫，不能改既有斷言；分支 workflow 綠後移除。合併收尾才改版本三處／日誌／本方向進度與卡名。

所有原 helper 函式、probeLightSide745.js／pins、原 smoke 判準、harness／fp／gallery、use021、美術資料、模擬、RNG、存檔、能力、造價、占地零改。不得 write-pins、重跑賭綠、手改 fp／style 或其他家族的新基線。不碰 Town 主線、玩家目錄或其他工作區的舊成果。

## 動手前固定驗收

1. 原 `probeLightSide745.js --check` 與 `--valve` 全綠：兩把光向尺、120 釘、9 份源碼嵌入；首輪用只綁本分支、contents:read 的 CI。
2. 新適配器只在 20 個建築入口使用；所有地面／步道入口仍原樣。0／2 与逃生閥返回原物件、坐標／w/h/ax/ay 不變。
3. 至少兩個實彈突變：關掉使用入口／拿掉逃生閥，各自在原目標釘首紅；不得靠 parse 或其他測試提前失敗冒充。
4. 最後一次 push CI 對最新 main：煙霧三連綠、fp 相對 base 只有 bld、逐葉精確限制符合第一段、七軸風格沒有下降，use021 與 1728 block 零變動。
5. 只取該次 fp artifact 的新基線，逐位提交；不手寫 fp／style。轉綠後生成修前修後四向真畫布樣張，來源 SHA、尺寸、雜湊有記錄。
6. 第 8 節自檢據實；本機不跑遊戲，其他未跑守衛明示。刪分支 workflow 後最後提交再次 CI 綠，再 PR 正常合入；main smoke/fp、Pages 綠，實際站版本／來源核對。

## 回滾與停止

分支紅只留本分支，不改 main。不滿足原 T745 或第三次無進展、環境漂移、額外家族、風格下降就停止／標卡住；不為這張卡放寬任何判準。正式回滾走正常 revert PR，逃生閥 `__noLightFix745` 恢復四向原像素。

## 施工紀錄

尚未施工／未驗證。已確認本機原 Lab 仍在舊 Grok 分支且有別人備份，未覆蓋；施工在 Lab 的 ignored scratchpad 隔離 worktree。方向獨立 PR #27 已合、只改方向檔。最近已完成 main smoke／fp／Pages 成功，不冒稱 T745 已修。

初版 8029582 的實際 GitHub 原探針在 college/manor 報 `K is not defined`：該檔原依賴名是 H，我誤寫成另一個模組的 K。語法檢查不會咬未定義的運行期名稱，沒有把它記成通過；本筆修入口名稱並重嵌來源，不改原探針／釘值。完整 main 閘仍以後續精確 CI 為準。

482e868 精確 CI：[原探針與兩負控制 38740396958](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38740396958) 成功。紅磚視角 1／3 的反向棟數 8／9 → 0／3，比例 68%／76% → 16%／41%；石材 7／7 → 3／2，比例 65%／55% → 40%／42%，都在原門檻內。兩模式各核 80 筆、聯集覆蓋原 120 筆，沒有刪釘／重釘。死適配器首紅 `X --check：4 處光向反了`；刪閥首紅 `X --valve：逃生閥開時跟舊圖不同 40 筆`。

同 SHA [smoke 38740396885](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38740396885)：煙霧工作 success、fp 因有意變動保持 RED，不能稱整套綠。fp 實得只有 bld 的精確 40 葉變，其餘 165 族、use021 與 1728 block 逐位相同；七軸沒有下降，受光軸 .8196037539103233 → .8342022940563086，總分 .9631 → .9652。依 AGENTS §7 採用這次 push 的 artifact 11975352450：ZIP SHA256 `cabe03a124f4e45c668e7d5745915ade2eae148870642b2d457e3b69699a85d8`；內容逐項白名單核對。fp SHA256 `61b4384a4d95cf4e403555904cd1e15591be2a60f16c7ea7578cd3d16fef1da0`、style `4abdb55a5436152c883ca4f0df4a881732bb8c84e8602b9642ccd28a0991583a`，原封不動提交，不手改。

原探針綠後，僅在 smoke 新增原 T745 與本卡負控制呼叫。新增 CI 真 Chrome 樣張／夜圖逐位核对，不在本機開遊戲；仍須後續精確 CI 全綠才可合。

## 第 8 節自檢

- [x] 卡面先推（6ea351c），條件未放寬；原釘與 helper 沒改
- [x] 同種子／舊檔：不適用；僅材質適配器與 20 個 Scene 入口，沒有模擬、RNG、存讀欄位改動。真瀏覽器樣張前後 GV.stats 完整相等
- [x] fp 只有指定 40 葉；閥關整幀：未跑，待 Claude／Codex 補跑；原素材閥 80 圖由 CI 另驗
- [ ] 日／夜／冬／四季／四向／遠景／邊緣／疊層全部：未跑，待 Claude／Codex 補跑；本卡已跑四向日夜 320 原生 PNG，不冒稱全部場景都看過
- [x] 兩個負控制首紅在原目標，合法 JS 而非解析紅
- [x] 90805d6 同 SHA CI 煙霧三連綠／fp 綠；發布尾另等最終 head CI
- [x] 沒有未跑卻寫通過，沒有聲稱獨立覆核

## 發布尾與真圖

[90805d6 完整煙霧與 fp](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38742070326) 全綠；[最後一輪分支專屬探針／真圖](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/38742070285) 全綠後移除 workflow。原生 320 PNG 的 artifact 11975294360，ZIP SHA256 0cdf895748095ff8dbea13a9b0d683d5cf5456c29a93a3299bb217f41d64ff1f；本機只下載檢視圖，不運行遊戲。已肉眼抽查 hotel／theatre 前後與大學／浴場圖；亮暗調整保持材質、構件與場地輪廓。夜圖全 80 相同、0／2 日圖全 40 相同。

T/r 從最新 main 核為 T747／r194，版本三處 14.42。PR #28；最終 CI 與 main／Pages 結果以 PR 的精確 head／合併 run 為準，未發生前不写部署完成。
