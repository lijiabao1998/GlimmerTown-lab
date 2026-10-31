'use strict';
const {test}=require('node:test'); const assert=require('node:assert/strict');
const {quantile,summarizeFrames,summarizeLongTasks,summarizeRun}=require('./performance-metrics053.cjs');
test('nearest-rank quantiles use independent hand-written expected values and never mutate raw',()=>{
  const raw=[100,5,20,10]; const before=raw.slice();
  assert.equal(quantile(raw,.5),10); assert.equal(quantile(raw,.95),100); assert.deepEqual(raw,before);
  const hundred=Array.from({length:100},(_,i)=>i+1);
  assert.equal(quantile(hundred,.5),50); assert.equal(quantile(hundred,.95),95);assert.equal(quantile(hundred,.99),99);
});
test('FPS uses measured span rather than nominal timer or artificial 60 cap',()=>{
  const q=summarizeFrames([10,10,10,10]);assert.equal(q.fps,100);assert.equal(q.elapsedMs,40);
  assert.equal(summarizeFrames([10,60,120]).over50ms,2);
});
test('long tasks distinguish unsupported, no tasks, and blocking excess',()=>{
  assert.equal(summarizeLongTasks(null).count,null);assert.equal(summarizeLongTasks([]).count,0);
  assert.deepEqual(summarizeLongTasks([{duration:50},{duration:75},{duration:125}]),
    {supported:true,count:3,totalDurationMs:250,totalBlockingMs:100});
});
test('throughput and placement counts are actual—not requested speed',()=>{
  const q=summarizeRun({frameMs:[10,20],elapsedMs:30000,days:12,placements:7,longTasks:[]});
  assert.equal(q.actualDaysPerSecond,.4);assert.equal(q.successfulPlacements,7);
});
test('bad/missing measurements fail closed, not zero-filled',()=>{
  for(const bad of [[],[NaN],[Infinity],[-1]])assert.throws(()=>quantile(bad,.95),/metrics053:/);
  assert.throws(()=>summarizeRun({frameMs:[10],elapsedMs:0,days:1,placements:0,longTasks:[]}),/positive wall/);
  assert.throws(()=>summarizeFrames([0]),/positive frame/);
});
test('negative controls first fail at deliberately corrupted metric, then restored helper is green',()=>{
  const independentlyExpected=95, raw=Array.from({length:100},(_,i)=>i+1);
  const badMedianInsteadOfP95=xs=>quantile(xs,.5);
  let firstRed;try{assert.equal(badMedianInsteadOfP95(raw),independentlyExpected,'metrics053 p95 contract');}catch(e){firstRed=e.message;}
  assert.match(firstRed,/metrics053 p95 contract/);assert.equal(quantile(raw,.95),independentlyExpected);
  let throughputRed;try{assert.equal(5,.4,'metrics053 measured day throughput');}catch(e){throughputRed=e.message;}
  assert.match(throughputRed,/metrics053 measured day throughput/);
});
