# GPT-048 C3 最終原生候選證據

核實時間：2026-10-25 06:25 UTC。候選 `5fc1718845a97b74fea3c325bb5343ed904c2db5`；獨立main `4346a96543b01ffd47ac3696480661b5de8638ae`。尚未合併發布；正式190/200。

## 原始CI

- [完整原生40166524238](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238)：29/29工作成功，06:19:52 UTC完成。9項產品／基線／公網工作，20項證據傳輸。其public-site目前只證明既有第19波正式站，**不是第20波已發布**。
- [標準push40166524277](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524277)：smoke三次、fp、fiscal-load成功，reuse-push按事件跳過。
- [PR40166527305](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166527305)：成功，精確head相同。
- 已發布main的[smoke40162795551](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40162795551)及[Pages40163187956](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40163187956)成功，沒有跳過部署門檻。

## 原始manifest核對

C3原生manifest：86檢查成功、12種負控，40向獨立幾何與安裝像素相同，semi/leak/crop/empty/mismatch全部0；三種子31/71/103各2000原生付費結果與BASE相同；十款undo/redo/refund與完整存讀保留。

release index SHA256 `debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624`；art SHA256 `585c4bd2633650c7706ae1c0926ec7ffdf7f20c5ddd7dc438eb508f839872b4c`。來源與三版本標籤精確逆還原契約保留，不更改任何source pin。

57場景／40邊緣／8組關閥整幀、兩輪完整舊檔成功。原生writer只產生gameVer14.66→14.67；stateFieldExclusions為空。完整供電四態160案例、275原PNG、1920固定交通相位見證；無production phase bridge、無pw真值賦值。17行人遮擋案例／2負控與正常同種子獨立比較的CI工作均成功。

## 原圖、差異及人工範圍

逐檔重新比較C1與C3：91/91預覽PNG逐byte相同；113場景中112相同，唯一不同`construction-late.png`。成對實看顯示原有非同步施工／吊臂時刻差異，沒有把未完成的瞬時地塊偽稱完整建築；原圖均保留。另實看C3固定12自然rAF終點`natural-fixed-native-endpoint.png`，十棟量體完整可見；manifest終點pending與miss均0，沒有延長固定觀測或改產品預算。

既有[人工範圍](GPT-048-visual-review.md)和[五張原PNG及SHA](../assets/GPT-048/manifest.json)仍有效。未宣稱全部113場景／275供電圖逐張人工看完、業主本次圖審批准或實體手機／Safari／觸控驗收。

原生artifact：preview12587929254、native12588793442、powerCore12588523761、scenes12588204671、performance12587914310、construction12588618091，均出自完整native40166524238。

## 性能與首紅

C3同runner1280×657、BASE/HEAD交錯各40組：median9.55→2.125ms，p90 20.05→19.775ms。恢復組median6.85→2.025ms，p90 19→19.2ms。保留恢復組尾延遲增加，不宣稱所有百分位改善。

暖draw新幾何0、cache40葉。本次manifest `timingInjectedDelayMs=61`，30個故障樣本median63.4ms／p90 63.5ms，first RED為repeatable native redraw regression；恢復綠。C1歷史59ms原紀錄不改寫成本次數字。這是官方Ubuntu Chromium，不是真手機效能。

## 指紋／七軸及未完成步驟

標準fp相對base只bld新增40／變更0／移除0，與倉庫fp零差，1728個超街區條目及棘輪／style全等，無envLeaves警告。日誌中base的T772標籤及本庫T773標籤是保留官方原始fp metadata，實際獨立BASE由checkout命令及manifest綁定4346a965；不手改metadata。

palette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光單軸微降依連續方向第二項起例外披露，沒有改全局光照或權重。

下一步僅依既有授權刪本分支專屬workflow（單獨commit），驗最新head push/PR、Ready／合法合併、main CI／自動Pages／公網精確200。未完成前不計200。來源：業主2026-10-24明確每波實作、驗收、合併發布並完成20波的原話，及main方向檔；不擅開21。
