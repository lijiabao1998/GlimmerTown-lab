#!/usr/bin/env node
'use strict';
// Read-only GitHub Actions API proof. This is not a deployment or Pages writer.
const fs=require('node:fs'),path=require('node:path');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated Actions only');
const repository=process.env.GITHUB_REPOSITORY,sha=process.env.EXPECTED_DEPLOY_SHA;
if(repository!=='lijiabao1998/GlimmerTown-lab'||!/^[0-9a-f]{40}$/.test(sha||''))throw Error('Exact authorized repository and deployment SHA required');
const OUT=path.join(__dirname,'theatre-evidence/public');fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const url='https://api.github.com/repos/'+repository+'/actions/workflows/pages.yml/runs?branch=main&status=success&head_sha='+sha+'&per_page=100';
 const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
 let accessMode='public unauthenticated GET';
 let response=await fetch(url,{method:'GET',redirect:'error',signal:AbortSignal.timeout(60000),headers});
 // Only a proven exhausted shared public API rate limit can use the same
 // read-only GET with the platform's already-issued ephemeral job token.
 if(response.status===403&&response.headers.get('x-ratelimit-remaining')==='0'&&process.env.GITHUB_TOKEN){
  await response.arrayBuffer();accessMode='existing ephemeral GitHub Actions token, read-only GET after public rate-limit exhaustion';
  response=await fetch(url,{method:'GET',redirect:'error',signal:AbortSignal.timeout(60000),
   headers:{...headers,Authorization:'Bearer '+process.env.GITHUB_TOKEN}});
 }
 if(!response.ok)throw Error('Read-only Pages-run lookup failed with HTTP '+response.status);
 const data=await response.json();
 const run=data.workflow_runs?.find(r=>r.name==='pages'&&r.head_sha===sha&&r.head_branch==='main'&&
  r.conclusion==='success'&&r.status==='completed'&&r.head_repository?.full_name===repository&&
  (r.head_commit?.message||'').startsWith('T726 '));
 if(!run)throw Error('No successful exact same-repository T726 main Pages deployment found; do not test another release');
 const proof={repository,id:run.id,head_sha:run.head_sha,head_branch:run.head_branch,name:run.name,status:run.status,
  conclusion:run.conclusion,title:run.head_commit.message.split('\n')[0],html_url:run.html_url,
  created_at:run.created_at,updated_at:run.updated_at,verifiedAt:new Date().toISOString(),apiURL:url,accessMode};
 fs.writeFileSync(path.join(OUT,'pages-proof.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
})().catch(e=>{console.error(String(e.stack||e));process.exitCode=1;});
