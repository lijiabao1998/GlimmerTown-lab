'use strict';
// Complete ten direct native-kit candidates. This is still a candidate-stage check. The frozen ten-model acceptance
// programs are separate and unchanged; nothing here installs game sprites.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Candidate raster verification runs on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {withGame,ROOT}=require('./harness.js');
const BASE='3e33523305401ea258e24204ea7218345a6dc268',FIRST='95373e6e6222cfa54830323adc8e9b0fba24120f';
const OUT=path.join(ROOT,'shots','wave038','candidates'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const source=fs.readFileSync(path.join(ROOT,'british-wave10-art038.js'),'utf8');
const index=fs.readFileSync(path.join(ROOT,'index.html'));
assert(index.equals(cp.execFileSync('git',['show',BASE+':index.html'],{cwd:ROOT,maxBuffer:20*1024*1024})),'candidate phase must leave complete game index byte-identical to main');
const card='docs/branch/GPT-038-british-wave10-commerce-markets.md';
assert(fs.readFileSync(path.join(ROOT,card),'utf8').startsWith(cp.execFileSync('git',['show',FIRST+':'+card],{cwd:ROOT,encoding:'utf8'})),'frozen first card must remain exact prefix');
assert(Buffer.from(source).equals(cp.execFileSync('git',['show','HEAD:british-wave10-art038.js'],{cwd:ROOT})),'draw the exact committed art source');
function transfer(name,b){console.log('WAVE038_CANDIDATE_BEGIN '+JSON.stringify({name,head:process.env.GITHUB_SHA,bytes:b.length,sha256:hash(b)}));const s=b.toString('base64');for(let i=0;i<s.length;i+=4096)console.log('WAVE038_CANDIDATE_DATA '+s.slice(i,i+4096));console.log('WAVE038_CANDIDATE_END '+name);}
function capture(){
  GV.setSpeed(0);
  const api=window.BritishWaveArchitecture038,rows=api.candidateRows(),expected=[['leedsCorn',520],['darlington',524],['halifax',528],['bishoplloyd',532],['burlington',536],['silver',540],['harrods',544],['liberty',548],['danum',552],['willow',556]];
  const need=(ok,msg)=>{if(!ok)throw Error(msg);};
  need(api.rows.length===10&&api.rows.find(r=>r.id==='silver')?.v===540,'same frozen ten prototypes and Silver slot');
  need(JSON.stringify(rows.map(r=>[r.id,r.v]))===JSON.stringify(expected),'exact ten source-gated candidates');
  const stats=JSON.stringify(GV.stats()),spr=GV.art574.SPR().bld,oldKeys=Object.keys(spr).sort(),before=new Map();
  const oldMap={520:260,524:484,528:256,532:100,536:212,540:208,544:480,548:104,552:316,556:440};
  for(const row of rows)for(let v=0;v<4;v++)need(!spr['24_1_'+(row.v+v)],'candidate must not pre-install '+row.id+'/'+v);
  for(const ov of Object.values(oldMap))for(const v of[0,2]){const k='24_1_'+(ov+v);need(!!spr[k]?.img,'actual previous comparison leaf '+k);before.set(k,spr[k].img.toDataURL('image/png'));}
  const pixels=c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  const renders=[],files=[],checks=[],geometry=[];
  for(const row of rows){
    const per=[];
    for(let view=0;view<4;view++){
      const s=api.build(row.id,view);need(s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view,'native geometry metadata '+row.id+'/'+view);
      const day=pixels(s.img),night=pixels(s.night);let n=0,lights=0,minX=160,minY=196,maxX=-1,maxY=-1;
      for(let k=0;k<day.length;k+=4){
        const a=day[k+3],b=night[k+3];need((a===0||a===255)&&(b===0||b===255),'hard alpha '+row.id+'/'+view);
        if(a){const i=k/4,x=i%160,y=Math.floor(i/160);n++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
        if(b){lights++;need(a===255,'night pixel supported by opaque day surface '+row.id+'/'+view);}
      }
      need(n>700&&lights>0,'nonempty day/night candidate '+row.id+'/'+view);
      need(minX>0&&minY>0&&maxX<159&&maxY<195,'uncropped native candidate '+row.id+'/'+view);
      for(const [layer,c]of[['day',s.img],['night',s.night]])files.push({name:row.id+'-r'+view+'-'+layer+'.png',data:c.toDataURL('image/png')});
      per.push(s);checks.push({id:row.id,view,dayOpaque:n,nightOpaque:lights,bounds:{minX,minY,maxX,maxY},nativeDimensions:[160,196],anchor:[80,194],details:s.details});
    }
    renders.push({row,sprites:per});
    // Exclude shared paving/lanterns to detect identical geometry silhouettes.
    const previous=window.__wave038GeometryOnly;window.__wave038GeometryOnly=true;
    try{const s=api.build(row.id,0),p=pixels(s.img),mask=[];for(let i=3;i<p.length;i+=4)mask.push(p[i]?1:0);geometry.push({id:row.id,mask:mask.join('')});}
    finally{if(previous===undefined)delete window.__wave038GeometryOnly;else window.__wave038GeometryOnly=previous;}
  }
  need(new Set(geometry.map(q=>q.mask)).size===10,'ten distinct silhouettes after excluding common paving');
  const all=api.buildAll();
  need(all.length===40&&new Set(all.map(q=>q.row.v+q.view)).size===40,'full ten-model builder returns exactly40 distinct native views');
  need(JSON.stringify(all.map(q=>[q.row.id,q.row.v,q.view]))===JSON.stringify(rows.flatMap(q=>[0,1,2,3].map(v=>[q.id,q.v,v]))),'full builder does not skip or reorder a frozen prototype');
  for(const q of all){const expectedSprite=renders.find(r=>r.row.id===q.row.id).sprites[q.view];for(const layer of['img','night'])need(q.sprite[layer].toDataURL('image/png')===expectedSprite[layer].toDataURL('image/png'),'full builder equals direct native render '+q.row.id+'/'+q.view+'/'+layer);}
  let unknownBlocked='';try{api.build('missing-frozen-prototype',0);}catch(e){unknownBlocked=e.message;}
  need(unknownBlocked==='wave038 unknown frozen prototype missing-frozen-prototype','unknown prototype still fails closed');
  for(const mode of['day','night']){
    const c=document.createElement('canvas');c.width=1040;c.height=rows.length*240;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);
    renders.forEach(({row,sprites},i)=>sprites.forEach((s,v)=>{const x=v*260+30,y=i*240+25;if(mode==='night'){g.globalAlpha=.25;g.drawImage(s.img,x,y);g.globalAlpha=1;g.drawImage(s.night,x,y);}else g.drawImage(s.img,x,y);g.fillStyle='#eee3cb';g.font='12px sans-serif';g.fillText(row.en+' / '+v,v*260+8,i*240+15,245);}));
    files.push({name:'contact-'+mode+'.png',data:c.toDataURL('image/png')});
  }
  const contact=document.createElement('canvas');contact.width=1280;contact.height=rows.length*230;const cg=contact.getContext('2d');cg.imageSmoothingEnabled=false;cg.fillStyle='#20312e';cg.fillRect(0,0,contact.width,contact.height);
  renders.forEach(({row,sprites},i)=>{for(let j=0;j<4;j++){const v=j<2?0:2,isNew=j%2===0,s=isNew?sprites[v]:spr['24_1_'+(oldMap[row.v]+v)];cg.drawImage(s.img,j*320+30,i*230+25);cg.fillStyle=isNew?'#eee3cb':'#a6b6a6';cg.font='12px sans-serif';cg.fillText((isNew?'NEW '+row.en:'OLD bld.24_1_'+(oldMap[row.v]+v))+' / '+v,j*320+6,i*230+15,308);}});
  files.push({name:'contact-comparison.png',data:contact.toDataURL('image/png')});
  for(const {row,sprites}of renders){const c=document.createElement('canvas');c.width=1280;c.height=784;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20312e';g.fillRect(0,0,c.width,c.height);g.drawImage(sprites[0].img,0,0,640,784);g.globalAlpha=.25;g.drawImage(sprites[0].img,640,0,640,784);g.globalAlpha=1;g.drawImage(sprites[0].night,640,0,640,784);files.push({name:'near-'+row.id+'.png',data:c.toDataURL('image/png')});}
  need(JSON.stringify(oldKeys)===JSON.stringify(Object.keys(spr).sort()),'candidate generation never changes the old registry');for(const[k,png]of before)need(spr[k].img.toDataURL('image/png')===png,'old comparison sprite remains byte-exact '+k);
  need(JSON.stringify(GV.stats())===stats,'pure candidates leave native world stats unchanged');
  need(files.length===93,'80 native day/night originals plus3 contacts and10 near originals');
  return{rows,checks,files,fullBuildViews:all.length,unknownBlocked,geometryDistinct:10,oldRegistryCount:oldKeys.length,oldComparisonLeavesUnchanged:before.size,slot:localStorage.getItem('glimmerville.v1.slot'),version:GV.ver(),nativeGameInstallation:false,finalAcceptance:false};
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{await cdp.evalJs(source);const r=await cdp.evalJs('('+capture.toString()+')()');assert.equal(cdp.errors.length,0,cdp.errors.join('; '));return r;});
  assert(r.ok&&r.result,'real Chrome candidate capture: '+r.fails.join('; '));const result=r.result;assert.equal(result.slot,'3');
  const manifest={head:process.env.GITHUB_SHA,base:BASE,sourceFile:'british-wave10-art038.js',artSourceSHA256:hash(Buffer.from(source)),artSourceGitBlob:cp.execFileSync('git',['hash-object','british-wave10-art038.js'],{cwd:ROOT,encoding:'utf8'}).trim(),indexSHA256:hash(index),scope:'ten complete direct native-kit candidates; not installed by this runner and not whole-wave acceptance',notClaimed:['catalog/payment/undo/save/game scenes','whole-wave21 jobs','independent visual approval','release or deployment','mobile Safari touch testing'],...result,files:[]};
  for(const f of result.files){const b=Buffer.from(f.data.split(',')[1],'base64');fs.writeFileSync(path.join(OUT,f.name),b);manifest.files.push({name:f.name,bytes:b.length,sha256:hash(b)});transfer(f.name,b);}
  const reviewed=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/branch/GPT-038-reviewed-f53009d-image-index.json'),'utf8'));
  const individual=reviewed.files.filter(f=>!f.name.startsWith('contact-'));
  assert.equal(individual.length,81,'independent review index retains nine models native72 plus near9');
  for(const old of individual){const now=manifest.files.find(f=>f.name===old.name);assert(now&&now.bytes===old.bytes&&now.sha256===old.sha256,'reviewed nine original PNG byte hash '+old.name);}
  manifest.unchangedReviewedNineIndividualPNGs=81;
  const b=Buffer.from(JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(path.join(OUT,'manifest-candidates038.json'),b);transfer('manifest-candidates038.json',b);
  assert(fs.readFileSync(path.join(ROOT,'index.html')).equals(index),'committed game index stays unchanged after candidate capture');
  console.log('WAVE038_CANDIDATES '+JSON.stringify({head:manifest.head,candidates:result.rows.length,views:result.checks.length,originalPNGs:manifest.files.length,artSourceSHA256:manifest.artSourceSHA256,indexSHA256:manifest.indexSHA256,geometryDistinct:result.geometryDistinct,completeBuilderViews:result.fullBuildViews,unchangedReviewedNineIndividualPNGs:manifest.unchangedReviewedNineIndividualPNGs,finalAcceptance:false}));
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'candidate-error.txt'),e.stack+'\n');console.error(e.stack);process.exitCode=1;});
