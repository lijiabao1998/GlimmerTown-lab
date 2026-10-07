'use strict';
// Owner-approved T731 envelope. Source/data only; never invokes the game.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const {aggregate}=require('./streetlife-fingerprint-qa009');
const ROOT=__dirname,BASE='1400301238f7a46ab6d3c489422a48f9f90cac9d';
const APPROVED_SHA='f2123f682b893828e8c306e1f5609603a8e8fd08',APPROVED='ed6f3d3a0ed2df05fe705d36004e0eaf4560bf9b025da2616112272e9150b5b9';
const PIN_HASH='1d7858099d3758289ed57b1c03121a84076b904ff84420a92fe0e7c95cafa6a6',BASE_FP_HASH='426bc4f942e9632b87e32a358263ff286dd44109212a26b9df39e7208c7d0927';
const CARD_HASH='ed073de0dcb4aca0f76385f0766b92f7703625acf644b9dd27dd547de433128d',APPROVED_AT='2026-10-07 08:30 UTC (conservative post-approval cutoff)';
const expected=require('./waterfront-static-contract018').expectedAdditions;
const labels=[["const GAME_VER='14.35'","const GAME_VER='14.34'"],["const GAME_ANCHOR='T731'","const GAME_ANCHOR='T730'"],['id="startVersion456">v14.35 · T731','id="startVersion456">v14.34 · T730']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function normalizeReleaseHTML018(html){for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label not unique: '+from);html=html.replace(from,to);}if(hash(html)!==APPROVED)throw Error('Release changed image-approved product beyond three exact labels');return html;}
function readReleasePins018(){
 const bytes=fs.readFileSync(path.join(ROOT,'waterfront-release-pins018.json'));if(hash(bytes)!==PIN_HASH)throw Error('Approved native8 release pins changed');const p=JSON.parse(bytes);
 if(p.nativeCheckedSHA!==APPROVED_SHA||p.nativeSourceSHA256!==APPROVED||p.nativeRun!==37590211280||p.nativeRunAttempt!==1||p.nativeJobCount!==148||p.nativeCompletedAt!=='2026-10-07T08:24:14Z'||p.nativeArtifact!==11468816627||p.nativeArchiveSHA256!=='33c9cba4deff293a3b3113cdc2eb4a53ef09adee21ab034bb1de22a7192c4e33'||p.nativeFingerprintSHA256!=='bae09ad52e99ef9c53c3c02d76f364704b1d668defc9ed353afbfc1de6a74c44'||p.nativePreflightArtifact!==11468243745||p.nativePreflightArchiveSHA256!=='2cc00008cb2d1c3e7815a03700fa1fd4716ecb0bbec9a4dc6f487c48e640ac7a'||p.nativeManifestSHA256!=='0645e0630cfe1552ae8f08c4804adda28887481deba93fa2922d3c233b99196f'||!eq(Object.keys(p.subs).sort(),expected)||!eq(Object.keys(p.families),['waterfront018']))throw Error('Approved waterfront native provenance/declaration changed');return p;
}
// Approval is known to predate this conservative cutoff; do not claim an exact reply time.
function validReleaseDate018(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,19)===value.slice(0,19)&&Date.parse(value)>=Date.parse('2026-10-07T08:30:00.000Z');}
function verifyApprovedNative018(fp,blocks){
 const p=readReleasePins018();if(fp?.ok!==true||!eq(Object.keys(fp||{}).sort(),['families','ok','stats','subs'])||Object.keys(fp.subs||{}).length!==3147||Object.keys(fp.families||{}).length!==164||!eq(fp.stats,p.stats)||hash(canonical(fp.subs))!==p.nativeFullSubsSHA256||hash(canonical(fp.families))!==p.nativeFullFamiliesSHA256)throw Error('Full3147 complete native records differ from image-approved evidence');
 const full=aggregate(fp.subs);if(!eq(full.families,fp.families)||!eq(full.stats,fp.stats))throw Error('Approved native full records must independently reproduce family CRCs and stats');
 if(blocks?.ok!==true||blocks.count!==1728||Object.keys(blocks.entries||{}).length!==1728||hash(canonical(blocks))!==p.nativeBlocksSHA256)throw Error('Full1728 native blocks differ from image-approved evidence');return p;
}
function verifyRelease018(){
 const promotion=readReleasePins018();normalizeReleaseHTML018(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
 const bytes=baseFile('fp.json');if(hash(bytes)!==BASE_FP_HASH)throw Error('Immutable T730 fingerprint pin changed');const baseline=JSON.parse(bytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
 if(baseline.version!=='14.34'||baseline.anchor!=='T730'||Object.keys(baseline.subs).length!==3139||baseline.stats.families!==163||baseline.blocks.count!==1728||Object.keys(current.subs||{}).length!==3147||!validReleaseDate018(current.generatedAt))throw Error('Invalid release baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.35';promoted.anchor='T731';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);if(!eq(current,promoted))throw Error('T731 baseline must be exactly8 additive promotion preserving every T730 field');
 const full=aggregate(current.subs);if(!eq(full.families,current.families)||!eq(full.stats,current.stats)||full.stats.leaves!==3147||full.stats.families!==164||hash(canonical(current.subs))!==promotion.nativeFullSubsSHA256||hash(canonical(current.families))!==promotion.nativeFullFamiliesSHA256)throw Error('Promotion differs from complete approved native aggregation');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T731 release entry BEGIN -->[\s\S]*?<!-- T731 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r178')||!entries[0].includes('gpt/british-waterfront-heritage-018')||!entries[0].includes(APPROVED_SHA)||!entries[0].includes('37590211280')||!entries[0].includes('T731')||!entries[0].includes('14.35')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T731 entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T731-british-waterfront-heritage.md'),'utf8'),heading='# T731 — British waterfront heritage appearances (original GPT-018)',oldHeading='# GPT-018 — British waterfront heritage appearances',marker='\n\n## Publication approval and T731 preparation';
 if(!card.startsWith(heading+'\n')||card.split(marker).length!==2)throw Error('Release card heading or section changed');const original=card.replace(heading,oldHeading).split(marker)[0],append=card.split(marker)[1];
 if(hash(original)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-018-british-waterfront-heritage.md'))||!append.includes(APPROVED_AT)||!append.includes('gpt/british-waterfront-heritage-018')||!append.includes('r178')||!append.includes('14.35')||!append.includes(APPROVED_SHA)||!append.includes('37590211280'))throw Error('Original acceptance/history or publication approval not retained');
 return{release:true,phase:'release',version:'14.35',anchor:'T731',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,promotion,releaseBaseline:current,oldLeaves:3139,newLeaves:8,oldBlocks:1728};
}
module.exports={verifyRelease018,normalizeReleaseHTML018,verifyApprovedNative018,readReleasePins018,validReleaseDate018,canonical,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease018();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
