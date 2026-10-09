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
  "candidate": "c0e6e167c67d78b16d0ce97eb33662b7f5005b573fbeb9793ee25083fc628689",
  "baselineBlob": "3dc0323bf1f26cc73b75cb2054f4d5f3b36d1789"
 },
 "smoke.js": {
  "baseline": "1d07429c075de3d5ba0aac17f0146b2d8327fb2e823efa3b1d9303c184aca082",
  "candidate": "9191f9fc319bba59e4db2ea5f0e9a97ddcc7974a9f349efa1153f97a78c5f7f1",
  "baselineBlob": "08d8339becb0b0c9589106343817d89920054db9"
 },
 "waterfront-quarter-contract019.js": {
  "baseline": "6b9a4ecfabc3e38cae66370d39103aa68da96116996cb3dee56bb18f57e04203",
  "candidate": "c7635ef73dae63e2e9bfb1b14ad9d081f77885ff59d6364c7c808c18f9e2d532",
  "baselineBlob": "758c5f61ff9b1d43cb1cde2fcb365fdbb7de8158"
 },
 "waterfront-quarter-release-contract019.js": {
  "baseline": "df1ddd0c61dba2c6f88f1a0a7079a7282825d16e7106d14493e7750cb2b8d66d",
  "candidate": "db83bc26d2d5ca73285d56df8465cb8552eb731b09be1a3a0ffc1d52b92965f3",
  "baselineBlob": "03c685727c4c6bfcffc6e61f900ee124a127632a"
 },
 "waterfront-quarter-preflight019.js": {
  "baseline": "a49e81b06a2e5df032c3c21f153b8d7c9c831286abb8d13b0c5cffa43fdc9d97",
  "candidate": "dd1b970745b52f54e16902994b4b08236f0dc8a84e90acc8ec788fc06e08307a",
  "baselineBlob": "ea2320730596664b0f2920f12abd674c409360f1"
 },
 ".github/workflows/waterfront-quarter019.yml": {
  "baseline": "7feba76124027058132ba653377d925a2c09e5a7280d0504d1040579d70b571b",
  "candidate": "97f0e6a82182bc1cc123664846ae6f4a589707392a114a58d9046f8450959432",
  "baselineBlob": "ec4e09f7a98965508d5a89f1dcaf17fc781062c0"
 },
 ".github/workflows/waterfront-quarter019-mobile-qa.yml": {
  "baseline": "c8a18dd040106af8739da505acc2c6e03ee0da46a7fa1bd75c574b89170ba2fd",
  "candidate": "ee029e515800be9155e9f0f9d1d8c974535744ae25e4652b7fd2358af03203e0",
  "baselineBlob": "2fb6249d9b0706446959e01c0e200314a74982f4"
 },
 "AUTORUN-LOG.md": {
  "baseline": "153c9ff08abeead40c7c826841eee74a82ef015a4d2142254eb89b042e496433",
  "candidate": "742a489d370171e89b1a813a2c5b383eeee312ea580e1b1952495d6eed50db2f",
  "baselineBlob": "b2279970aab601c94e13cf47ee7dc0f8cbc7ff62"
 },
 "waterfront-quarter-compatibility019.js": {
  "baseline": "72cb960586d9a9e1fc487d0d4a6f641cd46bfe4bff6533c0f55e46823447d364",
  "candidate": "3dba52668a201f9e33bf628857d4b5472da7069add24fbac17416119537d7038",
  "baselineBlob": "2a80eac59bca76de8ab38df0d1f75de76ab06342"
 },
 "waterfront-quarter-legacy019.js": {
  "baseline": "6b820d356243b0bc2b2acd4bddaffe135bc58fb00781418f657c45e263686e9c",
  "candidate": "af12f53b79350c9d1badf9e0d088088a61e20f0ca3bc35737e15a50c45adc418",
  "baselineBlob": "4f249035ccb9906d88de5ae632e5b18f79625af3"
 },
 "waterfront-quarter-historical019.js": {
  "baseline": "6dd469caac27e79736105eb516a92b1afe040135faa51341a3a96216e7b50f42",
  "candidate": "489fc8b8d17f775db95c2c758ce6a12f1f6b77f9783cc56a9535a28f23d19619",
  "baselineBlob": "4ac273ad7ecddea06c492d544e67d4ead12198c4"
 },
 "waterfront-quarter-retained-controls019.js": {
  "baseline": "dad1809bd22255fb4fa23c5e5cba5aac98f3afd49477b4abed8a08bae0217bbe",
  "candidate": "b34e08aaade97fe6c10b0ad5d7ec712bb4ab00e09344701ad4e8a41a81f6265b",
  "baselineBlob": "2eaa2db6a06c12c47aac788d141a3f23928bd803"
 }
});
const PATHS=Object.freeze(Object.keys(DECLARATIONS));
const ADDED=Object.freeze(['.github/workflows/touch-pixels020.yml','docs/T733-touch-cancellation.md','probe-touch-pixels020.js','touch-cancellation020.browser.js','touch-cancellation020.test.js','touch-pixels020.capture.cjs','touch-source-projection020.js','touch-source-projection020.test.js','touch-document-observer020.js','touch-document-observer020.test.js','touch-preflight-harness020.js']);
const git=args=>execFileSync('git',args,{cwd:ROOT,maxBuffer:64*1024*1024});
const historical=file=>git(['show',BASE+':'+file]);
const REVIEWED_INPUT='36568ade4b1ce2e6f8d59497a5a1ba99b9b16a99c18173a89a1689032006abce';
const REVIEWED_COMMIT='b660f394fca3a8fd9aec71f1cf68459898408f1f';
const OLD_CARD='docs/branch/GPT-020-touch-cancellation.md',RELEASE_CARD='docs/T733-touch-cancellation.md';
const RELEASE_LOG_ENTRY="<!-- T733 release entry BEGIN -->\n## r180 — T733 Interrupted touch gestures (original GPT-020)\n\n- Version: v14.37 / T733. PR #25: https://github.com/lijiabao1998/GlimmerTown-lab/pull/25\n- Owner approved this repair, merge and normal automatic deployment on 2026-10-09 at 13:33:34 UTC, preserving the inherited building-style discrepancy without changing baselines.\n- Cancels pending tap, road, rectangle and route actions; stale terminal events are idempotent; applied paint stays undoable. Reviewed input implementation blob: 97917dc93167735ea75862182857135fff20cfa8. Release changes exactly three labels beyond those reviewed game bytes.\n- Earlier smoke evidence: three green runs at ebd069d and two each at f71fdb1 and b660f394. Native pixel equality at b660f394: all 3,179 sprites, 165 families and 1,728 blocks unchanged, run 37940504511. Raw stored style check remains 96.5% expected versus 96.3% actual on both original and repaired code.\n- Failure history: initial synthetic-input vibration warnings corrected without filtering; b660 full suite passed source controls but its added Page.getResourceContent probe failed because the no-store document was not cached. This is repaired through pre-navigation response observation, not waived.\n- Not completed: exact T733 full release suite, three smokes, pixel/style evidence, merge and deployed-byte verification remain pending. Earlier-head results are not claimed as T733 results. Physical-device testing remains unrun. No artwork or fp/style baseline changes.\n<!-- T733 release entry END -->\n\n";
const CARD_APPEND="\n\n## T733 publication bookkeeping\n\n<!-- T733 release entry BEGIN -->\n## r180 — T733 Interrupted touch gestures (original GPT-020)\n\n- Version: v14.37 / T733. PR #25: https://github.com/lijiabao1998/GlimmerTown-lab/pull/25\n- Owner approved this repair, merge and normal automatic deployment on 2026-10-09 at 13:33:34 UTC, preserving the inherited building-style discrepancy without changing baselines.\n- Cancels pending tap, road, rectangle and route actions; stale terminal events are idempotent; applied paint stays undoable. Reviewed input implementation blob: 97917dc93167735ea75862182857135fff20cfa8. Release changes exactly three labels beyond those reviewed game bytes.\n- Earlier smoke evidence: three green runs at ebd069d and two each at f71fdb1 and b660f394. Native pixel equality at b660f394: all 3,179 sprites, 165 families and 1,728 blocks unchanged, run 37940504511. Raw stored style check remains 96.5% expected versus 96.3% actual on both original and repaired code.\n- Failure history: initial synthetic-input vibration warnings corrected without filtering; b660 full suite passed source controls but its added Page.getResourceContent probe failed because the no-store document was not cached. This is repaired through pre-navigation response observation, not waived.\n- Not completed: exact T733 full release suite, three smokes, pixel/style evidence, merge and deployed-byte verification remain pending. Earlier-head results are not claimed as T733 results. Physical-device testing remains unrun. No artwork or fp/style baseline changes.\n<!-- T733 release entry END -->\n\n";
const REVIEWED_CARD_SHA='40dd823c3833c3b4f9bf23242f9dda57bc276fb70a9b53943e9b599ca4d7c99c';
function verifyBookkeeping020(files,oldLog,oldCard){
 let html=Buffer.from(files['index.html']).toString();
 for(const[from,to]of [["const GAME_VER='14.37'","const GAME_VER='14.36'"],["const GAME_ANCHOR='T733'","const GAME_ANCHOR='T732'"],['id="startVersion456">v14.37 · T733','id="startVersion456">v14.36 · T732']]){
  if(html.split(from).length!==2)throw Error('Exactly three unique T733 labels required');html=html.replace(from,to);
 }
 if(hash(html)!==REVIEWED_INPUT)throw Error('Gameplay or artwork changed beyond three release labels');
 const log=Buffer.from(files['AUTORUN-LOG.md']).toString();
 if(hash(oldLog)!==DECLARATIONS['AUTORUN-LOG.md'].baseline||log.split(RELEASE_LOG_ENTRY).length!==2||log.replace(RELEASE_LOG_ENTRY,'')!==Buffer.from(oldLog).toString())throw Error('One exact T733 log insertion required');
 const original=Buffer.from(oldCard).toString();
 if(hash(oldCard)!==REVIEWED_CARD_SHA||Object.hasOwn(files,OLD_CARD))throw Error('Original GPT-020 history or card move changed');
 const expected=original.replace('# GPT-020 — Abort interrupted pointer gestures','# T733 — Abort interrupted pointer gestures (original GPT-020)')+CARD_APPEND;
 if(Buffer.from(files[RELEASE_CARD]||'').toString()!==expected)throw Error('Exact card move and bounded release append required');
 return {version:'14.37',anchor:'T733',round:'r180',sourceReleaseApproval:{pullRequest:25,approvedAt:'2026-10-09T13:33:34Z'},exactThreeLabelReversal:true,reviewedInputSHA256:REVIEWED_INPUT,reviewedCommit:REVIEWED_COMMIT,card:RELEASE_CARD,logEntryExact:true,artworkApprovalInheritedFromT732:true,fpAndStyleBaselinesUnchanged:true};
}
function projectSource020(file,bytes,readHistorical=historical){
 const d=DECLARATIONS[file];if(!d)throw Error('Undeclared historical projection: '+file);
 const raw=Buffer.from(bytes),actual=hash(raw);
 if(actual===d.baseline){if(blob(raw)!==d.baselineBlob)throw Error('Immutable baseline blob mismatch: '+file);return raw;}
 if(actual!==d.candidate)throw Error('Unexpected successor source bytes: '+file);
 const old=Buffer.from(readHistorical(file));
 if(hash(old)!==d.baseline||blob(old)!==d.baselineBlob)throw Error('Historical source identity mismatch: '+file);
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
 let duplicate=false;try{readCurrent(OLD_CARD);duplicate=true;}catch(error){if(error.code!=='ENOENT')throw error;}if(duplicate)throw Error('Moved GPT-020 branch card still exists');
 const release=verifyBookkeeping020(files,historical('AUTORUN-LOG.md'),git(['show',REVIEWED_COMMIT+':'+OLD_CARD]));
 return {...proof,checkedSHA:sha,trackedFiles:Object.keys(head).length,allBaselineFilesProtected:true,release};
}
function verifyEvidence020(evidence,head,source){
 if(!evidence||evidence.checkedSHA!==head||evidence.sourceSHA256!==source||evidence.loadedDocument020?.sha256!==source||evidence.loadedDocument020?.actualCandidateBytes!==true)throw Error('Stale or historical runtime evidence');
 return true;
}
module.exports={BASE,PATHS,ADDED,DECLARATIONS,REVIEWED_COMMIT,OLD_CARD,RELEASE_CARD,RELEASE_LOG_ENTRY,hash,blob,projectSource020,verifySuccessorPin020,verifyEnvelope020,verifyTree020,verifyCheckout020,verifyEvidence020,verifyBookkeeping020};
