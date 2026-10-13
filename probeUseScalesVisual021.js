#!/usr/bin/env node
'use strict';
// Actual native rendering, frozen only for deterministic observations. No seeded
// new building, simulated capacity, replacement renderer, or edited game image.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {guardOutput022,baselineHTML022}=require('./use-scales-guard-paths022');
const {makeHarness}=require('./use-scales-test-harness021');
const OUT=guardOutput022(),ATTEMPT=process.env.USE021_VISUAL_ATTEMPT||'01';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const oracle=fs.readFileSync(path.join(OUT,'independent-pose-oracle021.js'),'utf8');
const raw=fs.readFileSync(path.join(OUT,'native-city-mature36-021.json'),'utf8');
const H=makeHarness(),report={kind:'Actual native game visual acceptance against pinned independent geometry oracle',source:H.proof,oracleSHA256:sha(oracle),inputSaveSHA256:sha(raw),checks:[],frames:[],photos:[],ok:false};
function flush(){fs.writeFileSync(path.join(OUT,'visual-acceptance-attempt-'+ATTEMPT+'.json'),JSON.stringify(report,null,2)+'\n');}
function add(name,ok,data){report.checks.push({name,ok:!!ok,data});if(!ok)throw Error(name);}
async function shot(cdp,name){const q=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const b=Buffer.from(q.data,'base64');fs.writeFileSync(path.join(OUT,name),b);report.photos.push({name,bytes:b.length,sha256:sha(b),kind:'Actual native Chromium full viewport'});}
function prepareVisual(){
 const G=GV,U=G.useScales021,N=N021,O=IndependentPoseOracle021;
 G.setSpeed(0);N.running(false);U.close();N.hide();G.setRot(0);G.lookAt(24,23);G.setZoom(.55);G.setVisT(G.art574.cycle574()*.5);N.frame(.016);
 const rows=U.rows(),places=[];
 for(let y=0;y<N.state().n;y++)for(let x=0;x<N.state().n;x++){const s=U.read(x,y);if(!s?.__art021)continue;const m=s.__art021;if(!places.some(p=>p.id===m.id))places.push({id:m.id,x,y,bw:m.bw,bh:m.bh});}
 window.V021={G,U,N,O,rows,places};return{places,control:N.controls(),state:N.state(),stats:G.stats()};
}
function observeVisual(day,rot,night){
 const{G,U,N,O,places}=V021;G.setDay(day);G.setRot(rot);G.lookAt(24,23);G.setZoom(.55);G.setVisT(G.art574.cycle574()*(night?0:.5));N.hide();
 for(const p of places)U.read(p.x,p.y);N.trace(true);N.frame(.016);const trace=N.traceRows();N.trace(false);
 const m=N.metrics(),frame={W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z},checks=[],add=(name,ok,data)=>checks.push({name,ok:!!ok,data});
 for(const p of places){const s=U.read(p.x,p.y),b=N.tile(p.x,p.y).bld;
  if(!s?.__art021){add('profile/'+p.id,false);continue;}
  const expected=O.pose({...p,rot,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame}),hits=trace.filter(t=>t.id===p.id&&t.kind==='day'&&t.main&&t.args.length===4);
  const guard=O.nativeDrawGuard(expected,hits);checks.push(guard);add('anchor/'+p.id,O.same([s.ax,s.ay],expected.anchor),{expected:expected.anchor,observed:[s.ax,s.ay]});
  add('native metadata/'+p.id,s.__t547.lv===b.lv&&s.__t547.v===b.v&&s.__art021.view===expected.view);
  const pixels=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
  add('roof/'+p.id,O.same(N.top636(s),O.top636(pixels,s.w,s.h,s.w)));const top=N.top(s),et=O.bodyTop607(pixels,s.w,s.h,s.w);add('bubble body top/'+p.id,O.same([top.x,top.y],[et.x,et.y]));
  if(p.id in O.CHIMNEYS){const ex=O.smokeExpected(expected).map(t=>t.view),got=N.smoke(p.x,p.y,b);add('native smoke reader/'+p.id,got.length===ex.length&&got.every((t,i)=>O.same([t.vx,t.vy,t.ax,t.ay],[ex[i].vx,ex[i].vy,ex[i].ax,ex[i].ay])),{expected:ex,observed:got});}
  if(b.k===22){const ep=O.farmerExpected(expected,.25,.75,N.state().visT);add('farmer/'+p.id,O.same(N.farmer(s,.25,.75),ep.local));add('sprinkler/'+p.id,O.same(s.farmAnchor021,O.sprinklerExpected(expected).local));}
  if(b.k===53){for(const progress of[0,.25,.5,1])for(const row of[0,1])add('tractor/'+progress+'/'+row,O.same(N.farmPoint(s,progress,row),O.tractorExpected(expected,progress,row).point));}
  if(b.k===23){const e=O.ranchDoorExpected(expected);add('ranch native door/'+p.id,O.same(s.door403,e),{expected:e,observed:s.door403});}
  const fw=N.fwLand(p.x,p.y,b);const disposition=O.fwLandDisposition(b.k,b.sz||1);add('weather reader/'+p.id,disposition==='null'?fw===null:fw?.__art021?.id===p.id);
  const r=N.reflect(b,p.x,p.y);const rd=O.reflectionDisposition({k:b.k,nativeSize:b.sz||1,origin:true,bw:p.bw,bh:p.bh,profile:true});add('reflection reader/'+p.id,rd==='null'?r===null:rd==='profile-1x1'?r?.__art021?.id===p.id:!r?.__art021);
 }
 return{day,season:G.season(),rot,night,frame,checks,trace,actualProfiles:places.map(p=>U.read(p.x,p.y)?.__art021?.id)};
}
(async()=>{try{
const session=await H.withGame({fresh:false,timeout:300,preScript:'window.__useScaleQA021=true;localStorage.setItem("glimmerville.v1.slot","3");localStorage.setItem("glimmerville.v1.s3",'+JSON.stringify(raw)+');',log:console.log},async({cdp})=>{
 await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});await cdp.evalJs(oracle);
 report.initial=await cdp.evalJs('('+prepareVisual.toString()+')()');add('native load retains all 36 distinct profiles',report.initial.places.length===36,report.initial.places);flush();
 for(const day of[1,101,201,301])for(const rot of[0,1,2,3])for(const night of[false,true]){
  const f=await cdp.evalJs('('+observeVisual.toString()+')('+[day,rot,night].join(',')+')');report.frames.push(f);report.checks.push(...f.checks);flush();
  const fail=f.checks.find(q=>!q.ok);console.log(JSON.stringify({phase:'visual',day,rot,night,checks:f.checks.length,failed:fail}));
  if(fail){await shot(cdp,'visual-failure-'+ATTEMPT+'.png');throw Error(fail.name);}
  if(day===1)await shot(cdp,'mature36-spring-r'+rot+'-'+(night?'night':'day')+'.png');
  if(rot===0)await shot(cdp,'mature36-season'+f.season.idx+'-'+(night?'night':'day')+'.png');
 }
 await cdp.evalJs('GV.setDay(301);GV.blizzard();N021.frame(.016);');await shot(cdp,'mature36-winter-snow.png');report.snow=await cdp.evalJs('GV.blizzardAt()');add('native enabled winter snow event',report.snow?.type==='snow',report.snow);
 for(const group of['retail','dining','market','hotel','office','crafts','lightfactory','warehouse','farm','ranch','passengerstation','freightstation']){
  await cdp.evalJs(`(()=>{const ps=V021.places.filter(p=>V021.rows.find(q=>q.id===p.id).group===${JSON.stringify(group)});const x=ps.reduce((s,p)=>s+p.x+p.bw/2,0)/ps.length,y=ps.reduce((s,p)=>s+p.y+p.bh/2,0)/ps.length;GV.setDay(1);GV.setRot(0);GV.setVisT(GV.art574.cycle574()*.5);GV.lookAt(x,y);GV.setZoom(.9);N021.hide();N021.frame(.016);})()`);await shot(cdp,'mature36-'+group+'-native.png');
 }
 return {errors:cdp.errors,benign:cdp.benign};
});report.session=session;add('native browser session clean',session.ok&&!session.result?.errors?.length,session.fails);report.ok=report.checks.every(q=>q.ok);
}catch(e){report.error=e.stack;report.ok=false;}finally{H.cleanup();flush();console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,frames:report.frames.length,error:report.error}));if(!report.ok)process.exitCode=1;}})();
