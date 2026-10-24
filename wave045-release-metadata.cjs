'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "2e80c3406ccd29d74cedd35a699eaa0fb2f57cfb0e3c35a0be2b2591c0e24649",
    "replacements": [
      [
        "## r217 — T770",
        "## r218 — T771 第十七波原創英式公共館舍與專門工房（GPT-045；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r218 | [T771](docs/T771-british-wave17-original.md) | 第17波十款原創英式公共館舍與專門工房／40向，bld800..839；價格、容量、供電、財務、模擬、存檔結構及舊160座不變。 僅三版本標籤與嚴格舊檔writer遷移14.63→14.64 | C2標準40129322396 smoke3／fp／財務53+10、原生40129322522全部28工作成功；C1首紅保留詳卡 | [#59](https://github.com/lijiabao1998/GlimmerTown-lab/pull/59) | [原圖](docs/assets/GPT-045/manifest.json) | 發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍16波160座。 157張原圖已實看，完整清單與原PNG／SHA見T771；遠景LOD不當近景細節，275供電PNG未全數人工逐看，不冒稱業主批准、實體手機或Safari。 bld七軸及total無下降。 |\n\n---\n\n## r217 — T770"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "80fa465af83c703d5cde6473a9f955c85bddf0681faf12c8067baecb180fec02",
    "replacements": [
      [
        "## 待辦（",
        "### 第十七波發布準備（T771／PR #59；2026-10-24）\n\n第17波十款原創英式公共館舍與專門工房／40向，bld800..839；價格、容量、供電、財務、模擬、存檔結構及舊160座不變。發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍16波160座。\n\nC2 c57157c6991aa48325e07bc807f6cfb244eaf8a9：標準40129322396的smoke3、fp與財務53+10全綠，原生40129322522全部28工作成功。C1新045自檢誤選舊760..799導致undefined-id，已精確修為800..839並新增回歸；財務52+10通過，唯一來源指紋未宣告。只用官方原始fp artifact12574725468，不改財務或舊守衛。\n\nbld七軸：palette1→1；hardEdge0.9572489734902542→0.9578807244340685；lightDir0.8034960819770947→0.8057680988816951；shade1→1；density1→1；nightRule0.9907380909650112→0.9909531159365403；variants1→1；total0.9645→0.9649，無軸下降。\n\n157張原圖已實看，完整清單與原PNG／SHA見T771；遠景LOD不當近景細節，275供電PNG未全數人工逐看，不冒稱業主批准、實體手機或Safari。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十七波10座原創英式公共館舍與專門工房（GPT-045；發布核實後才計17／20波170座） | [T771](T771-british-wave17-original.md) | [#59](https://github.com/lijiabao1998/GlimmerTown-lab/pull/59) | 待正式發布核實 | 發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍16波160座。 C2全驗收成功；157張原圖已實看，完整清單與原PNG／SHA見T771；遠景LOD不當近景細節，275供電PNG未全數人工逐看，不冒稱業主批准、實體手機或Safari。 bld total0.9645→0.9649，七軸無下降。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release045 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release045 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release045 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release045 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
