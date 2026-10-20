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

## 施工紀錄（首卡之後追加；原門檻不改鬆）

- 首卡已於動手前推送 [5198b553](https://github.com/lijiabao1998/GlimmerTown-lab/commit/5198b5537d06b3cc410d4320e93f51b0f50ed914)，相對main只新增本卡，唯一fp家族仍為bld。GitHub API建立的遠端commit／tree有實際核對；本地簽章物件還原只完成main，後續API提交沒有冒稱已被本地git fetch。
- 取圖經過：唯讀branch CI [39365810063](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39365810063)保留HE八頁HTTP403；沒有繞過。改讀已驗證業主／設計事務所頁，[39366033574](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39366033574)、[39366216842](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39366216842)、[39366576326](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39366576326)保留來源、原圖、SHA256及限制。RSC CDN憑證鏈失敗未關TLS；Bennetts頁CSS中的真照片已成功取得。Jubilee首頁有超時，歷史頁的2014台階／擋海牆原圖可用，沒有把舊海灘圖說成泳池照片；Winter Gardens舊照片按歷史參考標示，未說成目前全複合體。
- 已實看並逐位核雜湊的考據：Landmark外部與內廳、Dreamland亮字鰭塔、Eastbourne四柱與雙階碟頂、Alexandra歷史全景圖、Jubilee受損台階／白牆、Dudley五S棚、Penguin懸挑交鎖坡道、Globe木骨茅頂外牆、Bennetts的RST日／夜外觀、Winter Gardens歷史外部與Empress內部。這是建築考據，並非本波遊戲圖驗收。來源照片不嵌進遊戲。
- 清單勘誤：首卡把Chichester舊款說成單一帳篷頂，實際已存在的是Chichester Market Cross（v264），沒有Festival Theatre款。Landmark最接近的既有圓量體比較改用Arnos Grove（v208），並保留與愛德華劇院的結構辨別；Dudley對比k275實際名稱為refreshment cafe，非arcade。k272／273只有原生v0；接觸表明列此限制，不捏造舊款四向。這些是比較對象名稱校正，沒有減少10款、40葉、80圖或任何驗收要求。
- 本地僅靜態核實93個inline script語法、embed精確、剝除本波標記／唯一安裝點後index等於獨立main、smoke僅新增一項自檢；遊戲／Chrome／fp等全部仍待CI。本波初稿未定稿、未過驗收、未開PR、未發布，計數仍6/20。

### 第七波首輪與修復證據（尚未發布）

- 實作4cbf831de65034c3739a11b3d8ea885ce923917e，首輪[39367375993](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39367375993) native負控制誤刪第六波360葉，首紅`wrong first RED missing installed leaf: undefined`。修正提交bcdd061485591f384ecb79f4f74668e87dfef912只把新探針目標改為400／404，沒有更改判準；[39367765602](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39367765602)的native十二個真故障首紅與恢復全部通過。初輪16份完整原始job logs共18,298,550 bytes另存scratchpad/wave035/logs-initial，有每份SHA256清單。初輪常規smoke/fiscal因新提交的既有concurrency取消，沒有聲稱完整通過。
- 圖審後唯一美術修正c9d35d888feb21d6de06288f76969d085e4efb45：Eastbourne增加照片可見的實體內側舞台背板，外牆／柱子／四視角／另外九款不改。[39368273775](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39368273775)目前native、preview、97場景、17行人、正常模型配對、40組交錯效能及public-site全部通過。native仍為十二個真故障首紅、十款實扣$2000、undo/ref拆除退款/redo與二輪完整保存。
- c9d35d8 index原文11,183,234 bytes，SHA256 ab0b4b3b17e1fe9e92dbb2d7679b358ac00fb619ae322d396ea88fcd2fd89fc6；Git blob2c37e4cd87db823b120310122972439bab5c4734。root tree222fd5cf234ceef8bb54bbe1f0f265c5523a57f4，與本地暫存tree精確一致；main仍d5a357e。
- c9d35d8原圖80張／三接觸表及manifest已從不可變job118449998793取回並驗證每張byte-count/SHA256。相對已逐張實看的首輪80圖，只有408／411兩張day原圖改變；78張原圖逐位相同，兩張新圖及三張新接觸表已再實看。十近景原圖均取回（scene-evidence五job），其中六張因場內Eastbourne改變而再看，四張SHA256與已實看首輪相同。作者已實看本head的80單圖、3接觸表、10近景與舊款比較。其餘87場景未逐張人工；這不是獨立覆核，獨立程式／安全／視覺仍待完成；實體手機、Safari、觸控未測。
- c9d35d8場景57+40、8張1280×657完整BASE/閥關逐位等值，完整舊檔二輪零差，1px畫布與少$1原生存檔故障首紅/恢復均通過；原生正常seeds31/71/103×三checkpoint包含全部欄位，僅實際b.v差異，不用閥、不刪欄位、不正規化輸出。
- 常規push [39368273712](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39368273712) smoke job118450184006真跑三次全綠；財務job118450184079結果ok:false、checks52、negative10，唯一失敗是source-integrity內要求current-fp等於尚未更新的root基線，沒有當成財務53全綠。fp同樣因預期40葉新增及尚未提交原始基線紅，不改低門檻。
- 同head fp相對base只新增bld40、變更0、移除0；舊3623 subs、其餘165家族、blocks1728／5ef6eb67及env全相同。新bld1299／CRC6fe6e361，全族166／3663 leaves，夜2199。七軸完整披露如下；本波是既有連續授權第七項，依AGENTS第7節使用第二項起下降披露例外，不改分、不等同全局風格變更。

| bld七軸 | main之前 | 本波c9d35d8 |
|---|---:|---:|
| palette | 1 | 1 |
| hardEdge | 0.9483921112714824 | 0.949393389794125 |
| lightDir | 0.8212867355043686 | 0.8183217859892224 |
| shade | 1 | 1 |
| density | 1 | 1 |
| nightRule | 0.9878124606474332 | 0.9881813927037836 |
| variants | 1 | 1 |
| total | 0.9654 | 0.9651 |

- 基線傳輸現況：常規fp附件12240571606（fp-c9d35d888feb21d6de06288f76969d085e4efb45.zip，70,729 bytes，ZIP SHA2564c4fe7f570b112e6ddec023f037fa1057406fe1a83c5286ce7add3979a7a226e）存在；GitHub下載工具已產出精確file_id，但容器GET被proxy403阻擋，Library只回signed URL、workspace_path:null，沒有宣稱轉入成功或猜URL。額外baseline-evidence job118449998917完整fp輸出後，ArtifactService/CreateArtifact連續網路timeout而上傳失敗；原始console完整取回fp.json399623 bytes／SHA2566576d17c31cfdcdbe094157964123de5218f0703bec6dd86ba2a4cb2af30d531及style.json73166 bytes／SHA2569bc93bf8622ed87feab8b0917b41c67daa4b4a38f16c94c1c5013e3f9077b1be。它們只存候選證據，沒有採用失敗附件或前head舊基線。
- 下一提交只為自己的暫用workflow新增produced-file SHA256/head/tree附件清單及本紀錄，原`node fp.js --check`/退出碼/範圍/全部門檻不變，仍contents:read。用新head的實際成功附件和同一producer的完整字節轉輸核對後，才能原封提交root fp/style，再等完整最後CI。沒有重跑舊失敗run，也沒有手動Pages。

### 原始基線傳輸已解決

- 新push d347d9d298710f297315c8ca7a41e692d9c2283c 含精確main d5a357e，root tree10045a8be6967ff90a7479afcecdff1814c67625，index／runtime／全部美術與已圖審c9d35d8逐位相同。追加的manifest只加強來源核對，沒有改fp命令或退出碼。
- [run39369262640／job118453169415](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39369262640/job/118453169415)已成功上傳實際附件[fp-d347d9d／12241170620](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/39369262640/artifacts/12241170620)，69,837 bytes，ZIP digest29af8bac59c444ccb48aa535aa710c34a41b02b572c7c3a5dfe763a59c3dacf8。仍因root舊基線而fp預期紅，沒有冒稱本run整體全綠。
- 附件包含原始fp.json、style.json與provenance-wave035.json。取回方法是同一producer的逐位元console傳輸；依實際附件內的manifest核對head、tree、byte-count、SHA256，再把原始bytes寫入root，沒有重新serialize或改metadata。fp.json399623 bytes／SHA256e75d77e53ee586457ac43836223d2af54b70f6bc30b963411cb92651f5d129fe；style.json73166 bytes／SHA25614cc8bd36f84a8d933b5470a3afdee1aad6fc20c756ba8c78643e33ba9dcdd6d。並非使用前head失敗附件、不是把Library下載連結當本地文件。
- 原始subs集合差精確為bld.24_1_400..439、40葉，舊3623 entries逐值相等、其餘165家族與style逐族相等、blocks全相等、env相等。七軸與上表相同，bld CRC6fe6e361；來源原文留scratchpad/wave035/adopt-baselines。
- 下一head僅原始基線及本紀錄變動；完整原生／煙霧三次／fp／原財務53+10仍待新的實際回執。未開PR、未配T／版本／日誌、未移除臨時workflow、獨立覆核未完成；仍6/20已發布。
