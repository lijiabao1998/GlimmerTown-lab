#!/usr/bin/env node
'use strict';
// GPT-005: compare actual old/new simulation in isolated fresh CI profiles.
// The product file is restored in finally; no baseline or save is rewritten.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync}=require('child_process');
const {withGame}=require('./harness');
const ROOT=__dirname,BASE='7da1b6985e6ddab6cdb036c66c165930d71107fb';
const HASH='23dda09f84a6152e7324d988d4741a45b42ec6f0ee45ac02b8f7dd824eb2fc27';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const current=fs.readFileSync(path.join(ROOT,'index.html'));
const old=execFileSync('git',['show',BASE+':index.html'],{cwd:ROOT,maxBuffer:32*1024*1024});
if(hash(old)!==HASH)throw Error('Pinned baseline HTML mismatch');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Run this browser comparison only in authorized isolated GitHub Actions');
function runWorld(seed){
  // All simulation is advanced synchronously. Cosmetic sampling is pinned too;
  // this does not replace the product simulation R(), which newWorld seeds.
  const random=Math.random;let m=123456789;
  Math.random=()=>{m=(Math.imul(m,1664525)+1013904223)>>>0;return m/4294967296;};
  try{
    const q=GV.metroArtSeedWorld516(seed);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);
    const snap=()=>{
      const tiles=[];for(let y=0;y<q.N;y++)for(let x=0;x<q.N;x++)tiles.push(GV.tile(x,y));
      const st=GV.stats();delete st.cars;delete st.buses;
      return{stats:st,tiles};
    };
    const result=[snap()];for(const n of[1,4,15]){GV.step(n);result.push(snap());}
    return result;
  }finally{Math.random=random;}
}
(async()=>{
  const out={base:BASE,baselineSHA256:HASH,currentSHA256:hash(current),runs:[],ok:false};
  const dest=path.join(ROOT,'highstreet-evidence','regression','guards');fs.mkdirSync(dest,{recursive:true});
  try{
    for(const [label,bytes]of[['baseline',old],['candidate',current]]){
      fs.writeFileSync(path.join(ROOT,'index.html'),bytes);
      const session=await withGame({port:8199,timeout:600,fresh:true,log:console.log},async({cdp})=>{
        const arr=[];for(const seed of[5162026,5162027]){
          const data=await cdp.evalJs('('+runWorld.toString()+')('+seed+')');
          const checkpoints=data.map(q=>({stats:q.stats,tilesSHA256:hash(JSON.stringify(q.tiles))}));
          arr.push({seed,checkpoints});
        }return arr;
      });
      if(!session.ok||!session.result)throw Error(label+' browser failure: '+JSON.stringify(session.fails));
      out.runs.push({label,result:session.result});
    }
    out.ok=JSON.stringify(out.runs[0].result)===JSON.stringify(out.runs[1].result);
    if(!out.ok)throw Error('Existing-city simulation changed; compare compatibility.json');
  }catch(e){out.error=String(e.stack||e);}
  finally{
    fs.writeFileSync(path.join(ROOT,'index.html'),current);
    out.restored=hash(fs.readFileSync(path.join(ROOT,'index.html')))===out.currentSHA256;
    fs.writeFileSync(path.join(dest,'compatibility.json'),JSON.stringify(out,null,2));
  }
  console.log(JSON.stringify(out,null,2));process.exit(out.ok&&out.restored?0:1);
})().catch(e=>{fs.writeFileSync(path.join(ROOT,'index.html'),current);console.error(e);process.exit(1);});
