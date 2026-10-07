#!/usr/bin/env node
'use strict';
// Source and draw-call arithmetic only. No game, painter, canvas, pixels or browser.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const render=require('./mapedge-render018');
const ROOT=__dirname,BASE='1400301238f7a46ab6d3c489422a48f9f90cac9d';
const BEFORE='52924698c88ec2f9cafe37828b8d966a6f962488';
const PINS=Object.freeze({
  baselineHTML:'f43910b13ff2d0d341e36ebed9b1332439286bb97e39fab3e5d2fedf103e7a99',
  beforeHTML:'17d0f0cfce8742eddbe4b138489ad9851c36d31dc2426835949b30fbc656e939',
  cliffPainter:'dc4f6b13a909277ee4ae473eb96bf8a50e4521e2782236e88cb39f131a2dc2b9',
  worldToView:'1f6ace1840b638c52d1f4fb696091638e77196a2ebdc90a9ff80b0a5072ce2b9',
  screenAnchors:'1b158a61ca06a10885c6bec4a5e65568ab8aec23203071db2d698e0b87247511',
  boundaryDraw:'945cd97e9bff2dbf35d403cf4bfc51419c8f737c2d7a1b3f2b285ba638182c04'
});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function sourceBetween(source,start,end){
  assert.equal(source.split(start).length,2,'unique source start: '+start);
  assert.equal(source.split(end).length,2,'unique source end: '+end);
  return source.slice(source.indexOf(start),source.indexOf(end));
}
function sourceParts(source){
  return{
    cliffPainter:sourceBetween(source,'  /* ---------- 懸崖（地圖邊緣土層） ---------- */',"  await bootCheckpoint453(13,'建立道路、橋梁與交通基底…','core');"),
    worldToView:sourceBetween(source,'function w2v(x,y){','function v2w(vx,vy){'),
    screenAnchors:sourceBetween(source,'  const sxOf=(x,y)=>','  const pad=(window.__noMetropolitanArt516'),
    boundaryDraw:source.split('\n').filter(line=>line.includes('const vp388=w2v(x,y);')).map(line=>line+'\n').join('')
  };
}
function sourceProof018(){
  const read=ref=>execFileSync('git',['show',ref+':index.html'],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024});
  const baseline=read(BASE),before=read(BEFORE),current=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  assert.equal(hash(baseline),PINS.baselineHTML);assert.equal(hash(before),PINS.beforeHTML);
  const b=sourceParts(baseline),p=sourceParts(before),c=sourceParts(current);
  for(const name of Object.keys(b)){
    assert.equal(hash(b[name]),PINS[name],name+' immutable source pin');
    assert.equal(p[name],b[name],name+' already present before GPT-018');
    if(name!=='boundaryDraw')assert.equal(c[name],b[name],name+' must remain byte-exact');
  }
  const loop='    for(let y=0;y<N;y++)for(let x=0;x<N;x++){\n      const sx=sxOf(x,y),sy=syOf(x,y);';
  for(const source of[baseline,before,current]){
    assert.equal(source.split(loop).length,2,'world-y/world-x ground order stays exact');
    assert.ok(source.indexOf(loop)<source.indexOf('const vp388=w2v(x,y);'),'boundary draw follows ground loop');
  }
  assert.ok(b.cliffPainter.includes('const d=x<32?(x>>1)+1:((63-x)>>1)+1;'));
  assert.ok(b.cliffPainter.includes('const yE=15+d;'));
  assert.ok(b.cliffPainter.includes("g.fillStyle='#6d4d31';g.fillRect(x,yE,1,27);"));
  return{baseline:BASE,preRepair:BEFORE,pins:PINS,existingNativeCause:true,unchangedPainterAndAnchors:true,worldLoopOrderExact:true};
}
function helperSourceGuard018(source){
  const code=source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');
  assert.doesNotMatch(code,/\b(?:Math|rand|random|R|localStorage|sessionStorage|document|fetch|XMLHttpRequest|WebSocket|eval|Function|require)\b/,'helper has no RNG, storage, canvas creation, network, dynamic code or dependencies');
  const hot=sourceBetween(code,'  function mapEdgeMask018','  function selftest018');
  assert.equal((hot.match(/new Path2D\(\)/g)||[]).length,1,'one private clipping path; no persistent cache');
  assert.doesNotMatch(hot.replace('new Path2D()',''),/\bnew\b|\[|\{\s*\w+\s*:|\b(?:Array|Object)\s*\./,'no other per-draw object, array or constructor');
  assert.doesNotMatch(hot,/ctx\.(?!(?:drawImage|save|clip|restore)\b)|sprite\./,'only draw and balanced clipping; no current path, transform or sprite mutation');
  const draws=[...hot.matchAll(/ctx\.drawImage\(([^;]+)\);/g)].map(match=>match[1]);
  assert.deepEqual(draws,['sprite,sx,sy,64*z,56*z','sprite,sx,sy,64*z,56*z'],'every draw retains the original full-sprite transform');
  assert.match(hot,/finally\s*\{\s*ctx\.restore\(\);\s*\}/,'state restoration is unconditional after save');
  return true;
}
// Pure call/state doubles, deliberately without any rasterization or canvas.
const pathData018=new WeakMap();let pathAllocations018=0;
class MockPath2D018{
  constructor(){pathAllocations018++;pathData018.set(this,[]);}
  rect(...args){pathData018.get(this).push(args);}
}
function isolatedAPI018(source,browser,Path2D=MockPath2D018){
  const sandbox=browser?{window:{},Path2D}:{module:{exports:{}},Path2D};
  for(const key of['document','localStorage','sessionStorage','fetch','XMLHttpRequest','WebSocket'])Object.defineProperty(sandbox,key,{get(){throw Error('forbidden helper dependency: '+key);}});
  vm.runInNewContext(source,sandbox,{timeout:1000,filename:'mapedge-render018.js'});
  return browser?sandbox.window.MapEdgeRepair018:sandbox.module.exports;
}
function context018(failAt){
  const calls=[],events=[],drawStates=[],stack=[];
  const currentPath=Object.freeze(['unrelated caller path']);
  const initial=Object.freeze({clips:Object.freeze([Object.freeze([-10000,-10000,20000,20000])]),transform:Object.freeze([1.25,.125,-.25,2,13.25,-27.5]),alpha:.63,composite:'source-over',smoothing:false,currentPath});
  const failure=Error('injected '+failAt);let state=initial;
  function hit(name){events.push(name);if(failAt===name)throw failure;}
  const methods={
    save(){assert.equal(this,ctx);hit('save');stack.push(state);},
    clip(clip){
      assert.equal(this,ctx);assert.equal(arguments.length,1,'clip only the private path');
      const rects=pathData018.get(clip);assert.ok(rects,'clip receives an independent Path2D');
      assert.equal(rects.length,1,'exactly one outward rectangle per path');
      assert.equal(rects[0].length,4);state={...state,clips:[...state.clips,rects[0].slice()]};hit('clip');
    },
    drawImage(...args){assert.equal(this,ctx);calls.push(args);drawStates.push(state);hit('drawImage');},
    restore(){assert.equal(this,ctx);hit('restore');assert.ok(stack.length,'no over-restoration');state=stack.pop();}
  };
  const ctx=new Proxy(methods,{get(target,key){assert.ok(Object.hasOwn(methods,key),'forbidden context access: '+String(key));return target[key];},set(){throw Error('canvas state mutation');}});
  return{ctx,calls,events,drawStates,failure,assertRestored(){assert.equal(state,initial,'caller state restored exactly');assert.equal(stack.length,0,'balanced save/restore');assert.equal(state.currentPath,currentPath,'caller path preserved');}};
}
function record018(api,vx,vy,n,sx,sy,z,legacy=false,sprite){
  if(arguments.length<9)sprite=new Proxy(Object.freeze({canonicalCliff:true}),{get(){throw Error('sprite property read');}});
  const q=context018(),allocations=pathAllocations018;
  const mask=api.drawMapEdge018(q.ctx,sprite,vx,vy,n,sx,sy,z,legacy);q.assertRestored();
  return{mask,calls:q.calls,events:q.events,drawStates:q.drawStates,allocations:pathAllocations018-allocations,sprite};
}
// This independent test mapping is not evaluated from the game's w2v source.
function rotate018(x,y,n,r){return r===0?[x,y]:r===1?[n-1-y,x]:r===2?[n-1-x,n-1-y]:[y,n-1-x];}
function worldMask018(x,y,n,r){
  if(r===0)return(y===n-1?1:0)|(x===n-1?2:0);
  if(r===1)return(x===n-1?1:0)|(y===0?2:0);
  if(r===2)return(y===0?1:0)|(x===0?2:0);
  return(x===0?1:0)|(y===n-1?2:0);
}
function assertCall018(q,expected,sx,sy,z,legacy=false){
  assert.equal(q.mask,expected);
  if(!expected||!q.sprite){assert.deepEqual(q.calls,[]);assert.deepEqual(q.events,[]);assert.equal(q.allocations,0);return;}
  assert.equal(q.calls.length,1,'each boundary tile has exactly one native draw');
  assert.deepEqual(q.calls[0],[q.sprite,sx,sy,64*z,56*z],'full source and original destination remain exact');
  const state=q.drawStates[0];assert.deepEqual(state.transform,[1.25,.125,-.25,2,13.25,-27.5]);
  assert.equal(state.alpha,.63);assert.equal(state.composite,'source-over');assert.equal(state.smoothing,false);
  assert.deepEqual(state.currentPath,['unrelated caller path']);
  assert.deepEqual(state.clips[0],[-10000,-10000,20000,20000],'existing clip retained');
  if(legacy||expected===3){assert.deepEqual(q.events,['drawImage']);assert.equal(q.allocations,0);assert.equal(state.clips.length,1);return;}
  assert.deepEqual(q.events,['save','clip','drawImage','restore']);assert.equal(q.allocations,1);
  assert.equal(state.clips.length,2,'outward half intersects the existing clip');
  assert.deepEqual(state.clips[1],[expected===1?sx:sx+32*z,sy,32*z,56*z]);
}
function drawControls018(api,exhaustive=true){
  let cases=0;
  for(const n of exhaustive?[1,2,72]:[3])for(let r=0;r<4;r++)for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const[vx,vy]=rotate018(x,y,n,r),expected=worldMask018(x,y,n,r);
    assert.equal(api.mapEdgeMask018(vx,vy,n),expected);
    for(const z of[.75,1,1.6,2])for(const legacy of[false,true]){
      const sx=-201.25+((vx-vy)*32-32)*z,sy=35.5+(vx+vy)*16*z;
      assertCall018(record018(api,vx,vy,n,sx,sy,z,legacy),expected,sx,sy,z,legacy);cases++;
    }
  }
  // Missing atlas is the exact old no-draw path; no sprite properties are read.
  for(const sprite of[null,undefined,false])for(const legacy of[false,true]){
    const q=record018(api,71,71,72,10,20,1,legacy,sprite);
    assertCall018(q,3,10,20,1,legacy);cases++;
  }
  // Preserve every supplied anchor, including arbitrary height offsets. This is
  // draw-call invariance, not a claim that native varied-height pixels were run.
  for(const dy of[-96,-24,0,13.5,64])for(const z of[.75,1,1.6,2])for(const[vx,vy,expected]of[[20,71,1],[71,20,2],[71,71,3],[20,20,0]]){
    assertCall018(record018(api,vx,vy,72,-50.75,100.125+dy,z),expected,-50.75,100.125+dy,z);cases++;
  }
  return cases;
}
function sourcePointIncluded018(q,px,py){
  const call=q.calls[0];if(!call||px<0||px>=64||py<0||py>=56)return false;
  const[,sx,sy,w,h]=call,x=sx+px*w/64,y=sy+py*h/56;
  return q.drawStates[0].clips.every(([cx,cy,cw,ch])=>x>=cx&&x<cx+cw&&y>=cy&&y<cy+ch);
}
function geometryProof018(api){
  const n=72,A={x:71,y:65},B={x:71,y:66};
  const av=rotate018(A.x,A.y,n,1),bv=rotate018(B.x,B.y,n,1);
  assert.deepEqual(av,[6,71]);assert.deepEqual(bv,[5,71]);
  assert.ok(A.y*n+A.x<B.y*n+B.x,'B is later in the unchanged world loop');
  const proofs=[];
  for(const z of[.75,1,1.6,2]){
    const ax=(av[0]-av[1])*32*z,ay=(av[0]+av[1])*16*z;
    const bx=(bv[0]-bv[1])*32*z,by=(bv[0]+bv[1])*16*z;
    // One native grass sample from A and a native cliff sample from B occupy
    // the same point. These are algebraic source coordinates, not raster reads.
    assert.ok(Math.abs((ax+16*z)-(bx+48*z))<1e-9);
    assert.ok(Math.abs((ay+14*z)-(by+30*z))<1e-9);
    const old=record018(api,...bv,n,bx,by,z,true),fixed=record018(api,...bv,n,bx,by,z,false);
    assert.ok(sourcePointIncluded018(old,48,30),'old wrong face covers implicated point');
    assert.ok(!sourcePointIncluded018(fixed,48,30),'repaired face excludes implicated point');
    assert.ok(sourcePointIncluded018(fixed,16,30),'legitimate left outer-wall sample remains');
    const right=record018(api,71,5,n,bx,by,z),corner=record018(api,71,71,n,bx,by,z);
    assert.ok(sourcePointIncluded018(right,48,30),'legitimate right outer-wall sample remains');
    for(const point of[[16,30],[48,30],[31,40],[32,40]])assert.ok(sourcePointIncluded018(corner,...point),'corner retains both complete native halves');
    proofs.push({zoom:z,oldIncludesWrongFace:true,fixedExcludesWrongFace:true,outwardWallsAndCornerRetained:true});
  }
  // Continuous projected outward boundary: the neighboring half-face intervals
  // meet at an identical x and y boundary without changing their 2:1 slope.
  for(const z of[.75,1,1.6,2])for(let i=0;i<n-1;i++){
    const leftA={x:(i-(n-1))*32*z,y:(i+n-1)*16*z},leftB={x:(i+1-(n-1))*32*z,y:(i+1+n-1)*16*z};
    assert.ok(Math.abs(leftA.x+32*z-leftB.x)<1e-9);assert.ok(Math.abs(leftA.y+32*z-(leftB.y+16*z))<1e-9);
    const rightA={x:((n-1)-i)*32*z,y:(n-1+i)*16*z},rightB={x:((n-1)-(i+1))*32*z,y:(n-1+i+1)*16*z};
    assert.ok(Math.abs(rightA.x+32*z-(rightB.x+64*z))<1e-9);assert.ok(Math.abs(rightA.y+32*z-(rightB.y+16*z))<1e-9);
  }
  return{rotation:1,A,B,viewA:av,viewB:bv,sourceA:[16,14],sourceB:[48,30],sourceArithmeticOnly:true,proofs};
}
function samplingProof018(api){
  // The failed native frame used this real destination anchor. At .75 zoom,
  // these centers land on exact integer source ties. Assert call identity, not
  // a made-up nearest-neighbor rule or a claim that this test reads pixels.
  const sx=1520,sy=216,z=.75,sprite=Object.freeze({canonicalCliff:true});
  const old=record018(api,71,40,72,sx,sy,z,true,sprite),fixed=record018(api,71,40,72,sx,sy,z,false,sprite);
  assert.deepEqual(fixed.calls,old.calls,'full transform at the actual failed anchor is bit-identical');
  assert.deepEqual(fixed.drawStates[0].clips[1],[1544,216,24,42]);
  const ties=[];
  for(let x=1545;x<=1566;x+=3){
    const sourceX=(x+.5-sx)*64/(64*z);ties.push(sourceX);
    assert.ok(sourcePointIncluded018(fixed,sourceX,40),'retained tie lies in the outward half');
  }
  assert.deepEqual(ties,[34,38,42,46,50,54,58,62]);
  for(const z of[.75,1,1.6,2])for(const[sx,sy]of[[1520,216],[-50.75,100.125],[13.1,-77.3]])for(const[vx,vy]of[[20,71],[71,20],[71,71]]){
    const fixed=record018(api,vx,vy,72,sx,sy,z,false,sprite),old=record018(api,vx,vy,72,sx,sy,z,true,sprite);
    assert.deepEqual(fixed.calls,old.calls,'clipping never changes source-to-destination draw arguments');
  }
  return{sourceArithmeticOnly:true,failedAnchor:[sx,sy],zoom:z,retainedIntegerSourceTies:ties,originalFullTransformExact:true};
}
function stateControls018(source,api){
  let cases=0;
  for(const[vx,vy]of[[20,71],[71,20]])for(const failure of['save','clip','drawImage']){
    const q=context018(failure);
    assert.throws(()=>api.drawMapEdge018(q.ctx,'sentinel',vx,vy,72,1520,216,.75,false),error=>error===q.failure);
    assert.deepEqual(q.events,failure==='save'?['save']:failure==='clip'?['save','clip','restore']:['save','clip','drawImage','restore']);
    assert.equal(q.calls.length,failure==='drawImage'?1:0);q.assertRestored();cases++;
  }
  // Fail before save if constructing the private path fails. Do not consume a
  // caller-owned save frame or draw an unclipped fallback when clipping fails.
  for(const failAt of['constructor','rect']){
    const failure=Error('injected path '+failAt),q=context018();
    class BrokenPath{constructor(){if(failAt==='constructor')throw failure;}rect(){throw failure;}}
    const broken=isolatedAPI018(source,false,BrokenPath);
    assert.throws(()=>broken.drawMapEdge018(q.ctx,'sentinel',20,71,72,1,2,.75,false),error=>error===failure);
    assert.deepEqual(q.events,[]);q.assertRestored();cases++;
  }
  // A browser supports Path2D already; Node import/selftest and all bypass
  // paths must stay usable without a Path2D implementation or clipping methods.
  const noPath=isolatedAPI018(source,false,null);assert.equal(noPath.selftest018().ok,true);
  for(const[vx,vy,sprite,legacy]of[[20,20,'s',false],[20,71,null,false],[71,20,undefined,false],[71,71,'s',false],[20,71,'s',true],[71,20,'s',true]]){
    const q=record018(noPath,vx,vy,72,1,2,.75,legacy,sprite);
    assertCall018(q,noPath.mapEdgeMask018(vx,vy,72),1,2,.75,legacy);cases++;
  }
  const missing=context018();assert.throws(()=>noPath.drawMapEdge018(missing.ctx,'s',20,71,72,1,2,.75,false));
  assert.deepEqual(missing.events,[]);missing.assertRestored();cases++;
  for(const[vx,vy,legacy]of[[71,71,false],[20,71,true],[71,20,true]]){
    const q=context018('drawImage');
    assert.throws(()=>api.drawMapEdge018(q.ctx,'s',vx,vy,72,1,2,.75,legacy),error=>error===q.failure);
    assert.deepEqual(q.events,['drawImage']);q.assertRestored();cases++;
  }
  const restore=context018('restore');
  assert.throws(()=>api.drawMapEdge018(restore.ctx,'s',20,71,72,1,2,.75,false),error=>error===restore.failure);
  assert.deepEqual(restore.events,['save','clip','drawImage','restore'],'restoration failures propagate without retry');cases++;
  // Reusing one context across alternating clips must not leak a previous half.
  const repeated=context018();
  for(const[vx,vy,legacy]of[[20,71,false],[71,20,false],[71,71,false],[20,20,false],[20,71,true],[71,20,false]]){
    api.drawMapEdge018(repeated.ctx,'s',vx,vy,72,1520,216,.75,legacy);repeated.assertRestored();cases++;
  }
  assert.equal(repeated.drawStates.filter(state=>state.clips.length===2).length,3);
  return{cases,currentPathAndTransformUntouched:true,existingClipRetained:true,exceptionRestoration:true,noUnclippedFallback:true};
}
function mutationControls018(source){
  const mutations=[
    ['wrong view axis','(vy===n-1?1:0)|(vx===n-1?2:0)','(vx===n-1?1:0)|(vy===n-1?2:0)'],
    ['hide left wall','(vy===n-1?1:0)','0'],
    ['hide right wall','(vx===n-1?2:0)','0'],
    ['hide corner','if(!sprite||!mask)','if(!sprite||!mask||mask===3)'],
    ['old full wrong half','legacyDisabledFlag||mask===3','true'],
    ['resample cropped source','sprite,sx,sy,64*z,56*z','sprite,0,0,32,56,sx,sy,32*z,56*z'],
    ['shift original anchor','sprite,sx,sy,64*z,56*z','sprite,sx+1,sy,64*z,56*z'],
    ['reverse clip half','mask===1?sx:sx+32*z','mask===2?sx:sx+32*z'],
    ['shift right clip','sx+32*z,sy','sx,sy'],
    ['shift clip height','32*z,sy','32*z,sy-1'],
    ['change clip height','32*z,56*z','32*z,55*z'],
    ['expose both halves','32*z,56*z','64*z,56*z'],
    ['crop legitimate wall','32*z,56*z','31*z,56*z'],
    ['remove clip','ctx.clip(clip);',''],
    ['reuse current path','ctx.clip(clip);','ctx.clip();'],
    ['destroy current path','ctx.clip(clip);','ctx.beginPath();ctx.clip(clip);'],
    ['change caller transform','ctx.clip(clip);','ctx.setTransform(1,0,0,1,0,0);ctx.clip(clip);'],
    ['clip after draw','ctx.clip(clip);\n        ctx.drawImage(sprite,sx,sy,64*z,56*z);','ctx.drawImage(sprite,sx,sy,64*z,56*z);\n        ctx.clip(clip);'],
    ['omit save','ctx.save();',''],
    ['omit restore','finally{ctx.restore();}','finally{}'],
    ['restore twice','finally{ctx.restore();}','finally{ctx.restore();ctx.restore();}'],
    ['restore only on success','ctx.drawImage(sprite,sx,sy,64*z,56*z);\n      }finally{ctx.restore();}','ctx.drawImage(sprite,sx,sy,64*z,56*z);ctx.restore();\n      }finally{}'],
    ['swallow draw failure','}finally{ctx.restore();}','}catch(ignored){}finally{ctx.restore();}'],
    ['paint interior','if(!sprite||!mask)','if(!sprite)'],
    ['lose old fallback','legacyDisabledFlag||mask===3','mask===3'],
    ['incorrectly enable fallback','legacyDisabledFlag||mask===3','!legacyDisabledFlag||mask===3'],
    ['add terrain overlay','if(!sprite||!mask)return mask;','if(!sprite||!mask)return mask;ctx.fillRect(sx,sy,64*z,56*z);'],
    ['introduce RNG','const mask=mapEdgeMask018(vx,vy,n);','const mask=mapEdgeMask018(vx,vy,n);Math.random();'],
    ['introduce storage','const mask=mapEdgeMask018(vx,vy,n);',"const mask=mapEdgeMask018(vx,vy,n);localStorage.setItem('tile','0');"],
    ['introduce network','const mask=mapEdgeMask018(vx,vy,n);',"const mask=mapEdgeMask018(vx,vy,n);fetch('/terrain');"],
    ['allocate each draw','const mask=mapEdgeMask018(vx,vy,n);','const mask=mapEdgeMask018(vx,vy,n);const unwanted=[];']
  ];
  const rejected=[];
  for(const[name,from,to]of mutations){
    assert.ok(source.includes(from),'mutation target exists: '+name);
    const mutant=source.replace(from,to);
    assert.throws(()=>{helperSourceGuard018(mutant);const api=isolatedAPI018(mutant,false);drawControls018(api,false);geometryProof018(api);samplingProof018(api);stateControls018(mutant,api);},undefined,'must reject '+name);
    rejected.push(name);
  }
  return rejected;
}
function staticTest018(){
  const source=fs.readFileSync(path.join(ROOT,'mapedge-render018.js'),'utf8');
  const sourceProof=sourceProof018();helperSourceGuard018(source);
  assert.deepEqual(Object.keys(render).sort(),['drawMapEdge018','mapEdgeMask018','selftest018']);assert.ok(Object.isFrozen(render));
  assert.deepEqual(render.selftest018(),{ok:true,cases:7,canvasExecuted:false});
  const api=isolatedAPI018(source,false),cases=drawControls018(api),geometry=geometryProof018(api),sampling=samplingProof018(api),state=stateControls018(source,api);
  let browserCases=0;
  for(const browser of[false,true]){const api=isolatedAPI018(source,browser);assert.ok(Object.isFrozen(api));assert.equal(api.selftest018().ok,true);browserCases+=drawControls018(api,false);geometryProof018(api);samplingProof018(api);stateControls018(source,api);}
  const rejected=mutationControls018(source);
  return{ok:true,sourceOnly:true,gameExecuted:false,painterExecuted:false,canvasExecuted:false,pixelsExecuted:false,helperSHA256:hash(source),cases,browserAndNodeExportCases:browserCases,sourceProof,geometry,sampling,state,rejected};
}
module.exports={staticTest018,sourceProof018,helperSourceGuard018,drawControls018,geometryProof018,samplingProof018,stateControls018,mutationControls018,PINS};
if(require.main===module){if(process.argv.length>3||process.argv.length===3&&process.argv[2]!=='--static-test')throw Error('Use --static-test or no arguments; source/draw-call tests only');console.log(JSON.stringify(staticTest018(),null,2));}
