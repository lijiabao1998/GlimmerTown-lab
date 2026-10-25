'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PATCHES={
  "AUTORUN-LOG.md": {
    "baseSHA256": "090cbce4aac24117a34e58874c9d581825b3ae8dfc7b1bcf966172e8ccfa5014",
    "replacements": [
      [
        "## r219 — T772",
        "## r220 — T773 第十九波原創英式村鎮結構（GPT-047；發布準備）\n\n第19波十款原創英式村鎮結構／40向，bld880..919。既有180座、價格、供電、財務、模擬、RNG、存檔結構和全局密度完全保留。\n\n原半球 C1–C7 的可見深腔不足與所有首紅保留；業主03:34明確選B，僅 Vervain 改較高較淺的真半橢球，保持2×2、低台、用途與其他九款。B1原生40159313479全28工作成功，B2採用標準push40159313379/artifact12586045331的逐byte官方fp/style。最新B2完整結果另附，不用舊頭冒充。原圖／SHA／實看範圍見docs/assets/GPT-047/manifest.json及GPT-047-visual-review.md；未宣稱全275張人工檢視、真手機或Safari。\n\npalette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。\n\n發布準備，待發布版完整 CI、最後全綠後刪自有分支 workflow、最終 head CI、合法合併、main CI、自動 Pages 與真實公網 Chromium；正式仍18波180座，尚不能計190。 [PR63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63)。\n\n---\n\n## r219 — T772"
      ]
    ]
  },
  "docs/GPT-方向.md": {
    "baseSHA256": "c257fdc8b88f901e909e459a3e37dc907ee69a005aa7496cc01074de8cc4d960",
    "replacements": [
      [
        "## 待辦（",
        "### 第十九波發布準備（T773／PR #63；2026-10-25）\n\n第19波十款原創英式村鎮結構／40向，bld880..919。既有180座、價格、供電、財務、模擬、RNG、存檔結構和全局密度完全保留。\n\n原半球 C1–C7 的可見深腔不足與所有首紅保留；業主03:34明確選B，僅 Vervain 改較高較淺的真半橢球，保持2×2、低台、用途與其他九款。B1原生40159313479全28工作成功，B2採用標準push40159313379/artifact12586045331的逐byte官方fp/style。最新B2完整結果另附，不用舊頭冒充。原圖／SHA／實看範圍見docs/assets/GPT-047/manifest.json及GPT-047-visual-review.md；未宣稱全275張人工檢視、真手機或Safari。\n\npalette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。\n\n發布準備，待發布版完整 CI、最後全綠後刪自有分支 workflow、最終 head CI、合法合併、main CI、自動 Pages 與真實公網 Chromium；正式仍18波180座，尚不能計190。 [PR63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63)。\n\n## 待辦（"
      ],
      [
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n",
        "| 項目 | T 號 | PR | 完成日 | 未跑守衛（Claude／Codex 補跑後劃掉） |\n|---|---|---|---|---|\n| 第十九波10座原創英式村鎮結構（GPT-047，核實發布後才計190） | [T773](T773-british-wave19-original.md) | [#63](https://github.com/lijiabao1998/GlimmerTown-lab/pull/63) | 待正式發布核實 | 發布準備，待發布版完整 CI、最後全綠後刪自有分支 workflow、最終 head CI、合法合併、main CI、自動 Pages 與真實公網 Chromium；正式仍18波180座，尚不能計190。 palette1→1；hardEdge0.9584876538355126→0.9590887522134695；lightDir0.80448533640023→0.8026981450252951；shade1→1；density1→1；nightRule0.991157775364051→0.9913522165367163；variants1→1；total0.9649→0.9647。受光下降依連續方向第二項起例外如實披露，不改權重或門檻。 |\n"
      ]
    ]
  }
};
function expected(file,old){
 const p=PATCHES[file];assert(p,'release047 declared metadata file');
 assert.equal(hash(old),p.baseSHA256,'release047 independent metadata BASE '+file);
 let out=old.toString();
 for(const[from,to]of p.replacements){assert.equal(out.split(from).length,2,'release047 unique metadata anchor '+file);out=out.replace(from,to);}
 return Buffer.from(out);
}
function verify(file,bytes,old){assert(bytes.equals(expected(file,old)),'release047 only exact declared metadata insertion '+file);return true;}
module.exports={PATCHES,expected,verify};
