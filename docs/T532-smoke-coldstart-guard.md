# T532 — 開機煙霧測試 ＋ 冷啟動 drawImage 護欄

**輪次**：r1（自走線第一輪）
**基線**：`f30bca0` T531 v12.87（4,271,241 bytes / 32,559 行）
**狀態**：✅ 綠燈，已 commit

---

## 1. 這一輪要解決什麼

AUTORUN.md §2 指定「開工第一件事：寫一支 30 秒的開機煙霧測試」。同時它也把
「**紅線：煙霧測試紅了不准帶著紅跑下一輪**」寫成硬規則 —— 所以煙霧測試一旦蓋好，
它就必須先綠，否則之後每一輪都沒有可信的退路。

出卡時的預期（**先寫下來才叫驗收條件**）：

- 煙霧測試能做四件事：載入頁面、等到開機管線收工、確認主迴圈真的在跑、抓 console error。
- 進入城市的動作**必須把 slot 設成 3**，不碰業主的槽。
- 驗收：連續 6 次執行 6 次綠燈（0 筆 console error），且每次都能產出樣張。

## 2. 改什麼／不改什麼

**改**

1. 新增 `smoke.js`（零依賴：Node 內建 http + 內建 WebSocket 直連 CDP，不裝 puppeteer）。
2. `index.html` 兩處 `drawImage(SPR.cliff, …)` 補 undefined 護欄（22726、12659 行）。

**不改**

- 不動任何模擬、經濟、存檔 schema、RNG 流。
- 不動 git 的 `core.autocrlf=false` 與 `.gitattributes * -text`（退路的地基）。
- 不新增 PWA 附屬檔（`manifest.json` / `icon.svg` / `sw.js`）——AUTORUN.md 定調唯一產物是 `index.html`，
  這三個 404 在煙霧測試裡列為**已知良性**並單獨計數，不掩蓋其他 404。

## 3. 探針（先量再動手）

煙霧測試第一次跑就紅了 —— 這正是它存在的理由。紅燈內容：

```
✗ 未捕捉例外: TypeError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D':
  The provided value is not of type '(CSSImageValue or HTMLCanvasElement or ...)'
  ↳ draw@22726:65
  ↳ draw@29282:41
  ↳ draw@29373:41
```

- **重現率**：6 次跑中 2 次紅（約 1/3），屬間歇性。
- **根因**：`SPR.cliff`（T388 地圖邊界虛空用的崖壁 sprite）在 `buildSprites` 尾段才建立，
  而地面繪製迴圈在城市進場的**頭幾幀就可能先跑** —— 冷啟動競爭。
  同檔 22835 行早有先例：`SPR.cliffEdge?.[rem]`（T506 註記「sprite 尚未就緒時跳過」）。
- **不是新 bug**：T388 起就存在，只是從前沒有無頭守衛，所以沒人看見。

## 4. 施工

照 T506 先例補護欄，兩處一字不改語意：

```diff
- if(vp388[0]===N-1||vp388[1]===N-1)gc.drawImage(SPR.cliff,sx,sy,64*z,56*z);
+ if(SPR.cliff&&(vp388[0]===N-1||vp388[1]===N-1))gc.drawImage(SPR.cliff,sx,sy,64*z,56*z);

- if(x===2||y===2)g.drawImage(SPR.cliff,sx(x,y),sy(x,y));
+ if(SPR.cliff&&(x===2||y===2))g.drawImage(SPR.cliff,sx(x,y),sy(x,y));
```

選「跳過」而不是「用替代色補」的理由：崖壁只在地圖邊界特定 rot 才畫，第一幀缺一張遠景裝飾
的正確行為就是先不畫，下一幀 sprite 就緒後自然出現。

## 5. 守衛（可斷言的事實）

| 項目 | 結果 |
|---|---|
| 修復前 6 連跑 | 綠 4 / 紅 2（重現率 33%） |
| 修復後 6 連跑 | **綠 6 / 紅 0** |
| 單輪耗時 | 8.4–9.0s（遠低於 30s 目標） |
| console error | 0（已知良性 PWA 404 另計 6 筆） |
| 主迴圈 | 34–40 frames / 1.2s |
| 烘焙 | `__t519Roof > 0`，約 5.5s |

樣張：`shots/smoke-1789306*.png`（6 張）

## 6. 施工紀錄（如實，含失敗）

- **r1-a 失敗**：初次執行 smoke.js 時紅燈抱怨 `EPERM rm .smoke-profile` ——
  前一輪 Chrome 尚未釋放 profile 目錄。已改為每輪唯一 `profile-<pid>` 與唯一 debug 埠
  （`PORT+1000+pid%400`），並把歷史目錄清理改成「盡力而為」。
- **r1-b 失敗**：接著仍偶發「等不到 Chrome 的 page target」（3 連跑中 1 次）。
  同一修正（唯一埠）解決，之後 6 連跑無此症狀。
- **程序反省**：本輪順序是「先寫測試、才發現 bug」，所以 §1 的驗收條件是**測試蓋好後才回填**的。
  下一輪起恢復「先出卡、後動手」。
- **已知未解**：`SPR.cliff` 缺漏本身只是被跳過，沒有去追「它為什麼會晚就緒」。
  若之後懷疑其他 sprite 有同類冷啟動缺口，應做一次「首幀 SPR 完整性快照」比對。

## 7. 建議下一步

AUTORUN.md §5 把優先序寫死了：**甲 · 市民一生（三個原型都端上來）**。
建議 r2 先做**最便宜的「履歷檔案」**：點一個市民 → 條列他從出生到現在的履歷，
用 T295 既有的抽樣市民 agent 當資料源。做完再往上做事件流與個體跟隨，
讓業主起床時三種都看得到、能直接挑。
