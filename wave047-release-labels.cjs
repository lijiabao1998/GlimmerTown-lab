'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.65';", "const GAME_VER='14.66';"], ["const GAME_ANCHOR='T772';", "const GAME_ANCHOR='T773';"], ["id=\"startVersion456\">v14.65 · T772</span>", "id=\"startVersion456\">v14.66 · T773</span>"]].map(Object.freeze));
const CANDIDATE_SHA="88d5dddfbb174259cd517489a36226e02568a4bf12d5b0a54f36e795d47e721d",BASE_SHA="0ec9f7cbe03139dd93d607e7b343911dce4024028b40a16a4c88439dca23390c",RELEASE_SHA="3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63";
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release047 unique exact declared label '+from);assert(!out.includes(to),'release047 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release047 reverse exact B2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release047 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release047 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release047 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release047 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release047 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release047 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release047 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release047 reverse exact B2 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
