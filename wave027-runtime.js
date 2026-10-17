/* GPT-027 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH027=window.BritishWaveArchitecture027.rows;
let britishCanonical027=null,britishSelection027=null;
function britishRow027(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=200&&b.v<240?BRITISH027[Math.floor((b.v-200)/4)]:null;}
function britishView027(b){const q=britishRow027(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave027(){
  if(!britishCanonical027){
    const entries=window.BritishWaveArchitecture027.buildAll(),cache={};
    if(entries.length!==BRITISH027.length*4)throw Error('wave027 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave027 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical027=cache;
  }
  Object.assign(SPR.bld,britishCanonical027);
}
const __britishVdraw027=vdraw574;vdraw574=function(o,b){return britishRow027(b)?(window.__noBritishWave027?0:britishView027(b)):__britishVdraw027(o,b);};
const __britishPlace027=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection027&&BRITISH027.find(r=>r.id===britishSelection027);
  if(q&&window.__noBritishWave027){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace027(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate027=activateTool434;activateTool434=function(id,recent){britishSelection027=null;return __britishActivate027(id,recent);};
const __britishLoad027=load;load=function(slot){const ok=__britishLoad027(slot);if(ok)britishSelection027=null;return ok;};
const __britishWorld027=newWorld;newWorld=function(seed){britishSelection027=null;return __britishWorld027(seed);};
const __britishToolbar027=buildToolbar;buildToolbar=function(){const out=__britishToolbar027();britishToolbar027();return out;};
function britishToolbar027(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen027'))return;
  const b=document.createElement('button');b.id='waveOpen027';b.textContent='🏛 英式②';b.title='英式建築第二輯：十種不同形制';b.onclick=britishOpen027;cats.appendChild(b);
  if(britishSelection027){const q=BRITISH027.find(r=>r.id===britishSelection027);if(q){const t=document.createElement('span');t.className='waveTag027';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect027(id){
  const q=BRITISH027.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave027||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection027=q.id;britishClose027();buildToolbar();return true;
}
function britishClose027(){const d=$('#waveDialog027');if(d?.open)d.close();}
function britishOpen027(){
  let d=$('#waveDialog027');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog027';d.setAttribute('aria-labelledby','waveTitle027');
    d.innerHTML='<header><div><h2 id="waveTitle027">英式建築 · 第二輯</h2><p>從航站樓到公共場站：不同年代與結構。</p></div><button id="waveClose027" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro027">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；交通建築為歷史外觀展示，沒有新增航線、鐵路或巴士路線。夜燈呈現展示照明。</p><button id="waveDefault027">改回普通地標</button><div id="waveGrid027"></div>';
    document.body.appendChild(d);$('#waveClose027').onclick=britishClose027;$('#waveDefault027').onclick=()=>{activateTool434('landmark',true);britishClose027();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose027();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave027;
  $('#waveGrid027').innerHTML=BRITISH027.map(q=>{const s=britishCanonical027?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish027">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave027="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave027]').forEach(b=>b.onclick=()=>britishSelect027(b.dataset.wave027));
  if(!d.open)d.showModal();
}
function britishSelftest027(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_2[0-3][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave027 count and unique identity',keys.length===40&&BRITISH027.length===10&&new Set(BRITISH027.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave027GeometryOnly'),old=window.__wave027GeometryOnly;
  try{
    window.__wave027GeometryOnly=true;
    for(const q of BRITISH027){
      const s=window.BritishWaveArchitecture027.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave027GeometryOnly=old;else delete window.__wave027GeometryOnly;}
  add('wave027 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH027[Math.floor((v-200)/4)],view=(v-200)%4;
    add('wave027 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture027.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave027 opaque physical night',leak===0);add('wave027 hard pixels',semi===0);add('wave027 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH027)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave027 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave027 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave027={rows:()=>BRITISH027.map(q=>({...q})),open:britishOpen027,close:britishClose027,select:britishSelect027,selection:()=>britishSelection027,selftest:britishSelftest027,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-027 RUNTIME END */
