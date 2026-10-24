'use strict';
// JSON provenance only. The unchanged fp.js produces all pixels and axes on CI.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('wave042 baseline proof runs on GitHub Actions only');
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const BASE='b867e8879267049c224aafc1ebb1044a5012e0ed';
const base=JSON.parse(cp.execFileSync('git',['show',BASE+':fp.json'],{maxBuffer:5*1024*1024}));
const oldStyle=JSON.parse(cp.execFileSync('git',['show',BASE+':style.json'],{maxBuffer:5*1024*1024}));
const next=JSON.parse(fs.readFileSync('fp-rebake/fp.json')),style=JSON.parse(fs.readFileSync('fp-rebake/style.json'));
assert.equal(Object.keys(base.subs).length,3903,'wave042 independently recorded old leaf count');
assert.equal(Object.keys(base.families).length,166,'wave042 old family count');
assert.equal(base.families.bld.leaves,1539);assert.equal(base.families.bld.crc,'31417a41');
assert.deepEqual(base.blocks,{fam:'5ef6eb67',count:1728});
for(const [key,value]of Object.entries(base.subs))assert.deepEqual(next.subs[key],value,'wave042 unchanged old leaf '+key);
const added=Object.keys(next.subs).filter(k=>!Object.hasOwn(base.subs,k)).sort();
assert.deepEqual(added,Array.from({length:40},(_,i)=>'bld.24_1_'+(680+i)).sort(),'wave042 exactly forty declared bld leaves');
assert.deepEqual(Object.keys(next.families).sort(),Object.keys(base.families).sort(),'wave042 no extra family');
assert.equal(next.families.bld.leaves,1579);assert.equal(Object.keys(next.subs).length,3943);
for(const key of Object.keys(base.families))if(key!=='bld'){
  assert.deepEqual(next.families[key],base.families[key],'wave042 other family unchanged '+key);
  assert.deepEqual(style.families[key],oldStyle.families[key],'wave042 other style family unchanged '+key);
}
assert.deepEqual(next.blocks,base.blocks,'wave042 existing blocks unchanged');
assert.deepEqual(next.envLeaves,base.envLeaves,'wave042 environment registrations unchanged');
console.log('WAVE042_BASE_STRICT '+JSON.stringify({base:BASE,oldLeaves:3903,addedLeaves:added,unchangedOtherFamilies:165,blocks:next.blocks,envExact:true,before:oldStyle.families.bld,after:style.families.bld}));
