'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {normalizePlacement053}=require('./placement-reuse053-projection.cjs'),{projectCandidate052}=require('./single-research052-source.cjs');
const candidate=fs.readFileSync(__dirname+'/index.html','utf8'),changes=require('./placement-reuse053-projection.json');
// T786：不再拿 GPT 分支上的歷史頁核對（那些提交不在 main 上，接上 v14.72 之後也不是同一份頁）。
// 舊頁一律由候選頁經逆轉鏈還原；逐位元組的錨點是投影器的原生基準雜湊（重釘時由 main 的真頁算，不經逆轉鏈）
// 與 049／050 的 T774 歷史雜湊（永不重釘）。本階段另核：每段在輸入裡剛好一次、換回後消失、再跑一次是原樣。
const exactInverse053=(input,output,segs,normalize)=>{for(const c of segs)assert.equal(input.split(c.after).length,2,'segment present exactly once');for(const c of segs)if(c.after&&!c.before.includes(c.after))assert.equal(output.split(c.after).length,1,'segment reverted');assert.notEqual(output,input);assert.equal(normalize(output),output,'inverse is a fixed point on its own output');};
projectCandidate052(candidate); // 先過原生基準雜湊，才拿逆轉結果當舊頁
const c25=require('./policy-admin053-projection.cjs').normalizePolicyAdmin053(require('./mobility-blocks053-projection.cjs').normalizeMobilityBlocks053(require('./nearest-nodes053-projection.cjs').normalizeNearestNodes053(candidate)));
const base=normalizePlacement053(candidate);
test('exact old and exact C1 both retain pinned historical native input',()=>{assert.equal(normalizePlacement053(base),base);exactInverse053(c25,base,changes,normalizePlacement053);assert.equal(normalizePlacement053(candidate),base);assert.equal(projectCandidate052(candidate),projectCandidate052(base));});
test('each bounded segment altered/removed/duplicated first fails unchanged historical source hash',()=>{for(const c of changes)for(const replacement of [c.after+' ',c.after.replace('053','054'),'',c.after+c.after]){if(replacement===c.after)continue;const mutant=candidate.replace(c.after,replacement);assert.throws(()=>projectCandidate052(mutant),/S01 byte-exact T776 native input/);}});
test('unrelated additions and native function mutation are not discarded',()=>{for(const mutant of [candidate+'\n<!-- mutation -->',candidate.replace('function mulberry32(a){','function mulberry32(a){/* unexpected */')])assert.throws(()=>projectCandidate052(mutant),/S01 byte-exact T776 native input/);});
test('original052 block/boundary controls remain ahead of new projection',()=>{assert.throws(()=>projectCandidate052(candidate.replace('/* GPT-052 SINGLE LEDGER BEGIN */','/* corrupted */')),/S01 unique052 begin/);});

require('./policy-admin053.test.cjs');

require('./mobility-blocks053.test.cjs');

require('./nearest-nodes053.test.cjs');

require('./mobility-topk053.test.cjs');
