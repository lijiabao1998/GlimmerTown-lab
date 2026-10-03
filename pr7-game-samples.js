'use strict';
// GPT-002: test-only Chromium samples. The product index.html is read unchanged.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {withGame}=require('./harness');
const SOURCE_SHA='4fa470b379618e98bea003846b3f30ced7f20bea';
const SOURCE_DIGEST='b2d4979497e23f32ba7cd6a4a5980710055f43da2313a293fc065e02a6c8d152';
const OUT=path.resolve(__dirname,'pr7-evidence');
for(const d of ['','full','crops','browser','assets'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const digest=crypto.createHash('sha256').update(html).digest('hex');
if(digest!==SOURCE_DIGEST)throw Error('Product source changed: '+digest);
const specs=[];for(const n of [3,4,5]){const p=html.indexOf('function ukRestSelftestGROK'+n+'()');const m=/const L=(\[.*?\]);?[,;]/.exec(html.slice(p));if(!m)throw Error('Missing specs');specs.push(...JSON.parse(m[1]).map(q=>({...q,batch:n})));}specs.sort((a,b)=>a.k-b.k);
if(specs.length!==19)throw Error('Need exactly 19 buildings');
const report={sourceSHA:SOURCE_SHA,sourceSHA256:digest,workflowSHA:process.env.GITHUB_SHA||null,createdAt:new Date().toISOString(),fixture:{seed:5162026,slot:3,zoom:2,rotation:0,day:1,weather:0,age:30,powerRate:1,description:'Real GV.place and game draw in a cleared, paused QA city; maturity and full lighting supply use existing test hooks. Not a natural construction/economy simulation.'},samples:[],checks:[],failures:[]};
const save=()=>fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(report,null,2));
const check=(name,ok,detail)=>{report.checks.push({name,ok:!!ok,detail});if(!ok)report.failures.push(name);};
const png=(name,url)=>fs.writeFileSync(path.join(OUT,name),Buffer.from(url.split(',')[1],'base64'));
(async()=>{
 const session=await withGame({port:8199,timeout:400,fresh:true,preScript:"localStorage.setItem('glimmerville.v1.slot','3');localStorage.setItem('glimmerville.v1.q','2');",log:console.log},async({cdp})=>{
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  const ev=async(expression)=>{const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  report.browser=await cdp.send('Browser.getVersion');
  report.boot=await ev(`({ready:!!window.__bootDone453,batches:window.__t574,slot:localStorage.getItem('glimmerville.v1.slot'),title:document.title})`);
  check('boot ready',report.boot.ready,report.boot);check('isolated slot 3',report.boot.slot==='3');
  for(const n of [3,4,5]){const t=await ev('GV.ukRestSelftestGROK'+n+'()');report['guardGROK'+n]=t;check('GROK00'+n+' selftest',t.ok,t.checks);}
  await ev(`(()=>{GV.metroArtSeedWorld516(5162026);GV.setSpeed(0);GV.ai(false);GV.setDay(1);GV.weather(0);GV.setRot(0);GV.art574.clear574(1,1,48,40);GV.addMoney(10000000);GV.testRebake592();GV.nightPowerTest698(1);return true;})()`);
  report.ui=await ev(`({canvas:!!document.getElementById('game'),bodyText:document.body.innerText.length,errorOverlay:!!document.querySelector('[data-nextjs-dialog],.vite-error-overlay,#webpack-dev-server-client-overlay')})`);
  check('meaningful page and game canvas',report.ui.canvas&&report.ui.bodyText>0&&!report.ui.errorOverlay,report.ui);
  for(const q of specs){
   const placement=await ev(`(()=>{const q=${JSON.stringify(q)},x=20,y=20;GV.art574.clear574(16,16,10,10);GV.testRebake592();const before=GV.tile(x,y);const can=GV.canPlaceTool(q.tool,x,y),ok=GV.place(q.tool,x,y);const root=GV.tile(x,y),refs=[];for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)refs.push({dx,dy,bld:GV.tile(x+dx,y+dy).bld});GV.testAge635(x,y,q.sz,q.sz,30);return {x,y,before,can,ok,root:root.bld,refs,after:GV.tile(x,y).bld,occupiedReason:GV.canPlaceTool(q.tool,x,y)};})()`);
   check(q.k+' real place',placement.ok&&placement.root?.k===q.k&&!placement.root.ref,placement);
   check(q.k+' mature powered fixture',placement.after?.age===30&&placement.after?.pw===true,placement.after);
   check(q.k+' footprint refs',(q.sz===1||placement.root?.sz===q.sz)&&placement.refs.every(t=>!t.dx&&!t.dy?true:t.bld?.k===q.k&&t.bld.ref?.[0]===20&&t.bld.ref?.[1]===20),placement.refs);
   check(q.k+' occupied placement blocked',!!placement.occupiedReason,placement.occupiedReason);
   const asset=await ev(`(()=>{const q=${JSON.stringify(q)},s=GV.art574.SPR().bld[q.k+'_1_0'],d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let solid=0,edge=0,overlap=0,outside40=0,outsideAny=0;for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const i=(y*s.w+x)*4;if(d[i+3]>120){solid++;if(x<=1||y<=1||x>=s.w-2||y>=s.h-2)edge++;}if(n[i+3]>40){if(d[i+3]>0)overlap++;else outside40++;}if(n[i+3]>0&&d[i+3]===0)outsideAny++;}return {w:s.w,h:s.h,ax:s.ax,ay:s.ay,solid,edge,overlap,outside40,outsideAny,day:s.img.toDataURL(),night:s.night.toDataURL()};})()`);
   png('assets/'+q.k+'-day.png',asset.day);png('assets/'+q.k+'-night-layer.png',asset.night);delete asset.day;delete asset.night;
   check(q.k+' dimensions and anchor',asset.w===q.W&&asset.h===q.H&&asset.ax===q.ax&&asset.ay===q.ay,asset);
   check(q.k+' solid edge zero',asset.solid>200&&asset.edge===0,asset);check(q.k+' Chromium sprite night spill zero',asset.outside40===0&&asset.outsideAny===0&&asset.overlap>=q.nightMin,asset);
   const row={...q,placement,asset,shots:[]};report.samples.push(row);
   for(const mode of ['day','night']){
    const shot=await ev(`(()=>{const q=${JSON.stringify(q)},mode=${JSON.stringify(mode)},s=GV.art574.SPR().bld[q.k+'_1_0'];const d=Math.round((s.ay-32*q.sz-s.h/2)/32);GV.lookAt(20-d,20-d);GV.setZoom(2);GV.setVisT(GV.art574.cycle574()*(mode==='day'?.5:.9));window.__ovCapMax606=100;window.__ovCap606=[];GV.forceDraw();const captures=window.__ovCap606.filter(it=>it.bd.k===q.k&&it.o.x===20&&it.o.y===20);window.__ovCap606=null;const c=document.getElementById('game'),g=c.getContext('2d'),a=captures[0];if(!a)throw Error('Target did not enter actual draw path: '+q.k);const bx=a.bx,by=a.by,z=a.z;const rect={x:Math.max(0,Math.floor(bx-100)),y:Math.max(0,Math.floor(by-24)),w:0,h:0};rect.w=Math.min(c.width-rect.x,Math.ceil(s.w*z+200));rect.h=Math.min(c.height-rect.y,Math.ceil(s.h*z+155));const crop=document.createElement('canvas');crop.width=rect.w;crop.height=rect.h;crop.getContext('2d').drawImage(c,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);const now=g.getImageData(rect.x,rect.y,rect.w,rect.h).data;const colors=new Set();for(let i=0;i<now.length;i+=4)colors.add((now[i]<<16)|(now[i+1]<<8)|now[i+2]);let lampDelta=null;if(mode==='night'){const sv=window.__noWinLit;window.__noWinLit=true;GV.forceDraw();const off=g.getImageData(rect.x,rect.y,rect.w,rect.h).data;lampDelta=0;for(let i=0;i<now.length;i+=4)if(Math.abs(now[i]-off[i])+Math.abs(now[i+1]-off[i+1])+Math.abs(now[i+2]-off[i+2])>3)lampDelta++;window.__noWinLit=sv;GV.forceDraw();}return {full:c.toDataURL(),crop:crop.toDataURL(),canvas:{w:c.width,h:c.height},rect,draw:{bx,by,z,w:s.w*z,h:s.h*z,captures:captures.length,withinCanvas:bx>=0&&by>=0&&bx+s.w*z<=c.width&&by+s.h*z<=c.height},nightComposition:window.__t629||null,daylight:GV.daylightDbg(),uniqueColors:colors.size,lampDelta};})()`);
    const stem=q.k+'-'+q.id+'-'+mode;png('full/'+stem+'.png',shot.full);png('crops/'+stem+'.png',shot.crop);delete shot.full;delete shot.crop;
    check(stem+' visible real draw',shot.draw.withinCanvas&&shot.draw.captures>0&&shot.uniqueColors>20,shot);
    check(stem+' phase',mode==='day'?shot.daylight.b>.95:shot.daylight.b<.45,shot.daylight);
    if(mode==='night')check(stem+' lighting changes actual scene',shot.lampDelta>0,shot.lampDelta);
    row.shots.push({mode,full:'full/'+stem+'.png',crop:'crops/'+stem+'.png',...shot});
    if([219,227,235].includes(q.k)){const r=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(OUT,'browser/'+stem+'.png'),Buffer.from(r.data,'base64'));}
   }
   console.log('SAMPLE',q.k,q.nm,'day/night captured');save();
  }
  await ev('GV.nightPowerTest698(null)');
  report.consoleErrors=cdp.errors;report.benignPwaErrors=cdp.benign;check('console and uncaught errors zero',cdp.errors.length===0,cdp.errors);
  check('19 buildings and 38 actual game samples',report.samples.length===19&&report.samples.every(s=>s.shots.length===2));
  return true;
 });
 report.session={ok:session.ok,fails:session.fails,seconds:session.seconds,chromeMs:session.chromeMs};check('session complete',session.ok&&session.result,report.session);report.ok=report.failures.length===0;save();console.log(JSON.stringify({ok:report.ok,count:report.samples.length,checks:report.checks.length,failures:report.failures,session:report.session},null,2));process.exit(report.ok?0:1);
})().catch(e=>{report.failures.push(String(e.stack||e));report.ok=false;save();console.error(e);process.exit(1);});
