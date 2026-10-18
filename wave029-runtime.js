/* GPT-029 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH029=window.BritishWaveArchitecture029.rows;
let britishCanonical029=null,britishSelection029=null;
function britishRow029(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=240&&b.v<280?BRITISH029[Math.floor((b.v-240)/4)]:null;}
function britishView029(b){const q=britishRow029(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave029(){
  if(!britishCanonical029){
    const entries=window.BritishWaveArchitecture029.buildAll(),cache={};
    if(entries.length!==BRITISH029.length*4)throw Error('wave029 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave029 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical029=cache;
  }
  Object.assign(SPR.bld,britishCanonical029);
}
const __britishVdraw029=vdraw574;vdraw574=function(o,b){return britishRow029(b)?(window.__noBritishWave029?0:britishView029(b)):__britishVdraw029(o,b);};
const __britishPlace029=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection029&&BRITISH029.find(r=>r.id===britishSelection029);
  if(q&&window.__noBritishWave029){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace029(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate029=activateTool434;activateTool434=function(id,recent){britishSelection029=null;return __britishActivate029(id,recent);};
const __britishLoad029=load;load=function(slot){const ok=__britishLoad029(slot);if(ok)britishSelection029=null;return ok;};
const __britishWorld029=newWorld;newWorld=function(seed){britishSelection029=null;return __britishWorld029(seed);};
const __britishToolbar029=buildToolbar;buildToolbar=function(){const out=__britishToolbar029();britishToolbar029();return out;};
function britishToolbar029(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen029'))return;
  const b=document.createElement('button');b.id='waveOpen029';b.textContent='🏛 英式③';b.title='英式建築第三輯：十種不同形制';b.onclick=britishOpen029;cats.appendChild(b);
  if(britishSelection029){const q=BRITISH029.find(r=>r.id===britishSelection029);if(q){const t=document.createElement('span');t.className='waveTag029';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect029(id){
  const q=BRITISH029.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave029||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection029=q.id;britishClose029();buildToolbar();return true;
}
function britishClose029(){const d=$('#waveDialog029');if(d?.open)d.close();}
function britishOpen029(){
  let d=$('#waveDialog029');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog029';d.setAttribute('aria-labelledby','waveTitle029');
    d.innerHTML='<header><div><h2 id="waveTitle029">英式建築 · 第三輯</h2><p>英國街鎮的鐘樓、廊院、商人屋與現代曲面。</p></div><button id="waveClose029" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro029">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；橋屋為歷史外觀展示，沒有新增可通行橋梁或交通路線。夜燈呈現展示照明。</p><button id="waveDefault029">改回普通地標</button><div id="waveGrid029"></div>';
    document.body.appendChild(d);$('#waveClose029').onclick=britishClose029;$('#waveDefault029').onclick=()=>{activateTool434('landmark',true);britishClose029();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose029();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave029;
  $('#waveGrid029').innerHTML=BRITISH029.map(q=>{const s=britishCanonical029?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish029">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave029="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave029]').forEach(b=>b.onclick=()=>britishSelect029(b.dataset.wave029));
  if(!d.open)d.showModal();
}
function britishSelftest029(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_2[4-7][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave029 count and unique identity',keys.length===40&&BRITISH029.length===10&&new Set(BRITISH029.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave029GeometryOnly'),old=window.__wave029GeometryOnly;
  try{
    window.__wave029GeometryOnly=true;
    for(const q of BRITISH029){
      const s=window.BritishWaveArchitecture029.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave029GeometryOnly=old;else delete window.__wave029GeometryOnly;}
  add('wave029 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH029[Math.floor((v-240)/4)],view=(v-240)%4;
    add('wave029 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture029.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave029 opaque physical night',leak===0);add('wave029 hard pixels',semi===0);add('wave029 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH029)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave029 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave029 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave029={rows:()=>BRITISH029.map(q=>({...q})),open:britishOpen029,close:britishClose029,select:britishSelect029,selection:()=>britishSelection029,selftest:britishSelftest029,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-029 RUNTIME END */
