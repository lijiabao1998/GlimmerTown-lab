/* GPT-024 RUNTIME START: only new native k24 visual variants and selection UI. */
const HERITAGE024=window.BritishHeritageArchitecture024.rows;
let heritageCanonical024=null,heritageSelection024=null;
function heritageRow024(b){return b&&b.k===24&&Number.isInteger(b.v)&&b.v>=100&&b.v<160?HERITAGE024[Math.floor((b.v-100)/4)]:null;}
function heritageView024(b){const q=heritageRow024(b);return q?q.v+((b.v-q.v+viewRotEff())&3):null;}
function installHeritage024(){
  if(!heritageCanonical024){
    const entries=window.BritishHeritageArchitecture024.buildAll(),cache={};
    if(entries.length!==60)throw Error('heritage024 count: exactly sixty authored views');
    for(const {row,view,sprite:s} of entries){const v=row.v+view,key='24_1_'+v;if(cache[key]||SPR.bld[key]||!s?.img||!s?.night||s.w!==160||s.h!==196||s.ax!==80||s.ay!==194||s.sz!==2||s.view!==view)throw Error('heritage024 identity: '+key);
      cache[key]={...s,__t479:1,__t547:{k:24,lv:1,v,bw:2,bh:2}};
    }heritageCanonical024=cache;
  }
  Object.assign(SPR.bld,heritageCanonical024);
}
const __heritageVdraw024=vdraw574;vdraw574=function(o,b){const q=heritageRow024(b);return q?(window.__noHeritage024?0:heritageView024(b)):__heritageVdraw024(o,b);};
const __heritagePlace024=doPlace;doPlace=function(id,x,y,silent){
  const q=id==='landmark'&&heritageSelection024&&HERITAGE024.find(r=>r.id===heritageSelection024);
  if(q&&window.__noHeritage024){if(!silent)toast('歷史地標外觀暫停新增','bad');return false;}
  const ok=__heritagePlace024(id,x,y,silent);
  if(ok&&q){const b=T(idx(x,y))?.bld;if(b&&!b.ref&&b.k===24)b.v=q.v;}
  return ok;
};
const __heritageActivate024=activateTool434;activateTool434=function(id,recent){heritageSelection024=null;return __heritageActivate024(id,recent);};
const __heritageLoad024=load;load=function(slot){const ok=__heritageLoad024(slot);if(ok)heritageSelection024=null;return ok;};
const __heritageWorld024=newWorld;newWorld=function(seed){heritageSelection024=null;return __heritageWorld024(seed);};
const __heritageToolbar024=buildToolbar;buildToolbar=function(){const out=__heritageToolbar024();heritageToolbar024();return out;};
function heritageToolbar024(){
  const cats=$('#toolcats');if(!cats||$('#heritageOpen024'))return;
  const b=document.createElement('button');b.id='heritageOpen024';b.textContent='🏛 歷史15';b.title='15座不重複的英式歷史地標';b.onclick=heritageOpen024;cats.appendChild(b);
  if(heritageSelection024){const q=HERITAGE024.find(q=>q.id===heritageSelection024);if(q){const tag=document.createElement('span');tag.className='heritageTag024';tag.textContent=q.nm;cats.appendChild(tag);}}
}
function heritageSelect024(id){
  const q=HERITAGE024.find(r=>r.id===id),meta=toolMeta434('landmark');
  if(!q||window.__noHeritage024||!meta||!toolUnlocked458(meta))return false;
  if(!activateTool434('landmark',true))return false;heritageSelection024=q.id;heritageClose024();buildToolbar();toast('已選 '+q.nm+' · 原生2×2地標','gold');return true;
}
function heritageClose024(){const d=$('#heritageDialog024');if(d?.open)d.close();}
function heritageOpen024(){
  let d=$('#heritageDialog024');if(!d){d=document.createElement('dialog');d.id='heritageDialog024';d.setAttribute('aria-labelledby','heritageTitle024');
    d.innerHTML='<header><div><h2 id="heritageTitle024">英式歷史建築 · 15座</h2><p>Britain：不同年代、不同形制。</p></div><button id="heritageClose024" aria-label="關閉歷史建築目錄">✕</button></header><p class="heritageIntro024">原創像素幾何轉譯，非精密複製。全部沿用原生2×2地標的造價、解鎖、觀光、就業與維護；信號樓／亞麻廠／礦場僅為歷史展示，不新增調度或生產。夜燈呈現現代展示照明。</p><button id="heritageDefault024">改回普通地標</button><div id="heritageGrid024"></div>';
    document.body.appendChild(d);$('#heritageClose024').onclick=heritageClose024;$('#heritageDefault024').onclick=()=>{activateTool434('landmark',true);heritageClose024();};
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)heritageClose024();}});
  }
  const meta=toolMeta434('landmark'),locked=!toolUnlocked458(meta)||!!window.__noHeritage024;
  $('#heritageGrid024').innerHTML=HERITAGE024.map(q=>{const s=heritageCanonical024?.['24_1_'+q.v];return '<article><img width="160" height="196" src="'+(s?.img.toDataURL()||'')+'" alt="'+q.nm+' 像素建築"><h3>'+q.nm+'</h3><div class="heritageEnglish024">'+q.en+'</div><p>'+q.note+'</p><footer><a href="'+q.url+'" target="_blank" rel="noopener noreferrer">官方考據 ↗</a><button data-heritage024="'+q.id+'"'+(locked?' disabled':'')+'>'+ (locked?'🔒 Lv.'+meta.unlockRank:'選擇 · 原生地標 $'+COST.landmark)+'</button></footer></article>';}).join('');
  d.querySelectorAll('[data-heritage024]').forEach(b=>b.onclick=()=>heritageSelect024(b.dataset.heritage024));if(!d.open)d.showModal();
}
function heritageSelftest024(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]);
  const keys=Object.keys(SPR.bld).filter(k=>/^24_1_1[0-5][0-9]$/.test(k));add('heritage024 count / identity: 15 forms, 60 new native sprites',HERITAGE024.length===15&&keys.length===60&&new Set(HERITAGE024.map(q=>q.id)).size===15);
  if(!checks[0][1])return{ok:false,checks:checks.map(q=>q[0]+' ✗')};
  let soft=0,leak=0,crop=0,empty=0;const shapes=[];
  const had=Object.hasOwn(window,'__heritage024GeometryOnly'),old=window.__heritage024GeometryOnly;
  try{window.__heritage024GeometryOnly=true;for(const q of HERITAGE024){const s=window.BritishHeritageArchitecture024.build(q.id,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data;let h=2166136261;for(let i=3;i<a.length;i+=4)h=Math.imul(h^(a[i]?1:0),16777619);shapes.push(h>>>0);}}finally{if(had)window.__heritage024GeometryOnly=old;else delete window.__heritage024GeometryOnly;}
  add('heritage024 distinct structural silhouettes: no recolour duplicates',new Set(shapes).size===15);
  for(const k of keys){const s=SPR.bld[k];add('heritage024 native geometry '+k,s.w===160&&s.h===196&&s.ax===80&&s.ay===194&&s.sz===2&&s.view===(+k.split('_')[2]-100)%4);
    const a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let op=0,np=0;
    for(let i=3;i<a.length;i+=4){if(a[i]){op++;if(a[i]!==255)soft++;const p=(i-3)/4,x=p%s.w,y=(p/s.w)|0;if(x===0||y===0||x===s.w-1||y===s.h-1)crop++;}if(n[i]){np++;if(n[i]!==255||a[i]!==255)leak++;}}
    if(!op||!np)empty++;
  }
  add('heritage024 physical night: no transparent or soft emission',leak===0);add('heritage024 hard pixels: no semitransparency',soft===0);add('heritage024 canvas: no crop or empty day/night',crop===0&&empty===0);
  for(let v=112;v<116;v++){const s=SPR.bld['24_1_'+v],n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let upper=0;for(let y=0;y<168;y++)for(let x=0;x<s.w;x++)if(n[(y*s.w+x)*4+3])upper++;add('heritage024 Rushton actual visible upper glazing '+v,upper>=50);}
  for(const q of HERITAGE024)for(let r=0;r<4;r++){const before=viewRot;viewRot=r;try{add('heritage024 actual rotation '+q.id+'/'+r,vdraw574({x:10,y:10},{k:24,lv:1,v:q.v})===q.v+r);}finally{viewRot=before;}}
  let nativeMismatch=0;for(const q of HERITAGE024)for(let v=0;v<4;v++){const actual=SPR.bld['24_1_'+(q.v+v)],direct=window.BritishHeritageArchitecture024.build(q.id,v);if(actual.img.toDataURL()!==direct.img.toDataURL()||actual.night.toDataURL()!==direct.night.toDataURL())nativeMismatch++;}
  add('heritage024 installed pixels match independent direct geometry: '+nativeMismatch+' mismatches',nativeMismatch===0);
  return{ok:checks.every(q=>q[1]),checks:checks.map(q=>q[0]+(q[1]?' ✓':' ✗')),pixels:{soft,leak,crop,empty},shapeHashes:shapes};
}
window.GV.heritage024={rows:()=>HERITAGE024.map(q=>({...q})),open:heritageOpen024,close:heritageClose024,select:heritageSelect024,selection:()=>heritageSelection024,selftest:heritageSelftest024,
  read:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b?JSON.parse(JSON.stringify(b)):null;},sprite:(x,y)=>{const b=inMap(x,y)?tiles[idx(x,y)]?.bld:null;return b&&!b.ref?SPR.bld['24_1_'+vdraw574({x,y},b)]:null;}};
/* GPT-024 RUNTIME END */
