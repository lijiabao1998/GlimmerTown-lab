/* GPT-007 destructive integration guard. Embed after publicLifeSelftest007 inside
   the main game IIFE, export through GV. Never invoke against a player's profile.
   The marker AND slot check are mandatory. Fixtures seed terrain/age/citizens;
   power, water, placement, simulation, coverage and save/load use real authorities. */
function publicLifeGameplayProbe007(groupFilter){
  const groupNames=['catalog-unlock-rejection','placement-inspector-undo','construction-day-nine','perimeter-real-utilities','utility-availability-loss','public-workforce-budget-mobility','coverage-symmetry-overlays','save-load-identities','emergency-court-authorities','offline-upkeep'];
  const checks=[],details=[],exceptions=[],groups=[],started=performance.now();
  let currentGroup='guard';
  const copy=q=>q===undefined?null:JSON.parse(JSON.stringify(q));
  const add=(name,ok,actual)=>{checks.push(name+(ok?' ✓':' ✗'));details.push({group:currentGroup,name,ok:!!ok,actual:copy(actual)});return !!ok;};
  const result=extra=>({ok:details.length>0&&details.every(q=>q.ok)&&exceptions.length===0,checks,details,exceptions,groups,groupNames,requestedGroup:groupFilter??null,selectedGroup:groupFilter??null,ranGroups:groups.filter(g=>g.ran&&g.name!=='cleanup').map(g=>g.name),slot:curSlot(),disposable:true,elapsedMs:+(performance.now()-started).toFixed(2),assertions:details.length,...extra});
  if(groupFilter!=null&&(typeof groupFilter!=='string'||!groupNames.includes(groupFilter))){add('known named group required',false,{requested:groupFilter,groupNames});return result({guarded:true});}
  if(window.__publicLifeQA007!==true||curSlot()!==3){add('disposable slot-3 guard',false,{marker:window.__publicLifeQA007===true,slot:curSlot()});return result({guarded:true});}
  if(devUnlockAll516B()||devState516B.sandbox||devGod516B()){add('ordinary simulation required',false,{unlockAll:devUnlockAll516B(),sandbox:devState516B.sandbox});return result({guarded:true});}
  const flags=['__noPublicLife007','__noResidential006','__noIncident493','__legacyEmergency455','__noEmergencyNetwork455','__noHighStreet005','__noBritishBuildings004','__noEnterprise489','__noHousing488','__noCivicServices495','__noWater472','__noPower471'];
  if(flags.some(k=>window[k])||powerLegacy450()||waterLegacy449()){add('production authorities enabled',false,{flags:flags.filter(k=>window[k]),legacyPower:powerLegacy450(),legacyWater:waterLegacy449()});return result({guarded:true});}
  const require=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const specs=PUBLICLIFE_EXPECTED007.map(e=>({...e,nm:PUBLICLIFE007[e.k]?.nm}));
  const near=(a,b,eps=1e-8)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=eps;
  const sum=a=>a.reduce((x,y)=>x+y,0),same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
  const at=(x,y)=>tiles[idx(x,y)];
  const cells=(x,y,n)=>{const out=[];for(let dy=0;dy<n;dy++)for(let dx=0;dx<n;dx++)out.push(idx(x+dx,y+dy));return out;};
  const footprint=(q,x,y)=>cells(x,y,q.sz).every((i,n)=>{const b=tiles[i].bld;return !!b&&b.k===q.k&&(n===0?!b.ref&&b.sz===q.sz&&b.lv===1&&b.v===0:!!b.ref&&b.ref[0]===x&&b.ref[1]===y);});
  const place=(id,x,y)=>{require(curSlot()===3&&window.__publicLifeQA007===true,'disposable guard changed');const err=canPlace(id,x,y);require(err===null,id+' at '+x+','+y+' rejected: '+err);require(doPlace(id,x,y,true),id+' placement failed');return at(x,y).bld;};
  const fresh=()=>{
    require(window.__publicLifeQA007===true&&curSlot()===3,'unsafe fresh-world guard');
    speed=0;mapSizePref=72;diff=1;disastersOn=false;newWorld(7007007);speed=0;money=10000000;rankIdx=25;
    // Same-seed disposable fixtures must not inherit prior fiscal/observatory
    // state: their existing resets are in-memory only, with no save access.
    observatoryReset514();fiscalReset515();
    for(const t of tiles)Object.assign(t,{t:2,tree:0,el:0,em:0,zone:0,deco:0,bld:null,road:0,bridge:0,hw:0,rc:0,mask:0,rail:0,railBridge:0,railMask:0,tram:0,tramBridge:0,tramMask:0,wp:0,wr:false,wm:0,rp:false,dock:0,office:0,bus:0,rdec:0,ruin:0,crater:0,oneway:0,light:0,parkMeter:0,busLane:0,flood:0,levee:0,abandoned:0,hv471:0,ug471:0,hvMask471:0,wm472:0,sm472:0,wmMask472:0,smMask472:0,lv475:0,ud475:0,lvMask475:0,udMask475:0,wpMask475:0,fly475:0,ix475:0,am502:0});
    computeFoam();computeElMask();recalcAllMasks();rebuildCov();buildTickIndex();
    markPowerDirty450();markPowerDirty471();markWaterCycleDirty472();markMobilityDirty462();sanDirty445=true;
  };
  const group=(name,fn,always=false)=>{
    if(!always&&groupFilter&&groupFilter!==name){groups.push({name,ran:false,skipped:true});return;}
    currentGroup=name;const first=details.length,t0=performance.now();
    try{fn();}catch(e){const error={group:name,name:e.name,message:e.message,stack:String(e.stack||'')};exceptions.push(error);add(name+' exception',false,error);}
    const d=details.slice(first);groups.push({name,ran:true,skipped:false,ok:d.length>0&&d.every(q=>q.ok),assertions:d.length,elapsedMs:+(performance.now()-t0).toFixed(2)});
  };
  const inspectFootprint=(q,x,y,label)=>{for(const i of cells(x,y,q.sz)){inspect(i%N,(i/N)|0);const text=$('#infoBody').textContent;add(label+' inspector cell '+i,typeof q.nm==='string'&&text.includes(q.nm)&&selTile?.x===x&&selTile?.y===y,{title:text.slice(0,160),selection:selTile});}hideInfo();};
  const noRng=(name,fn,allowAmbient=false)=>{let seeded=0,ambient=0;const sr=R,mr=Math.random;R=function(){seeded++;return sr();};Math.random=function(){ambient++;return mr();};try{fn();}finally{R=sr;Math.random=mr;add(name+' consumes no simulation RNG',seeded===0&&(allowAmbient||ambient===0),{seeded,ambient,ambientPurpose:allowAmbient?'existing placement particles':null});}};
  // Enough native supply for the complete fixture, arranged in four connected
  // streets. No power/water flag, allocation, staff row or coverage array is seeded.
  const utilities=()=>{
    const plants=[],waters=[];
    for(const y of [14,28,42,56]){
      for(let x=6;x<=60;x++){place('road',x,y);place('wpipe',x,y);}
      for(const x of [6,60]){place('plant',x,y-1);plants.push([x,y-1]);}
      for(const x of [8,58]){place('water',x,y+1);waters.push([x,y+1]);}
    }
    for(let y=14;y<=56;y++){place('road',5,y);place('wpipe',5,y);}
    return {plants,waters};
  };
  const fixture=(list=specs,homes=true,age=30)=>{
    const network=utilities(),rows=list.map((q,n)=>({q,x:12+12*(n%4),y:14+14*Math.floor(n/4)-q.sz}));
    for(const r of rows)place(r.q.id,r.x,r.y).age=age;
    const households=[];if(homes)for(let n=0;n<16;n++){const x=12+12*(n%4),y=15+14*Math.floor(n/4),id=['britishTerrace','georgianRow','workersCourt'][n%3];place(id,x,y).age=30;households.push({x,y,root:idx(x,y),id});}
    return {rows,households,...network};
  };
  // Capture first: status/ensure helpers must not repair an unserved first day.
  const snapshot=r=>{const root=idx(r.x,r.y),b=tiles[root].bld;return {root,k:b?.k,age:b?.age,pw:b?.pw,wa:b?.wa,powerState:POWER_ROOT_OK471[root],waterState:WATER_ROOT_STATE472[root],waterDelivered:WATER_ROOT_DELIVERED472[root]};};
  const requireReady=(r,label)=>{const s=snapshot(r),b=tiles[s.root].bld;add(label,s.pw===true&&s.wa===true&&s.powerState===1&&s.waterState>=2&&s.waterDelivered>0&&britishRoad004(s.root)&&publicLifeOperational007(s.root,b),s);return s;};
  const disabled=(r,label)=>{
    const s=snapshot(r),b=tiles[s.root].bld,a=activityCapacity491(s.root,b),staff=publicStaffRoot495.get(s.root);
    add(label+' zero effective work and activities',!publicLifeOperational007(s.root,b)&&a.work===0&&a.shopping===0&&a.education===0&&a.services===0&&a.leisure===0&&(staff?.activePositions||0)===0&&publicLifeCapacityFactor007(s.root,b)===0,{...s,activity:a,staff});
    add(label+' no own coverage stamp',!publicLifeCovRoots007.has(s.root),{field:r.q.coverage,stamp:publicLifeCovRoots007.get(s.root)||null});
    if(['police','fire'].includes(r.q.role))add(label+' no emergency source',!publicLifeEmergencyReady007(s.root,b)&&!emergencyStationRoots455(r.q.role).includes(s.root),{root:s.root,ready:publicLifeEmergencyReady007(s.root,b),sources:emergencyStationRoots455(r.q.role)});
  };
  const physicalPower=(label,raw)=>{
    for(const pool of raw.pools){const physical=pool.evening?.physicalDispatched004??pool.evening?.physicalDispatched005,ds=raw.districts.filter(d=>pool.districts.includes(d.id)),used=sum(ds.map(d=>d.used)),tol=Number.EPSILON*Math.max(1,Math.abs(physical||0))*Math.max(16,raw.loads.length*4);
      add(label+' pool '+pool.id+' conserves physically dispatched power',Number.isFinite(physical)&&physical>0&&used<=physical+tol&&ds.every(d=>d.used>=0),{physical,used,tolerance:tol,districts:ds});}
  };
  const powerSnapshot=()=>copy({day:power471.day,pools:power471.pools,loads:power471.loads,sources:power471.sources,districts:powerDistricts450.map(d=>({id:d.id,capacity:d.capacity,used:d.used,spare:d.spare}))});
  // Observe the native minimap paint call, not a substitute renderer. The real
  // draw still occurs and the exact context method/view are restored in finally.
  const miniColor=(view,x,y)=>{const old=miniView,drawRect=miniG.fillRect,[vx,vy]=w2v(x,y),scale=144/N,colors=[];try{miniView=view;miniG.fillRect=function(a,b,w,h){if(a===vx*scale&&b===vy*scale&&w===Math.ceil(scale)&&h===Math.ceil(scale))colors.push(this.fillStyle);return drawRect.apply(this,arguments);};drawMini();}finally{miniG.fillRect=drawRect;miniView=old;}return colors[0]||null;};
  const expectedCoverage=(rows,budget=1)=>{const a=new Uint8Array(N*N);for(const r of rows){const radius=Math.max(1,Math.round(COVR[r.q.coverage]*(r.q.budget?budget:1)));for(let y=Math.max(0,r.y-radius);y<=Math.min(N-1,r.y+radius);y++)for(let x=Math.max(0,r.x-radius);x<=Math.min(N-1,r.x+radius);x++)a[idx(x,y)]++;}return Array.from(a);};
  const save3=()=>{require(curSlot()===3&&window.__publicLifeQA007===true,'unsafe save');save();const raw=localStorage.getItem(slotKey(3)),d=raw&&saveInflate(JSON.parse(raw));require(d?.v===1,'fresh slot-3 save missing');return d;};
  // No player's slot is even read. Block accidental access before invoking the
  // original native method; store only the operation/key, never save contents.
  const storageAudit={protectedAttempts:[],reads:0,writes:0,removes:0},storageProto=Object.getPrototypeOf(localStorage),storageOriginal={};
  const protectedKey=k=>k===SAVEKEY||k===slotKey(1)||k===slotKey(2)||k===slotKey(1)+'_bak'||k===slotKey(2)+'_bak';
  try{
    for(const op of ['getItem','setItem','removeItem','clear']){
      const desc=Object.getOwnPropertyDescriptor(storageProto,op);require(desc&&typeof desc.value==='function','native Storage instrumentation unavailable: '+op);storageOriginal[op]=desc;
      Object.defineProperty(storageProto,op,{...desc,value:function(key,value){
        if(this===localStorage){
          const k=String(key);if(op==='clear'||protectedKey(k)||(op==='setItem'&&k===SAVEKEY+'.slot'&&String(value)!=='3')){storageAudit.protectedAttempts.push({op,key:op==='clear'?'*':k});throw new Error('GPT-007 blocked player-slot access: '+op+' '+k);}
          if(op==='getItem')storageAudit.reads++;else if(op==='setItem')storageAudit.writes++;else if(op==='removeItem')storageAudit.removes++;
        }
        return desc.value.apply(this,arguments);
      }});
    }
    group('catalog-unlock-rejection',()=>{
      fresh();const smoke=publicLifeSelftest007();for(const d of smoke.details)add('smoke '+d.name,d.ok,d.actual);
      for(const q of specs){
        rankIdx=q.rank-2;const locked=canPlace(q.id,10,10);add(q.id+' locked below exact rank',typeof locked==='string'&&!toolUnlocked458(toolMeta434(q.id)),{rank:rankIdx+1,error:locked});
        rankIdx=q.rank-1;add(q.id+' unlocked at exact rank',toolUnlocked458(toolMeta434(q.id))&&canPlace(q.id,10,10)===null,{rank:rankIdx+1});rankIdx=25;
        const blockers=[['water',{t:0}],['mountain',{t:3}],['road',{road:1}],['rail',{rail:1}],['tram',{tram:1}],['overhead distribution',{lv475:1}],['high voltage',{hv471:1}],['underground high voltage',{ug471:1}],['occupied',{bld:{k:4,lv:1,v:0,age:30}}],['ruin',{ruin:1}],['crater',{crater:1}]];
        for(const i of cells(10,10,q.sz))for(const [label,value]of blockers){const old=JSON.stringify(tiles[i]);Object.assign(tiles[i],value);const before=JSON.stringify(cells(10,10,q.sz).map(j=>tiles[j])),cash=money,error=canPlace(q.id,10,10),placed=doPlace(q.id,10,10,true);add(q.id+' rejects '+label+' at footprint '+i,typeof error==='string'&&error.length>0&&placed===false&&money===cash&&before===JSON.stringify(cells(10,10,q.sz).map(j=>tiles[j])),{error,placed,moneyDelta:money-cash});tiles[i]=JSON.parse(old);}
        for(const [x,y]of[[-1,10],[10,-1],[N-q.sz+1,10],[10,N-q.sz+1]]){const cash=money,error=canPlace(q.id,x,y);add(q.id+' rejects map edge '+x+','+y,typeof error==='string'&&doPlace(q.id,x,y,true)===false&&money===cash,{error});}
        const cash=money;money=q.cost-1;add(q.id+' insufficient funds is atomic',doPlace(q.id,10,10,true)===false&&!at(10,10).bld&&money===q.cost-1,{money});money=cash;
      }
    });
    group('placement-inspector-undo',()=>{
      fresh();for(const q of specs){const x=10,y=10,fs=cells(x,y,q.sz);for(const i of fs){Object.assign(tiles[i],{tree:1,zone:2,deco:1,office:1});stampPolTree(i%N,(i/N)|0,1);}
        const capital=fiscal515.capitalLedger.length,cash=money,price=placeCost(q.id,x,y),trees=Array.from(POLTREE),before=fs.map(i=>JSON.stringify(tiles[i]));openUndo(q.id);noRng(q.id+' placement',()=>place(q.id,x,y),true);closeUndo();
        add(q.id+' quotes tree clearing and charges one transaction',price>q.cost&&near(cash-money,price)&&undoStack.at(-1)?.spent===price,{base:q.cost,quoted:price,charged:cash-money,transaction:undoStack.at(-1)?.spent});
        add(q.id+' capital transaction uses its actual ID and exact all-in charge',fiscal515.capitalLedger.length===capital+1&&fiscal515.capitalLedger.at(-1)?.k===q.k&&fiscal515.capitalLedger.at(-1)?.tool===q.id&&fiscal515.capitalLedger.at(-1)?.cost===Math.round(price),fiscal515.capitalLedger.at(-1));
        buildTickIndex();const assets=fiscalAssetScan515(true);add(q.id+' fiscal root counted once at locked replacement cost',assets.count===1&&assets.replacementValue===q.cost,{assets,expected:q.cost});
        add(q.id+' complete fixed root/ref footprint',footprint(q,x,y),fs.map(i=>tiles[i].bld));
        add(q.id+' clears trees and ancillary footprint layers',fs.every(i=>!tiles[i].tree&&!tiles[i].zone&&!tiles[i].deco&&!tiles[i].office)&&POLTREE.every(v=>v===0),{layers:fs.map(i=>tiles[i]),treePollution:sum(Array.from(POLTREE))});inspectFootprint(q,x,y,q.id);
        require(undo(),'placement undo failed');add(q.id+' undo restores exact tiles trees and cash',money===cash&&fs.every((i,n)=>JSON.stringify(tiles[i])===before[n])&&same(Array.from(POLTREE),trees),{cash,money});
        require(redo(),'placement redo failed');add(q.id+' redo charges once and restores refs',near(money,cash-price)&&footprint(q,x,y),{money,expected:cash-price});
        // Demolish from EVERY root/reference cell, undo after each, then final redo.
        for(const cell of fs){const dx=cell%N,dy=(cell/N)|0,quoted=placeCost('doze',dx,dy),prior=money;openUndo('reference demolition');require(doPlace('doze',dx,dy,true),'cell demolition failed '+cell);closeUndo();add(q.id+' whole-footprint demolition from '+cell,fs.every(i=>!tiles[i].bld)&&near(prior-money,quoted),{quoted,charged:prior-money});require(undo(),'demolition undo failed');add(q.id+' demolition undo from '+cell,footprint(q,x,y)&&money===prior,{money});}
        require(redo(),'final demolition redo failed');add(q.id+' final demolition redo removes every cell',fs.every(i=>!tiles[i].bld),{remaining:fs.filter(i=>tiles[i].bld)});
      }
    });
    group('construction-day-nine',()=>{
      fresh();const f=fixture(specs,true,0);
      for(let n=1;n<=9;n++){
        tick();const captured=f.rows.map(snapshot);
        for(const [j,r]of f.rows.entries()){const root=idx(r.x,r.y),b=tiles[root].bld;add(r.q.id+' normal construction day '+n,captured[j].age===n&&footprint(r.q,r.x,r.y)&&cells(r.x,r.y,r.q.sz).slice(1).every(i=>tiles[i].bld.age===undefined),{...captured[j],references:cells(r.x,r.y,r.q.sz).slice(1).map(i=>tiles[i].bld)});if(n<9){disabled(r,r.q.id+' day '+n);add(r.q.id+' unfinished nominal public work is zero',publicJobCapacity491(b)===0,{jobs:publicJobCapacity491(b)});}}
        add('day '+n+' no private tax or goods demand from public assets',fin.taxC===0&&fin.taxI===0&&economy481.goods.need===0&&gFlow284.use===0&&Number.isFinite(fin.net)&&Number.isFinite(money),{taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI,goods:economy481.goods,net:fin.net});
        add('day '+n+' exact completion-gated public accounting',publicLifePublicJobs007()===(n<9?0:sum(specs.map(q=>q.jobs)))&&near(publicLifeUpkeep007(),n<9?0:sum(specs.map(q=>q.upkeep*(q.budget?svcBudget[q.budget]:1)))),{jobs:publicLifePublicJobs007(),upkeep:publicLifeUpkeep007()});
      }
      for(const r of f.rows){const s=requireReady(r,r.q.id+' day nine real operation'),b=tiles[s.root].bld,a=activityCapacity491(s.root,b);add(r.q.id+' day nine public capacity becomes effective',publicJobCapacity491(b)===r.q.jobs&&a.publicJobs>0&&a.enterpriseJobs===0&&a.work===a.publicJobs&&a.work<=r.q.jobs*1.12&&COV[r.q.coverage][s.root]>0,{activity:a,coverage:COV[r.q.coverage][s.root]});for(const key of ['education','services','leisure']){const nominal=key==='education'?r.q.seats:r.q[key];add(r.q.id+' day nine '+key+' truthful role',nominal?a[key]>0:a[key]===0,{nominal,actual:a[key]});}}
    });
    group('perimeter-real-utilities',()=>{
      for(const q of specs)for(const side of ['north','east','south','west']){
        fresh();const x=30,y=30,n=q.sz,[ex,ey,nx,ny,tx,ty]=side==='north'?[x+n-1,y-1,0,-1,1,0]:side==='east'?[x+n,y+n-1,1,0,0,1]:side==='south'?[x+n-1,y+n,0,1,1,0]:[x-1,y+n-1,-1,0,0,1];
        place('road',ex,ey);place('wpipe',ex,ey);place('plant',ex+nx,ey+ny);place('water',ex+tx,ey+ty);place(q.id,x,y).age=30;
        const r={q,x,y},root=idx(x,y),edge=idx(ex,ey);
        // Pure snapshots: no ensure/status/dispatch calls are allowed before the
        // first capture. The tick's own readiness must not be repaired by QA.
        const capture=()=>copy({root:{k:tiles[root].bld.k,age:tiles[root].bld.age,pw:tiles[root].bld.pw,wa:tiles[root].bld.wa,state:POWER_ROOT_OK471[root],waterState:WATER_ROOT_STATE472[root],waterDelivered:WATER_ROOT_DELIVERED472[root]},edgeDistrict:POWER_DIST450[edge],allocation:powerAlloc450,districts:powerDistricts450.map(d=>({id:d.id,capacity:d.capacity,used:d.used,spare:d.spare,rawCapacity:d.rawCapacity})),pools:power471.pools,loads:power471.loads});
        tick();const tickEnd=capture();
        add(q.id+' '+side+' ordinary tick independently powers and waters root',tickEnd.root.pw===true&&tickEnd.root.wa===true&&tickEnd.root.state===1&&tickEnd.root.waterState>=2&&tickEnd.root.waterDelivered>0,tickEnd.root);
        const seeds=sanRoadSeeds445(root),road=nearRoad(x,y),pc=powerCandidateDistricts450(x,y,2),wc=facilityComps472(root,WATER_NET_COMP472,t=>!!(t.wp||t.wm472));
        add(q.id+' '+side+' exact far-edge road entrance',britishRoad004(root)&&seeds.length===1&&seeds[0]===edge&&road?.join(',')===[ex,ey].join(','),{frontage:seeds,edge,entrance:road});
        add(q.id+' '+side+' actual carrier components reach root',POWER_DIST450[edge]>=0&&pc.includes(POWER_DIST450[edge])&&WATER_NET_COMP472[edge]>=0&&wc.includes(WATER_NET_COMP472[edge]),{powerCandidates:pc,powerDistrict:POWER_DIST450[edge],waterComponents:wc,waterComponent:WATER_NET_COMP472[edge]});
        requireReady(r,q.id+' '+side+' real plant/tower readiness');
        // A later T450 refresh may expose nominal district capacity (e.g.75),
        // which is not dispatched energy. Check actual used/served against the
        // detached physical dispatch. Indivisible-load slack is legitimate.
        preparePowerDispatch471();const prepared=capture();
        for(const [phase,snap]of [['tick-end',tickEnd],['immediately-after-prepare',prepared]]){
          const pool=snap.pools.find(p=>p.districts.includes(snap.edgeDistrict)),raw=pool?.evening?.physicalDispatched004??pool?.evening?.physicalDispatched005,ds=pool?.districts.map(id=>snap.districts.find(d=>d.id===id))||[],capacity=sum(ds.map(d=>d.capacity)),used=sum(ds.map(d=>d.used)),tol=Number.EPSILON*Math.max(1,Math.abs(raw||0))*Math.max(16,snap.loads.length*4);
          add(q.id+' '+side+' '+phase+' conserves actually used physical power',Number.isFinite(raw)&&raw>0&&ds.length>0&&ds.every(d=>Number.isFinite(d.used)&&d.used>=0)&&used<=raw+tol&&snap.allocation.served<=raw+tol&&near(used,snap.allocation.served,tol)&&snap.allocation.noGrid===0&&snap.allocation.noCapacity===0,{phase,physical:raw,observedCapacity:capacity,used,slack:raw-used,roundoff:tol,allocation:snap.allocation,root:snap.root,districts:ds,pool});
        }
      }
    });
    group('utility-availability-loss',()=>{
      for(const loss of ['road','power','water']){
        fresh();const f=fixture();tick();tick();for(const r of f.rows)requireReady(r,r.q.id+' before '+loss+' loss');const removed=[];
        if(loss==='road'){for(const r of f.rows)for(const edge of sanRoadSeeds445(idx(r.x,r.y)))if(!removed.some(a=>a[0]===edge%N&&a[1]===Math.floor(edge/N))){removed.push([edge%N,Math.floor(edge/N)]);require(doPlace('doze',edge%N,Math.floor(edge/N),true),'frontage demolition');}}
        else for(const [x,y]of loss==='power'?f.plants:f.waters){removed.push([x,y]);require(doPlace('doze',x,y,true),loss+' source demolition');}
        tick();const actual=f.rows.map(snapshot);
        for(const [j,r]of f.rows.entries()){const a=actual[j];add(r.q.id+' actual '+loss+' loss',loss==='road'?!britishRoad004(a.root):loss==='power'?!a.pw:a.pw&&!a.wa,a);disabled(r,r.q.id+' '+loss+' loss');add(r.q.id+' offline nominal jobs preserved',publicJobCapacity491(tiles[a.root].bld)===r.q.jobs,{nominal:publicJobCapacity491(tiles[a.root].bld)});}
        for(const [x,y]of removed){place(loss==='road'?'road':loss==='power'?'plant':'water',x,y);if(loss==='road'&&!at(x,y).wp)place('wpipe',x,y);}tick();for(const r of f.rows)requireReady(r,r.q.id+' restored '+loss);
      }
      fresh();const f=fixture();tick();tick();const baseline=f.rows.map(r=>publicLifeCapacityFactor007(idx(r.x,r.y),at(r.x,r.y).bld));
      const incidents=f.rows.map(r=>incidentCreate493(idx(r.x,r.y),'drill',4,'services',{authorized:false}));require(incidents.every(Boolean),'all native availability incidents created');tick();
      for(const r of f.rows){const root=idx(r.x,r.y);add(r.q.id+' real severe service incident removes availability',assetAvailability493(root,'services')===0,{availability:assetAvailability493(root,'services'),incident:incidentForRoot493(root,'services')});disabled(r,r.q.id+' unavailable equipment');}
      for(const q of incidents)incidentRestore493(q);tick();for(const [j,r]of f.rows.entries()){requireReady(r,r.q.id+' restored native incident');add(r.q.id+' restored capacity follows real workforce',baseline[j]>0&&publicLifeCapacityFactor007(idx(r.x,r.y),at(r.x,r.y).bld)>0,{before:baseline[j],after:publicLifeCapacityFactor007(idx(r.x,r.y),at(r.x,r.y).bld)});}
      // Partial capacity is caused by a real water-source incident. A dedicated
      // network has one tower, many public roots and homes; no allocation is forged.
      fresh();const q=specs.find(q=>q.k===262),p=fixture(Array.from({length:12},()=>q));for(const [x,y]of p.waters.slice(1))require(doPlace('doze',x,y,true),'remove spare tower');tick();tick();const before=p.rows.map(r=>({water:snapshot(r).waterDelivered,factor:publicLifeFactors007(idx(r.x,r.y),at(r.x,r.y).bld).water,capacity:publicLifeCapacityFactor007(idx(r.x,r.y),at(r.x,r.y).bld)}));
      const [wx,wy]=p.waters[0],incident=incidentCreate493(idx(wx,wy),'drill',2,'water',{authorized:false});require(incident,'water-source incident');tick();const after=p.rows.map(r=>({water:snapshot(r).waterDelivered,factor:publicLifeFactors007(idx(r.x,r.y),at(r.x,r.y).bld).water,capacity:publicLifeCapacityFactor007(idx(r.x,r.y),at(r.x,r.y).bld)}));
      add('reduced real water supply produces bounded partial or zero capacity',waterCycle472.unserved>0&&after.some((a,i)=>a.water<before[i].water&&a.factor<before[i].factor&&a.capacity<before[i].capacity)&&after.every(a=>a.factor>=0&&a.factor<=1&&a.capacity>=0&&a.capacity<=1.14),{water:copy(waterCycle472),before,after,sourceAvailability:assetAvailability493(idx(wx,wy),'water')});
    });
    group('public-workforce-budget-mobility',()=>{
      fresh();const f=fixture();tick();tick();const nominal=sum(specs.map(q=>q.jobs)),staff=f.rows.map(r=>publicStaffRoot495.get(idx(r.x,r.y)));
      add('all twelve public roots preserve exact accounting without dilution',publicLifePublicJobs007()===nominal&&civicPlan495.rawNominal===nominal&&civicPlan495.scale===1&&staff.every((s,n)=>s?.nominal===f.rows[n].q.jobs&&s.accountingNominal===s.nominal&&s.employed>0&&s.activePositions>0),{expected:nominal,plan:civicPlan495,staff});
      add('two schools supply exact native nominal and staffed education seats',civic495.education.nominalSeats===360&&civic495.education.effectiveSeats>0&&civic495.education.effectiveSeats<=360*1.14&&civic495.health.nominalBeds===0,{education:civic495.education,health:civic495.health});
      const acts=f.rows.map(r=>{const root=idx(r.x,r.y),b=tiles[root].bld,a=activityCapacity491(root,b),cf=publicLifeCapacityFactor007(root,b);add(r.q.id+' real public workforce and truthful capacities',a.publicJobs>0&&a.enterpriseJobs===0&&a.shopping===0&&a.work===a.publicJobs&&near(a.education,r.q.seats*cf)&&near(a.services,r.q.services*cf)&&near(a.leisure,r.q.leisure*cf*(1+Math.min(.35,(tourists||0)/2200))),{activity:a,capacityFactor:cf,staff:publicStaffRoot495.get(root)});add(r.q.id+' no phantom population commerce industry or garbage',residentPopulation488(root,b)===0&&enterprisePotentialJobs489(root,b)===0&&sanWasteOfRoot452(root,1)===0,{population:residentPopulation488(root,b),enterprise:enterprisePotentialJobs489(root,b),waste:sanWasteOfRoot452(root,1)});return a;});
      const blocks=mobilityBlocks491();for(const key of ['publicJobs','education','services','leisure'])add('mobility receives exact '+key+' opportunities once',near(sum(blocks.map(b=>b[key])),sum(acts.map(a=>a[key]))),{blocks:sum(blocks.map(b=>b[key])),roots:sum(acts.map(a=>a[key]))});
      add('every public root is an actual commuting destination',f.rows.every(r=>blocks.some(b=>b.publicRoots.includes(idx(r.x,r.y))))&&mobility491.purpose.work>0&&mobility491.purpose.education>0&&mobility491.purpose.services>0&&mobility491.purpose.leisure>0&&civic495.publicEmployed<=Math.round(pop*.60),{population:pop,mobility:mobility491,publicEmployed:civic495.publicEmployed});
      for(const r of f.rows.filter(r=>r.q.seats)){const root=idx(r.x,r.y),cf=publicLifeCapacityFactor007(root,tiles[root].bld),cap=capFacility506({publicRoots:[root]}),grammar=r.q.k===267;add(r.q.id+' reaches native child and school environment capabilities',cf>0&&near(cap.child,grammar?5*cf:0)&&near(cap.schoolEnv,(grammar?1:1.1)*cf/3)&&cap.health===0,{cap,factor:cf});}
      const sanitation=prepareSanitationLoad452(1);add('public buildings add no industrial garbage or private tax',near(sanitation.totalDemand,pop*.05,1e-7)&&fin.taxC===0&&fin.taxI===0,{sanitation,pop,taxC:fin.taxC,taxI:fin.taxI});
      // One root at a time prevents any other public provider masking a role or budget.
      for(const q of specs){fresh();const one=fixture([q]);tick();tick();const r=one.rows[0],root=idx(r.x,r.y),b=tiles[root].bld,a=activityCapacity491(root,b);add(q.id+' isolated role reaches the native authority',publicLifePublicJobs007()===q.jobs&&civicPlan495.rawNominal===q.jobs&&civicPlan495.scale===1&&publicStaffRoot495.get(root)?.employed>0&&a.publicJobs>0&&(q.seats?a.education>0:a.education===0)&&(q.services?a.services>0:a.services===0)&&(q.leisure?a.leisure>0:a.leisure===0),{activity:a,staff:publicStaffRoot495.get(root),civic:civic495});
        if(q.budget){const measure=value=>{setSvcBudget(q.budget,value-svcBudget[q.budget]);civicPlan495=null;const e=prepareEnterprise489(enterprise489.legacyJobs+enterprise489.legacyPublicPositions,pop,0,0);prepareCivicServices495(e);return {nominal:publicJobCapacity491(b),staff:copy(publicStaffRoot495.get(root)),factors:civicFactors495(root,b),capacity:activityCapacity491(root,b),upkeep:publicLifeUpkeep007()};},low=measure(.5),high=measure(1.5),key=q.seats?'education':'services',scales=['education','fire','police'].includes(q.role);add(q.id+' budget has exact upkeep and native capacity semantics',low.nominal===q.jobs&&high.nominal===q.jobs&&low.staff.accountingNominal===q.jobs&&high.staff.accountingNominal===q.jobs&&near(high.upkeep-low.upkeep,q.upkeep)&&(scales?high.factors.serviceFactor>low.factors.serviceFactor&&high.capacity[key]>low.capacity[key]:near(high.capacity[key],low.capacity[key])),{low,high,capacityScales:scales});setSvcBudget(q.budget,1-svcBudget[q.budget]);}
      }
      // Preserve native public staffing: T491 aggregate commuting and T495
      // staffing are authoritative. Individual c.work remains legacy RCI-only.
      fresh();const employed=fixture([specs.find(q=>q.k===266)]);tick();tick();const job=employed.rows[0],workRoot=idx(job.x,job.y),block=mobilityBlocks491().find(b=>b.publicRoots.includes(workRoot)),staffed=publicStaffRoot495.get(workRoot),access=publicLaborRoot495.get(workRoot),destination=block?block.gx+','+block.gy:null;
      add('isolated public root has actual aggregate native work OD and labor mapping',!!block&&block.publicJobs>0&&publicLaborRoot495.has(workRoot)&&access>0&&access<=1&&staffed?.nominal===job.q.jobs&&staffed.accountingNominal===job.q.jobs&&staffed.employed>0&&mobility491.od.some(od=>od.purpose==='work'&&od.destination===destination&&od.trips>0),{block,staff:staffed,laborAccess:access,workOD:mobility491.od.filter(od=>od.purpose==='work')});
      require(doPlace('doze',job.x+job.q.sz-1,job.y+job.q.sz-1,true),'public workplace reference demolition');tick();const remaining=mobilityBlocks491();add('demolition removes public destination opportunities staffing and aggregate work trips',!remaining.some(b=>b.publicRoots.includes(workRoot))&&!publicStaffRoot495.has(workRoot)&&!publicLaborRoot495.has(workRoot)&&sum(remaining.map(b=>b.publicJobs))===0&&sum(remaining.map(b=>b.education))===0&&mobility491.purpose.work===0&&mobility491.purpose.education===0,{blocks:remaining,staff:publicStaffRoot495.get(workRoot)||null,labor:publicLaborRoot495.get(workRoot)??null,purpose:mobility491.purpose});
      fresh();const vacant=fixture();tick();tick();for(const h of vacant.households)require(doPlace('doze',h.x+1,h.y+1,true),'workforce-home demolition');tick();add('no residents means no actual public staff or education',pop===0&&civic495.publicEmployed===0&&civic495.education.effectiveSeats===0,{pop,civic:civic495});
      for(const r of vacant.rows){const root=idx(r.x,r.y),b=tiles[root].bld,a=activityCapacity491(root,b),staff=publicStaffRoot495.get(root);add(r.q.id+' no workforce means no service leisure or emergency response',staff?.nominal===r.q.jobs&&staff.employed===0&&staff.capacityFactor===0&&a.education===0&&a.services===0&&a.leisure===0&&!publicLifeEmergencyReady007(root,b),{staff,activity:a,emergency:publicLifeEmergencyReady007(root,b)});}
      noRng('public-life read-only capacities',()=>{for(const r of vacant.rows){const root=idx(r.x,r.y),b=tiles[root].bld;publicLifeBuilt007(b);publicLifeOperational007(root,b);publicLifeCapacityFactor007(root,b);publicLifeEmergencyReady007(root,b);publicJobCapacity491(b);powerLoadBase471(b);rootWaterDemandBase472(b);}});
    });
    group('coverage-symmetry-overlays',()=>{
      for(const q of specs){fresh();utilities();const rows=[{q,x:24,y:28-q.sz},{q,x:28,y:28-q.sz}];for(const r of rows)place(q.id,r.x,r.y).age=30;tick();const field=q.coverage,point=idx(26,28-q.sz),both=Array.from(COV[field]),expected=expectedCoverage(rows);
        add(q.id+' exact native field is two geometric stamps',same(both,expected)&&COV[field][point]===2&&rows.every(r=>publicLifeOperational007(idx(r.x,r.y),at(r.x,r.y).bld)),{field,overlap:COV[field][point],actualTotal:sum(both),expectedTotal:sum(expected)});
        refreshPublicLifeCoverage007();refreshPublicLifeCoverage007();add(q.id+' repeated refresh is idempotent',same(Array.from(COV[field]),both),{field});rebuildCov();add(q.id+' full rebuild equals native incremental field',same(Array.from(COV[field]),both),{field});
        const preview=placementCoverage459(q.id);add(q.id+' native placement overlay uses exact field and radius',preview?.field===field&&preview.r===COVR[field],{preview,expected:COVR[field]});
        const color=miniColor(5,26,28-q.sz),visible=['police','fire2','park'].includes(field),expectedColor=visible?'#ac563c':'#c83c3c';add(q.id+' native services overlay reads its actual coverage family',color===expectedColor,{color,expected:expectedColor,field,contributesToFiveFamilyNativeView:visible});
        if(q.budget){for(const value of [.5,1.5,1]){setSvcBudget(q.budget,value-svcBudget[q.budget]);const want=expectedCoverage(rows,value),got=Array.from(COV[field]),preview=placementCoverage459(q.id);add(q.id+' budget '+value+' exact radius and full array',same(got,want)&&preview?.r===Math.max(1,Math.round(COVR[field]*value)),{sum:sum(got),expected:sum(want),preview});refreshPublicLifeCoverage007();rebuildCov();add(q.id+' budget '+value+' rebuild and refresh never duplicate',same(Array.from(COV[field]),want),{field});}}
        if(q.budget){for(const value of [1.5,.5,1]){svcBudget[q.budget]=value;refreshPublicLifeCoverage007();const want=expectedCoverage(rows,value);add(q.id+' direct budget '+value+' removes stored old radius exactly',same(Array.from(COV[field]),want),{actual:sum(Array.from(COV[field])),expected:sum(want),stamps:[...publicLifeCovRoots007.entries()]});refreshPublicLifeCoverage007();rebuildCov();add(q.id+' direct budget '+value+' rebuild equals incremental array',same(Array.from(COV[field]),want),{field});}}
        const r=rows[0];openUndo('overlap demolition');require(doPlace('doze',r.x+q.sz-1,r.y+q.sz-1,true),'overlap demolition');closeUndo();const one=Array.from(COV[field]);add(q.id+' reference demolition removes exact one stamp',same(one,expectedCoverage(rows.slice(1)))&&COV[field][point]===1,{field,overlap:COV[field][point]});refreshPublicLifeCoverage007();refreshPublicLifeCoverage007();add(q.id+' repeated unstamp cannot underflow',same(Array.from(COV[field]),one)&&Math.max(...COV[field])===1,{field,max:Math.max(...COV[field])});
        require(undo(),'coverage demolition undo');tick();add(q.id+' undo restores exact two-stamp field',same(Array.from(COV[field]),both),{field});for(const z of rows)require(doPlace('doze',z.x,z.y,true),'last coverage demolition');refreshPublicLifeCoverage007();rebuildCov();add(q.id+' final removal clears entire field and native overlay',COV[field].every(v=>v===0)&&miniColor(5,26,28-q.sz)==='#c83c3c',{field,total:sum(Array.from(COV[field]))});
      }
      for(const k of [264,265]){fresh();utilities();const q=specs.find(q=>q.k===k),tool=q.role==='police'?'police':'fireStation2',oldSize=MSZ[q.baseK]||1,newRow={q,x:24,y:28-q.sz},oldRow={q:{coverage:q.coverage,budget:q.budget},x:28,y:28-oldSize};place(q.id,newRow.x,newRow.y).age=30;place(tool,oldRow.x,oldRow.y).age=30;tick();const both=expectedCoverage([newRow,oldRow]),field=q.coverage;
        add(q.id+' new and native station overlap without replacing native stamp',same(Array.from(COV[field]),both),{field,total:sum(Array.from(COV[field])),expected:sum(both),nativeK:at(oldRow.x,oldRow.y).bld.k});
        openUndo('mixed native new demolition');require(doPlace('doze',newRow.x+q.sz-1,newRow.y+q.sz-1,true),'new mixed reference demolition');closeUndo();refreshPublicLifeCoverage007();add(q.id+' new demolition preserves every native coverage cell',same(Array.from(COV[field]),expectedCoverage([oldRow])),{field,total:sum(Array.from(COV[field]))});require(undo(),'mixed coverage undo');tick();require(doPlace('doze',oldRow.x,oldRow.y,true),'native station demolition');refreshPublicLifeCoverage007();add(q.id+' native demolition preserves every new coverage cell',same(Array.from(COV[field]),expectedCoverage([newRow])),{field,total:sum(Array.from(COV[field]))});rebuildCov();add(q.id+' mixed station rebuild stays exact after native removal',same(Array.from(COV[field]),expectedCoverage([newRow])),{field});
      }
    });
    group('save-load-identities',()=>{
      const observedLoad=(saved,rows,label)=>{
        const original={load,housingLoad488,housingMarketStep488,preparePowerDispatch471,socialLoad505,mobilityLoad509,fiscalLoad515};
        const trace={loadCalls:[],restores:[],marketSteps:[],powerDispatchCalls:0,events:[],persistent:{s505:[],mob509:[],fiscal515:[]},savedOccupancy:copy(saved.h488),savedDay:saved.day};
        const housingState=()=>({day,ready:housing488.ready,grace:housing488.grace,occ:copy(housing488.occ),markets:copy(housing488.markets)});
        let ok=false;
        load=function(...args){trace.loadCalls.push(copy(args));return original.load.apply(this,args);};
        housingLoad488=function(...args){const value=original.housingLoad488.apply(this,args);trace.restores.push({raw:copy(args[0]),legacy:args[1]===true,state:housingState()});trace.events.push('restored');return value;};
        housingMarketStep488=function(...args){const step={before:housingState()};trace.events.push('market-start');const value=original.housingMarketStep488.apply(this,args);step.after=housingState();trace.marketSteps.push(step);trace.events.push('market-end');return value;};
        preparePowerDispatch471=function(...args){trace.powerDispatchCalls++;return original.preparePowerDispatch471.apply(this,args);};
        socialLoad505=function(...args){const value=original.socialLoad505.apply(this,args);trace.persistent.s505.push({raw:copy(args[0]),state:copy(socialSave505())});return value;};
        mobilityLoad509=function(...args){const value=original.mobilityLoad509.apply(this,args);trace.persistent.mob509.push({raw:copy(args[0]),state:copy(mobilitySave509())});return value;};
        fiscalLoad515=function(...args){const value=original.fiscalLoad515.apply(this,args);trace.persistent.fiscal515.push({raw:copy(args[0]),state:copy(fiscalSave515())});return value;};
        try{ok=load(3);trace.loaded=housingState();trace.roots=rows.map(snapshot);trace.dispatch=copy({day:power471.day,allocation:powerAlloc450,pools:power471.pools,sources:power471.sources,loads:power471.loads,districts:powerDistricts450.map(d=>({id:d.id,capacity:d.capacity,used:d.used,spare:d.spare}))});}
        finally{load=original.load;housingLoad488=original.housingLoad488;housingMarketStep488=original.housingMarketStep488;preparePowerDispatch471=original.preparePowerDispatch471;socialLoad505=original.socialLoad505;mobilityLoad509=original.mobilityLoad509;fiscalLoad515=original.fiscalLoad515;}
        add(label+' load observers restore every original function',load===original.load&&housingLoad488===original.housingLoad488&&housingMarketStep488===original.housingMarketStep488&&preparePowerDispatch471===original.preparePowerDispatch471,{load:load===original.load,housingLoad:housingLoad488===original.housingLoad488,marketStep:housingMarketStep488===original.housingMarketStep488,powerDispatch:preparePowerDispatch471===original.preparePowerDispatch471});
        require(ok,label+' normal load failed');
        add(label+' every persistent observer restores the original function',socialLoad505===original.socialLoad505&&mobilityLoad509===original.mobilityLoad509&&fiscalLoad515===original.fiscalLoad515,{social:socialLoad505===original.socialLoad505,mobility:mobilityLoad509===original.mobilityLoad509,fiscal:fiscalLoad515===original.fiscalLoad515});
        for(const key of ['s505','mob509','fiscal515']){const rows=trace.persistent[key],raw=saved[key]??null;add(label+' '+key+' restores exact supported persistent payload once',rows.length===1&&JSON.stringify(rows[0].raw)===JSON.stringify(raw)&&JSON.stringify(rows[0].state)===JSON.stringify(raw),{saved:raw,restores:rows});}

        const restored=trace.restores[0],step=trace.marketSteps[0],expected=Object.fromEntries(HOUSING_BANDS488.map((band,n)=>[band,saved.h488?.[n]]));
        add(label+' native load restores serialized occupancy exactly once before its one market pass',trace.loadCalls.length===1&&same(trace.loadCalls[0],[3])&&trace.restores.length===1&&restored?.legacy===false&&JSON.stringify(restored.raw)===JSON.stringify(saved.h488)&&HOUSING_BANDS488.every(band=>restored?.state.occ[band]===expected[band])&&restored?.state.grace===0&&!restored?.state.ready&&trace.marketSteps.length===1&&same(trace.events,['restored','market-start','market-end']),{loadCalls:trace.loadCalls,restores:trace.restores,marketStepCount:trace.marketSteps.length,events:trace.events,serializedOccupancy:trace.savedOccupancy});
        const bounds=HOUSING_BANDS488.map(band=>{const before=step?.before.occ[band],after=step?.after.occ[band],market=step?.after.markets[band],delta=after-before,limit=step?.before.grace>0?.0035:.012,target=market?.targetOccupancy;return{band,before,after,delta,limit,capacity:market?.capacity,target,ok:Number.isFinite(after)&&after>=.35&&after<=1&&before===expected[band]&&after===trace.loaded.occ[band]&&(market?.capacity>0?Math.abs(delta)<=limit+1e-12&&delta*(target-before)>=-1e-12:after===1)};});
        add(label+' native load has exactly one bounded occupancy recalculation without advancing a day',trace.marketSteps.length===1&&step?.before.day===saved.day&&step?.after.day===saved.day&&trace.loaded.day===saved.day&&bounds.every(b=>b.ok),{bounds,marketSteps:trace.marketSteps,loadedOccupancy:trace.loaded.occ,savedDay:saved.day,loadedDay:trace.loaded.day});
        // Snapshot raw authority state before any status/ensure query. A normal
        // load may already dispatch real power, while water eligibility remains
        // unset until the first ordinary day. Power is never assigned by this guard.
        const dispatch=trace.dispatch;
        add(label+' native load invokes real power dispatch',trace.powerDispatchCalls>0&&dispatch.day===saved.day,{powerDispatchCalls:trace.powerDispatchCalls,dispatchDay:dispatch.day,savedDay:saved.day});
        for(const [n,r]of rows.entries()){
          const s=trace.roots[n],l=dispatch.loads.find(l=>l.root===s.root),pool=dispatch.pools.find(p=>p.id===l?.pool),district=dispatch.districts.find(d=>d.id===l?.district),sources=dispatch.sources.filter(q=>q.online&&q.pool===l?.pool);
          add(r.q.id+' '+label+' loaded power matches physically supplied root authority',s.pw===(s.powerState===1)&&s.powerState===1&&l?.k===r.q.k&&l.pool>=0&&l.district>=0&&pool?.districts.includes(l.district)&&sources.length>0&&pool.evening.physicalDispatched004>0&&district?.used>=l.demand.evening-1e-9,{snapshot:s,load:l,pool:pool?.id,physical:pool?.evening.physicalDispatched004,district,sources:sources.map(q=>({root:q.root,k:q.k,pool:q.pool,online:q.online}))});
        }
        for(const pool of dispatch.pools){const raw=pool.evening?.physicalDispatched004,ds=dispatch.districts.filter(d=>pool.districts.includes(d.id)),used=sum(ds.map(d=>d.used)),capacity=sum(ds.map(d=>d.capacity)),tol=Number.EPSILON*Math.max(1,Math.abs(raw||0))*Math.max(16,dispatch.loads.length*4);add(label+' loaded pool '+pool.id+' conserves physical dispatch across all districts',Number.isFinite(raw)&&raw>0&&used<=raw+tol&&capacity<=raw+tol&&ds.every(d=>d.used>=0&&d.used<=d.capacity+tol),{physical:raw,used,capacity,tolerance:tol,districts:ds});}
        return trace.roots;
      };
      fresh();const f=fixture();tick();tick();const before=f.rows.map(snapshot),persistent={h488:copy(housingSave488()),s505:copy(socialSave505()),mob509:copy(mobilitySave509()),fiscal515:copy(fiscalSave515())},first=save3();for(const key of Object.keys(persistent))add('native save serializes '+key+' authority exactly',JSON.stringify(first[key]??null)===JSON.stringify(persistent[key]),{saved:first[key],authority:persistent[key]});const loaded=observedLoad(first,f.rows,'mature serviced public-life'),power=powerSnapshot();
      add('supported native load does not advance the day',day===first.day,{saved:first.day,loaded:day});physicalPower('supported native load',power);
      for(const [j,r]of f.rows.entries()){const a=loaded[j],b=tiles[a.root].bld;add(r.q.id+' normal load preserves fixed identity age and references',footprint(r.q,r.x,r.y)&&b.age===before[j].age&&b.k===before[j].k,{building:b});const l=power.loads.find(v=>v.root===a.root),pool=power.pools.find(p=>p.id===l?.pool),sources=power.sources.filter(v=>v.online&&v.pool===l?.pool);add(r.q.id+' loaded power is actually sourced and water remains pending',a.pw===(a.powerState===1)&&a.powerState===1&&l?.k===r.q.k&&pool&&sources.length>0&&a.wa===false,{loaded:a,load:l,pool:pool?.id,sources:sources.map(v=>({root:v.root,k:v.k,pool:v.pool}))});inspectFootprint(r.q,r.x,r.y,r.q.id+' loaded');}
      tick();const ordinary=f.rows.map(snapshot);physicalPower('first ordinary post-load day',powerSnapshot());
      for(const [j,r]of f.rows.entries()){requireReady(r,r.q.id+' first ordinary day after load');const root=ordinary[j].root,a=activityCapacity491(root,tiles[root].bld),staff=publicStaffRoot495.get(root);add(r.q.id+' first loaded day restores actual staffing and role',ordinary[j].age===before[j].age+1&&staff?.employed>0&&a.publicJobs>0&&(r.q.seats?a.education>0:a.education===0)&&(r.q.services?a.services>0:a.services===0)&&(r.q.leisure?a.leisure>0:a.leisure===0),{snapshot:ordinary[j],staff,activity:a});}
      add('first loaded day keeps real T719 households and public nominal totals',pop>0&&f.households.filter(h=>h.id!=='britishTerrace').every(h=>residentPopulation488(h.root,tiles[h.root].bld)>0)&&publicLifePublicJobs007()===sum(specs.map(q=>q.jobs))&&fin.taxC===0&&fin.taxI===0,{pop,publicJobs:publicLifePublicJobs007(),taxC:fin.taxC,taxI:fin.taxI});
      // Separate mixed identity save includes every T717/T718/T719 ID. Existing
      // records are compared byte-for-byte, never rewritten into the new registry.
      fresh();const rows=specs.map((q,n)=>({q,x:8+8*(n%7),y:6+6*Math.floor(n/7)}));for(const r of rows)place(r.q.id,r.x,r.y);
      const oldSpecs=[...Object.values(BRITISH004),...Object.values(HIGHSTREET005),...Object.values(RESIDENTIAL006)],oldRows=oldSpecs.map((q,n)=>({q,x:6+8*(n%7),y:25+7*Math.floor(n/7)}));for(const r of oldRows)place(r.q.id,r.x,r.y).age=30;
      for(const age of [0,4,8,9,30]){for(const r of rows)at(r.x,r.y).bld.age=age;const saved=save3(),old=saved.bl.filter(a=>a[1]<262),newer=saved.bl.filter(a=>a[1]>=262&&a[1]<=273);add('age '+age+' exactly twelve fixed public-life save records',newer.length===12&&newer.every(a=>a[2]===1&&a[3]===0&&a[4]===age)&&same(newer.map(a=>a[1]).sort((a,b)=>a-b),specs.map(q=>q.k)),newer);observedLoad(saved,[],'isolated mixed identities age '+age);for(const r of rows)add(r.q.id+' age '+age+' load keeps complete fixed footprint',footprint(r.q,r.x,r.y)&&at(r.x,r.y).bld.age===age,{building:at(r.x,r.y).bld});const after=save3();add('age '+age+' all old British records remain byte-exact',JSON.stringify(after.bl.filter(a=>a[1]<262))===JSON.stringify(old)&&oldSpecs.every(q=>old.some(a=>a[1]===q.k)),{oldCount:old.length,ids:old.map(a=>a[1])});add('age '+age+' rejected gap remains absent',!after.bl.some(a=>a[1]>=222&&a[1]<=237),{ids:after.bl.map(a=>a[1])});tick();for(const r of rows){add(r.q.id+' age '+age+' first loaded day ages only once',at(r.x,r.y).bld.age===age+1&&footprint(r.q,r.x,r.y),{building:at(r.x,r.y).bld});disabled(r,r.q.id+' isolated first loaded day');}}
      const malformed=save3();for(const rec of malformed.bl)if(rec[1]>=262&&rec[1]<=273){rec[2]=3;rec[3]=999;}localStorage.setItem(slotKey(3),JSON.stringify(saveDeflate(malformed)));require(load(3),'fixed variant normalization');for(const r of rows)add(r.q.id+' unsupported level variant normalizes safely',footprint(r.q,r.x,r.y),{building:at(r.x,r.y).bld});
    });
    group('emergency-court-authorities',()=>{
      for(const k of [264,265]){fresh();const q=specs.find(q=>q.k===k),f=fixture([q]),r=f.rows[0],root=idx(r.x,r.y),target=idx(24,27),targetTile=tiles[target];
        // Existing native response currently accepts legacy RCI incident targets.
        // Seed one ordinary legacy house, then let all utilities/staff dispatch natively.
        require(!targetTile.bld,'native response target cell is empty');targetTile.bld={k:1,lv:1,v:0,age:30,h:1,we:1,den:1};buildTickIndex();tick();tick();const b=tiles[root].bld,staff=publicStaffRoot495.get(root),type=q.role,arr=type==='fire'?ladderTrucks:policeCars,update=type==='fire'?updFireTrucks:updPoliceCars,need=type==='fire'?4:3;
        requireReady(r,q.id+' staffed response source');const route=emergencyRouteToCase455(type,target);add(q.id+' actual native source and road path',staff?.employed>=need&&publicLifeEmergencyReady007(root,b)&&route.ok&&route.station===root&&route.path.length>1&&route.path.every(([x,y])=>tiles[idx(x,y)].road)&&emergencyStationRoots455(type).includes(root)&&EM_FIELD455[type].online.includes(root),{staff,route,sources:emergencyStationRoots455(type),online:EM_FIELD455[type].online});
        add(q.id+' emergency minimap displays real online source',miniColor(12,r.x,r.y)===(type==='fire'?'#ef665c':'#6e9bea'),{color:miniColor(12,r.x,r.y),type});
        tiles[target].bld[type==='fire'?'fire':'crime']=1;if(type==='police')tiles[target].bld.crimeDays=7;arr.length=0;update(0);const dispatched=copy(arr);add(q.id+' native updater dispatches an actual vehicle from this station',dispatched.length===1&&dispatched[0].station===root&&dispatched[0].caseIdx===target&&dispatched[0].type===type&&dispatched[0].path.length>1,{dispatched,target,root});
        const outage=incidentCreate493(root,'drill',4,'services',{authorized:false});require(outage,'source station native availability incident');update(0);add(q.id+' native updater cancels in-flight vehicle after exact source loses availability',dispatched[0]?.publicLifeStation007===true&&assetAvailability493(root,'services')===0&&!publicLifeEmergencyReady007(root,tiles[root].bld)&&arr.length===0&&tiles[target].bld?.[type==='fire'?'fire':'crime']===1,{source:root,availability:assetAvailability493(root,'services'),remaining:copy(arr),target:tiles[target].bld});
        incidentRestore493(outage);update(0);const restoredRoute=emergencyRouteToCase455(type,target);add(q.id+' restoring the real source resumes eligible native response without field injection',publicLifeEmergencyReady007(root,tiles[root].bld)&&restoredRoute.ok&&restoredRoute.station===root&&arr.length===1&&arr[0].station===root&&arr[0].caseIdx===target,{route:restoredRoute,vehicles:copy(arr)});
        for(let n=0;n<80&&tiles[target].bld?.[type==='fire'?'fire':'crime'];n++)update(.5);add(q.id+' actual native arrival resolves the incident',tiles[target].bld?.[type==='fire'?'fire':'crime']===0&&arr.length===0&&(type==='fire'||tiles[target].bld.crimeDays===0),{target:tiles[target].bld,remaining:arr.length});
        // Force a new incident as fixture input, then physically remove all labor.
        for(const h of f.households)if(tiles[h.root].bld)require(doPlace('doze',h.x,h.y,true),'remove public workforce');require(doPlace('doze',target%N,(target/N)|0,true),'remove legacy workforce');tick();add(q.id+' no residents cannot supply emergency crew',pop===0&&!publicLifeEmergencyReady007(root,b)&&!emergencyStationRoots455(type).includes(root)&&civicDispatchCap495(type,svcFleet[type])===0,{pop,staff:publicStaffRoot495.get(root),sources:emergencyStationRoots455(type),cap:civicDispatchCap495(type,svcFleet[type])});
      }
      // Positive native court witness: the same ordinary tick sees a draw strictly
      // between its actual court and no-court thresholds. Never overwrite crime,
      // coverage, the court multiplier, or the native tick function to manufacture it.
      const witness=[];
      for(const withCourt of [true,false]){fresh();const q=specs.find(q=>q.k===263),f=fixture([q]),r=f.rows[0],root=idx(r.x,r.y),target=idx(18,15);require(!tiles[target].bld,'native court witness target cell is empty');tiles[target].bld={k:1,lv:1,v:0,age:30,h:1,we:1,den:1};buildTickIndex();tick();tick();requireReady(r,'court before witness');if(!withCourt)require(doPlace('doze',r.x+2,r.y+2,true),'court control demolition');
        const b=tiles[target].bld;delete b.crime;delete b.crimeDays;const oldR=R,oldNight=nightCrimeMul487,seen=[],draw=.00075;let calls=0;
        // The native risk without police lies in [.9292,1.14] before optional
        // policies; this fixture has no policies/tech. Record the actual evaluated
        // multiplier to prove the draw straddles the real thresholds, not an estimate.
        R=()=>{calls++;return draw;};nightCrimeMul487=function(i,bb){const value=oldNight(i,bb);if(i===target)seen.push({i,k:bb.k,lv:bb.lv,multiplier:value,court:COV.court[i],police:COV.police[i],police2:COV.police2[i],prison:COV.prison[i],threshold:.001*bb.lv*(pol?.curfew?.6:1)*(pol?.nightMarket?1.15:1)*(pol?.parkNight?1.05:1)*tq('B2',.92,1)*tq('B4b',1.05,1)*tq('B7',.90,1)*value});return value;};
        try{tick();}finally{R=oldR;nightCrimeMul487=oldNight;}
        const trace=seen.at(-1);witness.push({withCourt,crime:!!tiles[target].bld?.crime,draw,calls,trace});add('court '+(withCourt?'present':'absent')+' native risk branch observed and instrumentation restored',R===oldR&&nightCrimeMul487===oldNight&&seen.length===1&&trace.police===0&&trace.police2===0&&trace.prison===0&&draw>trace.threshold*.5&&draw<trace.threshold&&(withCourt?trace.court>0:trace.court===0),witness.at(-1));
      }
      add('magistrates court actually prevents a native crime in the paired positive witness',witness[0].withCourt&&!witness[0].crime&&!witness[1].withCourt&&witness[1].crime,witness);
    });
    group('offline-upkeep',()=>{
      for(const q of specs){fresh();const r={q,x:20,y:20};place(q.id,r.x,r.y);tick();const b=at(r.x,r.y).bld;disabled(r,q.id+' unbuilt isolated');add(q.id+' unfinished building has zero upkeep and tax',b.age===1&&fin.net===0&&fin.taxR===0&&fin.taxC===0&&fin.taxI===0,{age:b.age,net:fin.net,taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI});b.age=8;tick();disabled(r,q.id+' complete isolated');add(q.id+' day-nine offline upkeep equals locked card',b.age===9&&near(fin.net,-(q.upkeep||0))&&fin.taxR===0&&fin.taxC===0&&fin.taxI===0,{net:fin.net,expected:-(q.upkeep||0),taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI});
        b.age=30;for(let n=0;n<3;n++)tick();add(q.id+' permanent mature identity has finite finances',b.k===q.k&&b.lv===1&&b.v===0&&b.sz===q.sz&&b.age===33&&Number.isFinite(money)&&near(fin.net,-(q.upkeep||0)),{building:b,money,net:fin.net});
      }
    });
  }catch(e){currentGroup='guard';exceptions.push({group:'guard',message:e.message,stack:String(e.stack||'')});add('guard instrumentation exception',false,{message:e.message});}
  finally{
    group('cleanup',()=>{fresh();hideInfo();add('cleanup leaves empty paused slot-3 world',curSlot()===3&&!tiles.some(t=>t.bld)&&speed===0,{slot:curSlot(),roots:tiles.filter(t=>t.bld).length,speed});},true);
    for(const [op,desc]of Object.entries(storageOriginal))Object.defineProperty(storageProto,op,desc);
    currentGroup='guard';add('player save slots never read or modified',storageAudit.protectedAttempts.length===0,storageAudit);
    const ran=groups.filter(g=>g.ran&&g.name!=='cleanup').map(g=>g.name),expected=groupFilter?[groupFilter]:groupNames;
    add('every requested bounded group ran exactly once',same(ran,expected),{ran,expected});
  }
  return result({storageAudit});
}
