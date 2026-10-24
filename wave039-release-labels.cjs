'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.57';", "const GAME_VER='14.58';"], ["const GAME_ANCHOR='T764';", "const GAME_ANCHOR='T765';"], ["id=\"startVersion456\">v14.57 · T764</span>", "id=\"startVersion456\">v14.58 · T765</span>"]].map(Object.freeze));
const CANDIDATE_SHA='532e4782af3a703e66428e8a1892756a2fa8a38a39fca4e7408ab06606397fd8',BASE_SHA='9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852',RELEASE_SHA='378eba7af7c2cdff7e2cd1cb02ef0ba1ea219c921260a622be5bf35d200e9fb3';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release039 unique exact declared label '+from);assert(!out.includes(to),'release039 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release039 reverse exact C6 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release039 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release039 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release039 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release039 intended first RED '+name+': '+first);result.push({name,first});};
 red('wrong release version',s=>s.replace("const GAME_VER='14.58';","const GAME_VER='14.59';"),'release039 unique exact declared label');
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release039 reverse exact C6 candidate source');
 red('duplicate exact label',s=>s.replace('</head>',"<!-- const GAME_VER='14.58'; -->\n</head>"),'release039 unique exact declared label');
 red('missing exact anchor',s=>s.replace("const GAME_ANCHOR='T765';",''),'release039 unique exact declared label');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
