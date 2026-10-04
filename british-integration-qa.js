#!/usr/bin/env node
'use strict';
/* GPT-004 remote-CI-only integration evidence. No carrier sprite substitutions.
 * Run only in an authorized CI checkout; AGENTS.md prohibits local game execution.
 * Fresh Chromium profile, disposable slot 3, localhost port 8199. Baselines never rewritten.
 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(process.env.GV_QA_ROOT || __dirname);
const { withGame } = require(path.join(ROOT, 'harness.js'));
const OUT = path.join(ROOT, 'british-integration-evidence');
const TARGETS = [
  {id:'UKP01',k:219,tool:'britishTerrace',sz:2,x:8,y:14,w:136,h:150,ax:68,ay:148},
  {id:'UKP02',k:220,tool:'foxFinchPub',sz:2,x:14,y:14,w:136,h:150,ax:68,ay:148},
  {id:'UKP03',k:221,tool:'edwardianLibrary',sz:3,x:8,y:20,w:208,h:220,ax:104,ay:218},
];
const GAMEPLAY_GROUPS = [
  'unlock and rejection matrix',
  'placement transaction tree and inspector',
  'real construction and financial classification',
  'old-only commercial power precision baseline control',
  'all perimeter edge utility connectivity',
  'library capacity budget coverage symmetry and water loss',
  'save load age references old ID compatibility and normalization',
  'offline private buildings have no municipal upkeep',
  'library construction charges and fixed mature identity',
];
const BENCHMARKS = [{k:197,nm:'Existing corner pub',sz:2,x:14,y:20},{k:194,nm:'Existing galleried inn',sz:2,x:14,y:26},{k:198,nm:'Existing bookshop',sz:1,x:17,y:22}];
const sha = d => crypto.createHash('sha256').update(d).digest('hex');
const html = fs.readFileSync(path.join(ROOT,'index.html'));
const archivedArt = fs.readFileSync(path.join(ROOT,'british-prototypes-art.js'),'utf8');
const baselineText = fs.readFileSync(path.join(ROOT,'fp.json'),'utf8'), baseline = JSON.parse(baselineText);
const APPROVED_ART_SHA256 = '65f81745a1f9e6bda70cebd8fb31b8cce1e5278b24a02eb54802a0d6f8ee5780';
const workerStart=html.toString().indexOf('  function workers(){',html.toString().indexOf('let WK=null;'));
const workerEnd=html.toString().indexOf('\n  /* ---------- Layer A',workerStart);
const workerSource=html.toString().slice(workerStart,workerEnd).trim();
const APPROVED_WORKER_SHA256='5fe5dd3cda55b9b1601cd940b1a22287c6c9abb1e9b38cb4a855bf9cc7335584';
const checkedSHA = execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
for(const d of ['', 'full','crops','browser','assets','guards','logs'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
const report = {createdAt:new Date().toISOString(),checkedSHA,workflowSHA:process.env.GITHUB_SHA||null,
  workflowRun:process.env.GITHUB_RUN_ID?`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`:null,
  source:{htmlSHA256:sha(html),htmlBytes:html.length,archivedArtSHA256:sha(archivedArt),harnessSHA256:sha(fs.readFileSync(__filename)),baselineSHA256:sha(baselineText),legacyWorkerSourceSHA256:sha(workerSource)},
  fixture:{seed:5162026,slot:3,port:8199,targets:TARGETS,benchmarks:BENCHMARKS,rotations:[0,1,2,3],zooms:[1.2,2],description:'Ordinary catalog IDs and canonical post-boot assets in an existing seeded city, with controlled small placement patches. Camera rotations reuse the normal fixed-orientation square-building art; these are not four unique elevations.'},
  checks:[],failures:[],samples:[],town:[],weather:[],construction:[],occlusion:[],artifacts:[],limitations:[
    'This script was staged with syntax validation only; all browser and pixel results come from the exact-SHA remote CI run.',
    'World simulation RNG is private. Pure generation is checked for zero Math.random calls and unchanged observable world/storage/sprite state, not direct stream-state equality.',
    'Natural economy/placement/save behavior is tested separately by the product gameplay probe; these visual fixtures use the existing art574 QA planting API.',
    'Pixel masks and deterministic comparisons establish technical invariants; owner-facing visual quality still requires viewing the PNG evidence.',
    'Rain/snow use normal material layers with deterministic fixture weather accumulation. Device performance, touch UX and mobile hardware are not certified.'
  ]};
function save(){fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));}
const processStarted=Date.now();
function progress(phase,detail={}){
  const event={at:new Date().toISOString(),elapsedMs:Date.now()-processStarted,phase,...detail};
  (report.progress||(report.progress=[])).push(event);report.lastProgress=event;
  console.log('[British QA] '+JSON.stringify(event));save();
}
function check(name,ok,detail){report.checks.push({name,ok:!!ok,...(detail===undefined?{}:{detail})});if(!ok)report.failures.push(name);}
function png(rel,url,meta){if(!/^data:image\/png;base64,/.test(url||''))throw Error('Invalid PNG: '+rel);const b=Buffer.from(url.split(',')[1],'base64');fs.writeFileSync(path.join(OUT,rel),b);report.artifacts.push({path:rel,bytes:b.length,sha256:sha(b),...meta});}
function compareFingerprint(fp,blocks){
  const same=(a,b)=>!!a&&!!b&&['d','n','w','h'].every(k=>a[k]===b[k]);
  const env=baseline.envLeaves?.[process.platform]||{},added=[],removed=[],changed=[],envMatched=[];
  for(const k of Object.keys(fp.subs||{})){if(!baseline.subs[k])added.push(k);else if(!same(baseline.subs[k],fp.subs[k])){if(same(env[k],fp.subs[k]))envMatched.push(k);else changed.push(k);}}
  for(const k of Object.keys(baseline.subs||{}))if(!fp.subs?.[k])removed.push(k);
  const expected=TARGETS.map(t=>'bld.'+t.k+'_1_0').sort();
  const touched=[];for(const[k,v]of Object.entries(fp.families||{})){if(baseline.families[k]?.crc===v.crc)continue;if(k==='bld'||!envMatched.some(x=>x.split('.')[0]===k))touched.push(k);}
  const out={added:added.sort(),removed,changed,envMatched,touched,expected,blocks:{current:blocks?.fam,count:blocks?.count,baseline:baseline.blocks}};
  check('fingerprint enumerator succeeded',fp.ok&&blocks?.ok);
  check('exactly the three new canonical building leaves',JSON.stringify(out.added)===JSON.stringify(expected),out);
  check('zero changed or removed legacy leaves outside registered environment differences',changed.length===0&&removed.length===0,out);
  check('only bld family touched',JSON.stringify(touched.sort())==='["bld"]',touched);
  check('all enumerated superblock sprites unchanged',!!baseline.blocks&&blocks?.fam===baseline.blocks.fam&&blocks?.count===baseline.blocks.count,out.blocks);
  return out;
}
function compareSessionFingerprint(before,after,worker){
  const keys=['d','n','w','h','op','nop'],added=[],removed=[],changed=[];
  for(const [key,value]of Object.entries(after.subs||{})){
    const old=before.subs?.[key];
    if(!old)added.push({key,after:value});
    else if(!keys.every(k=>old[k]===value[k]))changed.push({key,before:old,after:value,fields:keys.filter(k=>old[k]!==value[k])});
  }
  for(const [key,value]of Object.entries(before.subs||{}))if(!after.subs?.[key])removed.push({key,before:value});
  const changedExistingFamilies=Object.keys(before.families||{}).filter(k=>JSON.stringify(before.families[k])!==JSON.stringify(after.families?.[k]));
  const expectedAdded=before.subs?.worker12?[]:['worker12'];
  const out={added,removed,changed,changedExistingFamilies,pairedExistingLeaves:Object.keys(before.subs||{}).length,
    expectedAdded,legacyWorker:worker,beforeStats:before.stats,afterStats:after.stats,
    contract:'Every boot-time day/night leaf and existing family must remain exact. Only the existing lazily generated T700 worker12 atlas may appear; its source is pinned and its full RGBA bytes independently compared.'};
  check('every boot-time existing and British day/night leaf remains exact',before.ok&&after.ok&&removed.length===0&&changed.length===0&&changedExistingFamilies.length===0,out);
  check('only source-verified existing lazy construction worker atlas may be added',JSON.stringify(added.map(q=>q.key).sort())===JSON.stringify(expectedAdded)&&worker?.sourcePinned&&worker?.exact&&worker?.deterministic&&worker?.mathRandomCalls===0,out);
  return out;
}
// All following functions are serialized and run inside the remote browser only.
function prepareFixture(targets,benchmarks){
  const seeded=GV.metroArtSeedWorld516(5162026);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);GV.setRot(0);GV.nightPowerTest698(1);
  const all=()=>{const a=[];for(let y=0;y<seeded.N;y++)for(let x=0;x<seeded.N;x++)a.push(GV.tile(x,y));return a;};
  const before=all(),patches=[];
  for(const q of [...targets,...benchmarks]){const p={x:q.x-1,y:q.y-1,w:q.sz+2,h:q.sz+2};patches.push(p);GV.art574.clear574(p.x,p.y,p.w,p.h);}
  const planted=GV.art574.plant574([...targets,...benchmarks].map(q=>({...q,lv:1,v:0})));
  const roads=[];for(const y of[13,19,25])for(let x=6;x<=19;x++)roads.push([x,y]);for(let y=12;y<=29;y++)roads.push([12,y]);GV.art574.road577(roads);GV.testRebake592();
  const after=all();let unchangedRoots=0,changedTiles=0;
  for(let i=0;i<before.length;i++){if(JSON.stringify(before[i])!==JSON.stringify(after[i]))changedTiles++;else if(before[i].bld&&!before[i].bld.ref)unchangedRoots++;}
  const storage=()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  const windowKeys=['__waterF695','__noSignal','__nightOccNoErase629','__ovCap606','__ovCapMax606','__ovCapAll608','__x13Frac','__x13SyncProf'];
  const Q=window.__british004QA={targets,benchmarks,N:seeded.N,all,storage,world:()=>JSON.stringify({tiles:all(),stats:GV.stats()}),live:new Map(),
    baselineStorage:JSON.stringify(storage()),canonical:new Map(targets.map(t=>[t.id,GV.art574.SPR().bld[t.k+'_1_0']])),
    baselineFP:GV.fp536(),baselineKeys:Object.keys(GV.art574.SPR().bld).sort(),valves:windowKeys.map(k=>[k,Object.prototype.hasOwnProperty.call(window,k),window[k]])};
  window.__waterF695=0;window.__noSignal=true;
  for(const id of['start','startOverlay456']){const el=document.getElementById(id);if(el){el.style.display='none';el.classList.remove('show');}}
  GV.selectTool434('pan');
  return {seeded,planted,patches,unchangedExistingRoots:unchangedRoots,changedFixtureTiles:changedTiles,storageKeys:Object.keys(storage()),
    targets:targets.map(t=>({...t,root:GV.tile(t.x,t.y).bld,refs:Array.from({length:t.sz*t.sz},(_,i)=>GV.tile(t.x+i%t.sz,t.y+Math.floor(i/t.sz)).bld)}))};
}
function buildParity(archivedSource){
  const Q=window.__british004QA,api=window.BritishArchitecture004;
  if(!api||typeof api.buildAll!=='function')throw Error('Missing normal BritishArchitecture004 API');
  const storage0=JSON.stringify(Q.storage()),world0=Q.world(),fp0=JSON.stringify(GV.fp536()),oldRandom=Math.random;
  const oldAPI=window.BritishPrototypes,oldOwn=Object.prototype.hasOwnProperty.call(window,'BritishPrototypes');
  let calls=0,first,second,archived,buildMs,rebuildMs;
  const pix=c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  const same=(a,b)=>!!a&&!!b&&a.width===b.width&&a.height===b.height&&pix(a).every((v,i)=>v===pixCache(b)[i]);
  const cache=new WeakMap(),pixCache=c=>{if(!cache.has(c))cache.set(c,pix(c));return cache.get(c);};
  Math.random=function(){calls++;return oldRandom.apply(this,arguments);};
  try{const t=performance.now();first=api.buildAll();buildMs=performance.now()-t;const t2=performance.now();second=api.buildAll();rebuildMs=performance.now()-t2;
    (0,eval)(archivedSource);archived=window.BritishPrototypes.buildAll();
  }finally{Math.random=oldRandom;if(oldOwn)window.BritishPrototypes=oldAPI;else delete window.BritishPrototypes;}
  const metrics=[];
  for(const t of Q.targets){const a=first.find(s=>s.id===t.id),b=second.find(s=>s.id===t.id),c=archived.find(s=>s.id===t.id),s=Q.canonical.get(t.id);
    if(!a||!b||!c||!s)throw Error('Missing canonical/renderer/reference asset '+t.id);
    const d=pix(s.img),n=pix(s.night);let solid=0,edge=0,lit=0,unsupported=0,outside=0,partial=0;
    for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=(y*s.w+x)*4,alpha=d[i+3];if(alpha>0&&alpha<255)partial++;if(alpha>120){solid++;if(x<=1||y<=1||x>=s.w-2||y>=s.h-2)edge++;}if(n[i+3]>0){lit++;if(!alpha)unsupported++;}
      if(alpha&&(Math.abs(x+.5-s.ax)>32*t.sz+1||y+.5>s.ay-Math.abs(x+.5-s.ax)/2+1))outside++;}
    metrics.push({id:t.id,k:t.k,w:s.w,h:s.h,ax:s.ax,ay:s.ay,sz:t.sz,solid,edge,lit,unsupported,outside,partial,
      metadata:s.__t547||null,canvasDimensions:[s.img.width,s.img.height,s.night.width,s.night.height],
      deterministic:same(a.img,b.img)&&same(a.night,b.night)&&a.img!==b.img&&a.night!==b.night,
      canonicalEqualsRenderer:same(s.img,a.img)&&same(s.night,a.night),canonicalEqualsApproved:same(s.img,c.img)&&same(s.night,c.night),
      category:GV.kcat345(t.k).cat,day:s.img.toDataURL(),night:s.night.toDataURL()});
  }
  return{version:api.version,buildMs,rebuildMs,metrics,pure:{mathRandomCalls:calls,worldUnchanged:Q.world()===world0,storageUnchanged:JSON.stringify(Q.storage())===storage0,fingerprintUnchanged:JSON.stringify(GV.fp536())===fp0,scope:'Both generators evaluated and built within one synchronous JS turn; no carrier replacement or registration.'}};
}
function legacyWorkerProof(source){
  const actual=GV.art574.SPR().worker12,oldRandom=Math.random;let calls=0;
  if(!actual?.img)return{present:false,exact:false,deterministic:false,mathRandomCalls:0};
  const build=()=>Function('let WK=null;const SPR={};'+source+';return workers();')();
  const same=(a,b)=>{if(a.width!==b.width||a.height!==b.height)return false;const aa=a.getContext('2d').getImageData(0,0,a.width,a.height).data,bb=b.getContext('2d').getImageData(0,0,b.width,b.height).data;return aa.every((v,i)=>v===bb[i]);};
  Math.random=function(){calls++;return oldRandom.apply(this,arguments);};
  try{const expected=build(),again=build();return{present:true,width:actual.img.width,height:actual.img.height,CW:actual.CW,CH:actual.CH,ax:actual.ax,ay:actual.ay,
    exact:same(actual.img,expected.img),deterministic:same(expected.img,again.img)&&expected.img!==again.img,mathRandomCalls:calls,
    reference:'Unchanged approved main T700 workers() source evaluated with lexical WK and SPR, never registered into product SPR.'};
  }finally{Math.random=oldRandom;}
}
function saveLoadFixture(){
  const Q=window.__british004QA;
  if(window.__britishQA004!==true||localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable save/load guard failed');
  GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.britishWeather004(0,0,0);
  const slots12=['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak'];
  const otherBefore=slots12.map(k=>localStorage.getItem(k));
  const roots=()=>Q.all().flatMap((t,i)=>t.bld&&!t.bld.ref?[[i,t.bld.k,t.bld.lv,t.bld.age,t.bld.sz||1]]:[]);
  const before=roots(),saved=GV.save(),raw=localStorage.getItem('glimmerville.v1.s3'),data=raw&&JSON.parse(raw);
  if(!saved||!data||data.v!==1||!Array.isArray(data.bl))throw Error('Normal GV.save did not produce a valid slot-3 save');
  const loaded=GV.load();if(!loaded)throw Error('Normal GV.load rejected its fixture save');
  GV.setSpeed(0);GV.ai(false);GV.nightPowerTest698(1);GV.selectTool434('pan');GV.testRebake592();Q.live.clear();
  const after=roots(),targetResults=Q.targets.map(t=>{
    const root=GV.tile(t.x,t.y).bld,refs=Array.from({length:t.sz*t.sz},(_,i)=>GV.tile(t.x+i%t.sz,t.y+Math.floor(i/t.sz)).bld);
    const record=data.bl.find(b=>b[0]===t.y*Q.N+t.x);
    return{id:t.id,k:t.k,root,record,refs,ok:record?.[1]===t.k&&record[2]===1&&record[3]===0&&record[4]===30&&root?.k===t.k&&root.sz===t.sz&&root.lv===1&&root.v===0&&root.age===30&&refs.every((b,i)=>i===0?!b.ref:b?.k===t.k&&b.ref?.[0]===t.x&&b.ref?.[1]===t.y)};
  });
  const oldBefore=before.filter(b=>b[1]<219),oldAfter=after.filter(b=>b[1]<219);
  Q.savedTown={loaded:true,slot:3,savedRootCount:data.bl.length,rootRecords:targetResults.map(t=>t.record)};
  // Runtime fields and existing RCI visual variants legitimately normalize on load.
  // Root coordinates, numeric identities, levels, ages and footprints must survive.
  return{saved:!!saved,loaded,slot:3,bytes:raw.length,version:data.v,mapSize:data.n,seed:data.seed,day:data.day,
    newRootRecordCount:data.bl.filter(b=>b[1]>=219&&b[1]<=221).length,targets:targetResults,
    rootsBefore:before.length,rootsAfter:after.length,existingRoots:oldBefore.length,
    rootIdentityAgeFootprintPreserved:JSON.stringify(before)===JSON.stringify(after),
    existingRootIdentityAgeFootprintPreserved:JSON.stringify(oldBefore)===JSON.stringify(oldAfter),
    otherPlayerSlotsUnchanged:slots12.every((k,i)=>localStorage.getItem(k)===otherBefore[i]),
    canonicalSpritesPreserved:Q.targets.every(t=>GV.art574.SPR().bld[t.k+'_1_0']===Q.canonical.get(t.id)),
    method:'One synchronous actual GV.save() then GV.load() transaction. No JSON/import replacement, reseed or replant after load. Subsequent actual-town PNGs render this loaded world.'};
}
function scene(arg){
  const Q=window.__british004QA,t=arg.id&&Q.targets.find(t=>t.id===arg.id),s=t&&Q.canonical.get(t.id);
  if(typeof GV.britishWeather004!=='function')throw Error('Missing deterministic britishWeather004 fixture hook');
  const wx=arg.wx||'clear',weather=GV.britishWeather004(wx==='snow'?3:0,wx==='clear'?0:1,wx==='snow'?6:wx==='rain'?5:0);
  GV.setRot(arg.rot||0);GV.setZoom(arg.z);GV.setVisT(GV.art574.cycle574()*(arg.mode==='night'?.9:.5));
  if(t){const d=Math.round((s.ay-32*t.sz-s.h/2)/32),p=GV.w2v(t.x,t.y),world=GV.v2w(p[0]-d,p[1]-d);GV.lookAt(world[0],world[1]);}else GV.lookAt(12,19);
  window.__ovCapMax606=12000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606.slice();window.__ovCap606=null;
  const c=document.getElementById('game'),g=c.getContext('2d'),camera=GV.camera436();
  const hits=Q.targets.map(q=>{const a=caps.find(a=>a.o.x===q.x&&a.o.y===q.y&&a.bd.k===q.k);if(!a)return{id:q.id,missing:true};Q.live.set(q.id,a.bd);
    let corner=null,dep=-Infinity;for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++){const p=GV.w2v(q.x+dx,q.y+dy),d=p[0]+p[1];if(d>=dep){dep=d;corner=p;}}
    const ex=Math.round(c.width/2-camera.x*arg.z)+(corner[0]-corner[1])*32*arg.z-a.s.ax*arg.z;
    const ey=Math.round(c.height/2-camera.y*arg.z)+(corner[0]+corner[1])*16*arg.z+(32-a.s.ay)*arg.z;
    return{id:q.id,k:q.k,bx:a.bx,by:a.by,z:a.z,width:a.s.w*a.z,height:a.s.h*a.z,depth:a.o.dep,canonicalIdentity:a.s===Q.canonical.get(q.id),
      anchorError:[a.bx-ex,a.by-ey],expected:[ex,ey],withinCanvas:a.bx>=0&&a.by>=0&&a.bx+a.s.w*a.z<=c.width&&a.by+a.s.h*a.z<=c.height};});
  const h=t&&hits.find(h=>h.id===t.id);if(t&&(!h||h.missing||!h.canonicalIdentity))throw Error('Normal sprite did not enter draw: '+t.id);
  const rect=h?{x:Math.max(0,Math.floor(h.bx-110)),y:Math.max(0,Math.floor(h.by-40)),w:0,h:0}:{x:0,y:0,w:c.width,h:c.height};
  if(h){rect.w=Math.min(c.width-rect.x,Math.ceil(h.width+220));rect.h=Math.min(c.height-rect.y,Math.ceil(h.height+145));}
  Q.lastRect=rect;Q.lastTargetRect=h?{x:Math.max(0,Math.floor(h.bx)),y:Math.max(0,Math.floor(h.by)),w:Math.ceil(h.width),h:Math.ceil(h.height)}:rect;Q.lastFull=c.toDataURL();const crop=document.createElement('canvas');crop.width=rect.w;crop.height=rect.h;crop.getContext('2d').drawImage(c,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);Q.lastCrop=crop.toDataURL();
  const neighbors=caps.filter(a=>!Q.targets.some(t=>t.k===a.bd.k&&t.x===a.o.x&&t.y===a.o.y)&&a.bx+a.s.w*a.z>rect.x&&a.bx<rect.x+rect.w&&a.by+a.s.h*a.z>rect.y&&a.by<rect.y+rect.h).map(a=>({k:a.bd.k,x:a.o.x,y:a.o.y,depth:a.o.dep}));
  return{...arg,savedTown:Q.savedTown||null,weather,actualRotation:GV.rot(),daylight:GV.daylightDbg(),hits,rect,canvas:{w:c.width,h:c.height},existingNeighbors:[...new Map(neighbors.map(n=>[n.x+','+n.y,n])).values()],nightComposition:{...window.__t629},weatherCaches:t?{snow:!!s.snow,wet:!!s.wet,icicle:!!s.icicle}:null};
}
function lampProbe(id){
  const Q=window.__british004QA,s=Q.canonical.get(id),c=document.getElementById('game'),g=c.getContext('2d'),old=s.night;
  const own=Object.prototype.hasOwnProperty.call(window,'__nightOccNoErase629'),val=window.__nightOccNoErase629;
  const empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
  const shot=(on,erase)=>{s.night=on?old:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};
  try{const on=shot(true,true),off=shot(false,true),uoff=shot(false,false),uon=shot(true,false);Q.lastDiagnostic=c.toDataURL();let changed=0,candidate=0,blocked=0,visible=0;
    for(let i=0;i<on.length;i+=4){let normal=0,unmasked=0;for(let k=0;k<3;k++){normal+=Math.abs(on[i+k]-off[i+k]);unmasked+=Math.abs(uon[i+k]-uoff[i+k]);}if(normal>3)changed++;if(unmasked>9){candidate++;if(normal<=3)blocked++;if(normal>9)visible++;}}
    return{changedPixels:changed,candidateLightPixels:candidate,fullyBlockedLightPixels:blocked,visibleLightPixels:visible,method:'Own night on/off × normal erasure on/off, four same-turn real draws; canonical night reference restored in finally.'};
  }finally{s.night=old;if(own)window.__nightOccNoErase629=val;else delete window.__nightOccNoErase629;GV.forceDraw();}
}
function constructionFrame(id,p,mode){
  const Q=window.__british004QA,t=Q.targets.find(t=>t.id===id),s=Q.canonical.get(id),b=Q.live.get(id);if(!b)throw Error('No previously captured live root for '+id);
  const oldAge=b.age,oldPower=b.pw,oldFrac=window.__x13Frac,oldSync=window.__x13SyncProf;
  try{GV.britishWeather004(0,0,0);GV.setVisT(GV.art574.cycle574()*(mode==='night'?.9:.5));b.age=Math.floor(p);window.__x13Frac=p-Math.floor(p);window.__x13SyncProf=1;
    for(let i=0;i<8;i++){GV.forceDraw();if(GV.constr13.pending())GV.constr13.flush();}
    const c=document.getElementById('game'),g=c.getContext('2d'),box=Q.lastRect,snap=()=>g.getImageData(box.x,box.y,box.w,box.h).data,a=snap();Q.lastFull=c.toDataURL();
    const delta=(u,v)=>{let n=0;for(let i=0;i<u.length;i+=4)if(u[i]!==v[i]||u[i+1]!==v[i+1]||u[i+2]!==v[i+2])n++;return n;};
    GV.forceDraw();const diff=delta(a,snap());let completionDelta=null,nightCompletion=null;
    if(p===8.999){
      b.age=9;window.__x13Frac=0;GV.forceDraw();const completed=snap();completionDelta=delta(a,completed);
      if(mode==='night'){
        b.pw=false;GV.forceDraw();const completedUnpowered=snap();
        b.age=8;window.__x13Frac=.999;GV.forceDraw();const beforeUnpowered=snap();
        nightCompletion={powerBefore:!!oldPower,unpoweredConvergenceDelta:delta(beforeUnpowered,completedUnpowered),
          beforeCompletionPowerDelta:delta(a,beforeUnpowered),completedPowerDelta:delta(completed,completedUnpowered),
          method:'Four same-turn real renders: P8.999/age9 × root power on/off. Only this fixture root power is toggled and restored; all canonical art and global light renderers remain untouched.'};
        b.pw=oldPower;
      }
    }
    let signature=2166136261;for(const n of a){signature^=n;signature=Math.imul(signature,16777619);}signature=(signature>>>0).toString(16);
    const M=GV.constr13.profile(s,b);return{id,progress:p,mode,stableDiff:diff,completionDelta,nightCompletion,signature,comparisonBox:box,profile:M?{src:M.src,sz:M.sz,area:M.area,method:M.method,roof:M.roof,masses:M.ms?.length,silhouette:!!M.sil}:null,stats:{...GV.constr13.stats()},root:{k:b.k,sz:b.sz,age:Math.floor(p)}};
  }finally{b.age=oldAge;b.pw=oldPower;window.__x13Frac=oldFrac;window.__x13SyncProf=oldSync;GV.forceDraw();}
}
async function cleanup(){
  const Q=window.__british004QA;if(!Q)return{missing:true};
  for(const[k,own,v]of Q.valves){if(own)window[k]=v;else delete window[k];}
  GV.nightPowerTest698(null);GV.britishWeather004(0,0,0);GV.setRot(0);GV.selectTool434('pan');
  const a=JSON.parse(Q.baselineStorage),b=Q.storage(),keys=[...new Set([...Object.keys(a),...Object.keys(b)])].sort().filter(k=>a[k]!==b[k]);
  const allowed=['glimmerville.v1.s3','glimmerville.v1.s3_bak','glimmerville.v1.viewRot'];
  // Explicitly restore only the disposable fixture autosave keys and camera preference
  // that this harness changed through GV.setRot; unrelated changes fail, never cleaned.
  const digest=async v=>v===undefined?null:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))).map(v=>v.toString(16).padStart(2,'0')).join('');
  const changes=await Promise.all(keys.map(async k=>({key:k,beforeBytes:a[k]?.length??null,afterBytes:b[k]?.length??null,beforeSHA256:await digest(a[k]),afterSHA256:await digest(b[k]),expectedFixtureChange:allowed.includes(k)})));
  for(const k of allowed){if(Object.prototype.hasOwnProperty.call(a,k))localStorage.setItem(k,a[k]);else localStorage.removeItem(k);}
  return{storageChanges:changes,unexpectedKeys:keys.filter(k=>!allowed.includes(k)),storageExactlyRestored:JSON.stringify(Q.storage())===Q.baselineStorage,
    sameSpriteReferences:Q.targets.every(t=>GV.art574.SPR().bld[t.k+'_1_0']===Q.canonical.get(t.id)),sameCatalogKeys:JSON.stringify(Object.keys(GV.art574.SPR().bld).sort())===JSON.stringify(Q.baselineKeys),fingerprint:GV.fp536()};
}
(async()=>{
  const probeSource=html.toString('utf8').split('function britishGameplayProbe004(groupFilter)')[1]?.split('window.GV={')[0]||'';
  const sourceGroups=[...probeSource.matchAll(/\bgroup\('([^']+)'/g)].map(m=>m[1]).filter(n=>n!=='cleanup').sort();
  check('all declared gameplay groups run exactly once',JSON.stringify(sourceGroups)===JSON.stringify([...GAMEPLAY_GROUPS].sort()),{sourceGroups,scheduled:GAMEPLAY_GROUPS});
  check('archived renderer is the immutable approved R2 source',sha(archivedArt)===APPROVED_ART_SHA256,report.source.archivedArtSHA256);
  check('existing lazy worker renderer source remains approved',sha(workerSource)===APPROVED_WORKER_SHA256,sha(workerSource));
  check('workflow checked SHA matches actual checkout',!report.workflowSHA||report.workflowSHA===checkedSHA,{checkedSHA,workflowSHA:report.workflowSHA});
  const wallStart=Date.now();progress('browser boot requested',{checkedSHA});
  const result=await withGame({port:8199,timeout:1200,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
    let cdpStalled=false,operationId=0,bootFP=null;
    const rpc=async(method,params={},label=method,timeoutMs=180000)=>{
      if(cdpStalled)throw Error('CDP unavailable after deadline; last operation recorded in manifest');
      const id=++operationId,t0=Date.now();let deadline,heartbeat;
      report.activeOperation={id,label,method,timeoutMs,startedAt:new Date().toISOString()};progress('start',{id,label,timeoutMs});
      heartbeat=setInterval(()=>progress('waiting',{id,label,operationMs:Date.now()-t0}),30000);
      try{
        const value=await Promise.race([cdp.send(method,params),new Promise((_,reject)=>{deadline=setTimeout(()=>{cdpStalled=true;reject(Error('CDP deadline exceeded: '+label+' ('+timeoutMs+' ms)'));},timeoutMs);})]);
        progress('done',{id,label,operationMs:Date.now()-t0});delete report.activeOperation;return value;
      }catch(e){progress('failed',{id,label,operationMs:Date.now()-t0,error:String(e.stack||e)});throw e;}
      finally{clearTimeout(deadline);clearInterval(heartbeat);}
    };
    const ev=async(expression,label=expression.slice(0,100),timeoutMs=180000)=>{const r=await rpc('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},label,timeoutMs);if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
    const call=(f,...args)=>ev('('+f.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')',f.name+(args[0]&&typeof args[0]==='object'?' '+JSON.stringify(args[0]).slice(0,150):args[0]&&String(args[0]).length<100?' '+args[0]:''));
    const browserShot=async(rel,meta)=>{const x=await rpc('Page.captureScreenshot',{format:'png'},'viewport '+rel);png(rel,'data:image/png;base64,'+x.data,{kind:'Chromium viewport screenshot',...meta});};
    try{
      await rpc('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
      report.browser=await rpc('Browser.getVersion');
      report.boot=await ev('({ready:!!window.__bootDone453,slot:localStorage.getItem("glimmerville.v1.slot"),version:GV.ver(),title:document.title,batches:window.__t574,pageElapsedMs:performance.now()})');report.boot.wallToReadyMs=Date.now()-wallStart;
      check('normal boot ready in disposable slot 3',report.boot.ready&&report.boot.slot==='3',report.boot);
      check('normal art bake reports no errors',!(report.boot.batches?.err||[]).length,report.boot.batches?.err);
      const fp=await ev('GV.fp536()','canonical fingerprint',300000),blocks=await ev('GV.blockFp536()','full superblock fingerprint',300000);bootFP=fp;report.fingerprint=compareFingerprint(fp,blocks);report.bootFingerprintSHA256=sha(JSON.stringify(fp));
      fs.writeFileSync(path.join(OUT,'guards','fingerprint-current.json'),JSON.stringify({checkedSHA,fp,blocks},null,2));
      report.selftest=await ev('typeof GV.britishSelftest004==="function"?GV.britishSelftest004():{ok:false,error:"missing britishSelftest004"}');check('product British integration selftest',report.selftest?.ok,report.selftest);
      await ev('window.__britishQA004=true;1');
      report.gameplay={ok:true,groups:[],details:[],checks:[],exceptions:[],elapsedMs:0,slot:3,disposable:true};
      for(const name of GAMEPLAY_GROUPS){
        const one=await ev('typeof GV.britishGameplayProbe004==="function"?GV.britishGameplayProbe004('+JSON.stringify(name)+'):{ok:false,error:"missing britishGameplayProbe004"}','gameplay group: '+name,120000);
        report.gameplay.groups.push({name,...one});report.gameplay.ok=report.gameplay.ok&&!!one?.ok;
        for(const key of ['details','checks','exceptions'])report.gameplay[key].push(...(one?.[key]||[]));
        report.gameplay.elapsedMs+=one?.elapsedMs||0;
        check('gameplay group '+name,one?.ok&&(one.details?.length||0)>2,{ok:one?.ok,assertions:one?.details?.length,exceptions:one?.exceptions,error:one?.error});
        progress('gameplay group complete',{name,ok:one?.ok,assertions:one?.details?.length,elapsedMs:one?.elapsedMs});
      }
      report.gameplay.assertions=report.gameplay.details.length;
      check('product gameplay placement/save probe',report.gameplay.ok&&report.gameplay.groups.length===GAMEPLAY_GROUPS.length,{ok:report.gameplay.ok,groups:report.gameplay.groups.map(g=>({name:g.name,ok:g.ok,assertions:g.assertions})),assertions:report.gameplay.assertions});
      report.fixtureResult=await call(prepareFixture,TARGETS,BENCHMARKS);check('retained original town around bounded patches',report.fixtureResult.unchangedExistingRoots>100,report.fixtureResult);
      for(const t of report.fixtureResult.targets)check(t.id+' canonical root and footprint refs',t.root?.k===t.k&&t.root.sz===t.sz&&t.refs.every((b,i)=>i===0?b.k===t.k&&!b.ref:b.k===t.k&&b.ref?.[0]===t.x&&b.ref?.[1]===t.y),t);
      report.parity=await call(buildParity,archivedArt);check('pure synchronous approved/product generator transaction',report.parity.pure.mathRandomCalls===0&&report.parity.pure.worldUnchanged&&report.parity.pure.storageUnchanged&&report.parity.pure.fingerprintUnchanged,report.parity.pure);
      for(const m of report.parity.metrics){const t=TARGETS.find(t=>t.id===m.id);png('assets/'+m.id+'-day.png',m.day,{kind:'normal canonical sprite',id:m.id,k:m.k});png('assets/'+m.id+'-night.png',m.night,{kind:'normal canonical emissive layer',id:m.id,k:m.k});delete m.day;delete m.night;
        check(m.id+' exact approved pixels and deterministic independent regeneration',m.deterministic&&m.canonicalEqualsRenderer&&m.canonicalEqualsApproved,m);
        check(m.id+' exact dimensions and anchor',['w','h','ax','ay','sz'].every(k=>m[k]===t[k])&&m.canvasDimensions.join(',')===[t.w,t.h,t.w,t.h].join(','),m);
        check(m.id+' supported hard pixels with safe canvas and lot bounds',m.solid>0&&m.lit>0&&m.edge===0&&m.unsupported===0&&m.outside===0&&m.partial===0,m);}
      report.savedTown=await call(saveLoadFixture);
      check('actual normal save/load keeps all three complete British roots and refs',report.savedTown.loaded&&report.savedTown.newRootRecordCount===3&&report.savedTown.targets.every(t=>t.ok),report.savedTown);
      check('actual normal save/load preserves existing city root identities ages and footprints',report.savedTown.existingRoots>100&&report.savedTown.rootIdentityAgeFootprintPreserved&&report.savedTown.existingRootIdentityAgeFootprintPreserved,report.savedTown);
      check('actual normal save/load preserves canonical sprite references and owner slots',report.savedTown.canonicalSpritesPreserved&&report.savedTown.otherPlayerSlotsUnchanged,report.savedTown);
      progress('saved town ready for actual capture',{roots:report.savedTown.rootsAfter});
      const output=async(arg,stem,arr)=>{progress('capture',{stem});const r=await call(scene,arg);png('full/'+stem+'.png',await ev('window.__british004QA.lastFull'),{kind:'actual game canvas',...arg});png('crops/'+stem+'.png',await ev('window.__british004QA.lastCrop'),{kind:'unaltered canvas crop',...arg,rect:r.rect});
        check(stem+' camera and light phase',r.actualRotation===(arg.rot||0)&&(arg.mode==='day'?r.daylight.b>.95:r.daylight.b<.45),{rot:r.actualRotation,daylight:r.daylight});
        if(arg.id){const h=r.hits.find(h=>h.id===arg.id);check(stem+' normal canonical sprite and nearest-corner anchor',h?.canonicalIdentity&&h.withinCanvas&&h.anchorError.every(v=>Math.abs(v)<1e-5),h);
          if(arg.mode==='night'){r.lamps=await call(lampProbe,arg.id);check(stem+' real own lamps affect scene',r.lamps.changedPixels>0,r.lamps);}}
        arr.push({stem,...r});save();return r;};
      for(const rot of[0,1,2,3])for(const t of TARGETS)for(const z of[1.2,2])for(const mode of['day','night']){
        const a={id:t.id,z,mode,rot};const stem=`${t.id}-r${rot}-z${String(z).replace('.','p')}-${mode}`;await output(a,stem,report.samples);
        if(rot===0&&z===1.2)await browserShot('browser/'+stem+'.png',a);
      }
      for(const mode of['day','night']){const r=await output({z:1.2,mode,rot:0},'town-'+mode,report.town);check('town '+mode+' contains all three normal assets after real save/load',r.savedTown?.loaded&&r.savedTown.slot===3&&r.hits.every(h=>h.canonicalIdentity&&h.withinCanvas),{savedTown:r.savedTown,hits:r.hits});}
      for(const wx of['rain','snow'])for(const t of TARGETS)for(const mode of['day','night']){const r=await output({id:t.id,z:2,mode,rot:0,wx},t.id+'-'+wx+'-'+mode,report.weather);check(t.id+' '+wx+' material cache exercised',wx==='snow'?r.weatherCaches.snow&&r.weatherCaches.icicle:r.weatherCaches.wet,r.weatherCaches);}
      // Each progress state is settled through the real T700 queue and rendered
      // twice in the same turn. No new bespoke animation is assumed.
      for(const t of TARGETS){await call(scene,{id:t.id,z:2,mode:'day',rot:0});for(const p of[0,3,5.5,8.999,9])for(const mode of['day','night']){
        const r=await call(constructionFrame,t.id,p,mode),stem=t.id+'-construction-'+String(p).replace('.','p')+'-'+mode;
        png('full/'+stem+'.png',await ev('window.__british004QA.lastFull'),{kind:'actual generic construction frame',id:t.id,progress:p,mode});report.construction.push({stem,...r});if(p===8.999){if(mode==='day')check(stem+' final construction geometry equals completed sprite',r.completionDelta===0,r.completionDelta);
          else check(stem+' completion difference is exclusively completed powered lighting',r.nightCompletion?.powerBefore&&r.nightCompletion.unpoweredConvergenceDelta===0&&r.nightCompletion.beforeCompletionPowerDelta===0&&r.nightCompletion.completedPowerDelta===r.completionDelta&&r.completionDelta>0,{completionDelta:r.completionDelta,...r.nightCompletion});}check(stem+' settled and correct lot',r.stableDiff===0&&r.root.k===t.k&&r.root.sz===t.sz&&r.profile?.sz===t.sz&&r.profile.area===t.sz*t.sz,r);save();}}
      for(const t of TARGETS)for(const mode of['day','night']){const sigs=report.construction.filter(r=>r.id===t.id&&r.mode===mode).map(r=>r.signature);check(t.id+' '+mode+' has distinct visible construction stages',new Set(sigs).size>=4,sigs);}
      // Existing corner pub in front of a disjoint 3x3 library footprint.
      report.occluder=await ev('(()=>{GV.art574.clear574(10,23,2,2);const p=GV.art574.plant574([{k:197,x:10,y:23,sz:2,v:0,lv:1}]);GV.testRebake592();return p;})()');
      const oc=await output({id:'UKP03',z:2,mode:'night',rot:0},'UKP03-foreground-occlusion',report.occlusion);
      png('guards/UKP03-no-erasure.png',await ev('window.__british004QA.lastDiagnostic'),{kind:'diagnostic depth erasure disabled'});
      check('foreground masks some library lamps and retains others',oc.lamps.fullyBlockedLightPixels>0&&oc.lamps.visibleLightPixels>0,oc.lamps);
      report.nightCompositor=await ev('GV.nightOccSelftest629()');check('existing night compositor selftest',report.nightCompositor.ok,report.nightCompositor);
      // Use actual catalog DOM controls; no mutation of renderer/canonical sprites.
      report.catalog=[];
      await ev('GV.innovationSetQA507({money:9999999,rank:25,tech:false});1');
      for(const t of TARGETS){const menu=await ev(`(()=>{const b=document.querySelector('.catalog458Btn')||document.getElementById('catalogOpen458');if(!b)return{ok:false,error:'missing catalog opener'};b.click();const q=document.getElementById('catalogSearch458');q.value=${JSON.stringify(t.tool)};q.dispatchEvent(new Event('input',{bubbles:true}));const card=document.querySelector('[data-card458="${t.tool}"]');if(card)card.scrollIntoView({block:'center'});return{ok:!!card,tool:${JSON.stringify(t.tool)},text:card?.textContent||'',menuOpen:document.getElementById('buildCatalog458')?.classList.contains('show')};})()`);
        check(t.id+' actual catalog search card visible',menu.ok&&menu.menuOpen,menu);report.catalog.push(menu);await browserShot('browser/'+t.id+'-catalog.png',{kind:'normal catalog search',tool:t.tool});await ev('document.getElementById("catalogClose458").click();1');}
      report.consoleErrors=cdp.errors;report.benignPwaErrors=cdp.benign;check('zero console or uncaught errors',cdp.errors.length===0,cdp.errors);
      check('all requested camera/zoom/time/weather/construction frames captured',report.samples.length===48&&report.town.length===2&&report.weather.length===12&&report.construction.length===30);
      return true;
    }finally{try{if(cdpStalled)throw Error('Cleanup unverified because a CDP deadline was exceeded; withGame will close this disposable browser profile');report.finalWorker=await call(legacyWorkerProof,workerSource);report.finalWorker.sourcePinned=sha(workerSource)===APPROVED_WORKER_SHA256;
      report.finalParity=await call(buildParity,archivedArt);for(const m of report.finalParity.metrics){delete m.day;delete m.night;check(m.id+' final full pixels still equal approved art',m.canonicalEqualsApproved&&m.canonicalEqualsRenderer&&m.deterministic,m);}
      check('final generator transaction remains pure',report.finalParity.pure.mathRandomCalls===0&&report.finalParity.pure.worldUnchanged&&report.finalParity.pure.storageUnchanged&&report.finalParity.pure.fingerprintUnchanged,report.finalParity.pure);
      report.cleanup=await call(cleanup);if(report.cleanup.fingerprint){
        const finalFP=report.cleanup.fingerprint;report.cleanup.fingerprintSHA256=sha(JSON.stringify(finalFP));
        fs.writeFileSync(path.join(OUT,'guards','fingerprint-final.json'),JSON.stringify({checkedSHA,fp:finalFP},null,2));
        report.finalFingerprintDiff=compareSessionFingerprint(bootFP,finalFP,report.finalWorker);
        fs.writeFileSync(path.join(OUT,'guards','fingerprint-session-diff.json'),JSON.stringify(report.finalFingerprintDiff,null,2));delete report.cleanup.fingerprint;
      }
      check('normal sprite references and catalog keys unchanged',report.cleanup.sameSpriteReferences&&report.cleanup.sameCatalogKeys,report.cleanup);
      check('only documented disposable save and camera preference changes',report.cleanup.unexpectedKeys?.length===0,report.cleanup.storageChanges);
      check('fixture storage exactly restored',report.cleanup.storageExactlyRestored,report.cleanup);
      }catch(e){check('fixture cleanup completed',false,String(e.stack||e));}save();}
  });
  report.session={ok:result.ok,fails:result.fails,seconds:result.seconds,chromeMs:result.chromeMs};check('remote browser session completed',result.ok&&result.result,report.session);
  check('product source unchanged during evidence generation',sha(fs.readFileSync(path.join(ROOT,'index.html')))===report.source.htmlSHA256);
  check('fingerprint baseline unchanged',sha(fs.readFileSync(path.join(ROOT,'fp.json')))==report.source.baselineSHA256);
  report.ok=report.failures.length===0;save();console.log(JSON.stringify({ok:report.ok,checkedSHA,checks:report.checks.length,failures:report.failures,samples:report.samples.length,weather:report.weather.length,construction:report.construction.length,session:report.session},null,2));process.exit(report.ok?0:1);
})().catch(e=>{report.ok=false;report.failures.push(String(e.stack||e));save();console.error(e);process.exit(1);});
