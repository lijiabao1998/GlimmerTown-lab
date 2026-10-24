/* GPT-040 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH040=window.BritishWaveArchitecture040.rows;
let britishCanonical040=null,britishSelection040=null;
const britishIDs040=['asterpost','barleybake','honeygrocer','foxengine','mallowsew','dewbankwash','cloverseed','thistlenursery','brooktools','hazeldairy'];
function britishRowsValid040(){return BRITISH040.length===10&&BRITISH040.every((q,i)=>q.id===britishIDs040[i]&&q.v===600+i*4);}
function britishReady040(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical040?.[key]&&SPR.bld[key]===britishCanonical040[key];});}
function britishRow040(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=600&&b.v<640?BRITISH040[Math.floor((b.v-600)/4)]:null;}
function britishView040(b){const q=britishRow040(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave040(){
  if(!britishRowsValid040())throw Error('wave040 exact frozen ten rows');
  if(!britishCanonical040){
    const entries=window.BritishWaveArchitecture040.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave040 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH040[(row.v-600)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave040 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH040.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave040 complete forty-view cache');
    britishCanonical040=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical040).length!==40||BRITISH040.some(q=>[0,1,2,3].some(v=>!britishCanonical040['24_1_'+(q.v+v)])))throw Error('wave040 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical040);
}
const __britishVdraw040=vdraw574;vdraw574=function(o,b){return britishRow040(b)?(window.__noBritishWave040?0:britishView040(b)):__britishVdraw040(o,b);};
const __britishPlace040=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection040&&BRITISH040.find(r=>r.id===britishSelection040);
  if(q&&(window.__noBritishWave040||!britishReady040(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace040(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate040=activateTool434;activateTool434=function(id,recent){britishSelection040=null;return __britishActivate040(id,recent);};
const __britishLoad040=load;load=function(slot){const ok=__britishLoad040(slot);if(ok)britishSelection040=null;return ok;};
const __britishWorld040=newWorld;newWorld=function(seed){britishSelection040=null;return __britishWorld040(seed);};
const __britishToolbar040=buildToolbar;buildToolbar=function(){const out=__britishToolbar040();britishToolbar040();return out;};
function britishToolbar040(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen040'))return;
  const b=document.createElement('button');b.id='waveOpen040';b.textContent='🏛 英式⑫';b.title='英式建築第十二輯：十種不同形制';b.onclick=britishOpen040;cats.appendChild(b);
  if(britishSelection040){const q=BRITISH040.find(r=>r.id===britishSelection040);if(q){const t=document.createElement('span');t.className='waveTag040';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect040(id){
  const q=BRITISH040.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady040(q)||window.__noBritishWave040||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection040=q.id;britishClose040();buildToolbar();return true;
}
function britishClose040(){const d=$('#waveDialog040');if(d?.open)d.close();}
function britishEscape040(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen040(){
  let d=$('#waveDialog040');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog040';d.setAttribute('aria-labelledby','waveTitle040');
    d.innerHTML='<header><div><h2 id="waveTitle040">英式建築 · 第十二輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose040" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro040">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；郵亭、洗衣房與日常服務館舍等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault040">改回普通地標</button><div id="waveGrid040"></div>';
    document.body.appendChild(d);$('#waveClose040').onclick=britishClose040;$('#waveDefault040').onclick=()=>{activateTool434('landmark',true);britishClose040();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose040();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave040;
  $('#waveGrid040').innerHTML=BRITISH040.map(q=>{
    const ready=britishReady040(q),s=ready?britishCanonical040['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape040;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave040 exact original-design provenance required');
    return '<article data-wave040-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable040">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish040">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal040">原創設計</span><button data-wave040="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave040]').forEach(b=>b.onclick=()=>britishSelect040(b.dataset.wave040));
  if(!d.open)d.showModal();
}
function britishSelftest040(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_6[0-3][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave040 count and unique identity',keys.length===40&&britishRowsValid040()&&new Set(BRITISH040.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave040GeometryOnly'),old=window.__wave040GeometryOnly;
  try{
    window.__wave040GeometryOnly=true;
    for(const q of BRITISH040){
      const s=window.BritishWaveArchitecture040.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave040GeometryOnly=old;else delete window.__wave040GeometryOnly;}
  add('wave040 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH040[Math.floor((v-600)/4)],view=(v-600)%4;
    add('wave040 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture040.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave040 opaque physical night',leak===0);add('wave040 hard pixels',semi===0);add('wave040 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH040)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave040 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave040 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave040={rows:()=>BRITISH040.map(q=>({...q})),ready:id=>britishReady040(BRITISH040.find(q=>q.id===id)),open:britishOpen040,close:britishClose040,select:britishSelect040,selection:()=>britishSelection040,selftest:britishSelftest040,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-040 RUNTIME END */
