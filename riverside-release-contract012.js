'use strict';
// Authorized T725 release envelope. Data/source only; no game or browser runtime.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='6583659d2e14db3b8ae92115d05432d64a0c989d';
const APPROVED_SHA='2b0a28621741952369bd6e49a7ab21b716fbb94d',APPROVED='8466b7eeaa0dccda8b12e0f53af746991d85baa5de80aedf2f1700112ae10f89';
const PIN_HASH='ca57c4bc3e795f52f2544d3ca39a2a2844f741cba6edef37ee3b771a3d6a82a9',BASE_FP_HASH='21026775f0461ade01c2428642d0ba9355fdb5d6c49c61b6170986b3252e4ee2';
const CARD_HASH='18f3a8d1f843320a681e57f242b99d06013f0fc79bead773449526bac6587901',APPROVED_AT='2026-10-05 12:35:18 UTC';
const expected=[...[278,279,280].flatMap(k=>Array.from({length:4},(_,v)=>`bld.${k}_1_${v}`)),...['quay','rail','promenade'].flatMap(t=>Array.from({length:4},(_,v)=>`riverside012.${t}_${v}`))].sort();
const labels=[["const GAME_VER='14.29'","const GAME_VER='14.28'"],["const GAME_ANCHOR='T725'","const GAME_ANCHOR='T724'"],['id="startVersion456">v14.29 · T725','id="startVersion456">v14.28 · T724']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML012(html){
 for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label is not unique: '+from);html=html.replace(from,to);}
 if(hash(html)!==APPROVED)throw Error('Release changed the image-approved riverside product beyond three exact labels');
 return html;
}
function readReleasePins012(){
 const bytes=fs.readFileSync(path.join(ROOT,'riverside-release-pins012.json'));
 if(hash(bytes)!==PIN_HASH)throw Error('Approved native24 riverside release pins changed');
 const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37309010297||p.nativeSmokeRun!==37309010329||p.nativeArtifact!==11345465979||p.nativeArchiveSHA256!=='3cf46bf559d536b9f1c0520948c7c4cc692ad629ef4c7e3dd9aaac91b011e2d7'||p.nativeFingerprintSHA256!=='eac45b9f2a6f63b34d918ffae393ac358c9672a795996f11eb6769e0761402a0'||p.nativeManifestSHA256!=='0214f7d1dd208ef1cce4107112473dd85224a1840771e6278eb79d7451745728'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families).sort(),['bld','riverside012']))throw Error('Riverside native release provenance/declaration mismatch');
 return p;
}
function validReleaseDate012(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-05T12:35:18.000Z');}
function verifyApprovedNative012(fp,blocks){
 const p=readReleasePins012();
 if(!fp?.ok||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full native2919 riverside records differ from image-approved evidence');
 if(!blocks?.ok||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Complete1728 native block records differ from approved evidence');
 return p;
}
function verifyRelease012(){
 const promotion=readReleasePins012();
 normalizeReleaseHTML012(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const baselineBytes=baseFile('fp.json');if(hash(baselineBytes)!==BASE_FP_HASH)throw Error('Immutable T724 complete fingerprint pin changed');
 const baseline=JSON.parse(baselineBytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(Object.keys(baseline.subs).length!==2895||baseline.stats.families!==157||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==2919||!validReleaseDate012(current.generatedAt))throw Error('Invalid riverside release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.29';promoted.anchor='T725';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
 if(!eq(current,promoted))throw Error('T725 baseline is not exactly the approved24 additive promotion preserving all T724 fields');
 const full=aggregate(current.subs);
 if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.families!==158||full.stats.leaves!==2919||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('T725 promotion differs from complete approved native inventory/aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T725 release entry BEGIN -->[\s\S]*?<!-- T725 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r172')||!entries[0].includes('PR17')||!entries[0].includes('T725')||!entries[0].includes('14.29')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T725 release entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T725-british-riverside-market.md'),'utf8');
 const heading='# T725 — British riverside market quarter (original GPT-012)',oldHeading='# GPT-012 — British riverside market quarter',marker='\n\n## Publication approval and T725 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or publication section changed');
 const originalCard=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(originalCard)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-012-british-riverside-market.md'))||!append.includes(APPROVED_AT)||!append.includes('PR17')||!append.includes('r172')||!append.includes('14.29')||!append.includes(APPROVED_SHA)||!append.includes('37309010297'))throw Error('Original pre-code acceptance/history or riverside publication approval was not retained');
 return{release:true,phase:'release',version:'14.29',anchor:'T725',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:2895,newLeaves:24,oldBlocks:1728};
}
module.exports={verifyRelease012,normalizeReleaseHTML012,verifyApprovedNative012,readReleasePins012,validReleaseDate012,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease012();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
