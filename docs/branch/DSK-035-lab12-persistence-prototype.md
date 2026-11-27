# DSK-035｜LAB-12 持久化原型：影子狀態的信封、校驗與原子還原

- 日期：2026-11-03
- 分支：`dsk/lab-persistence-058`（從 `origin/main` 開；與 #84 整合候選獨立）
- 對應：V67 §4「影子貨物帳一致性、必要持久化設計」；#80 的提案卡（LAB-12）走到**可執行的原型**。

## 1. 這是什麼

一支**純核心** `persistence058.js`（不進 `index.html`、不寫 `localStorage`、不改正式存檔格式），把影子層狀態包成可驗證的信封：

```
{ schema: 'glimmertown-lab.shadow.v1', version: 1, checksum: <FNV-1a>, payload: {...} }
```

三個公開動作：

| 動作 | 行為 |
|---|---|
| `pack(state)` | 穩定序列化（鍵排序）→ 算校驗 → 回信封；非物件一律 `bad-input` |
| `unpack(envelope, {required})` | 驗 schema → 驗版本 → 驗校驗 → 驗必填區塊 → 回**深拷貝** |
| `restore(current, envelope, {required})` | 全部驗過才替換；任何一步失敗就回傳**原本的 `current`**（原子回滾） |

## 2. 拒絕的行為（不是盡力而為）

| 情況 | 代碼 |
|---|---|
| schema 不是 `glimmertown-lab.shadow.v1` | `unknown-schema` |
| 版本大於本核心（未來格式） | `version-ahead` |
| payload 被改任何一個位元（含數字） | `checksum-mismatch` |
| 缺必填區塊 | `missing-block`（並指名哪一塊） |
| 非物件 | `bad-input` |

**不做「猜一下能不能讀」**：未知 schema 或超版本一律拒絕，避免把未來格式讀成半套狀態。

## 3. 自檢（9 項，全過）

`node persistence058.test.js` → `PERSISTENCE_058 {"checks":9,"ok":true}`

1. 往返完全一致（鍵序不同也同校驗）
2. 未知 schema 拒絕
3. 版本超前拒絕
4. payload 改一個數字 → 校驗失敗
5. 缺必填區塊 → 指名
6. 還原失敗時原狀態完全不動（原子回滾）
7. 還原成功拿到深拷貝，改它不污染信封
8. 守恆欄位（qty／unissued／capacity）往返後一致
9. 非物件 → `bad-input`

## 4. 邊界（照實）

- **沒有接進遊戲**：不改存檔格式、不寫 `localStorage`、不動 `index.html`。要接正式存檔需要業主批准（#80 提案已列）。
- **沒有真的把遊戲狀態抓出來**：這支只負責「信封與還原的契約」；把 ledger／warehouse／block／trips 抓成 payload 的那一層還沒寫。
- **沒有遷移邏輯**：只擋未來版本，沒有 v1→v2 的升級路徑；那要等真的有 v2。
- **沒有加密或簽章**：FNV-1a 只防手滑與傳輸壞損，不防惡意偽造。

## 5. 下一步（等業主）

1. 抓狀態層：`captureShadow058()` 從 `singleResearch052`／`intermodal057`／`railBlock055` 的 snapshot 組成 payload。
2. 只讀回放：用 `restore()` 驗「還原後的影子帳與還原前守恆一致」。
3. 要接正式存檔時，再開一張需要業主批准的卡。
