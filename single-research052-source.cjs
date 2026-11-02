'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Literal independent pins: changing the descriptor does not authorize new input.
const baseline='6e14078123fc3b90d885d30a4cad0b5886a58f9dd392449930f9496c566fe476';
const blockHash='038dca73a15627ad1b5a027781bd4bce1d151dcd9324965af81c49e23f777615';
const begin='/* GPT-052 SINGLE LEDGER BEGIN */',end='/* GPT-052 SINGLE LEDGER END */';
const left='/* GPT-049 LAB01 END */\n',right='Object.assign(window.GV,{art574:';
const block=fs.readFileSync(path.join(__dirname,'single-research052.js'),'utf8');
assert.equal(hash(block),blockHash,'S01 pinned052 shipping block');
assert.ok(block.startsWith(begin+'\n')&&block.endsWith(end+'\n'),'S01 exact052 delimiters');

/* DSK-054 / V67 P0：唯一被允許的產品內文修改，以「字面反向補丁」釘死。
 * candidate 必須恰好含有一次 `to`；把它換回 `from` 之後，整份 index.html 才能等於
 * 同一個 T776 baseline。兩個字串都各自有獨立 SHA-256，任何變動都會在 P01 首紅。
 * 這是守門檔變更，需要業主／main 寫入者批准；本分支不自行合併。 */
const perfPatch=JSON.parse(fs.readFileSync(path.join(__dirname,'perf-patch054.json'),'utf8'));
function perfPatchList054(){
  if(Array.isArray(perfPatch.patches))return perfPatch.patches;
  return [{from:perfPatch.from,to:perfPatch.to,fromSha256:perfPatch.fromSha256,toSha256:perfPatch.toSha256}];
}
function unapplyPerfPatch054(candidate){
  const list=perfPatchList054();
  for(const pt of list){
    assert.equal(hash(pt.from),pt.fromSha256,'P01 pinned054 original snippet');
    assert.equal(hash(pt.to),pt.toSha256,'P01 pinned054 candidate snippet');
  }
  for(const pt of list.slice().reverse()){
    if(candidate.indexOf(pt.to)<0)continue;   // native (or already reversed) for this hunk
    assert.equal(candidate.split(pt.to).length,2,'P01 unique054 candidate hunk');
    candidate=candidate.replace(pt.to,pt.from);
  }
  return candidate;
}
function stripPinned052(input){
  const candidate=unapplyPerfPatch054(input);
  assert.equal(candidate.split(begin).length,2,'S01 unique052 begin');
  assert.equal(candidate.split(end).length,2,'S01 unique052 end');
  assert.equal(candidate.split(block).length,2,'S01 unchanged052 block');
  assert.equal(candidate.split(left+block+right).length,2,'S01 exact052 insertion boundary');
  return candidate.replace(block,'');
}
function projectCandidate052(candidate){
  const projected=stripPinned052(candidate);
  assert.equal(hash(projected),baseline,'S01 byte-exact T776 native input');
  return projected;
}
module.exports={hash,baseline,blockHash,block,perfPatch,unapplyPerfPatch054,stripPinned052,projectCandidate052};
