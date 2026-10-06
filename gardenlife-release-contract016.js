'use strict';
// Owner-approved T729 envelope. Source/data only; never invokes the game.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='bcd77d5e959ed801d920766cbc9dc010cce19f58';
const APPROVED_SHA='562dcdac6b0f221f803e5288152805e5dfd1f367',APPROVED='a719a11c7bcd61d10a9975e0b3ff4c1a760778b3e158acf5806ac33fcb674abe';
const PIN_HASH='304721f9bd181b5818411a9852e41ae1b0737fd5d471abe03f1730f1f41e973a',BASE_FP_HASH='811889c4b5a2ca97a87599310b6d6ba5a48cf6aa9ac7d7fd04792e2ca7fb8ea0';
const CARD_HASH='8f8932a7dff0aadcbc86fb1b6339f7ae1254468f56fbb58b8584d3d78457f8f0',APPROVED_AT='2026-10-06 12:31 UTC (release-task receipt)';
const expected=require('./gardenlife-static-contract016').expectedAdditions;
const labels=[["const GAME_VER='14.33'","const GAME_VER='14.32'"],["const GAME_ANCHOR='T729'","const GAME_ANCHOR='T728'"],['id="startVersion456">v14.33 · T729','id="startVersion456">v14.32 · T728']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML016(html){for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label not unique: '+from);html=html.replace(from,to);}if(hash(html)!==APPROVED)throw Error('Release changed image-approved product beyond three exact labels');return html;}
function readReleasePins016(){
 const bytes=fs.readFileSync(path.join(ROOT,'gardenlife-release-pins016.json'));if(hash(bytes)!==PIN_HASH)throw Error('Approved native24 release pins changed');const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37457485794||p.nativeLegacyRun!==37457485853||p.nativeSmokeRun!==37457485811||p.nativeArtifact!==11409936117||p.nativeArchiveSHA256!=='354b0a531452872987280d1c869b93245cfdc7aac9a621c96dc9fe2e8bea1d33'||p.nativeFingerprintSHA256!=='ddffc5f31ed9ee1f8ab41acdc9a3d979876f4ebf9f5225bb7da4e0ee9fd257e1'||p.nativeManifestSHA256!=='73137bbbb455a071b3de2bc228c6b29d9ba90bc08e5bfde28c6cbdf17106febd'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families),['gardenLife016']))throw Error('Approved garden-life native provenance/declaration changed');return p;
}
// Approval receipt is known to a minute, conservatively use the next full minute.
function validReleaseDate016(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-06T12:32:00.000Z');}
function verifyApprovedNative016(fp,blocks){
 const p=readReleasePins016();if(fp?.ok!==true||!eq(Object.keys(fp||{}).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3115||Object.keys(fp.families||{}).length!==162||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full3115 complete native records differ from image-approved evidence');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Full1728 native blocks differ from image-approved evidence');return p;
}
function verifyRelease016(){
 const promotion=readReleasePins016();normalizeReleaseHTML016(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_HASH)throw Error('Immutable T728 fingerprint pin changed');const baseline=JSON.parse(bytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.32'||baseline.anchor!=='T728'||Object.keys(baseline.subs).length!==3091||baseline.stats.families!==161||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==3115||!validReleaseDate016(current.generatedAt))throw Error('Invalid release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.33';promoted.anchor='T729';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);if(!eq(current,promoted))throw Error('T729 baseline must be exactly24 additive promotion preserving every T728 field');
 const full=aggregate(current.subs);if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.leaves!==3115||full.stats.families!==162||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('Promotion differs from complete approved native aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T729 release entry BEGIN -->[\s\S]*?<!-- T729 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r176')||!entries[0].includes('gpt/british-garden-life-016')||!entries[0].includes(APPROVED_SHA)||!entries[0].includes('37457485794')||!entries[0].includes('T729')||!entries[0].includes('14.33')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T729 entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T729-british-garden-life.md'),'utf8'),heading='# T729 — British garden-life details (original GPT-016)',oldHeading='# GPT-016 — British garden-life details',marker='\n\n## Publication approval and T729 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or section changed');const original=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(original)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-016-british-garden-life.md'))||!append.includes(APPROVED_AT)||!append.includes('gpt/british-garden-life-016')||!append.includes('r176')||!append.includes('14.33')||!append.includes(APPROVED_SHA)||!append.includes('37457485794'))throw Error('Original acceptance/history or publication approval not retained');
 return{release:true,phase:'release',version:'14.33',anchor:'T729',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:3091,newLeaves:24,oldBlocks:1728};
}
module.exports={verifyRelease016,normalizeReleaseHTML016,verifyApprovedNative016,readReleasePins016,validReleaseDate016,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease016();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
