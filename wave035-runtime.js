/* GPT-035 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH035=window.BritishWaveArchitecture035.rows;
let britishCanonical035=null,britishSelection035=null;
function britishRow035(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=400&&b.v<440?BRITISH035[Math.floor((b.v-400)/4)]:null;}
function britishView035(b){const q=britishRow035(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave035(){
  if(!britishCanonical035){
    const entries=window.BritishWaveArchitecture035.buildAll(),cache={};
    if(entries.length!==BRITISH035.length*4)throw Error('wave035 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave035 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical035=cache;
  }
  Object.assign(SPR.bld,britishCanonical035);
}
const __britishVdraw035=vdraw574;vdraw574=function(o,b){return britishRow035(b)?(window.__noBritishWave035?0:britishView035(b)):__britishVdraw035(o,b);};
const __britishPlace035=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection035&&BRITISH035.find(r=>r.id===britishSelection035);
  if(q&&window.__noBritishWave035){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace035(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate035=activateTool434;activateTool434=function(id,recent){britishSelection035=null;return __britishActivate035(id,recent);};
const __britishLoad035=load;load=function(slot){const ok=__britishLoad035(slot);if(ok)britishSelection035=null;return ok;};
const __britishWorld035=newWorld;newWorld=function(seed){britishSelection035=null;return __britishWorld035(seed);};
const __britishToolbar035=buildToolbar;buildToolbar=function(){const out=__britishToolbar035();britishToolbar035();return out;};
function britishToolbar035(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen035'))return;
  const b=document.createElement('button');b.id='waveOpen035';b.textContent='🏛 英式⑦';b.title='英式建築第七輯：十種不同形制';b.onclick=britishOpen035;cats.appendChild(b);
  if(britishSelection035){const q=BRITISH035.find(r=>r.id===britishSelection035);if(q){const t=document.createElement('span');t.className='waveTag035';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect035(id){
  const q=BRITISH035.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave035||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection035=q.id;britishClose035();buildToolbar();return true;
}
function britishClose035(){const d=$('#waveDialog035');if(d?.open)d.close();}
function britishOpen035(){
  let d=$('#waveDialog035');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog035';d.setAttribute('aria-labelledby','waveTitle035');
    d.innerHTML='<header><div><h2 id="waveTitle035">英式建築 · 第七輯</h2><p>劇場、音樂台、歷史泳池與休閒宮殿的不同結構。</p></div><button id="waveClose035" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro035">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；休閒建築為歷史外觀展示，未新增游泳、動物或演出功能。夜燈呈現展示照明。</p><button id="waveDefault035">改回普通地標</button><div id="waveGrid035"></div>';
    document.body.appendChild(d);$('#waveClose035').onclick=britishClose035;$('#waveDefault035').onclick=()=>{activateTool434('landmark',true);britishClose035();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose035();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave035;
  $('#waveGrid035').innerHTML=BRITISH035.map(q=>{const s=britishCanonical035?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish035">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave035="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave035]').forEach(b=>b.onclick=()=>britishSelect035(b.dataset.wave035));
  if(!d.open)d.showModal();
}
function britishSelftest035(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_4[0-3][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave035 count and unique identity',keys.length===40&&BRITISH035.length===10&&new Set(BRITISH035.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave035GeometryOnly'),old=window.__wave035GeometryOnly;
  try{
    window.__wave035GeometryOnly=true;
    for(const q of BRITISH035){
      const s=window.BritishWaveArchitecture035.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave035GeometryOnly=old;else delete window.__wave035GeometryOnly;}
  add('wave035 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH035[Math.floor((v-400)/4)],view=(v-400)%4;
    add('wave035 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture035.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave035 opaque physical night',leak===0);add('wave035 hard pixels',semi===0);add('wave035 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH035)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave035 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave035 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave035={rows:()=>BRITISH035.map(q=>({...q})),open:britishOpen035,close:britishClose035,select:britishSelect035,selection:()=>britishSelection035,selftest:britishSelftest035,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-035 RUNTIME END */
