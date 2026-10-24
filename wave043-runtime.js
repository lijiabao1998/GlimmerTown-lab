/* GPT-043 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH043=window.BritishWaveArchitecture043.rows;
let britishCanonical043=null,britishSelection043=null;
const britishIDs043=['reedcider','pondbadminton','holtscout','fennelhoney','ashfives','brassbell','teaselhat','withebasket','gorsearchery','rillramblers'];
function britishRowsValid043(){return BRITISH043.length===10&&BRITISH043.every((q,i)=>q.id===britishIDs043[i]&&q.v===720+i*4);}
function britishReady043(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical043?.[key]&&SPR.bld[key]===britishCanonical043[key];});}
function britishRow043(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=720&&b.v<760?BRITISH043[Math.floor((b.v-720)/4)]:null;}
function britishView043(b){const q=britishRow043(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave043(){
  if(!britishRowsValid043())throw Error('wave043 exact frozen ten rows');
  if(!britishCanonical043){
    const entries=window.BritishWaveArchitecture043.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave043 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH043[(row.v-720)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave043 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH043.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave043 complete forty-view cache');
    britishCanonical043=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical043).length!==40||BRITISH043.some(q=>[0,1,2,3].some(v=>!britishCanonical043['24_1_'+(q.v+v)])))throw Error('wave043 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical043);
}
const __britishVdraw043=vdraw574;vdraw574=function(o,b){return britishRow043(b)?(window.__noBritishWave043?0:britishView043(b)):__britishVdraw043(o,b);};
const __britishPlace043=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection043&&BRITISH043.find(r=>r.id===britishSelection043);
  if(q&&(window.__noBritishWave043||!britishReady043(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace043(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate043=activateTool434;activateTool434=function(id,recent){britishSelection043=null;return __britishActivate043(id,recent);};
const __britishLoad043=load;load=function(slot){const ok=__britishLoad043(slot);if(ok)britishSelection043=null;return ok;};
const __britishWorld043=newWorld;newWorld=function(seed){britishSelection043=null;return __britishWorld043(seed);};
const __britishToolbar043=buildToolbar;buildToolbar=function(){const out=__britishToolbar043();britishToolbar043();return out;};
function britishToolbar043(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen043'))return;
  const b=document.createElement('button');b.id='waveOpen043';b.textContent='🏛 英式⑮';b.title='英式建築第十五輯：十種不同形制';b.onclick=britishOpen043;cats.appendChild(b);
  if(britishSelection043){const q=BRITISH043.find(r=>r.id===britishSelection043);if(q){const t=document.createElement('span');t.className='waveTag043';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect043(id){
  const q=BRITISH043.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady043(q)||window.__noBritishWave043||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection043=q.id;britishClose043();buildToolbar();return true;
}
function britishClose043(){const d=$('#waveDialog043');if(d?.open)d.close();}
function britishEscape043(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen043(){
  let d=$('#waveDialog043');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog043';d.setAttribute('aria-labelledby','waveTitle043');
    d.innerHTML='<header><div><h2 id="waveTitle043">英式建築 · 第十五輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose043" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro043">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；工藝屋、會舍與專門工房等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault043">改回普通地標</button><div id="waveGrid043"></div>';
    document.body.appendChild(d);$('#waveClose043').onclick=britishClose043;$('#waveDefault043').onclick=()=>{activateTool434('landmark',true);britishClose043();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose043();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave043;
  $('#waveGrid043').innerHTML=BRITISH043.map(q=>{
    const ready=britishReady043(q),s=ready?britishCanonical043['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape043;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave043 exact original-design provenance required');
    return '<article data-wave043-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable043">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish043">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal043">原創設計</span><button data-wave043="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave043]').forEach(b=>b.onclick=()=>britishSelect043(b.dataset.wave043));
  if(!d.open)d.showModal();
}
function britishSelftest043(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:7[2-5][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave043 count and unique identity',keys.length===40&&britishRowsValid043()&&new Set(BRITISH043.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave043GeometryOnly'),old=window.__wave043GeometryOnly;
  try{
    window.__wave043GeometryOnly=true;
    for(const q of BRITISH043){
      const s=window.BritishWaveArchitecture043.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave043GeometryOnly=old;else delete window.__wave043GeometryOnly;}
  add('wave043 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH043[Math.floor((v-720)/4)],view=(v-720)%4;
    add('wave043 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture043.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave043 opaque physical night',leak===0);add('wave043 hard pixels',semi===0);add('wave043 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH043)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave043 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave043 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave043={rows:()=>BRITISH043.map(q=>({...q})),ready:id=>britishReady043(BRITISH043.find(q=>q.id===id)),open:britishOpen043,close:britishClose043,select:britishSelect043,selection:()=>britishSelection043,selftest:britishSelftest043,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-043 RUNTIME END */
