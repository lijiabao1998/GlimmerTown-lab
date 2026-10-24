'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "0fb0fbefa6ff1a630efe784873497d7df3276d454c603769f43080319a244940",
    "replacements": [
      [
        "## r214 — T767",
        "## r215 — T768 第十四波原創英式鎮務與工坊建築（GPT-042；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r215 | [T768](docs/T768-british-wave14-original.md) | 第14波十款原創英式鎮務與工坊建築／40向，bld680..719；原生價格、存檔、供電、模擬及歷史模型不變。 T768／v14.61僅三標籤 | 首輪native40104078357全綠；原始fp及財務首紅40104078292保留；採原始附件後最後head另核 | #53 | docs/assets/GPT-042原PNG與manifest | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式13波130座，不把候選算140座。 未實機手機／Safari／觸控，非全部113場景／275供電圖人工逐看；bld七軸下降詳T768 |\n\n---\n\n## r214 — T767"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "7ec44170c91b83b392f137b833e49219cb64136bd07d920caffb492046af27e5",
    "replacements": [
      [
        "## 待辦（",
        "### 第十四波發布準備（T768／PR #53；2026-10-24）\n\n第14波十款原創英式鎮務與工坊建築／40向，bld680..719；原生價格、存檔、供電、模擬及歷史模型不變。發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式13波130座，不把候選算140座。\n\n原始首紅40104078292：40新增bld葉未採baseline，財務52成功／10負控，唯一來源指紋失敗。未改財務模擬；僅採同次常規fp artifact12564141656原檔。首輪完整native40104078357成功。發布head完整驗收及最終CI另核。\n\nbld七軸完整披露：palette 1→1；hardEdge 0.9552323566926975→0.9559013242882268；lightDir 0.8076673164392463→0.8074730842305257；shade 1→1；density 1→1；nightRule 0.9900276945969144→0.9902756873333572；variants 1→1；total0.9647→0.9648。依第二項起連續授權處理，不手改分數或放寬門檻。作者實看日夜接觸表與五張原生近景，獨立review其餘五張近景及57張場景／四向圖；獨立看圖範圍詳manifest，不冒稱業主批准或全部圖片人工審閱。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十四波10座原創英式鎮務與工坊建築（GPT-042；發布準備，合併及公開驗證後才計14／20波140座） | [T768](T768-british-wave14-original.md) | #53 | 待正式發布核實 | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式13波130座，不把候選算140座。 bld七軸詳T768，total0.9647→0.9648及lightDir下降已依連續授權披露；未實體手機／Safari／觸控，非全部113場景／275供電圖人工逐看。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release042 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release042 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release042 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release042 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
