'use strict';
// Source and data only. Importing this contract cannot launch or evaluate a game.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),{isDeepStrictEqual:equal}=require('node:util');
const old=require('./retained015/streetscape-public-contract015');
const {OFFICIAL,hash,canonical,range,gitFile,fixtureSource013,complexFixtureSource014,verifyCatalog013,verifyComplexCatalog014}=old;
const read=(root,file)=>fs.readFileSync(path.join(root,file));
const SOURCE_PINS_SHA256='1e034bd31c2db59362a5ef4c1524d1bc6a38acc42a0c01c11a4f2f7f64c4745a';
const bytes=read(__dirname,'gardenlife-public-source-pins016.json');
if(hash(bytes)!==SOURCE_PINS_SHA256)throw Error('Approved 016 observer source and full native data pins changed');
const pins016=JSON.parse(bytes),BASE=pins016.base,APPROVED=pins016.approvedSHA,expectedAdditions=pins016.expectedAdditions;
for(const [file,pin]of Object.entries(pins016.retainedObserverFiles))if(hash(read(__dirname,file))!==pin)throw Error('Historical T728 observer changed: '+file);
if(hash(read(__dirname,'console-source-observer015.js'))!==pins016.consoleSourceObserverSHA256)throw Error('Raw source attribution observer changed');
// Exact prior predicates and all 94 runtime gates are checked by the source QA.
function normalizeRelease013(bytes){let s=bytes.toString('utf8');for(const[from,to]of[["const GAME_VER='14.33'","const GAME_VER='14.32'"],["const GAME_ANCHOR='T729'","const GAME_ANCHOR='T728'"],['id="startVersion456">v14.33 · T729','id="startVersion456">v14.32 · T728']]){if(s.split(from).length!==2)throw Error('Unique exact T729 release label required: '+from);s=s.replace(from,to);}return Buffer.from(s);}
function expectedReleaseHTML(root){const approved=gitFile(root,APPROVED,'index.html');if(hash(approved)!==pins016.approvedSourceSHA256)throw Error('Exact approved R3 image candidate required');let s=approved.toString();for(const[a,b]of[["const GAME_VER='14.32'","const GAME_VER='14.33'"],["const GAME_ANCHOR='T728'","const GAME_ANCHOR='T729'"],['id="startVersion456">v14.32 · T728','id="startVersion456">v14.33 · T729']]){if(s.split(a).length!==2)throw Error('Unique approved candidate label required');s=s.replace(a,b);}return Buffer.from(s);}
function verifyPins013(p){
 if(p?.officialURL!==OFFICIAL||p.release!=='T729'||p.version!=='14.33'||p.approvedSHA!==APPROVED||p.approvedSourceSHA256!==pins016.approvedSourceSHA256||!/^([0-9a-f]{40})$/.test(p.releaseSHA||'')||!/^([0-9a-f]{40})$/.test(p.releaseCandidateSHA||'')||!/^([0-9a-f]{40})$/.test(p.releaseCandidateTree||'')||p.releaseCandidateTree!==p.releaseTree||!/^([0-9a-f]{40})$/.test(p.releaseTree||'')||!/^([0-9a-f]{64})$/.test(p.sourceSHA256||'')||!/^([0-9a-f]{64})$/.test(p.fingerprintSHA256||'')||p.sourceSHA256!==pins016.expectedReleaseSourceSHA256||p.fingerprintSHA256!==pins016.expectedReleaseBaselineSHA256||p.releaseSubject!=='release(T729): British garden-life details v14.33 (#21)')throw Error('Final exact T729 deployment receipt required; placeholders are not executable');
 return p;
}
function readReleasePins(){return verifyPins013(JSON.parse(read(__dirname,'gardenlife-public-release016.json')));}
// Keep these names for the inherited 94-gate runner; their 016 implementations
// are stricter about complete current records and exact current source.
function verifyApprovedRecords013(fp,blocks){
 if(fp?.ok!==true||!equal(Object.keys(fp).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3115||!equal(fp.stats,pins016.stats)||hash(canonical(fp.subs))!==pins016.nativeFullSubsSHA256||hash(canonical(fp.families))!==pins016.nativeFullFamiliesSHA256)throw Error('All 3115 approved complete records and all 162 family aggregates must match');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==pins016.nativeBlocksSHA256)throw Error('All 1728 complete approved block records must match');
 return true;
}
function verifyRelease013(root,expected,expectedHTML){
 const pins=readReleasePins();if(expected!==pins.releaseSHA||expectedHTML!==pins.sourceSHA256)throw Error('Caller must match exact immutable post-deployment receipt');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),tree=execFileSync('git',['rev-parse','HEAD^{tree}'],{cwd:root,encoding:'utf8'}).trim(),subject=execFileSync('git',['log','-1','--format=%s'],{cwd:root,encoding:'utf8'}).trim();
 const candidateTree=execFileSync('git',['rev-parse',pins.releaseCandidateSHA+'^{tree}'],{cwd:root,encoding:'utf8'}).trim();
 if(head!==expected||tree!==pins.releaseTree||subject!==pins.releaseSubject||candidateTree!==tree)throw Error('Exact final main commit, tree and subject required');
 const current=read(root,'index.html'),approved=gitFile(root,APPROVED,'index.html');
 if(hash(current)!==pins.sourceSHA256||!expectedReleaseHTML(root).equals(current)||!normalizeRelease013(current).equals(approved))throw Error('Release changed approved image product beyond exactly three labels');
 for(const[file,pin]of Object.entries(pins016.dependencies))if(hash(read(root,file))!==pin)throw Error('Exact approved product/observer dependency changed: '+file);
 const fpBytes=read(root,'fp.json'),fp=JSON.parse(fpBytes),baseBytes=gitFile(root,BASE,'fp.json'),base=JSON.parse(baseBytes);
 if(hash(fpBytes)!==pins.fingerprintSHA256||fp.version!=='14.33'||fp.anchor!=='T729'||Object.keys(fp.subs||{}).length!==3115||hash(canonical(fp.subs))!==pins016.nativeFullSubsSHA256||hash(canonical(fp.families))!==pins016.nativeFullFamiliesSHA256||!equal(fp.stats,pins016.stats))throw Error('Complete promoted 3115-leaf release fingerprint required');
 const projection=Object.fromEntries(Object.entries(fp.subs).filter(([k])=>!expectedAdditions.includes(k)));
 if(hash(baseBytes)!==pins016.baseFingerprintSHA256||!equal(projection,base.subs)||!equal(fp.blocks,base.blocks))throw Error('All 3091 prior complete leaves and prior blocks must remain exact');
 const cold=JSON.parse(gitFile(root,BASE,'coldload-patch011.json'));if(current.toString().split(cold.to).length!==2)throw Error('Exact T724 successful-load topology invalidation required');
 const fixtures=fixtureSource013(root),complexFixtures=complexFixtureSource014(root);
 return{ok:true,release:true,version:'14.33',anchor:'T729',checkedSHA:head,tree,subject,approvedSHA:APPROVED,sourceSHA256:hash(current),approvedSourceSHA256:pins016.approvedSourceSHA256,htmlExact:true,dependenciesExact:true,fixtureBodiesExact:true,fixtureSHA256:hash(fixtures),complexFixtureSHA256:hash(complexFixtures),base:BASE,releaseBaselineSHA256:hash(fpBytes),coldLoadFixExact:true};
}
function verifyCanonicalAsset016(key,night,bytes){
 if(typeof key!=='string'||typeof night!=='boolean'||!Buffer.isBuffer(bytes)||bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Unaltered complete native PNG bytes required');
 const relative='assets/'+key+(night?'-night':'')+'.png',pin=pins016.canonicalAssets[relative];
 const actual={sha256:hash(bytes),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),key};
 if(!pin||!equal(actual,pin))throw Error('Approved complete canonical PNG bytes changed: '+relative);
 return{relative,...actual};
}
function verifyPublicFingerprint013(root,fp,blocks){
 verifyApprovedRecords013(fp,blocks);const tracked=JSON.parse(read(root,'fp.json')),pins=readReleasePins();
 const {aggregate}=require(path.join(root,'streetlife-fingerprint-qa009.js')),computed=aggregate(fp.subs);
 if(!equal(computed.families,fp.families)||!equal(computed.stats,fp.stats)||hash(read(root,'fp.json'))!==pins.fingerprintSHA256||tracked.version!=='14.33'||tracked.anchor!=='T729'||!equal(fp.subs,tracked.subs)||!equal(fp.families,tracked.families)||!equal(fp.stats,tracked.stats)||!equal({fam:blocks.fam,count:blocks.count},tracked.blocks))throw Error('Live full records/independent aggregates differ from exact T729 promotion');
 return{ok:true,release:true,version:'14.33',anchor:'T729',base:BASE,oldLeaves:3091,newLeaves:24,leaves:3115,oldFamilies:161,currentFamilies:162,oldBlocks:1728,oldCompleteRecordsExact:true,blocksExact:true,completeBlocksExact:true,promotedNativeRecordsExact:true,releaseBaselineSHA256:pins.fingerprintSHA256,approvedFingerprintSHA256:pins016.approvedFingerprintSHA256,added:expectedAdditions};
}
const pins015=old.pins015;
const sourcePins={...old.sourcePins,...pins016,get expectedReleaseSubject(){return readReleasePins().releaseSubject;}};
module.exports={OFFICIAL,BASE,APPROVED,hash,canonical,range,gitFile,pins015,pins016,sourcePins,expectedAdditions,expectedReleaseHTML,normalizeRelease013,verifyPins013,readReleasePins,verifyRelease013,verifyApprovedRecords013,verifyCanonicalAsset016,verifyPublicFingerprint013,fixtureSource013,complexFixtureSource014,verifyCatalog013,verifyComplexCatalog014};
