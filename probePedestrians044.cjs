'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave044 game guards run on GitHub Actions only');
// GitHub Actions desktop Chromium only. Test actors use the existing T534 hook;
// this verifies native rendering layers, not population growth or real phones.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js'),OUT=path.join(ROOT,'shots','wave044','pedestrians'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function setup044(rows){
  GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  for(const q of rows){if(!GV.britishWave044.select(q.id)||!GV.place('landmark',q.x,q.y))throw Error('ped044 native placement '+q.id);GV.testAge635(q.x,q.y,2,2,30);}
  const actors=[];for(const x of[60,62]){GV.place('doze',x,60);GV.place('tland',x,60);const r=GV.testInjectResident534(x,60);if(!r?.c)throw Error('ped044 T534 test actor');actors.push(r);}
  window.__pedActors044=actors;GV.selectTool434('pan');window.__waterF695=0;
  return{slot:localStorage.getItem('glimmerville.v1.slot'),actorCount:actors.length};
}
function case044(spec){
  const q=spec.row,actors=window.__pedActors044,SPR=GV.art574.SPR(),canvas=document.getElementById('game'),g=canvas.getContext('2d'),original=g.drawImage;
  GV.setSpeed(0);GV.britishWeather004(1,0,0);GV.setRot(spec.rot);GV.art574.zoom574(2);GV.lookAt(q.x+.5,q.y+.5);GV.selectTool434('pan');window.__waterF695=0;
  canvas.dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const types=['adult','child','stroller'],ft=types[spec.index%3],bt=types[(spec.index+1)%3];actors[0].c.ptype=ft;actors[1].c.ptype=bt;
  const installed=GV.britishWave044.sprite(q.x,q.y),direct=window.BritishWaveArchitecture044.build(q.id,spec.rot),phase=GV.art574.cycle574()*(spec.night?.02:.5),W=canvas.width,H=canvas.height;
  const center=GV.w2v(q.x+.5,q.y+.5),depth=center[0]+center[1];
  const pc=new Map();for(const type of[ft,bt])for(const s of SPR.ped[type])pc.set(s.img,{type,s});
  let seq=0,events=[],fault=null,inject=null;
  function stamp(img,args){original.call(g,img,...args);}
  function wrapped(img,...args){
    const ped=pc.get(img);
    if(ped&&fault==='drop')return;
    if(ped&&fault==='before')return;
    if(img===installed.img&&fault==='before'&&inject){stamp(inject.img,inject.args);events.push({kind:'ped',type:ft,seq:seq++,args:inject.args.slice()});}
    if(img===installed.img)events.push({kind:'root',seq:seq++,args:args.slice(),alpha:g.globalAlpha,smoothing:g.imageSmoothingEnabled,composite:g.globalCompositeOperation,transform:Array.from(['a','b','c','d','e','f'],k=>g.getTransform()[k])});
    else if(ped)events.push({kind:'ped',type:ped.type,seq:seq++,args:args.slice()});else seq++;
    return original.call(this,img,...args);
  }
  function capture(front,back,mode){
    for(const [i,p]of[front,back].entries()){const c=actors[i].c;c.at=p?2:0;if(p){c.fx=p[0];c.fy=p[1];}}
    fault=null;GV.setVisT(phase);GV.forceDraw();fault=mode||null;events=[];seq=0;GV.setVisT(phase);
    g.drawImage=wrapped;try{GV.forceDraw();}finally{g.drawImage=original;fault=null;}
    const p=g.getImageData(0,0,W,H).data;return{pixels:p,events:events.map(e=>({...e})),url:()=>canvas.toDataURL('image/png')};
  }
  const baseline=capture(null,null),root=baseline.events.find(e=>e.kind==='root');if(!root)throw Error('ped044 actual new root draw '+q.id+'/'+spec.rot);
  const [rx,ry,rw,rh]=root.args;if(root.args.length!==4)throw Error('ped044 expected native five-argument body draw');
  const mask=document.createElement('canvas');mask.width=W;mask.height=H;const mg=mask.getContext('2d');mg.imageSmoothingEnabled=false;mg.drawImage(direct.img,rx,ry,rw,rh);const body=mg.getImageData(0,0,W,H).data;
  function metrics(shot,which){
    const ped=shot.events.find(e=>e.kind==='ped'&&e.type===(which==='front'?ft:bt)),r=shot.events.find(e=>e.kind==='root'),checks=[];
    if(!ped){return{checks:[['ped044 native pedestrian draw',false]],ped:null,overlap:0,changed:0,occludedChanged:0};}
    checks.push(['ped044 native pedestrian draw',true]);checks.push(['ped044 depth order',which==='front'?ped.seq>r.seq:ped.seq<r.seq]);
    // Both animation frames have identical occupied bounds. Use the exact glyph
    // selected by the fixed native clock when building the coverage mask.
    const actor=actors[which==='front'?0:1].c,fr=Math.floor(phase*3+actor.hx*.7)%2,pglyph=SPR.ped[ped.type][fr];
    const m=document.createElement('canvas');m.width=W;m.height=H;const gg=m.getContext('2d');gg.imageSmoothingEnabled=false;gg.drawImage(pglyph.img,...ped.args);const pa=gg.getImageData(0,0,W,H).data;
    let overlap=0,changed=0,occludedChanged=0,visible=0;const diagnosticPixels=[];
    for(let p=0;p<W*H;p++){const i=p*4;if(!pa[i+3])continue;visible++;const d=baseline.pixels[i]!==shot.pixels[i]||baseline.pixels[i+1]!==shot.pixels[i+1]||baseline.pixels[i+2]!==shot.pixels[i+2];if(d)changed++;if(body[i+3]===255){overlap++;if(d){occludedChanged++;if(diagnosticPixels.length<20)diagnosticPixels.push({x:p%W,y:Math.floor(p/W),body:Array.from(body.slice(i,i+4)),base:Array.from(baseline.pixels.slice(i,i+4)),actual:Array.from(shot.pixels.slice(i,i+4)),actor:Array.from(pa.slice(i,i+4))});}}}
    checks.push([which==='front'?'ped044 foreground visible':'ped044 opaque building occludes rear',which==='front'?changed>0:overlap>0&&occludedChanged===0]);
    return{checks,ped,overlap,changed,occludedChanged,visible,diagnosticPixels};
  }
  const offsets={back:[[-1.01,.7],[.7,-1.01],[-1.1,.4],[.4,-1.1],[-1.1,-.1],[-.1,-1.1],[-1.4,.2],[.2,-1.4]],front:[[1.01,.6],[.6,1.01],[1.1,-.1],[-.1,1.1],[1.3,.2],[.2,1.3],[1.4,-.2],[-.2,1.4]]};
  // Narrow central bodies need closer physical samples than the old perimeter
  // offsets. Keep the original samples and append a fixed quarter-tile lattice.
  // Candidate selection still uses only independent opaque geometry overlap;
  // every original depth, nonzero-overlap and exact occlusion assertion remains.
  for(let ix=0;ix<8;ix++)for(let iy=0;iy<8;iy++)offsets.back.push([-.875+ix*.25,-.875+iy*.25]);
  const selected={};
  for(const which of['front','back']){
    let firstCandidate;
    for(const [dx,dy]of offsets[which]){
      const p=GV.v2w(center[0]+dx,center[1]+dy),actualDepth=GV.w2v(...p).reduce((a,b)=>a+b,0)+.018;
      if(which==='front'?actualDepth<=depth:actualDepth>=depth)continue;
      const shot=which==='front'?capture(p,null):capture(null,p),m=metrics(shot,which),candidate={p,m,events:shot.events,data:shot.url()};if(!firstCandidate)firstCandidate=candidate;
      // Select by independent geometric overlap, never by a passing assertion.
      if(m.overlap>0){selected[which]=candidate;break;}
    }
    if(!selected[which])selected[which]=firstCandidate;
    if(!selected[which])throw Error('ped044 no '+which+' fixture');
  }
  const failures=[];for(const which of['front','back'])for(const [name,ok]of selected[which].m.checks)if(!ok)failures.push(name+' '+which+' '+q.id+'/'+spec.rot);
  const firstRed=[];
  if(spec.controls){
    const positive=capture(selected.front.p,null),pm=metrics(positive,'front');if(pm.checks.some(c=>!c[1]))throw Error('ped044 control positive fixture');
    const dropped=metrics(capture(selected.front.p,null,'drop'),'front'),df=dropped.checks.find(c=>!c[1])?.[0];if(df!=='ped044 native pedestrian draw')throw Error('ped044 missing-person first RED '+df);firstRed.push({fault:'drop actual native pedestrian draw',first:df});
    const pe=positive.events.find(e=>e.kind==='ped'&&e.type===ft),actor=actors[0].c,fr=Math.floor(phase*3+actor.hx*.7)%2;inject={img:SPR.ped[ft][fr].img,args:pe.args};
    const wrong=metrics(capture(selected.front.p,null,'before'),'front'),wf=wrong.checks.find(c=>!c[1])?.[0];if(wf!=='ped044 depth order')throw Error('ped044 wrong-order first RED '+wf);firstRed.push({fault:'paint real front actor before native building',first:wf});
    const restored=metrics(capture(selected.front.p,null),'front');if(restored.checks.some(c=>!c[1]))throw Error('ped044 restoration must GREEN');
  }
  const combined=capture(selected.front.p,selected.back.p);
  const clean=which=>({world:selected[which].p,overlap:selected[which].m.overlap,visible:selected[which].m.visible,changed:selected[which].m.changed,occludedChanged:selected[which].m.occludedChanged,checks:selected[which].m.checks,diagnosticPixels:selected[which].m.diagnosticPixels,events:selected[which].events});
  for(const r of actors)r.c.at=0;
  return{spec,front:clean('front'),back:clean('back'),failures,firstRed,combined:combined.url(),frontImage:selected.front.data,backImage:selected.back.data,w:W,h:H};
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});const rows=JSON.parse(fs.readFileSync(path.join(ROOT,'shots','wave044','preview','manifest-preview044.json'))).placed,report={head:process.env.GITHUB_SHA,platform:'GitHub Actions Ubuntu desktop headless Chromium; not a real mobile device',fixture:'Two explicitly injected T534 test actors, at=2; native SPR.ped and native object sorting. No commuting or population-growth claim.',cases:[],failures:[]};
  const specs=rows.map((row,index)=>({row,index,rot:0,night:false,controls:index===2}));for(let rot=1;rot<4;rot++)specs.push({row:rows[2],index:2,rot,night:false});for(let rot=0;rot<4;rot++)specs.push({row:rows[2],index:2,rot,night:true});
  const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{
    assert.equal((await cdp.evalJs('('+setup044.toString()+')('+JSON.stringify(rows)+')')).slot,'3');
    for(const spec of specs){const q=await cdp.evalJs('('+case044.toString()+')('+JSON.stringify(spec)+')');const name=spec.row.id+'-'+(spec.night?'night':'day')+'-r'+spec.rot;for(const [key,suffix]of[['combined','combined'],['frontImage','front'],['backImage','back']]){const bytes=Buffer.from(q[key].split(',')[1],'base64'),file=name+'-'+suffix+'.png';fs.writeFileSync(path.join(OUT,file),bytes);q[key]={file,sha256:hash(bytes),bytes:bytes.length};}report.cases.push(q);report.failures.push(...q.failures);}
    if(cdp.errors.length)throw Error(cdp.errors.join('; '));return true;
  });
  if(!r.ok)report.failures.push(...r.fails);fs.writeFileSync(path.join(OUT,'manifest-pedestrians.json'),JSON.stringify(report,null,2)+'\n');
  for(const q of report.cases)console.log('ped044 EXACT_CASE '+JSON.stringify({spec:q.spec,front:q.front,back:q.back,failures:q.failures,firstRed:q.firstRed}));
  assert(r.ok&&report.failures.length===0,'ped044 strict failures: '+report.failures.join('; '));console.log('ped044 GREEN: '+report.cases.length+' native day/night/view cases, physical draw and depth/occlusion checks; two live first-RED controls and restored GREEN.');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
