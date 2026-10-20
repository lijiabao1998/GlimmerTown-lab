/* GPT-033 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH033=window.BritishWaveArchitecture033.rows;
let britishCanonical033=null,britishSelection033=null;
function britishRow033(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=360&&b.v<400?BRITISH033[Math.floor((b.v-360)/4)]:null;}
function britishView033(b){const q=britishRow033(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave033(){
  if(!britishCanonical033){
    const entries=window.BritishWaveArchitecture033.buildAll(),cache={};
    if(entries.length!==BRITISH033.length*4)throw Error('wave033 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave033 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    britishCanonical033=cache;
  }
  Object.assign(SPR.bld,britishCanonical033);
}
const __britishVdraw033=vdraw574;vdraw574=function(o,b){return britishRow033(b)?(window.__noBritishWave033?0:britishView033(b)):__britishVdraw033(o,b);};
const __britishPlace033=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection033&&BRITISH033.find(r=>r.id===britishSelection033);
  if(q&&window.__noBritishWave033){if(!silent)toast('英式建築外觀暫停新增','bad');return false;}
  const ok=__britishPlace033(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate033=activateTool434;activateTool434=function(id,recent){britishSelection033=null;return __britishActivate033(id,recent);};
const __britishLoad033=load;load=function(slot){const ok=__britishLoad033(slot);if(ok)britishSelection033=null;return ok;};
const __britishWorld033=newWorld;newWorld=function(seed){britishSelection033=null;return __britishWorld033(seed);};
const __britishToolbar033=buildToolbar;buildToolbar=function(){const out=__britishToolbar033();britishToolbar033();return out;};
function britishToolbar033(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen033'))return;
  const b=document.createElement('button');b.id='waveOpen033';b.textContent='🏛 英式⑥';b.title='英式建築第六輯：十種不同形制';b.onclick=britishOpen033;cats.appendChild(b);
  if(britishSelection033){const q=BRITISH033.find(r=>r.id===britishSelection033);if(q){const t=document.createElement('span');t.className='waveTag033';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect033(id){
  const q=BRITISH033.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noBritishWave033||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection033=q.id;britishClose033();buildToolbar();return true;
}
function britishClose033(){const d=$('#waveDialog033');if(d?.open)d.close();}
function britishOpen033(){
  let d=$('#waveDialog033');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog033';d.setAttribute('aria-labelledby','waveTitle033');
    d.innerHTML='<header><div><h2 id="waveTitle033">英式建築 · 第六輯</h2><p>學院院落、階梯宿舍、講堂與研究工場的不同結構。</p></div><button id="waveClose033" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro033">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；學術建築為歷史外觀展示，未新增教育功能。夜燈呈現展示照明。</p><button id="waveDefault033">改回普通地標</button><div id="waveGrid033"></div>';
    document.body.appendChild(d);$('#waveClose033').onclick=britishClose033;$('#waveDefault033').onclick=()=>{activateTool434('landmark',true);britishClose033();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose033();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave033;
  $('#waveGrid033').innerHTML=BRITISH033.map(q=>{const s=britishCanonical033?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="waveEnglish033">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave033="'+q.id+'"'+(locked?' disabled':'')+'>'+(locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-wave033]').forEach(b=>b.onclick=()=>britishSelect033(b.dataset.wave033));
  if(!d.open)d.showModal();
}
function britishSelftest033(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_3[6-9][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave033 count and unique identity',keys.length===40&&BRITISH033.length===10&&new Set(BRITISH033.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave033GeometryOnly'),old=window.__wave033GeometryOnly;
  try{
    window.__wave033GeometryOnly=true;
    for(const q of BRITISH033){
      const s=window.BritishWaveArchitecture033.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave033GeometryOnly=old;else delete window.__wave033GeometryOnly;}
  add('wave033 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH033[Math.floor((v-360)/4)],view=(v-360)%4;
    add('wave033 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture033.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave033 opaque physical night',leak===0);add('wave033 hard pixels',semi===0);add('wave033 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH033)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave033 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave033 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave033={rows:()=>BRITISH033.map(q=>({...q})),open:britishOpen033,close:britishClose033,select:britishSelect033,selection:()=>britishSelection033,selftest:britishSelftest033,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-033 RUNTIME END */
