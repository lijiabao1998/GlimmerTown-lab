/* GPT-046 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH046=window.BritishWaveArchitecture046.rows;
let britishCanonical046=null,britishSelection046=null;
const britishIDs046=["merememorial","guelderlace","gorsepicture","comfreyambulance","marjoramkitchen","boragedental","hyssopupholstery","dittanygeology","chamomilestory","myrtlewireless"];
function britishRowsValid046(){return BRITISH046.length===10&&BRITISH046.every((q,i)=>q.id===britishIDs046[i]&&q.v===840+i*4);}
function britishReady046(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical046?.[key]&&SPR.bld[key]===britishCanonical046[key];});}
function britishRow046(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=840&&b.v<880?BRITISH046[Math.floor((b.v-840)/4)]:null;}
function britishView046(b){const q=britishRow046(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave046(){
  if(!britishRowsValid046())throw Error('wave046 exact frozen ten rows');
  if(!britishCanonical046){
    const entries=window.BritishWaveArchitecture046.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave046 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH046[(row.v-840)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave046 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH046.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave046 complete forty-view cache');
    britishCanonical046=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical046).length!==40||BRITISH046.some(q=>[0,1,2,3].some(v=>!britishCanonical046['24_1_'+(q.v+v)])))throw Error('wave046 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical046);
}
const __britishVdraw046=vdraw574;vdraw574=function(o,b){return britishRow046(b)?(window.__noBritishWave046?0:britishView046(b)):__britishVdraw046(o,b);};
const __britishPlace046=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection046&&BRITISH046.find(r=>r.id===britishSelection046);
  if(q&&(window.__noBritishWave046||!britishReady046(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace046(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate046=activateTool434;activateTool434=function(id,recent){britishSelection046=null;return __britishActivate046(id,recent);};
const __britishLoad046=load;load=function(slot){const ok=__britishLoad046(slot);if(ok)britishSelection046=null;return ok;};
const __britishWorld046=newWorld;newWorld=function(seed){britishSelection046=null;return __britishWorld046(seed);};
const __britishToolbar046=buildToolbar;buildToolbar=function(){const out=__britishToolbar046();britishToolbar046();return out;};
function britishToolbar046(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen046'))return;
  const b=document.createElement('button');b.id='waveOpen046';b.textContent='🏛 英式⑱';b.title='英式建築第十八輯：十種不同形制';b.onclick=britishOpen046;cats.appendChild(b);
  if(britishSelection046){const q=BRITISH046.find(r=>r.id===britishSelection046);if(q){const t=document.createElement('span');t.className='waveTag046';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect046(id){
  const q=BRITISH046.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady046(q)||window.__noBritishWave046||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection046=q.id;britishClose046();buildToolbar();return true;
}
function britishClose046(){const d=$('#waveDialog046');if(d?.open)d.close();}
function britishEscape046(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen046(){
  let d=$('#waveDialog046');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog046';d.setAttribute('aria-labelledby','waveTitle046');
    d.innerHTML='<header><div><h2 id="waveTitle046">英式建築 · 第十八輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose046" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro046">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；村鎮公共建築等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault046">改回普通地標</button><div id="waveGrid046"></div>';
    document.body.appendChild(d);$('#waveClose046').onclick=britishClose046;$('#waveDefault046').onclick=()=>{activateTool434('landmark',true);britishClose046();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose046();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave046;
  $('#waveGrid046').innerHTML=BRITISH046.map(q=>{
    const ready=britishReady046(q),s=ready?britishCanonical046['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape046;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave046 exact original-design provenance required');
    return '<article data-wave046-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable046">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish046">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal046">原創設計</span><button data-wave046="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave046]').forEach(b=>b.onclick=()=>britishSelect046(b.dataset.wave046));
  if(!d.open)d.showModal();
}
function britishSelftest046(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:8[4-7][0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave046 count and unique identity',keys.length===40&&britishRowsValid046()&&new Set(BRITISH046.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave046GeometryOnly'),old=window.__wave046GeometryOnly;
  try{
    window.__wave046GeometryOnly=true;
    for(const q of BRITISH046){
      const s=window.BritishWaveArchitecture046.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave046GeometryOnly=old;else delete window.__wave046GeometryOnly;}
  add('wave046 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH046[Math.floor((v-840)/4)],view=(v-840)%4;
    add('wave046 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture046.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave046 opaque physical night',leak===0);add('wave046 hard pixels',semi===0);add('wave046 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH046)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave046 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave046 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave046={rows:()=>BRITISH046.map(q=>({...q})),ready:id=>britishReady046(BRITISH046.find(q=>q.id===id)),open:britishOpen046,close:britishClose046,select:britishSelect046,selection:()=>britishSelection046,selftest:britishSelftest046,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-046 RUNTIME END */
