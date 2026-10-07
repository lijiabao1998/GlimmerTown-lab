'use strict';
// Observer-only bounded-window accounting. Never changes native ledger/state.
const fs=require('node:fs'),path=require('node:path'),{hash,pins018}=require('./waterfront-public-contract018');
const {waterfrontCapital018}=require('./waterfront-gameplay018');
function waterfrontPublicCapitalDelta018(before,after,id,quote,day){
 if(!Array.isArray(before)||!Array.isArray(after)||before.length>80||after.length!==Math.min(before.length+1,80))throw Error('Exactly one native capital append within the original80-record window required');
 const added=after.slice(-1);
 if(!waterfrontCapital018(id,quote,added,day)||JSON.stringify(before)===JSON.stringify(after)||JSON.stringify(after)!==JSON.stringify([...before,...added].slice(-80)))throw Error('Native capital append must retain every surviving prior record and the exact new six-field transaction');
 return added;
}
function buildPlacement018(root){
 const file=path.join(root,'waterfront-gameplay018.js'),bytes=fs.readFileSync(file),native=require(file),matches=native.functions018.filter(f=>f.name==='setupWaterfront018');if(matches.length!==1)throw Error('Exactly one original native placement helper required');const original=matches[0].toString();
 if(hash(bytes)!==pins018.dependencies['waterfront-gameplay018.js']||bytes.toString().split(original).length!==2||native.waterfrontCapital018.toString()!==waterfrontCapital018.toString())throw Error('Exact approved native placement and six-field validator sources required');
 const edits=[['ledger=GV.fiscal515().capitalLedger.length','ledger=GV.fiscal515().capitalLedger',1],['capital:capital.slice(ledger),capitalExact:waterfrontCapital018(r.id,quote,capital.slice(ledger),GV.stats().day)','capital:waterfrontPublicCapitalDelta018(ledger,capital,r.id,quote,GV.stats().day),capitalBefore:ledger,capitalAfter:capital,capitalExact:waterfrontCapital018(r.id,quote,waterfrontPublicCapitalDelta018(ledger,capital,r.id,quote,GV.stats().day),GV.stats().day)',1]];
 let adapted=original;for(const[from,to,count]of edits){if(adapted.split(from).length!==count+1)throw Error('Unique declared placement observer edit required');adapted=adapted.split(from).join(to);}let restored=adapted;for(const[from,to,count]of [...edits].reverse()){if(restored.split(to).length!==count+1)throw Error('Placement observer reversal ambiguous');restored=restored.split(to).join(from);}if(restored!==original)throw Error('Placement observer changed beyond bounded capital read');
 return{original,adapted,proof:{originalSHA256:hash(original),adaptedSHA256:hash(adapted),productHelperSHA256:hash(bytes),helperSourceUnchanged:true,originalSixFieldValidatorExact:true,sourceReversible:true,maximumNativeRecords:80,edits:edits.map(([from,to,count])=>({from,to,count})),purpose:'Observe exact native before/after ledger windows; do not reset, modify or fabricate capital records.'}};
}
module.exports={waterfrontPublicCapitalDelta018,buildPlacement018};
