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
function stripPinned052(candidate){
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
module.exports={hash,baseline,blockHash,block,stripPinned052,projectCandidate052};
