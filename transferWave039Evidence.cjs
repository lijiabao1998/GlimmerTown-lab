'use strict';
// Byte transport of existing same-run artifacts only; never starts the game.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),zlib=require('node:zlib');
assert.equal(process.env.GITHUB_ACTIONS,'true','evidence039 exports official CI artifacts only');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function send(name,b){console.log('WAVE039_EVIDENCE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const t=b.toString('base64');for(let i=0;i<t.length;i+=4096)console.log('WAVE039_EVIDENCE_DATA '+t.slice(i,i+4096));console.log('WAVE039_EVIDENCE_END '+name);}
if(process.argv[2]==='sprites'){
 const root=path.join('shots','wave039','preview'),manifest=fs.readFileSync(path.join(root,'manifest-preview039.json')),m=JSON.parse(manifest),scope=JSON.parse(fs.readFileSync('wave039-original-scope.json'));
 assert.equal(m.head,process.env.GITHUB_SHA,'evidence039 exact producer head');assert.equal(scope.rows.length,10);
 const part=Number(process.argv[3]);assert(Number.isInteger(part)&&part>=0&&part<5);const names=[];
 for(const row of scope.rows.slice(part*2,part*2+2))for(let view=0;view<4;view++)for(const mode of['day','night'])names.push(row.id+'-r'+view+'-'+mode+'.png');
 assert.equal(names.length,16);for(const name of names){const pin=m.files.find(f=>f.name===name);assert(pin,'evidence039 manifest file '+name);const b=fs.readFileSync(path.join(root,name));assert.equal(b.length,pin.bytes);assert.equal(hash(b),pin.sha256);send('sprites/'+name,b);}
 if(part===0)send('manifest-preview039.json',manifest);
 console.log('WAVE039_EVIDENCE '+JSON.stringify({kind:'same-run-sprites',part,files:16,head:m.head,renderedHere:false}));
}else if(process.argv[2]==='power'){
 const root=path.join('shots','wave039','night-power'),b=fs.readFileSync(path.join(root,'manifest-night-power039.json.gz')),m=JSON.parse(zlib.gunzipSync(b));
 assert.equal(m.head,process.env.GITHUB_SHA,'evidence039 exact power producer head');assert.equal(m.actualGamePNGCount,275);assert.equal(m.phases.length,4);assert.equal(m.phases.reduce((n,p)=>n+p.cases.length,0),160);
 send('night-power/manifest-night-power039.json.gz',b);
 console.log('WAVE039_EVIDENCE '+JSON.stringify({kind:'same-run-complete-power-manifest',cases:160,PNG:275,head:m.head,renderedHere:false}));
}else throw Error('evidence039 declared export kind');
