'use strict';
// Serialized into real Chrome by Actions only. No utility truth is assigned.
module.exports=function nativeTenPower041(arg){
  const need=(ok,msg)=>{if(!ok)throw Error(msg);},fixed=[['birchbind',640],['flintchart',644],['rowanclock',648],['sedgephoto',652],['elmglass',656],['heatherdye',664],['hollyrecords',668],['ashveterinary',672],['celandinewire',676],['bramblewheel',660]];
  need(localStorage.getItem('glimmerville.v1.slot')==='3','night041 disposable slot3');
  const otherSlots=()=>Object.fromEntries(Object.keys(localStorage).filter(k=>/^glimmerville\.v1\.s[12](\.|$)/.test(k)).sort().map(k=>[k,localStorage.getItem(k)]));
  if(arg.action==='setup'){
    if(arg.useNew)need(JSON.stringify(GV.britishWave041.rows().map(q=>[q.id,q.v]).sort())===JSON.stringify(fixed.toSorted()),'night041 exact complete ten source prototypes');
    // Keep the established native physical ten-lot layout, including its fourth row.
    const slots=JSON.stringify(otherSlots());GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);GV.ai(false);
    if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(false);GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(2000000);GV.setDiff(1);
    const dev=GV.dev516B();need(dev.overrides.unlockAll&&!dev.overrides.power&&!dev.overrides.unlimitedMoney&&!dev.overrides.freezeClock,'night041 only native unlock fixture, no free power or money');
    GV.britishWeather004(1,0,0);GV.save();const N=JSON.parse(GV.rawSave()).n;need(N>=60&&N<=100,'night041 bounded native map');
    GV.art574.clear574(0,0,N,N);GV.rebuildCov();
    let layout=null;
    for(let y=6;y<N-24&&!layout;y++)for(let x=9;x<N-26&&!layout;x++){
      const lots=fixed.map(([id,v],i)=>({id,v,x:x+(i%3)*6,y:y+Math.floor(i/3)*6})),source={x:x-6,y:y+5,sz:3},background={x:x+22,y:y+5,sz:3,tool:'edwardianLibrary'},bridge={x:x-3,y:y+8},road=new Map(),cells=new Map();
      const add=(m,X,Y)=>m.set(X+','+Y,{x:X,y:Y});
      for(const Y of[y+2,y+8,y+14,y+20])for(let X=x-2;X<=x+14;X++)add(road,X,Y);
      for(let Y=y+2;Y<=y+20;Y++)add(road,x-2,Y);
      // Native T471 assigns a source to a pool from its root radius2. Keep a
      // real left frontage as well as T450's full-footprint bottom frontage.
      for(let Y=y+5;Y<=y+8;Y++)add(road,x-7,Y);
      for(let X=x-7;X<=x-2;X++)add(road,X,y+8);
      // A normally placed, already published library makes this a mixed native
      // city pool. BASE itself selects its existing physicalDispatched004 path.
      // The old-only rounding limitation remains recorded in C13 evidence.
      for(let X=x+15;X<=x+24;X++)add(road,X,y+8);
      for(const p of [...lots.map(q=>({...q,sz:2})),source,background])for(let dy=0;dy<p.sz;dy++)for(let dx=0;dx<p.sz;dx++)add(cells,p.x+dx,p.y+dy);
      for(const p of road.values())add(cells,p.x,p.y);
      if([...cells.values()].every(p=>{const t=GV.tile(p.x,p.y);return t&&t.t!==3&&!t.bld;}))layout={lots,source,background,bridge,roads:[...road.values()],cells:[...cells.values()]};
    }
    need(layout&&layout.lots.length===10,'night041 real terrain supports complete ten bounded utility layout');
    const paid=[];
    const place=(tool,x,y)=>{const p=GV.placePreview459(tool,x,y),cash=GV.devMoney516B();need(p?.ok&&GV.place(tool,x,y),'night041 actual native placement '+tool+' '+x+','+y+': '+JSON.stringify(p));const spent=cash-GV.devMoney516B();need(spent===p.cost&&spent>0,'night041 actual native fee '+tool);paid.push({tool,x,y,spent});};
    for(const p of layout.cells)if(GV.tile(p.x,p.y).t===0)place('tland',p.x,p.y);
    for(const p of layout.roads)place('road',p.x,p.y);
    for(const q of layout.lots){if(arg.useNew)need(GV.britishWave041.select(q.id),'night041 real selected appearance '+q.id);place('landmark',q.x,q.y);need(paid.at(-1).spent===2000,'night041 native landmark2000');}
    place(layout.background.tool,layout.background.x,layout.background.y);
    place('nuclear',layout.source.x,layout.source.y);GV.selectTool434('pan');
    const game=document.getElementById('game');game.dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));window.__waterF695=0;
    const canonical=arg.useNew?new Map(fixed.flatMap(([,v])=>Array.from({length:4},(_,r)=>[v+r,GV.art574.SPR().bld['24_1_'+(v+r)]]))):null;
    if(arg.useNew)need(canonical.size===40&&[...canonical.values()].every(s=>s?.img&&s?.night),'night041 complete forty canonical installed views');
    need(window.__wave041TrafficPhase?.scope==='CI capture fixture; original native renderer and signal semantics','night041 explicit CI-only traffic phase bridge');
    window.__wave041Power={N,layout,paid,useNew:!!arg.useNew,canonical,slots,phase:-1,phaseClock:0,actualPhysics:true};
    need(JSON.stringify(otherSlots())===slots,'night041 other native slots unchanged after setup');
    return{N,layout,paid,dev:GV.dev516B(),slot:3,method:'native paid terrain/road/landmark/nuclear placement; no power flag, capacity, dispatch, rate or night-rule assignment'};
  }
  const Q=window.__wave041Power;need(Q&&Q.phase+1===arg.phase,'night041 ordered native physical phases');Q.phase=arg.phase;
  const {lots,source,background,bridge}=Q.layout;
  if(arg.phase===1)need(GV.placeUndo('doze',bridge.x,bridge.y),'night041 actually remove unique road bridge');
  if(arg.phase===2){need(GV.undo(),'night041 native undo restores bridge');need(GV.placeUndo('doze',source.x,source.y),'night041 actually remove nuclear source');}
  if(arg.phase===3)need(GV.undo(),'night041 native undo restores real source');
  for(const q of lots)GV.testAge635(q.x,q.y,2,2,30);
  if(GV.tile(source.x,source.y).bld)GV.testAge635(source.x,source.y,3,3,30);
  GV.testAge635(background.x,background.y,3,3,30);
  GV.recomputePower450();GV.step(1);GV.setSpeed(0);
  for(const q of lots)GV.testAge635(q.x,q.y,2,2,30);
  if(GV.tile(source.x,source.y).bld)GV.testAge635(source.x,source.y,3,3,30);
  GV.testAge635(background.x,background.y,3,3,30);
  const power=GV.t471(),night=GV.t487(),powered=arg.phase===0||arg.phase===3;
  const targets=lots.map(q=>({...q,root:GV.tile(q.x,q.y).bld,refs:[GV.tile(q.x+1,q.y).bld,GV.tile(q.x,q.y+1).bld,GV.tile(q.x+1,q.y+1).bld],authority:GV.powerAt471(q.x,q.y)}));
  const rate=night.snapshot.lighting.powerRate;
  Q.lastDiagnostics={phase:arg.phase,power,night,targets,layout:Q.layout,dev:GV.dev516B()};
  need(night.ready&&night.ok,'night041 native finalized night dispatch');
  need(targets.length===10&&targets.every(q=>q.root.k===24&&q.root.age>=9&&!!q.root.pw===powered),'night041 real root power state phase'+arg.phase);
  if(powered)need(power.available>0&&power.periods.night.available>=power.periods.night.demand&&rate>0&&targets.every(q=>q.authority.load?.pool>=0),'night041 real supplied native pools and night rate');
  if(arg.phase===1)need(power.available>0&&rate>0,'night041 disconnected roots with still-powered generator side');
  if(arg.phase===2)need(power.available===0&&rate===0,'night041 actual removed source yields zero night power');
  const all=Array.from({length:Q.N*Q.N},(_,i)=>GV.tile(i%Q.N,Math.floor(i/Q.N))),start=(source.y+3)*Q.N+source.x,prev=new Int32Array(all.length);prev.fill(-1);const queue=[];
  if(all[start].road){prev[start]=start;queue.push(start);}
  for(let i=0;i<queue.length;i++){const at=queue[i],x=at%Q.N,y=Math.floor(at/Q.N);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,j=Y*Q.N+X;if(X>=0&&Y>=0&&X<Q.N&&Y<Q.N&&all[j].road&&prev[j]<0){prev[j]=at;queue.push(j);}}}
  const topology=lots.map(q=>{const fronts=[];for(let d=0;d<2;d++)fronts.push([q.x+d,q.y-1],[q.x+d,q.y+2],[q.x-1,q.y+d],[q.x+2,q.y+d]);const end=fronts.map(([x,y])=>y*Q.N+x).find(i=>all[i]?.road&&prev[i]>=0),path=[];if(end!==undefined){let at=end;while(at!==start){path.push([at%Q.N,Math.floor(at/Q.N)]);at=prev[at];}path.push([start%Q.N,Math.floor(start/Q.N)]);path.reverse();}return{id:q.id,connected:end!==undefined,path};});
  need(topology.every(q=>q.connected===(arg.phase!==1)),'night041 independent road witness recognizes actual bridge cut');
  GV.save();const state=JSON.parse(GV.rawSave()),stats=GV.stats(),images=[],cases=[],full=[];let negative=null,trafficNegative=null;
  const game=document.getElementById('game'),g=game.getContext('2d'),P=CanvasRenderingContext2D.prototype,draw=P.drawImage,time=GV.art574.cycle574()*.02;
  const controller=window.__wave041TrafficPhase;
  const frame=(sprite)=>{let rect=null;const traffic=[];P.drawImage=function(...a){if(this.canvas===game&&a[0]===sprite?.img&&a.length===5){const m=this.getTransform();rect={x:a[1],y:a[2],w:a[3],h:a[4],a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f};}return draw.apply(this,a);};try{for(let i=0;i<2;i++){const before=controller.readCounter();GV.setVisT(time);const proof=controller.drawAt(Q.phaseClock);need(proof.requestedClock===Q.phaseClock&&proof.capturedClock===Q.phaseClock+.016,'night041 actual native traffic draw phase');need(proof.counterBefore===before&&proof.counterRestored===before&&controller.readCounter()===before,'night041 fixture restores native traffic counter');traffic.push(proof);}return{data:game.toDataURL('image/png'),px:g.getImageData(0,0,game.width,game.height).data,rect,traffic};}finally{P.drawImage=draw;}};
  const fixedFrame=sprite=>{const first=frame(sprite),next=frame(sprite);if(first.data!==next.data){Q.lastCase={reason:'two fixed-phase native captures differ',before:first.data,after:next.data};need(false,'night041 unchanged fixed-phase whole frame exact');}next.traffic=[...first.traffic,...next.traffic];next.fixedCaptureCount=2;return next;};
  const wholeEqual=(a,b,key)=>need(a.data===b.data,'night041 single new night key restoration exact '+key);
  const visibility=(a,b,s)=>{need(a.rect,'night041 actual native day draw observed');const r=a.rect,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data,seen=new Set();let visible=0,maxDelta=0;
    for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){if(n[(y*s.w+x)*4+3]<=40)continue;const X=r.x+(x+.5)*r.w/s.w,Y=r.y+(y+.5)*r.h/s.h,xx=Math.floor(r.a*X+r.c*Y+r.e),yy=Math.floor(r.b*X+r.d*Y+r.f);if(xx<0||yy<0||xx>=game.width||yy>=game.height)continue;const k=yy*game.width+xx;if(seen.has(k))continue;seen.add(k);const i=k*4,d=(a.px[i]+a.px[i+1]+a.px[i+2])-(b.px[i]+b.px[i+1]+b.px[i+2]);if(d>=3)visible++;maxDelta=Math.max(maxDelta,d);}
    return{projectedNightMaskPixels:seen.size,visibleWindowPixels:visible,maxRGBSumIncrease:maxDelta,actualDayDraw:r};};
  const guard=(m,q,r)=>{if(powered)need(m.visibleWindowPixels>=3&&m.maxRGBSumIncrease>=6,'night041 powered window pixels visible '+q.id+' view'+r);else need(m.visibleWindowPixels===0&&m.maxRGBSumIncrease===0,'night041 unpowered window suppression '+q.id+' view'+r);};
  const measure=(q,r,save=true)=>{const key='24_1_'+(q.v+r),s=Q.canonical.get(q.v+r),B=GV.art574.SPR().bld,keep=B[key];need(s?.night,'night041 canonical reviewed night source '+key);const healthy=fixedFrame(s);let suppressed;try{B[key]={...keep,night:null,nightCity:null};suppressed=fixedFrame(s);}finally{B[key]=keep;}const restored=fixedFrame(s),m={...visibility(healthy,suppressed,s),fixedCaptureCounts:{healthy:healthy.fixedCaptureCount,suppressed:suppressed.fixedCaptureCount,restored:restored.fixedCaptureCount},trafficPhaseWitness:{healthy:healthy.traffic,suppressed:suppressed.traffic,restored:restored.traffic}};Q.lastCase={q:q.id,view:r,healthy:healthy.data,suppressed:suppressed.data,restored:restored.data,metrics:m};wholeEqual(healthy,restored,key);const phaseProof=f=>JSON.stringify(f.traffic.map(t=>({requested:t.requestedClock,captured:t.capturedClock,signals:t.signals})));need(phaseProof(healthy)===phaseProof(suppressed)&&phaseProof(healthy)===phaseProof(restored),'night041 before suppressed restored actual signal phases exact');guard(m,q,r);if(!powered)need(healthy.data===suppressed.data,'night041 actual unpowered frame byte equals suppressed new-night frame '+key);if(save){images.push({name:['on','road-cut','source-off','restored'][arg.phase]+'-'+q.id+'-r'+r+'.png',data:healthy.data});if(powered)images.push({name:['on','road-cut','source-off','restored'][arg.phase]+'-suppressed-'+q.id+'-r'+r+'.png',data:suppressed.data});}return m;};
  for(let r=0;r<4;r++){
    GV.setRot(r);GV.art574.zoom574(1);GV.lookAt(lots[4].x+.5,lots[4].y+.5);const whole=frame(null);full.push({name:['on','road-cut','source-off','restored'][arg.phase]+'-whole-r'+r+'.png',data:whole.data,trafficPhaseWitness:whole.traffic});
    for(const q of lots){GV.art574.zoom574(2);GV.lookAt(q.x+.5,q.y+.5);
      if(Q.useNew){need(GV.art574.vdraw({x:q.x,y:q.y},GV.tile(q.x,q.y).bld)===q.v+r,'night041 actual native orientation '+q.id);const m=measure(q,r);cases.push({id:q.id,view:r,...m});
        if(arg.phase===0&&r===0&&q.id===fixed[0][0]){const B=GV.art574.SPR().bld,key='24_1_'+q.v,keep=B[key],before=Q.lastCase.healthy;let first='';try{B[key]={...keep,night:null,nightCity:null};try{measure(q,r,false);}catch(e){first=e.message;}}finally{B[key]=keep;}need(first==='night041 powered window pixels visible '+q.id+' view0','night041 intended actual missing-new-night first RED: '+first);const after=fixedFrame(keep);need(after.data===before,'night041 actual negative restores exact whole game canvas');negative={first,newKey:key,actualNightRemoved:true,restoredExact:true};images.push({name:'negative-missing-new-night.png',data:Q.lastCase.healthy});}
        if(arg.phase===0&&r===0&&q.id==='sedgephoto'){
          const B=GV.art574.SPR().bld,key='24_1_'+q.v,s=B[key],refs=Object.entries(B);GV.save();const beforeSave=GV.rawSave(),counter=controller.readCounter(),before=fixedFrame(s);let faulty,first='';
          try{Q.phaseClock=2.7;faulty=fixedFrame(s);try{wholeEqual(before,faulty,key);}catch(e){first=e.message;}}finally{Q.phaseClock=0;}
          const after=fixedFrame(s);Q.lastCase={reason:'actual wrong traffic phase negative',healthy:before.data,wrongPhase:faulty.data,restored:after.data,normalWitness:before.traffic,wrongWitness:faulty.traffic,restoredWitness:after.traffic};need(first==='night041 single new night key restoration exact '+key,'night041 actual wrong-traffic-phase first RED: '+first);wholeEqual(before,after,key);
          const beforeSignals=before.traffic.at(-1).signals,wrongSignals=faulty.traffic.at(-1).signals;need(beforeSignals.some(a=>wrongSignals.some(b=>a.x===b.x&&a.y===b.y&&a.phase!==b.phase)),'night041 actual native signal changed phase');need(controller.readCounter()===counter,'night041 wrong-phase control restores native counter');need(Object.keys(B).length===refs.length&&refs.every(([k,v])=>B[k]===v),'night041 wrong-phase control does not change sprites');GV.save();const afterSave=GV.rawSave();need(beforeSave===afterSave,'night041 wrong-phase control leaves complete native save exact');
          let changed=0,maxDelta=0,minX=game.width,minY=game.height,maxX=-1,maxY=-1;for(let i=0;i<before.px.length;i+=4)if(before.px[i]!==faulty.px[i]||before.px[i+1]!==faulty.px[i+1]||before.px[i+2]!==faulty.px[i+2]){changed++;const p=i/4,x=p%game.width,y=Math.floor(p/game.width);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);for(let c=0;c<3;c++)maxDelta=Math.max(maxDelta,Math.abs(before.px[i+c]-faulty.px[i+c]));}
          need(changed>0,'night041 wrong phase alters actual native full canvas');trafficNegative={first,requestedNormalPhase:0,requestedFaultPhase:2.7,actualBefore:before.traffic,actualFault:faulty.traffic,actualRestored:after.traffic,changedRGBPixels:changed,differenceBox:[minX,minY,maxX+1,maxY+1],maximumChannelDelta:maxDelta,restoredExact:true,spriteReferencesUnchanged:true,counterRestored:true,completeSaveUnchanged:true,beforeSave,afterSave};images.push({name:'on-traffic-wrong-phase.png',data:faulty.data},{name:'on-traffic-restored-phase.png',data:after.data});
        }
      }else for(let j=0;j<3;j++)frame(null);
    }
  }
  need(JSON.stringify(otherSlots())===Q.slots,'night041 other native slots unchanged');
  return{phase:arg.phase,name:['on','road-cut','source-off','restored'][arg.phase],powered,power,night,targets,topology,state,stats,cases,images,full,negative,trafficNegative,slot:3,utilityInjection:false};
};
