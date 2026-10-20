/* GPT-036 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH036=window.BritishWaveArchitecture036.rows;
let britishCanonical036=null,britishSelection036=null;
function britishRow036(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=440&&b.v<480?BRITISH036[Math.floor((b.v-440)/4)]:null;}
function britishView036(b){const q=britishRow036(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave036(){
  if(!britishCanonical036){
    const entries=window.BritishWaveArchitecture036.buildAll(),cache={};
    if(entries.length!==BRITISH036.length*4)throw Error('wave036 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave036 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical036=cache;
  }
  Object.assign(SPR.bld,britishCanonical036);
}
const __britishVdraw036=vdraw574;vdraw574=function(o,b){return britishRow036(b)?(window.__noBritishWave036?0:britishView036(b)):__britishVdraw036(o,b);};
const __britishPlace036=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection036&&BRITISH036.find(r=>r.id===britishSelection036);
  if(q&&window.__noBritishWave036){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace036(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate036=activateTool434;activateTool434=function(id,recent){britishSelection036=null;return __britishActivate036(id,recent);};
const __britishLoad036=load;load=function(slot){const ok=__britishLoad036(slot);if(ok)britishSelection036=null;return ok;};
const __britishWorld036=newWorld;newWorld=function(seed){britishSelection036=null;return __britishWorld036(seed);};
const __britishToolbar036=buildToolbar;buildToolbar=function(){const out=__britishToolbar036();britishToolbar036();return out;};
function britishToolbar036(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen036'))return;
  const b=document.createElement('button');b.id='waveOpen036';b.textContent='🏛 英式⑧';b.title='英式建築第八輯：十種不同形制';b.onclick=britishOpen036;cats.appendChild(b);
  if(britishSelection036){const q=BRITISH036.find(r=>r.id===britishSelection036);if(q){const t=document.createElement('span');t.className='waveTag036';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect036(id){
  const q=BRITISH036.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave036||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection036=q.id;britishClose036();buildToolbar();return true;
}
function britishClose036(){const d=$('#waveDialog036');if(d?.open)d.close();}
function britishOpen036(){
  let d=$('#waveDialog036');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog036';d.setAttribute('aria-labelledby','waveTitle036');
    d.innerHTML='<header><div><h2 id="waveTitle036">英式建築 · 第八輯</h2><p>歷史醫院、養老院與當代關懷中心的不同結構。</p></div><button id="waveClose036" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro036">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；本輯僅展示建築外觀，未新增治療、健康、養老或患者玩法；關懷中心不是住院醫院。夜燈呈現展示照明。</p><button id="waveDefault036">改回普通地標</button><div id="waveGrid036"></div>';
    document.body.appendChild(d);$('#waveClose036').onclick=britishClose036;$('#waveDefault036').onclick=()=>{activateTool434('landmark',true);britishClose036();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose036();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave036;
  $('#waveGrid036').innerHTML=BRITISH036.map(q=>{const s=britishCanonical036?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish036">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave036="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave036]').forEach(b=>b.onclick=()=>britishSelect036(b.dataset.wave036));
  if(!d.open)d.showModal();
}
function britishSelftest036(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_4[4-7][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave036 count and unique identity',keys.length===40&&BRITISH036.length===10&&new Set(BRITISH036.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave036GeometryOnly'),old=window.__wave036GeometryOnly;
  try{
    window.__wave036GeometryOnly=true;
    for(const q of BRITISH036){
      const s=window.BritishWaveArchitecture036.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave036GeometryOnly=old;else delete window.__wave036GeometryOnly;}
  add('wave036 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH036[Math.floor((v-440)/4)],view=(v-440)%4;
    add('wave036 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture036.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave036 opaque physical night',leak===0);add('wave036 hard pixels',semi===0);add('wave036 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH036)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave036 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave036 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave036={rows:()=>BRITISH036.map(q=>({...q})),open:britishOpen036,close:britishClose036,select:britishSelect036,selection:()=>britishSelection036,selftest:britishSelftest036,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-036 RUNTIME END */
