'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.59';", "const GAME_VER='14.60';"], ["const GAME_ANCHOR='T766';", "const GAME_ANCHOR='T767';"], ["id=\"startVersion456\">v14.59 · T766</span>", "id=\"startVersion456\">v14.60 · T767</span>"]].map(Object.freeze));
const CANDIDATE_SHA='e5d9a139d40145e396673b7891aae0a78559a71e85f9fd3031b93ae0ca5700d2',BASE_SHA='cb3bc90bcd55c9b5e65d7389d954eaebb22d21c9eba6fff5bfea72292fdba884',RELEASE_SHA='d572c96289a67889ec09e2845675717f58d8e84ca78218623fca34f41fde1064';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release041 unique exact declared label '+from);assert(!out.includes(to),'release041 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release041 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release041 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release041 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release041 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release041 intended first RED '+name+': '+first);result.push({name,first});};
 red('wrong release version',s=>s.replace("const GAME_VER='14.60';","const GAME_VER='14.61';"),'release041 unique exact declared label');
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release041 reverse exact C2 candidate source');
 red('duplicate exact label',s=>s.replace('</head>',"<!-- const GAME_VER='14.60'; -->\n</head>"),'release041 unique exact declared label');
 red('missing exact anchor',s=>s.replace("const GAME_ANCHOR='T767';",''),'release041 unique exact declared label');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
