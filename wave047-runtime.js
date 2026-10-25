/* GPT-047 RUNTIME START: original British-inspired native appearances; unchanged simulation and carrier. */
const BRITISH047=window.BritishWaveArchitecture047.rows;
let britishCanonical047=null,britishSelection047=null;
const britishIDs047=["spindlefruit","agrimonypattern","hopdrying","tansymill","vervainrecital","campionbarn","woodruffgrain","catmintbridge","periwinklebell","speedwellseasoning"];
function britishRowsValid047(){return BRITISH047.length===10&&BRITISH047.every((q,i)=>q.id===britishIDs047[i]&&q.v===880+i*4);}
function britishReady047(q){return!!q&&[0,1,2,3].every(v=>{const key='24_1_'+(q.v+v);return!!britishCanonical047?.[key]&&SPR.bld[key]===britishCanonical047[key];});}
function britishRow047(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=880&&b.v<920?BRITISH047[Math.floor((b.v-880)/4)]:null;}
function britishView047(b){const q=britishRow047(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installBritishWave047(){
  if(!britishRowsValid047())throw Error('wave047 exact frozen ten rows');
  if(!britishCanonical047){
    const entries=window.BritishWaveArchitecture047.buildAll(),cache={};
    if(entries.length!==40)throw Error('wave047 exactly forty authored views');
    for(const {row,view,sprite:s}of entries){
      const v=row.v+view,key='24_1_'+v;
      if(!Number.isInteger(view)||view<0||view>3||BRITISH047[(row.v-880)/4]!==row||cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('wave047 native identity '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }
    if(Object.keys(cache).length!==40||BRITISH047.some(q=>[0,1,2,3].some(v=>!cache['24_1_'+(q.v+v)])))throw Error('wave047 complete forty-view cache');
    britishCanonical047=cache;
  }
  // Revalidate a warm cache too; completeness must hold after every install.
  if(Object.keys(britishCanonical047).length!==40||BRITISH047.some(q=>[0,1,2,3].some(v=>!britishCanonical047['24_1_'+(q.v+v)])))throw Error('wave047 complete forty-view cache');
  Object.assign(SPR.bld,britishCanonical047);
}
const __britishVdraw047=vdraw574;vdraw574=function(o,b){return britishRow047(b)?(window.__noBritishWave047?0:britishView047(b)):__britishVdraw047(o,b);};
const __britishPlace047=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&britishSelection047&&BRITISH047.find(r=>r.id===britishSelection047);
  if(q&&(window.__noBritishWave047||!britishReady047(q))){if(!silent)toast('此外觀目前無法新增','bad');return false;}
  const ok=__britishPlace047(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __britishActivate047=activateTool434;activateTool434=function(id,recent){britishSelection047=null;return __britishActivate047(id,recent);};
const __britishLoad047=load;load=function(slot){const ok=__britishLoad047(slot);if(ok)britishSelection047=null;return ok;};
const __britishWorld047=newWorld;newWorld=function(seed){britishSelection047=null;return __britishWorld047(seed);};
const __britishToolbar047=buildToolbar;buildToolbar=function(){const out=__britishToolbar047();britishToolbar047();return out;};
function britishToolbar047(){
  const cats=$('#toolcats');if(!cats||$('#waveOpen047'))return;
  const b=document.createElement('button');b.id='waveOpen047';b.textContent='🏛 英式⑲';b.title='英式建築第十九輯：十種不同形制';b.onclick=britishOpen047;cats.appendChild(b);
  if(britishSelection047){const q=BRITISH047.find(r=>r.id===britishSelection047);if(q){const t=document.createElement('span');t.className='waveTag047';t.textContent=q.nm;cats.appendChild(t);}}
}
function britishSelect047(id){
  const q=BRITISH047.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||!britishReady047(q)||window.__noBritishWave047||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;
  britishSelection047=q.id;britishClose047();buildToolbar();return true;
}
function britishClose047(){const d=$('#waveDialog047');if(d?.open)d.close();}
function britishEscape047(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function britishOpen047(){
  let d=$('#waveDialog047');
  if(!d){
    d=document.createElement('dialog');d.id='waveDialog047';d.setAttribute('aria-labelledby','waveTitle047');
    d.innerHTML='<header><div><h2 id="waveTitle047">英式建築 · 第十九輯</h2><p>十款原創英式建築，各有不同量體、窗型與屋頂。</p></div><button id="waveClose047" aria-label="關閉英式建築目錄">✕</button></header><p class="waveIntro047">本輯是原創英式外觀，不對應具名真實建築。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；村鎮公共建築等名稱描述外觀。夜燈呈現展示照明。</p><button id="waveDefault047">改回普通地標</button><div id="waveGrid047"></div>';
    document.body.appendChild(d);$('#waveClose047').onclick=britishClose047;$('#waveDefault047').onclick=()=>{activateTool434('landmark',true);britishClose047();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)britishClose047();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noBritishWave047;
  $('#waveGrid047').innerHTML=BRITISH047.map(q=>{
    const ready=britishReady047(q),s=ready?britishCanonical047['24_1_'+q.v]:null,disabled=locked||!ready,escape=britishEscape047;
    if(q.evidenceStatus!=='original-code-native-design'||q.url)throw Error('wave047 exact original-design provenance required');
    return '<article data-wave047-ready="'+(ready?'1':'0')+'">'+(s?'<img width="160" height="196" src="'+s.img.toDataURL()+'" alt="'+escape(q.nm)+' 像素建築">':'<p class="waveUnavailable047">此外觀尚未提供。</p>')+'<h3>'+escape(q.nm)+'</h3><div class="waveEnglish047">'+escape(q.en)+'</div><p>'+escape(ready?q.note:'目前無法選擇此外觀。')+'</p><footer><span class="waveOriginal047">原創設計</span><button data-wave047="'+escape(q.id)+'"'+(disabled?' disabled':'')+'>'+(!ready?'暫未提供':locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';
  }).join('');
  d.querySelectorAll('[data-wave047]').forEach(b=>b.onclick=()=>britishSelect047(b.dataset.wave047));
  if(!d.open)d.showModal();
}
function britishSelftest047(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),keys=Object.keys(SPR.bld).filter(k=>/^24_1_(?:(?:8[89]|9[01])[0-9])$/.test(k));
  const result=()=>({ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗'))});
  add('wave047 count and unique identity',keys.length===40&&britishRowsValid047()&&new Set(BRITISH047.map(q=>q.id)).size===10);
  if(!checks[0][1])return result();
  let semi=0,leak=0,crop=0,empty=0,mismatch=0;
  const masks=[],had=Object.hasOwn(window,'__wave047GeometryOnly'),old=window.__wave047GeometryOnly;
  try{
    window.__wave047GeometryOnly=true;
    for(const q of BRITISH047){
      const s=window.BritishWaveArchitecture047.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;
      let mask='';for(let i=3;i<a.length;i+=4)mask+=a[i]?'1':'0';masks.push(mask);
    }
  }finally{if(had)window.__wave047GeometryOnly=old;else delete window.__wave047GeometryOnly;}
  add('wave047 ten distinct structural silhouettes without shared paving',new Set(masks).size===10);
  for(const key of keys){
    const s=SPR.bld[key],v=+key.split('_')[2],q=BRITISH047[Math.floor((v-880)/4)],view=(v-880)%4;
    add('wave047 native geometry '+key,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===view);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0;
    for(let i=3;i<a.length;i+=4){
      const p=(i-3)/4,x=p%s.w,y=Math.floor(p/s.w);
      if(a[i]){day++;if(a[i]!==255)semi++;if(!x||!y||x===s.w-1||y===s.h-1)crop++;}
      if(n[i]){night++;if(n[i]!==255||a[i]!==255)leak++;}
    }
    if(!day||!night)empty++;
    const direct=window.BritishWaveArchitecture047.build(q.id,view);
    if(s.img.toDataURL()!==direct.img.toDataURL()||s.night.toDataURL()!==direct.night.toDataURL())mismatch++;
  }
  add('wave047 opaque physical night',leak===0);add('wave047 hard pixels',semi===0);add('wave047 uncropped nonempty day and night',crop===0&&empty===0);
  for(const q of BRITISH047)for(let rot=0;rot<4;rot++){const old=viewRot;viewRot=rot;try{add('wave047 actual rotation '+q.id+'/'+rot,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+rot);}finally{viewRot=old;}}
  add('wave047 installed pixels equal independent direct geometry',mismatch===0);
  return{...result(),pixels:{semi,leak,crop,empty,mismatch}};
}
window.GV.britishWave047={rows:()=>BRITISH047.map(q=>({...q})),ready:id=>britishReady047(BRITISH047.find(q=>q.id===id)),open:britishOpen047,close:britishClose047,select:britishSelect047,selection:()=>britishSelection047,selftest:britishSelftest047,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},
  sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-047 RUNTIME END */
