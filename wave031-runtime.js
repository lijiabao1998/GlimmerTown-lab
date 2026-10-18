/* GPT-031 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH031=window.BritishWaveArchitecture031.rows;
let britishCanonical031=null,britishSelection031=null;
function britishRow031(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=320&&b.v<360?BRITISH031[Math.floor((b.v-320)/4)]:null;}
function britishView031(b){const q=britishRow031(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave031(){
  if(!britishCanonical031){
    const entries=window.BritishWaveArchitecture031.buildAll(),cache={};
    if(entries.length!==BRITISH031.length*4)throw Error('wave031 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave031 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical031=cache;
  }
  Object.assign(SPR.bld,britishCanonical031);
}
const __britishVdraw031=vdraw574;vdraw574=function(o,b){return britishRow031(b)?(window.__noBritishWave031?0:britishView031(b)):__britishVdraw031(o,b);};
const __britishPlace031=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection031&&BRITISH031.find(r=>r.id===britishSelection031);
  if(q&&window.__noBritishWave031){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace031(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate031=activateTool434;activateTool434=function(id,recent){britishSelection031=null;return __britishActivate031(id,recent);};
const __britishLoad031=load;load=function(slot){const ok=__britishLoad031(slot);if(ok)britishSelection031=null;return ok;};
const __britishWorld031=newWorld;newWorld=function(seed){britishSelection031=null;return __britishWorld031(seed);};
const __britishToolbar031=buildToolbar;buildToolbar=function(){const out=__britishToolbar031();britishToolbar031();return out;};
function britishToolbar031(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen031'))return;
  const b=document.createElement('button');b.id='waveOpen031';b.textContent='🏛 英式⑤';b.title='英式建築第五輯：十種不同形制';b.onclick=britishOpen031;cats.appendChild(b);
  if(britishSelection031){const q=BRITISH031.find(r=>r.id===britishSelection031);if(q){const t=document.createElement('span');t.className='waveTag031';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect031(id){
  const q=BRITISH031.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave031||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection031=q.id;britishClose031();buildToolbar();return true;
}
function britishClose031(){const d=$('#waveDialog031');if(d?.open)d.close();}
function britishOpen031(){
  let d=$('#waveDialog031');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog031';d.setAttribute('aria-labelledby','waveTitle031');
    d.innerHTML='<header><div><h2 id="waveTitle031">英式建築 · 第五輯</h2><p>海岸木鋪、泳場、港口塔樓與碼頭建築的不同形制。</p></div><button id="waveClose031" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro031">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；海岸與港口建築為歷史外觀展示。夜燈呈現展示照明。</p><button id="waveDefault031">改回普通地標</button><div id="waveGrid031"></div>';
    document.body.appendChild(d);$('#waveClose031').onclick=britishClose031;$('#waveDefault031').onclick=()=>{activateTool434('landmark',true);britishClose031();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose031();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave031;
  $('#waveGrid031').innerHTML=BRITISH031.map(q=>{const s=britishCanonical031?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish031">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave031="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave031]').forEach(b=>b.onclick=()=>britishSelect031(b.dataset.wave031));
  if(!d.open)d.showModal();
}
function britishSelftest031(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_3[2-5][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave031 count and unique identity',keys.length===40&&BRITISH031.length===10&&new Set(BRITISH031.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave031GeometryOnly'),old=window.__wave031GeometryOnly;
  try{
    window.__wave031GeometryOnly=true;
    for(const q of BRITISH031){
      const s=window.BritishWaveArchitecture031.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave031GeometryOnly=old;else delete window.__wave031GeometryOnly;}
  add('wave031 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH031[Math.floor((v-320)/4)],view=(v-320)%4;
    add('wave031 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture031.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave031 opaque physical night',leak===0);add('wave031 hard pixels',semi===0);add('wave031 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH031)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave031 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave031 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave031={rows:()=>BRITISH031.map(q=>({...q})),open:britishOpen031,close:britishClose031,select:britishSelect031,selection:()=>britishSelection031,selftest:britishSelftest031,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-031 RUNTIME END */
