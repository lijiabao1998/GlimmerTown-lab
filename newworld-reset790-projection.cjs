'use strict';
// T790（業主 2026-11-04 批准）：開新城補上觀測台與財政節奏的成對重置，那一段的精確逆轉；不執行投影出來的頁面。
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/newworld-reset790-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'e67b1d81aa221ec44030585afb153b73fa4738055f91d72eac3bcee176338dfb','T790 exact newWorld reset manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,1,'T790 one bounded segment');
function normalizeNewWorldReset790(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 return source.replace(changes[0].after,changes[0].before);
}
module.exports={normalizeNewWorldReset790};
