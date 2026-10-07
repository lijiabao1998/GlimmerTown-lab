#!/usr/bin/env node
'use strict';
// Source, synthetic byte arrays and call mocks only. No game, painter, canvas or browser.
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
  assert.doesNotMatch(code,/\b(?:Math|rand|random|R|localStorage|sessionStorage|fetch|XMLHttpRequest|WebSocket|eval|Function|require|SPR|Path2D|Map|Set)\b/,'no RNG, storage, network, registration, clipping, strong-key cache or dependencies');
  assert.equal((code.match(/new WeakMap\(\)/g)||[]).length,1,'exactly one weak canonical-identity cache');
  const cold=sourceBetween(code,'  function mapEdgeHalves018','  function mapEdgeMask018');
  const warm=cold.slice(0,cold.indexOf('    if(sprite.width'));
  assert.doesNotMatch(warm,/\bnew\b|\[|\{\s*\w+\s*:/,'warm cache hit allocates nothing');
  assert.doesNotMatch(code.replace(cold,''),/document|ImageData|Uint8ClampedArray/,'native data/canvas allocation occurs only in cache builder');
  assert.equal((cold.match(/document\.createElement\('canvas'\)/g)||[]).length,1);
  assert.doesNotMatch(cold.replace("document.createElement('canvas')",''),/document\./,'no DOM registration');
  assert.doesNotMatch(cold,/sprite\s*\[[^\]]+\]\s*=|sprite\.\w+\s*=|source\.data\s*\[[^\]]+\]\s*=|source\.data\.fill/,'canonical source and readback stay immutable');
  assert.match(cold,/mapEdgeCopies018\.set\(sprite,halves\)/,'only canonical identity keys');
  const hot=sourceBetween(code,'  function mapEdgeMask018','  function selftest018');
  assert.doesNotMatch(hot.replace('[mask-1]',''),/\bnew\b|\[|\{\s*\w+\s*:|\b(?:Array|Object)\s*\./,'hot draw allocates no objects, arrays or constructors');
  assert.doesNotMatch(hot,/ctx\.(?!drawImage\b)|sprite\./,'destination context receives only drawImage');
  const draws=[...hot.matchAll(/ctx\.drawImage\(([^;]+)\);/g)].map(match=>match[1]);
  assert.deepEqual(draws,['sprite,sx,sy,64*z,56*z','mapEdgeHalves018(sprite)[mask-1],sx,sy,64*z,56*z'],'original five-argument transform for original and copies');
  return true;
}
// Synthetic byte arrays and call-only doubles. No canvas, game, painter,
// browser, image decoder or rasterization is executed by these tests.
const environments018=new WeakMap();
function isolatedAPI018(source,browser,options={}){
  const stats={maps:0,gets:0,sets:0,reads:0,creates:0,contexts:0,arrays:0,images:0,puts:0};
  const data=new WeakMap(),readBuffers=[],created=[],failure=Error('injected copy failure');
  let failAt=options.failAt||null;
  function fail(name){if(failAt===name)throw failure;}
  class CacheWeakMap extends WeakMap{
    constructor(){super();stats.maps++;}
    get(key){stats.gets++;return super.get(key);}
    set(key,value){stats.sets++;fail('cache');assert.equal(value.length,2,'cache publishes exactly two completed copies');for(const image of value){assert.ok(data.get(image)?.written,'cache never publishes partial copy');assert.ok(!Object.values(image).includes(key),'copy has no source backreference');}return super.set(key,value);}
  }
  class CopyBytes extends Uint8ClampedArray{constructor(source){stats.arrays++;fail('array');super(source);}}
  class FakeImageData{constructor(bytes,width,height){stats.images++;fail('image');assert.ok(bytes instanceof Uint8ClampedArray);assert.equal(width,64);assert.equal(height,56);assert.equal(bytes.length,width*height*4);this.data=bytes;this.width=width;this.height=height;}}
  const document={createElement(tag){
    stats.creates++;fail('create');assert.equal(tag,'canvas');
    const image={width:0,height:0,getContext(type){stats.contexts++;fail('copy-context');assert.equal(type,'2d');if(failAt==='copy-context-null')return null;
      return new Proxy({putImageData(value,x,y){
        stats.puts++;fail('put');if(failAt==='second-put'&&stats.puts===2)throw failure;
        assert.equal(arguments.length,3);assert.ok(value instanceof FakeImageData);assert.equal(x,0);assert.equal(y,0);assert.equal(image.width,64);assert.equal(image.height,56);
        data.set(image,{bytes:new Uint8ClampedArray(value.data),written:true,kind:'copy'});
      }},{get(target,key){assert.ok(Object.hasOwn(target,key),'unexpected copy-context action '+String(key));return target[key];},set(){throw Error('unexpected copy-context state change');}});
    }};created.push(image);data.set(image,{written:false,kind:'copy'});return image;
  }};
  const sandbox=browser?{window:{}}:{module:{exports:{}}};
  Object.assign(sandbox,{WeakMap:CacheWeakMap,Uint8ClampedArray:CopyBytes,ImageData:FakeImageData});
  Object.defineProperty(sandbox,'document',{get(){fail('document');return document;}});
  for(const key of['localStorage','sessionStorage','fetch','XMLHttpRequest','WebSocket','Path2D'])Object.defineProperty(sandbox,key,{get(){throw Error('forbidden helper dependency: '+key);}});
  vm.runInNewContext(source,sandbox,{timeout:1000,filename:'mapedge-render018.js'});
  const api=browser?sandbox.window.MapEdgeRepair018:sandbox.module.exports;
  function makeSprite(seed=7,width=64,height=56){
    const bytes=new Uint8ClampedArray(64*56*4);
    for(let y=0;y<56;y++)for(let x=0;x<64;x++){
      const i=(y*64+x)*4;bytes[i]=(x*7+y+seed)%255+1;bytes[i+1]=(y*13+x+seed)%255+1;bytes[i+2]=(x+y*3+seed)%255+1;bytes[i+3]=(x*3+y*5+seed)%256;
    }
    const sprite=Object.freeze({width,height,getContext(type){
      fail('source-context');assert.equal(type,'2d');if(failAt==='source-context-null')return null;
      return new Proxy({getImageData(x,y,w,h){
        stats.reads++;fail('read');assert.deepEqual([x,y,w,h],[0,0,64,56]);
        const result={width:64,height:56,data:new Uint8ClampedArray(bytes)};
        if(failAt==='bad-width')result.width=63;if(failAt==='bad-height')result.height=55;if(failAt==='bad-data')result.data=new Uint8ClampedArray(10);
        readBuffers.push({result,expected:new Uint8ClampedArray(result.data)});return result;
      }},{get(target,key){assert.ok(Object.hasOwn(target,key),'canonical context is read-only: '+String(key));return target[key];},set(){throw Error('canonical state mutation');}});
    }});
    data.set(sprite,{bytes,kind:'canonical'});return sprite;
  }
  const env={stats,data,readBuffers,created,failure,makeSprite,setFailure(value){failAt=value;},snapshot(){return{...stats};}};
  env.defaultSprite=makeSprite();environments018.set(api,env);return api;
}
function context018(failDraw=false){
  const calls=[],events=[],failure=Error('injected draw failure');
  const methods={drawImage(...args){assert.equal(this,ctx);events.push('drawImage');calls.push(args);if(failDraw)throw failure;}};
  const ctx=new Proxy(methods,{get(target,key){assert.ok(Object.hasOwn(target,key),'destination path/state/transform mutation: '+String(key));return target[key];},set(){throw Error('destination state mutation');}});
  return{ctx,calls,events,failure};
}
function record018(api,vx,vy,n,sx,sy,z,legacy=false,sprite){
  const env=environments018.get(api);if(arguments.length<9)sprite=env.defaultSprite;
  const q=context018(),before=env.snapshot();
  const mask=api.drawMapEdge018(q.ctx,sprite,vx,vy,n,sx,sy,z,legacy);
  return{mask,calls:q.calls,events:q.events,before,after:env.snapshot(),sprite,env};
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
  if(!expected||!q.sprite){assert.deepEqual(q.calls,[]);assert.deepEqual(q.events,[]);assert.deepEqual(q.after,q.before,'no allocation/cache access for absent draws');return;}
  assert.equal(q.calls.length,1);assert.equal(q.calls[0].length,5);
  assert.deepEqual(q.calls[0].slice(1),[sx,sy,64*z,56*z],'full-size original destination exact');
  assert.deepEqual(q.events,['drawImage'],'no destination context mutation');
  if(legacy||expected===3){assert.equal(q.calls[0][0],q.sprite);assert.deepEqual(q.after,q.before,'legacy/corner never access cache');return;}
  const image=q.calls[0][0];assert.notEqual(image,q.sprite);assert.equal(image.width,64);assert.equal(image.height,56);
  assert.equal(q.env.data.get(image)?.kind,'copy');
  assert.equal(q.after.gets-q.before.gets,1);
  const cold=q.after.reads!==q.before.reads;
  for(const[key,count]of Object.entries({reads:1,creates:2,contexts:2,arrays:2,images:2,puts:2,sets:1}))assert.equal(q.after[key]-q.before[key],cold?count:0,'lazy pair/warm allocation budget: '+key);
  assert.equal(q.after.maps,q.before.maps);
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
  for(const sprite of[null,undefined,false])for(const legacy of[false,true])for(const[vx,vy,mask]of[[20,20,0],[20,71,1],[71,20,2],[71,71,3]]){
    const q=record018(api,vx,vy,72,10,20,1,legacy,sprite);
    assertCall018(q,mask,10,20,1,legacy);cases++;
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
  const bytes=q.env.data.get(call[0]).bytes,i=(Math.floor(py)*64+Math.floor(px))*4;
  return bytes[i]!==0||bytes[i+1]!==0||bytes[i+2]!==0||bytes[i+3]!==0;
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
  const sx=1520,sy=216,z=.75,sprite=environments018.get(api).defaultSprite;
  const old=record018(api,71,40,72,sx,sy,z,true,sprite),fixed=record018(api,71,40,72,sx,sy,z,false,sprite);
  assert.deepEqual(fixed.calls[0].slice(1),old.calls[0].slice(1),'actual failed anchor retains original transform');
  const ties=[];
  for(let x=1545;x<=1566;x+=3){const sourceX=(x+.5-sx)*64/(64*z);ties.push(sourceX);assert.ok(sourcePointIncluded018(fixed,sourceX,40));}
  assert.deepEqual(ties,[34,38,42,46,50,54,58,62]);
  for(const z of[.75,1,1.6,2])for(const[sx,sy]of[[1520,216],[-50.75,100.125],[13.1,-77.3]])for(const[vx,vy]of[[20,71],[71,20],[71,71]]){
    const fixed=record018(api,vx,vy,72,sx,sy,z,false,sprite),old=record018(api,vx,vy,72,sx,sy,z,true,sprite);
    assert.deepEqual(fixed.calls[0].slice(1),old.calls[0].slice(1));
  }
  return{sourceArithmeticOnly:true,failedAnchor:[sx,sy],zoom:z,retainedIntegerSourceTies:ties,originalFullTransformExact:true};
}
function copyControls018(source){
  const api=isolatedAPI018(source,false),env=environments018.get(api),sprite=env.defaultSprite,canonical=new Uint8ClampedArray(env.data.get(sprite).bytes);
  assert.equal(env.stats.maps,1);for(const key of['reads','creates','arrays','images','puts','sets','gets'])assert.equal(env.stats[key],0,'import is inert: '+key);
  const originalKeys=Object.keys(sprite),left=record018(api,20,71,72,1520,216,.75),right=record018(api,71,20,72,1520,216,.75);
  assertCall018(left,1,1520,216,.75);assertCall018(right,2,1520,216,.75);
  const copies=[left.calls[0][0],right.calls[0][0]];assert.notEqual(copies[0],copies[1]);
  let byteChecks=0;
  for(let side=1;side<=2;side++){
    const bytes=env.data.get(copies[side-1]).bytes;
    for(let y=0;y<56;y++)for(let x=0;x<64;x++)for(let channel=0;channel<4;channel++){
      const i=(y*64+x)*4+channel,keep=side===1?x<32:x>=32;assert.equal(bytes[i],keep?canonical[i]:0,'exact synthetic RGBA at side/x/y/channel '+[side,x,y,channel]);byteChecks++;
    }
  }
  assert.deepEqual(env.data.get(sprite).bytes,canonical);assert.deepEqual(Object.keys(sprite),originalKeys,'no source registration/properties');
  for(const {result,expected}of env.readBuffers)assert.deepEqual(result.data,expected,'readback bytes never mutated');
  const warmed=env.snapshot();
  for(let i=0;i<1000;i++)for(const[vx,vy,index]of[[20,71,0],[71,20,1]]){
    const q=record018(api,vx,vy,72,i/3,-i/7,.75+(i%4));assert.equal(q.calls[0][0],copies[index],'same copy reused across frames, anchors and zooms');
  }
  for(const key of['maps','reads','creates','contexts','arrays','images','puts','sets'])assert.equal(env.stats[key],warmed[key],'no warm allocations/readback: '+key);
  const replacement=env.makeSprite(113),replacementBytes=new Uint8ClampedArray(env.data.get(replacement).bytes);
  const newLeft=record018(api,20,71,72,1,2,1,false,replacement),newRight=record018(api,71,20,72,1,2,1,false,replacement);
  assert.notEqual(newLeft.calls[0][0],copies[0]);assert.notEqual(newRight.calls[0][0],copies[1]);assert.equal(env.stats.reads,2);assert.equal(env.stats.creates,4);
  for(let side=1;side<=2;side++){
    const bytes=env.data.get((side===1?newLeft:newRight).calls[0][0]).bytes;
    for(let y=0;y<56;y++)for(let x=0;x<64;x++)for(let channel=0;channel<4;channel++){const i=(y*64+x)*4+channel;assert.equal(bytes[i],(side===1?x<32:x>=32)?replacementBytes[i]:0);byteChecks++;}
  }
  assert.equal(record018(api,20,71,72,1,2,1).calls[0][0],copies[0],'separate live canonical identities retain their own pair');
  assert.deepEqual(env.data.get(sprite).bytes,canonical);assert.deepEqual(env.data.get(replacement).bytes,replacementBytes);
  return{syntheticByteChecks:byteChecks,canonicalReadbackImmutable:true,warmDraws:2000,warmAllocations:0,weakIdentityCache:true,recreatedCanonicalRebuilds:true,copiesPerCanonical:2,copyBackingBytesPerCanonical:64*56*4*2};
}
function stateControls018(source){
  let cases=0;
  for(const failAt of['document','source-context','source-context-null','read','bad-width','bad-height','bad-data','create','copy-context','copy-context-null','array','image','put','second-put','cache']){
    const api=isolatedAPI018(source,false,{failAt}),env=environments018.get(api),q=context018();
    assert.throws(()=>api.drawMapEdge018(q.ctx,env.defaultSprite,20,71,72,1,2,.75,false));assert.deepEqual(q.calls,[],'failed copy must not draw fallback');
    if(['source-context','source-context-null','read','bad-width','bad-height','bad-data'].includes(failAt))assert.equal(env.stats.creates,0,'reject invalid/unreadable canonical data before allocation');
    env.setFailure(null);
    const recovered=record018(api,20,71,72,1,2,.75),right=record018(api,71,20,72,1,2,.75);assertCall018(recovered,1,1,2,.75);assertCall018(right,2,1,2,.75);
    assert.equal(env.data.get(recovered.calls[0][0]).written,true);cases++;
  }
  const api=isolatedAPI018(source,false),env=environments018.get(api);
  for(const[width,height]of[[63,56],[64,55],[0,0],[128,112]]){
    const before=env.snapshot(),q=context018();assert.throws(()=>api.drawMapEdge018(q.ctx,env.makeSprite(7,width,height),20,71,72,1,2,1,false));assert.equal(q.calls.length,0);assert.equal(env.stats.reads,before.reads);assert.equal(env.stats.creates,before.creates);cases++;
  }
  const noDocument=isolatedAPI018(source,false,{failAt:'document'}),noEnv=environments018.get(noDocument);assert.equal(noDocument.selftest018().ok,true);
  const poison=new Proxy({},{get(){throw Error('legacy/corner must not inspect sprite');}});
  for(const[vx,vy,sprite,legacy]of[[20,20,poison,false],[20,71,null,false],[71,20,undefined,false],[71,71,false,false],[71,71,poison,false],[20,71,poison,true],[71,20,poison,true]]){
    const q=record018(noDocument,vx,vy,72,1,2,.75,legacy,sprite);assertCall018(q,noDocument.mapEdgeMask018(vx,vy,72),1,2,.75,legacy);cases++;
  }
  assert.equal(noEnv.stats.creates,0);assert.equal(noEnv.stats.gets,0);
  for(const[vx,vy,legacy]of[[20,71,false],[71,20,false],[71,71,false],[20,71,true]]){
    const q=context018(true);assert.throws(()=>api.drawMapEdge018(q.ctx,env.defaultSprite,vx,vy,72,1,2,.75,legacy),error=>error===q.failure);assert.deepEqual(q.events,['drawImage']);cases++;
  }
  const before=env.snapshot();record018(api,20,71,72,1,2,.75);assert.equal(env.stats.creates,before.creates,'draw error leaves valid completed cache reusable');
  return{cases,destinationContextDrawOnly:true,errorsPropagate:true,noUnmaskedFallback:true,failedBuildRetryable:true,noPartialCache:true};
}
function mutationControls018(source){
  const mutations=[
    ['wrong view axis','(vy===n-1?1:0)|(vx===n-1?2:0)','(vx===n-1?1:0)|(vy===n-1?2:0)'],
    ['hide left wall','(vy===n-1?1:0)','0'],
    ['hide right wall','(vx===n-1?2:0)','0'],
    ['hide corner','if(!sprite||!mask)','if(!sprite||!mask||mask===3)'],
    ['old full wrong half','legacyDisabledFlag||mask===3','true'],
    ['resample cropped source','sprite,sx,sy,64*z,56*z','sprite,0,0,32,56,sx,sy,32*z,56*z'],
    ['shift copied anchor','[mask-1],sx,sy','[mask-1],sx+1,sy'],
    ['shrink copied transform','[mask-1],sx,sy,64*z','[mask-1],sx,sy,32*z'],
    ['wrong copy index','[mask-1]','[2-mask]'],
    ['reverse retained half','side===1?x>=32:x<32','side===1?x<32:x>=32'],
    ['retain unwanted column','side===1?x>=32:x<32','side===1?x>32:x<31'],
    ['erase retained column','side===1?x>=32:x<32','side===1?x>=31:x<33'],
    ['change retained colors','new Uint8ClampedArray(source.data)','new Uint8ClampedArray(source.data).fill(9)'],
    ['alias source readback','new Uint8ClampedArray(source.data)','source.data'],
    ['zero alpha only','bytes.fill(0,(y*64+x)*4,(y*64+x)*4+4)','bytes.fill(0,(y*64+x)*4+3,(y*64+x)*4+4)'],
    ['leave last row','y<56;y++','y<55;y++'],
    ['leave last column','x<64;x++','x<63;x++'],
    ['crop copy width','image.width=64','image.width=32'],
    ['crop copy height','image.height=56','image.height=55'],
    ['shift readback','getImageData(0,0,64,56)','getImageData(1,0,64,56)'],
    ['crop readback','getImageData(0,0,64,56)','getImageData(0,0,32,56)'],
    ['shift copied bytes','),0,0);','),1,0);'],
    ['wrong image width','new ImageData(bytes,64,56)','new ImageData(bytes,32,56)'],
    ['skip copy upload','context.putImageData(new ImageData(bytes,64,56),0,0);',''],
    ['strong source cache','new WeakMap()','new Map()'],
    ['no cache reuse','if(halves)return halves;',''],
    ['no cache publication','mapEdgeCopies018.set(sprite,halves);',''],
    ['key cache by copy','mapEdgeCopies018.set(sprite,halves)','mapEdgeCopies018.set(halves[0],halves)'],
    ['single incomplete copy','side<=2;side++','side<=1;side++'],
    ['three copies','side<=2;side++','side<=3;side++'],
    ['remove width validation','sprite.width!==64||sprite.height!==56','sprite.height!==56'],
    ['remove height validation','sprite.width!==64||sprite.height!==56','sprite.width!==64'],
    ['remove byte validation','||source.data.length!==64*56*4',''],
    ['paint interior','if(!sprite||!mask)','if(!sprite)'],
    ['lose old fallback','legacyDisabledFlag||mask===3','mask===3'],
    ['incorrectly enable fallback','legacyDisabledFlag||mask===3','!legacyDisabledFlag||mask===3'],
    ['add terrain overlay','if(!sprite||!mask)return mask;','if(!sprite||!mask)return mask;ctx.fillRect(sx,sy,64*z,56*z);'],
    ['mutate current path','if(!sprite||!mask)return mask;','if(!sprite||!mask)return mask;ctx.beginPath();'],
    ['mutate current transform','if(!sprite||!mask)return mask;','if(!sprite||!mask)return mask;ctx.setTransform(1,0,0,1,0,0);'],
    ['register copy','halves.push(image);','halves.push(image);SPR.cliffLeft=image;'],
    ['introduce RNG','const mask=mapEdgeMask018(vx,vy,n);','const mask=mapEdgeMask018(vx,vy,n);Math.random();'],
    ['introduce storage','const mask=mapEdgeMask018(vx,vy,n);',"const mask=mapEdgeMask018(vx,vy,n);localStorage.setItem('tile','0');"],
    ['introduce network','const mask=mapEdgeMask018(vx,vy,n);',"const mask=mapEdgeMask018(vx,vy,n);fetch('/terrain');"],
    ['allocate each draw','const mask=mapEdgeMask018(vx,vy,n);','const mask=mapEdgeMask018(vx,vy,n);const unwanted=[];']
  ];
  const rejected=[];
  for(const[name,from,to]of mutations){
    assert.ok(source.includes(from),'mutation target exists: '+name);
    const mutant=source.replace(from,to);
    assert.throws(()=>{helperSourceGuard018(mutant);const api=isolatedAPI018(mutant,false);drawControls018(api,false);geometryProof018(api);samplingProof018(api);copyControls018(mutant);stateControls018(mutant);},undefined,'must reject '+name);
    rejected.push(name);
  }
  return rejected;
}
function staticTest018(){
  const source=fs.readFileSync(path.join(ROOT,'mapedge-render018.js'),'utf8');
  const sourceProof=sourceProof018();helperSourceGuard018(source);
  assert.deepEqual(Object.keys(render).sort(),['drawMapEdge018','mapEdgeMask018','selftest018']);assert.ok(Object.isFrozen(render));
  assert.deepEqual(render.selftest018(),{ok:true,cases:7,canvasExecuted:false});
  const api=isolatedAPI018(source,false),cases=drawControls018(api),geometry=geometryProof018(api),sampling=samplingProof018(api),copy=copyControls018(source),state=stateControls018(source);
  let browserCases=0;
  for(const browser of[false,true]){const api=isolatedAPI018(source,browser);assert.ok(Object.isFrozen(api));assert.equal(api.selftest018().ok,true);browserCases+=drawControls018(api,false);geometryProof018(api);samplingProof018(api);stateControls018(source);}
  const rejected=mutationControls018(source);
  return{ok:true,sourceOnly:true,gameExecuted:false,painterExecuted:false,canvasExecuted:false,pixelsExecuted:false,helperSHA256:hash(source),cases,browserAndNodeExportCases:browserCases,sourceProof,geometry,sampling,copy,state,rejected};
}
module.exports={staticTest018,sourceProof018,helperSourceGuard018,drawControls018,geometryProof018,samplingProof018,copyControls018,stateControls018,mutationControls018,PINS};
if(require.main===module){if(process.argv.length>3||process.argv.length===3&&process.argv[2]!=='--static-test')throw Error('Use --static-test or no arguments; source/draw-call tests only');console.log(JSON.stringify(staticTest018(),null,2));}
