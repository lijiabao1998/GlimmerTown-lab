'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.66';", "const GAME_VER='14.67';"], ["const GAME_ANCHOR='T773';", "const GAME_ANCHOR='T774';"], ["id=\"startVersion456\">v14.66 · T773</span>", "id=\"startVersion456\">v14.67 · T774</span>"]].map(Object.freeze));
const CANDIDATE_SHA="b1a50df75c5765b400b82b4d36dc4efd69593ea5b516c318c074d2e9b6ac6d76",BASE_SHA="3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63",RELEASE_SHA="debf0342376df9ccc8d42d40e3e45bdef8c28aa5f16f0fe2bf7fb6b23a214624";
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release048 unique exact declared label '+from);assert(!out.includes(to),'release048 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release048 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release048 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release048 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release048 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release048 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release048 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release048 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release048 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release048 reverse exact C2 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
