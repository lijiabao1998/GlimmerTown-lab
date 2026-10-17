'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {resolveChangeBase026}=require('./fiscalChangeBase026.cjs');
const ROOT=__dirname,FIELDS=['d','n','w','h','op'];
function assertLeafPayload026(committed,rendered,platform=process.platform){
  assert(committed?.subs&&rendered?.subs,'both fingerprint leaf maps exist');
  assert.deepEqual(Object.keys(committed.subs).sort(),Object.keys(rendered.subs).sort(),'fingerprint leaf key set matches current renderer');
  const env=committed.envLeaves?.[platform]||{},environment=[];
  for(const key of Object.keys(rendered.subs).sort()){
    const expected=committed.subs[key],actual=rendered.subs[key];
    assert(expected&&actual&&typeof expected==='object'&&typeof actual==='object'&&!Array.isArray(expected)&&!Array.isArray(actual),'fingerprint leaf records are objects: '+key);
    const diff=FIELDS.filter(k=>expected[k]!==actual[k]);
    if(!diff.length)continue;
    if(env[key]&&FIELDS.every(k=>env[key][k]===actual[k])){environment.push(key);continue;}
    throw Error('fingerprint leaf mismatch: '+key+'.'+diff[0]);
  }
  return{leaves:Object.keys(rendered.subs).length,environment};
}
function verifyCurrentFingerprint026({baseSha,outputDir,echo=false,env=process.env}){
  fs.mkdirSync(outputDir,{recursive:true});
  const fpBase=path.join(outputDir,'change-base-fp.json'),styleBase=path.join(outputDir,'change-base-style.json'),dump=path.join(outputDir,'fp-rebake');
  for(const [file,target] of [['fp.json',fpBase],['style.json',styleBase]])fs.writeFileSync(target,cp.execFileSync('git',['show',baseSha+':'+file],{cwd:ROOT}));
  const run=cp.spawnSync(process.execPath,[path.join(ROOT,'fp.js'),'--check','--report-base='+fpBase,'--report-base-style='+styleBase,'--dump='+dump],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024,env:{...env,GITHUB_STEP_SUMMARY:''}});
  const text=(run.stdout||'')+(run.stderr||'');fs.writeFileSync(path.join(outputDir,'current-fp.txt'),text);if(echo)process.stdout.write(text);
  assert.equal(run.status,0,'fp.js --check rejects mismatched renderer/style data; see current-fp.txt');
  const result=assertLeafPayload026(JSON.parse(fs.readFileSync(path.join(ROOT,'fp.json'),'utf8')),JSON.parse(fs.readFileSync(path.join(dump,'fp.json'),'utf8')));
  fs.writeFileSync(path.join(outputDir,'leaf-validation.json'),JSON.stringify({ok:true,...result},null,2)+'\n');
  return{fingerprintCheck:run.status,...result};
}
module.exports={assertLeafPayload026,verifyCurrentFingerprint026};
if(require.main===module){
  const out=process.argv.find(a=>a.startsWith('--out='));
  try{const base=resolveChangeBase026(),result=verifyCurrentFingerprint026({baseSha:base.sha,outputDir:out?out.slice(6):path.join(ROOT,'shots','fiscal026-fp'),echo:true});console.log('FISCAL_FP_GREEN '+JSON.stringify(result));}
  catch(e){console.error('FISCAL_FP_RED '+e.message);process.exitCode=1;}
}
