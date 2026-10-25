# GPT-048 C3 精確版本發布候選

C2 head3eb4d120a1050624e7735f751c38fa1a6f05c648 全綠：[標準push40165543251](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40165543251)、[PR40165545757](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40165545757)、[完整原生40165543289](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40165543289)29工作全部成功。C1首紅保留於C2歷史記錄，不改寫為本來綠。

最新fp：相對base新增40／變更0／移除0葉，觸及家族只有bld，與凍結首卡宣告完全一致；沒有envLeaves警告，倉庫fp／block／棘輪／style全部零變動。全族總分沒有下降；bld受光單軸微降照七軸原值披露，未修改全局光照／色階／指標。

C3不改任何模型、原160供電案例或既有閾值。index只更新GAME_VER14.66→14.67、GAME_ANCHORT773→T774及開始畫面同一版本字；精確逆還原C2原始index SHA256 b1a50df75c5765b400b82b4d36dc4efd69593ea5b516c318c074d2e9b6ac6d76。發布index SHA256 debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624。

四份新release probe完整逆還原C2，原candidate probes保留不動。舊存檔由真原生writer對獨立BASE進行14.66→14.67遷移，只有gameVer一欄允許明確差異，仍比對全部欄位與兩回合，不隱藏normalize或field exclusion。source契約對兩個metadata文件採精確插入／替換，保留業主原話及運行；補上19波已核實190正式收據。另附五張原PNG、SHA和人工審閱範圍。

版本字和source契約的10個負控、四probe逆向負控、額外release檔逐byte破壞負控皆在本地純源碼模式通過；沒有本地遊戲／Canvas／指紋執行。新版CI仍未跑完，不能拿C2綠代替C3。發布版全套原生最後綠後才以獨立提交刪專屬workflow，再驗最後head標準CI，合法合併、mainCI、自動Pages與公網Chromium。正式仍190，未計200、不開21波。
