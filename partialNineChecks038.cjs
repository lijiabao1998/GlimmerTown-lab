'use strict';
// Browser function for an explicitly partial CI fixture. Full production
// selftest still requires ten models/40 leaves and must remain RED here.
function partialNineChecks038(){
  GV.setSpeed(0);
  const api=GV.britishWave038,art=window.BritishWaveArchitecture038,fixture=window.__wave038NineFixture,spr=GV.art574.SPR().bld;
  const rows=[['leedsCorn',520],['darlington',524],['halifax',528],['bishoplloyd',532],['burlington',536],['harrods',544],['liberty',548],['danum',552],['willow',556]],need=(ok,m)=>{if(!ok)throw Error(m);};
  need(api.rows().length===10&&api.rows().find(q=>q.id==='silver')?.v===540,'partial038 retain frozen ten-row catalog');
  need(JSON.stringify(fixture.rows().map(q=>[q.id,q.v]))===JSON.stringify(rows),'partial038 exact source-gated nine');
  const full=api.selftest(),firstFull=full.checks.find(c=>c.endsWith('✗'));
  need(!full.ok&&firstFull?.startsWith('wave038 count'),'partial038 complete ten-model selftest must remain RED');
  need(fixture.coldRejection()==='wave038 exterior evidence pending; model deliberately absent: silver','partial038 cold full installer rejects Silver');
  const warmRejection=fixture.fullInstallerRejectsWarmPartial();
  for(let v=540;v<544;v++)need(!spr['24_1_'+v],'partial038 no Silver placeholder');
  const expected=new Map(),images=[];
  for(const[id,v]of rows)for(let view=0;view<4;view++){
    const direct=art.build(id,view),key='24_1_'+(v+view);
    expected.set(key,{day:direct.img.toDataURL(),night:direct.night.toDataURL()});
    for(const layer of['day','night'])images.push({name:id+'-r'+view+'-'+layer+'.png',data:(layer==='day'?spr[key].img:spr[key].night).toDataURL('image/png')});
  }
  const keys=()=>Object.keys(spr).filter(k=>/^24_1_5[2-5][0-9]$/.test(k)).sort();
  function geometry(){
    const old=window.__wave038GeometryOnly;window.__wave038GeometryOnly=true;
    try{const masks=rows.map(([id])=>{const s=window.BritishWaveArchitecture038.build(id,0),d=s.img.getContext('2d').getImageData(0,0,160,196).data;let m='';for(let i=3;i<d.length;i+=4)m+=d[i]?'1':'0';return m;});need(new Set(masks).size===9,'partial038 nine structural silhouettes');}
    finally{if(old===undefined)delete window.__wave038GeometryOnly;else window.__wave038GeometryOnly=old;}
  }
  function pixels(){
    need(keys().length===36,'partial038 installed36 count');
    for(const key of keys()){
      const s=spr[key],view=(+key.split('_')[2]-520)%4;
      need(s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view,'partial038 native geometry');
      const d=s.img.getContext('2d').getImageData(0,0,160,196).data,n=s.night.getContext('2d').getImageData(0,0,160,196).data;let day=0,night=0,crop=0,soft=0,leak=0;
      for(let i=3;i<d.length;i+=4){const at=(i-3)/4,x=at%160,y=Math.floor(at/160);if(d[i]){day++;if(d[i]!==255)soft++;if(!x||!y||x===159||y===195)crop++;}if(n[i]){night++;if(n[i]!==255||d[i]!==255)leak++;}}
      need(leak===0,'partial038 opaque physical night');need(soft===0,'partial038 hard pixels');need(day>700&&night>0&&!crop,'partial038 uncropped nonempty');
      const e=expected.get(key);need(s.img.toDataURL()===e.day&&s.night.toDataURL()===e.night,'partial038 installed pixels equal independent direct');
    }
  }
  function rotations(){for(const[id,v]of rows)for(let rot=0;rot<4;rot++){GV.setRot(rot);need(GV.art574.vdraw({x:10,y:10},{k:24,lv:1,v})===v+rot,'partial038 actual rotation '+id+'/'+rot);}GV.setRot(0);}
  geometry();pixels();rotations();
  const red=[],fault=(name,mutate,restore,target,check=pixels)=>{
    let first='';try{mutate();try{check();}catch(e){first=String(e.message);}need(first.startsWith(target),'partial038 wrong first RED '+name+': '+first);}
    finally{restore();}check();red.push({name,first,restored:true});
  };
  const s=spr['24_1_520'],day=s.img,night=s.night;
  fault('missing installed leaf',()=>delete spr['24_1_520'],()=>spr['24_1_520']=s,'partial038 installed36 count');
  const width=s.w;fault('wrong native dimensions',()=>s.w=159,()=>s.w=width,'partial038 native geometry');
  const canvas=base=>{const c=document.createElement('canvas');c.width=160;c.height=196;if(base)c.getContext('2d').drawImage(base,0,0);return c;};
  fault('light on transparent sky',()=>{s.night=canvas(night);const g=s.night.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,1,1);},()=>s.night=night,'partial038 opaque physical night');
  fault('soft day pixel',()=>{s.img=canvas(day);const g=s.img.getContext('2d'),d=g.getImageData(0,0,160,196),n=night.getContext('2d').getImageData(0,0,160,196).data;let at=-1;for(let i=3;i<d.data.length;i+=4)if(d.data[i]===255&&!n[i]){at=i;break;}need(at>=0,'partial038 real opaque fixture');d.data[at]=127;g.putImageData(d,0,0);},()=>s.img=day,'partial038 hard pixels');
  fault('native crop',()=>{s.img=canvas(day);const g=s.img.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,1,1);},()=>s.img=day,'partial038 uncropped nonempty');
  fault('empty sprite',()=>{s.img=canvas();s.night=canvas();},()=>{s.img=day;s.night=night;},'partial038 uncropped nonempty');
  const other=spr['24_1_524'],od=other.img,on=other.night;
  fault('installed clone',()=>{other.img=day;other.night=night;},()=>{other.img=od;other.night=on;},'partial038 installed pixels equal independent direct');
  fault('named geometry clone',()=>window.BritishWaveArchitecture038={...art,build:(id,v)=>art.build(id==='darlington'?'leedsCorn':id,v)},()=>window.BritishWaveArchitecture038=art,'partial038 nine structural silhouettes',geometry);
  const rotationFirst=fixture.frozenRotationNegative(rotations);need(rotationFirst.startsWith('partial038 actual rotation'),'partial038 private rotation mutation first RED');rotations();red.push({name:'actual private selector frozen',first:rotationFirst,restored:true});
  // Faults run after the independent normal-model pair. Create a real locked
  // native fixture without carrying an earlier unlock override into this check.
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);GV.setGod516B(false);GV.setOverride516B('unlockAll',false);GV.setDiff(1);
  const beforeMoney=GV.devMoney516B();need(!api.select('leedsCorn')&&!GV.devUnlocked516B('landmark')&&GV.devMoney516B()===beforeMoney,'partial038 unchanged native locked selection');
  const reset=()=>{GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);};reset();
  api.open();const buttons=[...document.querySelectorAll('[data-wave038]')],silver=document.querySelector('[data-wave038="silver"]');
  need(buttons.length===10&&buttons.filter(b=>!b.disabled).length===9&&silver?.disabled,'partial038 ten catalog rows, nine enabled, Silver disabled');
  need(!silver.closest('article').querySelector('img'),'partial038 unavailable Silver has no fake image');
  const money=GV.devMoney516B();need(!api.select('silver')&&api.selection()===null&&GV.devMoney516B()===money,'partial038 missing Silver selection refuses without side effects');
  const findLot=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('partial038 legal native lot');};const lot=findLot();
  need(!!lot&&!fixture.unavailablePrivateSelection(lot.x,lot.y)&&GV.devMoney516B()===money,'partial038 private missing-model placement refuses before charging');
  need(api.select('leedsCorn'),'partial038 available selection');window.__noBritishWave038=true;
  need(!api.select('darlington')&&!GV.placeUndo('landmark',lot.x,lot.y)&&GV.devMoney516B()===money,'partial038 live valve blocks selected new placement and fee');
  for(const[id,v]of rows)need(GV.art574.vdraw({x:10,y:10},{k:24,lv:1,v})===0,'partial038 live valve resolves ordinary landmark');delete window.__noBritishWave038;
  need(api.select('leedsCorn')&&GV.britishWave037.select('belfast')&&api.selection()===null,'partial038 older catalog clears new selection');
  need(api.select('leedsCorn'),'partial038 selection for ordinary reset');api.open();document.getElementById('waveDefault038').click();need(api.selection()===null,'partial038 ordinary catalog reset');
  need(api.select('leedsCorn'),'partial038 fee fixture selection');
  const place=GV.place,cash=GV.devMoney516B(),quote=GV.placePreview459('landmark',lot.x,lot.y).cost;let feeFirst='';need(quote===2000,'partial038 native unchanged2000 quote');
  try{GV.place=function(id,x,y){const ok=place(id,x,y);if(ok&&id==='landmark')GV.capabilitySetMoney506(GV.devMoney516B()-1);return ok;};need(GV.place('landmark',lot.x,lot.y),'partial038 fee fault actual placement');try{need(cash-GV.devMoney516B()===quote,'partial038 native fee mismatch');}catch(e){feeFirst=e.message;}}
  finally{GV.place=place;}need(feeFirst==='partial038 native fee mismatch','partial038 fee first RED');red.push({name:'real paid placement overcharges1',first:feeFirst,restored:true});
  reset();const p=findLot();need(api.select('leedsCorn')&&GV.placeUndo('landmark',p.x,p.y),'partial038 redo fixture paid placement');const paid=GV.devMoney516B();need(GV.undo()&&GV.devMoney516B()===paid+2000,'partial038 undo exact refund');
  const redo=GV.redo,redoCheck=()=>need(GV.redo()&&api.read(p.x,p.y)?.v===520&&GV.devMoney516B()===paid,'partial038 native redo mismatch');let redoFirst='';
  try{GV.redo=()=>false;try{redoCheck();}catch(e){redoFirst=e.message;}}finally{GV.redo=redo;}need(redoFirst==='partial038 native redo mismatch','partial038 redo first RED');redoCheck();red.push({name:'real native redo fails',first:redoFirst,restored:true});
  need(GV.britishWave037.selftest().ok&&GV.heritage024.selftest().ok,'partial038 prior native architecture selftests unchanged');
  api.close();GV.selectTool434('pan');
  return{scope:'nine partial native candidates, never complete ten-model acceptance',installedLeaves:36,fullCatalogRows:10,enabledCandidates:9,SilverAbsent:true,coldFullInstallerRejection:fixture.coldRejection(),warmFullInstallerRejection:warmRejection,fullSelftest:{ok:full.ok,first:firstFull,expectedBlocked:true},red,images,slot:localStorage.getItem('glimmerville.v1.slot'),fullWaveAcceptance:false};
}
module.exports=partialNineChecks038;
