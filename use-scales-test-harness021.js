'use strict';
// Test-only copy of the real native page/harness. One closure export insertion;
// the candidate index, renderer, simulation and original harness stay unchanged.
const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),crypto=require('crypto');
const SOURCE=__dirname,sha=d=>crypto.createHash('sha256').update(d).digest('hex');
const EXPORT=`
/* GPT-021 TEST-ONLY INSPECTOR START */
if(window.__useScaleQA021===true){
 let trace021=false,traceRows021=[],imageMap021=new Map(),lastSize021=-1;
 const drawImage021=CanvasRenderingContext2D.prototype.drawImage;
 function refreshImages021(){if(typeof USE021_CACHE==='undefined'||USE021_CACHE.size===lastSize021)return;
  for(const s of USE021_CACHE.values()){imageMap021.set(s.img,{s,kind:'day'});if(s.night)imageMap021.set(s.night,{s,kind:'night'});}lastSize021=USE021_CACHE.size;}
 CanvasRenderingContext2D.prototype.drawImage=function(...args){
  if(trace021){refreshImages021();const a=imageMap021.get(args[0]);if(a){const m=this.getTransform();traceRows021.push({id:a.s.__art021.id,view:a.s.__art021.view,meta:{...a.s.__art021},kind:a.kind,args:args.slice(1),main:this.canvas===cvs,alpha:this.globalAlpha,matrix:[m.a,m.b,m.c,m.d,m.e,m.f]});}}
  return drawImage021.apply(this,args);
 };
 window.N021={
  tile:(x,y)=>tiles[idx(x,y)],state:()=>({running,visT,day,seed,money,diff,rankIdx,n:N,editor:editMode}),
  reflect:reflectSprite,fwLand:fw699LandSpr,fwOccl:fw699Occluders,top:spriteTop607,farmer:farmerPt637,
  phase:()=>visT,w2v,v2w,part:()=>part639(),nativeGet:getBlockSprite547,smoke:smokeViewSrc626,bubble:bubbleFor607,
  running:v=>{if(v!==undefined)running=!!v;return running;},
  frame:(dt=.016)=>draw(dt),
  trace:on=>{trace021=!!on;traceRows021=[];return trace021;},traceRows:()=>traceRows021.slice(),
  clearArtCache:()=>{if(typeof USE021_CACHE!=='undefined')USE021_CACHE.clear();imageMap021.clear();lastSize021=-1;},
  metrics:()=>({W,H,DPR,cam:{...cam},rot:viewRotEff()}),
  point:(x,y)=>{const p=w2v(x+.5,y+.5);return[(W/2+(p[0]-p[1])*32*cam.z-cam.x*cam.z)/DPR,(H/2+(p[0]+p[1])*16*cam.z-cam.y*cam.z)/DPR];},
  hide:()=>{hideInfo();hover.x=-1;hover.y=-1;selTile=null;},
  price:(id,x,y)=>placeCost(id,x,y),upCost,
  controls:()=>({sandbox:devState516B.sandbox,god:devGod516B(),overrides:{...devState516B.overrides}})
 };
}
/* GPT-021 TEST-ONLY INSPECTOR END */
`;
function makeHarness(html=fs.readFileSync(path.join(SOURCE,'index.html'),'utf8')){
 const anchor='Object.assign(window.GV,{art574:';
 if(html.split(anchor).length!==2)throw Error('Exactly one native art QA export anchor required');
 const inspected=html.replace(anchor,EXPORT+anchor);
 if(inspected.replace(EXPORT,'')!==html)throw Error('Inspector must reverse byte-exactly');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'use021-native-'));
 fs.writeFileSync(path.join(root,'index.html'),inspected);
 for(const file of['manifest.json','manifest.webmanifest','icon.svg','sw.js'])if(fs.existsSync(path.join(SOURCE,file)))fs.copyFileSync(path.join(SOURCE,file),path.join(root,file));
 const harness=fs.readFileSync(path.join(SOURCE,'harness.js'),'utf8'),holder={exports:{}};
 new vm.Script('(function(require,module,exports,__dirname,__filename){'+harness+'\n})',{filename:'use021-native-harness.generated.js'}).runInThisContext()(require,holder,holder.exports,root,path.join(SOURCE,'harness.js'));
 const proof={kind:'Actual native page plus test-only closure export; no replacement renderer',candidateSHA256:sha(html),inspectedSHA256:sha(inspected),inspectorSHA256:sha(EXPORT),originalHarnessSHA256:sha(harness),singleReversibleInsertion:true,temporaryRoot:root};
 return {...holder.exports,proof,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
module.exports={makeHarness};
