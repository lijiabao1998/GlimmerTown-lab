'use strict';
// Read-only source photographs; no game, image generation or image editing.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Source photo reads run on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const out=path.join(__dirname,'shots','wave033','primary-sources');fs.mkdirSync(out,{recursive:true});
const sources=[
  ['york-central-hall.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b0/Central_Hall_and_Physics-Electronics_-_geograph.org.uk_-_4704778.jpg'],
  ['roger-stevens.jpg','https://upload.wikimedia.org/wikipedia/commons/a/a5/Roger_Stevens_Building_-_geograph.org.uk_-_816896.jpg'],
  ['roger-stevens-east.jpg','https://upload.wikimedia.org/wikipedia/commons/4/42/Roger_Stevens_Building%2C_University_of_Leeds_%282004%29.jpg'],
  ['st-catherines.jpg','https://upload.wikimedia.org/wikipedia/commons/7/72/Old_stcatz.jpg'],
  ['senate-house.jpg','https://upload.wikimedia.org/wikipedia/commons/f/ff/Senate_House_-_geograph.org.uk_-_5400623.jpg']
];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function emit(name,b){console.log('WAVE033_SOURCE_BEGIN '+JSON.stringify({name,bytes:b.length,sha256:hash(b),head:process.env.GITHUB_SHA}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE033_SOURCE_DATA '+s.slice(i,i+4096));console.log('WAVE033_SOURCE_END '+name);}
(async()=>{
  const report={head:process.env.GITHUB_SHA,scope:'Read-only original real-building photographs for observation; architectural facts remain the HE/HES primary records; not art acceptance',images:[]};
  for(const[name,url]of sources){
    const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(60000)});assert.equal(r.status,200,'source033 HTTP 200 '+name);
    assert((r.headers.get('content-type')||'').startsWith('image/'),'source033 real image '+name);
    const b=Buffer.from(await r.arrayBuffer());assert(b.length>1000&&b.length<2000000,'source033 bounded image '+name);fs.writeFileSync(path.join(out,name),b);
    report.images.push({name,url,receivedURL:r.url,status:r.status,contentType:r.headers.get('content-type'),bytes:b.length,sha256:hash(b)});emit(name,b);
  }
  const b=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'source-manifest.json'),b);emit('source-manifest.json',b);
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
