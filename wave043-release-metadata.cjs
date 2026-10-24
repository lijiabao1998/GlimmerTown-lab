'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "82ec04822f1b9e343a7215172c74d0a911b3328fd07c35924991bcf30dc9f977",
    "replacements": [
      [
        "## r215 — T768",
        "## r216 — T769 第十五波原創英式工藝與社區會舍（GPT-043；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r216 | [T769](docs/T769-british-wave15-original.md) | 第15波十款原創英式工藝與社區會舍／40向，bld720..759；原生價格、存檔、供電、模擬及歷史模型不變。 T769／v14.62僅三標籤 | 首輪native40113569099全綠；原始fp及財務首紅40113569032保留；採原始附件後最後head另核 | #55 | docs/assets/GPT-043原PNG與manifest | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式14波140座，不把候選算150座。 未實機手機／Safari／觸控，非全部113場景／275供電圖人工逐看；bld七軸下降詳T769 |\n\n---\n\n## r215 — T768"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "3273419ce3d602b489f946b08ea60dc1e29fe1de2f9f1b1fb119e655aa7b666e",
    "replacements": [
      [
        "## 待辦（",
        "### 第十五波發布準備（T769／PR #55；2026-10-24）\n\n第15波十款原創英式工藝與社區會舍／40向，bld720..759；原生價格、存檔、供電、模擬及歷史模型不變。發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式14波140座，不把候選算150座。\n\n原始首紅40113569032：40新增bld葉未採baseline，財務52成功／10負控，唯一來源指紋失敗。未改財務模擬；僅採同次常規fp artifact12567542422原檔。首輪完整native40113569099成功。發布head完整驗收及最終CI另核。\n\nbld七軸完整披露：palette 1→1；hardEdge 0.9559013242882268→0.956575675398324；lightDir 0.8074730842305257→0.8029647930821495；shade 1→1；density 1→1；nightRule 0.9902756873333572→0.9905118397397248；variants 1→1；total0.9648→0.9643。依第二項起連續授權處理，不手改分數或放寬門檻。作者實看日夜接觸表、十張近景與部分完整場景，獨立review另列真實範圍，不冒稱業主批准或全部圖片人工審閱。遠景既有LOD不算建築細節驗收。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十五波10座原創英式工藝與社區會舍（GPT-043；發布準備，合併及公開驗證後才計15／20波150座） | [T769](T769-british-wave15-original.md) | #55 | 待正式發布核實 | 發布準備，仍待最後head全綠、純刪臨時workflow、合法合併及main CI／自動Pages／實際公開網站驗證；此前正式14波140座，不把候選算150座。 bld七軸詳T769，total0.9648→0.9643及lightDir下降已依連續授權披露；未實體手機／Safari／觸控，非全部113場景／275供電圖人工逐看。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release043 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release043 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release043 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release043 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
