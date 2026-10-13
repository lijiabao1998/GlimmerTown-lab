'use strict';
// Portable paths for merger-run guards. No owner storage or other checkout.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=__dirname,inputs=path.join(root,'docs/branch/GPT-022-guard-inputs');
function guardOutput022(){
  const out=path.resolve(process.env.USE021_EVIDENCE_DIR||path.join(root,'scratchpad/GPT-022-guard-runs'));
  fs.mkdirSync(out,{recursive:true});
  for(const name of ['independent-pose-oracle021.js','paired-save-oracle021.js','native-city-mature36-021.json','legal-background021.json']){
    const target=path.join(out,name);
    if(!fs.existsSync(target))fs.copyFileSync(path.join(inputs,name),target);
  }
  return out;
}
function baselineHTML022(){
  const html=cp.execFileSync('git',['show','01e581eb19bbb7efebc50fd893483f3cb1859388:index.html'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
  if(crypto.createHash('sha256').update(html).digest('hex')!=='7e4f63e8921d9dd2d56133c3bf07998316ee27b154ca45411a9b61134b336067')throw Error('Immutable native baseline differs');
  return html;
}
module.exports={guardOutput022,baselineHTML022};
