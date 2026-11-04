'use strict';
// Authorized exact one-function C4 inverse; never executes projected HTML.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/nearest-nodes053-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'be2015eb182401a4199eadd9ed87ca13affc71ff083d2bd7403a70bdb4f6f408','GPT053 exact C4 manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,1,'GPT053 one bounded C4 function');
function normalizeNearestNodes053(source){
 source=require('./mobility-topk053-projection.cjs').normalizeMobilityTopK053(source);
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 return source.replace(changes[0].after,changes[0].before);
}
module.exports={normalizeNearestNodes053};
