'use strict';
// JSON provenance only. The unchanged fp.js produces all pixels and axes on CI.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('wave046 baseline proof runs on GitHub Actions only');
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const BASE='a5154857887ecf1c6e21b049da6c6d19fe117c4e';
const base=JSON.parse(cp.execFileSync('git',['show',BASE+':fp.json'],{maxBuffer:5*1024*1024}));
const oldStyle=JSON.parse(cp.execFileSync('git',['show',BASE+':style.json'],{maxBuffer:5*1024*1024}));
const next=JSON.parse(fs.readFileSync('fp-rebake/fp.json')),style=JSON.parse(fs.readFileSync('fp-rebake/style.json'));
assert.equal(Object.keys(base.subs).length,4063,'wave046 independently recorded old leaf count');
assert.equal(Object.keys(base.families).length,166,'wave046 old family count');
assert.equal(base.families.bld.leaves,1699);assert.equal(base.families.bld.crc,'b02bfce8');
assert.deepEqual(base.blocks,{fam:'5ef6eb67',count:1728});
for(const [key,value]of Object.entries(base.subs))assert.deepEqual(next.subs[key],value,'wave046 unchanged old leaf '+key);
const added=Object.keys(next.subs).filter(k=>!Object.hasOwn(base.subs,k)).sort();
assert.deepEqual(added,Array.from({length:40},(_,i)=>'bld.24_1_'+(840+i)).sort(),'wave046 exactly forty declared bld leaves');
assert.deepEqual(Object.keys(next.families).sort(),Object.keys(base.families).sort(),'wave046 no extra family');
assert.equal(next.families.bld.leaves,1739);assert.equal(Object.keys(next.subs).length,4103);
for(const key of Object.keys(base.families))if(key!=='bld'){
  assert.deepEqual(next.families[key],base.families[key],'wave046 other family unchanged '+key);
  assert.deepEqual(style.families[key],oldStyle.families[key],'wave046 other style family unchanged '+key);
}
assert.deepEqual(next.blocks,base.blocks,'wave046 existing blocks unchanged');
assert.deepEqual(next.envLeaves,base.envLeaves,'wave046 environment registrations unchanged');
console.log('WAVE046_BASE_STRICT '+JSON.stringify({base:BASE,oldLeaves:4063,addedLeaves:added,unchangedOtherFamilies:165,blocks:next.blocks,envExact:true,before:oldStyle.families.bld,after:style.families.bld}));
