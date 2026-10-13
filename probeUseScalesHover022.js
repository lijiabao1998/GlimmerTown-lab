#!/usr/bin/env node
'use strict';
// Trusted native hover must fade a completed candidate to T126's independently
// specified .35 alpha and restore it. A production-alpha fault in a disposable
// copy must first fail this behavior guard, never a source-text assertion.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {guardOutput022}=require('./use-scales-guard-paths022');
const {makeHarness}=require('./use-scales-test-harness021');
const out=guardOutput022(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=fs.readFileSync(path.join(out,'native-city-mature36-021.json'),'utf8');
const oracle=fs.readFileSync(path.join(out,'independent-pose-oracle021.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const report={kind:'Mature hover through trusted pointer movement and production draw alpha',candidateSHA256:sha(html),inputSaveSHA256:sha(raw),oracleSHA256:sha(oracle),expectedAlpha:.35,checks:[],cases:[],photos:[],fault:null,ok:false};
const flush=()=>fs.writeFileSync(path.join(out,'hover-acceptance022.json'),JSON.stringify(report,null,2)+'\n');
function check(name,ok,data){const q={name,ok:!!ok,data};report.checks.push(q);if(!ok){const e=Error(name);e.guard=q;throw e;}}
async function shot(cdp,name){const q=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}),b=Buffer.from(q.data,'base64');fs.writeFileSync(path.join(out,name),b);report.photos.push({name,bytes:b.length,sha256:sha(b)});}
function prepare(){
  N021.running(false);GV.setSpeed(0);GV.useScales021.close();GV.selectTool434('road');N021.hide();const places=[];
  for(let y=0;y<N021.state().n;y++)for(let x=0;x<N021.state().n;x++){
    const s=GV.useScales021.read(x,y);if(s?.__art021&&!places.some(p=>p.id===s.__art021.id)){const a=s.__art021;places.push({id:a.id,x,y,bw:a.bw,bh:a.bh,age:N021.tile(x,y).bld.age});}
  }
  window.H022={places};return{places,state:N021.state(),control:N021.controls()};
}
function locate(id,rot,night){
  const p=H022.places.find(p=>p.id===id),N=N021,G=GV,O=IndependentPoseOracle021;
  N.running(false);G.setSpeed(0);G.setDay(88);G.setRot(rot);G.lookAt(p.x+p.bw/2,p.y+p.bh/2);G.setZoom(1.1);G.setVisT(G.art574.cycle574()*(night?0:.5));N.hide();
  const before={money:G.stats().money,profile:JSON.stringify(G.useScales021.profileSave())};N.trace(true);N.frame(.016);const hits=N.traceRows().filter(t=>t.id===id&&t.main&&t.kind==='day'&&t.args.length===4);N.trace(false);
  const m=N.metrics(),b=N.tile(p.x,p.y).bld,pose=O.pose({...p,rot,N:N.state().n,nativeLevel:b.lv,nativeVariant:b.v,frame:{W:m.W,H:m.H,camX:m.cam.x,camY:m.cam.y,zoom:m.cam.z}});
  const corners=[[p.x,p.y],[p.x+p.bw-1,p.y],[p.x,p.y+p.bh-1],[p.x+p.bw-1,p.y+p.bh-1]].map(q=>O.rotate(q[0],q[1],N.state().n-1,rot));
  const backDepth=Math.min(...corners.map(q=>q[0]+q[1])),targets=[];
  for(let y=Math.max(0,p.y-12);y<Math.min(N.state().n,p.y+p.bh+12);y++)for(let x=Math.max(0,p.x-12);x<Math.min(N.state().n,p.x+p.bw+12);x++){
    const uv=O.rotate(x,y,N.state().n-1,rot),ax=pose.offset[0]+(32*(uv[0]-uv[1])+32)*m.cam.z,ay=pose.offset[1]+(16*(uv[0]+uv[1])+32)*m.cam.z;
    const px=ax/m.DPR,py=(ay-16*m.cam.z)/m.DPR;
    if(uv[0]+uv[1]<backDepth-.5&&ax>pose.draw[0]+2&&ax<pose.draw[0]+pose.draw[2]-2&&ay>pose.draw[1]+2&&ay<pose.draw[1]+pose.draw[3]-2&&px>80&&px<m.W/m.DPR-80&&py>90&&py<m.H/m.DPR-120)targets.push({x,y,px,py,ax,ay,depth:uv[0]+uv[1]});
  }
  const distance=t=>Math.abs(t.px-m.W/m.DPR/2)+Math.abs(t.py-m.H/m.DPR/2);targets.sort((a,b)=>distance(a)-distance(b));
  return{p,pose,before,hits,targets:targets.slice(0,12),state:N.state()};
}
async function run(source,fault=false){
  const H=makeHarness(source);let firstFailure=null;
  try{
    const session=await H.withGame({fresh:false,timeout:300,preScript:'window.__useScaleQA021=true;localStorage.setItem("glimmerville.v1.slot","3");localStorage.setItem("glimmerville.v1.s3",'+JSON.stringify(raw)+');',log:console.log},async({cdp})=>{
      await cdp.evalJs(oracle);const init=await cdp.evalJs('('+prepare.toString()+')()');
      if(init.places.length!==36||init.places.some(p=>p.age<9))throw Error('Mature fixture must load all36 at age>=9');
      for(const width of fault?[1440]:[1440,390]){
        await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:width===1440?960:844,deviceScaleFactor:1,mobile:width!==1440});
        for(const rot of fault?[0]:[0,1,2,3])for(const night of fault?[false]:[false,true])for(const p of fault?init.places.slice(0,1):init.places){
          const q=await cdp.evalJs('('+locate.toString()+')('+[JSON.stringify(p.id),rot,night].join(',')+')');
          if(!q.hits.length||q.hits.some(h=>Math.abs(h.alpha-1)>1e-6)||!q.targets.length)throw Error('Hover setup absent or unexpectedly faded: '+p.id);
          let result;
          for(const t of q.targets){
            await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:t.px,y:t.py,button:'none'});
            result=await cdp.evalJs(`(()=>{N021.trace(true);N021.frame(.016);const hits=N021.traceRows().filter(t=>t.id===${JSON.stringify(p.id)}&&t.main&&t.kind==='day'&&t.args.length===4);N021.trace(false);return{hover:N021.hover(),hits,money:GV.stats().money,profile:JSON.stringify(GV.useScales021.profileSave())};})()`);
            if(result.hover.x===t.x&&result.hover.y===t.y){result.target=t;break;}
          }
          const name='mature-hover-alpha/'+p.id+'/width'+width+'/r'+rot+'/'+(night?'night':'day');
          const ok=!!result?.target&&result.hits.length>0&&result.hits.every(h=>Math.abs(h.alpha-.35)<1e-6);
          const observed={width,rot,night,age:q.p.age,hover:result?.hover,target:result?.target,alpha:result?.hits.map(h=>h.alpha)};
          if(fault){if(!ok){firstFailure={name,observed};return{firstFailure,errors:cdp.errors};}throw Error('Intentional alpha fault was not detected');}
          check(name,ok,observed);check('hover-no-charge-or-profile-mutation/'+p.id,result.money===q.before.money&&result.profile===q.before.profile);
          const restored=await cdp.evalJs(`(()=>{N021.hide();N021.trace(true);N021.frame(.016);const hits=N021.traceRows().filter(t=>t.id===${JSON.stringify(p.id)}&&t.main&&t.kind==='day'&&t.args.length===4);N021.trace(false);return hits.map(h=>h.alpha);})()`);
          check('hover-restores-opaque/'+p.id,restored.length>0&&restored.every(a=>Math.abs(a-1)<1e-6),restored);report.cases.push(observed);flush();
          if(p.id===init.places[0].id)await shot(cdp,'mature-hover-width'+width+'-r'+rot+'-'+(night?'night':'day')+'.png');
        }
      }
      return{errors:cdp.errors};
    });
    if(!session.ok||session.result?.errors?.length)throw Error('Hover native browser session failed: '+session.fails.join(';'));
    return{source:H.proof,session:{ok:session.ok,fails:session.fails,seconds:session.seconds},firstFailure};
  }finally{H.cleanup();}
}
(async()=>{try{
  report.normal=await run(html);const target='occA=.35;break;',bad=html.replace(target,'occA=.85;break;');
  if(html.split(target).length!==2||bad===html)throw Error('Exactly one production hover mutation target required');
  const fault=await run(bad,true);report.fault={mutation:'production mature hover alpha .35 -> .85',...fault};
  check('hover-intentional-fault-first-red',!!fault.firstFailure?.name?.startsWith('mature-hover-alpha/'),fault.firstFailure);
  report.ok=report.checks.every(q=>q.ok)&&report.cases.length===576;
}catch(e){report.error=e.stack;report.firstFailure=e.guard;report.ok=false;}finally{flush();console.log(JSON.stringify({ok:report.ok,cases:report.cases.length,checks:report.checks.length,error:report.error}));if(!report.ok)process.exitCode=1;}})();
