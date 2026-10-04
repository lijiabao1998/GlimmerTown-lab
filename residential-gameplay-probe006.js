/* GPT-006 destructive integration guard. Embed after residentialSelftest006 inside
   the main game IIFE, export through GV. Never invoke against a player's profile.
   The marker AND slot check are mandatory. Fixtures seed terrain/age/citizens;
   power, water, placement, simulation, coverage and save/load use real authorities. */
function residentialGameplayProbe006(groupFilter){
  const groupNames=['catalog-placement','construction-day-nine','perimeter-real-utilities','utility-loss','housing-commerce-authorities','save-load-identities'];
  const checks=[],details=[],exceptions=[],groups=[],started=performance.now();
  let currentGroup='guard';
  const copy=q=>q===undefined?null:JSON.parse(JSON.stringify(q));
  const add=(name,ok,actual)=>{checks.push(name+(ok?' ✓':' ✗'));details.push({group:currentGroup,name,ok:!!ok,actual:copy(actual)});return !!ok;};
  const result=extra=>({ok:details.length>0&&details.every(q=>q.ok)&&exceptions.length===0,checks,details,exceptions,groups,groupNames,requestedGroup:groupFilter??null,selectedGroup:groupFilter??null,ranGroups:groups.filter(g=>g.ran&&g.name!=='cleanup').map(g=>g.name),slot:curSlot(),disposable:true,elapsedMs:+(performance.now()-started).toFixed(2),assertions:details.length,...extra});
  if(groupFilter!=null&&(typeof groupFilter!=='string'||!groupNames.includes(groupFilter))){add('known named group required',false,{requested:groupFilter,groupNames});return result({guarded:true});}
  if(window.__residentialQA006!==true||curSlot()!==3){add('disposable slot-3 guard',false,{marker:window.__residentialQA006===true,slot:curSlot()});return result({guarded:true});}
  if(devUnlockAll516B()||devState516B.sandbox||devGod516B()){add('ordinary simulation required',false,{unlockAll:devUnlockAll516B(),sandbox:devState516B.sandbox});return result({guarded:true});}
  const flags=['__noResidential006','__noHighStreet005','__noBritishBuildings004','__noEnterprise489','__noHousing488','__noCivicServices495','__noWater472','__noPower471'];
  if(flags.some(k=>window[k])||powerLegacy450()||waterLegacy449()){add('production authorities enabled',false,{flags:flags.filter(k=>window[k]),legacyPower:powerLegacy450(),legacyWater:waterLegacy449()});return result({guarded:true});}
  const require=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const specs=RESIDENTIAL_EXPECTED006.map(e=>({...e,nm:RESIDENTIAL006[e.k]?.nm}));
  const near=(a,b,eps=1e-8)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=eps;
  const sum=a=>a.reduce((x,y)=>x+y,0),same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
  const at=(x,y)=>tiles[idx(x,y)];
  const cells=(x,y,n)=>{const out=[];for(let dy=0;dy<n;dy++)for(let dx=0;dx<n;dx++)out.push(idx(x+dx,y+dy));return out;};
  const footprint=(q,x,y)=>cells(x,y,q.sz).every((i,n)=>{const b=tiles[i].bld;return !!b&&b.k===q.k&&(n===0?!b.ref&&b.sz===q.sz&&b.lv===1&&b.v===0:!!b.ref&&b.ref[0]===x&&b.ref[1]===y);});
  const place=(id,x,y)=>{require(curSlot()===3&&window.__residentialQA006===true,'disposable guard changed');const err=canPlace(id,x,y);require(err===null,id+' at '+x+','+y+' rejected: '+err);require(doPlace(id,x,y,true),id+' placement failed');return at(x,y).bld;};
  const fresh=()=>{
    require(window.__residentialQA006===true&&curSlot()===3,'unsafe fresh-world guard');
    speed=0;mapSizePref=72;diff=1;disastersOn=false;newWorld(6006006);speed=0;money=10000000;rankIdx=25;
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
  const fixture=(age=30)=>{
    const network=utilities(),rows=specs.map((q,n)=>({q,x:12+12*(n%4),y:14+14*Math.floor(n/4)-q.sz}));
    for(const r of rows)place(r.q.id,r.x,r.y).age=age;
    return {rows,...network};
  };
  // Capture authoritative arrays BEFORE calling status/ensure/inspector helpers.
  const snapshot=r=>{const root=idx(r.x,r.y),b=tiles[root].bld;return {root,k:b?.k,age:b?.age,pw:b?.pw,wa:b?.wa,powerState:POWER_ROOT_OK471[root],waterState:WATER_ROOT_STATE472[root],waterDelivered:WATER_ROOT_DELIVERED472[root],population:residentPopulation488(root,b)};};
  const requireReady=(r,label)=>{const s=snapshot(r),b=tiles[s.root].bld;add(label,s.pw===true&&s.wa===true&&s.powerState===1&&s.waterState>=2&&s.waterDelivered>0&&britishRoad004(s.root)&&residentialOperational006(s.root,b),s);return s;};
  const disabled=(r,label)=>{const s=snapshot(r),b=tiles[s.root].bld,a=activityCapacity491(s.root,b),e=enterpriseRootInfo489(s.root);add(label+' zero residents active jobs and shopping',!residentialOperational006(s.root,b)&&s.population===0&&a.work===0&&a.shopping===0&&(e?.activePositions||0)===0,{...s,activity:a,enterprise:e});};
  const save3=()=>{require(curSlot()===3&&window.__residentialQA006===true,'unsafe save');save();const raw=localStorage.getItem(slotKey(3)),d=raw&&saveInflate(JSON.parse(raw));require(d?.v===1,'fresh slot-3 save missing');return d;};
  // No player's slot is even read. Block accidental access before invoking the
  // original native method; store only the operation/key, never save contents.
  const storageAudit={protectedAttempts:[],reads:0,writes:0,removes:0},storageProto=Object.getPrototypeOf(localStorage),storageOriginal={};
  const protectedKey=k=>k===SAVEKEY||k===slotKey(1)||k===slotKey(2)||k===slotKey(1)+'_bak'||k===slotKey(2)+'_bak';
  try{
    for(const op of ['getItem','setItem','removeItem','clear']){
      const desc=Object.getOwnPropertyDescriptor(storageProto,op);require(desc&&typeof desc.value==='function','native Storage instrumentation unavailable: '+op);storageOriginal[op]=desc;
      Object.defineProperty(storageProto,op,{...desc,value:function(key,value){
        if(this===localStorage){
          const k=String(key);if(op==='clear'||protectedKey(k)||(op==='setItem'&&k===SAVEKEY+'.slot'&&String(value)!=='3')){storageAudit.protectedAttempts.push({op,key:op==='clear'?'*':k});throw new Error('GPT-006 blocked player-slot access: '+op+' '+k);}
          if(op==='getItem')storageAudit.reads++;else if(op==='setItem')storageAudit.writes++;else if(op==='removeItem')storageAudit.removes++;
        }
        return desc.value.apply(this,arguments);
      }});
    }
    group('catalog-placement',()=>{
      fresh();const smoke=residentialSelftest006();for(const d of smoke.details)add('smoke '+d.name,d.ok,d.actual);
      for(const q of specs){
        rankIdx=q.rank-2;const locked=canPlace(q.id,10,10);add(q.id+' locked below exact rank',typeof locked==='string'&&!toolUnlocked458(toolMeta434(q.id)),{rank:rankIdx+1,error:locked});
        rankIdx=q.rank-1;add(q.id+' unlocked at exact rank',toolUnlocked458(toolMeta434(q.id))&&canPlace(q.id,10,10)===null,{rank:rankIdx+1});rankIdx=25;
        const blockers=[['water',{t:0}],['mountain',{t:3}],['road',{road:1}],['rail',{rail:1}],['tram',{tram:1}],['overhead distribution',{lv475:1}],['high voltage',{hv471:1}],['underground high voltage',{ug471:1}],['occupied',{bld:{k:4,lv:1,v:0,age:30}}],['ruin',{ruin:1}],['crater',{crater:1}]];
        for(const i of cells(10,10,q.sz))for(const [label,value]of blockers){const old=JSON.stringify(tiles[i]);Object.assign(tiles[i],value);const before=JSON.stringify(cells(10,10,q.sz).map(j=>tiles[j])),cash=money,error=canPlace(q.id,10,10),placed=doPlace(q.id,10,10,true);add(q.id+' rejects '+label+' at footprint '+i,typeof error==='string'&&error.length>0&&placed===false&&money===cash&&before===JSON.stringify(cells(10,10,q.sz).map(j=>tiles[j])),{error,placed,moneyDelta:money-cash});tiles[i]=JSON.parse(old);}
        for(const [x,y]of[[-1,10],[10,-1],[N-q.sz+1,10],[10,N-q.sz+1]]){const cash=money,error=canPlace(q.id,x,y);add(q.id+' rejects map edge '+x+','+y,typeof error==='string'&&doPlace(q.id,x,y,true)===false&&money===cash,{error});}
        const cash=money;money=q.cost-1;add(q.id+' insufficient funds is atomic',doPlace(q.id,10,10,true)===false&&!at(10,10).bld&&money===q.cost-1,{money});money=cash;
      }
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
      fresh();const f=fixture(0);steel=0;
      for(const r of f.rows){const b=at(r.x,r.y).bld;add(r.q.id+' placement contains no artificial utility flags',b.pw===false&&b.wa===false&&residentPopulation488(idx(r.x,r.y),b)===0,b);}
      for(let n=1;n<=9;n++){
        tick();const snapshots=f.rows.map(snapshot);
        for(const [j,r]of f.rows.entries()){const b=at(r.x,r.y).bld;add(r.q.id+' ordinary construction day '+n,b.age===n&&footprint(r.q,r.x,r.y)&&cells(r.x,r.y,r.q.sz).slice(1).every(i=>tiles[i].bld.age===undefined),{...snapshots[j],referenceAges:cells(r.x,r.y,r.q.sz).slice(1).map(i=>tiles[i].bld.age??null)});if(n<9)disabled(r,r.q.id+' day '+n);}
        add('construction day '+n+' finite money without industrial fallback',Number.isFinite(fin.net)&&Number.isFinite(money)&&fin.taxI===0,{taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI,net:fin.net,money});
        if(n<9)add('day '+n+' no premature population household or commercial taxes',pop===0&&fin.taxR===0&&fin.taxC===0&&residentialRetailUnits006()===0&&citizens.length===0,{pop,taxR:fin.taxR,taxC:fin.taxC,citizens:citizens.length,retailUnits:residentialRetailUnits006()});
      }
      const expectedPop=sum(f.rows.map(r=>residentPopulation488(idx(r.x,r.y),at(r.x,r.y).bld)));
      for(const r of f.rows){requireReady(r,r.q.id+' day-nine actual utilities');add(r.q.id+' same-day real occupants',residentPopulation488(idx(r.x,r.y),at(r.x,r.y).bld)>0&&housing488.markets[r.q.band].effectiveCapacity>0,{population:residentPopulation488(idx(r.x,r.y),at(r.x,r.y).bld),market:housing488.markets[r.q.band]});}
      add('day-nine city population and household tax activate exactly once',pop===expectedPop&&pop>0&&fin.taxR>0&&fin.taxI===0,{population:pop,expectedPop,taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI});
      const r=f.rows.find(r=>r.q.k===261),e=enterpriseRootInfo489(idx(r.x,r.y));add('day-nine shop nominal and active positions remain separate',e?.potentialJobs===6&&e.activePositions>0&&e.activePositions<=6&&publicJobCapacity491(at(r.x,r.y).bld)===0,e);
    });
    group('perimeter-real-utilities',()=>{
      for(const side of ['north','east','south','west']){
        fresh();const rows=[];
        for(const [n,q]of specs.entries()){
          const x=8+16*(n%4),y=8+16*Math.floor(n/4),sz=q.sz,[ex,ey,nx,ny,tx,ty]=side==='north'?[x+sz-1,y-1,0,-1,1,0]:side==='east'?[x+sz,y+sz-1,1,0,0,1]:side==='south'?[x+sz-1,y+sz,0,1,1,0]:[x-1,y+sz-1,-1,0,0,1];
          place('road',ex,ey);place('wpipe',ex,ey);place('plant',ex+nx,ey+ny);place('water',ex+tx,ey+ty);place(q.id,x,y).age=30;rows.push({q,x,y,ex,ey});
        }
        tick();const captured=rows.map(snapshot),dispatch=copy({allocation:powerAlloc450,pools:power471.pools,loads:power471.loads,districts:powerDistricts450.map(d=>({id:d.id,capacity:d.capacity,used:d.used,spare:d.spare}))});
        for(const [n,r]of rows.entries()){
          const root=idx(r.x,r.y),edge=idx(r.ex,r.ey),s=captured[n];add(r.q.id+' '+side+' ordinary tick supplies far-edge root',s.pw&&s.wa&&s.powerState===1&&s.waterState>=2&&s.waterDelivered>0&&s.population>0,s);
          const seeds=sanRoadSeeds445(root),road=nearRoad(r.x,r.y),pc=powerCandidateDistricts450(r.x,r.y,2),wc=facilityComps472(root,WATER_NET_COMP472,t=>!!(t.wp||t.wm472));
          add(r.q.id+' '+side+' exactly one true road entrance',seeds.length===1&&seeds[0]===edge&&same(road||[],[r.ex,r.ey])&&britishRoad004(root),{seeds,edge,road});
          add(r.q.id+' '+side+' actual component membership',POWER_DIST450[edge]>=0&&pc.includes(POWER_DIST450[edge])&&WATER_NET_COMP472[edge]>=0&&wc.includes(WATER_NET_COMP472[edge]),{powerCandidates:pc,powerDistrict:POWER_DIST450[edge],waterComponents:wc,waterComponent:WATER_NET_COMP472[edge]});
        }
        for(const pool of dispatch.pools){const raw=pool.evening?.physicalDispatched004,ds=dispatch.districts.filter(d=>pool.districts.includes(d.id)),used=sum(ds.map(d=>d.used)),tol=Number.EPSILON*Math.max(1,Math.abs(raw||0))*Math.max(16,dispatch.loads.length*4);add(side+' pool '+pool.id+' uses no more than real dispatched power',Number.isFinite(raw)&&raw>0&&used<=raw+tol&&ds.every(d=>d.used>=0),{physical:raw,used,tolerance:tol,districts:ds});}
      }
    });
    group('utility-loss',()=>{
      for(const loss of ['road','power','water']){
        fresh();const f=fixture();tick();tick();for(const r of f.rows)requireReady(r,r.q.id+' before '+loss+' loss');
        const removed=[];
        if(loss==='road'){for(const r of f.rows)for(const edge of sanRoadSeeds445(idx(r.x,r.y)))if(!removed.some(a=>a[0]===edge%N&&a[1]===Math.floor(edge/N))){removed.push([edge%N,Math.floor(edge/N)]);require(doPlace('doze',edge%N,Math.floor(edge/N),true),'frontage demolition');}}
        else {for(const [x,y]of loss==='power'?f.plants:f.waters){removed.push([x,y]);require(doPlace('doze',x,y,true),loss+' facility demolition');}}
        tick();const observed=f.rows.map(snapshot);
        for(const [n,r]of f.rows.entries()){const s=observed[n];add(r.q.id+' '+loss+' loss actually observed',loss==='road'?!britishRoad004(s.root):loss==='power'?!s.pw:s.pw&&!s.wa,s);disabled(r,r.q.id+' '+loss+' loss');}
        add(loss+' loss removes residents and both tax ledgers',pop===0&&fin.taxR===0&&fin.taxC===0&&fin.taxI===0&&residentialRetailUnits006()===0&&Number.isFinite(fin.net),{pop,taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI,retail:residentialRetailUnits006(),net:fin.net});
        for(const [x,y]of removed){place(loss==='road'?'road':loss==='power'?'plant':'water',x,y);if(loss==='road'&&!at(x,y).wp)place('wpipe',x,y);}
        tick();for(const r of f.rows)requireReady(r,r.q.id+' restored '+loss+' service');
        add(loss+' restoration restores real residents',pop>0&&fin.taxR>0&&fin.taxI===0,{pop,taxR:fin.taxR,taxI:fin.taxI});
      }
      fresh();for(const [n,q]of specs.entries())place(q.id,8+4*(n%8),10+8*Math.floor(n/8)).age=30;tick();
      add('all completed isolated homes and corner shop have zero population jobs taxes upkeep',pop===0&&fin.taxR===0&&fin.taxC===0&&fin.taxI===0&&fin.net===0&&Number.isFinite(money),{population:pop,fin,money});
    });
    group('housing-commerce-authorities',()=>{
      fresh();const f=fixture();for(let n=0;n<3;n++)tick();const population=f.rows.map(r=>residentPopulation488(idx(r.x,r.y),at(r.x,r.y).bld));
      add('city counts each real household once',pop===sum(population)&&pop>0,{population:pop,roots:population});
      for(const band of ['low','mid']){const capacity=sum(f.rows.filter(r=>r.q.band===band).map(r=>r.q.capacity)),m=housing488.markets[band];add(band+' market uses locked nominal and serviced capacities',m.capacity===capacity&&m.effectiveCapacity===capacity&&m.occupied>0&&m.occupancy>0,{expectedCapacity:capacity,market:m});}
      const blocks=mobilityBlocks491(),rootIds=f.rows.map(r=>idx(r.x,r.y)),totalDistrict=sum(Object.values(districtPops()));
      add('transport blocks and districts receive exactly household population',sum(blocks.map(b=>b.pop))===pop&&totalDistrict===pop&&mobilityCatchmentPop462(rootIds,0)===pop,{city:pop,blocks:sum(blocks.map(b=>b.pop)),districts:totalDistrict,catchment:mobilityCatchmentPop462(rootIds,0)});
      for(const [n,r]of f.rows.entries()){
        const root=idx(r.x,r.y),b=at(r.x,r.y).bld,rail=railRootPopJobs463(b,root),res=resilienceRootExposure492(root),san=sanitationAt452(r.x,r.y);
        add(r.q.id+' housing happiness wealth and sanitation authorities',housingBand488(b)===r.q.band&&residentCapacity488(b)===r.q.capacity&&population[n]===Math.round(r.q.capacity*housingOccupancy488(r.q.band))&&b.we===1&&Number.isFinite(b.h)&&b.h>=.05&&b.h<=1&&near(sanWasteOfRoot452(root,1),population[n]*.05)&&san?.kind==='building',{band:housingBand488(b),population:population[n],capacity:residentCapacity488(b),wealth:b.we,happiness:b.h,waste:sanWasteOfRoot452(root,1),sanitation:san});
        add(r.q.id+' transport and resilience population exposure',rail.pop===population[n]&&res.pop===population[n]&&blocks.some(b=>b.resRoots.includes(root)),{rail,resilience:res});
      }
      const san=prepareSanitationLoad452(1);add('all waste equals real residents without phantom industrial waste',near(san.totalDemand,pop*.05,1e-7)&&near(san.assignedDemand+san.noRoadDemand,san.totalDemand,1e-7),{population:pop,sanitation:san});
      add('fixed middle wealth feeds purchasing power exactly once',near(wealthPower481(tickBld,pop),1),{wealth:wealthPower481(tickBld,pop)});
      const r=f.rows.find(r=>r.q.k===261),root=idx(r.x,r.y),b=tiles[root].bld,e=enterpriseRootInfo489(root),a=activityCapacity491(root,b),retail=residentialRetailUnits006();
      add('corner shop simultaneously houses residents and actual commercial staff',residentPopulation488(root,b)>0&&e?.group==='commercial'&&e.potentialJobs===6&&e.activePositions>0&&e.activePositions<=6&&e.employed>0&&e.employed<=e.activePositions&&a.enterpriseJobs===e.activePositions&&a.publicJobs===0&&near(a.shopping,e.employed*2.15)&&retail>0&&near(retail,e.employed/JOBSC[2]),{population:residentPopulation488(root,b),enterprise:e,activity:a,retail});
      add('corner shop and homes both reach mobility and rail ledgers',blocks.some(q=>q.resRoots.includes(root)&&q.enterpriseRoots.includes(root))&&railRootPopJobs463(b,root).jobs===e.employed&&mobilityRefreshRoad462().some(c=>c.population>0&&c.comRoots===1&&c.jobs>0),{blocks:blocks.map(q=>({resRoots:q.resRoots,enterpriseRoots:q.enterpriseRoots})),rail:railRootPopJobs463(b,root)});
      const inventoryBefore=Math.min(20,goodsCap283());goods=inventoryBefore;tick();const flow=copy(economy481.goods);add('corner shop consumes goods and pays commerce alongside household taxes',flow.need>0&&flow.domestic>0&&flow.served>0&&near(gFlow284.use,flow.served)&&near(goods,inventoryBefore-flow.domestic-flow.exports)&&fin.taxR>0&&fin.taxC>0&&fin.taxI===0&&enterprise489.rcIndustrialPositions===0,{goodsBefore:inventoryBefore,goodsAfter:goods,goods:flow,gFlow:gFlow284,taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI,enterprise:enterprise489.groups.commercial});
      const original=copy(economy482.commodities.goods);economy482.commodities.goods.supplyRate=0;const shortage=enterpriseFactors489(root,b);economy482.commodities.goods.supplyRate=1;const supplied=enterpriseFactors489(root,b);Object.assign(economy482.commodities.goods,original);add('corner shop reacts to authoritative goods shortage',shortage.input===.25&&supplied.input===1&&shortage.base<supplied.base,{shortage,supplied});
      noRng('residential read-only queries',()=>{for(const r of f.rows){const root=idx(r.x,r.y),b=tiles[root].bld;housingBand488(b);residentCapacity488(b);residentEligible488(root,b);residentialBuilt006(b);residentialOperational006(root,b);powerLoadBase471(b);rootWaterDemandBase472(b);enterprisePotentialJobs489(root,b);}});
      const home=f.rows[0],homeRoot=idx(home.x,home.y);citizens.length=0;
      const mr=Math.random,seq=[(home.x+.1)/N,(home.y+.1)/N,.2,(r.x+.1)/N,(r.y+.1)/N];let created=false;
      try{Math.random=()=>seq.length?seq.shift():.1;created=spawnCitizen();}finally{Math.random=mr;}
      const citizen=citizens[0];add('normal citizen creation accepts new home and corner-shop job',created&&citizen?.home===homeRoot&&citizen?.work===root,{created,citizen});
      updateCitizens();add('daily citizen authority retains the new home and job',citizens.includes(citizen)&&citizen.work===root,{present:citizens.includes(citizen),work:citizen?.work});
      require(doPlace('doze',r.x+1,r.y+1,true),'corner-shop reference demolition');updateCitizens();add('demolished corner shop removes citizen job',citizens.includes(citizen)&&citizen.work===-1,{present:citizens.includes(citizen),work:citizen?.work});
      require(doPlace('doze',home.x+1,home.y+1,true),'home reference demolition');updateCitizens();add('demolished new home removes its citizen',!citizens.includes(citizen),{present:citizens.includes(citizen)});
    });
    group('save-load-identities',()=>{
      // Clean ordinary sixteen-home save, with no legacy homes obscuring totals.
      fresh();const clean=fixture();tick();tick();tick();save3();
      const beforeOccupancy=Object.fromEntries(HOUSING_BANDS488.map((band,n)=>[band,housingSave488()[n]])),beforeCaps=clean.rows.map(r=>residentCapacity488(at(r.x,r.y).bld));
      require(load(3),'clean mature sixteen-home load failed');
      add('ordinary load preserves both housing market occupancy values',near(housing488.occ.low,beforeOccupancy.low)&&near(housing488.occ.mid,beforeOccupancy.mid),{before:beforeOccupancy,loaded:copy(housing488.occ)});
      tick();const firstDay=clean.rows.map(snapshot),firstPop=sum(firstDay.map(r=>r.population)),firstCapacity=sum(beforeCaps);
      add('first ordinary loaded day counts all sixteen homes in capacity and population authorities',pop===firstPop&&pop>0&&housing488.capacity===firstCapacity&&housing488.effectiveCapacity===firstCapacity&&sum(mobilityBlocks491().map(b=>b.pop))===pop,{cityPopulation:pop,sumResidentPopulation:firstPop,expectedCapacity:firstCapacity,housing:housing488});
      for(const [n,r]of clean.rows.entries()){
        const b=at(r.x,r.y).bld,market=housing488.markets[r.q.band];
        add(r.q.id+' first loaded day retains real housing band capacity occupancy and citizens',firstDay[n].population===Math.round(r.q.capacity*housingOccupancy488(r.q.band))&&firstDay[n].population>0&&housingBand488(b)===r.q.band&&residentCapacity488(b)===r.q.capacity&&market.effectiveCapacity===sum(clean.rows.filter(t=>t.q.band===r.q.band).map(t=>t.q.capacity)),{snapshot:firstDay[n],band:housingBand488(b),capacity:residentCapacity488(b),occupancy:housingOccupancy488(r.q.band),market});
        requireReady(r,r.q.id+' clean first loaded day actual utilities');
      }
      const mixed=clean.rows.find(r=>r.q.k===261),mixedRoot=idx(mixed.x,mixed.y),mixedB=at(mixed.x,mixed.y).bld,mixedJobs=enterpriseRootInfo489(mixedRoot),mixedActivity=activityCapacity491(mixedRoot,mixedB);
      add('first loaded day mixed-use home keeps both residential and commercial authorities',residentPopulation488(mixedRoot,mixedB)>0&&mixedJobs?.potentialJobs===6&&mixedJobs.activePositions>0&&mixedJobs.employed>0&&mixedActivity.shopping>0&&fin.taxR>0&&fin.taxC>0&&fin.taxI===0,{population:residentPopulation488(mixedRoot,mixedB),jobs:mixedJobs,activity:mixedActivity,taxR:fin.taxR,taxC:fin.taxC,taxI:fin.taxI});
      noRng('loaded residential authority queries',()=>{for(const r of clean.rows){const root=idx(r.x,r.y),b=tiles[root].bld;residentCapacity488(b);housingBand488(b);housingOccupancy488(r.q.band);residentPopulation488(root,b);resilienceRootExposure492(root);railRootPopJobs463(b,root);}});
      fresh();const f=fixture();const oldSpecs=[...Object.values(BRITISH004),...Object.values(HIGHSTREET005)],oldRows=oldSpecs.map((q,n)=>({q,x:12+7*(n%6),y:n<6?15:29}));
      for(const r of oldRows)place(r.q.id,r.x,r.y).age=30;tick();tick();
      for(const r of f.rows)requireReady(r,r.q.id+' before actual save');
      for(const age of [0,4,8,9,30]){
        for(const r of f.rows)at(r.x,r.y).bld.age=age;
        const first=save3(),old=first.bl.filter(a=>a[1]<246),newer=first.bl.filter(a=>a[1]>=246&&a[1]<=261);
        add('age '+age+' exactly sixteen fixed save records',newer.length===16&&same(newer.map(a=>a[1]).sort((a,b)=>a-b),specs.map(q=>q.k))&&newer.every(a=>a[2]===1&&a[3]===0&&a[4]===age),newer);
        require(load(3),'supported load age '+age);const loaded=f.rows.map(snapshot);
        for(const [n,r]of f.rows.entries())add(r.q.id+' age '+age+' load preserves identity and resets readiness',footprint(r.q,r.x,r.y)&&loaded[n].age===age&&loaded[n].pw===false&&loaded[n].wa===false&&at(r.x,r.y).bld.we===1&&at(r.x,r.y).bld.den===(r.q.band==='low'?2:3),{snapshot:loaded[n],building:at(r.x,r.y).bld});
        const roundtrip=save3();add('age '+age+' every T717/T718 record stays byte-exact',JSON.stringify(roundtrip.bl.filter(a=>a[1]<246))===JSON.stringify(old)&&oldSpecs.every(q=>old.some(a=>a[1]===q.k)),{oldCount:old.length,ids:old.map(a=>a[1])});
        add('age '+age+' rejected gap absent',!roundtrip.bl.some(a=>a[1]>=222&&a[1]<=237),{ids:roundtrip.bl.map(a=>a[1])});
        tick();const ordinary=f.rows.map(snapshot);
        for(const [n,r]of f.rows.entries()){add(r.q.id+' age '+age+' first ordinary post-load day ages once',ordinary[n].age===age+1&&footprint(r.q,r.x,r.y),ordinary[n]);if(age+1>=9)requireReady(r,r.q.id+' first ordinary post-load day real service');else disabled(r,r.q.id+' first post-load unfinished day');}
        for(const r of oldRows){const root=idx(r.x,r.y),b=tiles[root].bld;add(r.q.id+' prior identity stays served after first post-load day',b.k===r.q.k&&b.pw&&b.wa&&POWER_ROOT_OK471[root]===1&&WATER_ROOT_STATE472[root]>=2,{k:b.k,power:b.pw,water:b.wa,powerState:POWER_ROOT_OK471[root],waterState:WATER_ROOT_STATE472[root]});}
      }
      const malformed=save3();for(const rec of malformed.bl)if(rec[1]>=246&&rec[1]<=261){rec[2]=3;rec[3]=999;}localStorage.setItem(slotKey(3),JSON.stringify(saveDeflate(malformed)));require(load(3),'normalization load');for(const r of f.rows)add(r.q.id+' malformed level and variant normalize to fixed new identity',footprint(r.q,r.x,r.y)&&at(r.x,r.y).bld.we===1&&residentCapacity488(at(r.x,r.y).bld)===r.q.capacity,{building:at(r.x,r.y).bld});
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
