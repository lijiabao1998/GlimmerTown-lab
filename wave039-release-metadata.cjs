'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "252e70b6c45069fb86b569a4b9ffbcbbca6edc54295122de1644cf7b14a339bb",
    "replacements": [
      [
        "## r211 — T764",
        "## r212 — T765 第十一波十座原創英式建築（原GPT-039；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r212 | [T765](docs/T765-british-wave11-original.md) | 十款原創英式外觀／四向40槽；僅bld新增560..599，既有100款／原生k24付費與供電／存檔／模擬不變。v14.58只改三處版本標籤的4 ASCII byte；僅PR47合入且公開精確核實後計11／20波110座，此前仍10／20波100座 | C6 dae4595f完整原生40073360079首次21／21；push40073360142真smoke3／fp／財務53＋10綠，PR40073363620四工作綠。發布新head完整驗收及最後CI待實核 | #47 | docs/assets/GPT-039原PNG／manifest；完整原生CI附件及T765證據。舊原PNG不重做、不改色；圖頁已可公開讀取 | 本發布head尚未合併部署。完整發布驗收／刪workflow後最後CI、main自動Pages與公開版本待核；不冒稱全部275供電PNG人工圖審或實體手機／Safari／觸控測試。bld total0.966→0.9658及lightDir下降依連續授權披露，七軸詳卡；raw基線bytes不手改 |\n\n---\n\n## r211 — T764"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "652253b87dbabaa8cc79460112549e8950674678b7171085a694a079804fada0",
    "replacements": [
      [
        "| 11 | 第十一波十座英式園林與溫室建築 | 「每波 10 座，共 20 波」 | 美術 | bld | 候選題，尚未考據／開卡；只做有史料的建築外觀，不新增人口密度／全局天氣或生態玩法 |",
        "| 12 | 第十二波十座原創英式鄉村活動與日常服務建築 | 「每波 10 座，共 20 波」 | 美術 | bld | 待第11波正式驗收與公開發布後再開卡；先核既有110款避免重複，原創不冒稱地標，不動全局密度或玩法 |"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十一波10座原創英式建築（原GPT-039；僅隨PR47合入且公開精確核實後計11／20波110座，此前仍10／20） | [T765](T765-british-wave11-original.md) | #47 | 2026-10-24 | C6 dae4595f完整原生21／21、push真smoke3／fp零差／財務53＋10、PR四工作綠。發布版本3標籤4 ASCII byte，其他生產來源不變；發布完整驗收／最後純刪workflow CI與公站另核。bld七軸詳T765，total0.966→0.9658、lightDir下降依第二項起連續授權披露。未稱全部275供電圖或實體手機／Safari／觸控人工驗證。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release039 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release039 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release039 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release039 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
