'use strict';
// Source and synthetic accounting data only. Never executes placement or game.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {waterfrontPublicCapitalDelta018:delta,buildPlacement018}=require('./waterfront-public-capital018'),{waterfrontCapital018}=require('./waterfront-gameplay018');
const root=process.env.EXPECTED_RELEASE_ROOT||__dirname,adapter=buildPlacement018(root);new vm.Script('('+adapter.adapted+')');assert(adapter.proof.sourceReversible&&adapter.proof.originalSixFieldValidatorExact&&adapter.proof.maximumNativeRecords===80);
const old=n=>Array.from({length:n},(_,i)=>({d:0,tool:'museum',x:i%70,y:Math.floor(i/70),k:274,cost:2400+i})),ids=['lifeboatHeritageHall018','canalTollhouseExhibit018','manorStableCourt014'];let positives=0;const rejected=[];
for(const id of ids)for(const n of[0,1,78,79,80]){
 const quote={tool:id,x:63,y:64,cost:1250},before=old(n),added={d:1,tool:id,x:63,y:64,cost:1250,k:287},after=[...before,added].slice(-80),raw=JSON.stringify({before,after});
 assert.deepEqual(delta(before,after,id,quote,1),[added]);assert.equal(JSON.stringify({before,after}),raw);assert(waterfrontCapital018(id,quote,delta(before,after,id,quote,1),1));positives++;
 // The original length-based observation loses the genuine record at capacity.
 if(n===80){assert.deepEqual(after.slice(before.length),[]);assert.equal(delta(before,after,id,quote,1).length,1);}
}
const base={before:old(80),after:[...old(80).slice(1),{d:1,tool:ids[0],x:63,y:64,cost:1250,k:287}],id:ids[0],quote:{tool:ids[0],x:63,y:64,cost:1250},day:1};
function reject(name,mutate){const q=structuredClone(base);mutate(q);const raw=JSON.stringify(q);assert.throws(()=>delta(q.before,q.after,q.id,q.quote,q.day),undefined,name);assert.equal(JSON.stringify(q),raw,'rejection must not mutate: '+name);rejected.push(name);}
for(const[name,edit]of[
 ['absent before',q=>q.before=null],['absent after',q=>q.after=null],['oversized old window',q=>q.before.push(q.before[0])],['missing append',q=>q.after=q.before],['extra append',q=>q.after.push({...q.after.at(-1),x:64})],['drop extra prior row',q=>q.after.shift()],['rewrite surviving prior cost',q=>q.after[0].cost++],['reorder old rows',q=>[q.after[0],q.after[1]]=[q.after[1],q.after[0]]],['drop newest row',q=>q.after.pop()],['wrong tool',q=>q.after.at(-1).tool=ids[1]],['wrong kind',q=>q.after.at(-1).k=286],['wrong day',q=>q.after.at(-1).d++],['wrong x',q=>q.after.at(-1).x++],['wrong y',q=>q.after.at(-1).y++],['wrong cost',q=>q.after.at(-1).cost++],['missing field',q=>delete q.after.at(-1).k],['extra field',q=>q.after.at(-1).extra=true],['wrong quote tool',q=>q.quote.tool=ids[1]],['negative quote',q=>q.quote.cost=-1250],['invalid day',q=>q.day=1.5],['unknown alias',q=>q.id='unknown'],['extra prior-row field',q=>q.after[0].extra=true]
])reject(name,edit);
// Every retained slot matters, not only the first/last rows of a full window.
for(let n=0;n<79;n++)reject('mutated retained row '+n,q=>q.after[n].cost++);
const shortBefore=old(2),added=base.after.at(-1);assert.throws(()=>delta(shortBefore,[shortBefore[1],added],base.id,base.quote,1));rejected.push('non-full window cannot silently drop a prior row');
const source=fs.readFileSync(path.join(__dirname,'waterfront-public-gameplay018.js'),'utf8');assert(source.includes('report.waterfrontCapitalAdapter=placementAdapter.proof'));assert(source.includes("file==='waterfront-gameplay018.js'&&f.name==='setupWaterfront018'?placementAdapter.adapted:f.toString()"));assert(source.includes('V.validPlacement018(p)'));assert(!/GV\.fiscalReset515|GV\.fiscalLoadState515/.test(source));
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,filesWritten:false,positives,rejectedCount:rejected.length,sourceReversible:true,originalSixFieldPredicateExact:true,originalBoundedWindow:80,originalFullWindowSliceFailureReproduced:true}));
