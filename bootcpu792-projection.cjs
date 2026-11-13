'use strict';
// T792（業主 2026-11-13 批准）：開機烘焙期間建立的畫布留在 CPU，那一段的精確逆轉；不執行投影出來的頁面。
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/bootcpu792-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'4bf2076b3ca09858207a04521da02a3f1f5d2449606201ae452d9b40480bbab9','T792 exact boot CPU canvas manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,1,'T792 one bounded segment');
function normalizeBootCpu792(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 return source.replace(changes[0].after,changes[0].before);
}
module.exports={normalizeBootCpu792};
