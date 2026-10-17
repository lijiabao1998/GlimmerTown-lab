'use strict';
// Early native preview on GitHub Actions. This is not final acceptance.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js'),OUT=path.join(ROOT,'shots','wave027','preview'),index=path.join(ROOT,'index.html');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(!process.env.GITHUB_ACTIONS)throw Error('Run native previews only on GitHub Actions');
function transfer(name,b){console.log('WAVE027_FILE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE027_FILE_DATA '+s.slice(i,i+4096));console.log('WAVE027_FILE_END '+name);}
function capture027(){
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);
  if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const api=GV.britishWave027,rows=api.rows(),placed=[];
  const lot=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3){if(!GV.placePreview459('landmark',x,y)?.ok)continue;let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('No native preview lot');};
  for(const q of rows){
    const p=lot();api.open();const b=document.querySelector('[data-wave027="'+q.id+'"]');if(!b||b.disabled)throw Error('Preview native catalog unavailable '+q.id);b.click();
    const before=GV.devMoney516B(),cost=GV.placePreview459('landmark',p.x,p.y).cost;
    if(!GV.placeUndo('landmark',p.x,p.y)||api.read(p.x,p.y)?.v!==q.v)throw Error('Preview native placement '+q.id);
    const spent=before-GV.devMoney516B();if(spent!==cost||spent<=0)throw Error('Preview native finite-money fee '+q.id);
    GV.testAge635(p.x,p.y,2,2,30);placed.push({...p,id:q.id,v:q.v,spent});
  }
  api.close();GV.selectTool434('pan');const game=document.getElementById('game');game.dispatchEvent(new PointerEvent('pointermove',{clientX:-100000,clientY:-100000,pointerId:99,pointerType:'mouse'}));
  const sprites=GV.art574.SPR().bld,images=[],contacts={};
  for(const mode of['day','night']){
    const c=document.createElement('canvas');c.width=640;c.height=rows.length*220;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
    rows.forEach((q,i)=>{for(let v=0;v<4;v++){const s=sprites['24_1_'+(q.v+v)];if(!s||s.w!==160||s.h!==196||s.sz!==2)throw Error('Preview native sprite '+q.id+'/'+v);g.drawImage(s.img,v*160,i*220+19);if(mode==='night'){g.fillStyle='#081314';g.fillRect(v*160,i*220+19,160,196);g.globalAlpha=.25;g.drawImage(s.img,v*160,i*220+19);g.globalAlpha=1;g.drawImage(s.night,v*160,i*220+19);}g.fillStyle='#eee3cb';g.font='11px sans-serif';g.fillText(q.en+' / '+v,v*160+3,i*220+13,154);if(mode==='day')for(const layer of['day','night'])images.push({file:q.id+'-r'+v+'-'+layer+'.png',w:s.w,h:s.h,data:(layer==='day'?s.img:s.night).toDataURL('image/png'),details:s.details});}});
    contacts['contact-'+mode+'.png']=c.toDataURL('image/png');
  }
  const at=[placed.reduce((a,p)=>a+p.x+.5,0)/placed.length,placed.reduce((a,p)=>a+p.y+.5,0)/placed.length],frames=[];
  window.__waterF695=0;
  for(const night of[false,true])for(let rot=0;rot<4;rot++){
    GV.britishWeather004(1,0,0);GV.setRot(rot);GV.art574.zoom574(1.5);GV.lookAt(...at);const t=GV.art574.cycle574()*(night?.02:.5);GV.setVisT(t);GV.forceDraw();GV.setVisT(t);GV.forceDraw();
    frames.push({file:'native-'+(night?'night':'day')+'-r'+rot+'.png',w:game.width,h:game.height,data:game.toDataURL('image/png')});
  }
  return{rows,placed,images,contacts,frames,slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),prototypeCount:rows.length};
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});const committed=fs.readFileSync(index);let report;
  try{
    cp.execFileSync(process.execPath,['embed-wave027.cjs'],{cwd:ROOT,stdio:'inherit'});const preview=fs.readFileSync(index);
    report={head:process.env.GITHUB_SHA,base:'57069b0db4c6182c95f23d0f9fa90ac78b65eb3c',prototypeOnly:!committed.equals(preview),committedIndexSHA256:hash(committed),previewIndexSHA256:hash(preview),scope:'early native preview; final guards separate',notClaimed:['all ten complete','final native/save/pixel/negative/performance acceptance','mobile hardware validation'],files:[]};
    const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{const x=await cdp.evalJs('('+capture027.toString()+')()');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return x;});
    assert(r.ok&&r.result,'native preview boot: '+r.fails.join('; '));const q=r.result;assert.equal(q.slot,'3');
    Object.assign(report,{prototypeCount:q.prototypeCount,rows:q.rows,placed:q.placed,slot:q.slot,version:q.version});
    function write(name,url){const b=Buffer.from(url.split(',')[1],'base64');fs.writeFileSync(path.join(OUT,name),b);const m={name,bytes:b.length,sha256:hash(b)};report.files.push(m);return b;}
    for(const im of q.images)write(im.file,im.data);for(const[name,url]of Object.entries(q.contacts)){const b=write(name,url);transfer(name,b);}for(const f of q.frames){const b=write(f.file,f.data);if(f.file==='native-day-r0.png')transfer(f.file,b);}
    report.restoredCommittedIndex=true;const b=Buffer.from(JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(OUT,'manifest-preview027.json'),b);transfer('manifest-preview027.json',b);
    console.log('WAVE027_PREVIEW '+JSON.stringify({prototypeCount:q.prototypeCount,installedViews:q.prototypeCount*4,actualNativePaidPlacements:q.placed.length,frames:q.frames.length,prototypeOnly:report.prototypeOnly,finalAcceptance:false}));
  }finally{fs.writeFileSync(index,committed);}
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'preview-error.txt'),e.stack+'\n');console.error(e.stack);process.exitCode=1;});
