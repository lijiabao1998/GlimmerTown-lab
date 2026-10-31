'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame}=require('./harness.js'),{setup053}=require('./benchmark053.cjs');
const file=__dirname+'/index.html',original=fs.readFileSync(file,'utf8'),base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{maxBuffer:32e6,encoding:'utf8'}),out=__dirname+'/shots/regression053';fs.mkdirSync(out,{recursive:true});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function instrument(s){const old='function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}';assert(s.includes(old));s=s.replace(old,old.replace('return function(){','const gen=function(){').replace(/}}$/,'};gen.state053=()=>a;return gen;}'));const marker='window.GV={';assert(s.includes(marker));return s.replace(marker,"window.__state053=()=>({rng:R.state053(),money,pop,jobs,day,cityHappy,fin,history:mayorHistory470,actions:mayorActionCount470,tiles,socialStocks:social505.stocks,capabilityStocks:capability506.stocks,socialCity:social505.city,capabilityCity:capability506.city});\n"+marker);}
async function run(label,s){fs.writeFileSync(file,instrument(s));let records=[];const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{
 await cdp.evalJs('('+setup053.toString()+')('+JSON.stringify({scene:'small',seed:87,ai:true})+')');
 for(let i=0;i<=12;i++){if(i)await cdp.evalJs('GV.step(1)');records.push(await cdp.evalJs('(()=>{GV.setSpeed(0);GV.save();return {state:window.__state053(),save:JSON.parse(localStorage.getItem("glimmerville.v1.s3"))};})()'));}
 const roundtrip=await cdp.evalJs('(()=>{GV.save();const a=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));GV.load();GV.setSpeed(0);GV.save();const b=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));GV.load();GV.setSpeed(0);GV.save();const c=JSON.parse(localStorage.getItem("glimmerville.v1.s3"));return {a,b,c};})()');
 fs.writeFileSync(out+'/'+label+'-roundtrip.json',JSON.stringify(roundtrip));if(cdp.errors.length)throw Error(cdp.errors.join(';'));return roundtrip;
 });fs.writeFileSync(out+'/'+label+'-checkpoints.json',JSON.stringify(records));assert(r.ok,r.fails.join(';'));return{records,roundtrip:r.result};}
async function populatedParity053(){
 const {connectFixture053}=require('./populated-fixture053.cjs');
 const c1=cp.execFileSync('git',['show','89c10c41be14b81e6e00fa39fdd8cbbb284d978b:index.html'],{maxBuffer:32e6,encoding:'utf8'});
 const all=[];
 for(const [label,source] of [['populated-c1',c1],['populated-c2',original]]){
  fs.writeFileSync(file,instrument(source));
  const r=await withGame({port:8199,fresh:true,timeout:600,log:console.log},async({cdp})=>{
   const records=await cdp.evalJs('('+function(setup,connect){
    setup({scene:'medium',seed:87,ai:true});connect();GV.step(20);GV.setSpeed(0);
    const checkpoints=[];for(let i=0;i<=5;i++){if(i)GV.step(1);GV.setSpeed(0);GV.save();checkpoints.push({state:window.__state053(),save:JSON.parse(localStorage.getItem('glimmerville.v1.s3'))});}
    if(!(checkpoints[0].state.pop>0))throw Error('C2 requires native populated parity');return checkpoints;
   }.toString()+')('+setup053.toString()+','+connectFixture053.toString()+')');
   assert.equal(cdp.errors.length,0);return records;
  });fs.writeFileSync(out+'/'+label+'-checkpoints.json',JSON.stringify({ok:r.ok,fails:r.fails,records:r.result??null}));assert.ok(r.ok,r.fails.join(';'));all.push(r.result);
 }
 assert.deepEqual(all[1],all[0],'C2 populated native state/RNG/finance/events/tiles/save mismatch');
 fs.writeFileSync(out+'/populated-c2-parity.json',JSON.stringify({ok:true,checkpoints:6,startPopulation:all[0][0].state.pop,baseline:'89c10c41be14b81e6e00fa39fdd8cbbb284d978b',candidateHash:hash(original),note:'All six native checkpoints in one JS task, no visual-frame interleaving. All original regression assertions remain.'},null,2));
}
(async()=>{if(!process.env.GITHUB_ACTIONS)throw Error('Native regression is GitHub Actions only');try{const a=await run('baseline',base),b=await run('candidate',original);assert.deepEqual(b.records,a.records,'native state/RNG/finance/events/tiles/save mismatch');assert.deepEqual(b.roundtrip,a.roundtrip,'native roundtrip differs from baseline');await populatedParity053();const normalization=Object.keys(a.roundtrip.a).filter(k=>JSON.stringify(a.roundtrip.a[k])!==JSON.stringify(a.roundtrip.b[k]));fs.writeFileSync(out+'/receipt.json',JSON.stringify({ok:true,checkpoints:13,baseSha256:hash(base),candidateSha256:hash(original),instrumentation:'RNG getter only; original RNG arithmetic unchanged; read-only closure snapshot; excluded from performance timing',baselineRoundtripChangedFields:normalization,fullRoundtripUnchanged:normalization.length===0},null,2));}finally{fs.writeFileSync(file,original);}})().catch(e=>{fs.writeFileSync(out+'/first-failure.json',JSON.stringify({error:e.stack},null,2));console.error(e);process.exitCode=1;});
