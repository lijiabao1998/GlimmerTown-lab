#!/usr/bin/env node
'use strict';
// Aggregate completed CI evidence only; never promote or rewrite old baselines.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Authorized isolated CI only');
const out=path.join(__dirname,'publiclife-evidence','regression'),checkedSHA=execFileSync('git',['rev-parse','HEAD'],{cwd:__dirname,encoding:'utf8'}).trim();
const names=['smoke-1','smoke-2','smoke-3','fingerprint','declared-twelve','compatibility'];
const checks=names.map(name=>{const read=suffix=>{const f=path.join(out,'logs',name+suffix);return fs.existsSync(f)?fs.readFileSync(f,'utf8').trim():null;},value=read('.exit'),tee=read('.tee.exit');return{name,ok:value==='0'&&tee==='0',exit:value,teeExit:tee};});
const readJSON=p=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):null;
const comparison=readJSON(path.join(out,'guards','compatibility.json')),strict=readJSON(path.join(out,'declared-twelve','manifest.json'));
checks.push({name:'exact checked workflow head',ok:checkedSHA===process.env.GITHUB_SHA});
checks.push({name:'actual old-city tile/stat/RNG equality and candidate restoration',ok:comparison?.ok===true&&comparison?.restored===true&&comparison.checkedSHA===checkedSHA&&comparison.runs?.length===2&&comparison.runs.every(q=>q.result?.length===3)});
const expected=Array.from({length:12},(_,n)=>'bld.'+(262+n)+'_1_0').sort();
checks.push({name:'strict declared twelve-leaf audit at exact head',ok:strict?.ok===true&&strict.checkedSHA===checkedSHA&&strict.checks?.every(q=>q.ok)&&JSON.stringify(strict.fingerprint?.added)===JSON.stringify(expected)&&strict.fingerprint?.changed?.length===0&&strict.fingerprint?.removed?.length===0&&strict.fingerprint?.blocks?.count===1728});
const artifacts=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p!==path.join(out,'manifest.json')){const b=fs.readFileSync(p);artifacts.push({path:path.relative(out,p).split(path.sep).join('/'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),checkedSHA});}}}
walk(out);
const report={createdAt:new Date().toISOString(),mode:'regression',checkedSHA,workflowSHA:process.env.GITHUB_SHA,workflowRun:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,checks,artifacts,limitations:['Four unchanged nested legacy atlas diagnostics remain disclosed: industry:165_1_0, industry:166_1_0, industry:174_1_0, version-anchor. Top-level smoke success does not relabel these nested diagnostics.'],ok:process.env.QA_STATUS==='0'&&checks.every(q=>q.ok)};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({ok:report.ok,checkedSHA,checks}));
process.exit(report.ok?0:1);
