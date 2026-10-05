'use strict';
// Authorized T723 release envelope. Data/source only; no game or browser runtime.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process'),{isDeepStrictEqual:eq}=require('util');
const ROOT=__dirname,BASE='d9dfe87689fa841edb8775d0f95db77d9f2deb5b';
const APPROVED_SHA='d859e7570305fbd8c7b6ae9976c5d3e6d703c81b',APPROVED='f6d935d79f7766261acfb2f76d12188dd78ab30b53d595bc0191574383b1bb46';
const PIN_HASH='be515fe6c85dc7f6ab9f1026c8bd6b5f10839f3be723024d970386ee5958f8bf',BASE_FP_HASH='a6419a6ba35a98dd30711ff9c8ebdd0ef467f71a64263968a466b4b36ec83465';
const CARD_HASH='dc9aaf23b7aeaa5bcaaf313dfc5825c54f1d53597d30a8e0197330c8a8527ee3',APPROVED_AT='2026-10-05 09:43:32 UTC';
const expected=[...Array.from({length:4},(_,v)=>'bld.277_1_'+v),...['gate','garden','bench'].flatMap(t=>Array.from({length:4},(_,v)=>'museum010.'+t+'_'+v))].sort();
const labels=[["const GAME_VER='14.27'","const GAME_VER='14.26'"],["const GAME_ANCHOR='T723'","const GAME_ANCHOR='T722'"],['id="startVersion456">v14.27 · T723','id="startVersion456">v14.26 · T722']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function normalizeReleaseHTML010(html){
  for(const[from,to]of labels){if(html.split(from).length!==2)throw Error('Release label is not unique: '+from);html=html.replace(from,to);}
  if(hash(html)!==APPROVED)throw Error('Release changed the image-approved museum product beyond three exact labels');
  return html;
}
function verifyRelease010(){
  const pinBytes=fs.readFileSync(path.join(ROOT,'museum-release-pins010.json'));if(hash(pinBytes)!==PIN_HASH)throw Error('Approved native16 museum release pins changed');
  const promotion=JSON.parse(pinBytes);
  if(promotion.nativeCheckedSHA!==APPROVED_SHA||promotion.nativeSourceSHA256!==APPROVED||promotion.nativeRun!==37290300808||promotion.nativeArtifact!==11335254964||promotion.nativeFingerprintSHA256!=='02299d5d5dc07512b6d7f1847fd02a47dfde9b980a0e8b2929ceefbb0d5305ef'||promotion.nativeManifestSHA256!=='2c1c09149bda072d931b8a4fff8a9a0ae9fa0fcf7f0ffdc4e9bf7c18d8449e0f'||!eq(Object.keys(promotion.subs).sort(),expected)||!eq(Object.keys(promotion.families).sort(),['bld','museum010']))throw Error('Museum native release provenance/declaration mismatch');
  normalizeReleaseHTML010(fs.readFileSync(path.join(ROOT,'index.html'),'utf8'));
  const baselineBytes=baseFile('fp.json');if(hash(baselineBytes)!==BASE_FP_HASH)throw Error('Immutable T722 complete fingerprint pin changed');
  const baseline=JSON.parse(baselineBytes),current=JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),promoted=structuredClone(baseline);
  if(Object.keys(baseline.subs).length!==2879||Object.keys(current.subs).length!==2895||!Number.isFinite(Date.parse(current.generatedAt)))throw Error('Invalid museum release baseline inventory/date');
  promoted.generatedAt=current.generatedAt;promoted.version='14.27';promoted.anchor='T723';promoted.stats=promotion.stats;Object.assign(promoted.families,promotion.families);Object.assign(promoted.subs,promotion.subs);
  if(!eq(current,promoted))throw Error('T723 baseline is not exactly the approved16 additive promotion preserving all T722 fields');
  const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),entries=log.match(/<!-- T723 release entry BEGIN -->[\s\S]*?<!-- T723 release entry END -->\n/g)||[];
  if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||!entries[0].includes('r170')||!entries[0].includes('PR15')||!entries[0].includes('T723')||!entries[0].includes('14.27')||!entries[0].includes(APPROVED_AT))throw Error('Historical log differs beyond one authorized T723 release entry');
  const card=fs.readFileSync(path.join(ROOT,'docs/T723-british-natural-history-museum.md'),'utf8');
  const heading='# T723 — British regional natural-history museum and formal forecourt (original GPT-010)',oldHeading='# GPT-010 — British regional natural-history museum and formal forecourt';
  if(!card.startsWith(heading+'\n')||card.split('\n\n## Publication approval and T723 preparation').length!==2)throw Error('Release card heading or publication section changed');
  const originalCard=card.replace(heading,oldHeading).split('\n\n## Publication approval and T723 preparation')[0];
  if(hash(originalCard)!==CARD_HASH||fs.existsSync(path.join(ROOT,'docs/branch/GPT-010-british-natural-history-museum.md'))||!card.includes(APPROVED_AT)||!card.includes('PR15'))throw Error('Original pre-code acceptance/history or museum publication approval was not retained');
  const workflow='.github/workflows/streetlife-public009.yml',before=baseFile(workflow).toString(),after=fs.readFileSync(path.join(ROOT,workflow),'utf8'),anchor='github.event.workflow_run.head_repository.full_name == github.repository)';
  const bounded='github.event.workflow_run.head_repository.full_name == github.repository &&\n       github.event.workflow_run.head_sha == '+JSON.stringify(BASE).replaceAll('"',"'")+')';
  if(before.split(anchor).length!==2||after!==before.replace(anchor,bounded))throw Error('Retired T722 public observer differs beyond the exact approved automatic-head condition');
  return{release:true,version:'14.27',anchor:'T723',htmlExact:true,fpExact:true,logExact:true,releaseLogEntry:entries[0],normalizedHTMLSHA256:APPROVED,promotionSHA256:PIN_HASH,approvedSHA:APPROVED_SHA,approvedAt:APPROVED_AT,publicWorkflowExact:true,publicWorkflowSHA256:hash(after),promotion,releaseBaseline:current,oldLeaves:2879,newLeaves:16};
}
module.exports={verifyRelease010,normalizeReleaseHTML010,BASE,APPROVED,APPROVED_SHA,APPROVED_AT,expected};
if(require.main===module){const q=verifyRelease010();delete q.releaseBaseline;delete q.promotion;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
