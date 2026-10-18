'use strict';
if(process.env.GITHUB_ACTIONS!=='true')throw Error('capacity032 game guards run only on GitHub Actions');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const {withGame,ROOT}=require('./harness.js'),BASE='38a27743e9708517d88e251a005c3475fff1bbe7',WAVE='1f31a32bab664c2e02e825532f33dbc7d46a89c7',index=path.join(ROOT,'index.html'),head=fs.readFileSync(index),base=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:24*1024*1024}),art=cp.execFileSync('git',['show',WAVE+':british-wave05-art031.js'],{encoding:'utf8'}),OUT=path.join(ROOT,'shots','capacity032'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let restored=head.toString();
const pd="if(ks.length>1200&&!(v===SPR.bld&&d===0&&p==='bld'&&ks.length<=2000))return;",pth="if(ks.length>1200&&!(v===SPR.bld&&depth===0&&path==='bld'&&ks.length<=2000))return;";
assert.equal(restored.split(pd).length-1,3);assert.equal(restored.split(pth).length-1,1);
restored=restored.replaceAll(pd,'if(ks.length>1200)return;').replace(pth,'if(ks.length>1200)return;');
const begin='/* GPT-032 CAPACITY SELFTEST START */',end='/* GPT-032 CAPACITY SELFTEST END */',a=restored.indexOf(begin),b=restored.indexOf(end,a);assert(a>=0&&b>a);restored=restored.slice(0,a)+restored.slice(b+end.length+1);
assert.equal(restored,base.toString(),'capacity032 four capacity conditions and own selftest are the complete product source delta');
for(const m of head.toString().matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
cp.execFileSync(process.execPath,['embed-capacity032.cjs','--check'],{cwd:ROOT,stdio:'inherit'});
async function nativeCapacity032(mode){
  GV.setSpeed(0);
  const SPR=GV.art574.SPR(),registry=SPR.bld,originalKeys=Object.keys(registry),originalRefs=new Map(Object.entries(registry)),world=JSON.stringify(GV.stats()),storage=JSON.stringify(localStorage);
  const prefix='capacity032_',family='capacityProbe032',nested='capacity032Nested',report={mode,originalCount:originalKeys.length,cases:[],firstRed:[],negativeControls:[]};
  const require=(ok,message)=>{if(!ok)throw Error(message);};
  require(originalKeys.length===1179,'capacity032 independent main registry expected1179');
  require(!Object.hasOwn(SPR,family)&&!Object.hasOwn(registry,nested)&&!originalKeys.some(k=>k.startsWith(prefix)),'capacity032 reserved isolated fixture names');
  const digest=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
  const capture=()=>({fp:GV.fp536(),sheet:GV.sheet536('bld'),style:GV.style536()});
  const counts=q=>({fp:Object.keys(q.fp.subs||{}).filter(k=>k.startsWith('bld.')).length,sheet:q.sheet.leaves.length,style:Object.keys(q.style.leaves||{}).filter(k=>k.startsWith('bld.')).length});
  const verify=(q,n,label)=>{const c=counts(q);for(const api of['fp','sheet','style'])require(c[api]===n,'capacity032 '+api+' complete bld '+label+' expected'+n+' actual'+c[api]);};
  const reference=capture(),oldPaths=new Set(reference.sheet.leaves.map(q=>q.p)),originalSheet=JSON.stringify(reference.sheet.leaves);
  verify(reference,1179,'original main');
  report.originalSheetSHA256=await digest(originalSheet);report.defaultCounts=counts(reference);report.originalFingerprint=reference.fp;report.originalStyle=reference.style;
  const unchangedOld=async(q,label,includeBld=true)=>{
    for(const [p,v]of Object.entries(reference.fp.subs))if(includeBld||!p.startsWith('bld.'))require(JSON.stringify(q.fp.subs[p])===JSON.stringify(v),'capacity032 original fingerprint leaf '+label+' '+p);
    for(const [p,v]of Object.entries(reference.style.leaves))if(includeBld||!p.startsWith('bld.'))require(JSON.stringify(q.style.leaves[p])===JSON.stringify(v),'capacity032 original style leaf '+label+' '+p);
    for(const [f,v]of Object.entries(reference.fp.families))if(f!=='bld')require(JSON.stringify(q.fp.families[f])===JSON.stringify(v),'capacity032 unchanged other fingerprint family '+f);
    for(const [f,v]of Object.entries(reference.style.families))if(f!=='bld')require(JSON.stringify(q.style.families[f])===JSON.stringify(v),'capacity032 unchanged other style family '+f);
    if(includeBld){const pixels=JSON.stringify(q.sheet.leaves.filter(v=>oldPaths.has(v.p)));require(pixels===originalSheet,'capacity032 byte-exact original day/night sheet '+label);return await digest(pixels);}
    return null;
  };
  const clean=()=>{for(const k of Object.keys(registry))if(!originalRefs.has(k))delete registry[k];delete SPR[family];};
  const makeDummy=()=>{const img=document.createElement('canvas'),night=document.createElement('canvas');img.width=night.width=1;img.height=night.height=1;img.getContext('2d').fillStyle='#d4c7ac';img.getContext('2d').fillRect(0,0,1,1);night.getContext('2d').fillStyle='#efc989';night.getContext('2d').fillRect(0,0,1,1);return{img,night};};
  const dummy=makeDummy(),pad=n=>{for(let j=0;Object.keys(registry).length<n;j++)registry[prefix+j]=dummy;};
  const installed=window.BritishWaveArchitecture031.buildAll();require(installed.length===40,'capacity032 actual fifth wave has40 authored views');
  try{
    for(const{row,view,sprite}of installed){const key='24_1_'+(row.v+view);require(!Object.hasOwn(registry,key)&&sprite.w===160&&sprite.h===196&&sprite.view===view,'capacity032 actual fifth wave view '+key);registry[key]=sprite;}
    const q=capture();report.realFifthWave={sourceCount:installed.length,registry:Object.keys(registry).length,counts:counts(q),newPaths:q.sheet.leaves.map(v=>v.p).filter(p=>!oldPaths.has(p))};
    require(report.realFifthWave.registry===1219,'capacity032 actual fifth registry1219');
    if(mode==='BASE'){
      require(Object.values(counts(q)).every(n=>n===0),'capacity032 actual old scanner bug not reproduced');
      for(const api of['fp','sheet','style']){let first;try{require(counts(q)[api]===1219,'capacity032 '+api+' complete bld real wave05 expected1219 actual'+counts(q)[api]);}catch(e){first=e.message;}require(first?.startsWith('capacity032 '+api+' complete bld'),'capacity032 old scanner first RED target '+api);report.firstRed.push({api,first});}
      await unchangedOld(q,'BASE documented missing bld',false);
    }else{
      verify(q,1219,'actual fifth wave');require(report.realFifthWave.newPaths.length===40,'capacity032 all actual fifth paths visible');report.realFifthWave.originalPixelsSHA256=await unchangedOld(q,'actual fifth wave');
      const good=GV.bldCapacity032.selftest();require(good.ok,'capacity032 new selftest on actual fifth wave');
      const sheet=GV.sheet536;try{GV.sheet536=function(...args){const result=sheet(...args);return args[0]==='bld'?{...result,leaves:result.leaves.slice(1)}:result;};const negative=GV.bldCapacity032.selftest(),first=negative.checks.find(q=>q.endsWith('✗'));require(!negative.ok&&first?.startsWith('capacity032 sheet covers'),'capacity032 actual sheet omission first RED');report.negativeControls.push({fault:'actual public sheet API omits an existing leaf',first});}finally{GV.sheet536=sheet;}
      require(GV.bldCapacity032.selftest().ok,'capacity032 restored public sheet GREEN');
    }
    clean();verify(capture(),1179,'restored after real fifth wave');
    if(mode==='HEAD'){
      for(const n of[1200,1201,1219,1819,2000,2001]){
        pad(n);const q=capture(),expected=n<=2000?n:0;verify(q,expected,'bounded root '+n);const oldPixelHash=await unchangedOld(q,'bounded root '+n,n<=2000);report.cases.push({kind:'bld root',registry:n,expected,counts:counts(q),oldPixelSHA256:oldPixelHash});clean();
      }
      SPR[family]=Object.fromEntries(Array.from({length:1201},(_,i)=>['leaf'+i,dummy]));
      const other={fp:GV.fp536(),sheet:GV.sheet536(family),style:GV.style536()};require(!Object.keys(other.fp.subs).some(p=>p.startsWith(family+'.'))&&other.sheet.leaves.length===0&&!Object.keys(other.style.leaves).some(p=>p.startsWith(family+'.')),'capacity032 other root retains1200 bound');await unchangedOld(capture(),'other root');report.cases.push({kind:'other root',registry:1201,expected:0});delete SPR[family];
      registry[nested]=Object.fromEntries(Array.from({length:1201},(_,i)=>['leaf'+i,dummy]));const inner=capture();verify(inner,1179,'nested oversized object');require(!inner.sheet.leaves.some(q=>q.p.startsWith('bld.'+nested+'.')),'capacity032 nested bld keeps1200 bound');await unchangedOld(inner,'nested object');report.cases.push({kind:'bld child',registry:1201,expectedDescendants:0});clean();
    }
    const final=capture();verify(final,1179,'final restored main');report.restoredSheetSHA256=await unchangedOld(final,'final restored');require(report.originalSheetSHA256===report.restoredSheetSHA256,'capacity032 original pixel bytes finally restored');
    require(Object.keys(registry).length===originalKeys.length&&originalKeys.every(k=>registry[k]===originalRefs.get(k)),'capacity032 original registry identity restored');require(JSON.stringify(GV.stats())===world,'capacity032 world unchanged');require(JSON.stringify(localStorage)===storage,'capacity032 localStorage unchanged');report.worldUnchanged=true;report.storageUnchanged=true;report.slot=localStorage.getItem('glimmerville.v1.slot');report.originalViewCount=originalKeys.length;
    if(mode==='HEAD'){report.selftest=GV.bldCapacity032.selftest();require(report.selftest.ok,'capacity032 final default selftest GREEN');}
    return report;
  }finally{clean();}
}
async function run(bytes,mode){
  fs.writeFileSync(index,bytes);const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{await cdp.evalJs(art);const data=await cdp.evalJs('('+nativeCapacity032.toString()+')('+JSON.stringify(mode)+')');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return data;});assert(r.ok&&r.result,'capacity032 '+mode+' session '+r.fails.join('; '));return r.result;
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});let old,next;
  try{old=await run(base,'BASE');next=await run(head,'HEAD');}finally{fs.writeFileSync(index,head);}
  assert.equal(old.slot,'3');assert.equal(next.slot,'3');assert.equal(old.originalSheetSHA256,next.originalSheetSHA256,'capacity032 independent main and repaired HEAD original day/night image bytes');assert.deepEqual(old.originalFingerprint,next.originalFingerprint,'capacity032 independent BASE/HEAD full original fingerprint');assert.deepEqual(old.originalStyle,next.originalStyle,'capacity032 independent BASE/HEAD full original style leaves');
  const report={ok:true,head:process.env.GITHUB_SHA,base:BASE,realWaveSource:WAVE,sourceSHA256:{base:hash(base),head:hash(head),realWaveArt:hash(Buffer.from(art))},sourceBoundaryExact:true,noLocalExecution:true,onlyRealSPRRegistryFixtures:true,old,new:next,notClaimed:['merge or deployment approval','fifth wave full native acceptance','physical mobile or Safari validation']};
  fs.writeFileSync(path.join(OUT,'manifest-capacity032.json'),JSON.stringify(report,null,2)+'\n');console.log('CAPACITY032_GREEN '+JSON.stringify({head:report.head,base:BASE,realFifthWave:next.realFifthWave,oldFirstRed:old.firstRed,capacityCases:next.cases,negativeControls:next.negativeControls,worldUnchanged:next.worldUnchanged,storageUnchanged:next.storageUnchanged,originalSheetSHA256:next.originalSheetSHA256}));
})().catch(e=>{fs.writeFileSync(index,head);fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'capacity032-error.txt'),e.stack+'\n');console.error(e.stack);process.exitCode=1;});
