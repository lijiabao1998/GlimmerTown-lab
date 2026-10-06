'use strict';
// Source and data only. Importing this contract cannot launch or evaluate a game.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),{isDeepStrictEqual:equal}=require('node:util');
const old=require('./retained014/complexes-public-contract014');
const {OFFICIAL,hash,canonical,range,gitFile,fixtureSource013,complexFixtureSource014,verifyCatalog013,verifyComplexCatalog014}=old;
const read=(root,file)=>fs.readFileSync(path.join(root,file));
const SOURCE_PINS_SHA256='823cabb3fc50e3e37f81f9d4a08e759dc6f0ee13444bc8d5750177864dc5b1a4';
const bytes=read(__dirname,'streetscape-public-source-pins015.json');
if(hash(bytes)!==SOURCE_PINS_SHA256)throw Error('Approved 015 observer source and full native data pins changed');
const pins015=JSON.parse(bytes),BASE=pins015.base,APPROVED=pins015.approvedSHA,expectedAdditions=pins015.expectedAdditions;
for(const [file,pin]of Object.entries(pins015.retainedObserverFiles))if(hash(read(__dirname,file))!==pin)throw Error('Historical T727 observer changed: '+file);
if(hash(read(__dirname,'console-source-observer015.js'))!==pins015.consoleSourceObserverSHA256)throw Error('Raw source attribution observer changed');
// The copied predicates retain every threshold. Only their literal release
// version and their two module names change; reverse those edits byte-for-byte.
for(const kind of ['state','extra']){
 const current=read(__dirname,'streetscape-public-'+kind+'015.js').toString();
 const reversed=current.replaceAll("'14.32'","'14.31'").replaceAll("'./streetscape-public-state015'","'./complexes-public-state014'").replaceAll("'./streetscape-public-contract015'","'./complexes-public-contract014'");
 if(reversed!==read(__dirname,'retained014/complexes-public-'+kind+'014.js').toString())throw Error('Historical predicate changed beyond reversible release adapter: '+kind);
}
function normalizeRelease013(bytes){let s=bytes.toString('utf8');for(const[from,to]of[["const GAME_VER='14.32'","const GAME_VER='14.31'"],["const GAME_ANCHOR='T728'","const GAME_ANCHOR='T727'"],['id="startVersion456">v14.32 · T728','id="startVersion456">v14.31 · T727']]){if(s.split(from).length!==2)throw Error('Unique exact T728 release label required: '+from);s=s.replace(from,to);}return Buffer.from(s);}
function expectedReleaseHTML(root){const approved=gitFile(root,APPROVED,'index.html');if(hash(approved)!==pins015.approvedSourceSHA256)throw Error('Exact approved R2 image candidate required');let s=approved.toString();for(const[a,b]of[["const GAME_VER='14.31'","const GAME_VER='14.32'"],["const GAME_ANCHOR='T727'","const GAME_ANCHOR='T728'"],['id="startVersion456">v14.31 · T727','id="startVersion456">v14.32 · T728']]){if(s.split(a).length!==2)throw Error('Unique approved candidate label required');s=s.replace(a,b);}return Buffer.from(s);}
function verifyPins013(p){
 if(p?.officialURL!==OFFICIAL||p.release!=='T728'||p.version!=='14.32'||p.approvedSHA!==APPROVED||p.approvedSourceSHA256!==pins015.approvedSourceSHA256||!/^([0-9a-f]{40})$/.test(p.releaseSHA||'')||!/^([0-9a-f]{40})$/.test(p.releaseTree||'')||!/^([0-9a-f]{64})$/.test(p.sourceSHA256||'')||!/^([0-9a-f]{64})$/.test(p.fingerprintSHA256||'')||p.sourceSHA256!==pins015.expectedReleaseSourceSHA256||p.fingerprintSHA256!==pins015.expectedReleaseBaselineSHA256||typeof p.releaseSubject!=='string'||!/^T728\b/.test(p.releaseSubject)||!p.releaseSubject.includes('14.32'))throw Error('Final exact T728 deployment receipt required; placeholders are not executable');
 return p;
}
function readReleasePins(){return verifyPins013(JSON.parse(read(__dirname,'streetscape-public-release015.json')));}
// Keep these names for the inherited 63-gate runner; their 015 implementations
// are stricter about complete current records and exact current source.
function verifyApprovedRecords013(fp,blocks){
 if(fp?.ok!==true||!equal(Object.keys(fp).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3091||!equal(fp.stats,pins015.stats)||hash(canonical(fp.subs))!==pins015.nativeFullSubsSHA256||hash(canonical(fp.families))!==pins015.nativeFullFamiliesSHA256)throw Error('All 3091 approved complete records and all 161 family aggregates must match');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==pins015.nativeBlocksSHA256)throw Error('All 1728 complete approved block records must match');
 return true;
}
function verifyRelease013(root,expected,expectedHTML){
 const pins=readReleasePins();if(expected!==pins.releaseSHA||expectedHTML!==pins.sourceSHA256)throw Error('Caller must match exact immutable post-deployment receipt');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),tree=execFileSync('git',['rev-parse','HEAD^{tree}'],{cwd:root,encoding:'utf8'}).trim(),subject=execFileSync('git',['log','-1','--format=%s'],{cwd:root,encoding:'utf8'}).trim();
 if(head!==expected||tree!==pins.releaseTree||subject!==pins.releaseSubject)throw Error('Exact final main commit, tree and subject required');
 const current=read(root,'index.html'),approved=gitFile(root,APPROVED,'index.html');
 if(hash(current)!==pins.sourceSHA256||!expectedReleaseHTML(root).equals(current)||!normalizeRelease013(current).equals(approved))throw Error('Release changed approved image product beyond exactly three labels');
 for(const[file,pin]of Object.entries(pins015.dependencies))if(hash(read(root,file))!==pin)throw Error('Exact approved product/observer dependency changed: '+file);
 const fpBytes=read(root,'fp.json'),fp=JSON.parse(fpBytes),baseBytes=gitFile(root,BASE,'fp.json'),base=JSON.parse(baseBytes);
 if(hash(fpBytes)!==pins.fingerprintSHA256||fp.version!=='14.32'||fp.anchor!=='T728'||Object.keys(fp.subs||{}).length!==3091||hash(canonical(fp.subs))!==pins015.nativeFullSubsSHA256||hash(canonical(fp.families))!==pins015.nativeFullFamiliesSHA256||!equal(fp.stats,pins015.stats))throw Error('Complete promoted 3091-leaf release fingerprint required');
 const projection=Object.fromEntries(Object.entries(fp.subs).filter(([k])=>!expectedAdditions.includes(k)));
 if(hash(baseBytes)!==pins015.baseFingerprintSHA256||!equal(projection,base.subs)||!equal(fp.blocks,base.blocks))throw Error('All 3059 prior complete leaves and prior blocks must remain exact');
 const cold=JSON.parse(gitFile(root,BASE,'coldload-patch011.json'));if(current.toString().split(cold.to).length!==2)throw Error('Exact T724 successful-load topology invalidation required');
 const fixtures=fixtureSource013(root),complexFixtures=complexFixtureSource014(root);
 return{ok:true,release:true,version:'14.32',anchor:'T728',checkedSHA:head,tree,subject,approvedSHA:APPROVED,sourceSHA256:hash(current),approvedSourceSHA256:pins015.approvedSourceSHA256,htmlExact:true,dependenciesExact:true,fixtureBodiesExact:true,fixtureSHA256:hash(fixtures),complexFixtureSHA256:hash(complexFixtures),base:BASE,releaseBaselineSHA256:hash(fpBytes),coldLoadFixExact:true};
}
function verifyPublicFingerprint013(root,fp,blocks){
 verifyApprovedRecords013(fp,blocks);const tracked=JSON.parse(read(root,'fp.json')),pins=readReleasePins();
 const {aggregate}=require(path.join(root,'streetlife-fingerprint-qa009.js')),computed=aggregate(fp.subs);
 if(!equal(computed.families,fp.families)||!equal(computed.stats,fp.stats)||hash(read(root,'fp.json'))!==pins.fingerprintSHA256||tracked.version!=='14.32'||tracked.anchor!=='T728'||!equal(fp.subs,tracked.subs)||!equal(fp.families,tracked.families)||!equal(fp.stats,tracked.stats)||!equal({fam:blocks.fam,count:blocks.count},tracked.blocks))throw Error('Live full records/independent aggregates differ from exact T728 promotion');
 return{ok:true,release:true,version:'14.32',anchor:'T728',base:BASE,oldLeaves:3059,newLeaves:32,leaves:3091,oldFamilies:160,currentFamilies:161,oldBlocks:1728,oldCompleteRecordsExact:true,blocksExact:true,completeBlocksExact:true,promotedNativeRecordsExact:true,releaseBaselineSHA256:pins.fingerprintSHA256,approvedFingerprintSHA256:pins015.approvedFingerprintSHA256,added:expectedAdditions};
}
const sourcePins={...old.sourcePins,...pins015,get expectedReleaseSubject(){return readReleasePins().releaseSubject;}};
module.exports={OFFICIAL,BASE,APPROVED,hash,canonical,range,gitFile,pins015,sourcePins,expectedAdditions,expectedReleaseHTML,normalizeRelease013,verifyPins013,readReleasePins,verifyRelease013,verifyApprovedRecords013,verifyPublicFingerprint013,fixtureSource013,complexFixtureSource014,verifyCatalog013,verifyComplexCatalog014};
