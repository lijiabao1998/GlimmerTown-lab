'use strict';
// Authorized T726 release envelope. Data/source only; no game or browser runtime.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='248ce802bf4f29333f242447f12b8106af2bdbf1';
const APPROVED_SHA='30aa0ebfc7080f268de26541f20da730adca1a8d',APPROVED='de54453d2890e705c522e8e0a5506d50adaaf68922d8897f64485a87e27366b1';
const PIN_HASH='9e33b8068899183284a55b6e31eab6b24dba36c1d35177325b46260ef0aa886d',BASE_FP_HASH='752bd3575016232d1ddece51065f4d03a2f55e2a7af59a92a88eb8182e1994db';
const CARD_HASH='dfd220c79205f3b07949833cc8b81091c497eb1f9973a758591103e1291765f2',APPROVED_AT='2026-10-05 16:57 UTC';
const expected=[...Array.from({length:4},(_,v)=>`bld.281_1_${v}`),...['ticket','plaza','rail','bench','planter','lamp'].flatMap(t=>Array.from({length:4},(_,v)=>`theatre013.${t}_${v}`))].sort();
const labels=[["const GAME_VER='14.30'","const GAME_VER='14.29'"],["const GAME_ANCHOR='T726'","const GAME_ANCHOR='T725'"],['id="startVersion456">v14.30 · T726','id="startVersion456">v14.29 · T725']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML013(html){
 for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label is not unique: '+from);html=html.replace(from,to);}
 if(hash(html)!==APPROVED)throw Error('Release changed the image-approved theatre product beyond three exact labels');
 return html;
}
function readReleasePins013(){
 const bytes=fs.readFileSync(path.join(ROOT,'theatre-release-pins013.json'));
 if(hash(bytes)!==PIN_HASH)throw Error('Approved native28 theatre release pins changed');
 const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37341815804||p.nativeSmokeRun!==37341815847||p.nativeArtifact!==11359116864||p.nativeArchiveSHA256!=='04b3bd01da4791e583d547912fd6fbe4cac571d4faf120d847e92cdc1bd07ab8'||p.nativeFingerprintSHA256!=='fec125ae41876eddbaf0d799fbd27658448df2b564908d2ebcf8e04fa16fb2a0'||p.nativeManifestSHA256!=='5a56866cfd77d6b6fe167bee112b60e1ee3b74fb0771389b1b4fdb44857cee0c'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families).sort(),['bld','theatre013']))throw Error('Theatre native release provenance/declaration mismatch');
 return p;
}
// Approval is recorded only to the received minute. Use the next full minute
// conservatively; do not invent an exact message timestamp.
function validReleaseDate013(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-05T16:58:00.000Z');}
function verifyApprovedNative013(fp,blocks){
 const p=readReleasePins013();
 if(!fp?.ok||Object.keys(fp.subs||{}).length!==2947||Object.keys(fp.families||{}).length!==159||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full native2947 theatre records differ from image-approved evidence');
 if(!blocks?.ok||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Complete1728 native block records differ from approved evidence');
 return p;
}
function verifyRelease013(){
 const promotion=readReleasePins013();
 normalizeReleaseHTML013(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const baselineBytes=baseFile('fp.json');if(hash(baselineBytes)!==BASE_FP_HASH)throw Error('Immutable T725 complete fingerprint pin changed');
 const baseline=JSON.parse(baselineBytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.29'||baseline.anchor!=='T725'||Object.keys(baseline.subs).length!==2919||baseline.stats.families!==158||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==2947||!validReleaseDate013(current.generatedAt))throw Error('Invalid theatre release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.30';promoted.anchor='T726';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
 if(!eq(current,promoted))throw Error('T726 baseline is not exactly the approved28 additive promotion preserving all T725 fields');
 const full=aggregate(current.subs);
 if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.families!==159||full.stats.leaves!==2947||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('T726 promotion differs from complete approved native inventory/aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T726 release entry BEGIN -->[\s\S]*?<!-- T726 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r173')||!entries[0].includes('PR18')||!entries[0].includes('T726')||!entries[0].includes('14.30')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T726 release entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T726-british-edwardian-theatre-quarter.md'),'utf8');
 const heading='# T726 — British Edwardian theatre quarter (original GPT-013)',oldHeading='# GPT-013 — British Edwardian theatre quarter',marker='\n\n## Publication approval and T726 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or publication section changed');
 const originalCard=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(originalCard)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-013-British-Edwardian-theatre-quarter.md'))||!append.includes(APPROVED_AT)||!append.includes('PR18')||!append.includes('r173')||!append.includes('14.30')||!append.includes(APPROVED_SHA)||!append.includes('37341815804'))throw Error('Original pre-code acceptance/history or theatre publication approval was not retained');
 return{release:true,phase:'release',version:'14.30',anchor:'T726',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:2919,newLeaves:28,oldBlocks:1728};
}
module.exports={verifyRelease013,normalizeReleaseHTML013,verifyApprovedNative013,readReleasePins013,validReleaseDate013,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease013();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
