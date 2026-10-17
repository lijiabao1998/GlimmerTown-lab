'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave029 scene transfer runs on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.join(__dirname,'shots','wave029','scenes'),report=JSON.parse(fs.readFileSync(path.join(root,'manifest-scenes.json'))),part=Number(process.env.WAVE029_SCENE_PART),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert(Number.isInteger(part)&&part>=0&&part<5,'wave029 exact scene transfer part');
assert.equal(report.head,process.env.GITHUB_SHA,'wave029 scene source is this exact head');
const rows=report.frames.filter(q=>q.name.startsWith('near-'));assert.equal(rows.length,10,'wave029 all ten independently captured close scenes');
for(const q of rows.slice(part*2,part*2+2)){
  assert(/^near-[a-z]+$/.test(q.name),'wave029 known scene filename');
  const name='scenes/'+q.name+'.png',bytes=fs.readFileSync(path.join(root,q.name+'.png'));assert.equal(hash(bytes),q.sha256,'wave029 exact previously captured scene bytes');
  console.log('WAVE029_FILE_BEGIN '+JSON.stringify({name,head:report.head,bytes:bytes.length,sha256:hash(bytes),evidenceOnly:true,part}));
  const b64=bytes.toString('base64');for(let i=0;i<b64.length;i+=4096)console.log('WAVE029_FILE_DATA '+b64.slice(i,i+4096));console.log('WAVE029_FILE_END '+name);
}
console.log('wave029 scene evidence part '+part+' transferred two exact original frames; no game execution or image changes');
