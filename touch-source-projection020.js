'use strict';
// Source-only successor contract. No fs/loader hooks and no game execution.
// Projection is ONLY for historical T732 comparisons. Runtime always uses raw HTML.
const path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='44849ee7ddb2292daddf478b28978f9d0d7edf0d';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const DECLARATIONS=Object.freeze({
 "index.html": {
  "baseline": "2b27364ea5f4e10fb9c8b5c182711c5c5ff00210a183fe26bca67e2688e5709c",
  "candidate": "36568ade4b1ce2e6f8d59497a5a1ba99b9b16a99c18173a89a1689032006abce"
 },
 "smoke.js": {
  "baseline": "1d07429c075de3d5ba0aac17f0146b2d8327fb2e823efa3b1d9303c184aca082",
  "candidate": "9191f9fc319bba59e4db2ea5f0e9a97ddcc7974a9f349efa1153f97a78c5f7f1"
 },
 "waterfront-quarter-contract019.js": {
  "baseline": "6b9a4ecfabc3e38cae66370d39103aa68da96116996cb3dee56bb18f57e04203",
  "candidate": "5c7d1ff88a3425055ae4d974238a163f09cb0ab56d908ee5de68af721016df47"
 },
 "waterfront-quarter-release-contract019.js": {
  "baseline": "df1ddd0c61dba2c6f88f1a0a7079a7282825d16e7106d14493e7750cb2b8d66d",
  "candidate": "11ab81e68219fb7773dc09a985b3969c84efd77170f99a1d5236672a042913d5"
 },
 "waterfront-quarter-preflight019.js": {
  "baseline": "a49e81b06a2e5df032c3c21f153b8d7c9c831286abb8d13b0c5cffa43fdc9d97",
  "candidate": "2df53b146ac3e699942c1c5294a573e5c6035e752207d93306e59e4e989e1256"
 },
 ".github/workflows/waterfront-quarter019.yml": {
  "baseline": "7feba76124027058132ba653377d925a2c09e5a7280d0504d1040579d70b571b",
  "candidate": "97f0e6a82182bc1cc123664846ae6f4a589707392a114a58d9046f8450959432"
 },
 ".github/workflows/waterfront-quarter019-mobile-qa.yml": {
  "baseline": "c8a18dd040106af8739da505acc2c6e03ee0da46a7fa1bd75c574b89170ba2fd",
  "candidate": "ee029e515800be9155e9f0f9d1d8c974535744ae25e4652b7fd2358af03203e0"
 }
});
const PATHS=Object.freeze(Object.keys(DECLARATIONS));
const ADDED=Object.freeze(['.github/workflows/touch-pixels020.yml','docs/branch/GPT-020-touch-cancellation.md','probe-touch-pixels020.js','touch-cancellation020.browser.js','touch-cancellation020.test.js','touch-pixels020.capture.cjs','touch-source-projection020.js','touch-source-projection020.test.js']);
const git=args=>execFileSync('git',args,{cwd:ROOT,maxBuffer:64*1024*1024});
const historical=file=>git(['show',BASE+':'+file]);
function projectSource020(file,bytes,readHistorical=historical){
 const d=DECLARATIONS[file];if(!d)throw Error('Undeclared historical projection: '+file);
 const raw=Buffer.from(bytes),actual=hash(raw);
 if(actual===d.baseline)return raw;
 if(actual!==d.candidate)throw Error('Unexpected successor source bytes: '+file);
 const old=Buffer.from(readHistorical(file));
 if(hash(old)!==d.baseline)throw Error('Historical source identity mismatch: '+file);
 return old;
}
function verifySuccessorPin020(file,bytes,expected){
 const d=DECLARATIONS[file],actual=hash(bytes);
 if(d){if(expected!==d.baseline)throw Error('Original source pin mismatch: '+file);return actual===d.baseline||actual===d.candidate;}
 return actual===expected;
}
function verifyEnvelope020(files){
 if(Object.keys(files).sort().join('\0')!==[...PATHS].sort().join('\0'))throw Error('Complete exact successor envelope required');
 for(const file of PATHS)if(hash(files[file])!==DECLARATIONS[file].candidate)throw Error('Mixed or modified successor envelope: '+file);
 return {ok:true,basis:'exact GPT-020 source successor; T732 artwork approval inherited unchanged',actualSourceSHA256:hash(files['index.html']),historicalProjectionSHA256:DECLARATIONS['index.html'].baseline,historicalCommit:BASE,historicalProjectionPurpose:'source comparison only; never parsed, served, or used as current runtime evidence'};
}
function tree(ref){return Object.fromEntries(git(['ls-tree','-r','-z',ref]).toString().split('\0').filter(Boolean).map(row=>{const [meta,file]=row.split('\t'),[mode,type,sha]=meta.split(' ');if(type!=='blob'||mode!=='100644')throw Error('Unexpected tracked object: '+file);return [file,sha];}));}
function verifyTree020(files,baseline,head){
 if(Object.keys(files).sort().join('\0')!==Object.keys(head).sort().join('\0'))throw Error('Missing or extra tracked source bytes');
 if(Object.keys(head).filter(f=>!Object.hasOwn(baseline,f)).sort().join('\0')!==[...ADDED].sort().join('\0'))throw Error('Undeclared added file');
 for(const [file,oldBlob]of Object.entries(baseline)){
  if(!Object.hasOwn(head,file))throw Error('Removed baseline file: '+file);
  if(!Object.hasOwn(DECLARATIONS,file)&&head[file]!==oldBlob)throw Error('Undeclared baseline-file change: '+file);
 }
 for(const [file,expected]of Object.entries(head))if(blob(files[file])!==expected)throw Error('Working bytes differ from exact checked-out HEAD: '+file);
 return verifyEnvelope020(Object.fromEntries(PATHS.map(file=>[file,files[file]])));
}
function verifyCheckout020(readCurrent){
 // The caller supplies its reader, so original VM/mock negative fixtures remain effective.
 const baseline=tree(BASE),head=tree('HEAD'),files=Object.fromEntries(Object.keys(head).map(file=>[file,readCurrent(file)]));
 const proof=verifyTree020(files,baseline,head),sha=git(['rev-parse','HEAD']).toString().trim();
 if(process.env.GITHUB_SHA&&sha!==process.env.GITHUB_SHA)throw Error('Exact workflow HEAD required');
 return {...proof,checkedSHA:sha,trackedFiles:Object.keys(head).length,allBaselineFilesProtected:true};
}
function verifyEvidence020(evidence,head,source){
 if(!evidence||evidence.checkedSHA!==head||evidence.sourceSHA256!==source||evidence.loadedDocument020?.sha256!==source||evidence.loadedDocument020?.actualCandidateBytes!==true)throw Error('Stale or historical runtime evidence');
 return true;
}
module.exports={BASE,PATHS,ADDED,DECLARATIONS,hash,blob,projectSource020,verifySuccessorPin020,verifyEnvelope020,verifyTree020,verifyCheckout020,verifyEvidence020};
