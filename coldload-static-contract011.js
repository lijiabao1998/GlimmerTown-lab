#!/usr/bin/env node
'use strict';
// Source/data checks only. The parent must fill the approved manifest/card pins.
// Pending pins fail closed; this module never invents or chooses a product patch.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),{execFileSync}=require('child_process');
const ROOT=__dirname,BASE='759394f8bd48dbe77fb21e8604015e2d1ca56d21';
const BASE_HTML_SHA256='66fff895f7805b6d7945ba737f9d5414af6e911295c48d7509334678976f4921';
const BASE_FP_SHA256='21026775f0461ade01c2428642d0ba9355fdb5d6c49c61b6170986b3252e4ee2';
const PATCH_MANIFEST_SHA256='38c4edebea8dd7cc41789f49ea5f0b2186aeafeb6ab0c7dad8bafe886be39122';
const RELEASE_CARD_SHA256='PARENT_PENDING_ORIGINAL_CARD_SHA256',RELEASE_PR='PARENT_PENDING_PR',RELEASE_ROUND='PARENT_PENDING_ROUND';
const APPROVED_AT='2026-10-05 10:15:55 UTC';
const OLD_CARD='docs/branch/GPT-011-cold-load-power-rebuild.md',RELEASE_CARD='docs/T724-cold-load-power-rebuild.md';
const OLD_HEADING='# GPT-011 — Cold-load power topology restore',RELEASE_HEADING='# T724 — Cold-load power topology restore (original GPT-011)';
const LABELS=[["const GAME_VER='14.28'","const GAME_VER='14.27'"],["const GAME_ANCHOR='T724'","const GAME_ANCHOR='T723'"],['id="startVersion456">v14.28 · T724','id="startVersion456">v14.27 · T723']];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseFile=p=>execFileSync('git',['show',BASE+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
function readPatch011(){
 const bytes=fs.readFileSync(path.join(ROOT,'coldload-patch011.json'));
 if(!/^[a-f0-9]{64}$/.test(PATCH_MANIFEST_SHA256)||hash(bytes)!==PATCH_MANIFEST_SHA256)throw Error('Parent-approved fixed cold-load patch manifest pin is missing or changed');
 const q=JSON.parse(bytes),keys=['base','baseHTMLSHA256','candidateSHA256','from','fromSHA256','to','toSHA256'];
 if(JSON.stringify(Object.keys(q).sort())!==JSON.stringify(keys.sort())||q.base!==BASE||q.baseHTMLSHA256!==BASE_HTML_SHA256||typeof q.from!=='string'||typeof q.to!=='string'||!q.from||!q.to||q.from===q.to||hash(q.from)!==q.fromSHA256||hash(q.to)!==q.toSHA256||!/^[a-f0-9]{64}$/.test(q.candidateSHA256))throw Error('Invalid fixed single-hunk cold-load manifest');
 const old=baseFile('index.html').toString();if(hash(old)!==BASE_HTML_SHA256||old.split(q.from).length!==2)throw Error('Cold-load patch anchor is not unique in immutable T723');
 const candidate=old.replace(q.from,q.to);if(hash(candidate)!==q.candidateSHA256)throw Error('Exact single-hunk candidate hash mismatch');
 for(const [releaseLabel,oldLabel]of LABELS)if(candidate.split(oldLabel).length!==2||candidate.includes(releaseLabel))throw Error('Product patch must preserve all three T723 candidate labels');
 return{...q,candidate,manifestSHA256:hash(bytes)};
}
function releaseEnvelope011(log){
 if(!/^[a-f0-9]{64}$/.test(RELEASE_CARD_SHA256)||!/^PR\d+$/.test(RELEASE_PR)||!/^r\d+$/.test(RELEASE_ROUND))throw Error('Parent must pin original card, PR and release round before T724');
 const entries=log.match(/<!-- T724 release entry BEGIN -->[\s\S]*?<!-- T724 release entry END -->\n/g)||[];
 if(entries.length!==1||log.replace(entries[0],'')!==baseFile('AUTORUN-LOG.md').toString()||![RELEASE_PR,RELEASE_ROUND,'T724','14.28',APPROVED_AT].every(t=>entries[0].includes(t)))throw Error('Only one bounded approved T724 release-log entry is allowed');
 const card=fs.readFileSync(path.join(ROOT,RELEASE_CARD),'utf8'),separator='\n\n## Publication approval and T724 preparation';
 if(!card.startsWith(RELEASE_HEADING+'\n')||card.split(separator).length!==2||hash(card.replace(RELEASE_HEADING,OLD_HEADING).split(separator)[0])!==RELEASE_CARD_SHA256||fs.existsSync(path.join(ROOT,OLD_CARD))||!card.includes(RELEASE_PR)||!card.includes(APPROVED_AT))throw Error('Original cold-load acceptance/history or approval not preserved');
 return{releaseLogEntry:entries[0],logExact:true,cardExact:true};
}
function verifyStatic011(){
 const patch=readPatch011(),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString(),release=html.includes("const GAME_VER='14.28'");
 let normalized=html;if(release)for(const[from,to]of LABELS){if(normalized.split(from).length!==2)throw Error('Nonunique T724 release label: '+from);normalized=normalized.replace(from,to);}
 if(normalized!==patch.candidate)throw Error('Product differs beyond the pinned single load-order hunk and optional three release labels');
 const log=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8'),envelope=release?releaseEnvelope011(log):{releaseLogEntry:'',logExact:log===baseFile('AUTORUN-LOG.md').toString(),cardExact:true};
 if(!envelope.logExact)throw Error('Candidate historical log changed');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 const allowed=new Set(['index.html','smoke.js',...(release?['AUTORUN-LOG.md']:[])]);
 for(const p of oldFiles){if(allowed.has(p))continue;const old=baseFile(p),now=fs.readFileSync(path.join(ROOT,p));if(!old.equals(now))throw Error('Protected T723 source changed: '+p);protectedManifest[p]=hash(now);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8');
 const row="      ['coldload011', `(window.GV && window.GV.coldLoadSelftest011) ? window.GV.coldLoadSelftest011() : {ok:false,checks:['API missing']}`],";
 if(smoke!==oldSmoke&&(smoke.split(row+'\n').length!==2||smoke.replace(row+'\n','')!==oldSmoke))throw Error('Smoke must remain unchanged or append exactly the declared read-only selftest row');
 if(hash(fs.readFileSync(path.join(ROOT,'fp.json')))!==BASE_FP_SHA256)throw Error('No sprite baseline promotion is permitted for the cold-load fix');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][1],{filename:'coldload-inline-'+i+'.js'});
 return{ok:true,base:BASE,fixProofExact:true,htmlExact:true,protectedExact:true,fpExact:true,release,phase:release?'release':'candidate',version:release?'14.28':'14.27',anchor:release?'T724':'T723',...envelope,sourceSHA256:hash(current),baselineSHA256:BASE_HTML_SHA256,patchManifestSHA256:patch.manifestSHA256,patchFromSHA256:patch.fromSHA256,patchToSHA256:patch.toSHA256,patchHunks:1,additionCount:0,protectedManifest,inlineScripts:scripts.length};
}
// Normalize only the separately validated T724 log envelope, never arbitrary text.
function museumLog011(full){const q=verifyStatic011();const actual=fs.readFileSync(path.join(ROOT,'AUTORUN-LOG.md'),'utf8');if(full!==actual)throw Error('Expected the complete current historical log');const normalized=q.release?full.replace(q.releaseLogEntry,''):full;if(normalized!==baseFile('AUTORUN-LOG.md').toString())throw Error('T724 log normalization did not recover exact T723');return normalized;}
module.exports={BASE,BASE_HTML_SHA256,BASE_FP_SHA256,PATCH_MANIFEST_SHA256,readPatch011,verifyStatic011,museumLog011,baseFile,hash};
if(require.main===module){const q=verifyStatic011();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;delete q.releaseLogEntry;console.log(JSON.stringify(q,null,2));}
