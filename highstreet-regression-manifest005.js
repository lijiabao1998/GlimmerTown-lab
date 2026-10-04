#!/usr/bin/env node
'use strict';
// Aggregate only completed CI evidence; never modifies product or baselines.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Authorized isolated CI only');
const out=path.join(__dirname,'highstreet-evidence','regression');
const names=['smoke-1','smoke-2','smoke-3','fingerprint','compatibility'];
const checks=names.map(name=>{const read=suffix=>{const f=path.join(out,'logs',name+suffix);return fs.existsSync(f)?fs.readFileSync(f,'utf8').trim():null;},value=read('.exit'),tee=read('.tee.exit');return{name,ok:value==='0'&&tee==='0',exit:value,teeExit:tee};});
const cp=path.join(out,'guards','compatibility.json'),comparison=fs.existsSync(cp)?JSON.parse(fs.readFileSync(cp,'utf8')):null;
checks.push({name:'actual old-city equality and candidate restoration',ok:comparison?.ok===true&&comparison?.restored===true});
const artifacts=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name!=='manifest.json'){const b=fs.readFileSync(p);artifacts.push({path:path.relative(out,p).split(path.sep).join('/'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});}}}
walk(out);
const report={createdAt:new Date().toISOString(),mode:'regression',checkedSHA:process.env.GITHUB_SHA,workflowSHA:process.env.GITHUB_SHA,workflowRun:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,checks,artifacts,ok:process.env.QA_STATUS==='0'&&checks.every(q=>q.ok)};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({ok:report.ok,checkedSHA:report.checkedSHA,checks}));
process.exit(report.ok?0:1);
