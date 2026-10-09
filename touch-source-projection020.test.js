'use strict';
// Pure source/data controls. --isolated=<dir> reads hash-verified baseline fixtures
// in the cloud workspace; CI additionally runs untouched historical controls.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),q=require('./touch-source-projection020');
const isolated=process.argv.find(a=>a.startsWith('--isolated='));
const old=file=>isolated?fs.readFileSync(path.join(isolated.slice(11),file)):execFileSync('git',['show',q.BASE+':'+file],{cwd:__dirname,maxBuffer:64*1024*1024});
const current=Object.fromEntries(q.PATHS.map(file=>[file,fs.readFileSync(path.join(__dirname,file))]));
const copy=x=>Object.fromEntries(Object.entries(x).map(([k,v])=>[k,Buffer.from(v)])),rejected=[];
function no(name,fn){assert.throws(fn,undefined,name);rejected.push(name);}
assert(q.verifyEnvelope020(current).ok);
const oldCard=isolated?fs.readFileSync('/tmp/lab020-reviewed-card.md'):execFileSync('git',['show',q.REVIEWED_COMMIT+':'+q.OLD_CARD],{cwd:__dirname,maxBuffer:1024*1024});
const releaseFiles={...current,[q.RELEASE_CARD]:fs.readFileSync(path.join(__dirname,q.RELEASE_CARD))};
assert(q.verifyBookkeeping020(releaseFiles,old('AUTORUN-LOG.md'),oldCard).exactThreeLabelReversal);
for(const [name,change]of [
 ['missing label',x=>x['index.html']=Buffer.from(x['index.html'].toString().replace("const GAME_VER='14.37'","const GAME_VER='14.36'"))],
 ['duplicate label',x=>x['index.html']=Buffer.concat([x['index.html'],Buffer.from("const GAME_ANCHOR='T733'")])],
 ['stale visible label',x=>x['index.html']=Buffer.from(x['index.html'].toString().replace('v14.37 · T733','v14.36 · T732'))],
 ['fourth product change',x=>x['index.html']=Buffer.concat([x['index.html'],Buffer.from(' ')])],
 ['missing log entry',x=>x['AUTORUN-LOG.md']=old('AUTORUN-LOG.md')],
 ['duplicate log entry',x=>x['AUTORUN-LOG.md']=Buffer.concat([x['AUTORUN-LOG.md'],Buffer.from(q.RELEASE_LOG_ENTRY)])],
 ['edited historical log',x=>x['AUTORUN-LOG.md']=Buffer.concat([x['AUTORUN-LOG.md'],Buffer.from(' ')])],
 ['missing moved card',x=>delete x[q.RELEASE_CARD]],
 ['damaged card history',x=>x[q.RELEASE_CARD]=Buffer.from(x[q.RELEASE_CARD].toString().replace('Acceptance criteria','Changed criteria'))],
 ['extra card append',x=>x[q.RELEASE_CARD]=Buffer.concat([x[q.RELEASE_CARD],Buffer.from(' ')])],
 ['branch card not moved',x=>x[q.OLD_CARD]=oldCard]
 ])no('release bookkeeping '+name,()=>{const x=copy(releaseFiles);change(x);q.verifyBookkeeping020(x,old('AUTORUN-LOG.md'),oldCard);});
no('changed prior card provenance',()=>q.verifyBookkeeping020(releaseFiles,old('AUTORUN-LOG.md'),Buffer.concat([oldCard,Buffer.from(' ')])));
no('changed prior log provenance',()=>q.verifyBookkeeping020(releaseFiles,Buffer.concat([old('AUTORUN-LOG.md'),Buffer.from(' ')]),oldCard));
// Every changed legacy browser/normalizer byte is solely an explicit label map.
for(const name of ['waterfront-quarter-compatibility019.js','waterfront-quarter-legacy019.js']){
 const expected=old(name).toString().replace(/14\.3[67]|T73[23]/g,x=>({'14.36':'14.37','14.37':'14.38','T732':'T733','T733':'T734'}[x]));
 assert.equal(current[name].toString(),expected,'All non-label adapter bytes remain exact: '+name);
}
const hook="    if (o.beforeNavigate) await o.beforeNavigate({ cdp, ws }); // GPT-020: optional read-only response observer\n";
const unchangedHarness=fs.readFileSync(path.join(__dirname,'harness.js'));assert(unchangedHarness.equals(old('harness.js')),'Real harness remains immutable for every historical audit');
const preflightHarness=require('./touch-preflight-harness020'),built=preflightHarness.buildPreflightHarness020(unchangedHarness);
assert.equal(built.adapted.split(hook).length,2);assert.equal(built.adapted.replace(hook,''),unchangedHarness.toString());assert.equal(built.exports.ROOT,__dirname);assert(built.proof.serverBootAndErrorCollectorUnchanged);
for(const [name,source]of [['trailing newline',Buffer.concat([unchangedHarness,Buffer.from('\n')])],['missing navigation',Buffer.from(unchangedHarness.toString().replace('Page.navigate','Page.wrong'))],['changed console collector',Buffer.from(unchangedHarness.toString().replace('Runtime.exceptionThrown','Runtime.changed'))],['changed server source',Buffer.from(unchangedHarness.toString().replace("'cache-control': 'no-store'","'cache-control': 'public'"))]])no('preflight copied harness '+name,()=>preflightHarness.buildPreflightHarness020(source));
const pair=current['waterfront-quarter-compatibility019.js'].toString().match(/\bRUNTIME_PAIR019="([^"]+)"/)[1];
const accepts=new (require('node:vm').Script)('(function(version,anchor){return '+pair+';})').runInNewContext();
for(const version of ['14.35','14.36','14.37','14.38',14.37,'14.37 ',null])for(const anchor of ['T731','T732','T733','T734',733,'T733 ',null])assert.equal(accepts(version,anchor),(version==='14.35'&&anchor==='T731')||(version==='14.37'&&anchor==='T733'),'Exact historical/current pairs only; stale, mismatched, future and malformed pairs reject');
execFileSync(process.execPath,[path.join(__dirname,'touch-document-observer020.test.js')],{cwd:__dirname,stdio:'inherit'});
for(const file of q.PATHS){
 const before=old(file),after=current[file],d=q.DECLARATIONS[file];assert.equal(q.hash(before),d.baseline);assert.equal(q.blob(before),d.baselineBlob);assert.equal(q.hash(after),d.candidate);
 assert(q.projectSource020(file,after,old).equals(before));assert(q.projectSource020(file,before,()=>{throw Error('Unnecessary read');}).equals(before));
 assert(q.verifySuccessorPin020(file,after,d.baseline));assert(q.verifySuccessorPin020(file,before,d.baseline));
 no('altered caller bytes '+file,()=>q.projectSource020(file,Buffer.concat([after,Buffer.from(' ')]),old));
 no('altered historical bytes '+file,()=>q.projectSource020(file,after,()=>Buffer.concat([before,Buffer.from(' ')])));
 no('wrong original expected pin '+file,()=>q.verifySuccessorPin020(file,after,d.candidate));
 no('mixed baseline/candidate '+file,()=>q.verifyEnvelope020({...current,[file]:before}));
 no('missing successor file '+file,()=>{const x=copy(current);delete x[file];q.verifyEnvelope020(x);});
}
no('undeclared projection path',()=>q.projectSource020('fp.json',Buffer.from('{}'),old));
no('extra allowlist input',()=>q.verifyEnvelope020({...current,extra:Buffer.from('')}));
const html=current['index.html'].toString();
for(const token of ['if(pointers.has(e.pointerId))return;','closeUndo();\n    const ps=','if(!p)return;','if(!pointers.has(e.pointerId))return;','clearTimeout(longPressT);longPressT=null;stopEdgePan436();','releasePointerCapture020(e.pointerId);','function cancelPointer020(e)','lostpointercapture']){
 assert(html.includes(token),token);no('changed touch region '+token,()=>q.projectSource020('index.html',Buffer.from(html.replace(token,token+' ')),old));
}
for(const [name,mutant]of [['extra old handler',html+"\ncvs.addEventListener('pointercancel',endPointer);"],['duplicated abort',html+html.slice(html.indexOf('function cancelPointer020(e)'),html.indexOf("cvs.addEventListener('pointerup',endPointer);"))],['changed version',html.replace("const GAME_VER='14.37'","const GAME_VER='14.38'")]])no(name,()=>q.projectSource020('index.html',Buffer.from(mutant),old));
// Synthetic tree records exercise every tracked-file guard without executing game code.
const files=copy(current),baseline=Object.fromEntries(q.PATHS.map(f=>[f,q.blob(old(f))]));
for(const f of ['fp.json','style.json','waterfront-quarter-release-pins019.json','AUTORUN-LOG.md','docs/T732-waterfront-cultural-quarter.md']){if(q.PATHS.includes(f))continue;files[f]=Buffer.from('protected '+f);baseline[f]=q.blob(files[f]);}
for(const f of q.ADDED)files[f]=fs.readFileSync(path.join(__dirname,f));
const head=Object.fromEntries(Object.entries(files).map(([f,b])=>[f,q.blob(b)]));assert(q.verifyTree020(files,baseline,head).ok);
for(const file of Object.keys(files))no('working mutation '+file,()=>q.verifyTree020({...files,[file]:Buffer.concat([files[file],Buffer.from('!')])},baseline,head));
for(const file of Object.keys(baseline).filter(f=>!q.PATHS.includes(f)))no('committed protected mutation '+file,()=>{const x={...files,[file]:Buffer.from('changed')};q.verifyTree020(x,baseline,{...head,[file]:q.blob(x[file])});});
no('unexpected tracked addition',()=>q.verifyTree020({...files,extra:Buffer.from('extra')},baseline,{...head,extra:q.blob(Buffer.from('extra'))}));
no('removed baseline path',()=>{const x={...files},h={...head};delete x['fp.json'];delete h['fp.json'];q.verifyTree020(x,baseline,h);});
assert.equal(q.verifySuccessorPin020('fp.json',files['fp.json'],q.hash(files['fp.json'])),true);assert.equal(q.verifySuccessorPin020('fp.json',files['fp.json'],'wrong'),false);
const evidence={checkedSHA:'head',sourceSHA256:q.hash(current['index.html']),loadedDocument020:{sha256:q.hash(current['index.html']),actualCandidateBytes:true}};
assert(q.verifyEvidence020(evidence,'head',evidence.sourceSHA256));
for(const [name,edit]of [['HEAD',x=>x.checkedSHA='old'],['disk source',x=>x.sourceSHA256='old'],['loaded source',x=>x.loadedDocument020.sha256=q.DECLARATIONS['index.html'].baseline],['actual bytes flag',x=>x.loadedDocument020.actualCandidateBytes=false]])no('stale evidence '+name,()=>{const x=structuredClone(evidence);edit(x);q.verifyEvidence020(x,'head',evidence.sourceSHA256);});
const workflow='.github/workflows/waterfront-quarter019.yml',originalWorkflow=old(workflow).toString();
const expectedWorkflow=originalWorkflow.replace('    - gpt/waterfront-cultural-quarter-019\n','    - gpt/waterfront-cultural-quarter-019\n    - gpt/touch-cancellation-020\n').replace('        python3 waterfront-quarter-workflow019.test.py','        node touch-source-projection020.test.js').replace('        python3 waterfront-quarter-mobile-workflow019.test.py\n','');
assert.equal(current[workflow].toString(),expectedWorkflow,'Only branch trigger and source test entry may change; all156 jobs, matrices, commands and failure semantics preserved');
const shortWorkflow='.github/workflows/waterfront-quarter019-mobile-qa.yml';
const expectedShort=old(shortWorkflow).toString().replace('python3 waterfront-quarter-workflow019.test.py\\npython3 waterfront-quarter-mobile-workflow019.test.py\\n','node touch-source-projection020.test.js\\n');
assert.equal(current[shortWorkflow].toString(),expectedShort,'Short QA changes only the matching source controls; triggers, matrix and runtime stay exact');
execFileSync('python3',['-c',"import copy,yaml; from pathlib import Path; root=Path('.'); full=yaml.safe_load((root/'.github/workflows/waterfront-quarter019.yml').read_text()); short=yaml.safe_load((root/'.github/workflows/waterfront-quarter019-mobile-qa.yml').read_text()); assert full['jobs']['preflight']==short['jobs']['preflight']; q=copy.deepcopy(full['jobs']['quarter']); q['strategy']['matrix']['mode']=['mobile']; assert q==short['jobs']['quarter']; print('Current full/short preflight and mobile runtime equality passed')"],{cwd:__dirname,stdio:'inherit'});
let historicalControls='not run in isolated mode',checkout='not available in isolated mode';
if(!isolated){
 checkout=q.verifyCheckout020(file=>fs.readFileSync(path.join(__dirname,file)));
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'touch020-historical-'));
 try{
  execFileSync('git',['worktree','add','--detach',tmp,q.BASE],{cwd:__dirname,stdio:'inherit'});
  const env={...process.env};delete env.NODE_OPTIONS;
  for(const [bin,args]of [['node',['waterfront-quarter-contract019.js']],['node',['waterfront-quarter-release019.test.js']],['node',['waterfront-quarter-adapters019.test.js']],['python3',['waterfront-quarter-workflow019.test.py']],['python3',['waterfront-quarter-mobile-workflow019.test.py']]])execFileSync(bin,args,{cwd:tmp,env,stdio:'inherit'});
  historicalControls='unchanged T732 source/VM/workflow controls passed on '+q.BASE+'; not current runtime evidence';
 }finally{execFileSync('git',['worktree','remove','--force',tmp],{cwd:__dirname,stdio:'inherit'});}
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,actualSourceSHA256:q.hash(current['index.html']),historicalProjectionSHA256:q.DECLARATIONS['index.html'].baseline,historicalControls,checkout,rejectedCount:rejected.length,rejected},null,2));
