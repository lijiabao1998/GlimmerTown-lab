'use strict';
// Explicitly authorized exact C2 inverse; never executes projected HTML.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(__dirname+'/policy-admin053-projection.json','utf8');
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'16fedbfcc1ee1b644c4aa1d101a6bb0dba1d8621b3a41dd08113e7e809bc4177','GPT053 exact C2 manifest');
const changes=JSON.parse(raw);assert.equal(changes.length,2,'GPT053 two bounded C2 segments');
function normalizePolicyAdmin053(source){
 if(!changes.every(c=>source.split(c.after).length===2))return source;
 let projected=source;for(const c of changes)projected=projected.replace(c.after,c.before);
 return projected;
}
module.exports={normalizePolicyAdmin053};
