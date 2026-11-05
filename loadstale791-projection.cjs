'use strict';
// T791（業主 2026-11-05 批准）：讀檔時清掉舊存檔殘留（比當天晚超過 14 天才清）那一段的精確逆轉；不執行投影出來的頁面。
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/loadstale791-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'bc4723dc80941b0dc8fcdc5a0ce82b75f83da5aac07706215d2dbfac2e8c02fe','T791 exact load stale-reset manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,1,'T791 one bounded segment');
function normalizeLoadStale791(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 return source.replace(changes[0].after,changes[0].before);
}
module.exports={normalizeLoadStale791};
