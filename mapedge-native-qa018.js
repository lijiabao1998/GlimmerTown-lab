'use strict';
// Browser observers are serialized only by the isolated Actions runner.
// Requiring this file in Node performs no browser, game, painter or pixel work.
function mapedgeView018(x,y,rotation,n=72){return rotation===0?[x,y]:rotation===1?[n-1-y,x]:rotation===2?[n-1-x,n-1-y]:[y,n-1-x];}
function mapedgeExpectedCall018(vx,vy,n,sx,sy,z,legacy){
 return vx===n-1||vy===n-1?[sx,sy,64*z,56*z]:null;
}
function mapedgeExpectedClip018(vx,vy,n,sx,sy,z,legacy){
 const left=vy===n-1,right=vx===n-1;if(legacy||left&&right||!left&&!right)return null;
 return [sx+(left?0:32*z),sy,32*z,56*z];
}
function mapedgeDiff018(a,b,width,allowed){
 if(a.length!==b.length||a.length%4||allowed&&allowed.length!==a.length)throw Error('Complete same-size RGBA arrays required');
 let changed=0,outside=0;const samples=[],bounds=[width,a.length/4/width,-1,-1];
 for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]||a[i+3]!==b[i+3]){const p=i/4,x=p%width,y=Math.floor(p/width);changed++;if(allowed&&!allowed[i+3])outside++;bounds[0]=Math.min(bounds[0],x);bounds[1]=Math.min(bounds[1],y);bounds[2]=Math.max(bounds[2],x);bounds[3]=Math.max(bounds[3],y);if(samples.length<12)samples.push({x,y,before:Array.from(a.slice(i,i+4)),after:Array.from(b.slice(i,i+4)),allowed:!allowed||!!allowed[i+3]});}
 return{changed,outside,bounds:changed?bounds:null,samples};
}
function mapedgeValidPair018(q){
 return !!q&&q.width===1600&&q.height===1080&&[0,1,2,3].includes(q.rotation)&&[.75,1,1.6,2].includes(q.zoom)&&q.observerPassThrough===true&&q.sourceExact===true&&q.canonicalCliffExact===true&&q.worldExact===true&&q.storageExact===true&&q.randomCalls===0&&q.canonical===true&&q.frames?.length===4&&q.frames.every((f,n)=>f.legacy===(n%2===0)&&f.callsExact&&f.copiesExact===true&&f.calls>0&&f.cacheObserved&&f.terrainExact===true)&&q.cacheReused===true&&q.copyRecords?.length>0&&q.copyRecords.length<=2&&q.copyRecords.every(r=>[1,2].includes(r.mask)&&r.width===64&&r.height===56&&r.rawRGBAExact&&r.canonicalUnchanged)&&q.ground?.outside===0&&q.restoredLegacy?.changed===0&&q.repeatedFixed?.changed===0&&q.full?.outside===0&&q.preservedOutward>0&&q.changedOutward===0;
}
function mapedgePairImages018(capture,result,pngs){
 // Retain the same two native encodings for every rejected comparison. Passing
 // unrequested comparisons discard them without adding canvases or RGBA copies.
 return capture||!mapedgeValidPair018(result)?pngs:[];
}
function mapedgeValidFixtures018(q){
 return !!q&&q.kind==='isolated canonical-sprite geometry fixtures, not native game screenshots'&&q.sourceExact&&q.worldExact&&q.storageExact&&q.canonicalCliffExact&&q.randomCalls===0&&q.rows?.length===96&&new Set(q.rows.map(r=>[r.zoom,r.material,r.height,r.mask].join('|'))).size===96&&q.rows.every(r=>[.75,1,1.6,2].includes(r.zoom)&&['grass','sand','water','mixed'].includes(r.material)&&[0,13].includes(r.height)&&[1,2,3].includes(r.mask)&&r.expectedOpaque>0&&r.pixelMismatch===0&&r.outwardMissing===0&&r.inwardOpaque===0&&r.originalRetainedPixels>0&&r.originalRetainedMismatch===0&&r.negatives?.length===6&&r.negatives.every(n=>n.mismatch>0))&&new Set(q.rows.map(r=>r.zoom)).size===4&&new Set(q.rows.map(r=>r.material)).size===4&&new Set(q.rows.map(r=>r.height)).size===2&&new Set(q.rows.map(r=>r.mask)).size===3&&q.samplingProbe?.actualMismatch===0&&q.samplingProbe.outwardMissing===0&&q.samplingProbe.inwardOpaque===0&&q.samplingProbe.originalRetainedPixels>0&&q.samplingProbe.originalRetainedMismatch===0&&q.samplingProbe.croppedRegressionMismatch>0&&q.samplingProbe.croppedRetainedMismatch>0&&q.samplingProbe.clippedRegressionMismatch>0&&q.samplingProbe.clippedRetainedMismatch>0&&q.samplingProbe.zoom===.75&&q.samplingProbe.width===1600&&q.samplingProbe.height===1080&&JSON.stringify(q.samplingProbe.anchor)==='[1520,216]'&&q.copyCacheProof?.rawBytesPerPair===28672&&['canonicalSourceImmutable','cloneSourceExact','sourceRecreatedSeparates','repeatedSourceReuses','halvesDistinct','fullSizeAndOriginalArgs','copyRawRGBAExact','cornerOriginal'].every(k=>q.copyCacheProof[k]===true);
}
function mapedgeCopyMask018(original,pixels){
 if(original.length!==64*56*4||pixels.length!==original.length)return 0;
 let left=true,right=true;
 for(let i=0;i<pixels.length;i++){const x=(i>>2)%64;if(pixels[i]!==((x<32)?original[i]:0))left=false;if(pixels[i]!==((x>=32)?original[i]:0))right=false;}
 return left&&!right?1:right&&!left?2:0;
}
function mapedgeNativePair018(options,expectedSources){
 const {rotation,zoom,night,weather=null,focus,focusLabel,capture=false}=options;
 const A=window.MapEdgeRepair018,C=window.__complexQA014,F=window.__waterfrontFns018,game=document.getElementById('game'),SPR=GV.art574.SPR();
 if(!A||!C||!F||!SPR.cliff)throw Error('Native map-edge prerequisites missing');
 const sourceExact=A.mapEdgeMask018.toString()===expectedSources.mask&&A.drawMapEdge018.toString()===expectedSources.draw;
 if(!sourceExact)throw Error('Installed map-edge helper differs from exact source under test');
 const scene=F.waterfrontScene018(rotation,night,zoom,weather,focus);delete scene.png;
 const camera=GV.lookAt(...focus),width=game.width,height=game.height,n=C.N,ox=Math.round(width/2-camera[0]*zoom),oy=Math.round(height/2-camera[1]*zoom),pad=560*zoom;
 const tiles=[],callsExpected=[];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const[vx,vy]=mapedgeView018(x,y,rotation,n),sx=ox+((vx-vy)*32-32)*zoom,sy=oy+(vx+vy)*16*zoom;
  if(sx<=-pad||sx>=width+pad||sy<=-pad||sy>=height+pad||vx!==n-1&&vy!==n-1)continue;
  const t=GV.tile(x,y),mask=(vy===n-1?1:0)|(vx===n-1?2:0);tiles.push({x,y,vx,vy,sx,sy,mask,terrain:t.t,height:t.el||0});callsExpected.push(mapedgeExpectedCall018(vx,vy,n,sx,sy,zoom,true));
 }
 const make=()=>{const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g];};
 const[allowed,ag]=make(),[outward,og]=make();
 for(const t of tiles){
  if(t.mask!==3){ag.fillStyle='#fff';ag.fillRect(t.sx+(t.mask===1?32:0)*zoom,t.sy,32*zoom,56*zoom);}
  // Authority is the untouched full original sprite. Allowed inward regions
  // are excluded separately, without any clipped or source-cropped oracle.
  og.drawImage(SPR.cliff,t.sx,t.sy,64*zoom,56*zoom);
 }
 const allowedPixels=ag.getImageData(0,0,width,height).data,outwardPixels=og.getImageData(0,0,width,height).data,cliffPixels=SPR.cliff.getContext('2d').getImageData(0,0,64,56).data;
 const world=C.world(),storage=JSON.stringify(C.storage()),cliffPNG=SPR.cliff.toDataURL(),flagHad=Object.hasOwn(window,'__noMapEdgeFix018'),flagValue=window.__noMapEdgeFix018,waterHad=Object.hasOwn(window,'__waterF695'),waterValue=window.__waterF695,originalDraw=CanvasRenderingContext2D.prototype.drawImage,random=Math.random;
 const frames=[],full=[],ground=[],pngs=[],sourceFrames=[],observedCopies=new Map();let current=null,randomCalls=0,groundContext=null;
 try{
  window.__waterF695=0;Math.random=function(){randomCalls++;return random.apply(this,arguments);};
  CanvasRenderingContext2D.prototype.drawImage=function(image){
   if(current){
    let mask=image===SPR.cliff?3:0;
    if(!mask&&this===groundContext&&image?.width===64&&image?.height===56&&typeof image.getContext==='function'){
     if(!observedCopies.has(image))observedCopies.set(image,mapedgeCopyMask018(cliffPixels,image.getContext('2d').getImageData(0,0,64,56).data));
     mask=observedCopies.get(image);
    }
    if(mask){
     if(groundContext&&groundContext!==this)throw Error('Boundary pixels drawn into another production context');groundContext=this;
     current.calls.push(Array.from(arguments).slice(1));current.masks.push(mask);current.sources.push(image);current.context=this;
    }
   }
   return originalDraw.apply(this,arguments);
  };
  for(const legacy of[true,false,true,false]){
   current={calls:[],masks:[],sources:[],context:null};window.__noMapEdgeFix018=legacy;GV.forceDraw();
   const calls=current.calls,g=current.context;if(!g||g.canvas.width!==width||g.canvas.height!==height)throw Error('Flag alone did not invalidate and repaint the native ground cache');
   ground.push(g.getImageData(0,0,width,height).data);full.push(game.getContext('2d').getImageData(0,0,width,height).data);
   if(frames.length<2)pngs.push({phase:legacy?'before':'after',png:game.toDataURL('image/png')});
   const terrainChanges=[];for(const t of tiles){const now=GV.tile(t.x,t.y);if(now.t!==t.terrain||(now.el||0)!==t.height)terrainChanges.push({x:t.x,y:t.y,before:{terrain:t.terrain,height:t.height},after:{terrain:now.t,height:now.el||0}});}
   const expectedMasks=tiles.map(t=>legacy?3:t.mask);sourceFrames.push(current.sources);
   frames.push({legacy,calls:calls.length,callsExact:JSON.stringify(calls)===JSON.stringify(callsExpected),copiesExact:JSON.stringify(current.masks)===JSON.stringify(expectedMasks),sourceMasks:current.masks,cacheObserved:true,actualCalls:calls,terrainExact:terrainChanges.length===0,terrainChanges});current=null;
  }
 }finally{CanvasRenderingContext2D.prototype.drawImage=originalDraw;Math.random=random;if(flagHad)window.__noMapEdgeFix018=flagValue;else delete window.__noMapEdgeFix018;if(waterHad)window.__waterF695=waterValue;else delete window.__waterF695;}
 const copyRecords=Array.from(observedCopies,([image,mask])=>({mask,width:image.width,height:image.height,rawRGBAExact:mask===mapedgeCopyMask018(cliffPixels,image.getContext('2d').getImageData(0,0,64,56).data),canonicalUnchanged:image!==SPR.cliff})).filter(q=>q.mask!==0);
 const cacheReused=sourceFrames[1].length===sourceFrames[3].length&&sourceFrames[1].every((image,i)=>image===sourceFrames[3][i])&&[1,2].every(mask=>{const seen=sourceFrames[1].filter((image,i)=>tiles[i]?.mask===mask);return !seen.length||seen.every(image=>image===seen[0]);});
 const difference=mapedgeDiff018(ground[0],ground[1],width,allowedPixels),fullDifference=mapedgeDiff018(full[0],full[1],width,allowedPixels);
 let preservedOutward=0,changedOutward=0,recoveredGreen=0;const grassWitnesses=[];
 for(let i=0;i<ground[0].length;i+=4){
  if(outwardPixels[i+3]&&!allowedPixels[i+3]){preservedOutward++;if(ground[0][i]!==ground[1][i]||ground[0][i+1]!==ground[1][i+1]||ground[0][i+2]!==ground[1][i+2]||ground[0][i+3]!==ground[1][i+3])changedOutward++;}
  if(allowedPixels[i+3]){const b=ground[0],a=ground[1],soil=b[i]>b[i+1]*1.15&&b[i+1]>b[i+2]*1.15,green=a[i+1]>a[i]*1.15&&a[i+1]>a[i+2]*1.15;if(soil&&green){recoveredGreen++;if(grassWitnesses.length<12)grassWitnesses.push({x:(i/4)%width,y:Math.floor(i/4/width),before:Array.from(b.slice(i,i+4)),after:Array.from(a.slice(i,i+4))});}}
 }
 const result={kind:'actual native production full-canvas comparison after real cold Continue',...options,width,height,day:GV.stats().day,camera,scene,sourceExact,observerPassThrough:CanvasRenderingContext2D.prototype.drawImage===originalDraw,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage()),canonicalCliffExact:SPR.cliff.toDataURL()===cliffPNG,canonical:F.waterfrontCanonical018(),randomCalls,tiles,frames,copyRecords,cacheReused,ground:difference,full:fullDifference,restoredLegacy:mapedgeDiff018(ground[0],ground[2],width),repeatedFixed:mapedgeDiff018(ground[1],ground[3],width),fullRestoredLegacy:mapedgeDiff018(full[0],full[2],width),fullRepeatedFixed:mapedgeDiff018(full[1],full[3],width),preservedOutward,changedOutward,recoveredGreen,grassWitnesses,pngs,limitations:['Diagnostic pass-through wrappers observe drawImage only, forward unchanged arguments and restore the original method in finally. No product source, API or compositor is replaced.','Every actual derived source is verified as complete64x56 canonical RGBA with only its inward half zeroed; repeated native draws must reuse the same objects.','Production ground cache is compared in full RGBA; full game screenshots include untouched native live layers.','Filled removed-half rectangles are conservative bounds, not overlays in the game.','Original image10 focus66.5/65 is retained exactly; native camLookWorld truncates tile arguments.']};
 result.pngs=mapedgePairImages018(capture,result,pngs);return result;
}
function mapedgeBoundarySurvey018(rotation){
 const C=window.__complexQA014,world=C.world(),storage=JSON.stringify(C.storage()),rows=[];
 for(let y=0;y<C.N;y++)for(let x=0;x<C.N;x++){const[vx,vy]=mapedgeView018(x,y,rotation,C.N);if(vx!==C.N-1&&vy!==C.N-1)continue;const t=GV.tile(x,y);rows.push({x,y,vx,vy,height:t.el||0,terrain:t.t});}
 const heights=[...new Set(rows.map(r=>r.height))].sort((a,b)=>a-b),elevated=rows.find(r=>r.height>0);
 return{rotation,rows,heights,genuinelyVariedBoundary:heights.length>1,elevatedFocus:elevated?[Math.max(2,Math.min(C.N-3,elevated.x)),Math.max(2,Math.min(C.N-3,elevated.y))]:null,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage())};
}
function mapedgeNativeFixtures018(rotation,expectedSources){
 const A=window.MapEdgeRepair018,C=window.__complexQA014,SPR=GV.art574.SPR(),cliff=SPR.cliff,world=C.world(),storage=JSON.stringify(C.storage()),cliffPNG=cliff.toDataURL(),random=Math.random;let randomCalls=0;const rows=[];
 const sourceExact=A.mapEdgeMask018.toString()===expectedSources.mask&&A.drawMapEdge018.toString()===expectedSources.draw;
 const make=(w=192,h=160)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g];};
 const read=c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
 const materialSprite=(material,n)=>material==='sand'?SPR.sand:material==='water'?SPR.water[0]:material==='mixed'?[SPR.grass[0],SPR.sand,SPR.water[0]][n%3]:SPR.grass[0];
 const[mutated,mg]=make(64,56);mg.drawImage(cliff,0,0);const mutation=mg.getImageData(0,0,64,56);for(let i=0;i<mutation.data.length;i+=4)if(mutation.data[i+3])mutation.data[i]^=128;mg.putImageData(mutation,0,0);
 // Independent source oracle: begin with transparent64x56 ImageData and
 // copy only retained canonical texels, rather than clone-and-zero as product
 // does. Retained native RGBA is also compared directly to original full draw.
 const originalPixels=cliff.getContext('2d').getImageData(0,0,64,56).data,references={};
 for(const side of[1,2]){const[c,g]=make(64,56),data=g.createImageData(64,56);for(let y=0;y<56;y++)for(let x=side===1?0:32;x<(side===1?32:64);x++)for(let k=0;k<4;k++){const i=(y*64+x)*4+k;data.data[i]=originalPixels[i];}g.putImageData(data,0,0);references[side]=c;}
 const captureSource=(sprite,mask)=>{let got;A.drawMapEdge018({drawImage(image,...args){got={image,args};}},sprite,mask&2?71:70,mask&1?71:70,72,0,0,1,false);return got;};
 const cacheProof=()=>{
 const first=[captureSource(cliff,1),captureSource(cliff,2)],again=[captureSource(cliff,1),captureSource(cliff,2)],[clone,cloneCtx]=make(64,56);cloneCtx.putImageData(cliff.getContext('2d').getImageData(0,0,64,56),0,0);
 const recreated=[captureSource(clone,1),captureSource(clone,2)],recreatedAgain=[captureSource(clone,1),captureSource(clone,2)];
 const copyCacheProof={rawBytesPerPair:64*56*4*2,canonicalSourceImmutable:cliff.toDataURL()===cliffPNG,cloneSourceExact:mapedgeDiff018(originalPixels,read(clone),64).changed===0,sourceRecreatedSeparates:first.every((q,i)=>q.image!==recreated[i].image),repeatedSourceReuses:first.every((q,i)=>q.image===again[i].image)&&recreated.every((q,i)=>q.image===recreatedAgain[i].image),halvesDistinct:first[0].image!==first[1].image&&recreated[0].image!==recreated[1].image,fullSizeAndOriginalArgs:[...first,...recreated].every(q=>q.image.width===64&&q.image.height===56&&JSON.stringify(q.args)==='[0,0,64,56]'),copyRawRGBAExact:[...first,...recreated].every((q,i)=>mapedgeCopyMask018(originalPixels,read(q.image))===i%2+1),cornerOriginal:captureSource(cliff,3).image===cliff,weakLifetimeScope:'Source lifetime is guarded structurally by the private WeakMap and its allocation tests; this observation does not claim garbage collection occurred.'};
 return copyCacheProof;
 };
 const oracle=(vx,vy,sx,sy,z,w=192,h=160)=>{
  const[full,fg]=make(w,h),[expected,eg]=make(w,h),[mask,maskG]=make(w,h),rect=mapedgeExpectedClip018(vx,vy,72,sx,sy,z,false),side=(vy===71?1:0)|(vx===71?2:0);
  fg.drawImage(cliff,sx,sy,64*z,56*z);eg.drawImage(side===3?cliff:references[side],sx,sy,64*z,56*z);
  maskG.fillStyle='#fff';if(rect)maskG.fillRect(...rect);else maskG.fillRect(0,0,w,h);
  return{full,expected,mask,fullPixels:read(full),expectedPixels:read(expected),maskPixels:read(mask)};
 };
 const retained=(o,pixels)=>{let expectedOpaque=0,outwardMissing=0,inwardOpaque=0,originalRetainedPixels=0,originalRetainedMismatch=0,fringePixels=0;
  const same=(a,b,i)=>a[i]===b[i]&&a[i+1]===b[i+1]&&a[i+2]===b[i+2]&&a[i+3]===b[i+3];
  for(let i=0;i<pixels.length;i+=4){
   if(o.expectedPixels[i+3]){expectedOpaque++;if(!same(o.expectedPixels,pixels,i))outwardMissing++;}else if(pixels[i+3])inwardOpaque++;
   if(o.maskPixels[i+3]===255&&o.fullPixels[i+3]){originalRetainedPixels++;if(!same(o.fullPixels,pixels,i))originalRetainedMismatch++;}
   if(o.maskPixels[i+3]>0&&o.maskPixels[i+3]<255&&o.fullPixels[i+3])fringePixels++;
  }return{expectedOpaque,outwardMissing,inwardOpaque,originalRetainedPixels,originalRetainedMismatch,fringePixels};
 };
 let samplingProbe,copyCacheProof;
 try{Math.random=function(){randomCalls++;throw Error('Boundary geometry must not consume RNG');};copyCacheProof=cacheProof();
  for(const zoom of[.75,1,1.6,2])for(const material of['grass','sand','water','mixed'])for(const height of[0,13])for(const mask of[1,2,3]){
   const vx=mask&2?71:70,vy=mask&1?71:70,sx=24,sy=20-height,o=oracle(vx,vy,sx,sy,zoom),[actual,g]=make();
   A.drawMapEdge018(g,cliff,vx,vy,72,sx,sy,zoom,false);const preservation=retained(o,read(actual)),eg=o.expected.getContext('2d');
   for(let n=0;n<3;n++){const base=materialSprite(material,n),bx=sx+(n-1)*32*zoom,by=sy-(n%2?16:32)*zoom-(height&&n===1?7:0);eg.drawImage(base,bx,by,64*zoom,32*zoom);g.drawImage(base,bx,by,64*zoom,32*zoom);}
   const negatives=[];for(const fault of['wrong-axis','hidden-face','changed-height','solid-cover','old-full-face','source-mutation']){
    const[c,cg]=make();
    if(fault==='wrong-axis'){const wrong=mask===3?1:mask===1?2:1;A.drawMapEdge018(cg,cliff,wrong&2?71:70,wrong&1?71:70,72,sx,sy,zoom,false);}
    else if(fault==='changed-height')A.drawMapEdge018(cg,cliff,vx,vy,72,sx,sy+5,zoom,false);
    else if(fault==='solid-cover'){cg.fillStyle='#6d4d31';cg.fillRect(sx,sy,64*zoom,56*zoom);}
    else if(fault==='old-full-face')cg.drawImage(cliff,sx+(mask===3?2:0),sy,64*zoom,56*zoom);
    else if(fault==='source-mutation')A.drawMapEdge018(cg,mutated,vx,vy,72,sx,sy,zoom,false);
    negatives.push({fault:mask===3&&fault==='old-full-face'?'corner-anchor-shift':fault,mismatch:mapedgeDiff018(o.expectedPixels,read(c),192).changed});
   }
   rows.push({rotation,zoom,material,height,mask,...preservation,pixelMismatch:mapedgeDiff018(read(o.expected),read(actual),192).changed,negatives});
  }
  // Source-pinned failed native coordinate. At z=.75 the old 9-arg crop changed
  // nearest-neighbor tie sampling here, despite nominally equal source scales.
  const sx=1520,sy=216,z=.75,o=oracle(71,40,sx,sy,z,1600,1080),[actual,g]=make(1600,1080),[cropped,cg]=make(1600,1080),[clipped,clipG]=make(1600,1080);
  A.drawMapEdge018(g,cliff,71,40,72,sx,sy,z,false);cg.drawImage(cliff,32,0,32,56,sx+32*z,sy,32*z,56*z);const oldClip=new Path2D();oldClip.rect(sx+32*z,sy,32*z,56*z);clipG.save();clipG.clip(oldClip);clipG.drawImage(cliff,sx,sy,64*z,56*z);clipG.restore();
  samplingProbe={world:[40,0],view:[71,40],anchor:[sx,sy],zoom:z,width:1600,height:1080,...retained(o,read(actual)),actualMismatch:mapedgeDiff018(o.expectedPixels,read(actual),1600).changed,croppedRegressionMismatch:mapedgeDiff018(o.expectedPixels,read(cropped),1600).changed,croppedRetainedMismatch:retained(o,read(cropped)).originalRetainedMismatch,clippedRegressionMismatch:mapedgeDiff018(o.expectedPixels,read(clipped),1600).changed,clippedRetainedMismatch:retained(o,read(clipped)).originalRetainedMismatch,reference:'Independent retained source-texel copy at unchanged64x56 size and full-call transform; retained interior RGBA additionally compared to untouched original full-call pixels'};
 }finally{Math.random=random;}
 return{kind:'isolated canonical-sprite geometry fixtures, not native game screenshots',rotation,sourceExact,rows,samplingProbe,copyCacheProof,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage()),canonicalCliffExact:cliff.toDataURL()===cliffPNG,randomCalls,limitations:['Height variation is an explicit scratch-canvas anchor test. The unchanged production ground anchor does not depend on saved tile.el.','No fixture is loaded into the game or substituted for the two real cold Continue cycles.','Oracle copies selected canonical source texels into an independently blank64x56 canvas. It does not use the product copy cache, destination clipping or cropped sampling. Original full-call pixels remain a separate retained-interior authority.']};
}
const functions018=[mapedgeView018,mapedgeExpectedCall018,mapedgeExpectedClip018,mapedgeDiff018,mapedgeValidPair018,mapedgePairImages018,mapedgeCopyMask018,mapedgeNativePair018,mapedgeBoundarySurvey018,mapedgeNativeFixtures018];
module.exports={functions018,mapedgeView018,mapedgeExpectedCall018,mapedgeExpectedClip018,mapedgeDiff018,mapedgeValidPair018,mapedgePairImages018,mapedgeCopyMask018,mapedgeValidFixtures018};
