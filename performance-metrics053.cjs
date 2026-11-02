'use strict';
// GPT-053: pure reporting helpers; these never change gameplay or acceptance.
const assert = require('node:assert/strict');
function values(input) {
  assert(Array.isArray(input) && input.length > 0, 'metrics053: nonempty samples required');
  assert(input.every(x => Number.isFinite(x) && x >= 0), 'metrics053: finite nonnegative samples required');
  return input;
}
function quantile(input, p) {
  values(input); assert(Number.isFinite(p) && p >= 0 && p <= 1, 'metrics053: probability out of range');
  const sorted = [...input].sort((a,b) => a-b);
  return sorted[Math.max(0, Math.ceil(p * sorted.length) - 1)];
}
function summarizeFrames(frameMs) {
  values(frameMs); const elapsedMs = frameMs.reduce((a,b) => a+b,0);
  assert(elapsedMs > 0, 'metrics053: positive frame span required');
  return {frames: frameMs.length, elapsedMs, fps: frameMs.length*1000/elapsedMs,
    p50Ms:quantile(frameMs,.5), p95Ms:quantile(frameMs,.95), p99Ms:quantile(frameMs,.99),
    maxMs:Math.max(...frameMs), over50ms:frameMs.filter(x=>x>50).length,
    over100ms:frameMs.filter(x=>x>100).length};
}
function summarizeLongTasks(entries) {
  if (entries === null) return {supported:false,count:null,totalDurationMs:null,totalBlockingMs:null};
  assert(Array.isArray(entries), 'metrics053: long-task entries must be array or unsupported null');
  const durations=entries.map(x=>typeof x==='number'?x:x.duration);
  assert(durations.every(x=>Number.isFinite(x)&&x>=0), 'metrics053: invalid long-task duration');
  return {supported:true,count:entries.length,totalDurationMs:durations.reduce((a,b)=>a+b,0),
    totalBlockingMs:durations.reduce((a,b)=>a+Math.max(0,b-50),0)};
}
function summarizeRun({frameMs,elapsedMs,days,placements,longTasks}) {
  assert(Number.isFinite(elapsedMs)&&elapsedMs>0,'metrics053: positive wall duration required');
  assert(Number.isInteger(days)&&days>=0,'metrics053: actual day delta required');
  assert(placements===null||(Number.isInteger(placements)&&placements>=0),'metrics053: actual placement delta or null required');
  return {frames:summarizeFrames(frameMs),longTasks:summarizeLongTasks(longTasks),elapsedMs,
    actualDays:days,actualDaysPerSecond:days*1000/elapsedMs,successfulPlacements:placements};
}
module.exports={quantile,summarizeFrames,summarizeLongTasks,summarizeRun};
