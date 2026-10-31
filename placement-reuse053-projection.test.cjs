'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process'),fs=require('node:fs');
const {normalizePlacement053}=require('./placement-reuse053-projection.cjs'),{projectCandidate052}=require('./single-research052-source.cjs');
const base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{cwd:__dirname,maxBuffer:32e6,encoding:'utf8'}),candidate=fs.readFileSync(__dirname+'/index.html','utf8'),changes=require('./placement-reuse053-projection.json');
test('exact old and exact C1 both retain pinned historical native input',()=>{assert.equal(normalizePlacement053(base),base);assert.equal(normalizePlacement053(candidate),base);assert.equal(projectCandidate052(candidate),projectCandidate052(base));});
test('each bounded segment altered/removed/duplicated first fails unchanged historical source hash',()=>{for(const c of changes)for(const replacement of [c.after+' ',c.after.replace('053','054'),'',c.after+c.after]){if(replacement===c.after)continue;const mutant=candidate.replace(c.after,replacement);assert.throws(()=>projectCandidate052(mutant),/S01 byte-exact T776 native input/);}});
test('unrelated additions and native function mutation are not discarded',()=>{for(const mutant of [candidate+'\n<!-- mutation -->',candidate.replace('function mulberry32(a){','function mulberry32(a){/* unexpected */')])assert.throws(()=>projectCandidate052(mutant),/S01 byte-exact T776 native input/);});
test('original052 block/boundary controls remain ahead of new projection',()=>{assert.throws(()=>projectCandidate052(candidate.replace('/* GPT-052 SINGLE LEDGER BEGIN */','/* corrupted */')),/S01 unique052 begin/);});

require('./policy-admin053.test.cjs');
