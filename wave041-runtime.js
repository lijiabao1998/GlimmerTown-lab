/* GPT-041 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH041=window.BritishWaveArchitecture041.rows;
let britishCanonical041=null,britishSelection041=null;
const britishIDs041=['birchbind','flintchart','rowanclock','sedgephoto','elmglass','bramblewheel','heatherdye','hollyrecords','ashveterinary','celandinewire'];
function britishRowsValid041(){return BRITISH041.length===10&&BRITISH041.every((q,i)=>q.id===britishIDs041[i]&&q.v===640+i*4);}
function britishReady041(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical041?.[key]&&SPR.bld[key]===britishCanonical041[key];});}
function britishRow041(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=640&&b.v<680?BRITISH041[Math.floor((b.v-640)/4)]:null;}
function britishView041(b){const q=britishRow041(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave041(){
  if(!britishRowsValid041())throw Error('wave041 exact frozen ten rows');
  if(!britishCanonical041){
    const entries=window.BritishWaveArchitecture041.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave041 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH041[(row.v-640)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave041 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH041.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave041 complete forty-view cache');
    britishCanonical041=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical041).length!==40||BRITISH041.some(q=>[0,1,2,3].some(v=>!britishCanonical041['24_1_'+(q.v+v)])))throw Error('wave041 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical041);
}
const __britishVdraw041=vdraw574;vdraw574=function(o,b){return britishRow041(b)?(window.__noBritishWave041?0:britishView041(b)):__britishVdraw041(o,b);};
const __britishPlace041=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection041&&BRITISH041.find(r=>r.id===britishSelection041);
  if(q&&(window.__noBritishWave041||!britishReady041(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace041(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate041=activateTool434;activateTool434=function(id,recent){britishSelection041=null;return __britishActivate041(id,recent);};
const __britishLoad041=load;load=function(slot){const ok=__britishLoad041(slot);if(ok)britishSelection041=null;return ok;};
const __britishWorld041=newWorld;newWorld=function(seed){britishSelection041=null;return __britishWorld041(seed);};
const __britishToolbar041=buildToolbar;buildToolbar=function(){const out=__britishToolbar041();britishToolbar041();return out;};
function britishToolbar041(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen041'))return;
  const b=document.createElement('button');b.id='waveOpen041';b.textContent='🏛 英式⑬';b.title='英式建築第十三輯：十種不同形制';b.onclick=britishOpen041;cats.appendChild(b);
  if(britishSelection041){const q=BRITISH041.find(r=>r.id===britishSelection041);if(q){const t=document.createElement('span');t.className='waveTag041';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect041(id){
  const q=BRITISH041.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady041(q)||window.__noBritishWave041||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection041=q.id;britishClose041();buildToolbar();return true;
}
function britishClose041(){const d=$('#waveDialog041');if(d?.open)d.close();}
function britishEscape041(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen041(){
  let d=$('#waveDialog041');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog041';d.setAttribute('aria-labelledby','waveTitle041');
    d.innerHTML='<header><div><h2 id="waveTitle041">英式建築 · 第十三輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose041" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro041">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；裝訂所、測繪所與專門職人館舍等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault041">改回普通地標</button><div id="waveGrid041"></div>';
    document.body.appendChild(d);$('#waveClose041').onclick=britishClose041;$('#waveDefault041').onclick=()=>{activateTool434('landmark',true);britishClose041();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose041();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave041;
  $('#waveGrid041').innerHTML=BRITISH041.map(q=>{
    const ready=britishReady041(q),s=ready?britishCanonical041['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape041;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave041 exact original-design provenance required');
    return '<article data-wave041-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable041">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish041">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal041">原創設計</span><button data-wave041="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave041]').forEach(b=>b.onclick=()=>britishSelect041(b.dataset.wave041));
  if(!d.open)d.showModal();
}
function britishSelftest041(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_6[4-7][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave041 count and unique identity',keys.length===40&&britishRowsValid041()&&new Set(BRITISH041.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave041GeometryOnly'),old=window.__wave041GeometryOnly;
  try{
    window.__wave041GeometryOnly=true;
    for(const q of BRITISH041){
      const s=window.BritishWaveArchitecture041.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave041GeometryOnly=old;else delete window.__wave041GeometryOnly;}
  add('wave041 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH041[Math.floor((v-640)/4)],view=(v-640)%4;
    add('wave041 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture041.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave041 opaque physical night',leak===0);add('wave041 hard pixels',semi===0);add('wave041 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH041)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave041 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave041 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave041={rows:()=>BRITISH041.map(q=>({...q})),ready:id=>britishReady041(BRITISH041.find(q=>q.id===id)),open:britishOpen041,close:britishClose041,select:britishSelect041,selection:()=>britishSelection041,selftest:britishSelftest041,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-041 RUNTIME END */
