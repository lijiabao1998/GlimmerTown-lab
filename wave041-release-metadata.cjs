'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "3f3b13aaaeba41f6caef30f47b62fc9fd93952ebb7f3fe7a6b7c7dc2cbc51102",
    "replacements": [
      [
        "## r213 — T766",
        "## r214 — T767 第十三波原創英式專門職人建築（GPT-041；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r214 | [T767](docs/T767-british-wave13-original.md) | 第13波十款原創英式專門職人建築／40向，bld640..679；原生價格、存檔、供電、模擬及歷史模型不變。 T767／v14.60僅三標籤 | 首輪native40097825319全綠；原始fp及財務首紅40097825233保留；採原始附件後最後head另核 | #51 | docs/assets/GPT-041原PNG與manifest | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式12波120座，不把候選算130座。 未實機手機／Safari／觸控，非全部113場景／275供電圖人工逐看；bld七軸下降詳T767 |\n\n---\n\n## r213 — T766"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "60da0143a0e7e80bdfc31ba8e32c97923320248d37de17db6bce9256b06a7834",
    "replacements": [
      [
        "## 待辦（",
        "### 第十三波發布準備（T767／PR #51；2026-10-24）\n\n第13波十款原創英式專門職人建築／40向，bld640..679；原生價格、存檔、供電、模擬及歷史模型不變。發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式12波120座，不把候選算130座。\n\n原始首紅40097825233：40新增bld葉未採baseline，財務52成功／10負控，唯一來源指紋失敗。未改財務模擬；僅採同次常規fp artifact12561701696原檔。首輪完整native40097825319成功。發布head完整驗收及最終CI另核。\n\nbld七軸完整披露：palette 1→1；hardEdge 0.9544647253272348→0.9552323566926975；lightDir 0.8132088058705804→0.8076673164392463；shade 1→1；density 1→1；nightRule 0.989761505745322→0.9900276945969144；variants 1→1；total0.9653→0.9647。依第二項起連續授權處理，不手改分數或放寬門檻。作者實看3接觸表、10原生近景及部分四向原圖；獨立看圖範圍詳manifest，不冒稱業主批准或全部圖片人工審閱。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十三波10座原創英式專門職人建築（GPT-041；發布準備，合併及公開驗證後才計13／20波130座） | [T767](T767-british-wave13-original.md) | #51 | 待正式發布核實 | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式12波120座，不把候選算130座。 bld七軸詳T767，total0.9653→0.9647及lightDir下降已依連續授權披露；未實體手機／Safari／觸控，非全部113場景／275供電圖人工逐看。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release041 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release041 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release041 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release041 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
