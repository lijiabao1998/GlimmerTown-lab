'use strict';
// Source/data-only contract: importing this file cannot evaluate game code.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),{isDeepStrictEqual:equal}=require('node:util');
const OFFICIAL='https://lijiabao1998.github.io/GlimmerTown-lab/';
const APPROVED='509e3b0ebbeefc2c92efb24fef4abbeaf6bdfc85',BASE='10bc4115f119498b4cc5836695348982b85fa9d1';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const read=(root,file)=>fs.readFileSync(path.join(root,file));
const gitFile=(root,rev,file)=>execFileSync('git',['show',rev+':'+file],{cwd:root,maxBuffer:32*1024*1024});
const SOURCE_PINS_SHA256='f7ea6a6cbf5773e535e727040311f98e079c4542597da5e11b9928eba1726c63',sourcePinBytes=read(__dirname,'complexes-public-source-pins014.json');
if(hash(sourcePinBytes)!==SOURCE_PINS_SHA256)throw Error('Approved observer source and data pin bytes changed');
const sourcePins=JSON.parse(sourcePinBytes);
if(hash(read(__dirname,'complexes-public-log014.js'))!==sourcePins.inheritedClassifierSHA256)throw Error('Inherited narrow raw-log classifier changed');
const expectedAdditions=[...sourcePins.complexCatalog.buildings.flatMap(q=>[0,1,2,3].map(v=>`bld.${q.k}_1_${v}`)),...sourcePins.complexCatalog.paths.flatMap(q=>[0,1,2,3].map(v=>`complexes014.${q.theme}_${v}`))].sort();
function range(text,start,end){const a=text.indexOf(start),b=text.indexOf(end,a);if(a<0||b<=a||text.indexOf(start,a+1)>=0)throw Error('Unique source boundaries required: '+start);return text.slice(a,b);}
function normalizeRelease013(bytes){let s=bytes.toString('utf8');for(const [from,to]of[["const GAME_VER='14.31'","const GAME_VER='14.30'"],["const GAME_ANCHOR='T727'","const GAME_ANCHOR='T726'"],['id="startVersion456">v14.31 · T727','id="startVersion456">v14.30 · T726']]){if(s.split(from).length!==2)throw Error('Unique release label required: '+from);s=s.replace(from,to);}return Buffer.from(s);}
function fixtureSource013(root){return sourcePins.ranges.map(([file,start,end,pin])=>{const body=range(read(root,file).toString(),start,end);if(hash(body)!==pin)throw Error('Exact approved fixture body changed: '+file+' '+start);return body;}).join('\n');}
function verifyPins013(p){
 if(p?.officialURL!==OFFICIAL||p.release!=='T727'||p.version!=='14.31'||!/^[0-9a-f]{40}$/.test(p.releaseSHA||'')||
  p.releaseSubject!==sourcePins.expectedReleaseSubject||p.sourceSHA256!==sourcePins.expectedReleaseSourceSHA256||p.fingerprintSHA256!==sourcePins.expectedReleaseBaselineSHA256)throw Error('Exact final deployment pins must be supplied after successful T727 Pages publication');
 return p;
}
function verifyRelease013(root,expected,expectedHTML){
 const pins=verifyPins013(JSON.parse(read(__dirname,'complexes-public-release014.json')));
 if(expected!==pins.releaseSHA||expectedHTML!==pins.sourceSHA256)throw Error('Caller release SHA/source hash must match the immutable parent-approved deployment receipt');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();if(head!==expected)throw Error('Exact deployment checkout SHA required');
 const subject=execFileSync('git',['log','-1','--format=%s'],{cwd:root,encoding:'utf8'}).trim();verifyReleaseTitle014(subject);
 const approved=gitFile(root,APPROVED,'index.html'),current=read(root,'index.html');
 if(sourcePins.approvedSHA!==APPROVED||hash(approved)!==sourcePins.approvedSourceSHA256||hash(current)!==pins.sourceSHA256||!normalizeRelease013(current).equals(approved))throw Error('Release changed image-approved four-complex product beyond three labels');
 for(const [file,pin]of Object.entries(sourcePins.dependencies))if(hash(read(root,file))!==pin)throw Error('Pinned observer dependency changed: '+file);
 const fixtures=fixtureSource013(root),complexFixtures=complexFixtureSource014(root),fpBytes=read(root,'fp.json'),fp=JSON.parse(fpBytes);
 if(hash(fpBytes)!==pins.fingerprintSHA256||fp.version!=='14.31'||fp.anchor!=='T727'||hash(canonical(fp.subs))!==sourcePins.nativeFullSubsSHA256||hash(canonical(fp.families))!==sourcePins.nativeFullFamiliesSHA256||!equal(fp.stats,sourcePins.stats))throw Error('T727 promoted complete fingerprint differs from approved evidence');
 const base=JSON.parse(gitFile(root,BASE,'fp.json')),projected={};
 for(const [k,v]of Object.entries(fp.subs))if(!expectedAdditions.includes(k))projected[k]=v;
 if(hash(gitFile(root,BASE,'fp.json'))!=='e6c272866c19a00f0986bf7abfc231454499e1d23eee0cb813f6099f11a7b3fb'||!equal(projected,base.subs)||!equal(fp.blocks,base.blocks))throw Error('T726 old complete leaves/blocks must remain exact');
 return{ok:true,release:true,version:'14.31',anchor:'T727',checkedSHA:head,subject,approvedSHA:APPROVED,sourceSHA256:hash(current),approvedSourceSHA256:sourcePins.approvedSourceSHA256,htmlExact:true,dependenciesExact:true,fixtureBodiesExact:true,fixtureSHA256:hash(fixtures),complexFixtureSHA256:hash(complexFixtures),base:BASE,releaseBaselineSHA256:hash(fpBytes)};
}
function verifyApprovedRecords013(fp,blocks){
 if(!fp?.ok||Object.keys(fp.subs||{}).length!==3059||!equal(fp.stats,sourcePins.stats)||hash(canonical(fp.subs))!==sourcePins.nativeFullSubsSHA256||hash(canonical(fp.families))!==sourcePins.nativeFullFamiliesSHA256)throw Error('All 3059 approved complete native records and aggregates must match');
 if(!blocks?.ok||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==sourcePins.nativeBlocksSHA256)throw Error('All 1728 complete approved native block records must match');
 return true;
}
function verifyPublicFingerprint013(root,fp,blocks){
 verifyApprovedRecords013(fp,blocks);const tracked=JSON.parse(read(root,'fp.json')),pins=verifyPins013(JSON.parse(read(__dirname,'complexes-public-release014.json')));
 if(hash(read(root,'fp.json'))!==pins.fingerprintSHA256||tracked.version!=='14.31'||tracked.anchor!=='T727'||!equal(fp.subs,tracked.subs)||!equal(fp.families,tracked.families)||!equal(fp.stats,tracked.stats)||!equal({fam:blocks.fam,count:blocks.count},tracked.blocks))throw Error('Live complete fingerprint differs from exact T727 promotion');
 return{ok:true,release:true,version:'14.31',anchor:'T727',base:BASE,oldLeaves:2947,newLeaves:112,leaves:3059,oldFamilies:159,currentFamilies:160,oldBlocks:1728,oldCompleteRecordsExact:true,blocksExact:true,completeBlocksExact:true,promotedNativeRecordsExact:true,releaseBaselineSHA256:pins.fingerprintSHA256,approvedFingerprintSHA256:sourcePins.approvedFingerprintSHA256,added:expectedAdditions};
}
function verifyCatalog013(specs){return equal(specs,sourcePins.catalog);}
module.exports={OFFICIAL,APPROVED,BASE,sourcePins,expectedAdditions,hash,canonical,read,gitFile,range,normalizeRelease013,fixtureSource013,verifyPins013,verifyRelease013,verifyApprovedRecords013,verifyPublicFingerprint013,verifyCatalog013};

function complexFixtureSource014(root){return fixtureSource013(root)+"\n"+sourcePins.complexRanges.map(([file,start,end,pin])=>{const body=range(read(root,file).toString(),start,end);if(hash(body)!==pin)throw Error("Exact approved complex fixture changed: "+start);return body;}).join("\n");}
function verifyComplexCatalog014(specs){return equal(specs,sourcePins.complexCatalog);}
Object.assign(module.exports,{complexFixtureSource014,verifyComplexCatalog014});

function verifyReleaseTitle014(title){if(title!==sourcePins.expectedReleaseSubject)throw Error('Exact verified T727 merge subject required');return true;}
module.exports.verifyReleaseTitle014=verifyReleaseTitle014;
