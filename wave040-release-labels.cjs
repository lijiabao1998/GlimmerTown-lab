'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.58';", "const GAME_VER='14.59';"], ["const GAME_ANCHOR='T765';", "const GAME_ANCHOR='T766';"], ["id=\"startVersion456\">v14.58 · T765</span>", "id=\"startVersion456\">v14.59 · T766</span>"]].map(Object.freeze));
const CANDIDATE_SHA='a8420b1232168b8404c86f7388538f275a2ab82dda004ca4c4c93b7308355d4c',BASE_SHA='378eba7af7c2cdff7e2cd1cb02ef0ba1ea219c921260a622be5bf35d200e9fb3',RELEASE_SHA='cb3bc90bcd55c9b5e65d7389d954eaebb22d21c9eba6fff5bfea72292fdba884';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release040 unique exact declared label '+from);assert(!out.includes(to),'release040 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release040 reverse exact C3 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release040 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release040 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release040 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release040 intended first RED '+name+': '+first);result.push({name,first});};
 red('wrong release version',s=>s.replace("const GAME_VER='14.59';","const GAME_VER='14.60';"),'release040 unique exact declared label');
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release040 reverse exact C3 candidate source');
 red('duplicate exact label',s=>s.replace('</head>',"<!-- const GAME_VER='14.59'; -->\n</head>"),'release040 unique exact declared label');
 red('missing exact anchor',s=>s.replace("const GAME_ANCHOR='T766';",''),'release040 unique exact declared label');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
