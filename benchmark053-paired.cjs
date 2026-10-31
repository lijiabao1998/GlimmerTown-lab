'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const file=__dirname+'/index.html',candidate=fs.readFileSync(file),base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{maxBuffer:32e6}),scene=process.argv[2]||'small',out=path.resolve('shots/paired053/'+scene);fs.mkdirSync(out,{recursive:true});
if(!process.env.GITHUB_ACTIONS)throw Error('Native paired measurement is GitHub Actions only');
const rows=[];
try{for(const [i,label]of ['baseline','candidate','candidate','baseline'].entries()){
 fs.writeFileSync(file,label==='baseline'?base:candidate);const dir=path.join(out,i+'-'+label);
 const r=cp.spawnSync(process.execPath,['benchmark053.cjs','--scene='+scene,'--speed=5','--ai=on','--seconds='+(scene==='large'?90:30),'--profile-seconds=0','--out='+dir],{encoding:'utf8',maxBuffer:8e6,timeout:600000});fs.writeFileSync(path.join(out,i+'-'+label+'.log'),(r.stdout||'')+(r.stderr||''));assert.equal(r.status,0,'native paired run failed: '+i+' '+label+' '+r.error);
 const data=JSON.parse(fs.readFileSync(path.join(dir,'summary.json')));rows.push({label,...data});
 }const a=rows.filter(r=>r.label==='baseline'),b=rows.filter(r=>r.label==='candidate'),mean=(r,f)=>r.reduce((s,x)=>s+f(x),0)/r.length;
 const result={order:rows.map(r=>r.label),sameRunner:true,scene,rows,meanP95Reduction:1-mean(b,r=>r.frameMs.p95)/mean(a,r=>r.frameMs.p95),meanBlockingReduction:1-mean(b,r=>r.longTasks.totalBlockingMs)/mean(a,r=>r.longTasks.totalBlockingMs),acceptancePassed:false,note:'ABBA windows (large90s, others30s), >=30 raw frames each; only 2 independent windows per arm, not 30 independent runs. Newly constructed fixture, not mature population proof. Full matrix and Town comparison pending.'};fs.writeFileSync(out+'/paired-summary.json',JSON.stringify(result,null,2));console.log('PAIRED RESULT',JSON.stringify({scene,p95Reduction:result.meanP95Reduction,blockingReduction:result.meanBlockingReduction,rows:rows.map(r=>({label:r.label,fps:r.fps,p95:r.frameMs.p95,p99:r.frameMs.p99,days:r.daysPerSecond,blocking:r.longTasks.totalBlockingMs,roots:r.rootsAfter,pop:r.populationAfter}))}));
}catch(e){fs.writeFileSync(out+'/first-failure.json',JSON.stringify({error:e.stack,rows},null,2));throw e;}finally{fs.writeFileSync(file,candidate);}
