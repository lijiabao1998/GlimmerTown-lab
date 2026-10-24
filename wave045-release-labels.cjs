'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.63';", "const GAME_VER='14.64';"], ["const GAME_ANCHOR='T770';", "const GAME_ANCHOR='T771';"], ["id=\"startVersion456\">v14.63 · T770</span>", "id=\"startVersion456\">v14.64 · T771</span>"]].map(Object.freeze));
const CANDIDATE_SHA='89c3551256b31d3635170fa486d5298496aef0a5681d656a6b267349d433ae70',BASE_SHA='6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723',RELEASE_SHA='c4797f3f1898af5dc51080f2a19eae072e21cbd8e8b03d6ffd54a0759bb7d6ff';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release045 unique exact declared label '+from);assert(!out.includes(to),'release045 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release045 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release045 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release045 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release045 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release045 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release045 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release045 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release045 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release045 reverse exact C2 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
