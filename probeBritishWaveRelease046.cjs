'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave046 game guards run on GitHub Actions only');
// Executed in real Chrome on GitHub Actions, never during local source checks.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process'),vm=require('node:vm');
const {withGame,ROOT}=require('./harness.js'),BASE='a5154857887ecf1c6e21b049da6c6d19fe117c4e',OUT=path.join(ROOT,'shots','wave046'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8',maxBuffer:20*1024*1024});
const committedSource=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const release046=require('./wave046-release-labels.cjs');release046.toCandidate(committedSource);
function nativeSource046(text){let stripped=text;
for(const part of['PURE ART','CSS']){
  const start='<!-- GPT-046 '+part+' START -->',end='<!-- GPT-046 '+part+' END -->',a=stripped.indexOf(start),b=stripped.indexOf(end,a);
  assert(a>=0&&b>a&&stripped.indexOf(start,a+1)<0,'one embedding '+part);
  stripped=stripped.slice(0,a)+stripped.slice(b+end.length+1);
}
const a=stripped.indexOf('/* GPT-046 RUNTIME START'),b=stripped.indexOf('/* GPT-046 RUNTIME END */',a);
assert(a>=0&&b>a,'one runtime embedding');
stripped=stripped.slice(0,a)+stripped.slice(b+'/* GPT-046 RUNTIME END */'.length+1);
stripped=stripped.replace('installBritishWave039();installBritishWave040();installBritishWave041();installBritishWave042();installBritishWave043();installBritishWave044();installBritishWave045();installBritishWave046();','installBritishWave039();installBritishWave040();installBritishWave041();installBritishWave042();installBritishWave043();installBritishWave044();installBritishWave045();');
return release046.swap(stripped,true);}
const sourceCheck046=text=>assert(nativeSource046(text)===original,'wave046 existing native model and original rendering source byte-identical after exact inverse of the three declared release labels');
sourceCheck046(committedSource);let sourceFirstRed046;
const sourceFault046=committedSource.replace('</head>','<!-- GPT046 valid HTML outside the declared source boundary -->\n</head>');
for(const m of sourceFault046.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
try{sourceCheck046(sourceFault046);}catch(e){sourceFirstRed046=e.message.split('\n')[0];}
assert(sourceFirstRed046?.startsWith('wave046 existing native model'),'wave046 source-boundary negative missed target');sourceCheck046(committedSource);
cp.execFileSync(process.execPath,['embed-wave046.cjs','--check'],{cwd:ROOT,stdio:'inherit'});

function originalImages(){
  GV.setSpeed(0);
  const a=GV.britishWave046,spr=GV.art574.SPR().bld,data=GV.sheet536('bld','^bld[.]24_1_8[4-7][0-9]$');
  if(!data.ok||data.leaves.length!==40)throw Error('wave046 forty actual installed leaves');
  const contacts={};
  for(const mode of['day','night']){
    const c=document.createElement('canvas');c.width=1040;c.height=2400;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
    a.rows().forEach((q,i)=>{for(let view=0;view<4;view++){const x=view*260,y=i*240,s=spr['24_1_'+(q.v+view)];g.drawImage(s.img,x+30,y+25);if(mode==='night'){g.fillStyle='#081314';g.fillRect(x+30,y+25,s.w,s.h);g.globalAlpha=.25;g.drawImage(s.img,x+30,y+25);g.globalAlpha=1;g.drawImage(s.night,x+30,y+25);}g.fillStyle='#eee3cb';g.font='12px sans-serif';g.fillText(q.en+' · '+view,x+8,y+14,248);}});
    contacts[mode]=c.toDataURL('image/png');
  }
  const catalog=[...GV.heritage024.rows(),...GV.britishWave025.rows(),...GV.britishWave027.rows(),...GV.britishWave029.rows(),...GV.britishWave030.rows(),...GV.britishWave031.rows(),...GV.britishWave033.rows(),...GV.britishWave035.rows(),...GV.britishWave036.rows(),...GV.britishWave037.rows(),...GV.britishWave038.rows(),...GV.britishWave039.rows(),...GV.britishWave040.rows(),...GV.britishWave041.rows(),...GV.britishWave042.rows(),...GV.britishWave043.rows(),...GV.britishWave044.rows(),...GV.britishWave045.rows()];
  const comparisons=[{"v":840,"oldId":"rookhall"},{"v":844,"oldId":"birchbind"},{"v":848,"oldId":"dreamland"},{"v":852,"oldId":"foxengine"},{"v":856,"oldId":"osieroral"},{"v":860,"oldId":"elderdebate"},{"v":864,"oldId":"fencooper"},{"v":868,"oldId":"thistlenursery"},{"v":872,"oldId":"pennyfen"},{"v":876,"oldId":"beckvalve"}];
  const c=document.createElement('canvas');c.width=1536;c.height=3600;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
  comparisons.forEach((item,i)=>{const nr=a.rows().find(r=>r.v===item.v),or=catalog.find(r=>r.id===item.oldId);if(!or)throw Error('wave046 existing comparison metadata '+item.oldId);item.ov=or.v;for(let j=0;j<4;j++){
    const isNew=j%2===0,view=j<2?0:2,key=isNew?'24_1_'+(item.v+view):item.family?item.key+view:item.key?(j<2?item.key:item.alt):'24_1_'+(item.ov+view),family=isNew?'bld':(item.family||'bld'),s=GV.art574.SPR()[family][key],x=j*384,y=i*360;
    if(!s?.img)throw Error('wave046 actual old/new comparison sprite '+family+'.'+key);
    g.drawImage(s.img,x+40,y+25);g.fillStyle=isNew?'#eee3cb':'#a6b6a6';g.font='12px sans-serif';g.fillText((isNew?'NEW ':'OLD ')+(isNew?nr.en:(or?.en||item.name))+' / '+(!isNew&&item.key?+key.split('_').at(-1):view),x+8,y+14,368);
  }});
  contacts.comparison=c.toDataURL('image/png');
  return{images:data.leaves,contacts};
}
// A byte-preserving transfer of public CI evidence; no credentials or world saves.
function exportEvidence(name,bytes){
  const b64=bytes.toString('base64');
  console.log('WAVE046_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:bytes.length,sha256:hash(bytes)}));
  for(let i=0;i<b64.length;i+=4096)console.log('WAVE046_FILE_DATA '+b64.slice(i,i+4096));
  console.log('WAVE046_FILE_END '+name);
}
function preserveImages(r){
  fs.mkdirSync(OUT,{recursive:true});const images=[];
  for(const s of r.images)for(const layer of['day','night']){const bytes=Buffer.from(s[layer].split(',')[1],'base64'),file=s.p.replace('bld.','')+'-'+layer+'.png';fs.writeFileSync(path.join(OUT,file),bytes);images.push({file,w:s.w,h:s.h,sha256:hash(bytes)});exportEvidence(file,bytes);}
  for(const [mode,data]of Object.entries(r.contacts)){const bytes=Buffer.from(data.split(',')[1],'base64'),file='contact-'+mode+'.png';fs.writeFileSync(path.join(OUT,file),bytes);exportEvidence(file,bytes);}
  return images;
}

function nativeChecks(){
  GV.setSpeed(0);
  const a=GV.britishWave046,before=JSON.stringify(GV.stats()),report=a.selftest(),spr=GV.art574.SPR().bld;
  if(!report.ok)throw Error(report.checks.find(c=>c.endsWith('✗')));
  if(report.checks.length<86)throw Error('wave046 retain at least86 native selftest assertions');
  if(before!==JSON.stringify(GV.stats()))throw Error('wave046 selftest mutated the native world');
  if(!GV.heritage024.selftest().ok||!GV.useScales021.selftest().ok||!GV.britishWave025.selftest().ok||!GV.britishWave027.selftest().ok||!GV.britishWave029.selftest().ok||!GV.britishWave030.selftest().ok||!GV.britishWave031.selftest().ok||!GV.britishWave033.selftest().ok||!GV.britishWave035.selftest().ok||!GV.britishWave036.selftest().ok||!GV.britishWave037.selftest().ok||!GV.britishWave038.selftest().ok||!GV.britishWave039.selftest().ok||!GV.britishWave040.selftest().ok||!GV.britishWave041.selftest().ok||!GV.britishWave042.selftest().ok||!GV.britishWave043.selftest().ok||!GV.britishWave044.selftest().ok||!GV.britishWave045.selftest().ok)throw Error('wave046 old architecture selftests regressed');
  const red=[],expect=(name,mutate,restore,target)=>{
    try{mutate();const r=a.selftest(),first=r.checks.find(c=>c.endsWith('✗'));if(r.ok||!first?.startsWith(target))throw Error('wrong first RED '+name+': '+first);red.push({name,first});}
    finally{restore();}
    if(!a.selftest().ok)throw Error('wave046 restoration failed '+name);
  };
  const s=spr['24_1_840'];
  expect('missing installed leaf',()=>delete spr['24_1_840'],()=>spr['24_1_840']=s,'wave046 count');
  const width=s.w;expect('wrong native dimensions',()=>s.w=159,()=>s.w=width,'wave046 native geometry');
  const night=s.night,day=s.img;
  expect('night light on transparent sky',()=>{const c=document.createElement('canvas');c.width=s.w;c.height=s.h;const g=c.getContext('2d');g.drawImage(night,0,0);g.fillStyle='#fff';g.fillRect(0,0,1,1);s.night=c;},()=>s.night=night,'wave046 opaque physical night');
  expect('soft native day pixel',()=>{const c=document.createElement('canvas');c.width=s.w;c.height=s.h;const g=c.getContext('2d');g.drawImage(day,0,0);const d=g.getImageData(0,0,s.w,s.h),n=night.getContext('2d').getImageData(0,0,s.w,s.h).data;let at=-1;for(let i=3;i<d.data.length;i+=4)if(d.data[i]===255&&!n[i]){at=i;break;}if(at<0)throw Error('opaque fixture missing');d.data[at]=127;g.putImageData(d,0,0);s.img=c;},()=>s.img=day,'wave046 hard pixels');
  expect('native canvas crop',()=>{const c=document.createElement('canvas');c.width=s.w;c.height=s.h;const g=c.getContext('2d');g.drawImage(day,0,0);g.fillStyle='#e0d8c0';g.fillRect(0,0,1,1);s.img=c;},()=>s.img=day,'wave046 uncropped');
  const api=window.BritishWaveArchitecture046;
  expect('different names but duplicate geometry',()=>window.BritishWaveArchitecture046={...api,build:(id,v)=>api.build(id==='guelderlace'?'merememorial':id,v)},()=>window.BritishWaveArchitecture046=api,'wave046 ten distinct structural');
  const other=spr['24_1_844'],od=other.img,on=other.night;
  expect('installed clone with distinct authors',()=>{other.img=day;other.night=night;},()=>{other.img=od;other.night=on;},'wave046 installed pixels');
  expect('empty native day and night',()=>{const c=document.createElement('canvas');c.width=160;c.height=196;s.img=c;s.night=c;},()=>{s.img=day;s.night=night;},'wave046 uncropped');

  let phase='initial';
  const lot=()=>{
    for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3){
      if(!GV.placePreview459('landmark',x,y)?.ok)continue;
      let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;
      if(clear)return{x,y};
    }
    const samples=[];for(const [x,y]of[[4,4],[16,16],[32,32],[48,48]])samples.push({x,y,preview:GV.placePreview459('landmark',x,y)});
    throw Error('wave046 no legal native lot: '+JSON.stringify({phase,money:GV.useScales021.world().money,dev:GV.dev516B(),samples}));
  };
  const lockedMoney=GV.useScales021.world().money;
  if(GV.devUnlocked516B('landmark')||a.select('merememorial')||GV.useScales021.world().money!==lockedMoney)throw Error('wave046 unchanged native lock');
  const unlock=()=>{if(!GV.dev516B().sandbox)GV.enterSandbox516B();if(!GV.setGod516B(true)||!GV.setOverride516B('unlockAll',true))throw Error('wave046 explicit isolated native unlock fixture');};
  unlock();
  const fee=(before,expected,after)=>{const spent=before-after;if(!Number.isFinite(before)||spent!==expected||spent<=0)throw Error('wave046 fee '+spent+' expected '+expected);return spent;};
  // Mutate the public native placement API with valid live source, then require
  // the same fee assertion used below to be the first failure. Reset world after.
  GV.setDiff(1);GV.newWorldSeeded(87);GV.setSpeed(0);unlock();GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const fp=lot(),cash=GV.devMoney516B(),quote=GV.placePreview459('landmark',fp.x,fp.y).cost,place=GV.place;let feeRed;
  try{
    GV.place=function(id,x,y){const ok=place(id,x,y);if(ok&&id==='landmark')GV.capabilitySetMoney506(GV.devMoney516B()-1);return ok;};
    if(!GV.place('landmark',fp.x,fp.y))throw Error('wave046 fee negative fixture placement failed');
    try{fee(cash,quote,GV.devMoney516B());}catch(e){feeRed=e.message;}
    if(!feeRed?.startsWith('wave046 fee '))throw Error('wave046 fee negative missed target');
  }finally{GV.place=place;}
  red.push({name:'valid live source overcharges one native dollar',first:feeRed});
  const pairs=[];
  for(const seed of[31,71,103]){
    const arm=special=>{
      GV.setDiff(3);GV.newWorldSeeded(seed);GV.setSpeed(0);unlock();GV.capabilitySetMoney506(1000000);phase='paired '+seed+' '+(special?'new':'old');const p=lot();
      if(special&&!a.select('gorsepicture'))throw Error('wave046 paired selection');
      GV.setDiff(1);const money=GV.useScales021.world().money,expected=GV.placePreview459('landmark',p.x,p.y).cost;
      if(!GV.place('landmark',p.x,p.y))throw Error('wave046 paid native placement');
      const spent=fee(money,expected,GV.useScales021.world().money),b=a.read(p.x,p.y);
      if(b.k!==24||b.sz!==2||(special?b.v!==848:b.v>2))throw Error('wave046 native root identity');
      for(const [dx,dy]of[[1,0],[0,1],[1,1]])if(JSON.stringify(a.read(p.x+dx,p.y+dy).ref)!==JSON.stringify([p.x,p.y]))throw Error('wave046 native reference');
      GV.step(1);return{spent,root:{...b,v:0},stats:GV.stats(),tile:p};
    };
    const old=arm(false),next=arm(true);
    if(JSON.stringify(old)!==JSON.stringify(next))throw Error('wave046 same-seed model/RNG difference '+seed);
    pairs.push({seed,spent:old.spent,equal:true});
  }
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);unlock();GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const placed=[];
  for(const q of a.rows()){
    phase='catalog '+q.id;const p=lot();a.open();const button=document.querySelector('[data-wave046="'+q.id+'"]');
    if(!button||button.disabled)throw Error('wave046 actual catalog button '+q.id);
    button.click();if(a.selection()!==q.id)throw Error('wave046 actual catalog click '+q.id);
    const money=GV.useScales021.world().money,expected=GV.placePreview459('landmark',p.x,p.y).cost;
    if(!GV.placeUndo('landmark',p.x,p.y))throw Error('wave046 native place '+q.id);
    const b=a.read(p.x,p.y),spent=fee(money,expected,GV.useScales021.world().money);
    if(b.v!==q.v||b.k!==24||b.sz!==2)throw Error('wave046 paid identity '+q.id);
    const paid=GV.devMoney516B(),empty=()=>[0,1].every(dy=>[0,1].every(dx=>a.read(p.x+dx,p.y+dy)===null));
    if(!GV.undo()||!empty()||GV.devMoney516B()!==paid+spent)throw Error('wave046 every-form undo and exact refund '+q.id);
    if(!GV.redo()||a.read(p.x,p.y)?.v!==q.v||GV.devMoney516B()!==paid)throw Error('wave046 every-form redo and exact fee '+q.id);
    if(!GV.placeUndo('doze',p.x+1,p.y+1)||!empty())throw Error('wave046 every-form reference demolition '+q.id);
    if(!GV.undo()||a.read(p.x,p.y)?.v!==q.v||GV.devMoney516B()!==paid)throw Error('wave046 every-form demolition undo '+q.id);
    placed.push({...p,id:q.id,v:q.v,spent});
  }
  const last=placed.at(-1),paidMoney=GV.devMoney516B(),empty=()=>[0,1].every(dy=>[0,1].every(dx=>a.read(last.x+dx,last.y+dy)===null));
  if(!GV.undo()||!empty()||GV.devMoney516B()!==paidMoney+last.spent)throw Error('wave046 new appearance undo, footprint and refund');
  const redoCheck=()=>{if(!GV.redo()||a.read(last.x,last.y)?.v!==last.v||GV.devMoney516B()!==paidMoney)throw Error('wave046 new appearance redo, identity and fee');};
  const redo=GV.redo;let redoRed;
  try{GV.redo=()=>false;try{redoCheck();}catch(e){redoRed=e.message;}if(!redoRed?.startsWith('wave046 new appearance redo'))throw Error('wave046 transaction negative missed target');}finally{GV.redo=redo;}
  red.push({name:'valid live redo API fails to restore new appearance',first:redoRed});redoCheck();
  if(!GV.placeUndo('doze',last.x+1,last.y+1)||!empty())throw Error('wave046 new appearance reference demolition');
  if(!GV.undo()||a.read(last.x,last.y)?.v!==last.v||GV.devMoney516B()!==paidMoney)throw Error('wave046 undo reference demolition restores new appearance');
  const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
  // Exercise the normal first native simulation update before the persistence
  // reference. The pre-update constructor has optional legacy subsystems absent;
  // its exact BASE/HEAD bootstrap is independently retained by normal-pairs.
  GV.save();const constructorSave046=JSON.parse(GV.rawSave());GV.step(1);
  // Read the real mayor options UI to materialize the native lazy policy model.
  // No policy is applied and AI is not enabled. Keep the early-state BASE proof.
  const mayorButton046=document.getElementById('bAI');if(!mayorButton046)throw Error('wave046 native mayor button missing');mayorButton046.click();
  const options046=document.querySelector('[data-mtab470="options"]');if(!options046)throw Error('wave046 native mayor options missing');options046.click();document.getElementById('infoX').click();GV.save();
  const originalSave=JSON.stringify(canonical(JSON.parse(GV.rawSave())));
  for(let pass=0;pass<2;pass++){
    if(!GV.load())throw Error('wave046 real native load');GV.save();for(const q of placed)if(a.read(q.x,q.y).v!==q.v)throw Error('wave046 native saved variant roundtrip '+q.id);
    const actual=JSON.stringify(canonical(JSON.parse(GV.rawSave())));
    if(actual!==originalSave){
      const differences=[],walk=(x,y,p='')=>{if(JSON.stringify(canonical(x))===JSON.stringify(canonical(y)))return;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p?p+'.'+k:k);}else if(differences.length<24)differences.push({path:p,before:x,after:y});};walk(JSON.parse(originalSave),JSON.parse(actual));
      throw Error('wave046 new appearances complete-field save roundtrip '+pass+' '+JSON.stringify(differences));
    }
  }
  if(!GV.heritage024.select('kew')||a.selection()!==null)throw Error('wave046 older catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave025.select('alaronde')||a.selection()!==null)throw Error('wave046 first-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave027.select('croydon')||a.selection()!==null)throw Error('wave046 second-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave029.select('stalbans')||a.selection()!==null)throw Error('wave046 third-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave030.select('cley')||a.selection()!==null)throw Error('wave046 fourth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave031.select('netshops')||a.selection()!==null)throw Error('wave046 fifth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave033.select('leicester')||a.selection()!==null)throw Error('wave046 sixth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave035.select('landmarktheatre')||a.selection()!==null)throw Error('wave046 seventh-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave036.select('finsbury')||a.selection()!==null)throw Error('wave046 eighth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave037.select('belfast')||a.selection()!==null)throw Error('wave046 ninth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave038.select('leedsCorn')||a.selection()!==null)throw Error('wave046 tenth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave039.select('brackenread')||a.selection()!==null)throw Error('wave046 eleventh-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave040.select('asterpost')||a.selection()!==null)throw Error('wave046 twelfth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave041.select('birchbind')||a.selection()!==null)throw Error('wave046 thirteenth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave042.select('alderjoinery')||a.selection()!==null)throw Error('wave046 fourteenth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave043.select('reedcider')||a.selection()!==null)throw Error('wave046 fifteenth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave044.select('lindenmaps')||a.selection()!==null)throw Error('wave046 sixteenth-wave catalog selection must clear new selection');
  if(!a.select('merememorial')||!GV.britishWave045.select('knapmediation')||a.selection()!==null)throw Error('wave046 seventeenth-wave catalog selection must clear new selection');
  a.open();if(document.querySelectorAll('[data-wave046]').length!==10)throw Error('wave046 catalog count');
  document.getElementById('waveDefault046').click();phase='legacy after catalog';const p=lot();
  if(a.selection()!==null||!GV.placeUndo('landmark',p.x,p.y)||a.read(p.x,p.y).v>2)throw Error('wave046 legacy landmark selection');
  if(!GV.undo()||a.read(p.x,p.y)!==null)throw Error('wave046 native undo');
  if(!GV.redo()||a.read(p.x,p.y).k!==24)throw Error('wave046 native redo');
  if(!GV.place('doze',p.x+1,p.y+1))throw Error('wave046 native ref demolition');
  for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(a.read(p.x+dx,p.y+dy)!==null)throw Error('wave046 ref demolition residue');
  window.__noBritishWave046=true;
  if(a.select('merememorial'))throw Error('wave046 valve accepted new special selection');
  for(const q of a.rows())if(GV.art574.vdraw({x:10,y:10},{k:24,lv:1,v:q.v})!==0)throw Error('wave046 valve must resolve original landmark');
  delete window.__noBritishWave046;
  return{report,red,pairs,placed,newAppearanceTransactions:{id:last.id,v:last.v,undo:true,redo:true,refund:last.spent,refDemolition:true,undoRefDemolition:true,allTenForms:true},slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),fixture:{initialMoney:1000000,unlimitedMoney:false,difficulty:1,nativeStepsBeforeSaveReference:1,nativeMayorOptionsRead:true,preUpdateConstructor:{pol:constructorSave046.pol,hasGov513:Object.hasOwn(constructorSave046,'gov513'),hasInn507:Object.hasOwn(constructorSave046,'inn507')},everySaveFieldCompared:true},remaining:['complete seasonal/edge/overlay scenes (separate probe)','full-frame base/valve comparison (separate probe)','human full-scene image review']};
}
(async()=>{
  let images=[];
  const session=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true',log:console.log},async({cdp})=>{
    images=preserveImages(await cdp.evalJs('('+originalImages.toString()+')()'));
    fs.writeFileSync(path.join(OUT,'samples.json'),JSON.stringify({head:process.env.GITHUB_SHA,indexSHA256:hash(fs.readFileSync(path.join(ROOT,'index.html'))),base:BASE,status:'samples captured; native checks not yet completed',images},null,2)+'\n');
    const r=await cdp.evalJs('('+nativeChecks.toString()+')()');
    if(cdp.errors.length)throw Error('wave046 console: '+cdp.errors.join('; '));return r;
  });
  assert(session.ok&&session.result,'wave046 native browser: '+session.fails.join('; '));
  const r=session.result;assert.equal(r.slot,'3');
  r.red.push({name:'valid HTML mutates original source outside declared bounds',first:sourceFirstRed046,restoredGreen:true});
  // The game is intentionally scoped. Exercise the real private selector by a
  // valid source mutation in a separate CI-only boot, then restore exact bytes.
  const index=path.join(ROOT,'index.html'),source=fs.readFileSync(index,'utf8'),target='function britishView046(b){const q=britishRow046(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}';
  assert.equal(source.split(target).length,2,'one own rotation source target');
  const broken=source.replace(target,'function britishView046(b){const q=britishRow046(b);return q?q.v:null;}');for(const m of broken.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
  try{
    fs.writeFileSync(index,broken);const n=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true',log:console.log},async({cdp})=>{const q=await cdp.evalJs('GV.britishWave046.selftest()');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return q;});
    assert(n.ok&&n.result,'wave046 valid-source negative boot');const first=n.result.checks.find(c=>c.endsWith('✗'));assert(!n.result.ok&&first?.startsWith('wave046 actual rotation'),'wave046 valid-source negative first RED: '+first);r.red.push({name:'valid source freezes private camera selector',first});
  }finally{fs.writeFileSync(index,source);}
  const restored=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true',log:console.log},async({cdp})=>{const q=await cdp.evalJs('GV.britishWave046.selftest()');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return q;});
  assert(restored.ok&&restored.result?.ok,'wave046 restored source must boot and return GREEN');
  assert.equal(r.red.length,12,'wave046 twelve real first-RED native/source controls');
  assert.equal(images.length,80,'wave046 eighty original day/night sprites');
  const manifest=Buffer.from(JSON.stringify({head:process.env.GITHUB_SHA,indexSHA256:hash(fs.readFileSync(path.join(ROOT,'index.html'))),base:BASE,...r,images},null,2)+'\n');
  fs.writeFileSync(path.join(OUT,'manifest.json'),manifest);exportEvidence('manifest.json',manifest);
  console.log('wave046 native GREEN: ten forms, forty views, eighty original PNGs; '+r.red.length+' live first-RED controls; three same-seed pairs; ten paid catalog clicks; two native save/load cycles; undo/redo/ref demolition.');
  console.log('Remaining, not claimed passed: '+r.remaining.join('; '));
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
