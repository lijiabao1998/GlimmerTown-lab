"use strict";
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/mobility-topk053-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'5089721d0764732197d6ce813758b2bd885392986f46666f987d04150f5fcd8b','GPT053 exact C5 manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,4);
function normalizeMobilityTopK053(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 for(const c of changes)source=source.replace(c.after,c.before);
 return source;
}
module.exports={normalizeMobilityTopK053};
