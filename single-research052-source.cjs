'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Literal independent pins: changing the descriptor does not authorize new input.
const baseline='6e14078123fc3b90d885d30a4cad0b5886a58f9dd392449930f9496c566fe476';
const blockHash='038dca73a15627ad1b5a027781bd4bce1d151dcd9324965af81c49e23f777615';
const begin='/* GPT-052 SINGLE LEDGER BEGIN */',end='/* GPT-052 SINGLE LEDGER END */';
// DSK-019 / LAB-05：第二個獨立釘死的附加區塊（與 052 同一處理：字面釘死、逐位元比對）。
// 剝掉兩個釘死區塊之後，仍必須逐 byte 等於同一個 T776 native baseline——沒有放寬任何位元比較。
const begin054='/* DSK-019 RAIL FREIGHT 054 BEGIN */',end054='/* DSK-019 RAIL FREIGHT 054 END */';
const blockHash054='fc187757ecc5cb33d18f6573b2623886993e48f6d13ad22da80408aa044abc51';
const block054=fs.readFileSync(path.join(__dirname,'rail-freight054-runtime.js'),'utf8').trim();
const left='/* GPT-049 LAB01 END */\n',right='Object.assign(window.GV,{art574:';
const block=fs.readFileSync(path.join(__dirname,'single-research052.js'),'utf8');
assert.equal(hash(block),blockHash,'S01 pinned052 shipping block');
assert.equal(hash(block054),blockHash054,'S01 pinned054 shipping block');
assert.ok(block.startsWith(begin+'\n')&&block.endsWith(end+'\n'),'S01 exact052 delimiters');
const wrapped054=begin054+'\n'+block054+'\n'+end054+'\n';
function stripPinned052(candidate){
  assert.equal(candidate.split(begin).length,2,'S01 unique052 begin');
  assert.equal(candidate.split(end).length,2,'S01 unique052 end');
  assert.equal(candidate.split(block).length,2,'S01 unchanged052 block');
  // 邊界先驗：052＋054 兩個釘死區塊必須緊接在 left 與 right 之間。
  assert.equal(candidate.split(left+block+wrapped054+right).length,2,'S01 exact052 insertion boundary');
  assert.equal(candidate.split(begin054).length,2,'S01 unique054 begin');
  assert.equal(candidate.split(end054).length,2,'S01 unique054 end');
  assert.equal(candidate.split(block054).length,2,'S01 unchanged054 block');
  return candidate.replace(block,'').replace(wrapped054,'');
}
function projectCandidate052(candidate){
  const projected=stripPinned052(candidate);
  assert.equal(hash(projected),baseline,'S01 byte-exact T776 native input');
  return projected;
}
module.exports={hash,baseline,blockHash,block,block054,blockHash054,stripPinned052,projectCandidate052};
