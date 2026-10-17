/* GPT-025 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH025=window.BritishWaveArchitecture025.rows;
let britishCanonical025=null,britishSelection025=null;
function britishRow025(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=160&&b.v<200?BRITISH025[Math.floor((b.v-160)/4)]:null;}
function britishView025(b){const q=britishRow025(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave025(){
  if(!britishCanonical025){
    const entries=window.BritishWaveArchitecture025.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave025 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave025 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical025=cache;
  }
  Object.assign(SPR.bld,britishCanonical025);
}
const __britishVdraw025=vdraw574;vdraw574=function(o,b){return britishRow025(b)?(window.__noBritishWave025?0:britishView025(b)):__britishVdraw025(o,b);};
const __britishPlace025=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection025&&BRITISH025.find(r=>r.id===britishSelection025);
  if(q&&window.__noBritishWave025){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace025(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate025=activateTool434;activateTool434=function(id,recent){britishSelection025=null;return __britishActivate025(id,recent);};
const __britishLoad025=load;load=function(slot){const ok=__britishLoad025(slot);if(ok)britishSelection025=null;return ok;};
const __britishWorld025=newWorld;newWorld=function(seed){britishSelection025=null;return __britishWorld025(seed);};
const __britishToolbar025=buildToolbar;buildToolbar=function(){const out=__britishToolbar025();britishToolbar025();return out;};
function britishToolbar025(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen025'))return;
  const b=document.createElement('button');b.id='waveOpen025';b.textContent='🏛 英式①';b.title='英式建築第一輯：十種不同形制';b.onclick=britishOpen025;cats.appendChild(b);
  if(britishSelection025){const q=BRITISH025.find(r=>r.id===britishSelection025);if(q){const t=document.createElement('span');t.className='waveTag025';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect025(id){
  const q=BRITISH025.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave025||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection025=q.id;britishClose025();buildToolbar();toast('已選 '+q.nm+' · 原生2×2地標','gold');return true;
}
function britishClose025(){const d=$('#waveDialog025');if(d?.open)d.close();}
function britishOpen025(){
  let d=$('#waveDialog025');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog025';d.setAttribute('aria-labelledby','waveTitle025');
    d.innerHTML='<header><div><h2 id="waveTitle025">英式建築 · 第一輯</h2><p>從十六角小屋到飛船棚：十種年代與形制。</p></div><button id="waveClose025" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro025">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；飛船棚和鴿舍是歷史展示，沒有新增航空或飼養功能。夜燈呈現展示照明。</p><button id="waveDefault025">改回普通地標</button><div id="waveGrid025"></div>';
    document.body.appendChild(d);$('#waveClose025').onclick=britishClose025;$('#waveDefault025').onclick=()=>{activateTool434('landmark',true);britishClose025();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose025();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave025;
  $('#waveGrid025').innerHTML=BRITISH025.map(q=>{const s=britishCanonical025?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish025">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave025="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave025]').forEach(b=>b.onclick=()=>britishSelect025(b.dataset.wave025));
  if(!d.open)d.showModal();
}
function britishSelftest025(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_1[6-9][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave025 count and unique identity',keys.length===40&&BRITISH025.length===10&&new Set(BRITISH025.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave025GeometryOnly'),old=window.__wave025GeometryOnly;
  try{
    window.__wave025GeometryOnly=true;
    for(const q of BRITISH025){
      const s=window.BritishWaveArchitecture025.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave025GeometryOnly=old;else delete window.__wave025GeometryOnly;}
  add('wave025 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH025[Math.floor((v-160)/4)],view=(v-160)%4;
    add('wave025 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture025.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave025 opaque physical night',leak===0);add('wave025 hard pixels',semi===0);add('wave025 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH025)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave025 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave025 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave025={rows:()=>BRITISH025.map(q=>({...q})),open:britishOpen025,close:britishClose025,select:britishSelect025,selection:()=>britishSelection025,selftest:britishSelftest025,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-025 RUNTIME END */
