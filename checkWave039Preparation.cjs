'use strict';
// GPT-039 C2: static start-snapshot audit only. No game/Chrome execution.
// A passing preparation audit never means model, art, native or release acceptance.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ROOT=__dirname,BASE='8fd1d5e0ec98c729369bebffdd329e93cead93ba',TREE='60cc34a20b6fb420b70bc107ecb993fa471d7e19';
const CARD={commit:'57df89d3081cf645847e33999b2c9e604d4c0510',path:'docs/branch/GPT-039-british-wave11-gardens-glasshouses.md',bytes:11263,sha256:'b626050ba80b00626e004503bd8152ec336c9476e3ffef3d7b15efab5cae844f',gitBlob:'9d8d254b0df9f1b8c86470d4070a6a0714f7b6b8'};
const EXPECTED={families:['bld'],newLeafCount:40,nativeStaticOriginals:80,nearOriginals:10,contacts:3,nativeFirstRedMinimum:12,normalSeeds:[31,71,103],normalCheckpoints:9,powerCases:160,powerPNGs:275,phaseWitnesses:1920,sceneStates:97,scenePNGs:113,fullFramePairs:8,pedestrians:17,pedestrianNegatives:2,performanceGroups:40,realDelayNegatives:30,fullAcceptanceJobs:21,smokeActualRuns:3,fiscalChecks:53,fiscalNegatives:10,fieldExclusions:[]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const read=p=>{const q=path.join(ROOT,p);return fs.lstatSync(q).isSymbolicLink()?Buffer.from(fs.readlinkSync(q)):fs.readFileSync(q);};
const gitFiles=()=>cp.execFileSync('git',['ls-tree','--full-tree','-r','-l','-z',TREE],{cwd:ROOT,maxBuffer:4*1024*1024}).toString().split('\0').filter(Boolean).map(line=>{const m=/^(\d+) (\w+) ([a-f0-9]{40})\s+(\d+)\t([\s\S]+)$/.exec(line);assert(m&&m[2]==='blob','wave039 independent Git tree entry');return{path:m[5],mode:m[1],sha:m[3],bytes:+m[4]};});
const sorted=xs=>xs.slice().sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
function verifyScope(pins,reader=read){
  assert.equal(pins.schema,'wave039.preparation.v1','wave039 preparation schema');
  assert.equal(pins.base.commit,BASE,'wave039 exact independently read main');
  assert.equal(pins.base.tree,TREE,'wave039 exact independently read tree');
  assert.deepEqual(pins.firstCard,CARD,'wave039 immutable first-card object');
  const card=reader(CARD.path).subarray(0,CARD.bytes);
  assert.equal(card.length,CARD.bytes,'wave039 first-card prefix length');
  assert.equal(sha(card),CARD.sha256,'wave039 immutable first-card prefix');
  assert.equal(blob(card),CARD.gitBlob,'wave039 immutable first-card blob');
  const rows=card.toString('utf8').split('\n').filter(s=>/^\| [a-z]/.test(s)).map(s=>s.split('|').slice(1,-1).map(x=>x.trim()));
  assert.equal(rows.length,10,'wave039 ten first-card prototypes');
  assert.equal(pins.prototypes.length,10,'wave039 exact ten complete scope');
  assert.deepEqual(pins.prototypes.map(q=>[q.id,q.nm+'（'+q.en+'）',String(q.v),q.structure,'[來源]('+q.primarySource+')']),rows,'wave039 exact frozen ordered identity/geometry/source');
  assert.deepEqual(pins.prototypes.flatMap(q=>[0,1,2,3].map(v=>q.v+v)),Array.from({length:40},(_,i)=>560+i),'wave039 exactly forty reserved native IDs');
  assert.deepEqual(pins.expected,EXPECTED,'wave039 original full acceptance floor');
  assert.deepEqual(sorted(pins.baseFiles),sorted(gitFiles()),'wave039 complete independently pinned Git tree file set');
  return{modelsDeclared:10,newLeavesDeclared:40,independentBaseFiles:pins.baseFiles.length};
}
function verifyBaseBytes(pins,reader=read){
  let n=0;
  for(const e of pins.baseFiles){const b=reader(e.path);assert.equal(b.length,e.bytes,'wave039 base file bytes '+e.path);assert.equal(blob(b),e.sha,'wave039 base file blob '+e.path);n++;}
  const b=reader('index.html');assert.equal(sha(b),'9583cb3890d07d8e536cb804efa620ade885ea29b10778ac7c6405bfaa201852','wave039 complete base HTML SHA256');
  return n;
}
function run(selfTest=false){
  const pins=JSON.parse(fs.readFileSync(path.join(ROOT,'wave039-scope.json'),'utf8')),result=verifyScope(pins),negativeControls=[];
  const fail=(name,fn,target)=>{let red;try{fn();}catch(e){red=e;}assert(red&&red.message.includes(target),'wave039 negative must first fail target '+name);negativeControls.push({name,firstRed:red.message.split('\n')[0],target});verifyScope(pins);};
  assert.equal(verifyBaseBytes(pins),1261,'wave039 all actual previous files');
  if(selfTest){
    let bad=structuredClone(pins);bad.prototypes.pop();fail('missing tenth prototype',()=>verifyScope(bad),'wave039 exact ten complete scope');
    bad=structuredClone(pins);bad.prototypes[0].id='dunmore';fail('replace with already used heritage identity',()=>verifyScope(bad),'wave039 exact frozen ordered identity/geometry/source');
    bad=structuredClone(pins);bad.prototypes[9].v=560;fail('same-length duplicate native allocation',()=>verifyScope(bad),'wave039 exact frozen ordered identity/geometry/source');
    bad=structuredClone(pins);bad.expected.powerCases=159;fail('lower original complete power floor',()=>verifyScope(bad),'wave039 original full acceptance floor');
    bad=structuredClone(pins);bad.baseFiles.pop();fail('omit one old file from protected set',()=>verifyScope(bad),'wave039 complete independently pinned Git tree file set');
    fail('rewrite first-card requirement',()=>verifyScope(pins,p=>p===CARD.path?Buffer.from(read(p).toString().replace('不塞假模型','可塞假模型')):read(p)),'wave039 immutable first-card prefix');
    for(const file of['index.html','probeTenPower038.cjs','.github/workflows/smoke.yml']){
      fail('one real byte drift '+file,()=>verifyBaseBytes(pins,p=>{const b=read(p);if(p===file){const x=Buffer.from(b);x[x.length-1]^=1;return x;}return b;}),'wave039 base file blob '+file);
      assert.equal(verifyBaseBytes(pins),1261,'wave039 exact original bytes restored after '+file);
    }
  }
  return{preparationOK:true,...result,baseBytesVerified:1261,baseMain:BASE,baseTree:TREE,negativeControls,scope:'static first-card/main-source protection only',modelReferenceGate:'BLOCKED: actual original photograph pixels not yet available',photographsActuallyViewed:0,newModelsImplemented:0,newNativeSpriteLeaves:0,gameOrChromeExecuted:false,nativeAcceptanceRun:false,fullWaveAcceptance:false,publicationVerified:false};
}
module.exports={verifyScope,verifyBaseBytes,run};
if(require.main===module){try{console.log(JSON.stringify(run(process.argv.includes('--self-test')),null,2));}catch(e){console.error(e.stack);process.exitCode=1;}}

