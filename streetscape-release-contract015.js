'use strict';
// Owner-approved T728 envelope. Source/data only; never invokes the game.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='6d137b6be31a7f07867b8ebb181fb8ed3727b049';
const APPROVED_SHA='7c358552922460c09a8a90fc536490233b97279d',APPROVED='24e885a46e7c447b8192537eb4aa3824426c0848d5e240a3c131e0d2768dd7c8';
const PIN_HASH='5654a09a699a7a7576d8e4e5d8daa435bd4a2858705d8e8386665d91821d60b8',BASE_FP_HASH='89fad81273325654c7c54c82ee9721e03cbcf47f3fd6bfbb8377f0a41decdb2f';
const CARD_HASH='5bf247e79e875f9f52a9f42bef8795b4862f2a7ebb3b033259848c88fa5451d9',APPROVED_AT='2026-10-06 09:35 UTC';
const expected=require('./streetscape-static-contract015').expectedAdditions;
const labels=[["const GAME_VER='14.32'","const GAME_VER='14.31'"],["const GAME_ANCHOR='T728'","const GAME_ANCHOR='T727'"],['id="startVersion456">v14.32 · T728','id="startVersion456">v14.31 · T727']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML015(html){for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label not unique: '+from);html=html.replace(from,to);}if(hash(html)!==APPROVED)throw Error('Release changed image-approved product beyond three exact labels');return html;}
function readReleasePins015(){
 const bytes=fs.readFileSync(path.join(ROOT,'streetscape-release-pins015.json'));if(hash(bytes)!==PIN_HASH)throw Error('Approved native32 release pins changed');const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37439964454||p.nativeLegacyRun!==37439964669||p.nativeSmokeRun!==37439964649||p.nativeArtifact!==11400194467||p.nativeArchiveSHA256!=='a88175cba889ead06140ece468fd6825d3ae47d754a1abb6f227f4473a3eca0d'||p.nativeFingerprintSHA256!=='694ba9e1051b702eb96bf8a36320e828048f498cae5fdcdf9e04ba1426f53a33'||p.nativeManifestSHA256!=='2852638ccd88a4e1714fa0bb0084c2088e1ac22431b360fad1845c16979fd853'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families),['streetscape015']))throw Error('Approved streetscape native provenance/declaration changed');return p;
}
// Approval receipt is known to a minute, conservatively use the next full minute.
function validReleaseDate015(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-06T09:36:00.000Z');}
function verifyApprovedNative015(fp,blocks){
 const p=readReleasePins015();if(fp?.ok!==true||!eq(Object.keys(fp||{}).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3091||Object.keys(fp.families||{}).length!==161||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full3091 complete native records differ from image-approved evidence');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Full1728 native blocks differ from image-approved evidence');return p;
}
function verifyRelease015(){
 const promotion=readReleasePins015();normalizeReleaseHTML015(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_HASH)throw Error('Immutable T727 fingerprint pin changed');const baseline=JSON.parse(bytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.31'||baseline.anchor!=='T727'||Object.keys(baseline.subs).length!==3059||baseline.stats.families!==160||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==3091||!validReleaseDate015(current.generatedAt))throw Error('Invalid release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.32';promoted.anchor='T728';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);if(!eq(current,promoted))throw Error('T728 baseline must be exactly32 additive promotion preserving every T727 field');
 const full=aggregate(current.subs);if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.leaves!==3091||full.stats.families!==161||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('Promotion differs from complete approved native aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T728 release entry BEGIN -->[\s\S]*?<!-- T728 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r175')||!entries[0].includes('gpt/british-streetscape-015')||!entries[0].includes(APPROVED_SHA)||!entries[0].includes('37439964454')||!entries[0].includes('T728')||!entries[0].includes('14.32')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T728 entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T728-british-streetscape.md'),'utf8'),heading='# T728 — British street details (original GPT-015)',oldHeading='# GPT-015 — British street details and source-level console diagnosis',marker='\n\n## Publication approval and T728 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or section changed');const original=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(original)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-015-british-streetscape.md'))||!append.includes(APPROVED_AT)||!append.includes('gpt/british-streetscape-015')||!append.includes('r175')||!append.includes('14.32')||!append.includes(APPROVED_SHA)||!append.includes('37439964454'))throw Error('Original acceptance/history or publication approval not retained');
 return{release:true,phase:'release',version:'14.32',anchor:'T728',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:3059,newLeaves:32,oldBlocks:1728};
}
module.exports={verifyRelease015,normalizeReleaseHTML015,verifyApprovedNative015,readReleasePins015,validReleaseDate015,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease015();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
