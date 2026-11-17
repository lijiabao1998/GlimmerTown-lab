'use strict';
// T793（業主 2026-11-16 批准）：新城沒有零售時商業需求退回既有公式，那一段的精確逆轉；不執行投影出來的頁面。
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/comboot793-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'0e44409a756676bdda26b380a13bc0ab6d7b6ac1768161b0cd8cddc1461556e6','T793 exact commerce boot manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,1,'T793 one bounded segment');
function normalizeComBoot793(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 return source.replace(changes[0].after,changes[0].before);
}
module.exports={normalizeComBoot793};
