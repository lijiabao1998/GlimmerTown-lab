# GPT-002 — PR7 遊戲內日夜樣張測試

分支：`gpt/pr7-game-samples`。只做測試，業主 2026-10-03 授權「測試一下，先別 merge」。來源固定 PR7 `4fa470b379618e98bea003846b3f30ced7f20bea`。

## 開工前驗收

- 不改 `index.html`、遊戲行為、版本號、指紋基線或主分支；不合併、不部署、不動既有 PR 分支。
- 新 workflow 只在本測試分支 push 時跑，權限 `contents: read`，checkout 不保留憑證，不讀 secrets；artifact 保留 7 天。
- Chromium 透過原版 `harness.js` 進入隔離 slot 3；實際 `GV.place` 驗證 k219–237 根格與多格 ref；既有 guard 與三次 smoke、fingerprint check 如實記錄。
- 19 座各一张遊戲畫布日景與夜景（38 張），用真實 `GV.forceDraw`，不可把離線 Canvas 合成當成遊戲內截圖。
- 渲染樣張使用固定種子、成熟／有電的 QA fixture。此 fixture 不代表自然建造、施工時序或供電經濟驗收。
- 對 Chromium 的原始日夜素材額外斷言夜圖 alpha 外洩＝0；保留數據與定義，不把重疊下限當作零外洩。
- 零 console error、例外、未完成 boot；完整記錄測試 source SHA、workflow SHA 與輸出 manifest。

## 施工紀錄

測試尚未跑。現有雲端工作區被 Unix socket 限制擋住 Chromium，現由 GitHub runner 補驗。

## 沒做成的事

本卡開工時沒有遊戲內樣張、没有本次 guard／smoke／fp 結果。真正的美術判斷仍需業主看圖；不自動解決 PR7 P1，不留言、開 PR 或合併。
