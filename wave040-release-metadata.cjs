'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "351cea600066cf6d9948cd0a96e7f2c5b7544dad6bb89077f70948cedbbef861",
    "replacements": [
      [
        "## r212 — T765",
        "## r213 — T766 第十二波十款原創英式鄉村服務建築（GPT-040；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r213 | [T766](docs/T766-british-wave12-original.md) | 十款原創量體／40方向，bld 600..639；原生 k24 費用、存檔、供電與模擬不變；T766／v14.59 僅三處標籤 | C3 ef426eab 標準40092396986 smoke／fp／fiscal全綠，完整原生40092397004全27工作成功；發布head另核 | #49 | 官方preview12559572055，84原PNG逐byte等於C2；近景及場景詳作者圖審清單 | 尚未合併／發布，正式仍110座；僅PR49合入、main CI／自動Pages成功、公站精確核實後計12／20波120座。未人工逐看全部供電圖，未測實體手機／Safari／觸控。bld total0.9658→0.9653、lightDir下降，七軸詳T766；不改評分、門檻或全局光照 |\n\n---\n\n## r212 — T765"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "4a39d4dca67cfff3545d63d8a5d2b4604d1862b3259bf32c785f32994f938357",
    "replacements": [
      [
        "## 待辦（",
        "### 第十二波發布準備（T766／PR #49；2026-10-24）\n\nC3 ef426eab 已修復指紋與財務來源完整性：標準40092396986全綠，完整原生40092397004全27工作成功。原始首紅40081848662保留，僅採同次官方原始fp／style檔，不改財務模擬或畫圖。第十二波仍待發布head完整驗收、純刪臨時workflow、最後CI、合併與公網精確確認；此前正式仍11波110座，完成後才計12波120座，才接第13波。下方舊待辦原文保留作不可變來源對照，不代表重做第11波。\n\nbld七軸：palette 1→1；hardEdge 0.9537353338914052→0.9544647253272348；lightDir 0.8176833447566827→0.8132088058705804；shade 1→1；density 1→1；nightRule 0.9894837454988741→0.989761505745322；variants 1→1；total 0.9658→0.9653。依第二項起連續授權披露；不稱全數供電圖人工圖審或實體手機測試。\n\n## 待辦（"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release040 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release040 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release040 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release040 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
