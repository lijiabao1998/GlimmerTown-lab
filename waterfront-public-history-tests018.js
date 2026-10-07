'use strict';
// Source-only historical regression isolation. No game, browser or server call.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
function runHistoricalTests018(releaseRoot){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'waterfront018-historical-source-'));
 try{
  const gitDir=execFileSync('git',['rev-parse','--absolute-git-dir'],{cwd:releaseRoot,encoding:'utf8'}).trim();fs.writeFileSync(path.join(root,'.git'),'gitdir: '+gitDir+'\n');
  const files=execFileSync('git',['ls-tree','--name-only','1400301238f7a46ab6d3c489422a48f9f90cac9d'],{cwd:releaseRoot,encoding:'utf8'}).trim().split('\n').filter(f=>/\.(js|json|html)$/.test(f));
  for(const f of files)fs.writeFileSync(path.join(root,f),execFileSync('git',['show','1400301238f7a46ab6d3c489422a48f9f90cac9d:'+f],{cwd:releaseRoot,maxBuffer:32*1024*1024}));
  const output=execFileSync(process.execPath,[path.join(__dirname,'retained017/quayside-public-source-qa017.js')],{encoding:'utf8',maxBuffer:8*1024*1024,env:{...process.env,EXPECTED_RELEASE_ROOT:root}});return JSON.parse(output.trim().split('\n').at(-1));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
}
module.exports={runHistoricalTests018};
if(require.main===module)console.log(JSON.stringify(runHistoricalTests018(path.resolve(process.env.EXPECTED_RELEASE_ROOT))));
