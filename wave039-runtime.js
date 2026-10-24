/* GPT-039 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH039=window.BritishWaveArchitecture039.rows;
let britishCanonical039=null,britishSelection039=null;
const britishIDs039=['brackenread','ferncourt','rookhall','cobblefold','mossgate','orchardcraft','pennyfen','willowmusic','hawthornloom','briarwatch'];
function britishRowsValid039(){return BRITISH039.length===10&&BRITISH039.every((q,i)=>q.id===britishIDs039[i]&&q.v===560+i*4);}
function britishReady039(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical039?.[key]&&SPR.bld[key]===britishCanonical039[key];});}
function britishRow039(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=560&&b.v<600?BRITISH039[Math.floor((b.v-560)/4)]:null;}
function britishView039(b){const q=britishRow039(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave039(){
  if(!britishRowsValid039())throw Error('wave039 exact frozen ten rows');
  if(!britishCanonical039){
    const entries=window.BritishWaveArchitecture039.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave039 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH039[(row.v-560)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave039 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH039.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave039 complete forty-view cache');
    britishCanonical039=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical039).length!==40||BRITISH039.some(q=>[0,1,2,3].some(v=>!britishCanonical039['24_1_'+(q.v+v)])))throw Error('wave039 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical039);
}
const __britishVdraw039=vdraw574;vdraw574=function(o,b){return britishRow039(b)?(window.__noBritishWave039?0:britishView039(b)):__britishVdraw039(o,b);};
const __britishPlace039=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection039&&BRITISH039.find(r=>r.id===britishSelection039);
  if(q&&(window.__noBritishWave039||!britishReady039(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace039(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate039=activateTool434;activateTool434=function(id,recent){britishSelection039=null;return __britishActivate039(id,recent);};
const __britishLoad039=load;load=function(slot){const ok=__britishLoad039(slot);if(ok)britishSelection039=null;return ok;};
const __britishWorld039=newWorld;newWorld=function(seed){britishSelection039=null;return __britishWorld039(seed);};
const __britishToolbar039=buildToolbar;buildToolbar=function(){const out=__britishToolbar039();britishToolbar039();return out;};
function britishToolbar039(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen039'))return;
  const b=document.createElement('button');b.id='waveOpen039';b.textContent='🏛 英式⑪';b.title='英式建築第十一輯：十種不同形制';b.onclick=britishOpen039;cats.appendChild(b);
  if(britishSelection039){const q=BRITISH039.find(r=>r.id===britishSelection039);if(q){const t=document.createElement('span');t.className='waveTag039';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect039(id){
  const q=BRITISH039.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady039(q)||window.__noBritishWave039||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection039=q.id;britishClose039();buildToolbar();return true;
}
function britishClose039(){const d=$('#waveDialog039');if(d?.open)d.close();}
function britishEscape039(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen039(){
  let d=$('#waveDialog039');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog039';d.setAttribute('aria-labelledby','waveTitle039');
    d.innerHTML='<header><div><h2 id="waveTitle039">英式建築 · 第十一輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose039" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro039">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；閱覽屋、工藝館與展亭等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault039">改回普通地標</button><div id="waveGrid039"></div>';
    document.body.appendChild(d);$('#waveClose039').onclick=britishClose039;$('#waveDefault039').onclick=()=>{activateTool434('landmark',true);britishClose039();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose039();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave039;
  $('#waveGrid039').innerHTML=BRITISH039.map(q=>{
    const ready=britishReady039(q),s=ready?britishCanonical039['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape039;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave039 exact original-design provenance required');
    return '<article data-wave039-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable039">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish039">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal039">原創設計</span><button data-wave039="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave039]').forEach(b=>b.onclick=()=>britishSelect039(b.dataset.wave039));
  if(!d.open)d.showModal();
}
function britishSelftest039(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_5[6-9][0-9]$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave039 count and unique identity',keys.length===40&&britishRowsValid039()&&new Set(BRITISH039.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave039GeometryOnly'),old=window.__wave039GeometryOnly;
  try{
    window.__wave039GeometryOnly=true;
    for(const q of BRITISH039){
      const s=window.BritishWaveArchitecture039.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave039GeometryOnly=old;else delete window.__wave039GeometryOnly;}
  add('wave039 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH039[Math.floor((v-560)/4)],view=(v-560)%4;
    add('wave039 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture039.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave039 opaque physical night',leak===0);add('wave039 hard pixels',semi===0);add('wave039 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH039)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave039 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave039 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave039={rows:()=>BRITISH039.map(q=>({...q})),ready:id=>britishReady039(BRITISH039.find(q=>q.id===id)),open:britishOpen039,close:britishClose039,select:britishSelect039,selection:()=>britishSelection039,selftest:britishSelftest039,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-039 RUNTIME END */
