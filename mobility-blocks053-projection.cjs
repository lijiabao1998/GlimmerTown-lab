'use strict';
// Authorized exact two-segment C3 inverse. Never execute projected HTML.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/mobility-blocks053-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'968b212adbce0d46a7a1113a51648566259606fce6c408d0e27fa7e38e787241','GPT053 exact C3 manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,2,'GPT053 two bounded C3 segments');
function normalizeMobilityBlocks053(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 let projected=source;for(const c of changes)projected=projected.replace(c.after,c.before);
 return projected;
}
module.exports={normalizeMobilityBlocks053};
