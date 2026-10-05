'use strict';
// Pure source/data contract. Never imports a runtime runner or starts a browser.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {execFileSync} = require('node:child_process'), {isDeepStrictEqual: equal} = require('node:util');
const OFFICIAL = 'https://lijiabao1998.github.io/GlimmerTown-lab/';
const APPROVED = '2b0a28621741952369bd6e49a7ab21b716fbb94d';
const APPROVED_SOURCE_SHA256 = '8466b7eeaa0dccda8b12e0f53af746991d85baa5de80aedf2f1700112ae10f89';
const RELEASE_SOURCE_SHA256 = '282335f0bc731d56d83d1c129015740f54c4637b1f36e0721a77117e6f0e844c';
const RELEASE_BASELINE_SHA256 = '752bd3575016232d1ddece51065f4d03a2f55e2a7af59a92a88eb8182e1994db';
const BASE = '6583659d2e14db3b8ae92115d05432d64a0c989d';
const BASELINE_SHA256 = '21026775f0461ade01c2428642d0ba9355fdb5d6c49c61b6170986b3252e4ee2';
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const read = (root, file) => fs.readFileSync(path.join(root, file));
const gitFile = (root, rev, file) => execFileSync('git', ['show', rev + ':' + file], {cwd:root, maxBuffer:32*1024*1024});
const dependencyPins = Object.freeze({
 'harness.js':'3e86ecaa828fe32a61ffe88a89f420868a6911dc194c6e6a627efdcb1ac28cf6',
 'publiclife-legacy-fixture007.js':'f91a1c2b7e79eb635937910535191b842b4f6782cec51e2569a73b04323c6e11',
 'streetlife-integration-qa009.js':'6585359c7af48ee68d09f20720d778b12ddf3da687190cc755bd7d34447e1b05',
 'museum-integration-qa010.js':'3937eaf0f1f8008c9bea5e7b5d88c105665cae8fb5020cb15fa7ec5bf73b6d23',
 'streetlife-fingerprint-qa009.js':'1633521961a1021edbb2af1a1d4851da4045e1b7bedec0add044c498672bead3',
 'coldload-public-log011.js':'dea834c1b96db8f2cd41ae6efc5e27b06639ba117a1b24764a3e978662e9381b'
});
const fixtureRanges = Object.freeze([
 ['streetlife-integration-qa009.js','function setupStreet009(','function snapshot009(','11cebcd7a47343bbe1f0f29d6fe78da92b863973fd157c21ede31626fc2b777f'],
 ['museum-integration-qa010.js','function setupMuseum010(','function assets010(','37c0be326c5763933e2835accedb9e2fad4403a1167b986bd40bea5dbfca0eb6'],
 ['riverside-integration-qa012.js','function bindObservation012(','function assetAudit012(','5124b592037c69719b643c418d04ea32db553a43511420525ef8622b4827ab06'],
 ['riverside-integration-qa012.js','function nativeScene012(','function nativeLight012(','7636020b77a88da9e14bb19178b238b9f2781b920d0970c8a3975a1209d30d63'],
 ['riverside-integration-qa012.js','function retailWitness012(','function physicalLoss012(','22f1390ab12722b5c5bde87b51da3ca5d501891ededacd4bb6393fcff0b843ca']
]);
function range(text, start, end) {
 const a=text.indexOf(start), b=text.indexOf(end,a);
 if(a<0||b<=a||text.indexOf(start,a+1)>=0)throw Error('Missing or repeated pinned function: '+start);
 return text.slice(a,b);
}
function normalizeRelease012(bytes) {
 let s=bytes.toString('utf8');
 for(const [from,to] of [["const GAME_VER='14.29'","const GAME_VER='14.28'"],
  ["const GAME_ANCHOR='T725'","const GAME_ANCHOR='T724'"],
  ['id="startVersion456">v14.29 · T725','id="startVersion456">v14.28 · T724']]) {
  if(s.split(from).length!==2)throw Error('Exact release label missing or repeated: '+from);
  s=s.replace(from,to);
 }
 return Buffer.from(s);
}
function fixtureSource012(root) {
 return fixtureRanges.map(([file,start,end,pin])=>{
  const body=range(read(root,file).toString(),start,end);
  if(hash(body)!==pin)throw Error('Approved fixture body changed: '+file+' '+start);
  return body;
 }).join('\n');
}
function verifyRelease012(root, expected) {
 if(!/^[0-9a-f]{40}$/.test(expected||''))throw Error('Full expected deployment commit required');
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 if(head!==expected)throw Error('Release checkout is not the expected deployment SHA');
 const subject=execFileSync('git',['log','-1','--format=%s'],{cwd:root,encoding:'utf8'}).trim();
 if(!subject.startsWith('T725 '))throw Error('Exact T725 release title prefix required');
 const approved=gitFile(root,APPROVED,'index.html'), current=read(root,'index.html'), normalized=normalizeRelease012(current);
 if(hash(approved)!==APPROVED_SOURCE_SHA256||hash(current)!==RELEASE_SOURCE_SHA256||!normalized.equals(approved))throw Error('Release differs from approved product beyond three labels');
 for(const [file,pin] of Object.entries(dependencyPins))if(hash(read(root,file))!==pin)throw Error('Pinned observer dependency changed: '+file);
 const fixtures=fixtureSource012(root);
 return {ok:true,release:true,version:'14.29',anchor:'T725',checkedSHA:head,subject,approvedSHA:APPROVED,
  sourceSHA256:hash(current),approvedSourceSHA256:APPROVED_SOURCE_SHA256,htmlExact:true,
  dependenciesExact:true,fixtureBodiesExact:true,fixtureSHA256:hash(fixtures),base:BASE};
}
const expectedAdditions=[...[278,279,280].flatMap(k=>[0,1,2,3].map(v=>`bld.${k}_1_${v}`)),
 ...['quay','rail','promenade'].flatMap(t=>[0,1,2,3].map(v=>`riverside012.${t}_${v}`))].sort();
function verifyPublicFingerprint012(root, fp, blocks) {
 const raw=gitFile(root,BASE,'fp.json');
 if(hash(raw)!==BASELINE_SHA256)throw Error('Complete T724 pixel inventory bytes changed');
 const base=JSON.parse(raw),old=base.subs,projected={};
 if(base.version!=='14.27'||base.anchor!=='T723'||Object.keys(old).length!==2895||base.stats.families!==157||base.blocks.count!==1728)throw Error('Historical inventory missing');
 if(!fp?.ok||!fp.subs||Array.isArray(fp.subs))throw Error('Complete live native fingerprint required');
 const added=Object.keys(fp.subs).filter(k=>!Object.hasOwn(old,k)).sort();
 if(!equal(added,expectedAdditions)||Object.keys(fp.subs).length!==2919)throw Error('Exactly 24 approved additions required');
 for(const [key,value] of Object.entries(fp.subs))if(Object.hasOwn(old,key)){
  if(!equal(value,old[key]))throw Error('Old complete native leaf changed: '+key);projected[key]=value;
 }
 if(!equal(projected,old))throw Error('Old native leaf missing');
 for(const key of expectedAdditions){const q=fp.subs[key];if(!q||!equal(Object.keys(q).sort(),['d','h','n','op','w'])||q.op<=0||typeof q.n!=='string')throw Error('Incomplete new native leaf: '+key);}
 const {aggregate}=require(path.join(root,'streetlife-fingerprint-qa009.js'));
 const before=aggregate(projected),full=aggregate(fp.subs);
 if(!equal(before.families,base.families)||!equal(before.stats,base.stats))throw Error('Old complete aggregation changed');
 if(!equal(full.families,fp.families)||!equal(full.stats,fp.stats)||full.stats.families!==158||full.stats.leaves!==2919)throw Error('Live complete inventory mismatch');
 if(!blocks?.ok||!equal({fam:blocks.fam,count:blocks.count},base.blocks))throw Error('All 1728 historical block fingerprints must remain exact');
 for(const prefix of ['bld.278_1_','bld.279_1_','bld.280_1_','riverside012.quay_','riverside012.rail_','riverside012.promenade_'])
  if(new Set([0,1,2,3].map(v=>fp.subs[prefix+v].d)).size!==4)throw Error('Four native geometric views required: '+prefix);
 // T725's precise baseline policy is checked here; never rewrite fp.json.
 const trackedBytes=read(root,'fp.json'),tracked=JSON.parse(trackedBytes);
 const promoted={...base,generatedAt:tracked.generatedAt,version:'14.29',anchor:'T725',subs:fp.subs,families:fp.families,stats:fp.stats};
 if(hash(trackedBytes)!==RELEASE_BASELINE_SHA256||!Number.isFinite(Date.parse(tracked.generatedAt))||!equal(tracked,promoted))throw Error('T725 promotion must be the exact pinned live 2895+24 complete native records');
 return {ok:true,release:true,version:'14.29',anchor:'T725',base:BASE,baselineSHA256:BASELINE_SHA256,
  oldLeaves:2895,newLeaves:24,leaves:2919,oldFamilies:157,currentFamilies:158,oldBlocks:1728,
  oldCompleteRecordsExact:true,blocksExact:true,promotedNativeRecordsExact:true,releaseBaselineSHA256:RELEASE_BASELINE_SHA256,added};
}
module.exports={OFFICIAL,APPROVED,APPROVED_SOURCE_SHA256,RELEASE_SOURCE_SHA256,RELEASE_BASELINE_SHA256,BASE,BASELINE_SHA256,dependencyPins,fixtureRanges,
 hash,read,gitFile,range,normalizeRelease012,fixtureSource012,verifyRelease012,verifyPublicFingerprint012,expectedAdditions};
