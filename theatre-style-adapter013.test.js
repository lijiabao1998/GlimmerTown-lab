#!/usr/bin/env node
'use strict';
// Pure source/data tests; no game execution.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const adapter=require('./theatre-style-adapter013');
const source=adapter.staticTest013(),original=fs.readFileSync(__dirname+'/fp.js','utf8');
assert.deepEqual(adapter.ARGS,['--check','--expect=bld,theatre013']);
// Exercise the exact original ratchet loop as pure data logic, preserving its
// original tolerance and family declaration rule. These scores are synthetic.
const start = '      const expSet = new Set(EXPECT);';
const end = "      log('');";
const a = original.indexOf(start), b = original.indexOf(end, a);
assert(a >= 0 && b > a);
const ratchet = original.slice(a, b);

function drops(expect, totals, previous) {
 const context = { EXPECT: expect, famNames: Object.keys(totals), curStyle: Object.fromEntries(Object.entries(totals).map(([k, total]) => [k, { total }])), prevStyle: { families: Object.fromEntries(Object.entries(previous).map(([k, total]) => [k, { total }])) } };
 new vm.Script(ratchet + '\nglobalThis.result = drops;').runInNewContext(context);
 return Array.from(context.result);
}
const prior = { bld: 0.9653, grass: 0.8 };
assert.deepEqual(drops(['bld', 'theatre013'], { bld: 0.9651, grass: 0.8, theatre013: 0.5 }, prior), []);
assert.equal(drops([], { bld: 0.9651, grass: 0.8 }, prior).length, 1);
assert.equal(drops(['bld', 'theatre013'], { bld: 0.9651, grass: 0.79 }, prior).length, 1);
assert.equal(drops(['bld', 'theatre013'], { bld: 0.9651, grass: 0.799998 }, prior).length, 1);
assert.equal(drops(['bld', 'theatre013'], { bld: 0.9651, grass: 0.7999995 }, prior).length, 0);

console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,exactOriginalRatchetCases:5,source},null,2));
