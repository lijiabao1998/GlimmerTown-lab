'use strict';
// T722 static release gate. No browser, simulation, preview or pixel generation.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const ROOT=__dirname,BASE='559a419270e84d7d67b883581ddef8f24302a41b';
const APPROVED='6c5dc6363d6badc8cbec45c8566e4a61b2bc0493fbff11964ed1ffcc45beaf29',PIN_HASH='e44a826b55770c1f38feb015511b7972e948c2f71243044ee3a7739ff033e7e4';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const expected=[...[274,275,276].flatMap(k=>Array.from({length:4},(_,v)=>`bld.${k}_1_${v}`)),...['bench','planter','fingerpost'].flatMap(t=>Array.from({length:4},(_,v)=>`streetLife009.${t}_${v}`))].sort();
function verifyRelease009(){
 const pinBytes=fs.readFileSync(path.join(ROOT,'streetlife-release-pins009.json'));if(hash(pinBytes)!==PIN_HASH)throw Error('Approved native24 release pins changed');const promotion=JSON.parse(pinBytes);
 if(promotion.nativeCheckedSHA!=='3fa44a453da8163f8ff9f31b752d2baf477b8d83'||promotion.nativeSourceSHA256!==APPROVED||promotion.nativeRun!==37275705611||promotion.nativeArtifact!==11329869010||!eq(Object.keys(promotion.subs).sort(),expected)||!eq(Object.keys(promotion.families).sort(),['bld','streetLife009']))throw Error('Native release provenance/declaration mismatch');
 let normalizedHTML=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');const labels=[["const GAME_VER='14.26'","const GAME_VER='14.25'"],["const GAME_ANCHOR='T722'","const GAME_ANCHOR='T721'"],['id="startVersion456">v14.26 · T722','id="startVersion456">v14.25 · T721']];
 for(const[from,to]of labels){if(normalizedHTML.split(from).length!==2)throw Error('Release label is not unique: '+from);normalizedHTML=normalizedHTML.replace(from,to);}
 if(hash(normalizedHTML)!==APPROVED)throw Error('Release changes approved product beyond exactly three labels');
 const baseline=JSON.parse(baseFile('fp.json')),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=JSON.parse(JSON.stringify(baseline));
 if(Object.keys(baseline.subs).length!==2855||Object.keys(current.subs).length!==2879||!Number.isFinite(Date.parse(current.generatedAt)))throw Error('Invalid baseline inventory/date');
 promoted.generatedAt=current.generatedAt;promoted.version='14.26';promoted.anchor='T722';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
 if(!eq(current,promoted))throw Error('Release baseline is not exact approved24 additive promotion');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T722 release entry BEGIN -->[\s\S]*?<!-- T722 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r169')||!entries[0].includes('PR14')||!entries[0].includes('2026-10-05 07:23:55 UTC'))throw Error('Historical log differs beyond one authorized T722 entry');
 const card=fs.readFileSync(path.join(ROOT,'docs/T722-british-station-street-life.md'),'utf8');const originalCard=card.replace('# T722 — British station hotel, café, newsstand and street life (original GPT-009)','# GPT-009 — British station hotel, café, newsstand and street life').split('\n\n## Publication approval and T722 preparation')[0];if(hash(originalCard)!=='75047956527b4fba1eb0a1320224a82c6acf72584e50665d7895d5fd8f7ce04c')throw Error('Original pre-code acceptance/history changed');if(fs.existsSync(path.join(ROOT,'docs/branch/GPT-009-british-station-street-life.md'))||!card.includes('(original GPT-009)')||!card.includes('2026-10-05 07:23:55 UTC')||!card.includes('No stage-two merge'))throw Error('Original card/history and release approval not retained');
 return{release:true,version:'14.26',anchor:'T722',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,promotion,releaseBaseline:current,oldLeaves:2855,newLeaves:24};
}
module.exports={verifyRelease009,BASE,APPROVED,expected};
if(require.main===module){const q=verifyRelease009();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
