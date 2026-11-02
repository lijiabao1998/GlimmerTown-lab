'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Literal independent pins: changing the descriptor does not authorize new input.
const baseline='6e14078123fc3b90d885d30a4cad0b5886a58f9dd392449930f9496c566fe476';
const blockHash='038dca73a15627ad1b5a027781bd4bce1d151dcd9324965af81c49e23f777615';
const begin='/* GPT-052 SINGLE LEDGER BEGIN */',end='/* GPT-052 SINGLE LEDGER END */';
// DSK-018 / LAB-03：第二個獨立釘死的附加區塊。處理方式與 052 完全相同——字面釘死、逐位元比對，
// 不多允許任何位元：剝掉兩個釘死區塊之後，仍必須逐 byte 等於同一個 T776 native baseline。
const begin053='/* DSK-018 ROAD DELIVERY 053 BEGIN */',end053='/* DSK-018 ROAD DELIVERY 053 END */';
const blockHash053='5193013e7cc005df29aaf075fe3668f1ed4287a852bba508846777be6382ea98';
const block053=fs.readFileSync(path.join(__dirname,'road-delivery053-runtime.js'),'utf8').trim();
const left='/* GPT-049 LAB01 END */\n',right='Object.assign(window.GV,{art574:';
const block=fs.readFileSync(path.join(__dirname,'single-research052.js'),'utf8');
assert.equal(hash(block),blockHash,'S01 pinned052 shipping block');
assert.equal(hash(block053),blockHash053,'S01 pinned053 shipping block');
assert.ok(block.startsWith(begin+'\n')&&block.endsWith(end+'\n'),'S01 exact052 delimiters');
const wrapped053=begin053+'\n'+block053+'\n'+end053+'\n';
function stripPinned052(candidate){
  assert.equal(candidate.split(begin).length,2,'S01 unique052 begin');
  assert.equal(candidate.split(end).length,2,'S01 unique052 end');
  assert.equal(candidate.split(block).length,2,'S01 unchanged052 block');
  // 邊界先驗：052＋053 兩個釘死區塊必須緊接在 left 與 right 之間。
  assert.equal(candidate.split(left+block+wrapped053+right).length,2,'S01 exact052 insertion boundary');
  assert.equal(candidate.split(begin053).length,2,'S01 unique053 begin');
  assert.equal(candidate.split(end053).length,2,'S01 unique053 end');
  assert.equal(candidate.split(block053).length,2,'S01 unchanged053 block');
  return candidate.replace(block,'').replace(wrapped053,'');
}
function projectCandidate052(candidate){
  const projected=stripPinned052(candidate);
  assert.equal(hash(projected),baseline,'S01 byte-exact T776 native input');
  return projected;
}
module.exports={hash,baseline,blockHash,block,block053,blockHash053,stripPinned052,projectCandidate052};
