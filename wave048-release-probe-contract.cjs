"use strict";
const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict'),crypto=require('crypto'),spec=require('./wave048-release-probe-deltas.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),CANDIDATE='3eb4d120a1050624e7735f751c38fa1a6f05c648';
function restore(s,p){for(const c of p.changes){assert.equal(s.split(c.after).length,2,'release048 unique exact probe substitution');s=s.replace(c.after,c.before);}return s;}
function check(){const negative=[];for(const p of spec){const old=fs.readFileSync(p.original,'utf8'),now=fs.readFileSync(p.release,'utf8');assert.equal(hash(old),p.originalSHA256);assert.equal(old,cp.execFileSync('git',['show',CANDIDATE+':'+p.original],{encoding:'utf8',maxBuffer:3e6}));assert.equal(hash(now),p.releaseSHA256);assert.equal(restore(now,p),old,'release048 exact reverse to complete C2 original guard');const bad=now+'\n// undeclared';assert.throws(()=>assert.equal(restore(bad,p),old));negative.push(p.release);}
assert.equal(fs.readFileSync('nativeTenPower048.cjs','utf8'),cp.execFileSync('git',['show',CANDIDATE+':nativeTenPower048.cjs'],{encoding:'utf8'}));return{ok:true,exactOriginalGuards:4,original160PowerCases:true,negative};}
module.exports={restore,check};if(require.main===module)console.log(JSON.stringify(check()));
