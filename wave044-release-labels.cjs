'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAIRS=Object.freeze([["const GAME_VER='14.62';", "const GAME_VER='14.63';"], ["const GAME_ANCHOR='T769';", "const GAME_ANCHOR='T770';"], ["id=\"startVersion456\">v14.62 · T769</span>", "id=\"startVersion456\">v14.63 · T770</span>"]].map(Object.freeze));
const CANDIDATE_SHA='f7ffd7e91fc7c94f36441fbe72ea9b12a2efb28139bbda603e53386290f2dd5c',BASE_SHA='cabdaac455033c076df88cf9c8f12e45bb4d661a101fac52e810dc507b86c1b8',RELEASE_SHA='6a6d7da0a47fbf13f9c629ed2db9602346e401f274d3d41e616e0b31f731c723';
function swap(text,reverse=false){let out=String(text);for(const p of PAIRS){const[from,to]=reverse?[p[1],p[0]]:p;assert.equal(out.split(from).length,2,'release044 unique exact declared label '+from);assert(!out.includes(to),'release044 destination label already present');out=out.replace(from,to);}return out;}
function toCandidate(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),CANDIDATE_SHA,'release044 reverse exact C2 candidate source');assert.equal(hash(Buffer.from(text)),RELEASE_SHA,'release044 exact complete release index');return out;}
function baseToRelease(text){assert.equal(hash(Buffer.from(text)),BASE_SHA,'release044 independent BASE source');return swap(text);}
function restoreBase(text){const out=swap(text,true);assert.equal(hash(Buffer.from(out)),BASE_SHA,'release044 restore exact independent BASE');return out;}
function negatives(text){const result=[];const red=(name,mutate,target)=>{let first='';try{toCandidate(mutate(text));}catch(e){first=e.message.split('\n')[0];}assert(first.startsWith(target),'release044 intended first RED '+name+': '+first);result.push({name,first});};
 for(const [candidate,released]of PAIRS){
  red('missing exact release label '+released,s=>s.replace(released,''),'release044 unique exact declared label');
  red('duplicate exact release label '+released,s=>s.replace('</head>','<!-- '+released+' -->\n</head>'),'release044 unique exact declared label');
  red('stale candidate label '+candidate,s=>s.replace(released,candidate),'release044 unique exact declared label');
 }
 red('extra valid HTML',s=>s.replace('</head>',' <!-- outside release boundary -->\n</head>'),'release044 reverse exact C2 candidate source');
 assert.equal(hash(Buffer.from(toCandidate(text))),CANDIDATE_SHA);return result;}
module.exports={hash,PAIRS,swap,toCandidate,baseToRelease,restoreBase,negatives,CANDIDATE_SHA,BASE_SHA,RELEASE_SHA};
