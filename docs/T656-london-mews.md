# T656 — 倫敦馬廄街屋（原 GROK-002）

> **合併紀錄（Claude，2026-09-26）**：業主「合一下 PR」點頭。PR [#2](https://github.com/lijiabao1998/GlimmerTown-lab/pull/2)（`grok/london-mews`，`4aaae2b`＋`c7d9d3f`）在 `3f0bbad` 上本地 squash，配 **T656**、v13.61。原卡內文照留，下面第 7 節是合併時補的。

**卡片號**：GROK-002（分支寫入者不佔 T 號）
**基線**：`3f0bbad`（r102／v13.60／T655）
**分支**：`grok/london-mews`（只推這條，不推 `main`、不自己合）
**對過的既有立面**：ukTerrace（連棟山牆＋凸窗）、ukSemi（半獨立凸窗）、ukVictorian（白灰泥聯排）、ukMansion（紅磚公寓）、ukHighStreet（店面）。這張不是這五種。下一階段不要再做馬廄，也不要重畫這五種。

## 1. 解決什麼

倫敦馬廄（Historic England《Conserving Georgian and Victorian terraced housing》HEAG277，3.4.1）：兩層、地面大馬車門、樓上住屋、磚、沿窄街成列。城裡已有的英式立面都是正街的聯排、半獨立、灰泥排屋、公寓或店面，沒有這種矮拱門。

## 2. 改什麼／不改什麼

只有住宅 1×1 的 `v=5` 換成馬廄。`v=0..4` 和 `v=6..11` 仍按原來 5 種輪（`v%5`）。立面：黃庫存磚、左亮右暗、半圓拱券、樓上小推拉窗、整面石板頂蓋住佔地、戶界煙囪、拱側一盞燈。夜光只畫在已經畫過的窗和燈上。

逃生閥 `window.__noUkMewsGROK2`：從原型表拿掉馬廄，v=5 回到原來的別墅。

不改版本號、`AUTORUN-LOG.md`、`fp.json`、`docs/DECISIONS.md`、存檔、模擬。

## 3. 怎麼算做完（動手前）

1. 自檢 `ukMewsGROK2`：v=5 的樣式是 `ukMews`；左右臉都有不透明像素；東、西、南鄰格菱形內部 0 像素；夜光沒有落在白天透明處；五種舊英式剪影都不同；關閥門後不再是馬廄且畫面不同。
2. 煙霧綠。`fp.js --check --expect=bld,block559`：只動到圖集和超街區快取（v=5 換了剪影），其餘家族不動。不寫 `fp.json`。

## 4. 施工

見 index.html 尾端 `REG.ukMews`，以及 `ARCHE568['1_1']` 的 `mews` 條。

## 5. 守衛

| 項目 | 結果 |
|---|---|
| `ukMewsGROK2` | 16 項綠：左右臉、鄰格內部 0、夜光不浮空、五種舊英式剪影不同、v=0..11 只有 v=5 是馬廄、拱圈石 ≥8、屋頂中心 25/25 是石板 |
| 煙霧 | 綠 48.0s，自檢列 `ukMewsGROK2 OK` |
| `fp.js --check --expect=block559` | 葉子 151 族零變動；超街區 `e17e662e → 40c922b4`（只因 1×1 的 v=5 換成馬廄）。未寫 `fp.json`。72px 圖集沒被這張蓋掉，所以沒有 `bld` 家族差 |

樣張：`shotsGROK2/mews-sprite.png`（白天精靈）、`shotsGROK2/mews-city.png`（種子城近景，樣式 `f577:ukMews`）。

## 6. 施工紀錄

1. 從 `origin/main` `3f0bbad` 開 `grok/london-mews`，沒帶上 `dsk/uk-cathedral` 的未提交草稿，也沒疊在 `grok/grove-mix` 上。
2. 第一次鄰格測試把地影算進去，失敗。改成只數東、西、南鄰格菱形內部（共享邊不算），0 像素，通過。
3. 指紋第一次多宣告了 `bld`，圖集其實沒變，改成只宣告 `block559`。
4. 對過 ukTerrace／ukSemi／ukVictorian／ukMansion／ukHighStreet，剪影都不同。下一階段不做第二種英國房子。

## 下一階段

這張做完就停。馬廄和上面五種都對過了，不再加第二種英國房子，避免同一主題重複。

## 7. 合併時（Claude 在雲端本機跑的，2026-09-26）

- **合併時改的**：`probeGROK2.js` 埠 8293 → **8199**（`AUTORUN.md` 邊界）；樣張目錄 `shotsGROK2/` → `shots656/`（被 `.gitignore` 的 `shots6*/` 擋，樣張不進版控）。分支上 commit 進去的兩張 PNG（523 KB）沒有帶進 `main`。其他程式照原樣。
- **煙霧**：綠 3／紅 0（54.2s、40.7s、36.2s；這台機器今天比昨天慢，T655 那輪是 28s），`ukMewsGROK2 OK（16 項）`。
- **`probeGROK2.js`**：`sty f577:ukMews`，近景種在 (6,2)。
- **`fp.js --check --expect=block559`**：葉子 0 變動；超街區 `e17e662e → e5cd087f`（卡上寫的 `40c922b4` 是分支那台機器量的，跟雲端 Linux 不同平台；`main` 的基線是雲端量的）。已更新 `fp.json` 的 `blocks.fam` 與版本欄位，之後 `fp.js --check` 全綠。
- **沒查到的**：卡面和程式在同一個 commit（`4aaae2b`），看不出驗收條件是不是動手前寫的。
- **目視**：馬廄是一層高的平石板頂小屋，比旁邊的住宅精靈陽春（只有拱門、一扇窗、一根煙囪），卡上寫「兩層」但畫面看起來是一層半。

