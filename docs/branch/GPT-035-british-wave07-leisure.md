# GPT-035：第七波十座有考據的英式休閒與遊樂建築

## 動手前卡面／不可變範圍

- 分支 `gpt/british-wave07-035`，起點為當下遠端main `d5a357e0105502c62bf2fdc42d4a8c9c1b7c77b5`（T760／v14.53／r207）。本卡先單獨提交並推成功，才開始新美術；本方向是既有20波授權的第七波，不重開方向或批准卡，不重做第六波。
- **第一個commit凍結唯一fp家族：`bld`。** 只新增 `bld.24_1_400..439` 共40葉＝10款×4原生幾何向。main既有3623 subs、165其餘fp家族、blocks1728／CRC `5ef6eb67`、env全部零變。既有fp/style保留CI原始bytes，不手改metadata或判準；不擴張受保護檔案權限。
- 對應業主2026-10-16原話：「lab 新增英式建築，每波 10 座，共 20 波。第一波我看，如果沒回應就繼續；gpt 的圖我很放心。」業主2026-10-20明確要求本接替任務獨占接續第七至二十波，遵守全部既有門檻。開關仍運行；無開放PR；Claude可見分支最後更新2026-10-04／14，無本地其他遊戲測試寫入者。
- 開工main CI [39363318570](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39363318570)與自動Pages [39363879284](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39363879284)均success／attempt1；公站[job118436564189](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39359542415/job/118436564189)已真實核HTTP與Chrome文件200、11126738 bytes、SHA256 `535318c1eb7891d8b714ab7ddebdb0e4e6fdad0b75be97f147048a5bba050458`等於main，v14.53／T760、第六輯10款40葉、slot3及活畫布。完成計數6／20波、60座，不計T748歷史15座。
- 基線166家族／3623 subs，bld1259／CRC45971143。bld七軸palette1、hardEdge0.9483921112714824、lightDir0.8212867355043686、shade1、density1、nightRule0.9878124606474332、variants1、total0.9654。原始metadata仍T759／14.52，不手改。
- 本地從已核對1153檔完整快照及GitHub原簽章payload恢復精確main Git物件，root tree225cb453bb20bf605ad7b9ed6ec4896fddb83e74、父95689b5皆吻合；新分支工作樹乾淨。直接git網路代理403的既有問題不靠改憑證／安全設定繞過，遠端核對與寫入使用既有GitHub連線，分支更新用明確head lease、只快進。
- 所有遊戲、Chrome、像素、指紋與效能只在GitHub Actions。本地只做Git／靜態來源／語法／JSON／原圖bytes及人工圖審。自用埠8199、測試存檔slot3，不碰業主存檔。只允許自己分支的臨時唯讀workflow：contents:read、不部署、不推送，完整最後綠且記卡後獨立只刪，後續不加回。

## 原型與一手來源（已核文字，尚未繪製）

只做原生2×2地標外觀展示，不加入泳池、動物園、劇場的玩法／經濟功能。以下均為比例壓縮的原創幾何轉譯，不嵌入照片，不冒稱精確測繪。定稿前看原圖與最接近舊款；來源不足可在繪製前換原型，須記理由，但10款／40鍵／唯一家族與凍結門檻不變。

| 起始v | 原型／一手來源 | 必須保留的結構差異／舊圖比較 |
|---|---|---|
| 400 | [Ilfracombe Landmark Theatre：設計事務所](https://www.timronalds.co.uk/landmark-ilfracombe)；[營運機構](https://landmarktheatres.co.uk/our-venues/the-landmark-ilfracombe/) | 高低雙截錐廳體與相連低矮玻璃foyer，不同於Chichester單一多角帳篷頂或舊愛德華劇院；年份來源有1997開放／1998完工之別，不替它們改成同一日期 |
| 404 | [Dreamland Cinema，HE1260315](https://historicengland.org.uk/listing/the-list/list-entry/1260315) | L形量體、突出高磚鰭塔、東側高方體玻璃磚、低長景觀窗與平淡側後舞台廳，非工廠或普通方塔換色 |
| 408 | [Eastbourne Bandstand，HE1385904](https://historicengland.org.uk/listing/the-list/list-entry/1385904) | 截圓亭、兩階淺碟頂與尖飾、四巨柱、掃弧開放柱廊及兩座覆頂看台；不同於k272傳統八角鑄鐵亭 |
| 412 | [Alexandra Palace，HE1268256](https://historicengland.org.uk/listing/the-list/list-entry/1268256) | 中央高山牆與大圓窗、雙層長柱廊、端部方塔及東南播送鋼桅；選取主要宮殿而非整片七英畝場地，與k273小海濱廳比較 |
| 416 | [Penzance Jubilee Pool，HE1221190](https://historicengland.org.uk/listing/the-list/list-entry/1221190) | 三角泳池、彎曲混凝土邊界、台階平台與嵌入更衣小間，池水不透明原生畫素；不同於第五波Saltdean半圓展亭／矩形池 |
| 420 | [Dudley Zoo Entrance，HE1216535](https://historicengland.org.uk/listing/the-list/list-entry/1216535) | 五售票亭、八通行口、沿坡逐級交鎖S形薄板雨棚與細柱；不畫成普通連排盒屋，也不增動物／票務玩法 |
| 424 | [London Zoo Penguin Pool，HE1225665](https://historicengland.org.uk/listing/the-list/list-entry/1225665) | 橢圓水池、獨立交鎖懸挑螺旋坡道、升高框景開口及端部頂棚；與Saltdean矩形池及本波三角池不同，無動物模擬 |
| 428 | [Shakespeare’s Globe：業主機構建築記錄](https://www.shakespearesglobe.com/discover/shakespeares-world/the-third-globe/)；[建造觀察](https://www.shakespearesglobe.com/discover/blogs-and-features/2017/06/12/building-shakespeares-globe/) | 三層多邊木骨白牆環廊、茅頂環與開放中庭、雙柱舞台篷；不同於舊封閉愛德華劇院與Chichester單一屋頂 |
| 432 | [Royal Shakespeare Theatre，HE1207396](https://historicengland.org.uk/listing/the-list/list-entry/1207396) | 彎曲1932入口、磚翼、中央舞台高塔、2011西北觀景塔與Swan圓弧後廳；壓縮整體關係，不重做k281劇院量體 |
| 436 | [Blackpool Winter Gardens，HE1072007](https://historicengland.org.uk/listing/the-list/list-entry/1072007) | 古典陶面入口、山花／玻璃圓頂、鐵玻璃大廳及Empress段荷蘭山牆／角塔；選取可辨主結構，不把整街區照搬，與k273／Blackpool鐵塔基座實圖比較 |

前置重複核對已排除 De La Warr Pavilion：它已是T748／heritage024的delawarr，不能再算第七波新建築。未開始它的繪製，改選一手資料完整的Ilfracombe雙錐劇院。

## 動手前凍結驗收（不得放寬）

1. **10款／40原生向／80原始PNG**：每款獨立world-space量體、結構窗型與屋頂，沿用既有光柵器、調色板、地基及全局風格。排除共用鋪地後10輪廓互異；四向是幾何投影，不是鏡像／換色。保留80原生160×196日夜PNG、3接觸表、manifest及最接近舊款的原圖同比例比較。
2. **原生整合／價格／交易**：只新增bld400..439，k24/lv1/2×2、價格$2000、容量／維護／工期／解鎖／RNG／保存schema不動。十款DOM選擇、實扣費、undo／退款／redo、參照格拆除／恢復、旋轉必測；至少12真負控制首紅後恢復，包含少葉／尺寸／夜漏光／軟畫素／裁切／空圖／輪廓克隆／安裝克隆／錯收費／redo失效／合法來源越界／相機旋轉凍結。
3. **來源邊界**：獨立Git物件BASE=d5a357e為標準。剝除本波明確標記純美術／CSS／runtime與唯一安裝點，只精確還原GAME_VER／GAME_ANCHOR／startVersion456三發布字後，index須逐位元等於BASE。合法HTML越界故障須首紅，既有fp/style/sheet/容量守衛不變。
4. **正常模型與保存**：BASE與HEAD正常運行，不用逃生閥；seeds31/71/103×3短視野檢查點比較全部序列化欄位與stats，只允許實際新增外觀b.v，不刪欄位、不正規化輸出。BASE只對齊精確三發布字且反向證明字節相同；真少$1首紅／恢復。兩端十款匹配交易、首次update及市長選項惰性欄位保留；真正舊檔與新外觀各兩輪load→save全欄穩定，只可明列精確gameVer遷移。
5. **57＋40原生狀態**：白天／夜、春夏秋冬有無雪、4方向、近遠、四邊角、施工早中晚、懸停淡出、原適用的倒影／水邊／行人／煙／夜燈／招牌皆列適用性及原生證據。97原始場景及manifest保留，至少人工看80單圖／3接觸表／10近景／最接近舊款；全97未逐張看的不寫已人工全審。2×2地標既有不畫水面倒影、inactive煙囪無煙、neon限k2等不適用必須從真路徑證明。
6. **逃生閥整幀等值**：`window.__noBritishWave035`可即時退原圖。獨立BASE與HEAD閥關8個完整1280×657畫布逐位元一致，完整層不裁圖不放容差；真畫布1px與原生保存少$1負控制首紅／恢復。
7. **行人／效能**：17原生深度與遮擋例及真故障／恢復；同環境BASE/HEAD40組交錯median/p90，暖畫新烘焙0；30實測真延遲負控制與恢復重測。已知週期成本依既有判準處理，不新造基建、不用桌面推稱手機。
8. **fp與七軸**：含最新main的push只新增明列40葉，3623舊subs／165其餘族／blocks1728／5ef6eb67／env零變。fp/style只逐位元提交同次CI原始fp-rebake；舊基線metadata不得手改。列前後七軸；下降按連續授權第二項起例外在卡／PR／方向已完成表披露，不能改分或放寬。
9. **獨立審查／最後CI**：所有新圖真看，獨立程式／安全源碼與視覺覆核有精確head、範圍、findings與限制；CI綠不能代替。最後head分支smoke實跑3次／fp／原財務53項10負控制全綠，PR依既有T759可能核實重用同head/tree完整push，須明寫實際模式、不冒稱重用為再跑3次。最後完整分支唯讀workflow真綠記卡，另筆只刪該workflow；刪後每筆確認未加回，最後push/PR須重新綠。受保護檔案、既有斷言／判準與權限均不變。
10. **合併／發布分開**：合前重核main與Pages綠、開關運行、現有PR與ancestry、三權威最大T/輪次再配號，才搬卡／改三發布字／日誌#PR／更新待辦與完成列；方向開關及原話不動。真最後head必要驗收與獨立覆核完成才Ready及合自己的同一PR，追精確main CI及既有自動Pages（不手動觸發pages.yml），公站實際HTTP與Chrome主文件SHA等於當下發布main、版本／第七輯10款40葉／slot3／完整活畫布及錯誤核實後才計7／20波70座；本地／commit／合併／部署不能混稱。

## §8 開工狀態／沒做成的事

- [ ] 本卡尚未推成功；推成功後才繪製，動手前驗收不改鬆。
- [ ] 本波新美術、原生交易、正常配對、保存、像素、場景、行人、效能、故障控制與fp均未執行；沒有任何本波通過結果。
- [ ] 尚無本波PR、Ready、合併或發布，總數仍6／20波60座。
- [x] 第六波87其餘場景未逐張人工、實體手機／Safari／觸控未測的限制保留，不轉寫成通過；詳PR42發布證據6282634095。
- [x] 既有方向與批准有效，沒有重建方向／批准卡、沒有排程修改、沒有受保護檔案權限擴張。

回滾：分支未合前停止並保留證據；閥關退回既有圖。main紅或公開核驗失敗依AGENTS第7節原停手／回報規則處理，不用重跑賭過，不逕自revert他人內容。
