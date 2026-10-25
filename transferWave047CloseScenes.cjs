'use strict';
// Exact frozen-name transport for existing CI originals. No game or image edits.
// The historical lowercase-only transporter is retained byte-for-byte.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const names=Object.freeze(['spindlefruit','agrimonypattern','hopdrying','tansymill','vervainrecital','campionbarn','woodruffgrain','catmintbridge','periwinklebell','speedwellseasoning'].map(id=>'near-'+id));
function validate(report,head){
  assert.equal(report.head,head,'scene047 exact source head');
  const rows=report.frames.filter(q=>q.name.startsWith('near-'));
  assert.deepEqual(rows.map(q=>q.name),names,'scene047 exact ordered ten known scene names');
  assert.equal(report.frames.length,57,'scene047 frozen57 native frames');assert.equal(report.edge.length,40,'scene047 frozen40 edge frames');
  assert.equal(report.valve.length,8,'scene047 eight complete BASE-valve pairs');assert(report.valve.every(q=>q.equal===true&&q.w===1280&&q.h===657),'scene047 complete native canvas valve proof');
  assert.deepEqual(report.failures,[],'scene047 original scene criteria pass');assert.deepEqual(report.unrun,[],'scene047 original scene matrix complete');
  for(const q of rows){assert.equal(q.file,q.name+'.png','scene047 exact original scene filename');assert.equal(q.w,1280);assert.equal(q.h,657);assert(Number.isInteger(q.bytes)&&q.bytes>0);assert.match(q.sha256,/^[0-9a-f]{64}$/);}
  return rows;
}
function controls(report,head){
  const proofs=[];
  for(const [name,mutate]of[
    ['wrong case in frozen spindlefruit',r=>{r.frames.find(q=>q.name==='near-spindlefruit').name='near-mereMemorial';}],
    ['path traversal scene name',r=>{r.frames.find(q=>q.name==='near-spindlefruit').name='near-../../spindlefruit';}],
    ['duplicate near scene',r=>{r.frames.find(q=>q.name==='near-agrimonypattern').name='near-spindlefruit';}],
    ['missing near scene',r=>{r.frames=r.frames.filter(q=>q.name!=='near-speedwellseasoning');}]
  ]){
    const bad=structuredClone(report);mutate(bad);let first='';try{validate(bad,head);}catch(e){first=e.message.split('\n')[0];}
    assert.equal(first,'scene047 exact ordered ten known scene names','scene047 real metadata first RED '+name);validate(report,head);proofs.push({name,first,restored:true});
  }
  return proofs;
}
function main(){
  assert.equal(process.env.GITHUB_ACTIONS,'true','wave047 scene transfer runs on GitHub Actions only');
  const root=path.join(__dirname,'shots','wave047','scenes'),report=JSON.parse(fs.readFileSync(path.join(root,'manifest-scenes.json'))),part=Number(process.env.WAVE047_SCENE_PART),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
  assert(Number.isInteger(part)&&part>=0&&part<5,'wave047 exact five scene transfer parts');
  const rows=validate(report,process.env.GITHUB_SHA),negative=controls(report,process.env.GITHUB_SHA),selected=rows.slice(part*2,part*2+2);assert.equal(selected.length,2,'scene047 exactly two originals per part');
  for(const q of selected){
    const bytes=fs.readFileSync(path.join(root,q.file));assert.equal(bytes.length,q.bytes,'scene047 original byte length');assert.equal(hash(bytes),q.sha256,'wave047 exact previously captured scene bytes');
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a','scene047 original PNG');assert.equal(bytes.readUInt32BE(16),1280);assert.equal(bytes.readUInt32BE(20),657);
    const name='scenes/'+q.file;console.log('WAVE047_FILE_BEGIN '+JSON.stringify({name,head:report.head,bytes:bytes.length,sha256:hash(bytes),evidenceOnly:true,part}));
    const b64=bytes.toString('base64');for(let i=0;i<b64.length;i+=4096)console.log('WAVE047_FILE_DATA '+b64.slice(i,i+4096));console.log('WAVE047_FILE_END '+name);
  }
  console.log('wave047 exact-name scene evidence '+JSON.stringify({head:report.head,part,transferred:2,nativeFrameCount:57,edgeCount:40,valvePairs:8,negative,gameExecuted:false,imagesChanged:false}));
}
module.exports={validate,controls};if(require.main===module)main();
