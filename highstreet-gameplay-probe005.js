/* GPT-005 destructive integration guard. Embed after highStreetSelftest005 inside
   the main game IIFE, export through GV. Never invoke against a player's profile.
   The marker AND slot check are mandatory. Fixtures seed terrain/age/citizens;
   power, water, placement, simulation, coverage and save/load use real authorities. */
function highStreetGameplayProbe005(groupFilter){
  const groupNames=['catalog-unlock-rejection','placement-inspector-undo','construction-day-nine','perimeter-real-utilities','utility-loss','public-workforce-budget','coverage-symmetry','save-load-identities','commerce-supply-tax-mobility','offline-upkeep'];
  const checks=[],details=[],exceptions=[],groups=[],started=performance.now();
  let currentGroup='guard';
  const copy=q=>q===undefined?null:JSON.parse(JSON.stringify(q));
  const add=(name,ok,actual)=>{checks.push(name+(ok?' ✓':' ✗'));details.push({group:currentGroup,name,ok:!!ok,actual:copy(actual)});return !!ok;};
  const result=extra=>({ok:details.length>0&&details.every(q=>q.ok)&&exceptions.length===0,checks,details,exceptions,groups,groupNames,requestedGroup:groupFilter??null,selectedGroup:groupFilter??null,ranGroups:groups.filter(g=>g.ran&&g.name!=='cleanup').map(g=>g.name),slot:curSlot(),disposable:true,elapsedMs:+(performance.now()-started).toFixed(2),assertions:details.length,...extra});
  if(groupFilter!=null&&(typeof groupFilter!=='string'||!groupNames.includes(groupFilter))){add('known named group required',false,{requested:groupFilter,groupNames});return result({guarded:true});}
  if(window.__highStreetQA005!==true||curSlot()!==3){add('disposable slot-3 guard',false,{marker:window.__highStreetQA005===true,slot:curSlot()});return result({guarded:true});}
  if(devUnlockAll516B()||devState516B.sandbox||devGod516B()){add('ordinary simulation required',false,{unlockAll:devUnlockAll516B(),sandbox:devState516B.sandbox});return result({guarded:true});}
  const flags=['__noHighStreet005','__noBritishBuildings004','__noEnterprise489','__noHousing488','__noCivicServices495','__noWater472','__noPower471'];
  if(flags.some(k=>window[k])||powerLegacy450()||waterLegacy449()){add('production authorities enabled',false,{flags:flags.filter(k=>window[k]),legacyPower:powerLegacy450(),legacyWater:waterLegacy449()});return result({guarded:true});}
  const require=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const specs=HIGHSTREET_EXPECTED005.map(e=>({...e,nm:HIGHSTREET005[e.k]?.nm})),commerce=specs.filter(q=>q.kind==='C'),publics=specs.filter(q=>q.kind!=='C');
  const near=(a,b,eps=1e-8)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=eps;
  const sum=a=>a.reduce((x,y)=>x+y,0),same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
  const at=(x,y)=>tiles[idx(x,y)];
  const cells=(x,y,n)=>{const out=[];for(let dy=0;dy<n;dy++)for(let dx=0;dx<n;dx++)out.push(idx(x+dx,y+dy));return out;};
  const footprint=(q,x,y)=>cells(x,y,q.sz).every((i,n)=>{const b=tiles[i].bld;return !!b&&b.k===q.k&&(n===0?!b.ref&&b.sz===q.sz&&b.lv===1&&b.v===0:!!b.ref&&b.ref[0]===x&&b.ref[1]===y);});
  const place=(id,x,y)=>{require(curSlot()===3&&window.__highStreetQA005===true,'disposable guard changed');const err=canPlace(id,x,y);require(err===null,id+' at '+x+','+y+' rejected: '+err);require(doPlace(id,x,y,true),id+' placement failed');return at(x,y).bld;};
  const fresh=()=>{
    require(window.__highStreetQA005===true&&curSlot()===3,'unsafe fresh-world guard');
    speed=0;mapSizePref=72;diff=1;disastersOn=false;newWorld(5005005);speed=0;money=1000000;rankIdx=25;
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
  const utilities=()=>{for(let x=5;x<=65;x++){place('road',x,30);place('wpipe',x,30);}place('plant',5,29);place('plant',65,29);place('water',8,29);place('water',62,31);};
  const fixture=(list=specs,homes=true,age=30)=>{
    utilities();const rows=list.map((q,n)=>({q,x:12+6*n,y:30-q.sz}));for(const r of rows)place(r.q.id,r.x,r.y).age=age;
    const households=[];if(homes)for(let n=0;n<12;n++){const x=12+4*n,y=31;place('britishTerrace',x,y).age=30;households.push({x,y,root:idx(x,y)});}
    return {rows,households};
  };
  const operational=r=>{const root=idx(r.x,r.y),b=tiles[root].bld,w=waterRootStatus472(root);return {root,k:b?.k,age:b?.age,power:b?.pw,water:b?.wa,powerState:POWER_ROOT_OK471[root],waterState:w,road:britishRoad004(root),operational:highStreetOperational005(root,b)};};
  const requireReady=(r,label)=>{const s=operational(r);add(label,s.power&&s.water&&s.powerState===1&&s.waterState.code>=2&&s.waterState.delivered>0&&s.road&&s.operational,s);return s;};
  const disabled=(r,label)=>{
    const root=idx(r.x,r.y),b=tiles[root].bld,a=activityCapacity491(root,b),e=enterpriseRootInfo489(root),s=publicStaffRoot495.get(root),f=highStreetOperational005(root,b);
    add(label+' zero effective work and activities',!f&&a.work===0&&a.shopping===0&&a.education===0&&a.services===0&&a.leisure===0&&(e?.activePositions||0)===0&&(s?.activePositions||0)===0,{operational:f,activity:a,enterprise:e,publicStaff:s});
    if(r.q.cov)add(label+' no coverage stamp',COV[r.q.cov][root]===0,{field:r.q.cov,coverage:COV[r.q.cov][root]});
  };
  const save3=()=>{require(curSlot()===3&&window.__highStreetQA005===true,'unsafe save');save();const raw=localStorage.getItem(slotKey(3)),d=raw&&saveInflate(JSON.parse(raw));require(d?.v===1,'fresh slot-3 save missing');return d;};
  // No player's slot is even read. Block accidental access before invoking the
  // original native method; store only the operation/key, never save contents.
  const storageAudit={protectedAttempts:[],reads:0,writes:0,removes:0},storageProto=Object.getPrototypeOf(localStorage),storageOriginal={};
  const protectedKey=k=>k===SAVEKEY||k===slotKey(1)||k===slotKey(2)||k===slotKey(1)+'_bak'||k===slotKey(2)+'_bak';
  try{
    for(const op of ['getItem','setItem','removeItem','clear']){
      const desc=Object.getOwnPropertyDescriptor(storageProto,op);require(desc&&typeof desc.value==='function','native Storage instrumentation unavailable: '+op);storageOriginal[op]=desc;
      Object.defineProperty(storageProto,op,{...desc,value:function(key,value){
        if(this===localStorage){
          const k=String(key);if(op==='clear'||protectedKey(k)||(op==='setItem'&&k===SAVEKEY+'.slot'&&String(value)!=='3')){storageAudit.protectedAttempts.push({op,key:op==='clear'?'*':k});throw new Error('GPT-005 blocked player-slot access: '+op+' '+k);}
          if(op==='getItem')storageAudit.reads++;else if(op==='setItem')storageAudit.writes++;else if(op==='removeItem')storageAudit.removes++;
        }
        return desc.value.apply(this,arguments);
      }});
    }
    group('catalog-unlock-rejection',()=>{
      fresh();const smoke=highStreetSelftest005();for(const d of smoke.details)add('smoke '+d.name,d.ok,d.actual);
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
        const cash=money,price=placeCost(q.id,x,y),trees=Array.from(POLTREE),before=fs.map(i=>JSON.stringify(tiles[i]));openUndo(q.id);noRng(q.id+' placement',()=>place(q.id,x,y),true);closeUndo();
        add(q.id+' quotes tree clearing and charges one transaction',price>q.cost&&near(cash-money,price)&&undoStack.at(-1)?.spent===price,{base:q.cost,quoted:price,charged:cash-money,transaction:undoStack.at(-1)?.spent});
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
      for(let n=1;n<=9;n++){tick();for(const r of f.rows){const root=idx(r.x,r.y),b=tiles[root].bld;add(r.q.id+' normal construction day '+n,b.age===n&&footprint(r.q,r.x,r.y)&&cells(r.x,r.y,r.q.sz).slice(1).every(i=>tiles[i].bld.age===undefined),{age:b.age,level:b.lv,variant:b.v,referenceAges:cells(r.x,r.y,r.q.sz).slice(1).map(i=>tiles[i].bld.age??null)});if(n<9)disabled(r,r.q.id+' day '+n);}
        add('construction day '+n+' finite finance without industrial ghost tax',Number.isFinite(fin.net)&&Number.isFinite(money)&&fin.taxI===0,{taxC:fin.taxC,taxI:fin.taxI,net:fin.net,money});if(n<9)add('construction day '+n+' no premature commerce tax or goods demand',fin.taxC===0&&economy481.goods.need===0&&gFlow284.use===0,{taxC:fin.taxC,goods:economy481.goods,flow:gFlow284});
      }
      for(const r of f.rows){requireReady(r,r.q.id+' day nine real operation');const root=idx(r.x,r.y),b=tiles[root].bld,a=activityCapacity491(root,b);add(r.q.id+' day nine jobs become effective',a.work>0&&a.work<=r.q.jobs*1.12,{jobs:r.q.jobs,activity:a});if(r.q.cov)add(r.q.id+' day nine coverage appears',COV[r.q.cov][root]>0,{field:r.q.cov,count:COV[r.q.cov][root]});if(r.q.leisure)add(r.q.id+' day nine leisure appears',a.leisure>0,{leisure:a.leisure});}
      add('day nine commerce tax activates only commercial ledger',fin.taxC>0&&fin.taxI===0,{taxC:fin.taxC,taxI:fin.taxI});
    });
    group('perimeter-real-utilities',()=>{
      for(const q of specs)for(const side of ['north','east','south','west']){
        fresh();const x=30,y=30,n=q.sz,[ex,ey,nx,ny,tx,ty]=side==='north'?[x+n-1,y-1,0,-1,1,0]:side==='east'?[x+n,y+n-1,1,0,0,1]:side==='south'?[x+n-1,y+n,0,1,1,0]:[x-1,y+n-1,-1,0,0,1];
        place('road',ex,ey);place('wpipe',ex,ey);place('plant',ex+nx,ey+ny);place('water',ex+tx,ey+ty);place(q.id,x,y).age=30;tick();
        const r={q,x,y},root=idx(x,y),edge=idx(ex,ey),seeds=sanRoadSeeds445(root),road=nearRoad(x,y),pc=powerCandidateDistricts450(x,y,2),wc=facilityComps472(root,WATER_NET_COMP472,t=>!!(t.wp||t.wm472));
        add(q.id+' '+side+' exact far-edge road entrance',britishRoad004(root)&&seeds.length===1&&seeds[0]===edge&&road?.join(',')===[ex,ey].join(','),{frontage:seeds,edge,entrance:road});
        add(q.id+' '+side+' actual carrier components reach root',POWER_DIST450[edge]>=0&&pc.includes(POWER_DIST450[edge])&&WATER_NET_COMP472[edge]>=0&&wc.includes(WATER_NET_COMP472[edge]),{powerCandidates:pc,powerDistrict:POWER_DIST450[edge],waterComponents:wc,waterComponent:WATER_NET_COMP472[edge]});
        requireReady(r,q.id+' '+side+' real plant/tower readiness');
        // Capture physical dispatch before any later T450 nominal refresh.
        preparePowerDispatch471();const pool=power471.pools.find(p=>p.districts.includes(POWER_DIST450[edge])),raw=pool?.evening?.physicalDispatched004??pool?.evening?.physicalDispatched005,allocated=pool?.districts.reduce((s,d)=>s+powerDistricts450.find(z=>z.id===d).capacity,0),used=pool?.districts.reduce((s,d)=>s+powerDistricts450.find(z=>z.id===d).used,0),tol=Number.EPSILON*Math.max(1,Math.abs(raw||0))*Math.max(16,power471.loads.length*4);
        add(q.id+' '+side+' physical power is conserved',Number.isFinite(raw)&&raw>0&&near(allocated,raw,tol)&&used<=raw+tol&&powerAlloc450.noGrid===0&&powerAlloc450.noCapacity===0,{physical:raw,allocated,used,roundoff:tol,allocation:powerAlloc450,pool});
      }
    });
    group('utility-loss',()=>{
      for(const loss of ['road','power','water']){fresh();const f=fixture();tick();tick();for(const r of f.rows)requireReady(r,r.q.id+' before '+loss+' loss');
        if(loss==='road'){for(const r of f.rows)for(const edge of sanRoadSeeds445(idx(r.x,r.y)))require(doPlace('doze',edge%N,(edge/N)|0,true),'frontage demolition');}
        else if(loss==='power'){require(doPlace('doze',5,29,true),'west plant demolition');require(doPlace('doze',65,29,true),'east plant demolition');}
        else {require(doPlace('doze',8,29,true),'west tower demolition');require(doPlace('doze',62,31,true),'east tower demolition');}
        tick();for(const r of f.rows){const s=operational(r);add(r.q.id+' real '+loss+' loss observed',loss==='road'?!s.road:loss==='power'?!s.power:s.power&&!s.water,s);disabled(r,r.q.id+' '+loss+' loss');if(r.q.kind!=='C')add(r.q.id+' nominal public jobs retained offline',publicJobCapacity491(tiles[s.root].bld)===r.q.jobs,{nominal:publicJobCapacity491(tiles[s.root].bld),expected:r.q.jobs});}
        add(loss+' loss prevents commerce tax and phantom goods demand',fin.taxC===0&&fin.taxI===0&&economy481.goods.need===0&&gFlow284.use===0&&Number.isFinite(fin.net),{taxC:fin.taxC,taxI:fin.taxI,goods:economy481.goods,flow:gFlow284,net:fin.net});
      }
    });
    group('public-workforce-budget',()=>{
      fresh();const f=fixture(publics);tick();tick();const raw=sum(publics.map(q=>q.jobs));
      add('all five public roots count exact nominal jobs without dilution',civicPlan495.rawNominal===raw&&civicPlan495.scale===1&&f.rows.every(r=>{const s=publicStaffRoot495.get(idx(r.x,r.y));return s?.nominal===r.q.jobs&&s.accountingNominal===r.q.jobs&&s.activePositions>0;}),{expected:raw,plan:civicPlan495,staff:[...publicStaffRoot495.values()]});
      add('school and cottage surgery have real seats and clinic beds',civic495.education.nominalSeats===120&&civic495.education.effectiveSeats>0&&civic495.health.nominalBeds===6&&civic495.health.clinicBeds>0&&civic495.health.hospitalBeds===0,{education:civic495.education,health:civic495.health});
      const clinic=f.rows.find(r=>r.q.k===226);add('surgery reaches clinic authority instead of hospital',civicHealthAccess495(idx(clinic.x,clinic.y))?.clinic===true&&civicHealthAccess495(idx(clinic.x,clinic.y))?.hospital===false,civicHealthAccess495(idx(clinic.x,clinic.y)));
      for(const k of [225,226]){const r=f.rows.find(r=>r.q.k===k),root=idx(r.x,r.y),b=tiles[root].bld,key=k===225?'edu':'health',type=k===225?'education':'services';
        const measure=budget=>{svcBudget[key]=budget;civicPlan495=null;const nominal=enterprise489.legacyJobs+enterprise489.legacyPublicPositions,e=prepareEnterprise489(nominal,pop,0,0);prepareCivicServices495(e);return {nominal:publicJobCapacity491(b),active:publicActivePositions495(root,b),capacity:publicServiceCapacityForMobility495(root,b,type),factors:civicFactors495(root,b),staff:copy(publicStaffRoot495.get(root)),upkeep:highStreetUpkeep005()};};
        const low=measure(.5),high=measure(1.5);add(r.q.id+' budget changes effective capacity without nominal dilution',low.nominal===r.q.jobs&&high.nominal===r.q.jobs&&low.staff.accountingNominal===r.q.jobs&&high.staff.accountingNominal===r.q.jobs&&high.factors.serviceFactor>low.factors.serviceFactor&&high.capacity>low.capacity&&low.capacity>0&&near(high.upkeep-low.upkeep,r.q.upkeep),{low,high});svcBudget[key]=1;
      }
      for(const r of f.rows.filter(r=>[225,226].includes(r.q.k))){const root=idx(r.x,r.y),cap=capFacility506({publicRoots:[root]}),factor=publicStaffRoot495.get(root)?.capacityFactor;add(r.q.id+' staffed capability reflects actual capacity factor',factor>0&&(r.q.k===225?near(cap.child,5*factor)&&near(cap.schoolEnv,factor/3)&&cap.health===0:near(cap.health,6*factor)&&cap.child===0&&cap.schoolEnv===0),{capability:cap,factor});}
      // Remove real residents; never inject a fake staff or power/water result.
      for(const h of f.households)require(doPlace('doze',h.x+1,h.y+1,true),'workforce home demolition');tick();
      add('no residents means no public staffing or effective service',pop===0&&civic495.publicEmployed===0&&civic495.education.effectiveSeats===0&&civic495.health.effectiveBeds===0,{population:pop,civic:civic495});
      for(const r of f.rows){const root=idx(r.x,r.y),s=publicStaffRoot495.get(root),a=activityCapacity491(root,tiles[root].bld);add(r.q.id+' workforce authority suppresses service and leisure',s?.nominal===r.q.jobs&&s.employed===0&&s.capacityFactor===0&&a.education===0&&a.services===0&&a.leisure===0,{staff:s,activity:a});const cap=capFacility506({publicRoots:[root]});add(r.q.id+' zero staff does not leak child school or health capability',cap.child===0&&cap.elder===0&&cap.health===0&&cap.schoolEnv===0&&cap.staff===0,{capability:cap,staff:s});}
    });
    group('coverage-symmetry',()=>{
      for(const q of publics){fresh();utilities();const rows=[{q,x:24,y:30-q.sz},{q,x:28,y:30-q.sz}];for(const r of rows)place(q.id,r.x,r.y).age=30;tick();const field=q.cov,point=idx(26,30-q.sz),both=Array.from(COV[field]);
        add(q.id+' two operational roots overlap exactly twice',COV[field][point]===2&&rows.every(r=>highStreetOperational005(idx(r.x,r.y),at(r.x,r.y).bld)),{field,overlap:COV[field][point]});
        refreshHighStreetCoverage005();refreshHighStreetCoverage005();add(q.id+' incremental refresh idempotent',same(Array.from(COV[field]),both),{field,overlap:COV[field][point]});rebuildCov();add(q.id+' full rebuild equals incremental stamps',same(Array.from(COV[field]),both),{field,overlap:COV[field][point]});
        const r=rows[0];openUndo('overlap demolition');require(doPlace('doze',r.x+q.sz-1,r.y+q.sz-1,true),'overlap demolition');closeUndo();const one=Array.from(COV[field]);add(q.id+' demolition subtracts exactly one overlapping stamp',COV[field][point]===1&&one.every((v,i)=>v<=both[i]&&both[i]-v<=1),{field,overlap:COV[field][point]});refreshHighStreetCoverage005();refreshHighStreetCoverage005();add(q.id+' repeated unstamp never underflows',same(Array.from(COV[field]),one)&&Math.max(...COV[field])===1,{field,max:Math.max(...COV[field])});
        require(undo(),'coverage demolition undo');tick();add(q.id+' undo restores overlap with no duplicate stamp',same(Array.from(COV[field]),both)&&COV[field][point]===2,{field,overlap:COV[field][point]});
        for(const z of rows)require(doPlace('doze',z.x,z.y,true),'coverage cleanup demolition');refreshHighStreetCoverage005();rebuildCov();add(q.id+' last demolition removes entire field',COV[field].every(v=>v===0),{field,total:sum(Array.from(COV[field]))});
      }
    });
    group('save-load-identities',()=>{
      fresh();const f=fixture();tick();tick();const before=f.rows.map(r=>({k:r.q.k,age:at(r.x,r.y).bld.age}));for(const r of f.rows)requireReady(r,r.q.id+' before supported save');save3();require(load(3),'supported load failed');
      for(const [n,r]of f.rows.entries()){const b=at(r.x,r.y).bld;add(r.q.id+' normal load preserves root identity age and refs',footprint(r.q,r.x,r.y)&&b.age===before[n].age&&b.k===before[n].k,{building:b});inspectFootprint(r.q,r.x,r.y,r.q.id+' loaded');}
      tick();for(const [n,r]of f.rows.entries()){requireReady(r,r.q.id+' first ordinary day after load');add(r.q.id+' loaded identity ages once',footprint(r.q,r.x,r.y)&&at(r.x,r.y).bld.age===before[n].age+1,{building:at(r.x,r.y).bld});}
      fresh();const rows=specs.map((q,n)=>({q,x:8+n*7,y:8}));for(const r of rows)place(r.q.id,r.x,r.y);
      const oldIds=[1,2,3,127,...Array.from({length:43},(_,n)=>179+n)];for(let n=0;n<oldIds.length;n++){const k=oldIds[n],x=3+(n%12)*5,y=20+Math.floor(n/12)*5,sz=MSZ[k]||1;for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++)at(x+dx,y+dy).bld=dx||dy?{k,ref:[x,y]}:{k,lv:1,v:0,age:30,h:1,sz};}
      buildTickIndex();rebuildCov();ensureVariety531(true);
      for(const age of [0,4,8,9,30]){for(const r of rows)at(r.x,r.y).bld.age=age;const saved=save3(),old=saved.bl.filter(a=>a[1]<222),newer=saved.bl.filter(a=>a[1]>=222&&a[1]<=229);add('age '+age+' saves eight distinct root records only',newer.length===8&&newer.every(a=>a[2]===1&&a[3]===0&&a[4]===age)&&new Set(newer.map(a=>a[1])).size===8,newer);require(load(3),'age '+age+' load failed');for(const r of rows)add(r.q.id+' age '+age+' fixed load shape',footprint(r.q,r.x,r.y)&&at(r.x,r.y).bld.age===age,{building:at(r.x,r.y).bld});const after=save3();add('age '+age+' old IDs 1–221 records stay exact',JSON.stringify(after.bl.filter(a=>a[1]<222))===JSON.stringify(old),{oldRecords:old.length,ids:old.map(a=>a[1])});}
      const malformed=save3();for(const b of malformed.bl)if(b[1]>=222&&b[1]<=229){b[2]=3;b[3]=999;}localStorage.setItem(slotKey(3),JSON.stringify(saveDeflate(malformed)));require(load(3),'fixed identity normalization load failed');for(const r of rows)add(r.q.id+' unsupported variants normalize without identity loss',footprint(r.q,r.x,r.y)&&at(r.x,r.y).bld.k===r.q.k,{building:at(r.x,r.y).bld});
    });
    group('commerce-supply-tax-mobility',()=>{
      fresh();const f=fixture(commerce);tick();tick();const inventoryBefore=Math.min(20,goodsCap283());goods=inventoryBefore;tick();const activity=[];
      const retail=copy(economy481.goods),retailUnits=highStreetRetailUnits005(),expectedRetailUnits=sum(f.rows.map(r=>enterpriseRootInfo489(idx(r.x,r.y))?.employed||0))/JOBSC[2];add('new commerce explicitly supplies all effective retail units',retailUnits>0&&near(retailUnits,expectedRetailUnits)&&economy481.consumption.retailCapacity===+Math.max(1,retailUnits*.8).toFixed(2)&&!tickBld.some(i=>[2,34,65,106,220].includes(tiles[i].bld?.k)),{retailUnits,expectedRetailUnits,jobUnit:JOBSC[2],capacity:economy481.consumption.retailCapacity});add('only new commerce consumes real stocked goods on an ordinary day',enterprise489.groups.commercial.roots===3&&economy481.consumption.retailCapacity>0&&retail.need>0&&retail.domestic>0&&retail.served>0&&retail.made===0&&near(retail.domestic+retail.imports,retail.served)&&near(gFlow284.use,retail.served)&&near(goods,inventoryBefore-retail.domestic-retail.exports),{inventoryBefore,inventoryAfter:goods,goods:retail,flow:gFlow284,consumption:economy481.consumption,rootTypes:tickBld.map(i=>tiles[i].bld?.k)});
      for(const r of f.rows){requireReady(r,r.q.id+' commercial real utilities');const root=idx(r.x,r.y),b=tiles[root].bld,e=enterpriseRootInfo489(root),a=activityCapacity491(root,b);activity.push({root,k:b.k,...a});add(r.q.id+' exact commercial job accounting',e?.group==='commercial'&&e.potentialJobs===r.q.jobs&&e.activePositions>0&&e.activePositions<=r.q.jobs&&e.employed>0&&e.employed<=e.activePositions&&enterprise489.byType[r.q.k]?.roots===1&&publicJobCapacity491(b)===0,{enterprise:e,activity:a});add(r.q.id+' ordinary goods supply factors',near(enterpriseFactors489(root,b).input,+(.25+.75*enterpriseCommodityRate489('goods')).toFixed(3))&&near(a.shopping,e.employed*2.15)&&a.shopping>0&&a.enterpriseJobs===e.activePositions&&a.publicJobs===0,{previousDayInput:e.factors.input,currentInput:enterpriseFactors489(root,b).input,goodsRate:enterpriseCommodityRate489('goods'),shopping:a.shopping});add(r.q.id+' commerce sanitation client without industrial waste',isSanClient445(r.q.k)&&sanWasteOfRoot452(root,1)===0&&sanitationAt452(r.x,r.y)?.kind==='building',{waste:sanWasteOfRoot452(root,1),sanitation:sanitationAt452(r.x,r.y)});}
      const blocks=mobilityBlocks491();add('mobility receives all three commerce roots and opportunities',f.rows.every(r=>blocks.some(b=>b.enterpriseRoots.includes(idx(r.x,r.y))))&&near(sum(blocks.map(b=>b.enterpriseJobs)),sum(activity.map(a=>a.enterpriseJobs)))&&near(sum(blocks.map(b=>b.shopping)),sum(activity.map(a=>a.shopping))),{activity,blocks:blocks.map(b=>({key:b.key,enterpriseJobs:b.enterpriseJobs,shopping:b.shopping,roots:b.enterpriseRoots}))});
      add('commercial employment and tax do not enter industry ledger',enterprise489.groups.commercial.roots===3&&enterprise489.groups.commercial.potentialJobs===44&&enterprise489.rcCommercialPositions===Math.round(sum(activity.map(a=>a.enterpriseJobs)))&&enterprise489.rcIndustrialPositions===0&&fin.taxC>0&&fin.taxI===0,{commercial:enterprise489.groups.commercial,rcCommerce:enterprise489.rcCommercialPositions,rcIndustry:enterprise489.rcIndustrialPositions,taxC:fin.taxC,taxI:fin.taxI});
      const san=prepareSanitationLoad452(1);add('new commerce does not add phantom industrial garbage',near(san.totalDemand,pop*.05,1e-7)&&near(san.assignedDemand+san.noRoadDemand,san.totalDemand,1e-7),{population:pop,sanitation:san});
      // Exercise real input response using the existing goods stock/supply input,
      // not a replacement enterprise function or forced operating result.
      const original=copy(economy482.commodities.goods);require(economy482.ready&&original,'goods authority not ready');const measured=[];
      for(const rate of [0,1]){economy482.commodities.goods.supplyRate=rate;measured.push(f.rows.map(r=>enterpriseFactors489(idx(r.x,r.y),at(r.x,r.y).bld)));}Object.assign(economy482.commodities.goods,original);
      for(let n=0;n<f.rows.length;n++)add(f.rows[n].q.id+' supply shortage reduces real operating factor',measured[0][n].input===.25&&measured[1][n].input===1&&measured[0][n].base<measured[1][n].base,{shortage:measured[0][n],supplied:measured[1][n]});
      noRng('high-street readiness and capacity queries',()=>{for(const r of f.rows){const root=idx(r.x,r.y),b=tiles[root].bld;highStreetBuilt005(b);britishRoad004(root);highStreetOperational005(root,b);enterprisePotentialJobs489(root,b);publicJobCapacity491(b);powerLoadBase471(b);waterProfile472(b);}});
      const home=f.households[0],work=f.rows[0],root=idx(work.x,work.y),citizen={name:'High Street QA',home:home.root,hx:home.x,hy:home.y,work:root,wx:work.x,wy:work.y,age:30,job:'店員',fx:home.x,fy:home.y,at:0,path:null,pi:0,p:0,ptype:'adult',stage:czStage(30),quote:''};citizens.length=0;citizens.push(citizen);updateCitizens();add('citizen retains high-street employment',citizens.includes(citizen)&&citizen.work===root,{present:citizens.includes(citizen),work:citizen.work});require(doPlace('doze',work.x+work.q.sz-1,work.y+work.q.sz-1,true),'commerce job demolition');updateCitizens();add('citizen loses demolished high-street job',citizens.includes(citizen)&&citizen.work===-1,{present:citizens.includes(citizen),work:citizen.work});
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
