#!/usr/bin/env node
'use strict';
// Native raster and known world-space vectors test the rebuilt kit itself.
// The original architecture SHA pins protect the five recovered source modules.
// CPU canvases are buffers, not screenshots or proof of game integration.
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
const sources=[
 ['art','BritishUseScales021','7d198526e46ac209d4cf892656bcc73fd95f8115cb1a07140518b933c6276de8'],
 ['hospitality','BritishUseScalesHospitality021','7270c5e8b01626e80ddd625fa22b988ed956bbcc88f9be3141f34a6c56b81cf5'],
 ['workplaces','BritishUseScalesWorkplaces021','51f14212f00e214d4654d86f65af33f49df9575e53835e5f3820dba8859e4144'],
 ['agriculture','BritishUseScalesAgriculture021','fcc80082b4732b14b29b741018e8afcc1b67a6aec55f3b4735c277a406654781'],
 ['infrastructure','BritishUseScalesInfrastructure021','1a682da294d788bccb953e0adef45dada8da632be8c6fae0cf76c944ca02a7bc']
];
const sha=d=>crypto.createHash('sha256').update(d).digest('hex');
const checks=[],faults=[];
function check(name,fn){try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});throw e;}}
function canvas(){const c={width:0,height:0,data:null};c.getContext=()=>({
 createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),
 putImageData:p=>{c.data=new Uint8ClampedArray(p.data);},
 getImageData:()=>({data:c.data})
});return c;}
const kitSource=fs.readFileSync('british-use-scales-kit021.js','utf8');
function context(kit){const c=vm.createContext({document:{createElement:tag=>{assert.strictEqual(tag,'canvas');return canvas();}}});
 vm.runInContext(fs.readFileSync('british-complex-primitives014.js','utf8'),c);
 vm.runInContext(kit,c);return c;}
const ctx=context(kitSource),spec={sz:2,w:160,h:194,id:'projection-check'};
const vectors=[[72,127],[108,137],[88,155],[52,145]];
function projectionCheck(c){for(let view=0;view<4;view++){
 const a=c.BritishUseScalesKit021.create(spec,view),actual=Array.from(a.project(7,11,19));
 assert.deepStrictEqual(actual,vectors[view],'native-vector view'+view);
}}
const assets=[];
let failure=null;
try{
 check('kit-project-known-native-vectors',()=>projectionCheck(ctx));
 check('kit-view-bounds',()=>{for(const v of[-1,4,1.5,NaN])assert.throws(()=>ctx.BritishUseScalesKit021.create(spec,v));});
 check('kit-chimney-real-head-and-copy',()=>{const a=ctx.BritishUseScalesKit021.create(spec,0);a.chimney(4,10,20,2);
  const s=a.finish();assert.strictEqual(s.smoke.length,0);assert.strictEqual(s.smoke608.length,1);
  const p=Array.from(s.smoke608[0]);assert(Math.abs(p[0]-68)<1e-9&&Math.abs(p[1]-116.4)<1e-9);
  s.smoke608[0][0]=999;assert.strictEqual(a.finish().smoke608[0][0],68);
  assert.strictEqual(a.finish({smoke608:[]}).smoke608.length,0);
 });
 check('kit-project-fault-target-is-first-red',()=>{const bad=kitSource.replace('spec.w/2+2*u-2*v','spec.w/2+8+2*u-2*v');
  assert.notStrictEqual(bad,kitSource);let firstRed;
  try{projectionCheck(context(bad));}catch(e){firstRed=e;}
  assert(firstRed&&/native-vector view0/.test(firstRed.message),'fault must fail the first target projection guard');
  faults.push({mutation:'project x +8',firstRed:'kit-project-known-native-vectors',error:firstRed.message});
 });
 for(const [name,key,pin] of sources){const file='british-use-scales-'+name+'021.js',raw=fs.readFileSync(file);
  check('original-source-'+name,()=>assert.strictEqual(sha(raw),pin));vm.runInContext(raw.toString(),ctx,{filename:file});
  for(const q of ctx[key].specs)for(let view=0;view<4;view++)check('native-raster-'+q.id+'-view'+view,()=>{
   const a=ctx[key].build(q.id,view),day=a.img.data,night=a.night.data;
   assert.strictEqual(a.w,q.w);assert.strictEqual(a.h,q.h);assert.strictEqual(a.ax,q.w/2);assert.strictEqual(a.ay,q.h-2);
   assert.strictEqual(day.length,q.w*q.h*4);assert.strictEqual(night.length,day.length);
   let count=0,lit=0,minX=q.w,minY=q.h,maxX=-1,maxY=-1;
   for(let k=0;k<day.length;k+=4){const da=day[k+3],na=night[k+3];assert(da===0||da===255);assert(na===0||na===255);
    if(da){count++;const p=k/4,x=p%q.w,y=Math.floor(p/q.w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
    if(na){lit++;assert.strictEqual(da,255,'night spills beyond real day geometry');}
   }
   assert(count>q.sz*q.sz*80,'empty/undersized raster');assert(minX>0&&minY>0&&maxX<q.w-1&&maxY<q.h-1,'raster reaches clipping border');
   for(const p of a.smoke608||[])assert(p.length===2&&p.every(Number.isFinite),'invalid smoke head');
   assets.push({id:q.id,view,w:q.w,h:q.h,daySHA256:sha(day),nightSHA256:sha(night),occupied:count,lit,bounds:[minX,minY,maxX,maxY],smoke608:a.smoke608||[]});
  });
 }
 check('36-unique-forms-144-native-rasters',()=>{assert.strictEqual(assets.length,144);assert.strictEqual(new Set(assets.map(a=>a.id)).size,36);});
}catch(e){failure=e.message;}
const report={kind:'Rebuilt kit CPU native-raster guard; no game screenshots or integration claim',sourceSHA256:sha(kitSource),checks,assets,faults,ok:!failure,failure};
const outArg=process.argv.find(a=>a.startsWith('--out='));if(outArg)fs.writeFileSync(outArg.slice(6),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:report.ok,checks:checks.length,passed:checks.filter(c=>c.ok).length,assets:assets.length,failure,sourceSHA256:report.sourceSHA256}));
if(failure)process.exitCode=1;
