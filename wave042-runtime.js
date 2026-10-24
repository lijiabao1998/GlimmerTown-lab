/* GPT-042 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH042=window.BritishWaveArchitecture042.rows;
let britishCanonical042=null,britishSelection042=null;
const britishIDs042=['alderjoinery','mereweigh','rushfordlav','beckvalve','woldswitch','elmstone','fencooper','larkprint','rowdenmortuary','cressice'];
function britishRowsValid042(){return BRITISH042.length===10&&BRITISH042.every((q,i)=>q.id===britishIDs042[i]&&q.v===680+i*4);}
function britishReady042(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical042?.[key]&&SPR.bld[key]===britishCanonical042[key];});}
function britishRow042(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=680&&b.v<720?BRITISH042[Math.floor((b.v-680)/4)]:null;}
function britishView042(b){const q=britishRow042(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave042(){
  if(!britishRowsValid042())throw Error('wave042 exact frozen ten rows');
  if(!britishCanonical042){
    const entries=window.BritishWaveArchitecture042.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave042 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH042[(row.v-680)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave042 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH042.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave042 complete forty-view cache');
    britishCanonical042=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical042).length!==40||BRITISH042.some(q=>[0,1,2,3].some(v=>!britishCanonical042['24_1_'+(q.v+v)])))throw Error('wave042 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical042);
}
const __britishVdraw042=vdraw574;vdraw574=function(o,b){return britishRow042(b)?(window.__noBritishWave042?0:britishView042(b)):__britishVdraw042(o,b);};
const __britishPlace042=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection042&&BRITISH042.find(r=>r.id===britishSelection042);
  if(q&&(window.__noBritishWave042||!britishReady042(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace042(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate042=activateTool434;activateTool434=function(id,recent){britishSelection042=null;return __britishActivate042(id,recent);};
const __britishLoad042=load;load=function(slot){const ok=__britishLoad042(slot);if(ok)britishSelection042=null;return ok;};
const __britishWorld042=newWorld;newWorld=function(seed){britishSelection042=null;return __britishWorld042(seed);};
const __britishToolbar042=buildToolbar;buildToolbar=function(){const out=__britishToolbar042();britishToolbar042();return out;};
function britishToolbar042(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen042'))return;
  const b=document.createElement('button');b.id='waveOpen042';b.textContent='🏛 英式⑭';b.title='英式建築第十四輯：十種不同形制';b.onclick=britishOpen042;cats.appendChild(b);
  if(britishSelection042){const q=BRITISH042.find(r=>r.id===britishSelection042);if(q){const t=document.createElement('span');t.className='waveTag042';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect042(id){
  const q=BRITISH042.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady042(q)||window.__noBritishWave042||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection042=q.id;britishClose042();buildToolbar();return true;
}
function britishClose042(){const d=$('#waveDialog042');if(d?.open)d.close();}
function britishEscape042(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen042(){
  let d=$('#waveDialog042');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog042';d.setAttribute('aria-labelledby','waveTitle042');
    d.innerHTML='<header><div><h2 id="waveTitle042">英式建築 · 第十四輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose042" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro042">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；木作院、閥房與鎮務工坊等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault042">改回普通地標</button><div id="waveGrid042"></div>';
    document.body.appendChild(d);$('#waveClose042').onclick=britishClose042;$('#waveDefault042').onclick=()=>{activateTool434('landmark',true);britishClose042();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose042();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave042;
  $('#waveGrid042').innerHTML=BRITISH042.map(q=>{
    const ready=britishReady042(q),s=ready?britishCanonical042['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape042;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave042 exact original-design provenance required');
    return '<article data-wave042-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable042">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish042">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal042">原創設計</span><button data-wave042="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave042]').forEach(b=>b.onclick=()=>britishSelect042(b.dataset.wave042));
  if(!d.open)d.showModal();
}
function britishSelftest042(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:6[89][0-9]|7[01][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave042 count and unique identity',keys.length===40&&britishRowsValid042()&&new Set(BRITISH042.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave042GeometryOnly'),old=window.__wave042GeometryOnly;
  try{
    window.__wave042GeometryOnly=true;
    for(const q of BRITISH042){
      const s=window.BritishWaveArchitecture042.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave042GeometryOnly=old;else delete window.__wave042GeometryOnly;}
  add('wave042 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH042[Math.floor((v-680)/4)],view=(v-680)%4;
    add('wave042 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture042.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave042 opaque physical night',leak===0);add('wave042 hard pixels',semi===0);add('wave042 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH042)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave042 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave042 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave042={rows:()=>BRITISH042.map(q=>({...q})),ready:id=>britishReady042(BRITISH042.find(q=>q.id===id)),open:britishOpen042,close:britishClose042,select:britishSelect042,selection:()=>britishSelection042,selftest:britishSelftest042,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-042 RUNTIME END */
