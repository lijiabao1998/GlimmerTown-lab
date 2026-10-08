'use strict';
// Source/data-only release envelope controls. Never runs the game or a painter.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),fixed=require('./waterfront-quarter-contract019'),contract=require('./waterfront-quarter-release-contract019');
const product=fixed.verifyStatic019(),candidate=product.release?contract.normalizeReleaseHTML019(fs.readFileSync(path.join(__dirname,'index.html'),'utf8')):fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
assert.equal(fixed.hash(candidate),contract.APPROVED);assert.equal(product.additionCount,32);assert.equal(product.publicationApproved,product.release);assert.equal(product.phase,product.release?'release':'candidate');
const replacements=[["const GAME_VER='14.35'","const GAME_VER='14.36'"],["const GAME_ANCHOR='T731'","const GAME_ANCHOR='T732'"],['id="startVersion456">v14.35 · T731','id="startVersion456">v14.36 · T732']];let labeled=candidate;for(const[a,b]of replacements){assert.equal(labeled.split(a).length,2);labeled=labeled.replace(a,b);}assert.equal(contract.normalizeReleaseHTML019(labeled),candidate);
const rejected=[];for(const[name,text]of[['fourth product edit',labeled+' '],['wrong version',labeled.replace("const GAME_VER='14.36'","const GAME_VER='14.37'")],['wrong anchor',labeled.replace("const GAME_ANCHOR='T732'","const GAME_ANCHOR='T733'")],['stale visible label',labeled.replace('v14.36 · T732','v14.35 · T731')]]){assert.throws(()=>contract.normalizeReleaseHTML019(text));rejected.push(name);}
if(product.release){
 const names=['index.html','fp.json','AUTORUN-LOG.md','docs/T732-waterfront-cultural-quarter.md','waterfront-quarter-release-pins019.json'],sources=Object.fromEntries(names.map(k=>[k,fs.readFileSync(path.join(__dirname,k))])),code=fs.readFileSync(path.join(__dirname,'waterfront-quarter-release-contract019.js'),'utf8');
 function load(files){const holder={exports:{}},reader={...fs,readFileSync(file,encoding){const key=path.relative(__dirname,file);if(Object.hasOwn(files,key)){const b=files[key];return encoding?b.toString(encoding):b;}if(names.includes(key))throw Error('Missing release fixture '+key);return fs.readFileSync(file,encoding);},existsSync(file){const key=path.relative(__dirname,file);return Object.hasOwn(files,key)||fs.existsSync(file);}},custom=id=>id==='node:fs'?reader:require(id);new vm.Script('(function(require,module,exports,__dirname){'+code+'\n})').runInThisContext()(custom,holder,holder.exports,__dirname);return holder.exports;}
 const copy=()=>Object.fromEntries(Object.entries(sources).map(([k,v])=>[k,Buffer.from(v)])),mutateJSON=(q,k,edit)=>{const v=JSON.parse(q[k]);edit(v);q[k]=Buffer.from(JSON.stringify(v));};
 const p=load(sources).verifyRelease019();assert.equal(p.releaseBaseline.stats.leaves,3179);assert.equal(p.releaseBaseline.stats.families,165);assert.equal(p.oldBlocks,1728);
 const old=Object.keys(p.releaseBaseline.subs).find(k=>!k.startsWith('waterfrontQuarter019.')),fresh=fixed.expectedAdditions[0];
 for(const[name,edit]of[
  ['old complete leaf',q=>mutateJSON(q,'fp.json',v=>v.subs[old].op++)],['new complete leaf',q=>mutateJSON(q,'fp.json',v=>v.subs[fresh].op++)],
  ['missing new leaf',q=>mutateJSON(q,'fp.json',v=>delete v.subs[fresh])],['unknown leaf',q=>mutateJSON(q,'fp.json',v=>v.subs.extra={})],['runtime worker cannot be promoted',q=>mutateJSON(q,'fp.json',v=>v.subs.worker12={})],
  ['old complete family',q=>mutateJSON(q,'fp.json',v=>v.families.grass.crc='ffffffff')],['new complete family',q=>mutateJSON(q,'fp.json',v=>v.families.waterfrontQuarter019.crc='ffffffff')],
  ['stats',q=>mutateJSON(q,'fp.json',v=>v.stats.leaves--)],['block aggregate',q=>mutateJSON(q,'fp.json',v=>v.blocks.fam='ffffffff')],['extra top-level field',q=>mutateJSON(q,'fp.json',v=>v.extra=true)],
  ['preapproval generatedAt',q=>mutateJSON(q,'fp.json',v=>v.generatedAt='2000-01-01T00:00:00Z')],['invalid generatedAt',q=>mutateJSON(q,'fp.json',v=>v.generatedAt='2026-02-30T00:00:00Z')],
  ['altered owner pins',q=>mutateJSON(q,'waterfront-quarter-release-pins019.json',v=>v.ownerApproval.ownerApproved=false)],
  ['historical log change',q=>q['AUTORUN-LOG.md']=Buffer.concat([q['AUTORUN-LOG.md'],Buffer.from(' ')])],
  ['duplicate release log',q=>q['AUTORUN-LOG.md']=Buffer.concat([q['AUTORUN-LOG.md'],Buffer.from(p.releaseLogEntry)])],
  ['original acceptance history changed',q=>q['docs/T732-waterfront-cultural-quarter.md']=Buffer.from(q['docs/T732-waterfront-cultural-quarter.md'].toString().replace('Acceptance card','Changed acceptance card'))],
  ['duplicate old branch card',q=>q['docs/branch/GPT-019-waterfront-cultural-quarter.md']=Buffer.from('unexpected duplicate')],
  ['release append changed',q=>q['docs/T732-waterfront-cultural-quarter.md']=Buffer.concat([q['docs/T732-waterfront-cultural-quarter.md'],Buffer.from(' ')])]
 ]){const files=copy();edit(files);assert.throws(()=>load(files).verifyRelease019(),undefined,name);rejected.push(name);}
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,phase:product.phase,exactThreeLabelReversal:true,releaseEnvelopeVerified:product.release,rejected}));
