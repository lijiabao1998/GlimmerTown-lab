/* GPT-038 RUNTIME START: bounded native landmark appearances, no model changes. */
const BRITISH038=window.BritishWaveArchitecture038.rows;
let britishCanonical038=null,britishSelection038=null;
const britishIDs038=['leedsCorn','darlington','halifax','bishoplloyd','burlington','silver','harrods','liberty','danum','willow'];
function britishRowsValid038(){return BRITISH038.length===10&&BRITISH038.every((q,i)=>q.id===britishIDs038[i]&&q.v===520+i*4);}
function britishReady038(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical038?.[key]&&SPR.bld[key]===britishCanonical038[key];});}
function britishRow038(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=520&&b.v<560?BRITISH038[Math.floor((b.v-520)/4)]:null;}
function britishView038(b){const q=britishRow038(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave038(){
  if(!britishRowsValid038())throw Error('wave038 exact frozen ten rows');
  if(!britishCanonical038){
    const entries=window.BritishWaveArchitecture038.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave038 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH038[(row.v-520)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave038 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH038.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave038 complete forty-view cache');
    britishCanonical038=cache;
  }
  // Revalidate a warm cache too. A CI-only partial fixture must never turn
  // the complete production installer into a silent 36-view success.
  if(Object.keys(britishCanonical038).length!==40||BRITISH038.some(q=>[0,1,2,3].some(v=>!britishCanonical038['24_1_'+(q.v+v)])))throw Error('wave038 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical038);
}
const __britishVdraw038=vdraw574;vdraw574=function(o,b){return britishRow038(b)?(window.__noBritishWave038?0:britishView038(b)):__britishVdraw038(o,b);};
const __britishPlace038=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection038&&BRITISH038.find(r=>r.id===britishSelection038);
  if(q&&(window.__noBritishWave038||!britishReady038(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace038(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate038=activateTool434;activateTool434=function(id,recent){britishSelection038=null;return __britishActivate038(id,recent);};
const __britishLoad038=load;load=function(slot){const ok=__britishLoad038(slot);if(ok)britishSelection038=null;return ok;};
const __britishWorld038=newWorld;newWorld=function(seed){britishSelection038=null;return __britishWorld038(seed);};
const __britishToolbar038=buildToolbar;buildToolbar=function(){const out=__britishToolbar038();britishToolbar038();return out;};
function britishToolbar038(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen038'))return;
  const b=document.createElement('button');b.id='waveOpen038';b.textContent='🏛 英式⑩';b.title='英式建築第十輯：十種不同形制';b.onclick=britishOpen038;cats.appendChild(b);
  if(britishSelection038){const q=BRITISH038.find(r=>r.id===britishSelection038);if(q){const t=document.createElement('span');t.className='waveTag038';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect038(id){
  const q=BRITISH038.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady038(q)||window.__noBritishWave038||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection038=q.id;britishClose038();buildToolbar();return true;
}
function britishClose038(){const d=$('#waveDialog038');if(d?.open)d.close();}
function britishEscape038(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen038(){
  let d=$('#waveDialog038');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog038';d.setAttribute('aria-labelledby','waveTitle038');
    d.innerHTML='<header><div><h2 id="waveTitle038">英式建築 · 第十輯</h2><p>英式商貿與市集建築的不同結構。</p></div><button id="waveClose038" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro038">依真實建築考據的原創像素轉譯，非等比例複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；本輯僅展示建築外觀，未新增市場交易、金融或購物服務玩法。夜燈呈現展示照明。</p><button id="waveDefault038">改回普通地標</button><div id="waveGrid038"></div>';
    document.body.appendChild(d);$('#waveClose038').onclick=britishClose038;$('#waveDefault038').onclick=()=>{activateTool434('landmark',true);britishClose038();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose038();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave038;
  $('#waveGrid038').innerHTML=BRITISH038.map(q=>{
    const ready=britishReady038(q),s=ready?britishCanonical038['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape038;
    const url=new URL(q.url);if(url.protocol!=='https:')throw Error('wave038 HTTPS reference required');
    return '<article data-wave038-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable038">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish038">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><a href="'+escape(url.href)+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-wave038="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave038]').forEach(b=>b.onclick=()=>britishSelect038(b.dataset.wave038));
  if(!d.open)d.showModal();
}
function britishSelftest038(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_5[2-5][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave038 count and unique identity',keys.length===40&&britishRowsValid038()&&new Set(BRITISH038.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave038GeometryOnly'),old=window.__wave038GeometryOnly;
  try{
    window.__wave038GeometryOnly=true;
    for(const q of BRITISH038){
      const s=window.BritishWaveArchitecture038.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave038GeometryOnly=old;else delete window.__wave038GeometryOnly;}
  add('wave038 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH038[Math.floor((v-520)/4)],view=(v-520)%4;
    add('wave038 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture038.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave038 opaque physical night',leak===0);add('wave038 hard pixels',semi===0);add('wave038 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH038)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave038 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave038 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave038={rows:()=>BRITISH038.map(q=>({...q})),ready:id=>britishReady038(BRITISH038.find(q=>q.id===id)),open:britishOpen038,close:britishClose038,select:britishSelect038,selection:()=>britishSelection038,selftest:britishSelftest038,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-038 RUNTIME END */
