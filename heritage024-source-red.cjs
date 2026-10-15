'use strict';
// Two valid-source mutations in disposable CI repositories; original files untouched.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {ROOT}=require('./harness.js'),html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const cases=[
  {name:'rotation hook removed',from:'window.__noHeritage024?0:heritageView024(b)',to:'window.__noHeritage024?0:q.v',target:'heritage024 actual rotation',expr:`(()=>{const r=GV.heritage024.selftest();return{ok:r.ok,first:r.checks.find(x=>x.endsWith('✗'))};})()`},
  {name:'refund new native fee',from:'const ok=__heritagePlace024(id,x,y,silent);',to:'const ok=__heritagePlace024(id,x,y,silent);if(ok&&q)money+=placeCost(id,x,y);',target:'heritage024 fee',expr:`(()=>{GV.setSpeed(0);GV.setDiff(3);GV.newWorldSeeded(31);GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);if(!GV.heritage024.select('rushton'))throw Error('fixture selection');GV.setDiff(1);let p=null;for(let y=4;y<66&&!p;y+=3)for(let x=4;x<66&&!p;x+=3){const v=GV.placePreview459('landmark',x,y);if(v?.ok)p={x,y,cost:v.cost};}if(!p)throw Error('fixture lot');const m=GV.useScales021.world().money;if(!GV.place('landmark',p.x,p.y))throw Error('fixture place');const spent=m-GV.useScales021.world().money;return{ok:spent===p.cost&&spent>0,first:spent!==p.cost||spent<=0?'heritage024 fee: spent '+spent+' expected '+p.cost:null};})()`}
];
(async()=>{
  const embedTmp=fs.mkdtempSync(path.join(os.tmpdir(),'heritage024-red-'));
  try{for(const file of['british-heritage-art024.js','heritage024-runtime.js','heritage024.css','embed-heritage024.cjs'])fs.copyFileSync(path.join(ROOT,file),path.join(embedTmp,file));
    const bad=html.replace("b.title='15座不重複的英式歷史地標'","b.title='deliberately stale embedded UI label'");assert.notEqual(bad,html,'embedding mutation must happen');fs.writeFileSync(path.join(embedTmp,'index.html'),bad);
    const r=cp.spawnSync(process.execPath,['embed-heritage024.cjs','--check'],{cwd:embedTmp,encoding:'utf8'});assert.equal(r.status,1);assert(r.stderr.includes('embedded sources must be exact')&&!r.stderr.includes('SyntaxError'),'embedding first RED must be exact-source guard');console.log('SOURCE RED stale valid embedding => embedded sources must be exact');
  }finally{const p=path.resolve(embedTmp);assert(p.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(p).startsWith('heritage024-red-'));fs.rmSync(p,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  for(const c of cases){assert.equal(html.split(c.from).length,2,'unique destructive source');const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'heritage024-red-'));
    try{fs.writeFileSync(path.join(tmp,'index.html'),html.replace(c.from,()=>c.to));fs.copyFileSync(path.join(ROOT,'harness.js'),path.join(tmp,'harness.js'));
      const {withGame}=require(path.join(tmp,'harness.js')),r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true',log:console.log},async({cdp})=>{const value=await cdp.evalJs(c.expr);if(cdp.errors.length)throw Error('Unexpected console error: '+cdp.errors.join('; '));return value;});
      assert(r.ok&&r.result,'mutation must boot and execute: '+r.fails.join('; '));assert.equal(r.result.ok,false,'mutation must be RED: '+c.name);assert(r.result.first?.startsWith(c.target),'wrong first RED: '+JSON.stringify(r.result));console.log('SOURCE RED '+c.name+' => '+r.result.first);
    }finally{const resolved=path.resolve(tmp);assert(resolved.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(resolved).startsWith('heritage024-red-'),'owned temp target');fs.rmSync(resolved,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  }console.log('heritage024 source-negative controls: 3 / correct first RED / original index untouched');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
