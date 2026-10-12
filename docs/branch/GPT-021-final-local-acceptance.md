# GPT-021 重建候選：最終本地結果

固定 runner 已全部結束，沒有排入新測試。本輪只交候選預覽；尚未合併或部署，外部寫入保持暫緩，仍需使用者查看重建版畫面後的新確認。

![day88成熟36款實際遊戲](GPT-021-rebuild-preview/native-city-attempt-06-rot0.png)

36款涵蓋12個已有用途各三種形制，五份原美術保留原始 SHA；共用 kit 明標重建，不能聲稱恢復遺失的最終 kit。全部新根來自原生付費工具、付費牛舍升級或正常分區出生／成長。沿用原價格、容量、鎖定、配方與調度；市場中大型仍有限制，外觀軌道不增加調度功能。

## 固定清單結果

| 項目 | 結果 | 證據與範圍 |
| --- | --- | --- |
| 原生36款成熟同框 | 完成，581/581 | day88真Chromium畫面；24直接建造、3付費牛舍升級、9正常分區成長。 |
| 遠景日夜、四季、四方向 | 完成，8771/8771 | 已有32實際遊戲frame；近景補驗另列，沒有重跑。 |
| 固定近景／疊層補驗 | 完成，556/556 | attempt02明示重用attempt01成功項與原始SHA；首次失敗原樣保留。 |
| 近景夜光 | 完成 | 33原生供電根實際nightLayer→NL629→主畫布；UKP021-M、UKF021-L、UKT021-L未供電，保留原生暗燈gate，不強設pw。 |
| 全批雪帽 | 完成 | 36款實際送出原生snowCap，非空且不漏出本體剪影；既有weather QA出口＋3個真原生日結算累積rainDays。 |
| native尺寸、倒影、FW | 完成 | P.map/cl與原root.sz獨立尺寸；大型RCI倒影為exact approved 1×1；alpha、tile columns、候選遮擋offset核對。 |
| 農人／拖拉機／泡泡 | 完成 | 實際helper與原生矩形／icon繪圖核對獨立期望。冬季農事overlay為N/A，原條件sea===3排除，未取消gate。 |
| portrait作坊、EW大車站 | 完成 | 真付費工具及自然成長再次取得活世界，8個四方向本體draw guard；保存day105完整原生save。未用偽造bld重建scene。 |
| 邊界 | 完成，限兩case | 1×1真付費edge成功、3×3越界拒絕；不稱36款邊界矩陣。 |
| 鎖定 | 完成 | 明標低rank合成save，trusted catalogue click被原規則拒絕，無扣費／metadata變更。 |
| hover | 完成建造preview；成屋淡出未測 | trusted mouse hover於空edge tile(x0,y1)，原生footprint/HUD正常。未把已建候選楼體淡出聲稱通過或N/A。依最新指示不追加case。 |
| dispatch／metadata故障守衛 | 完成 | 同一formal guard先綠→真optional metadata改壞首紅→復原綠；沒有手填firstFailure冒充判定。 |
| 存讀往返、malformed、live stats | 完成，24/24 | 原save02證據保留：三cycle83art資料、13malformed、正常advance所得16cars；全部native欄位與15stats配對。 |
| 舊變體冷載入 | 完成，43/43 | 53/v1及139/v0/v1明標synthetic fixture，4 fresh browser；boot後凍結並真native reload exact input。兩組101 schema／38RLE／全BL.v／15stats精確一致。 |
| slot1/2與backups | 完成 | 四arm共36組非空before/after完整字串一樣；set/remove/clear audit皆零，selector3。disposable profile，不碰真業主槽位。 |
| desktop／390／360互動 | 完成，304/304 | trusted目錄、取消、duplicate、undo/redo、不同工具清selection及fallback整幀等同main。 |
| first-asset 30樣本 | 完成，限P-L | 每arm30交錯樣本；單一5×5車站，其他families暖cache，不稱36款微bench。 |
| 原smoke三次 | 完成 | exit0／0／0，81.210s／81.971s／76.710s，console error皆0。 |
| 完整fp --check | 完成 | exit0，71.465s；葉子、block559、165家族棘輪全部零變動。 |

## 效能與證據限制

30次交錯warm整幀median：重建21.55ms、原版26.10ms。整批冷cache整幀median：重建327.80ms、原版84.05ms，差243.75ms。單一5×5車站first-use整幀median：重建98.50ms、原版70.00ms；p90為210.40ms／166.00ms。三種條件分開呈現；冷繪製成本未藏起來或放寬門檻。

實際遊戲draw trace、helper/像素mask與PNG支持各列聲稱；沒有把全部composition稱為獨立逐像素golden。hover成屋淡出、全36邊界矩陣及全36first-asset微bench均未聲稱通過。83metadata新字段可選；101包含18雙方absent sparse字段，不能稱其各有非空fixture演練。

兩張第一輪compat圖片因第二輪同名輸出被覆蓋，不再作歷史圖片證據；首次失敗raw、log、當時source及原SHA保留。第二輪4張、近景42張與day88成熟圖均已核對實際bytes/SHA。錯誤觀測第一次把T629離屏光層當作未畫夜燈、拖拉機期望多加6px；修正的只有測試出口／期望，production index仍為8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed。

[固定runner退出碼與log雜湊](GPT-021-rebuild-evidence/fixed-final-runner021-results.json) · [完整本地收據](GPT-021-rebuild-evidence/final-local-fixed-list-receipt.json) · [近景／守衛獨立覆核](GPT-021-rebuild-evidence/final-fixed-list-review.md) · [save/compat獨立覆核](GPT-021-rebuild-evidence/final-fixed-save-review.md)

[商店近景夜間](GPT-021-rebuild-preview/remaining-night-UKU021-M-attempt02.png) · [商店近景雪帽](GPT-021-rebuild-preview/remaining-snow-UKU021-M.png) · [直向作坊](GPT-021-rebuild-preview/remaining-alternate-UKC021-M-attempt02.png) · [EW大車站](GPT-021-rebuild-preview/remaining-alternate-UKP021-L-attempt02.png)

## 外部寫入狀態

2026-10-12 13:39 UTC，GitHub create_tree的遊戲PNG及簡短狀態寫入遭自動審核拒絕，理由是可見證據不足以確認該外部目的地與parent核准。此項已停止，沒有重試、換格式或換途徑。先前raw/gzip拒絕同樣維持；所有新證據、本地提交及bundle留在候選workspace。使用者上傳許可待parent接收，不把測試完成當作合併／部署授权。
