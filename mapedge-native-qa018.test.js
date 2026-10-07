#!/usr/bin/env node
'use strict';
// Synthetic data and source contracts only. Never executes observer functions,
// Canvas, a painter, index.html, a game harness or a browser in the local cloud.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const Q=require('./mapedge-native-qa018'),renderer=require('./mapedge-render018');
const PRE_REPAIR='52924698c88ec2f9cafe37828b8d966a6f962488',root=__dirname,rejected=[],rawPair=[{phase:'before',png:'synthetic-before'},{phase:'after',png:'synthetic-after'}];let retainedFailures=0;
for(const f of Q.functions018)new vm.Script('('+f.toString()+')');
const reject=(name,base,validate,edit)=>{const q=structuredClone(base);edit(q);assert.equal(validate(q),false,name);if(validate===Q.mapedgeValidPair018){assert.strictEqual(Q.mapedgePairImages018(false,q,rawPair),rawPair,name+' retains raw before/after');retainedFailures++;}rejected.push(name);};
const previousPath=global.Path2D;global.Path2D=class MockPath018{rect(...r){this.bounds=r;}};
let projected=0;
for(let rotation=0;rotation<4;rotation++)for(let y=0;y<72;y++)for(let x=0;x<72;x++){
 const[vx,vy]=Q.mapedgeView018(x,y,rotation),mask=(vy===71?1:0)|(vx===71?2:0);assert.equal(renderer.mapEdgeMask018(vx,vy,72),mask);
 for(const z of[.75,1,1.6,2])for(const legacy of[false,true]){
  const events=[],clips=[],sx=(vx-vy)*32*z,sy=(vx+vy)*16*z;renderer.drawMapEdge018({save(){},restore(){},clip(p){clips.push(p.bounds);},drawImage:(...args)=>events.push(args)},'canonical-sentinel',vx,vy,72,sx,sy,z,legacy);
  const expected=Q.mapedgeExpectedCall018(vx,vy,72,sx,sy,z,legacy);assert.deepEqual(events,expected?[['canonical-sentinel',...expected]]:[]);const expectedClip=Q.mapedgeExpectedClip018(vx,vy,72,sx,sy,z,legacy);assert.deepEqual(clips,expectedClip?[expectedClip]:[]);projected++;
 }
}
if(previousPath===undefined)delete global.Path2D;else global.Path2D=previousPath;
// Explicit inherited bad witness: (71,65) is painted before (71,66) at rot1.
assert.deepEqual(Q.mapedgeView018(71,65,1),[6,71]);assert.deepEqual(Q.mapedgeView018(71,66,1),[5,71]);
assert.deepEqual(Q.mapedgeExpectedCall018(5,71,72,0,0,1,false),[0,0,64,56]);
assert.deepEqual(Q.mapedgeExpectedClip018(5,71,72,0,0,1,false),[0,0,32,56]);
assert.equal(48>=32,true);assert.equal(16<32,true);
for(let r=0;r<4;r++){const world=Q.mapedgeView018(69,69,(4-r)%4);assert.deepEqual(Q.mapedgeView018(...world,r),[69,69]);}
const rgba=new Uint8ClampedArray([10,20,30,255,40,50,60,255,70,80,90,255,1,2,3,0]),changed=rgba.slice(),mask=new Uint8ClampedArray(16);changed[4]++;mask[7]=255;
assert.deepEqual(Q.mapedgeDiff018(rgba,rgba,2),{changed:0,outside:0,bounds:null,samples:[]});
assert.equal(Q.mapedgeDiff018(rgba,changed,2,mask).changed,1);assert.equal(Q.mapedgeDiff018(rgba,changed,2,mask).outside,0);mask[7]=0;assert.equal(Q.mapedgeDiff018(rgba,changed,2,mask).outside,1);
assert.throws(()=>Q.mapedgeDiff018(rgba,changed.slice(4),2));assert.throws(()=>Q.mapedgeDiff018(rgba,changed,2,mask.slice(4)));
const pair={width:1600,height:1080,rotation:1,zoom:1.6,observerPassThrough:true,sourceExact:true,canonicalCliffExact:true,worldExact:true,storageExact:true,randomCalls:0,canonical:true,frames:[true,false,true,false].map(legacy=>({legacy,callsExact:true,clipsExact:true,calls:35,cacheObserved:true,terrainExact:true})),ground:{outside:0},restoredLegacy:{changed:0},repeatedFixed:{changed:0},full:{outside:0},preservedOutward:501,changedOutward:0};assert(Q.mapedgeValidPair018(pair));
for(const key of['observerPassThrough','sourceExact','canonicalCliffExact','worldExact','storageExact','canonical'])reject('native pair '+key,pair,Q.mapedgeValidPair018,q=>q[key]=false);
for(const[key,value]of[['width',1599],['height',1079],['rotation',4],['zoom',1.5],['randomCalls',1],['preservedOutward',0],['changedOutward',1]])reject('native pair '+key,pair,Q.mapedgeValidPair018,q=>q[key]=value);
for(const key of['ground','full'])reject('unbounded '+key+' pixel',pair,Q.mapedgeValidPair018,q=>q[key].outside=1);
for(const key of['restoredLegacy','repeatedFixed'])reject('cache mismatch '+key,pair,Q.mapedgeValidPair018,q=>q[key].changed=1);
reject('missing cache transition',pair,Q.mapedgeValidPair018,q=>q.frames.pop());
for(let n=0;n<4;n++)for(const[field,value]of[['legacy',n%2!==0],['callsExact',false],['clipsExact',false],['calls',0],['cacheObserved',false],['terrainExact',false]])reject('transition '+n+' '+field,pair,Q.mapedgeValidPair018,q=>q.frames[n][field]=value);
assert.deepEqual(Q.mapedgePairImages018(false,pair,rawPair),[]);assert.strictEqual(Q.mapedgePairImages018(true,pair,rawPair),rawPair);
for(let n=0;n<4;n++)reject('missing per-frame terrain proof '+n,pair,Q.mapedgeValidPair018,q=>delete q.frames[n].terrainExact);
const fixture={kind:'isolated canonical-sprite geometry fixtures, not native game screenshots',sourceExact:true,worldExact:true,storageExact:true,canonicalCliffExact:true,randomCalls:0,rows:[],samplingProbe:{actualMismatch:0,outwardMissing:0,inwardOpaque:0,originalRetainedPixels:240,originalRetainedMismatch:0,croppedRegressionMismatch:30,croppedRetainedMismatch:23,zoom:.75,width:1600,height:1080,anchor:[1520,216]}};
for(const zoom of[.75,1,1.6,2])for(const material of['grass','sand','water','mixed'])for(const height of[0,13])for(const mask of[1,2,3])fixture.rows.push({zoom,material,height,mask,expectedOpaque:200,outwardMissing:0,inwardOpaque:0,originalRetainedPixels:199,originalRetainedMismatch:0,pixelMismatch:0,negatives:Array.from({length:6},(_,n)=>({fault:'synthetic-'+n,mismatch:20}))});assert(Q.mapedgeValidFixtures018(fixture));
reject('fixture duplicate case',fixture,Q.mapedgeValidFixtures018,q=>q.rows[1]=structuredClone(q.rows[0]));
for(const field of['sourceExact','worldExact','storageExact','canonicalCliffExact'])reject('fixture '+field,fixture,Q.mapedgeValidFixtures018,q=>q[field]=false);
reject('fixture RNG',fixture,Q.mapedgeValidFixtures018,q=>q.randomCalls=1);reject('fixture mislabeled as game',fixture,Q.mapedgeValidFixtures018,q=>q.kind='native screenshot');reject('fixture dropped case',fixture,Q.mapedgeValidFixtures018,q=>q.rows.pop());
for(const[field,value]of[['pixelMismatch',1],['outwardMissing',1],['inwardOpaque',1],['expectedOpaque',0],['originalRetainedPixels',0],['originalRetainedMismatch',1]])reject('fixture '+field,fixture,Q.mapedgeValidFixtures018,q=>q.rows[0][field]=value);
reject('fixture accepts wrong-axis pixels',fixture,Q.mapedgeValidFixtures018,q=>q.rows[0].negatives[0].mismatch=0);reject('fixture drops negative',fixture,Q.mapedgeValidFixtures018,q=>q.rows[0].negatives.pop());
for(const[field,value]of[['zoom',1.6],['material','grass'],['height',0],['mask',1]])reject('fixture omitted coverage '+field,fixture,Q.mapedgeValidFixtures018,q=>q.rows.forEach(r=>r[field]=value));
for(const[field,value]of[['actualMismatch',1],['outwardMissing',1],['inwardOpaque',1],['originalRetainedPixels',0],['originalRetainedMismatch',1],['croppedRegressionMismatch',0],['croppedRetainedMismatch',0],['zoom',1],['width',192],['height',160],['anchor',[24,20]]])reject('full-call sampling probe '+field,fixture,Q.mapedgeValidFixtures018,q=>q.samplingProbe[field]=value);
const nativeSource=fs.readFileSync(path.join(root,'mapedge-native-qa018.js'),'utf8'),runner=fs.readFileSync(path.join(root,'waterfront-integration-qa018.js'),'utf8'),baseline=execFileSync('git',['show',PRE_REPAIR+':waterfront-integration-qa018.js'],{cwd:root,encoding:'utf8',maxBuffer:2*1024*1024});
new vm.Script(runner);assert(runner.includes("process.env.GITHUB_ACTIONS!=='true'"));assert(runner.includes("head!==process.env.GITHUB_SHA"));assert(runner.includes("require('./mapedge-native-qa018.test')"));assert(runner.includes('mapedge[0-3]'));assert(runner.includes("MODE=EDGE_MODE?'coldload':REQUESTED_MODE"));
const coldStart="  if(MODE==='coldload'){",oldCold=baseline.slice(baseline.indexOf(coldStart),baseline.indexOf('  report.finalWorker=')),newCold=runner.slice(runner.indexOf(coldStart),runner.indexOf('  if(EDGE_MODE){'));
assert.equal(newCold,oldCold,'Complete original two reload/Continue/three-day block must remain byte exact');
assert(runner.indexOf('  if(EDGE_MODE){')>runner.indexOf(coldStart));assert(runner.includes('for(const zoom of[.75,1,1.6,2])'));assert(runner.includes("for(const weather of['rain','snow'])"));assert(runner.includes('focus:[66.5,65]'));assert(runner.includes("focusLabel:'image10'"));assert(runner.includes("q.recoveredGreen>0"));
const pairSource=Q.functions018.find(f=>f.name==='mapedgeNativePair018').toString(),fixtureSource=Q.functions018.find(f=>f.name==='mapedgeNativeFixtures018').toString();
for(const s of[pairSource,fixtureSource]){assert(!/GV\.(?:load|save|newWorld|step|rebuild|place)|\.age\s*=|\.el\s*=|\.pw\s*=|\.wa\s*=|localStorage\.setItem|SPR\.cliff\s*=/.test(s));assert(s.includes('world===C.world()'));assert(s.includes('storage===JSON.stringify(C.storage())'));assert(s.includes('Math.random=random'));}
assert(pairSource.includes('if(frames.length<2)pngs.push'));assert(!pairSource.includes('if(capture&&frames.length<2)'));assert(pairSource.includes('result.pngs=mapedgePairImages018(capture,result,pngs)'));assert(pairSource.includes('terrainExact:terrainChanges.length===0'));assert(pairSource.includes('now.t!==t.terrain||(now.el||0)!==t.height'));assert(pairSource.includes('Diagnostic pass-through wrappers'));assert(pairSource.includes('CanvasRenderingContext2D.prototype.save=originalSave'));assert(pairSource.includes('CanvasRenderingContext2D.prototype.restore=originalRestore'));assert(pairSource.includes('CanvasRenderingContext2D.prototype.clip=originalClip'));assert(pairSource.includes('Path2D.prototype.rect=originalRect'));assert(pairSource.includes('clipsExact:'));assert(Q.functions018.includes(Q.mapedgeValidPair018));assert(Q.functions018.includes(Q.mapedgePairImages018));
assert(pairSource.includes('return originalDraw.apply(this,arguments)'));assert(pairSource.includes('CanvasRenderingContext2D.prototype.drawImage=originalDraw'));assert(pairSource.includes('for(const legacy of[true,false,true,false])'));
assert(!/groundDirty\s*=|groundCacheKey\s*=|reset|recalc|rebuild/.test(pairSource));assert(pairSource.includes('window.__noMapEdgeFix018=legacy;GV.forceDraw()'));
assert(nativeSource.includes('not native game screenshots'));assert(fixtureSource.includes("for(const height of[0,13])"));assert(!fixtureSource.includes('GV.tile'));assert(fixtureSource.includes('fg.drawImage(cliff,sx,sy,64*z,56*z)'));assert(fixtureSource.includes("eg.globalCompositeOperation='destination-in'"));assert(fixtureSource.includes('o.maskPixels[i+3]===255&&o.fullPixels[i+3]'));assert(fixtureSource.includes('originalRetainedMismatch'));assert(fixtureSource.includes('const sx=1520,sy=216,z=.75'));assert(fixtureSource.includes('cg.drawImage(cliff,32,0,32,56,sx+32*z,sy,32*z,56*z)'));assert(fixtureSource.includes('source-mutation'));
console.log(JSON.stringify({ok:true,sourceOnly:true,syntheticDataOnly:true,gameExecuted:false,artExecuted:false,pixelsExecuted:false,projectedCallCases:projected,nativeObservers:Q.functions018.length,originalColdBlockByteExact:true,realReloadsRequired:2,unaidedDaysPerReload:3,fourCacheStatesRequired:true,fixturesPerRotation:96,retainedFailedPairNegatives:retainedFailures,successfulCapturePolicyUnchanged:true,rejected},null,2));
