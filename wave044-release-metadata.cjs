'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "649247d9974a9a04dc1555f9d4bc89da484e037b1b62bfcc8d53976cad3a4e0c",
    "replacements": [
      [
        "## r216 — T769",
        "## r217 — T770 第十六波原創英式專門工房與服務建築（GPT-044；發布準備）\n\n| 輪次 | 卡號 | 做了什麼 | 煙霧測試 | commit | 樣張 | 沒做成的事 |\n|---|---|---|---|---|---|---|\n| r217 | [T770](docs/T770-british-wave16-original.md) | 第16波十款原創英式專門工房與服務建築／40向，bld760..799；原生價格、容量、供電、模擬、存檔結構及歷史模型不變。 T770／v14.63僅三個精確版本標籤；歷史存檔只允許gameVer 14.62→14.63，另跑同標籤獨立BASE並逐欄比較 | C2 native40121953495全部27成功；標準40121953536 smoke3／fp／財務全綠。C1兩次真首紅保留，詳T770 | [#57](https://github.com/lijiabao1998/GlimmerTown-lab/pull/57) | 80單精靈已實看；113場景審閱及原PNG／manifest交付仍待完成 | 發布準備，仍待發布版最後head完整驗收、全綠後純刪臨時workflow、最終push／PR CI、合法合併及main CI／既有自動Pages／實際公開網站核實；此前正式15／20波150座，不把候選算160座。 本次圖審進度：80張日／夜單精靈已完成人工檢視；113場景審閱仍在完成中，原PNG與producer／SHA清單由獨立證據步驟補入，不把產物存在當全部人工看過。275供電PNG未宣稱全數人工逐看；不冒稱業主圖審批准、實體手機／Safari／觸控測試。 bld七軸及total均無下降，詳T770 |\n\n---\n\n## r216 — T769"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "ac216850272fb5e00b61c871f8f544ca2a8bef68514ae0426426b2cdd16ce56f",
    "replacements": [
      [
        "## 待辦（",
        "### 第十六波發布準備（T770／PR #57；2026-10-24）\n\n第16波十款原創英式專門工房與服務建築／40向，bld760..799；原生價格、容量、供電、模擬、存檔結構及歷史模型不變。發布準備，仍待發布版最後head完整驗收、全綠後純刪臨時workflow、最終push／PR CI、合法合併及main CI／既有自動Pages／實際公開網站核實；此前正式15／20波150座，不把候選算160座。\n\nC1標準40121228689首紅：40新增bld葉尚未宣告；財務52項與10負控制成功，唯一失敗是來源指紋。只採同次官方fp artifact12571366394的原始fp.json／style.json，保留metadata，不改財務模擬或門檻。C1原生40121228711的baseline-evidence因本波臨時workflow誤用720標記失敗，C2只把標記修為760；C1不是27／27全綠。\n\nC2 ef9efc5292584aa62e15e5a7f899946fb753d1d0：原生40121953495全部27工作成功；標準40121953536的smoke三次、fp及財務全部成功。這是候選證據，不代替發布版最後head或公開驗證。\n\nbld七軸完整披露：palette 1→1；hardEdge 0.956575675398324→0.9572489734902542；lightDir 0.8029647930821495→0.8034960819770947；shade 1→1；density 1→1；nightRule 0.9905118397397248→0.9907380909650112；variants 1→1；total 0.9643→0.9645。七軸及total均無下降，不需要下降例外；不手改原始分數或放寬門檻。\n\n本次圖審進度：80張日／夜單精靈已完成人工檢視；113場景審閱仍在完成中，原PNG與producer／SHA清單由獨立證據步驟補入，不把產物存在當全部人工看過。275供電PNG未宣稱全數人工逐看；不冒稱業主圖審批准、實體手機／Safari／觸控測試。遠景既有LOD不算近景建築細節驗收。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十六波10座原創英式專門工房與服務建築（GPT-044；發布準備，合併及公開核實後才計16／20波160座） | [T770](T770-british-wave16-original.md) | [#57](https://github.com/lijiabao1998/GlimmerTown-lab/pull/57) | 待正式發布核實 | 發布準備，仍待發布版最後head完整驗收、全綠後純刪臨時workflow、最終push／PR CI、合法合併及main CI／既有自動Pages／實際公開網站核實；此前正式15／20波150座，不把候選算160座。 C2原生27工作及標準smoke3／fp／財務已綠；bld七軸詳T770，total0.9643→0.9645且無軸下降。80單精靈已實看，113場景審閱未完成；不稱全部275供電圖人工逐看、業主批准或實體手機／Safari／觸控測試。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release044 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release044 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release044 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release044 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
