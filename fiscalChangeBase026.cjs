'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
function resolveChangeBase026({env=process.env,event,git}={}){
  git=git||((args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim());
  if(event===undefined)event=env.GITHUB_EVENT_PATH?JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8')):{};
  let candidate,reason;
  if(env.GITHUB_EVENT_NAME==='pull_request'){
    candidate=event.pull_request?.base?.sha;reason='pull_request.base.sha';
    assert(/^[a-f0-9]{40}$/.test(candidate||''),'PR change base must be supplied by the event');
  }else if(env.GITHUB_REF==='refs/heads/main'){
    const before=event.before;
    if(env.GITHUB_EVENT_NAME==='push'&&/^[a-f0-9]{40}$/.test(before||'')&&!/^0+$/.test(before)){
      git(['cat-file','-e',before+'^{commit}']);candidate=before;reason='main push before';
    }else{candidate='HEAD^';reason='main parent';}
  }else{candidate=git(['merge-base','origin/main','HEAD']);reason='branch merge-base origin/main';}
  const sha=git(['rev-parse',candidate+'^{commit}']);assert(/^[a-f0-9]{40}$/.test(sha),'resolved change base is a commit SHA');
  return{sha,reason};
}
const REPAIR_MARKER026='Glimmer-Fiscal-Load-Repair: GPT-026';
function resolveRepairScope026({baseSha,git}={}){
  assert(/^[a-f0-9]{40}$/.test(baseSha||''),'repair scope requires an exact base commit');
  git=git||((args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim());
  const matches=git(['log','--format=%H','--extended-regexp','--grep=^'+REPAIR_MARKER026+'$',baseSha]).split(/\s+/).filter(Boolean);
  if(!matches.length)return{historical:true,repairCommit:null,marker:REPAIR_MARKER026,reason:'no marked fiscal repair in the change-base ancestry'};
  const repairCommit=matches[0];assert(/^[a-f0-9]{40}$/.test(repairCommit),'repair marker identifies a commit');
  git(['merge-base','--is-ancestor',repairCommit,baseSha]);
  return{historical:false,repairCommit,marker:REPAIR_MARKER026,reason:'marked fiscal repair is an ancestor of the change base'};
}
module.exports={resolveChangeBase026,resolveRepairScope026,REPAIR_MARKER026};
