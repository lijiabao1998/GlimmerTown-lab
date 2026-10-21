'use strict';
// Exact release-label proof only; never executes a game or alters a renderer.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([
  ["const GAME_VER='14.56';","const GAME_VER='14.57';"],
  ["const GAME_ANCHOR='T763';","const GAME_ANCHOR='T764';"],
  ['id="startVersion456">v14.56 · T763</span>','id="startVersion456">v14.57 · T764</span>']
].map(Object.freeze));
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release038 unique exact declared label '+from);assert(!out.includes(to),'release038 destination label already present');out=out.replace(from,to);}return out;}
const CANDIDATE_SHA='6e2684807542f6441ca110488d03dd418845103a7ad486b3f928a80b41fc8a6e',BASE_SHA='2b959e01196cb55dd8a0fc1eca5f2a4d7c9e952acd90de04a7ba76e7dc7cef60',RELEASE_SHA='9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852';
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release038 reverse exact C27 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release038 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release038 actual independent BASE hash');const out=swap(text);assert.equal(swap(out,true),String(text),'release038 exact BASE label reversal');return out;}
function releaseBaseToOriginal(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release038 declared BASE reverse exact Git bytes');return out;}
function negatives(release){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(release));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release038 intended first RED '+name+': '+first);result.push({name,first});};
 red('wrong release version',s=>s.replace("const GAME_VER='14.57';","const GAME_VER='14.58';"),'release038 unique exact declared label');
 red('one extra valid HTML byte',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release038 reverse exact C27 candidate source');
 red('duplicated exact version label',s=>s.replace('</head>',"<!-- const GAME_VER='14.57'; -->\n</head>"),'release038 unique exact declared label');
 red('missing exact anchor',s=>s.replace("const GAME_ANCHOR='T764';",''),'release038 unique exact declared label');
 assert.equal(hash(Buffer.from(toCandidate(release))),CANDIDATE_SHA,'release038 restored exact source after controls');return result;
}
module.exports={PAIRS,hash,swap,toCandidate,baseToRelease,releaseBaseToOriginal,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
