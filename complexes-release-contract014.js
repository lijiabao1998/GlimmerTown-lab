'use strict';
// Authorized T727 release envelope. Data/source only; no game or browser runtime.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='10bc4115f119498b4cc5836695348982b85fa9d1';
const APPROVED_SHA='509e3b0ebbeefc2c92efb24fef4abbeaf6bdfc85',APPROVED='6d649ebd41d257d45d842a2893f46a178a7e0d25e00b255eb33d3985ba64cb66';
const PIN_HASH='b23118f7a94e558c4ef5a55e7271f9c7615a2a13be5e0a2f4e009a8c375aea2e',BASE_FP_HASH='e6c272866c19a00f0986bf7abfc231454499e1d23eee0cb813f6099f11a7b3fb';
const CARD_HASH='cfe33ff8fd4c22689aefbabc550dcda91e0f4529c5317240f6e8d22584bcb4a8',APPROVED_AT='2026-10-06 04:33 UTC';
const expected=require('./complexes-static-contract014').expectedAdditions;
const labels=[["const GAME_VER='14.31'","const GAME_VER='14.30'"],["const GAME_ANCHOR='T727'","const GAME_ANCHOR='T726'"],['id="startVersion456">v14.31 · T727','id="startVersion456">v14.30 · T726']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML014(html){
 for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label is not unique: '+from);html=html.replace(from,to);}
 if(hash(html)!==APPROVED)throw Error('Release changed the image-approved complexes product beyond three exact labels');
 return html;
}
function readReleasePins014(){
 const bytes=fs.readFileSync(path.join(ROOT,'complexes-release-pins014.json'));
 if(hash(bytes)!==PIN_HASH)throw Error('Approved native112 complexes release pins changed');
 const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37410526348||p.nativeSmokeRun!==37410526296||p.nativeArtifact!==11389575453||p.nativeArchiveSHA256!=='06b6fe20a6ef44600f4367219bebe825e69797cfd2a52d4514dd8716f6917e72'||p.nativeFingerprintSHA256!=='6eae824a714a638a77239c95ea4c30b334e5204aa62ebc151cbdcd78439bf8b3'||p.nativeManifestSHA256!=='7edc97c6479a9ecfea5efedff51f4b0a8fb7c0d232dce4cb602c905db579c516'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families).sort(),['bld','complexes014']))throw Error('Complexes native release provenance/declaration mismatch');
 return p;
}
// Approval is recorded only to the received minute. Use the next full minute
// conservatively; do not invent an exact message timestamp.
function validReleaseDate014(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-06T04:34:00.000Z');}
function verifyApprovedNative014(fp,blocks){
 const p=readReleasePins014();
 if(fp?.ok!==true||!eq(Object.keys(fp||{}).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3059||Object.keys(fp.families||{}).length!==160||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full native3059 complexes records differ from image-approved evidence');
 if(!blocks?.ok||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Complete1728 native block records differ from approved evidence');
 return p;
}
function verifyRelease014(){
 const promotion=readReleasePins014();
 normalizeReleaseHTML014(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const baselineBytes=baseFile('fp.json');if(hash(baselineBytes)!==BASE_FP_HASH)throw Error('Immutable T726 complete fingerprint pin changed');
 const baseline=JSON.parse(baselineBytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.30'||baseline.anchor!=='T726'||Object.keys(baseline.subs).length!==2947||baseline.stats.families!==159||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==3059||!validReleaseDate014(current.generatedAt))throw Error('Invalid complexes release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.31';promoted.anchor='T727';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
 if(!eq(current,promoted))throw Error('T727 baseline is not exactly the approved112 additive promotion preserving all T726 fields');
 const full=aggregate(current.subs);
 if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.families!==160||full.stats.leaves!==3059||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('T727 promotion differs from complete approved native inventory/aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T727 release entry BEGIN -->[\s\S]*?<!-- T727 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r174')||!entries[0].includes('gpt/british-four-complexes-014')||!entries[0].includes(APPROVED_SHA)||!entries[0].includes('37410526348')||!entries[0].includes('T727')||!entries[0].includes('14.31')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T727 release entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T727-four-british-complexes.md'),'utf8');
 const heading='# T727 — Four British complexes (original GPT-014)',oldHeading='# GPT-014 — Four detailed British civic and country ensembles',marker='\n\n## Publication approval and T727 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or publication section changed');
 const originalCard=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(originalCard)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-014-four-british-complexes.md'))||!append.includes(APPROVED_AT)||!append.includes('gpt/british-four-complexes-014')||!append.includes('r174')||!append.includes('14.31')||!append.includes(APPROVED_SHA)||!append.includes('37410526348'))throw Error('Original pre-code acceptance/history or complexes publication approval was not retained');
 return{release:true,phase:'release',version:'14.31',anchor:'T727',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:2947,newLeaves:112,oldBlocks:1728};
}
module.exports={verifyRelease014,normalizeReleaseHTML014,verifyApprovedNative014,readReleasePins014,validReleaseDate014,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease014();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
