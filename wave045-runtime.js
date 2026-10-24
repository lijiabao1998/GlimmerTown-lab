/* GPT-045 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH045=window.BritishWaveArchitecture045.rows;
let britishCanonical045=null,britishSelection045=null;
const britishIDs045=["knapmediation","adderlens","yarrowbraille","elderdebate","osieroral","cloudmereweather","coppicelecture","shellwickpetitions","velvetcostume","broomtranslations"];
function britishRowsValid045(){return BRITISH045.length===10&&BRITISH045.every((q,i)=>q.id===britishIDs045[i]&&q.v===800+i*4);}
function britishReady045(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical045?.[key]&&SPR.bld[key]===britishCanonical045[key];});}
function britishRow045(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=800&&b.v<840?BRITISH045[Math.floor((b.v-800)/4)]:null;}
function britishView045(b){const q=britishRow045(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave045(){
  if(!britishRowsValid045())throw Error('wave045 exact frozen ten rows');
  if(!britishCanonical045){
    const entries=window.BritishWaveArchitecture045.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave045 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH045[(row.v-800)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave045 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH045.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave045 complete forty-view cache');
    britishCanonical045=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical045).length!==40||BRITISH045.some(q=>[0,1,2,3].some(v=>!britishCanonical045['24_1_'+(q.v+v)])))throw Error('wave045 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical045);
}
const __britishVdraw045=vdraw574;vdraw574=function(o,b){return britishRow045(b)?(window.__noBritishWave045?0:britishView045(b)):__britishVdraw045(o,b);};
const __britishPlace045=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection045&&BRITISH045.find(r=>r.id===britishSelection045);
  if(q&&(window.__noBritishWave045||!britishReady045(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace045(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate045=activateTool434;activateTool434=function(id,recent){britishSelection045=null;return __britishActivate045(id,recent);};
const __britishLoad045=load;load=function(slot){const ok=__britishLoad045(slot);if(ok)britishSelection045=null;return ok;};
const __britishWorld045=newWorld;newWorld=function(seed){britishSelection045=null;return __britishWorld045(seed);};
const __britishToolbar045=buildToolbar;buildToolbar=function(){const out=__britishToolbar045();britishToolbar045();return out;};
function britishToolbar045(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen045'))return;
  const b=document.createElement('button');b.id='waveOpen045';b.textContent='🏛 英式⑰';b.title='英式建築第十七輯：十種不同形制';b.onclick=britishOpen045;cats.appendChild(b);
  if(britishSelection045){const q=BRITISH045.find(r=>r.id===britishSelection045);if(q){const t=document.createElement('span');t.className='waveTag045';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect045(id){
  const q=BRITISH045.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady045(q)||window.__noBritishWave045||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection045=q.id;britishClose045();buildToolbar();return true;
}
function britishClose045(){const d=$('#waveDialog045');if(d?.open)d.close();}
function britishEscape045(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen045(){
  let d=$('#waveDialog045');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog045';d.setAttribute('aria-labelledby','waveTitle045');
    d.innerHTML='<header><div><h2 id="waveTitle045">英式建築 · 第十七輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose045" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro045">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；公共館舍與專門工房等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault045">改回普通地標</button><div id="waveGrid045"></div>';
    document.body.appendChild(d);$('#waveClose045').onclick=britishClose045;$('#waveDefault045').onclick=()=>{activateTool434('landmark',true);britishClose045();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose045();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave045;
  $('#waveGrid045').innerHTML=BRITISH045.map(q=>{
    const ready=britishReady045(q),s=ready?britishCanonical045['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape045;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave045 exact original-design provenance required');
    return '<article data-wave045-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable045">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish045">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal045">原創設計</span><button data-wave045="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave045]').forEach(b=>b.onclick=()=>britishSelect045(b.dataset.wave045));
  if(!d.open)d.showModal();
}
function britishSelftest045(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:8[0-3][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave045 count and unique identity',keys.length===40&&britishRowsValid045()&&new Set(BRITISH045.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave045GeometryOnly'),old=window.__wave045GeometryOnly;
  try{
    window.__wave045GeometryOnly=true;
    for(const q of BRITISH045){
      const s=window.BritishWaveArchitecture045.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave045GeometryOnly=old;else delete window.__wave045GeometryOnly;}
  add('wave045 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH045[Math.floor((v-800)/4)],view=(v-800)%4;
    add('wave045 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture045.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave045 opaque physical night',leak===0);add('wave045 hard pixels',semi===0);add('wave045 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH045)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave045 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave045 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave045={rows:()=>BRITISH045.map(q=>({...q})),ready:id=>britishReady045(BRITISH045.find(q=>q.id===id)),open:britishOpen045,close:britishClose045,select:britishSelect045,selection:()=>britishSelection045,selftest:britishSelftest045,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-045 RUNTIME END */
