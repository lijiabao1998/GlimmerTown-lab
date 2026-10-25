'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.64';", "const GAME_VER='14.65';"], ["const GAME_ANCHOR='T771';", "const GAME_ANCHOR='T772';"], ["id=\"startVersion456\">v14.64 \u00b7 T771</span>", "id=\"startVersion456\">v14.65 \u00b7 T772</span>"]].map(Object.freeze));
const CANDIDATE_SHA="4abd778b70231739dc4b2764ab9a9fd5dec7b5725e59e38aba89b9bcc479c86d",BASE_SHA="c4797f3f1898af5dc51080f2a19eae072e21cbd8e8b03d6ffd54a0759bb7d6ff",RELEASE_SHA="0ec9f7cbe03139dd93d607e7b343911dce4024028b40a16a4c88439dca23390c";
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release046 unique exact declared label '+from);assert(!out.includes(to),'release046 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release046 reverse exact C5 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release046 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release046 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release046 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release046 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release046 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release046 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release046 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release046 reverse exact C5 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
