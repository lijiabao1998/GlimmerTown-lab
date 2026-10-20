/* GPT-037 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH037=window.BritishWaveArchitecture037.rows;
let britishCanonical037=null,britishSelection037=null;
function britishRow037(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=480&&b.v<520?BRITISH037[Math.floor((b.v-480)/4)]:null;}
function britishView037(b){const q=britishRow037(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave037(){
  if(!britishCanonical037){
    const entries=window.BritishWaveArchitecture037.buildAll(),cache={};
    if(entries.length!==BRITISH037.length*4)throw Error('wave037 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave037 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical037=cache;
  }
  Object.assign(SPR.bld,britishCanonical037);
}
const __britishVdraw037=vdraw574;vdraw574=function(o,b){return britishRow037(b)?(window.__noBritishWave037?0:britishView037(b)):__britishVdraw037(o,b);};
const __britishPlace037=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection037&&BRITISH037.find(r=>r.id===britishSelection037);
  if(q&&window.__noBritishWave037){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace037(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate037=activateTool434;activateTool434=function(id,recent){britishSelection037=null;return __britishActivate037(id,recent);};
const __britishLoad037=load;load=function(slot){const ok=__britishLoad037(slot);if(ok)britishSelection037=null;return ok;};
const __britishWorld037=newWorld;newWorld=function(seed){britishSelection037=null;return __britishWorld037(seed);};
const __britishToolbar037=buildToolbar;buildToolbar=function(){const out=__britishToolbar037();britishToolbar037();return out;};
function britishToolbar037(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen037'))return;
  const b=document.createElement('button');b.id='waveOpen037';b.textContent='🏛 英式⑨';b.title='英式建築第九輯：十種不同形制';b.onclick=britishOpen037;cats.appendChild(b);
  if(britishSelection037){const q=BRITISH037.find(r=>r.id===britishSelection037);if(q){const t=document.createElement('span');t.className='waveTag037';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect037(id){
  const q=BRITISH037.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave037||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection037=q.id;britishClose037();buildToolbar();return true;
}
function britishClose037(){const d=$('#waveDialog037');if(d?.open)d.close();}
function britishOpen037(){
  let d=$('#waveDialog037');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog037';d.setAttribute('aria-labelledby','waveTitle037');
    d.innerHTML='<header><div><h2 id="waveTitle037">英式建築 · 第九輯</h2><p>歷史市政廳、議事建築與司法建築的不同結構。</p></div><button id="waveClose037" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro037">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；本輯僅展示建築外觀，未新增司法、議會或行政服務玩法。夜燈呈現展示照明。</p><button id="waveDefault037">改回普通地標</button><div id="waveGrid037"></div>';
    document.body.appendChild(d);$('#waveClose037').onclick=britishClose037;$('#waveDefault037').onclick=()=>{activateTool434('landmark',true);britishClose037();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose037();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave037;
  $('#waveGrid037').innerHTML=BRITISH037.map(q=>{const s=britishCanonical037?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish037">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave037="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave037]').forEach(b=>b.onclick=()=>britishSelect037(b.dataset.wave037));
  if(!d.open)d.showModal();
}
function britishSelftest037(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:4[89]|5[01])[0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave037 count and unique identity',keys.length===40&&BRITISH037.length===10&&new Set(BRITISH037.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave037GeometryOnly'),old=window.__wave037GeometryOnly;
  try{
    window.__wave037GeometryOnly=true;
    for(const q of BRITISH037){
      const s=window.BritishWaveArchitecture037.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave037GeometryOnly=old;else delete window.__wave037GeometryOnly;}
  add('wave037 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH037[Math.floor((v-480)/4)],view=(v-480)%4;
    add('wave037 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture037.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave037 opaque physical night',leak===0);add('wave037 hard pixels',semi===0);add('wave037 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH037)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave037 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave037 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave037={rows:()=>BRITISH037.map(q=>({...q})),open:britishOpen037,close:britishClose037,select:britishSelect037,selection:()=>britishSelection037,selftest:britishSelftest037,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-037 RUNTIME END */
