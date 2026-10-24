'use strict';
// Early native preview on GitHub Actions. This is not final acceptance.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js'),OUT=path.join(ROOT,'shots','wave044','preview'),index=path.join(ROOT,'index.html');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(!process.env.GITHUB_ACTIONS)throw Error('Run native previews only on GitHub Actions');
function transfer(name,b){console.log('WAVE044_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE044_FILE_DATA '+s.slice(i,i+4096));console.log('WAVE044_FILE_END '+name);}
function capture044(){
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);
  if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const api=GV.britishWave044,rows=api.rows(),placed=[];
  const lot=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3){if(!GV.placePreview459('landmark',x,y)?.ok)continue;let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('No native preview lot');};
  for(const q of rows){
    const p=lot();api.open();const b=document.querySelector('[data-wave044="'+q.id+'"]');if(!b||b.disabled)throw Error('Preview native catalog unavailable '+q.id);b.click();
    const before=GV.devMoney516B(),cost=GV.placePreview459('landmark',p.x,p.y).cost;
    if(!GV.placeUndo('landmark',p.x,p.y)||api.read(p.x,p.y)?.v!==q.v)throw Error('Preview native placement '+q.id);
    const spent=before-GV.devMoney516B();if(spent!==cost||spent<=0)throw Error('Preview native finite-money fee '+q.id);
    GV.testAge635(p.x,p.y,2,2,30);placed.push({...p,id:q.id,v:q.v,spent});
  }
  api.close();GV.selectTool434('pan');const game=document.getElementById('game');game.dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const sprites=GV.art574.SPR().bld,images=[],contacts={};
  for(const mode of['day','night']){
    const c=document.createElement('canvas');c.width=640;c.height=rows.length*260;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
    rows.forEach((q,i)=>{for(let v=0;v<4;v++){const s=sprites['24_1_'+(q.v+v)];if(!s||s.w!==160||s.h!==196||s.sz!==2)throw Error('Preview native sprite '+q.id+'/'+v);g.drawImage(s.img,v*160,i*260+19);if(mode==='night'){g.fillStyle='#081314';g.fillRect(v*160,i*260+19,160,196);g.globalAlpha=.25;g.drawImage(s.img,v*160,i*260+19);g.globalAlpha=1;g.drawImage(s.night,v*160,i*260+19);}g.fillStyle='#eee3cb';g.font='11px sans-serif';g.fillText(q.en+' / '+v,v*160+3,i*260+13,154);if(mode==='day')for(const layer of['day','night'])images.push({file:q.id+'-r'+v+'-'+layer+'.png',w:s.w,h:s.h,data:(layer==='day'?s.img:s.night).toDataURL('image/png'),details:s.details});}});
    contacts['contact-'+mode+'.png']=c.toDataURL('image/png');
  }
  {const a=api,spr=sprites;
  const catalog=[...GV.heritage024.rows(),...GV.britishWave025.rows(),...GV.britishWave027.rows(),...GV.britishWave029.rows(),...GV.britishWave030.rows(),...GV.britishWave031.rows(),...GV.britishWave033.rows(),...GV.britishWave035.rows(),...GV.britishWave036.rows(),...GV.britishWave037.rows(),...GV.britishWave038.rows(),...GV.britishWave039.rows(),...GV.britishWave040.rows(),...GV.britishWave041.rows(),...GV.britishWave042.rows(),...GV.britishWave043.rows()];
  const comparisons=[{"v": 760, "oldId": "beckvalve"}, {"v": 764, "oldId": "pennyfen"}, {"v": 768, "oldId": "thistlenursery"}, {"v": 772, "oldId": "rowdenmortuary"}, {"v": 776, "oldId": "briarwatch"}, {"v": 780, "oldId": "ashveterinary"}, {"v": 784, "oldId": "hawthornloom"}, {"v": 788, "oldId": "brassbell"}, {"v": 792, "oldId": "briarwatch"}, {"v": 796, "oldId": "woldswitch"}];
  const c=document.createElement('canvas');c.width=1536;c.height=3600;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
  comparisons.forEach((item,i)=>{const nr=a.rows().find(r=>r.v===item.v),or=catalog.find(r=>r.id===item.oldId);if(!or)throw Error('wave044 existing comparison metadata '+item.oldId);item.ov=or.v;for(let j=0;j<4;j++){
    const isNew=j%2===0,view=j<2?0:2,key=isNew?'24_1_'+(item.v+view):item.family?item.key+view:item.key?(j<2?item.key:item.alt):'24_1_'+(item.ov+view),family=isNew?'bld':(item.family||'bld'),s=GV.art574.SPR()[family][key],x=j*384,y=i*360;
    if(!s?.img)throw Error('wave044 actual old/new comparison sprite '+family+'.'+key);
    g.drawImage(s.img,x+40,y+25);g.fillStyle=isNew?'#eee3cb':'#a6b6a6';g.font='12px sans-serif';g.fillText((isNew?'NEW ':'OLD ')+(isNew?nr.en:(or?.en||item.name))+' / '+(!isNew&&item.key?+key.split('_').at(-1):view),x+8,y+14,368);
  }});
  contacts['contact-comparison.png']=c.toDataURL('image/png');
  }
  const at=[placed.reduce((a,p)=>a+p.x+.5,0)/placed.length,placed.reduce((a,p)=>a+p.y+.5,0)/placed.length],frames=[];
  window.__waterF695=0;
  for(const night of[false,true])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(1,0,0);GV.setRot(rot);GV.art574.zoom574(1.5);GV.lookAt(...at);const t=GV.art574.cycle574()*(night?.02:.5);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();
    frames.push({file:'native-'+(night?'night':'day')+'-r'+rot+'.png',w:game.width,h:game.height,data:game.toDataURL('image/png')});
  }
  const collected=GV.sheet536('bld','^bld[.]24_1_7[6-9][0-9]$'),collectorDiagnostics={nativeBldKeyCount:Object.keys(sprites).length,selectedFortyKeys:rows.flatMap(q=>[0,1,2,3].map(v=>'24_1_'+(q.v+v))).filter(k=>sprites[k]?.img).length,publicCollectorOK:collected.ok,publicCollectorLeaves:collected.leaves.length,sharedGuardChanged:false};
  return{collectorDiagnostics,rows,placed,images,contacts,frames,slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),prototypeCount:rows.length};
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});const committed=fs.readFileSync(index);let report;
  try{
    cp.execFileSync(process.execPath,['embed-wave044.cjs'],{cwd:ROOT,stdio:'inherit'});const preview=fs.readFileSync(index);
    report={head:process.env.GITHUB_SHA,base:'6284b854e18b12188d193652e9aa69cb7022dfea',prototypeOnly:!committed.equals(preview),committedIndexSHA256:hash(committed),previewIndexSHA256:hash(preview),scope:'early native preview; final guards separate',notClaimed:['final sixteenth-wave acceptance complete','final native/save/pixel/negative/performance acceptance','mobile hardware validation'],files:[]};
    const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{const x=await cdp.evalJs('('+capture044.toString()+')()');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return x;});
    assert(r.ok&&r.result,'native preview boot: '+r.fails.join('; '));const q=r.result;assert.equal(q.slot,'3');
    Object.assign(report,{prototypeCount:q.prototypeCount,rows:q.rows,placed:q.placed,slot:q.slot,version:q.version,collectorDiagnostics:q.collectorDiagnostics});
    function write(name,url){const b=Buffer.from(url.split(',')[1],'base64');fs.writeFileSync(path.join(OUT,name),b);const m={name,bytes:b.length,sha256:hash(b)};report.files.push(m);return b;}
    for(const im of q.images)write(im.file,im.data);for(const[name,url]of Object.entries(q.contacts)){const b=write(name,url);transfer(name,b);}for(const f of q.frames){const b=write(f.file,f.data);if(f.file==='native-day-r0.png')transfer(f.file,b);}
    report.restoredCommittedIndex=true;const b=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'manifest-preview044.json'),b);transfer('manifest-preview044.json',b);
    console.log('WAVE044_PREVIEW '+JSON.stringify({prototypeCount:q.prototypeCount,installedViews:q.prototypeCount*4,actualNativePaidPlacements:q.placed.length,frames:q.frames.length,collectorDiagnostics:q.collectorDiagnostics,prototypeOnly:report.prototypeOnly,finalAcceptance:false}));
  }finally{fs.writeFileSync(index,committed);}
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'preview-error.txt'),e.stack+'\n');console.error(e.stack);process.exitCode=1;});
