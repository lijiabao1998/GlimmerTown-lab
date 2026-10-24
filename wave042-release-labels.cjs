'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.60';", "const GAME_VER='14.61';"], ["const GAME_ANCHOR='T767';", "const GAME_ANCHOR='T768';"], ["id=\"startVersion456\">v14.60 · T767</span>", "id=\"startVersion456\">v14.61 · T768</span>"]].map(Object.freeze));
const CANDIDATE_SHA='e6ea5ce1d78fa3be99492b62bff19e1f11933c888b2df429f6531c9ca3484b5d',BASE_SHA='d572c96289a67889ec09e2845675717f58d8e84ca78218623fca34f41fde1064',RELEASE_SHA='2da67e4b29c7ffcab10523b0897637a276adb28de5ce40816ba43ccfd0c329ea';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release042 unique exact declared label '+from);assert(!out.includes(to),'release042 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release042 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release042 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release042 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release042 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release042 intended first RED '+name+': '+first);result.push({name,first});};
 red('wrong release version',s=>s.replace("const GAME_VER='14.61';","const GAME_VER='14.62';"),'release042 unique exact declared label');
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release042 reverse exact C2 candidate source');
 red('duplicate exact label',s=>s.replace('</head>',"<!-- const GAME_VER='14.61'; -->\n</head>"),'release042 unique exact declared label');
 red('missing exact anchor',s=>s.replace("const GAME_ANCHOR='T768';",''),'release042 unique exact declared label');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
