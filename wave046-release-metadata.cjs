'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "ba8b395bb08e98d4b90797a83bab9667f27d8d58abd4939e8e972f6e6f228ba0",
    "replacements": [
      [
        "## r218 — T771",
        "## r219 — T772 第十八波原創英式社區館舍（GPT-046；發布準備）\n\n第18波十款原創英式社區館舍／40向，bld840..879；價格、容量、供電、財務、模擬、存檔結構及舊170座不變。\n\nC5標準40139356236 smoke3／fp／財務53+10及原生40139356199全部28工作成功。實看原始PNG的逐檔清單、原圖SHA及限制見GPT-046-visual-review.md。C2雖CI綠但廚房倒錐頂外觀未達首卡，C3仍歧義，C4僅修該四向真實搭接／排水標記及內向受光；原始四坡面座標、另九款與全部歷史guard不動。遠景LOD不當近景細節，未冒稱275供電圖全部人工看過、業主圖審、手機硬體或Safari。\n\nbld七軸：palette1→1；hardEdge0.9578807244340685→0.9584876538355126；lightDir0.8057680988816951→0.80448533640023；shade1→1；density1→1；nightRule0.9909531159365403→0.991157775364051；variants1→1；total0.9649→0.9649。相對未發布C2總分0.9652→0.9649。受光軸下降明確披露，採用同次官方原始檔案，不調權重或門檻。\n\n發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍17波170座。 [PR61](https://github.com/lijiabao1998/GlimmerTown-lab/pull/61)；[原圖](docs/assets/GPT-046/manifest.json)。\n\n---\n\n## r218 — T771"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "7827033c9baf0451f63a49fe87631a59b6eee8830248bd50b051115c0b15b9ff",
    "replacements": [
      [
        "## 待辦（",
        "### 第十八波發布準備（T772／PR #61；2026-10-24）\n\n第18波十款原創英式社區館舍／40向，bld840..879；價格、容量、供電、財務、模擬、存檔結構及舊170座不變。發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍17波170座。\n\nC5 b5e1fcf4：標準40139356236與原生40139356199全綠。只用C4官方標準push40138059294 artifact12577738028原始fp/style；C1首紅、C2綠但圖審不合格、C3失敗與C4來源未宣告均保留。\n\npalette1→1；hardEdge0.9578807244340685→0.9584876538355126；lightDir0.8057680988816951→0.80448533640023；shade1→1；density1→1；nightRule0.9909531159365403→0.991157775364051；variants1→1；total0.9649→0.9649。相對未發布C2總分0.9652→0.9649。受光軸下降明確披露，採用同次官方原始檔案，不調權重或門檻。\n\n實看原始PNG的逐檔清單、原圖SHA及限制見GPT-046-visual-review.md。C2雖CI綠但廚房倒錐頂外觀未達首卡，C3仍歧義，C4僅修該四向真實搭接／排水標記及內向受光；原始四坡面座標、另九款與全部歷史guard不動。遠景LOD不當近景細節，未冒稱275供電圖全部人工看過、業主圖審、手機硬體或Safari。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十八波10座原創英式社區館舍（GPT-046，發布核實後才計18／20波180座） | [T772](T772-british-wave18-original.md) | [#61](https://github.com/lijiabao1998/GlimmerTown-lab/pull/61) | 待正式發布核實 | 發布準備：待發布版完整CI、最後綠後純刪分支workflow、最終headCI、合法合併與main／自動Pages／真實公網Chrome核實；正式仍17波170座。 C5完整候選驗收成功；圖片與受光軸下降已披露，無放寬原門檻。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release046 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release046 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release046 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release046 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
