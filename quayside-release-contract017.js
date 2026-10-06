'use strict';
// Owner-approved T730 envelope. Source/data only; never invokes the game.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='c7f0ab6e6d2c37651fd13802049b8079c5f5d37b';
const APPROVED_SHA='8ceebc081dff3f44f31279e5ddab4d60f25933c6',APPROVED='a968e394f5c651a7c0c997a3c381ed90ad82f0b563ce40c167797f2c349b0234';
const PIN_HASH='db9f47ef6bf05108077fad8b3d5e11762262bab073e08b8b9603ae44fcaa3f91',BASE_FP_HASH='4d658d9c9679d3fa03f29397dd7b60ef1a6408bc3cbf5aca1269c6badf896683';
const CARD_HASH='d14d0c7e69497e24161b0281f92bce25352d3d9b650e2dfcd7b7d02c362d44bd',APPROVED_AT='2026-10-06 22:00 UTC (release-task receipt)';
const expected=require('./quayside-static-contract017').expectedAdditions;
const labels=[["const GAME_VER='14.34'","const GAME_VER='14.33'"],["const GAME_ANCHOR='T730'","const GAME_ANCHOR='T729'"],['id="startVersion456">v14.34 · T730','id="startVersion456">v14.33 · T729']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML017(html){for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label not unique: '+from);html=html.replace(from,to);}if(hash(html)!==APPROVED)throw Error('Release changed image-approved product beyond three exact labels');return html;}
function readReleasePins017(){
 const bytes=fs.readFileSync(path.join(ROOT,'quayside-release-pins017.json'));if(hash(bytes)!==PIN_HASH)throw Error('Approved native24 release pins changed');const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37533544152||p.nativeLegacyRun!==37533544092||p.nativeSmokeRun!==37533543992||p.nativeArtifact!==11445575211||p.nativeArchiveSHA256!=='e61e42c6752a74c1bfbb12a4d4570b7c56e921543d19ed095e348dfa99983d62'||p.nativeFingerprintSHA256!=='726a9d8393b5a849a45503474751d331da9dea71147b5b438dcb5ff330e1c08c'||p.nativeManifestSHA256!=='1c019ad38f164ed0192d2c5bcee046acbbd0f7cefea87247909a3f4e32824a32'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families),['quayside017']))throw Error('Approved quayside native provenance/declaration changed');return p;
}
// Approval receipt is known to a minute, conservatively use the next full minute.
function validReleaseDate017(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-06T22:01:00.000Z');}
function verifyApprovedNative017(fp,blocks){
 const p=readReleasePins017();if(fp?.ok!==true||!eq(Object.keys(fp||{}).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3139||Object.keys(fp.families||{}).length!==163||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full3139 complete native records differ from image-approved evidence');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Full1728 native blocks differ from image-approved evidence');return p;
}
function verifyRelease017(){
 const promotion=readReleasePins017();normalizeReleaseHTML017(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_HASH)throw Error('Immutable T729 fingerprint pin changed');const baseline=JSON.parse(bytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.33'||baseline.anchor!=='T729'||Object.keys(baseline.subs).length!==3115||baseline.stats.families!==162||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==3139||!validReleaseDate017(current.generatedAt))throw Error('Invalid release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.34';promoted.anchor='T730';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);if(!eq(current,promoted))throw Error('T730 baseline must be exactly24 additive promotion preserving every T729 field');
 const full=aggregate(current.subs);if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.leaves!==3139||full.stats.families!==163||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('Promotion differs from complete approved native aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T730 release entry BEGIN -->[\s\S]*?<!-- T730 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r177')||!entries[0].includes('gpt/british-quayside-details-017')||!entries[0].includes(APPROVED_SHA)||!entries[0].includes('37533544152')||!entries[0].includes('T730')||!entries[0].includes('14.34')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T730 entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T730-british-quayside-details.md'),'utf8'),heading='# T730 — British quayside details (original GPT-017)',oldHeading='# GPT-017 — British quayside details',marker='\n\n## Publication approval and T730 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or section changed');const original=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(original)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-017-british-quayside-details.md'))||!append.includes(APPROVED_AT)||!append.includes('gpt/british-quayside-details-017')||!append.includes('r177')||!append.includes('14.34')||!append.includes(APPROVED_SHA)||!append.includes('37533544152'))throw Error('Original acceptance/history or publication approval not retained');
 return{release:true,phase:'release',version:'14.34',anchor:'T730',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:3115,newLeaves:24,oldBlocks:1728};
}
module.exports={verifyRelease017,normalizeReleaseHTML017,verifyApprovedNative017,readReleasePins017,validReleaseDate017,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease017();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
