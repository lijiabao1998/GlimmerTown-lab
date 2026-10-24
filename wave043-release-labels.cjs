'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.61';", "const GAME_VER='14.62';"], ["const GAME_ANCHOR='T768';", "const GAME_ANCHOR='T769';"], ["id=\"startVersion456\">v14.61 · T768</span>", "id=\"startVersion456\">v14.62 · T769</span>"]].map(Object.freeze));
const CANDIDATE_SHA='df0cb1bb7aac456f204485816033a904d398c9f8b3e03ca7e6c53dc66e8b1bf2',BASE_SHA='2da67e4b29c7ffcab10523b0897637a276adb28de5ce40816ba43ccfd0c329ea',RELEASE_SHA='cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release043 unique exact declared label '+from);assert(!out.includes(to),'release043 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release043 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release043 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release043 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release043 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release043 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release043 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release043 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release043 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release043 reverse exact C2 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
