'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "083f1fcbf939f644b6f116d958646eb3678947b3257809548e44b6097679cf5d",
    "replacements": [
      [
        "## r220 — T773",
        "## r221 — T774 第20波原創英式村鎮工藝（GPT-048；發布準備）\n\n第20波十款原創工藝公共建築／40向 bld920..959，既有190座及舊4143葉完全保留；價格、地塊、財務、供電、存檔結構、RNG、全局密度不變。C1原生[40164900539](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40164900539)全29工作成功，含9份source運輸而非29種產品驗收。C2從官方標準artifact12587668760採用逐byte原始fp/style，未製造分數。詳細首紅、86原生檢查、160供電案例、57場景、40邊緣與40組效能A/B見[原始驗收](branch/GPT-048-C2-CI-evidence.md)。\n\npalette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光軸微降依連續方向第二項起例外如實披露，未改光照／權重／門檻。\n\n本節是T774／14.67發布準備，尚未計200：須發布版全套原生CI、獨立刪分支workflow、最後head標準CI、合法合併、main CI、自動Pages及公網真Chromium均完成。原圖人工審閱範圍據實記錄，真手機／Safari／觸控未驗證。不擅開第21波。\n\ncommit：#64。沒做成的事：C1初始官方fp尚未採用導致標準fp／財務指紋首紅，已保留；未實測手機及Safari。正式公網尚為190。\n\n第19波已於2026-10-25正式發布190座：PR63合併4346a96543b01ffd47ac3696480661b5de8638ae；[main CI40162795551](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40162795551)及[自動Pages40163187956](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40163187956)成功。原[公網Chromium40160465127](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127)第二次job121079351468成功；HTTP／Chrome均200，11933765bytes、SHA256 3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63與正式build逐byte相同。T773／14.66、11–19波各10款40向、34負控制、零runtime/network錯誤。此前發布準備記錄保留為歷史，不再當待辦。\n\n---\n\n## r220 — T773"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "56dbfc4bc36e50f7b496057361a3fc4e7be64cb55f2590913793013b5ecee234",
    "replacements": [
      [
        "## 待辦（",
        "### 第19波正式收據與第20波發布準備（2026-10-25）\n\n第19波已於2026-10-25正式發布190座：PR63合併4346a96543b01ffd47ac3696480661b5de8638ae；[main CI40162795551](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40162795551)及[自動Pages40163187956](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40163187956)成功。原[公網Chromium40160465127](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40160465127)第二次job121079351468成功；HTTP／Chrome均200，11933765bytes、SHA256 3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63與正式build逐byte相同。T773／14.66、11–19波各10款40向、34負控制、零runtime/network錯誤。此前發布準備記錄保留為歷史，不再當待辦。\n\n第20波十款原創工藝公共建築／40向 bld920..959，既有190座及舊4143葉完全保留；價格、地塊、財務、供電、存檔結構、RNG、全局密度不變。C1原生[40164900539](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40164900539)全29工作成功，含9份source運輸而非29種產品驗收。C2從官方標準artifact12587668760採用逐byte原始fp/style，未製造分數。詳細首紅、86原生檢查、160供電案例、57場景、40邊緣與40組效能A/B見[原始驗收](branch/GPT-048-C2-CI-evidence.md)。\n\npalette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光軸微降依連續方向第二項起例外如實披露，未改光照／權重／門檻。\n\n本節是T774／14.67發布準備，尚未計200：須發布版全套原生CI、獨立刪分支workflow、最後head標準CI、合法合併、main CI、自動Pages及公網真Chromium均完成。原圖人工審閱範圍據實記錄，真手機／Safari／觸控未驗證。不擅開第21波。\n\n## 待辦（"
      ],
      [
        "| 19 | 第十九波十座原創英式建築，先核既有180款及舊歷史資產並凍結十個不重複結構 | 「每波 10 座，共 20 波」 | 美術 | bld | 第18波已正式發布；先推GPT-047首卡，保留原生載體與全部門檻，不動全局密度或玩法 |",
        "| 20 | 第20波十款原創英式村鎮工藝建築（GPT-048／PR64）已施工，待最後發布驗收 | 「每波 10 座，共 20 波」 | 美術 | bld | 第19波已核實正式190；本輪完成公網驗收才計200，之後停止不擅開21 |"
      ],
      [
        "| 第十九波10座原創英式村鎮結構（GPT-047，核實發布後才計190） | [T773](T773-british-wave19-original.md) | [#63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63) | 待正式發布核實 | 發布準備，待發布版完整 CI、最後全綠後刪自有分支 workflow、最終 head CI、合法合併、main CI、自動 Pages 與真實公網 Chromium；正式仍18波180座，尚不能計190。 palette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。 |",
        "| 第十九波10座原創英式村鎮結構（GPT-047，已正式190） | [T773](T773-british-wave19-original.md) | [#63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63) | 2026-10-25 | main CI40162795551／Pages40163187956／公網Chromium40160465127 job121079351468均成功，正式4346a965來源逐byte核實；真手機／Safari未驗證。 palette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。 |"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第20波10款原創工藝建築（GPT-048，發布核實後才計200） | [T774](T774-british-wave20-original.md) | [#64](https://github.com/lijiabao1998/GlimmerTown-lab/pull/64) | 待正式發布核實 | 發布準備，完整最新版CI／main／Pages／公網仍待收尾。palette1→1；hardEdge0.9590887522134695→0.9596755126848755；lightDir0.8026981450252951→0.8020890599230346；shade1→1；density1→1；nightRule0.9913522165367163→0.9915410895109031；variants1→1；total0.9647→0.9648。受光軸微降依連續方向第二項起例外如實披露，未改光照／權重／門檻。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release048 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release048 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release048 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release048 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
