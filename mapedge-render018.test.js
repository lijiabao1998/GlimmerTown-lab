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
  assert.doesNotMatch(hot,/\bnew\b|\[|\{\s*\w+\s*:|\b(?:Array|Object)\s*\./,'hot path allocates no object, array or constructor');
  assert.doesNotMatch(hot,/ctx\.(?!drawImage\b)|sprite\./,'only native drawImage; no context or sprite mutation');
  return true;
}
function isolatedAPI018(source,browser){
  const sandbox=browser?{window:{}}:{module:{exports:{}}};
  for(const key of['document','localStorage','sessionStorage','fetch','XMLHttpRequest','WebSocket'])Object.defineProperty(sandbox,key,{get(){throw Error('forbidden helper dependency: '+key);}});
  vm.runInNewContext(source,sandbox,{timeout:1000,filename:'mapedge-render018.js'});
  return browser?sandbox.window.MapEdgeRepair018:sandbox.module.exports;
}
function record018(api,vx,vy,n,sx,sy,z,legacy=false,sprite){
  if(arguments.length<10)sprite=Object.freeze({canonicalCliff:true});
  const calls=[];
  const ctx=new Proxy({drawImage(...args){assert.equal(this,ctx);calls.push(args);}},{get(target,key){assert.equal(key,'drawImage','no canvas methods or state changes');return target[key];},set(){throw Error('canvas state mutation');}});
  const mask=api.drawMapEdge018(ctx,sprite,vx,vy,n,sx,sy,z,legacy);
  return{mask,calls,sprite};
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
  if(!expected||!q.sprite){assert.deepEqual(q.calls,[]);return;}
  assert.equal(q.calls.length,1,'each boundary tile has exactly one native draw');
  if(legacy||expected===3){assert.deepEqual(q.calls[0],[q.sprite,sx,sy,64*z,56*z]);return;}
  const left=expected===1;
  assert.deepEqual(q.calls[0],[q.sprite,left?0:32,0,32,56,left?sx:sx+32*z,sy,32*z,56*z]);
  const[,sourceX,sourceY,sourceW,sourceH,destX,destY,destW,destH]=q.calls[0];
  assert.ok(sourceX>=0&&sourceY===0&&sourceX+sourceW<=64&&sourceY+sourceH===56);
  assert.equal(destX,sx+sourceX*z);assert.equal(destY,sy+sourceY*z);
  assert.equal(destW,sourceW*z);assert.equal(destH,sourceH*z);
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
function sourcePointIncluded018(call,px,py){
  if(!call)return false;
  return call.length===5?px>=0&&px<64&&py>=0&&py<56:px>=call[1]&&px<call[1]+call[3]&&py>=call[2]&&py<call[2]+call[4];
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
    assert.ok(sourcePointIncluded018(old.calls[0],48,30),'old wrong face covers implicated point');
    assert.ok(!sourcePointIncluded018(fixed.calls[0],48,30),'repaired face excludes implicated point');
    assert.ok(sourcePointIncluded018(fixed.calls[0],16,30),'legitimate left outer-wall sample remains');
    const right=record018(api,71,5,n,bx,by,z),corner=record018(api,71,71,n,bx,by,z);
    assert.ok(sourcePointIncluded018(right.calls[0],48,30),'legitimate right outer-wall sample remains');
    for(const point of[[16,30],[48,30],[31,40],[32,40]])assert.ok(sourcePointIncluded018(corner.calls[0],...point),'corner retains both complete native halves');
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
function mutationControls018(source){
  const mutations=[
    ['wrong view axis','(vy===n-1?1:0)|(vx===n-1?2:0)','(vx===n-1?1:0)|(vy===n-1?2:0)'],
    ['hide left wall','(vy===n-1?1:0)','0'],
    ['hide right wall','(vx===n-1?2:0)','0'],
    ['hide corner','if(!sprite||!mask)','if(!sprite||!mask||mask===3)'],
    ['old full wrong half','legacyDisabledFlag||mask===3','true'],
    ['wrong left source half','sprite,0,0,32,56,sx','sprite,32,0,32,56,sx'],
    ['wrong right source half','sprite,32,0,32,56,sx+32*z','sprite,0,0,32,56,sx+32*z'],
    ['shift right anchor','sx+32*z,sy','sx,sy'],
    ['shift height','32*z,sy','32*z,sy-1'],
    ['change wall height','32*z,56*z','32*z,55*z'],
    ['stretch source half','32,56,sx,sy,32*z','32,56,sx,sy,64*z'],
    ['change source bounds','sprite,0,0,32,56','sprite,0,0,33,56'],
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
    assert.throws(()=>{helperSourceGuard018(mutant);const api=isolatedAPI018(mutant,false);drawControls018(api,false);geometryProof018(api);},undefined,'must reject '+name);
    rejected.push(name);
  }
  return rejected;
}
function staticTest018(){
  const source=fs.readFileSync(path.join(ROOT,'mapedge-render018.js'),'utf8');
  const sourceProof=sourceProof018();helperSourceGuard018(source);
  assert.deepEqual(Object.keys(render).sort(),['drawMapEdge018','mapEdgeMask018','selftest018']);assert.ok(Object.isFrozen(render));
  assert.deepEqual(render.selftest018(),{ok:true,cases:7,canvasExecuted:false});
  const cases=drawControls018(render),geometry=geometryProof018(render);
  let browserCases=0;
  for(const browser of[false,true]){const api=isolatedAPI018(source,browser);assert.ok(Object.isFrozen(api));assert.equal(api.selftest018().ok,true);browserCases+=drawControls018(api,false);geometryProof018(api);}
  const rejected=mutationControls018(source);
  return{ok:true,sourceOnly:true,gameExecuted:false,painterExecuted:false,canvasExecuted:false,pixelsExecuted:false,helperSHA256:hash(source),cases,browserAndNodeExportCases:browserCases,sourceProof,geometry,rejected};
}
module.exports={staticTest018,sourceProof018,helperSourceGuard018,drawControls018,geometryProof018,mutationControls018,PINS};
if(require.main===module){if(process.argv.length>3||process.argv.length===3&&process.argv[2]!=='--static-test')throw Error('Use --static-test or no arguments; source/draw-call tests only');console.log(JSON.stringify(staticTest018(),null,2));}
