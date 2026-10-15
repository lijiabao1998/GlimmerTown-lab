# GPT-024 — 15 座英式歷史建築：不換色湊數

## 授權、claim、不可變家族

業主 2026-10-15：「town lab 加入 15個英式建築 ，你自己決定    必須好看和不能重複，最好是有真實的考究  完成後按照規則 到 main lab 的」。只做 Lab，本卡不擴成無限迴圈。Codex／GPT；branch `gpt/british-heritage-fifteen-024`；base `e9c4bad69ed317c4774eb59d8670a5db344673e8`（先閉合 T745／T747 光向修復，PR #28）。本卡先提交、推上去，才寫實作。

**第一筆不可變 fp 家族：`bld`。** 精確新增 60 葉：`bld.24_1_100`…`bld.24_1_159`（15 座 × 四向）。既有 3323 葉、use021、1728 超街區與其他 165 家族必須零變動。沒有刪葉、沒有新材質家族。

## 先量／防重複

base 版本 14.42／T747；原圖 166 族 3323 葉。T747 分支最後 smoke 三連＋fp 全綠；本卡實作前要確認其 main／Pages 結果。已以具詞界的名稱搜尋現有 index 與英式來源檔，以下 15 名無命中；避開已存在救生艇屋、收費所、溫莎／白塔／西敏寺等款式。不是把它們重新命名。

## 15 座設計與一手考據（2026-10-15 實讀；均為原創幾何轉譯）

| #／原生外觀編號 | 原型／中文名 | 必須可讀的結構差異 | 官方來源 |
|---|---|---|---|
| 1／100 | Lavenham Guildhall／拉文納姆行會館 | 長條木構、懸挑上層、木柱斜撐、窄入口門廊；不是一般磚屋 | [National Trust](https://www.nationaltrust.org.uk/visit/suffolk/lavenham-guildhall/history-of-lavenham-guildhall) |
| 2／104 | Little Moreton Hall／小莫頓庭院宅 | U 形木構庭院、上層長廊、突出菱格玻璃凸窗、高低交接的屋面；不是 #1 的長條立面 | [National Trust](https://www.nationaltrust.org.uk/visit/cheshire-greater-manchester/little-moreton-hall/history-of-little-moreton-hall)、[Historic England](https://historicengland.org.uk/listing/the-list/list-entry/1161988?section=overview) |
| 3／108 | Great Coxwell Barn／考克斯韋爾大穀倉 | Cotswold 石牆、巨大陡坡屋面、十字凸出門廊、扶壁与低通風孔 | [National Trust](https://www.nationaltrust.org.uk/visit/oxfordshire-buckinghamshire-berkshire/great-coxwell-barn/history-of-great-coxwell-barn) |
| 4／112 | Rushton Triangular Lodge／拉什頓三角屋 | 真三角平面、三層、三個尖山牆、明暗石材水平帶；不能画成方盒 | [English Heritage](https://www.english-heritage.org.uk/visit/places/rushton-triangular-lodge/history/decoding-rushton-triangular-lodge/) |
| 5／116 | Dunmore Pineapple／鄧莫爾鳳梨亭 | 蘇格蘭夏亭：石柱低翼、鳳梨冠頂、層疊葉冠、局部圍牆；英式在本卡指 Britain，非全是 England | [National Trust for Scotland](https://www.nts.org.uk/visit/places/The-Pineapple/) |
| 6／120 | Dulwich Picture Gallery／杜爾維治畫廊 | Soane 式低磚體、連續採光天窗、獨立陵堂小體；不是現有博物館柱廊 | [官方畫廊](https://www.dulwichpicturegallery.org.uk/explore/news-stories/our-architecture/) |
| 7／124 | Shrewsbury Flaxmill／什魯斯伯里亞麻廠 | 1797 鐵架紡織廠：五層長窗格、紅磚長體、板岩屋頂、窄服務塔；為歷史展示，不新增工業產量 | [Historic England](https://historicengland.org.uk/campaigns/visit/shrewsbury-flax-mill/history/) |
| 8／128 | Settle Signal Box／塞特爾信號樓 | 1891 木造信號室、架高玻璃觀察室、外階、四坡屋頂；沒有新列車調度功能 | [保護協會](https://www.foscl.org.uk/content/settle-station-signal-box) |
| 9／132 | Beamish Heapstead／比米什礦井展示 | 高石砌絞車屋＋木造井架／高架平台、礦車與短軌；官方是木造，不杜撰鋼架井架 | [Beamish 官方](https://www.beamish.org.uk/explore/1900s-colliery/) |
| 10／136 | Bletchley Hut 1／布萊切利一號木屋 | 1939 木板長屋、低氈坡頂、規則窄窗、1942 磚造附件；不是旅館／工廠換色 | [Historic England](https://historicengland.org.uk/listing/the-list/list-entry/1391793) |
| 11／140 | Appleby Moot Hall／阿普爾比市政廳 | 白抹灰石牆、黑線腳、陡板岩頂、六角鐘亭、外石階／半圓圍牆；不是紅磚或假拱廊 | [Historic England](https://historicengland.org.uk/listing/the-list/list-entry/1145607) |
| 12／144 | Kew Palace／邱宮荷蘭屋 | 1631 紅磚小宮殿、三個荷蘭式曲線山牆、緊湊對稱平面、規則窗列 | [Historic Royal Palaces](https://www.hrp.org.uk/kew-palace/history-and-stories/the-story-of-kew-palace/) |
| 13／148 | Orford Keep／奧福德城堡主塔 | 多邊形石砌主塔、三個外凸方塔、外台階、女兒牆；不是既有方白塔／城堡院群 | [English Heritage](https://www.english-heritage.org.uk/visit/places/orford-castle/history/)、[Historic England](https://historicengland.org.uk/listing/the-list/list-entry/1014860) |
| 14／152 | De La Warr Pavilion／德拉沃展亭 | 1935 現代主義：水平奶白樓體、大窗、懸挑露台、圓弧玻璃樓梯體；不用歐式坡屋頂 | [官方展亭](https://www.dlwp.com/about-us/our-heritage/)、[樓梯說明](https://www.dlwp.com/staircase-and-foyers/) |
| 15／156 | Rievaulx Abbey／里沃修道院遺址 | 無屋頂的尖拱石列、破牆／分層窗、院落基址；不畫成完整西敏寺 | [English Heritage](https://www.english-heritage.org.uk/visit/places/rievaulx-abbey/history-and-stories/history/description/) |

保留形制辨識特徵，不冒稱比例精密復原。只參考文字、建築結構與材質；不下載或描摹官方照片。所有源連結入選單供玩家查閱。

## 掛點／允許與禁區

**美術，不加玩法。** 十五座均是原生 `landmark`（k24、2×2）的獨立可選歷史形制：沿用 COST.landmark、原解鎖／就業／觀光／維護／供水電需求與原建造／拆除／undo。不把展場里的礦車、信號樓說成真正生產／調度。基礎放置仍呼叫原 doPlace('landmark')，保留其原 ri(3) 消耗，只在成功後指定既有 b.v 外觀欄，沒有新 RNG 呼叫、存檔欄、k、MSZ、價格或公式。load 現行正規化只要 SPR 有該 v 就能保留，不改 load／save 判準。

新增純幾何來源、獨立歷史目錄／原生載體 UI adapter、精確嵌入工具、CI 探針／負控制／樣張。四視角幾何以既有原創 Scene 與 kit 投影；原 helpers 不改。僅擴充烘焙末尾安裝呼叫、vdraw／doPlace／toolbar 等精確限縮 wrapper。新 `__noHeritage024`：即時显示原地標 v0，并拒绝新的特殊选择；不删除已保存的合法编号。

既有守衛／*.pins／harness／fp／gallery／規則檔零改；smoke 只准新增。分支 workflow 只 contents:read、自分支，无部署／推送；绿后移除。release 才改 T／版本三处／日志／本方向进度。只提交 CI 真产的新基线，不手改。原世界不自动替换房屋、不增加密度／全球光影，不碰 Town／玩家 origin。

## 动手前固定验收（未运行不是通过）

1. 60 新 SPR，15 个不同几何作者函数／焦点构件；每视角不得重用图、翻转贴图或只有色差。15 个 alpha 剪影（去掉共同地坪）逐项非同图；样张真 Chrome，必须肉眼看，没把握交图给业主。
2. 整数像素／共享 z-buffer：无半透明软边、无裁到画布边缘、night 像素只在可见 opaque 实体窗／灯，尺寸／ax／ay／sz 与 native 2×2 一致且地基不越界。四向全部检查，不修改原尺。
3. 已有3323叶／use021／block559 零变；只新增 bld.24_1_100…159，无旧叶变。七轴不降才可 §7 自合。下降则停等业主，不改基准讨好评分。
4. 新目录恰15个，文字／资料来源／价格为原生值；真点选→在2×2合法地放置→root＋3ref正确，实际扣费、原 unlock／失败／资金不足不绕过；正常旧地标还是0–2，不能被上次选择偷偷改形。
5. 实弹同种子短视野控制：原地标 vs 新外观仅合法 v 不同；收费、供电／水、研究／统计、原保存记录其他字段不变。三组种子。同原存档重复load/save保留15外观，undo和拆除不留ref；测试用CI自己的slot3。
6. 日／夜四向共120个原始图＋真城市样张；季节／有无雪／远景／边缘／施工／hover等尽量CI覆盖，缺项明确标“未跑，待Claude/Codex补跑”，不冒充。完整原功能开机三连／console0。
7. 每条新守卫相应活体负控制：删一座安裝→缺图首红；复用一座几何→剪影重复首红；夜灯写在透明处→night首红；拿掉旋转入口→真实view首红；绕原收费→费用首红；source嵌入失配→嵌入首红。每条首红均保留，不靠 parse 错误冒充。
8. 最终准确head push／PR CI smoke3＋fp绿；最新main／Pages绿，分支workflow最后绿后删。原子CI artifact按digest与60叶白名单核对逐位提交。T/r从最新main分配；日志commit写#PR。合后main／Pages实际版本与来源再核。

## 回滚／停手

关闭 __noHeritage024 回原图，不重写城市；正式撤回走普通 revert PR。CI同条三提交无进展／风格下降／额外家族／main或Pages红／需要改现有守卫就停止，不擅自放宽。全部15做完交回，不自加第16。

## 第8节／实际记录

- [x] 卡面先推，验收没有事后放宽
- [ ] 同种子控制与旧档往返（不改模拟／存档格式；视觉v是原有字段，另做真实控制）
- [ ] fp仅指定60叶；整帧逃生阀等值未跑，不写通过
- [ ] 全艺术状态真实图，没覆盖的逐项写明
- [ ] 新守卫故意改坏首红在目标
- [ ] 最终准确CI三连与fp绿
- [ ] 数字与失败均据实

尚未施工／未验证。原Lab其他作者未追踪备份与分支保留；只在Lab自身ignored scratchpad的隔离worktree写。
