# T620 — GitHub Pages：手機直接玩最新版＋日夜樣張頁

**輪次**：r67（業主點名的工具卡；CLAUDE.md 第 3 條「業主點名時做」）
**基線**：`8322292`（v13.27／T619）
**狀態**：🚧 施工中

---

## 1. 這一輪要解決什麼

業主要：① 手機隨時打開就是實驗線最新版，不用電腦開伺服器、不用同一個 Wi-Fi；② 每次推送自動拍日夜樣張，手機直接看，不用下載 Actions 的 zip 附件。

GitHub Pages 免費提供固定 HTTPS 網址（預期 `https://lijiabao1998.github.io/GlimmerTown-lab/`）。

## 2. 改什麼／不改什麼

**改**

1. 新增 `gallery.js`：開一次遊戲、載種子城（`metroArtSeedWorld516(5162026)`）、暫停，逐一設鏡頭／縮放／時刻，`forceDraw` 後直接 `toDataURL` 取遊戲畫布（不含 HUD），寫出 PNG 與手機友善的 `index.html` 樣張頁（版本、commit、時間、每張說明）。
2. 新增 `.github/workflows/pages.yml`：
   - 觸發：`smoke` 在 `main` 上**跑完且成功**（`workflow_run`），或手動。煙霧紅的版本不會上線。
   - 組站：`_site/index.html`＝遊戲本身；`_site/shots/`＝樣張頁。
   - `actions/configure-pages` → `upload-pages-artifact` → `deploy-pages`。
3. `.gitignore` 加 `_site/`。

**不改**

- `index.html` 一字不動（不升版）。
- 不改倉庫設定：`AUTORUN.md` §1 不准改倉庫設定，開 Pages 由業主在 Settings → Pages → Source 選「GitHub Actions」。
- 不補 `manifest.json`／`sw.js`：Pages 上只能在瀏覽器玩，不能離線安裝（實驗線本來就沒有這兩個檔）。

## 3. 怎麼算做完（動手前寫下）

1. 雲端容器本機跑 `gallery.js`：8 張樣張、樣張頁都寫出來，0 例外；業主看得到樣張頁截圖。
2. 推 `main` 後 `smoke` 綠 → `pages` 自動觸發，build 綠。
3. deploy 綠、拿到網址。**若 Pages 還沒開**，deploy 會紅，錯誤訊息要能直接指出「Pages 沒開」；業主開好後手動重跑一次變綠。
4. 雲端容器連不到 `github.io`（代理擋），網站實際能不能玩要業主用手機開一次確認。

## 4. 要業主知道的

- **存檔**：跟著 `lijiabao1998.github.io` 這個網域走，與 8123 玩家目錄完全分開。
- **串台風險（CLAUDE.md 第 2 條）**：同一個帳號底下所有 Pages 網站共用同一個網域 `lijiabao1998.github.io`，瀏覽器存檔（localStorage）是**按網域**分的。將來主線也開 Pages 的話，兩條線會用同一把存檔鑰匙 `glimmerville.v1.*`，**互相覆蓋存檔**。主線要上 Pages 前，先解決存檔鍵分流。
- 網站是公開的（倉庫本來就公開）。

## 4b. 施工

- `gallery.js`：8 個鏡頭（中景／近景／住宅近景／遠景 × 白天／黃昏／夜晚），`toDataURL` 取遊戲畫布 1280×661，寫 PNG＋樣張頁；頁面深色、單欄自適應、`image-rendering:pixelated`、`loading="lazy"`，頂端「▶ 開始玩這一版」連回遊戲。
- `.github/workflows/pages.yml`：`workflow_run`（smoke 在 main 成功）或手動；build 用觸發那次的 `head_sha` 檢出，裝字型、組 `_site`、`configure-pages`、`upload-pages-artifact`；deploy 用 `deploy-pages`。
- `.gitignore` 加 `_site/`。

## 5. 守衛（可斷言的事實）

| 項目 | 結果 |
|---|---|
| 雲端本機 `gallery.js` | 8 張、0 例外、38.3s；樣張合計約 6.8 MB |
| 樣張頁手機寬度（390px，Playwright 截圖） | 標題、版本、commit、開始玩按鈕、單欄大圖都正常 |
| 兩個 workflow YAML | `yaml.safe_load` 解析通過 |
| 煙霧（雲端，本輪 index.html 未動） | 綠 34.7s |
| Pages build／deploy | （推送後補） |

## 6. 施工紀錄（如實，含失敗）

- 雲端容器查不到 Pages 狀態：`api.github.com/.../pages` 被代理擋（403），`lijiabao1998.github.io` 連不上。所以部署成功與否只能看 GitHub 上 deploy 那一步；網站實際能不能玩，要業主用手機開一次。
- 樣張用 PNG（保留像素），整頁約 6.8 MB；手機行動網路第一次開會慢，圖是懶載入。
