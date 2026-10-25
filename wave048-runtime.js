/* GPT-048 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH048=window.BritishWaveArchitecture048.rows;
let britishCanonical048=null,britishSelection048=null;
const britishIDs048=["foxglovecharter","silverweedalpine","maddartutors","restharrowsalt","betonymarionette","burnetterrace","figwortcolour","damewortcruck","pimpernelcross","fumitorygin"];
function britishRowsValid048(){return BRITISH048.length===10&&BRITISH048.every((q,i)=>q.id===britishIDs048[i]&&q.v===920+i*4);}
function britishReady048(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical048?.[key]&&SPR.bld[key]===britishCanonical048[key];});}
function britishRow048(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=920&&b.v<960?BRITISH048[Math.floor((b.v-920)/4)]:null;}
function britishView048(b){const q=britishRow048(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave048(){
  if(!britishRowsValid048())throw Error('wave048 exact frozen ten rows');
  if(!britishCanonical048){
    const entries=window.BritishWaveArchitecture048.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave048 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH048[(row.v-920)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave048 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH048.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave048 complete forty-view cache');
    britishCanonical048=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical048).length!==40||BRITISH048.some(q=>[0,1,2,3].some(v=>!britishCanonical048['24_1_'+(q.v+v)])))throw Error('wave048 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical048);
}
const __britishVdraw048=vdraw574;vdraw574=function(o,b){return britishRow048(b)?(window.__noBritishWave048?0:britishView048(b)):__britishVdraw048(o,b);};
const __britishPlace048=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection048&&BRITISH048.find(r=>r.id===britishSelection048);
  if(q&&(window.__noBritishWave048||!britishReady048(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace048(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate048=activateTool434;activateTool434=function(id,recent){britishSelection048=null;return __britishActivate048(id,recent);};
const __britishLoad048=load;load=function(slot){const ok=__britishLoad048(slot);if(ok)britishSelection048=null;return ok;};
const __britishWorld048=newWorld;newWorld=function(seed){britishSelection048=null;return __britishWorld048(seed);};
const __britishToolbar048=buildToolbar;buildToolbar=function(){const out=__britishToolbar048();britishToolbar048();return out;};
function britishToolbar048(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen048'))return;
  const b=document.createElement('button');b.id='waveOpen048';b.textContent='🏛 英式⑳';b.title='英式建築第二十輯：十種不同形制';b.onclick=britishOpen048;cats.appendChild(b);
  if(britishSelection048){const q=BRITISH048.find(r=>r.id===britishSelection048);if(q){const t=document.createElement('span');t.className='waveTag048';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect048(id){
  const q=BRITISH048.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady048(q)||window.__noBritishWave048||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection048=q.id;britishClose048();buildToolbar();return true;
}
function britishClose048(){const d=$('#waveDialog048');if(d?.open)d.close();}
function britishEscape048(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen048(){
  let d=$('#waveDialog048');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog048';d.setAttribute('aria-labelledby','waveTitle048');
    d.innerHTML='<header><div><h2 id="waveTitle048">英式建築 · 第二十輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose048" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro048">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；村鎮公共建築等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault048">改回普通地標</button><div id="waveGrid048"></div>';
    document.body.appendChild(d);$('#waveClose048').onclick=britishClose048;$('#waveDefault048').onclick=()=>{activateTool434('landmark',true);britishClose048();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose048();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave048;
  $('#waveGrid048').innerHTML=BRITISH048.map(q=>{
    const ready=britishReady048(q),s=ready?britishCanonical048['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape048;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave048 exact original-design provenance required');
    return '<article data-wave048-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable048">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish048">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal048">原創設計</span><button data-wave048="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave048]').forEach(b=>b.onclick=()=>britishSelect048(b.dataset.wave048));
  if(!d.open)d.showModal();
}
function britishSelftest048(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:9[2-5][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave048 count and unique identity',keys.length===40&&britishRowsValid048()&&new Set(BRITISH048.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave048GeometryOnly'),old=window.__wave048GeometryOnly;
  try{
    window.__wave048GeometryOnly=true;
    for(const q of BRITISH048){
      const s=window.BritishWaveArchitecture048.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave048GeometryOnly=old;else delete window.__wave048GeometryOnly;}
  add('wave048 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH048[Math.floor((v-920)/4)],view=(v-920)%4;
    add('wave048 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture048.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave048 opaque physical night',leak===0);add('wave048 hard pixels',semi===0);add('wave048 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH048)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave048 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave048 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave048={rows:()=>BRITISH048.map(q=>({...q})),ready:id=>britishReady048(BRITISH048.find(q=>q.id===id)),open:britishOpen048,close:britishClose048,select:britishSelect048,selection:()=>britishSelection048,selftest:britishSelftest048,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-048 RUNTIME END */
