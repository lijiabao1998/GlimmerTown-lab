'use strict';
// Exact C1 eight-segment adapter, composed with separately authorized exact C2 inverse.
// This does not execute projected HTML or bless performance/behavior.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/placement-reuse053-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'dd8489dd4ffaa747e0506d752fc5f26844155d02d5d4e0314ba0d88c5fae5e35','GPT053 exact projection manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,8,'GPT053 eight bounded segments');
function normalizePlacement053(source){
  source=require('./mobility-blocks053-projection.cjs').normalizeMobilityBlocks053(source);
  source=require('./policy-admin053-projection.cjs').normalizePolicyAdmin053(source);
  // All-or-nothing. Missing, duplicated or changed segments remain unprojected,
  // and the unchanged historical hash assertion is responsible for rejection.
  if(!changes.every(c=>source.split(c.after).length===2))return source;
  let projected=source;for(const c of changes)projected=projected.replace(c.after,c.before);
  return projected;
}
module.exports={normalizePlacement053};
