/* GPT-030 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH030=window.BritishWaveArchitecture030.rows;
let britishCanonical030=null,britishSelection030=null;
function britishRow030(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=280&&b.v<320?BRITISH030[Math.floor((b.v-280)/4)]:null;}
function britishView030(b){const q=britishRow030(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave030(){
  if(!britishCanonical030){
    const entries=window.BritishWaveArchitecture030.buildAll(),cache={};
    if(entries.length!==BRITISH030.length*4)throw Error('wave030 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave030 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical030=cache;
  }
  Object.assign(SPR.bld,britishCanonical030);
}
const __britishVdraw030=vdraw574;vdraw574=function(o,b){return britishRow030(b)?(window.__noBritishWave030?0:britishView030(b)):__britishVdraw030(o,b);};
const __britishPlace030=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection030&&BRITISH030.find(r=>r.id===britishSelection030);
  if(q&&window.__noBritishWave030){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace030(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate030=activateTool434;activateTool434=function(id,recent){britishSelection030=null;return __britishActivate030(id,recent);};
const __britishLoad030=load;load=function(slot){const ok=__britishLoad030(slot);if(ok)britishSelection030=null;return ok;};
const __britishWorld030=newWorld;newWorld=function(seed){britishSelection030=null;return __britishWorld030(seed);};
const __britishToolbar030=buildToolbar;buildToolbar=function(){const out=__britishToolbar030();britishToolbar030();return out;};
function britishToolbar030(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen030'))return;
  const b=document.createElement('button');b.id='waveOpen030';b.textContent='🏛 英式④';b.title='英式建築第四輯：十種不同形制';b.onclick=britishOpen030;cats.appendChild(b);
  if(britishSelection030){const q=BRITISH030.find(r=>r.id===britishSelection030);if(q){const t=document.createElement('span');t.className='waveTag030';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect030(id){
  const q=BRITISH030.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave030||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection030=q.id;britishClose030();buildToolbar();return true;
}
function britishClose030(){const d=$('#waveDialog030');if(d?.open)d.close();}
function britishOpen030(){
  let d=$('#waveDialog030');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog030';d.setAttribute('aria-labelledby','waveTitle030');
    d.innerHTML='<header><div><h2 id="waveTitle030">英式建築 · 第四輯</h2><p>風磨、水力廠、烘乾窯與工業建築的不同形制。</p></div><button id="waveClose030" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro030">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；工業與鄉村建築為歷史外觀展示，沒有新增產業鏈、工業產量或水力機制。夜燈呈現展示照明。</p><button id="waveDefault030">改回普通地標</button><div id="waveGrid030"></div>';
    document.body.appendChild(d);$('#waveClose030').onclick=britishClose030;$('#waveDefault030').onclick=()=>{activateTool434('landmark',true);britishClose030();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose030();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave030;
  $('#waveGrid030').innerHTML=BRITISH030.map(q=>{const s=britishCanonical030?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish030">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave030="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave030]').forEach(b=>b.onclick=()=>britishSelect030(b.dataset.wave030));
  if(!d.open)d.showModal();
}
function britishSelftest030(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:2[89]|3[01])[0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave030 count and unique identity',keys.length===40&&BRITISH030.length===10&&new Set(BRITISH030.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave030GeometryOnly'),old=window.__wave030GeometryOnly;
  try{
    window.__wave030GeometryOnly=true;
    for(const q of BRITISH030){
      const s=window.BritishWaveArchitecture030.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave030GeometryOnly=old;else delete window.__wave030GeometryOnly;}
  add('wave030 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH030[Math.floor((v-280)/4)],view=(v-280)%4;
    add('wave030 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture030.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave030 opaque physical night',leak===0);add('wave030 hard pixels',semi===0);add('wave030 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH030)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave030 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave030 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave030={rows:()=>BRITISH030.map(q=>({...q})),open:britishOpen030,close:britishClose030,select:britishSelect030,selection:()=>britishSelection030,selftest:britishSelftest030,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-030 RUNTIME END */
