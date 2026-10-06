#!/usr/bin/env node
'use strict';
// In-memory source/data mutations only; never starts the game or changes files.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,contract=require('./streetscape-release-contract015');
const CARD='docs/T728-british-streetscape.md',OLD_CARD='docs/branch/GPT-015-british-streetscape.md';
const sources=Object.fromEntries(['index.html','fp.json','AUTORUN-LOG.md',CARD,'streetscape-release-pins015.json'].map(p=>[p,fs.readFileSync(path.join(ROOT,p))]));
const baseline=Object.fromEntries(['fp.json','AUTORUN-LOG.md'].map(p=>[p,execFileSync('git',['show',contract.BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024})]));
const source=fs.readFileSync(path.join(ROOT,'streetscape-release-contract015.js'),'utf8');
function load(files=sources,base=baseline){
 const module={exports:{}},key=p=>path.relative(ROOT,p),reader={readFileSync(p,encoding){const b=files[key(p)];if(!b)throw Error('Missing fixture: '+p);return encoding?b.toString(encoding):b;},existsSync(p){return Object.hasOwn(files,key(p));}};
 const child={execFileSync(cmd,args){assert.equal(cmd,'git');assert.equal(args[0],'show');const prefix=contract.BASE+':';assert(args[1].startsWith(prefix));const b=base[args[1].slice(prefix.length)];assert(b);return b;}};
 // Compile the unchanged module with data-only filesystem/git views; all other
 // imports are its original data aggregation and standard library functions.
 const customRequire=id=>id==='fs'?reader:id==='child_process'?child:require(id);
 const run=vm.runInThisContext('(function(require,module,exports,__dirname){'+source+'\n})',{filename:'streetscape-release-contract015.data-fixture.js'});
 run(customRequire,module,module.exports,ROOT);return module.exports;
}
const copy=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,Buffer.from(v)]));
const replace=(files,p,from,to)=>{const s=files[p].toString();assert(s.includes(from),p+': fixture text absent '+from);files[p]=Buffer.from(s.replace(from,to));};
const mutateJSON=(files,p,change)=>{const q=JSON.parse(files[p]);change(q);files[p]=Buffer.from(JSON.stringify(q));};
const rejected=[];
function reject(name,mutate){const files=copy(sources),base=copy(baseline);mutate(files,base);assert.throws(()=>load(files,base).verifyRelease015(),undefined,name);rejected.push(name);}
const positive=load().verifyRelease015();assert.equal(positive.normalizedHTMLSHA256,contract.APPROVED);assert.equal(positive.releaseBaseline.stats.leaves,3091);assert.equal(positive.releaseBaseline.stats.families,161);
for(const value of['2026-10-06T09:40:39Z','2026-10-06T09:36:00.000Z','2026-10-06T09:40:39.123456789Z'])assert.equal(contract.validReleaseDate015(value),true,value);
for(const value of[null,0,'','2026-10-05','2026-10-06T09:35:59Z','2026-10-06T09:40:39+00:00','2026-10-05T24:00:00Z','2026-02-30T17:02:39Z','2026-10-05T17:02:60Z'])assert.equal(contract.validReleaseDate015(value),false,String(value));
reject('product whitespace outside three labels',f=>f['index.html']=Buffer.concat([f['index.html'],Buffer.from('\n')]));
reject('game version not released',f=>replace(f,'index.html',"const GAME_VER='14.32'","const GAME_VER='14.31'"));
reject('anchor not released',f=>replace(f,'index.html',"const GAME_ANCHOR='T728'","const GAME_ANCHOR='T727'"));
reject('visible version not released',f=>replace(f,'index.html','id="startVersion456">v14.32 · T728','id="startVersion456">v14.31 · T727'));
reject('duplicate release version',f=>f['index.html']=Buffer.concat([f['index.html'],Buffer.from("const GAME_VER='14.32'")]));
reject('pin formatting or bytes changed',f=>f['streetscape-release-pins015.json']=Buffer.concat([f['streetscape-release-pins015.json'],Buffer.from('\n')]));
reject('pin approved source changed',f=>mutateJSON(f,'streetscape-release-pins015.json',q=>q.nativeSourceSHA256='0'.repeat(64)));
reject('pin approved head changed',f=>mutateJSON(f,'streetscape-release-pins015.json',q=>q.nativeCheckedSHA='0'.repeat(40)));
reject('immutable baseline fingerprint changed',(f,b)=>b['fp.json']=Buffer.concat([b['fp.json'],Buffer.from('\n')]));
const oldLeaf=Object.keys(JSON.parse(baseline['fp.json']).subs)[0],newLeaf=contract.expected[0];
for(const [name,change]of[
 ['prior complete leaf changed',q=>q.subs[oldLeaf].op++],['approved new day CRC changed',q=>q.subs[newLeaf].d='00000000'],['approved new night CRC changed',q=>q.subs[newLeaf].n='00000000'],['approved new geometry changed',q=>q.subs[newLeaf].w++],['old leaf missing',q=>delete q.subs[oldLeaf]],['new leaf missing',q=>delete q.subs[newLeaf]],['extra leaf',q=>q.subs['streetscape015.extra_0']={...q.subs[newLeaf]}],['prior family changed',q=>q.families.grass.op++],['new family changed',q=>q.families.streetscape015.op++],['family count changed',q=>q.stats.families++],['night count changed',q=>q.stats.nightNonEmpty++],['block aggregate changed',q=>q.blocks.fam+='x'],['block count changed',q=>q.blocks.count--],['unrelated baseline field inserted',q=>q.unapproved=true],['required baseline field removed',q=>delete q.blocks],['fingerprint wrong version',q=>q.version='14.31'],['fingerprint wrong anchor',q=>q.anchor='T727'],['fingerprint before approval',q=>q.generatedAt='2026-10-06T09:35:59Z'],['fingerprint invalid normalized date',q=>q.generatedAt='2026-10-05T24:00:00Z']])reject(name,f=>mutateJSON(f,'fp.json',change));
reject('sorted new theme insertion order changes native CRC',f=>mutateJSON(f,'fp.json',q=>{const keys=new Set(contract.expected),old=Object.fromEntries(Object.entries(q.subs).filter(([k])=>!keys.has(k)));for(const key of [...keys].sort())old[key]=q.subs[key];q.subs=old;}));
const entry=positive.releaseLogEntry;
reject('historical log rewritten',f=>replace(f,'AUTORUN-LOG.md','## r174','## altered r174'));
reject('release entry absent',f=>replace(f,'AUTORUN-LOG.md',entry,''));
reject('release entry duplicated',f=>f['AUTORUN-LOG.md']=Buffer.concat([f['AUTORUN-LOG.md'],Buffer.from(entry)]));
reject('unbounded log append',f=>f['AUTORUN-LOG.md']=Buffer.concat([f['AUTORUN-LOG.md'],Buffer.from('\nunapproved\n')]));
for(const [name,from,to]of[['release log wrong branch','gpt/british-streetscape-015','gpt/unapproved-streetscape-015'],['release log wrong round','r175','r176'],['release log wrong approval',contract.APPROVED_AT,'2026-10-06 09:34 UTC']])reject(name,f=>replace(f,'AUTORUN-LOG.md',entry,entry.replaceAll(from,to)));
reject('old card retained beside renamed card',f=>f[OLD_CARD]=Buffer.from('duplicate'));
reject('release card heading changed',f=>replace(f,CARD,'# T728 —','# T729 —'));
reject('original pre-code scope rewritten',f=>replace(f,CARD,'## Authorization and immutable starting point','## Rewritten scope and authority'));
reject('original implementation failure removed',f=>replace(f,CARD,'## Work record','## Erased failure'));
reject('release card append absent',f=>f[CARD]=Buffer.from(f[CARD].toString().split('\n\n## Publication approval and T728 preparation')[0]));
reject('release card append duplicated',f=>f[CARD]=Buffer.concat([f[CARD],Buffer.from('\n\n## Publication approval and T728 preparation')]));
for(const [name,from,to]of[['release card wrong approval',contract.APPROVED_AT,'2026-10-06 09:34 UTC'],['release card wrong image head',contract.APPROVED_SHA,'0'.repeat(40)],['release card missing full run','37439964454','37439964400'],['release card wrong branch','gpt/british-streetscape-015','gpt/unapproved-streetscape-015']])reject(name,f=>{const marker='\n\n## Publication approval and T728 preparation',[a,b]=f[CARD].toString().split(marker);f[CARD]=Buffer.from(a+marker+b.replaceAll(from,to));});
// These provenance fixtures test only synthetic metadata. They do not claim a
// fresh native run; --native below independently checks every approved record.
const currentHead=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
const currentSourceSHA256=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,'index.html'))).digest('hex');
function verifyNativeProvenance(native,env=process.env){
 if(env.GITHUB_ACTIONS==='true')assert.equal(currentHead,env.GITHUB_SHA,'Actions checkout must be the exact workflow head');
 if(native.checkedSHA===contract.APPROVED_SHA&&native.sourceSHA256===contract.APPROVED&&native.version==='14.31'&&native.anchor==='T727'&&native.release===false)return 'approved-candidate';
 const release=contract.verifyRelease015();
 assert.equal(release.release,true);assert.equal(release.version,'14.32');assert.equal(release.anchor,'T728');
 assert.equal(native.checkedSHA,currentHead,'Release native evidence must match the current checkout');
 assert.equal(native.sourceSHA256,currentSourceSHA256,'Release native evidence must match the actual release product');
 assert.equal(native.version,release.version);assert.equal(native.anchor,release.anchor);assert.equal(native.release,true);
 return 'current-release';
}
const candidateMetadata={checkedSHA:contract.APPROVED_SHA,sourceSHA256:contract.APPROVED,version:'14.31',anchor:'T727',release:false};
const releaseMetadata={checkedSHA:currentHead,sourceSHA256:currentSourceSHA256,version:'14.32',anchor:'T728',release:true};
const syntheticProvenance={metadataOnly:true,nativeRunClaimed:false,positiveCases:0,rejected:[]};
for(const[metadata,kind]of[[candidateMetadata,'approved-candidate'],[releaseMetadata,'current-release']]){
 assert.equal(verifyNativeProvenance(metadata,{}),kind);syntheticProvenance.positiveCases++;
 assert.equal(verifyNativeProvenance(metadata,{GITHUB_ACTIONS:'true',GITHUB_SHA:currentHead}),kind);syntheticProvenance.positiveCases++;
 for(const[field,value]of[['checkedSHA','0'.repeat(40)],['sourceSHA256','0'.repeat(64)],['version','14.33'],['anchor','T729'],['release',!metadata.release]]){
  const name=kind+' synthetic wrong '+field;assert.throws(()=>verifyNativeProvenance({...metadata,[field]:value},{}),undefined,name);syntheticProvenance.rejected.push(name);
 }
 for(const sha of['0'.repeat(40),undefined]){
  const name=kind+' synthetic Actions '+(sha?'wrong':'missing')+' workflow SHA';assert.throws(()=>verifyNativeProvenance(metadata,{GITHUB_ACTIONS:'true',GITHUB_SHA:sha}),undefined,name);syntheticProvenance.rejected.push(name);
 }
}
let nativeCases=0,nativeProvenance=null;
if(process.argv.length>2){
 assert.equal(process.argv[2],'--native');assert.equal(process.argv.length,4);const native=JSON.parse(fs.readFileSync(process.argv[3]));nativeProvenance=verifyNativeProvenance(native);contract.verifyApprovedNative015(native.fp,native.blocks);
 const block=Object.keys(native.blocks.entries)[0];
 for(const key of contract.expected){const q=structuredClone(native);q.fp.subs[key].d=q.fp.subs[key].d==='00000000'?'ffffffff':'00000000';Object.assign(q.fp,require('./streetlife-fingerprint-qa009').aggregate(q.fp.subs));const name='native approved new full record with rebuilt aggregate '+key;assert.throws(()=>contract.verifyApprovedNative015(q.fp,q.blocks),undefined,name);rejected.push(name);nativeCases++;}
 for(const[name,change]of[['native old full record',q=>q.fp.subs[oldLeaf].op++],['native approved new record',q=>q.fp.subs[newLeaf].op++],['native missing leaf',q=>delete q.fp.subs[newLeaf]],['native full family',q=>q.fp.families.bld.crc='00000000'],['native stats',q=>q.fp.stats.nightNonEmpty++],['native fp status',q=>q.fp.ok=false],['native extra top-level field',q=>q.fp.extra=true],['native invalid true-like status',q=>q.fp.ok=1],['native complete block',q=>q.blocks.entries[block]={...q.blocks.entries[block],d:'00000000'}],['native missing block',q=>delete q.blocks.entries[block]],['native extra block',q=>q.blocks.entries.extra=q.blocks.entries[block]],['native block status',q=>q.blocks.ok=false]]){const q=structuredClone(native);change(q);assert.throws(()=>contract.verifyApprovedNative015(q.fp,q.blocks),undefined,name);rejected.push(name);nativeCases++;}
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,filesWritten:false,release:{version:positive.version,anchor:positive.anchor,oldLeaves:positive.oldLeaves,newLeaves:positive.newLeaves,oldBlocks:positive.oldBlocks,approvedSHA:positive.approvedSHA,normalizedHTMLSHA256:positive.normalizedHTMLSHA256},positiveCases:1+(nativeCases?1:0),dateCases:12,syntheticProvenance,nativeProvenance,nativeNegativeCases:nativeCases,rejectedCount:rejected.length,rejected},null,2));
