#!/usr/bin/env node
'use strict';
// GPT-006: isolated CI only; exact T718 baseline, bounded preflight and parallel evidence shards.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
const ROOT=__dirname,{withGame}=require('./harness');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Run only in authorized isolated GitHub Actions');
const MODE=process.env.RS006_MODE||'preflight',OUT=path.join(ROOT,'residential-evidence',MODE);
const deepEqual=require('util').isDeepStrictEqual;
const RELEASE_VERSION='14.22',RELEASE_ANCHOR='T718';
const PINNED_BASE='0072ac19b3c33f2dda98552d8b6c6bf447ba296c';
const TARGETS=[{"k": 246, "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "family": "georgian", "id": "UKR01", "tool": "georgianRow", "x": 10, "y": 14}, {"k": 247, "sz": 2, "w": 136, "h": 165, "ax": 68, "ay": 163, "family": "georgian", "id": "UKR02", "tool": "georgianCorner", "x": 14, "y": 14}, {"k": 248, "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "family": "georgian", "id": "UKR03", "tool": "georgianEnd", "x": 8, "y": 14}, {"k": 249, "sz": 2, "w": 136, "h": 168, "ax": 68, "ay": 166, "family": "georgian", "id": "UKR04", "tool": "georgianArea", "x": 12, "y": 14}, {"k": 250, "sz": 2, "w": 136, "h": 155, "ax": 68, "ay": 153, "family": "victorian", "id": "UKR05", "tool": "victorianGabledSemi", "x": 8, "y": 20}, {"k": 251, "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "family": "victorian", "id": "UKR06", "tool": "victorianBayVilla", "x": 10, "y": 20}, {"k": 252, "sz": 2, "w": 136, "h": 150, "ax": 68, "ay": 148, "family": "victorian", "id": "UKR07", "tool": "victorianGardenVilla", "x": 12, "y": 20}, {"k": 253, "sz": 2, "w": 136, "h": 168, "ax": 68, "ay": 166, "family": "victorian", "id": "UKR08", "tool": "victorianGothicVilla", "x": 14, "y": 20}, {"k": 254, "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "family": "village", "id": "UKR09", "tool": "stoneCottagePair", "x": 8, "y": 26}, {"k": 255, "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "family": "village", "id": "UKR10", "tool": "brickCatslideCottage", "x": 10, "y": 26}, {"k": 256, "sz": 2, "w": 136, "h": 140, "ax": 68, "ay": 138, "family": "village", "id": "UKR11", "tool": "courtyardCottages", "x": 12, "y": 26}, {"k": 257, "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "family": "village", "id": "UKR12", "tool": "thatchedLongCottage", "x": 14, "y": 26}, {"k": 258, "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "family": "workers", "id": "UKR13", "tool": "workersNarrowRow", "x": 8, "y": 32}, {"k": 259, "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "family": "workers", "id": "UKR14", "tool": "workersYardTerrace", "x": 10, "y": 32}, {"k": 260, "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "family": "workers", "id": "UKR15", "tool": "workersCourt", "x": 12, "y": 32}, {"k": 261, "sz": 2, "w": 136, "h": 152, "ax": 68, "ay": 150, "family": "workers", "id": "UKR16", "tool": "workersCornerShop", "x": 14, "y": 32}];
const RETAINED_R1_PIXELS={"UKR01":{"d":"a9b15015","op":8367,"w":136,"h":160,"n":"ca36a4c5"},"UKR02":{"d":"6e407065","op":9306,"w":136,"h":165,"n":"375e0d35"},"UKR03":{"d":"5ced91c0","op":8995,"w":136,"h":160,"n":"466132e4"},"UKR04":{"d":"492c7d28","op":8634,"w":136,"h":168,"n":"e91fdd31"},"UKR05":{"d":"2e5f9dbf","op":7098,"w":136,"h":155,"n":"ea8f36c1"},"UKR06":{"d":"098002b7","op":7092,"w":136,"h":160,"n":"7cd2a4de"},"UKR07":{"d":"b71eda34","op":6405,"w":136,"h":150,"n":"82d375d9"},"UKR08":{"d":"5b92de98","op":7456,"w":136,"h":168,"n":"e290a347"},"UKR09":{"d":"a3876d28","op":5501,"w":136,"h":135,"n":"e3c557b3"},"UKR10":{"d":"e6e2a66d","op":5674,"w":136,"h":135,"n":"9996e5a9"},"UKR11":{"d":"98fc08d4","op":6931,"w":136,"h":140,"n":"82ec16e5"},"UKR12":{"d":"803113a5","op":5113,"w":136,"h":135,"n":"4a3c278d"},"UKR13":{"d":"980a7167","op":6641,"w":136,"h":145,"n":"a2c689f8"},"UKR16":{"d":"e83066c9","op":6588,"w":136,"h":152,"n":"d2c00ba0"}};
const BENCHMARKS=[{k:219,nm:'Approved Victorian terrace',sz:2,x:21,y:14},{k:238,nm:'Approved cooperative stores',sz:2,x:27,y:14},{k:239,nm:'Approved bakehouse',sz:2,x:21,y:20},{k:221,nm:'Approved Edwardian library',sz:3,x:21,y:35}];
const GAMEPLAY_GROUPS=['catalog-placement','construction-day-nine','perimeter-real-utilities','utility-loss','housing-commerce-authorities','save-load-identities'];
const LEGACY_GROUPS=['unlock and rejection matrix','placement transaction tree and inspector','real construction and financial classification','old-only commercial power precision baseline control','all perimeter edge utility connectivity','library capacity budget coverage symmetry and water loss','save load age references old ID compatibility and normalization','offline private buildings have no municipal upkeep','library construction charges and fixed mature identity'];
const sha=d=>crypto.createHash('sha256').update(d).digest('hex');
const html=fs.readFileSync(path.join(ROOT,'index.html')),art=fs.readFileSync(path.join(ROOT,'british-residential-art.js'),'utf8');
const baselineText=execFileSync('git',['show',PINNED_BASE+':fp.json'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024}),baseline=JSON.parse(baselineText);
const baseHTML=execFileSync('git',['show',PINNED_BASE+':index.html'],{cwd:ROOT,encoding:'utf8',maxBuffer:32*1024*1024});
const workerStart=html.toString().indexOf('  function workers(){',html.toString().indexOf('let WK=null;')),workerEnd=html.toString().indexOf('\n  /* ---------- Layer A',workerStart),workerSource=html.toString().slice(workerStart,workerEnd).trim();
const APPROVED_WORKER_SHA256='5fe5dd3cda55b9b1601cd940b1a22287c6c9abb1e9b38cb4a855bf9cc7335584';
const checkedSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
for(const d of['','full','crops','browser','assets','guards','logs'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
const report={createdAt:new Date().toISOString(),checkedSHA,mode:MODE,workflowSHA:process.env.GITHUB_SHA,workflowRun:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,source:{htmlSHA256:sha(html),htmlBytes:html.length,artSHA256:sha(art),baselineSHA256:sha(baselineText),pinnedBaselineCommit:PINNED_BASE,trackedBaselineSHA256:sha(fs.readFileSync(path.join(ROOT,'fp.json')))},checks:[],failures:[],samples:[],town:[],weather:[],construction:[],occlusion:[],artifacts:[],limitations:['Fixed authored square-building elevations across four camera rotations, not four newly drawn elevations.','Visual fixture uses art planting in bounded patches, then actual normal infrastructure placement and save/load plus a normal day. Gameplay is verified independently by ordinary placement probes.','No real-device/mobile certification. Sixteen fixed-elevation house forms; corner-shop housing uses existing housing and enterprise economies.']};
function completionNightOK(r){
  const n=r.nightCompletion;return !!n?.powerBefore&&n.beforeCompletionPowerDelta===0&&n.beforeCompletionPowerWholeDelta===0&&n.completedPowerDelta>0&&n.legacyShadowDelta>0&&n.exactGeometryWholeDelta===0&&n.exactGeometryRGBEqual&&n.diagnosticBeforeMatchesRaw&&n.shadowInterceptions.before.length===0&&n.shadowInterceptions.completed.length===1;
}
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
  const same=(a,b)=>!!a&&!!b&&['d','n','w','h','op','nop'].every(k=>a[k]===b[k]);
  const env=baseline.envLeaves?.[process.platform]||{},added=[],removed=[],changed=[],envMatched=[];
  for(const k of Object.keys(fp.subs||{})){if(!baseline.subs[k])added.push(k);else if(!same(baseline.subs[k],fp.subs[k])){if(same(env[k],fp.subs[k]))envMatched.push(k);else changed.push(k);}}
  for(const k of Object.keys(baseline.subs||{}))if(!fp.subs?.[k])removed.push(k);
  const expected=TARGETS.map(t=>'bld.'+t.k+'_1_0').sort();
  const touched=[];for(const[k,v]of Object.entries(fp.families||{})){if(baseline.families[k]?.crc===v.crc)continue;if(k==='bld'||!envMatched.some(x=>x.split('.')[0]===k))touched.push(k);}
  const out={added:added.sort(),removed,changed,envMatched,touched,expected,blocks:{current:blocks?.fam,count:blocks?.count,baseline:baseline.blocks}};
  check('fingerprint enumerator succeeded',fp.ok&&blocks?.ok);
  check('exactly sixteen new canonical building leaves',JSON.stringify(out.added)===JSON.stringify(expected),out);
  for(const t of TARGETS)if(RETAINED_R1_PIXELS[t.id])check(t.id+' preserves visually accepted R1 pixels',same(fp.subs['bld.'+t.k+'_1_0'],RETAINED_R1_PIXELS[t.id]),{current:fp.subs['bld.'+t.k+'_1_0'],r1:RETAINED_R1_PIXELS[t.id]});
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
  const expectedAdded=!before.subs?.worker12&&after.subs?.worker12?['worker12']:[];
  const out={added,removed,changed,changedExistingFamilies,pairedExistingLeaves:Object.keys(before.subs||{}).length,
    expectedAdded,legacyWorker:worker,beforeStats:before.stats,afterStats:after.stats,
    contract:'Every boot-time day/night leaf and existing family must remain exact. Only the existing lazily generated T700 worker12 atlas may appear; its source is pinned and its full RGBA bytes independently compared.'};
  check('every boot-time existing and British day/night leaf remains exact',before.ok&&after.ok&&removed.length===0&&changed.length===0&&changedExistingFamilies.length===0,out);
  check('only source-verified existing lazy construction worker atlas may be added',JSON.stringify(added.map(q=>q.key).sort())===JSON.stringify(expectedAdded)&&worker?.sourcePinned&&(!after.subs?.worker12||worker?.exact&&worker?.deterministic&&worker?.mathRandomCalls===0),out);
  return out;
}
// All following functions are serialized and run inside the remote browser only.
function prepareFixture(targets,benchmarks){
  const seeded=GV.metroArtSeedWorld516(5162026);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);GV.setRot(0);GV.nightPowerTest698(null);
  const all=()=>{const a=[];for(let y=0;y<seeded.N;y++)for(let x=0;x<seeded.N;x++)a.push(GV.tile(x,y));return a;};
  const before=all(),patches=[...targets,...benchmarks].map(q=>({x:q.x-1,y:q.y-1,w:q.sz+2,h:q.sz+2}));
  const roads=[];for(const y of[13,16,19,22,25,28,31,34])for(let x=6;x<=34;x++)roads.push([x,y]);for(const x of[6,16,18,24,30])for(let y=12;y<=37;y++)roads.push([x,y]);
  const roadCrossings=roads.filter(([x,y])=>[...targets,...benchmarks].some(t=>x>=t.x&&x<t.x+t.sz&&y>=t.y&&y<t.y+t.sz));if(roadCrossings.length)throw Error('Fixture road crosses authored footprint: '+JSON.stringify(roadCrossings));
  // Clear entire old root/reference groups when a bounded patch or frontage
  // intersects them. The old gallery clear/road helpers erase individual cells;
  // clipping a large neighbor can otherwise leave an invalid old save record.
  const touched=(x,y)=>patches.some(p=>x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h)||roads.some(p=>p[0]===x&&p[1]===y);
  const oldGroups=new Map();for(let i=0;i<before.length;i++){const b=before[i].bld;if(!b)continue;const root=b.ref?b.ref[1]*seeded.N+b.ref[0]:i;if(!oldGroups.has(root))oldGroups.set(root,[]);oldGroups.get(root).push(i);}
  for(const [root,cells]of oldGroups){const b=before[root]?.bld;if(!b||b.ref)throw Error('Original showcase orphan root '+root);const x=root%seeded.N,y=Math.floor(root/seeded.N),sz=Math.max(1,b.sz||1);for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++){const i=(y+dy)*seeded.N+x+dx;if(!cells.includes(i))cells.push(i);}}
  const clearedRoots=[];GV.innovationSetQA507({money:99999999,rank:25,tech:false});
  for(const [root,cells]of oldGroups){if(!cells.some(i=>touched(i%seeded.N,Math.floor(i/seeded.N))))continue;const x=root%seeded.N,y=Math.floor(root/seeded.N),b=before[root]?.bld;if(!b||b.ref)throw Error('Original showcase contains orphan reference root '+root);if(!GV.place('doze',x,y))throw Error('Cannot clear intersecting whole fixture root '+root);if(cells.some(i=>GV.tile(i%seeded.N,Math.floor(i/seeded.N)).bld))throw Error('Whole fixture demolition left reference cells '+root);clearedRoots.push({root,x,y,k:b.k,cells:cells.length});}
  for(const p of patches)GV.art574.clear574(p.x,p.y,p.w,p.h);
  const planted=GV.art574.plant574([...targets,...benchmarks].map(q=>({...q,lv:1,v:0})));
  GV.art574.road577(roads);for(const t of [...targets,...benchmarks])for(let dy=0;dy<t.sz;dy++)for(let dx=0;dx<t.sz;dx++){const b=GV.tile(t.x+dx,t.y+dy).bld;if(!b||b.k!==t.k||(dx+dy>0&&(!b.ref||b.ref[0]!==t.x||b.ref[1]!==t.y)))throw Error('Fixture footprint damaged '+t.k+' '+dx+','+dy);}GV.testRebake592();
  const after=all(),clearedRootSet=new Set(clearedRoots.map(q=>q.root)),structural=b=>b?[b.k,b.lv,b.v,b.age,b.sz||1]:null,untouchedOldRoots=before.flatMap((t,i)=>t.bld&&!t.bld.ref&&!clearedRootSet.has(i)?[{root:i,before:structural(t.bld),after:structural(after[i]?.bld)}]:[]);
  const changedRetainedRoots=untouchedOldRoots.filter(q=>JSON.stringify(q.before)!==JSON.stringify(q.after));if(changedRetainedRoots.length)throw Error('Fixture changed an old root outside declared removals: '+JSON.stringify(changedRetainedRoots));
  const unchangedRoots=untouchedOldRoots.length;let changedTiles=0;for(let i=0;i<before.length;i++)if(JSON.stringify(before[i])!==JSON.stringify(after[i]))changedTiles++;
  const footprintIntegrity={roots:0,references:0,issues:[]};for(let i=0;i<after.length;i++){const b=after[i].bld;if(!b)continue;const x=i%seeded.N,y=Math.floor(i/seeded.N);if(b.ref){footprintIntegrity.references++;const [rx,ry]=b.ref,owner=after[ry*seeded.N+rx]?.bld,n=owner?.sz||1;if(rx<0||ry<0||rx>=seeded.N||ry>=seeded.N||!owner||owner.ref||owner.k!==b.k||x<rx||y<ry||x>=rx+n||y>=ry+n)footprintIntegrity.issues.push({i,reason:'invalid-reference',b});}else{footprintIntegrity.roots++;const n=b.sz||1;for(let dy=0;dy<n;dy++)for(let dx=0;dx<n;dx++){const q=after[(y+dy)*seeded.N+x+dx]?.bld;if(x+dx>=seeded.N||y+dy>=seeded.N||!q||q.k!==b.k||((dx||dy)&&(!q.ref||q.ref[0]!==x||q.ref[1]!==y)))footprintIntegrity.issues.push({root:i,cell:[x+dx,y+dy],reason:'incomplete-footprint'});}}}if(footprintIntegrity.issues.length)throw Error('Fixture root/reference integrity: '+JSON.stringify(footprintIntegrity.issues.slice(0,20)));
  const storage=()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
  const windowKeys=['__waterF695','__noSignal','__nightOccNoErase629','__ovCap606','__ovCapMax606','__ovCapAll608','__x13Frac','__x13SyncProf'];
  const Q=window.__residential006QA={targets,benchmarks,N:seeded.N,all,storage,world:()=>JSON.stringify({tiles:all(),stats:GV.stats()}),live:new Map(),
    baselineStorage:JSON.stringify(storage()),canonical:new Map(targets.map(t=>[t.id,GV.art574.SPR().bld[t.k+'_1_0']])),
    baselineFP:GV.fp536(),baselineKeys:Object.keys(GV.art574.SPR().bld).sort(),valves:windowKeys.map(k=>[k,Object.prototype.hasOwnProperty.call(window,k),window[k]])};
  window.__waterF695=0;window.__noSignal=true;
  for(const id of['start','startOverlay456']){const el=document.getElementById(id);if(el){el.style.display='none';el.classList.remove('show');}}
  GV.selectTool434('pan');
  return {seeded,planted,patches,clearedRoots,changedRetainedRoots,footprintIntegrity,unchangedExistingRootContract:'Every non-demolished old root retains exact index/k/lv/v/age/size; utility flags may legitimately recompute during ordinary demolition.',unchangedExistingRoots:unchangedRoots,changedFixtureTiles:changedTiles,storageKeys:Object.keys(storage()),
    targets:targets.map(t=>({...t,root:GV.tile(t.x,t.y).bld,refs:Array.from({length:t.sz*t.sz},(_,i)=>GV.tile(t.x+i%t.sz,t.y+Math.floor(i/t.sz)).bld)}))};
}
function buildFixtureUtilities(){
  const Q=window.__residential006QA;
  if(window.__residentialQA006!==true||localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable utility fixture guard failed');
  const placed=[],skipped=[],place=(tool,x,y)=>{
    const preview=GV.placePreview459(tool,x,y);
    if(!preview?.ok||!GV.place(tool,x,y))throw Error('Real fixture placement failed '+tool+' '+x+','+y+': '+JSON.stringify(preview));
    placed.push({tool,x,y,cost:preview.cost});
  };
  const land=(x,y)=>{const t=GV.tile(x,y);if(t.t===0)place('tland',x,y);return GV.tile(x,y).t!==3;};
  const road=(x,y)=>{const t=GV.tile(x,y);if(!t.road)place('road',x,y);};
  const pipe=(x,y)=>{if(!land(x,y))throw Error('Unexpected mountain under utility pipe '+x+','+y);if(!GV.tile(x,y).wp)place('wpipe',x,y);};
  GV.innovationSetQA507({money:99999999,rank:25,tech:false});
  // The seeded k136 footprint at (38,13), size5, severs row13. Its eastern
  // stub cannot connect the old city by itself. Join every actual x47 boundary
  // road to x49 through the clear x48 seam; no existing building is removed.
  const boundaryLinks=[];
  for(let y=1;y<=37;y++)if(GV.tile(47,y).road){road(48,y);boundaryLinks.push({x:48,y,from:[47,y],to:[49,y]});}
  for(let x=49;x<=69;x++)road(x,13);
  for(let y=1;y<=37;y++)for(const x of[49,53,57,61,65,69])road(x,y);
  for(let y=1;y<=37;y+=4)for(let x=49;x<=69;x++)road(x,y);
  // Independent read-only BFS on actual road tiles records a witness path to
  // each target's footprint frontage before generation or save/load can mask it.
  const roadTopology=()=>{
    const tiles=Q.all(),start=13*Q.N+49,previous=new Int32Array(tiles.length);previous.fill(-1);previous[start]=start;
    const queue=[start];for(let head=0;head<queue.length;head++){const i=queue[head],x=i%Q.N,y=Math.floor(i/Q.N);
      for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=Q.N||yy>=Q.N)continue;const j=yy*Q.N+xx;if(tiles[j].road&&previous[j]<0){previous[j]=i;queue.push(j);}}}
    const targets=Q.targets.map(t=>{const frontage=[];for(let d=0;d<t.sz;d++)frontage.push([t.x+d,t.y-1],[t.x+d,t.y+t.sz],[t.x-1,t.y+d],[t.x+t.sz,t.y+d]);
      const reachable=frontage.map(([x,y])=>y*Q.N+x).filter(i=>tiles[i]?.road&&previous[i]>=0),end=reachable[0],path=[];
      if(end!==undefined){let i=end;while(i!==start){path.push([i%Q.N,Math.floor(i/Q.N)]);i=previous[i];}path.push([49,13]);path.reverse();}
      return{id:t.id,connected:reachable.length>0,frontage:reachable.map(i=>[i%Q.N,Math.floor(i/Q.N)]),path};});
    return{ok:targets.every(t=>t.connected),start:[49,13],reachableRoads:queue.length,boundaryLinks,targets};
  };
  const topology=roadTopology(),capacitySteps=[];
  if(!topology.ok)return{ok:false,failure:'No actual road path from eastern utility strip to target frontage',sources:0,towers:[],placed,skipped,topology};
  let power=null,sources=0;
  outer:for(let y=2;y<=34;y+=4)for(const x of[50,54,58,62,66]){
    const cells=[];for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)cells.push([x+dx,y+dy]);
    if(cells.some(([xx,yy])=>{const t=GV.tile(xx,yy);return t.t===3||t.bld||t.road||t.rail||t.tram;})){skipped.push({x,y,reason:'existing terrain or occupied plot'});continue;}
    for(const [xx,yy]of cells)land(xx,yy);
    place('nuclear',x,y);sources++;power=GV.t471();
    const loads=Q.targets.map(t=>({id:t.id,pw:!!GV.tile(t.x,t.y).bld?.pw,load:GV.powerAt471(t.x,t.y)?.load}));
    capacitySteps.push({sources,x,y,available:power.available,demand:power.demand,peak:power.peak,loads});
    if(loads.some(t=>t.load?.pool<0||t.load?.district<0||!t.load))return{ok:false,failure:'Connected road witness did not produce actual target power district/pool',sources,towers:[],placed,skipped,topology,capacitySteps,power};
    if(power.available>=Math.max(600,power.demand*1.6)&&loads.every(t=>t.pw))break outer;
    if(sources>=25)break outer;
  }
  if(!sources)throw Error('No real generation plot could be placed in bounded eastern utility strip');
  // Ten ordinary towers feed a pipe-only local service corridor. Existing road
  // and building identities remain intact; capacity is never injected.
  for(let x=8;x<=49;x++)pipe(x,13);
  for(let y=1;y<=37;y++)pipe(49,y);
  for(const x of[6,16,18,24,30])for(let y=13;y<=37;y++)pipe(x,y);
  for(const y of[16,19,22,25,28,31,34])for(let x=6;x<=34;x++)pipe(x,y);
  const towers=[];for(const y of[2,4,8,10,14,16,20,22,26,28]){
    const x=48;if(!land(x,y)||GV.tile(x,y).bld){skipped.push({x,y,reason:'water tower terrain unavailable'});continue;}
    place('water',x,y);towers.push({x,y});
  }
  GV.recomputePower450();power=GV.t471();GV.recomputeWater449();const water=GV.t472();GV.testRebake592();
  const targets=Q.targets.map(t=>{const root=GV.tile(t.x,t.y).bld,p=GV.powerAt471(t.x,t.y),pool=power.pools.find(q=>q.id===p?.load?.pool);
    return{id:t.id,root,power:p,pool,ok:!!root?.pw&&p?.load?.root===t.y*Q.N+t.x&&p.load.pool>=0&&p.load.district>=0&&!!pool&&pool.evening.available>=pool.evening.demand};});
  const localNeighbors=[];for(let y=9;y<=33;y++)for(let x=3;x<=34;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&b.k<=3){const i=y*Q.N+x,load=power.loads.find(q=>q.root===i);localNeighbors.push({i,x,y,k:b.k,pw:!!b.pw,wa:!!b.wa,pool:load?.pool??-1,district:load?.district??-1,eligible:!!load&&load.pool>=0&&load.district>=0});}}
  const eligibleNeighbors=localNeighbors.filter(b=>b.eligible),disconnectedBackground=localNeighbors.filter(b=>!b.eligible);
  const result={ok:topology.ok&&targets.every(t=>t.ok)&&eligibleNeighbors.length>30&&eligibleNeighbors.every(b=>b.pw),bounds:{x0:48,y0:1,x1:70,y1:38},sources,towers,placed,skipped,topology,capacitySteps,targets,localNeighbors,eligibleNeighbors,disconnectedBackground,power,water,
    method:'Existing normal GV.placePreview459 + GV.place for roads, terrain fill, nuclear sources, water towers and pipes. No root utility flags, source capacities or dispatch results are assigned. Remote sources support the road-connected showcase; water service proof is local to the pipe corridor, not whole-city certification.'};
  Q.utilityFixture={sources,towers,placed:placed.length,eligibleNeighbors,disconnectedBackground};return result;
}
function loadedUtilityPreflight(){
  const Q=window.__residential006QA;
  if(!Q.savedTown?.loaded)throw Error('Actual loaded-town proof missing');
  const rootRows=()=>Q.all().flatMap((t,i)=>t.bld&&!t.bld.ref?[{i,k:t.bld.k,lv:t.bld.lv,v:t.bld.v,age:t.bld.age,pw:!!t.bld.pw,wa:!!t.bld.wa}]:[]);
  const beforeRoots=rootRows(),beforeDay=GV.stats().day,afterDay=GV.step(1);GV.setSpeed(0);GV.ai(false);
  // A real first simulation day updates building wa via the production tick.
  // Snapshot reads expose the actual dispatch and water-cycle authority.
  const afterRoots=rootRows(),bm=new Map(beforeRoots.map(b=>[b.i,b])),am=new Map(afterRoots.map(b=>[b.i,b]));
  const simulationChanges={beforeRoots:beforeRoots.length,afterRoots:afterRoots.length,removed:beforeRoots.filter(b=>!am.has(b.i)),added:afterRoots.filter(b=>!bm.has(b.i)),changed:afterRoots.filter(b=>bm.has(b.i)&&JSON.stringify(bm.get(b.i))!==JSON.stringify(b)).map(b=>({before:bm.get(b.i),after:b}))};
  const power=GV.t471(),water=GV.t472(),targets=Q.targets.map(t=>{
    const b=GV.tile(t.x,t.y).bld,p=GV.powerAt471(t.x,t.y),w=GV.waterAt472(t.x,t.y),pool=power.pools.find(q=>q.id===p?.load?.pool);
    const firstDayRoot=am.get(t.y*Q.N+t.x);
    return{id:t.id,k:t.k,firstDayRoot,root:b,power:p,water:w,pool,
      ok:!!firstDayRoot?.pw&&!!firstDayRoot?.wa&&!!b?.pw&&!!b?.wa&&p?.load?.root===t.y*Q.N+t.x&&p.load.pool>=0&&!!pool&&pool.evening.available>=pool.evening.demand&&w?.water?.code===4&&w.water.delivered>0};
  });
  const neighbors=[];for(let y=9;y<=33;y++)for(let x=3;x<=34;x++){const b=GV.tile(x,y).bld;if(b&&!b.ref&&b.k<=3)neighbors.push({x,y,k:b.k,pw:!!b.pw,wa:!!b.wa});}
  // Preserve the pre-save physically connected set. Dense showcase interior
  // roots outside ordinary radius2 were never utility claims; record them too.
  const eligibleNeighbors=(Q.utilityFixture?.eligibleNeighbors||[]).map(before=>{const firstDayRoot=am.get(before.i),root=GV.tile(before.x,before.y).bld,load=power.loads.find(q=>q.root===before.i);
    return{before,firstDayRoot,root,load,ok:before.pw&&firstDayRoot?.k===before.k&&!!firstDayRoot?.pw&&root?.k===before.k&&!root.ref&&!!root.pw&&!!load&&load.pool>=0&&load.district>=0};});
  Q.savedTown.postLoadSimulationDays=1;Q.savedTown.utilityProven=targets.every(t=>t.ok);Q.savedTown.utilitySourceCount=Q.utilityFixture?.sources;
  return{ok:afterDay===beforeDay+1&&targets.every(t=>t.ok)&&eligibleNeighbors.length>30&&eligibleNeighbors.every(b=>b.ok),beforeDay,afterDay,targets,simulationChanges,
    localNeighbors:neighbors,localPowered:neighbors.filter(b=>b.pw).length,eligibleNeighbors,disconnectedBackgroundBeforeSave:Q.utilityFixture?.disconnectedBackground||[],power,water,
    claims:'Sixteen loaded buildings have real stable water and served power. A fixed pre-save set of physically connected neighboring RCI roots retains identity and served power after the first loaded day. Other dense showcase interior roots remain honestly visible with their actual utility state; this is not whole-city utility certification.'};
}
function buildParity(archivedSource){
  const Q=window.__residential006QA,api=window.ResidentialArchitecture006;
  if(!api||typeof api.buildAll!=='function')throw Error('Missing normal ResidentialArchitecture006 API');
  const storage0=JSON.stringify(Q.storage()),world0=Q.world(),fp0=JSON.stringify(GV.fp536()),oldRandom=Math.random;
  const oldAPI=window.ResidentialSource006,oldOwn=Object.prototype.hasOwnProperty.call(window,'ResidentialSource006');
  let calls=0,first,second,archived,buildMs,rebuildMs;
  const pix=c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  const same=(a,b)=>!!a&&!!b&&a.width===b.width&&a.height===b.height&&pix(a).every((v,i)=>v===pixCache(b)[i]);
  const cache=new WeakMap(),pixCache=c=>{if(!cache.has(c))cache.set(c,pix(c));return cache.get(c);};
  Math.random=function(){calls++;return oldRandom.apply(this,arguments);};
  try{const t=performance.now();first=api.buildAll();buildMs=performance.now()-t;const t2=performance.now();second=api.buildAll();rebuildMs=performance.now()-t2;
    (0,eval)(archivedSource.replaceAll("ResidentialArchitecture006","ResidentialSource006"));archived=window.ResidentialSource006.buildAll();
  }finally{Math.random=oldRandom;if(oldOwn)window.ResidentialSource006=oldAPI;else delete window.ResidentialSource006;}
  const metrics=[];
  for(const t of Q.targets){const a=first.find(s=>s.id===t.id),b=second.find(s=>s.id===t.id),c=archived.find(s=>s.id===t.id),s=Q.canonical.get(t.id);
    if(!a||!b||!c||!s)throw Error('Missing canonical/renderer/reference asset '+t.id);
    const d=pix(s.img),n=pix(s.night);let solid=0,edge=0,lit=0,unsupported=0,outside=0,partial=0;
    for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=(y*s.w+x)*4,alpha=d[i+3];if(alpha>0&&alpha<255)partial++;if(alpha>120){solid++;if(x<=1||y<=1||x>=s.w-2||y>=s.h-2)edge++;}if(n[i+3]>0){lit++;if(!alpha)unsupported++;}
      if(alpha&&(Math.abs(x+.5-s.ax)>32*t.sz+1||y+.5>s.ay-Math.abs(x+.5-s.ax)/2+1))outside++;}
    metrics.push({id:t.id,k:t.k,w:s.w,h:s.h,ax:s.ax,ay:s.ay,sz:t.sz,solid,edge,lit,unsupported,outside,partial,
      metadata:s.__t547||null,canvasDimensions:[s.img.width,s.img.height,s.night.width,s.night.height],
      deterministic:same(a.img,b.img)&&same(a.night,b.night)&&a.img!==b.img&&a.night!==b.night,
      canonicalEqualsRenderer:same(s.img,a.img)&&same(s.night,a.night),canonicalEqualsSource:same(s.img,c.img)&&same(s.night,c.night),
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
  const Q=window.__residential006QA;
  if(window.__residentialQA006!==true||localStorage.getItem('glimmerville.v1.slot')!=='3')throw Error('Disposable save/load guard failed');
  GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.britishWeather004(0,0,0);
  const slots12=['glimmerville.v1.s1','glimmerville.v1.s1_bak','glimmerville.v1.s2','glimmerville.v1.s2_bak'];
  const otherBefore=slots12.map(k=>localStorage.getItem(k));
  const roots=()=>Q.all().flatMap((t,i)=>t.bld&&!t.bld.ref?[[i,t.bld.k,t.bld.lv,t.bld.age,t.bld.sz||1]]:[]);
  const before=roots(),saved=GV.save(),raw=localStorage.getItem('glimmerville.v1.s3'),data=raw&&JSON.parse(raw);
  if(!saved||!data||data.v!==1||!Array.isArray(data.bl))throw Error('Normal GV.save did not produce a valid slot-3 save');
  const loaded=GV.load();if(!loaded)throw Error('Normal GV.load rejected its fixture save');
  GV.setSpeed(0);GV.ai(false);GV.nightPowerTest698(null);GV.selectTool434('pan');GV.testRebake592();Q.live.clear();
  const after=roots(),targetResults=Q.targets.map(t=>{
    const root=GV.tile(t.x,t.y).bld,refs=Array.from({length:t.sz*t.sz},(_,i)=>GV.tile(t.x+i%t.sz,t.y+Math.floor(i/t.sz)).bld);
    const record=data.bl.find(b=>b[0]===t.y*Q.N+t.x);
    return{id:t.id,k:t.k,root,record,refs,ok:record?.[1]===t.k&&record[2]===1&&record[3]===0&&record[4]===30&&root?.k===t.k&&root.sz===t.sz&&root.lv===1&&root.v===0&&root.age===30&&refs.every((b,i)=>i===0?!b.ref:b?.k===t.k&&b.ref?.[0]===t.x&&b.ref?.[1]===t.y)};
  });
  const oldBefore=before.filter(b=>b[1]<246),oldAfter=after.filter(b=>b[1]<246);
  const beforeMap=new Map(before.map(r=>[r[0],r])),afterMap=new Map(after.map(r=>[r[0],r]));const rootEvidence=r=>{const i=r[0],x=i%Q.N,y=Math.floor(i/Q.N),tile=GV.tile(x,y),owner=tile?.bld?.ref,oi=owner?owner[1]*Q.N+owner[0]:null;return{before:r,x,y,savedRecord:data.bl.find(a=>a[0]===i)||null,loadedAtRoot:tile?.bld||null,replacementOwnerBefore:oi===null?null:beforeMap.get(oi)||null,replacementOwnerAfter:oi===null?null:afterMap.get(oi)||null};};
  Q.savedTown={loaded:true,slot:3,savedRootCount:data.bl.length,rootRecords:targetResults.map(t=>t.record)};
  // Runtime fields and existing RCI visual variants legitimately normalize on load.
  // Root coordinates, numeric identities, levels, ages and footprints must survive.
  return{saved:!!saved,loaded,slot:3,bytes:raw.length,version:data.v,mapSize:data.n,seed:data.seed,day:data.day,
    newRootRecordCount:data.bl.filter(b=>b[1]>=246&&b[1]<=261).length,targets:targetResults,
    rootsBefore:before.length,rootsAfter:after.length,existingRoots:oldBefore.length,
    missingRoots:before.filter(b=>!afterMap.has(b[0])).map(rootEvidence),addedRoots:after.filter(b=>!before.some(a=>a[0]===b[0])),changedRoots:before.flatMap(b=>{const a=after.find(a=>a[0]===b[0]);return a&&JSON.stringify(a)!==JSON.stringify(b)?[{before:b,after:a}]:[];}),
    rootIdentityAgeFootprintPreserved:JSON.stringify(before)===JSON.stringify(after),
    existingRootIdentityAgeFootprintPreserved:JSON.stringify(oldBefore)===JSON.stringify(oldAfter),
    otherPlayerSlotsUnchanged:slots12.every((k,i)=>localStorage.getItem(k)===otherBefore[i]),
    canonicalSpritesPreserved:Q.targets.every(t=>GV.art574.SPR().bld[t.k+'_1_0']===Q.canonical.get(t.id)),
    method:'One synchronous actual GV.save() then GV.load() transaction. No JSON/import replacement, reseed or replant after load. Subsequent actual-town PNGs render this loaded world.'};
}
function scene(arg){
  const Q=window.__residential006QA,t=arg.id&&Q.targets.find(t=>t.id===arg.id),s=t&&Q.canonical.get(t.id);
  if(typeof GV.britishWeather004!=='function')throw Error('Missing deterministic britishWeather004 fixture hook');
  const wx=arg.wx||'clear',weather=GV.britishWeather004(wx==='snow'?3:0,wx==='clear'?0:1,wx==='snow'?6:wx==='rain'?5:0);
  GV.setRot(arg.rot||0);GV.setZoom(arg.z);GV.setVisT(GV.art574.cycle574()*(arg.mode==='night'?.9:.5));
  if(t){const d=Math.round((s.ay-32*t.sz-s.h/2)/32),p=GV.w2v(t.x,t.y),world=GV.v2w(p[0]-d,p[1]-d);GV.lookAt(world[0],world[1]);}else if(arg.family){const row=Q.targets.filter(t=>t.family===arg.family);GV.lookAt(row.reduce((a,t)=>a+t.x,0)/row.length+1,row[0].y-1);}else GV.lookAt(14,23);
  window.__ovCapMax606=12000;window.__ovCap606=[];GV.forceDraw();const caps=window.__ovCap606.slice();window.__ovCap606=null;
  const c=document.getElementById('game'),g=c.getContext('2d'),camera=GV.camera436();
  const hits=Q.targets.map(q=>{const a=caps.find(a=>a.o.x===q.x&&a.o.y===q.y&&a.bd.k===q.k);if(!a)return{id:q.id,missing:true};Q.live.set(q.id,a.bd);
    let corner=null,dep=-Infinity;for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++){const p=GV.w2v(q.x+dx,q.y+dy),d=p[0]+p[1];if(d>=dep){dep=d;corner=p;}}
    const ex=Math.round(c.width/2-camera.x*arg.z)+(corner[0]-corner[1])*32*arg.z-a.s.ax*arg.z;
    const ey=Math.round(c.height/2-camera.y*arg.z)+(corner[0]+corner[1])*16*arg.z+(32-a.s.ay)*arg.z;
    return{id:q.id,k:q.k,powered:!!a.bd.pw,watered:!!a.bd.wa,bx:a.bx,by:a.by,z:a.z,width:a.s.w*a.z,height:a.s.h*a.z,depth:a.o.dep,canonicalIdentity:a.s===Q.canonical.get(q.id),
      anchorError:[a.bx-ex,a.by-ey],expected:[ex,ey],withinCanvas:a.bx>=0&&a.by>=0&&a.bx+a.s.w*a.z<=c.width&&a.by+a.s.h*a.z<=c.height};});
  const h=t&&hits.find(h=>h.id===t.id);if(t&&(!h||h.missing||!h.canonicalIdentity))throw Error('Normal sprite did not enter draw: '+t.id);
  const rect=h?{x:Math.max(0,Math.floor(h.bx-110)),y:Math.max(0,Math.floor(h.by-40)),w:0,h:0}:{x:0,y:0,w:c.width,h:c.height};
  if(h){rect.w=Math.min(c.width-rect.x,Math.ceil(h.width+220));rect.h=Math.min(c.height-rect.y,Math.ceil(h.height+145));}
  Q.lastRect=rect;Q.lastHit=h||null;Q.lastTargetRect=h?{x:Math.max(0,Math.floor(h.bx)),y:Math.max(0,Math.floor(h.by)),w:Math.ceil(h.width),h:Math.ceil(h.height)}:rect;Q.lastFull=c.toDataURL();const crop=document.createElement('canvas');crop.width=rect.w;crop.height=rect.h;crop.getContext('2d').drawImage(c,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);Q.lastCrop=crop.toDataURL();
  const neighbors=caps.filter(a=>!Q.targets.some(t=>t.k===a.bd.k&&t.x===a.o.x&&t.y===a.o.y)&&a.bx+a.s.w*a.z>rect.x&&a.bx<rect.x+rect.w&&a.by+a.s.h*a.z>rect.y&&a.by<rect.y+rect.h).map(a=>({k:a.bd.k,x:a.o.x,y:a.o.y,depth:a.o.dep}));
  return{...arg,savedTown:Q.savedTown||null,weather,actualRotation:GV.rot(),daylight:GV.daylightDbg(),hits,rect,canvas:{w:c.width,h:c.height},existingNeighbors:[...new Map(neighbors.map(n=>[n.x+','+n.y,n])).values()],nightComposition:{...window.__t629},weatherCaches:t?{snow:!!s.snow,wet:!!s.wet,icicle:!!s.icicle}:null};
}
function lampProbe(id){
  const Q=window.__residential006QA,s=Q.canonical.get(id),c=document.getElementById('game'),g=c.getContext('2d'),old=s.night;
  const own=Object.prototype.hasOwnProperty.call(window,'__nightOccNoErase629'),val=window.__nightOccNoErase629;
  const empty=document.createElement('canvas');empty.width=s.w;empty.height=s.h;
  const shot=(on,erase)=>{s.night=on?old:empty;window.__nightOccNoErase629=!erase;GV.forceDraw();return g.getImageData(0,0,c.width,c.height).data;};
  try{const on=shot(true,true),off=shot(false,true),uoff=shot(false,false),uon=shot(true,false);Q.lastDiagnostic=c.toDataURL();let changed=0,candidate=0,blocked=0,visible=0;
    for(let i=0;i<on.length;i+=4){let normal=0,unmasked=0;for(let k=0;k<3;k++){normal+=Math.abs(on[i+k]-off[i+k]);unmasked+=Math.abs(uon[i+k]-uoff[i+k]);}if(normal>3)changed++;if(unmasked>9){candidate++;if(normal<=3)blocked++;if(normal>9)visible++;}}
    return{changedPixels:changed,candidateLightPixels:candidate,fullyBlockedLightPixels:blocked,visibleLightPixels:visible,method:'Own night on/off × normal erasure on/off, four same-turn real draws; canonical night reference restored in finally.'};
  }finally{s.night=old;if(own)window.__nightOccNoErase629=val;else delete window.__nightOccNoErase629;GV.forceDraw();}
}
function constructionFrame(id,p,mode){
  const Q=window.__residential006QA,t=Q.targets.find(t=>t.id===id),s=Q.canonical.get(id),b=Q.live.get(id);if(!b)throw Error('No previously captured live root for '+id);
  const oldAge=b.age,oldPower=b.pw,oldFrac=window.__x13Frac,oldSync=window.__x13SyncProf;
  try{GV.britishWeather004(0,0,0);GV.setVisT(GV.art574.cycle574()*(mode==='night'?.9:.5));b.age=Math.floor(p);window.__x13Frac=p-Math.floor(p);window.__x13SyncProf=1;
    for(let i=0;i<8;i++){GV.forceDraw();if(GV.constr13.pending())GV.constr13.flush();}
    const c=document.getElementById('game'),g=c.getContext('2d'),box=Q.lastRect,snap=()=>g.getImageData(box.x,box.y,box.w,box.h).data,whole=()=>g.getImageData(0,0,c.width,c.height).data,a=snap(),aWhole=whole();Q.lastFull=c.toDataURL();
    const delta=(u,v)=>{let n=0;for(let i=0;i<u.length;i+=4)if(u[i]!==v[i]||u[i+1]!==v[i+1]||u[i+2]!==v[i+2])n++;return n;};
    GV.forceDraw();const diff=delta(a,snap());let completionDelta=null,nightCompletion=null;
    if(p===8.999){
      b.age=9;window.__x13Frac=0;GV.forceDraw();const completed=snap();completionDelta=delta(a,completed);
      if(mode==='night'){
        b.pw=false;GV.forceDraw();const completedUnpowered=snap();
        b.age=8;window.__x13Frac=.999;GV.forceDraw();const beforeUnpowered=snap();
        const beforeUnpoweredWhole=whole(),hit=Q.lastHit,z=hit.z,shH=Math.max(2,s.h*z*.32),expected=[hit.bx+16*z,hit.by+s.h*z-shH+8*z,s.w*z,shH];
        const d=GV.daylightDbg(),nd=Math.max(0,Math.min(1,(.72-d.b)/.38)),expectedAlpha=.30*(.3+.7*(1-nd));
        const noShadow=(age,frac)=>{
          const desc=Object.getOwnPropertyDescriptor(g,'drawImage'),original=g.drawImage,hits=[];
          b.age=age;window.__x13Frac=frac;
          g.drawImage=function(...args){
            if(this===g&&args.length===5&&args[0]===s.img&&this.filter==='brightness(0)'&&Math.abs(this.globalAlpha-expectedAlpha)<1e-8&&args.slice(1).every((v,i)=>Math.abs(v-expected[i])<1e-6)){
              hits.push({filter:this.filter,alpha:this.globalAlpha,args:args.slice(1)});return;
            }
            return original.apply(this,args);
          };
          try{GV.forceDraw();return{pixels:snap(),full:whole(),hits};}
          finally{if(desc)Object.defineProperty(g,'drawImage',desc);else delete g.drawImage;}
        };
        const unpoweredBeforeNoShadow=noShadow(8,.999),unpoweredCompletedNoShadow=noShadow(9,0);
        nightCompletion={powerBefore:!!oldPower,unpoweredConvergenceDelta:delta(beforeUnpowered,completedUnpowered),
          beforeCompletionPowerDelta:delta(a,beforeUnpowered),beforeCompletionPowerWholeDelta:delta(aWhole,beforeUnpoweredWhole),
          completedPowerDelta:delta(completed,completedUnpowered),legacyShadowDelta:delta(completedUnpowered,unpoweredCompletedNoShadow.pixels),
          exactGeometryWholeDelta:delta(unpoweredBeforeNoShadow.full,unpoweredCompletedNoShadow.full),
          exactGeometryRGBEqual:unpoweredBeforeNoShadow.full.every((v,i)=>i%4===3||v===unpoweredCompletedNoShadow.full[i]),
          diagnosticBeforeMatchesRaw:delta(beforeUnpoweredWhole,unpoweredBeforeNoShadow.full)===0,
          shadowInterceptions:{before:unpoweredBeforeNoShadow.hits,completed:unpoweredCompletedNoShadow.hits,expected,expectedAlpha},
          method:'Raw normal captures are unchanged. Full-RGB P8.999/age9 equality is tested with only root power off and only this root canonical img brightness(0) T149 flattened shadow call suppressed, matching exact source, filter, coordinates, size and alpha. Exactly zero interceptions before completion and one after are required. Instance drawImage and root power/age are restored in finally. Existing completed lighting and T149 night-shadow activation are separately measured; no production art change.'};
        b.pw=oldPower;
      }
    }
    let signature=2166136261;for(const n of a){signature^=n;signature=Math.imul(signature,16777619);}signature=(signature>>>0).toString(16);
    const M=GV.constr13.profile(s,b);return{id,progress:p,mode,stableDiff:diff,completionDelta,nightCompletion,signature,comparisonBox:box,profile:M?{src:M.src,sz:M.sz,area:M.area,method:M.method,roof:M.roof,masses:M.ms?.length,silhouette:!!M.sil}:null,stats:{...GV.constr13.stats()},root:{k:b.k,sz:b.sz,age:Math.floor(p)}};
  }finally{b.age=oldAge;b.pw=oldPower;window.__x13Frac=oldFrac;window.__x13SyncProf=oldSync;GV.forceDraw();}
}
async function cleanup(){
  const Q=window.__residential006QA;if(!Q)return{missing:true};
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
function scoreStyle006(f){const L=Math.max(1,f.leaves),op=Math.max(1,f.op),axes=[Math.min(1,f.colors/L/16),Math.max(0,1-Math.min(1,f.semi/op*20)),f.leftLit/L,Math.max(0,Math.min(1,(f.buckets/L-2)/4)),Math.min(1,(f.colors/op)*100/4),.5*f.nightLeaves/L+.5*(f.nightOp>0?1-f.nightViol/f.nightOp:1),Math.min(1,f.leaves/8)];return {axes,total:+(axes.reduce((a,b)=>a+b,0)/7).toFixed(4)};}
(async()=>{
  const protectedPaths=['fp.json','style.json','AUTORUN-LOG.md','docs/DECISIONS.md','british-prototypes-art.js','british-high-street-art.js'];
  for(const f of protectedPaths){const old=execFileSync('git',['show',PINNED_BASE+':'+f],{cwd:ROOT,maxBuffer:8*1024*1024});check('protected '+f+' exact T718 bytes',sha(old)===sha(fs.readFileSync(path.join(ROOT,f))));}
  for(const text of ["const GAME_VER='14.22'","const GAME_ANCHOR='T718'",'id="startVersion456">v14.22 · T718'])check('unchanged release metadata '+text,html.toString().split(text).length===2);
  const priorHighStreet=x=>x.slice(x.indexOf('<!-- GPT-005 native high-street art BEGIN'),x.indexOf('<!-- GPT-005 native high-street art END')+1);
  check('approved T718 embedded generator unchanged',priorHighStreet(baseHTML).length>50000&&priorHighStreet(baseHTML)===priorHighStreet(html.toString()));
  const oldArt=x=>x.slice(x.indexOf('<!-- GPT-004 approved British art BEGIN'),x.indexOf('<!-- GPT-004 approved British art END')+1);
  check('approved T717 British embedded generator unchanged',oldArt(baseHTML).length>20000&&oldArt(baseHTML)===oldArt(html.toString()));
  check('existing T700 worker renderer remains source-pinned',sha(workerSource)===APPROVED_WORKER_SHA256);
  check('exact workflow SHA',checkedSHA===process.env.GITHUB_SHA,{checkedSHA,workflowSHA:process.env.GITHUB_SHA});
  const declared=[...fs.readFileSync(path.join(ROOT,'residential-gameplay-probe006.js'),'utf8').matchAll(/\bgroup\('([^']+)'/g)].map(m=>m[1]).filter(n=>n!=='cleanup').sort();
  check('all intended gameplay groups explicitly scheduled',JSON.stringify(declared)===JSON.stringify([...GAMEPLAY_GROUPS].sort()),{declared,GAMEPLAY_GROUPS});
  if(report.failures.length)throw Error('Static contract failed before boot');
  const wallStart=Date.now();progress('browser boot requested',{checkedSHA,MODE});
  const watchdog=(label,ms)=>{const t=setTimeout(()=>{report.ok=false;report.failures.push(label+' exceeded '+ms+'ms; evidence process aborted before runner deadline');save();console.error(label+' watchdog expired');process.exit(124);},ms);t.unref();return t;};
  const sessionWatch=watchdog('evidence session',MODE==='preflight'?20*60000:35*60000),bootWatch=watchdog('game boot',180000);
  const result=await withGame({port:8199,timeout:1800,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
    clearTimeout(bootWatch);let stalled=false,bootFP;
    const rpc=async(method,params={},label=method,ms=180000)=>{if(stalled)throw Error('CDP previously stalled');let timer;try{return await Promise.race([cdp.send(method,params),new Promise((_,reject)=>{timer=setTimeout(()=>{stalled=true;reject(Error('CDP deadline: '+label));},ms);})]);}finally{clearTimeout(timer);}};
    const ev=async(expression,label='evaluate',ms=180000)=>{if(stalled)throw Error('CDP previously stalled');let timer;const t=Date.now();progress('start',{label});try{const r=await Promise.race([cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}),new Promise((_,reject)=>{timer=setTimeout(()=>{stalled=true;reject(Error('CDP deadline: '+label));},ms);})]);if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);progress('done',{label,ms:Date.now()-t});return r.result.value;}finally{clearTimeout(timer);}};
    const call=(fn,...args)=>ev('('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')',fn.name);
    const browserShot=async(rel)=>{const q=await rpc('Page.captureScreenshot',{format:'png'},'viewport '+rel);png(rel,'data:image/png;base64,'+q.data,{kind:'actual browser screenshot'});};
    const output=async(arg,stem,arr)=>{const q=await ev('(()=>{const r=('+scene.toString()+')('+JSON.stringify(arg)+');return{r,full:window.__residential006QA.lastFull,crop:window.__residential006QA.lastCrop};})()','capture '+stem);const r=q.r;png('full/'+stem+'.png',q.full,{kind:'actual loaded game canvas',...arg});png('crops/'+stem+'.png',q.crop,{kind:'unaltered crop',...arg,rect:r.rect});check(stem+' correct camera/daylight',r.actualRotation===(arg.rot||0)&&(arg.mode==='day'?r.daylight.b>.95:r.daylight.b<.45));if(arg.id){const h=r.hits.find(h=>h.id===arg.id);check(stem+' canonical asset, in frame and exact footprint anchor',h?.canonicalIdentity&&h.withinCanvas&&h.anchorError.every(x=>Math.abs(x)<1e-5),h);}arr.push({stem,...r});save();return r;};
    try{
      await rpc('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
      report.boot=await ev('({ready:!!window.__bootDone453,slot:localStorage.getItem("glimmerville.v1.slot"),version:GV.ver(),batches:window.__t574,highstreet:window.__residentialArt006,elapsedMs:performance.now()})','boot');report.boot.wallMs=Date.now()-wallStart;check('ordinary ready boot slot3',report.boot.ready&&report.boot.slot==='3'&&report.boot.version===RELEASE_VERSION,report.boot);check('asset batches error-free',!(report.boot.batches?.err||[]).length,report.boot.batches?.err);
      report.selftest=await ev('({new:GV.residentialSelftest006(),prior:GV.britishSelftest004(),highstreet:GV.highStreetSelftest005()})','selftests');check('new and all eleven approved British smoke selftests',report.selftest.new.ok&&report.selftest.prior.ok&&report.selftest.highstreet.ok,report.selftest);
      await ev('window.__residentialQA006=true;window.__britishQA004=true;window.__highStreetQA005=true;1');
      if(MODE==='gameplay'||MODE==='preflight'){
        report.gameplay=[];for(const name of MODE==='gameplay'?GAMEPLAY_GROUPS:GAMEPLAY_GROUPS.slice(0,2)){const q=await ev('GV.residentialGameplayProbe006('+JSON.stringify(name)+')','gameplay '+name,300000);report.gameplay.push({name,...q});check('gameplay '+name,q.ok&&q.details?.length>2&&q.groups?.some(g=>g.name===name&&g.ran&&!g.skipped&&g.ok),q);save();if(!q.ok)throw Error('Gameplay group failed: '+name);}
        if(MODE==='gameplay'){report.legacyGameplay=[];for(const name of LEGACY_GROUPS){const q=await ev('GV.britishGameplayProbe004('+JSON.stringify(name)+')','prior T717 '+name,300000);report.legacyGameplay.push({name,...q});check('prior T717 '+name,q.ok&&q.details?.length>2,q);save();}report.priorHighstreet=[];for(const name of ['catalog-unlock-rejection', 'placement-inspector-undo', 'construction-day-nine', 'perimeter-real-utilities', 'utility-loss', 'public-workforce-budget', 'coverage-symmetry', 'save-load-identities', 'commerce-supply-tax-mobility', 'offline-upkeep']){const q=await ev('GV.highStreetGameplayProbe005('+JSON.stringify(name)+')','prior T718 '+name,300000);report.priorHighstreet.push({name,...q});check('prior T718 '+name,q.ok&&q.details?.length>2,q);save();}check('all gameplay groups ran',report.gameplay.length===GAMEPLAY_GROUPS.length&&report.legacyGameplay.length===LEGACY_GROUPS.length&&report.priorHighstreet.length===10);return true;}
      }
      bootFP=await ev('GV.fp536()','boot fingerprints',300000);
      if(MODE==='preflight'){
        const blocks=await ev('GV.blockFp536()','all legacy block fingerprints',300000);report.fingerprint=compareFingerprint(bootFP,blocks);fs.writeFileSync(path.join(OUT,'guards','fingerprint-current.json'),JSON.stringify({checkedSHA,fp:bootFP,blocks},null,2));
        const raw=await ev('GV.style536()','all-family style score',300000),prior=JSON.parse(fs.readFileSync(path.join(ROOT,'style.json'),'utf8'));report.style={drops:[],bld:null};for(const [k,v]of Object.entries(raw.families||{})){const n=scoreStyle006(v),p=prior.families?.[k];if(p&&n.total<p.total-1e-6)report.style.drops.push({family:k,before:p.total,after:n.total});if(k==='bld')report.style.bld={before:p,after:n,raw:v};}check('all-family style ratchet including new bld',raw.ok&&report.style.drops.length===0,report.style.drops);
      }
      report.fixtureResult=await call(prepareFixture,TARGETS,BENCHMARKS);check('bounded patches retain existing town',report.fixtureResult.unchangedExistingRoots>100,report.fixtureResult);
      report.parity=await call(buildParity,art);check('synchronous deterministic art purity',report.parity.pure.mathRandomCalls===0&&report.parity.pure.worldUnchanged&&report.parity.pure.storageUnchanged&&report.parity.pure.fingerprintUnchanged,report.parity.pure);
      for(const m of report.parity.metrics){const t=TARGETS.find(t=>t.id===m.id);png('assets/'+m.id+'-day.png',m.day,{kind:'canonical game sprite',id:m.id});png('assets/'+m.id+'-night.png',m.night,{kind:'canonical emissive layer',id:m.id});delete m.day;delete m.night;check(m.id+' canonical source parity and independent repeat',m.canonicalEqualsSource&&m.canonicalEqualsRenderer&&m.deterministic,m);check(m.id+' exact anchor/dimensions and supported hard pixels',['w','h','ax','ay','sz'].every(k=>t[k]===m[k])&&m.solid>0&&m.lit>0&&m.edge===0&&m.unsupported===0&&m.outside===0&&m.partial===0,m);}
      save();if(report.failures.length)throw Error('Core asset preflight failed before city matrix');
      report.utilityFixture=await call(buildFixtureUtilities);check('real topology and power before save',report.utilityFixture.ok,report.utilityFixture);save();if(!report.utilityFixture.ok)throw Error('Utility topology failed');
      report.savedTown=await call(saveLoadFixture);check('normal slot3 save/load all sixteen IDs and footprints',report.savedTown.loaded&&report.savedTown.newRootRecordCount===16&&report.savedTown.targets.every(t=>t.ok),report.savedTown);check('normal save preserves pre-existing identities and owner slots',report.savedTown.existingRoots>100&&report.savedTown.rootIdentityAgeFootprintPreserved&&report.savedTown.existingRootIdentityAgeFootprintPreserved&&report.savedTown.otherPlayerSlotsUnchanged&&report.savedTown.canonicalSpritesPreserved,report.savedTown);
      report.utilityAfterLoad=await call(loadedUtilityPreflight);check('one normal loaded day retains real served power/water and prior neighbor power',report.utilityAfterLoad.ok,report.utilityAfterLoad);save();if(report.failures.length)throw Error('Loaded utility preflight failed');
      if(MODE==='preflight'){
        for(const t of TARGETS)for(const mode of['day','night']){await output({id:t.id,z:2,rot:0,mode},t.id+'-'+mode,report.samples);if(mode==='night'){const lamps=await call(lampProbe,t.id);check(t.id+' authored lamps contribute at night',lamps.changedPixels>0,lamps);}}
        for(const family of ['georgian','victorian','village','workers'])for(const mode of ['day','night']){const q=await output({family,z:1.8,rot:0,mode},family+'-street-'+mode,report.town);const row=q.hits.filter(h=>TARGETS.find(t=>t.id===h.id)?.family===family);check(family+' '+mode+' coherent four-module street visible',row.length===4&&row.every(h=>h.canonicalIdentity&&h.withinCanvas),row);}
        for(const mode of['day','night']){const q=await output({z:.75,rot:0,mode},'town-'+mode,report.town);check('town '+mode+' sixteen canonical loaded buildings visible',q.hits.length===16&&q.hits.every(h=>h.canonicalIdentity&&h.withinCanvas),q.hits);}
        report.performance=await ev(`(()=>{const Q=window.__residential006QA,measure=()=>{for(let i=0;i<3;i++)GV.forceDraw();const a=[];for(let i=0;i<9;i++){const t=performance.now();GV.forceDraw();a.push(performance.now()-t);}a.sort((a,b)=>a-b);return{medianMs:a[4],minMs:a[0],maxMs:a[8],samples:a};};const withBuildings=measure();if(!GV.save())throw Error('Performance restore save failed');let removed=0;try{for(const t of Q.targets){if(!GV.place('doze',t.x,t.y))throw Error('Performance removal failed '+t.id);removed++;}GV.testRebake592();const withoutBuildings=measure();return{withBuildings,withoutBuildings,deltaMedianMs:withBuildings.medianMs-withoutBuildings.medianMs,removed,method:'Nine warm draws in the exact same loaded town/camera, before and after normal demolition of the sixteen new roots. Product assets unchanged. This disposable slot3 save is normally loaded in finally; no live player data.'};}finally{if(!GV.load())throw Error('Performance restore load failed');GV.setSpeed(0);GV.ai(false);GV.step(1);GV.setSpeed(0);GV.testRebake592();}})()`,'bounded warmed town draw measurement',300000);
        check('performance fixture restored real sixteen roots',await ev('window.__residential006QA.targets.every(t=>GV.tile(t.x,t.y).bld?.k===t.k)'),report.performance);
        report.catalog=[];await ev('GV.innovationSetQA507({money:9999999,rank:25,tech:false});1');
        for(const t of TARGETS){const q=await ev(`(()=>{(document.querySelector('.catalog458Btn')||document.getElementById('catalogOpen458')).click();const i=document.getElementById('catalogSearch458');i.value=${JSON.stringify(t.tool)};i.dispatchEvent(new Event('input',{bubbles:true}));const c=document.querySelector('[data-card458="${t.tool}"]');c?.scrollIntoView({block:'center'});return{ok:!!c,open:document.getElementById('buildCatalog458').classList.contains('show'),text:c?.textContent};})()`,'catalog '+t.tool);check(t.tool+' normal searchable catalog card',q.ok&&q.open,q);report.catalog.push(q);await browserShot('browser/'+t.id+'-catalog.png');await ev('document.getElementById("catalogClose458").click();1');}
      }else if(/^camera[0-3]$/.test(MODE)){
        const rotations=[Number(MODE.slice(-1))];for(const rot of rotations)for(const t of TARGETS)for(const z of[1.2,2])for(const mode of['day','night'])await output({id:t.id,z,mode,rot},`${t.id}-r${rot}-z${z}-${mode}`,report.samples);
        check('complete shard camera matrix',report.samples.length===64);
        }else if(MODE==='weather'){for(const wx of['rain','snow'])for(const t of TARGETS)for(const mode of['day','night']){const q=await output({id:t.id,z:2,mode,rot:0,wx},`${t.id}-${wx}-${mode}`,report.weather);check(t.id+' '+wx+' existing material cache applied',wx==='snow'?q.weatherCaches.snow&&q.weatherCaches.icicle:q.weatherCaches.wet,q.weatherCaches);}
      check('complete rain/snow day/night sixteen-building matrix',report.weather.length===64);
      }else if(/^construction[0-3]$/.test(MODE)){
        const shard=Number(MODE.slice(-1)),constructionTargets=TARGETS.slice(shard*4,shard*4+4);
        for(const t of constructionTargets){await call(scene,{id:t.id,z:2,mode:'day',rot:0});for(const p of[0,3,5.5,8.999,9])for(const mode of['day','night']){const q=await call(constructionFrame,t.id,p,mode),stem=`${t.id}-construction-${p}-${mode}`;png('full/'+stem+'.png',await ev('window.__residential006QA.lastFull'),{kind:'actual construction',id:t.id,progress:p,mode});report.construction.push({stem,...q});check(stem+' stable correct plot/profile',q.stableDiff===0&&q.root.k===t.k&&q.profile?.sz===t.sz&&q.profile.area===t.sz*t.sz,q);if(p===8.999)check(stem+' exact completed geometry boundary',mode==='day'?q.completionDelta===0:completionNightOK(q),q);save();}}
        for(const t of constructionTargets)for(const mode of['day','night']){const sig=report.construction.filter(q=>q.id===t.id&&q.mode===mode).map(q=>q.signature);check(t.id+' '+mode+' construction distinct stages',new Set(sig).size>=4,sig);}
        for(const t of constructionTargets.filter((t,i)=>i===0)){await ev(`GV.art574.clear574(${t.x+1},${t.y+t.sz},2,2);GV.art574.plant574([{k:197,x:${t.x+1},y:${t.y+t.sz},sz:2,v:0,lv:1}]);GV.testRebake592();1`);await output({id:t.id,z:2,mode:'night',rot:0},t.id+'-foreground',report.occlusion);const q=await call(lampProbe,t.id);check(t.id+' foreground masks own lamps yet others visible',q.fullyBlockedLightPixels>0&&q.visibleLightPixels>0,q);}
        check('all forty construction shard frames recorded',report.construction.length===40);
      }else throw Error('Unknown mode '+MODE);
      report.nightCompositor=await ev('GV.nightOccSelftest629()');check('existing depth-aware night compositor',report.nightCompositor.ok,report.nightCompositor);
      return true;
    }finally{
      if(!stalled&&bootFP){try{report.finalWorker=await call(legacyWorkerProof,workerSource);report.finalWorker.sourcePinned=sha(workerSource)===APPROVED_WORKER_SHA256;report.cleanup=await call(cleanup);if(report.cleanup.fingerprint){report.sessionFingerprint=compareSessionFingerprint(bootFP,report.cleanup.fingerprint,report.finalWorker);delete report.cleanup.fingerprint;}check('canonical references and catalog preserved after diagnostics',report.cleanup.sameSpriteReferences&&report.cleanup.sameCatalogKeys,report.cleanup);check('only disposable save/camera preferences changed and restored',report.cleanup.unexpectedKeys?.length===0&&report.cleanup.storageExactlyRestored,report.cleanup);}catch(e){check('cleanup completed',false,String(e.stack||e));}}
      report.consoleErrors=cdp.errors;check('no console or uncaught errors in every mode and cleanup',cdp.errors.length===0,cdp.errors);
      save();
    }
  });
  clearTimeout(sessionWatch);clearTimeout(bootWatch);
  report.session={ok:result.ok,fails:result.fails,seconds:result.seconds,chromeMs:result.chromeMs};check('remote session completed',result.ok&&result.result,report.session);check('source unchanged during tests',sha(fs.readFileSync(path.join(ROOT,'index.html')))===report.source.htmlSHA256);check('tracked fingerprint untouched',sha(fs.readFileSync(path.join(ROOT,'fp.json')))===report.source.trackedBaselineSHA256);report.ok=report.failures.length===0;save();console.log(JSON.stringify({ok:report.ok,MODE,checkedSHA,checks:report.checks.length,failures:report.failures,seconds:report.session.seconds}));process.exit(report.ok?0:1);
})().catch(e=>{report.ok=false;report.failures.push(String(e.stack||e));save();console.error(e);process.exit(1);});
