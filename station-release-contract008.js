'use strict';
// Static file contract only. Never starts a browser or evaluates game code.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const ROOT=__dirname,BASE='ed49bab0b73bacfe8c7d6f6a8ca13491b01c9f5f',APPROVED='da956974f0e3dc775b755449dc661f20e9b9edd8c8dc369c8785d81b3b363d73';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),pinBytes=fs.readFileSync(path.join(ROOT,'station-release-pins008.json'));
if(hash(pinBytes)!=='2066783c821b1050ac1237abf06648f303107c99654d5cb1550690a0fd43a102')throw Error('Verified complete native promotion pins changed');
const promotion=JSON.parse(pinBytes),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024}),baseline=JSON.parse(baseFile('fp.json'));
const expected=[...Array.from({length:4},(_,i)=>'bld.139_1_'+(i+3)),...['square','entrance','bus','taxi','cycleParking','cyclePath','transfer'].flatMap(t=>Array.from({length:4},(_,i)=>'stationDistrict008.'+t+'_'+i)),...Array.from({length:4},(_,st)=>Array.from({length:4},(_,v)=>'stationConstruction008.'+st+'_'+v)).flat()].sort();
if(Object.keys(baseline.subs).length!==2807||JSON.stringify(Object.keys(promotion.subs).sort())!==JSON.stringify(expected))throw Error('Promotion declaration mismatch');
function verifyRelease(){
  let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const labels=[["const GAME_VER='14.25'","const GAME_VER='14.24'"],["const GAME_ANCHOR='T721'","const GAME_ANCHOR='T720'"],['id="startVersion456">v14.25 · T721','id="startVersion456">v14.24 · T720']];
  for(const[a,b]of labels){if(html.split(a).length!==2)throw Error('Release metadata is not unique: '+a);html=html.replace(a,b);}
  if(hash(html)!==APPROVED)throw Error('Approved product differs beyond three release labels');
  const current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'))),promoted=JSON.parse(JSON.stringify(baseline));
  promoted.generatedAt=current.generatedAt;promoted.version='14.25';promoted.anchor='T721';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
  if(!eq(current,promoted)||!Number.isFinite(Date.parse(current.generatedAt)))throw Error('Release baseline is not strict additive native48 promotion');
  const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T721 release entry BEGIN -->[\s\S]*?<!-- T721 release entry END -->\n/g)||[];
  if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r168')||!entries[0].includes('PR13')||!entries[0].includes('2026-10-05 03:47:25 UTC'))throw Error('Release log is not the one approved bounded insertion');
  return{htmlExact:true,fpExact:true,logExact:true,normalizedHTMLSHA256:APPROVED,promotionSHA256:hash(pinBytes),oldLeaves:2807,newLeaves:48,releaseBaseline:current};
}
module.exports={verifyRelease,promotion,expected,BASE,APPROVED};
