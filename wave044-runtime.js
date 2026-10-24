/* GPT-044 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH044=window.BritishWaveArchitecture044.rows;
let britishCanonical044=null,britishSelection044=null;
const britishIDs044=["lindenmaps","wrenumbrella","meadowsweetherb","sorrelglove","tamargauge","rookspiano","hartcurrier","sainwax","brackenlast","harecase"];
function britishRowsValid044(){return BRITISH044.length===10&&BRITISH044.every((q,i)=>q.id===britishIDs044[i]&&q.v===760+i*4);}
function britishReady044(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical044?.[key]&&SPR.bld[key]===britishCanonical044[key];});}
function britishRow044(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=760&&b.v<800?BRITISH044[Math.floor((b.v-760)/4)]:null;}
function britishView044(b){const q=britishRow044(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave044(){
  if(!britishRowsValid044())throw Error('wave044 exact frozen ten rows');
  if(!britishCanonical044){
    const entries=window.BritishWaveArchitecture044.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave044 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH044[(row.v-760)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave044 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH044.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave044 complete forty-view cache');
    britishCanonical044=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical044).length!==40||BRITISH044.some(q=>[0,1,2,3].some(v=>!britishCanonical044['24_1_'+(q.v+v)])))throw Error('wave044 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical044);
}
const __britishVdraw044=vdraw574;vdraw574=function(o,b){return britishRow044(b)?(window.__noBritishWave044?0:britishView044(b)):__britishVdraw044(o,b);};
const __britishPlace044=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection044&&BRITISH044.find(r=>r.id===britishSelection044);
  if(q&&(window.__noBritishWave044||!britishReady044(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace044(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate044=activateTool434;activateTool434=function(id,recent){britishSelection044=null;return __britishActivate044(id,recent);};
const __britishLoad044=load;load=function(slot){const ok=__britishLoad044(slot);if(ok)britishSelection044=null;return ok;};
const __britishWorld044=newWorld;newWorld=function(seed){britishSelection044=null;return __britishWorld044(seed);};
const __britishToolbar044=buildToolbar;buildToolbar=function(){const out=__britishToolbar044();britishToolbar044();return out;};
function britishToolbar044(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen044'))return;
  const b=document.createElement('button');b.id='waveOpen044';b.textContent='🏛 英式⑯';b.title='英式建築第十六輯：十種不同形制';b.onclick=britishOpen044;cats.appendChild(b);
  if(britishSelection044){const q=BRITISH044.find(r=>r.id===britishSelection044);if(q){const t=document.createElement('span');t.className='waveTag044';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect044(id){
  const q=BRITISH044.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady044(q)||window.__noBritishWave044||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection044=q.id;britishClose044();buildToolbar();return true;
}
function britishClose044(){const d=$('#waveDialog044');if(d?.open)d.close();}
function britishEscape044(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen044(){
  let d=$('#waveDialog044');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog044';d.setAttribute('aria-labelledby','waveTitle044');
    d.innerHTML='<header><div><h2 id="waveTitle044">英式建築 · 第十六輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose044" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro044">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；專門工房與服務建築等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault044">改回普通地標</button><div id="waveGrid044"></div>';
    document.body.appendChild(d);$('#waveClose044').onclick=britishClose044;$('#waveDefault044').onclick=()=>{activateTool434('landmark',true);britishClose044();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose044();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave044;
  $('#waveGrid044').innerHTML=BRITISH044.map(q=>{
    const ready=britishReady044(q),s=ready?britishCanonical044['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape044;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave044 exact original-design provenance required');
    return '<article data-wave044-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable044">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish044">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal044">原創設計</span><button data-wave044="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave044]').forEach(b=>b.onclick=()=>britishSelect044(b.dataset.wave044));
  if(!d.open)d.showModal();
}
function britishSelftest044(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:7[6-9][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave044 count and unique identity',keys.length===40&&britishRowsValid044()&&new Set(BRITISH044.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave044GeometryOnly'),old=window.__wave044GeometryOnly;
  try{
    window.__wave044GeometryOnly=true;
    for(const q of BRITISH044){
      const s=window.BritishWaveArchitecture044.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave044GeometryOnly=old;else delete window.__wave044GeometryOnly;}
  add('wave044 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH044[Math.floor((v-760)/4)],view=(v-760)%4;
    add('wave044 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture044.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave044 opaque physical night',leak===0);add('wave044 hard pixels',semi===0);add('wave044 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH044)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave044 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave044 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave044={rows:()=>BRITISH044.map(q=>({...q})),ready:id=>britishReady044(BRITISH044.find(q=>q.id===id)),open:britishOpen044,close:britishClose044,select:britishSelect044,selection:()=>britishSelection044,selftest:britishSelftest044,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-044 RUNTIME END */
