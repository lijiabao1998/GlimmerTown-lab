'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
// Literal independent pins: changing the descriptor does not authorize new input.
const baseline='d009cab2ee3d4d149df699269b01251fd8fef0fa2173f8ce89a9c3a3f1520570';
const blockHash='038dca73a15627ad1b5a027781bd4bce1d151dcd9324965af81c49e23f777615';
const begin='/* GPT-052 SINGLE LEDGER BEGIN */',end='/* GPT-052 SINGLE LEDGER END */';
// DSK-018 / LAB-03：獨立釘死的附加區塊（053）。
// DSK-019 / LAB-05：獨立釘死的附加區塊（054）。
// DSK-020 / LAB-06：獨立釘死的附加區塊（055）。
// 全部與 052 同一處理：字面釘死、逐位元比對；全部剝掉之後，
// 仍必須逐 byte 等於同一個 T776 native baseline——沒有放寬任何位元比較。
const begin053='/* DSK-018 ROAD DELIVERY 053 BEGIN */',end053='/* DSK-018 ROAD DELIVERY 053 END */';
const blockHash053='979e68c1245d29bdf0687e44b0b827ed6a31d8c9e0043ba534f84a8b45c81152';
const block053=fs.readFileSync(path.join(__dirname,'road-delivery053-runtime.js'),'utf8').trim();
const begin054='/* DSK-019 RAIL FREIGHT 054 BEGIN */',end054='/* DSK-019 RAIL FREIGHT 054 END */';
const blockHash054='6567cbec54fcc3bcbb88fe0f5df1ed086e937e337c2dfe2407d983554c1c3316';
const block054=fs.readFileSync(path.join(__dirname,'rail-freight054-runtime.js'),'utf8').trim();
const begin055='/* DSK-020 RAIL BLOCK 055 BEGIN */',end055='/* DSK-020 RAIL BLOCK 055 END */';
const blockHash055='c9856cc30b4cfd936b2e1746de371e9b8851ff98c554afc3c48254a109c44854';
const block055=fs.readFileSync(path.join(__dirname,'rail-block055-runtime.js'),'utf8').trim();
// DSK-025 / LAB-07：公鐵聯運（057），同樣字面釘死。
const begin057='/* DSK-025 INTERMODAL 057 BEGIN */',end057='/* DSK-025 INTERMODAL 057 END */';
const blockHash057='a63a0c8d40fd5dd4b93b02caa5c53d0bc627300bcabd3ee4a071749cc26765cf';
const block057=fs.readFileSync(path.join(__dirname,'intermodal057-runtime.js'),'utf8').trim();
const left='/* GPT-049 LAB01 END */\n',right='Object.assign(window.GV,{art574:';
const block=fs.readFileSync(path.join(__dirname,'single-research052.js'),'utf8');
assert.equal(hash(block),blockHash,'S01 pinned052 shipping block');
assert.equal(hash(block053),blockHash053,'S01 pinned053 shipping block');
assert.equal(hash(block054),blockHash054,'S01 pinned054 shipping block');
assert.equal(hash(block055),blockHash055,'S01 pinned055 shipping block');
assert.equal(hash(block057),blockHash057,'S01 pinned057 shipping block');
assert.ok(block.startsWith(begin+'\n')&&block.endsWith(end+'\n'),'S01 exact052 delimiters');
const wrapped053=begin053+'\n'+block053+'\n'+end053+'\n';
const wrapped054=begin054+'\n'+block054+'\n'+end054+'\n';
const wrapped055=begin055+'\n'+block055+'\n'+end055+'\n';
const wrapped057=begin057+'\n'+block057+'\n'+end057+'\n';
function stripPinned052(candidate){
  assert.equal(candidate.split(begin).length,2,'S01 unique052 begin');
  assert.equal(candidate.split(end).length,2,'S01 unique052 end');
  assert.equal(candidate.split(block).length,2,'S01 unchanged052 block');
  // T785 R2：各區塊的唯一性與不變檢查先做，改壞哪一塊就紅在那一塊自己的斷言；最後才驗五塊的合併邊界。
  assert.equal(candidate.split(begin053).length,2,'S01 unique053 begin');
  assert.equal(candidate.split(end053).length,2,'S01 unique053 end');
  assert.equal(candidate.split(block053).length,2,'S01 unchanged053 block');
  assert.equal(candidate.split(begin054).length,2,'S01 unique054 begin');
  assert.equal(candidate.split(end054).length,2,'S01 unique054 end');
  assert.equal(candidate.split(block054).length,2,'S01 unchanged054 block');
  assert.equal(candidate.split(begin055).length,2,'S01 unique055 begin');
  assert.equal(candidate.split(end055).length,2,'S01 unique055 end');
  assert.equal(candidate.split(block055).length,2,'S01 unchanged055 block');
  assert.equal(candidate.split(begin057).length,2,'S01 unique057 begin');
  assert.equal(candidate.split(end057).length,2,'S01 unique057 end');
  assert.equal(candidate.split(block057).length,2,'S01 unchanged057 block');
  // 邊界先驗：052＋053＋054＋055＋057 五個釘死區塊必須緊接在 left 與 right 之間，順序固定。
  assert.equal(candidate.split(left+block+wrapped053+wrapped054+wrapped055+wrapped057+right).length,2,'S01 exact052 insertion boundary');
  return candidate.replace(block,'').replace(wrapped053,'').replace(wrapped054,'').replace(wrapped055,'').replace(wrapped057,'');
}
function projectCandidate052(candidate){
  const projected=stripPinned052(candidate);
  assert.equal(hash(projected),baseline,'S01 byte-exact T776 native input');
  return projected;
}
module.exports={hash,baseline,blockHash,block,block053,blockHash053,block054,blockHash054,block055,blockHash055,block057,blockHash057,stripPinned052,projectCandidate052};
