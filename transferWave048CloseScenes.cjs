'use strict';
// Exact frozen-name transport for existing CI originals. No game or image edits.
// The historical lowercase-only transporter is retained byte-for-byte.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const names=Object.freeze(['foxglovecharter','silverweedalpine','maddartutors','restharrowsalt','betonymarionette','burnetterrace','figwortcolour','damewortcruck','pimpernelcross','fumitorygin'].map(id=>'near-'+id));
function validate(report,head){
  assert.equal(report.head,head,'scene048 exact source head');
  const rows=report.frames.filter(q=>q.name.startsWith('near-'));
  assert.deepEqual(rows.map(q=>q.name),names,'scene048 exact ordered ten known scene names');
  assert.equal(report.frames.length,57,'scene048 frozen57 native frames');assert.equal(report.edge.length,40,'scene048 frozen40 edge frames');
  assert.equal(report.valve.length,8,'scene048 eight complete BASE-valve pairs');assert(report.valve.every(q=>q.equal===true&&q.w===1280&&q.h===657),'scene048 complete native canvas valve proof');
  assert.deepEqual(report.failures,[],'scene048 original scene criteria pass');assert.deepEqual(report.unrun,[],'scene048 original scene matrix complete');
  for(const q of rows){assert.equal(q.file,q.name+'.png','scene048 exact original scene filename');assert.equal(q.w,1280);assert.equal(q.h,657);assert(Number.isInteger(q.bytes)&&q.bytes>0);assert.match(q.sha256,/^[0-9a-f]{64}$/);}
  return rows;
}
function controls(report,head){
  const proofs=[];
  for(const [name,mutate]of[
    ['wrong case in frozen foxglovecharter',r=>{r.frames.find(q=>q.name==='near-foxglovecharter').name='near-mereMemorial';}],
    ['path traversal scene name',r=>{r.frames.find(q=>q.name==='near-foxglovecharter').name='near-../../foxglovecharter';}],
    ['duplicate near scene',r=>{r.frames.find(q=>q.name==='near-silverweedalpine').name='near-foxglovecharter';}],
    ['missing near scene',r=>{r.frames=r.frames.filter(q=>q.name!=='near-fumitorygin');}]
  ]){
    const bad=structuredClone(report);mutate(bad);let first='';try{validate(bad,head);}catch(e){first=e.message.split('\n')[0];}
    assert.equal(first,'scene048 exact ordered ten known scene names','scene048 real metadata first RED '+name);validate(report,head);proofs.push({name,first,restored:true});
  }
  return proofs;
}
function main(){
  assert.equal(process.env.GITHUB_ACTIONS,'true','wave048 scene transfer runs on GitHub Actions only');
  const root=path.join(__dirname,'shots','wave048','scenes'),report=JSON.parse(fs.readFileSync(path.join(root,'manifest-scenes.json'))),part=Number(process.env.WAVE048_SCENE_PART),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
  assert(Number.isInteger(part)&&part>=0&&part<5,'wave048 exact five scene transfer parts');
  const rows=validate(report,process.env.GITHUB_SHA),negative=controls(report,process.env.GITHUB_SHA),selected=rows.slice(part*2,part*2+2);assert.equal(selected.length,2,'scene048 exactly two originals per part');
  for(const q of selected){
    const bytes=fs.readFileSync(path.join(root,q.file));assert.equal(bytes.length,q.bytes,'scene048 original byte length');assert.equal(hash(bytes),q.sha256,'wave048 exact previously captured scene bytes');
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a','scene048 original PNG');assert.equal(bytes.readUInt32BE(16),1280);assert.equal(bytes.readUInt32BE(20),657);
    const name='scenes/'+q.file;console.log('WAVE048_FILE_BEGIN '+JSON.stringify({name,head:report.head,bytes:bytes.length,sha256:hash(bytes),evidenceOnly:true,part}));
    const b64=bytes.toString('base64');for(let i=0;i<b64.length;i+=4096)console.log('WAVE048_FILE_DATA '+b64.slice(i,i+4096));console.log('WAVE048_FILE_END '+name);
  }
  console.log('wave048 exact-name scene evidence '+JSON.stringify({head:report.head,part,transferred:2,nativeFrameCount:57,edgeCount:40,valvePairs:8,negative,gameExecuted:false,imagesChanged:false}));
}
module.exports={validate,controls};if(require.main===module)main();
